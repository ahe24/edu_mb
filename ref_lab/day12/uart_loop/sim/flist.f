# Day 12 uart_loop — 컴파일 파일리스트 (sim/ 기준 상대경로)
# 서브모듈 RTL → top → TB 순서로 나열, vlog -f flist.f 로 일괄 컴파일.
../rtl/baud_gen.v
../rtl/uart_rx.v
../rtl/uart_tx.v
../rtl/uart_loop.v
../testbench/tb_uart_loop.sv
