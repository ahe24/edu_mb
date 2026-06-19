'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY10 = '#1B998B';

const ffCode = `// 동기 · active-high 리셋 (Xilinx FPGA 권장)
always @(posedge clk) begin
  if (rst)  q <= 1'b0;   // 클럭 엣지에서만 리셋
  else      q <= d;      // 평소엔 d를 기억
end`;

export default function SeqConceptSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 1 · 개념"
          title="조합 vs 순차 — 클럭과 기억"
          subtitle="순차논리는 클럭 엣지마다 상태를 레지스터에 저장한다 (D flip-flop)"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 조합 vs 순차 비교 + 코드 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.13))',
                border: '1px solid rgba(74,111,165,0.28)',
                borderTop: '3px solid #4A6FA5',
                borderRadius: '10px', padding: '0.55rem 0.7rem', boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#4A6FA5', marginBottom: '0.25rem' }}>조합 (Day 09)</div>
                <ul style={{ margin: 0, paddingLeft: '0.9rem', fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.55 }}>
                  <li>클럭 없음</li>
                  <li>입력→출력 즉시</li>
                  <li><code>assign</code>/<code>always @*</code></li>
                  <li>기억 없음</li>
                </ul>
              </div>
              <div style={{
                background: `linear-gradient(135deg, ${DAY10}08, ${DAY10}15)`,
                border: `1px solid ${DAY10}30`,
                borderTop: `3px solid ${DAY10}`,
                borderRadius: '10px', padding: '0.55rem 0.7rem', boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: DAY10, marginBottom: '0.25rem' }}>순차 (오늘)</div>
                <ul style={{ margin: 0, paddingLeft: '0.9rem', fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.55 }}>
                  <li>클럭 엣지 동기</li>
                  <li>상태를 <strong>기억</strong></li>
                  <li><code>always @(posedge clk)</code></li>
                  <li>비차단 대입 <code>{'<='}</code></li>
                </ul>
              </div>
            </div>

            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.6rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY10}`,
            }}>
              <div style={{ fontSize: '0.6rem', color: DAY10, fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                D flip-flop — 순차논리의 기본 소자
              </div>
              <VerilogCode code={ffCode} style={{ fontSize: '0.68rem', lineHeight: 1.6 }} />
            </div>
          </div>

          {/* 우: FF 다이어그램 + 리셋 원칙 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.5rem', boxShadow: shadow.card,
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="100%" height="100%" viewBox="0 0 280 150" style={{ maxHeight: '150px' }}>
                {/* FF 박스 */}
                <rect x="95" y="35" width="90" height="80" rx="6" fill="rgba(27,153,139,0.10)" stroke={DAY10} strokeWidth="1.8" />
                <text x="140" y="30" fontSize="10" fontWeight="800" fill={DAY10} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>D-FF</text>
                {/* D in */}
                <text x="55" y="59" fontSize="11" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>D</text>
                <path d="M65 55 H95" stroke="#4A6FA5" strokeWidth="1.6" />
                {/* Q out */}
                <text x="225" y="59" fontSize="11" fontWeight="700" fill={DAY10} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>Q</text>
                <path d="M185 55 H215" stroke={DAY10} strokeWidth="1.6" />
                {/* clk 삼각 */}
                <path d="M95 92 l12 -8 l-12 -8 z" fill={FPGA.dark} />
                <text x="78" y="92" fontSize="10" fontWeight="700" fill={FPGA.dark} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>clk</text>
                <path d="M65 88 H95" stroke={FPGA.dark} strokeWidth="1.6" />
                {/* clk waveform */}
                <path d="M30 135 H45 V120 H60 V135 H75 V120 H90 V135 H105 V120 H120" stroke={FPGA.dark} strokeWidth="1.3" fill="none" />
                <text x="138" y="133" fontSize="8" fill={FPGA.textLight} fontFamily='"JetBrains Mono", monospace'>↑ 엣지마다 D→Q 래치</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.13))`,
              border: `1px solid ${FPGA.accent}30`,
              borderLeft: `4px solid ${FPGA.accent}`,
              borderRadius: '10px', padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: FPGA.accent, marginBottom: '0.2rem' }}>
                리셋 원칙 — FPGA는 동기 active-high
              </div>
              <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.55 }}>
                Xilinx FPGA는 내부적으로 <strong>동기·active-high</strong> 리셋을 선호 (FF가 동기 리셋 포트 내장).
                ASIC 교과서의 active-low 비동기와 다름 — 이번 과정 코드는 동기 active-high로 통일.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
