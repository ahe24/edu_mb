# cov_hole — 커버리지 홀 분석 · 자극 보강 · 재측정

실습1의 낮은 커버리지를 출발점으로, **리포트의 홀에서 누락된 시나리오를 역추적**하고
그 자극을 TB 에 추가해 커버리지를 끌어올린다. 구현 대상은 `boost_scenario` 태스크.

## 홀 → 자극 역추적

| 리포트가 가리키는 홀 | 소재 | 누락된 시나리오 | 추가 자극 |
|----------------------|------|-----------------|-----------|
| `en` 분기 false 미도달 | `trip_fsm` | 채널 disable 안 해봄 | `en=0` 구간 삽입 |
| WARN→MONITOR 천이 0 | `trip_fsm` | 일시 초과 회복 안 해봄 | vote 인가 후 즉시 제거 |
| `vote` expression 곱항 0% | `vote2oo3` | `sensor=111` 만 인가 | sensor 8조합 전수 |
| LATCH `if(clear)` false만 | `trip_fsm` | clear 인가 안 해봄 | LATCH 도달 후 `clear` 펄스 |
| TRIP_S→MONITOR 천이 0 | `trip_fsm` | 트립 도중 리셋 안 해봄 | TRIP_S 진입 순간 `rst` 펄스 |

핵심 : **커버리지 홀은 "안 해본 자극"의 목록**이다. 홀을 읽으면 무엇을 더 시험해야
하는지 알 수 있다 — 이것이 커버리지의 관리적 가치(검증 계획 피드백).

## 실행

```bash
cd sim
make            # 보강 TB 로 재측정
make report     # 실습1 대비 branch/condition/FSM 상승 확인
make html
make clean
```

## 남는 것 (실측)

보강 후 **61.70% → 98.57%**. `vote2oo3`·`warn_counter`는 100% 도달, `trip_fsm`은
Branch 14/15(93.33%)·FSM transition 6/6(100%)·Statement 20/21(95.23%)까지 상승한다.
남은 미달 1건은 `trip_fsm.v:71` `default:` — 상태가 2비트 전수(0~3)라 **원천 도달불가**,
어떤 자극으로도 못 메운다. 이 홀은 실습4(cov_closure)에서 **사유와 함께 제외**한다.
