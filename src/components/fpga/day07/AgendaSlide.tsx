'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY07 = '#0891B2';

const agenda = [
  {
    step: 1,
    title: '왜 CDC?',
    desc: 'Multi-clock 시스템 필연성 · 시뮬레이션이 못 잡는 비동기 영역.',
    color: '#4A6FA5',
  },
  {
    step: 2,
    title: 'Metastability',
    desc: 'Setup/hold 위반 · 4가지 시나리오 · in-band vs out-of-band 신호.',
    color: DAY07,
  },
  {
    step: 3,
    title: '동기화 Scheme',
    desc: '2-DFF · pulse · 4-latch · DMUX · handshake · async FIFO.',
    color: '#0E7C7B',
  },
  {
    step: 4,
    title: 'Questa CDC',
    desc: 'qverify · 4-layer 검증 · methodology/goal · 정적 분석 흐름.',
    color: '#8B6FA5',
  },
  {
    step: 5,
    title: 'Lab',
    desc: '센서 파이프라인 회로 둘러보기 · cdc setup 첫 실행 · clock report 읽기.',
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
