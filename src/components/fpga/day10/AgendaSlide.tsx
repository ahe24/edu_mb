'use client';

import { Fragment, type ReactNode } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY10 = '#1B998B';

type Item = { step: number; title: string; desc: string; color: string; isLab?: boolean };

const agenda: Item[] = [
  {
    step: 1,
    title: '순차논리 개념',
    desc: '조합 vs 순차 · flip-flop · always @(posedge clk) · 동기 active-high 리셋.',
    color: '#4A6FA5',
  },
  {
    step: 2,
    title: '클럭·리셋 TB',
    desc: 'TB에서 클럭 생성(always #5) · 리셋 시퀀스 · @(posedge clk) 동기 자극.',
    color: DAY10,
  },
  {
    step: 3,
    title: 'blinker · counter',
    desc: '클럭분주 토글 LED · parameter override · N-bit 카운터 + enable.',
    color: '#0891B2',
  },
  {
    step: 4,
    title: '버튼 디바운서',
    desc: '2FF 동기화(메타안정 방지) + 카운터 기반 안정화 · raw → clean.',
    color: '#8B6FA5',
  },
  {
    step: 5,
    title: 'self-checking · Lab',
    desc: 'reference model 기반 자동 판정 · $error · 실습 4종 (순서 무관).',
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

        {/* 2행 블록을 세로 중앙에 배치 — 카드는 내용 높이에 맞춤 */}
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
