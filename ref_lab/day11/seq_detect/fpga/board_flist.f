# Day 11 seq_detect — 보드 합성용 파일리스트 (fpga/ 기준 상대경로)
# 보드 top = seq_top. 구성요소 ①②③ 를 모두 포함 (TB 는 제외).
#   ① debounce.v   버튼 채터링 제거 + 2FF 동기화
#   ③ seq_detect.v FSM 코어 (en 클럭 인에이블)
#   ②+배선 seq_top  최상위(엣지검출 + 인스턴스)
../rtl/debounce.v
../rtl/seq_detect.v
../rtl/seq_top.v
