'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';
import ToolImage from '../ToolImage';

const DAY09 = '#2E8B57';

const code = `module logic_gates (
  input  wire [1:0] sw,    // sw[1], sw[0]
  output wire [2:0] rgb    // {B, G, R} of RGB LED LD0
);
  assign rgb[0] = sw[0] & sw[1];  // R = AND
  assign rgb[1] = sw[0] | sw[1];  // G = OR
  assign rgb[2] = sw[0] ^ sw[1];  // B = XOR
endmodule`;

// 진리표: sw1 sw0 → R(AND) G(OR) B(XOR)
const truth = [
  { i: '0 0', r: 0, g: 0, b: 0 },
  { i: '0 1', r: 0, g: 1, b: 1 },
  { i: '1 0', r: 0, g: 1, b: 1 },
  { i: '1 1', r: 1, g: 1, b: 0 },
];

export default function LogicGatesSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 2 · 오전 ② · 논리 게이트"
          title="AND · OR · XOR → RGB LED 색으로 보기"
          subtitle="두 스위치의 논리 연산 결과를 RGB 3색에 각각 매핑 — 결과가 색으로 즉시 보인다"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 + 진리표 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.6rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY09}`,
            }}>
              <div style={{ fontSize: '0.6rem', color: DAY09, fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                logic_gates.v
              </div>
              <VerilogCode code={code} style={{ fontSize: '0.68rem', lineHeight: 1.6 }} />
            </div>

            {/* 진리표 */}
            <div style={{
              flex: 1,
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.55rem 0.75rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.4rem' }}>진리표 · 기대값</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem', fontFamily: '"JetBrains Mono", monospace' }}>
                <thead>
                  <tr style={{ color: FPGA.textLight }}>
                    <th style={{ textAlign: 'left', padding: '2px 4px' }}>sw1 sw0</th>
                    <th style={{ padding: '2px 4px', color: '#E53E3E' }}>R (AND)</th>
                    <th style={{ padding: '2px 4px', color: DAY09 }}>G (OR)</th>
                    <th style={{ padding: '2px 4px', color: '#4A6FA5' }}>B (XOR)</th>
                    <th style={{ padding: '2px 4px' }}>색</th>
                  </tr>
                </thead>
                <tbody>
                  {truth.map((t) => {
                    const rgbCss = `rgb(${t.r ? 230 : 40}, ${t.g ? 180 : 40}, ${t.b ? 230 : 40})`;
                    return (
                      <tr key={t.i} style={{ borderTop: `1px solid ${FPGA.border}` }}>
                        <td style={{ padding: '3px 4px', fontWeight: 700, color: FPGA.text }}>{t.i}</td>
                        <td style={{ padding: '3px 4px', textAlign: 'center', color: FPGA.text }}>{t.r}</td>
                        <td style={{ padding: '3px 4px', textAlign: 'center', color: FPGA.text }}>{t.g}</td>
                        <td style={{ padding: '3px 4px', textAlign: 'center', color: FPGA.text }}>{t.b}</td>
                        <td style={{ padding: '3px 4px', textAlign: 'center' }}>
                          <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', background: rgbCss, border: '1px solid rgba(0,0,0,0.15)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ fontSize: '0.6rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.35rem' }}>
                ※ Arty RGB LED는 active-high. 합성 시 공통 양극/음극 극성 확인.
              </div>
            </div>
          </div>

          {/* 우: 시뮬 결과 placeholder + 절차 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white,
              border: `1px solid ${DAY09}25`,
              borderTop: `3px solid ${DAY09}`,
              borderRadius: '10px',
              padding: '0.6rem 0.8rem',
              boxShadow: shadow.card,
              flex: 1, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.4rem' }}>
                Visualizer 파형 — 4가지 입력 조합
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ToolImage src="/images/fpga/day09_logic_gates_wave.png" name="logic_gates 시뮬 파형" width="100%" height="100%" />
              </div>
              <div style={{ fontSize: '0.6rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.35rem' }}>
                day09_logic_gates_wave.png — sw 4조합 스윕 시 rgb 변화 (클릭하면 확대)
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY09}07, ${DAY09}14)`,
              border: `1px solid ${DAY09}28`,
              borderRadius: '9px',
              padding: '0.5rem 0.8rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: DAY09, marginBottom: '0.25rem' }}>시뮬 절차</div>
              <ol style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.55 }}>
                <li>TB에서 sw = 00→01→10→11 순차 인가</li>
                <li><code>add wave</code> 후 <code>run -all</code></li>
                <li>각 조합의 rgb를 진리표와 대조</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
