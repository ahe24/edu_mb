'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY05 = '#C05621';

const scenarios = [
  { phase: 'SIM', color: '#4A6FA5', label: 'Simulation 통과', desc: 'testbench coverage 100% 달성' },
  { phase: '▼',   color: '#718096', label: 'Synthesis',        desc: '합성 도구가 해당 구문 무시 or 다른 회로 생성' },
  { phase: 'HW',  color: DAY05,     label: '보드 불량',          desc: '실기 장비에서만 거동 차이 발견' },
];

const impactCards = [
  {
    level: 'CRITICAL',
    title: '검증 무효',
    body: '시뮬 대상과 합성 회로 불일치 → V&V 증빙 불인정 · 테스트 커버리지 의미 소실',
  },
  {
    level: 'HIGH',
    title: '설계 재작업',
    body: '실기 장비에서만 발견 → 수개월 일정 손실 · 납기·원가 직결',
  },
  {
    level: 'CRITICAL',
    title: '감사 지적',
    body: '근본 원인 미식별 시 CAPA 반복 지적 · DO-254 DAL-A/B 인증 차단 사유',
  },
];

function LevelBadge({ level }: { level: string }) {
  const col = level === 'CRITICAL' ? '#E53E3E' : '#E8913A';
  return (
    <span style={{
      fontSize: '0.58rem', fontWeight: 800, color: col,
      background: `${col}15`, border: `1px solid ${col}40`,
      padding: '2px 8px', borderRadius: '999px',
      letterSpacing: '0.08em',
      fontFamily: '"JetBrains Mono", monospace',
    }}>{level}</span>
  );
}

export default function WhyMismatchSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Day 05 · 도입"
          title="Sim-Synth Mismatch 리스크"
          subtitle="왜 Day 05가 필요한가 — safety-critical 감사 관점"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>
          {/* 좌: 시나리오 흐름 */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY05}08, ${DAY05}14)`,
            border: `1px solid ${DAY05}30`,
            borderRadius: '14px',
            padding: '1.1rem 1.2rem',
            boxShadow: shadow.card,
            display: 'flex', flexDirection: 'column', gap: '0.7rem',
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: DAY05, marginBottom: '0.2rem', letterSpacing: '0.04em' }}>
              ● 발생 시나리오
            </div>

            {scenarios.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.7rem',
                background: FPGA.white,
                border: `1px solid ${s.color}30`,
                borderLeft: `3px solid ${s.color}`,
                borderRadius: '8px',
                padding: '0.5rem 0.8rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: '44px', height: '28px',
                  background: `${s.color}15`, border: `1.5px solid ${s.color}`,
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 800, color: s.color,
                  fontFamily: '"JetBrains Mono", monospace',
                  flexShrink: 0,
                }}>{s.phase}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: FPGA.dark }}>{s.label}</div>
                  <div style={{ fontSize: '0.7rem', color: FPGA.textLight, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: '0.4rem',
              padding: '0.6rem 0.8rem',
              background: 'rgba(229,62,62,0.06)',
              border: '1px solid rgba(229,62,62,0.25)',
              borderRadius: '8px',
              fontSize: '0.72rem',
              color: FPGA.text,
              lineHeight: 1.55,
            }}>
              <strong style={{ color: '#E53E3E' }}>핵심: </strong>
              커버리지 100% 달성해도 실제 로직과 다른 대상 검증 → DO-254 DAL-A / IEC 60880 Cat-A 등급에서 치명적.
            </div>
          </div>

          {/* 우: 영향 카드 3장 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: FPGA.dark, letterSpacing: '0.04em' }}>
              ▶ safety-critical 3대 영향
            </div>
            {impactCards.map((c, i) => (
              <div key={i} style={{
                background: `linear-gradient(135deg, ${DAY05}08, ${DAY05}03)`,
                border: `1px solid ${DAY05}25`,
                borderLeft: `4px solid ${DAY05}`,
                borderRadius: '12px',
                padding: '0.8rem 1rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.35rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = shadow.cardHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = shadow.card;
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LevelBadge level={c.level} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: FPGA.dark }}>{c.title}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: FPGA.text, lineHeight: 1.6 }}>
                  {c.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
