# Day 14 — 코드 커버리지 측정 · 커버리지 클로저

QuestaSim 코드 커버리지를 **측정 → 홀 분석·보강 → 회귀 병합 → 클로저(제외)** 순으로
실습한다. V&V 활동을 관리하는 입장에서 "검증을 언제 끝낼 것인가"를 정량 근거로 판단하는 법.

## 공용 DUT — `trip_top` (2oo3 트립 컨트롤러, top + 서브모듈 3개)

안전-핵심(safety-critical) 계통의 대표 구조: 3중 redundant 센서를 2-out-of-3 다수결로
투표해, 초과가 지속되면 트립을 작동시키고 LATCH 로 굳힌다. `trip_top` 은 배선만 하는
순수 top — 커버리지 계측 대상은 아래 서브모듈 3개다. 자체 완결 설계라 이전 Day 실습을
듣지 않아도 된다.

| 모듈 | 역할 | 커버리지 소재 |
|------|------|----------------|
| `vote2oo3.v` | 2oo3 다수결(조합) | Condition/Expression — `sensor=111` 만 인가하면 0% |
| `warn_counter.v` | WARN 지속 카운터(순차) | Statement/Branch/Condition — `clr` 분기 |
| `trip_fsm.v` | 상태 제어 FSM | Branch/FSM — `en`·회복·`clear` 분기, `default`(UNREACH) |
| `trip_top.v` | 위 3개를 배선 | 없음 — top 자체엔 always/case 가 없다 |

의도적 홀 — `[HOLE]`(약한 자극에서 미도달, 보강 가능) · `[UNREACH]`(원천 도달불가, 제외 대상).
3개 서브모듈 각각 최소 하나씩 미달 유형을 갖도록 설계 — "한 모듈만 보고 끝내면 안 된다"는
점을 체감시킨다.

## 실습 (순서 무관 · 1→2, 3, 4 로 이어짐)

| 실습 | 폴더 | 배우는 것 |
|------|------|-----------|
| 1 | `cov_measure` | 커버리지 수집 흐름 · 리포트 해석 · "PASS ≠ 충분" |
| 2 | `cov_hole` | 홀 → 누락 자극 역추적 · 보강 · 재측정 상승 |
| 3 | `cov_merge` | 테스트별 UCDB → `vcover merge` → 합집합 증거 |
| 4 | `cov_closure` | 도달불가 홀 제외(사유) · 클로저 판정 |

## 공통 흐름 (QuestaSim, 검증본 명령)

```
vlog -f flist.f                                    # 컴파일 (+cover 없음 — 3-step 흐름은 opt 단계에서 부착)
vopt <top> -o opt_cov +cover=bcesf+trip_top. +acc   # 최적화 + DUT(trip_top 이하 재귀) 만 계측
vsim -c -coverage opt_cov -do "coverage save -onexit x.ucdb; run -all; quit -f"
vcover merge  -out merged.ucdb a.ucdb b.ucdb ...   # 회귀 병합
vcover report -html merged.ucdb                    # HTML → covhtmlreport/index.html
vsim  -viewcov x.ucdb -do "do exclude.do; ..."     # 제외(사유) ― Coverage View 모드
```

- `+cover=<types>+<모듈명>.` — 말미 `.` 이 하위 인스턴스로 재귀 적용 지시자. 없으면
  `trip_top` 자신(순수 배선, always/case 없음)만 걸려 계측 0건이 된다.
- `coverage save` 는 반드시 `run -all` **이전**에 `-onexit` 로 예약 — batch(`-c`) 모드는
  `$finish` 시 즉시 종료(`OnFinish=exit`)해서 `run -all` 뒤에 둔 명령은 실행되지 않는다.

각 실습 폴더의 `sim/` 에서 `make` 실행. 자세한 내용은 폴더별 README.

> 참고 : 기능 커버리지(covergroup)는 코드 커버리지와 다른 개념 — Day14 범위 밖.
> 코드 100% 는 "실행됨"일 뿐 "옳음"이 아니다 → Day18 Covercheck 로 이어짐.
