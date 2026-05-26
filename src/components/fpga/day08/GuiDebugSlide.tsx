'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY08 = '#0E7C7B';

const windows = [
  {
    name: 'CDC Checks',
    desc: 'Status × Severity × Scheme 트리 — primary triage 화면',
    actions: ['Filter > By Column', 'Filter > Selected Row', 'Set Status', 'Show > Schematic'],
    col: '#4A6FA5',
  },
  {
    name: 'Schematic',
    desc: 'Crossing path를 도식으로 표시 — clock 도메인별 색상',
    actions: ['Show > Path / TX / RX', 'Expand Net', 'Go To > Source', 'Go To > Clock Groups'],
    col: DAY08,
  },
  {
    name: 'Source Editor',
    desc: 'RTL 코드 cross-probe — 신호 색상 = clock 도메인',
    actions: ['Schematic ↔ Source 자동 동기', 'cross-domain hover info'],
    col: '#0891B2',
  },
  {
    name: 'Clocks',
    desc: 'User-specified / Inferred / Ignored 그룹 — clock tree 검증',
    actions: ['Add Directive > netlist clock', 'group 변경'],
    col: '#8B6FA5',
  },
];

const statusOps = [
  { s: 'Uninspected', desc: '초기 상태 — 모든 신규 violation', col: '#718096' },
  { s: 'Pending', desc: '검토 중 / 수정 작업 진행', col: '#E8913A' },
  { s: 'Bug', desc: '결함 확정 · RTL 수정 필요', col: '#E53E3E' },
  { s: 'Fixed', desc: 'RTL 수정 완료 · 재실행 시 사라짐', col: '#4A6FA5' },
  { s: 'Waived', desc: '검증 완료 후 ignore (재실행 propagate)', col: '#8B6FA5' },
  { s: 'Verified', desc: 'V&V 산출물 등재 완료', col: '#48BB78' },
];

export default function GuiDebugSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="GUI"
          title="qverify GUI — Debug 워크플로우"
          subtitle="CDC Checks → Schematic ↔ Source → Set Status → status.tcl export"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* 4개 윈도우 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
            {windows.map((w) => (
              <div key={w.name} style={{
                background: FPGA.white,
                border: `1px solid ${w.col}25`,
                borderTop: `3px solid ${w.col}`,
                borderRadius: '10px',
                padding: '0.65rem 0.8rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.4rem',
              }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: w.col }}>{w.name}</div>
                <div style={{ fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.5 }}>{w.desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {w.actions.map((a) => (
                    <code key={a} style={{
                      fontSize: '0.6rem',
                      color: w.col,
                      background: `${w.col}10`,
                      padding: '2px 6px',
                      borderRadius: '3px',
                      border: `1px solid ${w.col}25`,
                      fontFamily: 'monospace',
                    }}>{a}</code>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 하단 — Status 6종 + status.tcl 흐름 */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.55rem',
          }}>
            {/* Status 6종 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.65rem 0.95rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: FPGA.dark }}>
                Status 6종 — Crossing별 부여
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem 0.55rem' }}>
                {statusOps.map((s) => (
                  <div key={s.s} style={{
                    display: 'flex', alignItems: 'center', gap: '0.45rem',
                    background: `${s.col}08`,
                    borderLeft: `3px solid ${s.col}`,
                    borderRadius: '5px',
                    padding: '0.3rem 0.6rem',
                  }}>
                    <span style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.66rem', fontWeight: 800,
                      color: s.col, minWidth: '72px',
                    }}>{s.s}</span>
                    <span style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.45 }}>{s.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.64rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.15rem' }}>
                Set Status 시 Owner · Reviewer · Comments 함께 기록 → V&V 추적성 확보.
              </div>
            </div>

            {/* status.tcl export 흐름 */}
            <div style={{
              background: `linear-gradient(135deg, ${DAY08}06, ${DAY08}14)`,
              border: `1px solid ${DAY08}30`,
              borderRadius: '10px',
              padding: '0.65rem 0.95rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: DAY08 }}>
                status.tcl 흐름
              </div>
              <pre style={{
                margin: 0, fontSize: '0.64rem', lineHeight: 1.5,
                background: '#1A2235', color: '#A8D8A8',
                padding: '0.5rem 0.7rem', borderRadius: '5px',
                fontFamily: 'ui-monospace, monospace',
                whiteSpace: 'pre-wrap',
              }}>
{`# scripts/run_cdc.tcl
do scripts/directives.tcl
do scripts/status.tcl     # ← 재실행 시 propagate
cdc run -d cdc_demo_top`}
              </pre>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.55 }}>
                <li>GUI: Export Status → <code>qs_files/status.tcl</code></li>
                <li><code>cdc report item</code> directive 자동 적용</li>
                <li>다음 분석에서 Waived/Verified 자동 유지</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
