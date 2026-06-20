# =============================================================================
# Day 10 — debounce (버튼 디바운서) 시뮬레이션
# QuestaSim 4단계: comp → opt → sim → wave  (sim/ 에서 실행, 생성물도 sim/ 에만)
# =============================================================================
#   make / make sim — comp→opt→sim 자동 + self-check
#   make comp/opt/wave/clean
#   파형: btn_in / s0 / s1 / cnt / btn_out 를 묶어 글리치 흡수·STABLE 반영 확인.
# =============================================================================

TOP   := tb_debounce
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
