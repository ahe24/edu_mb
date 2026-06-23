// =============================================================================
// Day 11 — pwm_top.v   (제공 모듈 — 보드 최상위: 배선 + 상승엣지 검출)
// 버튼 2개로 밝기를 조절하는 보드 top. 구성요소를 인스턴스/배선만 한다.
//
//   BTN0 → rst    : 밝기 0% 로 복귀 (동기 active-high)
//   BTN1 → btn_up : 누를 때마다 +5%  (raw·비동기)
//   BTN2 → btn_dn : 누를 때마다 -5%
//   RGB LD0 녹색 + 단색 User LED 에 동일 밝기 출력
//
// 데이터 흐름 (구성요소 4단계):
//   BTN1(raw) ─►[① debounce]─► up_lvl ─►[② edge]─► up_p ┐
//   BTN2(raw) ─►[① debounce]─► dn_lvl ─►[② edge]─► dn_p ┤►[③ pwm_gen]─► pwm ─►[④ led_driver]─► LED
//
// 왜? 100MHz 에서 버튼을 손으로 누르면 채터링·메타안정 + 누르는 동안 수억 클럭.
//   ① 버튼을 깨끗한 레벨로, ② 누른 "순간"만 1클럭 펄스로 바꿔 ③ pwm_gen 이
//   한 번에 정확히 STEP% 만 증감하게 한다. (Day10 debounce.v 그대로 재사용)
// =============================================================================
module pwm_top (
  input  wire clk,            // 100MHz 시스템 클럭
  input  wire rst,            // BTN0 (동기 active-high)
  input  wire btn_up,         // BTN1 (+5% 버튼, raw·비동기)
  input  wire btn_dn,         // BTN2 (-5% 버튼, raw·비동기)
  output wire rgb_r,          // RGB LD0 적 (off)
  output wire rgb_g,          // RGB LD0 녹 (밝기)
  output wire rgb_b,          // RGB LD0 청 (off)
  output wire mono            // 단색 User LED (밝기)
);
  // ── ① 버튼 2개 디바운스(+2FF 동기화) — Day10 재사용 ──
  wire up_lvl, dn_lvl;
  debounce u_db_up (.clk(clk), .rst(rst), .btn_in(btn_up), .btn_out(up_lvl));
  debounce u_db_dn (.clk(clk), .rst(rst), .btn_in(btn_dn), .btn_out(dn_lvl));

  // ── ② 상승엣지 검출 — 누른 순간만 1클럭 펄스 ──
  reg up_d, dn_d;
  always @(posedge clk)
    if (rst) {up_d, dn_d} <= 2'b00;
    else     {up_d, dn_d} <= {up_lvl, dn_lvl};
  wire up_p = up_lvl & ~up_d;
  wire dn_p = dn_lvl & ~dn_d;

  // ── ③ PWM 생성기(직접 구현) → ④ LED 드라이버 ──
  wire pwm;
  pwm_gen u_pwm (.clk(clk), .rst(rst), .up_p(up_p), .dn_p(dn_p), .pwm(pwm));
  led_driver u_led (.pwm(pwm), .rgb_r(rgb_r), .rgb_g(rgb_g), .rgb_b(rgb_b), .mono(mono));
endmodule
