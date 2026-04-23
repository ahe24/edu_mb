# =============================================================================
# Day 06 Lab — base_goal.tcl
# DO-254 methodology + DAL-A/B 상향 override (lint 설정 전용)
# 실행: qverify -c -do "do compile.tcl; do base_goal.tcl; lint run -d latent_bug; exit"
# 주의: 컴파일(vlib/vmap/vlog)은 compile.tcl 에서 수행 — 이 파일은 lint 설정만
# =============================================================================

# ── 1. methodology: DO-254 goal 활성 ──
lint methodology standard -goal DO-254

# ── 2. DAL-A/B safety-critical 상향 override ──
# Severity 변경은 lint report check 사용 (lint preference가 아님)
# 사용 check 이름은 Day06 README 매핑표(권위 있는 출처)에 등재된 것만 사용
# SS18 — 기본 Warning → DAL-A/B Error (reset 제어 확보 강제)
lint report check -severity error flop_without_control
lint report check -severity error undriven_signal

# CP7 계열 — 기본 Warning → DAL-A/B Error (silent 데이터 손실 차단)
lint report check -severity error assign_width_overflow
lint report check -severity error assign_width_underflow
lint report check -severity error comparison_width_mismatch
lint report check -severity error case_width_mismatch

# SS4 — 기본 Warning → DAL-A/B Error (latch 금지)
# 불완전한 if/case 로 인한 latch inference 는 latch_inferred 하나가 커버
lint report check -severity error latch_inferred

# SS2 — case 문 safety 위반
lint report check -severity error case_default_missing
lint report check -severity error case_with_x_z
lint report check -severity error case_item_duplicate

# ── 3. FSM 검사 상향 (CP5 · CP6) ──
lint report check -severity error fsm_without_default_state
lint report check -severity error fsm_without_reset_state
lint report check -severity error fsm_with_deadend_state
lint report check -severity error fsm_with_unreachable_state
lint report check -severity error fsm_state_value_hardcoded

# ── 4. 로드 확인 메시지 ──
puts "================================================================="
puts " base_goal.tcl loaded: DO-254 goal + DAL-A/B severity overrides  "
puts "================================================================="
