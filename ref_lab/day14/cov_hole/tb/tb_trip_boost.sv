// =============================================================================
// tb_trip_boost.sv ― 실습2(cov_hole) 보강 Testbench
//   기본 TB 가 남긴 홀을 자기 검사에서 메운다. 제공되는 것은 drive 유틸(hold)과
//   자기검사(check/report) 하네스, 5가지 미도달 시나리오를 boost_scenario 에 담는다.
//
//   [제공]  clk/reset 하네스 · drive 유틸(hold) · 자기검사 · report
//   [내용]  boost_scenario 의 5가지 미도달 시나리오로 추가 자극:
//            (1) en=0 구간         → trip_fsm en 분기 false 도달
//            (2) 일시 초과 회복     → trip_fsm WARN→MONITOR 천이 (if(!vote) true)
//            (3) sensor 조합 전수   → vote2oo3 expression 커버리지 보강
//            (4) LATCH 에서 clear  → trip_fsm LATCH→MONITOR 천이 (if(clear) true)
//            (5) TRIP_S 중 reset   → trip_fsm TRIP_S→MONITOR 천이(리셋 최우선 확인)
//   ※ default(도달불가) 홀은 그대로 남는다 → 실습4(cov_closure)에서 제외 처리.
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

    trip_top #(.WARN_LIMIT(WARN_LIMIT)) dut (
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

    // -------- 보강 시나리오 : 미도달 홀 겨냥 자극 --------
    task boost_scenario;
        begin
            // (1) en=0 구간 → enable 분기 false 로 도달
            en = 1'b0;
            hold(3'b111, 3);
            en = 1'b1;

            // (2) 일시 초과 회복 → WARN 진입 후 vote 소멸 → WARN→MONITOR
            hold(3'b110, 2);        // 2oo3 성립 → WARN
            hold(3'b000, 3);        // vote 소멸 → 회복

            // (3) sensor 조합 전수 → vote2oo3 곱항별 개별 기여 입증(expression 커버리지)
            hold(3'b000, 1); hold(3'b001, 1); hold(3'b010, 1); hold(3'b011, 1);
            hold(3'b100, 1); hold(3'b101, 1); hold(3'b110, 1); hold(3'b111, 1);
            hold(3'b000, 3);        // 카운터 원위치(회복 반영 여유)

            // (4) TRIP→LATCH 도달 후 clear → LATCH→MONITOR 천이
            hold(3'b111, WARN_LIMIT + 8);
            check(state === 2'd3, "LATCH 도달 확인");
            clear = 1'b1; @(posedge clk);
            clear = 1'b0; @(posedge clk);
            check(state === 2'd0, "clear 로 MONITOR 회복");

            // (5) TRIP_S 진입 순간 reset → 리셋이 최우선으로 강제되는지 확인
            sensor = 3'b111;
            @(posedge clk); #1;
            while (state !== 2'd2) begin @(posedge clk); #1; end   // TRIP_S 진입까지 대기(NBA 정착 후 샘플)
            rst = 1'b1; @(posedge clk);
            rst = 1'b0; @(posedge clk);
            check(state === 2'd0, "TRIP_S 중 reset 은 즉시 MONITOR 로 강제되어야 한다");
        end
    endtask

    // -------- 시나리오 실행 --------
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
            if (errors == 0) $display(" RESULT: PASS  (보강 자극 반영 ― make report 로 커버리지 상승 확인)");
            else             $display(" RESULT: FAIL  (%0d error)", errors);
        end
    endtask

endmodule
