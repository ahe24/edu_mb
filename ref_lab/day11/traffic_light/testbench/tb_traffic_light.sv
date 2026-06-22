// =============================================================================
// Day 11 — tb_traffic_light.sv  (FSM 코어 단독 검증)
// DUT 는 en 클럭 인에이블 FSM — TB 가 EN_DIV 클럭마다 en 1펄스를 줘서 1틱씩 전진.
//   ※ 보드 1Hz tick_gen(DIV=1억)은 여기서 시뮬 안 함 — en 을 직접 빨리 줘서
//     분주 없이 수백 클럭이면 순환 관찰. FUNC_SIM 같은 타이머 축소 불필요.
// reference 모델과 매 클럭 RGB/mono LED 비교 — $error 0 건 = PASS.
//   검증 포인트: ① RED→GRN→YEL→RED 순서·유지 틱 수 ② 상태 one-hot(mono)
//   ③ RGB 색 정확 — 특히 YEL = R+G (RGB LED 는 노랑 핀이 없음) ④ en 게이팅.
// =============================================================================
`timescale 1ns/1ps

module tb_traffic_light;

  localparam RED=2'd0, GRN=2'd1, YEL=2'd2;
  localparam [7:0] T_RED=30, T_GRN=25, T_YEL=5;   // DUT 와 동일 (틱 단위, 실제 값)
  localparam integer EN_DIV = 4;                  // en 펄스 주기(클럭) — 게이팅 검증용

  reg        clk = 1'b0, rst;
  wire [2:0] rgb_led_r, rgb_led_g, rgb_led_b, mono_led;
  integer    errors = 0;

  // ── en 펄스 — EN_DIV 클럭마다 1클럭 폭 HIGH (보드 tick_gen 의 tick 역할) ──
  reg [7:0] encnt = 0;
  always @(posedge clk)
    if (rst)                  encnt <= 0;
    else if (encnt==EN_DIV-1) encnt <= 0;
    else                      encnt <= encnt + 1'b1;
  wire en = (~rst) & (encnt==EN_DIV-1);

  // ── golden 모델 — DUT 와 동일 규칙 (상태+타이머), 같은 en 으로 게이트 ──
  reg  [1:0] mstate; reg [7:0] mtmr;
  reg  [1:0] mnext;
  reg  [2:0] m_r, m_g, m_b, m_mono;
  wire mdone = (mstate==RED && mtmr==T_RED-1) ||
               (mstate==GRN && mtmr==T_GRN-1) ||
               (mstate==YEL && mtmr==T_YEL-1);

  traffic_light dut (
    .clk(clk), .rst(rst), .en(en),
    .rgb_led_r(rgb_led_r), .rgb_led_g(rgb_led_g), .rgb_led_b(rgb_led_b),
    .mono_led(mono_led)
  );

  always #5 clk = ~clk;               // 100MHz

  always @(posedge clk)
    if (rst)         begin mstate<=RED; mtmr<=0; end
    else if (en) begin
      if (mdone)     begin mstate<=mnext; mtmr<=0; end
      else           mtmr <= mtmr + 1'b1;
    end

  always @* case (mstate)
    RED:     mnext = GRN;
    GRN:     mnext = YEL;
    YEL:     mnext = RED;
    default: mnext = RED;
  endcase

  // 기대 mono(one-hot) + RGB 색 디코드 (DUT 와 동일)
  always @* case (mstate)
    RED:     m_mono = 3'b100;
    GRN:     m_mono = 3'b001;
    YEL:     m_mono = 3'b010;
    default: m_mono = 3'b100;
  endcase

  always @* begin
    m_r = 3'b000; m_g = 3'b000; m_b = 3'b000;
    case (mstate)
      RED:     m_r[0] = 1'b1;                          // LD0 빨강
      YEL:     begin m_r[1] = 1'b1; m_g[1] = 1'b1; end // LD1 빨강+초록 = 노랑
      GRN:     m_g[2] = 1'b1;                          // LD2 초록
      default: m_r[0] = 1'b1;
    endcase
  end

  // one-hot 검사 — 상태 표시는 항상 정확히 한 비트만 HIGH
  function automatic is_onehot(input [2:0] v);
    is_onehot = (v==3'b100) || (v==3'b010) || (v==3'b001);
  endfunction

  // 자동 판정 — 매 클럭 RGB/mono 일치(!==) + 상태 one-hot
  always @(posedge clk)
    if (!rst) begin
      if ({rgb_led_r,rgb_led_g,rgb_led_b,mono_led} !== {m_r,m_g,m_b,m_mono}) begin
        errors = errors + 1;
        $error("MISMATCH t=%0t  r=%b g=%b b=%b mono=%b  exp r=%b g=%b b=%b mono=%b",
               $time, rgb_led_r, rgb_led_g, rgb_led_b, mono_led, m_r, m_g, m_b, m_mono);
      end
      if (!is_onehot(mono_led)) begin
        errors = errors + 1;
        $error("STATE NOT ONE-HOT t=%0t mono=%b", $time, mono_led);
      end
    end

  initial begin
    rst = 1; repeat (2) @(posedge clk); rst = 0;
    // RED→GRN→YEL 여러 바퀴 (틱 60개/바퀴 × EN_DIV 클럭/틱 × 3바퀴 + 여유)
    repeat (3*(T_RED+T_GRN+T_YEL)*EN_DIV + 4*EN_DIV) @(posedge clk);

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule
