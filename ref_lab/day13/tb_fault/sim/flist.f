# Day 13 tb_fault — 컴파일 파일리스트 (sim/ 기준 상대경로)
# uart_tx 만 로컬 버그 주입판으로 교체 — 나머지 RTL·TB·checker 전부 상대참조.
# 계층화 TB(tb_layered) + bind SVA(sva_bind) 를 그대로 재사용해 검출력 확인.
../../../day12/baud_gen/rtl/baud_gen.v
../../../day12/uart_rx/rtl/uart_rx.v
../rtl/uart_tx_bug.v
../../../day12/uart_loop/rtl/uart_loop.v
../../tb_layered/testbench/uart_driver.sv
../../tb_layered/testbench/uart_monitor.sv
../../tb_layered/testbench/uart_scoreboard.sv
../../tb_layered/testbench/tb_top.sv
../../sva_bind/testbench/sva_uart_tx_int.sv
../../sva_bind/testbench/bind_uart_tx.sv
