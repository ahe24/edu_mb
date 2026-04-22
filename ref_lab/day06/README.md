# Day 06 Lab — Latent Bug Detection

## 실습 목표

DO-254 goal 활성 상태에서 `latent_bug.v` 프로젝트의 **잠재 설계 오류 15건**을
검출·분류·수정하고 Vivado/Libero 합성 리포트와 교차 검증.

**Day 05와 차이점**: Day 05는 `Error severity` 즉시 차단, Day 06은 `Warning` 다수 ·
합성 성공하더라도 의도와 다른 회로 — 수동 판독 + 합성 로그 교차 검증 필수.

## 결함 주입 일람표 (15건)

| # | 모듈 | 라인 | DO-254 alias | Questa check | Day 06 분류 |
|---|------|------|--------------|---------------|-------------|
| 1 | mux_latch       | 10 | SS4   | latch_inferred                         | Slide 4-C1 |
| 2 | case_no_default | 14 | SS2-a | case_default_missing                   | Slide 5-ST1 |
| 3 | case_casex      | 12 | SS2-b | case_with_x_z                          | Slide 5-ST2 |
| 4 | case_dup        | 16 | SS2-c | case_item_duplicate                    | Slide 5-ST3 |
| 5 | width_ovfl      |  8 | CP7-W1 | assign_width_overflow                 | Slide 6-W1 |
| 6 | width_udfl      |  9 | CP7-W2 | assign_width_underflow                | Slide 6-W2 |
| 7 | sign_compare    | 11 | CP7-W3 | comparison_width_mismatch             | Slide 6-W3 |
| 8 | case_sel_width  | 15 | CP7-W4 | case_width_mismatch                   | Slide 6-W4 |
| 9 | ff_no_reset     | 10 | SS18  | flop_without_control                   | Slide 7 |
| 10 | undriven_net   |  7 | SS17  | undriven_signal                        | Slide 7 |
| 11 | fsm_unreach    | 24 | CP6   | fsm_with_unreachable_state             | Slide 8-F1 |
| 12 | fsm_deadend    | 35 | CP6   | fsm_with_deadend_state                 | Slide 8-F2 |
| 13 | fsm_hardcode   | 16 | CP5   | fsm_state_value_hardcoded              | Slide 8-F3 |
| 14 | fsm_no_default | 42 | CP6   | fsm_without_default_state              | Slide 8-F4 |
| 15 | fsm_no_reset   | 44 | CP6   | fsm_without_reset_state                | Slide 8-F4 |

## 실행 순서

```bash
# 1. 컴파일 (error 0 · warning 다수 기대)
vlog -sv latent_bug.v

# 2. DO-254 goal 기반 lint 실행
qverify -c -do "do base_goal.tcl; lint run -d latent_bug; exit"

# 3. GUI · alias 필터 탐색
qverify lint_output/lint.db

# 4. 수정 후 재실행 → alias 위반 0 달성
qverify -c -do "do base_goal.tcl; lint run -d latent_bug; exit"

# 5. Vivado 합성 교차 검증 (latch count 0 확인)
vivado -mode batch -source synth_crosscheck.tcl

# 6. 감사 리포트
qverify -c -do "do base_goal.tcl; lint run -d latent_bug; lint generate report -full -html; exit"
```

## 완료 기준

- alias 기준 violation: 15 → 0
- Vivado 합성 로그에서 **latch count = 0** 확인
- 합성 cell 수 감소 (FF 대체로 인한 축소) 관찰
- 매핑표(`mapping.xlsx`) 15행 전부 기입
- `latent_bug_<YYYYMMDD>_do254_lint.html` · `synth_crosscheck.md` 제출

## 파일 구성

- `latent_bug.v` — 결함 15건 주입된 RTL
- `latent_bug_fixed.v` — 수정본 참조 (강사용)
- `base_goal.tcl` — DO-254 methodology + DAL-A/B 상향 override
- `synth_crosscheck.tcl` — Vivado 합성 교차 검증 스크립트
- `run_lint.sh` — 배치 실행 스크립트
- `mapping_template.csv` — 매핑표 제출 양식
