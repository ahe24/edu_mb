'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const approach1 = [
  '검증 환경 자동 설정',
  '결과에 대한 자동 시각화',
  '반복 작업의 원클릭 실행',
];

const limits = [
  '고객마다 다른 설계 환경/FPGA 디바이스',
  '설계자료(HDL, 제약조건 등)의 다양성',
  '범용적으로 모든 케이스 커버 불가',
];

export default function AutomationSlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        <div style={edaStyles.slideHeader}>해결 방향: 자동화 솔루션</div>
        <span style={edaStyles.subtitle}>검증 진입 장벽을 없애는 자동화를 통한 접근</span>

        {/* Main 2-col: left = stacked text cards, right = screenshot placeholder */}
        <div style={{ ...edaStyles.grid2, gridAutoRows: 'unset' }}>

          {/* Left column — two stacked text cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0 }}>
            <div style={edaStyles.card}>
              <div style={{ borderLeft: `4px solid ${EDA.blue}`, paddingLeft: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: EDA.navy }}>
                  1차 접근: 웹/스크립트 기반 자동화
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {approach1.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.87rem', color: EDA.text, lineHeight: 1.7, marginBottom: '0.15rem' }}>
                    <span style={{ color: EDA.blue, fontWeight: 700 }}>•</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={edaStyles.card}>
              <div style={{ borderLeft: `4px solid ${EDA.textLight}`, paddingLeft: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: EDA.navy }}>
                  한계점
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {limits.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.87rem', color: EDA.text, lineHeight: 1.7, marginBottom: '0.15rem' }}>
                    <span style={{ color: EDA.textLight, fontWeight: 700 }}>•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column — dashboard screenshot placeholder */}
          <div style={{
            background: '#E8ECF2',
            border: '2px dashed #B0BAC9',
            borderRadius: '8px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', padding: '1rem',
            minHeight: '200px',
          }}>
            <span style={{ fontSize: '2.2rem', opacity: 0.4 }}>🖥</span>
            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: '#5A6A80', textAlign: 'center' as const, lineHeight: 1.4 }}>
              HDL Design Verification Portal
            </span>
            <span style={{ fontSize: '0.70rem', color: '#8A96A6', textAlign: 'center' as const, lineHeight: 1.5 }}>
              대시보드 스크린샷<br />
              (Task Statistics · Results · Activity)
            </span>
          </div>
        </div>

        {/* Conclusion */}
        <div style={{ ...edaStyles.conclusionBar, marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span style={{ color: EDA.accent, fontSize: '1.1rem' }}>▌</span>
          규칙 기반 자동화의 한계 → LLM 기반 지능형 자동화로 전환 필요
        </div>
      </div>
    </section>
  );
}
