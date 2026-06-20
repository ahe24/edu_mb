# =============================================================================
# Day 11 — traffic_light (타이머 기반 신호등 Moore FSM) 시뮬레이션
# QuestaSim 4단계 흐름: comp → opt → sim → wave
# 권장 프로젝트 구조 기준 — 이 Makefile 은 sim/ 에서 실행, 생성물도 sim/ 에만.
# =============================================================================
#   make            = make sim   (comp→opt→sim 자동)
#   make comp       — vlib/vmap + vlog -f flist.f +define+FUNC_SIM (타이머 축소)
#   make opt        — vopt -debug +designfile → design.bin (설계 구조 DB)
#   make sim        — vsim -c -qwavedb → qwave.db (시간축 파형) + self-check
#   make wave       — Visualizer 로 design.bin + qwave.db 오픈 (post-sim)
#   make clean      — work · 생성물 정리
# -----------------------------------------------------------------------------
#   ※ FUNC_SIM 필수 — T_RED/GRN/YEL 가 축소돼 RED→GRN→YEL 순환을 빨리 관찰.
#   파형: clk / rst / state / tmr / light[2:0] 를 묶어 순환·one-hot 확인.
#   콘솔 RESULT: PASS 면 reference 시퀀스/타이머 모델과 매 클럭 일치.
# =============================================================================

TOP      := tb_traffic_light
FLIST    := flist.f
VLOG_OPT := +define+FUNC_SIM
OPT      := opt
WAVE     := qwave.db
DSGN     := design.bin

.PHONY: all comp opt sim wave clean

all: sim

comp:
	vlib work
	vmap work work
	vlog -f $(FLIST) $(VLOG_OPT)

opt: comp
	vopt $(TOP) -o $(OPT) -debug +designfile

sim: opt
	vsim -c $(OPT) -qwavedb=+signal+class+wavefile=$(WAVE) \
	     -do "run -all; quit -f"
	@echo "OK — wave: $(WAVE)  /  design: $(DSGN)"

wave:
	visualizer -designfile $(DSGN) -wavefile $(WAVE) &

clean:
	rm -rf work transcript .visualizer
	rm -f modelsim.ini questa.ini *.log $(DSGN) $(WAVE) *.wlf vsim.* *.vstf *.ses
	@echo "OK — cleaned"
