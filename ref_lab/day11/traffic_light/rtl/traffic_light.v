// =============================================================================
// Day 11 — traffic_light.v  (FSM 코어 — "알고리즘"만 담당)
// 타이머 기반 신호등 Moore FSM. RED→GRN→YEL 순환, 각 상태를 타이머로 유지.
//   rst   : 동기 active-high — 클럭 엣지에서 RED 로 복귀
//   en    : 클럭 인에이블 — en=1 인 클럭에서만 타이머/상태가 1칸 전진.
//           (시뮬: TB 가 en 펄스로 빠르게 구동. 보드: tick_gen 의 1Hz tick = en)
//
// 출력 — 램프 3개를 보드 RGB LED 3개(LD0/LD1/LD2)로 독립 구동:
//   rgb_led_r/g/b[2:0] : RGB LED i 의 R/G/B 채널 (i=LD번호, [0]=LD0 …)
//     LD0=RED 램프 → R          LD1=YEL 램프 → R+G          LD2=GRN 램프 → G
//     ※ RGB LED 는 "노랑" 전용 핀이 없다 — 노랑 = 빨강+초록 동시 점등(가산혼합).
//     ※ 파랑(B)은 신호등에 미사용 → 항상 0.  한 번에 한 램프만 점등(상충 방지).
//   mono_led[2:0]      : 상태 one-hot(어떤 램프) 디버그 표시 → LD4/LD5/LD6
//                        [2]=R [1]=Y [0]=G — 색과 무관하게 "현재 상태" 확인용.
//   default 는 항상 적색(RED) — fail-safe.
//
// ※ T_* 는 "틱 단위" — en 1펄스 = 1틱. 보드는 tick_gen 으로 en 이 1Hz →
//   30/25/5 틱 = 30s/25s/5s. clk 을 분주해 새 클럭으로 쓰지 말 것(파생 클럭 금지).
//   보드 배선(tick_gen 연결)은 top_traffic_light.v 참고.
// =============================================================================
module traffic_light (
  input  wire       clk,
  input  wire       rst,        // 동기 active-high
  input  wire       en,         // 클럭 인에이블 — 이 클럭에서만 1틱 전진
  output reg  [2:0] rgb_led_r,  // RGB LED R채널 [i]=LDi (LD0/LD1/LD2)
  output reg  [2:0] rgb_led_g,  // RGB LED G채널
  output reg  [2:0] rgb_led_b,  // RGB LED B채널 — 신호등 미사용(항상 0)
  output reg  [2:0] mono_led    // 상태 one-hot 디버그 [2]=R [1]=Y [0]=G → LD4~6
);
  localparam RED=2'd0, GRN=2'd1, YEL=2'd2;
  localparam [7:0] T_RED=30, T_GRN=25, T_YEL=5;   // 틱 단위 (보드 1Hz → 30s/25s/5s)

  reg [1:0] state, next;
  reg [7:0] tmr;
  wire done = (state==RED && tmr==T_RED-1) ||
              (state==GRN && tmr==T_GRN-1) ||
              (state==YEL && tmr==T_YEL-1);

  always @(posedge clk)                 // ① 상태+타이머 (en 게이트)
    if (rst)         begin state<=RED; tmr<=0; end
    else if (en) begin                  // en=1 인 틱에서만 전진, en=0 이면 유지
      if (done)      begin state<=next; tmr<=0; end
      else           tmr <= tmr + 1'b1;
    end

  always @* case (state)                // ② 다음 상태
    RED:     next = GRN;
    GRN:     next = YEL;
    YEL:     next = RED;
    default: next = RED;                // 안전: 적색
  endcase

  always @* case (state)                // ③ 상태 one-hot (mono LED 디버그, Moore)
    RED:     mono_led = 3'b100;
    GRN:     mono_led = 3'b001;
    YEL:     mono_led = 3'b010;
    default: mono_led = 3'b100;         // 안전: 적색
  endcase

  always @* begin                       // ④ 램프 → RGB LED 색 디코드 (Moore)
    rgb_led_r = 3'b000;
    rgb_led_g = 3'b000;
    rgb_led_b = 3'b000;                 // 파랑 미사용
    case (state)
      RED:     rgb_led_r[0] = 1'b1;                            // LD0: 빨강
      YEL:     begin rgb_led_r[1] = 1'b1; rgb_led_g[1] = 1'b1; end // LD1: 빨강+초록 = 노랑 ★
      GRN:     rgb_led_g[2] = 1'b1;                            // LD2: 초록
      default: rgb_led_r[0] = 1'b1;                            // 안전: 적색(LD0)
    endcase
  end
endmodule
