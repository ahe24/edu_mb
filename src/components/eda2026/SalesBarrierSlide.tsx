'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const difficultyItems = [
  '복잡한 설정과 스크립트 작성 필요',
  'Simulation/Formal V&V 환경 구축에 전문 지식 요구',
  '설계자 입장에서 가파른 학습 곡선',
];

const motivationItems = [
  '"기존 방식으로도 동작하는데 왜 검증까지?"',
  '검증 단계 추가 → 일정 지연 우려',
  '즉각적 성과가 눈에 보이지 않음',
];

const screenshots = [
  { label: 'Questa Simulation — Coverage View',   hint: '커버리지 결과 스크린샷' },
  { label: 'Questa Sim — Waveform / Timing',       hint: '파형 분석 스크린샷' },
  { label: 'Questa — Design Metrics Dashboard',    hint: 'Quality Score 스크린샷' },
];

function ImgPlaceholder({ label, hint }: { label: string; hint: string }) {
  return (
    <div style={{
      flex: 1,
      background: '#E8ECF2',
      border: '2px dashed #B0BAC9',
      borderRadius: '8px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '0.35rem', padding: '0.6rem 0.5rem',
      minHeight: 0,
    }}>
      <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>🖼</span>
      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#5A6A80', textAlign: 'center' as const, lineHeight: 1.4 }}>
        {label}
      </span>
      <span style={{ fontSize: '0.65rem', color: '#8A96A6', textAlign: 'center' as const }}>
        {hint}
      </span>
    </div>
  );
}

export default function SalesBarrierSlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        <div style={edaStyles.slideHeader}>영업 확대의 장벽</div>
        <span style={edaStyles.subtitle}>좋은 툴이 있어도, 쓰기 어려우면 안 쓴다</span>

        {/* Top: 2 text cards — natural height, no flex:1 */}
        <div style={{ ...edaStyles.grid2, flex: 'none', marginBottom: '0.75rem' }}>
          <div style={{ ...edaStyles.card, borderTop: `3px solid ${EDA.navy}` }}>
            <div style={{ fontWeight: 700, fontSize: '1.0rem', color: EDA.navy, marginBottom: '0.75rem', textAlign: 'center' as const }}>
              사용 난이도
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {difficultyItems.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.87rem', color: EDA.text, lineHeight: 1.7, marginBottom: '0.15rem' }}>
                  <span style={{ color: EDA.blue, fontWeight: 700 }}>•</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ ...edaStyles.card, borderTop: `3px solid ${EDA.navy}` }}>
            <div style={{ fontWeight: 700, fontSize: '1.0rem', color: EDA.navy, marginBottom: '0.75rem', textAlign: 'center' as const }}>
              동기 부족 (귀찮음)
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {motivationItems.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.87rem', color: EDA.text, lineHeight: 1.7, marginBottom: '0.15rem' }}>
                  <span style={{ color: EDA.blue, fontWeight: 700 }}>•</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle: 3 screenshot placeholders — fills remaining space */}
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minHeight: 0, marginBottom: '0.75rem' }}>
          {screenshots.map(s => <ImgPlaceholder key={s.label} label={s.label} hint={s.hint} />)}
        </div>

        {/* Bottom: conclusion bar */}
        <div style={{ ...edaStyles.conclusionBar, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span style={{ color: EDA.accent, fontSize: '1.1rem' }}>▌</span>
          기능 홍보만으로는 한계 → 사용 장벽을 낮추는 근본적 접근이 필요
        </div>
      </div>
    </section>
  );
}
