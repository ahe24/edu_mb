'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const growthItems = [
  '방산/우주항공 분야 FPGA 수요 확대',
  '자동차 ADAS/자율주행 FPGA 적용 증가',
  '5G/통신 인프라 FPGA 활용 지속',
  '설계 복잡도 증가 → 검증 중요성 부각',
];

const realityItems = [
  'FPGA 설계자 검증 툴 도입률 저조',
  'ASIC 대비 검증 프로세스 성숙도 격차',
  'Simulation/Formal V&V 활용 미흡',
  '"동작하면 된다" 인식 팽배',
];

export default function MarketStatusSlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        <div style={edaStyles.slideHeader}>현재 시장 현황</div>
        <span style={edaStyles.subtitle}>FPGA 설계는 성장 중이나, 검증 도입은 정체</span>

        <div style={edaStyles.grid2}>
          {/* Growth */}
          <div style={edaStyles.card}>
            <div style={{
              borderLeft: `4px solid ${EDA.blue}`,
              paddingLeft: '0.8rem',
              marginBottom: '0.9rem',
            }}>
              <div style={{ fontWeight: 700, fontSize: '1.0rem', color: EDA.navy }}>
                FPGA 시장 성장 요인
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {growthItems.map((item, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  fontSize: '0.87rem', color: EDA.text, lineHeight: 1.75,
                  marginBottom: '0.25rem',
                }}>
                  <span style={{ color: EDA.blue, fontWeight: 700, marginTop: '1px' }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Reality */}
          <div style={edaStyles.card}>
            <div style={{
              borderLeft: `4px solid ${EDA.textLight}`,
              paddingLeft: '0.8rem',
              marginBottom: '0.9rem',
            }}>
              <div style={{ fontWeight: 700, fontSize: '1.0rem', color: EDA.navy }}>
                검증 도입의 현실
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {realityItems.map((item, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  fontSize: '0.87rem', color: EDA.text, lineHeight: 1.75,
                  marginBottom: '0.25rem',
                }}>
                  <span style={{ color: EDA.textLight, fontWeight: 700, marginTop: '1px' }}>•</span>
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
