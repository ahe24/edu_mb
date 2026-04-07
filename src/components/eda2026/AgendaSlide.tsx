'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const items = [
  { num: 1, title: 'EDA 사업부 소개' },
  { num: 2, title: '현재 시장 현황과 과제' },
  { num: 3, title: '영업 한계의 본질' },
  { num: 4, title: '해결 방향 — 자동화 솔루션' },
  { num: 5, title: 'LLM 기반 솔루션 전략' },
  { num: 6, title: '자체 검증 현황' },
  { num: 7, title: '외부 인프라 활용 — 충북테크노파크' },
  { num: 8, title: '타겟 고객과 시장 기회' },
  { num: 9, title: '2026 액션 플랜' },
  { num: 10, title: '기대 효과' },
];

const left = items.slice(0, 5);
const right = items.slice(5);

export default function AgendaSlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        {/* Header */}
        <div style={edaStyles.slideHeader}>Agenda</div>

        {/* 2-column grid */}
        <div style={edaStyles.grid2}>
          {/* Left column */}
          <div style={{ ...edaStyles.card, padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', justifyContent: 'space-between' }}>
            {left.map(item => (
              <div key={item.num} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                  width: '34px', height: '34px', minWidth: '34px',
                  background: EDA.navy,
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: EDA.white, fontWeight: 800, fontSize: '0.9rem',
                }}>
                  {item.num}
                </div>
                <span style={{ fontSize: '0.92rem', color: EDA.text, fontWeight: 500 }}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={{ ...edaStyles.card, padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', justifyContent: 'space-between' }}>
            {right.map(item => (
              <div key={item.num} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                  width: '34px', height: '34px', minWidth: '34px',
                  background: EDA.navy,
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: EDA.white, fontWeight: 800, fontSize: '0.9rem',
                }}>
                  {item.num}
                </div>
                <span style={{ fontSize: '0.92rem', color: EDA.text, fontWeight: 500 }}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
