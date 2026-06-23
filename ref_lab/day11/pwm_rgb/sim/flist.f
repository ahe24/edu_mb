# Day 11 pwm_gen — 컴파일 파일리스트 (sim/ 기준 상대경로)
# 시뮬 대상은 직접 구현 모듈 pwm_gen 단독 (TB 가 up_p/dn_p 펄스를 직접 구동).
# 디바운서/엣지검출은 보드 top 의 몫 → 시뮬에는 불필요(아래 board_flist.f 참고).
# vlog -f flist.f +define+FUNC_SIM 로 일괄 컴파일 (PERIOD=100).
../rtl/pwm_gen.v
../testbench/tb_pwm_gen.sv
