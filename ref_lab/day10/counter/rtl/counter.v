// =============================================================================
// Day 10 ― counter.v
// N-bit 동기 카운터. 클럭 엣지마다 en 이면 +1, W비트 한계에서 자동 wrap.
//   rst : 동기 active-high ― 클럭 엣지에서만 0
//   en  : 1일 때만 증가, 0이면 값 유지
// =============================================================================
module counter #(
  parameter integer W = 4          // 비트 폭
)(
  input  wire         clk,
  input  wire         rst,         // 동기 active-high
  input  wire         en,          // 1일 때만 증가
  output reg  [W-1:0] cnt
);

  always @(posedge clk) begin
    if (rst)      cnt <= {W{1'b0}};   // 0으로
    else if (en)  cnt <= cnt + 1'b1;  // 증가 (W비트 자동 wrap)
    // en=0 이면 값 유지
  end

endmodule
