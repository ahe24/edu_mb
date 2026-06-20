// =============================================================================
// Day 09 — tb_sw_led.sv
// sw 16조합(0000~1111)을 순차 인가, led = sw / led_n = ~sw 를
//   ① $display 로 관찰 (Visualizer 파형과 대조)
//   ② golden 기대값과 self-checking 자동 판정 ($error 0 건 = PASS)
// =============================================================================
`timescale 1ns/1ps

module tb_sw_led;

  reg  [3:0] sw;
  wire [3:0] led;
  wire [3:0] led_n;

  sw_led dut (.sw(sw), .led(led), .led_n(led_n));

  integer i;
  integer errors = 0;

  initial begin
    $display("============================================================");
    $display(" Day09 sw_led — pass-through / invert self-checking TB");
    $display("------------------------------------------------------------");

    for (i = 0; i < 16; i = i + 1) begin
      sw = i[3:0];  #10;                       // 인가 후 조합 지연 대기
      $display("sw=%b | led=%b led_n=%b", sw, led, led_n);

      if (led !== sw || led_n !== ~sw) begin   // !== : X/Z 까지 검출
        errors = errors + 1;
        $error("MISMATCH @ sw=%b : led=%b(exp %b) led_n=%b(exp %b)",
               sw, led, sw, led_n, ~sw);
      end
    end

    $display("------------------------------------------------------------");
    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $display("============================================================");
    $finish;
  end

endmodule
