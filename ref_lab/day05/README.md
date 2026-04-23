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

단일 `qverify -c -do` 세션에서 `compile.tcl → base_goal.tcl → lint run → HTML 리포트` 까지 일괄 실행.
`vlib` / `vmap` / `vlog -f filelist.f` 은 `compile.tcl` 에 분리 · lint 설정(methodology · preference · severity) 은 `base_goal.tcl` 에 분리.

### Linux (Makefile)

```bash
make            # = make lint
make lint       # compile → DO-254 lint 실행 → HTML 리포트 생성
make gui        # qverify GUI 로 lint_output/lint.db 오픈
make clean      # work/ · lint_output/ · 로그 · 리포트 정리
```

### Windows (배치 파일)

```batch
run_lint.bat           :: = run_lint.bat lint
run_lint.bat lint      :: compile → lint → HTML 리포트
run_lint.bat gui       :: qverify GUI 오픈
run_lint.bat clean     :: work\ · lint_output\ · 로그 정리
```

### 수정-재실행 사이클

1. `mapping_template.csv` 기반 violation 분류
2. `broken_rtl.v` 수정 (또는 참조용 `broken_rtl_fixed.v` 대조)
3. `make lint` (Windows: `run_lint.bat`) 재실행 → Error severity 0 확인
4. 감사 리포트 `broken_rtl_<YYYYMMDD>_do254_lint.html` 자동 생성

## 완료 기준

- Error severity violation: 12 → 0
- 매핑표(`mapping.xlsx`) 12행 전부 기입
- 수정 diff (`broken_rtl.patch`) 제출
- 감사 리포트 `broken_rtl_<YYYYMMDD>_do254_lint.html` 제출

## 파일 구성

- `broken_rtl.v` — 결함 12건 주입된 RTL
- `broken_rtl_fixed.v` — 수정본 참조 (강사용)
- `filelist.f` — `vlog -f` 입력 소스 목록 (다중 파일 대응)
- `compile.tcl` — `vlib` / `vmap` / `vlog -f filelist.f` (컴파일 전용)
- `base_goal.tcl` — DO-254 methodology · preference · severity override (lint 설정 전용)
- `Makefile` — Linux 배치 실행 (`make lint` / `make gui` / `make clean`)
- `run_lint.bat` — Windows 배치 실행 (`run_lint.bat [lint|gui|clean]`)
- `mapping_template.csv` — 매핑표 제출 양식
