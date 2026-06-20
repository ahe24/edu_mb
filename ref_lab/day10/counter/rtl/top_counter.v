// =============================================================================
// Day 10 — top_counter.v  (보드 구현 top)
// 단일 100MHz 클럭 + 클럭 인에이블(tick) 패턴.
// counter 는 100MHz clk 로 동작하되, tick(1Hz) & en_sw 일 때만 +1 →
// LED 로 초당 1씩 증가하는 것을 눈으로 확인.
//   ※ clk 을 분주해 counter 의 clk 으로 쓰지 말 것(파생 클럭). en 으로 제어.
// =============================================================================
module top_counter (
  input  wire       clk,      // 100MHz
  input  wire       rst,      // BTN0
  input  wire       en_sw,    // SW0 — 카운트 허용
  output wire [3:0] cnt
);
  wire tick;

  tick_gen #(.DIV(100_000_000)) u_tick (
    .clk(clk), .rst(rst), .tick(tick)
  );

  counter #(.W(4)) u_cnt (
    .clk(clk), .rst(rst), .en(tick & en_sw), .cnt(cnt)
  );
endmodule
