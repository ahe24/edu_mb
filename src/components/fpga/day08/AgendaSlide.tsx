'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY08 = '#0E7C7B';

const agenda = [
  {
    step: 1,
    title: 'Directives',
    desc: 'netlist clock · scheme · methodology · 단계별 적용.',
    color: '#4A6FA5',
  },
  {
    step: 2,
    title: 'CDC Run · 결과',
    desc: '실측 5 violation + 4 evaluation + 1 proven · 카테고리 해석.',
    color: DAY08,
  },
  {
    step: 3,
    title: '3종 디버그',
    desc: 'no_sync · combo_logic · multi_bits · schematic 추적 · RTL 수정.',
    color: '#0891B2',
  },
  {
    step: 4,
    title: 'GUI · Waiver',
    desc: 'CDC Checks · Status · Filter · status.tcl export · 재실행 propagate.',
    color: '#8B6FA5',
  },
  {
    step: 5,
    title: 'V&V · Lab',
    desc: 'FPGA 특화 · 산출물 정리 · 디버그→수정→재실행 cycle 완성.',
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
