@echo off
rem ============================================================================
rem Day 06 Lab - run_lint.bat (Windows)
rem DO-254 goal + DAL-A/B override based latent_bug lint + synth cross-check
rem ----------------------------------------------------------------------------
rem   run_lint.bat          = run_lint.bat lint (default)
rem   run_lint.bat lint     - compile.tcl -> base_goal.tcl -> lint run -> HTML
rem   run_lint.bat gui      - open qverify GUI with lint.db
rem   run_lint.bat synth    - Vivado batch synth cross-check
rem   run_lint.bat all      - lint + synth sequentially
rem   run_lint.bat clean    - remove work/, lint_output/, logs, synth outputs
rem ============================================================================
setlocal enabledelayedexpansion

set PROJECT=latent_bug
set TOP=latent_bug
set OUT=lint_output

rem Date (YYYYMMDD) via PowerShell - locale-independent, works on Win10/Win11 where wmic is removed
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd"') do set DATE=%%I
set FINAL=%PROJECT%_%DATE%_do254_lint.html

if "%1"==""        goto lint
if /i "%1"=="lint"  goto lint
if /i "%1"=="gui"   goto gui
if /i "%1"=="synth" goto synth
if /i "%1"=="all"   goto all
if /i "%1"=="clean" goto clean

echo Unknown target: %1
echo Usage: run_lint.bat [lint ^| gui ^| synth ^| all ^| clean]
goto end

:all
call :lint
call :synth
goto end

:lint
rem Output dir via qverify -od (NOT lint run/generate option)
rem HTML report: lint generate report <name> -html ... — first arg is report path
rem Generated path (Questa 2025.3): %OUT%\html\<REPORT_NAME>.htm
set REPORT_NAME=lint_report
qverify -od %OUT% -c -do "do compile.tcl; do base_goal.tcl; lint run -d %TOP%; lint generate report %REPORT_NAME% -html -show_code_snippet -lines_count_before_violation 5; exit"
if exist "%OUT%\html\%REPORT_NAME%.htm" (
  copy /y "%OUT%\html\%REPORT_NAME%.htm" "%FINAL%" >nul
  echo OK - audit report: %FINAL%
)
goto :eof

:gui
start "" qverify "%OUT%\lint.db"
goto end

:synth
where vivado >nul 2>&1
if errorlevel 1 (
  echo SKIP - Vivado not found; run manually: vivado -mode batch -source synth_crosscheck.tcl
) else (
  vivado -mode batch -source synth_crosscheck.tcl
  echo OK - synth cross-check: synth_crosscheck.md
)
goto :eof

:clean
if exist work rmdir /s /q work
if exist work_db rmdir /s /q work_db
if exist qcache rmdir /s /q qcache
if exist .qverify rmdir /s /q .qverify
if exist .visualizer rmdir /s /q .visualizer
if exist qverify_cmds.tcl del /q qverify_cmds.tcl
if exist modelsim.ini del /q modelsim.ini
if exist %OUT% rmdir /s /q %OUT%
if exist transcript del /q transcript
if exist .Xil rmdir /s /q .Xil
del /q *.log 2>nul
del /q %PROJECT%_*.html 2>nul
del /q synth_log.txt 2>nul
del /q *.jou 2>nul
del /q *.backup.jou 2>nul
echo OK - cleaned
goto end

:end
endlocal
