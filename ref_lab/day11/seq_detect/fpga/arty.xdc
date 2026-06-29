## ==================================================================
## Day 11 seq_detect ― arty.xdc (Arty A7-35T Master 발췌)
## 보드 top = seq_top  (clk 100MHz)
##   clk      → 100MHz 오실레이터
##   rst      → 푸시버튼 BTN0          (FSM S0 복귀)
##   step_btn → 푸시버튼 BTN1          (비트 1개 투입 = en 펄스)
##   din      → 슬라이드 스위치 SW0    (넣을 비트 값 0/1)
##   found    → User LED LD4           (S101 도달 점등, 다음 step 까지 유지)
##
## ※ 시뮬은 XDC 불필요 ― Vivado 합성·보드 구현 시에만 사용.
## ※ 손으로 1비트/클럭은 불가(100MHz). 그래서 seq_top 이 BTN1 을
##    debounce→상승엣지→1클럭 step(en) 으로 바꿔 비트 단위로 투입한다.
##    clk 자체는 분주하지 않음(설계는 100MHz 동기 유지).
## 쓰지 않는 핀은 주석 처리해 이후 실습에서 계속 재사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── step_btn → 푸시버튼 BTN1 (비트 투입) ──
set_property -dict { PACKAGE_PIN C9  IOSTANDARD LVCMOS33 } [get_ports { step_btn }];

## ── din → 슬라이드 스위치 SW0 (넣을 비트 값) ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports { din }];

## ── found → User LED LD4 (패턴 발견 점등) ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { found }];
