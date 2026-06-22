## =============================================================================
## Constraint File: arty_a7_constraints.xdc
## Description: Pin assignments and timing constraints for ARTY A7 LED Controller
## Board: ARTY A7 35T (Xilinx Artix-7 XC7A35T)
## =============================================================================

## =============================================================================
## Clock and Reset
## =============================================================================

## System Clock (100MHz)
set_property -dict {PACKAGE_PIN E3 IOSTANDARD LVCMOS33} [get_ports clk]
create_clock -period 10.000 -name sys_clk_pin -waveform {0.000 5.000} -add [get_ports clk]

## Reset (Active Low) - Can be mapped to reset button or external reset
set_property -dict {PACKAGE_PIN C2 IOSTANDARD LVCMOS33} [get_ports rst_n]

## =============================================================================
## Push Buttons
## =============================================================================
## BTN0-BTN3 on ARTY A7
set_property -dict {PACKAGE_PIN D9 IOSTANDARD LVCMOS33} [get_ports {push_btn[0]}]
set_property -dict {PACKAGE_PIN C9 IOSTANDARD LVCMOS33} [get_ports {push_btn[1]}]
set_property -dict {PACKAGE_PIN B9 IOSTANDARD LVCMOS33} [get_ports {push_btn[2]}]
set_property -dict {PACKAGE_PIN B8 IOSTANDARD LVCMOS33} [get_ports {push_btn[3]}]

## =============================================================================
## Slide Switches
## =============================================================================
## SW0-SW3 on ARTY A7
set_property -dict {PACKAGE_PIN A8 IOSTANDARD LVCMOS33} [get_ports {slide_sw[0]}]
set_property -dict {PACKAGE_PIN C11 IOSTANDARD LVCMOS33} [get_ports {slide_sw[1]}]
set_property -dict {PACKAGE_PIN C10 IOSTANDARD LVCMOS33} [get_ports {slide_sw[2]}]
set_property -dict {PACKAGE_PIN A10 IOSTANDARD LVCMOS33} [get_ports {slide_sw[3]}]

## =============================================================================
## RGB LEDs (LD0-LD3)
## =============================================================================
## RGB LED 0 (LD0)
set_property -dict {PACKAGE_PIN G6 IOSTANDARD LVCMOS33} [get_ports {rgb_led_r[0]}]
set_property -dict {PACKAGE_PIN F6 IOSTANDARD LVCMOS33} [get_ports {rgb_led_g[0]}]
set_property -dict {PACKAGE_PIN E1 IOSTANDARD LVCMOS33} [get_ports {rgb_led_b[0]}]

## RGB LED 1 (LD1)
set_property -dict {PACKAGE_PIN G3 IOSTANDARD LVCMOS33} [get_ports {rgb_led_r[1]}]
set_property -dict {PACKAGE_PIN J4 IOSTANDARD LVCMOS33} [get_ports {rgb_led_g[1]}]
set_property -dict {PACKAGE_PIN G4 IOSTANDARD LVCMOS33} [get_ports {rgb_led_b[1]}]

## RGB LED 2 (LD2)
set_property -dict {PACKAGE_PIN J3 IOSTANDARD LVCMOS33} [get_ports {rgb_led_r[2]}]
set_property -dict {PACKAGE_PIN J2 IOSTANDARD LVCMOS33} [get_ports {rgb_led_g[2]}]
set_property -dict {PACKAGE_PIN H4 IOSTANDARD LVCMOS33} [get_ports {rgb_led_b[2]}]

## RGB LED 3 (LD3)
set_property -dict {PACKAGE_PIN K1 IOSTANDARD LVCMOS33} [get_ports {rgb_led_r[3]}]
set_property -dict {PACKAGE_PIN H6 IOSTANDARD LVCMOS33} [get_ports {rgb_led_g[3]}]
set_property -dict {PACKAGE_PIN K2 IOSTANDARD LVCMOS33} [get_ports {rgb_led_b[3]}]

## =============================================================================
## Mono LEDs (LD4-LD7)
## =============================================================================
set_property -dict {PACKAGE_PIN H5 IOSTANDARD LVCMOS33} [get_ports {mono_led[0]}]
set_property -dict {PACKAGE_PIN J5 IOSTANDARD LVCMOS33} [get_ports {mono_led[1]}]
set_property -dict {PACKAGE_PIN T9 IOSTANDARD LVCMOS33} [get_ports {mono_led[2]}]
set_property -dict {PACKAGE_PIN T10 IOSTANDARD LVCMOS33} [get_ports {mono_led[3]}]

## =============================================================================
## Timing Constraints
## =============================================================================

## Input Delay Constraints
set_input_delay -clock sys_clk_pin -min 0.0 [get_ports {slide_sw[*]}]
set_input_delay -clock sys_clk_pin -max 2.0 [get_ports {slide_sw[*]}]
set_input_delay -clock sys_clk_pin -min 0.0 [get_ports {push_btn[*]}]
set_input_delay -clock sys_clk_pin -max 2.0 [get_ports {push_btn[*]}]
set_input_delay -clock sys_clk_pin -min 0.0 [get_ports rst_n]
set_input_delay -clock sys_clk_pin -max 2.0 [get_ports rst_n]

## Output Delay Constraints
set_output_delay -clock sys_clk_pin -min 0.0 [get_ports {rgb_led_r[*]}]
set_output_delay -clock sys_clk_pin -max 2.0 [get_ports {rgb_led_r[*]}]
set_output_delay -clock sys_clk_pin -min 0.0 [get_ports {rgb_led_g[*]}]
set_output_delay -clock sys_clk_pin -max 2.0 [get_ports {rgb_led_g[*]}]
set_output_delay -clock sys_clk_pin -min 0.0 [get_ports {rgb_led_b[*]}]
set_output_delay -clock sys_clk_pin -max 2.0 [get_ports {rgb_led_b[*]}]
set_output_delay -clock sys_clk_pin -min 0.0 [get_ports {mono_led[*]}]
set_output_delay -clock sys_clk_pin -max 2.0 [get_ports {mono_led[*]}]

## =============================================================================
## Configuration Settings
## =============================================================================

## Configuration Bank Voltage
set_property CFGBVS VCCO [current_design]
set_property CONFIG_VOLTAGE 3.3 [current_design]

## Bitstream Settings
set_property BITSTREAM.GENERAL.COMPRESS TRUE [current_design]
set_property BITSTREAM.CONFIG.CONFIGRATE 33 [current_design]
set_property CONFIG_MODE SPIx4 [current_design]
