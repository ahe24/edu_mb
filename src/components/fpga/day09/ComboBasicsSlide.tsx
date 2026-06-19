'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY09 = '#2E8B57';

const designCode = `module sw_led (
  input  wire [3:0] sw,    // 슬라이드 스위치 4개
  output wire [3:0] led,   // User LED 4개 (LD4~LD7)
  output wire [3:0] led_n  // 반전 출력 (데모용)
);
  // 조합논리: 클럭 없음 · 입력이 바뀌면 출력 즉시 반영
  assign led   = sw;       // 스위치 그대로 LED에
  assign led_n = ~sw;      // 비트 반전
endmodule`;

const xdcCode = `## Arty A7 master XDC 발췌 (예시)
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports {sw[0]}]
set_property -dict { PACKAGE_PIN C11 IOSTANDARD LVCMOS33 } [get_ports {sw[1]}]
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports {led[0]}]
set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports {led[1]}]`;

export default function ComboBasicsSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 1 · 오전 ① · 조합논리 첫걸음"
          title="sw → LED · assign 한 줄의 설계"
          subtitle="입력이 바뀌면 출력이 즉시 따라가는 조합논리 — 가장 단순한 RTL"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '0.75rem' }}>
          {/* 좌: 개념 + 다이어그램 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: `linear-gradient(135deg, ${DAY09}07, ${DAY09}14)`,
              border: `1px solid ${DAY09}28`,
              borderRadius: '10px',
              padding: '0.6rem 0.85rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: DAY09, marginBottom: '0.3rem' }}>조합논리란</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li><code>assign</code> / <code>always @*</code> — 클럭·레지스터 없음</li>
                <li>입력 변화 → 출력 즉시 (조합 지연만)</li>
                <li>모든 입력 조합에 출력이 <strong>정의</strong>돼야 함</li>
              </ul>
            </div>

            {/* 다이어그램 */}
            <div style={{
              flex: 1,
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.5rem',
              boxShadow: shadow.card,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="100%" height="100%" viewBox="0 0 280 170" style={{ maxHeight: '170px' }}>
                {[0, 1, 2, 3].map((i) => (
                  <g key={i}>
                    <rect x="14" y={18 + i * 34} width="46" height="22" rx="3" fill="rgba(74,111,165,0.12)" stroke="#4A6FA5" strokeWidth="1.3" />
                    <text x="37" y={33 + i * 34} fontSize="10" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>sw[{i}]</text>
                    <path d={`M60 ${29 + i * 34} H150`} stroke={DAY09} strokeWidth="1.6" />
                    <circle cx="210" cy={29 + i * 34} r="11" fill={i % 2 === 0 ? `${DAY09}66` : 'rgba(46,139,87,0.10)'} stroke={DAY09} strokeWidth="1.6" />
                    <text x="240" y={33 + i * 34} fontSize="10" fontWeight="700" fill={DAY09} fontFamily='"JetBrains Mono", monospace'>led[{i}]</text>
                  </g>
                ))}
                <rect x="150" y="12" width="20" height="140" rx="4" fill="rgba(46,139,87,0.06)" stroke={DAY09} strokeDasharray="3 2" strokeWidth="1" />
                <text x="160" y="166" fontSize="8" fill={DAY09} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>assign</text>
              </svg>
            </div>
          </div>

          {/* 우: 코드 2개 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.6rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY09}`,
            }}>
              <div style={{ fontSize: '0.6rem', color: DAY09, fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                sw_led.v — 설계
              </div>
              <VerilogCode code={designCode} style={{ fontSize: '0.66rem', lineHeight: 1.55 }} />
            </div>

            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.6rem 0.85rem', boxShadow: shadow.card,
              borderLeft: '3px solid #E8913A',
            }}>
              <div style={{ fontSize: '0.6rem', color: '#E8913A', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                arty.xdc — 보드 핀 연결 (실보드용)
              </div>
              <VerilogCode code={xdcCode} style={{ fontSize: '0.6rem', lineHeight: 1.5 }} />
            </div>

            {/* 동작 예시 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${DAY09}25`,
              borderTop: `3px solid ${DAY09}`,
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>
                동작 예시 — 입력 즉시 반영
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.66rem', fontFamily: '"JetBrains Mono", monospace' }}>
                <thead>
                  <tr style={{ color: FPGA.textLight }}>
                    <th style={{ textAlign: 'left', padding: '2px 6px' }}>sw[3:0]</th>
                    <th style={{ textAlign: 'left', padding: '2px 6px', color: DAY09 }}>led</th>
                    <th style={{ textAlign: 'left', padding: '2px 6px', color: '#E8913A' }}>led_n</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { s: '0000', l: '0000', n: '1111' },
                    { s: '1010', l: '1010', n: '0101' },
                    { s: '1100', l: '1100', n: '0011' },
                  ].map((r) => (
                    <tr key={r.s} style={{ borderTop: `1px solid ${FPGA.border}` }}>
                      <td style={{ padding: '2px 6px', color: FPGA.text }}>{r.s}</td>
                      <td style={{ padding: '2px 6px', color: FPGA.text }}>{r.l}</td>
                      <td style={{ padding: '2px 6px', color: FPGA.text }}>{r.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 힌트 */}
            <div style={{
              marginTop: 'auto',
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
              border: `1px solid ${FPGA.accent}30`,
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.accent, flexShrink: 0 }}>HINT</span>
              <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>
                시뮬에서는 XDC가 필요 없다. 핀 연결은 <strong>Vivado 합성·보드 단계(Day 16)</strong>에서만 사용.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
