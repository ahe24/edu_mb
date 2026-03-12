'use client';

import Link from 'next/link';

export default function Dashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--slide-bg)',
      color: 'var(--text-main)',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--primary-dark)', marginBottom: '1rem', fontWeight: 'bold' }}>
        교육 플랫폼 대시보드
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '3rem' }}>
        학습하실 커리큘럼을 아래에서 선택해주세요.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '800px' }}>

        {/* MicroBlaze 실습 교육 카드 */}
        <Link href="/mb" style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderTop: '6px solid var(--primary)',
            transition: 'transform 0.2s',
            cursor: 'pointer',
          }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 'bold' }}>MicroBlaze 과정</h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.5' }}>
              Arty A7 보드 기반 하드웨어 설계 & 소프트웨어 제어 기초. AXI-GPIO부터 DMA까지 단계별 실습 경험을 제공합니다.
            </p>
          </div>
        </Link>

        {/* 향후 과정 추가 카드용 */}
        <div style={{
          backgroundColor: '#f1f5f9',
          borderRadius: '12px',
          padding: '2rem',
          border: '2px dashed #cbd5e1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8'
        }}>
          <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>+</span>
          <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>신규 과정 준비중 <br />(Verilog, Questasim 등)</p>
        </div>

      </div>
    </div>
  );
}
