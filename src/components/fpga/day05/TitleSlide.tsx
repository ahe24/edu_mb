'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

const DAY05 = '#C05621';

export default function TitleSlide() {
  return (
    <section data-background-color="#FAF5F0">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.055 }}>
          <defs>
            <pattern id="mmGrid5" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M0 32h20 M44 32h20 M32 0v20 M32 44v20" stroke={DAY05} strokeWidth="1.2" fill="none" />
              <rect x="28" y="28" width="8" height="8" rx="1.5" stroke="#4A6FA5" strokeWidth="1.2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mmGrid5)" />
        </svg>

        {/* 좌상단 — sim ≠ synth 비교 그래픽 */}
        <svg style={{ position: 'absolute', top: '48px', left: '56px', opacity: 0.07 }} width="240" height="170" viewBox="0 0 240 170">
          {/* sim 파형 */}
          <text x="4" y="16" fontSize="11" fontWeight="700" fill="#4A6FA5" fontFamily="monospace">SIM</text>
          <path d="M30 22h24v-12h24v12h24v-12h24v12h24" stroke="#4A6FA5" strokeWidth="2" fill="none" />
          {/* ≠ */}
          <text x="110" y="60" fontSize="24" fontWeight="900" fill={DAY05} fontFamily="monospace">≠</text>
          {/* synth 파형 */}
          <text x="4" y="100" fontSize="11" fontWeight="700" fill={DAY05} fontFamily="monospace">SYNTH</text>
          <path d="M30 106h24v-12h24v-12h24v24h24v-24h24" stroke={DAY05} strokeWidth="2" fill="none" />
          {/* warning */}
          <circle cx="200" cy="140" r="18" stroke="#E53E3E" strokeWidth="2" fill="rgba(229,62,62,0.08)" />
          <text x="200" y="147" textAnchor="middle" fontSize="16" fontWeight="800" fill="#E53E3E" fontFamily="monospace">!</text>
        </svg>

        {/* 우하단 — 합성 불가 구문 아이콘 */}
        <svg style={{ position: 'absolute', bottom: '28px', right: '48px', opacity: 0.06 }} width="320" height="95" viewBox="0 0 320 95">
          {[
            { x: 0,   t: 'initial' },
            { x: 85,  t: '#delay' },
            { x: 170, t: '$display' },
            { x: 250, t: 'force' },
          ].map((k) => (
            <g key={k.t}>
              <rect x={k.x} y="30" width="70" height="30" rx="5" stroke={DAY05} strokeWidth="2" fill={`${DAY05}12`} />
              <text x={k.x + 35} y="50" textAnchor="middle" fontSize="9" fontWeight="800" fill={DAY05} fontFamily="monospace">{k.t}</text>
              <line x1={k.x + 8} y1="38" x2={k.x + 62} y2="52" stroke="#E53E3E" strokeWidth="1.5" opacity="0.8" />
            </g>
          ))}
        </svg>

        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', background: `radial-gradient(circle, ${DAY05}12 0%, transparent 70%)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(74,111,165,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: DAY05,
            background: 'rgba(255,255,255,0.88)',
            border: `1.5px solid ${DAY05}40`,
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: `0 2px 12px ${DAY05}25, 0 4px 16px rgba(0,0,0,0.08)`,
          }}>
            WEEK 3 · DAY 05
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
          합성 불가 구문<br />
          <span style={{ color: DAY05 }}>· Sim-Synth Mismatch 검출</span>
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
          Unsynthesizable · Race · Blocking/NB · DO-254 CP · SS
        </h3>

        <div style={{
          display: 'inline-flex',
          gap: '2.4rem',
          background: 'rgba(255,255,255,0.85)',
          padding: '1rem 2.8rem',
          borderRadius: '16px',
          boxShadow: shadow.card,
          border: '1px solid #E2E8F0',
          marginBottom: '2.5rem',
        }}>
          {[
            { label: '합성 불가 카탈로그', value: '4 Cat · 20건' },
            { label: 'DO-254 alias', value: 'CP · SS 10건' },
            { label: '실습 결함', value: '12건 → 0' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['Unsynthesizable', 'Sim-Synth Mismatch', 'Race', 'Blocking/NB', 'CP15/17/18', 'SS3/SS6', 'DO-254']} />
        </div>
      </div>
    </section>
  );
}
