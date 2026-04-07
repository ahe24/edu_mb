'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const columns = [
  {
    num: '1',
    title: '로컬 LLM 구축',
    items: ['고객 보안 요건 충족', '설계 데이터 외부 유출 방지', '온프레미스 배포 가능'],
  },
  {
    num: '2',
    title: 'RAG 파이프라인',
    items: ['검증 매뉴얼/가이드 학습', '기존 프로젝트 데이터 활용', '도메인 특화 응답 생성'],
  },
  {
    num: '3',
    title: '목표 기능',
    items: ['설계 코드 → 테스트벤치 자동생성', '검증 시나리오 추천', '오류 진단 및 수정 가이드'],
  },
];

export default function LLMStrategySlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        <div style={edaStyles.slideHeader}>LLM 기반 솔루션 전략</div>
        <span style={edaStyles.subtitle}>로컬 LLM + RAG로 고객 맞춤형 검증 자동화 실현</span>

        <div style={{ ...edaStyles.grid3 }}>
          {columns.map((col, idx) => (
            <div key={idx} style={{
              ...edaStyles.card,
              borderTop: `3px solid ${EDA.navy}`,
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Column header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                marginBottom: '0.85rem',
              }}>
                <div style={{
                  width: '28px', height: '28px', minWidth: '28px',
                  borderRadius: '50%',
                  background: EDA.navy,
                  color: EDA.white,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.82rem', fontWeight: 800,
                }}>
                  {col.num}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.97rem', color: EDA.navy }}>
                  {col.title}
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', flex: 1 }}>
                {col.items.map((item, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.45rem',
                    fontSize: '0.84rem', color: EDA.text, lineHeight: 1.75,
                    marginBottom: '0.2rem',
                  }}>
                    <span style={{ color: EDA.blue, fontWeight: 700 }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Value bar */}
        <div style={{
          background: EDA.bgAlt,
          border: `1px solid ${EDA.border}`,
          borderLeft: `4px solid ${EDA.navy}`,
          borderRadius: '6px',
          padding: '0.65rem 1.2rem',
          fontSize: '0.87rem',
          color: EDA.text,
        }}>
          <span style={{ fontWeight: 700, color: EDA.navy }}>기대 가치&nbsp;</span>
          설계자가 검증 전문 지식 없이도 LLM 가이드로 검증 수행 가능 → 툴 사용 장벽 근본적 해소
        </div>
      </div>
    </section>
  );
}
