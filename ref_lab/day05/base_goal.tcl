# =============================================================================
# Day 05 Lab — base_goal.tcl
# DO-254 methodology 설정 (standard + goal DO-254)
# 실행: qverify -c -do "do base_goal.tcl; lint run -d broken_rtl; exit"
# =============================================================================

# ── 1. methodology: DO-254 goal 활성 ──
# standard methodology + DO-254 goal → CP·DR·SS alias 기반 violation 그룹화 활성
# 표준이 규정하는 severity 자동 오버라이드
lint methodology standard -goal DO-254

# ── 2. 프로젝트 preference ──
# unsynthesizable 구문은 testbench 전용 제외 원칙 — RTL 적용 시 금지
lint preference -unsynth testbench_only

# reset/clock 내부 구동 금지 (FPGA safety-critical 기본)
lint preference -reset -active_low sync_reset async_reset

# naming 표준 (원전·방산·항공·우주 공통)
lint preference name -check inst_name_not_standard -disallow_mix_case

# ── 3. DAL-A/B 상향 오버라이드 (safety-critical) ──
# SS18 (flop_without_control) 기본 severity=Warning → DAL-A/B에서 Error 상향
lint preference severity -check flop_without_control -severity error

# ── 4. 컴파일 & 분석 ──
vlog -sv broken_rtl.v

# lint run은 호출 측에서 수행 — 이 파일은 preferences 만 로드
puts "========================================================="
puts " base_goal.tcl loaded: methodology=standard, goal=DO-254 "
puts "========================================================="
