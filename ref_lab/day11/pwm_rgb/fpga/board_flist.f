# Day 11 pwm_rgb — 보드 합성용 파일리스트 (fpga/ 기준 상대경로)
# 보드 top = pwm_top. 구성요소 ①②③④ 를 모두 포함 (TB 는 제외).
#   ① debounce.v   버튼 채터링 제거 + 2FF 동기화  ← seq_detect 원본 재사용(사본 금지)
#   ③ pwm_gen.v    밝기 ±5% saturating + PWM 비교 (직접 구현)
#   ④ led_driver.v PWM → RGB 녹색 + 단색 LED 분배
#   ②+배선 pwm_top  최상위(엣지검출 + 인스턴스)
../../seq_detect/rtl/debounce.v
../rtl/pwm_gen.v
../rtl/led_driver.v
../rtl/pwm_top.v
