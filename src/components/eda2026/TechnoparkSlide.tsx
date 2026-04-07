'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const specs = [
  { label: 'GPU 서버', value: 'NVIDIA DGX A100 40G' },
  { label: '지원 기간', value: '기업당 5개월 무상 (월 96만원 상당)' },
  { label: 'CPU / Memory', value: '25 Core / 100GB' },
  { label: 'Storage', value: '6.5TB' },
  { label: '신청 기간', value: '2026.2.13 ~ 12.15 (상시, 선착순)' },
];

const goals = [
  '로컬 LLM 학습/파인튜닝에 DGX A100 활용',
  '검증 도메인 특화 모델 개발 가속화',
  '자체 GPU 투자 전 PoC 완성도 극대화',
];

export default function TechnoparkSlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        <div style={edaStyles.slideHeader}>외부 인프라 활용 — 충북테크노파크</div>
        <span style={edaStyles.subtitle}>GPU 인프라 문제, 정부 지원 활용</span>

        <div style={edaStyles.grid2}>
          {/* Left: program info */}
          <div style={edaStyles.card}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: EDA.navy, marginBottom: '0.3rem' }}>
              오픈랩 AI 개발플랫폼 활용 지원 사업
            </div>
            <div style={{ fontSize: '0.79rem', color: EDA.textLight, marginBottom: '0.8rem' }}>
              산업통상자원부 + 충청북도 지원 (2026년)
            </div>

            {/* Spec table */}
            <div style={{ borderRadius: '6px', overflow: 'hidden', border: `1px solid ${EDA.border}` }}>
              {specs.map((row, i) => (
                <div key={i} style={{
                  display: 'flex',
                  background: i % 2 === 0 ? EDA.bgCard : '#F5F7FA',
                  borderBottom: i < specs.length - 1 ? `1px solid ${EDA.border}` : 'none',
                }}>
                  <div style={{
                    padding: '6px 12px',
                    fontWeight: 600,
                    fontSize: '0.80rem',
                    color: EDA.navyLight,
                    width: '38%',
                    borderRight: `1px solid ${EDA.border}`,
                  }}>
                    {row.label}
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    fontSize: '0.80rem',
                    color: EDA.text,
                    flex: 1,
                  }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: goals */}
          <div style={edaStyles.card}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: EDA.navy, marginBottom: '0.85rem' }}>
              활용 목표
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {goals.map((item, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                  fontSize: '0.87rem', color: EDA.text, lineHeight: 1.65,
                }}>
                  <div style={{
                    width: '22px', height: '22px', minWidth: '22px',
                    borderRadius: '50%',
                    background: EDA.navy,
                    color: EDA.white,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 800,
                    marginTop: '1px',
                  }}>
                    {i + 1}
                  </div>
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
