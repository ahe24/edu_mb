# cov_measure — 코드 커버리지 측정 · 리포트 해석

QuestaSim 코드 커버리지 수집 흐름을 처음부터 끝까지 돌려보고, `coverage report`
숫자를 읽는 법을 익힌다. DUT 는 day14 공용 `trip_top`(`vote2oo3`+`warn_counter`+`trip_fsm`).

## 핵심 — 기능 PASS ≠ 검증 충분

기본 TB(`tb_trip.sv`)는 자기검사에 **PASS** 한다. 그러나 지속 초과 하나만 자극하므로
`en=0`·`clear`·일시 초과·다양한 sensor 조합을 전혀 시험하지 않는다. → branch/condition/FSM
커버리지에 **홀**이 남는다. "테스트가 통과했다"와 "설계를 충분히 시험했다"는 다른 문제다.

## 커버리지 수집 흐름 (3-step)

```
vlog -f flist.f                             # 컴파일 (+cover 없음 — opt 단계에서 부착)
vopt tb_trip -o opt_cov +cover=bcesf+trip_top. +acc   # DUT(trip_top 이하 재귀)만 계측
vsim -c -coverage opt_cov -do "..."         # 커버리지 켜고 시뮬
  coverage save -onexit trip.ucdb           #   run 이전에 저장 예약(자동 저장 아님!)
  run -all
```

- `+cover` 문자 : `b`=branch `c`=condition `e`=expression `s`=statement `f`=FSM (`t`=toggle)
- **UCDB 는 명시 저장**해야 남는다 — `coverage save` 없이 끝내면 데이터가 사라진다.
  `-onexit` 로 `run -all` **이전에** 예약해야 한다 — batch 모드는 `$finish` 시 즉시 종료돼
  `run -all` 뒤에 둔 `coverage save` 는 실행되지 않는다.
- `+cover=bcesf+trip_top.`(말미 `.` = 하위 인스턴스 재귀) — DUT(서브모듈 3개)만 계측하고
  TB(`tb_trip`) 자신은 계측 대상에서 제외한다.

## 실행

```bash
cd sim
make            # cov ― 흐름 전체 실행 + 요약 리포트
make report     # 요약 + 상세(홀 목록)
make html       # HTML 리포트 → covhtmlreport/index.html
make gui        # GUI 코드 커버리지 분석창 (vsim -viewcov)
make clean
```

## 관찰 포인트 (실측)

| 모듈 | 유형 | 결과 | 이유 |
|------|------|------|------|
| `vote2oo3` | Expression | **0/3 (0%)** | `sensor=111` 고정 → 곱항 개별 기여 미입증 |
| `vote2oo3` | Statement | 1/1 (100%) | 조합 로직이라 한 번만 평가돼도 실행 |
| `warn_counter` | Branch | 5/5 (100%) | — |
| `warn_counter` | Condition | 2/3 (66.66%) | `clr=1,rst=0` 조합 미도달 |
| `trip_fsm` | Branch | 10/15 (66.66%) | `en=0`, WARN 회복, LATCH `clear` 분기 미도달 |
| `trip_fsm` | FSM state | 4/4 (100%) | 4상태 모두 도달(지속 초과 경로) |
| `trip_fsm` | FSM transition | 3/6 (50%) | WARN→MONITOR·LATCH→MONITOR·TRIP_S→MONITOR 미발생 |
| `trip_fsm` | Statement | 15/21 (71.42%) | 위 미도달 분기 안의 대입문들 |

전체(DUT 3모듈 가중 평균) **61.70%** — TB(`tb_trip`)는 계측 대상이 아니므로 리포트에
나타나지 않는다. → 남은 홀을 **실습2(cov_hole)** 에서 자극 보강으로 메운다.
