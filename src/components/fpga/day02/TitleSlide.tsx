'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

/**
 * Day 02 타이틀 슬라이드
 * Questa 도구 환경 설정 및 기본 사용법
 */
export default function TitleSlide() {
  return (
    <section data-background-color="#F4F7FA">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* 회로 패턴 그리드 */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          <defs>
            <pattern id="circuitGrid2" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M0 40h30 M50 40h30 M40 0v30 M40 50v30" stroke="#4A6FA5" strokeWidth="1.5" fill="none" />
              <circle cx="40" cy="40" r="3" fill="#4A6FA5" />
              <circle cx="0" cy="40" r="2" fill="#4A6FA5" />
              <circle cx="80" cy="40" r="2" fill="#4A6FA5" />
              <circle cx="40" cy="0" r="2" fill="#4A6FA5" />
              <circle cx="40" cy="80" r="2" fill="#4A6FA5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuitGrid2)" />
        </svg>

        {/* 좌상단 — Lint 검사 아이콘 (돋보기 + 코드) */}
        <svg style={{ position: 'absolute', top: '40px', left: '50px', opacity: 0.08 }} width="200" height="200" viewBox="0 0 200 200">
          {/* 코드 문서 */}
          <rect x="20" y="30" width="110" height="130" rx="8" stroke="#4A6FA5" strokeWidth="2.5" fill="none" />
          <line x1="38" y1="58" x2="112" y2="58" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="38" y1="74" x2="90" y2="74" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="38" y1="90" x2="105" y2="90" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="38" y1="106" x2="78" y2="106" stroke="#E8913A" strokeWidth="2.5" />
          <line x1="38" y1="122" x2="100" y2="122" stroke="#4A6FA5" strokeWidth="2" />
          {/* 돋보기 */}
          <circle cx="135" cy="130" r="30" stroke="#4A6FA5" strokeWidth="3" fill="none" />
          <circle cx="135" cy="130" r="18" stroke="#4A6FA5" strokeWidth="1.5" fill="rgba(74,111,165,0.05)" />
          <line x1="158" y1="153" x2="178" y2="173" stroke="#4A6FA5" strokeWidth="4" strokeLinecap="round" />
        </svg>

        {/* 우하단 — 파이프라인 흐름 */}
        <svg style={{ position: 'absolute', bottom: '50px', right: '40px', opacity: 0.10 }} width="340" height="80" viewBox="0 0 340 80">
          <rect x="0" y="20" width="70" height="36" rx="6" stroke="#4A6FA5" strokeWidth="2" fill="rgba(74,111,165,0.08)" />
          <text x="35" y="43" textAnchor="middle" fill="#4A6FA5" fontSize="11" fontFamily="monospace" fontWeight="700">RTL</text>
          <path d="M72 38h18" stroke="#4A6FA5" strokeWidth="2" />
          <path d="M86 33l6 5-6 5" stroke="#4A6FA5" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <rect x="92" y="20" width="90" height="36" rx="6" stroke="#E8913A" strokeWidth="2.5" fill="rgba(232,145,58,0.08)" />
          <text x="137" y="36" textAnchor="middle" fill="#E8913A" fontSize="10" fontFamily="monospace" fontWeight="700">Questa</text>
          <text x="137" y="50" textAnchor="middle" fill="#E8913A" fontSize="10" fontFamily="monospace" fontWeight="700">Lint</text>
          <path d="M184 38h18" stroke="#4A6FA5" strokeWidth="2" />
          <path d="M198 33l6 5-6 5" stroke="#4A6FA5" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <rect x="204" y="20" width="90" height="36" rx="6" stroke="#5B8C5A" strokeWidth="2" fill="rgba(91,140,90,0.08)" />
          <text x="249" y="36" textAnchor="middle" fill="#5B8C5A" fontSize="10" fontFamily="monospace" fontWeight="700">Lint</text>
          <text x="249" y="50" textAnchor="middle" fill="#5B8C5A" fontSize="10" fontFamily="monospace" fontWeight="700">Report</text>
        </svg>

        {/* Glow 효과 */}
        <div style={{
          position: 'absolute', bottom: '-50px', left: '-50px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(74,111,165,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(232,145,58,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: FPGA.primary,
            background: 'rgba(255,255,255,0.85)',
            border: '1.5px solid rgba(107,140,199,0.25)',
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: '0 2px 12px rgba(74,111,165,0.15), 0 4px 16px rgba(0,0,0,0.10)',
          }}>
            WEEK 1 · DAY 02
          </span>
        </div>

        <h1 style={{
          color: FPGA.dark,
          fontSize: '3rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.25,
          textAlign: 'center',
          margin: '0 0 1.2rem',
        }}>
          Questa 도구 환경 설정 및<br />
          <span style={{ color: FPGA.primary }}>기본 사용법</span>
        </h1>

        <h3 style={{
          color: FPGA.textLight,
          fontSize: '1.4rem',
          fontWeight: 400,
          textAlign: 'center',
          margin: '0 0 3rem',
          fontFamily: 'monospace',
          letterSpacing: '-0.02em',
        }}>
          Questa Product Suite Architecture &amp; First Lint Run
        </h3>

        <div style={{
          display: 'inline-flex',
          gap: '2rem',
          background: 'rgba(255,255,255,0.80)',
          padding: '1rem 2.5rem',
          borderRadius: '16px',
          boxShadow: shadow.card,
          border: '1px solid #E2E8F0',
          marginBottom: '2.5rem',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>주요 도구</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>Questa Lint</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>검사 유형</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>4가지 카테고리</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>단계</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>Month 1 · Week 1</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['Questa Lint', 'Project Setup', 'First Run', 'Lint Report', 'Static Analysis']} />
        </div>
      </div>
    </section>
  );
}
