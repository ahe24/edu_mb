## ==================================================================
## Day 12 uart_tx — arty.xdc (Arty A7-35T Master 발췌)
## ※ 시뮬 전용 — 단독 핀 배치 불필요, uart_loop 에서 통합 사용.
##   uart_tx 의 tx 출력은 USB-UART 로 통합(uart_loop)에서 D10 에 매핑.
##   아래 clk/rst 는 통합 top 합성 시 참고용.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];
