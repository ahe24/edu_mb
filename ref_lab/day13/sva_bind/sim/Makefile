# =============================================================================
# Day 13 — sva_bind (bind 비침습 SVA · 내부 state 관찰) 시뮬레이션
# QuestaSim 4단계 흐름: comp → opt → sim → wave
# 권장 프로젝트 구조 기준 — 이 Makefile 은 sim/ 에서 실행, 생성물도 sim/ 에만.
# =============================================================================
#   make            = make sim   (comp→opt→sim 자동)
#   make comp       — vlib/vmap + vlog -f flist.f (전체 소스 컴파일)
#   make opt        — vopt TOP + BINDS 멀티-top → design.bin
#   make sim        — vsim -c -qwavedb → qwave.db + self-check
#   make wave       — Visualizer 로 design.bin + qwave.db 오픈 (post-sim)
#   make clean      — work · 생성물 정리
# -----------------------------------------------------------------------------
#   핵심: bind 모듈(bind_uart_tx)을 vopt top 목록에 함께 지정해야 결합된다.
#   TB(RESULT: PASS)는 Day12 tb_uart_loop 무수정 재사용 — SVA 요약 라인은
#   bound checker 의 final 블록이 별도로 출력( SVA(bind): 0 violation ).
# =============================================================================

TOP   := tb_uart_loop
BINDS := bind_uart_tx
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
	vopt $(TOP) $(BINDS) -o $(OPT) -debug +designfile

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
