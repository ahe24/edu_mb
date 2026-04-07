'use client';

import { EDA } from './EdaSlideStyles';

export default function ClosingSlide() {
  return (
    <section data-background-color="#0D1B2E" style={{ justifyContent: 'center' }}>
      {/* Decorative bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(30,90,156,0.10) 1px, transparent 1px),
          linear-gradient(90deg, rgba(30,90,156,0.10) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        margin: 'auto 0',
        background: 'rgba(27,43,75,0.88)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0,147,208,0.22)',
        borderRadius: '12px',
        padding: '5rem 6rem',
        textAlign: 'center',
        maxWidth: '720px',
        width: '100%',
        boxShadow: '0 16px 60px rgba(0,0,0,0.38)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.8rem',
      }}>
        {/* Main message */}
        <div style={{
          color: '#FFFFFF',
          fontSize: '3.2rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
        }}>
          감사합니다
        </div>

        {/* Divider */}
        <div style={{
          width: '80%',
          height: '1px',
          background: 'rgba(0,147,208,0.40)',
        }} />

        {/* Q&A */}
        <div style={{
          color: 'rgba(200,215,235,0.85)',
          fontSize: '1.6rem',
          fontWeight: 400,
          letterSpacing: '0.12em',
        }}>
          Q &nbsp; &amp; &nbsp; A
        </div>

        {/* Author */}
        <div style={{
          color: 'rgba(150,175,210,0.70)',
          fontSize: '0.95rem',
          letterSpacing: '0.06em',
        }}>
          EDA 사업부 &nbsp;|&nbsp; 김인철
        </div>
      </div>
    </section>
  );
}
