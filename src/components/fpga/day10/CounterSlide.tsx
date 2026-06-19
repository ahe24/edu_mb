'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';
import ToolImage from '../ToolImage';

const DAY10 = '#1B998B';

const code = `module counter #(
  parameter integer W = 4          // 비트 폭
)(
  input  wire         clk,
  input  wire         rst,         // 동기 active-high
  input  wire         en,          // 1일 때만 증가
  output reg  [W-1:0] cnt
);
  always @(posedge clk) begin
    if (rst)      cnt <= {W{1'b0}};   // 0으로
    else if (en)  cnt <= cnt + 1'b1;  // 증가 (W비트에서 자동 wrap)
    // en=0이면 값 유지
  end
endmodule`;

export default function CounterSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 2 · 오전 ② · 카운터"
          title="N-bit 카운터 · enable · wrap-around"
          subtitle="enable로 증가를 제어하고, W비트 한계에서 자동으로 0으로 되돌아온다"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.65rem 0.9rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY10}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY10, fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
              counter.v
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.68rem', lineHeight: 1.55 }} />
          </div>

          {/* 우: 동작 표 + 파형 placeholder */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.55rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>제어 동작</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.66rem', fontFamily: '"JetBrains Mono", monospace' }}>
                <thead>
                  <tr style={{ color: FPGA.textLight }}>
                    <th style={{ textAlign: 'left', padding: '2px 6px' }}>rst</th>
                    <th style={{ textAlign: 'left', padding: '2px 6px' }}>en</th>
                    <th style={{ textAlign: 'left', padding: '2px 6px' }}>다음 cnt</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { r: '1', e: '–', n: '0 (리셋)', c: '#E53E3E' },
                    { r: '0', e: '1', n: 'cnt + 1', c: DAY10 },
                    { r: '0', e: '0', n: 'cnt (유지)', c: '#718096' },
                  ].map((row) => (
                    <tr key={row.n} style={{ borderTop: `1px solid ${FPGA.border}` }}>
                      <td style={{ padding: '3px 6px', color: FPGA.text }}>{row.r}</td>
                      <td style={{ padding: '3px 6px', color: FPGA.text }}>{row.e}</td>
                      <td style={{ padding: '3px 6px', fontWeight: 700, color: row.c }}>{row.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ fontSize: '0.6rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.3rem' }}>
                W=4 → 15 다음은 0 (overflow wrap). cnt를 LED[3:0]에 연결해 눈으로 확인.
              </div>
            </div>

            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${DAY10}25`,
              borderTop: `3px solid ${DAY10}`, borderRadius: '10px',
              padding: '0.5rem 0.7rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                Visualizer 파형 — rst→en→wrap
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ToolImage src="/images/fpga/day10_counter_wave.png" name="counter 시뮬 파형" width="100%" height="100%" />
              </div>
              <div style={{ fontSize: '0.58rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.3rem' }}>
                day10_counter_wave.png — 리셋 해제 후 en=1 구간 증가, 15→0 wrap
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
