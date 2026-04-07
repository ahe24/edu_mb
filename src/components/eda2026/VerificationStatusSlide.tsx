'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const progress = [
  'Ollama 기반 로컬 LLM 환경 구축 및 테스트',
  'RAG 파이프라인 프로토타입 개발',
  '검증 문서 기반 Q&A 테스트 → 유의미한 응답 품질 확인',
];

const challenges = [
  {
    title: 'GPU 성능 부족',
    desc: '대형 모델 구동 시 응답 속도/품질 한계',
  },
  {
    title: '학습 데이터',
    desc: '검증 도메인 데이터 정제 및 확장 필요 (RapidMiner 필요성)',
  },
  {
    title: '안정성',
    desc: '상용 수준의 정확도 달성까지 추가 투자 필요',
  },
];

export default function VerificationStatusSlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        <div style={edaStyles.slideHeader}>자체 검증 현황</div>
        <span style={edaStyles.subtitle}>가능성은 확인, 인프라 확보가 관건</span>

        <div style={edaStyles.grid2}>
          {/* Left: progress + arch diagram */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', flex: 1 }}>
            <div style={edaStyles.card}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: EDA.navy, marginBottom: '0.7rem' }}>
                진행 사항 <span style={{ fontSize: '0.78rem', color: EDA.textLight, fontWeight: 400 }}>(~ 26.03월 테스트 수행)</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {progress.map((item, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.45rem',
                    fontSize: '0.84rem', color: EDA.text, lineHeight: 1.7,
                    marginBottom: '0.2rem',
                  }}>
                    <span style={{ color: EDA.success, fontWeight: 700 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture diagram */}
            <div style={{
              ...edaStyles.card,
              padding: '0.8rem 1rem',
              fontSize: '0.76rem',
            }}>
              {/* UI layer */}
              <div style={{
                background: EDA.bgAlt,
                border: `1px solid ${EDA.border}`,
                borderRadius: '5px',
                padding: '0.4rem 0.7rem',
                textAlign: 'center' as const,
                fontWeight: 600,
                color: EDA.navy,
                marginBottom: '0.4rem',
              }}>
                사용자 인터페이스 (CLI / 로컬 Web / API)
              </div>

              {/* Agent + Tools row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', marginBottom: '0.4rem' }}>
                <div style={{
                  background: EDA.bgAlt, border: `1px solid ${EDA.border}`,
                  borderRadius: '5px', padding: '0.35rem 0.55rem',
                  color: EDA.navy,
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '1px' }}>Agent</div>
                  <div style={{ color: EDA.textLight, fontSize: '0.73rem' }}>Framework (LangChain/CrewAI)</div>
                </div>
                <div style={{
                  background: EDA.bgAlt, border: `1px solid ${EDA.border}`,
                  borderRadius: '5px', padding: '0.35rem 0.55rem',
                  color: EDA.navy,
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '1px', color: EDA.textLight }}>도구 (Tools)</div>
                  <div style={{ color: EDA.textLight, fontSize: '0.71rem', lineHeight: 1.5 }}>
                    RAG 문서검색 · 계산기 · 파일관리<br />Questa CLI · 코드실행
                  </div>
                </div>
              </div>

              {/* Ollama + VectorDB row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                <div style={{
                  background: EDA.bgAlt, border: `1px solid ${EDA.border}`,
                  borderRadius: '5px', padding: '0.35rem 0.55rem',
                  color: EDA.navy,
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '1px' }}>Ollama</div>
                  <div style={{ color: EDA.textLight, fontSize: '0.71rem' }}>Fine-tuned Model</div>
                </div>
                <div style={{
                  background: EDA.bgAlt, border: `1px solid ${EDA.border}`,
                  borderRadius: '5px', padding: '0.35rem 0.55rem',
                  color: EDA.navy,
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '1px' }}>벡터DB (ChromaDB)</div>
                  <div style={{ color: EDA.textLight, fontSize: '0.71rem' }}>+ 임베딩 (nomic-embed-text)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: challenges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: EDA.navy }}>현재 과제</div>
            {challenges.map((c, i) => (
              <div key={i} style={{
                background: EDA.bgCard,
                border: `1px solid ${EDA.border}`,
                borderLeft: `3px solid ${EDA.navyLight}`,
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                boxShadow: '0 1px 6px rgba(27,43,75,0.07)',
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: EDA.navy, marginBottom: '0.2rem' }}>
                  {c.title}
                </div>
                <div style={{ fontSize: '0.81rem', color: EDA.textLight, lineHeight: 1.55 }}>
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
