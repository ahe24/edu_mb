// =============================================================================
// Day 11 — seq_detect.v  (FSM 코어 — "알고리즘"만 담당)
// 직렬 입력 din 에서 패턴 "1 0 1" 검출(overlap 허용) Moore FSM.
//   rst   : 동기 active-high — S0 으로 복귀
//   en    : 클럭 인에이블 — en=1 인 클럭에서만 din 1비트를 샘플하고 상태 전진.
//           (시뮬: en=1 고정 → 1비트/클럭 스트리밍. 보드: step 버튼 펄스 = en)
//   din   : 1비트 직렬 입력 — en 인 순간의 값이 "그 비트"
//   found : state==S101 일 때 1 (Moore 출력)
//   overlap: S101 에서 din=1 이면 S1 로 — 101101… 연속 패턴도 놓치지 않음.
//
// ※ 보드에서 손으로 비트를 넣으려면 en(클럭 인에이블)이 필수.
//   en 이 없으면 100MHz 매 클럭마다 전진해 손 박자로는 1비트/클럭을 못 맞춘다.
//   → 한 비트 = en 펄스 1개. 보드 배선은 seq_top.v 참고.
// =============================================================================
module seq_detect (        // 패턴 "1 0 1" 검출 (overlap 허용)
  input  wire clk,
  input  wire rst,
  input  wire en,          // 클럭 인에이블 — 이 클럭에서만 1비트 전진
  input  wire din,
  output wire found
);
  localparam S0=2'd0, S1=2'd1, S10=2'd2, S101=2'd3;
  reg [1:0] state, next;

  always @(posedge clk)             // 상태 reg (en 게이트)
    if (rst)     state <= S0;
    else if (en) state <= next;     // en=0 이면 현재 비트 유지 → 손으로 넣을 시간 확보

  always @* case (state)            // 다음 상태(조합)
    S0:      next = din ? S1   : S0;
    S1:      next = din ? S1   : S10;
    S10:     next = din ? S101 : S0;
    S101:    next = din ? S1   : S10;  // overlap 재사용
    default: next = S0;                // 안전 복구
  endcase

  assign found = (state == S101);   // Moore 출력 (en=0 동안 상태 유지 → LED 로 보임)
endmodule
