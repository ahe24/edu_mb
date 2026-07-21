# cov_merge — 회귀 커버리지 병합

한 테스트로 100% 를 만들려 하지 말고, **여러 테스트가 각자 다른 부분을 덮게** 한 뒤
그 결과를 하나로 합친다. 회귀 전체의 커버리지 증거는 개별 UCDB 가 아니라 **병합본 하나**.

## 시나리오 분담 (실측)

| +TEST | 덮는 부분 | 단독 커버리지 |
|-------|-----------|----------------|
| `trip` | WARN→TRIP_S→LATCH 트립 경로 + LATCH `clear` | 72.06% |
| `recover` | WARN→MONITOR 일시 초과 회복 천이 | 46.30% |
| `idle` | `en=0` 분기, sensor 조합(condition/expression) — WARN_LIMIT 미도달, TRIP_S 는 못 봄 | 63.80% |
| **병합** | 위 3개의 합집합 | **95.79%** |

개별 실행은 어느 것도 병합본에 못 미친다 → `vcover merge` 로 합쳐야 비로소 완성된다.
(남은 4.21%는 실습2/4와 동일하게 `trip_fsm.v:71` `default:` 1건 — 원천 도달불가.)

## 병합 흐름

```
vsim -coverage ... +TEST=trip    -do "coverage save -onexit -testname trip    trip.ucdb;    run -all; quit -f"
vsim -coverage ... +TEST=recover -do "coverage save -onexit -testname recover recover.ucdb; run -all; quit -f"
vsim -coverage ... +TEST=idle    -do "coverage save -onexit -testname idle    idle.ucdb;    run -all; quit -f"
vcover merge -out merged.ucdb trip.ucdb recover.ucdb idle.ucdb
vcover report -html merged.ucdb
```

- `-testname` 으로 각 테스트에 고유 이름 부여 → 병합 시 어느 테스트가 무엇을 덮었는지 추적.
- 대규모 회귀는 `vsim -coverstore <dir>` 자동 저장 후 디렉터리째 병합하는 방식도 있음.

## 실행

```bash
cd sim
make            # comp → 3 run → merge
make report     # 개별(trip) < 병합본 확인
make html       # 병합본 HTML 리포트
make clean
```
