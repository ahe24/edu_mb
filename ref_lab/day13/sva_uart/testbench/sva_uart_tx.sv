// =============================================================================
// Day 13 ― sva_uart_tx.sv                                        [구현 대상]
// uart_tx 프로토콜 SVA checker ― 포트 관찰 전용(DUT 내부 접근 없음).
//   concurrent assertion 4개 + cover 1개. 위반 시 $error + sva_err 집계.
//   disable iff (rst) 로 리셋 구간 평가 제외.
//   ※ start→busy 지연: start 는 pend 로 래치 후 다음 tick 경계에서 수락
//     → 최악 BIT_CLK+1 클럭 이내 busy 상승 (bounded response).
// =============================================================================
module sva_uart_tx #(
  parameter integer BIT_CLK = 16      // 1비트 = BIT_CLK 클럭 (tick 주기)
)(
  input wire clk, rst,
  input wire start, busy, tx
);
  integer sva_err = 0;

  // ── P1. 요청 수락 ― idle 중 start 요청은 BIT_CLK+1 클럭 이내 busy 상승
  property p_start_accept;
    @(posedge clk) disable iff (rst)
      (start && !busy) |-> ##[1:BIT_CLK+1] busy;
  endproperty
  A_START: assert property (p_start_accept)
    else begin sva_err = sva_err + 1; $error("A_START: start 후 busy 미상승"); end

  // ── P2. idle 라인 레벨 ― 전송 중이 아니면 tx 는 항상 1
  property p_idle_high;
    @(posedge clk) disable iff (rst) !busy |-> tx;
  endproperty
  A_IDLE: assert property (p_idle_high)
    else begin sva_err = sva_err + 1; $error("A_IDLE: idle 인데 tx==0"); end

  // ── P3. 전송 시작 정합 ― tx 하강(start bit)은 반드시 busy 와 동반
  property p_fell_busy;
    @(posedge clk) disable iff (rst) $fell(tx) |-> busy;
  endproperty
  A_FELL: assert property (p_fell_busy)
    else begin sva_err = sva_err + 1; $error("A_FELL: busy 없이 tx 하강"); end

  // ── P4. busy 상승 시점 ― busy 가 서는 클럭엔 start bit(tx==0) 구동
  property p_rose_startbit;
    @(posedge clk) disable iff (rst) $rose(busy) |-> !tx;
  endproperty
  A_ROSE: assert property (p_rose_startbit)
    else begin sva_err = sva_err + 1; $error("A_ROSE: busy 상승인데 tx!=0"); end

  // ── C1. 관심 이벤트 발생 확인 ― 전송 요청이 실제로 일어났는가 (Day14 커버리지 예고)
  C_REQ: cover property (@(posedge clk) disable iff (rst) start && !busy);

  // 시뮬 종료 시 SVA 요약 (RESULT 판정은 TB 몫)
  final begin
    if (sva_err == 0) $display(" SVA: 0 violation");
    else              $display(" SVA: %0d violation", sva_err);
  end
endmodule
