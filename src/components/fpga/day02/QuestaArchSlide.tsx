'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Day 02 — Questa 제품군 아키텍처 슬라이드
 * 3개 주요 제품(Lint / Sim / Formal)과 과정 내 위치를 얕게 소개
 */

const products = [
  {
    name: 'Questa Lint',
    nameEn: 'Static Analysis',
    month: 'Month 1',
    color: '#4A6FA5',
    bgColor: 'rgba(74,111,165,0.07)',
    borderColor: 'rgba(74,111,165,0.25)',
    isCurrent: true,
    desc: 'RTL 소스를 실행하지 않고 코드를 분석하여 설계 결함, 코딩 규칙 위반, CDC 문제를 조기에 검출합니다.',
    checks: ['Syntax / Semantic 오류', 'Structural 설계 결함', 'Coding Style 규칙', 'CDC (Clock Domain Crossing)'],
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="6" y="8" width="24" height="28" rx="4" stroke="#4A6FA5" strokeWidth="2" fill="rgba(74,111,165,0.08)" />
        <line x1="12" y1="16" x2="24" y2="16" stroke="#4A6FA5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="12" y1="21" x2="20" y2="21" stroke="#4A6FA5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="12" y1="26" x2="22" y2="26" stroke="#E8913A" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="33" cy="33" r="7" stroke="#4A6FA5" strokeWidth="2" fill="none" />
        <line x1="38" y1="38" x2="42" y2="42" stroke="#4A6FA5" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'QuestaSim',
    nameEn: 'Dynamic Verification',
    month: 'Month 2',
    color: '#5B8C5A',
    bgColor: 'rgba(91,140,90,0.07)',
    borderColor: 'rgba(91,140,90,0.22)',
    isCurrent: false,
    desc: 'RTL을 실제로 실행(시뮬레이션)하여 기능 동작을 검증하고, 테스트벤치 커버리지를 측정합니다.',
    checks: ['RTL 기능 시뮬레이션', 'Testbench 작성 & 실행', 'Coverage 분석', 'Timing 분석'],
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="4" y="8" width="36" height="24" rx="4" stroke="#5B8C5A" strokeWidth="2" fill="rgba(91,140,90,0.08)" />
        <polyline points="10,26 14,18 18,24 22,14 26,22 30,18 34,20" stroke="#5B8C5A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="36" x2="34" y2="36" stroke="#5B8C5A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <line x1="16" y1="32" x2="16" y2="36" stroke="#5B8C5A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <line x1="28" y1="32" x2="28" y2="36" stroke="#5B8C5A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
  {
    name: 'Questa Formal',
    nameEn: 'Formal Verification',
    month: 'Month 3',
    color: '#8B6FA5',
    bgColor: 'rgba(139,111,165,0.07)',
    borderColor: 'rgba(139,111,165,0.22)',
    isCurrent: false,
    desc: '수학적 증명(Model Checking)으로 모든 가능한 동작을 검증합니다. Safety-Critical 인증에 필수입니다.',
    checks: ['Property Checking', 'Equivalence Check', 'Formal Coverage', 'V&V 리포트 생성'],
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 6l16 8v12c0 8-7 14-16 18C15 40 6 34 6 26V14L22 6z" stroke="#8B6FA5" strokeWidth="2" fill="rgba(139,111,165,0.08)" />
        <path d="M15 22l5 5 9-10" stroke="#8B6FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function QuestaArchSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Questa Product Suite"
          title="Questa 제품군 아키텍처"
          subtitle="3개 핵심 도구와 과정 내 학습 순서"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* 3개 제품 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', flex: 1, minHeight: 0 }}>
            {products.map((p) => (
              <div key={p.name} style={{
                background: p.isCurrent
                  ? `linear-gradient(135deg, ${p.bgColor}, rgba(74,111,165,0.14))`
                  : `linear-gradient(135deg, ${p.bgColor}, ${p.bgColor})`,
                border: `1.5px solid ${p.borderColor}`,
                borderTop: `3px solid ${p.color}`,
                borderRadius: '14px',
                padding: '1.2rem',
                boxShadow: p.isCurrent ? shadow.cardHover : shadow.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                position: 'relative',
              }}>
                {p.isCurrent && (
                  <div style={{
                    position: 'absolute',
                    top: '-1px',
                    right: '12px',
                    background: p.color,
                    color: '#fff',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: '0 0 6px 6px',
                    letterSpacing: '0.06em',
                  }}>
                    현재 학습
                  </div>
                )}

                {/* 아이콘 + 제품명 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  {p.icon}
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: p.color, letterSpacing: '-0.02em' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: FPGA.textLight, fontFamily: 'monospace' }}>
                      {p.nameEn}
                    </div>
                  </div>
                </div>

                {/* Month 배지 */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: `${p.color}15`,
                  border: `1px solid ${p.color}30`,
                  borderRadius: '6px',
                  padding: '2px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: p.color,
                  width: 'fit-content',
                  fontFamily: 'monospace',
                }}>
                  {p.month}
                </div>

                {/* 설명 */}
                <p style={{ fontSize: '0.8rem', color: FPGA.text, lineHeight: 1.6, margin: 0 }}>
                  {p.desc}
                </p>

                {/* 검사 항목 */}
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.76rem', color: FPGA.textLight, lineHeight: 1.9 }}>
                  {p.checks.map((c) => (
                    <li key={c} style={{ color: p.isCurrent ? FPGA.text : FPGA.textLight }}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 하단 플로우 배너 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.7)',
            border: `1px solid ${FPGA.border}`,
            borderRadius: '10px',
            padding: '0.65rem 1.5rem',
            boxShadow: shadow.card,
          }}>
            <span style={{ fontSize: '0.78rem', color: FPGA.textLight, fontWeight: 600 }}>분석 흐름:</span>
            {[
              { label: 'RTL 작성', color: FPGA.textLight },
              { label: 'Questa Lint', color: '#4A6FA5' },
              { label: 'QuestaSim', color: '#5B8C5A' },
              { label: 'Questa Formal', color: '#8B6FA5' },
              { label: 'V&V Report', color: FPGA.accent },
            ].map((item, i, arr) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: item.color,
                  fontFamily: 'monospace',
                  background: `${item.color}10`,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${item.color}25`,
                }}>{item.label}</span>
                {i < arr.length - 1 && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h8M8 4l3 3-3 3" stroke={FPGA.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
