# Day 11 traffic_light — 보드 합성용 파일리스트 (fpga/ 기준 상대경로)
# 보드 top = top_traffic_light. tick_gen(1Hz en) + traffic_light(FSM) 구성 (TB 제외).
#   ① tick_gen.v       100MHz→1Hz 클럭 인에이블 (Day10 원본 재사용 — 사본 금지)
#   ② traffic_light.v  FSM 코어 (en 클럭 인에이블)
#   ③ top_traffic_light.v  최상위 배선 (tick_gen.tick → traffic_light.en)
../../../day10/counter/rtl/tick_gen.v
../rtl/traffic_light.v
../rtl/top_traffic_light.v
