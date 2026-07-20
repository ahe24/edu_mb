// =============================================================================
// tb_trip_boost.sv ― 실습2(cov_hole) 보강 Testbench
//   기본 TB 가 남긴 홀을 자극 보강으로 메운다. 교육생 구현 대상은 boost_scenario 태스크.
//
//   [제공]  clk/reset 하네스 · drive 유틸(step/hold) · 자기검사 · report
//   [구현]  boost_scenario ― 아래 4가지 미도달 시나리오를 추가 자극:
//            (1) en=0 구간        → en 분기 false 도달
//            (2) 일시 초과 회복    → WARN→MONITOR 천이 (if(!vote) true)
//            (3) sensor 조합 다양  → vote 곱항 condition/expression 보강
//            (4) LATCH 에서 clear → LATCH→MONITOR 천이 (if(clear) true)
//   → default(도달불가) 만 홀로 남는다 → 실습4(cov_closure)에서 제외 처리.
// =============================================================================
`timescale 1ns/1ps

module tb_trip_boost;

    localparam integer WARN_LIMIT = 3;

    reg        clk = 1'b0;
    reg        rst, en, clear;
    reg  [2:0] sensor;
    wire       trip;
    wire [1:0] state;

    integer    errors = 0;

    trip_ctrl #(.WARN_LIMIT(WARN_LIMIT)) dut (
        .clk(clk), .rst(rst), .en(en), .sensor(sensor),
        .clear(clear), .trip(trip), .state(state)
    );

    always #5 clk = ~clk;

    // -------- drive 유틸 [제공] --------
    task hold(input [2:0] s, input integer n);      // sensor 를 n 클럭 유지
        integer k;
        begin sensor = s; for (k=0;k<n;k=k+1) @(posedge clk); end
    endtask

    task do_reset;
        begin rst=1'b1; en=1'b1; clear=1'b0; sensor=3'b000;
              repeat (2) @(posedge clk); rst=1'b0; end
    endtask

    // -------- 교육생 구현 : 미도달 홀 보강 자극 --------
    task boost_scenario;
        begin
            // (1) en=0 구간 ― enable 분기 false 를 도달
            en = 1'b0;
            hold(3'b111, 3);
            en = 1'b1;

            // (2) 일시 초과 회복 ― WARN 진입 후 vote 제거 → WARN→MONITOR
            hold(3'b110, 2);        // 2oo3 성립 → WARN
            hold(3'b000, 3);        // vote 소멸 → 회복

            // (3) sensor 조합 다양화 ― vote 곱항 condition/expression 보강
            hold(3'b100, 1);        // 단일 센서(투표 미성립)
            hold(3'b010, 1);
            hold(3'b001, 1);
            hold(3'b011, 1);        // b&c 곱항
            hold(3'b101, 1);        // a&c 곱항
            hold(3'b000, 1);

            // (4) TRIP→LATCH 도달 후 clear ― LATCH→MONITOR 천이
            hold(3'b111, WARN_LIMIT + 4);   // 지속 초과 → LATCH
            check(state === 2'd3, "LATCH 도달 확인");
            clear = 1'b1; @(posedge clk);
            clear = 1'b0; @(posedge clk);
            check(state === 2'd0, "clear 로 MONITOR 회복");
        end
    endtask

    // -------- 시나리오 --------
    initial begin
        do_reset;
        boost_scenario;
        report;
        $finish;
    end

    // -------- 자기검사 유틸 [제공] --------
    task check(input cond, input [50*8:1] msg);
        begin if (!cond) begin errors=errors+1; $error("%0s", msg); end end
    endtask

    task report;
        begin
            if (errors == 0) $display(" RESULT: PASS  (보강 자극 정상 ― make report 로 커버리지 상승 확인)");
            else             $display(" RESULT: FAIL  (%0d error)", errors);
        end
    endtask

endmodule
