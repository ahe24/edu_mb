// =============================================================================
// Day 05 Lab ― broken_rtl_fixed.v  (강사용 · 수정본 참조)
// 12건 결함 수정 · DO-254 Error severity 0건 기대
// =============================================================================

module broken_rtl (
  input  wire        clk,
  input  wire        rst_n,
  input  wire        en,
  input  wire [7:0]  din,
  output wire [7:0]  dout
);
  wire [7:0] w1, w3;

  fifo_ctrl       u_fifo  (.clk(clk), .rst_n(rst_n), .din(din), .dout(w1));
  mux_multidrv    u_mux   (.sel(en), .a(din), .b(~din), .y(w3));

  assign dout = w1 ^ w3;

endmodule


// -----------------------------------------------------------------------------
// Fix #1·#2·#3: CP17/CP15/CP18 ― 일관된 NB 사용
// -----------------------------------------------------------------------------
module fifo_ctrl (
  input  wire       clk,
  input  wire       rst_n,
  input  wire [7:0] din,
  output reg  [7:0] dout
);
  reg [7:0] stage1, stage2, tmp;

  // Fix #1 CP17: sequential 블록에서 NB 사용
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n)  stage1 <= 8'h00;
    else         stage1 <= din;
  end

  // Fix #2 CP15: combo 블록에서 blocking 사용
  always @(*) begin
    stage2 = stage1 + 8'h01;
  end

  // Fix #3 CP18: 동일 블록에서 NB 일관 사용
  always @(posedge clk) begin
    tmp  <= stage2 & 8'hF0;
    dout <= tmp | 8'h01;
  end
endmodule


// -----------------------------------------------------------------------------
// Fix #4 CP8: always @(*) 사용으로 감도리스트 완전화
// -----------------------------------------------------------------------------
module decoder_badsens (
  input  wire a, b, c,
  output reg  y
);
  always @(*) begin
    y = a & b & c;
  end
endmodule


// -----------------------------------------------------------------------------
// Fix #5 SS6: 단일 driver로 통합
// -----------------------------------------------------------------------------
module mux_multidrv (
  input  wire       sel,
  input  wire [7:0] a, b,
  output wire [7:0] y
);
  assign y = sel ? b : a;
endmodule


// 나머지 결함 #6~#12 모듈은 제거되고 (또는 아래와 같이 안전 구조로 재작성)
// top에서 인스턴스 제거.

// Fix #6 SS3: FF 삽입으로 combo loop 해소
module feedback_loop (
  input  wire clk, rst_n, d,
  output reg  q
);
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) q <= 1'b0;
    else        q <= (q | d);
  end
endmodule

// Fix #7 unsynth: reset 기반 초기화
module init_block (
  input  wire clk, rst_n,
  output reg  q
);
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) q <= 1'b0;
  end
endmodule

// Fix #8 CP15: delay 제거
module delay_block (
  input  wire clk, d,
  output reg  q
);
  always @(posedge clk) q <= d;
endmodule

// Fix #9 unsynth: $display 제거 (testbench로 이동)
module display_leak (
  input wire clk, sig
);
  // 로깅은 testbench로 분리
endmodule

// Fix #10 SS6: force 제거 · 정상 구조
module force_bad (
  input  wire clk, rst_n,
  output reg  q
);
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) q <= 1'b0;
    else        q <= 1'b1;
  end
endmodule

// Fix #11 SS17: internal 신호 구동
module undriven (
  input  wire d,
  output wire y
);
  assign y = d;
endmodule

// Fix #12 SS18: reset + enable 제어 확보
module flop_no_ctrl (
  input  wire clk, rst_n, en, d,
  output reg  q
);
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n)   q <= 1'b0;
    else if (en)  q <= d;
  end
endmodule
