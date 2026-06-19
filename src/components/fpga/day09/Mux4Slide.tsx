'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY09 = '#2E8B57';

const goodCode = `module mux4 (
  input  wire [3:0] btn,   // 데이터 입력 4개
  input  wire [1:0] sel,   // 선택 (sw[1:0])
  output reg        led
);
  always @* begin
    case (sel)
      2'd0: led = btn[0];
      2'd1: led = btn[1];
      2'd2: led = btn[2];
      2'd3: led = btn[3];
      default: led = 1'b0;   // ← full-case: latch 방지
    endcase
  end
endmodule`;

const badNote = `// ✗ default 없고 sel 일부만 기술 →
//   미기술 조합에서 led가 이전 값 유지
//   = 의도치 않은 LATCH 추론 (Day 06 참조)`;

export default function Mux4Slide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 3 · 오후 ① · 4:1 MUX"
          title="case 문 MUX · full-case로 latch 회피"
          subtitle="sel 2비트로 4개 입력 중 하나 선택 — 조합 always는 모든 경로에 출력을 줘야 한다"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 + sel 동작 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.65rem 0.9rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY09}`,
            }}>
              <div style={{ fontSize: '0.6rem', color: DAY09, fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                mux4.v — case 기반 설계
              </div>
              <VerilogCode code={goodCode} style={{ fontSize: '0.68rem', lineHeight: 1.55 }} />
              <div style={{ marginTop: '0.5rem', paddingTop: '0.45rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                <VerilogCode code={badNote} style={{ fontSize: '0.62rem', lineHeight: 1.5 }} />
              </div>
            </div>

            {/* sel 동작 표 */}
            <div style={{
              flex: 1,
              background: FPGA.white,
              border: `1px solid ${DAY09}25`,
              borderTop: `3px solid ${DAY09}`,
              borderRadius: '10px',
              padding: '0.55rem 0.8rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>
                sel → 출력 선택 (btn = 1010 예)
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.68rem', fontFamily: '"JetBrains Mono", monospace' }}>
                <thead>
                  <tr style={{ color: FPGA.textLight }}>
                    <th style={{ textAlign: 'left', padding: '2px 6px' }}>sel</th>
                    <th style={{ textAlign: 'left', padding: '2px 6px' }}>선택</th>
                    <th style={{ textAlign: 'left', padding: '2px 6px', color: DAY09 }}>led</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { s: '00', sub: 'btn[0]', v: '0' },
                    { s: '01', sub: 'btn[1]', v: '1' },
                    { s: '10', sub: 'btn[2]', v: '0' },
                    { s: '11', sub: 'btn[3]', v: '1' },
                  ].map((r) => (
                    <tr key={r.s} style={{ borderTop: `1px solid ${FPGA.border}` }}>
                      <td style={{ padding: '2px 6px', color: FPGA.text }}>{r.s}</td>
                      <td style={{ padding: '2px 6px', color: FPGA.text }}>{r.sub}</td>
                      <td style={{ padding: '2px 6px', color: FPGA.text }}>{r.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 우: MUX 다이어그램 + 포인트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.5rem',
              boxShadow: shadow.card,
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="100%" height="100%" viewBox="0 0 280 175" style={{ maxHeight: '175px' }}>
                {/* 입력 4개 */}
                {[0, 1, 2, 3].map((i) => (
                  <g key={i}>
                    <text x="8" y={28 + i * 34} fontSize="9.5" fontWeight="700" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>btn[{i}]</text>
                    <path d={`M50 ${24 + i * 34} H100`} stroke={i === 2 ? DAY09 : FPGA.textLight} strokeWidth={i === 2 ? 2.2 : 1.3} />
                  </g>
                ))}
                {/* MUX 사다리꼴 */}
                <path d="M100 8 L140 30 L140 110 L100 132 Z" fill="rgba(46,139,87,0.12)" stroke={DAY09} strokeWidth="1.8" />
                <text x="120" y="74" fontSize="11" fontWeight="800" fill={DAY09} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>4:1</text>
                {/* sel */}
                <text x="92" y="160" fontSize="9.5" fontWeight="700" fill="#8B6FA5" fontFamily='"JetBrains Mono", monospace'>sel=2</text>
                <path d="M120 150 V132" stroke="#8B6FA5" strokeWidth="1.6" />
                {/* 출력 */}
                <path d="M140 70 H205" stroke={DAY09} strokeWidth="2.2" />
                <circle cx="220" cy="70" r="12" fill={`${DAY09}55`} stroke={DAY09} strokeWidth="1.8" />
                <text x="250" y="74" fontSize="10" fontWeight="700" fill={DAY09} fontFamily='"JetBrains Mono", monospace'>led</text>
                <text x="120" y="150" fontSize="8" fill="#8B6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>→ btn[2] 선택</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))`,
              border: '1px solid rgba(229,62,62,0.30)',
              borderLeft: '4px solid #E53E3E',
              borderRadius: '9px',
              padding: '0.5rem 0.8rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#E53E3E', marginBottom: '0.2rem' }}>
                Lint·Day 06 연결 — latch 추론
              </div>
              <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.55 }}>
                조합 <code>always</code>에서 일부 경로의 출력을 빠뜨리면 합성기가 <strong>latch</strong>를 추론.
                safety-critical에선 타이밍·기능 결함 → <strong>항상 default 또는 사전 대입</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
