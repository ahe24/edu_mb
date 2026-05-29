'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

/**
 * Day 04 타이틀 슬라이드
 * 커스텀 규칙 설정 및 예외 처리
 */
export default function TitleSlide() {
  return (
    <section data-background-color="#F4F7FA">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* 회로 그리드 */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.055 }}>
          <defs>
            <pattern id="policyGrid4" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M0 32h20 M44 32h20 M32 0v20 M32 44v20" stroke="#4A6FA5" strokeWidth="1.2" fill="none" />
              <rect x="28" y="28" width="8" height="8" rx="1.5" stroke="#E8913A" strokeWidth="1.2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#policyGrid4)" />
        </svg>

        {/* 좌상단 — 필터 / 정책 아이콘 (순수 장식) */}
        <svg style={{ position: 'absolute', top: '40px', left: '48px', opacity: 0.06 }} width="230" height="200" viewBox="0 0 230 200">
          {/* 깔때기(필터) */}
          <path d="M15 25 L95 25 L70 70 L70 130 L55 145 L55 70 Z" stroke="#4A6FA5" strokeWidth="2.5" fill="rgba(74,111,165,0.06)" />
          {/* 위반 도트 들어가기 */}
          <circle cx="30" cy="18" r="3" fill="#E53E3E" />
          <circle cx="50" cy="15" r="3" fill="#E8913A" />
          <circle cx="70" cy="18" r="3" fill="#8B6FA5" />
          <circle cx="85" cy="15" r="3" fill="#E53E3E" />
          {/* 필터 아래 체크 */}
          <circle cx="62" cy="170" r="18" stroke="#48BB78" strokeWidth="2" fill="rgba(72,187,120,0.08)" />
          <path d="M54 170l6 6 12-12" stroke="#48BB78" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* 오른쪽 waiver 티켓 (텍스트 제거 — 순수 장식) */}
          <rect x="130" y="40" width="90" height="24" rx="4" stroke="#E8913A" strokeWidth="2" fill="rgba(232,145,58,0.06)" />
          <line x1="140" y1="52" x2="210" y2="52" stroke="#E8913A" strokeWidth="1.2" strokeDasharray="3 2" />
          <rect x="130" y="75" width="90" height="24" rx="4" stroke="#8B6FA5" strokeWidth="2" fill="rgba(139,111,165,0.06)" />
          <line x1="140" y1="87" x2="210" y2="87" stroke="#8B6FA5" strokeWidth="1.2" strokeDasharray="3 2" />
          <rect x="130" y="110" width="90" height="24" rx="4" stroke="#48BB78" strokeWidth="2" fill="rgba(72,187,120,0.06)" />
          <line x1="140" y1="122" x2="210" y2="122" stroke="#48BB78" strokeWidth="1.2" strokeDasharray="3 2" />
        </svg>

        {/* 우하단 — Layered Goals (장식, 카드와 겹치지 않도록 위치/투명도 조정) */}
        <svg style={{ position: 'absolute', bottom: '24px', right: '45px', opacity: 0.05 }} width="320" height="98" viewBox="0 0 360 110">
          <rect x="0" y="25" width="100" height="36" rx="7" stroke="#4A6FA5" strokeWidth="2" fill="rgba(74,111,165,0.08)" />
          <text x="50" y="38" textAnchor="middle" fill="#4A6FA5" fontSize="9" fontFamily='"JetBrains Mono", "Pretendard", sans-serif' fontWeight="700">Base Goal</text>
          <text x="50" y="53" textAnchor="middle" fill="#4A6FA5" fontSize="9" fontFamily='"JetBrains Mono", "Pretendard", sans-serif' fontWeight="700">release</text>
          <path d="M102 43h16" stroke="#4A6FA5" strokeWidth="1.8" />
          <path d="M114 39l4 4-4 4" stroke="#4A6FA5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <rect x="120" y="25" width="100" height="36" rx="7" stroke="#8B6FA5" strokeWidth="2" fill="rgba(139,111,165,0.08)" />
          <text x="170" y="38" textAnchor="middle" fill="#8B6FA5" fontSize="9" fontFamily='"JetBrains Mono", "Pretendard", sans-serif' fontWeight="700">Project</text>
          <text x="170" y="53" textAnchor="middle" fill="#8B6FA5" fontSize="9" fontFamily='"JetBrains Mono", "Pretendard", sans-serif' fontWeight="700">Preference</text>
          <path d="M222 43h16" stroke="#4A6FA5" strokeWidth="1.8" />
          <path d="M234 39l4 4-4 4" stroke="#4A6FA5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <rect x="240" y="25" width="110" height="36" rx="7" stroke="#E8913A" strokeWidth="2" fill="rgba(232,145,58,0.08)" />
          <text x="295" y="38" textAnchor="middle" fill="#E8913A" fontSize="9" fontFamily='"JetBrains Mono", "Pretendard", sans-serif' fontWeight="700">Waivers</text>
          <text x="295" y="53" textAnchor="middle" fill="#E8913A" fontSize="9" fontFamily='"JetBrains Mono", "Pretendard", sans-serif' fontWeight="700">+ Audit</text>
        </svg>

        {/* Glow */}
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '320px', height: '320px',
          background: 'radial-gradient(circle, rgba(232,145,58,0.07) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '260px', height: '260px',
          background: 'radial-gradient(circle, rgba(74,111,165,0.07) 0%, transparent 70%)',
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
            WEEK 2 · DAY 04
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
          커스텀 규칙 설정<br />
          <span style={{ color: FPGA.primary }}>및 예외 처리</span>
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
          Policy File · Custom Goal · Waiver Strategy · Audit Trail
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
            { label: '정책 계층', value: '3 Layers' },
            { label: 'Waiver 방식', value: '4가지' },
            { label: '감사 대응', value: 'DO-254' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['Policy File', 'Custom Goal', 'Waiver', 'Pragma', 'RTL ID', 'Audit Trail', 'DO-254']} />
        </div>
      </div>
    </section>
  );
}
