'use client';

import { useMemo, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY05 = '#C05621';

type Cat = 'A' | 'B' | 'C' | 'D';

type UnsynthRule = {
  id: string;
  category: Cat;
  syntax: string;
  synthStatus: '완전 불가' | '조건부' | 'testbench-only';
  problem: string;
  fixBad: string;
  fixGood: string;
  do254Alias: string | null;
  lintCheck: string;
};

const catMeta: Record<Cat, { label: string; hint: string; color: string }> = {
  A: { label: 'Procedural-Only', hint: 'initial · fork-join · event · wait',             color: '#C05621' },
  B: { label: 'Delay / Time',    hint: '#delay · $time · @(posedge) 오용',                color: '#DD6B20' },
  C: { label: 'System Task',     hint: '$display · $monitor · $random',                    color: '#B7791F' },
  D: { label: 'Sim Artifact',    hint: 'force · release · real · dynamic',                 color: '#975A16' },
};

const rules: UnsynthRule[] = [
  // ── Category A ─ Procedural-Only ──
  {
    id: 'UNS-A-01', category: 'A',
    syntax: 'initial begin … end',
    synthStatus: 'testbench-only',
    problem: 'RTL에 사용 시 합성 도구가 무시 · 시뮬레이터에서만 초기값 설정',
    fixBad:  'initial q = 1\'b0;',
    fixGood: 'always @(posedge clk or negedge rst_n)\n  if (!rst_n) q <= 1\'b0;',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_initial_stmt',
  },
  {
    id: 'UNS-A-02', category: 'A',
    syntax: 'fork … join / join_any / join_none',
    synthStatus: '완전 불가',
    problem: '병렬 프로세스 — 합성 불가능 · testbench 전용',
    fixBad:  'fork a <= b; c <= d; join',
    fixGood: 'always @(posedge clk) begin a <= b; c <= d; end',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_fork_join',
  },
  {
    id: 'UNS-A-03', category: 'A',
    syntax: 'event · -> · @(event)',
    synthStatus: '완전 불가',
    problem: 'event 트리거 · 합성 불가 · synth 무시되어 sim-synth 불일치',
    fixBad:  'event done; -> done;',
    fixGood: 'reg done_pulse; // clk 기반 pulse',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_event',
  },
  {
    id: 'UNS-A-04', category: 'A',
    syntax: 'wait(expr);',
    synthStatus: '완전 불가',
    problem: 'zero-delay wait · 합성 대상 아님',
    fixBad:  'wait(en);',
    fixGood: '@(posedge clk) if (en) …',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_wait_stmt',
  },
  {
    id: 'UNS-A-05', category: 'A',
    syntax: 'final begin … end',
    synthStatus: '완전 불가',
    problem: 'SystemVerilog final — 시뮬 종료 시점 전용',
    fixBad:  'final $display("end");',
    fixGood: '// testbench로 분리',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_final_stmt',
  },

  // ── Category B ─ Delay / Time ──
  {
    id: 'UNS-B-01', category: 'B',
    syntax: '#n (inter-statement delay)',
    synthStatus: '완전 불가',
    problem: '합성 시 delay 무시 · sim-synth 동작 완전 다름',
    fixBad:  'q = #5 d;',
    fixGood: 'always @(posedge clk) q <= d;',
    do254Alias: 'CP15',
    lintCheck: 'nonblocking_assign_and_delay_in_always',
  },
  {
    id: 'UNS-B-02', category: 'B',
    syntax: '#(posedge clk) 지연 제어',
    synthStatus: '조건부',
    problem: 'always block 내 delay — 합성 무시',
    fixBad:  'always @(posedge clk) #2 q <= d;',
    fixGood: 'always @(posedge clk) q <= d;',
    do254Alias: 'CP15',
    lintCheck: 'delay_in_always',
  },
  {
    id: 'UNS-B-03', category: 'B',
    syntax: '$time · $realtime',
    synthStatus: '완전 불가',
    problem: '시뮬 시간 함수 — RTL 사용 금지',
    fixBad:  'if ($time > 100) …',
    fixGood: '// 카운터로 대체',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_system_function',
  },
  {
    id: 'UNS-B-04', category: 'B',
    syntax: '##n (cycle delay)',
    synthStatus: '완전 불가',
    problem: 'assertion·sequence 전용 · RTL 불가',
    fixBad:  '##3 a <= b;',
    fixGood: '// 카운터·FF chain',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_cycle_delay',
  },

  // ── Category C ─ System Task ──
  {
    id: 'UNS-C-01', category: 'C',
    syntax: '$display / $write / $monitor',
    synthStatus: 'testbench-only',
    problem: 'RTL 존재 시 합성 무시 · sim log와 실 동작 괴리',
    fixBad:  '$display("x=%d", x);',
    fixGood: '// testbench로 이동',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_display_task',
  },
  {
    id: 'UNS-C-02', category: 'C',
    syntax: '$random / $urandom',
    synthStatus: 'testbench-only',
    problem: 'RTL 사용 시 비결정성 · sim 마다 결과 상이',
    fixBad:  'q <= $random;',
    fixGood: '// LFSR 난수 발생기',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_random_task',
  },
  {
    id: 'UNS-C-03', category: 'C',
    syntax: '$finish / $stop',
    synthStatus: 'testbench-only',
    problem: '합성 무시 · testbench 종료 제어 전용',
    fixBad:  'if (err) $finish;',
    fixGood: '// 알람 신호 출력',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_finish_task',
  },
  {
    id: 'UNS-C-04', category: 'C',
    syntax: '$readmemh / $readmemb',
    synthStatus: '조건부',
    problem: 'BRAM 초기화 의도 시 합성 도구별 결과 상이',
    fixBad:  '$readmemh("mem.hex", ram);',
    fixGood: '// IP initialization parameter',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_readmem_task',
  },

  // ── Category D ─ Sim Artifact ──
  {
    id: 'UNS-D-01', category: 'D',
    syntax: 'force / release',
    synthStatus: '완전 불가',
    problem: '강제 구동 — testbench 전용 · 합성 불가',
    fixBad:  'force u0.x = 1\'b1;',
    fixGood: '// proper interface로 주입',
    do254Alias: 'SS6',
    lintCheck: 'unsynth_force_release',
  },
  {
    id: 'UNS-D-02', category: 'D',
    syntax: 'real / realtime 변수',
    synthStatus: '완전 불가',
    problem: '부동소수 — FPGA 합성 불가 · 의도 불명확',
    fixBad:  'real k = 0.5;',
    fixGood: '// 고정소수 reg [15:0]',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_real_var',
  },
  {
    id: 'UNS-D-03', category: 'D',
    syntax: 'dynamic / associative array',
    synthStatus: '완전 불가',
    problem: 'SV dynamic array · 합성 불가 · sim 전용',
    fixBad:  'int q[]; q = new[10];',
    fixGood: '// 고정 크기 배열',
    do254Alias: 'CP (unsynth)',
    lintCheck: 'unsynth_dynamic_array',
  },
  {
    id: 'UNS-D-04', category: 'D',
    syntax: 'tri / wor / wand',
    synthStatus: '조건부',
    problem: 'tristate 추론 가능 · 내부 신호 적용 시 SS1 위반',
    fixBad:  'tri [7:0] bus;',
    fixGood: '// 출력 포트 한정',
    do254Alias: 'SS1',
    lintCheck: 'tristate_inferred',
  },
  {
    id: 'UNS-D-05', category: 'D',
    syntax: 'implicit net 선언',
    synthStatus: '조건부',
    problem: '미선언 wire 자동 생성 → 오타 시 silent bug',
    fixBad:  'assign foo = bar; // foo 미선언',
    fixGood: '`default_nettype none',
    do254Alias: 'SS1',
    lintCheck: 'feedthrough_path',
  },
];

const statusColor = (s: UnsynthRule['synthStatus']) => {
  if (s === '완전 불가') return '#E53E3E';
  if (s === '조건부') return '#E8913A';
  return '#8B6FA5';
};

export default function UnsynthCatalogSlide() {
  const [activeCat, setActiveCat] = useState<Cat>('A');
  const [selectedId, setSelectedId] = useState<string>('UNS-A-01');

  const filtered = useMemo(() => rules.filter(r => r.category === activeCat), [activeCat]);
  const selected = useMemo(
    () => filtered.find(r => r.id === selectedId) ?? filtered[0],
    [filtered, selectedId]
  );

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Catalog"
          title="합성 불가 구문 카탈로그"
          subtitle="Procedural · Delay · System Task · Simulation Artifact — 4축 총 18건"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* 상단 탭 4개 */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(Object.keys(catMeta) as Cat[]).map((k) => {
              const m = catMeta[k];
              const active = activeCat === k;
              const count = rules.filter(r => r.category === k).length;
              return (
                <button
                  key={k}
                  onClick={() => {
                    setActiveCat(k);
                    const first = rules.find(r => r.category === k);
                    if (first) setSelectedId(first.id);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.8rem',
                    borderRadius: '10px',
                    border: active ? `2px solid ${m.color}` : `1px solid ${FPGA.border}`,
                    background: active
                      ? `linear-gradient(135deg, ${m.color}12, ${m.color}22)`
                      : FPGA.white,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.18s ease',
                    boxShadow: active ? shadow.card : 'none',
                    borderBottom: active ? `3px solid ${m.color}` : undefined,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.68rem', fontWeight: 800,
                      color: active ? m.color : FPGA.textLight,
                    }}>카테고리 {k}</span>
                    <span style={{
                      fontSize: '0.58rem', fontWeight: 700,
                      color: m.color, background: `${m.color}12`,
                      border: `1px solid ${m.color}30`,
                      padding: '1px 5px', borderRadius: '4px',
                    }}>{count}건</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: active ? FPGA.dark : FPGA.textLight, marginBottom: '2px' }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: FPGA.textLight, fontFamily: 'monospace' }}>
                    {m.hint}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 하단 2단: 규칙 리스트 + 상세 패널 */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '0.6rem',
          }}>
            {/* 규칙 리스트 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderTop: `3px solid ${catMeta[activeCat].color}`,
              borderRadius: '10px',
              padding: '0.5rem',
              overflow: 'auto',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '4px',
            }}>
              {filtered.map((r) => {
                const isSel = selected?.id === r.id;
                const col = catMeta[r.category].color;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.45rem 0.55rem',
                      borderRadius: '7px',
                      border: isSel ? `1.5px solid ${col}` : '1px solid transparent',
                      background: isSel ? `${col}12` : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.6rem', fontWeight: 800, color: col,
                        background: `${col}15`, border: `1px solid ${col}30`,
                        padding: '1px 5px', borderRadius: '3px',
                      }}>{r.id}</span>
                      <span style={{
                        fontSize: '0.55rem', fontWeight: 700,
                        color: statusColor(r.synthStatus),
                        background: `${statusColor(r.synthStatus)}15`,
                        border: `1px solid ${statusColor(r.synthStatus)}30`,
                        padding: '0 4px', borderRadius: '3px',
                      }}>{r.synthStatus}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isSel ? FPGA.dark : FPGA.text, fontFamily: 'monospace' }}>
                      {r.syntax}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 상세 패널 */}
            {selected && (
              <div key={selected.id} style={{
                background: `linear-gradient(135deg, ${catMeta[activeCat].color}06, ${catMeta[activeCat].color}10)`,
                border: `1px solid ${catMeta[activeCat].color}30`,
                borderLeft: `4px solid ${catMeta[activeCat].color}`,
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                overflow: 'auto',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
                animation: 'fadeIn 200ms ease-out',
              }}>
                <style>{`@keyframes fadeIn { from { opacity: 0.2; } to { opacity: 1; } }`}</style>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.74rem', fontWeight: 800, color: catMeta[activeCat].color,
                    background: `${catMeta[activeCat].color}15`,
                    border: `1px solid ${catMeta[activeCat].color}40`,
                    padding: '2px 8px', borderRadius: '4px',
                  }}>{selected.id}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: FPGA.dark, fontFamily: 'monospace' }}>
                    {selected.syntax}
                  </span>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700,
                    color: statusColor(selected.synthStatus),
                    background: `${statusColor(selected.synthStatus)}15`,
                    border: `1px solid ${statusColor(selected.synthStatus)}40`,
                    padding: '2px 7px', borderRadius: '4px',
                  }}>{selected.synthStatus}</span>
                </div>

                <div style={{ fontSize: '0.76rem', color: FPGA.text, lineHeight: 1.55 }}>
                  <strong style={{ color: '#E53E3E' }}>문제: </strong>
                  {selected.problem}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div style={{
                    background: '#1A2235',
                    borderRadius: '6px',
                    padding: '0.5rem 0.7rem',
                    borderLeft: '3px solid #E53E3E',
                  }}>
                    <div style={{ fontSize: '0.56rem', fontWeight: 700, color: '#E53E3E', marginBottom: '3px', letterSpacing: '0.06em' }}>✗ BAD</div>
                    <pre style={{
                      margin: 0, fontSize: '0.66rem', color: '#F0A0A0',
                      fontFamily: '"JetBrains Mono", monospace',
                      whiteSpace: 'pre-wrap',
                    }}>{selected.fixBad}</pre>
                  </div>
                  <div style={{
                    background: '#1A2235',
                    borderRadius: '6px',
                    padding: '0.5rem 0.7rem',
                    borderLeft: '3px solid #48BB78',
                  }}>
                    <div style={{ fontSize: '0.56rem', fontWeight: 700, color: '#48BB78', marginBottom: '3px', letterSpacing: '0.06em' }}>✓ GOOD</div>
                    <pre style={{
                      margin: 0, fontSize: '0.66rem', color: '#A8D8A8',
                      fontFamily: '"JetBrains Mono", monospace',
                      whiteSpace: 'pre-wrap',
                    }}>{selected.fixGood}</pre>
                  </div>
                </div>

                <div style={{
                  display: 'flex', gap: '8px', flexWrap: 'wrap',
                  paddingTop: '0.3rem',
                  borderTop: `1px dashed ${catMeta[activeCat].color}30`,
                }}>
                  <span style={{ fontSize: '0.68rem', color: FPGA.textLight }}>
                    <strong>DO-254: </strong>
                    <span style={{ color: DAY05, fontWeight: 700, fontFamily: 'monospace' }}>{selected.do254Alias ?? '(unsynth 일괄)'}</span>
                  </span>
                  <span style={{ fontSize: '0.68rem', color: FPGA.textLight }}>
                    <strong>Check: </strong>
                    <code style={{ fontSize: '0.66rem', color: FPGA.primary, fontFamily: 'monospace' }}>{selected.lintCheck}</code>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
