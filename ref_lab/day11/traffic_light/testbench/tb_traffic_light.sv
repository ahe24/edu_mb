// =============================================================================
// Day 11 — tb_traffic_light.sv
// +define+FUNC_SIM 로 컴파일하면 DUT 의 타이머가 축소돼 순환을 빨리 확인.
// reference 시퀀스/타이머 모델과 매 클럭 light 비교 — $error 0 건 = PASS.
//   ※ DUT 와 동일하게 T_* 도 FUNC_SIM 으로 맞춰 golden 모델 일치.
//   검증 포인트: light one-hot · RED→GRN→YEL→RED 순서 · 상태별 유지 클럭 수.
// =============================================================================
`timescale 1ns/1ps

module tb_traffic_light;

  localparam RED=2'd0, GRN=2'd1, YEL=2'd2;

  // DUT 내부 T_* 와 동일 규칙 — 같은 +define+FUNC_SIM 로 일치
`ifdef FUNC_SIM
  localparam [7:0] T_RED=3, T_GRN=2, T_YEL=1;     // 시뮬용 (보드는 30/25/5)
`else
  localparam [7:0] T_RED=30, T_GRN=25, T_YEL=5;
`endif

  reg        clk = 1'b0, rst;
  wire [2:0] light;
  integer    errors = 0;

  // golden 모델 — DUT 와 동일 규칙 (상태+타이머)
  reg  [1:0] mstate; reg [7:0] mtmr;
  reg  [1:0] mnext; reg [2:0] mlight;
  wire mdone = (mstate==RED && mtmr==T_RED-1) ||
               (mstate==GRN && mtmr==T_GRN-1) ||
               (mstate==YEL && mtmr==T_YEL-1);

  traffic_light dut (.clk(clk), .rst(rst), .light(light));

  always #5 clk = ~clk;               // 100MHz

  always @(posedge clk)
    if (rst)        begin mstate<=RED; mtmr<=0; end
    else if (mdone) begin mstate<=mnext; mtmr<=0; end
    else            mtmr <= mtmr + 1'b1;

  always @* case (mstate)
    RED:     mnext = GRN;
    GRN:     mnext = YEL;
    YEL:     mnext = RED;
    default: mnext = RED;
  endcase

  always @* case (mstate)
    RED:     mlight = 3'b100;
    GRN:     mlight = 3'b001;
    YEL:     mlight = 3'b010;
    default: mlight = 3'b100;
  endcase

  // one-hot 검사 — 항상 정확히 한 비트만 HIGH
  function automatic is_onehot(input [2:0] v);
    is_onehot = (v==3'b100) || (v==3'b010) || (v==3'b001);
  endfunction

  // 자동 판정 — 시퀀스 일치(!==) + one-hot
  always @(posedge clk)
    if (!rst) begin
      if (light !== mlight) begin
        errors = errors + 1;
        $error("MISMATCH t=%0t light=%b exp=%b", $time, light, mlight);
      end
      if (!is_onehot(light)) begin
        errors = errors + 1;
        $error("NOT ONE-HOT t=%0t light=%b", $time, light);
      end
    end

  initial begin
    rst = 1; repeat (2) @(posedge clk); rst = 0;
    repeat (3*(T_RED+T_GRN+T_YEL)) @(posedge clk);   // RED→GRN→YEL 여러 바퀴

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule
