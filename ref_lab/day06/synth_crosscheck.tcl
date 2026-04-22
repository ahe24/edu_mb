# =============================================================================
# Day 06 Lab — synth_crosscheck.tcl
# Vivado 비프로젝트 모드 합성 · latch count 교차 검증
# 실행: vivado -mode batch -source synth_crosscheck.tcl
# =============================================================================

set OUT  "synth_output"
file mkdir $OUT

# ── 1. Read RTL ──
read_verilog -sv latent_bug.v

# ── 2. Synthesize ──
synth_design -top latent_bug -part xc7a35tcsg324-1

# ── 3. Latch count 확인 ──
set latch_count [llength [get_cells -hier -filter {PRIMITIVE_TYPE =~ REGISTER.latch.*}]]
puts "[latch] LATCH CELL COUNT: $latch_count"

# ── 4. Cell breakdown 리포트 ──
report_utilization -file "$OUT/utilization.rpt"
report_cell_usage -file "$OUT/cell_usage.rpt"

# ── 5. FSM 인코딩 리포트 ──
if {[llength [get_property -quiet FSM_ENCODING [get_cells -hier -filter {IS_FSM_STATE == 1}]]] > 0} {
  report_property -file "$OUT/fsm_encoding.rpt" [get_cells -hier -filter {IS_FSM_STATE == 1}]
}

# ── 6. 교차 검증 요약 ──
set md_path "synth_crosscheck.md"
set f [open $md_path "w"]
puts $f "# Synth Cross-Check Report"
puts $f ""
puts $f "- latch cells:  $latch_count  (expect 0 after fix)"
puts $f "- utilization:  $OUT/utilization.rpt"
puts $f "- cell usage :  $OUT/cell_usage.rpt"
puts $f ""
puts $f "## Pass criteria (DO-254 DAL-A/B)"
puts $f ""
puts $f "- [ ] latch_count == 0"
puts $f "- [ ] reset 연결 FF count == total FF count"
puts $f "- [ ] FSM encoding = one-hot (report_property)"
puts $f "- [ ] width truncation warning = 0 (synth log)"
close $f

puts "OK — cross-check summary: $md_path"
