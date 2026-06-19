'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

const DAY11 = '#3D8361';

export default function TitleSlide() {
  return (
    <section data-background-color="#EAF4EE">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          <defs>
            <pattern id="d11Grid" width="70" height="50" patternUnits="userSpaceOnUse">
              {/* 상태 노드 + 천이 화살표 느낌 */}
              <circle cx="18" cy="25" r="9" fill="none" stroke={DAY11} strokeWidth="0.9" />
              <circle cx="52" cy="25" r="9" fill="none" stroke={DAY11} strokeWidth="0.9" />
              <path d="M27 25 H43" stroke={DAY11} strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#d11Grid)" />
        </svg>

        {/* 좌상단 — 신호등 FSM 상태도 */}
        <svg style={{ position: 'absolute', top: '46px', left: '54px', opacity: 0.12 }} width="220" height="180" viewBox="0 0 220 180">
          {[
            { cx: 110, cy: 30, label: 'RED', c: '#E53E3E' },
            { cx: 175, cy: 120, label: 'GRN', c: '#48BB78' },
            { cx: 45, cy: 120, label: 'YEL', c: '#E8913A' },
          ].map((s) => (
            <g key={s.label}>
              <circle cx={s.cx} cy={s.cy} r="22" fill={`${s.c}18`} stroke={s.c} strokeWidth="1.8" />
              <text x={s.cx} y={s.cy + 4} fontSize="10" fontWeight="800" fill={s.c} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>{s.label}</text>
            </g>
          ))}
          <path d="M128 44 A70 70 0 0 1 168 100" fill="none" stroke={DAY11} strokeWidth="1.6" markerEnd="url(#a11)" />
          <path d="M158 138 A70 70 0 0 1 64 138" fill="none" stroke={DAY11} strokeWidth="1.6" markerEnd="url(#a11)" />
          <path d="M52 100 A70 70 0 0 1 92 44" fill="none" stroke={DAY11} strokeWidth="1.6" markerEnd="url(#a11)" />
          <defs>
            <marker id="a11" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0 0 L6 3 L0 6 z" fill={DAY11} />
            </marker>
          </defs>
        </svg>

        {/* 우하단 — PWM 듀티 파형 */}
        <svg style={{ position: 'absolute', bottom: '36px', right: '52px', opacity: 0.09 }} width="300" height="90" viewBox="0 0 300 90">
          <path d="M0 60 H20 V30 H30 V60 H100 V20 H120 V60 H190 V10 H230 V60 H300" stroke={DAY11} strokeWidth="2" fill="none" />
          <text x="0" y="80" fontSize="8" fill={DAY11} fontFamily='"JetBrains Mono", monospace'>duty ↑ → 밝기 ↑</text>
        </svg>

        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', background: `radial-gradient(circle, ${DAY11}18 0%, transparent 70%)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(74,111,165,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: DAY11,
            background: 'rgba(255,255,255,0.92)',
            border: `1.5px solid ${DAY11}40`,
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: `0 2px 12px ${DAY11}28, 0 4px 16px rgba(0,0,0,0.08)`,
          }}>
            MONTH 2 · WEEK 6 · DAY 11
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
          FSM 설계 및 상태 천이 검증<br />
          <span style={{ color: DAY11 }}>State · Transition · Coverage</span>
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
          상태로 동작을 설계하고, 모든 천이와 illegal state까지 검증한다
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
            { label: '실습', value: '4 (오전2·오후2)' },
            { label: '설계 예제', value: '신호등 · PWM · 시퀀스' },
            { label: '검증', value: '천이·corner case' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['state register', 'Moore/Mealy', 'full-case default', 'illegal state', 'PWM duty', 'state coverage']} />
        </div>
      </div>
    </section>
  );
}
