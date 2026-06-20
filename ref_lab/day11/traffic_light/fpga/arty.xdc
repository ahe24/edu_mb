## ==================================================================
## Day 11 traffic_light — arty.xdc (Arty A7-35T Master 발췌)
## 보드 top = traffic_light (clk 100MHz)
##   clk → 100MHz   rst → 푸시버튼 BTN0   light[2:0] → User LED LD4~LD6
## 쓰지 않는 핀은 주석 처리해 이후 실습에서 계속 재사용.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ※ 실제 보드는 100MHz 로 타이머가 즉시 끝남 — Day10 tick_gen(클럭 인에이블)을
##    추가해 느린 틱으로 done 을 셀 것. clk 을 분주해 새 클럭으로 쓰지 말 것.
##    (RTL 포트는 그대로 유지 — top 래퍼에서 tick 을 enable 로 연결)
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── light[2:0] → User LED LD4~LD6 ([2]=R [1]=Y [0]=G) ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { light[0] }];
set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports { light[1] }];
set_property -dict { PACKAGE_PIN T9  IOSTANDARD LVCMOS33 } [get_ports { light[2] }];
