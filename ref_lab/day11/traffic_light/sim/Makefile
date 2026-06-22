# =============================================================================
# Day 11 — traffic_light (타이머 기반 신호등 Moore FSM) 시뮬레이션
# QuestaSim 4단계 흐름: comp → opt → sim → wave
# 권장 프로젝트 구조 기준 — 이 Makefile 은 sim/ 에서 실행, 생성물도 sim/ 에만.
# =============================================================================
#   make            = make sim   (comp→opt→sim 자동)
#   make comp       — vlib/vmap + vlog -f flist.f (FSM 코어 + TB 컴파일)
#   make opt        — vopt -debug +designfile → design.bin (설계 구조 DB)
#   make sim        — vsim -c -qwavedb → qwave.db (시간축 파형) + self-check
#   make wave       — Visualizer 로 design.bin + qwave.db 오픈 (post-sim)
#   make clean      — work · 생성물 정리
# -----------------------------------------------------------------------------
#   ※ 유닛 TB 는 FSM 코어(traffic_light)만 검증 — TB 가 en 펄스로 빠르게 구동하므로
#     타이머 축소(FUNC_SIM)나 1Hz 분주기(tick_gen) 없이 수백 클럭이면 순환 관찰.
#     보드 1Hz tick_gen + top_traffic_light 은 합성 전용(fpga/board_flist.f).
#   파형: clk / rst / en / state / tmr / light[2:0] 를 묶어 순환·one-hot·게이팅 확인.
#   콘솔 RESULT: PASS 면 reference 시퀀스/타이머 모델과 매 클럭 일치.
# =============================================================================

TOP      := tb_traffic_light
FLIST    := flist.f
OPT      := opt
WAVE     := qwave.db
DSGN     := design.bin

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
