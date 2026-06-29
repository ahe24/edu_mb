## ==================================================================
## Day 10 counter ― arty.xdc (Arty A7-35T Master 발췌)
## 보드 top = top_counter (clk 100MHz + tick_gen 클럭 인에이블)
##   clk → 100MHz   rst → 푸시버튼 BTN0   en_sw → 슬라이드 스위치 SW0
##   cnt[3:0] → User LED LD4~LD7
## 쓰지 않는 핀은 주석 처리해 이후 실습에서 계속 재사용.
## ※ 시뮬레이션 단계에서는 XDC 불필요 ― Vivado 합성·보드 구현 시에만 사용.
## ※ clk 을 분주해 새 클럭으로 쓰지 말 것 ― en(tick) 으로 느린 동작 구현.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── en_sw → 슬라이드 스위치 SW0 (카운트 허용) ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports { en_sw }];

## ── cnt[3:0] → User LED LD4~LD7 ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { cnt[0] }];
set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports { cnt[1] }];
set_property -dict { PACKAGE_PIN T9  IOSTANDARD LVCMOS33 } [get_ports { cnt[2] }];
set_property -dict { PACKAGE_PIN T10 IOSTANDARD LVCMOS33 } [get_ports { cnt[3] }];
