// =============================================================================
// Day 05 ― Blocking / Non-Blocking SIM mismatch demo
// 슬라이드 P1 (CP17) · P2 (CP15) · P4 (CP18) 의 *시뮬레이션 거동* 차이를
// 동일 stimulus 로 _bad / _good 모듈을 나란히 구동하여 파형으로 입증.
// =============================================================================
//   파형에서 확인할 것:
//   - pipe2 : bad 는 q1==q2==d (1 단 처럼 보임), good 은 2 cycle latency
//   - chain : bad 는 z 가 한 delta 늦게 반응, good 은 즉시 반영
//   - mac   : bad 는 out 이 *현재* a+b, good 은 *이전 cycle* a+b
// =============================================================================


// -----------------------------------------------------------------------------
// P1 (CP17) ― Sequential 블록에서 blocking `=` 사용
// -----------------------------------------------------------------------------
//  의도 : d → q1 → q2  (2 단 파이프라인, q2 는 d 보다 2 cycle 지연)
//  실제 : `=` 는 즉시 갱신 → q1 = d 가 먼저 끝나고 q2 = q1 (= d) 평가됨
//         결과 q2 = d (0 cycle, 파이프라인 붕괴)
//  합성 : 2 FF 그대로 추론 → sim/synth latency 불일치
// -----------------------------------------------------------------------------
module pipe2_bad (
  input  wire clk,
  input  wire d,
  output reg  q1,
  output reg  q2
);
  always @(posedge clk) begin
    q1 = d;          // blocking
    q2 = q1;         // 새로 갱신된 q1 을 봄 → q2 == d
  end
endmodule

module pipe2_good (
  input  wire clk,
  input  wire d,
  output reg  q1,
  output reg  q2
);
  always @(posedge clk) begin
    q1 <= d;         // non-blocking
    q2 <= q1;        // 직전 cycle 의 q1 을 봄 → 정상 2 단 지연
  end
endmodule


// -----------------------------------------------------------------------------
// P2 (CP15) ― sim demo 에서 제외
// -----------------------------------------------------------------------------
//  Combo 블록 NB (`always @(*) y <= a & b;`) 의 race 는 *시뮬레이터 scheduling
//  의존* ― Questa 는 같은 시점에 seq always 를 testbench 프로세스보다 먼저
//  실행하므로 bad/good 결과 동일하게 수렴. 다른 sim 은 다르게 행동 가능.
//  이 *비결정성 자체* 가 CP15 가 lint 규칙인 이유 (sim 이 잡아준다 보장 못함).
//  → P2 는 lint-only 로 분류, broken_rtl.v 의 fifo_ctrl stage2 에서 검출.
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// P4 (CP18) ― 동일 always 내 blocking / NB 혼용
// -----------------------------------------------------------------------------
//  bad : tmp = a+b (즉시) → out <= tmp (새 tmp) → out = a+b (1 단)
//  good: tmp <= a+b · out <= tmp → out = 직전 a+b (2 단 파이프라인)
//  → 같은 RTL 로 보이지만 동작 latency 가 1 cycle 차이.
// -----------------------------------------------------------------------------
module mac_bad (
  input  wire        clk,
  input  wire [3:0]  a, b,
  output reg  [4:0]  tmp,
  output reg  [4:0]  out
);
  always @(posedge clk) begin
    tmp = a + b;      // blocking
    out <= tmp;       // 새로 갱신된 tmp 사용
  end
endmodule

module mac_good (
  input  wire        clk,
  input  wire [3:0]  a, b,
  output reg  [4:0]  tmp,
  output reg  [4:0]  out
);
  always @(posedge clk) begin
    tmp <= a + b;     // 두 할당 모두 NB
    out <= tmp;       // 직전 cycle 의 tmp 사용
  end
endmodule
