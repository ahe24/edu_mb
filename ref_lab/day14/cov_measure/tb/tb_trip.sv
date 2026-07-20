// =============================================================================
// tb_trip.sv ― 실습1(cov_measure) 기본 Testbench [제공]
//   목적 : 최소 자극으로 trip_ctrl 을 돌려 "PASS 인데 커버리지는 낮다"를 관찰.
//   자극 : en=1 고정, sensor=3'b111 지속 인가 → WARN 누적 → TRIP → LATCH.
//   약점 : clear 없음, en=0 없음, 일시 초과(transient) 없음, sensor 조합 단조.
//          → branch/condition/FSM 홀이 다수 남음 (실습2 에서 보강).
//   판정 : 기능은 정상(자기검사 PASS) ― 그래도 커버리지는 부족함을 대비시킴.
// =============================================================================
`timescale 1ns/1ps

module tb_trip;

    localparam integer WARN_LIMIT = 3;

    reg        clk = 1'b0;
    reg        rst, en, clear;
    reg  [2:0] sensor;
    wire       trip;
    wire [1:0] state;

    integer    errors = 0;

    // DUT
    trip_ctrl #(.WARN_LIMIT(WARN_LIMIT)) dut (
        .clk(clk), .rst(rst), .en(en), .sensor(sensor),
        .clear(clear), .trip(trip), .state(state)
    );

    always #5 clk = ~clk;                 // 100 MHz

    // -------- 자극 시나리오 --------
    initial begin
        rst = 1'b1; en = 1'b1; clear = 1'b0; sensor = 3'b000;
        repeat (2) @(posedge clk);
        rst = 1'b0;

        // 지속 초과 ― 2oo3 성립하는 111 을 계속 인가
        sensor = 3'b111;
        repeat (WARN_LIMIT + 6) @(posedge clk);

        // trip 이 작동해 LATCH 로 굳었는지 확인
        check(trip === 1'b1,           "trip 이 지속 초과 후 작동해야 한다");
        check(state === 2'd3 /*LATCH*/,"LATCH 상태로 굳어야 한다");

        report;
        $finish;
    end

    // -------- 자기검사 유틸 --------
    task check(input cond, input [50*8:1] msg);
        begin
            if (!cond) begin
                errors = errors + 1;
                $error("%0s", msg);
            end
        end
    endtask

    task report;
        begin
            if (errors == 0) $display(" RESULT: PASS  (기능 정상 ― 커버리지는 report 로 확인)");
            else             $display(" RESULT: FAIL  (%0d error)", errors);
        end
    endtask

endmodule
