# =============================================================================
# Day 06 Lab — base_goal.tcl
# DO-254 methodology + DAL-A/B 상향 override
# 실행: qverify -c -do "do base_goal.tcl; lint run -d latent_bug; exit"
# =============================================================================

# ── 1. methodology: DO-254 goal 활성 ──
lint methodology standard -goal DO-254

# ── 2. DAL-A/B safety-critical 상향 override ──
# Severity 변경은 lint report check 사용 (lint preference가 아님)
# SS18 — 기본 Warning → DAL-A/B Error (reset 제어 확보 강제)
lint report check -severity error flop_without_control

# CP7 계열 — 기본 Warning → DAL-A/B Error (silent 데이터 손실 차단)
lint report check -severity error assign_width_overflow
lint report check -severity error assign_width_underflow
lint report check -severity error comparison_width_mismatch
lint report check -severity error expr_operands_width_mismatch
lint report check -severity error case_width_mismatch

# SS4 — 기본 Warning → DAL-A/B Error (latch 금지)
lint report check -severity error latch_inferred
lint report check -severity error if_stmt_without_else

# ── 3. FSM 검사 활성 (CP5 · CP6) ──
# FSM 관련 체크를 일괄 활성화 + error 상향
lint on fsm_without_default_state       -severity error
lint on fsm_without_reset_state         -severity error
lint on fsm_with_deadend_state          -severity error
lint on fsm_with_unreachable_state      -severity error
lint on fsm_without_one_hot_encoding    -severity warning

# ── 4. safety-critical 도메인 명시적 차단 ──
# casex · casez — safety-critical 도메인 금지 (실제 check 이름: casex / casez)
lint report check -severity error casex
lint report check -severity error casez

# ── 5. 컴파일 ──
vlog -sv latent_bug.v

puts "================================================================="
puts " base_goal.tcl loaded: DO-254 goal + DAL-A/B severity overrides  "
puts "================================================================="
