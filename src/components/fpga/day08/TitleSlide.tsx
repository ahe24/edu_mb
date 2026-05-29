'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

const DAY08 = '#0E7C7B';

export default function TitleSlide() {
  return (
    <section data-background-color="#EBF6F5">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          <defs>
            <pattern id="d8Grid" width="60" height="40" patternUnits="userSpaceOnUse">
              {/* CDC Checks 테이블 느낌 */}
              <rect x="0" y="0" width="60" height="40" fill="none" stroke={DAY08} strokeWidth="0.6" />
              <rect x="0" y="0" width="14" height="40" fill={DAY08} fillOpacity="0.10" />
              <circle cx="22" cy="20" r="2.5" fill="#E53E3E" />
              <circle cx="35" cy="20" r="2.5" fill="#E8913A" />
              <circle cx="48" cy="20" r="2.5" fill="#48BB78" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#d8Grid)" />
        </svg>

        {/* 좌상단 — Violation/Caution/Eval 색 점 */}
        <svg style={{ position: 'absolute', top: '40px', left: '52px', opacity: 0.10 }} width="260" height="200" viewBox="0 0 260 200">
          {/* Tree 구조 — CDC Checks 윈도우 시뮬레이션 */}
          <text x="10" y="22" fontSize="11" fontWeight="800" fill={DAY08} fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>▼ Violations (5)</text>
          <text x="20" y="42" fontSize="9" fontWeight="700" fill="#E53E3E" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>● no_sync · 3</text>
          <text x="20" y="58" fontSize="9" fontWeight="700" fill="#E53E3E" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>● combo_logic · 1</text>
          <text x="20" y="74" fontSize="9" fontWeight="700" fill="#E53E3E" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>● multi_bits · 1</text>
          <text x="10" y="98" fontSize="11" fontWeight="800" fill={DAY08} fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>▼ Evaluations (4)</text>
          <text x="20" y="118" fontSize="9" fontWeight="700" fill="#48BB78" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>● bus_two_dff · 2</text>
          <text x="20" y="134" fontSize="9" fontWeight="700" fill="#48BB78" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>● pulse_sync · 1</text>
          <text x="20" y="150" fontSize="9" fontWeight="700" fill="#48BB78" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>● fifo · 1</text>
          <text x="10" y="174" fontSize="11" fontWeight="800" fill={DAY08} fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>▼ Proven (1)</text>
          <text x="20" y="194" fontSize="9" fontWeight="700" fill="#48BB78" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>● two_dff · 1</text>
        </svg>

        {/* 우하단 — schematic 시뮬레이션 */}
        <svg style={{ position: 'absolute', bottom: '30px', right: '50px', opacity: 0.08 }} width="290" height="130" viewBox="0 0 290 130">
          {/* TX flop */}
          <rect x="10" y="50" width="50" height="30" rx="3" stroke={DAY08} strokeWidth="1.5" fill="rgba(14,124,123,0.10)" />
          <text x="35" y="68" fontSize="10" fontWeight="700" fill={DAY08} textAnchor="middle" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>TX</text>
          {/* Bad arrow */}
          <path d="M60 65 L200 65" stroke="#E53E3E" strokeWidth="2" strokeDasharray="4 3" />
          <path d="M194 60 L206 65 L194 70" stroke="#E53E3E" strokeWidth="2" fill="none" />
          <text x="125" y="55" fontSize="9" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>no_sync</text>
          {/* RX flop */}
          <rect x="210" y="50" width="50" height="30" rx="3" stroke="#4A6FA5" strokeWidth="1.5" fill="rgba(74,111,165,0.10)" />
          <text x="235" y="68" fontSize="10" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>RX</text>
        </svg>

        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', background: `radial-gradient(circle, ${DAY08}18 0%, transparent 70%)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(8,145,178,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: DAY08,
            background: 'rgba(255,255,255,0.92)',
            border: `1.5px solid ${DAY08}40`,
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: `0 2px 12px ${DAY08}28, 0 4px 16px rgba(0,0,0,0.08)`,
          }}>
            WEEK 4 · DAY 08
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
          CDC 분석 실습 및 결과 해석<br />
          <span style={{ color: DAY08 }}>Run · Debug · Fix · Sign-off</span>
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
          의도된 3종 버그 검출 → 디버그 → 수정 → status.tcl 으로 V&V 산출물화
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
            { label: '검출 violation', value: '5 ↓ 0' },
            { label: '디버그 사례', value: '3 schemes' },
            { label: '산출물', value: 'cdc.db + status.tcl' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['no_sync', 'multi_bits', 'combo_logic', 'GUI Debug', 'Waiver', 'status.tcl']} />
        </div>
      </div>
    </section>
  );
}
