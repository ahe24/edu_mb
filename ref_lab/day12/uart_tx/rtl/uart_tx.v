// =============================================================================
// Day 12 ― uart_tx.v
// UART 송신기. start→data→stop FSM 이 baud tick 마다 한 비트씩 직렬 출력.
//   tx idle=1. start(1-clk) 시 data 래치 후 START→DATA×8→STOP 진행.
//   DATA 구간은 shift register 로 LSB first 전송.
//   busy 는 전송 중 HIGH, IDLE 복귀 시 LOW.
//   FSM 은 3-always 구조 ― (1) 상태 레지스터 (2) 다음 상태 조합논리
//   (3) 출력·데이터패스 레지스터. 파일 하단에 1-always 원본 주석 보존.
// =============================================================================
module uart_tx (
  input  wire       clk, rst,
  input  wire       tick,        // baud 1× tick
  input  wire       start,       // 전송 요청 (1-clk)
  input  wire [7:0] data,
  output reg        tx,          // 직렬 출력 (idle=1)
  output reg        busy
);
  localparam IDLE=2'd0, START=2'd1, DATA=2'd2, STOP=2'd3;
  reg [1:0] state, next;
  reg [2:0] idx;
  reg [7:0] sh;
  reg       pend;     // start 요청 보류 ― 다음 tick 경계에서 프레임 시작(start bit 정렬)

  // ---------------------------------------------------------------------------
  // (1) 상태 레지스터 ― 클럭 에지마다 next 를 state 로 반영
  // ---------------------------------------------------------------------------
  always @(posedge clk)
    if (rst) state <= IDLE;
    else     state <= next;

  // ---------------------------------------------------------------------------
  // (2) 다음 상태 조합논리 ― 전이 조건만 기술 (기본값 next=state 로 래치 방지)
  // ---------------------------------------------------------------------------
  always @(*) begin
    next = state;
    case (state)
      IDLE:  if (pend && tick)        next = START;   // tick 경계에서 프레임 시작
      START: if (tick)                next = DATA;    // start bit 1 tick 완료
      DATA:  if (tick && idx==3'd7)   next = STOP;    // 8비트 전송 완료
      STOP:  if (tick)                next = IDLE;    // stop bit 1 tick 완료
      default:                        next = IDLE;
    endcase
  end

  // ---------------------------------------------------------------------------
  // (3) 출력·데이터패스 레지스터 ― tx/busy 출력과 sh/idx/pend 갱신
  // ---------------------------------------------------------------------------
  always @(posedge clk)
    if (rst) begin tx<=1'b1; busy<=1'b0; pend<=1'b0; end
    else case (state)
      IDLE:  begin tx<=1'b1; busy<=1'b0;
               if (start) begin sh<=data; pend<=1'b1; end          // 요청 보류(busy 아직)
               // free-running tick 경계에 맞춰 start bit 시작 → 한 비트 폭 보장
               if (pend && tick) begin pend<=1'b0; busy<=1'b1; tx<=1'b0; end end
      START: begin tx<=1'b0;                      // start bit (정확히 1 tick 주기)
               if (tick) idx<=0; end
      DATA:  begin tx<=sh[0];                     // LSB first
               if (tick) begin sh<={1'b0, sh[7:1]};
                 if (idx!=3'd7) idx<=idx+1'b1; end end
      STOP:  tx<=1'b1;                            // stop bit
    endcase

  // ===========================================================================
  // [예시] 1-always 구현 원본 ― 위 3-always 와 동작 동일 (참고용 보존)
  // ===========================================================================
  // always @(posedge clk)
  //   if (rst) begin state<=IDLE; tx<=1'b1; busy<=1'b0; pend<=1'b0; end
  //   else case (state)
  //     IDLE:  begin tx<=1'b1; busy<=1'b0;
  //              if (start) begin sh<=data; pend<=1'b1; end          // 요청 보류(busy 아직)
  //              // free-running tick 경계에 맞춰 start bit 시작 → 한 비트 폭 보장
  //              if (pend && tick) begin pend<=1'b0; busy<=1'b1; tx<=1'b0; state<=START; end end
  //     START: begin tx<=1'b0;                      // start bit (정확히 1 tick 주기)
  //              if (tick) begin state<=DATA; idx<=0; end end
  //     DATA:  begin tx<=sh[0];                     // LSB first
  //              if (tick) begin sh<={1'b0, sh[7:1]};
  //                if (idx==3'd7) state<=STOP; else idx<=idx+1'b1; end end
  //     STOP:  begin tx<=1'b1;                      // stop bit
  //              if (tick) state<=IDLE; end
  //   endcase
  // ===========================================================================
endmodule
