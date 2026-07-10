// =============================================================================
// Day 12 ― uart_rx.v
// UART 수신기. 16× oversample 로 start 하강엣지 검출 후 각 비트 중앙에서 샘플.
//   rx_in 은 비동기 입력 → 2FF 동기화(metastability 방어) 후 사용.
//   IDLE 에서 rx==0(start) 검출 → START 중앙(os_cnt==7) 확인 →
//   DATA 는 16틱마다(os_cnt==15) 비트 중앙 샘플, LSB first 시프트 → STOP 후 valid.
//   data 출력은 STOP 시점에 확정, valid 는 1클럭 펄스.
// =============================================================================
module uart_rx (
  input  wire       clk, rst,
  input  wire       tick16,     // 16× baud tick
  input  wire       rx_in,      // 직렬 입력 (raw)
  output reg  [7:0] data,       // 수신 바이트 (STOP 시점 확정)
  output reg        valid       // 수신 완료 1클럭 펄스
);
  // ---------------------------------------------------------------------------
  // 입력 동기화 ― 비동기 rx_in 을 2FF 로 clk 도메인에 동기화
  // ---------------------------------------------------------------------------
  reg s0, s1;                   // 2FF 동기화 플립플롭

  always @(posedge clk) {s1, s0} <= {s0, rx_in};

  wire rx = s1;                 // 동기화된 수신 입력

  // ---------------------------------------------------------------------------
  // FSM 상태 및 데이터패스 레지스터
  // ---------------------------------------------------------------------------
  localparam IDLE  = 2'd0,      // 유휴 ― start 하강엣지 대기
             START = 2'd1,      // start bit ― 중앙(os_cnt==7)까지 확인
             DATA  = 2'd2,      // 데이터 8비트 ― 16틱마다 중앙 샘플
             STOP  = 2'd3;      // stop bit ― 완료 후 valid 펄스

  reg [1:0] state;              // FSM 현재 상태
  reg [3:0] os_cnt;             // oversample 카운터 (0~15) ― 비트 내 tick16 위상
  reg [2:0] idx;                // 수신 비트 인덱스 (0~7)
  reg [7:0] sh;                 // 수신 시프트 레지스터 (LSB first)

  always @(posedge clk) begin
    valid <= 1'b0;              // 기본값 ― valid 는 1클럭 펄스
    if (rst) begin
      state  <= IDLE;
      os_cnt <= 0;
    end
    else if (tick16) case (state)
      // start 하강엣지 검출 → START 진입
      IDLE:
        if (!rx) begin
          state  <= START;
          os_cnt <= 0;
        end

      // 하강엣지부터 반 비트(8틱) = start bit 중앙 → 이후 샘플점이 비트 중앙에 정렬
      START:
        if (os_cnt == 4'd7) begin
          os_cnt <= 0;
          state  <= DATA;
          idx    <= 0;
        end
        else os_cnt <= os_cnt + 1'b1;

      // 16틱마다(비트 중앙) 샘플 → MSB 쪽에서 시프트 인 (LSB first 수신)
      DATA:
        if (os_cnt == 4'd15) begin
          os_cnt <= 0;
          sh     <= {rx, sh[7:1]};
          if (idx == 3'd7) state <= STOP;
          else             idx   <= idx + 1'b1;
        end
        else os_cnt <= os_cnt + 1'b1;

      // stop bit 중앙 → data 확정, valid 1클럭 펄스, IDLE 복귀
      STOP:
        if (os_cnt == 4'd15) begin
          data  <= sh;
          valid <= 1'b1;
          state <= IDLE;
        end
        else os_cnt <= os_cnt + 1'b1;
    endcase
  end
endmodule
