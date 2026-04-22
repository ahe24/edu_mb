// =============================================================================
// Day 06 Lab — latent_bug_fixed.v  (강사용 · 수정본 참조)
// 15건 잠재 결함 수정 · alias violation 0건 · latch count 0 기대
// =============================================================================

module latent_bug (
  input  wire        clk,
  input  wire        rst_n,
  input  wire [3:0]  sel,
  input  wire [7:0]  din,
  input  wire signed [7:0] sdin,
  input  wire              en,
  output wire [7:0]  dout,
  output wire [3:0]  state_out
);
  wire [7:0] w1, w2, w5, w6;
  wire       w_cmp, w_flop;

  mux_latch       u_mux  (.en(sel[0]), .d(din),      .q(w1));
  case_no_default u_cnd  (.sel(sel[1:0]), .a(din), .b(~din), .y(w2));
  width_ovfl      u_wov  (.a(din), .b({din, din}), .y(w5));
  width_udfl      u_wud  (.a(din), .b(sel), .y(w6));
  sign_compare    u_scp  (.a(sdin), .b(din), .gt(w_cmp));
  ff_no_reset     u_ff   (.clk(clk), .rst_n(rst_n), .en(en), .d(din[0]), .q(w_flop));
  fsm_latent      u_fsm  (.clk(clk), .rst_n(rst_n), .in(sel), .state(state_out));

  assign dout = w1 ^ w2 ^ w5 ^ w6;
endmodule


// Fix #1 SS4: else 추가
module mux_latch (
  input  wire       en,
  input  wire [7:0] d,
  output reg  [7:0] q
);
  always @(*) begin
    if (en) q = d;
    else    q = 8'h00;
  end
endmodule


// Fix #2 SS2-a: default 추가
module case_no_default (
  input  wire [1:0] sel,
  input  wire [7:0] a, b,
  output reg  [7:0] y
);
  always @(*) begin
    case (sel)
      2'b00:   y = a;
      2'b01:   y = b;
      2'b10:   y = a + b;
      default: y = 8'h00;
    endcase
  end
endmodule


// Fix #5 CP7-W1: 슬라이스 or saturation
module width_ovfl (
  input  wire [7:0]  a,
  input  wire [15:0] b,
  output wire [7:0]  y
);
  wire [15:0] sum = {8'h00, a} + b;
  assign y = (sum > 16'hFF) ? 8'hFF : sum[7:0];
endmodule


// Fix #6 CP7-W2: zero extension 명시
module width_udfl (
  input  wire [7:0] a,
  input  wire [3:0] b,
  output wire [7:0] y
);
  assign y = a | {4'h0, b};
endmodule


// Fix #7 CP7-W3: signed 통일
module sign_compare (
  input  wire signed [7:0] a,
  input  wire        [7:0] b,
  output wire              gt
);
  assign gt = (a > $signed({1'b0, b}));
endmodule


// Fix #9 SS18: reset + enable 제어 추가
module ff_no_reset (
  input  wire clk, rst_n, en, d,
  output reg  q
);
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n)  q <= 1'b0;
    else if (en) q <= d;
  end
endmodule


// Fix #11~#15: safe FSM (one-hot · default → reset state · async reset)
module fsm_latent (
  input  wire       clk,
  input  wire       rst_n,
  input  wire [3:0] in,
  output reg  [3:0] state
);
  // one-hot 인코딩 · 4 state
  localparam [3:0] S_IDLE = 4'b0001,
                   S_RUN  = 4'b0010,
                   S_WAIT = 4'b0100,
                   S_DONE = 4'b1000;

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      state <= S_IDLE;
    end
    else begin
      case (state)
        S_IDLE:  state <= (in[0]) ? S_RUN  : S_IDLE;
        S_RUN:   state <= (in[1]) ? S_WAIT : S_RUN;
        S_WAIT:  state <= (in[2]) ? S_DONE : S_WAIT;
        S_DONE:  state <= (in[3]) ? S_IDLE : S_DONE;  // recovery
        default: state <= S_IDLE;                     // safe transition
      endcase
    end
  end
endmodule
