'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY05 = '#C05621';

type Pattern = {
  id: string;
  alias: string;
  title: string;
  code: string;
  mismatch: string;
  check: string;
  svg: React.ReactNode;
};

function MiniWave({ signals }: { signals: { name: string; seq: (0 | 1 | 'x')[]; color: string }[] }) {
  const pitch = 18;
  const h = 16;
  const top = 6;

  return (
    <svg viewBox="0 0 200 80" style={{ width: '100%', height: 'auto' }}>
      {signals.map((s, si) => {
        const y = top + si * 22;
        let path = '';
        let x = 36;
        let lastY = s.seq[0] === 1 ? y : y + h;
        path += `M${x} ${lastY}`;
        for (let i = 0; i < s.seq.length; i++) {
          const val = s.seq[i];
          const ny = val === 1 ? y : val === 0 ? y + h : y + h / 2;
          if (i > 0) path += ` L${x} ${ny}`;
          x += pitch;
          path += ` L${x} ${ny}`;
          lastY = ny;
        }
        return (
          <g key={s.name}>
            <text x="4" y={y + 12} fontSize="8" fontWeight="800" fill={s.color} fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>{s.name}</text>
            <line x1="36" y1={y + h + 2} x2="36" y2={y - 2} stroke={s.color} strokeWidth="0.5" opacity="0.3" />
            <path d={path} stroke={s.color} strokeWidth="1.5" fill="none" />
          </g>
        );
      })}
    </svg>
  );
}

const patterns: Pattern[] = [
  {
    id: 'R1',
    alias: 'CP8',
    title: '감도 리스트 불완전성',
    code:
`always @(a or b)   // ← c 누락
  y = a & b & c;`,
    mismatch: 'sim: c 변경 무시 → synth: 항상 반영 → mismatch',
    check: 'sensitivity_list_var_missing',
    svg: <MiniWave signals={[
      { name: 'c',      seq: [0, 1, 1, 0, 0, 1], color: '#4A6FA5' },
      { name: 'sim.y',  seq: [0, 0, 0, 0, 0, 0], color: '#E53E3E' },
      { name: 'syn.y',  seq: [0, 1, 1, 0, 0, 1], color: '#48BB78' },
    ]} />,
  },
  {
    id: 'R2',
    alias: 'CP (unsynth)',
    title: 'initial 블록 순서 비결정성',
    code:
`initial a = 0;
initial a = 1;     // ← sim 의존`,
    mismatch: 'sim: 시뮬레이터별 다른 결과 · synth: 무시 → 초기값 미정의',
    check: 'unsynth_initial_stmt',
    svg: <MiniWave signals={[
      { name: 'sim1', seq: ['x', 0, 0, 0, 0, 0], color: '#E53E3E' },
      { name: 'sim2', seq: ['x', 1, 1, 1, 1, 1], color: '#E8913A' },
      { name: 'syn',  seq: ['x', 'x', 'x', 'x', 'x', 'x'], color: '#8B6FA5' },
    ]} />,
  },
  {
    id: 'R3',
    alias: 'SS6',
    title: '중복 구동 — continuous + procedural',
    code:
`assign q = a;                 // continuous
always @(*) q = b;            // procedural
// same net → multi-driver`,
    mismatch: 'sim: 마지막 구동으로 해석 · synth: 오류 · 보드 동작 불가',
    check: 'multi_driven_signal',
    svg: <MiniWave signals={[
      { name: 'a',   seq: [0, 1, 0, 1, 0, 1], color: '#4A6FA5' },
      { name: 'b',   seq: [1, 0, 1, 0, 1, 0], color: '#E8913A' },
      { name: 'q',   seq: ['x', 'x', 'x', 'x', 'x', 'x'], color: '#E53E3E' },
    ]} />,
  },
  {
    id: 'R4',
    alias: 'SS3',
    title: '조합 피드백 루프 (zero-delay)',
    code:
`assign a = b & c;
assign b = a | d;   // a ← b ← a
// combinational loop`,
    mismatch: 'sim: 무한 iteration · synth: 링 오실레이터 · timing 계산 불가',
    check: 'combo_loop, combo_loop_with_latch',
    svg: <MiniWave signals={[
      { name: 'd',   seq: [0, 0, 1, 1, 0, 1], color: '#4A6FA5' },
      { name: 'a',   seq: ['x', 'x', 'x', 'x', 'x', 'x'], color: '#E53E3E' },
      { name: 'b',   seq: ['x', 'x', 'x', 'x', 'x', 'x'], color: '#E53E3E' },
    ]} />,
  },
];

export default function RaceConditionSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="DO-254 · SS3 / SS6 / CP8"
          title="Race Condition 4 패턴"
          subtitle="회로 해석 + 파형으로 본 sim ≠ synth"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '0.5rem',
          }}>
            {patterns.map((p) => (
              <div key={p.id} style={{
                background: `linear-gradient(135deg, ${DAY05}04, ${DAY05}10)`,
                border: `1px solid ${DAY05}30`,
                borderTop: `3px solid ${DAY05}`,
                borderRadius: '10px',
                padding: '0.5rem 0.7rem',
                boxShadow: shadow.card,
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                gap: '0.3rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.6rem', fontWeight: 800, color: '#fff',
                    background: '#E53E3E',
                    padding: '2px 7px', borderRadius: '4px',
                  }}>{p.id} · {p.alias}</span>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: FPGA.dark }}>{p.title}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.4rem' }}>
                  <pre style={{
                    margin: 0, fontSize: '0.58rem', lineHeight: 1.4,
                    background: '#1A2235', color: '#DCDCDC',
                    padding: '5px 7px', borderRadius: '5px',
                    fontFamily: '"JetBrains Mono", monospace',
                    whiteSpace: 'pre-wrap',
                  }}>{p.code}</pre>
                  <div style={{
                    background: FPGA.white,
                    border: '1px solid #E2E8F0',
                    borderRadius: '5px',
                    padding: '3px',
                  }}>
                    {p.svg}
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.6rem', color: FPGA.text,
                  paddingTop: '2px', borderTop: '1px dashed #E2E8F0',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ color: '#E53E3E', fontWeight: 700 }}>▲ mismatch:</span>
                  <span style={{ flex: 1, minWidth: 0 }}>{p.mismatch}</span>
                  <code style={{ fontSize: '0.55rem', color: FPGA.primary, fontFamily: 'monospace' }}>{p.check}</code>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 배너 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(229,62,62,0.08), rgba(229,62,62,0.14))',
            border: '1px solid rgba(229,62,62,0.30)',
            borderRadius: '10px',
            padding: '0.55rem 0.9rem',
            fontSize: '0.76rem',
            color: FPGA.text,
            lineHeight: 1.5,
            display: 'flex', alignItems: 'center', gap: '0.7rem',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
              <path d="M10 2L1 18h18L10 2z" stroke="#E53E3E" strokeWidth="1.8" fill="rgba(229,62,62,0.12)" />
              <path d="M10 8v5M10 15v1" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div>
              <strong style={{ color: '#E53E3E' }}>race condition = 시뮬레이터 구현 의존 거동</strong> — DO-254 V&V 증빙 근거 불가 · lint 자동화로 조기 차단 필수.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
