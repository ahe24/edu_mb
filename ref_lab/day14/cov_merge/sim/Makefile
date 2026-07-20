# =============================================================================
# Day 14 ― cov_merge (회귀 커버리지 병합)
# 테스트마다 UCDB 하나 → vcover merge 로 합집합 → HTML 리포트.
# =============================================================================
#   make            = make merge
#   make comp       ― 커버리지 계측 컴파일 + 최적화 (1회)
#   make run        ― 3개 시나리오 각각 실행 → trip/recover/idle .ucdb 저장
#   make merge      ― vcover merge → merged.ucdb (합집합)
#   make report     ― 병합본 요약 : 개별 < 병합 확인
#   make html       ― vcover report -html merged.ucdb
#   make clean
# -----------------------------------------------------------------------------
#   같은 -testname 규칙으로 저장해야 병합 시 충돌 없음. 회귀의 증거는 병합본 하나.
# =============================================================================

TOP    := tb_trip_sel
FLIST  := flist.f
OPT    := opt_cov
COVER  := bcesf
TESTS  := trip recover idle
MERGED := merged.ucdb

.PHONY: all comp run merge report html clean

all: merge

comp:
	vlib work
	vmap work work
	vlog -f $(FLIST) +cover=$(COVER)
	vopt $(TOP) -o $(OPT) +cover=$(COVER) +acc -debug

# 각 시나리오를 독립 실행 → 이름별 UCDB
run: comp
	@for t in $(TESTS); do \
	  echo "=== TEST=$$t ==="; \
	  vsim -c -coverage $(OPT) +TEST=$$t \
	       -do "run -all; coverage save -testname $$t $$t.ucdb; quit -f"; \
	done
	@echo "OK ― 개별 UCDB: $(addsuffix .ucdb,$(TESTS))"

merge: run
	vcover merge -out $(MERGED) $(addsuffix .ucdb,$(TESTS))
	@echo "OK ― 병합본: $(MERGED)"

report:
	@echo "--- 개별 (trip) ---"
	vcover report trip.ucdb
	@echo "--- 병합본 (합집합) ---"
	vcover report $(MERGED)

html:
	vcover report -html $(MERGED)
	@echo "OK ― covhtmlreport/index.html"

clean:
	rm -rf work transcript covhtmlreport
	rm -f modelsim.ini questa.ini *.log *.ucdb *.wlf vsim.* *.rpt
	@echo "OK ― cleaned"
