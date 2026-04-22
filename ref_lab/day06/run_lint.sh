#!/usr/bin/env bash
# =============================================================================
# Day 06 Lab — run_lint.sh
# latent_bug 대상 DO-254 goal 기반 lint 배치 · HTML 리포트 · 합성 교차 검증
# =============================================================================
set -euo pipefail

DATE=$(date +%Y%m%d)
PROJECT="latent_bug"
OUT="lint_output"

echo "[1/4] compile"
qverify -c -do "vlog -sv latent_bug.v; exit"

echo "[2/4] lint run (DO-254 goal + DAL-A/B override)"
qverify -c -do "
  do base_goal.tcl
  lint run -d ${PROJECT} -output_directory ${OUT}
  exit
"

echo "[3/4] generate HTML report"
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
fi

echo "[4/4] optional synth cross-check (requires Vivado)"
if command -v vivado >/dev/null 2>&1; then
  vivado -mode batch -source synth_crosscheck.tcl | tee synth_log.txt
  echo "OK — synth cross-check: synth_crosscheck.md · synth_log.txt"
else
  echo "SKIP — Vivado not found; run 'vivado -mode batch -source synth_crosscheck.tcl' manually"
fi
