'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

const DAY12 = '#177E89';

export default function TitleSlide() {
  return (
    <section data-background-color="#E7F4F5">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          <defs>
            <pattern id="d12Grid" width="80" height="40" patternUnits="userSpaceOnUse">
              {/* UART frame 비트 느낌 */}
              <path d="M0 20 H10 V30 H20 V10 H30 V30 H40 V10 H50 V20 H80" stroke={DAY12} strokeWidth="0.9" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#d12Grid)" />
        </svg>

        {/* 좌상단 — UART frame 구조 */}
        <svg style={{ position: 'absolute', top: '50px', left: '54px', opacity: 0.12 }} width="280" height="120" viewBox="0 0 280 120">
          <path d="M6 40 H30 V70 H54 V40 V70 H78 V40 V70 H102 V40 V70 H126 V40 H260"
                stroke={DAY12} strokeWidth="2" fill="none" />
          <text x="14" y="32" fontSize="8" fontWeight="700" fill="#E53E3E" fontFamily='"JetBrains Mono", monospace'>idle</text>
          <text x="40" y="88" fontSize="8" fontWeight="700" fill={DAY12} fontFamily='"JetBrains Mono", monospace'>start</text>
          <text x="78" y="32" fontSize="8" fontWeight="700" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>D0..D7</text>
          <text x="135" y="32" fontSize="8" fontWeight="700" fill="#48BB78" fontFamily='"JetBrains Mono", monospace'>stop</text>
        </svg>

        {/* 우하단 — TX/RX 화살표 */}
        <svg style={{ position: 'absolute', bottom: '40px', right: '54px', opacity: 0.10 }} width="260" height="100" viewBox="0 0 260 100">
          <rect x="8" y="34" width="56" height="32" rx="5" stroke={DAY12} strokeWidth="1.6" fill="rgba(23,126,137,0.08)" />
          <text x="36" y="54" fontSize="10" fontWeight="800" fill={DAY12} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>TX</text>
          <rect x="196" y="34" width="56" height="32" rx="5" stroke="#4A6FA5" strokeWidth="1.6" fill="rgba(74,111,165,0.08)" />
          <text x="224" y="54" fontSize="10" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>RX</text>
          <path d="M64 50 H196" stroke={DAY12} strokeWidth="1.6" markerEnd="url(#u12)" />
          <text x="130" y="42" fontSize="8" fill={DAY12} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>serial</text>
          <defs><marker id="u12" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={DAY12} /></marker></defs>
        </svg>

        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', background: `radial-gradient(circle, ${DAY12}18 0%, transparent 70%)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(74,111,165,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: DAY12,
            background: 'rgba(255,255,255,0.92)',
            border: `1.5px solid ${DAY12}40`,
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: `0 2px 12px ${DAY12}28, 0 4px 16px rgba(0,0,0,0.08)`,
          }}>
            MONTH 2 · WEEK 6 · DAY 12
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
          UART 통신 설계 및 프로토콜 검증<br />
          <span style={{ color: DAY12 }}>TX · RX · Loopback</span>
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
          비동기 직렬 프레임 송수신 설계 + scoreboard 기반 프로토콜 검증
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
            { label: '설계 예제', value: 'TX · RX · Loopback' },
            { label: '검증', value: 'scoreboard TB' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['start/data/stop', 'baud generator', '16× oversample', 'shift register', '2FF sync', 'scoreboard']} />
        </div>
      </div>
    </section>
  );
}
