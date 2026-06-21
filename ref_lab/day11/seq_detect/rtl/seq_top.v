// =============================================================================
// Day 11 — seq_top.v  (보드 hands-on 최상위 — "배선/구성요소"만 담당)
// 손으로 비트를 하나씩 넣어 "101" 검출을 눈으로 확인하는 보드 top.
//
//   SW0  → din   : 지금 넣을 비트 값(0/1)을 손으로 미리 설정
//   BTN1 → step  : 누를 때마다 "그 비트 1개"를 FSM 에 투입 (1클럭 en 펄스)
//   BTN0 → rst   : FSM 을 S0 로 복귀
//   LD4  → found : S101 도달 시 점등 — 다음 step 전까지 유지되어 눈에 보임
//
// 데이터 흐름 (구성요소 3단계):
//   BTN1(raw) ─►[① debounce]─► step_lvl ─►[② edge detect]─► step(1clk) ─► en
//   SW0 ───────────────────────────────────────────────────────► din
//                                          [③ seq_detect FSM] ─► found ─► LD4
//
// 왜 이렇게? 100MHz 에서 스위치를 손으로 올려두면 1초 = 1억 클럭이라
//   "비트 1개"가 아니라 "1이 1억 번"이 된다. 그래서 ① 버튼을 깨끗이 만들고
//   ② 누른 순간만 1클럭 펄스로 바꿔 ③ FSM 을 그 클럭에만 1비트 전진시킨다.
//   → 웹 슬라이드의 "din=1 / din=0 클릭 1번" == 보드의 "SW0 설정 + BTN1 1번".
// =============================================================================
module seq_top (
  input  wire clk,      // 100MHz 시스템 클럭
  input  wire rst,      // BTN0 (동기 active-high)
  input  wire step_btn, // BTN1 (비트 투입 버튼, raw·비동기)
  input  wire din,      // SW0  (넣을 비트 값)
  output wire found     // LD4
);
  // ── ① 버튼 디바운스(+2FF 동기화): 채터링·메타안정 제거 → 안정 레벨 ──
  wire step_lvl;
  debounce u_db (
    .clk(clk), .rst(rst), .btn_in(step_btn), .btn_out(step_lvl)
  );

  // ── ② 상승엣지 검출: 누른 "순간"만 1클럭 펄스 = en ──
  //    step_lvl 을 1클럭 지연(step_d)시켜 0→1 전이를 잡는다.
  reg step_d;
  always @(posedge clk)
    if (rst) step_d <= 1'b0;
    else     step_d <= step_lvl;
  wire step = step_lvl & ~step_d;   // 한 번 누르면 정확히 1클럭만 HIGH

  // ── ③ FSM 코어: en(=step) 인 클럭에서만 din 1비트 샘플·전진 ──
  seq_detect u_fsm (
    .clk(clk), .rst(rst), .en(step), .din(din), .found(found)
  );
endmodule
