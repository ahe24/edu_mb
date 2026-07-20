# cov_closure — 커버리지 클로저 · 도달불가 홀 제외(waiver)

보강(실습2) 후에도 100% 가 안 되는 홀이 남는다. **커버리지 클로저**란 남은 홀을 하나도
빠짐없이 판정 완료한 상태를 말한다 — 그래야 "검증 활동 종료"를 선언할 수 있다.

## 남은 홀 = 셋 중 하나로 판정

| 판정 | 조치 | 예 |
|------|------|-----|
| ① 테스트 미비 | 자극 추가 | (실습2에서 처리) |
| ② 도달불가 | 사유 남기고 **제외(waiver)** | `default:` 방어 분기 |
| ③ 설계 결함 | 설계 수정 | 죽은 코드·잘못된 조건 |

사유 없이 "95%" 로 끝내면 기술검토회의에서 "나머지 5% 는 무엇인가"에 답할 수 없다.
제외는 **근거를 남기는 행위** — 무시가 아니다.

## 도달불가 홀 — trip_ctrl.v:69 `default:`

`state` 는 2비트 전수 열거(MONITOR/WARN/TRIP_S/LATCH = 0~3)라 `case` 의 `default` 는
어떤 자극으로도 도달할 수 없다. 방어적 코딩으로 코드는 유지하되, 커버리지에서는 제외한다.

```tcl
coverage exclude -srcfile trip_ctrl.v -linerange 69 \
    -comment "UNREACH: state 2-bit fully-enumerated; default is defensive/unreachable"
```

- `-comment` 사유는 **Coverage View 모드**(`vsim -viewcov`)에서만 지원 — live sim 불가.
- 제외는 UCDB 에 저장되고, 사유는 HTML 리포트에서 **툴팁**으로 표시 → 심사 증적.
- `exclude.do` 는 **형상관리 대상** — 무엇을 왜 제외했는지가 검토·감사의 대상.

## 실행

```bash
cd sim
make            # cov → closure (제외 적용)
make report     # 제외 반영 상세 리포트
make html       # 제외 사유 툴팁 확인
make clean
```

## 함정 — 100% ≠ 기능 완전성

코드 커버리지 100% 는 "모든 코드가 실행됐다"일 뿐, "모든 기능 시나리오를 시험했다"가
아니다. 실행됐어도 그 결과가 옳은지는 별개 — 기능 커버리지(covergroup)·형식 검증
(Day18 Covercheck)이 그 공백을 메운다.
