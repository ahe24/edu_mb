'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const h1 = [
  '충북테크노파크 AI 플랫폼 신청 및 활용 개시',
  '검증 도메인 특화 LLM 프로토타입 v1 개발',
  '방산/원전 고객 대상 PoC 시연 준비',
];

const h2 = [
  '주요 고객 대상 파일럿 프로그램 운영',
  '고객 피드백 기반 모델 고도화',
  '자체 GPU 인프라 투자 검토 및 결정',
  'LLM 솔루션 패키지 상품화 방안 수립',
];

const resources = ['GPU 인프라 (테크노파크 활용)', 'AI 개발 인력', '검증 도메인 데이터'];

export default function ActionPlanSlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        <div style={edaStyles.slideHeader}>2026 Action Plan</div>
        <span style={edaStyles.subtitle}>단계별로 확실하게</span>

        <div style={{ ...edaStyles.grid2 }}>
          {/* H1 */}
          <div style={{
            ...edaStyles.card,
            borderTop: `3px solid ${EDA.blue}`,
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.97rem', color: EDA.navy, marginBottom: '0.8rem' }}>
              상반기 <span style={{ color: EDA.blue }}>(Q1 ~ Q2)</span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {h1.map((item, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  fontSize: '0.87rem', color: EDA.text, lineHeight: 1.75,
                  marginBottom: '0.2rem',
                }}>
                  <span style={{ color: EDA.blue, fontWeight: 700 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* H2 */}
          <div style={{
            ...edaStyles.card,
            borderTop: `3px solid ${EDA.navyLight}`,
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.97rem', color: EDA.navy, marginBottom: '0.8rem' }}>
              하반기 <span style={{ color: EDA.navyLight }}>(Q3 ~ Q4)</span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {h2.map((item, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  fontSize: '0.87rem', color: EDA.text, lineHeight: 1.75,
                  marginBottom: '0.2rem',
                }}>
                  <span style={{ color: EDA.navyLight, fontWeight: 700 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Resources bar */}
        <div style={{
          background: EDA.bgAlt,
          border: `1px solid ${EDA.border}`,
          borderLeft: `4px solid ${EDA.navy}`,
          borderRadius: '6px',
          padding: '0.6rem 1.2rem',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap' as const,
          gap: '0.4rem',
        }}>
          <span style={{ fontWeight: 700, fontSize: '0.87rem', color: EDA.navy }}>필요 자원</span>
          {resources.map((r, i) => (
            <span key={r}>
              <span style={{ fontSize: '0.85rem', color: EDA.text }}>{r}</span>
              {i < resources.length - 1 && (
                <span style={{ color: EDA.textLight, margin: '0 0.4rem' }}>|</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
