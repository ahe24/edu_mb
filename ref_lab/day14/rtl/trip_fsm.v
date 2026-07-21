// =============================================================================
// trip_fsm.v ― 트립 상태 제어 FSM (MONITOR → WARN → TRIP_S → LATCH)
//   trip_top 의 서브모듈 #3 ― branch/FSM 커버리지 예시 소재.
//   warn_counter 를 제어(cnt_en/cnt_clr)하고, cnt_hit 로 TRIP_S 진입을 판단.
//
//   reset : 동기 active-high (FPGA 권장 관행)
//   의도된 홀(base TB, en=1·sensor=3'b111 고정·clear 미인가 기준) :
//   [HOLE]    else if(en) 의 false(en=0) 분기 미도달
//   [HOLE]    WARN 의 if(!vote) 회복 분기 미도달
//   [HOLE]    LATCH 의 if(clear) 분기 미도달
//   [UNREACH] default ― state 2비트 전수 열거(0~3)라 원천 도달불가(방어적 코딩)
// =============================================================================
module trip_fsm #(
    parameter integer WARN_LIMIT = 3
)(
    input  wire       clk,
    input  wire       rst,        // synchronous, active-high
    input  wire       en,         // 채널 enable (0 이면 상태 동결)
    input  wire       vote,       // vote2oo3 출력
    input  wire       clear,      // LATCH 해제 명령
    output reg        trip,       // 트립 작동(fail-safe 유지)
    output reg  [1:0] state,      // 상태 레지스터
    output reg        cnt_en,     // warn_counter 활성 (WARN 동안만 1)
    output reg        cnt_clr,    // warn_counter 강제 리셋 펄스
    input  wire        cnt_hit     // warn_counter 가 WARN_LIMIT 도달
);

    localparam [1:0] MONITOR = 2'd0,
                     WARN    = 2'd1,
                     TRIP_S  = 2'd2,
                     LATCH   = 2'd3;

    always @(posedge clk) begin
        if (rst) begin
            state   <= MONITOR;
            trip    <= 1'b0;
            cnt_en  <= 1'b0;
            cnt_clr <= 1'b0;
        end else if (en) begin              // [HOLE] en==0 분기 ― 실습2 자극 미도달
            cnt_clr <= 1'b0;
            case (state)
                MONITOR: begin
                    trip   <= 1'b0;
                    cnt_en <= 1'b0;
                    if (vote) begin
                        state  <= WARN;
                        cnt_en <= 1'b1;
                    end
                end
                WARN: begin
                    if (!vote) begin
                        state   <= MONITOR;      // [HOLE] 일시 초과 회복 ― 실습2 자극 미도달
                        cnt_en  <= 1'b0;
                        cnt_clr <= 1'b1;
                    end else if (cnt_hit) begin
                        state  <= TRIP_S;        // trip 발동
                        cnt_en <= 1'b0;
                    end
                end
                TRIP_S: begin
                    trip  <= 1'b1;
                    state <= LATCH;              // trip 을 latch
                end
                LATCH: begin
                    trip <= 1'b1;                 // fail-safe 유지
                    if (clear) begin
                        state   <= MONITOR;        // [HOLE] clear 해제 ― 실습2 자극 미도달
                        cnt_clr <= 1'b1;
                    end
                end
                default: state <= MONITOR;         // [UNREACH] 원천 도달불가 ― 실습4 제외 대상
            endcase
        end
    end

endmodule
