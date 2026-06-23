// =============================================================================
// Day 11 — tb_pwm_gen.sv   (★ 직접 구현 모듈 pwm_gen 자가검증 ★)
// up_p/dn_p 펄스로 밝기를 0→100→0% 까지 ±5% 쓸어내며 각 단계 PWM duty 측정.
// 한 PWM 주기(PERIOD 클럭) 동안 pwm HIGH 클럭 수를 세어 기대 pct(%)와 비교.
//   · +define+FUNC_SIM 로 컴파일 → pwm_gen 의 PERIOD=100 (HIGH 수 = pct 그대로).
//   · 검증: 0→100% 상승 / 100→0% 하강 / 0·100% 포화 / up·dn 동시입력 무변화 /
//          reset 중 pwm=0. $error 0 건 = PASS.
// =============================================================================
`timescale 1ns/1ps

module tb_pwm_gen;

  localparam integer PERIOD = 100;   // FUNC_SIM 기준 (duty 카운트 == pct%)
  localparam integer STEP   = 5;

  reg  clk = 1'b0, rst, up_p, dn_p;
  wire pwm;
  integer errors = 0;

  pwm_gen dut (.clk(clk), .rst(rst), .up_p(up_p), .dn_p(dn_p), .pwm(pwm));

  always #5 clk = ~clk;              // 100MHz 표현

  // cnt==0 경계로 정렬 후 한 주기 동안 pwm HIGH 수 측정 → 기대 pct 와 비교
  task automatic check_duty(input integer exp_pct);
    integer high, i;
    begin
      while (dut.cnt !== 0) @(posedge clk);
      high = 0;
      for (i = 0; i < PERIOD; i = i + 1) begin
        if (pwm) high = high + 1;
        @(posedge clk);
      end
      if (high !== exp_pct) begin
        errors = errors + 1;
        $error("DUTY MISMATCH meas=%0d exp=%0d%%", high, exp_pct);
      end else
        $display(" pct=%0d%%  duty OK = %0d / %0d", exp_pct, high, PERIOD);
    end
  endtask

  task automatic pulse_up; begin @(negedge clk); up_p = 1'b1; @(negedge clk); up_p = 1'b0; end endtask
  task automatic pulse_dn; begin @(negedge clk); dn_p = 1'b1; @(negedge clk); dn_p = 1'b0; end endtask

  integer k;
  initial begin
    rst = 1; up_p = 0; dn_p = 0;
    repeat (2) @(posedge clk);
    if (pwm !== 1'b0) begin
      errors = errors + 1;
      $error("pwm HIGH during reset t=%0t", $time);
    end
    rst = 0;

    check_duty(0);                                            // 초기 0%
    for (k = 1; k <= 20; k = k + 1) begin pulse_up; check_duty(k*STEP); end  // 0→100% (+5%)
    pulse_up; check_duty(100);                                // 100%에서 +5% → 상한 포화

    for (k = 19; k >= 0; k = k - 1) begin pulse_dn; check_duty(k*STEP); end  // 100→0% (-5%)
    pulse_dn; check_duty(0);                                  // 0%에서 -5% → 하한 포화

    pulse_up; pulse_up; check_duty(10);                       // 10% 로 올린 뒤
    @(negedge clk); up_p = 1'b1; dn_p = 1'b1;                 // up·dn 동시 입력
    @(negedge clk); up_p = 1'b0; dn_p = 1'b0;
    check_duty(10);                                           // 동시 → 변화 없음

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule
