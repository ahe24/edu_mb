// =============================================================================
// Day 13 ― sva_uart_tx_int.sv                                     [제공 코드]
// uart_tx 내부 관찰 SVA checker ― bind 로 DUT 인스턴스 '안'에 결합.
//   포트 checker(sva_uart_tx)가 못 보는 내부 state 기반 속성 검사.
//   ※ Moore 등록 출력은 상태보다 1클럭 늦다 → $past(state) 로 정렬:
//     tx(지금) = f(state 1클럭 전). 등록 출력 FSM 의 SVA 작성 핵심 포인트.
// =============================================================================
module sva_uart_tx_int #(
  parameter integer BIT_CLK = 16
)(
  input wire       clk, rst, tick, start, busy, tx,
  input wire [1:0] state,             // bind 덕에 내부 reg 직접 관찰
  input wire [2:0] idx
);
  localparam [1:0] S_IDLE = 2'd0, S_START = 2'd1, S_DATA = 2'd2, S_STOP = 2'd3;

  integer sva_err = 0;

  // ── P5. start bit 구동 ― 직전 클럭 상태가 START 였다면 지금 tx==0
  property p_start_bit;
    @(posedge clk) disable iff (rst)
      ($past(state) == S_START) |-> !tx;
  endproperty
  A_STARTBIT: assert property (p_start_bit)
    else begin sva_err = sva_err + 1; $error("A_STARTBIT: START 인데 tx!=0"); end

  // ── P6. stop bit 구동 ― 직전 클럭 상태가 STOP 이었다면 지금 tx==1
  property p_stop_bit;
    @(posedge clk) disable iff (rst)
      ($past(state) == S_STOP) |-> tx;
  endproperty
  A_STOPBIT: assert property (p_stop_bit)
    else begin sva_err = sva_err + 1; $error("A_STOPBIT: STOP 인데 tx!=1"); end

  // ── P7. 천이 합법성 ― IDLE→START→DATA→STOP→IDLE 링 외 천이 금지
  property p_legal_trans;
    @(posedge clk) disable iff (rst)
      !$stable(state) |->
        ($past(state) == S_IDLE  && state == S_START) ||
        ($past(state) == S_START && state == S_DATA ) ||
        ($past(state) == S_DATA  && state == S_STOP ) ||
        ($past(state) == S_STOP  && state == S_IDLE );
  endproperty
  A_TRANS: assert property (p_legal_trans)
    else begin sva_err = sva_err + 1;
      $error("A_TRANS: 불법 천이 %0d→%0d", $past(state), state); end

  // ── C2. STOP 상태 도달 확인 ― 프레임이 끝까지 진행됐는가
  C_STOP: cover property (@(posedge clk) disable iff (rst) state == S_STOP);

  // 시뮬 종료 시 SVA 요약 ― TB(RESULT)와 별도 판정 라인
  final begin
    if (sva_err == 0) $display(" SVA(bind): 0 violation");
    else              $display(" SVA(bind): %0d violation", sva_err);
  end
endmodule
