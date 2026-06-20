// =============================================================================
// Day 12 — tb_baud_gen.sv
// baud_gen self-checking TB. tick 간 클럭 수 = DIV 인지, tick 이 1클럭 폭인지 자동 판정.
//   시뮬 가속: CLK_HZ=160, BAUD=10 → DIV=16 (실제 868 대신 작은 값으로 빠르게).
//   tick 펄스 간격을 클럭으로 세어 DIV 와 비교, tick 폭이 2클럭 이상이면 $error.
//   $error 0 건 = PASS.
// =============================================================================
`timescale 1ns/1ps

module tb_baud_gen;

  localparam integer CLK_HZ = 160;
  localparam integer BAUD   = 10;
  localparam integer DIV    = CLK_HZ / BAUD;   // = 16

  reg     clk = 1'b0, rst;
  wire    tick;
  integer errors  = 0;
  integer gap     = 0;     // 직전 tick 이후 경과 클럭
  integer ticks   = 0;     // 관측한 tick 개수
  integer hi_len  = 0;     // 현재 tick HIGH 연속 클럭

  baud_gen #(.CLK_HZ(CLK_HZ), .BAUD(BAUD)) dut (.clk(clk), .rst(rst), .tick(tick));

  always #5 clk = ~clk;    // 100MHz 스케일

  // tick 간격 = DIV 검증 + 1클럭 폭 검증
  always @(posedge clk) begin
    if (rst) begin gap <= 0; hi_len <= 0; end
    else begin
      // 폭: tick 이 연속 HIGH 면 누적 → 2 이상이면 1클럭 폭 위반
      if (tick) begin
        hi_len <= hi_len + 1;
        if (hi_len >= 1) begin
          errors = errors + 1;
          $error("WIDTH t=%0t tick HIGH 2클럭 이상", $time);
        end
      end else hi_len <= 0;

      // 간격: tick 마다 직전 tick 이후 클럭 수가 DIV 인지
      if (tick) begin
        if (ticks > 0 && gap !== DIV) begin
          errors = errors + 1;
          $error("PERIOD t=%0t gap=%0d exp=%0d", $time, gap, DIV);
        end
        ticks = ticks + 1;
        gap <= 1;
      end else gap <= gap + 1;
    end
  end

  initial begin
    rst = 1;
    repeat (3) @(posedge clk);
    rst = 0;
    repeat (DIV*8 + 4) @(posedge clk);   // 여러 tick 주기 관측

    if (ticks < 3) begin
      errors = errors + 1;
      $error("tick 미발생/부족 ticks=%0d", ticks);
    end

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule
