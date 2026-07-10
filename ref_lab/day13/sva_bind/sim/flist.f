# Day 13 sva_bind — 컴파일 파일리스트 (sim/ 기준 상대경로)
# DUT 전체 + 자극 TB 는 Day12 원본을 상대참조 — TB 마저 무수정 재사용.
# checker + bind 파일 두 개만 추가로 컴파일하면 SVA 감시가 얹힌다.
../../../day12/baud_gen/rtl/baud_gen.v
../../../day12/uart_rx/rtl/uart_rx.v
../../../day12/uart_tx/rtl/uart_tx.v
../../../day12/uart_loop/rtl/uart_loop.v
../testbench/sva_uart_tx_int.sv
../testbench/bind_uart_tx.sv
../../../day12/uart_loop/testbench/tb_uart_loop.sv
