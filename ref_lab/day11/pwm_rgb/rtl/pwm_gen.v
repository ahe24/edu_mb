// =============================================================================
// Day 11 ? pwm_gen.v   ★ 직접 구현 모듈 ★
// 2버튼(증가/감소) 펄스로 PWM 비교 임계값 duty 를 ±STEP% 만큼 조절하고 PWM 출력.
//   rst   : 동기 active-high
//   up_p  : +STEP% 1-clk 펄스 (top 의 디바운서+상승엣지 출력)
//   dn_p  : -STEP% 1-clk 펄스
//   pwm   : PWM 비트 ? cnt<duty 동안 ON (duty 0~100%, 상한 없음)
//
//   ── 설계 핵심: 곱셈·나눗셈 없이 duty 직접 누산 ──────────────────────
//   · %(pct) 중간표현을 두지 않고, duty 를 카운트 단위로 ±STEP_CNT 가감산.
//     STEP_CNT = (PERIOD*STEP)/100 은 localparam → 합성 전 상수접기로 literal.
//     (보드 PERIOD=100,000 → 5000 / 시뮬 PERIOD=100 → 5. 하드웨어 곱·나눗셈 0개)
//   · 남는 연산: 상수 가감산 1개 + 상수 비교 + cnt 카운터 + cnt<duty 비교기뿐.
//   · 0%·100% 에서 포화. up_p·dn_p 동시 입력 시 변화 없음(서로 가드).
//
//   ── 보드 기준 ───────────────────────────────────────────────────────
//   · 메인 클럭 100MHz, PWM 주파수 200Hz~1kHz 권장(상태표시 LED 디밍 대역).
//     PWM_HZ=1000 → PERIOD = CLK_HZ/PWM_HZ = 100,000 클럭(1ms).
//   · 시뮬은 +define+FUNC_SIM 으로 PERIOD=100, STEP_CNT=5 → duty(카운트)=pct(%).
//     → self-check TB 가 한 주기 HIGH 수 = pct(%) 로 바로 검증.
// =============================================================================
module pwm_gen #(
  parameter integer CLK_HZ = 100_000_000,   // 메인 클럭 100MHz
  parameter integer PWM_HZ = 1000,          // PWM 주파수 (200~1000 권장)
  parameter integer STEP   = 5              // 버튼 1회당 밝기 증감 (%)
)(
  input  wire clk,
  input  wire rst,          // 동기 active-high
  input  wire up_p,         // +STEP% 1-clk 펄스
  input  wire dn_p,         // -STEP% 1-clk 펄스
  output wire pwm           // PWM 출력 (0~100%)
);
`ifdef FUNC_SIM
  localparam integer PERIOD = 100;             // 시뮬: % 가 정확 (100의 배수)
`else
  localparam integer PERIOD = CLK_HZ / PWM_HZ; // 100MHz/1kHz = 100,000 (1ms)
`endif
  localparam integer DW       = $clog2(PERIOD + 1);   // duty/cnt 폭 (PERIOD 표현)
  localparam integer STEP_CNT = (PERIOD * STEP) / 100; // ★ 컴파일타임 상수: 5% = PERIOD/20

  // ── duty 를 카운트 단위로 직접 ±STEP_CNT 누산 (곱셈·나눗셈 없음) ──
  reg [DW-1:0] duty;
  always @(posedge clk)
    if (rst)                duty <= 0;
    else if (up_p && !dn_p) duty <= (duty >= PERIOD - STEP_CNT) ? PERIOD : duty + STEP_CNT;  // 상한 100%
    else if (dn_p && !up_p) duty <= (duty <=          STEP_CNT) ? 0      : duty - STEP_CNT;  // 하한 0%

  // ── PWM 주기 카운터 (0..PERIOD-1 반복) ──
  reg [DW-1:0] cnt;
  always @(posedge clk)
    if (rst || cnt == PERIOD - 1) cnt <= 0;
    else                          cnt <= cnt + 1'b1;

  assign pwm = (cnt < duty);    // duty 비율만큼 ON
endmodule
