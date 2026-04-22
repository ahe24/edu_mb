// =============================================================================
// Day 05 Lab — broken_rtl.v
// DO-254 CP · SS 위반 12건 의도적 주입
// 목적: Sim-Synth mismatch · 합성 불가 구문 검출 실습
// 참고: lint methodology standard -goal DO-254 활성 상태 기준
// =============================================================================

// -----------------------------------------------------------------------------
// top: broken_rtl — 전 결함 서브모듈 통합
// -----------------------------------------------------------------------------
module broken_rtl (
  input  wire        clk,
  input  wire        rst_n,
  input  wire        en,
  input  wire [7:0]  din,
  output wire [7:0]  dout
);

  wire [7:0] w1, w2, w3, w4, w5, w6, w7, w8;

  fifo_ctrl       u_fifo       (.clk(clk), .rst_n(rst_n), .din(din), .dout(w1));
  decoder_badsens u_dec        (.a(din[0]), .b(din[1]), .c(din[2]), .y(w2[0]));
  mux_multidrv    u_mux        (.sel(en), .a(din), .b(~din), .y(w3));
  feedback_loop   u_loop       (.d(din[0]), .q(w4[0]));
  init_block      u_init       (.q(w5[0]));
  delay_block     u_delay      (.clk(clk), .d(din[0]), .q(w6[0]));
  display_leak    u_disp       (.clk(clk), .sig(din[0]));
  force_bad       u_force      (.clk(clk), .q(w7[0]));
  undriven        u_undr       (.y(w8[0]));
  flop_no_ctrl    u_flop       (.clk(clk), .d(din[0]), .q(w8[1]));

  assign dout = w1 ^ w3;

endmodule


// -----------------------------------------------------------------------------
// #1 CP17 — Sequential 블록에서 `=` 사용 (race)
// #2 CP15 — Combo 블록에서 `<=` 사용
// #3 CP18 — 동일 always 블록에서 blocking/NB 혼용
// -----------------------------------------------------------------------------
module fifo_ctrl (
  input  wire       clk,
  input  wire       rst_n,
  input  wire [7:0] din,
  output reg  [7:0] dout
);

  reg [7:0] stage1, stage2;

  // ── [#1 CP17 결함] sequential 블록에서 blocking 할당 → race condition
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n)
      stage1 = 8'h00;           // ← CP17 (should be <=)
    else
      stage1 = din;             // ← CP17 (should be <=)
  end

  // ── [#2 CP15 결함] combo 블록에서 non-blocking → sim-synth mismatch
  always @(*) begin
    stage2 <= stage1 + 8'h01;   // ← CP15 (should be =)
  end

  // ── [#3 CP18 결함] 동일 always 내 blocking / non-blocking 혼용
  reg [7:0] tmp;
  always @(posedge clk) begin
    tmp  = stage2 & 8'hF0;      // blocking
    dout <= tmp | 8'h01;        // non-blocking ← CP18 혼용
  end

endmodule


// -----------------------------------------------------------------------------
// #4 CP8 — 감도 리스트 불완전성
// -----------------------------------------------------------------------------
module decoder_badsens (
  input  wire a, b, c,
  output reg  y
);
  // ── [#4 CP8 결함] c 누락 — sim은 c 변경 무시, synth는 c 반영 → mismatch
  always @(a or b) begin    // ← missing c
    y = a & b & c;
  end
endmodule


// -----------------------------------------------------------------------------
// #5 SS6 — 중복 구동 (multi-driver)
// -----------------------------------------------------------------------------
module mux_multidrv (
  input  wire       sel,
  input  wire [7:0] a, b,
  output wire [7:0] y
);
  // ── [#5 SS6 결함] y 신호 두 곳에서 구동 → 합성 오류
  assign y = a;                  // driver 1
  assign y = sel ? b : a;        // driver 2  ← SS6
endmodule


// -----------------------------------------------------------------------------
// #6 SS3 — 조합 피드백 루프 (combo loop)
// -----------------------------------------------------------------------------
module feedback_loop (
  input  wire d,
  output wire q
);
  wire n1, n2;
  // ── [#6 SS3 결함] n1 ← n2 ← n1 zero-delay 루프
  assign n1 = n2 & d;
  assign n2 = n1 | d;            // ← SS3 combo_loop
  assign q  = n1;
endmodule


// -----------------------------------------------------------------------------
// #7 unsynth — initial 블록 (RTL 사용 금지)
// -----------------------------------------------------------------------------
module init_block (
  output reg q
);
  // ── [#7 CP unsynth 결함] synth 무시 → sim 초기값만 존재
  initial q = 1'b0;              // ← unsynth_initial_stmt
endmodule


// -----------------------------------------------------------------------------
// #8 CP15 — always 블록 내 delay (합성 무시)
// -----------------------------------------------------------------------------
module delay_block (
  input  wire clk,
  input  wire d,
  output reg  q
);
  // ── [#8 CP15 결함] sequential 블록 내 delay → synth 무시
  always @(posedge clk) begin
    q <= #3 d;                   // ← nonblocking_assign_and_delay_in_always
  end
endmodule


// -----------------------------------------------------------------------------
// #9 unsynth — $display task (RTL 존재 시 무시)
// -----------------------------------------------------------------------------
module display_leak (
  input wire clk,
  input wire sig
);
  // ── [#9 CP unsynth 결함] synth는 무시 · testbench로 이동 필요
  always @(posedge clk) begin
    $display("sig=%b", sig);     // ← unsynth_display_task
  end
endmodule


// -----------------------------------------------------------------------------
// #10 SS6 — force / release (합성 불가)
// -----------------------------------------------------------------------------
module force_bad (
  input  wire clk,
  output reg  q
);
  // ── [#10 SS6 결함] force 구문 — sim 전용 · RTL 불가
  always @(posedge clk) begin
    force q = 1'b1;              // ← unsynth_force_release
  end
endmodule


// -----------------------------------------------------------------------------
// #11 SS17 — 미구동 신호
// -----------------------------------------------------------------------------
module undriven (
  output wire y
);
  wire internal;                 // ← [#11 SS17 결함] 어디에서도 구동되지 않음
  assign y = internal;
endmodule


// -----------------------------------------------------------------------------
// #12 SS18 — 레지스터 제어성 미확보 (reset·enable 없음)
// -----------------------------------------------------------------------------
module flop_no_ctrl (
  input  wire clk,
  input  wire d,
  output reg  q
);
  // ── [#12 SS18 결함] reset·enable 없음 → 초기값 불명확 · X 전파 위험
  always @(posedge clk) begin
    q <= d;                      // ← flop_without_control
  end
endmodule
