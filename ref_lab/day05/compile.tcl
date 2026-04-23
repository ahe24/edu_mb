# =============================================================================
# Day 05 Lab — compile.tcl
# work 라이브러리 생성 · filelist.f 기반 RTL 컴파일 (qverify 셸 내부 실행)
# 실행: qverify -c -do "do compile.tcl; ..."
# =============================================================================

# ── 1. work 라이브러리 ──
vlib work
vmap work work

# ── 2. RTL 컴파일 (filelist.f 참조) ──
# 다중 파일 대응 — filelist.f 에 파일을 줄 단위로 추가
vlog -sv -f filelist.f

puts "-------------------------------------------"
puts " compile.tcl: RTL compiled into work lib   "
puts "-------------------------------------------"
