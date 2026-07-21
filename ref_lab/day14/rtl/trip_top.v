// =============================================================================
// trip_top.v ― Safety-critical 트립 컨트롤러 top (2oo3 다수결 + WARN 카운터 + FSM)
//   Day14 코드 커버리지 실습의 공용 DUT. 3개 서브모듈을 구조적으로 연결만 하는
//   순수 top ― 자체 로직(always/case) 없음 → 커버리지 계측 대상은 서브모듈 3개.
//
//     vote2oo3    ― 2oo3 다수결 (condition/expression 커버리지)
//     warn_counter ― WARN 지속 카운터 (statement/branch 커버리지)
//     trip_fsm     ― 상태 제어 (branch/FSM 커버리지, UNREACH default 포함)
// =============================================================================
module trip_top #(
    parameter integer WARN_LIMIT = 3
)(
    input  wire       clk,
    input  wire       rst,                  // synchronous, active-high
    input  wire       en,                   // 채널 enable (0 이면 상태 동결)
    input  wire [2:0] sensor,               // 3중 redundant 초과-임계 플래그 {c,b,a}
    input  wire       clear,                // LATCH 해제 명령
    output wire        trip,                 // 트립 작동 신호
    output wire [1:0]  state                 // 상태 레지스터
);

    wire       vote;
    wire       cnt_en, cnt_clr, cnt_hit;

    vote2oo3 u_vote (
        .sensor (sensor),
        .vote   (vote)
    );

    warn_counter #(.WARN_LIMIT(WARN_LIMIT)) u_cnt (
        .clk (clk),
        .rst (rst),
        .en  (cnt_en),
        .clr (cnt_clr),
        .hit (cnt_hit),
        .cnt ()
    );

    trip_fsm #(.WARN_LIMIT(WARN_LIMIT)) u_fsm (
        .clk     (clk),
        .rst     (rst),
        .en      (en),
        .vote    (vote),
        .clear   (clear),
        .trip    (trip),
        .state   (state),
        .cnt_en  (cnt_en),
        .cnt_clr (cnt_clr),
        .cnt_hit (cnt_hit)
    );

endmodule
