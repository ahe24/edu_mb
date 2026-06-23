// =============================================================================
// Day 11 — pwm_gen.v   ★ 직접 구현 모듈 ★
// 2버튼(증가/감소) 펄스로 밝기 pct 를 ±STEP% 조절하고, 그 비율로 PWM 출력.
//   rst   : 동기 active-high
//   up_p  : +STEP% 1-clk 펄스 (top 의 디바운서+상승엣지 출력)
//   dn_p  : -STEP% 1-clk 펄스
//   pwm   : PWM 비트 — cnt<duty 동안 ON (duty 0~100%, 상한 없음)
//
//   ── 동작 ────────────────────────────────────────────────────────────
//   · pct(0..100%) 를 STEP% 단위로 saturating up/down. 0/100% 에서 포화.
//   · duty = pct*PERIOD/100 → PWM 카운터 cnt(0..PERIOD-1) 와 비교해 점등.
//   · up_p·dn_p 동시 입력 시 변화 없음(서로 가드).
//
//   ── 보드 기준 ───────────────────────────────────────────────────────
//   · 메인 클럭 100MHz, PWM 주파수 200Hz~1kHz 권장(상태표시 LED 디밍 대역).
//     PWM_HZ=1000 → PERIOD = CLK_HZ/PWM_HZ = 100,000 클럭(1ms).
//   · 시뮬은 +define+FUNC_SIM 으로 PERIOD=100 (100의 배수라 % 가 정확).
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
  localparam integer DW = $clog2(PERIOD + 1);  // duty/cnt 폭 (PERIOD 표현)

  // ── 밝기 pct: STEP% 단위 saturating up/down (0~100%) ──
  reg [6:0] pct;
  always @(posedge clk)
    if (rst)                pct <= 7'd0;
    else if (up_p && !dn_p) pct <= (pct >= 100 - STEP) ? 7'd100 : pct + STEP;   // 상한 100%
    else if (dn_p && !up_p) pct <= (pct <= STEP)        ? 7'd0   : pct - STEP;   // 하한 0%

  // ── pct(%) → duty 카운트. 상한 없음(50% 제한 제거) ──
  wire [DW-1:0] duty = (pct * PERIOD) / 100;

  // ── PWM 주기 카운터 (0..PERIOD-1 반복) ──
  reg [DW-1:0] cnt;
  always @(posedge clk)
    if (rst || cnt == PERIOD - 1) cnt <= 0;
    else                          cnt <= cnt + 1'b1;

  assign pwm = (cnt < duty);    // duty 비율만큼 ON
endmodule
