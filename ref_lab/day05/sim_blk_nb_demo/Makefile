# =============================================================================
# Day 05 — Blocking / Non-Blocking SIM mismatch demo
# qrun + Visualizer GUI
# =============================================================================
#   make            = make sim
#   make sim        — qrun batch, Visualizer wave (qwave.db) 로 덤프
#   make gui        — 덤프된 파형 위에 Visualizer GUI 오픈
#   make live       — qrun + Visualizer 한 번에 (post-sim debug GUI 자동 기동)
#   make clean      — qrun.out · 임시 파일 정리
# -----------------------------------------------------------------------------
#   파형에서 _bad / _good 신호를 같이 올려 비교 (slide P1 / P2 / P4 입증):
#     - q2_bad  vs q2_good     : 0 cycle vs 2 cycle latency
#     - out_bad vs out_good    : 1 cycle vs 2 cycle latency
#     - z_bad   vs z_good      : NB chain delta-cycle 지연
# =============================================================================

TOP    := tb_blk_nb_demo
SRCS   := dut.v tb_blk_nb_demo.sv
OUT    := qrun.out
WAVE   := qwave.db

# qrun 공통 옵션
QRUN_OPTS := -sv -debug +designfile -top $(TOP)

.PHONY: all sim gui live clean

all: sim

# -----------------------------------------------------------------------------
# Batch 시뮬레이션 — Visualizer wave database (qwave.db) 생성
#   -qwavedb=+signal+memory+class+wavefile=qwave.db
#   기본 출력 위치: $(OUT)/$(WAVE)
# -----------------------------------------------------------------------------
sim:
	qrun $(QRUN_OPTS) $(SRCS) \
	  -qwavedb=+signal+memory+class+wavefile=$(WAVE) \
	  -do "run -all; quit -f"
	@echo "OK — wave: $(OUT)/$(WAVE)"

# -----------------------------------------------------------------------------
# Visualizer GUI — 덤프된 design / wave 위에 오픈 (post-sim debug)
#   설계 DB: qrun.out/qrun.db (qrun 기본 출력)
#   파형 DB: qrun.out/qwave.db
# -----------------------------------------------------------------------------
gui:
	visualizer design.bin qwave.db &

# -----------------------------------------------------------------------------
# Live mode — sim 실행 직후 Visualizer GUI 자동 기동
# -----------------------------------------------------------------------------
live:
	qrun $(QRUN_OPTS) $(SRCS) \
	  -qwavedb=+signal+memory+class+wavefile=$(WAVE) \
	  -visualizer \
	  -do "run -all"

clean:
	rm -rf $(OUT) work transcript *.vstf .visualizer
	rm -f modelsim.ini *.log *.bin *.db *.wlf
	@echo "OK — cleaned"
