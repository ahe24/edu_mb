// =============================================================================
// Day 12 — tb_uart_rx.sv
// uart_rx self-checking TB. rx_in 을 정확한 비트 주기로 bit-bang → 알려진 바이트 주입,
// valid 가 1회 펄스 + data == 보낸 바이트인지 자동 판정.
//   시뮬 가속: baud_gen CLK_HZ=160, BAUD=160 → DIV=1 → tick16 매 클럭.
//   ∴ 1비트 = 16 tick16 = 16 클럭. send_byte 가 비트당 16클럭 유지로 프레임 생성.
//   프레임 = start(0) + 8 data(LSB first) + stop(1).
//   2FF 동기화 확인: rx_in 을 비정렬 시점에 바꿔도 정상 수신.
//   valid 중복/누락, data 불일치 시 $error. $error 0 건 = PASS.
// =============================================================================
`timescale 1ns/1ps

module tb_uart_rx;

  localparam integer CLK_HZ = 160;
  localparam integer BAUD   = 160;   // DIV = 1 → tick16 매 클럭
  localparam integer BIT_CLK = 16;   // 1비트 = 16 클럭

  reg        clk = 1'b0, rst, rx_in;
  wire [7:0] data;
  wire       valid, tick16;
  integer    errors    = 0;
  integer    valid_cnt = 0;
  reg  [7:0] last_data;

  baud_gen #(.CLK_HZ(CLK_HZ), .BAUD(BAUD)) u_baud (.clk(clk), .rst(rst), .tick(tick16));
  uart_rx  dut (.clk(clk), .rst(rst), .tick16(tick16), .rx_in(rx_in),
                .data(data), .valid(valid));

  always #5 clk = ~clk;

  // valid 펄스 관측 → 수신 바이트 적재
  always @(posedge clk)
    if (valid) begin valid_cnt = valid_cnt + 1; last_data = data; end

  // rx_in 을 dur 클럭 동안 v 로 유지
  task drive_bit(input v, input integer dur);
    integer k;
    begin
      for (k = 0; k < dur; k = k + 1) begin rx_in = v; @(posedge clk); end
    end
  endtask

  // 1바이트를 직렬 프레임으로 송출 (start + 8 LSB-first + stop)
  task send_byte(input [7:0] b);
    integer i;
    begin
      drive_bit(1'b0, BIT_CLK);              // start
      for (i = 0; i < 8; i = i + 1)
        drive_bit(b[i], BIT_CLK);            // LSB first
      drive_bit(1'b1, BIT_CLK);              // stop
    end
  endtask

  // 1바이트 송출 후 valid·data 검증
  task send_check(input [7:0] b);
    integer prev;
    begin
      prev = valid_cnt;
      send_byte(b);
      drive_bit(1'b1, BIT_CLK);              // idle 여유 (valid 안착)
      if (valid_cnt !== prev + 1) begin
        errors = errors + 1;
        $error("valid 펄스 != 1 (byte %h) cnt=%0d", b, valid_cnt - prev);
      end
      if (last_data !== b) begin
        errors = errors + 1;
        $error("DATA mismatch got=%h exp=%h", last_data, b);
      end
    end
  endtask

  initial begin
    rst = 1; rx_in = 1'b1;          // idle = 1
    repeat (3) @(posedge clk);
    rst = 0;
    drive_bit(1'b1, BIT_CLK);       // idle 안정

    send_check(8'h55);
    send_check(8'hA3);
    send_check(8'h7E);
    send_check(8'h00);

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule
