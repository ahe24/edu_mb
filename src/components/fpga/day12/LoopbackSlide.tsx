'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY12 = '#177E89';

const code = `module uart_loop (
  input  wire clk, rst,
  input  wire rx_pin,           // FT2232 → FPGA
  output wire tx_pin            // FPGA → FT2232
);
  wire tick, tick16, valid;
  wire [7:0] rdata;

  baud_gen #(.BAUD(115200))    u_b1 (.clk,.rst,.tick(tick));
  baud_gen #(.BAUD(115200*16)) u_b16(.clk,.rst,.tick(tick16));

  // 수신
  uart_rx u_rx (.clk,.rst,.tick16,.rx_in(rx_pin),
                .data(rdata), .valid(valid));
  // 받은 바이트를 그대로 재전송 (echo)
  uart_tx u_tx (.clk,.rst,.tick,.start(valid),.data(rdata),
                .tx(tx_pin), .busy());
endmodule`;

export default function LoopbackSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 3 · 오후 ① · 루프백"
          title="TX + RX 통합 — echo 루프백"
          subtitle="RX valid를 TX start로 연결 · 수신 바이트를 즉시 재전송 · Arty USB-UART로 확인"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.6rem 0.85rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY12}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY12, fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
              uart_loop.v
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.62rem', lineHeight: 1.45 }} />
          </div>

          {/* 우: 통합 블록도 + 보드 연결 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY12}25`,
              borderTop: `3px solid ${DAY12}`, borderRadius: '10px',
              padding: '0.5rem', boxShadow: shadow.card,
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="100%" height="100%" viewBox="0 0 300 150" style={{ maxHeight: '150px' }}>
                {/* PC */}
                <rect x="8" y="58" width="50" height="34" rx="5" fill="rgba(74,111,165,0.10)" stroke="#4A6FA5" strokeWidth="1.5" />
                <text x="33" y="79" fontSize="8" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>PC term</text>
                {/* FT2232 */}
                <rect x="86" y="58" width="46" height="34" rx="5" fill="rgba(113,128,150,0.10)" stroke="#718096" strokeWidth="1.5" />
                <text x="109" y="79" fontSize="7.5" fontWeight="700" fill="#718096" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>FT2232</text>
                {/* RX block */}
                <rect x="166" y="20" width="56" height="32" rx="5" fill="rgba(74,111,165,0.12)" stroke="#4A6FA5" strokeWidth="1.5" />
                <text x="194" y="40" fontSize="8.5" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>uart_rx</text>
                {/* TX block */}
                <rect x="166" y="98" width="56" height="32" rx="5" fill={`${DAY12}15`} stroke={DAY12} strokeWidth="1.5" />
                <text x="194" y="118" fontSize="8.5" fontWeight="800" fill={DAY12} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>uart_tx</text>
                {/* arrows */}
                <path d="M58 75 H86" stroke="#4A6FA5" strokeWidth="1.4" />
                <path d="M132 70 L166 40" stroke="#4A6FA5" strokeWidth="1.4" markerEnd="url(#l12)" /><text x="148" y="50" fontSize="6.5" fill="#4A6FA5">rx_pin</text>
                <path d="M222 36 H252 V114 H222" fill="none" stroke="#E8913A" strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#l12)" />
                <text x="256" y="78" fontSize="6.5" fill="#E8913A" fontFamily='"JetBrains Mono", monospace'>valid→start</text>
                <path d="M166 114 L132 84" stroke={DAY12} strokeWidth="1.4" markerEnd="url(#l12)" /><text x="140" y="108" fontSize="6.5" fill={DAY12}>tx_pin</text>
                <defs><marker id="l12" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={FPGA.textLight} /></marker></defs>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY12}08, ${DAY12}15)`,
              border: `1px solid ${DAY12}30`, borderRadius: '9px',
              padding: '0.5rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: DAY12, marginBottom: '0.15rem' }}>확인 방법</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.55 }}>
                <li>PC 터미널에서 문자 입력 → 동일 문자 echo 수신</li>
                <li>시뮬: rx_pin에 frame 주입 → tx_pin에 동일 frame 출력</li>
                <li>valid→start 1-clk 타이밍 정합 확인</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
