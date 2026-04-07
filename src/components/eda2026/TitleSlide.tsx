'use client';

import { EDA } from './EdaSlideStyles';

export default function TitleSlide() {
  return (
    <section data-background-color="#0D1B2E" style={{ justifyContent: 'center' }}>
      {/* Decorative circuit grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(30,90,156,0.12) 1px, transparent 1px),
          linear-gradient(90deg, rgba(30,90,156,0.12) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* Gradient orbs */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '420px', height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,147,208,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: '320px', height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46,124,196,0.14) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content box */}
      <div style={{
        position: 'relative', zIndex: 2,
        margin: 'auto 0',
        background: 'rgba(27,43,75,0.88)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0,147,208,0.25)',
        borderRadius: '12px',
        padding: '4rem 5.5rem',
        textAlign: 'center',
        maxWidth: '820px',
        width: '100%',
        boxShadow: '0 16px 60px rgba(0,0,0,0.40)',
      }}>
        {/* Top label */}
        <div style={{
          color: 'rgba(180,200,230,0.80)',
          fontSize: '1.0rem',
          fontWeight: 600,
          letterSpacing: '0.22em',
          marginBottom: '2.2rem',
          textTransform: 'uppercase' as const,
        }}>
          E D A &nbsp; 사 업 부
        </div>

        {/* Main title */}
        <div style={{
          color: '#FFFFFF',
          fontSize: '2.8rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          marginBottom: '1.6rem',
        }}>
          FPGA/ASIC 검증 자동화 전략
        </div>

        {/* Divider */}
        <div style={{
          width: '100%',
          height: '1px',
          background: 'rgba(0,147,208,0.45)',
          margin: '1.8rem 0',
        }} />

        {/* Subtitle */}
        <div style={{
          color: 'rgba(200,215,235,0.90)',
          fontSize: '1.3rem',
          fontWeight: 400,
          marginBottom: '2.0rem',
        }}>
          2026년 사업 방향
        </div>

        {/* Author */}
        <div style={{
          color: 'rgba(160,185,220,0.75)',
          fontSize: '1.0rem',
          letterSpacing: '0.04em',
        }}>
          김 인 철 &nbsp;|&nbsp; 2026년
        </div>
      </div>
    </section>
  );
}
