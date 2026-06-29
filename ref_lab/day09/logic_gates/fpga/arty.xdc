## ==================================================================
## Day 09 ― arty.xdc  (Arty A7-35T Master 발췌)
## sw · 단색 LED · RGB LED 핀을 전부 기재. 이 설계에서 쓰는 포트만 남기고
## 나머지는 주석 처리해 이후 실습에서 계속 재사용.
##   sw[1:0]   → SW0,SW1          led[1:0] → LD4,LD5 (녹색)
##   rgb0=AND  → LD0 (R+B)   rgb1=OR → LD1 (G+B)   rgb2=XOR → LD2 (R+G)
## rgb*[2:0] = {R, G, B}  (rgb*[2]=R, rgb*[1]=G, rgb*[0]=B)
## ※ 시뮬레이션 단계에서는 XDC 불필요 ― Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 슬라이드 스위치 SW0~SW3 ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports { sw[0] }];
set_property -dict { PACKAGE_PIN C11 IOSTANDARD LVCMOS33 } [get_ports { sw[1] }];
# set_property -dict { PACKAGE_PIN C10 IOSTANDARD LVCMOS33 } [get_ports { sw[2] }];
# set_property -dict { PACKAGE_PIN A10 IOSTANDARD LVCMOS33 } [get_ports { sw[3] }];

## ── 단색 User LED LD4~LD7 (녹색) ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { led[0] }];
set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports { led[1] }];
# set_property -dict { PACKAGE_PIN T9  IOSTANDARD LVCMOS33 } [get_ports { led[2] }];
# set_property -dict { PACKAGE_PIN T10 IOSTANDARD LVCMOS33 } [get_ports { led[3] }];

## ── RGB LED LD0 → rgb0 (AND, R+B) ──
set_property -dict { PACKAGE_PIN G6  IOSTANDARD LVCMOS33 } [get_ports { rgb0[2] }];  ;# LD0_R
set_property -dict { PACKAGE_PIN F6  IOSTANDARD LVCMOS33 } [get_ports { rgb0[1] }];  ;# LD0_G
set_property -dict { PACKAGE_PIN E1  IOSTANDARD LVCMOS33 } [get_ports { rgb0[0] }];  ;# LD0_B

## ── RGB LED LD1 → rgb1 (OR, G+B) ──
set_property -dict { PACKAGE_PIN G3  IOSTANDARD LVCMOS33 } [get_ports { rgb1[2] }];  ;# LD1_R
set_property -dict { PACKAGE_PIN J4  IOSTANDARD LVCMOS33 } [get_ports { rgb1[1] }];  ;# LD1_G
set_property -dict { PACKAGE_PIN G4  IOSTANDARD LVCMOS33 } [get_ports { rgb1[0] }];  ;# LD1_B

## ── RGB LED LD2 → rgb2 (XOR, R+G) ──
set_property -dict { PACKAGE_PIN J3  IOSTANDARD LVCMOS33 } [get_ports { rgb2[2] }];  ;# LD2_R
set_property -dict { PACKAGE_PIN J2  IOSTANDARD LVCMOS33 } [get_ports { rgb2[1] }];  ;# LD2_G
set_property -dict { PACKAGE_PIN H4  IOSTANDARD LVCMOS33 } [get_ports { rgb2[0] }];  ;# LD2_B

## ── RGB LED LD3 (미사용 ― 필요 시 활성화) ──
# set_property -dict { PACKAGE_PIN K1 IOSTANDARD LVCMOS33 } [get_ports { rgb3[2] }];  ;# LD3_R
# set_property -dict { PACKAGE_PIN H6 IOSTANDARD LVCMOS33 } [get_ports { rgb3[1] }];  ;# LD3_G
# set_property -dict { PACKAGE_PIN K2 IOSTANDARD LVCMOS33 } [get_ports { rgb3[0] }];  ;# LD3_B
