// =============================================================================
// warn_counter.v ― WARN 상태 지속 카운터 (동기 순차 로직)
//   trip_top 의 서브모듈 #2 ― statement/branch 커버리지 예시 소재.
//   trip_fsm 이 WARN 상태에 머무는 동안(en=1)만 카운트, WARN_LIMIT 도달 시 hit.
//
//   의도된 홀(base TB, sensor=3'b111 고정 인가 기준) :
//   [HOLE] clr 분기 ― trip_fsm 이 WARN 회복 때만 clr 를 올리므로 base TB 는 미도달.
// =============================================================================
module warn_counter #(
    parameter integer WARN_LIMIT = 3
)(
    input  wire       clk,
    input  wire       rst,     // synchronous, active-high
    input  wire       en,      // trip_fsm 이 WARN 상태일 때만 1
    input  wire       clr,     // trip_fsm 강제 리셋(WARN 회복 · LATCH 해제)
    output reg         hit,     // cnt 가 WARN_LIMIT 도달
    output reg  [1:0]  cnt
);

    always @(posedge clk) begin
        if (rst || clr) begin
            cnt <= 2'd0;
            hit <= 1'b0;
        end else if (en) begin
            if (cnt >= WARN_LIMIT[1:0]) begin
                hit <= 1'b1;                 // 기본 TB 로 도달
            end else begin
                cnt <= cnt + 2'd1;            // 기본 TB 로 도달
                hit <= 1'b0;
            end
        end
    end

endmodule
