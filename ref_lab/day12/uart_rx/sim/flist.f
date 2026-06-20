# Day 12 uart_rx — 컴파일 파일리스트 (sim/ 기준 상대경로)
# RTL → TB 순서로 나열, vlog -f flist.f 로 일괄 컴파일.
# baud_gen.v 는 TB 가 tick16 생성용으로 인스턴스 (uart_rx 의존).
../rtl/baud_gen.v
../rtl/uart_rx.v
../testbench/tb_uart_rx.sv
