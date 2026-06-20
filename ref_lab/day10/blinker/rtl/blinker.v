// =============================================================================
// Day 10 — blinker.v
// 클럭 분주 LED 점멸기. 100MHz 클럭을 카운터로 분주해 led 를 일정 주기로 토글.
//   ※ 클럭을 분주해 새 클럭을 만드는 것이 아니라, 단일 clk 로 카운터를 돌려
//     cnt==DIV-1 마다 led 를 반전(단일 클럭 도메인).
//   LED 주기 = 2 × DIV × Tclk. DIV=50M, Tclk=10ns → 1초 ON / 1초 OFF.
//   시뮬은 +define+FUNC_SIM 로 컴파일 → DIV 축소해 빨리 확인(동일 RTL).
// =============================================================================
module blinker (
  input  wire clk,
  input  wire rst,          // 동기 active-high
  output reg  led
);
  // 기능검증 컴파일(+define+FUNC_SIM)이면 DIV 축소 → 빨리 토글, 합성은 실제 값
`ifdef FUNC_SIM
  localparam integer DIV = 4;            // 시뮬용
`else
  localparam integer DIV = 50_000_000;   // 100MHz → ~1Hz
`endif

  reg [25:0] cnt;
  always @(posedge clk) begin
    if (rst)               begin cnt <= 0; led <= 1'b0; end
    else if (cnt == DIV-1) begin cnt <= 0; led <= ~led; end  // 주기마다 토글
    else                   cnt <= cnt + 1'b1;
  end
endmodule
