# Day 05 Lab — Sim-Synth Mismatch Triage

## 실습 목표

DO-254 goal (`lint methodology standard -goal DO-254`) 활성 상태에서
`broken_rtl.v` 프로젝트에 의도적으로 심은 CP·SS 위반 **12건**을 검출·분류·수정·리포트.

## 결함 주입 일람표 (12건)

| # | 모듈 | 라인 | DO-254 alias | Questa check | Day 05 분류 |
|---|------|------|--------------|---------------|-------------|
| 1 | fifo_ctrl       | 22 | CP17 | blocking_assign_in_seq_block        | Slide 5-P1 |
| 2 | fifo_ctrl       | 31 | CP15 | nonblocking_assign_in_combo_block   | Slide 5-P2 |
| 3 | fifo_ctrl       | 40 | CP18 | assigns_mixed                       | Slide 5-P4 |
| 4 | decoder_badsens | 18 | CP8  | sensitivity_list_var_missing        | Slide 6-R1 |
| 5 | mux_multidrv    | 14 | SS6  | multi_driven_signal                 | Slide 5-P3 / 6-R3 |
| 6 | feedback_loop   | 12 | SS3  | combo_loop                          | Slide 6-R4 |
| 7 | init_block      | 10 | (unsynth) | unsynth_initial_stmt           | Slide 4-A |
| 8 | delay_block     |  9 | CP15 | nonblocking_assign_and_delay_in_always | Slide 4-B |
| 9 | display_leak    |  8 | (unsynth) | unsynth_display_task           | Slide 4-C |
| 10 | force_bad      | 11 | SS6  | unsynth_force_release               | Slide 4-D |
| 11 | undriven       |  6 | SS17 | undriven_signal                     | Slide 4 부차 |
| 12 | flop_no_ctrl   | 15 | SS18 | flop_without_control                | Slide 4 부차 |

## 실행 순서

```bash
# 1. 컴파일
vlog -sv broken_rtl.v

# 2. DO-254 goal 기반 lint 실행
qverify -c -do "do base_goal.tcl; lint run -d broken_rtl; exit"

# 3. GUI 디버깅 (alias 탐색)
qverify lint_output/lint.db

# 4. 수정 후 재실행 → Error 0 달성
qverify -c -do "do base_goal.tcl; lint run -d broken_rtl; exit"

# 5. 감사 리포트
qverify -c -do "do base_goal.tcl; lint run -d broken_rtl; lint generate report -full -html; exit"
```

## 완료 기준

- Error severity violation: 12 → 0
- 매핑표(`mapping.xlsx`) 12행 전부 기입
- 수정 diff (`broken_rtl.patch`) 제출
- 감사 리포트 `broken_rtl_<YYYYMMDD>_do254_lint.html` 제출

## 파일 구성

- `broken_rtl.v` — 결함 12건 주입된 RTL
- `broken_rtl_fixed.v` — 수정본 참조 (강사용)
- `base_goal.tcl` — DO-254 methodology 설정 스크립트
- `run_lint.sh` — 배치 실행 스크립트
- `mapping_template.csv` — 매핑표 제출 양식
