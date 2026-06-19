'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY12 = '#177E89';

const code = `module uart_tx (
  input  wire       clk, rst,
  input  wire       tick,        // baud 1× tick
  input  wire       start,       // 전송 요청 (1-clk)
  input  wire [7:0] data,
  output reg        tx,          // 직렬 출력 (idle=1)
  output reg        busy
);
  localparam IDLE=2'd0, START=2'd1, DATA=2'd2, STOP=2'd3;
  reg [1:0] state;
  reg [2:0] idx;
  reg [7:0] sh;

  always @(posedge clk)
    if (rst) begin state<=IDLE; tx<=1'b1; busy<=1'b0; end
    else case (state)
      IDLE:  begin tx<=1'b1; busy<=1'b0;
               if (start) begin sh<=data; busy<=1'b1; state<=START; end end
      START: begin tx<=1'b0;                      // start bit
               if (tick) begin state<=DATA; idx<=0; end end
      DATA:  begin tx<=sh[0];                     // LSB first
               if (tick) begin sh<={1'b0, sh[7:1]};
                 if (idx==3'd7) state<=STOP; else idx<=idx+1'b1; end end
      STOP:  begin tx<=1'b1;                      // stop bit
               if (tick) state<=IDLE; end
    endcase
endmodule`;

export default function UartTxSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 1 · 오전 ① · UART TX"
          title="송신기 — FSM + shift register"
          subtitle="start→data→stop FSM이 baud tick마다 한 비트씩 출력 · 시프트로 LSB부터 전송"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY12}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY12, fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
              uart_tx.v
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.6rem', lineHeight: 1.4 }} />
          </div>

          {/* 우: 상태 흐름 + 파형 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY12}25`,
              borderTop: `3px solid ${DAY12}`, borderRadius: '10px',
              padding: '0.55rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>FSM 흐름</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {['IDLE', 'START', 'DATA×8', 'STOP'].map((s, i, arr) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 800, color: DAY12,
                      background: `${DAY12}12`, border: `1px solid ${DAY12}30`,
                      padding: '4px 8px', borderRadius: '6px', fontFamily: '"JetBrains Mono", monospace',
                    }}>{s}</span>
                    {i < arr.length - 1 && <span style={{ color: FPGA.textLight, fontSize: '0.7rem' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.55rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.25rem' }}>tx 출력 (0xA5 = 1010_0101)</div>
              <svg width="100%" height="56" viewBox="0 0 320 56">
                {/* idle high, start low, D0..D7 LSB first =1,0,1,0,0,1,0,1, stop high */}
                {(() => {
                  const bits = [1, 0, /*start*/ 1, 0, 1, 0, 0, 1, 0, 1, /*stop*/ 1];
                  // sequence: idle(1), start(0), D0..D7, stop(1)
                  const seq = [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1];
                  const w = 280 / seq.length;
                  let d = `M20 ${seq[0] ? 12 : 40}`;
                  let x = 20;
                  for (let i = 0; i < seq.length; i++) {
                    const y = seq[i] ? 12 : 40;
                    d += ` L${x} ${y} L${x + w} ${y}`;
                    x += w;
                  }
                  return <path d={d} stroke={DAY12} strokeWidth="2" fill="none" />;
                })()}
                <text x="20" y="54" fontSize="6.5" fill={FPGA.textLight} fontFamily='"JetBrains Mono", monospace'>idle</text>
                <text x="48" y="54" fontSize="6.5" fill={DAY12} fontFamily='"JetBrains Mono", monospace'>start</text>
                <text x="120" y="54" fontSize="6.5" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>D0→D7 (LSB)</text>
                <text x="278" y="54" fontSize="6.5" fill="#48BB78" fontFamily='"JetBrains Mono", monospace'>stop</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY12}08, ${DAY12}15)`,
              border: `1px solid ${DAY12}30`, borderRadius: '8px', padding: '0.45rem 0.8rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: DAY12 }}>포인트 · </span>
              <span style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.45 }}>
                <code>busy</code>로 전송 중 재요청 차단. idle에서 tx=1 유지가 다음 start 검출 기준.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
