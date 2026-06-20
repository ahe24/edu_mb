## ==================================================================
## Day 10 debounce — arty.xdc (Arty A7-35T Master 발췌)
##   clk → 100MHz (create_clock)  rst → BTN1  btn_in → BTN0  btn_out → LED LD4
## btn_in 은 클럭과 무관한 비동기 입력 → 2FF 동기화 후 디바운스.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN1 ──
set_property -dict { PACKAGE_PIN C9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── btn_in → 푸시버튼 BTN0 (raw, 비동기) ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { btn_in }];

## ── btn_out → User LED LD4 ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { btn_out }];
