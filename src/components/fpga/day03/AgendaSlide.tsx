'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const agenda = [
  {
    step: 1,
    title: 'FPGA Methodology Goals',
    desc: 'Start → Simulation → Release 3단계 체크 강도 진행과 Xilinx / Intel 등 벤더별 Goal 차이를 이해합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="14" width="5" height="10" rx="2" stroke="#4A6FA5" strokeWidth="1.8" fill="rgba(74,111,165,0.10)" />
        <rect x="11" y="9" width="5" height="15" rx="2" stroke="#4A6FA5" strokeWidth="1.8" fill="rgba(74,111,165,0.14)" />
        <rect x="19" y="4" width="5" height="20" rx="2" stroke="#4A6FA5" strokeWidth="1.8" fill="rgba(74,111,165,0.20)" />
        <path d="M3 24h22" stroke="#4A6FA5" strokeWidth="1.2" opacity="0.4" />
      </svg>
    ),
    color: '#4A6FA5',
  },
  {
    step: 2,
    title: 'Clock · Assignment 핵심 룰',
    desc: '클록 게이팅·내부 클록·비동기 리셋 / blocking vs non-blocking 할당 규칙을 코드 예제로 학습합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9" stroke="#E53E3E" strokeWidth="1.8" fill="rgba(229,62,62,0.07)" />
        <path d="M14 8v6l4 2" stroke="#E53E3E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 14h2M22 14h2M14 4v2M14 22v2" stroke="#E53E3E" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    color: '#E53E3E',
  },
  {
    step: 3,
    title: 'Structural · FSM 핵심 룰',
    desc: '콤보 루프·래치 추론·다중 구동·case default / FSM 리셋·Dead-end·Unreachable 상태 검출을 학습합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="8" width="8" height="6" rx="2" stroke="#8B6FA5" strokeWidth="1.8" fill="rgba(139,111,165,0.10)" />
        <rect x="16" y="8" width="8" height="6" rx="2" stroke="#8B6FA5" strokeWidth="1.8" fill="rgba(139,111,165,0.10)" />
        <rect x="10" y="18" width="8" height="6" rx="2" stroke="#8B6FA5" strokeWidth="1.8" fill="rgba(139,111,165,0.15)" />
        <path d="M8 14v4h6M20 14v4h-6" stroke="#8B6FA5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#8B6FA5',
  },
  {
    step: 4,
    title: 'DO-254 매핑',
    desc: 'Coding Practices(CP) · Design Reviews(DR) · Safe Synthesis(SS) 카테고리와 Questa Lint 체크 alias 체계를 파악합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="14" height="18" rx="3" stroke="#5B8C5A" strokeWidth="1.8" fill="rgba(91,140,90,0.08)" />
        <path d="M8 9h6M8 13h8M8 17h5" stroke="#5B8C5A" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="20" cy="18" r="5" stroke="#5B8C5A" strokeWidth="1.5" fill="rgba(91,140,90,0.15)" />
        <path d="M17.5 18l1.5 1.5 3-3" stroke="#5B8C5A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: '#5B8C5A',
  },
  {
    step: 5,
    title: '룰 커스터마이징',
    desc: 'lint preference · lint off · lint report item 으로 Goal을 프로젝트 요건에 맞게 조정하고 Waiver를 관리합니다.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="6" stroke="#E8913A" strokeWidth="1.8" fill="rgba(232,145,58,0.08)" />
        <path d="M14 8v2M14 18v2M8 14H6M22 14h-2" stroke="#E8913A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9.76 9.76l1.42 1.42M16.82 16.82l1.42 1.42M9.76 18.24l1.42-1.42M16.82 11.18l1.42-1.42" stroke="#E8913A" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
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
                background: `linear-gradient(135deg, ${item.color}06, ${item.color}12)`,
                border: `1px solid ${item.color}25`,
                borderTop: `3px solid ${item.color}`,
                borderRadius: '14px',
                padding: '1.1rem 0.9rem',
                boxShadow: shadow.card,
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.6rem' }}>
                  {item.icon}
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
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.35rem', lineHeight: 1.3 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: FPGA.textLight, lineHeight: 1.5 }}>
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
