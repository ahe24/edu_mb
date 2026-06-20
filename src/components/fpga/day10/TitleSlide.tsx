'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

const DAY10 = '#1B998B';

export default function TitleSlide() {
  return (
    <section data-background-color="#E9F6F4">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          <defs>
            <pattern id="d10Grid" width="60" height="40" patternUnits="userSpaceOnUse">
              {/* 클럭 + 플립플롭 느낌 */}
              <path d="M0 28 L8 28 L8 12 L20 12 L20 28 L28 28 L28 12 L40 12 L40 28 L60 28" stroke={DAY10} strokeWidth="1" fill="none" />
              <rect x="44" y="6" width="12" height="14" rx="2" fill="none" stroke={DAY10} strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#d10Grid)" />
        </svg>

        {/* 좌상단 — counter 증가 시퀀스 */}
        <svg style={{ position: 'absolute', top: '48px', left: '54px', opacity: 0.11 }} width="250" height="150" viewBox="0 0 250 150">
          {['0000', '0001', '0010', '0011', '0100'].map((v, i) => (
            <g key={v}>
              <rect x={10 + i * 47} y="60" width="40" height="30" rx="4" stroke={DAY10} strokeWidth="1.4" fill="rgba(27,153,139,0.08)" />
              <text x={30 + i * 47} y="80" fontSize="11" fontWeight="700" fill={DAY10} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>{v}</text>
              {i < 4 && <path d={`M50 ${75} h${47 - 40}`} stroke={DAY10} strokeWidth="1.2" />}
            </g>
          ))}
          <text x="10" y="45" fontSize="9" fontWeight="700" fill={DAY10} fontFamily='"JetBrains Mono", monospace'>posedge clk →</text>
        </svg>

        {/* 우하단 — blinker 토글 파형 */}
        <svg style={{ position: 'absolute', bottom: '38px', right: '52px', opacity: 0.09 }} width="300" height="100" viewBox="0 0 300 100">
          <path d="M0 60 H10 V20 H20 V60 H30 V20 H40 V60 H50 V20 H60 V60 H300" stroke="#4A6FA5" strokeWidth="1.5" fill="none" />
          <path d="M0 85 H80 V40 H160 V85 H240 V40 H300" stroke={DAY10} strokeWidth="2.2" fill="none" />
          <text x="0" y="14" fontSize="9" fontWeight="700" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>clk</text>
        </svg>

        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', background: `radial-gradient(circle, ${DAY10}18 0%, transparent 70%)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(74,111,165,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: DAY10,
            background: 'rgba(255,255,255,0.92)',
            border: `1.5px solid ${DAY10}40`,
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: `0 2px 12px ${DAY10}28, 0 4px 16px rgba(0,0,0,0.08)`,
          }}>
            MONTH 2 · WEEK 5 · DAY 10
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
          순차논리 설계 및 self-checking TB<br />
          <span style={{ color: DAY10 }}>Clock · Reset · Register</span>
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
          클럭 동기 순차회로 설계 + 기대값 모델 기반 자동 판정 TB
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
            { label: '실습', value: '4종 (순서 무관)' },
            { label: '설계 예제', value: 'blinker · counter · debounce' },
            { label: '검증', value: 'reference model TB' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['always @(posedge clk)', '동기 리셋', 'parameter', '2FF sync', 'reference model', '$error']} />
        </div>
      </div>
    </section>
  );
}
