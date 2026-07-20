'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import ToolImage from '../ToolImage';

const DAY14 = '#0B7285';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

const STEPS: { n: string; cmd: string; sub: string; hl?: boolean }[] = [
  { n: '1', cmd: 'vlog -f flist.f +cover=bcesf', sub: '소스에 커버리지 계측 삽입 (b·c·e·s·f)' },
  { n: '2', cmd: 'vopt tb_top -o opt_cov +cover=bcesf +acc', sub: '최적화 + 계측 확정' },
  { n: '3', cmd: 'vsim -c -coverage opt_cov', sub: '커버리지 켜고 시뮬레이션' },
  { n: '4', cmd: 'coverage save trip.ucdb', sub: 'UCDB 로 저장 — 자동 저장 아님!', hl: true },
  { n: '5', cmd: 'coverage report  ·  vcover report -html', sub: '요약/상세 · HTML → covhtmlreport/' },
];

export default function QuestaFlowSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="도구 · QuestaSim 흐름"
          title="QuestaSim 커버리지 측정 흐름"
          subtitle="기존 comp → opt → sim 흐름에 +cover 부착 · 결과를 UCDB 로 저장 후 리포트"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.08fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 5단계 파이프라인 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minHeight: 0 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'stretch', gap: '0.5rem', flex: 1, minHeight: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: s.hl ? ORANGE : DAY14, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, fontFamily: MONO, flexShrink: 0,
                    boxShadow: shadow.card,
                  }}>{s.n}</span>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, width: '2px', background: `${DAY14}30`, marginTop: '2px' }} />}
                </div>
                <div style={{
                  flex: 1, minWidth: 0,
                  background: '#1A2235', borderRadius: '8px',
                  padding: '0.4rem 0.7rem', boxShadow: shadow.card,
                  borderLeft: `3px solid ${s.hl ? ORANGE : DAY14}`,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                }}>
                  <div style={{ fontFamily: MONO, fontSize: '0.66rem', color: '#A8D8E0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{ color: '#F6AD55', fontWeight: 700 }}>$ </span>{s.cmd}
                  </div>
                  <div style={{ fontSize: '0.58rem', color: s.hl ? '#F6AD55' : '#7C90B0', marginTop: '1px', fontWeight: s.hl ? 700 : 400 }}>
                    {s.hl && '⚠ '}{s.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── 우: GUI 캡처 + Makefile + 경고 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            {/* GUI 캡처 placeholder */}
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.5rem 0.6rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                GUI — Code Coverage Analysis 창 <span style={{ color: FPGA.textLight, fontWeight: 400 }}>(vsim -viewcov)</span>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ToolImage src="/images/fpga/day14_cov_analysis.png" name="Code Coverage Analysis" width="100%" height="100%" />
              </div>
            </div>

            {/* Makefile 한 줄 */}
            <div style={{
              background: `linear-gradient(135deg, ${DAY14}08, ${DAY14}16)`,
              border: `1px solid ${DAY14}30`, borderLeft: `4px solid ${DAY14}`,
              borderRadius: '9px', padding: '0.45rem 0.8rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: DAY14, marginBottom: '0.1rem' }}>
                실습 Makefile — <code>make cov</code> 한 번에
              </div>
              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                comp → opt → sim → save → report 를 자동 수행 · <code>make html</code> · <code>make gui</code> 로 열람.
              </div>
            </div>

            {/* 경고 — UCDB 저장 */}
            <div style={{
              background: `linear-gradient(135deg, ${ORANGE}08, ${ORANGE}14)`,
              border: `1px solid ${ORANGE}30`, borderLeft: `4px solid ${ORANGE}`,
              borderRadius: '9px', padding: '0.45rem 0.8rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#B45309', marginBottom: '0.1rem' }}>
                흔한 실수 — 저장 누락 시 데이터 소실
              </div>
              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                coverage 데이터는 기본적으로 <strong>자동 저장 안 됨</strong>. <code>coverage save</code>
                (또는 <code>-onexit</code>) 실행해야 UCDB 에 보존 — 미실행 시 소실.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
