# Questa CDC / RDC 튜토리얼 가이드 요약 (한국어)

> 원문: Siemens Questa CDC and RDC Tutorials Guide (v2025)
> 본 문서는 원문 튜토리얼의 전체 8개 챕터를 기술 요약한 레퍼런스이다.

---

## 목차

1. [Chapter 1 — Introduction](#chapter-1--introduction)
2. [Chapter 2 — CDC Static](#chapter-2--cdc-static)
3. [Chapter 3 — CDC Static in GUI Mode](#chapter-3--cdc-static-in-gui-mode)
4. [Chapter 4 — CDC Protocol](#chapter-4--cdc-protocol)
5. [Chapter 5 — CDC-FX](#chapter-5--cdc-fx)
6. [Chapter 6 — CDC Hierarchical Top-down Analysis](#chapter-6--cdc-hierarchical-top-down-analysis)
7. [Chapter 7 — CDC Hierarchical Bottom-up Analysis](#chapter-7--cdc-hierarchical-bottom-up-analysis)
8. [Chapter 8 — RDC](#chapter-8--rdc)

---

## Chapter 1 — Introduction

### 목적/개요

Questa CDC 및 RDC 도구의 입문 튜토리얼 가이드이다. 각 분석 도구, Visualizer 인터페이스, 디버그 환경을 소개한다.

- **Questa CDC**: 클록 도메인 크로싱 분석, CDC 전송 프로토콜 검사, CDC-FX 메타스태빌리티 효과 주입
- **Questa RDC**: 리셋 도메인 크로싱 분석

### 환경 준비 절차

1. 튜토리얼 작업 디렉터리 생성
   ```
   mkdir ~/tutorials
   ```
2. 설치 디렉터리에서 튜토리얼 데이터 복사
   ```
   cp -r install_dir/share/examples/design_solutions/cdc_rdc/tutorials/* ~/tutorials
   ```
3. 쓰기 권한 부여
   ```
   chmod -R u+w ~/tutorials/*
   ```
4. `QHOME` 환경 변수 설정
   ```
   setenv QHOME install_dir/linux_x86_64
   ```

---

## Chapter 2 — CDC Static

### 목적/개요

정적 CDC 분석의 전체 워크플로우를 배치(batch) 모드로 수행하는 튜토리얼이다. 데모 설계는 MAC-Core-CPU 인터페이스 블록으로, 3개의 비동기 클록 도메인(CORE_CLK, CPU_CLK, MAC_CLK)을 가진다. 2-DFF, Data MUX, FIFO 등 다양한 동기화 스킴이 포함되어 있다.

정적 CDC 분석이 수행하는 구조적 검증 작업:

- 설계의 클록 구조 식별 (클록 도메인, 클록 게이팅, 분주기 등)
- 클록 도메인 크로싱 신호 식별
- CDC 신호의 동기화 스킴 식별 및 구조 검사

### 주요 절차 (Step-by-step)

#### 1단계: CDC 환경 설정

`scripts/directives.tcl` 파일에 Tcl 디렉티브를 작성한다:

```tcl
# 클록 정의
netlist clock cpu_clk_in -period 50
netlist clock core_clk_in -period 60
netlist clock mac_clk_in -period 50

# 상수 정의 (scan mode 비활성화)
netlist constant scan_mode 1'b0

# CDC 스킴 활성화
cdc scheme on -fifo -handshake
```

주요 디렉티브 설명:

| 디렉티브 | 용도 |
|----------|------|
| `netlist clock` | 클록 신호 특성 정의, 클록 도메인/그룹 설정 |
| `netlist constant` | 분석 중 특정 신호를 상수값으로 고정 |
| `cdc scheme on -fifo -handshake` | FIFO 및 Handshake 동기화 스킴 분석 활성화 |
| `cdc reconvergence on` | 재수렴(reconvergence) 검사 활성화 |
| `cdc preference reconvergence` | 재수렴 분석 파라미터 설정 (-depth, -divergence_depth) |

#### 2단계: 클록 리포트 생성

```bash
make compile_vl   # HDL 소스 컴파일
make clock        # 클록 리포트 생성
```

컴파일 명령 시퀀스:
```bash
vlib work
vmap work work
vlog -f scripts/filelist_vl
```

클록 리포트 생성 배치 세션:
```bash
qverify -od Output_Results -c -do " \
  do scripts/directives.tcl; \
  cdc setup -report cdc.rpt; \
  cdc run -d demo_top; \
  cdc generate report cdc_detail.rpt; \
  exit"
```

#### 3단계: 클록 그룹 및 포트 도메인 검증

`cdc.rpt` 리포트를 검토하여 확인할 항목:

- 비동기 클록이 올바르게 나열되었는지
- 의도하지 않은 클록이 없는지
- 관련(간접 동기) 클록이 동일 그룹에 있는지
- 포트 도메인 할당이 올바른지 (`<undef>` 도메인 확인)

필요 시 조정하는 디렉티브:

```tcl
cdc clock attribute -group clk_group -remove     # 의도하지 않은 클록 제거
netlist port domain in -async                     # 비동기 포트 지정
netlist port domain a b -clock U1.clk_a           # 포트 도메인 명시 지정
```

#### 4단계: CDC 분석 실행

```bash
make cdc
```

배치 세션:
```bash
qverify -od Output_Results -c -do " \
  do scripts/directives.tcl; \
  cdc run -d demo_top; \
  cdc generate report cdc_detail.rpt; \
  exit"
```

#### 5단계: GUI 디버그

```bash
make debug    # qverify Output_Results/cdc.db &
```

### 핵심 명령어

| 명령어 | 설명 |
|--------|------|
| `qverify -od <dir> -c -do "<script>"` | 배치 모드 분석 세션 실행 |
| `qverify <db_path>` | GUI 모드로 데이터베이스 열기 |
| `cdc setup -report <file>` | 클록 리포트 모드로 CDC 셋업 |
| `cdc run -d <top_module>` | CDC 분석 실행 |
| `cdc generate report <file>` | 상세 CDC 리포트 생성 |
| `cdc generate tree -clock` | 클록 트리 상세 정보 표시 |

### 주요 결과물/산출물

| 파일 | 설명 |
|------|------|
| `cdc.db` | CDC 비텍스트 데이터베이스 (GUI용) |
| `cdc.rpt` | 클록 도메인 크로싱 리포트 (클록 요약 포함) |
| `cdc_detail.rpt` | 상세 CDC 리포트 |
| `cdc_design.rpt` | CDC 설계 리포트 |
| `cdc_run.log` | 세션 트랜스크립트 |
| `cdc_setting.rpt` | CDC 분석 preference 및 디렉티브 결과 |

### CDC 결과 분류

| 분류 | 설명 |
|------|------|
| **Violation** | 반드시 수정해야 하는 동기화 문제 |
| **Caution** | 올바른 복합 동기화 구조이나 추가 분석 필요 |
| **Evaluation** | 적절히 동기화된 크로싱 |
| **Waived** | 검토 완료, OK로 판정된 크로싱 |
| **Proven** | 연관된 프로토콜 어서션이 증명된 크로싱 |
| **Filtered** | 필터링된 크로싱 |

### 주요 위반(Violation) 유형 및 대응

1. **Single-bit signal does not have proper synchronizer**
   - 원인: CDC 경로에 동기화기 없음
   - 대응: 2-DFF 동기화기 추가

2. **Multiple-bit signal across clock domain boundary**
   - 원인: 다중 비트 신호가 동기화 없이 클록 도메인 경계 통과
   - 대응: 적절한 동기화 로직 추가 또는 stable 제약 지정

3. **Combinational logic before synchronizer**
   - 원인: 동기화기 앞에 조합 논리 존재 → 신호 불안정 시간 증가
   - 대응: 동기화기 위치 재조정

### 결과 관리 (Filter & Status)

**Filter**: GUI에서 CDC Checks 항목을 숨겨 현재 관심 항목에 집중할 수 있다.
- `Filter > Selected Row`: 선택 항목 필터링
- `Filter > Export/Import`: 필터 저장/불러오기
- `Filter > Clear All`: 필터 초기화

**Status**: CDC 검사 항목에 상태를 할당하여 검증 진행 추적을 한다.
- 상태 종류: Waived, Fixed, Pending, Uninspected, Bug, Verified
- `Set Status` 다이얼로그에서 Owner, Reviewer, Comments 지정 가능
- `Export Status`로 `status.tcl` 파일로 내보내고, Makefile에 포함하여 다음 분석에 전파

```tcl
# status.tcl을 Makefile에 추가하여 상태 전파
do scripts/directives.tcl; \
do scripts/status.tcl; \
cdc run -d $(DUT); \
```

---

## Chapter 3 — CDC Static in GUI Mode

### 목적/개요

Chapter 2와 동일한 CDC 정적 분석을 **GUI 기반**으로 수행하는 튜토리얼이다. 프로젝트 생성부터 분석, 결과 리뷰까지 GUI 워크플로우를 안내한다. Windows 환경에서의 사용을 중심으로 설명한다.

### 주요 절차 (Step-by-step)

#### 1단계: CDC 프로젝트 생성

```bash
qverify -idegui     # GUI 모드 실행
```

- `File > Project > New`에서 프로젝트 생성
- Project Name, Project Location, Output Directory 지정
- Tool 드롭다운에서 **CDC** 선택

#### 2단계: 소스 파일 및 제약조건 추가

Flow Navigator 사용:

1. **Add Sources**: 파일 리스트(filelist_vl 또는 filelist_vh) 선택
2. **Add Directives**: `directives.tcl` 파일 추가
3. **Project Settings**: Top Module에 `demo_top` 지정

#### 3단계: 컴파일 및 네트리스트 생성

1. Flow Navigator → **Compile Design** 클릭
2. Flow Navigator → **Create Netlist** 클릭

주의사항:
- **Unresolved Module**: 모듈 정의가 없는 경우 발생 → 해당 소스 파일을 컴파일에 포함
- **Black-boxed Module**: 내부 로직이 unknown 처리됨 → `cdc fifo` 등 디렉티브로 보완
- **Top level black-boxed (hdl-94)**: 처리 중단 에러

#### 4단계: 클록 분석

Flow Navigator → **Run Clock Analysis**

- Clocks 탭에서 Specified/Inferred 클록 확인
- Inferred 클록을 User-Specified로 변환: 우클릭 → `Edit Directive > netlist clock`

#### 5단계: 메시지 및 셋업 체크 리뷰

- **Message Viewer**: Error/Warning 확인 (hdl-41 등)
- **CDC Setup Checks**: Dead-end Register 확인
- **cdc.rpt**: 포트 도메인 정보에서 `<undef>` 포트 확인

#### 6단계: 제약조건 내보내기

Directives 탭 → 우클릭 → **Export** → Tcl 파일로 저장

#### 7단계: CDC 분석 실행

Flow Navigator → **Run CDC Analysis**

#### 8단계: 결과 리뷰 및 웨이버

- 위반 항목 선택 → `Show > Schematic > Path`로 회로도 확인
- 소스 코드와 회로도 간 크로스 프로빙: `Go To > Declaration`
- 수정 옵션:
  - RTL 수정
  - 설계 제약 추가 (`cdc signal -stable`, `cdc signal -gray_coded`, `cdc signal -mutually_exclusive` 등)
  - 웨이버 적용
- `Set Status` → Waived/Pending/Fixed 등 지정
- `Export Status`로 Tcl 파일 저장

### 핵심 명령어 (GUI 내)

| 동작 | GUI 경로 |
|------|---------|
| 프로젝트 생성 | File > Project > New |
| 소스 추가 | Flow Navigator > Add Sources |
| 컴파일 | Flow Navigator > Compile Design |
| 네트리스트 생성 | Flow Navigator > Create Netlist |
| 클록 분석 | Flow Navigator > Run Clock Analysis |
| CDC 분석 | Flow Navigator > Run CDC Analysis |
| 리포트 보기 | View > Logs & Reports |
| 오브젝트 보기 | View > Objects |
| 디렉티브 내보내기 | Directives 탭 > Export |

---

## Chapter 4 — CDC Protocol

### 목적/개요

CDC 프로토콜 검증은 정적 CDC 분석 이후에 수행하는 **동적 검증** 단계이다. 클록 도메인 경계를 넘는 서브회로가 예상되는 타이밍 속성을 위반하지 않는지(또는 위반할 수 없는지) 검증한다.

프로토콜 검증은 두 가지 병렬 분석으로 구성된다:
- **Formal Analysis**: 프로토콜 속성(property)에 대한 형식 검증
- **Simulation**: 프로토콜 어서션(assertion) 및 커버 그룹을 이용한 시뮬레이션

### 주요 절차 (Step-by-step)

#### Phase 1: 정적 CDC 분석 실행

```bash
make compile_vl    # 설계 컴파일
make cdc           # 정적 CDC 분석 → Output_Results/cdc.db 생성
```

전제조건: 정적 CDC 분석이 완전히 완료되어야 한다. 클록 도메인이 올바르게 식별되고, 동기화 문제가 해결된 상태여야 한다.

#### Phase 2: CDC 프로토콜 환경 생성

프로토콜 프로모션 디렉티브 (`scripts/protocol.tcl`):

```tcl
cdc protocol on -type cdc_fifo -check wr_ptr_stable
cdc preference protocol -cover_properties_on
```

프로모션 실행:
```bash
make promote
```

배치 세션:
```bash
qverify -od Output_Results -c -do " \
  cdc load db $(DB); \
  cdc generate protocol; \
  exit"
```

생성 결과:
- `Output_Results/cdc_protocol/cdc_protocol_bind.sv` — SVA 체커 바인드 모듈
- `Output_Results/cdc_protocol/formal/` — 형식 검증 환경
- `Output_Results/cdc_protocol/simulation/` — 시뮬레이션 환경
- `Output_Results/cdc_protocol/emulation/` — 에뮬레이션 환경

프로토콜 체커 유형:

| 체커 타입 | 설명 |
|----------|------|
| `cdc_dsel` | DMUX 동기화 프로토콜 검증 |
| `cdc_fifo` | FIFO 동기화 프로토콜 검증 (포인터 해밍 거리) |
| `cdc_glitch` | 글리치 검출 |
| `cdc_hamming_one` | 해밍 거리 1 프로토콜 검증 |
| `cdc_sync` | DFF 동기화 프로토콜 검증 |

#### Phase 3: 형식 검증 (Formal Verification)

```bash
make formal
```

형식 검증 시퀀스:
1. `assertion_compile` — 프로토콜 체커 컴파일
2. `formal_compile` — 형식 모델 컴파일 (`formal compile -d demo_top -cdc`)
3. `formal_verify` — 형식 검증 실행 (`formal verify -group cdc_protocol -timeout 2h -cdc`)

결과:
- **Proven**: 어서션이 절대 실패할 수 없음이 증명됨 (가정 없는 증명 = 유효)
- **Fired**: 반례 발견 (가정이 없으므로 false firing 가능성 있음)
- **Covered**: 커버 속성 달성

결과 상관(Annotation):
```
CDC GUI > CDC Checks 탭 > 우클릭 > Annotate Formal > propcheck.db 선택
```

#### Phase 4: 시뮬레이션

```bash
make sim_with_checkers_vl    # Verilog 시뮬레이션
```

시뮬레이션 구성 요소:
- `cdc_protocol_vlog.arg` — 체커 컴파일 인수
- `cdc_protocol_vsim_3step.arg` — vsim 인수
- `cdc_protocol_exclude_assertion.sv` — 형식 검증에서 증명된 어서션 제외
- `cdc_protocol_waveform.do` — 파형 로깅 신호

시뮬레이션 결과 상관:
```bash
make debug_sim    # cdc_sim.db 로드
```

디버그 절차:
1. **Firing 디버그**: 체커 인스턴스화 확인 → Show Firings → 파형 분석
2. **미평가(Unevaluated) 디버그**: 신호가 토글되지 않는 원인 분석
3. **커버리지 확인**: Simulation 탭에서 Coverage Goal/Coverage/Coverage % 확인

### 핵심 명령어

| 명령어 | 설명 |
|--------|------|
| `cdc load db <db>` | CDC 데이터베이스 로드 |
| `cdc generate protocol` | 프로토콜 환경 생성 (체커 + 바인드 모듈) |
| `cdc protocol on -type <type>` | 특정 프로토콜 체커 타입 활성화 |
| `cdc preference protocol -cover_properties_on` | 커버 속성 생성 활성화 |
| `cdc promote scheme` | 스킴별 프로모션 제어 |
| `cdc promote crossing` | 크로싱별 프로모션 제어 |
| `formal compile -d <top> -cdc` | CDC 프로토콜용 형식 모델 컴파일 |
| `formal verify -group <group> -timeout <time> -cdc` | CDC 프로토콜 형식 검증 |

### 핵심 개념

- **프로토콜 프로모션(Promotion)**: 정적 분석 결과에서 SVA 체커를 자동 생성하는 과정
- **바인드 모듈**: 생성된 프로토콜 체커를 DUT에 연결하는 SystemVerilog `bind` 구문
- **증명된 어서션 제외**: 형식 검증에서 Proven된 어서션은 시뮬레이션에서 `$assertoff`로 제외
- **시뮬레이션 결합 DB**: `cdc_sim.db`는 정적 분석 + 시뮬레이션 결과를 통합

---

## Chapter 5 — CDC-FX

### 목적/개요

CDC-FX(Metastability Effects Injection)는 시뮬레이션에 **메타스태빌리티 주입 로직**을 추가하여, 정상 시뮬레이션에서는 통과하지만 실제 하드웨어에서는 메타스태빌리티로 인해 실패할 수 있는 경로를 탐지하는 기법이다.

동적 CDC 분석의 두 단계:
1. CDC 프로토콜 어서션을 이용한 시뮬레이션
2. **CDC-FX 메타스태빌리티 주입을 이용한 시뮬레이션** (본 챕터)

### 주요 절차 (Step-by-step)

#### 1단계: 환경 설정

```bash
make compile_vl    # 설계 컴파일
make cdc           # 정적 CDC 분석
make promote       # CDC-FX 프로모션
```

FX 프로모션 세션:
```bash
qverify -od Output_Results -c -do " \
  cdc load db $(DB); \
  do scripts/cdc_fx.tcl; \
  cdc generate fx; \
  exit"
```

#### 2단계: CDC-FX 시뮬레이션 실행

```bash
make sim_with_checkers_vl
```

#### 3단계: 결과 분석

```bash
make debug_sim     # cdc_sim.db 로드
```

### 핵심 명령어

| 명령어 | 설명 |
|--------|------|
| `cdc generate fx` | CDC-FX 환경 생성 (메타스태빌리티 주입 로직 + 체커) |
| `cdcfx check` | cdc_fx 체커의 특정 검사 활성화 |

### CDC-FX 체커 검사(Check) 유형

| 검사 | 기본값 | 설명 |
|------|--------|------|
| `cdc_fx` | multi_bits, dmux, no_sync 등에 On | 메타스태빌리티 주입 시 firing |
| `glitch_caught` | Off | 메타스태빌리티 주입으로 rx_reg 출력에 글리치 발생 감지 |
| `glitch_swallowed` | Off | 메타스태빌리티 주입으로 글리치가 사라짐 감지 |

### CDC-FX 커버리지

각 `cdc_fx` 체커는 다음 통계/커버리지를 수집한다:

- **Metastable Cycles**: 메타스태빌리티가 주입된 사이클 수
- **Delayed Transitions**: 지연된 전이 수
- **Bits Inverted**: 반전된 비트 수
- **All Bits Metastable**: 모든 비트가 메타스태빌리티를 경험했는지 (코너 케이스)
- **Metastable Bits Bitmap**: 어떤 비트가 반전되었는지

커버리지 목표: `Evaluations(1) + All Bits Metastable(비트 수)` = 전체 커버리지 목표

### 핵심 개념

- **End-to-end 테스트 실패**: 프로토콜 어서션 시뮬레이션에서는 통과했지만, FX 주입 시뮬레이션에서 실패 → 해당 블록이 메타스태빌리티에 취약함을 의미
- **재수렴(Reconvergence) 오류 탐지**: FX 주입이 FIFO 인스턴스에서 비교 실패를 유발 → 모듈의 메타스태빌리티 내성(tolerance) 재설계 필요
- **메타스태빌리티 미주입 사유**: Tx/Rx 클록 에지가 메타스태빌리티 윈도우 내에서 정렬되고, Tx 값이 변경되었으며, Rx 로드 인에이블이 비활성인 경우

---

## Chapter 6 — CDC Hierarchical Top-down Analysis

### 목적/개요

대규모 복잡 설계에서 CDC 계층적 분석(Top-down)은 블록 수준의 설계가 완전히 개발되기 전에 **최상위 CDC 이슈를 조기에 발견**할 수 있다. SoC/IP 설계에 특히 유리하다.

핵심 개념:
- **HDM (Hierarchical Data Model)**: 블록 내부 CDC 정보를 추상화한 이진 데이터베이스. 블랙박스와 달리 "화이트박스"로, CDC 크로싱이 가시적이다.
- Top-down 분석에 필요한 것: 최상위 설계, 최상위 제약조건, 블록 목록

### 주요 절차 (Phase별)

#### Phase 1: 설계 셋업 검증

```bash
make compile_vl       # 설계 컴파일
make cdc              # 클록 분석 및 셋업 검증
make debug_flat       # GUI에서 셋업 디버그
```

셋업 검증 항목:
- 비동기 클록 그룹 확인
- I/O 포트 클록 도메인 할당 확인
- Dead-end Register 확인
- 메시지/에러 리뷰 (hdl-41 등)

제약조건은 SDC 파일(`demo_top.sdc`) 또는 Tcl 디렉티브(`directives.tcl`)로 지정한다.

#### Phase 2: 블록 분석 설정

```bash
make hdm_setup
```

배치 세션:
```bash
qverify -od Output_Results_hdm -c -do " \
  sdc load scripts/demo_top.sdc; \
  do scripts/directives.tcl \
  hier block generic_fifo_dc_gray; \
  cdc run -d demo_top; \
  cdc generate report cdc_detail.rpt; \
  exit"
```

`hier block` 디렉티브로 추상화할 서브모듈을 지정한다. 실행 결과 자동 생성되는 파일:

- `Output_Results_hdm/hcdc_run_setup/constraints/` — 블록/최상위 제약조건 파일
- `Output_Results_hdm/hcdc_run.Makefile` — 자동 생성된 계층적 실행 스크립트

#### Phase 3: CDC 계층적 분석 실행

```bash
make run_hdm_analysis
```

자동 생성된 `hcdc_run.Makefile`이 수행하는 작업:
1. 각 블록에 CDC 분석 실행 → HDM 추상 모델 생성
2. HDM을 포함하여 최상위 CDC 분석 실행

#### Phase 4: 결과 리뷰 및 디버그

블록 수준 결과:
```bash
qverify Output_Results_hdm/hcdc_run/generic_fifo_dc_gray/cdc.db &
```

최상위 결과:
```bash
make debug_hdm
# qverify Output_Results_hdm/hcdc_run/demo_top/cdc.db &
```

HDM의 장점: 회로도에서 HDM 블록 내부의 CDC 크로싱이 가시적이다 (블랙박스 대비 투명성).

### 핵심 명령어

| 명령어 | 설명 |
|--------|------|
| `hier block <module>` | 계층적 분석을 위한 블록 지정 |
| `sdc load <sdc_file>` | SDC 제약조건 파일 로드 |
| `cdc run -d <top> -hcdc` | 블록 수준 계층적 CDC 분석 (HDM 생성) |
| `cdc load hierdb <hierdb_file>` | 블록 HDM 데이터베이스 로드 |

### 핵심 개념

- **계층적 CDC 분석은 정적 분석만 지원** — 프로토콜 어서션 프로모션이나 CDC-FX 주입은 불가
- **자동 스크립트 생성**: `hdm_setup` 실행 시 블록/최상위 제약조건과 실행 Makefile이 자동 생성
- **병렬 IP 블록 분석 가능**: 블록별 독립 분석 후 최상위 통합
- **성능 이점**: flat 분석 대비 메모리 사용량 감소 및 분석 속도 향상

---

## Chapter 7 — CDC Hierarchical Bottom-up Analysis

### 목적/개요

CDC 계층적 Bottom-up 분석은 **IP 기반 SoC 설계**에 최적화된 플로우이다. IP 블록이 최상위 설계보다 먼저 준비되는 경우에 적합하다. IP 팀이 블록 수준 CDC 분석을 실행하고 HDM을 생성하여 인테그레이션 팀에 전달하면, 인테그레이션 팀이 HDM을 사용하여 최상위 CDC 분석을 수행한다.

Top-down과의 차이점:
- Bottom-up에서는 **블록 수준 제약조건이 자동 생성되지 않음** → IP 팀이 직접 제공해야 함
- 블록 수준 CDC 분석 셋업에 setup 및 clock 분석 단계가 포함되어야 함

### 주요 절차 (Phase별)

#### Phase 1: 설계 셋업 검증

```bash
make compile_vl    # 설계 컴파일 및 시뮬레이션 확인
make cdc           # CDC 분석으로 셋업 검증
make debug_flat    # GUI에서 셋업 디버그
```

검증 항목:
- CDC Setup Checks (Dead-end Register 등)
- Policy Checks
- 비동기 클록 그룹 확인
- 메시지 리뷰

#### Phase 2: 블록 셋업 검증 및 분석

```bash
make cdc_block     # 블록 수준 CDC 계층적 분석
make debug_block   # 블록 수준 결과 디버그
```

블록 분석 배치 세션:
```bash
qverify -od Output_Results/block1 -c -do " \
  do scripts/directives.tcl; \
  cdc run -d generic_fifo_dc_gray -hcdc; \
  cdc generate report cdc_detail.rpt; \
  exit"
```

`-hcdc` 파라미터가 블록의 HDM을 생성한다.

블록 수준 결과 리뷰:
- 클록 그룹 검증 (Specified/Inferred)
- 회로도를 통한 클록 트리 확인

#### Phase 3: 최상위 CDC 계층적 분석

```bash
make cdc_top       # 최상위 CDC 분석
make debug_top     # 최상위 결과 디버그
```

최상위 분석 스크립트 (`cdchier.run.tcl`):
```tcl
cdc load hierdb Output_Results/block1/hcdc_generic_fifo_dc_gray.hierdb
cdc run -d demo_top
```

최상위 결과 리뷰:
- Design 탭에서 계층 구조 확인
- HDM Developer 창에서 HDM 내부 정보 확인
- CDC Checks 탭에서 위반 사항 리뷰
- 회로도에서 HDM 내부 가시성 확인 (화이트박스 투명성)

### 핵심 명령어

| 명령어 | 설명 |
|--------|------|
| `cdc run -d <block> -hcdc` | 블록 수준 계층적 분석 (HDM 생성) |
| `cdc load hierdb <hierdb_file>` | 블록 HDM 로드 |
| `cdc run -d <top>` | 최상위 분석 (HDM 포함) |

### 핵심 개념

- **IP 팀 책임**: 블록 수준 제약조건 직접 작성 및 HDM 생성
- **인테그레이션 팀 책임**: 최상위 제약조건 작성 및 HDM 통합 분석
- **HDM Developer**: GUI에서 HDM 내부 정보(명령, 값, 포트)를 확인하고 디렉티브를 추가/수정할 수 있는 도구
- **화이트박스 vs 블랙박스**: HDM은 CDC 크로싱에 대한 가시성을 제공하여 블랙박스보다 정확한 분석 가능

---

## Chapter 8 — RDC

### 목적/개요

RDC(Reset Domain Crossing) 분석은 리셋 도메인 크로싱으로 인한 메타스태빌리티 및 신호 재수렴 이슈를 탐지한다. CDC 분석이 클록 도메인 간 이슈를 다루는 것처럼, RDC는 **리셋 도메인 간 이슈**를 다룬다.

RDC로 확인할 수 있는 리셋 특성:
- 동기/비동기 리셋 식별
- 리셋 트리 정확성
- 리셋 도메인별 레지스터 매핑
- 리셋 도메인 간 데이터 경로 크로싱
- 리셋이 데이터로 사용되는 경우
- 리셋 도메인 크로싱의 메타스태빌리티 허용 범위

전제조건: **CDC 분석을 먼저 실행**하여 클록 그룹이 올바른지 확인한 후 RDC를 수행한다.

### 주요 절차 (Step-by-step)

#### 1단계: RDC 환경 설정

CDC 환경에서 이전할 설정:
- 프런트엔드 제약: black box, constants, netlist constraints
- CDC 제약: clock domains, stable domains, port domains
- UPF 파일

RDC 전용 디렉티브 (`scripts/directives.tcl`):

```tcl
# 클록 정의 (CDC에서 이전)
netlist clock cpu_clk_in -period 50
netlist clock core_clk_in -period 60
netlist clock mac_clk_in -period 50

# 상수 정의
netlist constant scan_mode 1'b0

# 비동기 포트 정의
netlist port domain rst -async
netlist port domain clr -async

# 리셋 정의
netlist reset clr -async
netlist reset rst -async

# RDC 제약 및 preference
rdc preference check -comparator
rdc on *
```

#### 2단계: 설계 컴파일 및 리셋 리포트 생성

```bash
make compile_vl    # 설계 컴파일
make reset         # 리셋 리포트 생성
```

리셋 리포트 생성 배치 세션:
```bash
qverify -od Output_Results -c -do " \
  do scripts/directives.tcl; \
  rdc run -d $(DUT) -report_reset; \
  rdc generate tree -reset reset_tree.rpt; \
  rdc generate report rdc_report.rpt; \
  exit"
```

#### 3단계: RDC 분석 실행

```bash
make rdc
```

배치 세션:
```bash
qverify -od Output_Results -c -do " \
  do scripts/directives.tcl; \
  rdc run -d $(DUT); \
  rdc generate tree -reset reset_tree.rpt; \
  rdc generate report rdc_report.rpt -custom_sync; \
  exit"
```

#### 4단계: GUI 디버그

```bash
make debug    # qverify Output_Results/rdc.db &
```

#### 5단계: 리셋 오더링을 통한 메타스태빌리티 감소

```bash
make ordering
```

리셋 오더링 디렉티브(`rdc order assert`, `rdc order deassert`)를 사용하여 리셋 assertion/deassertion 순서를 지정한다. 올바른 순서가 지정되면 일부 Violation이 Evaluation으로 변경된다.

원리: 소스 플립플롭이 비동기 리셋으로 리셋되지만 목적지 플립플롭은 리셋되지 않는 경우 → 리셋 순서를 지정하여 목적지 플립플롭을 먼저 리셋 상태로 유지 → RDC 경로가 기능적으로 유효해짐.

### 핵심 명령어

| 명령어 | 설명 |
|--------|------|
| `rdc run -d <top>` | RDC 분석 실행 |
| `rdc run -d <top> -report_reset` | 리셋 리포트 모드로 RDC 실행 |
| `rdc generate tree -reset <file>` | 리셋 트리 리포트 생성 |
| `rdc generate tree -clock <file>` | 클록 트리 리포트 생성 |
| `rdc generate report <file>` | RDC 상세 리포트 생성 |
| `rdc generate report <file> -custom_sync` | 커스텀 동기화 포함 RDC 리포트 |
| `rdc load db <db>` | RDC 데이터베이스 로드 |
| `rdc ordering` | 리셋 오더링 디렉티브 |
| `rdc order assert` | 리셋 assertion 순서 지정 |
| `rdc order deassert` | 리셋 deassertion 순서 지정 |
| `rdc preference check -comparator` | Comparator 검사 preference |
| `rdc preference tree` | 리셋 트리 preference |
| `rdc preference resetcheck` | 리셋 검사 preference |

### 주요 결과물/산출물

| 파일 | 설명 |
|------|------|
| `rdc.rpt` | 기본 RDC 리포트 (설계, 클록, 리셋, 클록/리셋 매핑, 결과 등 8개 섹션) |
| `rdc.db` | RDC 데이터베이스 (리셋 트리, 클록 트리, RDC 크로싱 정보) |
| `rdc_setting.rpt` | RDC 스킴 severity 및 on/off 설정 |
| `rdc_design.rpt` | RDC 설계 리포트 |
| `reset_tree.rpt` | 리셋 트리 리포트 (User-Specified, Inferred, Ignored) |
| `rdc_report.rpt` | RDC 상세 리포트 |

### RDC 결과 분류

| 분류 | 설명 |
|------|------|
| **Violation** | 수정 필요한 리셋 도메인 크로싱 문제 |
| **Caution** | 주의가 필요한 리셋 관련 이슈 |
| **Evaluation** | 적절히 처리된 리셋 크로싱 |
| **Resolved** | Waived 또는 Verified 상태의 항목 |

### RDC Violation 유형

| 위반 유형 | 설명 |
|----------|------|
| Reset domain crossing from areset to areset | 비동기 리셋 → 비동기 리셋 크로싱 |
| Reset domain crossing from areset to non-reset | 비동기 리셋 → 비리셋 크로싱 |
| Reset domain crossing from areset to sreset | 비동기 리셋 → 동기 리셋 크로싱 |
| Reset CDC has no synchronizer | 리셋 CDC에 동기화기 없음 |
| Combinational logic before RDC/CDC synchronizer | RDC/CDC 동기화기 앞에 조합 논리 |

### 결과 관리 (Filter & Status)

CDC와 동일한 방식으로 Filter 및 Status 기능을 사용한다:

- **Filter**: `Filter > Selected Row`, `Filter > By Column`, `Filter > Export/Import`
  - `By Column` 필터는 Severity, Check, Tx/Rx 신호, 리셋, 클록, 모듈 등을 조합하여 정밀 필터링 가능
  - `Include Matches` / `Exclude Matches` 옵션
  - `Apply each filter to the result of the preceding filter` 체크로 누적 필터링
- **Status**: Waived, Fixed, Pending, Uninspected, Bug, Verified
  - `Export Status`로 `status.tcl` 파일 생성
  - Makefile에 `do scripts/status.tcl;` 추가하여 분석 실행 간 상태 전파

### 핵심 개념

- **리셋 도메인 크로싱 원리**: 동일 클록 도메인 내 서로 다른 리셋 신호, 또는 서로 다른 클록+리셋 도메인 간 경로에서 메타스태빌리티 발생 가능
- **리셋 오더링**: assertion/deassertion 순서를 제약하여 리셋 도메인 크로싱을 기능적으로 유효하게 만듦
- **CDC와 RDC의 관계**: RDC는 CDC 분석을 기반으로 하며, CDC 리셋 경로를 추가로 탐지. CDC를 먼저 수행한 후 RDC를 실행해야 함
- **RDC 미지원 항목**: HDM 동기화 정의, CDC Waiver(cdc report crossing/item/path)는 RDC에서 미지원

---

## 전체 워크플로우 요약

```
1. CDC Static Analysis (Ch.2/3)
   ├── 환경 셋업 → 클록 리포트 → 전체 분석 → GUI 디버그
   └── Filter/Status로 결과 관리

2. CDC Protocol Verification (Ch.4)
   ├── 정적 분석 DB 기반 프로토콜 프로모션
   ├── 형식 검증 (Formal) → Proven/Fired
   └── 시뮬레이션 → Firing/Unevaluated/Coverage 분석

3. CDC-FX Metastability Injection (Ch.5)
   ├── FX 프로모션 → FX 체커 생성
   └── 시뮬레이션 → End-to-end 테스트 실패 탐지

4. CDC Hierarchical Analysis (Ch.6/7)
   ├── Top-down: 최상위 → 블록 HDM 자동 생성 → 통합 분석
   └── Bottom-up: 블록 HDM 수동 생성 → 최상위 통합 분석

5. RDC Analysis (Ch.8)
   ├── CDC 완료 후 RDC 환경 셋업
   ├── 리셋 트리/리포트 생성 → RDC 분석
   ├── 리셋 오더링으로 Violation 감소
   └── Filter/Status로 결과 관리
```

---

## 공통 Tcl 디렉티브 레퍼런스

| 디렉티브 | 용도 |
|----------|------|
| `netlist clock <signal> -period <value>` | 클록 정의 |
| `netlist constant <signal> <value>` | 상수 값 고정 |
| `netlist reset <signal> -async/-sync` | 리셋 정의 |
| `netlist port domain <port> -clock <clk>` | 포트 도메인 지정 |
| `netlist port domain <port> -async` | 비동기 포트 지정 |
| `netlist blackbox <module>` | 블랙박스 모듈 지정 |
| `cdc scheme on -fifo -handshake` | FIFO/Handshake 스킴 활성화 |
| `cdc reconvergence on` | 재수렴 분석 활성화 |
| `cdc signal -stable` | 안정 신호 지정 |
| `cdc signal -gray_coded` | Gray 코드 신호 지정 |
| `cdc custom sync` | 커스텀 동기화기 식별 |
| `cdc report item` | CDC 결과 항목 웨이버 |
| `hier block <module>` | 계층적 분석 블록 지정 |
| `sdc load <file>` | SDC 제약조건 로드 |

## 공통 qverify 실행 패턴

```bash
# 배치 분석
qverify -od <output_dir> -c -do "<script>"

# GUI 디버그
qverify <db_path> &

# GUI 모드 (프로젝트 기반)
qverify -idegui
```
