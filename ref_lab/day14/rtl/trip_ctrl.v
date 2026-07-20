// =============================================================================
// trip_ctrl.v ― Safety-critical 트립 컨트롤러 (2-out-of-3 센서 투표 + FSM)
//   Day14 코드 커버리지 실습 공용 DUT ― 자체 완결(이전 Day 실습 의존 없음)
//
//   3중 redundant 센서를 2oo3 다수결로 투표 → 지속되면 TRIP 작동 → LATCH 로 유지.
//   커버리지 모든 유형(statement/branch/condition/FSM/toggle)을 한 모듈에서
//   관찰하도록 구문을 의도적으로 다양하게 배치.
//
//   reset : 동기 active-high (FPGA 내부 권장 방식)
//   설계상 홀(hole) : 아래 주석 [HOLE] ― 약한 자극에선 미도달, [UNREACH] ― 원천 도달불가
// =============================================================================
module trip_ctrl #(
    parameter integer WARN_LIMIT = 3        // 연속 vote 지속 회수 → TRIP
)(
    input  wire       clk,
    input  wire       rst,                  // synchronous, active-high
    input  wire       en,                   // 채널 enable (0 이면 상태 유지)
    input  wire [2:0] sensor,               // 3중 초과-임계 플래그 {c,b,a}
    input  wire       clear,                // LATCH 에서 운전원 수동 해제
    output reg        trip,                 // trip 작동 신호
    output reg  [1:0] state                 // 관측 가능한 현재 상태
);

    localparam [1:0] MONITOR = 2'd0,
                     WARN    = 2'd1,
                     TRIP_S  = 2'd2,
                     LATCH   = 2'd3;

    // 2-out-of-3 다수결 ― 3개 곱항의 OR (condition/expression 커버리지 소재)
    wire vote = (sensor[0] & sensor[1]) |
                (sensor[1] & sensor[2]) |
                (sensor[0] & sensor[2]);

    reg [1:0] cnt;                          // 연속 vote 카운트

    always @(posedge clk) begin
        if (rst) begin
            state <= MONITOR;
            trip  <= 1'b0;
            cnt   <= 2'd0;
        end else if (en) begin              // [HOLE] en==0 분기는 약한 TB 에서 미도달
            case (state)
                MONITOR: begin
                    trip <= 1'b0;
                    if (vote) begin
                        state <= WARN;
                        cnt   <= 2'd1;
                    end
                end
                WARN: begin
                    if (!vote) begin
                        state <= MONITOR;           // [HOLE] 일시 초과 회복 ― 지속 자극만 주면 미도달
                        cnt   <= 2'd0;
                    end else if (cnt >= WARN_LIMIT[1:0]) begin
                        state <= TRIP_S;            // 지속 → 작동
                    end else begin
                        cnt <= cnt + 2'd1;
                    end
                end
                TRIP_S: begin
                    trip  <= 1'b1;
                    state <= LATCH;                // trip 을 latch
                end
                LATCH: begin
                    trip <= 1'b1;                  // fail-safe 유지
                    if (clear)
                        state <= MONITOR;          // [HOLE] clear 미인가 시 미도달
                end
                default: state <= MONITOR;         // [UNREACH] 방어 코드 ― 2비트 전수라 원천 도달불가
            endcase
        end
    end

endmodule
