# =============================================================================
# Day 09 — mux4 (4:1 컬러 MUX → RGB LED) 시뮬레이션
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
#   파형에서 sel(=sw[1:0]) 4 조합(00→01→10→11) 스윕 시 rgb 확인:
#     sw  rgb   (00→100 R, 01→010 G, 10→001 B, 11→111 W)
#   콘솔 RESULT: PASS 면 golden 기대 색과 전부 일치.
# =============================================================================

TOP   := tb_mux4
FLIST := flist.f
OPT   := opt
WAVE  := qwave.db
DSGN  := design.bin

.PHONY: all comp opt sim wave clean

all: sim

# 1. 라이브러리 생성·매핑 후 파일리스트로 일괄 컴파일
comp:
	vlib work
	vmap work work
	vlog -f $(FLIST)

# 2. 최적화 + 디버그 DB(design.bin) 생성 — Visualizer 가 계층·신호를 읽는 근거
opt: comp
	vopt $(TOP) -o $(OPT) -debug +designfile

# 3. 배치(-c) 시뮬 — qwavedb 포맷 파형 DB 기록 + self-checking 콘솔 출력
sim: opt
	vsim -c $(OPT) -qwavedb=+signal+class+wavefile=$(WAVE) \
	     -do "run -all; quit -f"
	@echo "OK — wave: $(WAVE)  /  design: $(DSGN)"

# 4. Visualizer GUI — 덤프된 설계 구조 + 파형 위에 오픈 (post-sim debug)
wave:
	visualizer -designfile $(DSGN) -wavefile $(WAVE) &

clean:
	rm -rf work transcript .visualizer
	rm -f modelsim.ini questa.ini *.log $(DSGN) $(WAVE) *.wlf vsim.* *.vstf *.ses
	@echo "OK — cleaned"
