# Day 12 uart_loop — 컴파일 파일리스트 (sim/ 기준 상대경로)
# 서브모듈 RTL → top → TB 순서로 나열, vlog -f flist.f 로 일괄 컴파일.
# 서브모듈(baud_gen/uart_rx/uart_tx) 원본은 각 lab 에 두고 상대참조 — 사본 두지 않음(중복 제거).
../../baud_gen/rtl/baud_gen.v
../../uart_rx/rtl/uart_rx.v
../../uart_tx/rtl/uart_tx.v
../rtl/uart_loop.v
../testbench/tb_uart_loop.sv
