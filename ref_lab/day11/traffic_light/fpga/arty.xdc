## ==================================================================
## Day 11 traffic_light ― arty.xdc (Arty A7-35T Master 발췌)
## 보드 top = top_traffic_light (clk 100MHz + tick_gen 1Hz 클럭 인에이블)
##   clk → 100MHz   rst → 푸시버튼 BTN0
##   램프 3개 = RGB LED 3개 독립 구동 (LD0=RED, LD1=YEL, LD2=GRN)
##     ※ RGB LED 는 노랑 핀이 없음 → YEL 램프(LD1)는 R+G 두 채널을 동시에 켬.
##   mono_led[2:0] → LD4/LD5/LD6 : 상태 one-hot 디버그 표시(색과 무관)
##   합성 파일리스트 = fpga/board_flist.f (tick_gen + traffic_light + top)
## 쓰지 않는 핀은 주석 처리해 이후 실습에서 계속 재사용.
## ※ 시뮬레이션 단계에서는 XDC 불필요 ― Vivado 합성·보드 구현 시에만 사용.
## ※ top 안의 tick_gen 이 100MHz→1Hz en 펄스 → FSM 초당 한 칸(30/25/5 틱).
##   clk 을 분주해 새 클럭으로 쓰지 말 것(파생 클럭 금지).
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 (동기 active-high) ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── 램프 = RGB LED (LD0=RED / LD1=YEL=R+G / LD2=GRN), B 미사용 ──
## RGB LED 0 (LD0) ― RED 램프
set_property -dict { PACKAGE_PIN G6  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_r[0] }];
set_property -dict { PACKAGE_PIN F6  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_g[0] }];
set_property -dict { PACKAGE_PIN E1  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_b[0] }];
## RGB LED 1 (LD1) ― YEL 램프 (R+G 동시 점등 = 노랑)
set_property -dict { PACKAGE_PIN G3  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_r[1] }];
set_property -dict { PACKAGE_PIN J4  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_g[1] }];
set_property -dict { PACKAGE_PIN G4  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_b[1] }];
## RGB LED 2 (LD2) ― GRN 램프
set_property -dict { PACKAGE_PIN J3  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_r[2] }];
set_property -dict { PACKAGE_PIN J2  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_g[2] }];
set_property -dict { PACKAGE_PIN H4  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_b[2] }];

## ── mono LED 상태 one-hot 디버그 (R=LD6 / Y=LD5 / G=LD4) ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { mono_led[0] }];
set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports { mono_led[1] }];
set_property -dict { PACKAGE_PIN T9  IOSTANDARD LVCMOS33 } [get_ports { mono_led[2] }];
