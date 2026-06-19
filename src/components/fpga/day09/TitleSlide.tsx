'use client';

import { FPGA, shadow } from '../FpgaSlideStyles';
import KeywordTag from '../KeywordTag';

const DAY09 = '#2E8B57';

export default function TitleSlide() {
  return (
    <section data-background-color="#ECF7F0">
      {/* ── 배경 그래픽 레이어 ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          <defs>
            <pattern id="d9Grid" width="64" height="44" patternUnits="userSpaceOnUse">
              {/* 조합논리 게이트 느낌 */}
              <rect x="0" y="0" width="64" height="44" fill="none" stroke={DAY09} strokeWidth="0.6" />
              <path d="M14 14 h12 a8 8 0 0 1 0 16 h-12 z" fill="none" stroke={DAY09} strokeWidth="1" />
              <circle cx="40" cy="22" r="3" fill={DAY09} fillOpacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#d9Grid)" />
        </svg>

        {/* 좌상단 — 스위치→LED 매핑 시뮬레이션 */}
        <svg style={{ position: 'absolute', top: '46px', left: '54px', opacity: 0.11 }} width="240" height="170" viewBox="0 0 240 170">
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              {/* 스위치 */}
              <rect x="10" y={20 + i * 36} width="34" height="22" rx="3" stroke={DAY09} strokeWidth="1.4" fill="rgba(46,139,87,0.10)" />
              <text x="27" y={35 + i * 36} fontSize="9" fontWeight="700" fill={DAY09} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>sw{i}</text>
              {/* 연결선 */}
              <path d={`M44 ${31 + i * 36} L186 ${31 + i * 36}`} stroke={DAY09} strokeWidth="1.2" />
              {/* LED */}
              <circle cx="200" cy={31 + i * 36} r="9" stroke={DAY09} strokeWidth="1.4" fill={i % 2 === 0 ? 'rgba(46,139,87,0.45)' : 'none'} />
            </g>
          ))}
        </svg>

        {/* 우하단 — 파형 시뮬레이션 */}
        <svg style={{ position: 'absolute', bottom: '36px', right: '50px', opacity: 0.09 }} width="300" height="120" viewBox="0 0 300 120">
          <path d="M0 30 H40 V12 H100 V30 H160 V12 H220 V30 H300" stroke={DAY09} strokeWidth="2" fill="none" />
          <path d="M0 70 H70 V52 H130 V70 H190 V52 H250 V70 H300" stroke="#4A6FA5" strokeWidth="2" fill="none" />
          <path d="M0 105 H40 V90 H160 V105 H220 V90 H300" stroke="#E8913A" strokeWidth="2" fill="none" />
        </svg>

        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', background: `radial-gradient(circle, ${DAY09}18 0%, transparent 70%)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(74,111,165,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <div style={{ marginBottom: '2.2rem' }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: DAY09,
            background: 'rgba(255,255,255,0.92)',
            border: `1.5px solid ${DAY09}40`,
            padding: '7px 22px',
            borderRadius: '999px',
            letterSpacing: '0.12em',
            boxShadow: `0 2px 12px ${DAY09}28, 0 4px 16px rgba(0,0,0,0.08)`,
          }}>
            MONTH 2 · WEEK 5 · DAY 09
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
          QuestaSim·Visualizer 환경 및 조합논리 설계<br />
          <span style={{ color: DAY09 }}>Design → Simulate → Verify</span>
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
          RTL 직접 작성 · 시뮬레이션 검증 · 파형 분석 — Month 2 시작
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
            { label: '설계 예제', value: 'sw→LED · 4:1 MUX' },
            { label: '도구', value: 'QuestaSim · Visualizer' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: FPGA.textLight, letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KeywordTag keywords={['vlib/vlog/vsim', 'always @*', 'assign', 'case', 'self-checking TB', 'Arty-7']} />
        </div>
      </div>
    </section>
  );
}
