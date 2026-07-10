# =============================================================================
# Day 13 — tb_layered (계층화 TB · driver/monitor/scoreboard) 시뮬레이션
# QuestaSim 4단계 흐름: comp → opt → sim → wave
# 권장 프로젝트 구조 기준 — 이 Makefile 은 sim/ 에서 실행, 생성물도 sim/ 에만.
# =============================================================================
#   make            = make sim   (comp→opt→sim 자동)
#   make comp       — vlib/vmap + vlog -f flist.f (전체 소스 컴파일)
#   make opt        — vopt -debug +designfile → design.bin (설계 구조 DB)
#   make sim        — vsim -c -qwavedb → qwave.db (시간축 파형) + self-check
#   make wave       — Visualizer 로 design.bin + qwave.db 오픈 (post-sim)
#   make clean      — work · 생성물 정리
# -----------------------------------------------------------------------------
#   파형: rx_pin / tx_pin · u_mon.got / got_valid 로 계층 흐름 확인.
#   콘솔 RESULT: PASS 면 driver→DUT→monitor→scoreboard 체인 8바이트 전부 일치.
# =============================================================================

TOP   := tb_top
FLIST := flist.f
OPT   := opt
WAVE  := qwave.db
DSGN  := design.bin

.PHONY: all comp opt sim wave clean

all: sim

comp:
	vlib work
	vmap work work
	vlog -f $(FLIST)

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
