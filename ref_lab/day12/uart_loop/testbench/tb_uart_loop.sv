// =============================================================================
// Day 12 ― tb_uart_loop.sv
// uart_loop echo 루프백 scoreboard self-checking TB.
//   rx_pin 으로 생성한 프레임을 주입 → 기대 바이트를 queue 에 push →
//   tx_pin 으로 되돌아오는 echo 프레임을 디코드해 queue 와 pop·비교.
//   프레임/순서/값 자동 판정 ― $error 0 건 = PASS.
//
//   시뮬 가속: uart_loop override CLK_HZ=160, BAUD=10
//     → 1× DIV=16, 16× DIV=1 → 1비트 = 16 클럭 (TX·RX 정합).
//   4000-클럭 대기 불필요 ― N 바이트가 빠르게 완료.
// =============================================================================
`timescale 1ns/1ps

module tb_uart_loop;

  localparam integer CLK_HZ  = 160;
  localparam integer BAUD    = 10;     // 1× DIV=16
  localparam integer BIT_CLK = CLK_HZ / BAUD;   // 16 클럭 / 비트
  localparam integer NBYTES  = 8;

  reg  clk = 1'b0, rst, rx_pin;
  wire tx_pin;
  integer errors = 0;

  // DUT ― 작은 baud 로 override
  uart_loop #(.CLK_HZ(CLK_HZ), .BAUD(BAUD))
    dut (.clk(clk), .rst(rst), .rx_pin(rx_pin), .tx_pin(tx_pin));

  always #5 clk = ~clk;

  // scoreboard queue ― 보낸 바이트 적재, echo 디코드 시 pop
  reg [7:0] sb [0:63];
  integer   wr = 0, rd = 0;

  // ── rx_pin 으로 프레임 주입 ──
  task tx_bit(input v);
    integer k;
    begin for (k = 0; k < BIT_CLK; k = k + 1) @(posedge clk) rx_pin = v; end
  endtask

  task send_frame(input [7:0] b);
    integer i;
    begin
      tx_bit(1'b0);                       // start
      for (i = 0; i < 8; i = i + 1) tx_bit(b[i]);   // LSB first
      tx_bit(1'b1);                       // stop
    end
  endtask

  // ── tx_pin echo 프레임 디코드 (bit-center 샘플) ──
  //   start 하강엣지 검출 → 1.5 비트 대기(start 중앙→첫 data 중앙) →
  //   비트마다 BIT_CLK 간격 LSB first 샘플 → stop 확인.
  task automatic decode_one;
    reg [7:0] got;
    integer   i, j;
    begin
      @(negedge tx_pin);                  // start 진입
      repeat (BIT_CLK + BIT_CLK/2) @(posedge clk);   // 첫 data 비트 중앙
      for (i = 0; i < 8; i = i + 1) begin
        got[i] = tx_pin;                  // LSB first
        if (i < 7) repeat (BIT_CLK) @(posedge clk);
      end
      repeat (BIT_CLK) @(posedge clk);    // stop 비트 중앙
      if (tx_pin !== 1'b1) begin
        errors = errors + 1; $error("echo STOP bit != 1 (got %h)", got);
      end
      // scoreboard 비교·pop
      if (rd >= wr) begin
        errors = errors + 1; $error("예상보다 많은 echo (got %h)", got);
      end else begin
        if (got !== sb[rd]) begin
          errors = errors + 1;
          $error("byte %0d: got %h exp %h", rd, got, sb[rd]);
        end
        rd = rd + 1;
      end
    end
  endtask

  // echo 디코더 ― NBYTES 만큼 수신
  initial begin : decoder
    integer n;
    @(negedge rst);
    for (n = 0; n < NBYTES; n = n + 1) decode_one;
  end

  // 자극 ― NBYTES 송신
  initial begin : stimulus
    integer n;
    reg [7:0] b;
    rst = 1; rx_pin = 1'b1;               // idle = 1
    repeat (4) @(posedge clk);
    rst = 0;
    repeat (BIT_CLK) @(posedge clk);      // idle 안정

    for (n = 0; n < NBYTES; n = n + 1) begin
      b = 8'h3C ^ (n * 8'h11);
      sb[wr] = b; wr = wr + 1;
      send_frame(b);
      repeat (BIT_CLK) @(posedge clk);    // 프레임 간 idle
    end

    // 모든 echo 디코드 완료 대기
    wait (rd == NBYTES);
    repeat (BIT_CLK) @(posedge clk);

    if (errors == 0 && rd == NBYTES) $display(" RESULT: PASS  (0 mismatch)");
    else $display(" RESULT: FAIL  (%0d mismatch, rd=%0d)", errors, rd);
    $finish;
  end

endmodule
