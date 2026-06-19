'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY11 = '#3D8361';

export default function FsmConceptSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 1 · 개념"
          title="FSM = 상태 레지스터 + 다음상태 + 출력"
          subtitle="세 부분으로 분리해 설계 — 순차논리(상태 기억) 위에 조합논리(천이·출력)를 얹는다"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 3부분 구조도 */}
          <div style={{
            background: FPGA.white, border: `1px solid ${DAY11}25`,
            borderTop: `3px solid ${DAY11}`, borderRadius: '12px',
            padding: '0.7rem 0.85rem', boxShadow: shadow.card,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.45rem' }}>표준 FSM 데이터패스</div>
            <svg width="100%" height="100%" viewBox="0 0 360 170" style={{ flex: 1 }}>
              {/* next-state logic */}
              <rect x="14" y="58" width="78" height="48" rx="6" fill="rgba(74,111,165,0.10)" stroke="#4A6FA5" strokeWidth="1.6" />
              <text x="53" y="78" fontSize="8.5" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>다음상태</text>
              <text x="53" y="90" fontSize="7.5" fill="#4A6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>(조합)</text>
              {/* state reg */}
              <rect x="140" y="58" width="78" height="48" rx="6" fill={`${DAY11}15`} stroke={DAY11} strokeWidth="1.8" />
              <text x="179" y="78" fontSize="8.5" fontWeight="800" fill={DAY11} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>상태 reg</text>
              <text x="179" y="90" fontSize="7.5" fill={DAY11} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>@posedge clk</text>
              {/* output logic */}
              <rect x="266" y="58" width="80" height="48" rx="6" fill="rgba(139,111,165,0.12)" stroke="#8B6FA5" strokeWidth="1.6" />
              <text x="306" y="78" fontSize="8.5" fontWeight="700" fill="#8B6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>출력</text>
              <text x="306" y="90" fontSize="7.5" fill="#8B6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>(조합)</text>
              {/* arrows */}
              <path d="M92 82 H140" stroke={FPGA.textLight} strokeWidth="1.5" markerEnd="url(#fa)" />
              <text x="116" y="76" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>next</text>
              <path d="M218 82 H266" stroke={FPGA.textLight} strokeWidth="1.5" markerEnd="url(#fa)" />
              <text x="242" y="76" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>state</text>
              {/* feedback */}
              <path d="M179 106 V140 H53 V106" fill="none" stroke={DAY11} strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#fa)" />
              <text x="116" y="135" fontSize="7" fill={DAY11} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>현재 상태 피드백</text>
              {/* inputs/outputs */}
              <text x="20" y="44" fontSize="8" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>입력 →</text>
              <path d="M40 48 V58" stroke="#4A6FA5" strokeWidth="1.3" />
              <path d="M346 82 H356" stroke="#8B6FA5" strokeWidth="1.5" markerEnd="url(#fa)" />
              <text x="330" y="44" fontSize="8" fill="#8B6FA5" fontFamily='"JetBrains Mono", monospace'>→ 출력</text>
              <defs>
                <marker id="fa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0 0 L6 3 L0 6 z" fill={FPGA.textLight} />
                </marker>
              </defs>
            </svg>
          </div>

          {/* 우: Moore/Mealy + encoding + 안전 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={{
                background: `linear-gradient(135deg, ${DAY11}08, ${DAY11}14)`,
                border: `1px solid ${DAY11}28`, borderRadius: '9px',
                padding: '0.5rem 0.65rem',
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: DAY11 }}>Moore</div>
                <div style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.45 }}>출력 = 상태만. 안정적·예측 쉬움 (오늘 주력).</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(139,111,165,0.07), rgba(139,111,165,0.14))',
                border: '1px solid rgba(139,111,165,0.28)', borderRadius: '9px',
                padding: '0.5rem 0.65rem',
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8B6FA5' }}>Mealy</div>
                <div style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.45 }}>출력 = 상태+입력. 빠르나 글리치 주의.</div>
              </div>
            </div>

            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '9px', padding: '0.5rem 0.7rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>상태 인코딩</div>
              <div style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.5 }}>
                <strong>binary</strong> (적은 FF) vs <strong>one-hot</strong> (FPGA FF 풍부 → 빠르고 디버깅 쉬움). 보통 합성기 자동 선택.
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))`,
              border: '1px solid rgba(229,62,62,0.30)',
              borderLeft: '4px solid #E53E3E',
              borderRadius: '9px', padding: '0.5rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E53E3E', marginBottom: '0.15rem' }}>
                safety-critical — 안전 상태
              </div>
              <div style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.5 }}>
                미사용/illegal 상태에 빠져도 <strong>정의된 안전 상태로 복구</strong>돼야 함. SEU·글리치 대비 → 반드시 <code>default</code>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
