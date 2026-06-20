## ==================================================================
## Day 11 pwm_rgb — arty.xdc (Arty A7-35T Master 발췌)
## 보드 top = pwm_rgb (clk 100MHz, PWM 1kHz)
##   clk → 100MHz   rst → 푸시버튼 BTN0   btn_p → 푸시버튼 BTN1
##   rgb → RGB LED LD0 Green 채널
## ※ RGB LED는 매우 밝아 최대 duty 50% 상한(코드 PERIOD/2). 단색 User LED는 100% 가능.
## ※ PWM 주파수 200Hz~1kHz (PWM_HZ). 100MHz ÷ 100,000 = 1kHz(1ms).
## 쓰지 않는 핀은 주석 처리해 이후 실습에서 계속 재사용.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ※ btn_p 는 1-clk 펄스 입력 — 실제 보드에서는 Day10 디바운서+엣지검출을 거친
##    상승엣지 1펄스를 연결할 것. raw 버튼을 직접 받으면 누르는 동안 mode 폭주.
##    (RTL 포트는 그대로 유지 — top 래퍼에서 debounce→edge 출력을 btn_p 로 연결)
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── btn_p → 푸시버튼 BTN1 (디바운서+엣지검출 거친 1펄스) ──
set_property -dict { PACKAGE_PIN C9  IOSTANDARD LVCMOS33 } [get_ports { btn_p }];

## ── rgb → RGB LED LD0 Green 채널 ──
set_property -dict { PACKAGE_PIN G6  IOSTANDARD LVCMOS33 } [get_ports { rgb }];
