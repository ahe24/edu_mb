// =============================================================================
// Day 13 ― tb_sva_uart.sv                                         [제공 코드]
// uart_tx 단독 + sva_uart_tx checker 결합 TB.
//   자극: start 1클럭 펄스로 4바이트 전송 ― 정상 프로토콜이면 SVA 0 violation.
//   판정: checker 의 sva_err 계층 참조 → RESULT PASS/FAIL.
//
//   시뮬 가속: baud_gen CLK_HZ=160, BAUD=10 → 1비트 = 16클럭.
// =============================================================================
`timescale 1ns/1ps

module tb_sva_uart;

  localparam integer CLK_HZ  = 160;
  localparam integer BAUD    = 10;
  localparam integer BIT_CLK = CLK_HZ / BAUD;   // 16 클럭 / 비트
  localparam integer NBYTES  = 4;

  reg        clk = 1'b0, rst, start;
  reg  [7:0] data;
  wire       tick, tx, busy;

  baud_gen #(.CLK_HZ(CLK_HZ), .BAUD(BAUD))
    u_bg (.clk(clk), .rst(rst), .tick(tick));

  // ── DUT ── (Day12 uart_tx 재사용)
  uart_tx u_tx (.clk(clk), .rst(rst), .tick(tick), .start(start),
                .data(data), .tx(tx), .busy(busy));

  // ── SVA checker ── 포트만 관찰 (TB 레벨 인스턴스 결합)
  sva_uart_tx #(.BIT_CLK(BIT_CLK))
    u_chk (.clk(clk), .rst(rst), .start(start), .busy(busy), .tx(tx));

  always #5 clk = ~clk;

  integer n;
  initial begin
    rst = 1'b1; start = 1'b0; data = 8'h00;
    repeat (4) @(posedge clk);
    rst = 1'b0;
    repeat (BIT_CLK) @(posedge clk);              // idle 확보

    for (n = 0; n < NBYTES; n = n + 1) begin
      data = 8'hA5 ^ (n * 8'h33);
      @(posedge clk); start = 1'b1;               // 1-clk 요청 펄스
      @(posedge clk); start = 1'b0;
      @(posedge busy);                            // 수락(P1) 대기
      @(negedge busy);                            // 프레임 완료 대기
      repeat (BIT_CLK) @(posedge clk);            // 프레임 간 idle
    end

    if (u_chk.sva_err == 0) $display(" RESULT: PASS  (SVA 0 violation)");
    else                    $display(" RESULT: FAIL  (SVA %0d violation)", u_chk.sva_err);
    $finish;
  end

endmodule
