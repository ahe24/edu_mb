# =============================================================================
# Day 05 Lab — Makefile (Linux)
# DO-254 goal 기반 broken_rtl lint 실행
# =============================================================================
#   make        = make lint   (기본)
#   make lint   — compile.tcl → base_goal.tcl → lint run → HTML 리포트
#   make gui    — qverify GUI 로 lint.db 오픈
#   make clean  — work/ · lint_output/ · 로그 정리
# =============================================================================

PROJECT := broken_rtl
TOP     := broken_rtl
OUT     := lint_output
DATE    := $(shell date +%Y%m%d)
FINAL   := $(PROJECT)_$(DATE)_do254_lint.html

REPORT_NAME := lint_report
QVERIFY_DO  := \
  do compile.tcl; \
  do base_goal.tcl; \
  lint run -d $(TOP); \
  lint generate report $(REPORT_NAME) -html -show_code_snippet -lines_count_before_violation 5; \
  exit

.PHONY: all lint gui clean

all: lint

# 출력 디렉토리: qverify -od (lint run/generate 의 옵션 아님)
# HTML 리포트: lint generate report <name> -html ... — 첫 인자는 리포트 경로
# 생성 경로 (Questa 2025.3): $(OUT)/html/<REPORT_NAME>.htm
lint:
	qverify -od $(OUT) -c -do "$(QVERIFY_DO)"
	@if [ -f $(OUT)/html/$(REPORT_NAME).htm ]; then \
	  cp $(OUT)/html/$(REPORT_NAME).htm $(FINAL); \
	  echo "OK — audit report: $(FINAL)"; \
	fi

gui:
	qverify $(OUT)/lint.db &

clean:
	rm -rf work work_db qcache .qverify .visualizer $(OUT) transcript
	rm -f qverify_cmds.tcl modelsim.ini *.log $(PROJECT)_*.html
	@echo "OK — cleaned"
