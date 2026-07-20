# Day 14 — 코드 커버리지 측정 · 커버리지 클로저

QuestaSim 코드 커버리지를 **측정 → 홀 분석·보강 → 회귀 병합 → 클로저(제외)** 순으로
실습한다. V&V 활동을 관리하는 입장에서 "검증을 언제 끝낼 것인가"를 정량 근거로 판단하는 법.

## 공용 DUT — `trip_ctrl` (2oo3 트립 컨트롤러)

`rtl/trip_ctrl.v` — 안전-핵심(safety-critical) 계통의 대표 구조: 3중 redundant 센서를
2-out-of-3 다수결로 투표해, 초과가 지속되면 트립을 작동시키고 LATCH 로 굳힌다.
자체 완결 모듈이라 이전 Day 실습을 듣지 않아도 된다.

한 모듈에서 커버리지 모든 유형을 관찰하도록 구문을 배치:

| 유형 | 소재 |
|------|------|
| Statement/Block | 각 상태의 동작 라인 |
| Branch | `if(rst)` · `else if(en)` · WARN 3분기 · LATCH `if(clear)` · `default` |
| Condition/Expression | `vote = (a&b)\|(b&c)\|(a&c)` 2oo3 곱항 |
| FSM | MONITOR·WARN·TRIP_S·LATCH 상태/천이 |
| Toggle | 센서·카운터·출력 신호 |

의도적 홀 — `[HOLE]`(약한 자극에서 미도달, 보강 가능) · `[UNREACH]`(원천 도달불가, 제외 대상).

## 실습 (순서 무관 · 1→2, 3, 4 로 이어짐)

| 실습 | 폴더 | 배우는 것 |
|------|------|-----------|
| 1 | `cov_measure` | 커버리지 수집 흐름 · 리포트 해석 · "PASS ≠ 충분" |
| 2 | `cov_hole` | 홀 → 누락 자극 역추적 · 보강 · 재측정 상승 |
| 3 | `cov_merge` | 테스트별 UCDB → `vcover merge` → 합집합 증거 |
| 4 | `cov_closure` | 도달불가 홀 제외(사유) · 클로저 판정 |

## 공통 흐름 (QuestaSim, 검증본 명령)

```
vlog -f flist.f +cover=bcesf            # 계측 컴파일 (b/c/e/s/f)
vopt <top> -o opt_cov +cover=bcesf +acc # 최적화 + 계측
vsim -c -coverage opt_cov -do "run -all; coverage save x.ucdb; coverage report; quit -f"
vcover merge  -out merged.ucdb a.ucdb b.ucdb ...   # 회귀 병합
vcover report -html merged.ucdb                    # HTML → covhtmlreport/index.html
vsim  -viewcov x.ucdb -do "do exclude.do; ..."     # 제외(사유) ― Coverage View 모드
```

각 실습 폴더의 `sim/` 에서 `make` 실행. 자세한 내용은 폴더별 README.

> 참고 : 기능 커버리지(covergroup)는 코드 커버리지와 다른 개념 — Day14 범위 밖.
> 코드 100% 는 "실행됨"일 뿐 "옳음"이 아니다 → Day18 Covercheck 로 이어짐.
