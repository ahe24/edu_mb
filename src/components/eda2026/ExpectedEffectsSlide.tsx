'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const effects = [
  {
    icon: '↑',
    title: '툴 사용률 향상',
    desc: '진입 장벽 제거로 기존 고객의 검증 툴 활용도 극대화',
    tag: '기존 고객 활용도 ↑',
    color: '#1E5A9C',
    bg: 'rgba(30,90,156,0.05)',
  },
  {
    icon: '✦',
    title: '신규 매출 창출',
    desc: 'LLM 솔루션 패키지로 라이선스를 넘는 새로운 수익 모델 확보',
    tag: '고부가가치 번들 영업',
    color: '#1A8F72',
    bg: 'rgba(26,143,114,0.05)',
  },
  {
    icon: '⬡',
    title: '고객 Lock-in 강화',
    desc: '단순 라이선스 판매를 넘어 LLM 기반 토탈 솔루션 파트너로 전환',
    tag: '토탈 솔루션 파트너',
    color: '#1B2B4B',
    bg: 'rgba(27,43,75,0.05)',
  },
  {
    icon: '★',
    title: '차별화 경쟁력',
    desc: '"검증 전문 + 로컬 LLM" 결합으로 경쟁사 부재 시장 선점',
    tag: '국내 유일 포지셔닝',
    color: '#7B4FA8',
    bg: 'rgba(123,79,168,0.05)',
  },
];

export default function ExpectedEffectsSlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        <div style={edaStyles.slideHeader}>기대 효과</div>
        <span style={edaStyles.subtitle}>검증 자동화는 영업 확대의 열쇠</span>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '0.9rem',
          width: '100%',
          flex: 1,
          minHeight: 0,
        }}>
          {effects.map((e) => (
            <div key={e.title} style={{
              background: e.bg,
              border: `1px solid ${e.color}22`,
              borderLeft: `4px solid ${e.color}`,
              borderRadius: '10px',
              padding: '1.1rem 1.3rem',
              boxShadow: '0 2px 12px rgba(27,43,75,0.08)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}>
              {/* Icon circle */}
              <div style={{
                width: '48px', height: '48px', minWidth: '48px',
                borderRadius: '12px',
                background: e.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
                color: '#fff',
                fontWeight: 700,
                boxShadow: `0 4px 12px ${e.color}40`,
                flexShrink: 0,
              }}>
                {e.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 800,
                  fontSize: '1.0rem',
                  color: EDA.navy,
                  marginBottom: '0.3rem',
                  letterSpacing: '-0.01em',
                }}>
                  {e.title}
                </div>
                <div style={{
                  fontSize: '0.83rem',
                  color: EDA.textLight,
                  lineHeight: 1.6,
                  marginBottom: '0.55rem',
                }}>
                  {e.desc}
                </div>
                {/* Result tag */}
                <span style={{
                  display: 'inline-block',
                  background: `${e.color}14`,
                  border: `1px solid ${e.color}35`,
                  borderRadius: '4px',
                  padding: '2px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: e.color,
                  letterSpacing: '0.01em',
                }}>
                  {e.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
