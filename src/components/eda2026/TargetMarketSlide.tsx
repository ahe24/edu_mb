'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const targets = [
  '클라우드 AI 사용 불가 (보안 규정)',
  '설계 데이터 외부 반출 절대 불가',
  '로컬 서버 기반 AI 솔루션에 높은 관심',
  'FPGA 기반 시스템 확대 추세',
];

const opportunities = [
  '검증 의무화/인증 요건 강화 (DO-254, IEC 61508 등)',
  '"보안 + LLM + 검증 전문성" 결합 = 차별화',
  '검증 툴 + LLM 솔루션 패키지 → 고부가가치 번들 영업',
  '경쟁사 부재 시장 선점 기회',
];

export default function TargetMarketSlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        <div style={edaStyles.slideHeader}>타겟 고객과 시장 기회</div>
        <span style={edaStyles.subtitle}>보안이 생명인 고객에게, 로컬 LLM 구축 수요 기대 효과</span>

        <div style={edaStyles.grid2}>
          {/* Target */}
          <div style={edaStyles.card}>
            <div style={{
              borderLeft: `4px solid ${EDA.navy}`,
              paddingLeft: '0.75rem',
              marginBottom: '0.9rem',
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.97rem', color: EDA.navy }}>
                핵심 타겟 — 방산/원전/국가기반시설
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {targets.map((item, i) => (
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

          {/* Opportunity */}
          <div style={edaStyles.card}>
            <div style={{
              borderLeft: `4px solid ${EDA.blueLight}`,
              paddingLeft: '0.75rem',
              marginBottom: '0.9rem',
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.97rem', color: EDA.navy }}>
                시장 기회
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {opportunities.map((item, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  fontSize: '0.87rem', color: EDA.text, lineHeight: 1.75,
                  marginBottom: '0.2rem',
                }}>
                  <span style={{ color: EDA.blueLight, fontWeight: 700 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
