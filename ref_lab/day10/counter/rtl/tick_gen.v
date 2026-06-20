// =============================================================================
// Day 10 — tick_gen.v
// 보드 메인 클럭(100MHz)에서 1클럭 폭 tick(클럭 인에이블) 생성.
// 새 클럭을 만들지 않고(파생 클럭 금지), 단일 클럭 도메인 + en 펄스로 느린 동작 구현.
//   DIV 클럭마다 tick 을 1클럭 동안 HIGH → counter.en 등에 연결.
//   시뮬에선 DIV 를 작게 override 해 빨리 확인, 합성은 실제 값(예: 1억).
// =============================================================================
module tick_gen #(
  parameter integer DIV = 100_000_000   // 100MHz → 1Hz
)(
  input  wire clk,        // 보드 메인 클럭 100MHz
  input  wire rst,        // 동기 active-high
  output reg  tick        // DIV 클럭마다 1클럭 폭 HIGH
);
  reg [26:0] cnt;
  always @(posedge clk)
    if (rst)               begin cnt <= 0; tick <= 1'b0; end
    else if (cnt == DIV-1) begin cnt <= 0; tick <= 1'b1; end
    else                   begin cnt <= cnt + 1'b1; tick <= 1'b0; end
endmodule
