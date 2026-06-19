'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY12 = '#177E89';

const code = `module baud_gen #(
  parameter integer CLK_HZ = 100_000_000,
  parameter integer BAUD   = 115200
)(
  input  wire clk,
  input  wire rst,
  output reg  tick               // baud rate 1-clk 펄스
);
  localparam integer DIV = CLK_HZ / BAUD;   // ≈ 868
  reg [$clog2(DIV)-1:0] cnt;
  always @(posedge clk)
    if (rst)             begin cnt <= 0; tick <= 1'b0; end
    else if (cnt==DIV-1) begin cnt <= 0; tick <= 1'b1; end
    else                 begin cnt <= cnt + 1'b1; tick <= 1'b0; end
endmodule`;

export default function BaudGenSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 2 · baud 생성"
          title="baud tick generator + 16× oversampling"
          subtitle="시스템 클럭을 분주해 비트 타이밍 생성 · RX는 16× 틱으로 비트 중앙 샘플"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.65rem 0.9rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY12}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY12, fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
              baud_gen.v
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.66rem', lineHeight: 1.5 }} />
          </div>

          {/* 우: 1x vs 16x + 설명 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY12}25`,
              borderTop: `3px solid ${DAY12}`, borderRadius: '10px',
              padding: '0.6rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>1× (TX) vs 16× (RX)</div>
              <svg width="100%" height="78" viewBox="0 0 320 78">
                {/* 1x */}
                <text x="2" y="16" fontSize="8" fontWeight="700" fill={DAY12} fontFamily='"JetBrains Mono", monospace'>1×</text>
                {[40, 130, 220].map((x) => <rect key={x} x={x} y="8" width="3" height="12" fill={DAY12} />)}
                <line x1="30" y1="20" x2="300" y2="20" stroke={FPGA.border} strokeWidth="1" />
                {/* 16x */}
                <text x="2" y="50" fontSize="8" fontWeight="700" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>16×</text>
                {Array.from({ length: 18 }, (_, i) => 30 + i * 15).map((x, i) => (
                  <rect key={x} x={x} y="42" width="2.4" height={i % 16 === 8 ? 16 : 10} fill={i % 16 === 8 ? '#E8913A' : '#4A6FA5'} />
                ))}
                <line x1="30" y1="58" x2="300" y2="58" stroke={FPGA.border} strokeWidth="1" />
                <text x="150" y="74" fontSize="7.5" fill="#E8913A" fontFamily='"JetBrains Mono", monospace'>↑ 8번째 = 비트 중앙 샘플</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY12}08, ${DAY12}15)`,
              border: `1px solid ${DAY12}30`, borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: DAY12, marginBottom: '0.2rem' }}>왜 oversampling</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li>송수신 baud 오차·드리프트 흡수</li>
                <li>start 하강엣지 검출 후 <strong>중앙(8/16)</strong>에서 샘플 → 노이즈 강건</li>
                <li>TX는 1× tick으로 비트 출력, RX는 16× tick 사용</li>
              </ul>
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
              border: `1px solid ${FPGA.accent}30`, borderRadius: '8px',
              padding: '0.45rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.accent, flexShrink: 0 }}>HINT</span>
              <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>
                16× tick은 <code>baud_gen #(.BAUD(115200*16))</code>로 인스턴스 1개 더 생성.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
