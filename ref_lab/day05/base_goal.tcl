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
# Reset 정책 — async reset 금지 (FPGA safety-critical: Xilinx sync 권장)
lint preference -disallow_reset_style async

# flop_without_control 허용 제어 타입 — async_reset/sync_reset/initial_value 중 하나 필요
lint preference -check flop_without_control \
                -valid_flop_controls async_reset sync_reset initial_value

# naming 표준 (원전·방산·항공·우주 공통) — 인스턴스 이름 대소문자 혼용 금지
lint preference name -check inst_name_not_standard -disallow_mix_case

# ── 3. DAL-A/B 상향 오버라이드 (safety-critical) ──
# Severity 변경은 lint report check 사용 (lint preference 아님)
# SS18 (flop_without_control) 기본 severity=Warning → DAL-A/B에서 Error 상향
lint report check -severity error flop_without_control

# ── 4. 컴파일 & 분석 ──
vlog -sv broken_rtl.v

# lint run은 호출 측에서 수행 — 이 파일은 preferences 만 로드
puts "========================================================="
puts " base_goal.tcl loaded: methodology=standard, goal=DO-254 "
puts "========================================================="
