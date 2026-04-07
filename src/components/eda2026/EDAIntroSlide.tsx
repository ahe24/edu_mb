'use client';

import { EDA, edaStyles, edaShadow } from './EdaSlideStyles';

const supportRoles = [
  {
    icon: '🔧',
    title: '유지보수',
    lines: ['연간 계약 관리,', '버전 업그레이드 지원'],
  },
  {
    icon: '⚙️',
    title: '기술지원',
    lines: ['설계 환경 구축,', '트러블슈팅, 교육'],
  },
];

const products = [
  'QuestaSim', 'Precision Synthesis', 'Questa Formal Verification',
  'Tessent', 'Calibre', 'proFPGA',
];

export default function EDAIntroSlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        {/* Header */}
        <div style={edaStyles.slideHeader}>EDA 사업부 소개</div>

        {/* Subtitle */}
        <span style={edaStyles.subtitle}>Siemens EDA – ASIC/FPGA 설계 및 검증 솔루션</span>

        {/* Main Content: Triangle Flex Layout */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', marginTop: '0.2rem', minHeight: 0 }}>
          
          {/* Top Row: 판매 영업 */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', minHeight: 0 }}>
            <div style={{
              ...edaStyles.card,
              borderTop: `4px solid ${EDA.accent}`,
              width: '50%', 
              height: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'center',
              textAlign: 'center', padding: '1.5rem', gap: '0.8rem',
              position: 'relative',
              boxShadow: edaShadow.deep, // make it pop
            }}>
              <span style={{
                position: 'absolute', top: 0, right: '1.5rem',
                background: EDA.accent, color: EDA.white,
                fontSize: '0.75rem', fontWeight: 700,
                padding: '3px 12px', borderRadius: '0 0 6px 6px',
              }}>핵심</span>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: EDA.accentBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.3rem',
                marginBottom: '0.5rem',
              }}>🤝</div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', color: EDA.navy }}>판매 영업</div>
              <div style={{ fontSize: '1rem', color: EDA.textLight, lineHeight: 1.6 }}>
                신규 라이선스 도입 및 기존 고객 확대 영업
              </div>
            </div>
          </div>

          {/* Connector Row */}
          <div style={{ height: '40px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, margin: '8px 0' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <defs>
                <marker id="arrow-up" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6" fill="none" stroke={EDA.blueLight} strokeWidth="1.5" strokeOpacity="0.8"/>
                </marker>
              </defs>
              {/* Arrow from left bottom (maintenance) up to top (sales) */}
              <line x1="26" y1="40" x2="43" y2="0" stroke={EDA.blueLight} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.6" markerEnd="url(#arrow-up)" />
              {/* Arrow from right bottom (tech support) up to top (sales) */}
              <line x1="74" y1="40" x2="57" y2="0" stroke={EDA.blueLight} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.6" markerEnd="url(#arrow-up)" />
            </svg>
          </div>

          {/* Bottom Row: 유지보수 & 기술지원 */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', gap: '3rem', padding: '0 2rem', minHeight: 0 }}>
            {supportRoles.map(role => (
              <div key={role.title} style={{
                ...edaStyles.card,
                flex: 1,
                borderTop: `4px solid ${EDA.blueLight}`,
                height: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '1.5rem', gap: '0.8rem',
              }}>
                <div style={{
                  width: '74px', height: '74px', borderRadius: '50%',
                  background: EDA.bgAlt,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem',
                  marginBottom: '0.5rem',
                }}>
                  {role.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.25rem', color: EDA.navy }}>{role.title}</div>
                <div style={{ fontSize: '0.95rem', color: EDA.textLight, lineHeight: 1.6 }}>
                  {role.lines.map((l: string, i: number) => <div key={i}>{l}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product bar */}
        <div style={{
          background: EDA.bgAlt,
          border: `1px solid ${EDA.border}`,
          borderRadius: '8px',
          padding: '1rem 1.3rem',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap' as const,
        }}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: EDA.navy, marginRight: '0.8rem' }}>
            취급 제품군
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' }}>
            {products.map((p) => (
              <span key={p} style={{ ...edaStyles.tag, fontSize: '0.85rem', padding: '4px 10px' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
