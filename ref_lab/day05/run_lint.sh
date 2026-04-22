#!/usr/bin/env bash
# =============================================================================
# Day 05 Lab — run_lint.sh
# broken_rtl 대상 DO-254 goal 기반 lint 배치 실행 · HTML 리포트 생성
# =============================================================================
set -euo pipefail

DATE=$(date +%Y%m%d)
PROJECT="broken_rtl"
OUT="lint_output"

echo "[1/3] compile"
qverify -c -do "vlog -sv broken_rtl.v; exit"

echo "[2/3] lint run (DO-254 goal)"
qverify -c -do "
  do base_goal.tcl
  lint run -d ${PROJECT} -output_directory ${OUT}
  exit
"

echo "[3/3] generate HTML report"
qverify -c -do "
  do base_goal.tcl
  lint run -d ${PROJECT} -output_directory ${OUT}
  lint generate report -full -html -output_directory ${OUT}
  exit
"

REPORT="${OUT}/lint_report.html"
FINAL="${PROJECT}_${DATE}_do254_lint.html"
if [[ -f "${REPORT}" ]]; then
  cp "${REPORT}" "${FINAL}"
  echo "OK — audit report: ${FINAL}"
else
  echo "WARN — ${REPORT} not found; check lint_output/"
fi
