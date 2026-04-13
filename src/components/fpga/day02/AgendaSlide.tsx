'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const agenda = [
  {
    step: 1,
    title: 'Questa 제품군 아키텍처',
    desc: 'Questa Lint · QuestaSim · Questa Formal의 역할과 과정 내 위치를 파악합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="8" width="8" height="12" rx="2" stroke="#4A6FA5" strokeWidth="1.8" fill="rgba(74,111,165,0.08)" />
        <rect x="13" y="5" width="8" height="18" rx="2" stroke="#5B8C5A" strokeWidth="1.8" fill="rgba(91,140,90,0.08)" />
        <rect x="23" y="10" width="2" height="8" rx="1" stroke="#8B6FA5" strokeWidth="1.5" fill="rgba(139,111,165,0.08)" />
        <path d="M11 14h2M21 14h2" stroke="#718096" strokeWidth="1.2" />
      </svg>
    ),
    color: '#4A6FA5',
  },
  {
    step: 2,
    title: 'Questa Lint 환경 설정',
    desc: '프로젝트 디렉토리 구성, RTL 파일 준비, 실행 스크립트 작성을 실습합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="3" stroke="#5B8C5A" strokeWidth="1.8" fill="rgba(91,140,90,0.08)" />
        <path d="M8 10h5M8 14h8M8 18h6" stroke="#5B8C5A" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="10" r="3" stroke="#5B8C5A" strokeWidth="1.5" fill="rgba(91,140,90,0.15)" />
        <path d="M18.5 10l1 1 2-2" stroke="#5B8C5A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: '#5B8C5A',
  },
  {
    step: 3,
    title: '첫 번째 Lint 실행',
    desc: 'questa_lint 명령어로 예제 RTL을 분석하고 콘솔 출력을 해석합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="5" width="22" height="18" rx="3" stroke="#8B6FA5" strokeWidth="1.8" fill="rgba(139,111,165,0.08)" />
        <path d="M7 10l3 3-3 3" stroke="#8B6FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="13" y1="16" x2="21" y2="16" stroke="#8B6FA5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#8B6FA5',
  },
  {
    step: 4,
    title: '결과 리포트 해석',
    desc: '4가지 Lint 검사 카테고리(Syntactic · Semantic · Structural · Stylistic)를 분석합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="13" r="8" stroke="#E8913A" strokeWidth="1.8" fill="rgba(232,145,58,0.08)" />
        <line x1="14" y1="9" x2="14" y2="13" stroke="#E8913A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="17" r="1.2" fill="#E8913A" />
        <path d="M6 22l3-3M22 22l-3-3" stroke="#E8913A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    color: '#E8913A',
    isLab: true,
  },
];

export default function AgendaSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader title="오늘의 학습 흐름" />

        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'stretch',
          gap: '0px',
          width: '100%',
        }}>
          {agenda.map((item, i) => (
            <div key={item.step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
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
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.4rem', lineHeight: 1.3 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: FPGA.textLight, lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>

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
      </div>
    </section>
  );
}
