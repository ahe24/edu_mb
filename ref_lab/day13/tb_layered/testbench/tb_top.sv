// =============================================================================
// Day 13 ― tb_top.sv                                              [제공 코드]
// 계층화 TB 최상위 ― 조립과 시나리오만 담당.
//   driver(자극) / monitor(관찰) / scoreboard(판정) 를 인스턴스로 연결하고
//   시나리오는 push_exp → send_byte 반복이 전부. DUT 가 바뀌면 driver/monitor 만
//   교체하면 되는 재사용 구조.
//
//   시뮬 가속: uart_loop override CLK_HZ=160, BAUD=10 → 1비트 = 16클럭.
// =============================================================================
`timescale 1ns/1ps

module tb_top;

  localparam integer CLK_HZ  = 160;
  localparam integer BAUD    = 10;
  localparam integer BIT_CLK = CLK_HZ / BAUD;   // 16 클럭 / 비트
  localparam integer NBYTES  = 8;

  reg  clk = 1'b0, rst;
  wire rx_pin, tx_pin;
  wire [7:0] got;
  wire got_valid, frame_err;

  // ── DUT ── (Day12 uart_loop 재사용 · 시뮬용 파라미터 override)
  uart_loop #(.CLK_HZ(CLK_HZ), .BAUD(BAUD))
    dut (.clk(clk), .rst(rst), .rx_pin(rx_pin), .tx_pin(tx_pin));

  // ── 검증 컴포넌트 ── 역할별 모듈 조립
  uart_driver #(.BIT_CLK(BIT_CLK))
    u_drv (.clk(clk), .rx_pin(rx_pin));

  uart_monitor #(.BIT_CLK(BIT_CLK))
    u_mon (.clk(clk), .rst(rst), .tx_pin(tx_pin),
           .got(got), .got_valid(got_valid), .frame_err(frame_err));

  uart_scoreboard
    u_sb (.clk(clk), .got(got), .got_valid(got_valid), .frame_err(frame_err));

  always #5 clk = ~clk;

  // ── 시나리오 ── 기대값 등록 → 자극 주입 반복이 전부
  integer   n;
  reg [7:0] b;
  initial begin
    rst = 1'b1;
    repeat (4) @(posedge clk);
    rst = 1'b0;
    repeat (BIT_CLK) @(posedge clk);              // idle 확보

    for (n = 0; n < NBYTES; n = n + 1) begin
      b = 8'h3C ^ (n * 8'h11);
      u_sb.push_exp(b);                           // 기대값 등록
      u_drv.send_byte(b);                         // 자극 주입
      repeat (BIT_CLK) @(posedge clk);            // 프레임 간 idle
    end

    wait (u_sb.rd == NBYTES);                     // 판정 완료 대기
    repeat (BIT_CLK) @(posedge clk);
    u_sb.report(NBYTES);
    $finish;
  end

endmodule
