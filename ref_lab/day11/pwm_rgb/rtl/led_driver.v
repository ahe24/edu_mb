// =============================================================================
// Day 11 ― led_driver.v   (제공 모듈 ― 보드 LED 핀 분배 / I/O 추상화)
// pwm_gen 의 PWM 1비트를 보드 물리 LED 핀에 분배.
//   · RGB LED 는 녹색 채널만 밝기 표시(적·청은 off).
//   · 같은 PWM 을 단색 User LED 에도 출력 → 100% 풀레인지를 눈부심 없이 확인.
//   설계 로직(pwm_gen)과 보드 핀 매핑을 분리해 모듈별 독립 검증을 쉽게 한다.
// =============================================================================
module led_driver (
  input  wire pwm,                  // 밝기 PWM (pwm_gen 출력)
  output wire rgb_r,                // RGB 적 ― 미사용(0)
  output wire rgb_g,                // RGB 녹 ― 밝기 표시
  output wire rgb_b,                // RGB 청 ― 미사용(0)
  output wire mono                  // 단색 User LED ― 동일 밝기(풀레인지 확인)
);
  assign rgb_g = pwm;               // 녹색 채널에 PWM
  assign mono  = pwm;               // 단색 LED 에도 같은 PWM
  assign rgb_r = 1'b0;
  assign rgb_b = 1'b0;
endmodule
