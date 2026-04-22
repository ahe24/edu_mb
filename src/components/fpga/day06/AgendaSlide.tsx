'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY06 = '#6B46C1';

const agenda = [
  {
    step: 1,
    title: '명시 vs 잠재',
    desc: 'Day 05 mismatch와 Day 06 잠재 오류의 경계 구분.',
    color: '#4A6FA5',
  },
  {
    step: 2,
    title: 'Latch · Case',
    desc: 'SS4 래치 추론 · SS2 case 완전성 — 회로 의도 vs 실제 차이.',
    color: DAY06,
  },
  {
    step: 3,
    title: 'Width · X-prop',
    desc: 'CP7 비트폭 정합성 · SS17/SS18 미구동 리셋 X 전파.',
    color: '#8B6FA5',
  },
  {
    step: 4,
    title: 'FSM 안전성',
    desc: 'CP5 인코딩 · CP6 unreachable/deadend/safe transition · SEU 복구.',
    color: '#DD6B20',
  },
  {
    step: 5,
    title: '실습 · 정리',
    desc: 'latent_bug 15건 검출 · 합성 리포트 교차 검증 · Week 4 CDC 예고.',
    color: '#48BB78',
    isLab: true,
  },
];

export default function AgendaSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader title="오늘의 학습 흐름" />

        <div style={{
          flex: 1, minHeight: 0,
          display: 'flex', alignItems: 'stretch',
          gap: '0px', width: '100%',
        }}>
          {agenda.map((item, i) => (
            <div key={item.step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                flex: 1,
                background: `linear-gradient(135deg, ${item.color}06, ${item.color}12)`,
                border: `1px solid ${item.color}25`,
                borderTop: `3px solid ${item.color}`,
                borderRadius: '14px',
                padding: '1.2rem 1rem',
                boxShadow: shadow.card,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.7rem' }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.65rem', fontWeight: 700,
                    color: item.color,
                    background: `${item.color}12`,
                    border: `1px solid ${item.color}25`,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    letterSpacing: '0.06em',
                  }}>STEP {item.step}</span>
                  {item.isLab && (
                    <span style={{
                      fontSize: '0.62rem', fontWeight: 700,
                      background: `${FPGA.accent}15`,
                      color: FPGA.accent,
                      border: `1px solid ${FPGA.accent}30`,
                      padding: '1px 6px', borderRadius: '4px',
                    }}>실습</span>
                  )}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.45rem', lineHeight: 1.3 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: FPGA.textLight, lineHeight: 1.55 }}>
                  {item.desc}
                </div>
              </div>

              {i < agenda.length - 1 && (
                <div style={{ padding: '0 4px', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9h9M9 5l4 4-4 4" stroke={FPGA.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
