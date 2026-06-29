// =============================================================================
// Day 09 ― logic_gates.v
// 조합논리 기초: 두 스위치의 AND / OR / XOR 결과를 각 RGB LED 의 두 채널 색으로 표시.
// 클럭·레지스터 없음 ― 입력이 바뀌면 출력이 즉시 따라가는 순수 조합논리.
// =============================================================================
//   설계 목표
//   - sw[1:0]  → 단색 녹색 LED led[1:0] 로 그대로 통과 (pass-through)
//   - AND      → rgb0 : R+B 점등 (자홍)
//   - OR       → rgb1 : G+B 점등 (청록)
//   - XOR      → rgb2 : R+G 점등 (노랑)
//
//   채널 규약 : rgb*[2:0] = {R, G, B}  (rgb*[2]=R, rgb*[1]=G, rgb*[0]=B)
//               결과가 1 일 때만 해당 두 채널을 점등, 0 이면 소등.
// =============================================================================
module logic_gates (
  input  wire [1:0] sw,    // 슬라이드 스위치 SW0, SW1
  output wire [1:0] led,   // 단색 녹색 LED ― 입력 그대로 통과
  output wire [2:0] rgb0,  // RGB LED ch0 = AND  → R+B
  output wire [2:0] rgb1,  // RGB LED ch1 = OR   → G+B
  output wire [2:0] rgb2   // RGB LED ch2 = XOR  → R+G
);

  // 입력 통과: 스위치 → 단색 LED
  assign led  = sw;

  // 연산 결과 → RGB LED 두 채널 점등 ({R,G,B})
  assign rgb0 = (sw[0] & sw[1]) ? 3'b101 : 3'b000;  // AND → R+B (자홍)
  assign rgb1 = (sw[0] | sw[1]) ? 3'b011 : 3'b000;  // OR  → G+B (청록)
  assign rgb2 = (sw[0] ^ sw[1]) ? 3'b110 : 3'b000;  // XOR → R+G (노랑)

endmodule
