// =============================================================================
// Day 09 — tb_logic_gates.sv
// sw 4 조합(00→01→10→11)을 순차 인가, led / rgb0 / rgb1 / rgb2 를
//   ① $display 로 관찰 (Visualizer 파형과 대조)
//   ② golden 기대값과 self-checking 자동 판정 ($error 0 건 = PASS)
// =============================================================================
`timescale 1ns/1ps

module tb_logic_gates;

  // --- DUT 연결 신호 ---------------------------------------------------------
  reg  [1:0] sw;
  wire [1:0] led;
  wire [2:0] rgb0, rgb1, rgb2;

  logic_gates dut (
    .sw(sw), .led(led),
    .rgb0(rgb0), .rgb1(rgb1), .rgb2(rgb2)
  );

  // --- golden 기대값 (조합논리 → 코드로 직접 계산) ---------------------------
  function automatic [2:0] exp_rgb (input bit hit, input [2:0] color);
    exp_rgb = hit ? color : 3'b000;
  endfunction

  integer i;
  integer errors = 0;

  task automatic check (input [1:0] s);
    reg [1:0] e_led;
    reg [2:0] e_rgb0, e_rgb1, e_rgb2;
    begin
      sw = s;  #10;                       // 인가 후 조합 지연 대기
      e_led  = s;
      e_rgb0 = exp_rgb(s[0] & s[1], 3'b101);  // AND → R+B
      e_rgb1 = exp_rgb(s[0] | s[1], 3'b011);  // OR  → G+B
      e_rgb2 = exp_rgb(s[0] ^ s[1], 3'b110);  // XOR → R+G

      $display("sw=%b | led=%b rgb0=%b rgb1=%b rgb2=%b",
               sw, led, rgb0, rgb1, rgb2);

      // !== 사용 — X/Z 불일치까지 검출
      if (led !== e_led || rgb0 !== e_rgb0 || rgb1 !== e_rgb1 || rgb2 !== e_rgb2) begin
        errors = errors + 1;
        $error("MISMATCH @ sw=%b : led=%b(exp %b) rgb0=%b(exp %b) rgb1=%b(exp %b) rgb2=%b(exp %b)",
               sw, led, e_led, rgb0, e_rgb0, rgb1, e_rgb1, rgb2, e_rgb2);
      end
    end
  endtask

  initial begin
    $display("============================================================");
    $display(" Day09 logic_gates — AND/OR/XOR → RGB LED self-checking TB");
    $display("------------------------------------------------------------");

    for (i = 0; i < 4; i = i + 1)
      check(i[1:0]);                       // 00 → 01 → 10 → 11

    $display("------------------------------------------------------------");
    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $display("============================================================");
    $finish;
  end

endmodule
