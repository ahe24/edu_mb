# Day 05 · Day 06 슬라이드 상세 설계 & 구현 지침서

> **범위**: FPGA 검증 과정 Week 3 — "정적 분석: 논리 구조 및 설계 결함 추출"
> **대상 회차**: Day 05 (합성 불가 구문 · Sim-Synth Mismatch) · Day 06 (잠재적 설계 오류 식별)
> **위치**: `src/app/fpga/day05/page.tsx`, `src/app/fpga/day06/page.tsx`, `src/components/fpga/day05/*`, `src/components/fpga/day06/*`

---

## 0. 전역 규칙 (반드시 준수)

### 0.1 문체 규칙 (최우선)
- 존대 종결어 **전면 금지**: "합니다", "입니다", "됩니다", "습니다", "시오", "세요" **사용 금지**
- 허용 어미: "~한다", "~이다", "~된다", "~함", "~임", "~필요", "~주의", 명사·키워드 종결
- 개조식 원칙: 한 bullet = 핵심 키워드 + 짧은 보조구
- 서술형 금지 예시
  - ❌ "합성 불가 구문을 검출합니다" → ⭕ "합성 불가 구문 검출"
  - ❌ "실습을 진행해 주세요" → ⭕ "실습 수행 · 결과 리포트 저장"
  - ❌ "주의가 필요합니다" → ⭕ "주의 필요" / "주의 요함"

### 0.2 용어 규칙
- **safety-critical** 공통 용어 우선 — 원전 한정 용어 배제
- 대상 도메인 예시: 원전 I&C, 방산 EO/IR, 항공 FCC, 우주 OBC
- 표준 언급: DO-254 (항공), IEC 60880/62566 (원전), MIL-HDBK-454 (방산), ECSS-Q-ST-60 (우주) — 필요 시 병기

### 0.3 디자인 규칙
- 색상 토큰: `FPGA` 상수(`FpgaSlideStyles.ts`) 우선 사용
- Day 05 포인트 컬러: **`#C05621` (Burnt Orange)** — "위험 패턴" 경고 톤
- Day 06 포인트 컬러: **`#6B46C1` (Deep Purple)** — "잠재 오류" 분석 톤
- 카드·도형: `shadow.card`/`shadow.cardHover` 적용, `border-radius: 12~16px`
- 레이아웃: 여백 과다 금지 — `maxWidth: 1180px` 범위 내 균형 배치
- 입체감: 그라디언트 + 그림자 + hover translateY(-3px) 조합

### 0.4 Questa 도구 명령 (정확성 필수)
- 실행 파일: **`qverify`** (존재하지 않는 명령: `questa_lint`, `qlint`)
- 분석: `lint run -d <top_module>` (금지: `lint analyze`, `lint check`, `lint start`)
- 컴파일: `vlog` (Verilog) / `vcom` (VHDL) — 금지: `lint compile`
- Batch: `qverify -c -do "commands"` 또는 `qverify -c -do script.tcl`
- GUI 디버깅: `qverify <output_dir>/lint.db`
- 레퍼런스 원본: 루트의 `questa_lint_reference.md`

### 0.5 DO-254 룰셋 적용 (본 회차 핵심 전제)
- 고객 대부분 DO-254 인증 대상 → 본 과정의 기본 methodology = **`standard` + goal `DO-254`**
- Tcl 적용: `lint methodology standard -goal DO-254`
- DO-254 goal 활성 시 동작
  - 개별 lint check 이름 대신 **alias 기반 violation 그룹화** (CP · DR · SS)
  - 표준 규정 severity 자동 오버라이드 — 프로젝트에서 severity 임의 하향 금지
- 3 카테고리 정의 (Day 03 `DO254MappingSlide.tsx` 기준)

| Code | 카테고리 | 정의 | 본 회차 관련성 |
|---|---|---|---|
| **CP** | Coding Practices | 코딩 스타일·할당 관행 — sim/synth 불일치, FSM 안전성, 비트폭 정합성 | Day 05·06 주 카테고리 |
| **DR** | Design Reviews | 문서·명명·구조 리뷰 기준 | 본 회차 미다룸 |
| **SS** | Safe Synthesis | 합성 안전성 — latch, case 완전성, multi-driver, combo loop | Day 05·06 주 카테고리 |

- 본 설계서의 **lint check 매핑은 반드시 alias(CP·DR·SS 코드) + Questa check name 두 축 병기**
- 슬라이드 내 violation 명칭 우선순위
  1. DO-254 alias (예: `SS4 — 래치 추론 금지`)
  2. 괄호로 Questa check id 병기 (예: `SS4 (latch_inferred)`)
- alias 체계 원본: `src/components/fpga/day03/DO254MappingSlide.tsx` 의 `rules` 배열

### 0.6 공통 컴포넌트 재사용
- `FpgaRevealWrapper` — 회차 전체 래퍼
- `SlideHeader` — 슬라이드 상단 타이틀 블록
- `InfoCard` — 개념 카드
- `KeywordTag` — 키워드 pill
- `TimelineItem` — 단계별 흐름
- `SlideModal` — 상세 내용 팝업
- `ToolImage` — Questa 스크린샷 배치

---

## 1. Day 05 — 합성 불가 구문 · Sim-Synth Mismatch 검출

### 1.1 회차 학습 목표
- **L1 · 인지** — 합성 가능/불가 구문 경계 식별
- **L2 · 이해** — sim/synth mismatch 유발 구조 분류 (race, delay, procedural-only 구문)
- **L3 · 적용** — Questa Lint Semantic 계열 체크로 실제 RTL에서 mismatch 패턴 검출
- **L4 · 분석** — 검출 결과의 우선순위·waiver 근거 판단
- **L5 · safety-critical 관점** — sim-synth 불일치가 시험 커버리지 무효화로 이어지는 감사 리스크 이해

### 1.2 이어받는 맥락
- Day 03: Structural·FSM·Clock 룰 → 코딩 관점
- Day 04: 정책 아키텍처·Waiver·감사 추적 → 운영 관점
- **Day 05**: 실제 "회로가 동작하지 않는" 구문을 lint 관점에서 검출 → 설계 품질 관점
- Day 06 연결: "문법은 합성되지만 회로가 틀리는" 잠재 오류로 확장

### 1.3 슬라이드 구성 (총 10장, 1.5~2시간)

| # | 슬라이드 파일 | 타이틀 | 유형 | 시간 |
|---|---|---|---|---|
| 1 | `TitleSlide.tsx` | Day 05 타이틀 | 표지 | 2분 |
| 2 | `AgendaSlide.tsx` | 학습 흐름 | 네비 | 3분 |
| 3 | `WhyMismatchSlide.tsx` | sim-synth mismatch 리스크 | 개념 | 10분 |
| 4 | `UnsynthCatalogSlide.tsx` | 합성 불가 구문 카탈로그 (탭 탐색기) | 인터랙티브 | 20분 |
| 5 | `BlockingNonBlockingSlide.tsx` | Blocking vs Non-Blocking 오용 (CP15·CP17·CP18) | 대조 | 15분 |
| 6 | `RaceConditionSlide.tsx` | Race Condition 4 패턴 (SS6·SS3) | 패턴 | 15분 |
| 7 | `Do254CheckMapSlide.tsx` | DO-254 CP·SS 체크 매핑 | 표 | 10분 |
| 8 | `TriageWorkflowSlide.tsx` | Mismatch 검출 → Triage → Waiver 흐름 | 플로우 | 10분 |
| 9 | `LabSlide.tsx` | 실습 — broken_rtl 검출 케이스 (DO-254 goal) | 실습 | 25분 |
| 10 | `QnASlide.tsx` | Day 05 정리 · Day 06 예고 | 마무리 | 10분 |

### 1.4 슬라이드별 상세 설계

#### Slide 3 · `WhyMismatchSlide.tsx` — sim-synth mismatch 리스크
- **목적**: "왜 Day 05가 필요한가"를 safety-critical 감사 관점에서 제시
- **레이아웃**: 2단 그리드 (좌: 시나리오 서술, 우: 3개 영향 카드)
- **좌측 서술 (개조식)**
  - "simulation 통과 → synthesis 이후 거동 상이 → 보드 불량"
  - "시험 커버리지 100% 달성했어도 실제 로직과 다른 대상 검증 → 감사 무효"
  - "DO-254 DAL-A / IEC 60880 Category A 등급에서 치명적 결함"
- **우측 3 카드** (`InfoCard`, 포인트 컬러 `#C05621`)
  - `카드 1 — 검증 무효` — "시뮬레이션 대상과 합성 결과 불일치 → V&V 증빙 불인정"
  - `카드 2 — 설계 재작업` — "실기 장비에서만 발견 → 수개월 일정 손실"
  - `카드 3 — 감사 지적` — "근본 원인 미식별 시 CAPA 반복 지적"
- **디자인 포인트**
  - 카드 상단에 위험도 뱃지 (`HIGH` / `CRITICAL`)
  - 카드 배경: `linear-gradient(135deg, #C0562108, #C0562103)`
  - 그림자: `shadow.card`, hover 시 `shadow.cardHover`

#### Slide 4 · `UnsynthCatalogSlide.tsx` — 합성 불가 구문 카탈로그
- **목적**: 합성 불가 구문을 카테고리별로 탐색 가능한 인터랙티브 뷰어 제공
- **레이아웃**: 상단 탭 4개 + 하단 상세 패널 (Day 03 `StructuralFsmRulesSlide` 패턴 재사용)
- **탭 카테고리** — DO-254 관점 주의사항 병기

| 탭 | 라벨 | 대표 구문 | DO-254 관점 | 색상 |
|---|---|---|---|---|
| A | Procedural-Only | `initial`, `final`, `fork-join`, `event`, `wait` | testbench-only 허용 · RTL 사용 시 CP 위반 | `#C05621` |
| B | Delay / Time | `#n`, `@(posedge)` 부적절 사용, `$time`, `##n` | CP15 연관 · 합성 무시되어 sim-synth 불일치 | `#DD6B20` |
| C | System Task | `$display`, `$monitor`, `$random`, `$finish` | testbench-only · RTL 존재 시 CP 위반 | `#B7791F` |
| D | Simulation Artifact | `force`, `release`, `real`, dynamic array | SS1 연관 · 묵시적 로직 생성 가능 | `#975A16` |

- **각 규칙 데이터 구조** (컴포넌트 내 TS type)
  ```ts
  type UnsynthRule = {
    id: string;                    // ex: "UNS-A-01"
    category: 'A' | 'B' | 'C' | 'D';
    syntax: string;                // ex: "initial begin ... end"
    synthStatus: '완전 불가' | '조건부' | 'testbench-only';
    problem: string;               // 개조식 2~3줄
    fixExample: { bad: string; good: string };
    do254Alias: string | null;     // ex: "CP15" · null이면 DO-254 goal의 unsynth 일괄 체크
    lintCheck: string;             // ex: "nonblocking_assign_and_delay_in_always"
  };
  ```
- **최소 수록 개수**: 카테고리당 4~6건, 총 20건 내외
- **탭 전환 애니메이션**: fade-in 200ms, 현재 탭 하단 underline `#C05621`

#### Slide 5 · `BlockingNonBlockingSlide.tsx` — Blocking vs Non-Blocking 오용
- **목적**: `=` vs `<=` 오용이 mismatch를 만드는 정확한 메커니즘 전달 · DO-254 CP15·CP17·CP18 집중
- **레이아웃**: 상단 비교 테이블 + 하단 4 패턴 박스
- **비교 테이블 필드**
  - 연산자 / 평가 시점 / 용도 / 오용 시 결과 / DO-254 alias
- **4 패턴 박스** (각 박스: 좌 "위험 코드" / 우 "수정 코드" + 상단 alias 뱃지)
  - **P1 · CP17 — Sequential `=` 금지**
    - 순차 블록(`always @(posedge clk)`)에서 `=` 사용 → 시뮬레이션 경쟁
    - Questa check: `blocking_assign_in_seq_block`
    - DO-254 severity: **Error** (waiver 금지)
  - **P2 · CP15 — Combo 블록 NB 금지**
    - 조합 블록(`always @(*)`)에서 `<=` 사용 → 불필요 지연 · 합성 회로와 불일치
    - Questa check: `nonblocking_assign_in_combo_block`, `nonblocking_assign_and_delay_in_always`
    - DO-254 severity: **Error**
  - **P3 · SS6 — 중복 구동 금지**
    - 단일 신호 다중 블록 드라이브 → multi-driver 합성 오류
    - Questa check: `multi_driven_signal`
    - DO-254 severity: **Error** (waiver 금지)
  - **P4 · CP18 — Blocking/NB 혼용 금지**
    - 동일 `always` 블록에서 `=`/`<=` 혼용 → pipeline data hazard
    - Questa check: `assigns_mixed`
    - DO-254 severity: **Warning** (정당화 후 waiver 가능)
- **코드 블록**: 기존 `CodeBlock.tsx` 재사용, syntax highlight Verilog
- **뱃지 스타일**: alias 코드는 `#E53E3E` 배경(Error) / `#E8913A` 배경(Warning)

#### Slide 6 · `RaceConditionSlide.tsx` — Race Condition 4 패턴
- **목적**: race condition 4유형을 회로 다이어그램 + 파형으로 시각화 · DO-254 SS3·SS6 매핑
- **레이아웃**: 상단 2×2 그리드 (4 패턴) + 하단 공통 교훈 배너
- **4 패턴** (각 패턴에 DO-254 alias 뱃지 상단 고정)
  - **R1 · CP8 — 감도 리스트 불완전성**
    - `always @(*)` 를 쓰지 않고 수동 리스트 누락 → 순서 의존성
    - Questa check: `sensitivity_list_var_missing`
  - **R2 · CP (unsynth)**
    - `initial` 블록 순서 비결정성 · RTL 사용 금지
    - Questa check: unsynth 카테고리 일괄 처리
  - **R3 · SS6 — 중복 구동 금지**
    - continuous assign + procedural assign 동시 구동 충돌
    - Questa check: `multi_driven_signal`
  - **R4 · SS3 — 조합 피드백 루프 금지**
    - zero-delay feedback loop
    - Questa check: `combo_loop`, `combo_loop_with_latch`
- **각 패턴 카드 구성**
  - 상단: alias 뱃지(`SS3` 등, Error 컬러 `#E53E3E`) + 패턴명
  - 좌중: 코드 스니펫 (6~10줄)
  - 우중: 회로 SVG (mini waveform 3~4 신호)
  - 하단: "sim 결과 vs synth 결과" 불일치 요약
- **하단 배너**: "race condition = 시뮬레이터 구현 의존 거동 → DO-254 V&V 증빙 불가"

#### Slide 7 · `Do254CheckMapSlide.tsx` — DO-254 CP·SS 체크 매핑
- **목적**: Day 05 다룬 패턴 → DO-254 alias + Questa check id 매핑표 제공
- **레이아웃**: 상단 카테고리 필터 칩(CP / SS / All) + 표 (6열)
- **표 컬럼**: `DO-254 alias` / `한글 라벨` / `Questa Check ID` / `Severity` / `Day 05 분류` / `Waiver 지침`
- **최소 10건 수록** (Day 03 DO254MappingSlide의 CP·SS 항목 중 Day 05 관련만 필터)

| alias | 한글 라벨 | Questa check | Sev | Day 05 분류 | Waiver |
|---|---|---|---|---|---|
| **CP15** | Combo 블록 NB 금지 | `nonblocking_assign_in_combo_block`, `nonblocking_assign_and_delay_in_always` | E | Slide 5-P2 | 금지 |
| **CP17** | Sequential `=` 금지 | `blocking_assign_in_seq_block` | E | Slide 5-P1 | 금지 |
| **CP18** | Blocking/NB 혼용 금지 | `assigns_mixed` | W | Slide 5-P4 | 정당화 후 허용 |
| **CP8** | 완전한 감도 리스트 | `sensitivity_list_var_missing` | W | Slide 6-R1 | 수정 권장 |
| **SS3** | 조합 피드백 루프 금지 | `combo_loop`, `combo_loop_with_latch` | E | Slide 6-R4 | 금지 |
| **SS6** | 중복 구동 금지 | `multi_driven_signal` | E | Slide 5-P3, 6-R3 | 금지 |
| **SS1** | 묵시적 로직 금지 | `feedthrough_path`, `tristate_inferred` | W | Slide 4-D | 검토 후 허용 |
| (unsynth) | 합성 불가 구문 | DO-254 goal 일괄 처리 | E | Slide 4-A·B·C | testbench-only 제외 금지 |
| **SS17** | 미구동 신호 금지 | `undriven_signal` | E | Slide 4 부차 | 금지 |
| **SS18** | 레지스터 제어성 확보 | `flop_without_control` | W | Slide 4 부차 | 설계 리뷰 |

- **배경**: `bgAlt` 교대 행 · Severity E 행에 좌측 bar `#E53E3E` / W 행에 `#E8913A`
- **필터 동작**: 칩 클릭 시 해당 alias 카테고리만 표시 (useState 기반)

#### Slide 8 · `TriageWorkflowSlide.tsx` — 검출 → Triage → Waiver 흐름
- **목적**: Day 04 waiver 체계 위에서 DO-254 goal 기반 결과 분류 절차 제시
- **레이아웃**: 좌→우 5단계 수평 플로우 (`TimelineItem` 재사용)
- **5 단계**
  1. `lint methodology standard -goal DO-254` 설정 · `lint run -d top_module` 수행
  2. 결과 ↦ alias 카테고리 필터 (`CP*` / `SS*`)
  3. Severity = Error (DO-254 강제) → 즉시 수정
  4. Severity = Warning → 설계 리뷰 → 수정 or waiver 근거 작성 (ASCII REASON 필드)
  5. baseline 재지정 · CI 업데이트
- **하단 체크리스트 — Waiver 불가 alias 5종 경고 박스**
  - `CP15` · `CP17` — sim-synth mismatch 유발
  - `SS3` — combo loop
  - `SS6` — multi-driver
  - `SS17` — undriven signal
  - 공통 근거: "DO-254 DAL-A/B 등급에서 해당 위반 존재 시 인증 불가"

#### Slide 9 · `LabSlide.tsx` — 실습 체크리스트
- **실습 목표**: DO-254 goal 활성 상태에서 `broken_rtl/` 프로젝트 전 CP·SS 위반 검출 · 수정 · 감사 리포트 생성
- **준비물**
  - 제공 RTL: `broken_rtl.v` (CP15·CP17·CP18·SS3·SS6·SS17 · unsynth 구문 포함 12개 결함)
  - `base_goal.tcl` (Day 04 결과물) — 내부에 `lint methodology standard -goal DO-254` 포함 버전
  - Questa 2024.1 이상
- **Task 체크리스트 (6 태스크)**
  - T1 — `vlog broken_rtl.v` · 컴파일 에러 여부 확인
  - T2 — `qverify -c -do "do base_goal.tcl; lint run -d broken_rtl; exit"` 실행 · `lint.db` 생성 확인
  - T3 — GUI 디버깅 `qverify lint_output/lint.db` 기동 · **alias 기반 탐색창**에서 CP·SS 그룹 필터
  - T4 — 각 violation을 DO-254 alias (CPxx · SSxx) + Day 05 슬라이드 분류(P1~P4, R1~R4) 두 축에 매핑
  - T5 — 수정 후 재실행 → Error severity 0건 · baseline 갱신
  - T6 — `lint generate report -full -html` · 산출물 파일명 규칙 `<project>_<date>_do254_lint.html` 준수
- **예상 소요**: 25분
- **완료 기준**
  - Error severity violation 12→0건
  - alias 매핑표(수기 작성) · 수정 diff · 리포트 HTML 3종 제출

#### Slide 10 · `QnASlide.tsx` — 정리 + Day 06 예고
- **핵심 3줄 요약**
  - "합성 불가 구문 = 시뮬레이션만 통과하는 유령 로직"
  - "CP15·CP17·CP18 = `=`/`<=` 오용의 DO-254 alias 집합"
  - "`lint methodology standard -goal DO-254` = safety-critical 1차 방어선"
- **Day 06 예고 박스** (KeywordTag — DO-254 alias 중심)
  - `SS4 (latch)` / `SS2 (case)` / `CP7 (width)` / `CP6 (FSM)` / `SS17 (undriven)`
- **예고 문구 (개조식)**: "문법 합성 OK, 회로 거동 NG — DO-254 CP·SS 잠재 위반 식별"

### 1.5 Day 05 산출물
- `src/app/fpga/day05/page.tsx` — 래퍼
- `src/components/fpga/day05/*.tsx` — 10개 슬라이드
- `public/images/day05/` — race-waveform SVG 4건, Questa GUI 캡처 2건
- `/fpga/page.tsx` 커리큘럼 데이터: Day 5 `ready: true`

---

## 2. Day 06 — 잠재적 설계 오류 식별

### 2.1 회차 학습 목표
- **L1** — "합성은 되지만 회로가 틀린" 오류 유형 식별
- **L2** — latch inference · incomplete case · width mismatch · X-prop 메커니즘 이해
- **L3** — Questa Lint Structural·Width·FSM 체크를 실제 RTL 분석에 적용
- **L4** — 합성 보고서(Vivado/Libero)와 lint 결과 교차 검증 절차 실행
- **L5** — 잠재 오류를 safety-critical 인허가 산출물 관점에서 분류

### 2.2 이어받는 맥락
- Day 05: "합성 불가 / sim-synth 불일치" = **명백한 위반**
- **Day 06**: "합성은 되지만 의도와 다른 회로" = **잠재 위반**
- Day 07 연결: Clock Domain Crossing → 다중 도메인 잠재 오류

### 2.3 슬라이드 구성 (총 10장, 1.5~2시간)

| # | 슬라이드 파일 | 타이틀 | 유형 | 시간 |
|---|---|---|---|---|
| 1 | `TitleSlide.tsx` | Day 06 타이틀 | 표지 | 2분 |
| 2 | `AgendaSlide.tsx` | 학습 흐름 | 네비 | 3분 |
| 3 | `LatentVsExplicitSlide.tsx` | 명시적 위반 vs 잠재 오류 | 개념 | 10분 |
| 4 | `LatchInferenceSlide.tsx` | Latch Inference (SS4) | 인터랙티브 | 15분 |
| 5 | `CaseStatementSlide.tsx` | Case 불완전성 (SS2) · 우선순위·병렬 | 대조 | 15분 |
| 6 | `WidthMismatchSlide.tsx` | 비트폭·부호 불일치 (CP7) | 패턴 | 15분 |
| 7 | `XPropagationSlide.tsx` | X-Propagation & Reset 취약성 (SS17·SS18) | 시각화 | 10분 |
| 8 | `FsmLatentSlide.tsx` | FSM 잠재 오류 (CP5·CP6) | 인터랙티브 | 10분 |
| 9 | `LabSlide.tsx` | 실습 — latent_bug 프로젝트 (DO-254 goal) | 실습 | 25분 |
| 10 | `QnASlide.tsx` | Day 06 정리 · Week 4 (CDC) 예고 | 마무리 | 10분 |

### 2.4 슬라이드별 상세 설계

#### Slide 3 · `LatentVsExplicitSlide.tsx` — 명시적 위반 vs 잠재 오류
- **목적**: Day 05와 Day 06의 경계를 분명히 표시
- **레이아웃**: 중앙 수직 구분선 + 좌(Day 05 복습) / 우(Day 06 신규)
- **좌측 (Day 05 복습)**
  - "sim ≠ synth → 시뮬 단계에서 검출 가능"
  - "lint error 직접 탐지"
  - "대표: `=`/`<=` 오용, race, delay 구문"
- **우측 (Day 06 신규)**
  - "sim = synth 일치, but 의도와 불일치"
  - "대부분 warning 등급 → 의도적 판독 필요"
  - "대표: latch inference, incomplete case, width truncation"
- **하단 배너**: "잠재 오류 = 코드 리뷰에서 놓치기 쉬움 → lint 자동화 필수"

#### Slide 4 · `LatchInferenceSlide.tsx` — Latch Inference (SS4)
- **목적**: latch 발생 원인·탐지·수정 3단계를 시각화 · DO-254 SS4 한 alias로 수렴
- **상단 alias 배너**: `SS4 — 래치 추론 금지` · Severity `Warning` · DAL-A/B에서 수정 필수
- **레이아웃**: 상단 원인 3가지 그리드 + 하단 before/after 코드
- **원인 3 카드** (모두 SS4 서브케이스)
  - C1 — `always @(*)` 내 else 누락 · 연관 check `latch_inferred`, `if_stmt_without_else`
  - C2 — `case` 내 default 누락 · 연관 check `case_default_missing` (SS2와 중첩)
  - C3 — 조건부 할당에서 모든 분기 미커버 · 연관 check `latch_inferred`
- **수정 예시**
  - before: `if (en) q = d;`
  - after: `if (en) q = d; else q = 1'b0;`
- **safety-critical 영향**
  - 의도치 않은 메모리 소자 → 미초기화 → 랜덤 시작 거동
  - GSR(Global Set/Reset) 우회 → 리셋 불가 영역 발생 · DO-254 §6.2.1 초기화 요건 위반
  - 합성 자원 낭비 (FF 대비 latch 제약)

#### Slide 5 · `CaseStatementSlide.tsx` — Case 불완전성 (SS2)
- **목적**: `case` / `casex` / `casez` / `unique`/`priority` 수식어 차이와 위험 정리 · DO-254 SS2 집중
- **상단 alias 배너**: `SS2 — Case 문 완전 명세` · Severity `Error`
- **레이아웃**: 4분할 그리드
- **4 서브 토픽** (각 카드 상단에 SS2 sub-case 뱃지)
  - **ST1 · SS2-a** — plain `case` + default 누락 → latch (SS4 동반 발생)
    - Questa check: `case_default_missing`
  - **ST2 · SS2-b** — `casex`/`casez` 의 don't-care 해석 차이 → 합성 경고
    - Questa check: `case_with_x_z`, `casex_used`
  - **ST3 · SS2-c** — `unique case` 중복 매칭 · sim 런타임 error · synth 무시
    - Questa check: `case_item_duplicate`
  - **ST4 · (SS2 외)** — `priority case` 우선순위 회로 자원 폭증 · severity 정보성
    - Questa check: `parallel_case_violation`, `full_case_violation`
- **safety-critical 주의**: "`casex` safety-critical 도메인 사용 금지 권고 · DO-254 SS2-b 위반 시 CAPA 대상"

#### Slide 6 · `WidthMismatchSlide.tsx` — 비트폭·부호 불일치 (CP7)
- **목적**: assignment 비트폭 오류와 signed/unsigned 혼용 탐지 · DO-254 CP7 단일 alias 그룹
- **상단 alias 배너**: `CP7 — 비트폭 정합성` · Severity `Warning` (DAL-A/B는 Error로 상향 권장)
- **레이아웃**: 상단 4 유형 아이콘 카드 + 하단 예제 코드
- **4 유형** (모두 CP7 서브케이스)
  - **W1 · Overflow** — 좌변 < 우변 bit → 상위 비트 절단
    - Questa check: `assign_width_overflow`
  - **W2 · Underflow** — 좌변 > 우변 bit → zero/sign extension 의도 상이
    - Questa check: `assign_width_underflow`
  - **W3 · Signed-Unsigned Mixed** — 비교 연산 결과 왜곡
    - Questa check: `comparison_width_mismatch`, `expr_operands_width_mismatch`
  - **W4 · Case Selector Width** — selector bit ≠ label bit
    - Questa check: `case_width_mismatch`
- **예제 코드 (개조식 주석)**
  ```verilog
  reg [7:0] a; reg [15:0] b;
  assign a = b;       // CP7-W1 : 상위 8bit 소실 · 경고 필수
  assign a = b[7:0];  // 수정 : 의도 명시
  ```

#### Slide 7 · `XPropagationSlide.tsx` — X-Propagation (SS17·SS18)
- **목적**: 초기화 미비·미지값(X) 전파 경로 시각화 · DO-254 SS17·SS18 두 alias 병합 해석
- **상단 alias 배너**: `SS17 — 미구동/미사용 로직 금지` (Error) + `SS18 — 레지스터 제어성 확보` (Warning)
- **레이아웃**: 좌 파형(X 전파) + 우 설명
- **핵심 포인트** (alias 매핑)
  - **SS18** — reset 미연결 FF → X 상태 지속 · Questa check `flop_without_control`, `const_reg_data`
  - **SS17** — undriven signal X 원천 · Questa check `undriven_signal`, `undriven_reg_data`, `unconnected_inst`
  - X-optimism — sim에서 무시 · synth에서 실제 X 전파 · 테스트 증빙 무효화
- **safety-critical 주의**
  - DO-254 §6.2.1 — deterministic initialization 요구
  - IEC 62566 — 동일 요구 (원전 도메인 교차 적용)
  - DAL-A/B 대상 프로젝트에서는 **SS18 severity를 Error로 상향 필요** (prefs Tcl에서 오버라이드)

#### Slide 8 · `FsmLatentSlide.tsx` — FSM 잠재 오류 (CP5·CP6)
- **목적**: Day 03 FSM 룰의 심화 · DO-254 CP5·CP6 alias 기반 재해석
- **상단 alias 배너**: `CP5 — FSM 인코딩 일관성` + `CP6 — FSM 안전 전이` (Error/Warning 혼재)
- **레이아웃**: 좌 FSM 다이어그램 SVG + 우 문제 유형 리스트
- **문제 유형 4종** (alias 분기 매핑)
  - **F1 · CP6 (Unreachable)** — 진입 불가 state
    - Questa check: `fsm_with_unreachable_state`
  - **F2 · CP6 (Deadend)** — 탈출 불가 state
    - Questa check: `fsm_with_deadend_state`
  - **F3 · CP5** — Non-enumerated binary · state register 비트 수 > 실제 state 수 → 미정의 조합
    - Questa check: `fsm_state_value_hardcoded`
  - **F4 · CP6 (Safe Transition)** — Recovery path 부재 (SEU 복구 경로 없음)
    - Questa check: `fsm_without_default_state`, `fsm_without_reset_state`
- **SEU 복구 설계 주의**
  - 우주·항공 도메인 의무 · DO-254 §6.3 설계 보증 활동
  - `default` 분기에서 reset state로 강제 전이 필요
  - safe-FSM 구조 (one-hot + 미정의 조합 decode → reset state)

#### Slide 9 · `LabSlide.tsx` — 실습
- **실습 목표**: DO-254 goal 활성 상태에서 `latent_bug/` RTL의 CP5·CP6·CP7·SS2·SS4·SS17·SS18 위반 15건 검출 · 분류 · 수정 · 리포트
- **Task 6종**
  - T1 — 제공 RTL `vlog` 컴파일 · 에러 0, warning 다수 확인
  - T2 — `qverify -c -do "lint methodology standard -goal DO-254; lint run -d latent_bug; exit"` 실행
  - T3 — GUI에서 alias 필터 (`CP5`, `CP6`, `CP7`, `SS2`, `SS4`, `SS17`, `SS18`) 적용
  - T4 — 각 violation을 DO-254 alias + Day 06 슬라이드 분류(C1~C3, ST1~ST4, W1~W4, F1~F4) 두 축 매핑
  - T5 — 수정 후 Vivado `synth_design` 재실행 · 합성 후 cell 수 비교 (latch count 0 확인)
  - T6 — lint report HTML + 합성 log 교차 검증 · 산출물 2종 제출
- **완료 기준**
  - alias 기준 violation 15→0건
  - latch count 0 · 합성 cell 수 감소 확인
  - alias 매핑표 수기 작성 결과 제출

#### Slide 10 · `QnASlide.tsx` — 정리 + Week 4 예고
- **핵심 3줄 요약**
  - "잠재 오류 = 합성 통과 · 의도 불일치"
  - "DO-254 alias 5축: SS4(latch) · SS2(case) · CP7(width) · SS17/SS18(X-prop) · CP5/CP6(FSM)"
  - "alias 기반 tri­age + 합성 리포트 교차 검증 = safety-critical 필수 절차"
- **Week 4 예고 (Day 07~08)**: CDC 분석 기초 · Questa CDC 실습
- **Keyword 태그**: `CDC`, `Metastability`, `Synchronizer`, `qverify cdc`, `DO-254 §6.2`

### 2.5 Day 06 산출물
- `src/app/fpga/day06/page.tsx`
- `src/components/fpga/day06/*.tsx` — 10개 슬라이드
- `public/images/day06/` — FSM 다이어그램 SVG 4건, X-prop 파형 SVG 2건, 합성 리포트 캡처 2건
- `/fpga/page.tsx` 커리큘럼 데이터: Day 6 `ready: true`

---

## 3. 공통 구현 지침

### 3.1 파일 스캐폴딩 순서
1. 라우트 페이지 생성 (`src/app/fpga/day0X/page.tsx`) — `FpgaRevealWrapper` 래핑
2. 슬라이드 폴더 생성 (`src/components/fpga/day0X/`)
3. `TitleSlide` / `AgendaSlide` / `QnASlide` 뼈대 먼저 → 본문 슬라이드 순차 구현
4. `/fpga/page.tsx` 의 `curriculum` 배열에서 해당 Day `ready: false → true` 변경

### 3.2 타입 안전성
- 슬라이드 내부 데이터 배열은 **파일 상단에 type + const 분리**
- `as const` 활용으로 리터럴 추론
- lint rule 매핑 같은 표 데이터는 `readonly Array<...>` 타입

### 3.3 접근성
- 코드 블록 `aria-label="코드 예시"` 부여
- 아이콘 장식 SVG는 `aria-hidden="true"`
- 대비 비율 AA (`FPGA.text` on `FPGA.white` = 12.6:1 확보)

### 3.4 반응형
- `clamp(1.4rem, 3vw, 2.2rem)` 타이포
- 카드 그리드: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
- reveal.js 기본 1280×720 기준 디자인 → `slideContentWrapper` 준수

### 3.5 성능
- 큰 인터랙티브 슬라이드(`UnsynthCatalogSlide`, `FsmDeadStateSlide`)는 `useMemo` 로 필터 결과 캐싱
- 이미지: `public/images/` 배치 후 `next/image` 금지 (reveal.js 호환성) — `<img>` 직접 사용
- SVG 인라인 선호 (색상 토큰 동적 주입)

---

## 4. 검증 체크리스트

### 4.1 문체·톤
- [ ] 전 슬라이드에서 "합니다/입니다/됩니다/습니다" 0건
- [ ] 모든 bullet이 개조식 or 명사 종결
- [ ] safety-critical 공통 용어 사용 · 원전 한정 표현 배제

### 4.2 기술 정확성
- [ ] Questa 명령어 전수 검증 — `qverify`, `lint run -d`, `vlog`/`vcom`
- [ ] DO-254 methodology 설정 명령 일관 사용 — `lint methodology standard -goal DO-254`
- [ ] `questa_lint_reference.md` 대조하여 check id · 카테고리 오기 0건
- [ ] Day 03 `DO254MappingSlide.tsx` 의 alias 코드(CP/DR/SS 번호) 및 Questa check 매핑과 **완전 일치**
- [ ] lint check severity 표기가 DO-254 goal 기본값과 일치 · 상향 필요 항목은 prefs Tcl로 명시

### 4.3 디자인
- [ ] 모든 카드·도형에 그림자 적용 (`shadow.card` 이상)
- [ ] 여백 과다 영역(빈 공간 40% 초과) 0건
- [ ] Day 05 `#C05621` / Day 06 `#6B46C1` 포인트 컬러 일관
- [ ] hover 인터랙션 (translateY / shadow 전환) 카드 전체 적용

### 4.4 교육 구성
- [ ] 슬라이드당 학습 목표 ≥ 1건 명시
- [ ] Lab 완료 기준 = 측정 가능한 수치 (violation 건수 · cell 수 등)
- [ ] Day 간 연결 (Day 04→05, Day 05→06, Day 06→07) 예고 카드 명시

### 4.5 참조 자료
- [ ] Day 05 레퍼런스: `questa_lint_reference.md` §10 "Simulation Race Checks" + Day 03 `DO254MappingSlide.tsx` CP15/CP17/CP18/SS3/SS6
- [ ] Day 06 레퍼런스: `questa_lint_reference.md` §10 "FSM/Width/Connectivity Checks" + Day 03 `DO254MappingSlide.tsx` CP5/CP6/CP7/SS2/SS4/SS17/SS18
- [ ] 외부 표준 인용 — DO-254 §6.2/§6.3 / IEC 62566 / ECSS-Q-ST-60 조항번호 병기
- [ ] 실습 RTL은 **DO-254 alias 주입 일람표** 와 함께 제공 — Lab 채점 기준 통일

---

## 5. 구현 우선순위 제안

1. **Phase A** (Day 05 골격 · 1일) — page.tsx + Title/Agenda/QnA + UnsynthCatalog (핵심 인터랙티브)
2. **Phase B** (Day 05 본문 · 1일) — BlockingNonBlocking / RaceCondition / LintCheckMap / TriageWorkflow
3. **Phase C** (Day 05 Lab · 0.5일) — LabSlide + `broken_rtl/` 샘플 준비
4. **Phase D** (Day 06 골격 · 1일) — page.tsx + Title/Agenda/QnA + LatchInference + CaseStatement
5. **Phase E** (Day 06 본문 · 1일) — WidthMismatch / XPropagation / FsmDeadState / LatentVsExplicit
6. **Phase F** (Day 06 Lab · 0.5일) — LabSlide + `latent_bug/` 샘플 준비
7. **Phase G** (검증 · 0.5일) — 체크리스트 4.1~4.5 전수 통과 · `ready: true` 반영

총 예상 공수: 5.5일
