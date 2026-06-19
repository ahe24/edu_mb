'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY11 = '#3D8361';

const code = `module seq_detect (        // 패턴 "1 0 1" 검출 (overlap 허용)
  input  wire clk,
  input  wire rst,
  input  wire din,
  output wire found
);
  localparam S0=2'd0, S1=2'd1, S10=2'd2, S101=2'd3;
  reg [1:0] state, next;

  always @(posedge clk)             // 상태 reg
    if (rst) state <= S0;
    else     state <= next;

  always @* case (state)            // 다음 상태
    S0:      next = din ? S1   : S0;
    S1:      next = din ? S1   : S10;
    S10:     next = din ? S101 : S0;
    S101:    next = din ? S1   : S10;  // overlap 재사용
    default: next = S0;                // 안전 복구
  endcase

  assign found = (state == S101);   // Moore 출력
endmodule`;

export default function SeqDetectorSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 3 · 오후 ① · 시퀀스 검출"
          title="입력 패턴 검출 FSM — overlap 처리"
          subtitle="직렬 입력에서 '101' 발견 시 found=1 · 겹치는 패턴(101101…)도 놓치지 않게"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY11}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY11, fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
              seq_detect.v
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.62rem', lineHeight: 1.45 }} />
          </div>

          {/* 우: 상태도 + 입력 추적 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY11}25`,
              borderTop: `3px solid ${DAY11}`, borderRadius: '10px',
              padding: '0.5rem', boxShadow: shadow.card,
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="100%" height="100%" viewBox="0 0 300 130" style={{ maxHeight: '130px' }}>
                {[
                  { cx: 36, cy: 65, l: 'S0' },
                  { cx: 110, cy: 65, l: 'S1' },
                  { cx: 184, cy: 65, l: 'S10' },
                  { cx: 262, cy: 65, l: 'S101', hit: true },
                ].map((s) => (
                  <g key={s.l}>
                    <circle cx={s.cx} cy={s.cy} r="20" fill={s.hit ? 'rgba(72,187,120,0.20)' : `${DAY11}12`} stroke={s.hit ? '#48BB78' : DAY11} strokeWidth={s.hit ? 2.2 : 1.6} />
                    <text x={s.cx} y={s.cy + 4} fontSize="8.5" fontWeight="800" fill={s.hit ? '#48BB78' : DAY11} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>{s.l}</text>
                  </g>
                ))}
                {/* transitions (labeled with din) */}
                <path d="M56 60 H90" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#sa)" /><text x="73" y="52" fontSize="7.5" fill={DAY11} textAnchor="middle">1</text>
                <path d="M130 70 H164" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#sa)" /><text x="147" y="84" fontSize="7.5" fill={DAY11} textAnchor="middle">0</text>
                <path d="M204 60 H242" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#sa)" /><text x="223" y="52" fontSize="7.5" fill={DAY11} textAnchor="middle">1</text>
                {/* overlap back S101→S1 */}
                <path d="M250 48 A60 60 0 0 0 122 50" fill="none" stroke="#48BB78" strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#sa)" />
                <text x="186" y="20" fontSize="7.5" fill="#48BB78" textAnchor="middle">din=1 (overlap)</text>
                <defs>
                  <marker id="sa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0 0 L6 3 L0 6 z" fill={DAY11} />
                  </marker>
                </defs>
              </svg>
            </div>

            <div style={{
              background: '#0F1626', borderRadius: '9px',
              padding: '0.5rem 0.75rem', boxShadow: shadow.card,
              fontFamily: 'ui-monospace, Consolas, monospace', fontSize: '0.62rem', lineHeight: 1.6,
            }}>
              <div style={{ color: '#94A3B8' }}># din = 1 0 1 1 0 1</div>
              <div style={{ color: '#A8D8A8' }}>state: S0→S1→S10→<span style={{ color: '#48BB78' }}>S101*</span>→S1→S10→<span style={{ color: '#48BB78' }}>S101*</span></div>
              <div style={{ color: '#F6AD55' }}>found pulses: 2 (overlap 덕분)</div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
              border: `1px solid ${FPGA.accent}30`, borderRadius: '8px',
              padding: '0.42rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: FPGA.accent, flexShrink: 0 }}>HINT</span>
              <span style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.45 }}>
                S101에서 din=1을 S1로 보내는 화살표가 overlap 핵심. 이걸 S0으로 잘못 두면 연속 패턴을 놓침.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
