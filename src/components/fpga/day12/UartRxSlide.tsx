'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY12 = '#177E89';

const code = `module uart_rx (
  input  wire       clk, rst,
  input  wire       tick16,     // 16× baud tick
  input  wire       rx_in,      // 직렬 입력 (raw)
  output reg  [7:0] data,
  output reg        valid
);
  reg s0, s1;                    // 2FF 동기화 (비동기 입력)
  always @(posedge clk) {s1, s0} <= {s0, rx_in};
  wire rx = s1;

  localparam IDLE=2'd0, START=2'd1, DATA=2'd2, STOP=2'd3;
  reg [1:0] state;  reg [3:0] os;  reg [2:0] idx;  reg [7:0] sh;

  always @(posedge clk) begin
    valid <= 1'b0;
    if (rst) begin state<=IDLE; os<=0; end
    else if (tick16) case (state)
      IDLE:  if (!rx) begin state<=START; os<=0; end        // start 하강
      START: if (os==4'd7) begin os<=0; state<=DATA; idx<=0; end // 중앙 확인
             else os<=os+1'b1;
      DATA:  if (os==4'd15) begin os<=0; sh<={rx, sh[7:1]};  // 비트 중앙 샘플
               if (idx==3'd7) state<=STOP; else idx<=idx+1'b1; end
             else os<=os+1'b1;
      STOP:  if (os==4'd15) begin data<=sh; valid<=1'b1; state<=IDLE; end
             else os<=os+1'b1;
    endcase
  end
endmodule`;

export default function UartRxSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 2 · 오전 ② · UART RX"
          title="수신기 — start 검출 + 비트 중앙 샘플"
          subtitle="16× oversample로 start 하강엣지 검출 후 각 비트 중앙에서 샘플 · 입력은 2FF 동기화"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.5rem 0.85rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY12}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY12, fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '0.05em' }}>
              uart_rx.v
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.58rem', lineHeight: 1.38 }} />
          </div>

          {/* 우: 샘플 포인트 그림 + CDC */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY12}25`,
              borderTop: `3px solid ${DAY12}`, borderRadius: '10px',
              padding: '0.6rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>중앙 샘플 타이밍</div>
              <svg width="100%" height="80" viewBox="0 0 320 80">
                {/* rx line */}
                <path d="M10 24 H50 V44 H110 V24 V44 H170 V24 H300" stroke={DAY12} strokeWidth="2" fill="none" />
                <text x="14" y="18" fontSize="7" fill="#E53E3E" fontFamily='"JetBrains Mono", monospace'>idle</text>
                <text x="62" y="58" fontSize="7" fill={DAY12} fontFamily='"JetBrains Mono", monospace'>start</text>
                {/* sample markers at mid */}
                {[80, 140, 200].map((x) => (
                  <g key={x}>
                    <line x1={x} y1="10" x2={x} y2="50" stroke="#E8913A" strokeWidth="1" strokeDasharray="3 2" />
                    <circle cx={x} cy={x === 80 ? 44 : 34} r="3" fill="#E8913A" />
                  </g>
                ))}
                <text x="120" y="72" fontSize="7" fill="#E8913A" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>os=8(start), os=15(data) 중앙</text>
              </svg>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))',
              border: '1px solid rgba(229,62,62,0.30)', borderLeft: '4px solid #E53E3E',
              borderRadius: '10px', padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E53E3E', marginBottom: '0.2rem' }}>
                CDC 필수 — rx 2FF 동기화
              </div>
              <div style={{ fontSize: '0.65rem', color: FPGA.text, lineHeight: 1.55 }}>
                rx_in은 수신 clk와 무관한 비동기 신호. <code>s0/s1</code> 2FF 없이 바로 샘플하면 메타안정 → 프레임 깨짐. Day 07~08 CDC 규칙 그대로 적용.
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY12}08, ${DAY12}15)`,
              border: `1px solid ${DAY12}30`, borderRadius: '8px', padding: '0.45rem 0.8rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: DAY12 }}>출력 · </span>
              <span style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.45 }}>
                STOP에서 <code>valid</code> 1-clk 펄스 + <code>data</code> 확정. 상위 로직은 valid로 수신 인지.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
