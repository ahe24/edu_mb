'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY10 = '#1B998B';

const code = `module blinker #(
  parameter integer DIV = 50_000_000  // 100MHz → ~1Hz 토글
)(
  input  wire clk,
  input  wire rst,          // 동기 active-high
  output reg  led
);
  reg [25:0] cnt;
  always @(posedge clk) begin
    if (rst) begin
      cnt <= 0;
      led <= 1'b0;
    end else if (cnt == DIV-1) begin
      cnt <= 0;
      led <= ~led;          // 일정 주기마다 토글
    end else begin
      cnt <= cnt + 1'b1;
    end
  end
endmodule`;

const tbCode = `// TB에서 DIV를 작게 override → 빨리 본다
blinker #(.DIV(4)) dut (.clk(clk), .rst(rst), .led(led));`;

export default function BlinkerSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 1 · 오전 ① · 클럭 분주"
          title="blinker — 100MHz를 1Hz LED로"
          subtitle="카운터로 클럭을 분주해 LED를 토글 · parameter로 분주비를 바꾼다"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 설계 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.65rem 0.9rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY10}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY10, fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
              blinker.v
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.66rem', lineHeight: 1.5 }} />
          </div>

          {/* 우: 분주 개념 + override 힌트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY10}25`,
              borderTop: `3px solid ${DAY10}`, borderRadius: '10px',
              padding: '0.6rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.4rem' }}>분주 원리</div>
              <svg width="100%" height="74" viewBox="0 0 320 74">
                <text x="2" y="20" fontSize="9" fontWeight="700" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>clk</text>
                <path d="M30 24 H38 V8 H46 V24 H54 V8 H62 V24 H70 V8 H78 V24 H86 V8 H94 V24 H102 V8 H110 V24 H300"
                      stroke="#4A6FA5" strokeWidth="1.2" fill="none" />
                <text x="2" y="56" fontSize="9" fontWeight="700" fill={DAY10} fontFamily='"JetBrains Mono", monospace'>led</text>
                <path d="M30 60 H110 V36 H190 V60 H270 V36 H300" stroke={DAY10} strokeWidth="2.2" fill="none" />
                <text x="120" y="32" fontSize="8" fill={FPGA.textLight} fontFamily='"JetBrains Mono", monospace'>DIV 클럭마다 1회 토글</text>
              </svg>
              <div style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.55, marginTop: '0.3rem' }}>
                LED 주기 = <code>2 × DIV × Tclk</code>. DIV=50M → 1초 ON / 1초 OFF.
              </div>
            </div>

            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: '3px solid #E8913A',
            }}>
              <div style={{ fontSize: '0.6rem', color: '#E8913A', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                시뮬 팁 — parameter override
              </div>
              <VerilogCode code={tbCode} style={{ fontSize: '0.64rem', lineHeight: 1.5 }} />
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
              border: `1px solid ${FPGA.accent}30`, borderRadius: '8px',
              padding: '0.45rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.accent, flexShrink: 0 }}>HINT</span>
              <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>
                DIV=50M을 그대로 시뮬하면 1억 클럭 필요. <strong>작은 DIV로 override</strong>해 동작만 확인 → 합성은 실제 값.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
