'use client';

export default function WorkflowDiagram() {
  const steps = [
    {
      num: '01', delay: '0.2s', borderColor: 'var(--primary)',
      emoji: '🛠️',
      title: '하드웨어 설계',
      tool: 'Vivado IDE',
      toolColor: 'var(--primary)',
      items: ['Block Design 구성', 'Custom IP 연동'],
      output: '.XSA (플랫폼 추출)',
    },
    {
      num: '02', delay: '0.7s', borderColor: 'var(--accent)',
      emoji: '💻',
      title: '소프트웨어 개발',
      tool: 'Vitis IDE',
      toolColor: 'var(--accent)',
      items: ['XSA 기반 플랫폼 생성', 'BSP 및 C/C++ 코딩'],
      output: '.ELF (실행 파일)',
    },
    {
      num: '03', delay: '1.2s', borderColor: 'var(--primary-dark)',
      emoji: '🚀',
      title: '통합 및 구동',
      tool: 'Arty A7 Board',
      toolColor: 'var(--primary-dark)',
      items: ['HW Bitstream 다운로드', 'SW ELF 다운로드'],
      output: '보드 실기 테스트',
    },
  ];

  return (
    <section data-background-color="var(--slide-bg)" style={{ textAlign: 'center' }}>
      {/* Title */}
      <h2
        className="curriculum-anim"
        style={{
          animationDelay: '0.05s',
          color: 'var(--primary-dark)', fontSize: '2.2rem',
          fontWeight: 800, marginBottom: '2rem',
          letterSpacing: '-0.02em',
        }}
      >
        MicroBlaze 핵심 워크플로우
      </h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', margin: '0 0.5rem', position: 'relative', gap: '0' }}>

        {steps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>

            {/* Card */}
            <div
              className="curriculum-anim"
              style={{
                animationDelay: step.delay,
                flex: 1,
                background: 'white',
                borderRadius: '14px',
                padding: '1.5rem 1.2rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                borderTop: `5px solid ${step.borderColor}`,
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              {/* Step badge */}
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                width: '28px', height: '28px', borderRadius: '8px',
                background: step.borderColor, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 800,
                fontFamily: '"JetBrains Mono", monospace',
              }}>{step.num}</div>

              {/* Icon circle */}
              <div style={{
                fontSize: '2.2rem', margin: '0 auto 0.8rem',
                background: '#f8fafc', width: '70px', height: '70px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', border: `2.5px solid ${step.borderColor}`,
              }}>{step.emoji}</div>

              {/* Title */}
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.3rem', fontWeight: 700 }}>
                {step.title}
              </h3>

              {/* Tool badge */}
              <div style={{
                display: 'inline-block',
                fontSize: '0.75rem', fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 600, color: step.toolColor,
                background: `${step.borderColor}15`,
                border: `1px solid ${step.borderColor}40`,
                borderRadius: '6px', padding: '2px 10px', marginBottom: '0.8rem',
              }}>{step.tool}</div>

              {/* Items */}
              <ul style={{ fontSize: '0.95rem', color: '#475569', textAlign: 'left', listStyle: 'none', padding: 0, marginBottom: '0.8rem' }}>
                {step.items.map((item, i) => (
                  <li key={i} style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: step.borderColor, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Output pill */}
              <div style={{
                fontSize: '0.85rem', fontWeight: 600,
                color: '#0f172a',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px', padding: '0.4rem 0.6rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                <span style={{ color: step.borderColor }}>▶</span>
                <span style={{ fontSize: '0.8rem', fontFamily: '"JetBrains Mono", monospace' }}>{step.output}</span>
              </div>
            </div>

            {/* Connector arrow (between cards) */}
            {idx < 2 && (
              <div className="curriculum-anim" style={{
                animationDelay: `${parseFloat(step.delay) + 0.3}s`,
                flexShrink: 0,
                padding: '0 0.4rem',
                display: 'flex',
                alignItems: 'center',
              }}>
                <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
                  <line x1="0" y1="8" x2="28" y2="8" stroke="url(#arrowGrad)" strokeWidth="2.5" strokeLinecap="round" />
                  <polygon points="26,3 36,8 26,13" fill="var(--accent)" />
                  <defs>
                    <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--accent)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom caption */}
      <div className="curriculum-anim" style={{
        animationDelay: '1.8s',
        marginTop: '1.2rem',
        fontSize: '0.85rem', color: '#94a3b8',
        fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.04em',
      }}>
        Vivado → Vitis → Board  ·  하드웨어 + 소프트웨어 통합 흐름
      </div>
    </section>
  );
}
