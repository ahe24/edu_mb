'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const agenda = [
  {
    step: 1,
    title: '정책 파일 구조',
    desc: '3계층 정책(Methodology Goal → Project Preference → Module Waiver)과 파일 레이아웃 설계.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="6" rx="1.5" stroke="#4A6FA5" strokeWidth="1.6" fill="rgba(74,111,165,0.10)" />
        <rect x="4" y="11.5" width="20" height="6" rx="1.5" stroke="#4A6FA5" strokeWidth="1.6" fill="rgba(74,111,165,0.14)" />
        <rect x="4" y="19" width="20" height="6" rx="1.5" stroke="#4A6FA5" strokeWidth="1.6" fill="rgba(74,111,165,0.20)" />
      </svg>
    ),
    color: '#4A6FA5',
  },
  {
    step: 2,
    title: 'lint preference 심화',
    desc: 'name·reset·clock·case·width 카테고리별 세부 옵션으로 체크 동작을 정밀 조정.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="4" stroke="#E8913A" strokeWidth="1.8" fill="rgba(232,145,58,0.10)" />
        <path d="M14 4v3M14 21v3M4 14h3M21 14h3M7 7l2 2M19 19l2 2M7 21l2-2M19 9l2-2" stroke="#E8913A" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    color: '#E8913A',
  },
  {
    step: 3,
    title: 'Custom Goal 생성',
    desc: 'lint generate goal로 release 기반 파생 Goal 작성 — 프로젝트·안전등급별 분리 운용.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#5B8C5A" strokeWidth="1.8" fill="rgba(91,140,90,0.08)" />
        <circle cx="14" cy="14" r="6" stroke="#5B8C5A" strokeWidth="1.5" fill="none" />
        <circle cx="14" cy="14" r="2.5" fill="#5B8C5A" />
      </svg>
    ),
    color: '#5B8C5A',
  },
  {
    step: 4,
    title: 'Waiver 4방식 비교',
    desc: 'Pragma · lint off · lint suppress · lint report item — 적용 범위·감사적합성 비교.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="6" width="11" height="16" rx="2" stroke="#8B6FA5" strokeWidth="1.6" fill="rgba(139,111,165,0.08)" />
        <rect x="14" y="6" width="11" height="16" rx="2" stroke="#8B6FA5" strokeWidth="1.6" fill="rgba(139,111,165,0.15)" />
        <path d="M7 11h4M7 15h3M18 11h4M18 15h3" stroke="#8B6FA5" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    color: '#8B6FA5',
  },
  {
    step: 5,
    title: '감사 추적 & 실습',
    desc: 'RTL ID 기반 status history, CI 기준선 diff, 512건 위반 triage 실습까지.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 7h20M4 14h20M4 21h14" stroke="#E53E3E" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="22" cy="21" r="3.5" stroke="#E53E3E" strokeWidth="1.5" fill="rgba(229,62,62,0.10)" />
        <path d="M20.5 21l1 1 2-2" stroke="#E53E3E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: '#E53E3E',
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
