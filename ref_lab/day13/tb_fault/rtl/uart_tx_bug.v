// =============================================================================
// Day 13 ― uart_tx_bug.v                                  [버그 주입판 · 제공]
// Day12 uart_tx 와 동일 인터페이스/구조. `ifdef 로 결함 2종을 선택 주입해
//   TB(계층화 scoreboard + bind SVA)의 "검출력"을 확인하는 용도.
//     +define+BUG_ORDER : DATA 를 MSB first 로 송신 ― 데이터 값 결함
//     +define+BUG_STOP  : stop bit 을 0 으로 구동   ― 프로토콜 결함
//   매크로 미정의 시 정상 동작(= Day12 원본과 동일 거동).
// =============================================================================
module uart_tx (
  input  wire       clk, rst,
  input  wire       tick,        // baud 1배 tick
  input  wire       start,       // 전송 요청 (1-clk)
  input  wire [7:0] data,
  output reg        tx,          // 직렬 출력 (idle=1)
  output reg        busy
);
  localparam IDLE=2'd0, START=2'd1, DATA=2'd2, STOP=2'd3;
  reg [1:0] state, next;
  reg [2:0] idx;
  reg [7:0] sh;
  reg       pend;     // start 요청 래치 ― 다음 tick 경계에서 프레임 개시

  // (1) 상태 레지스터
  always @(posedge clk)
    if (rst) state <= IDLE;
    else     state <= next;

  // (2) 차기 상태 조합논리
  always @(*) begin
    next = state;
    case (state)
      IDLE:  if (pend && tick)        next = START;
      START: if (tick)                next = DATA;
      DATA:  if (tick && idx==3'd7)   next = STOP;
      STOP:  if (tick)                next = IDLE;
      default:                        next = IDLE;
    endcase
  end

  // (3) 출력·데이터패스 ― `ifdef 로 결함 주입 지점 명시
  always @(posedge clk)
    if (rst) begin tx<=1'b1; busy<=1'b0; pend<=1'b0; end
    else case (state)
      IDLE:  begin tx<=1'b1; busy<=1'b0;
               if (start) begin sh<=data; pend<=1'b1; end
               if (pend && tick) begin pend<=1'b0; busy<=1'b1; tx<=1'b0; end end
      START: begin tx<=1'b0;
               if (tick) idx<=0; end
`ifdef BUG_ORDER
      // [BUG] MSB first 송신 ― 값은 깨지지만 프레임 타이밍은 정상
      //   → scoreboard(값 비교)만 잡고 SVA(프로토콜)는 통과
      DATA:  begin tx<=sh[7];
               if (tick) begin sh<={sh[6:0], 1'b0};
                 if (idx!=3'd7) idx<=idx+1'b1; end end
`else
      DATA:  begin tx<=sh[0];                     // LSB first (정상)
               if (tick) begin sh<={1'b0, sh[7:1]};
                 if (idx!=3'd7) idx<=idx+1'b1; end end
`endif
`ifdef BUG_STOP
      // [BUG] stop bit 을 0 으로 구동 ― 프로토콜(framing) 위반
      //   → monitor frame_err + bind SVA A_STOPBIT 둘 다 검출
      STOP:  tx<=1'b0;
`else
      STOP:  tx<=1'b1;                            // stop bit (정상)
`endif
    endcase
endmodule
