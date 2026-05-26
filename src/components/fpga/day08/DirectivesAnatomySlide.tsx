'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY08 = '#0E7C7B';

const groups = [
  {
    cat: 'Clock / Reset',
    col: '#4A6FA5',
    items: [
      { cmd: 'netlist clock <pat> -period N -group G', d: '주파수 · group 지정. 다른 group = 비동기.' },
      { cmd: 'netlist port domain <p> -clock C | -async', d: 'primary I/O 클럭 도메인 지정.' },
      { cmd: 'netlist reset <pat>', d: 'reset tree 명시 (hdl-238 해소).' },
    ],
  },
  {
    cat: 'Scheme · Methodology',
    col: DAY08,
    items: [
      { cmd: 'cdc scheme on fifo handshake', d: 'FIFO / handshake 패턴 검출 활성.' },
      { cmd: 'cdc methodology fpga -goal start', d: 'FPGA 메소돌로지 · start goal.' },
      { cmd: 'cdc reconvergence on', d: 'reconvergence check (planning+ 권장).' },
    ],
  },
  {
    cat: 'Signal · Waiver',
    col: '#8B6FA5',
    items: [
      { cmd: 'cdc signal <pat> -stable', d: 'SW가 한 번만 쓰는 config는 stable로 표시.' },
      { cmd: 'cdc signal <pat> -gray_coded', d: 'gray-code 적용된 multi-bit.' },
      { cmd: 'cdc report item -scheme S -severity ...', d: 'waive / 등급 변경. status.tcl로 export.' },
    ],
  },
];

export default function DirectivesAnatomySlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Directives"
          title="directives.tcl — 구조 + 핵심 9 가지"
          subtitle="Clock/Reset → Scheme/Methodology → Signal/Waiver 순으로 작성"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* 3개 카테고리 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.55rem' }}>
            {groups.map((g) => (
              <div key={g.cat} style={{
                background: FPGA.white,
                border: `1px solid ${g.col}25`,
                borderTop: `3px solid ${g.col}`,
                borderRadius: '10px',
                padding: '0.55rem 0.75rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.4rem',
              }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: g.col }}>{g.cat}</div>
                {g.items.map((it) => (
                  <div key={it.cmd} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <code style={{
                      fontSize: '0.62rem',
                      background: '#1A2235', color: '#A8D8A8',
                      padding: '3px 6px', borderRadius: '4px',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{it.cmd}</code>
                    <div style={{ fontSize: '0.62rem', color: FPGA.textLight, lineHeight: 1.45, paddingLeft: '4px' }}>
                      {it.d}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* 하단 — 실제 directives.tcl (lab 회로) */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.6rem',
          }}>
            <div style={{
              background: '#1A2235',
              border: `1px solid ${DAY08}40`,
              borderLeft: `4px solid ${DAY08}`,
              borderRadius: '10px',
              padding: '0.6rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.3rem',
              fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
            }}>
              <div style={{
                fontSize: '0.7rem', fontWeight: 800,
                color: '#A8D8A8', letterSpacing: '0.05em',
              }}>
                scripts/directives.tcl — questa_cdc_lab
              </div>
              <pre style={{
                margin: 0, fontSize: '0.62rem', lineHeight: 1.55,
                color: '#E2E8F0', whiteSpace: 'pre-wrap',
              }}>
{`# clocks (3 async groups)
netlist clock adc_clk  -period 20
netlist clock proc_clk -period 10
netlist clock bus_clk  -period 25

# rst: 3-domain primary input
# (expected: hdl-41 / hdl-238 / hdl-289)

# scheme detection
cdc scheme on fifo handshake

# methodology + goal
cdc methodology fpga -goal start`}
              </pre>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY08}06, ${DAY08}16)`,
              border: `1px solid ${DAY08}30`,
              borderRadius: '10px',
              padding: '0.6rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.35rem',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: DAY08 }}>적용 결과</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.65 }}>
                <li><strong>3개 user-specified</strong> clock group → 비동기로 분류</li>
                <li>FIFO / handshake 자동 탐지 (default off in v2025.3, 명시 필요)</li>
                <li>FPGA goal=start → reconvergence는 disabled (noise 감소)</li>
                <li>rst의 hdl-41 error는 정상 expected — 후속 단계에서 분배 처리</li>
              </ul>
              <div style={{
                fontSize: '0.6rem', color: FPGA.textLight,
                fontStyle: 'italic', marginTop: '0.2rem',
              }}>
                Tip: directives는 순차 적용 · 충돌 시 last-one-wins.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
