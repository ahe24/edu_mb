# =============================================================================
# Day 14 ― cov_hole (홀 분석 → 자극 보강 → 재측정)
# 기본 TB 가 남긴 branch/condition/FSM 홀을 boost_scenario 로 메운다.
# =============================================================================
#   make            = make cov
#   make cov        ― 보강 TB 로 커버리지 수집 → boost.ucdb 저장 + 요약
#   make report     ― vcover report + -details (남은 홀 = 도달불가 default 만)
#   make html       ― vcover report -html
#   make clean
# -----------------------------------------------------------------------------
#   실습1(cov_measure) 리포트와 비교 → branch/condition/FSM 상승 확인.
#   그래도 100% 아님 : default(도달불가) 는 자극으로 못 메움 → 실습4 제외 처리.
# =============================================================================

TOP   := tb_trip_boost
DUT   := trip_top
FLIST := flist.f
OPT   := opt_cov
UCDB  := boost.ucdb
COVER := bcesf

.PHONY: all cov report html clean

all: cov

cov:
	vlib work
	vmap work work
	vlog -f $(FLIST)
	vopt $(TOP) -o $(OPT) +cover=$(COVER)+$(DUT). +acc -debug
	vsim -c -coverage $(OPT) \
	     -do "coverage save -onexit $(UCDB); run -all; quit -f"
	@echo "OK ― UCDB: $(UCDB)"

report:
	vcover report $(UCDB)
	@echo "--- 상세(남은 홀) ---"
	vcover report -details $(UCDB)

html:
	vcover report -html $(UCDB)

clean:
	rm -rf work transcript covhtmlreport
	rm -f modelsim.ini questa.ini *.log $(UCDB) *.wlf vsim.* *.rpt
	@echo "OK ― cleaned"
