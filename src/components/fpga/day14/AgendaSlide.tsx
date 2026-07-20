'use client';

import { Fragment, type ReactNode } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY14 = '#0B7285';

type Item = { step: number; title: string; desc: string; color: string; isLab?: boolean };

const agenda: Item[] = [
  {
    step: 1,
    title: '커버리지의 필요성',
    desc: 'PASS ≠ 충분 · 커버리지 = 검증 종료 판단의 객관적 근거.',
    color: '#4A6FA5',
  },
  {
    step: 2,
    title: '코드 커버리지 종류',
    desc: 'statement · branch · condition/expression · FSM · toggle.',
    color: DAY14,
  },
  {
    step: 3,
    title: 'QuestaSim 측정 흐름',
    desc: '+cover=bcesf · vsim -coverage · coverage save → UCDB.',
    color: '#0891B2',
  },
  {
    step: 4,
    title: '홀 보강 · 회귀 병합',
    desc: '누락 자극 역추적 · 재측정 상승 · vcover merge 합집합.',
    color: '#8B6FA5',
  },
  {
    step: 5,
    title: '커버리지 클로저 · Lab',
    desc: '도달불가 홀 제외(사유) · 종료 판정 · 4 실습 (순서 무관).',
    color: '#48BB78',
    isLab: true,
  },
];

const Arrow = () => (
  <div style={{ padding: '0 6px', flexShrink: 0 }}>
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3 11h12M13 6l5 5-5 5" stroke={FPGA.textLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  </div>
);

/** 1행 끝(STEP3, ~84%) → 2행 시작(STEP4, ~32%) 직각 연결선 */
const RowConnector = () => (
  <div style={{ position: 'relative', width: '100%', height: '54px' }}>
    <svg width="100%" height="54" viewBox="0 0 100 54" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
      <polyline points="84,0 84,27 32,27 32,53" fill="none" stroke={FPGA.textLight} strokeWidth="1.6" opacity="0.5" vectorEffect="non-scaling-stroke" />
    </svg>
    <div style={{ position: 'absolute', left: '32%', top: '44px', transform: 'translateX(-50%)' }}>
      <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
        <path d="M1.5 1 L6.5 9 L11.5 1" stroke={FPGA.textLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      </svg>
    </div>
  </div>
);

function Card({ item }: { item: Item }): ReactNode {
  return (
    <div style={{
      flex: 1, alignSelf: 'stretch',
      background: `linear-gradient(135deg, ${item.color}06, ${item.color}12)`,
      border: `1px solid ${item.color}25`,
      borderTop: `3px solid ${item.color}`,
      borderRadius: '14px',
      padding: '1.05rem 1.3rem',
      boxShadow: shadow.card,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.7rem' }}>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.72rem', fontWeight: 700,
          color: item.color,
          background: `${item.color}12`,
          border: `1px solid ${item.color}25`,
          padding: '3px 9px',
          borderRadius: '5px',
          letterSpacing: '0.06em',
        }}>STEP {item.step}</span>
        {item.isLab && (
          <span style={{
            fontSize: '0.7rem', fontWeight: 700,
            background: `${FPGA.accent}15`,
            color: FPGA.accent,
            border: `1px solid ${FPGA.accent}30`,
            padding: '2px 8px', borderRadius: '5px',
          }}>실습</span>
        )}
      </div>
      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.5rem', lineHeight: 1.3 }}>
        {item.title}
      </div>
      <div style={{ fontSize: '0.94rem', color: FPGA.textLight, lineHeight: 1.55 }}>
        {item.desc}
      </div>
    </div>
  );
}

export default function AgendaSlide() {
  const rows: Item[][] = [agenda.slice(0, 3), agenda.slice(3)];

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader title="오늘의 학습 흐름" />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.4rem' }}>
          {rows.map((row, ri) => (
            <Fragment key={ri}>
              {ri > 0 && <RowConnector />}
              <div style={{
                display: 'flex', alignItems: 'stretch',
                justifyContent: ri === 0 ? 'flex-start' : 'center',
              }}>
                {row.map((item, i) => (
                  <div key={item.step} style={{
                    display: 'flex', alignItems: 'center',
                    flex: ri === 0 ? 1 : '0 1 33%',
                  }}>
                    <Card item={item} />
                    {i < row.length - 1 && <Arrow />}
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
