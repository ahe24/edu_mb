// =============================================================================
// Day 13 ― bind_uart_tx.sv                                       [구현 대상]
// bind ― RTL 파일 무수정으로 checker 를 결합.
//   'uart_tx 라는 모듈의 모든 인스턴스' 내부에 sva_uart_tx_int 를 삽입.
//   포트 연결명(clk, state, idx ...)은 uart_tx 스코프에서 해석되므로
//   내부 reg 도 이름 그대로 접근 ― 검증 대상 형상(RTL) 변경 없음.
//   elaboration 시 top 에 함께 지정: vopt <tb_top> bind_uart_tx -o opt
// =============================================================================
module bind_uart_tx;

  bind uart_tx sva_uart_tx_int #(.BIT_CLK(16)) u_sva (
    .clk   (clk),
    .rst   (rst),
    .tick  (tick),
    .start (start),
    .busy  (busy),
    .tx    (tx),
    .state (state),     // 내부 reg ― bind 라서 접근 가능
    .idx   (idx)
  );

endmodule
