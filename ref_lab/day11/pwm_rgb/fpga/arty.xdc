## ==================================================================
## Day 11 pwm_rgb — arty.xdc (Arty A7-35T Master 발췌)
## 보드 top = pwm_top (clk 100MHz, PWM 1kHz)
##   clk → 100MHz   rst → BTN0   btn_up → BTN1(+5%)   btn_dn → BTN2(-5%)
##   RGB LED LD0 (녹색 = 밝기, 적·청 off) + 단색 User LED LD4 (동일 밝기)
## ※ 밝기 0~100% ±5% — duty 상한 없음. RGB 가 100%에서 눈부시면 단색 LED 로 확인.
## ※ PWM 주파수 200Hz~1kHz (PWM_HZ). 100MHz ÷ 100,000 = 1kHz(1ms).
## ※ btn_up/btn_dn 는 raw 버튼 — top 내부 debounce+상승엣지로 1펄스 생성.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## 쓰지 않는 핀은 주석 처리해 이후 실습에서 계속 재사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── btn_up → 푸시버튼 BTN1 (+5%) ──
set_property -dict { PACKAGE_PIN C9  IOSTANDARD LVCMOS33 } [get_ports { btn_up }];

## ── btn_dn → 푸시버튼 BTN2 (-5%) ──
set_property -dict { PACKAGE_PIN B9  IOSTANDARD LVCMOS33 } [get_ports { btn_dn }];

## ── RGB LED LD0 — 녹색만 밝기 표시(적·청 off) ──
set_property -dict { PACKAGE_PIN F6  IOSTANDARD LVCMOS33 } [get_ports { rgb_g }];
set_property -dict { PACKAGE_PIN G6  IOSTANDARD LVCMOS33 } [get_ports { rgb_r }];
set_property -dict { PACKAGE_PIN E1  IOSTANDARD LVCMOS33 } [get_ports { rgb_b }];

## ── 단색 User LED LD4 — 동일 밝기(100% 풀레인지 확인용) ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { mono }];
