'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import ToolImage from '../ToolImage';

const DAY14 = '#0B7285';
const GREEN = '#48BB78';
const MONO = '"JetBrains Mono", monospace';

type Test = 'trip' | 'recover' | 'idle';
// 단독 실행 시 커버리지(실측, DUT 전체 가중) — 병합 95.79% 에 아무도 못 미침
const TESTS: { key: Test; label: string; color: string; solo: number }[] = [
  { key: 'trip', label: '+TEST=trip', color: '#4A6FA5', solo: 72.06 },
  { key: 'recover', label: '+TEST=recover', color: '#0891B2', solo: 46.30 },
  { key: 'idle', label: '+TEST=idle', color: '#8B6FA5', solo: 63.80 },
];

// 커버리지 항목 × 담당 테스트 (실측 기준 재배분)
const ITEMS: { area: string; by: Test }[] = [
  { area: 'WARN→TRIP_S→LATCH 트립 경로', by: 'trip' },
  { area: 'trip 작동 · LATCH 유지', by: 'trip' },
  { area: 'LATCH clear → MONITOR 천이', by: 'trip' },
  { area: 'WARN→MONITOR 일시 초과 회복', by: 'recover' },
  { area: 'else if(en) false (en=0)', by: 'idle' },
  { area: 'vote 곱항 expression 다양', by: 'idle' },
];

export default function MergeSlide() {
  const [sel, setSel] = useState<Test | 'merged'>('merged');

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 3 · 회귀 병합"
          title="테스트마다 UCDB 하나 → 합집합이 증거"
          subtitle="한 테스트로 100% 지양 · 각자 다른 부분 분담 후 vcover merge 로 합집합"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.12fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 분담 매트릭스 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            {/* 열 선택 */}
            <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
              {TESTS.map((t) => (
                <button key={t.key} onClick={() => setSel(t.key)} style={{
                  flex: 1, cursor: 'pointer', fontSize: '0.56rem', fontWeight: 800, fontFamily: MONO,
                  color: sel === t.key ? '#fff' : t.color,
                  background: sel === t.key ? t.color : 'transparent',
                  border: `1.5px solid ${t.color}`, borderRadius: '6px', padding: '4px 0',
                }}>{t.label} <span style={{ opacity: 0.75 }}>{t.solo}%</span></button>
              ))}
              <button onClick={() => setSel('merged')} style={{
                flex: 1, cursor: 'pointer', fontSize: '0.56rem', fontWeight: 800, fontFamily: MONO,
                color: sel === 'merged' ? '#fff' : GREEN,
                background: sel === 'merged' ? GREEN : 'transparent',
                border: `1.5px solid ${GREEN}`, borderRadius: '6px', padding: '4px 0',
              }}>merged <span style={{ opacity: 0.75 }}>95.79%</span></button>
            </div>

            {/* 매트릭스 */}
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.5rem 0.7rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              {/* 헤더 행 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(3, 34px)', gap: '4px', alignItems: 'center', paddingBottom: '0.3rem', borderBottom: `1px solid ${FPGA.border}` }}>
                <span style={{ fontSize: '0.58rem', fontWeight: 700, color: FPGA.textLight }}>커버리지 항목</span>
                {TESTS.map((t) => (
                  <span key={t.key} style={{ fontSize: '0.54rem', fontWeight: 800, color: t.color, textAlign: 'center', fontFamily: MONO }}>{t.key[0].toUpperCase()}</span>
                ))}
              </div>
              {/* 데이터 행 */}
              {ITEMS.map((it, i) => {
                const covering = TESTS.find((t) => t.key === it.by)!;
                const rowLit = sel === 'merged' || sel === it.by;
                return (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1fr repeat(3, 34px)', gap: '4px', alignItems: 'center',
                    padding: '0.24rem 0', borderBottom: i < ITEMS.length - 1 ? `1px solid ${FPGA.bgAlt}` : 'none',
                    opacity: rowLit ? 1 : 0.32, transition: 'opacity 0.2s ease',
                  }}>
                    <span style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.3 }}>{it.area}</span>
                    {TESTS.map((t) => {
                      const covered = t.key === it.by;
                      return (
                        <span key={t.key} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 800, color: covered ? covering.color : '#D8DEE8' }}>
                          {covered ? '●' : '·'}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
              <div style={{ marginTop: 'auto', paddingTop: '0.35rem', fontSize: '0.58rem', color: FPGA.textLight, textAlign: 'center' }}>
                {sel === 'merged'
                  ? <span style={{ color: '#2F855A', fontWeight: 700 }}>병합 95.79% = 세 테스트의 합집합 → 어느 하나보다도 높음</span>
                  : <>단독 {TESTS.find((t) => t.key === sel)?.solo}% — 병합 95.79% 에 <strong>못 미침</strong>, 합집합으로 완성</>}
              </div>
            </div>

            {/* 병합 명령 */}
            <div style={{
              background: '#1A2235', borderRadius: '8px', padding: '0.4rem 0.7rem',
              fontFamily: MONO, fontSize: '0.56rem', color: '#A8D8E0', lineHeight: 1.7, flexShrink: 0,
            }}>
              <div><span style={{ color: '#F6AD55', fontWeight: 700 }}>$ </span>coverage save -onexit -testname trip trip.ucdb <span style={{ color: '#5A6B87' }}># 각 테스트, run 이전 등록</span></div>
              <div><span style={{ color: '#F6AD55', fontWeight: 700 }}>$ </span>vcover merge -out merged.ucdb trip.ucdb recover.ucdb idle.ucdb</div>
            </div>
          </div>

          {/* ── 우: HTML 리포트 캡처 + 관리 관점 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.5rem 0.6rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                HTML 리포트 <span style={{ color: FPGA.textLight, fontWeight: 400 }}>(vcover report -html merged.ucdb)</span>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ToolImage src="/images/fpga/day14_cov_html.png" name="병합 HTML 리포트" width="100%" height="100%" />
              </div>
              <div style={{ fontSize: '0.55rem', color: FPGA.textLight, fontFamily: MONO, marginTop: '0.25rem' }}>
                → covhtmlreport/index.html · 테스트별 기여도 · 소스 색상 링크
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY14}08, ${DAY14}16)`,
              border: `1px solid ${DAY14}30`, borderLeft: `4px solid ${DAY14}`,
              borderRadius: '9px', padding: '0.45rem 0.8rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: DAY14, marginBottom: '0.1rem' }}>관리 관점 — 증거는 병합본 하나</div>
              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                회귀 커버리지 = 개별 UCDB 가 아닌 <strong>병합본 하나</strong> · <code>-testname</code> 으로
                테스트별 기여 추적 — 대규모는 <code>-coverstore</code> 자동 저장.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
