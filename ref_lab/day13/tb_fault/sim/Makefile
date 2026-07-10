# =============================================================================
# Day 13 — tb_fault (버그 주입 · TB 검출력 확인) 시뮬레이션
# QuestaSim 4단계 흐름: comp → opt → sim → wave
# 권장 프로젝트 구조 기준 — 이 Makefile 은 sim/ 에서 실행, 생성물도 sim/ 에만.
# =============================================================================
#   make            = make sim   (매크로 미정의 = 정상 → RESULT: PASS)
#   make bug1       — +define+BUG_ORDER (MSB first)  → RESULT: FAIL (scoreboard)
#   make bug2       — +define+BUG_STOP  (stop bit=0) → RESULT: FAIL + SVA 위반
#   make wave       — Visualizer 로 design.bin + qwave.db 오픈 (post-sim)
#   make clean      — work · 생성물 정리
# -----------------------------------------------------------------------------
#   목적: "버그를 주입하면 TB 가 반드시 FAIL 하는가" (fault injection).
#   버그를 못 잡는 TB 는 없는 것과 같다 — 검출력이 TB 의 품질 지표.
#   +define 은 컴파일 단계 옵션 — bug1/bug2 는 재컴파일부터 다시 수행.
# =============================================================================

TOP   := tb_top
BINDS := bind_uart_tx
FLIST := flist.f
OPT   := opt
WAVE  := qwave.db
DSGN  := design.bin
DEFS  ?=

.PHONY: all comp opt sim bug1 bug2 wave clean

all: sim

comp:
	vlib work
	vmap work work
	vlog $(DEFS) -f $(FLIST)

opt: comp
	vopt $(TOP) $(BINDS) -o $(OPT) -debug +designfile

sim: opt
	vsim -c $(OPT) -qwavedb=+signal+class+wavefile=$(WAVE) \
	     -do "run -all; quit -f"
	@echo "OK — wave: $(WAVE)  /  design: $(DSGN)"

bug1:
	$(MAKE) DEFS=+define+BUG_ORDER sim

bug2:
	$(MAKE) DEFS=+define+BUG_STOP sim

wave:
	visualizer -designfile $(DSGN) -wavefile $(WAVE) &

clean:
	rm -rf work transcript .visualizer
	rm -f modelsim.ini questa.ini *.log $(DSGN) $(WAVE) *.wlf vsim.* *.vstf *.ses
	@echo "OK — cleaned"
