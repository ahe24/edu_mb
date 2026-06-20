// =============================================================================
// Day 11 — tb_pwm_rgb.sv
// 버튼 펄스로 OFF→DIM→MID→MAX→OFF 순환, 각 모드의 PWM duty 를 직접 측정.
// 한 PWM 주기(PERIOD 클럭) 동안 rgb HIGH 클럭 수를 세어 기대값과 비교 — $error 0 건 = PASS.
//   시뮬 가속: CLK_HZ=256, PWM_HZ=1 → PERIOD=256 (보드는 100MHz/1kHz=100,000).
//   기대 duty: OFF=0 · DIM=P/8 · MID=P/4 · MAX=P/2(=50% 상한).
//   ※ RGB 는 눈부심으로 50% 초과 금지 — MAX 가 정확히 PERIOD/2 인지도 함께 확인.
// =============================================================================
`timescale 1ns/1ps

module tb_pwm_rgb;

  localparam integer CLK_HZ = 256;
  localparam integer PWM_HZ = 1;
  localparam integer PERIOD = CLK_HZ / PWM_HZ;   // 256

  reg  clk = 1'b0, rst, btn_p;
  wire rgb;
  integer errors = 0;

  pwm_rgb #(.CLK_HZ(CLK_HZ), .PWM_HZ(PWM_HZ)) dut
    (.clk(clk), .rst(rst), .btn_p(btn_p), .rgb(rgb));

  always #5 clk = ~clk;                   // 100MHz 표현

  // cnt==0 경계로 정렬 — 한 PWM 주기를 0..PERIOD-1 로 깔끔히 측정
  task wait_cnt0;
    begin while (dut.cnt !== 0) @(posedge clk); end
  endtask

  // 정렬된 한 주기 동안 rgb HIGH 클럭 수 측정 → 기대 duty 와 비교
  task check_duty(input integer exp_duty, input [127:0] name);
    integer high; integer i;
    begin
      wait_cnt0;
      high = 0;
      for (i = 0; i < PERIOD; i = i + 1) begin
        if (rgb) high = high + 1;         // 현재 클럭의 rgb 표본
        @(posedge clk);
      end
      if (high !== exp_duty) begin
        errors = errors + 1;
        $error("DUTY MISMATCH mode=%0s meas=%0d exp=%0d", name, high, exp_duty);
      end else
        $display(" %0s duty OK = %0d / %0d (%0d%%)", name, high, PERIOD, (high*100)/PERIOD);
    end
  endtask

  // 1-clk 버튼 펄스 (다음 posedge 에서 mode 증가)
  task press;
    begin
      @(negedge clk); btn_p = 1'b1;
      @(negedge clk); btn_p = 1'b0;
    end
  endtask

  initial begin
    rst = 1; btn_p = 0;
    repeat (2) @(posedge clk);

    // reset 중 rgb 폭주 방지 확인 — duty=0 이므로 rgb 는 항상 0
    if (rgb !== 1'b0) begin
      errors = errors + 1;
      $error("rgb HIGH during reset t=%0t", $time);
    end
    rst = 0;

    check_duty(0,            "OFF");               // 초기 모드 OFF
    press;  check_duty(PERIOD/8, "DIM");           // 12.5%
    press;  check_duty(PERIOD/4, "MID");           // 25%
    press;  check_duty(PERIOD/2, "MAX");           // 50% (RGB 상한 — 측정으로 확인)
    press;  check_duty(0,            "OFF(wrap)"); // MAX→OFF 순환 확인

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule
