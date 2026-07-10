// =============================================================================
// Day 13 ― uart_driver.sv                                       [구현 대상]
// 역할: 자극 주입 전담 ― 바이트를 UART frame(start+8data+stop, LSB first)으로
//   변환해 rx_pin 직렬 라인에 구동. 검사·관찰 책임 없음(역할 분리).
//   tb_top 에서 u_drv.send_byte(b) 계층 참조로 호출해 재사용.
// =============================================================================
module uart_driver #(
  parameter integer BIT_CLK = 16      // 1비트 = BIT_CLK 클럭
)(
  input  wire clk,
  output reg  rx_pin                  // DUT 직렬 입력 (idle=1)
);
  initial rx_pin = 1'b1;              // idle 레벨

  // 한 비트를 BIT_CLK 클럭 동안 유지
  task tx_bit(input v);
    integer k;
    begin for (k = 0; k < BIT_CLK; k = k + 1) @(posedge clk) rx_pin = v; end
  endtask

  // 바이트 1개 = start(0) + data 8비트(LSB first) + stop(1)
  task send_byte(input [7:0] b);
    integer i;
    begin
      tx_bit(1'b0);                                  // start
      for (i = 0; i < 8; i = i + 1) tx_bit(b[i]);    // LSB first
      tx_bit(1'b1);                                  // stop
    end
  endtask
endmodule
