# =============================================================================
# Day 14 ― cov_measure (커버리지 측정 · 리포트 해석)
# QuestaSim 코드 커버리지 흐름 : comp(+cover) → opt(+cover) → sim(-coverage) → save → report
# 이 Makefile 은 sim/ 에서 실행, 생성물도 sim/ 에만.
# =============================================================================
#   make            = make cov   (전체 흐름 + UCDB 저장 + 요약 리포트)
#   make cov        ― vlog +cover → vopt +cover=bcesf → vsim -coverage → coverage save
#   make report     ― vcover report (요약) + -details (상세 홀 목록)
#   make html       ― vcover report -html → covhtmlreport/index.html
#   make gui        ― vsim -viewcov 로 UCDB 를 GUI 코드 커버리지 분석창에 로드
#   make clean      ― work · 생성물 정리
# -----------------------------------------------------------------------------
#   +cover 문자 : b=branch c=condition e=expression s=statement f=fsm  (t=toggle 는 필요시)
#   기능은 PASS 여도 branch/condition/FSM 커버리지에 홀이 남는 것을 확인 → 실습2 로.
# =============================================================================

TOP   := tb_trip
FLIST := flist.f
OPT   := opt_cov
UCDB  := trip.ucdb
COVER := bcesf

.PHONY: all cov report html gui clean

all: cov

cov:
	vlib work
	vmap work work
	vlog -f $(FLIST) +cover=$(COVER)
	vopt $(TOP) -o $(OPT) +cover=$(COVER) +acc -debug
	vsim -c -coverage $(OPT) \
	     -do "run -all; coverage save $(UCDB); coverage report; quit -f"
	@echo "OK ― UCDB: $(UCDB)  (make report / make html / make gui 로 열람)"

report:
	vcover report $(UCDB)
	@echo "--- 상세(홀 목록) ---"
	vcover report -details $(UCDB)

html:
	vcover report -html $(UCDB)
	@echo "OK ― covhtmlreport/index.html 을 브라우저로 열람"

gui:
	vsim -viewcov $(UCDB) &

clean:
	rm -rf work transcript covhtmlreport
	rm -f modelsim.ini questa.ini *.log $(UCDB) *.wlf vsim.* *.ucdb.* *.rpt
	@echo "OK ― cleaned"
