// =============================================================================
// Day 06 Lab — latent_bug.v
// DO-254 CP·SS 잠재 위반 15건 의도적 주입
// 목적: 합성 가능하나 의도와 다른 회로 생성 — 잠재 설계 오류 탐지 실습
// 참고: lint methodology standard -goal DO-254 활성 + DAL-A/B 상향 override
// =============================================================================

// -----------------------------------------------------------------------------
// top: latent_bug — 전 결함 서브모듈 통합
// -----------------------------------------------------------------------------
module latent_bug (
  input  wire        clk,
  input  wire        rst_n,
  input  wire [3:0]  sel,
  input  wire [7:0]  din,
  input  wire signed [7:0] sdin,
  output wire [7:0]  dout,
  output wire [3:0]  state_out
);
  wire [7:0] w1, w2, w3, w4, w5, w6, w7;
  wire       w_cmp, w_flop, w_undr;

  mux_latch       u_mux   (.en(sel[0]), .d(din), .q(w1));
  case_no_default u_cnd   (.sel(sel[1:0]), .a(din), .b(~din), .y(w2));
  case_casex      u_ccx   (.sel(sel[1:0]), .y(w3));
  case_dup        u_cdp   (.sel(sel[2:0]), .y(w4));
  width_ovfl      u_wov   (.a(din), .b({din, din}), .y(w5));
  width_udfl      u_wud   (.a(din), .b(sel), .y(w6));
  sign_compare    u_scp   (.a(sdin), .b(din), .gt(w_cmp));
  case_sel_width  u_csw   (.sel(sel), .y(w7));
  ff_no_reset     u_ff    (.clk(clk), .d(din[0]), .q(w_flop));
  undriven_net    u_und   (.y(w_undr));

  fsm_latent      u_fsm   (.clk(clk), .rst_n(rst_n), .in(sel), .state(state_out));

  assign dout = w1 ^ w2 ^ w3 ^ w4 ^ w5 ^ w6 ^ w7;
endmodule


// -----------------------------------------------------------------------------
// #1 SS4 — Latch Inference (if 없는 else)
// -----------------------------------------------------------------------------
module mux_latch (
  input  wire       en,
  input  wire [7:0] d,
  output reg  [7:0] q
);
  // ── [#1 SS4 결함] else 없음 → latch 추론
  always @(*) begin
    if (en) q = d;
    // else 누락 ← SS4 latch_inferred
  end
endmodule


// -----------------------------------------------------------------------------
// #2 SS2-a — case default 누락
// -----------------------------------------------------------------------------
module case_no_default (
  input  wire [1:0] sel,
  input  wire [7:0] a, b,
  output reg  [7:0] y
);
  always @(*) begin
    case (sel)
      2'b00: y = a;
      2'b01: y = b;
      2'b10: y = a + b;
      // ── [#2 SS2-a 결함] default 누락 → 2'b11에서 latch 추론
    endcase
  end
endmodule


// -----------------------------------------------------------------------------
// #3 SS2-b — casex don't-care (safety-critical 금지 권고)
// -----------------------------------------------------------------------------
module case_casex (
  input  wire [1:0] sel,
  output reg  [7:0] y
);
  always @(*) begin
    // ── [#3 SS2-b 결함] casex — sim/synth 해석 상이
    casex (sel)
      2'b0x: y = 8'hAA;        // ← case_with_x_z
      2'b10: y = 8'h55;
      default: y = 8'h00;
    endcase
  end
endmodule


// -----------------------------------------------------------------------------
// #4 SS2-c — unique case 중복 매칭
// -----------------------------------------------------------------------------
module case_dup (
  input  wire [2:0] sel,
  output reg  [7:0] y
);
  always @(*) begin
    // ── [#4 SS2-c 결함] 3'b00x + 3'b001 중복
    unique case (sel)
      3'b00?: y = 8'h11;       // ← case_item_duplicate
      3'b001: y = 8'h22;       // ← overlap with above
      3'b010: y = 8'h33;
      default: y = 8'h00;
    endcase
  end
endmodule


// -----------------------------------------------------------------------------
// #5 CP7-W1 — Width Overflow (상위 8bit 소실)
// -----------------------------------------------------------------------------
module width_ovfl (
  input  wire [7:0]  a,
  input  wire [15:0] b,
  output wire [7:0]  y
);
  // ── [#5 CP7-W1 결함] 좌변 8bit < 우변 16bit → silent truncation
  assign y = a + b;           // ← assign_width_overflow
endmodule


// -----------------------------------------------------------------------------
// #6 CP7-W2 — Width Underflow (zero extension 의도 불명)
// -----------------------------------------------------------------------------
module width_udfl (
  input  wire [7:0] a,
  input  wire [3:0] b,
  output wire [7:0] y
);
  // ── [#6 CP7-W2 결함] 좌변 8bit > 우변 4bit → 의도 모호 zero extension
  wire [7:0] tmp;
  assign tmp = b;              // ← assign_width_underflow
  assign y   = a | tmp;
endmodule


// -----------------------------------------------------------------------------
// #7 CP7-W3 — Signed / Unsigned 혼용 비교
// -----------------------------------------------------------------------------
module sign_compare (
  input  wire signed [7:0] a,
  input  wire        [7:0] b,
  output wire              gt
);
  // ── [#7 CP7-W3 결함] signed vs unsigned 비교 → 결과 왜곡
  assign gt = (a > b);         // ← comparison_width_mismatch
endmodule


// -----------------------------------------------------------------------------
// #8 CP7-W4 — case selector width 불일치
// -----------------------------------------------------------------------------
module case_sel_width (
  input  wire [3:0] sel,
  output reg  [7:0] y
);
  always @(*) begin
    // ── [#8 CP7-W4 결함] selector 4bit vs label 3bit → case_width_mismatch
    case (sel)
      3'b000: y = 8'h01;       // ← label bit 3 vs selector bit 4
      3'b001: y = 8'h02;
      default: y = 8'h00;
    endcase
  end
endmodule


// -----------------------------------------------------------------------------
// #9 SS18 — FF 제어 부재 (reset · enable 없음)
// -----------------------------------------------------------------------------
module ff_no_reset (
  input  wire clk,
  input  wire d,
  output reg  q
);
  // ── [#9 SS18 결함] reset 없음 · DAL-A/B 에서 Error 상향
  always @(posedge clk) begin
    q <= d;                    // ← flop_without_control
  end
endmodule


// -----------------------------------------------------------------------------
// #10 SS17 — Undriven signal
// -----------------------------------------------------------------------------
module undriven_net (
  output wire y
);
  wire internal;               // ── [#10 SS17 결함] 구동자 없음
  assign y = internal;         // ← undriven_signal 전파
endmodule


// -----------------------------------------------------------------------------
// #11~#15 — FSM 잠재 오류 (CP5 · CP6)
//
// #11 CP6  fsm_with_unreachable_state — S_ORPHAN 진입 불가
// #12 CP6  fsm_with_deadend_state     — S_TRAP 탈출 불가
// #13 CP5  fsm_state_value_hardcoded  — 4bit reg에 5개 state만 사용
// #14 CP6  fsm_without_default_state  — case default 누락
// #15 CP6  fsm_without_reset_state    — reset 전이 없음
// -----------------------------------------------------------------------------
module fsm_latent (
  input  wire       clk,
  input  wire       rst_n,
  input  wire [3:0] in,
  output reg  [3:0] state
);
  // ── [#13 CP5 결함] 4bit state에 5개 state — 11개 미정의 조합
  localparam [3:0] S_IDLE   = 4'd0,
                   S_RUN    = 4'd1,
                   S_WAIT   = 4'd2,
                   S_TRAP   = 4'd3,   // deadend (#12)
                   S_ORPHAN = 4'd4;   // unreachable (#11)

  // ── [#15 CP6 결함] reset 전이 분기 없음
  always @(posedge clk) begin      // ← posedge clk only, no reset
    case (state)
      S_IDLE:   state <= (in[0]) ? S_RUN : S_WAIT;
      S_RUN:    state <= (in[1]) ? S_WAIT : S_RUN;
      S_WAIT:   state <= (in[2]) ? S_TRAP : S_IDLE;
      S_TRAP:   state <= S_TRAP;   // ← [#12] 탈출 전이 없음
      // ── [#11] S_ORPHAN 진입 전이 어디에도 없음
      // ── [#14] default 분기 없음 → 11개 미정의 조합에서 임의 거동
    endcase
  end
endmodule
