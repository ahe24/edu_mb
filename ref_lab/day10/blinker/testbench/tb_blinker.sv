// =============================================================================
// Day 10 — tb_blinker.sv
// DIV 를 작게 override 해 분주를 빨리 확인. reference model 과 매 클럭 led 비교.
//   $error 0 건 = PASS.
// =============================================================================
`timescale 1ns/1ps

module tb_blinker;

  localparam DIV = 4;                  // 데모 분주비 (보드는 50_000_000)

  reg  clk = 1'b0, rst;
  wire led;
  reg  mled; reg [25:0] mcnt;          // golden 모델
  integer errors = 0;

  blinker #(.DIV(DIV)) dut (.clk(clk), .rst(rst), .led(led));

  always #5 clk = ~clk;               // 100MHz

  // 기대 모델 — DUT 와 동일 규칙
  always @(posedge clk)
    if (rst)               begin mcnt <= 0; mled <= 1'b0; end
    else if (mcnt == DIV-1) begin mcnt <= 0; mled <= ~mled; end
    else                   mcnt <= mcnt + 1'b1;

  always @(posedge clk)
    if (!rst && led !== mled) begin
      errors = errors + 1;
      $error("MISMATCH t=%0t led=%b exp=%b", $time, led, mled);
    end

  initial begin
    rst = 1; repeat (2) @(posedge clk); rst = 0;
    repeat (40) @(posedge clk);        // 여러 토글 주기 관찰

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule
