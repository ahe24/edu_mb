// =============================================================================
// Day 11 — traffic_light.v
// 타이머 기반 신호등 Moore FSM. RED→GRN→YEL 순환, 각 상태를 타이머로 유지.
//   rst   : 동기 active-high — 클럭 엣지에서 RED 로 복귀
//   light : one-hot 출력 [2]=R [1]=Y [0]=G — 3색 동시 점등 불가(안전)
//   default 는 항상 적색(RED) — fail-safe.
//   시뮬은 +define+FUNC_SIM 로 컴파일 → T_* 축소해 빨리 순환 확인(동일 RTL).
// =============================================================================
module traffic_light (
  input  wire       clk,
  input  wire       rst,
  output reg  [2:0] light    // [2]=R [1]=Y [0]=G
);
  localparam RED=2'd0, GRN=2'd1, YEL=2'd2;

  // 기능검증 컴파일(+define+FUNC_SIM)이면 타이머 축소 → 빨리 순환, 합성은 실제 값
`ifdef FUNC_SIM
  localparam [7:0] T_RED=3, T_GRN=2, T_YEL=1;     // 시뮬용
`else
  localparam [7:0] T_RED=30, T_GRN=25, T_YEL=5;   // 실제 (틱 단위)
`endif

  reg [1:0] state, next;
  reg [7:0] tmr;
  wire done = (state==RED && tmr==T_RED-1) ||
              (state==GRN && tmr==T_GRN-1) ||
              (state==YEL && tmr==T_YEL-1);

  always @(posedge clk)                 // ① 상태+타이머
    if (rst)       begin state<=RED; tmr<=0; end
    else if (done) begin state<=next; tmr<=0; end
    else           tmr <= tmr + 1'b1;

  always @* case (state)                // ② 다음 상태
    RED:     next = GRN;
    GRN:     next = YEL;
    YEL:     next = RED;
    default: next = RED;                // 안전: 적색
  endcase

  always @* case (state)                // ③ 출력 (Moore)
    RED:     light = 3'b100;
    GRN:     light = 3'b001;
    YEL:     light = 3'b010;
    default: light = 3'b100;            // 안전: 적색
  endcase
endmodule
