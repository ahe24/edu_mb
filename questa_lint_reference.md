# Questa Lint Quick Reference (v2025.3)

> 이 문서는 Siemens EDA Questa Lint의 정확한 명령어와 워크플로우를 정리한 레퍼런스입니다.
> 교육 슬라이드 및 실습 자료 생성 시 반드시 이 문서를 참조하여 정확한 명령어를 사용하세요.

---

## 1. 핵심 실행 파일: `qverify`

Questa Lint의 **유일한 실행 파일**은 `qverify`입니다. `questa_lint`, `qlint`, `lint` 같은 별도 실행 파일은 **존재하지 않습니다**.

| 용도 | 명령어 |
|------|--------|
| Batch 모드 (인터랙티브 셸) | `qverify -c` |
| Batch 모드 (명령 직접 실행) | `qverify -c -do "<Tcl commands>"` |
| Batch 모드 + 출력 디렉토리 | `qverify -od <output_dir> -c -do "<Tcl commands>"` |
| GUI 모드 (결과 디버깅) | `qverify <output_dir>/lint.db` |

### qverify 주요 옵션

- `-c` : Batch 모드 실행 (command-line only, GUI 없음)
- `-do "<commands>"` : 실행할 Tcl 명령 또는 DO 스크립트
- `-od <directory>` : 출력 디렉토리 지정 (lint.db 등이 저장됨)

---

## 2. 컴파일 명령어

컴파일은 **qverify 셸 내부** 또는 **독립 실행** 모두 가능하지만, compile-time check를 위해서는 **qverify 셸 내부에서** 실행을 권장합니다.

### 라이브러리 생성

```bash
vlib work            # 디자인 라이브러리 생성
vmap work work       # 논리-물리 매핑 생성
```

### Verilog 컴파일

```bash
# 개별 파일 지정
vlog file1.v file2.v file3.v

# 파일리스트 사용
vlog -f scripts/filelist.f

# 로그 파일 지정
vlog -f scripts/filelist_vl -l compile_vl.log

# SystemVerilog
vlog -sv file1.sv file2.sv
```

### VHDL 컴파일

```bash
# 개별 파일
vcom file1.vhd file2.vhd

# VHDL-2008
vcom -2008 file1.vhd
```

### qrun을 이용한 컴파일 (대안)

```bash
# qverify 셸 내에서
qrun verilog_file1 verilog_file2 ... -work ./work

# 또는 직접 실행
qverify -c -do "qrun verilog_file1 verilog_file2 ..."
```

---

## 3. Lint Tcl 명령어 (qverify 셸 내부에서 실행)

### Methodology & Goal 설정

```tcl
# Methodology 종류: soc, ip, fpga, standard, custom
lint methodology ip                    # IP methodology (기본 goal)
lint methodology ip -goal release      # IP methodology + release goal
lint methodology fpga -goal release    # FPGA methodology + release goal
lint methodology soc -goal start       # SoC methodology + start goal
lint methodology standard              # Standard methodology
```

**Methodology별 Goal 목록:**

| Methodology | Goals |
|-------------|-------|
| IP | start, planning, simulation, implementation, release |
| SoC | start, planning, simulation, implementation, release |
| FPGA | start, simulation, release |
| Standard | STARC, DO-254, ISO26262, RMM |

### Check 제어

```tcl
lint on <check_name>                   # 특정 체크 활성화
lint off <check_name>                  # 특정 체크 비활성화
lint report check -severity error <check_name>   # 체크 심각도 변경
```

예시:
```tcl
lint on regex_user_defined
lint off parameter_not_specified
lint off parameter_with_range
lint off mux_select_const
lint off seq_block_has_complex_cond
lint off shift_register_inferred
lint report check -severity error conditional_operator_nested
```

### Lint 분석 실행

```tcl
lint run -d <top_module>               # 디자인 탑 모듈에 대해 lint 분석 실행
```

> **중요**: `lint run`은 반드시 컴파일(vlog/vcom) **이후에** 실행해야 합니다.

### Preference 설정

```tcl
lint preference -generate_elaborated_report      # Elaborated report 생성
lint preference -generate_design_summary_report  # Design summary report 생성
lint preference name -check inst_name_not_standard -disallow_mix_case  # 네이밍 규칙
```

### 기타 명령어

```tcl
lint generate report    # 리포트 생성
lint generate goal      # Custom goal 생성
lint load db            # 데이터베이스 로드
lint merge db           # 데이터베이스 병합
lint status update      # Violation 상태 업데이트
lint suppress           # Violation 억제
lint diff <current_db> -refdb <reference_db>   # Incremental 비교 → lint_incremental.rpt 생성 (User Guide p.277)
lint copy check         # 체크 복사
lint configure reference # 레퍼런스 설정
```

---

## 4. 전체 Batch 워크플로우

### Linux 기본 플로우

```bash
# 방법 1: 한 줄 명령
qverify -od output_lint -c -do "\
  lint methodology ip -goal release; \
  do scripts/setup.tcl; \
  vlib work; \
  vmap work work; \
  vlog -f scripts/filelist_vl -l compile_vl.log; \
  lint run -d top_module; \
  exit"

# 방법 2: Tcl DO 스크립트 사용
qverify -c -do setup_run_lint.tcl
```

### Tcl DO 스크립트 예제 (setup_run_lint.tcl)

```tcl
# Methodology 및 Goal 설정
lint methodology ip -goal release;

# Preference 설정
lint preference -generate_elaborated_report;
lint preference -generate_design_summary_report

# Check 활성화/비활성화
lint on var_unused
lint off assign_width_overflow

# 라이브러리 생성 및 컴파일
vlib work
vmap work work
vlog demo_top.v dpmem2clk.v generic_fifo_dc_gray.v

# Lint 분석 실행
lint run -d demo_top
```

실행:
```bash
qverify -c -do setup_run_lint.tcl
```

### Windows 기본 플로우

```batch
SET COMPILE_CMD=vlog -f scripts/filelist_vl -l compile_vl.log

SET TCL=^
lint methodology ip -goal release ; do scripts/setup.tcl;^
!COMPILE_CMD!;^
lint run -d top_module

qverify -od output_dir -c -do "!TCL! ; exit"
```

### Makefile 기반 플로우 (Linux)

```makefile
DUT = demo_top
COMPILE_CMD = vlog -f scripts/filelist_vl -l compile_vl.log

lint_run:
	test -f scripts/setup.tcl || touch scripts/setup.tcl; \
	qverify -od output_lint -c -do " \
	lint methodology ip -goal release; \
	do scripts/setup.tcl; \
	vlib work; \
	vmap work work; \
	$(COMPILE_CMD); \
	lint run -d $(DUT); \
	exit"
```

---

## 5. 분석 5단계 (Analysis Stages)

Lint 분석은 5단계로 진행되며, 각 단계마다 해당하는 체크 세트가 실행됩니다:

| 단계 | 명칭 | 내용 |
|------|------|------|
| Stage 1 | Pre-Design Elaboration | 컴파일된 design unit 로드 및 사전 분석 |
| Stage 2 | Design Elaboration | RTL 구조, 변수 선언, FSM 코드 분석/최적화 |
| Stage 3 | Post Design Elaboration | 개별 모듈 elaboration 및 컴파일 |
| Stage 4 | Design Synthesis | 개별 모듈 합성 |
| Stage 5 | Post Design Synthesis | 전체 디자인 elaboration, 합성, 분석 |

---

## 6. 출력 파일

Lint 분석 후 `-od` 옵션으로 지정한 출력 디렉토리에 생성되는 파일:

| 파일 | 설명 |
|------|------|
| `lint.db` | Lint 분석 데이터베이스 (GUI 디버깅에 사용) |
| `lint.rpt` | Check Report — Error, Warning, Info, Waiver 메시지 |
| `lint_settings.rpt` | 실행된 체크 목록, 심각도, preference, pragma |
| `lint_status_history.rpt` | Violation 상태 변경 이력 |
| `lint_run.log` | 전체 실행 로그 |
| `qverify.log` | stdout 메시지 |
| `qverify_cmds.tcl` | 실행된 명령어 사본 |

### lint.rpt 구조 (3개 섹션)

- **Section 1: Check Summary** — Error/Warning/Info 별 체크 요약 및 건수
- **Section 2: Check Details** — 각 violation의 상세 정보 (파일, 라인, 모듈, RTL ID)
- **Section 3: Design Information** — Register Bits, Latch Bits, Blackbox, Module 수 등

---

## 7. GUI 디버깅

```bash
# 분석 결과 GUI로 열기
qverify output_lint/lint.db &
```

### GUI 주요 윈도우

| 윈도우 | 설명 |
|--------|------|
| Lint Summary | Error/Warning/Info 별 체크 트리 |
| Lint Checks | Violation 상세 목록 (필터/그룹핑) |
| Source Code | RTL 소스 코드 + violation 위치 표시 |
| Schematic | 회로도 기반 connectivity 디버깅 |
| Design Metrics | Quality Score (모듈별/파일별) |
| Lint Dashboard | 파이 차트/바 차트 기반 이슈 시각화 |
| Status History | Violation 상태 변경 이력 |

### 디버깅 워크플로우

1. Lint Summary에서 Error/Warning/Info 탐색
2. 체크 이름 더블클릭 → Lint Checks 탭에서 상세 보기
3. Violation 더블클릭 → Source Code에서 위치 확인
4. Connectivity 관련 violation → 자동으로 Schematic 표시
5. 우클릭 → Status 변경 (uninspected → analyzed/waived 등)

---

## 8. 환경 변수

| 변수 | 설명 |
|------|------|
| `QOSF_ROOT` | Questa Static Formal 설치 디렉토리 (필수) |
| `QHOME` | Questa Lint 소프트웨어 트리 경로 |
| `SALT_LICENSE_SERVER` | 라이선스 서버 주소 |
| `LINT_DEFAULT_GOAL` | 기본 Goal 파일 경로 |
| `EDITOR` | RTL 소스 편집기 (기본: Vim) |

Linux 설정 예시:
```bash
setenv QOSF_ROOT <install_dir>/questa_static_formal/linux_x86_64
```

Windows 설정 예시:
```
QOSF_ROOT = <install_dir>\questa_static_formal\win64
SALT_LICENSE_SERVER = <port>@<license_server_host>
```

---

## 9. FPGA Library 설정 (Xilinx/Intel 등)

```tcl
# qverify 셸 내에서
netlist fpga directory /path/to/project

netlist fpga compile \
  -vendor xilinx -library VIVADO -version 2020.4 \
  -fpga_dir /path/to/project \
  -tool_dir /path/to/tools/fpga/Xilinx/VIVADO

netlist fpga -vendor xilinx
```

---

## 10. 주요 Lint Check 카테고리

### Safety-Critical 관련 주요 체크

- **Clock Checks**: clk_port_conn_complex, clock_gated, clock_internal, clock_path_buffer
- **Reset Checks**: async_reset_active_high, flop_without_control, reset_polarity_mismatch
- **FSM Checks**: fsm_without_default_state, fsm_without_reset_state, fsm_with_deadend_state
- **Width Checks**: assign_width_overflow, assign_width_underflow, case_width_mismatch
- **Connectivity Checks**: unconnected_inst_output, undriven_signal, combo_loop
- **Simulation Race Checks**: multi_driven_signal, blocking_assign_in_seq_block

### Check Severity 레벨

- **Error** — 심각한 디자인 문제
- **Warning** — 잠재적 문제
- **Info** — 정보성 알림

### Violation Status

- **uninspected** — 미검토 (기본값)
- **analyzed** — 분석 완료
- **waived** — 면제 처리
- **resolved** — 해결됨

---

## 11. Incremental Analysis

소스 변경 후 전체 재분석 대신 변경 부분만 분석:

```tcl
# 변경된 파일만 재컴파일
vlog changed_file.v

# Incremental lint 실행
lint run -d top_module -incr
```

### `lint diff` — DB 간 Incremental 비교 (User Guide p.277)

**공식 문법**:

```tcl
lint diff <current_db> -refdb <reference_db>
```

**중요**: 두 번째 인자는 positional이 아니라 `-refdb` 플래그로 지정해야 함. `lint diff a.db b.db` 같은 호출은 에러.

**출력**: `lint_incremental.rpt` (New Results / Fixed Results / Pre-existing Results 3개 섹션)

**전형적 배치 플로우**:

```bash
# 1) Friday baseline 실행
qverify -od friday_run -c -do " \
  lint methodology ip -goal release; \
  vlog dut.v; \
  lint run -d dut; \
  exit"

# 2) Monday 변경 후 실행
qverify -od monday_run -c -do " \
  lint methodology ip -goal release; \
  vlog dut.v; \
  lint run -d dut; \
  exit"

# 3) Incremental diff — 결과는 -od로 지정한 monday_run에 저장
qverify -od monday_run -c -do "lint diff monday_run/lint.db -refdb friday_run/lint.db; exit"
```

**제약**: 두 DB는 동일 Questa Lint 릴리스로 생성되어야 함 (버전 혼용 불가).

---

## 12. Waiver 및 Suppression

### Pragma 기반 Waiver (RTL 소스 내)

```verilog
// lint_checking <check_name> off
... // waived code
// lint_checking <check_name> on
```

### Tcl 기반 Waiver (`lint suppress` — pre-run 억제)

**공식 문법** (User Guide p.495-496):

```tcl
lint suppress [-check check_pattern1 check_pattern2...]
              [-alias alias_name...]
              [-category category]
              [-arg {argname=value | argname~=value}...]
              [-owner owner]
              [-comment comment]
              [-reviewer reviewer]
```

**중요**: `-module` 같은 전용 옵션은 **존재하지 않음**. 모듈 단위 억제는 `-arg module=<value>` 형식.

**주요 옵션**:

| 옵션 | 용도 |
|------|------|
| `-check` | 억제할 체크명 (와일드카드 가능, 복수 지정 가능) |
| `-alias` | 체크 alias로 지정 |
| `-category` | 카테고리로 지정 (예: `rtl_design_style`) |
| `-arg argname=value` | 특정 argument 값으로 필터 (`module=`, `signal=`, `file=` 등, argname은 `lint.rpt`의 Check Details 참조). `~=` 접미사로 제외 매칭 |
| `-owner` | 억제를 추가한 사람 (감사 근거) |
| `-comment` | 억제 사유 (감사 근거 — 공백·특수문자 포함 시 `{}`로 감쌀 것). **ASCII 전용** — 리포트 렌더링이 CP949라 한글은 mojibake됨 (예: `외` → `ì쇅`). 한글 상세는 별도 Waiver Rationale 문서로 분리 |
| `-reviewer` | 억제를 리뷰·승인한 사람 (감사 근거) |

**예제**:

```tcl
# 특정 violation 억제 (argname=value 조합)
lint suppress -check func_input_unused \
  -arg function=func -arg signal=in -arg module=dut -arg file=dut.sv

# 외부 IP 모듈의 combo_loop/latch_inferred 억제 + 감사 근거
lint suppress -check combo_loop latch_inferred \
  -arg module=external_dsp_ip \
  -owner alice -reviewer lead \
  -comment {3rd-party BB, out of V&V scope (DR-207)}

# 제외 매칭: lightsRoadA 신호만 빼고 모두 억제
lint suppress -check data_type_not_recommended -arg signal~=lightsRoadA
```

**제약**:
- 동일 `-arg argname=...`을 여러 번 쓰면 **마지막 값만** 적용됨 (`-arg module=a -arg module=b` → `b`만)
- 동일 argname에 복수 값 나열 불가 (전체 문자열을 하나의 value로 해석)
- Pre-run 억제이므로 `lint_status_history.rpt`에 개별 violation 상태 이력이 남지 않음 → 감사 추적이 필요하면 `lint report item -status waived` 사용

### Post-run Waiver (`lint report item` — 개별 violation 상태 변경)

**공식 문법** (User Guide p.476):

```tcl
lint report item -status {uninspected | pending | waived | bug | fixed | verified}
                 [-severity {error | warning | info}]
                 [-check check_pattern1 check_pattern2 ...]
                 [-alias alias_pattern1 alias_pattern2 ...]
                 [-category category]
                 [-rtl_id rtl_id1 rtl_id2 ...]
                 [-owner owner]
                 [-comment comment]
                 [-reviewer name]
                 [{-arg {argname=value}} ...]
```

**`lint suppress`와의 차이**:

| 항목 | `lint suppress` | `lint report item` |
|------|-----------------|--------------------|
| 시점 | pre-run (분석 전 필터) | post-run (분석 후 상태 변경) |
| 대상 | 매칭되는 violation 전체 | 개별 violation (RTL ID로 특정 가능) |
| 상태 이력 | 기록 안 됨 | `lint_status_history.rpt`에 기록 |
| 리포트 노출 | 리포트에서 숨김 | `[waived]` 등 상태 태그로 남아 있음 |
| 감사 적합성 | C | A (safety-critical 권장) |

**식별 방법** (하나 이상 조합):
- `-rtl_id <ID>` — **리팩토링에 가장 강함** (라인 변경/이름 변경에 무관)
- `-check <name>` + `-arg argname=value` — 메시지 템플릿의 placeholder 기반 (예: `async_reset_active_high` → `-arg reset=rst -arg module=<M>`)
- `-check <name>` + `-category <cat>` + `-severity <lvl>`

**argname 확인**: `lint.rpt`의 Check Details 섹션 또는 check 메시지 템플릿 참조.
예: `Asynchronous reset is active high. Reset '<reset>', Module '<module>', File '<file>', Line '<line>'.` → 사용 가능한 argname은 `reset`, `module`, `file`, `line`.

**예제**:

```tcl
# RTL ID 기반 waiver (권장 — 리팩토링에 강함)
lint report item -status waived \
  -check async_reset_active_high \
  -rtl_id c8c123e5_00300 \
  -owner alice -reviewer lead \
  -comment {Xilinx convention, DR-112 (2026-04-15)}

# argname 기반 waiver (RTL ID가 불안정한 경우)
lint report item -status waived \
  -check async_reset_active_high \
  -arg reset=rst -arg module=reset_flop \
  -owner alice -reviewer lead \
  -comment {Xilinx convention, DR-112}

# 벌크 상태 변경 — 카테고리 전체를 pending으로
lint report item -status pending -category clock \
  -owner bob -comment {Under review for DR-118}
```

**주의**:
- `-comment`는 **ASCII 전용** (CP949 렌더링으로 한글 mojibake — `lint suppress`와 동일 제약)
- 상태 값은 6종: `uninspected` / `pending` / `waived` / `bug` / `fixed` / `verified`
- RTL ID는 `lint.rpt`나 GUI의 Lint Checks 창에서 확인 가능 (예: `[RTL ID:c8c123e5_00300]`)

---

## 13. 흔한 실수 (AI가 잘 틀리는 것들)

| 잘못된 명령어 | 올바른 명령어 | 설명 |
|-------------|------------|------|
| `questa_lint` | `qverify` | 실행 파일명 |
| `qlint` | `qverify` | 실행 파일명 |
| `lint analyze` | `lint run -d <top>` | 분석 실행 명령 |
| `lint check` | `lint run -d <top>` | 분석 실행 명령 |
| `lint start` | `lint run -d <top>` | 분석 실행 명령 |
| `lint compile` | `vlog` / `vcom` | 컴파일은 별도 명령 |
| `lint set methodology` | `lint methodology ip` | methodology 설정 |
| `lint -batch` | `qverify -c` | Batch 모드 |
| `lint report` | `lint generate report` | 리포트 생성 |
| `lint open` | `qverify lint.db` | GUI 열기 |
| `lint suppress X -module M` | `lint suppress -check X -arg module=M` | `-module` 전용 옵션 없음 |
| `lint suppress ... -reason "..."` | `lint suppress ... -comment "..."` | 근거 필드는 `-comment` |
| `lint diff a.db b.db` | `lint diff a.db -refdb b.db` | 두 번째 인자는 `-refdb` 플래그 필수 |
| `lint report item ... \` <br> `# REASON: ...` (줄연결 뒤 주석) | `lint report item ... -comment {REASON}` | Tcl `\` 뒤의 `#`는 주석 아님 — 공식 `-comment` 필드 사용 |
| `-arg foo=bar` (체크에 없는 argname) | 체크의 메시지 템플릿 placeholder만 허용 | argname은 `lint.rpt` Check Details 참조 (예: `async_reset_active_high`는 `reset`/`module`/`file`/`line`) |

---

## 14. 실습 예제: 간단한 Verilog Lint 분석

### 디자인 파일 (counter.v)

```verilog
module counter (
  input  wire        clk,
  input  wire        rst_n,
  input  wire        enable,
  output reg  [7:0]  count
);

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n)
      count <= 8'b0;
    else if (enable)
      count <= count + 1'b1;
  end

endmodule
```

### setup.tcl

```tcl
lint methodology fpga -goal release
lint on var_unused
lint off parameter_not_specified
```

### 실행 명령

```bash
# 라이브러리 생성 + 컴파일 + Lint 분석 (한 번에)
qverify -od output_counter -c -do "\
  do setup.tcl; \
  vlib work; \
  vmap work work; \
  vlog counter.v; \
  lint run -d counter; \
  exit"

# 결과 확인
cat output_counter/lint.rpt

# GUI로 디버깅
qverify output_counter/lint.db &
```

---

*Source: Questa Lint Tutorial Guide v2025.3, Questa Lint User Manual v2025.3 (Siemens EDA)*
