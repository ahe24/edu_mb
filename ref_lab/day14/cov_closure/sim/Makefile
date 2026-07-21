# =============================================================================
# Day 14 ― cov_closure (커버리지 클로저 · 도달불가 홀 제외)
# 보강 후에도 남는 도달불가 홀을 사유와 함께 제외 → 100% + waiver 목록으로 종료.
# =============================================================================
#   make            = make closure
#   make cov        ― 보강 TB 로 시뮬 → boost.ucdb 저장
#   make closure    ― Coverage View 로 UCDB 로드 → exclude.do 적용(사유) → closed.ucdb
#   make report     ― 제외 반영 리포트 (도달불가 홀이 waiver 로 처리)
#   make html       ― closed.ucdb HTML (제외 사유가 툴팁으로 표시)
#   make clean
# -----------------------------------------------------------------------------
#   -comment 제외는 Coverage View 모드(vsim -viewcov)에서만 지원 ― live sim 불가.
#   제외 목록 = 심사·기술검토회의 대응 산출물. exclude.do 는 형상관리 대상.
# =============================================================================

TOP    := tb_trip_boost
DUT    := trip_top
FLIST  := flist.f
OPT    := opt_cov
COVER  := bcesf
UCDB   := boost.ucdb
CLOSED := closed.ucdb

.PHONY: all cov closure report html clean

all: closure

cov:
	vlib work
	vmap work work
	vlog -f $(FLIST)
	vopt $(TOP) -o $(OPT) +cover=$(COVER)+$(DUT). +acc -debug
	vsim -c -coverage $(OPT) \
	     -do "coverage save -onexit $(UCDB); run -all; quit -f"
	@echo "OK ― 제외 전 UCDB: $(UCDB)"

# Coverage View 모드에서 제외(사유) 적용 → 재저장
closure: cov
	vsim -viewcov $(UCDB) -c \
	     -do "do ../exclude.do; coverage save $(CLOSED); quit -f"
	@echo "OK ― 제외 후 UCDB: $(CLOSED)  (도달불가 홀 waiver 처리)"

report:
	vcover report -details $(CLOSED)

html:
	vcover report -html $(CLOSED)
	@echo "OK ― covhtmlreport/index.html (제외 사유 툴팁 확인)"

clean:
	rm -rf work transcript covhtmlreport
	rm -f modelsim.ini questa.ini *.log *.ucdb *.wlf vsim.* *.rpt
	@echo "OK ― cleaned"
