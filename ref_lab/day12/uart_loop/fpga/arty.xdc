## ==================================================================
## Day 12 uart_loop — arty.xdc (Arty A7-35T Master 발췌)
## 보드 top = uart_loop (USB-UART echo 루프백)
##   clk → 100MHz   rst → 푸시버튼 BTN0
##   rx_pin → USB-UART RXD (FT2232 → FPGA, Master 의 uart_txd_in=A9)
##   tx_pin → USB-UART TXD (FPGA → FT2232, Master 의 uart_rxd_out=D10)
## ※ Arty 마스터 신호명 기준: 호스트가 보내는 선(uart_txd_in)이 FPGA 입력(rx_pin),
##   FPGA 가 내보내는 선(uart_rxd_out)이 출력(tx_pin) — 매핑 방향 주의.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── rx_pin → USB-UART RXD (호스트→FPGA, Master uart_txd_in=A9) ──
set_property -dict { PACKAGE_PIN A9  IOSTANDARD LVCMOS33 } [get_ports { rx_pin }];

## ── tx_pin → USB-UART TXD (FPGA→호스트, Master uart_rxd_out=D10) ──
set_property -dict { PACKAGE_PIN D10 IOSTANDARD LVCMOS33 } [get_ports { tx_pin }];
