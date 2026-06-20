## ==================================================================
## Day 09 mux4 — arty.xdc  (Arty A7-35T Master 발췌)
##   sw[1:0] = sel → SW0,SW1        rgb[2:0] → RGB LED LD0
## rgb[2:0] = {R, G, B}  (rgb[2]=R, rgb[1]=G, rgb[0]=B)
## 쓰지 않는 핀은 주석 처리해 이후 실습에서 계속 재사용.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 슬라이드 스위치 SW0~SW3 (sel = sw[1:0]) ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports { sw[0] }];
set_property -dict { PACKAGE_PIN C11 IOSTANDARD LVCMOS33 } [get_ports { sw[1] }];
# set_property -dict { PACKAGE_PIN C10 IOSTANDARD LVCMOS33 } [get_ports { sw[2] }];
# set_property -dict { PACKAGE_PIN A10 IOSTANDARD LVCMOS33 } [get_ports { sw[3] }];

## ── RGB LED LD0 → rgb (선택된 색) ──
set_property -dict { PACKAGE_PIN G6  IOSTANDARD LVCMOS33 } [get_ports { rgb[2] }];  ;# LD0_R
set_property -dict { PACKAGE_PIN F6  IOSTANDARD LVCMOS33 } [get_ports { rgb[1] }];  ;# LD0_G
set_property -dict { PACKAGE_PIN E1  IOSTANDARD LVCMOS33 } [get_ports { rgb[0] }];  ;# LD0_B

## ── 단색 User LED LD4~LD7 — 미사용 (필요 시 활성화) ──
# set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { led[0] }];
# set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports { led[1] }];

## ── 추가 RGB LED LD1~LD3 — 미사용 (필요 시 활성화) ──
# set_property -dict { PACKAGE_PIN G3 IOSTANDARD LVCMOS33 } [get_ports { rgb1[2] }];  ;# LD1_R
# set_property -dict { PACKAGE_PIN J4 IOSTANDARD LVCMOS33 } [get_ports { rgb1[1] }];  ;# LD1_G
# set_property -dict { PACKAGE_PIN G4 IOSTANDARD LVCMOS33 } [get_ports { rgb1[0] }];  ;# LD1_B
