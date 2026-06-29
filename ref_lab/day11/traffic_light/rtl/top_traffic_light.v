// =============================================================================
// Day 11 ― top_traffic_light.v  (보드 최상위 ― "배선/구성요소"만 담당)
// 단일 100MHz 클럭 + 클럭 인에이블(tick) 패턴. 신호등 FSM 을 보드에서 느리게 구동.
//
//   clk  → 100MHz 시스템 클럭        rst → BTN0 (동기 active-high)
//   rgb_led_r/g/b[2:0] → RGB LED LD0/LD1/LD2 (RED / YEL=R+G / GRN 램프)
//   mono_led[2:0]      → mono LED LD4/LD5/LD6 (상태 one-hot 디버그)
//
// 데이터 흐름 (구성요소 2단계):
//   clk(100MHz) ─▶[① tick_gen DIV=1억]─▶ tick(1Hz, 1클럭 폭) ─▶ en
//                                        [② traffic_light FSM] ─▶ RGB/mono LED
//
// 왜 이렇게? 100MHz 를 그대로 카운트하면 30틱 = 300ns 라 LED 변화가 안 보인다.
//   tick_gen 으로 1초마다 en 1펄스를 만들어 FSM 을 "초당 1칸"씩 전진 →
//   30/25/5 틱 = 30s/25s/5s. clk 을 분주해 새 클럭으로 쓰지 말 것(파생 클럭 금지).
//   ※ tick_gen 은 Day10 에서 만든 원본 재사용 (fpga/board_flist.f 의 상대참조).
// =============================================================================
module top_traffic_light (
  input  wire       clk,        // 100MHz 시스템 클럭
  input  wire       rst,        // BTN0 (동기 active-high)
  output wire [2:0] rgb_led_r,  // RGB LED R채널 → LD0/LD1/LD2
  output wire [2:0] rgb_led_g,  // RGB LED G채널
  output wire [2:0] rgb_led_b,  // RGB LED B채널 (미사용 → 0)
  output wire [2:0] mono_led    // 상태 one-hot 디버그 → LD4/LD5/LD6
);
  // ── ① 1Hz tick 생성: DIV 클럭마다 1클럭 폭 en 펄스 (DIV 은 tick_gen `ifdef 분기) ──
  wire tick;
  tick_gen u_tick (
    .clk(clk), .rst(rst), .tick(tick)
  );

  // ── ② FSM 코어: en(=tick) 인 클럭에서만 타이머 1칸 전진 → 초당 한 칸 ──
  traffic_light u_fsm (
    .clk(clk), .rst(rst), .en(tick),
    .rgb_led_r(rgb_led_r), .rgb_led_g(rgb_led_g), .rgb_led_b(rgb_led_b),
    .mono_led(mono_led)
  );
endmodule
