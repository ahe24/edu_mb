'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

/**
 * Day 03 타이틀 슬라이드
 * Questa Lint: 코딩 규칙 및 가이드라인 검증
 */
export default function TitleSlide() {
  return (
    <section data-background-color="#F4F7FA">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* 회로 패턴 그리드 */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.055 }}>
          <defs>
            <pattern id="ruleGrid3" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 30h18 M42 30h18 M30 0v18 M30 42v18" stroke="#4A6FA5" strokeWidth="1.2" fill="none" />
              <circle cx="30" cy="30" r="2.5" fill="#4A6FA5" />
              <rect x="8" y="8" width="8" height="8" rx="1" stroke="#E8913A" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ruleGrid3)" />
        </svg>

        {/* 좌상단 — 룰북 아이콘 */}
        <svg style={{ position: 'absolute', top: '35px', left: '45px', opacity: 0.09 }} width="220" height="200" viewBox="0 0 220 200">
          {/* 책 */}
          <rect x="10" y="20" width="90" height="120" rx="6" stroke="#4A6FA5" strokeWidth="2.5" fill="none" />
          <line x1="55" y1="20" x2="55" y2="140" stroke="#4A6FA5" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* 룰 라인들 */}
          <line x1="20" y1="45" x2="48" y2="45" stroke="#E8913A" strokeWidth="2.5" />
          <line x1="20" y1="58" x2="48" y2="58" stroke="#4A6FA5" strokeWidth="1.5" />
          <line x1="20" y1="71" x2="48" y2="71" stroke="#4A6FA5" strokeWidth="1.5" />
          <line x1="20" y1="84" x2="48" y2="84" stroke="#48BB78" strokeWidth="2" />
          <line x1="20" y1="97" x2="48" y2="97" stroke="#4A6FA5" strokeWidth="1.5" />
          <line x1="65" y1="45" x2="90" y2="45" stroke="#4A6FA5" strokeWidth="1.5" />
          <line x1="65" y1="58" x2="90" y2="58" stroke="#E53E3E" strokeWidth="2" />
          <line x1="65" y1="71" x2="90" y2="71" stroke="#4A6FA5" strokeWidth="1.5" />
          {/* 체크마크 */}
          <circle cx="160" cy="80" r="38" stroke="#48BB78" strokeWidth="2.5" fill="rgba(72,187,120,0.05)" />
          <path d="M142 80l12 14 24-24" stroke="#48BB78" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>

        {/* 우하단 — DO-254 / FPGA Methodology 레이블 */}
        <svg style={{ position: 'absolute', bottom: '45px', right: '40px', opacity: 0.10 }} width="360" height="100" viewBox="0 0 360 100">
          <rect x="0" y="15" width="100" height="36" rx="7" stroke="#4A6FA5" strokeWidth="2" fill="rgba(74,111,165,0.08)" />
          <text x="50" y="28" textAnchor="middle" fill="#4A6FA5" fontSize="9" fontFamily="monospace" fontWeight="700">FPGA</text>
          <text x="50" y="43" textAnchor="middle" fill="#4A6FA5" fontSize="9" fontFamily="monospace" fontWeight="700">Methodology</text>
          <path d="M102 33h16" stroke="#4A6FA5" strokeWidth="1.8" />
          <path d="M114 29l4 4-4 4" stroke="#4A6FA5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <rect x="120" y="15" width="100" height="36" rx="7" stroke="#8B6FA5" strokeWidth="2" fill="rgba(139,111,165,0.08)" />
          <text x="170" y="28" textAnchor="middle" fill="#8B6FA5" fontSize="9" fontFamily="monospace" fontWeight="700">DO-254</text>
          <text x="170" y="43" textAnchor="middle" fill="#8B6FA5" fontSize="9" fontFamily="monospace" fontWeight="700">Based Checks</text>
          <path d="M222 33h16" stroke="#4A6FA5" strokeWidth="1.8" />
          <path d="M234 29l4 4-4 4" stroke="#4A6FA5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <rect x="240" y="15" width="110" height="36" rx="7" stroke="#E8913A" strokeWidth="2" fill="rgba(232,145,58,0.08)" />
          <text x="295" y="28" textAnchor="middle" fill="#E8913A" fontSize="9" fontFamily="monospace" fontWeight="700">Customization</text>
          <text x="295" y="43" textAnchor="middle" fill="#E8913A" fontSize="9" fontFamily="monospace" fontWeight="700">&amp; Waiver</text>
        </svg>

        {/* Glow 효과 */}
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '320px', height: '320px',
          background: 'radial-gradient(circle, rgba(74,111,165,0.07) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '260px', height: '260px',
          background: 'radial-gradient(circle, rgba(139,111,165,0.07) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: FPGA.primary,
            background: 'rgba(255,255,255,0.88)',
            border: '1.5px solid rgba(107,140,199,0.28)',
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: '0 2px 12px rgba(74,111,165,0.15), 0 4px 16px rgba(0,0,0,0.08)',
          }}>
            WEEK 2 · DAY 03
          </span>
        </div>

        <h1 style={{
          color: FPGA.dark,
          fontSize: '3rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.25,
          textAlign: 'center',
          margin: '0 0 1.1rem',
        }}>
          Questa Lint<br />
          <span style={{ color: FPGA.primary }}>코딩 규칙 및 가이드라인 검증</span>
        </h1>

        <h3 style={{
          color: FPGA.textLight,
          fontSize: '1.35rem',
          fontWeight: 400,
          textAlign: 'center',
          margin: '0 0 2.8rem',
          fontFamily: 'monospace',
          letterSpacing: '-0.02em',
        }}>
          FPGA Methodology Goals · DO-254 Checks · Rule Customization
        </h3>

        <div style={{
          display: 'inline-flex',
          gap: '2.4rem',
          background: 'rgba(255,255,255,0.82)',
          padding: '1rem 2.8rem',
          borderRadius: '16px',
          boxShadow: shadow.card,
          border: '1px solid #E2E8F0',
          marginBottom: '2.5rem',
        }}>
          {[
            { label: '룰 카테고리', value: '4가지' },
            { label: '핵심 체크', value: '15+ rules' },
            { label: '표준 매핑', value: 'DO-254' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['FPGA Methodology', 'DO-254', 'Coding Rules', 'lint preference', 'Waiver', 'FSM Safety']} />
        </div>
      </div>
    </section>
  );
}
