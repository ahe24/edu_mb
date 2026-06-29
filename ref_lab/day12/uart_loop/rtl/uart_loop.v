// =============================================================================
// Day 12 ― uart_loop.v
// UART echo 루프백 top. baud_gen ×2 + uart_rx + uart_tx 통합.
//   rx_pin 으로 받은 바이트(valid)를 그대로 uart_tx start 로 연결 → 즉시 재전송.
//   b1   = 1× tick   (TX 비트 타이밍)
//   b16  = 16× tick  (RX oversample) ― BAUD×16
//   보드: rx_pin=USB-UART RXD, tx_pin=USB-UART TXD (fpga/arty.xdc 참고).
//
//   ※ CLK_HZ/BAUD 는 parameter ― 기본값은 실제 100MHz/115200(합성·보드 동일).
//     시뮬은 TB 에서 작은 값으로 override 해 DIV 축소(빠른 회귀). RTL 한 벌 유지.
// =============================================================================
module uart_loop #(
  parameter integer CLK_HZ = 100_000_000,
  parameter integer BAUD   = 115200
)(
  input  wire clk, rst,
  input  wire rx_pin,           // FT2232 → FPGA
  output wire tx_pin            // FPGA → FT2232
);
  wire tick, tick16, valid;
  wire [7:0] rdata;

  baud_gen #(.CLK_HZ(CLK_HZ), .BAUD(BAUD))    u_b1 (.clk(clk),.rst(rst),.tick(tick));
  baud_gen #(.CLK_HZ(CLK_HZ), .BAUD(BAUD*16)) u_b16(.clk(clk),.rst(rst),.tick(tick16));

  // 수신
  uart_rx u_rx (.clk(clk),.rst(rst),.tick16(tick16),.rx_in(rx_pin),
                .data(rdata), .valid(valid));
  // 받은 바이트를 그대로 재전송 (echo)
  uart_tx u_tx (.clk(clk),.rst(rst),.tick(tick),.start(valid),.data(rdata),
                .tx(tx_pin), .busy());
endmodule
