// =============================================================================
// Day 09 — tb_mux4.sv
// sel(=sw[1:0]) 4 조합(00→01→10→11)을 순차 인가, rgb 출력을
//   ① $display 로 관찰 (Visualizer 파형과 대조)
//   ② golden 기대 색 배열과 self-checking 자동 판정 ($error 0 건 = PASS)
// =============================================================================
`timescale 1ns/1ps

module tb_mux4;

  // --- DUT 연결 신호 ---------------------------------------------------------
  reg  [1:0] sw;             // sel = sw[1:0]
  wire [2:0] rgb;

  mux4 dut (.sw(sw), .rgb(rgb));

  // --- golden — sel 별 기대 색 (코드로 직접 보유) ----------------------------
  reg [2:0] exp [0:3];

  integer i;
  integer errors = 0;

  initial begin
    exp[0] = 3'b100;   // R 빨강
    exp[1] = 3'b010;   // G 초록
    exp[2] = 3'b001;   // B 파랑
    exp[3] = 3'b111;   // W 흰색

    $display("============================================================");
    $display(" Day09 mux4 — 4:1 컬러 MUX self-checking TB");
    $display("------------------------------------------------------------");

    for (i = 0; i < 4; i = i + 1) begin
      sw = i[1:0];  #10;                  // 자극 인가 후 조합 지연 대기
      $display("sw=%b | rgb=%b  exp=%b", sw, rgb, exp[i]);

      // !== 사용 — X/Z 불일치까지 검출
      if (rgb !== exp[i]) begin
        errors = errors + 1;
        $error("MISMATCH @ sw=%b : rgb=%b (exp %b)", sw, rgb, exp[i]);
      end
    end

    $display("------------------------------------------------------------");
    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $display("============================================================");
    $finish;
  end

endmodule
