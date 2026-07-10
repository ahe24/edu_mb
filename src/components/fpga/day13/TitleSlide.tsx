'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

const DAY13 = '#087F5B';

export default function TitleSlide() {
  return (
    <section data-background-color="#E6F4EF">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          <defs>
            <pattern id="d13Grid" width="90" height="44" patternUnits="userSpaceOnUse">
              {/* 파형 + 체크 — assertion 감시 느낌 */}
              <path d="M0 22 H12 V10 H26 V34 H40 V10 H54 V22 H90" stroke={DAY13} strokeWidth="0.9" fill="none" />
              <path d="M66 22 l4 5 8 -10" stroke={DAY13} strokeWidth="1.1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#d13Grid)" />
        </svg>

        {/* 좌상단 — 계층화 TB 블록 */}
        <svg style={{ position: 'absolute', top: '48px', left: '54px', opacity: 0.13 }} width="300" height="120" viewBox="0 0 300 120">
          {[
            { x: 6, label: 'driver', c: DAY13 },
            { x: 110, label: 'DUT', c: '#4A6FA5' },
            { x: 214, label: 'monitor', c: DAY13 },
          ].map((b) => (
            <g key={b.label}>
              <rect x={b.x} y={30} width="80" height="32" rx="6" stroke={b.c} strokeWidth="1.6" fill={`${b.c}14`} />
              <text x={b.x + 40} y={50} fontSize="10" fontWeight="800" fill={b.c} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>{b.label}</text>
            </g>
          ))}
          <path d="M86 46 H110 M194 46 H214" stroke={DAY13} strokeWidth="1.6" />
          <rect x="110" y="84" width="80" height="26" rx="6" stroke="#E8913A" strokeWidth="1.4" fill="rgba(232,145,58,0.08)" />
          <text x="150" y="101" fontSize="9" fontWeight="800" fill="#E8913A" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>scoreboard</text>
          <path d="M254 62 Q 254 97, 190 97" stroke="#E8913A" strokeWidth="1.4" fill="none" />
        </svg>

        {/* 우하단 — assert property 시퀀스 */}
        <svg style={{ position: 'absolute', bottom: '42px', right: '54px', opacity: 0.11 }} width="280" height="100" viewBox="0 0 280 100">
          <text x="8" y="26" fontSize="11" fontWeight="700" fill={DAY13} fontFamily='"JetBrains Mono", monospace'>assert property (</text>
          <text x="30" y="46" fontSize="11" fontWeight="700" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>req |-&gt; ##[1:3] ack</text>
          <text x="8" y="66" fontSize="11" fontWeight="700" fill={DAY13} fontFamily='"JetBrains Mono", monospace'>);</text>
          <path d="M180 80 l6 8 12 -16" stroke="#48BB78" strokeWidth="2.4" fill="none" />
        </svg>

        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', background: `radial-gradient(circle, ${DAY13}18 0%, transparent 70%)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(74,111,165,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: DAY13,
            background: 'rgba(255,255,255,0.92)',
            border: `1.5px solid ${DAY13}40`,
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: `0 2px 12px ${DAY13}28, 0 4px 16px rgba(0,0,0,0.08)`,
          }}>
            MONTH 2 · WEEK 7 · DAY 13
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
          재사용 Testbench 구조 · SVA Assertion 기초<br />
          <span style={{ color: DAY13 }}>driver · monitor · scoreboard + assert property</span>
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
          모놀리식 TB를 역할별 모듈로 분해 + 속성 기반 상시 감시 · bind 비침습 결합
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
            { label: '실습', value: '4 (순서 무관)' },
            { label: 'TB 구조', value: 'driver · monitor · scoreboard' },
            { label: '검증', value: 'SVA 7속성 + bind' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['driver / monitor', 'scoreboard', 'assert property', '|-> · ##N', '$past · $rose', 'bind', 'fault injection']} />
        </div>
      </div>
    </section>
  );
}
