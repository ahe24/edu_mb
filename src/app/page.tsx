'use client';

import Link from 'next/link';
import { useState } from 'react';

const courses = [
  {
    id: 'mb',
    href: '/mb',
    tag: 'FPGA · Embedded',
    title: 'MicroBlaze 실습 교육',
    subtitle: 'Soft-Core Processor Design',
    description: 'Arty A7 보드 기반 하드웨어 설계 & 소프트웨어 제어 기초. AXI-GPIO부터 DMA까지 단계별 실습.',
    status: 'LIVE',
    color: '#20b2aa',
    colorDark: '#006400',
    items: ['AXI-GPIO', 'Timer / Interrupt', 'DMA Transfer', 'Vitis SDK'],
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="4" width="28" height="28" rx="4" stroke="#20b2aa" strokeWidth="2" fill="none"/>
        <rect x="9" y="9" width="18" height="18" rx="2" fill="#20b2aa" fillOpacity="0.15"/>
        <rect x="13" y="13" width="10" height="10" rx="1" fill="#20b2aa" fillOpacity="0.6"/>
        <line x1="4" y1="12" x2="0" y2="12" stroke="#20b2aa" strokeWidth="2"/>
        <line x1="4" y1="18" x2="0" y2="18" stroke="#20b2aa" strokeWidth="2"/>
        <line x1="4" y1="24" x2="0" y2="24" stroke="#20b2aa" strokeWidth="2"/>
        <line x1="32" y1="12" x2="36" y2="12" stroke="#20b2aa" strokeWidth="2"/>
        <line x1="32" y1="18" x2="36" y2="18" stroke="#20b2aa" strokeWidth="2"/>
        <line x1="32" y1="24" x2="36" y2="24" stroke="#20b2aa" strokeWidth="2"/>
        <line x1="12" y1="4" x2="12" y2="0" stroke="#20b2aa" strokeWidth="2"/>
        <line x1="18" y1="4" x2="18" y2="0" stroke="#20b2aa" strokeWidth="2"/>
        <line x1="24" y1="4" x2="24" y2="0" stroke="#20b2aa" strokeWidth="2"/>
        <line x1="12" y1="32" x2="12" y2="36" stroke="#20b2aa" strokeWidth="2"/>
        <line x1="18" y1="32" x2="18" y2="36" stroke="#20b2aa" strokeWidth="2"/>
        <line x1="24" y1="32" x2="24" y2="36" stroke="#20b2aa" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: 'coming',
    href: null,
    tag: 'HDL · Simulation',
    title: '신규 과정 준비중',
    subtitle: 'Verilog & Questasim',
    description: 'RTL 설계 기초부터 기능 시뮬레이션, 타이밍 검증까지 체계적인 학습 과정.',
    status: 'SOON',
    color: '#6366f1',
    colorDark: '#312e81',
    items: ['Verilog HDL', 'Questasim', 'FSM Design', 'Testbench'],
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="7" width="32" height="22" rx="3" stroke="#6366f1" strokeWidth="2" fill="none"/>
        <path d="M8 14 L14 18 L8 22" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="17" y1="22" x2="28" y2="22" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="10" cy="32" r="2" fill="#6366f1" fillOpacity="0.5"/>
        <circle cx="18" cy="32" r="2" fill="#6366f1" fillOpacity="0.5"/>
        <circle cx="26" cy="32" r="2" fill="#6366f1" fillOpacity="0.5"/>
      </svg>
    ),
  },
];

export default function Dashboard() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2027 100%)',
      color: '#f8fafc',
      padding: '3rem 2rem',
      fontFamily: '"Pretendard", -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid decoration */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(32,178,170,1) 1px, transparent 1px), linear-gradient(90deg, rgba(32,178,170,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Background glow blobs */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%', width: '350px', height: '350px',
        background: 'radial-gradient(circle, rgba(32,178,170,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '10%', width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(32,178,170,0.1)', border: '1px solid rgba(32,178,170,0.3)',
          borderRadius: '999px', padding: '5px 16px', marginBottom: '1.5rem',
          fontSize: '0.8rem', color: '#4ade80', letterSpacing: '0.1em', fontWeight: 600,
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
          LIVE PLATFORM · ED&C
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, margin: '0 0 1rem',
          background: 'linear-gradient(135deg, #f8fafc 30%, #20b2aa 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.03em', lineHeight: 1.1,
        }}>
          교육 플랫폼 대시보드
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
          학습하실 커리큘럼을 선택하세요
        </p>
      </div>

      {/* Course cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '780px',
        position: 'relative',
        zIndex: 1,
      }}>
        {courses.map((course) => {
          const isHovered = hoveredId === course.id;
          const isDisabled = !course.href;
          const Wrapper = course.href ? Link : 'div';
          const wrapperProps = course.href
            ? { href: course.href, style: { textDecoration: 'none' } }
            : {};

          return (
            // @ts-ignore
            <Wrapper key={course.id} {...wrapperProps}>
              <div
                onMouseEnter={() => !isDisabled && setHoveredId(course.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: isHovered
                    ? 'rgba(255,255,255,0.07)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isHovered ? course.color + '60' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '2rem',
                  cursor: isDisabled ? 'default' : 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHovered
                    ? `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px ${course.color}30, inset 0 1px 0 rgba(255,255,255,0.08)`
                    : '0 4px 20px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top color accent line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: `linear-gradient(90deg, ${course.color}, ${course.colorDark})`,
                  opacity: isHovered ? 1 : 0.5,
                  transition: 'opacity 0.3s',
                }} />

                {/* Glow in header area */}
                {isHovered && (
                  <div style={{
                    position: 'absolute', top: '-30px', left: '-30px',
                    width: '150px', height: '150px',
                    background: `radial-gradient(circle, ${course.color}20 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                  <div>{course.icon}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em',
                      color: course.status === 'LIVE' ? '#4ade80' : '#94a3b8',
                      background: course.status === 'LIVE' ? 'rgba(74,222,128,0.1)' : 'rgba(148,163,184,0.1)',
                      border: `1px solid ${course.status === 'LIVE' ? 'rgba(74,222,128,0.3)' : 'rgba(148,163,184,0.2)'}`,
                      borderRadius: '999px', padding: '2px 10px',
                    }}>
                      {course.status}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: course.color, fontWeight: 600, letterSpacing: '0.06em' }}>
                      {course.tag}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: '1.45rem', fontWeight: 700, color: '#f1f5f9',
                  marginBottom: '0.3rem', letterSpacing: '-0.02em',
                }}>
                  {course.title}
                </h2>
                <div style={{ fontSize: '0.82rem', color: course.color + 'cc', fontWeight: 500, marginBottom: '0.9rem', fontFamily: '"JetBrains Mono", monospace' }}>
                  {course.subtitle}
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.4rem' }}>
                  {course.description}
                </p>

                {/* Tags / Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
                  {course.items.map((item) => (
                    <span key={item} style={{
                      fontSize: '0.72rem', padding: '3px 10px',
                      borderRadius: '6px',
                      background: `${course.color}15`,
                      border: `1px solid ${course.color}30`,
                      color: course.color + 'ee',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 500,
                    }}>
                      {item}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                {!isDisabled && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem',
                  }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>바로 시작하기</span>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '34px', height: '34px', borderRadius: '8px',
                      background: `${course.color}15`,
                      border: `1px solid ${course.color}30`,
                      transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
                      transition: 'transform 0.3s',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={course.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </div>
                  </div>
                )}

                {isDisabled && (
                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem',
                    fontSize: '0.82rem', color: '#475569', fontStyle: 'italic',
                  }}>
                    준비중...
                  </div>
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '3rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.78rem', color: '#334155', letterSpacing: '0.04em' }}>
          © 2026 cs.jo · ED&amp;C Education Platform
        </p>
      </div>
    </div>
  );
}
