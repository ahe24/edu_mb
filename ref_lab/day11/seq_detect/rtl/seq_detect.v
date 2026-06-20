// =============================================================================
// Day 11 — seq_detect.v
// 직렬 입력 din 에서 패턴 "1 0 1" 검출(overlap 허용) Moore FSM.
//   rst   : 동기 active-high — S0 으로 복귀
//   din   : 1비트/클럭 직렬 입력 (MSB-first 로 흘려보냄)
//   found : state==S101 일 때 1 (Moore 출력) — 패턴 발견 시 1클럭 HIGH
//   overlap: S101 에서 din=1 이면 S1 로 — 101101… 연속 패턴도 놓치지 않음.
// =============================================================================
module seq_detect (        // 패턴 "1 0 1" 검출 (overlap 허용)
  input  wire clk,
  input  wire rst,
  input  wire din,
  output wire found
);
  localparam S0=2'd0, S1=2'd1, S10=2'd2, S101=2'd3;
  reg [1:0] state, next;

  always @(posedge clk)             // 상태 reg
    if (rst) state <= S0;
    else     state <= next;

  always @* case (state)            // 다음 상태
    S0:      next = din ? S1   : S0;
    S1:      next = din ? S1   : S10;
    S10:     next = din ? S101 : S0;
    S101:    next = din ? S1   : S10;  // overlap 재사용
    default: next = S0;                // 안전 복구
  endcase

  assign found = (state == S101);   // Moore 출력
endmodule
