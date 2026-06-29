// =============================================================================
// Day 11 ― debounce.v  (구성요소 ① ― Day10 재사용)
// 기계식 버튼의 채터링(bounce) 제거 + 비동기 입력 2FF 동기화.
//   ① btn_in 은 클럭과 무관한 비동기 입력 → s0/s1 2단 FF 로 메타안정 방지.
//   ② s1 이 btn_out 과 다른 상태를 STABLE 클럭 동안 유지하면 btn_out 에 반영.
//      (짧은 글리치는 카운터가 리셋되어 흡수)
//   출력 btn_out 은 "안정된 레벨"(누르는 동안 1, 떼면 0). 1클럭 펄스가 아님 →
//   seq_top 에서 상승엣지 검출로 step 펄스(=en)를 만든다.
// =============================================================================
module debounce #(
  parameter integer STABLE = 1_000_000  // ~10ms @100MHz
)(
  input  wire clk,
  input  wire rst,
  input  wire btn_in,        // 노이즈 있는 raw 버튼 (비동기)
  output reg  btn_out        // 안정화된 버튼 레벨
);
  reg [19:0] cnt;
  reg        s0, s1;         // 2단 동기화 FF

  always @(posedge clk)      // ① 메타안정 방지 2FF
    if (rst) {s1, s0} <= 2'b00;
    else     {s1, s0} <= {s0, btn_in};

  always @(posedge clk) begin // ② 카운터 기반 안정화
    if (rst)                  begin cnt <= 0; btn_out <= 1'b0; end
    else if (s1 == btn_out)   cnt <= 0;                       // 변화 없음 → 리셋
    else if (cnt == STABLE-1) begin btn_out <= s1; cnt <= 0; end
    else                      cnt <= cnt + 1'b1;
  end
endmodule
