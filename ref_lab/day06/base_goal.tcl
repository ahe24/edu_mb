# =============================================================================
# Day 06 Lab — base_goal.tcl
# DO-254 methodology + DAL-A/B 상향 override
# 실행: qverify -c -do "do base_goal.tcl; lint run -d latent_bug; exit"
# =============================================================================

# ── 1. methodology: DO-254 goal 활성 ──
lint methodology standard -goal DO-254

# ── 2. DAL-A/B safety-critical 상향 override ──
# SS18 — 기본 Warning → DAL-A/B Error (reset 제어 확보 강제)
lint preference severity -check flop_without_control -severity error

# CP7 계열 — 기본 Warning → DAL-A/B Error (silent 데이터 손실 차단)
lint preference severity -check assign_width_overflow         -severity error
lint preference severity -check assign_width_underflow        -severity error
lint preference severity -check comparison_width_mismatch     -severity error
lint preference severity -check expr_operands_width_mismatch  -severity error
lint preference severity -check case_width_mismatch           -severity error

# SS4 — 기본 Warning → DAL-A/B Error (latch 금지)
lint preference severity -check latch_inferred                -severity error
lint preference severity -check if_stmt_without_else          -severity error

# ── 3. FSM 검사 활성 (CP5 · CP6) ──
lint preference fsm -check all_fsm

# ── 4. safety-critical 도메인 명시적 차단 ──
# casex · casez — safety-critical 도메인 금지
lint preference severity -check casex_used                    -severity error

# ── 5. 컴파일 ──
vlog -sv latent_bug.v

puts "================================================================="
puts " base_goal.tcl loaded: DO-254 goal + DAL-A/B severity overrides  "
puts "================================================================="
