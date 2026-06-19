'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY11 = '#3D8361';

const code = `module traffic_light (
  input  wire       clk,
  input  wire       rst,
  output reg  [2:0] light    // [2]=R [1]=Y [0]=G
);
  localparam RED=2'd0, GRN=2'd1, YEL=2'd2;
  localparam [7:0] T_RED=30, T_GRN=25, T_YEL=5;

  reg [1:0] state, next;
  reg [7:0] tmr;
  wire done = (state==RED && tmr==T_RED-1) ||
              (state==GRN && tmr==T_GRN-1) ||
              (state==YEL && tmr==T_YEL-1);

  always @(posedge clk)                 // ① 상태+타이머
    if (rst)       begin state<=RED; tmr<=0; end
    else if (done) begin state<=next; tmr<=0; end
    else           tmr <= tmr + 1'b1;

  always @* case (state)                // ② 다음 상태
    RED:     next = GRN;
    GRN:     next = YEL;
    YEL:     next = RED;
    default: next = RED;                // 안전: 적색
  endcase

  always @* case (state)                // ③ 출력 (Moore)
    RED:     light = 3'b100;
    GRN:     light = 3'b001;
    YEL:     light = 3'b010;
    default: light = 3'b100;            // 안전: 적색
  endcase
endmodule`;

export default function TrafficLightSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 1 · 오전 ① · 신호등 FSM"
          title="타이머 기반 신호등 — Moore FSM 정석"
          subtitle="RED→GREEN→YELLOW 순환 · 각 상태를 타이머로 유지 · 안전 default는 적색"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY11}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY11, fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
              traffic_light.v
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.6rem', lineHeight: 1.4 }} />
          </div>

          {/* 우: 상태도 + 포인트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY11}25`,
              borderTop: `3px solid ${DAY11}`, borderRadius: '10px',
              padding: '0.5rem', boxShadow: shadow.card,
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="100%" height="100%" viewBox="0 0 240 180" style={{ maxHeight: '180px' }}>
                {[
                  { cx: 120, cy: 36, label: 'RED', sub: '30', c: '#E53E3E' },
                  { cx: 192, cy: 132, label: 'GREEN', sub: '25', c: '#48BB78' },
                  { cx: 48, cy: 132, label: 'YELLOW', sub: '5', c: '#E8913A' },
                ].map((s) => (
                  <g key={s.label}>
                    <circle cx={s.cx} cy={s.cy} r="26" fill={`${s.c}18`} stroke={s.c} strokeWidth="2" />
                    <text x={s.cx} y={s.cy - 1} fontSize="9.5" fontWeight="800" fill={s.c} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>{s.label}</text>
                    <text x={s.cx} y={s.cy + 11} fontSize="7.5" fill={s.c} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>{s.sub} clk</text>
                  </g>
                ))}
                <path d="M140 54 A78 78 0 0 1 184 106" fill="none" stroke={DAY11} strokeWidth="1.8" markerEnd="url(#ta)" />
                <path d="M172 150 A78 78 0 0 1 70 150" fill="none" stroke={DAY11} strokeWidth="1.8" markerEnd="url(#ta)" />
                <path d="M56 106 A78 78 0 0 1 100 54" fill="none" stroke={DAY11} strokeWidth="1.8" markerEnd="url(#ta)" />
                <defs>
                  <marker id="ta" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                    <path d="M0 0 L6 3 L0 6 z" fill={DAY11} />
                  </marker>
                </defs>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY11}08, ${DAY11}15)`,
              border: `1px solid ${DAY11}30`, borderRadius: '9px',
              padding: '0.5rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: DAY11, marginBottom: '0.15rem' }}>설계 포인트</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.55 }}>
                <li>타이머 <code>done</code>일 때만 상태 천이 → 시간 제어</li>
                <li>3색 동시 점등 불가 — one-hot 출력으로 안전 보장</li>
                <li>시뮬에선 T_* 작게 override해 빠르게 순환 확인</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
