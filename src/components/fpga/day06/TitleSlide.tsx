'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

const DAY06 = '#6B46C1';

export default function TitleSlide() {
  return (
    <section data-background-color="#F7F4FB">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
          <defs>
            <pattern id="latentGrid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M0 32h20 M44 32h20 M32 0v20 M32 44v20" stroke={DAY06} strokeWidth="1.2" fill="none" />
              <circle cx="32" cy="32" r="3" stroke="#4A6FA5" strokeWidth="1.2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#latentGrid)" />
        </svg>

        {/* 좌상단 — latent bug 돋보기 */}
        <svg style={{ position: 'absolute', top: '44px', left: '52px', opacity: 0.08 }} width="230" height="200" viewBox="0 0 230 200">
          <circle cx="80" cy="80" r="50" stroke={DAY06} strokeWidth="3" fill="rgba(107,70,193,0.06)" />
          <line x1="118" y1="118" x2="155" y2="160" stroke={DAY06} strokeWidth="5" strokeLinecap="round" />
          {/* 내부: latch */}
          <text x="80" y="70" textAnchor="middle" fontSize="10" fontWeight="800" fill={DAY06} fontFamily="monospace">latch</text>
          <text x="80" y="85" textAnchor="middle" fontSize="10" fontWeight="800" fill={DAY06} fontFamily="monospace">case?</text>
          <text x="80" y="100" textAnchor="middle" fontSize="10" fontWeight="800" fill={DAY06} fontFamily="monospace">width</text>
        </svg>

        {/* 우하단 — FSM 다이어그램 */}
        <svg style={{ position: 'absolute', bottom: '30px', right: '52px', opacity: 0.06 }} width="280" height="120" viewBox="0 0 280 130">
          <circle cx="30"  cy="65" r="22" stroke={DAY06} strokeWidth="2" fill="rgba(107,70,193,0.08)" />
          <circle cx="110" cy="35" r="22" stroke={DAY06} strokeWidth="2" fill="rgba(107,70,193,0.08)" />
          <circle cx="110" cy="95" r="22" stroke="#E53E3E" strokeWidth="2" strokeDasharray="4 2" fill="rgba(229,62,62,0.06)" />
          <circle cx="200" cy="65" r="22" stroke={DAY06} strokeWidth="2" fill="rgba(107,70,193,0.08)" />
          <text x="30"  y="70" textAnchor="middle" fontSize="11" fontWeight="800" fill={DAY06} fontFamily="monospace">S0</text>
          <text x="110" y="40" textAnchor="middle" fontSize="11" fontWeight="800" fill={DAY06} fontFamily="monospace">S1</text>
          <text x="110" y="100" textAnchor="middle" fontSize="11" fontWeight="800" fill="#E53E3E" fontFamily="monospace">??</text>
          <text x="200" y="70" textAnchor="middle" fontSize="11" fontWeight="800" fill={DAY06} fontFamily="monospace">S2</text>
          <path d="M52 60 L92 40" stroke={DAY06} strokeWidth="1.5" />
          <path d="M132 40 L180 58" stroke={DAY06} strokeWidth="1.5" />
        </svg>

        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', background: `radial-gradient(circle, ${DAY06}14 0%, transparent 70%)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(74,111,165,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: DAY06,
            background: 'rgba(255,255,255,0.88)',
            border: `1.5px solid ${DAY06}40`,
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: `0 2px 12px ${DAY06}28, 0 4px 16px rgba(0,0,0,0.08)`,
          }}>
            WEEK 3 · DAY 06
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
          잠재적 설계 오류 식별<br />
          <span style={{ color: DAY06 }}>Latch · Case · Width · X · FSM</span>
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
          문법 합성 OK · 회로 거동 NG — DO-254 SS4 · SS2 · CP7 · SS17/18 · CP5/6
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
            { label: '잠재 오류 축', value: '5 Axes' },
            { label: 'DO-254 alias', value: 'CP5~7 · SS2/4/17/18' },
            { label: '실습 결함', value: '15건 → 0' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['Latch Inference', 'Case', 'Width', 'X-Propagation', 'FSM Safety', 'DO-254']} />
        </div>
      </div>
    </section>
  );
}
