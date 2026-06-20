## ==================================================================
## Day 10 blinker — arty.xdc (Arty A7-35T Master 발췌)
##   clk → 100MHz (create_clock 필수)   rst → 푸시버튼 BTN0   led → LED LD4
## clk 을 분주해 새 클럭으로 쓰지 말 것 — 카운터로 led 토글(단일 클럭 도메인).
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── led → User LED LD4 ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { led }];
