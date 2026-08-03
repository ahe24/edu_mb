'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

const DAY14 = '#0B7285';

export default function TitleSlide() {
  return (
    <section data-background-color="#E4F1F4">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          <defs>
            <pattern id="d14Grid" width="46" height="46" patternUnits="userSpaceOnUse">
              {/* 커버리지 셀 격자 — hit/miss 매트릭스 느낌 */}
              <rect x="6" y="6" width="34" height="34" rx="4" stroke={DAY14} strokeWidth="0.9" fill="none" />
              <path d="M14 23 l6 6 12 -14" stroke={DAY14} strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#d14Grid)" />
        </svg>

        {/* 좌상단 — 커버리지 막대(부분 채움) */}
        <svg style={{ position: 'absolute', top: '52px', left: '54px', opacity: 0.14 }} width="300" height="118" viewBox="0 0 300 118">
          {[
            { y: 6, label: 'stmt', pct: 96, c: '#48BB78' },
            { y: 34, label: 'branch', pct: 68, c: '#E8913A' },
            { y: 62, label: 'cond', pct: 54, c: '#E8913A' },
            { y: 90, label: 'fsm', pct: 80, c: DAY14 },
          ].map((b) => (
            <g key={b.label}>
              <text x="0" y={b.y + 14} fontSize="9" fontWeight="800" fill={DAY14} fontFamily='"JetBrains Mono", monospace'>{b.label}</text>
              <rect x="52" y={b.y + 4} width="230" height="12" rx="6" fill="#CBD5E1" />
              <rect x="52" y={b.y + 4} width={230 * b.pct / 100} height="12" rx="6" fill={b.c} />
            </g>
          ))}
        </svg>

        {/* 우하단 — coverage 명령 */}
        <svg style={{ position: 'absolute', bottom: '46px', right: '54px', opacity: 0.11 }} width="290" height="92" viewBox="0 0 290 92">
          <text x="6" y="24" fontSize="11" fontWeight="700" fill={DAY14} fontFamily='"JetBrains Mono", monospace'>vopt +cover=bcesf</text>
          <text x="6" y="46" fontSize="11" fontWeight="700" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>vsim -coverage</text>
          <text x="6" y="68" fontSize="11" fontWeight="700" fill={DAY14} fontFamily='"JetBrains Mono", monospace'>coverage save .ucdb</text>
        </svg>

        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', background: `radial-gradient(circle, ${DAY14}18 0%, transparent 70%)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(74,111,165,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: DAY14,
            background: 'rgba(255,255,255,0.92)',
            border: `1.5px solid ${DAY14}40`,
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: `0 2px 12px ${DAY14}28, 0 4px 16px rgba(0,0,0,0.08)`,
          }}>
            MONTH 2 · WEEK 7 · DAY 14
          </span>
        </div>

        <h1 style={{
          color: FPGA.dark,
          fontSize: '2.9rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.25,
          textAlign: 'center',
          margin: '0 0 1.1rem',
        }}>
          코드 커버리지 측정 · 커버리지 클로저<br />
          <span style={{ color: DAY14 }}>statement · branch · condition · FSM coverage</span>
        </h1>

        <h3 style={{
          color: FPGA.textLight,
          fontSize: '1.3rem',
          fontWeight: 400,
          textAlign: 'center',
          margin: '0 0 2.5rem',
          fontFamily: 'monospace',
          letterSpacing: '-0.02em',
        }}>
          커버리지 수집 · 홀 보강 · 회귀 병합 · 도달불가 제외
        </h3>

        <div style={{
          display: 'inline-flex',
          gap: '2.4rem',
          background: 'rgba(255,255,255,0.88)',
          padding: '1rem 2.8rem',
          borderRadius: '16px',
          boxShadow: shadow.card,
          border: '1px solid #E2E8F0',
          marginBottom: '2.5rem',
        }}>
          {[
            { label: '실습', value: '4 (순서 무관)' },
            { label: '도구', value: 'QuestaSim · vcover' },
            { label: '판단', value: '검증 종료(클로저)' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['+cover=bcesf', 'statement · branch', 'condition · FSM', 'UCDB', 'vcover merge', 'coverage exclude', '커버리지 클로저']} />
        </div>
      </div>
    </section>
  );
}
