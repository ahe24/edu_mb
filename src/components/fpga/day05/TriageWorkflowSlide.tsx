'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY05 = '#C05621';

const steps = [
  {
    n: 1, color: '#4A6FA5',
    title: 'Goal 설정 & 분석',
    cmd: 'lint methodology standard -goal DO-254\nlint run -d top_module',
    note: 'DO-254 alias 기반 severity 자동 적용',
  },
  {
    n: 2, color: DAY05,
    title: 'alias 필터',
    cmd: '# GUI: CP* / SS* 그룹 토글',
    note: '개별 check 이름 아닌 alias로 일괄 탐색',
  },
  {
    n: 3, color: '#E53E3E',
    title: 'Error 즉시 수정',
    cmd: '# DO-254 Error severity → 강제',
    note: 'waiver 금지 · 인증 차단 사유',
  },
  {
    n: 4, color: '#E8913A',
    title: 'Warning 검토',
    cmd: 'lint report item -status waived\n  -comment "{REASON;REVIEWER;DATE;TRACE}"',
    note: '설계 리뷰 후 수정 or ASCII 4필드 waiver',
  },
  {
    n: 5, color: '#48BB78',
    title: 'Baseline · CI',
    cmd: 'lint diff output/lint.db -refdb baseline/lint.db',
    note: 'PR 단계 신규 위반 자동 게이트',
  },
];

const waiverBan = [
  { alias: 'CP15', label: 'Combo NB → sim/synth mismatch' },
  { alias: 'CP17', label: 'Seq `=` → race condition' },
  { alias: 'SS3',  label: 'combo loop → 타이밍 불가능' },
  { alias: 'SS6',  label: 'multi-driver → 합성 오류' },
  { alias: 'SS17', label: 'undriven → X 전파' },
];

export default function TriageWorkflowSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Workflow"
          title="검출 → Triage → Waiver 흐름"
          subtitle="Day 04 waiver 체계 + DO-254 goal 기반 분류"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {/* 5단계 수평 플로우 */}
          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: 0,
          }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
                <div style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${s.color}06, ${s.color}14)`,
                  border: `1px solid ${s.color}30`,
                  borderTop: `3px solid ${s.color}`,
                  borderRadius: '10px',
                  padding: '0.6rem 0.7rem',
                  boxShadow: shadow.card,
                  display: 'flex', flexDirection: 'column', gap: '0.4rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: s.color,
                      color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.72rem', fontWeight: 800,
                      boxShadow: `0 2px 6px ${s.color}40`,
                    }}>{s.n}</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: FPGA.dark }}>{s.title}</span>
                  </div>
                  <pre style={{
                    margin: 0, fontSize: '0.58rem', lineHeight: 1.4,
                    background: '#1A2235', color: '#A8D8A8',
                    padding: '5px 7px', borderRadius: '5px',
                    fontFamily: '"JetBrains Mono", monospace',
                    whiteSpace: 'pre-wrap',
                    flex: 1,
                  }}>{s.cmd}</pre>
                  <div style={{ fontSize: '0.66rem', color: FPGA.textLight, lineHeight: 1.45 }}>
                    {s.note}
                  </div>
                </div>

                {i < steps.length - 1 && (
                  <div style={{ padding: '0 3px', display: 'flex', alignItems: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3 9h10M9 5l4 4-4 4" stroke={FPGA.textLight} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Waiver 불가 alias 경고 박스 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.14))',
            border: '1px solid rgba(229,62,62,0.35)',
            borderLeft: '4px solid #E53E3E',
            borderRadius: '10px',
            padding: '0.7rem 1rem',
            boxShadow: shadow.card,
            display: 'flex', flexDirection: 'column', gap: '0.45rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L1 16h16L9 2z" stroke="#E53E3E" strokeWidth="1.8" fill="rgba(229,62,62,0.15)" />
                <path d="M9 7v4M9 13v0.5" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#E53E3E' }}>
                Waiver 불가 alias 5종 — DO-254 DAL-A/B 인증 차단 사유
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
              {waiverBan.map((w) => (
                <div key={w.alias} style={{
                  background: FPGA.white,
                  border: '1px solid rgba(229,62,62,0.30)',
                  borderTop: '3px solid #E53E3E',
                  borderRadius: '8px',
                  padding: '0.45rem 0.6rem',
                  boxShadow: '0 2px 6px rgba(229,62,62,0.08)',
                }}>
                  <div style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem', fontWeight: 800,
                    color: '#E53E3E', marginBottom: '3px',
                  }}>{w.alias}</div>
                  <div style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.4 }}>
                    {w.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
