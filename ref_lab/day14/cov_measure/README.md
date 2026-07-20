# cov_measure — 코드 커버리지 측정 · 리포트 해석

QuestaSim 코드 커버리지 수집 흐름을 처음부터 끝까지 돌려보고, `coverage report`
숫자를 읽는 법을 익힌다. DUT 는 day14 공용 `trip_ctrl` (2oo3 트립 컨트롤러).

## 핵심 — 기능 PASS ≠ 검증 충분

기본 TB(`tb_trip.sv`)는 자기검사에 **PASS** 한다. 그러나 지속 초과 하나만 자극하므로
`en=0`·`clear`·일시 초과·다양한 sensor 조합을 전혀 시험하지 않는다. → branch/condition/FSM
커버리지에 **홀**이 남는다. "테스트가 통과했다"와 "설계를 충분히 시험했다"는 다른 문제다.

## 커버리지 수집 흐름 (3-step)

```
vlog -f flist.f  +cover=bcesf          # 소스에 커버리지 계측 삽입
vopt tb_trip -o opt_cov +cover=bcesf   # 최적화 + 계측 확정
vsim -c -coverage opt_cov -do "..."    # 커버리지 켜고 시뮬
  coverage save trip.ucdb              #   결과를 UCDB 로 저장(자동 저장 아님!)
  coverage report                      #   요약 출력
```

- `+cover` 문자 : `b`=branch `c`=condition `e`=expression `s`=statement `f`=FSM (`t`=toggle)
- **UCDB 는 명시 저장**해야 남는다 — `coverage save` 없이 끝내면 데이터가 사라진다.

## 실행

```bash
cd sim
make            # cov ― 흐름 전체 실행 + 요약 리포트
make report     # 요약 + 상세(홀 목록)
make html       # HTML 리포트 → covhtmlreport/index.html
make gui        # GUI 코드 커버리지 분석창 (vsim -viewcov)
make clean
```

## 관찰 포인트

| 유형 | 예상 결과 | 이유 |
|------|-----------|------|
| Statement | 높음 | 대부분 라인은 한 번은 실행됨 |
| Branch | 낮음 | `en=0`, WARN→MONITOR 회복, `clear` 분기 미도달 |
| Condition | 낮음 | `sensor=111` 만 인가 → vote 곱항 조합 미달 |
| FSM state | 100% 근접 | 4상태 모두 도달(지속 초과 경로) |
| FSM transition | 낮음 | WARN→MONITOR, LATCH→MONITOR 천이 미발생 |

→ 남은 홀을 **실습2(cov_hole)** 에서 자극 보강으로 메운다.
