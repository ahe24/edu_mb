'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const questaFeatures = [
  {
    badge: 'P',
    title: 'Property Checking',
    desc: 'SVA/PSL 기반 형식 검증으로 모든 입력 조합 탐색',
  },
  {
    badge: 'C',
    title: 'CDC/RDC 분석',
    desc: 'Clock/Reset Domain Crossing 자동 검출',
  },
  {
    badge: 'S',
    title: 'Sequential Equivalence',
    desc: 'RTL vs. Gate 넷리스트 동등성 증명',
  },
  {
    badge: 'A',
    title: 'Assertion-based 검증',
    desc: 'Formal + Simulation 하이브리드 접근',
  },
];

const workflowSteps = [
  {
    title: '자연어 의도 분석',
    desc: '로컬 LLM이 검증 의도를 파싱\nRAG 기반 설계 문서·규칙 참조',
  },
  {
    title: 'SVA/TB 자동 생성',
    desc: 'Fine-tuned 모델이 SVA Property\n및 테스트벤치 코드 직접 생성',
  },
  {
    title: 'Questa Formal 연동 실행',
    desc: '스크립트 에이전트가 Questa CLI 호출\nProperty 증명 및 커버리지 자동 수집',
  },
  {
    title: '피드백 루프',
    desc: 'CEX 파형·로그를 LLM이 재분석\n개선된 Property 자동 재생성·반복',
  },
];

export default function QuestaAISlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        <div style={edaStyles.slideHeader}>Questa Formal + 자체 AI 에이전트 통합</div>

        <div style={edaStyles.grid2}>
          {/* Left: Questa features */}
          <div style={edaStyles.card}>
            <div style={{ fontWeight: 700, fontSize: '0.97rem', color: EDA.navy, marginBottom: '0.8rem' }}>
              Questa Formal 핵심 기능
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {questaFeatures.map((f) => (
                <div key={f.badge} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: '34px', height: '34px', minWidth: '34px',
                    borderRadius: '50%',
                    background: EDA.navy,
                    color: EDA.white,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.9rem',
                    flexShrink: 0,
                  }}>
                    {f.badge}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.87rem', color: EDA.navy }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: '0.80rem', color: EDA.textLight, lineHeight: 1.55 }}>
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: LLM workflow */}
          <div style={edaStyles.card}>
            <div style={{ fontWeight: 700, fontSize: '0.97rem', color: EDA.navy, marginBottom: '0.8rem' }}>
              자체 LLM 에이전트 워크플로우
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {workflowSteps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px', height: '28px', minWidth: '28px',
                    borderRadius: '50%',
                    background: EDA.blue,
                    color: EDA.white,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.82rem',
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.87rem', color: EDA.navy }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '0.79rem', color: EDA.textLight, lineHeight: 1.55, whiteSpace: 'pre-line' as const }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom description */}
        <div style={{
          background: EDA.bgAlt,
          border: `1px solid ${EDA.border}`,
          borderRadius: '6px',
          padding: '0.6rem 1.1rem',
          fontSize: '0.82rem',
          color: EDA.text,
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          자체 로컬 LLM 기반 AI 에이전트 — 폐쇄망 환경에서 Questa Formal과 직접 연동하여, 외부 클라우드 의존 없이 SVA 생성·검증·디버그 전 과정을 자동화하는 사내 전용 시스템.
        </div>
      </div>
    </section>
  );
}
