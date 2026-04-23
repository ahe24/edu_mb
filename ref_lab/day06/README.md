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

단일 `qverify -c -do` 세션에서 `compile.tcl → base_goal.tcl → lint run → HTML 리포트` 까지 일괄 실행.
Vivado 합성 교차 검증은 별도 타겟으로 분리 (`synth`).
`vlib` / `vmap` / `vlog -f filelist.f` 은 `compile.tcl` · lint 설정(methodology · severity · FSM check) 은 `base_goal.tcl` 에 분리.

### Linux (Makefile)

```bash
make            # = make lint
make lint       # compile → DO-254 lint (DAL-A/B override) → HTML 리포트
make gui        # qverify GUI 로 lint_output/lint.db 오픈
make synth      # Vivado batch 합성 교차 검증 (latch count / cell 수)
make all        # lint + synth 순차 실행
make clean      # work/ · lint_output/ · 로그 · synth 산출물 정리
```

### Windows (배치 파일)

```batch
run_lint.bat            :: = run_lint.bat lint
run_lint.bat lint       :: compile → lint → HTML 리포트
run_lint.bat gui        :: qverify GUI 오픈
run_lint.bat synth      :: Vivado batch 합성 교차 검증
run_lint.bat all        :: lint + synth 순차 실행
run_lint.bat clean      :: work\ · lint_output\ · 로그 · synth 산출물 정리
```

### 수정-재실행 사이클

1. `mapping_template.csv` 기반 15건 violation 분류 (alias · severity · 모듈)
2. `latent_bug.v` 수정 (참조용: `latent_bug_fixed.v`)
3. `make lint` (Windows: `run_lint.bat`) → alias 위반 0 확인
4. `make synth` — Vivado 합성 로그에서 **latch count = 0** · cell 수 감소 확인
5. 감사 리포트 `latent_bug_<YYYYMMDD>_do254_lint.html` · `synth_crosscheck.md` 자동 생성

## 완료 기준

- alias 기준 violation: 15 → 0
- Vivado 합성 로그에서 **latch count = 0** 확인
- 합성 cell 수 감소 (FF 대체로 인한 축소) 관찰
- 매핑표(`mapping.xlsx`) 15행 전부 기입
- `latent_bug_<YYYYMMDD>_do254_lint.html` · `synth_crosscheck.md` 제출

## 파일 구성

- `latent_bug.v` — 결함 15건 주입된 RTL
- `latent_bug_fixed.v` — 수정본 참조 (강사용)
- `filelist.f` — `vlog -f` 입력 소스 목록 (다중 파일 대응)
- `compile.tcl` — `vlib` / `vmap` / `vlog -f filelist.f` (컴파일 전용)
- `base_goal.tcl` — DO-254 methodology + DAL-A/B severity override + FSM check (lint 설정 전용)
- `synth_crosscheck.tcl` — Vivado 합성 교차 검증 스크립트
- `Makefile` — Linux 배치 실행 (`make lint|gui|synth|all|clean`)
- `run_lint.bat` — Windows 배치 실행 (`run_lint.bat [lint|gui|synth|all|clean]`)
- `mapping_template.csv` — 매핑표 제출 양식
