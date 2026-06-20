// =============================================================================
// Day 11 — pwm_rgb.v
// 버튼으로 밝기를 순환하는 mode FSM + PWM. RGB LED 한 채널을 duty 비율로 점등.
//   rst   : 동기 active-high
//   btn_p : 1-clk 펄스 (디바운서+엣지검출, Day10 출력) — OFF→DIM→MID→MAX→OFF
//   rgb   : PWM 출력 — cnt<duty 동안 ON.
//
//   ── 보드 기준 (중요) ──────────────────────────────────────────────
//   · 메인 클럭 100MHz, PWM 주파수는 200Hz~1kHz 권장(상태표시 LED 디밍 대역).
//     기본 PWM_HZ=1000 → 주기 PERIOD = CLK_HZ/PWM_HZ = 100,000 클럭(1ms).
//     (≈390kHz로 동작하던 8비트 자유카운터 방식은 가청·플리커 대역 밖)
//   · RGB LED 는 매우 밝아 눈부심 → 최대 duty 50% 상한(= PERIOD/2).
//     단색 User LED 디밍이면 같은 구조로 100%(PERIOD)까지 사용 가능.
// =============================================================================
module pwm_rgb #(
  parameter integer CLK_HZ = 100_000_000,   // 메인 클럭
  parameter integer PWM_HZ = 1000           // PWM 주파수 (200~1000 권장)
)(
  input  wire clk,
  input  wire rst,          // 동기 active-high
  input  wire btn_p,        // 1-clk 펄스 (디바운서+엣지검출, Day10)
  output wire rgb           // RGB LED 한 채널 — 최대 duty 50% (눈부심 방지)
);
  localparam integer PERIOD = CLK_HZ / PWM_HZ;   // 100MHz/1kHz = 100,000 (1ms)
  localparam OFF=2'd0, DIM=2'd1, MID=2'd2, MAX=2'd3;

  reg [1:0] mode;
  always @(posedge clk)              // 모드 순환 FSM
    if (rst)        mode <= OFF;
    else if (btn_p) mode <= mode + 1'b1;   // OFF→DIM→MID→MAX→OFF

  // 모드 → duty (PERIOD 대비 비율). RGB 상한 = PERIOD/2 = 50%.
  reg [$clog2(PERIOD)-1:0] duty, cnt;
  always @* case (mode)
    OFF: duty = 0;                   //   0 %
    DIM: duty = PERIOD / 8;          // 12.5 %
    MID: duty = PERIOD / 4;          //  25 %
    MAX: duty = PERIOD / 2;          //  50 %  ← RGB 상한
  endcase

  always @(posedge clk)              // PWM 주기 카운터 (0..PERIOD-1)
    if (rst)                cnt <= 0;
    else if (cnt==PERIOD-1) cnt <= 0;
    else                    cnt <= cnt + 1'b1;

  assign rgb = (cnt < duty);         // duty 비율만큼 ON
endmodule
