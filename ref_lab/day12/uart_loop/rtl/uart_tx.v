// =============================================================================
// Day 12 — uart_tx.v
// UART 송신기. start→data→stop FSM 이 baud tick 마다 한 비트씩 직렬 출력.
//   tx idle=1. start(1-clk) 시 data 래치 후 START→DATA×8→STOP 진행.
//   DATA 구간은 shift register 로 LSB first 전송.
//   busy 는 전송 중 HIGH, IDLE 복귀 시 LOW.
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
  reg [1:0] state;
  reg [2:0] idx;
  reg [7:0] sh;

  always @(posedge clk)
    if (rst) begin state<=IDLE; tx<=1'b1; busy<=1'b0; end
    else case (state)
      IDLE:  begin tx<=1'b1; busy<=1'b0;
               if (start) begin sh<=data; busy<=1'b1; state<=START; end end
      START: begin tx<=1'b0;                      // start bit
               if (tick) begin state<=DATA; idx<=0; end end
      DATA:  begin tx<=sh[0];                     // LSB first
               if (tick) begin sh<={1'b0, sh[7:1]};
                 if (idx==3'd7) state<=STOP; else idx<=idx+1'b1; end end
      STOP:  begin tx<=1'b1;                      // stop bit
               if (tick) state<=IDLE; end
    endcase
endmodule
