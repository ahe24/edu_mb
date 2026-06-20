// =============================================================================
// Day 12 — uart_rx.v
// UART 수신기. 16× oversample 로 start 하강엣지 검출 후 각 비트 중앙에서 샘플.
//   rx_in 은 비동기 입력 → 2FF 동기화(metastability 방어) 후 사용.
//   IDLE 에서 rx==0(start) 검출 → START 중앙(os==7) 확인 →
//   DATA 는 16틱마다(os==15) 비트 중앙 샘플, LSB first 시프트 → STOP 후 valid.
//   data 출력은 STOP 시점에 확정, valid 는 1클럭 펄스.
// =============================================================================
module uart_rx (
  input  wire       clk, rst,
  input  wire       tick16,     // 16× baud tick
  input  wire       rx_in,      // 직렬 입력 (raw)
  output reg  [7:0] data,
  output reg        valid
);
  reg s0, s1;                    // 2FF 동기화 (비동기 입력)
  always @(posedge clk) {s1, s0} <= {s0, rx_in};
  wire rx = s1;

  localparam IDLE=2'd0, START=2'd1, DATA=2'd2, STOP=2'd3;
  reg [1:0] state;  reg [3:0] os;  reg [2:0] idx;  reg [7:0] sh;

  always @(posedge clk) begin
    valid <= 1'b0;
    if (rst) begin state<=IDLE; os<=0; end
    else if (tick16) case (state)
      IDLE:  if (!rx) begin state<=START; os<=0; end        // start 하강
      START: if (os==4'd7) begin os<=0; state<=DATA; idx<=0; end // 중앙 확인
             else os<=os+1'b1;
      DATA:  if (os==4'd15) begin os<=0; sh<={rx, sh[7:1]};  // 비트 중앙 샘플
               if (idx==3'd7) state<=STOP; else idx<=idx+1'b1; end
             else os<=os+1'b1;
      STOP:  if (os==4'd15) begin data<=sh; valid<=1'b1; state<=IDLE; end
             else os<=os+1'b1;
    endcase
  end
endmodule
