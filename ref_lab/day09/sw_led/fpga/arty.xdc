## ==================================================================
## Day 09 sw_led ― arty.xdc (Arty A7-35T Master 발췌)
##   sw[3:0]  → SW0~SW3        led[3:0]  → LD4~LD7 (녹색, 통과)
##   led_n[3:0] → RGB LED 파란 채널 (반전 출력, 단색 녹색과 색 구분)
## 쓰지 않는 핀은 주석 처리해 이후 실습에서 계속 재사용.
## ==================================================================

## ── 슬라이드 스위치 SW0~SW3 ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports { sw[0] }];
set_property -dict { PACKAGE_PIN C11 IOSTANDARD LVCMOS33 } [get_ports { sw[1] }];
set_property -dict { PACKAGE_PIN C10 IOSTANDARD LVCMOS33 } [get_ports { sw[2] }];
set_property -dict { PACKAGE_PIN A10 IOSTANDARD LVCMOS33 } [get_ports { sw[3] }];

## ── 단색 User LED LD4~LD7 (통과: led = sw) ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { led[0] }];
set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports { led[1] }];
set_property -dict { PACKAGE_PIN T9  IOSTANDARD LVCMOS33 } [get_ports { led[2] }];
set_property -dict { PACKAGE_PIN T10 IOSTANDARD LVCMOS33 } [get_ports { led[3] }];

## ── 반전 출력 led_n → RGB LED 파란 채널 LD0~LD3_B ──
set_property -dict { PACKAGE_PIN E1  IOSTANDARD LVCMOS33 } [get_ports { led_n[0] }];  ;# LD0_B
set_property -dict { PACKAGE_PIN G4  IOSTANDARD LVCMOS33 } [get_ports { led_n[1] }];  ;# LD1_B
set_property -dict { PACKAGE_PIN H4  IOSTANDARD LVCMOS33 } [get_ports { led_n[2] }];  ;# LD2_B
set_property -dict { PACKAGE_PIN K2  IOSTANDARD LVCMOS33 } [get_ports { led_n[3] }];  ;# LD3_B
