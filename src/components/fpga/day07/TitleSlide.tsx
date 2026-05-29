'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

const DAY07 = '#0891B2';

export default function TitleSlide() {
  return (
    <section data-background-color="#EEF8FA">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.055 }}>
          <defs>
            <pattern id="cdcGrid" width="72" height="36" patternUnits="userSpaceOnUse">
              {/* 두 가지 클럭 주파수 시각화 */}
              <path d="M0 12 L9 12 L9 4 L18 4 L18 12 L27 12 L27 4 L36 4 L36 12 L72 12" stroke={DAY07} strokeWidth="1" fill="none" />
              <path d="M0 28 L6 28 L6 20 L18 20 L18 28 L24 28 L24 20 L36 20 L36 28 L72 28" stroke="#4A6FA5" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cdcGrid)" />
        </svg>

        {/* 좌상단 — 두 도메인 + 화살표 */}
        <svg style={{ position: 'absolute', top: '40px', left: '48px', opacity: 0.10 }} width="280" height="180" viewBox="0 0 280 180">
          {/* TX 도메인 박스 */}
          <rect x="10" y="40" width="100" height="80" rx="10" stroke={DAY07} strokeWidth="2.5" fill="rgba(8,145,178,0.06)" />
          <text x="60" y="36" textAnchor="middle" fontSize="11" fontWeight="800" fill={DAY07} fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>CLK_A</text>
          <circle cx="60" cy="80" r="14" stroke={DAY07} strokeWidth="2" fill="rgba(8,145,178,0.10)" />
          <text x="60" y="85" textAnchor="middle" fontSize="10" fontWeight="800" fill={DAY07} fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>TX</text>

          {/* RX 도메인 박스 */}
          <rect x="170" y="40" width="100" height="80" rx="10" stroke="#4A6FA5" strokeWidth="2.5" fill="rgba(74,111,165,0.06)" />
          <text x="220" y="36" textAnchor="middle" fontSize="11" fontWeight="800" fill="#4A6FA5" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>CLK_B</text>
          <circle cx="220" cy="80" r="14" stroke="#4A6FA5" strokeWidth="2" fill="rgba(74,111,165,0.10)" />
          <text x="220" y="85" textAnchor="middle" fontSize="10" fontWeight="800" fill="#4A6FA5" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>RX</text>

          {/* 크로싱 화살표 */}
          <path d="M76 80 L204 80" stroke="#E53E3E" strokeWidth="2.5" strokeDasharray="4 3" />
          <path d="M198 75 L210 80 L198 85" stroke="#E53E3E" strokeWidth="2.5" fill="none" />
          <text x="140" y="72" textAnchor="middle" fontSize="9" fontWeight="800" fill="#E53E3E" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>CDC ?</text>
        </svg>

        {/* 우하단 — 메타스테이블 파형 */}
        <svg style={{ position: 'absolute', bottom: '30px', right: '50px', opacity: 0.08 }} width="280" height="120" viewBox="0 0 280 120">
          {/* 클럭 */}
          <path d="M0 30 L20 30 L20 10 L40 10 L40 30 L60 30 L60 10 L80 10 L80 30 L100 30 L100 10 L120 10 L120 30 L280 30" stroke={DAY07} strokeWidth="1.5" fill="none" />
          <text x="10" y="48" fontSize="9" fontWeight="700" fill={DAY07} fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>CLK</text>

          {/* D 입력 (불안정한 천이) */}
          <path d="M0 80 L60 80 L62 60 L80 60 L80 80 L130 80" stroke="#4A6FA5" strokeWidth="1.5" fill="none" />
          {/* 메타스테이블 zone (흔들리는 라인) */}
          <path d="M130 70 Q135 75 140 70 Q145 60 150 70 Q155 75 160 70" stroke="#E53E3E" strokeWidth="2" fill="none" />
          <path d="M160 70 L280 60" stroke="#4A6FA5" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
          <text x="135" y="100" fontSize="9" fontWeight="800" fill="#E53E3E" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>META</text>
        </svg>

        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', background: `radial-gradient(circle, ${DAY07}14 0%, transparent 70%)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(74,111,165,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: DAY07,
            background: 'rgba(255,255,255,0.92)',
            border: `1.5px solid ${DAY07}40`,
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: `0 2px 12px ${DAY07}28, 0 4px 16px rgba(0,0,0,0.08)`,
          }}>
            WEEK 4 · DAY 07
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
          CDC 기초 이론 및 Questa CDC 소개<br />
          <span style={{ color: DAY07 }}>Clock Domain Crossing · Metastability · Synchronizer</span>
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
          시뮬레이션으로 잡히지 않는 비동기 영역 — 정적 분석으로 안전 critical 검증
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
            { label: '도메인', value: '3 async clocks' },
            { label: 'Scheme', value: '6 종' },
            { label: '검증 레이어', value: 'Static + SVA + FX' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['Metastability', '2-DFF', 'Async FIFO', 'DMUX', 'Reconvergence', 'qverify']} />
        </div>
      </div>
    </section>
  );
}
