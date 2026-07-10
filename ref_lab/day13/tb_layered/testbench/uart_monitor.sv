// =============================================================================
// Day 13 ― uart_monitor.sv                                        [제공 코드]
// 역할: 관찰 전담 ― tx_pin 직렬 라인을 디코드해 바이트로 복원.
//   판정하지 않음 ― got/got_valid/frame_err 만 보고, 비교는 scoreboard 몫.
//   start 하강엣지 검출 → 1.5비트 대기(첫 data 중앙) → 비트마다 중앙 샘플.
// =============================================================================
module uart_monitor #(
  parameter integer BIT_CLK = 16      // 1비트 = BIT_CLK 클럭
)(
  input  wire       clk, rst,
  input  wire       tx_pin,           // 관찰 대상 직렬 라인
  output reg  [7:0] got,              // 복원 바이트
  output reg        got_valid,        // 복원 완료 1클럭 펄스
  output reg        frame_err         // stop!=1 프레이밍 오류 (got_valid 와 동시)
);
  integer i;

  initial begin
    got = 8'h00; got_valid = 1'b0; frame_err = 1'b0;
    @(negedge rst);
    forever begin
      @(negedge tx_pin);                             // start 검출
      repeat (BIT_CLK + BIT_CLK/2) @(posedge clk);   // 첫 data 비트 중앙
      for (i = 0; i < 8; i = i + 1) begin
        got[i] = tx_pin;                             // LSB first
        if (i < 7) repeat (BIT_CLK) @(posedge clk);
      end
      repeat (BIT_CLK) @(posedge clk);               // stop 비트 중앙
      frame_err <= (tx_pin !== 1'b1);                // framing 검사 결과만 보고
      got_valid <= 1'b1;
      @(posedge clk);
      got_valid <= 1'b0; frame_err <= 1'b0;
    end
  end
endmodule
