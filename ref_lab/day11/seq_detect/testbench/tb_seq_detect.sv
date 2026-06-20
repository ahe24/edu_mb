// =============================================================================
// Day 11 — tb_seq_detect.sv
// 알려진 비트 스트림을 MSB-first 로 흘려보내며 "101" 검출 found 펄스 수를 집계.
// 기대 펄스 수(overlap 고려)와 비교 — $error 0 건 = PASS.
//   스트림 1011011 → S0→S1→S10→S101*→S1→S10→S101*→S1 → found 2회(overlap 덕분).
//   추가 검증: reset 중 found 가 절대 1 이 되지 않아야 함.
// =============================================================================
`timescale 1ns/1ps

module tb_seq_detect;

  reg  clk = 1'b0, rst, din;
  wire found;
  integer errors  = 0;
  integer pulses  = 0;

  localparam [6:0] STREAM   = 7'b1011011;   // MSB-first 로 din 에 인가
  localparam       LEN      = 7;
  localparam       EXP_HITS = 2;            // overlap 허용 시 2회

  integer i;

  seq_detect dut (.clk(clk), .rst(rst), .din(din), .found(found));

  always #5 clk = ~clk;               // 100MHz

  // reset 중 found 는 항상 0 이어야 함
  always @(posedge clk)
    if (rst && found !== 1'b0) begin
      errors = errors + 1;
      $error("found HIGH during reset t=%0t", $time);
    end

  // found 펄스 집계 (rst 해제 구간만)
  always @(posedge clk)
    if (!rst && found) pulses = pulses + 1;

  initial begin
    rst = 1; din = 0;
    repeat (3) @(posedge clk);        // reset 중 found 0 확인 구간
    rst = 0;

    // MSB-first 직렬 인가 — din 을 negedge 에 세팅, posedge 에서 샘플
    for (i = LEN-1; i >= 0; i = i - 1) begin
      @(negedge clk); din = STREAM[i];
      @(posedge clk);
    end
    @(negedge clk); din = 0;
    repeat (2) @(posedge clk);        // 마지막 천이의 found 반영 여유

    if (pulses !== EXP_HITS) begin
      errors = errors + 1;
      $error("PULSE COUNT MISMATCH got=%0d exp=%0d", pulses, EXP_HITS);
    end else
      $display(" found pulses = %0d (exp %0d)", pulses, EXP_HITS);

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule
