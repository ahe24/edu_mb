// =============================================================================
// Day 10 — tb_counter.sv
// reference model 기반 self-checking TB.
// DUT 와 동일 규칙의 기대 모델(model)을 병렬 구동, 매 클럭 cnt 를 자동 비교.
//   $error 0 건 = PASS. 파형 육안 확인 없이 회귀(CI)에 그대로 사용.
// =============================================================================
`timescale 1ns/1ps

module tb_counter;

  localparam W = 4;

  reg          clk = 1'b0, rst, en;
  wire [W-1:0] cnt;
  reg  [W-1:0] model;                 // golden 기대값
  integer      errors = 0;

  counter #(.W(W)) dut (.clk(clk), .rst(rst), .en(en), .cnt(cnt));

  always #5 clk = ~clk;               // 100MHz

  // 기대 모델 — DUT 와 동일한 규칙
  always @(posedge clk)
    if (rst)     model <= 0;
    else if (en) model <= model + 1'b1;

  // 자동 판정 — !== 로 X/Z 까지 검출
  always @(posedge clk)
    if (!rst && cnt !== model) begin
      errors = errors + 1;
      $error("MISMATCH t=%0t cnt=%h exp=%h", $time, cnt, model);
    end

  initial begin
    rst = 1; en = 0;
    repeat (2) @(posedge clk);
    rst = 0; en = 1;
    repeat (20) @(posedge clk);       // wrap(15→0) 포함 충분히

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule
