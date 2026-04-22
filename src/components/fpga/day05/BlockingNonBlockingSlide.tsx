'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY05 = '#C05621';

type Sev = 'Error' | 'Warning';

type Pattern = {
  id: string;
  alias: string;
  title: string;
  block: string;
  problem: string;
  bad: string;
  good: string;
  check: string[];
  sev: Sev;
  waiver: string;
};

const patterns: Pattern[] = [
  {
    id: 'P1',
    alias: 'CP17',
    title: 'Sequential 블록에서 `=` 금지',
    block: 'always @(posedge clk)',
    problem: '시뮬레이터 평가 순서 의존 → race condition · synth는 NB 해석',
    bad:
`always @(posedge clk) begin
  q1 = d;      // blocking
  q2 = q1;     // q1 즉시 반영
end`,
    good:
`always @(posedge clk) begin
  q1 <= d;
  q2 <= q1;    // 직전 clk의 q1
end`,
    check: ['blocking_assign_in_seq_block'],
    sev: 'Error',
    waiver: 'waiver 금지',
  },
  {
    id: 'P2',
    alias: 'CP15',
    title: 'Combo 블록에서 `<=` 금지',
    block: 'always @(*) · always_comb',
    problem: '불필요 NB 지연 → synth는 즉시 전파로 해석 · sim 타이밍 상이',
    bad:
`always @(*) begin
  y <= a & b;       // NB in combo
end`,
    good:
`always @(*) begin
  y = a & b;        // blocking
end`,
    check: ['nonblocking_assign_in_combo_block', 'nonblocking_assign_and_delay_in_always'],
    sev: 'Error',
    waiver: 'waiver 금지',
  },
  {
    id: 'P3',
    alias: 'SS6',
    title: '단일 신호 중복 구동 금지',
    block: '다중 always · concurrent assign',
    problem: 'multi-driver → 합성 오류 · sim은 마지막 드라이버로 해석',
    bad:
`always @(posedge clk) q <= d;
assign q = ctl;  // ← same net`,
    good:
`always @(posedge clk)
  q <= ctl ? ctl_val : d;`,
    check: ['multi_driven_signal'],
    sev: 'Error',
    waiver: 'waiver 금지',
  },
  {
    id: 'P4',
    alias: 'CP18',
    title: '동일 always 내 `=`/`<=` 혼용',
    block: 'always @(posedge clk)',
    problem: 'pipeline data hazard · 의도 불명확 → 리뷰 리스크',
    bad:
`always @(posedge clk) begin
  tmp = a + b;     // blocking
  out <= tmp;      // NB
end`,
    good:
`always @(posedge clk) begin
  tmp <= a + b;
  out <= tmp;      // 한 clk 지연 의도
end`,
    check: ['assigns_mixed'],
    sev: 'Warning',
    waiver: '정당화 후 허용',
  },
];

function SevBadge({ sev }: { sev: Sev }) {
  const col = sev === 'Error' ? '#E53E3E' : '#E8913A';
  return (
    <span style={{
      fontSize: '0.58rem', fontWeight: 800, color: '#fff',
      background: col,
      padding: '2px 8px', borderRadius: '4px',
      letterSpacing: '0.06em',
      fontFamily: '"JetBrains Mono", monospace',
    }}>{sev}</span>
  );
}

export default function BlockingNonBlockingSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="DO-254 · CP15 / CP17 / CP18 / SS6"
          title="Blocking vs Non-Blocking 오용 4 패턴"
          subtitle="= / <= 오용이 mismatch를 만드는 정확한 메커니즘"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* 상단 비교 요약 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
          }}>
            {[
              {
                title: 'Blocking  `=`',
                color: '#4A6FA5',
                rows: [
                  ['평가', '즉시 · 순차'],
                  ['용도', 'combo · temp'],
                  ['오용', 'seq 블록 race (CP17)'],
                ],
              },
              {
                title: 'Non-Blocking  `<=`',
                color: DAY05,
                rows: [
                  ['평가', 'RHS 전체 후 LHS 갱신'],
                  ['용도', 'sequential (FF)'],
                  ['오용', 'combo에서 지연 (CP15)'],
                ],
              },
            ].map((col) => (
              <div key={col.title} style={{
                background: FPGA.white,
                border: `1px solid ${col.color}30`,
                borderTop: `3px solid ${col.color}`,
                borderRadius: '10px',
                padding: '0.5rem 0.8rem',
                boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: col.color, marginBottom: '0.3rem', fontFamily: 'monospace' }}>
                  {col.title}
                </div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  {col.rows.map(([k, v]) => (
                    <div key={k} style={{ fontSize: '0.68rem' }}>
                      <span style={{ color: FPGA.textLight, fontWeight: 700 }}>{k}: </span>
                      <span style={{ color: FPGA.text }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 4 패턴 박스 */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '0.5rem',
          }}>
            {patterns.map((p) => (
              <div key={p.id} style={{
                background: FPGA.white,
                border: `1px solid ${DAY05}25`,
                borderLeft: `4px solid ${DAY05}`,
                borderRadius: '10px',
                padding: '0.5rem 0.7rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = shadow.cardHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = shadow.card;
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.62rem', fontWeight: 800, color: '#fff',
                    background: DAY05,
                    padding: '2px 7px', borderRadius: '4px',
                    letterSpacing: '0.06em',
                  }}>{p.id} · {p.alias}</span>
                  <SevBadge sev={p.sev} />
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: FPGA.dark }}>
                    {p.title}
                  </span>
                </div>

                <div style={{ fontSize: '0.64rem', color: FPGA.textLight, fontFamily: 'monospace' }}>
                  {p.block}
                </div>

                <div style={{ fontSize: '0.65rem', color: FPGA.text, lineHeight: 1.45 }}>
                  {p.problem}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  <pre style={{
                    margin: 0, fontSize: '0.56rem', lineHeight: 1.35,
                    background: '#1A2235', color: '#F0A0A0',
                    padding: '4px 6px', borderRadius: '4px',
                    borderLeft: '2px solid #E53E3E',
                    fontFamily: '"JetBrains Mono", monospace',
                    whiteSpace: 'pre-wrap',
                  }}>{p.bad}</pre>
                  <pre style={{
                    margin: 0, fontSize: '0.56rem', lineHeight: 1.35,
                    background: '#1A2235', color: '#A8D8A8',
                    padding: '4px 6px', borderRadius: '4px',
                    borderLeft: '2px solid #48BB78',
                    fontFamily: '"JetBrains Mono", monospace',
                    whiteSpace: 'pre-wrap',
                  }}>{p.good}</pre>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '0.6rem', color: FPGA.textLight,
                  paddingTop: '2px', borderTop: '1px dashed #E2E8F0',
                  flexWrap: 'wrap',
                }}>
                  <code style={{ fontSize: '0.58rem', color: FPGA.primary, fontFamily: 'monospace' }}>
                    {p.check.join(' / ')}
                  </code>
                  <span style={{ marginLeft: 'auto', fontStyle: 'italic' }}>{p.waiver}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
