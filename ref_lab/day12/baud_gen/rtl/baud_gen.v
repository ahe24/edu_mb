// =============================================================================
// Day 12 — baud_gen.v
// baud rate tick 생성기. 시스템 클럭을 DIV 분주해 1클럭 폭 tick 펄스 출력.
//   ※ 클럭을 분주해 새 클럭을 만드는 것이 아니라, 단일 clk 카운터가
//     cnt==DIV-1 마다 tick 을 1클럭 HIGH (단일 클럭 도메인).
//   DIV = CLK_HZ / BAUD. 100MHz / 115200 ≈ 868.
//   TX 는 1× tick, RX 는 16× tick(BAUD×16)으로 비트 중앙 샘플.
//   ※ DIV 은 parameter — 시뮬은 TB 에서 작은 CLK_HZ/BAUD 로 인스턴스해 빠르게 확인
//     (RTL 기본값은 실제 100MHz/115200 유지, 합성 동일).
// =============================================================================
module baud_gen #(
  parameter integer CLK_HZ = 100_000_000,
  parameter integer BAUD   = 115200
)(
  input  wire clk,
  input  wire rst,               // 동기 active-high
  output reg  tick               // baud rate 1-clk 펄스
);
  localparam integer DIV = CLK_HZ / BAUD;   // ≈ 868
  reg [$clog2(DIV)-1:0] cnt;
  always @(posedge clk)
    if (rst)             begin cnt <= 0; tick <= 1'b0; end
    else if (cnt==DIV-1) begin cnt <= 0; tick <= 1'b1; end
    else                 begin cnt <= cnt + 1'b1; tick <= 1'b0; end
endmodule
