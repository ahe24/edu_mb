// =============================================================================
// Day 05 ― tb_blk_nb_demo.sv
// _bad / _good 모듈을 동일 stimulus 로 병렬 구동, Visualizer 파형으로 비교.
// =============================================================================
`timescale 1ns/1ps

module tb_blk_nb_demo;

  // --- Clock / global stimulus ---
  logic clk = 1'b0;
  always #5 clk = ~clk;            // 100 MHz

  logic        d  = 1'b0;
  logic [3:0]  a  = 4'h0;
  logic [3:0]  b  = 4'h0;

  // --- DUT 인스턴스 (P1) -----------------------------------------------------
  logic q1_bad,  q2_bad;
  logic q1_good, q2_good;
  pipe2_bad  u_pipe_bad  (.clk(clk), .d(d), .q1(q1_bad),  .q2(q2_bad));
  pipe2_good u_pipe_good (.clk(clk), .d(d), .q1(q1_good), .q2(q2_good));

  // --- P2 (CP15) ― sim demo 미포함 (race 가 sim scheduling 의존) -------------

  // --- DUT 인스턴스 (P4) -----------------------------------------------------
  logic [4:0] tmp_bad,  out_bad;
  logic [4:0] tmp_good, out_good;
  mac_bad  u_mac_bad  (.clk(clk), .a(a), .b(b), .tmp(tmp_bad),  .out(out_bad));
  mac_good u_mac_good (.clk(clk), .a(a), .b(b), .tmp(tmp_good), .out(out_good));

  // --- Stimulus -------------------------------------------------------------
  initial begin
    $display("============================================================");
    $display(" Day05 Blocking / Non-Blocking mismatch sim demo");
    $display(" t(ns) | d | q2_bad q2_good | mac_bad mac_good ");
    $display("------------------------------------------------------------");

    // P1 펄스 시퀀스 ― q2 latency 비교 (bad: 0, good: 2 cycle)
    @(negedge clk); d = 1'b1;
    @(negedge clk); d = 1'b0;
    @(negedge clk); d = 1'b1;
    @(negedge clk); d = 1'b0;
    @(negedge clk); d = 1'b1;
    @(negedge clk); d = 1'b0;

    // P4 MAC 입력 변경 ― out latency 비교 (bad: 1, good: 2 cycle)
    @(negedge clk); a = 4'h3; b = 4'h5;
    @(negedge clk); a = 4'h7; b = 4'h2;
    @(negedge clk); a = 4'h1; b = 4'h1;
    @(negedge clk); a = 4'hA; b = 4'h6;
    @(negedge clk);
    @(negedge clk);
    @(negedge clk);
    $display("============================================================");
    $display("Done.");
    $finish;
  end

  // --- 콘솔 모니터 ----------------------------------------------------------
  initial begin
    $monitor("%5t |  %b |   %b      %b    |   %2d      %2d",
             $time, d, q2_bad, q2_good, out_bad, out_good);
  end

endmodule
