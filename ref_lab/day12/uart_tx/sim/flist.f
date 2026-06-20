# Day 12 uart_tx — 컴파일 파일리스트 (sim/ 기준 상대경로)
# RTL → TB 순서로 나열, vlog -f flist.f 로 일괄 컴파일.
# baud_gen.v 는 TB 가 tick 생성용으로 인스턴스 (uart_tx 의존).
../rtl/baud_gen.v
../rtl/uart_tx.v
../testbench/tb_uart_tx.sv
