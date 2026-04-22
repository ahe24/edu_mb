'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY05 = '#C05621';

const agenda = [
  {
    step: 1,
    title: 'Mismatch 리스크',
    desc: 'sim ≠ synth 시 감사 무효 · 재작업 비용 · 인허가 영향 정리.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L2 24h24L14 3z" stroke="#E53E3E" strokeWidth="1.8" fill="rgba(229,62,62,0.10)" />
        <path d="M14 11v6M14 20v1" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    color: '#E53E3E',
  },
  {
    step: 2,
    title: '합성 불가 카탈로그',
    desc: 'procedural · delay · system task · simulation artifact 4축 분류.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="5" width="9" height="8" rx="1.5" stroke={DAY05} strokeWidth="1.6" fill={`${DAY05}12`} />
        <rect x="16" y="5" width="9" height="8" rx="1.5" stroke={DAY05} strokeWidth="1.6" fill={`${DAY05}20`} />
        <rect x="3" y="16" width="9" height="8" rx="1.5" stroke={DAY05} strokeWidth="1.6" fill={`${DAY05}18`} />
        <rect x="16" y="16" width="9" height="8" rx="1.5" stroke={DAY05} strokeWidth="1.6" fill={`${DAY05}28`} />
      </svg>
    ),
    color: DAY05,
  },
  {
    step: 3,
    title: 'Blocking/NB 오용',
    desc: '`=` vs `<=` 4 패턴 — CP15·CP17·CP18·SS6 정확 매핑.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <text x="5" y="19" fontSize="14" fontWeight="800" fill="#4A6FA5" fontFamily="monospace">=</text>
        <text x="14" y="19" fontSize="14" fontWeight="800" fill={DAY05} fontFamily="monospace">&lt;=</text>
      </svg>
    ),
    color: '#4A6FA5',
  },
  {
    step: 4,
    title: 'Race & 매핑·Triage',
    desc: 'race 4패턴 · DO-254 alias 표 · 수정 vs waiver 판단 흐름.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="9" cy="10" r="4" stroke="#8B6FA5" strokeWidth="1.6" fill="rgba(139,111,165,0.12)" />
        <circle cx="19" cy="10" r="4" stroke="#8B6FA5" strokeWidth="1.6" fill="rgba(139,111,165,0.12)" />
        <path d="M14 14v4M10 20l4 2 4-2" stroke="#8B6FA5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#8B6FA5',
  },
  {
    step: 5,
    title: '실습 · 정리',
    desc: 'broken_rtl 12건 검출 → 수정 → DO-254 HTML 리포트 생성.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 7h20M4 14h20M4 21h14" stroke="#48BB78" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="22" cy="21" r="3.5" stroke="#48BB78" strokeWidth="1.5" fill="rgba(72,187,120,0.10)" />
        <path d="M20.5 21l1 1 2-2" stroke="#48BB78" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
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
