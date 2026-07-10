# Day 13 tb_layered — 컴파일 파일리스트 (sim/ 기준 상대경로)
# DUT 는 Day12 원본을 상대참조 — 사본 두지 않음(중복 제거).
# 검증 컴포넌트(driver/monitor/scoreboard) → tb_top 순서.
../../../day12/baud_gen/rtl/baud_gen.v
../../../day12/uart_rx/rtl/uart_rx.v
../../../day12/uart_tx/rtl/uart_tx.v
../../../day12/uart_loop/rtl/uart_loop.v
../testbench/uart_driver.sv
../testbench/uart_monitor.sv
../testbench/uart_scoreboard.sv
../testbench/tb_top.sv
