'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

/**
 * Day 01 타이틀 슬라이드
 * 회로 패턴 + 파형 그래픽 + FPGA 칩 아이콘으로 기술적 분위기 연출
 */
export default function TitleSlide() {
  return (
    <section data-background-color="#F4F7FA">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        {/* 회로 패턴 그리드 */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          <defs>
            <pattern id="circuitGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M0 40h30 M50 40h30 M40 0v30 M40 50v30" stroke="#4A6FA5" strokeWidth="1.5" fill="none" />
              <circle cx="40" cy="40" r="3" fill="#4A6FA5" />
              <circle cx="0" cy="40" r="2" fill="#4A6FA5" />
              <circle cx="80" cy="40" r="2" fill="#4A6FA5" />
              <circle cx="40" cy="0" r="2" fill="#4A6FA5" />
              <circle cx="40" cy="80" r="2" fill="#4A6FA5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuitGrid)" />
        </svg>

        {/* 좌상단 — FPGA 칩 실루엣 (핀을 직접 나열) */}
        <svg style={{ position: 'absolute', top: '40px', left: '50px', opacity: 0.08 }} width="200" height="200" viewBox="0 0 200 200">
          <rect x="40" y="40" width="120" height="120" rx="8" stroke="#4A6FA5" strokeWidth="3" fill="none" />
          <rect x="55" y="55" width="90" height="90" rx="4" stroke="#4A6FA5" strokeWidth="1.5" fill="rgba(74,111,165,0.05)" />
          {/* 핀 상 */}
          <line x1="60" y1="40" x2="60" y2="15" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="80" y1="40" x2="80" y2="15" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="100" y1="40" x2="100" y2="15" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="120" y1="40" x2="120" y2="15" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="140" y1="40" x2="140" y2="15" stroke="#4A6FA5" strokeWidth="2" />
          {/* 핀 하 */}
          <line x1="60" y1="160" x2="60" y2="185" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="80" y1="160" x2="80" y2="185" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="100" y1="160" x2="100" y2="185" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="120" y1="160" x2="120" y2="185" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="140" y1="160" x2="140" y2="185" stroke="#4A6FA5" strokeWidth="2" />
          {/* 핀 좌 */}
          <line x1="40" y1="60" x2="15" y2="60" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="40" y1="80" x2="15" y2="80" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="40" y1="100" x2="15" y2="100" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="40" y1="120" x2="15" y2="120" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="40" y1="140" x2="15" y2="140" stroke="#4A6FA5" strokeWidth="2" />
          {/* 핀 우 */}
          <line x1="160" y1="60" x2="185" y2="60" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="160" y1="80" x2="185" y2="80" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="160" y1="100" x2="185" y2="100" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="160" y1="120" x2="185" y2="120" stroke="#4A6FA5" strokeWidth="2" />
          <line x1="160" y1="140" x2="185" y2="140" stroke="#4A6FA5" strokeWidth="2" />
        </svg>

        {/* 우하단 — 디지털 파형 */}
        <svg style={{ position: 'absolute', bottom: '50px', right: '40px', opacity: 0.10 }} width="320" height="140" viewBox="0 0 320 140">
          <text x="0" y="18" fill="#4A6FA5" fontSize="11" fontFamily="monospace" fontWeight="600">CLK</text>
          <polyline points="35,25 35,5 55,5 55,25 75,25 75,5 95,5 95,25 115,25 115,5 135,5 135,25 155,25 155,5 175,5 175,25 195,25 195,5 215,5 215,25 235,25 235,5 255,5 255,25 275,25 275,5 295,5 295,25" stroke="#4A6FA5" strokeWidth="2" fill="none" />
          <text x="0" y="58" fill="#5B8C5A" fontSize="11" fontFamily="monospace" fontWeight="600">DATA</text>
          <polyline points="35,65 55,65 55,45 95,45 95,65 115,65 115,45 175,45 175,65 195,65 195,45 235,45 235,65 295,65" stroke="#5B8C5A" strokeWidth="2" fill="none" />
          <text x="0" y="98" fill="#8B6FA5" fontSize="11" fontFamily="monospace" fontWeight="600">VALID</text>
          <polyline points="35,105 75,105 75,85 135,85 135,105 175,105 175,85 255,85 255,105 295,105" stroke="#8B6FA5" strokeWidth="2" fill="none" />
          <text x="0" y="133" fill="#E8913A" fontSize="11" fontFamily="monospace" fontWeight="600">READY</text>
          <polyline points="35,135 95,135 95,120 115,120 115,135 195,135 195,120 215,120 215,135 295,135" stroke="#E8913A" strokeWidth="2" fill="none" />
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
          background: 'radial-gradient(circle, rgba(139,111,165,0.06) 0%, transparent 70%)',
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
            WEEK 1 · DAY 01
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
          전체 과정 소개 및<br />
          <span style={{ color: FPGA.primary }}>Safety-Critical FPGA 검증 프레임워크</span>
        </h1>

        <h3 style={{
          color: FPGA.textLight,
          fontSize: '1.5rem',
          fontWeight: 400,
          textAlign: 'center',
          margin: '0 0 3rem',
          fontFamily: 'monospace',
          letterSpacing: '-0.02em',
        }}>
          Orientation &amp; Safety-Critical FPGA Verification Framework
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
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>교육 기간</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>3개월 · 12주</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>총 시간</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>84시간 (24회)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>1일 시간</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>3.5시간</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['V&V', 'IEC 62566', 'IEEE 603', 'Safety-Critical', 'Questa']} />
        </div>
      </div>
    </section>
  );
}
