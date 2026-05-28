'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY07 = '#0891B2';

const takeaways = [
  { k: 'Metastability', v: 'setup/hold 위반 → out-of-band 신호 · sim으로 잡히지 않음' },
  { k: 'CDC Scheme', v: '신호 폭 + 처리량 + protocol에 따라 6종 중 선택' },
  { k: 'Bus 일관성', v: 'multi-bit raw crossing 금지 · stable / gray / DMUX / FIFO 중 택1' },
  { k: 'Reconvergence', v: '동기화 후 합쳐지는 path는 RX가 cycle skew를 흡수해야 함' },
  { k: 'Questa CDC', v: 'qverify 단일 실행 + Static / Protocol (sim+formal) / CDC-FX 3-layer 검증' },
];

export default function QnASlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          title="핵심 정리"
          subtitle="비동기 도메인 검증의 이론적 토대 — Day 8에서 실제 디버그로 연결"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {/* 5 takeaway 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
            {takeaways.map((t) => (
              <div key={t.k} style={{
                background: FPGA.white,
                border: `1px solid ${DAY07}25`,
                borderLeft: `3px solid ${DAY07}`,
                borderRadius: '8px',
                padding: '0.5rem 0.8rem',
                boxShadow: shadow.card,
                display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
              }}>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.7rem', fontWeight: 800,
                  color: DAY07,
                  background: `${DAY07}10`,
                  border: `1px solid ${DAY07}30`,
                  padding: '2px 8px', borderRadius: '4px',
                  flexShrink: 0,
                  minWidth: '110px',
                  textAlign: 'center',
                }}>{t.k}</span>
                <span style={{ fontSize: '0.74rem', color: FPGA.text, lineHeight: 1.5 }}>{t.v}</span>
              </div>
            ))}
          </div>

          {/* Day 8 예고 */}
          <div style={{
            flex: 1, minHeight: 0,
            background: `linear-gradient(135deg, ${DAY07}06, ${DAY07}16)`,
            border: `1px solid ${DAY07}30`,
            borderLeft: `4px solid ${DAY07}`,
            borderRadius: '10px',
            padding: '0.8rem 1.1rem',
            boxShadow: shadow.card,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.72rem', fontWeight: 800,
                color: '#fff', background: DAY07,
                padding: '3px 10px', borderRadius: '5px',
                letterSpacing: '0.06em',
              }}>NEXT</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: FPGA.dark }}>
                Day 08 — CDC 분석 실습 및 결과 해석
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
              {[
                { t: 'cdc run · 전체 분석', d: '5 Violation / 4 Evaluation / 1 Proven · 의도된 3종 버그 검출' },
                { t: 'GUI debug', d: 'Schematic ↔ Source cross-probe · CDC Checks 윈도우' },
                { t: '디렉티브 + 수정', d: 'stable / 2-DFF 추가 / combo 제거 · status.tcl export' },
              ].map((p) => (
                <div key={p.t} style={{
                  background: FPGA.white,
                  border: `1px solid ${DAY07}25`,
                  borderRadius: '8px',
                  padding: '0.5rem 0.65rem',
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: DAY07, marginBottom: '0.2rem' }}>{p.t}</div>
                  <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>{p.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Q&A 마무리 */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(255,255,255,0.7)',
            border: `1px solid ${FPGA.border}`,
            borderRadius: '10px',
            padding: '0.5rem 1rem',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke={DAY07} strokeWidth="1.8" />
              <path d="M9 9c0-1.5 1.2-2.5 3-2.5s3 1 3 2.5c0 2-3 2-3 4M12 17h.01" stroke={DAY07} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: FPGA.dark }}>Q&A</span>
          </div>
        </div>
      </div>
    </section>
  );
}
