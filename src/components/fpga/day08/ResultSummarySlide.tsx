'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY08 = '#0E7C7B';

const summary = [
  {
    cat: 'Violations',
    n: 5,
    col: '#E53E3E',
    items: [
      { scheme: 'no_sync', cnt: 3, desc: 'BUG1 (1) + BUG2 cascade (2)' },
      { scheme: 'combo_logic', cnt: 1, desc: 'BUG3 — 2DFF 앞 합산 식' },
      { scheme: 'multi_bits', cnt: 1, desc: 'BUG2 — threshold/offset bus 미보호' },
    ],
  },
  {
    cat: 'Evaluations',
    n: 4,
    col: '#4A6FA5',
    items: [
      { scheme: 'bus_two_dff', cnt: 2, desc: 'trip_count_sum 동기화 (BUG3와 짝)' },
      { scheme: 'pulse_sync', cnt: 1, desc: 'alarm_pulse 전달' },
      { scheme: 'fifo', cnt: 1, desc: 'sensor sample async FIFO' },
    ],
  },
  {
    cat: 'Proven',
    n: 1,
    col: '#48BB78',
    items: [
      { scheme: 'two_dff', cnt: 1, desc: 'proc_enable — clock 비 < 2 자동 증명' },
    ],
  },
];

export default function ResultSummarySlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="분석 결과 해석"
          title="CDC Run 실측 결과 — 10 checks"
          subtitle="3개 violation 그룹 + 3개 정상 sync · status 흐름 파악"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* 카테고리별 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.55rem' }}>
            {summary.map((g) => (
              <div key={g.cat} style={{
                background: FPGA.white,
                border: `1px solid ${g.col}30`,
                borderTop: `3px solid ${g.col}`,
                borderRadius: '10px',
                padding: '0.6rem 0.85rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.4rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: g.col }}>{g.cat}</span>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.78rem', fontWeight: 800,
                    color: '#fff', background: g.col,
                    padding: '2px 10px', borderRadius: '12px',
                  }}>{g.n}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {g.items.map((it) => (
                    <div key={it.scheme} style={{
                      background: `${g.col}06`,
                      border: `1px solid ${g.col}20`,
                      borderRadius: '6px',
                      padding: '0.35rem 0.55rem',
                      display: 'flex', flexDirection: 'column', gap: '0.15rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <code style={{
                          fontSize: '0.65rem', fontWeight: 700,
                          color: g.col, background: `${g.col}12`,
                          padding: '1px 6px', borderRadius: '3px',
                          fontFamily: 'monospace',
                        }}>{it.scheme}</code>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: FPGA.dark }}>×{it.cnt}</span>
                      </div>
                      <div style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.45 }}>{it.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 하단 — 실제 console output (lab 회로) */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.6rem',
          }}>
            <div style={{
              background: '#1A2235',
              border: `1px solid ${DAY08}40`,
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              boxShadow: shadow.card,
              fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
            }}>
              <div style={{
                fontSize: '0.66rem', fontWeight: 800,
                color: '#A8D8A8', marginBottom: '0.3rem',
                letterSpacing: '0.04em',
              }}>cdc_result/cdc.rpt — Section 3</div>
              <pre style={{ margin: 0, fontSize: '0.6rem', lineHeight: 1.5, color: '#E2E8F0', whiteSpace: 'pre-wrap' }}>
{`Total number of checks                              (10)
─────────────────────────────────────────────────────────
Violations (5)
  Single-bit signal does not have proper sync.        (3)
  Combinational logic before synchronizer.            (1)
  Multiple-bit signal across clock domain boundary.   (1)
Evaluations (4)
  Multiple-bit signal synchronized by DFF sync.       (2)
  Pulse Synchronization.                              (1)
  FIFO synchronization.                               (1)
Proven (1)
  Single-bit signal synchronized by DFF synchronizer. (1)`}
              </pre>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.14))',
              border: '1px solid rgba(229,62,62,0.30)',
              borderLeft: '4px solid #E53E3E',
              borderRadius: '10px',
              padding: '0.6rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.35rem',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#E53E3E' }}>
                Status 흐름
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li><strong>Uninspected</strong> — 분석 직후 초기 상태</li>
                <li><strong>Pending</strong> — 검토 중 / 수정 작업 중</li>
                <li><strong>Bug</strong> — 결함 확정</li>
                <li><strong>Fixed</strong> — RTL 수정 후 사라질 예정</li>
                <li><strong>Waived</strong> — 검증 완료 · 무시</li>
                <li><strong>Verified</strong> — V&V 산출물 등재 완료</li>
              </ul>
              <div style={{ fontSize: '0.6rem', color: FPGA.textLight, fontStyle: 'italic' }}>
                Severity는 scheme 단위 · Status는 crossing 단위.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
