// =============================================================================
// Day 13 ― uart_scoreboard.sv                                     [제공 코드]
// 역할: 판정 전담 ― 기대값 queue 와 monitor 복원값을 순서대로 비교.
//   push_exp(b)  : 자극 측(tb_top)이 기대 바이트 등록
//   got_valid    : monitor 복원 완료마다 pop·비교, errors 집계
//   report(nexp) : 최종 PASS/FAIL 판정 (개수·값·framing 모두 0 오류 = PASS)
// =============================================================================
module uart_scoreboard (
  input  wire       clk,
  input  wire [7:0] got,              // monitor 복원 바이트
  input  wire       got_valid,
  input  wire       frame_err
);
  reg [7:0] q [0:63];                 // 기대값 queue
  integer   wr = 0, rd = 0, errors = 0;

  // 기대 바이트 등록 (자극 주입 직전에 호출)
  task push_exp(input [7:0] b);
    begin q[wr] = b; wr = wr + 1; end
  endtask

  // monitor 보고마다 pop·비교
  always @(posedge clk) if (got_valid) begin
    if (frame_err) begin
      errors = errors + 1; $error("framing: STOP != 1 (got %h)", got);
    end
    if (rd >= wr) begin
      errors = errors + 1; $error("예상보다 많은 수신 (got %h)", got);
    end else begin
      if (got !== q[rd]) begin
        errors = errors + 1;
        $error("byte %0d: got %h exp %h", rd, got, q[rd]);
      end
      rd = rd + 1;
    end
  end

  // 최종 판정 ― 회귀(CI)는 이 한 줄로 성패 판독
  task report(input integer nexp);
    begin
      if (errors == 0 && rd == nexp)
        $display(" RESULT: PASS  (%0d bytes, 0 mismatch)", rd);
      else
        $display(" RESULT: FAIL  (%0d error, rd=%0d/%0d)", errors, rd, nexp);
    end
  endtask
endmodule
