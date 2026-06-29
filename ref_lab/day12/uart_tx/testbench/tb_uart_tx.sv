// =============================================================================
// Day 12 ― tb_uart_tx.sv
// uart_tx self-checking TB. start+data 구동 → tick 마다 tx 를 프레임으로 캡처 →
// start(0)+data 8비트(LSB first)+stop(1) 재조립해 보낸 바이트와 비교.
//   시뮬 가속: baud_gen CLK_HZ=160, BAUD=10 → DIV=16 tick.
//   각 baud 구간(tick 사이)에 tx 가 유지하는 값을 tick 시점에 캡처.
//   프레임 = [start, d0..d7, stop] 총 10비트. start!=0 / stop!=1 / 값 불일치 시 $error.
//   busy 가 전송 후 idle 에서 deassert 되는지도 확인.
//   $error 0 건 = PASS.
// =============================================================================
`timescale 1ns/1ps

module tb_uart_tx;

  localparam integer CLK_HZ = 160;
  localparam integer BAUD   = 10;    // DIV = 16

  reg        clk = 1'b0, rst, start;
  reg  [7:0] data;
  wire       tx, busy, tick;
  integer    errors = 0;

  baud_gen #(.CLK_HZ(CLK_HZ), .BAUD(BAUD)) u_baud (.clk(clk), .rst(rst), .tick(tick));
  uart_tx  dut (.clk(clk), .rst(rst), .tick(tick), .start(start),
                .data(data), .tx(tx), .busy(busy));

  always #5 clk = ~clk;

  // 한 바이트를 보내고 tx 프레임을 캡처해 재조립·비교
  task send_check(input [7:0] b);
    reg [9:0] frame;     // [0]=start .. [9]=stop
    reg [7:0] got;
    integer   k;
    begin
      // start 펄스 (1-clk)
      @(posedge clk); data = b; start = 1'b1;
      @(posedge clk); start = 1'b0;

      // 10개 baud 구간을 tick 시점에 캡처 (start + 8 data + stop)
      for (k = 0; k < 10; k = k + 1) begin
        @(posedge clk iff (tick && busy));   // 다음 tick 까지 대기
        frame[k] = tx;
      end

      // 프레이밍 검사
      if (frame[0] !== 1'b0) begin
        errors = errors + 1; $error("START bit != 0 (byte %h)", b);
      end
      if (frame[9] !== 1'b1) begin
        errors = errors + 1; $error("STOP bit != 1 (byte %h)", b);
      end
      // data LSB first 재조립
      got = frame[8:1];
      if (got !== b) begin
        errors = errors + 1; $error("DATA mismatch got=%h exp=%h", got, b);
      end

      // idle 복귀 후 busy 해제 확인
      wait (!busy);
      repeat (2) @(posedge clk);
      if (busy !== 1'b0) begin
        errors = errors + 1; $error("busy 가 idle 에서 deassert 안됨");
      end
    end
  endtask

  initial begin
    rst = 1; start = 0; data = 8'h00;
    repeat (3) @(posedge clk);
    rst = 0;
    @(posedge clk);

    send_check(8'hA5);
    send_check(8'h3C);
    send_check(8'hFF);
    send_check(8'h00);

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule
