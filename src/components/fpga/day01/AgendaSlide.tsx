'use client';

import { FPGA, slideBg, styles, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Day 01 Agenda — 카드 + 플로우 화살표 형태
 * 시간 표기 없이 학습 흐름을 시각적으로 표현
 */
const agenda = [
  {
    step: 1,
    title: '교육 과정 소개',
    desc: '3개월 커리큘럼 전체 구조와 학습 목표를 이해합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="4" stroke="#4A6FA5" strokeWidth="1.8" fill="rgba(74,111,165,0.08)" />
        <path d="M9 10h10M9 14h7M9 18h4" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#4A6FA5',
  },
  {
    step: 2,
    title: 'Safety-Critical FPGA 프로세스 및 인허가 요건',
    desc: '안전 등급 분류, V&V 절차, 인허가 요구사항을 학습합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#5B8C5A" strokeWidth="1.8" fill="rgba(91,140,90,0.08)" />
        <path d="M14 8v6l4 3" stroke="#5B8C5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: '#5B8C5A',
  },
  {
    step: 3,
    title: '정적 분석 vs 동적 검증',
    desc: 'FPGA 검증 방법론 전체에서 각 기법의 역할과 위치를 파악합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="6" width="10" height="16" rx="2" stroke="#8B6FA5" strokeWidth="1.8" fill="rgba(139,111,165,0.08)" />
        <rect x="15" y="6" width="10" height="16" rx="2" stroke="#E8913A" strokeWidth="1.8" fill="rgba(232,145,58,0.08)" />
        <path d="M13 14h2" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#8B6FA5',
  },
  {
    step: 4,
    title: 'Q&A 및 실습 환경 확인',
    desc: 'Questa 라이선스, 네트워크 설정 등 실습 환경을 점검합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="3" stroke="#E8913A" strokeWidth="1.8" fill="rgba(232,145,58,0.08)" />
        <path d="M10 14l3 3 5-6" stroke="#E8913A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: '#E8913A',
    isLab: true,
  },
];

export default function AgendaSlide() {
  return (
    <section data-background-color={slideBg}>
      <SlideHeader title="오늘의 학습 흐름" />

      {/* 카드 플로우 */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: '0px',
        width: '100%',
      }}>
        {agenda.map((item, i) => (
          <div key={item.step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {/* 카드 */}
            <div style={{
              flex: 1,
              background: `linear-gradient(135deg, ${item.color}06, ${item.color}10)`,
              border: `1px solid ${item.color}25`,
              borderTop: `3px solid ${item.color}`,
              borderRadius: '14px',
              padding: '1.2rem 1.1rem',
              boxShadow: shadow.card,
              position: 'relative',
            }}>
              {/* 스텝 번호 + 아이콘 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.7rem' }}>
                {item.icon}
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.7rem', fontWeight: 700,
                  color: item.color,
                  background: `${item.color}12`,
                  border: `1px solid ${item.color}25`,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.06em',
                }}>STEP {item.step}</span>
                {item.isLab && (
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    background: `${FPGA.accent}15`,
                    color: FPGA.accent,
                    border: `1px solid ${FPGA.accent}30`,
                    padding: '1px 7px', borderRadius: '4px',
                  }}>실습</span>
                )}
              </div>

              {/* 제목 */}
              <div style={{
                fontSize: '0.92rem', fontWeight: 700, color: FPGA.dark,
                marginBottom: '0.4rem', lineHeight: 1.3,
              }}>{item.title}</div>

              {/* 설명 */}
              <div style={{ fontSize: '0.78rem', color: FPGA.textLight, lineHeight: 1.5 }}>
                {item.desc}
              </div>
            </div>

            {/* 화살표 (마지막 아이템 제외) */}
            {i < agenda.length - 1 && (
              <div style={{ padding: '0 6px', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h10M11 6l4 4-4 4" stroke={FPGA.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
