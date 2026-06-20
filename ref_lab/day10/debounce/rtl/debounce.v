// =============================================================================
// Day 10 — debounce.v
// 기계식 버튼의 채터링(bounce) 제거 + 비동기 입력 2FF 동기화.
//   ① btn_in 은 클럭과 무관한 비동기 입력 → s0/s1 2단 FF 로 메타안정 방지.
//   ② s1 이 btn_out 과 다른 상태를 STABLE 클럭 동안 유지하면 btn_out 에 반영.
//      (짧은 글리치는 카운터가 리셋되어 흡수)
//   시뮬에선 STABLE 을 작게 override 해 빨리 확인.
// =============================================================================
module debounce #(
  parameter integer STABLE = 1_000_000  // ~10ms @100MHz
)(
  input  wire clk,
  input  wire rst,
  input  wire btn_in,        // 노이즈 있는 raw 버튼 (비동기)
  output reg  btn_out        // 안정화된 버튼
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
