## ==================================================================
## Day 11 seq_detect — arty.xdc (Arty A7-35T Master 발췌)
## 보드 top = seq_detect (clk 100MHz)
##   clk → 100MHz   rst → 푸시버튼 BTN0   din → 슬라이드 스위치 SW0
##   found → User LED LD4
## 쓰지 않는 핀은 주석 처리해 이후 실습에서 계속 재사용.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ※ 100MHz 에서 found 는 1클럭(10ns)만 HIGH — 눈으로 보려면 Day10 tick(클럭
##    인에이블)로 din 을 천천히 샘플하거나 found 펄스를 래치할 것. clk 분주 금지.
##    (RTL 포트는 그대로 유지)
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── din → 슬라이드 스위치 SW0 (직렬 입력 비트) ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports { din }];

## ── found → User LED LD4 (패턴 발견 1클럭 HIGH) ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { found }];
