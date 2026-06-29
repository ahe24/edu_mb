// =============================================================================
// Day 10 ― tb_debounce.sv
// 방향성(directed) self-checking TB. STABLE 을 작게 override.
//   - 짧은 글리치(STABLE 미만)는 흡수 → btn_out 불변
//   - 지속 입력(STABLE 초과)은 btn_out 에 반영
//   expect_out() 자동 판정 ― $error 0 건 = PASS.
// =============================================================================
`timescale 1ns/1ps

module tb_debounce;

  localparam STABLE = 4;               // 데모 (보드는 1_000_000)

  reg  clk = 1'b0, rst, btn_in;
  wire btn_out;
  integer errors = 0;

  debounce #(.STABLE(STABLE)) dut (.clk(clk), .rst(rst), .btn_in(btn_in), .btn_out(btn_out));

  always #5 clk = ~clk;               // 100MHz

  task automatic expect_out(input v, input [255:0] msg);
    if (btn_out !== v) begin
      errors = errors + 1;
      $error("%0s: btn_out=%b exp=%b @%0t", msg, btn_out, v, $time);
    end
  endtask

  initial begin
    rst = 1; btn_in = 0;
    repeat (3) @(posedge clk); rst = 0;
    repeat (4) @(posedge clk);
    expect_out(1'b0, "idle low");

    // 짧은 글리치 (STABLE 미만) → 흡수
    btn_in = 1; repeat (2) @(posedge clk); btn_in = 0;
    repeat (8) @(posedge clk);
    expect_out(1'b0, "short glitch absorbed");

    // 지속 high (sync 2 + STABLE 여유) → 반영
    btn_in = 1; repeat (STABLE + 6) @(posedge clk);
    expect_out(1'b1, "sustained high");

    // 지속 low → 반영
    btn_in = 0; repeat (STABLE + 6) @(posedge clk);
    expect_out(1'b0, "sustained low");

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule
