// =============================================================================
// tb_trip_sel.sv ― 실습3(cov_merge) 회귀용 Testbench [제공]
//   하나의 TB 를 +TEST plusarg 로 3개 시나리오로 분기. 각 실행이 서로 다른 홀을
//   덮는다 → 개별 UCDB 는 부분 커버, 병합(vcover merge)하면 합집합으로 상승.
//
//   +TEST=trip     : 지속 초과 → WARN→TRIP→LATCH → clear  (트립·해제 경로)
//   +TEST=recover  : 일시 초과 → WARN→MONITOR              (회복 천이)
//   +TEST=idle     : en=0 구간 + 다양한 sensor (WARN_LIMIT 미도달, enable·condition 만)
//
//   요지 : 회귀는 "테스트마다 UCDB 하나", 최종 증거는 그 병합본 하나.
// =============================================================================
`timescale 1ns/1ps

module tb_trip_sel;

    localparam integer WARN_LIMIT = 3;

    reg        clk = 1'b0;
    reg        rst, en, clear;
    reg  [2:0] sensor;
    wire       trip;
    wire [1:0] state;
    reg [8*16:1] test;                    // 선택된 시나리오 이름

    trip_top #(.WARN_LIMIT(WARN_LIMIT)) dut (
        .clk(clk), .rst(rst), .en(en), .sensor(sensor),
        .clear(clear), .trip(trip), .state(state)
    );

    always #5 clk = ~clk;

    task hold(input [2:0] s, input integer n);
        integer k;
        begin sensor = s; for (k=0;k<n;k=k+1) @(posedge clk); end
    endtask

    initial begin
        rst=1'b1; en=1'b1; clear=1'b0; sensor=3'b000;
        repeat (2) @(posedge clk); rst=1'b0;

        if (!$value$plusargs("TEST=%s", test)) test = "trip";

        case (test)
            "trip": begin
                hold(3'b111, WARN_LIMIT + 8);                // 지속 → TRIP_S → LATCH
                clear=1'b1; @(posedge clk); clear=1'b0; @(posedge clk); // LATCH → MONITOR
            end
            "recover": begin
                hold(3'b110, 2);                             // WARN 진입
                hold(3'b000, 4);                             // 회복
            end
            "idle": begin
                en=1'b0; hold(3'b111, 3); en=1'b1;           // enable false (WARN_LIMIT 못 채움)
                hold(3'b100,1); hold(3'b010,1); hold(3'b001,1);
                hold(3'b011,1); hold(3'b101,1);              // condition 다양화 (짧게, TRIP_S 미도달)
                hold(3'b000, 2);                             // 카운터 원위치
            end
            default: begin
                hold(3'b111, WARN_LIMIT + 8);
                clear=1'b1; @(posedge clk); clear=1'b0; @(posedge clk);
            end
        endcase

        repeat (2) @(posedge clk);
        $display(" TEST=%0s 완료", test);
        $finish;
    end

endmodule
