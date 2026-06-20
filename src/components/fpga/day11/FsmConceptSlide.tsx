'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY11 = '#3D8361';      // Moore (green)
const MEALY = '#8B6FA5';      // Mealy (purple)
const BLUE = '#4A6FA5';       // 입력
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

// ───────────────────────────────────────────────────────────
//  같은 머신 = "11" 연속 검출기 (din 에 1이 두 번 연속 → dout=1)
//  Moore : 상태 3개(S0/S1/S2), 출력 = (state==S2)        → 상태만
//  Mealy : 상태 2개(S0/S1),    출력 = (state==S1)&din     → 상태+입력
// ───────────────────────────────────────────────────────────
const mooreNext = (s: number, b: number) => (s === 0 ? (b ? 1 : 0) : s === 1 ? (b ? 2 : 0) : (b ? 2 : 0));
const mealyNext = (_s: number, b: number) => (b ? 1 : 0);
const DEMO = [0, 1, 1, 0, 1, 1, 1];

interface Tick { din: number; mo: number; me: number; }

const mooreCode = `parameter S0=0, S1=1, S2=2;     // 상태 3개
// 다음상태 (조합)
always @* case (state)
  S0: nxt = din ? S1 : S0;
  S1: nxt = din ? S2 : S0;
  S2: nxt = din ? S2 : S0;
endcase
// 출력 (조합) — ★ 상태만
always @* dout = (state == S2);`;

const mealyCode = `parameter S0=0, S1=1;           // 상태 2개
// 다음상태 (조합)
always @* case (state)
  S0: nxt = din ? S1 : S0;
  S1: nxt = din ? S1 : S0;
endcase

// 출력 (조합) — ★ 상태 + 입력
always @* dout = (state==S1) & din;`;

export default function FsmConceptSlide() {
  const [mode, setMode] = useState<'moore' | 'mealy'>('moore');
  const [ms, setMs] = useState(0);   // Moore 현재 상태
  const [es, setEs] = useState(0);   // Mealy 현재 상태
  const [tape, setTape] = useState<Tick[]>([]);

  const modeC = mode === 'moore' ? DAY11 : MEALY;

  const feed = (b: number) => {
    // 출력은 '현재 상태' 기준(이번 사이클) → 그 다음 천이
    const mo = ms === 2 ? 1 : 0;
    const me = es === 1 && b === 1 ? 1 : 0;
    setMs((s) => mooreNext(s, b));
    setEs((s) => mealyNext(s, b));
    setTape((t) => [...t.slice(-12), { din: b, mo, me }]);
  };
  const reset = () => { setMs(0); setEs(0); setTape([]); };
  const demo = () => {
    let m = 0, e = 0; const ticks: Tick[] = [];
    for (const b of DEMO) {
      ticks.push({ din: b, mo: m === 2 ? 1 : 0, me: e === 1 && b === 1 ? 1 : 0 });
      m = mooreNext(m, b); e = mealyNext(e, b);
    }
    setMs(m); setEs(e); setTape(ticks);
  };

  const cur = mode === 'moore' ? ms : es;
  const curOut = mode === 'moore' ? (ms === 2 ? 1 : 0) : null; // Mealy는 입력에 따라 달라 표기 보류

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 1 · 개념"
          title="FSM 출력 모델 — Moore vs Mealy"
          subtitle={`같은 "11" 검출기를 두 방식으로 — 출력이 '상태만'(Moore)이냐 '상태+입력'(Mealy)이냐가 차이의 전부`}
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.16fr 1fr', gap: '0.7rem' }}>
          {/* ══════════ 좌: 상태도 + 직접 돌려보기 ══════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>

            {/* 상태도 (토글) */}
            <div style={{
              background: FPGA.white, border: `1px solid ${modeC}30`,
              borderTop: `3px solid ${modeC}`, borderRadius: '11px',
              padding: '0.45rem 0.65rem 0.3rem', boxShadow: shadow.card,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.1rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark }}>상태 천이도 — “11” 검출</span>
                <span style={{ fontSize: '0.54rem', color: modeC, fontWeight: 700 }}>
                  {mode === 'moore' ? '출력은 원(bubble) 안' : '출력은 화살표 위 (입력/출력)'}
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', background: FPGA.bgAlt, borderRadius: '7px', padding: '2px' }}>
                  {(['moore', 'mealy'] as const).map((m) => {
                    const on = mode === m; const c = m === 'moore' ? DAY11 : MEALY;
                    return (
                      <button key={m} onClick={() => setMode(m)} style={{
                        cursor: 'pointer', fontSize: '0.62rem', fontWeight: 800, fontFamily: MONO,
                        border: 'none', borderRadius: '5px', padding: '2px 12px', textTransform: 'capitalize',
                        color: on ? '#fff' : c, background: on ? c : 'transparent',
                        boxShadow: on ? '0 1px 4px rgba(0,0,0,0.18)' : 'none',
                      }}>{m}</button>
                    );
                  })}
                </div>
              </div>

              {mode === 'moore' ? (
                /* ── Moore: 3상태, 출력 bubble 안 ── */
                <svg viewBox="0 0 330 126" style={{ width: '100%' }}>
                  {/* 정방향 din=1 (실선) */}
                  <path d="M70 60 H140" stroke={DAY11} strokeWidth="1.7" markerEnd="url(#mg)" />
                  <text x="105" y="52" fontSize="8" fontWeight="700" fill={DAY11} textAnchor="middle" fontFamily={MONO}>1</text>
                  <path d="M190 60 H260" stroke={DAY11} strokeWidth="1.7" markerEnd="url(#mg)" />
                  <text x="225" y="52" fontSize="8" fontWeight="700" fill={DAY11} textAnchor="middle" fontFamily={MONO}>1</text>
                  {/* S2 self-loop din=1 */}
                  <path d="M276 46 A12 12 0 1 1 296 48" fill="none" stroke={DAY11} strokeWidth="1.6" markerEnd="url(#mg)" />
                  <text x="286" y="30" fontSize="8" fontWeight="700" fill={DAY11} textAnchor="middle" fontFamily={MONO}>1</text>
                  {/* din=0 복귀 (점선) — S1→S0 위쪽 / S2→S0 아래쪽으로 분리해 중첩 방지 */}
                  <path d="M150 48 A58 58 0 0 0 60 48" fill="none" stroke={FPGA.textLight} strokeWidth="1.3" strokeDasharray="4 3" markerEnd="url(#mgr)" />
                  <text x="105" y="20" fontSize="7.5" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>0</text>
                  <path d="M283 90 Q165 124 47 90" fill="none" stroke={FPGA.textLight} strokeWidth="1.3" strokeDasharray="4 3" markerEnd="url(#mgr)" />
                  <text x="200" y="120" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>din=0 → S0 복귀</text>
                  {/* states */}
                  {[{ x: 45, n: 'S0', o: '0' }, { x: 165, n: 'S1', o: '0' }, { x: 285, n: 'S2', o: '1' }].map((s, i) => {
                    const act = ms === i; const hit = i === 2;
                    const c = hit ? '#37A862' : DAY11;
                    return (
                      <g key={s.n}>
                        {act && <circle cx={s.x} cy={66} r="27" fill={c} opacity="0.16" />}
                        <circle cx={s.x} cy={66} r="22" fill={act ? `${c}26` : '#F4F6F9'} stroke={c} strokeWidth={act ? 2.8 : 1.5} />
                        <text x={s.x} y={63} fontSize="9.5" fontWeight="800" fill={c} textAnchor="middle" fontFamily={MONO}>{s.n}</text>
                        <text x={s.x} y={76} fontSize="8.5" fontWeight="700" fill={hit ? '#37A862' : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>/{s.o}</text>
                      </g>
                    );
                  })}
                  <defs>
                    <marker id="mg" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={DAY11} /></marker>
                    <marker id="mgr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={FPGA.textLight} /></marker>
                  </defs>
                </svg>
              ) : (
                /* ── Mealy: 2상태, 출력 화살표 위 ── */
                <svg viewBox="0 0 330 126" style={{ width: '100%' }}>
                  {/* S0→S1 (1/0) */}
                  <path d="M108 50 Q165 24 222 50" fill="none" stroke={MEALY} strokeWidth="1.7" markerEnd="url(#ep)" />
                  <text x="165" y="26" fontSize="8" fontWeight="700" fill={MEALY} textAnchor="middle" fontFamily={MONO}>1 / 0</text>
                  {/* S1→S0 (0/0) */}
                  <path d="M222 84 Q165 110 108 84" fill="none" stroke={FPGA.textLight} strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#epr)" />
                  <text x="165" y="108" fontSize="7.5" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>0 / 0</text>
                  {/* S1 self-loop (1/1) ★ */}
                  <path d="M235 44 A12 12 0 1 1 255 46" fill="none" stroke={ORANGE} strokeWidth="2" markerEnd="url(#eo)" />
                  <text x="245" y="28" fontSize="8.5" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>1 / 1</text>
                  {/* S0 self-loop (0/0) */}
                  <path d="M75 86 A11 11 0 1 0 95 88" fill="none" stroke={FPGA.textLight} strokeWidth="1.3" strokeDasharray="4 3" markerEnd="url(#epr)" />
                  <text x="85" y="108" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>0 / 0</text>
                  {/* states (출력 표기 없음) */}
                  {[{ x: 85, n: 'S0' }, { x: 245, n: 'S1' }].map((s, i) => {
                    const act = es === i;
                    return (
                      <g key={s.n}>
                        {act && <circle cx={s.x} cy={66} r="29" fill={MEALY} opacity="0.16" />}
                        <circle cx={s.x} cy={66} r="24" fill={act ? `${MEALY}26` : '#F4F6F9'} stroke={MEALY} strokeWidth={act ? 2.8 : 1.5} />
                        <text x={s.x} y={70} fontSize="10" fontWeight="800" fill={MEALY} textAnchor="middle" fontFamily={MONO}>{s.n}</text>
                      </g>
                    );
                  })}
                  <text x="245" y="124" fontSize="7" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>★ S1에서 din=1 → 즉시 출력 1</text>
                  <defs>
                    <marker id="ep" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={MEALY} /></marker>
                    <marker id="epr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={FPGA.textLight} /></marker>
                    <marker id="eo" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={ORANGE} /></marker>
                  </defs>
                </svg>
              )}
            </div>

            {/* 직접 돌려보기 — din feed + 파형 */}
            <div style={{
              flex: 1, minHeight: 0, background: '#0F1626', borderRadius: '11px',
              padding: '0.5rem 0.7rem', boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#C7D2E8', fontFamily: MONO }}>din 비트를 넣어 보기 →</span>
                <button onClick={() => feed(1)} style={{ cursor: 'pointer', fontSize: '0.62rem', fontWeight: 800, fontFamily: MONO, color: '#fff', background: DAY11, border: 'none', borderRadius: '5px', padding: '2px 12px' }}>din=1</button>
                <button onClick={() => feed(0)} style={{ cursor: 'pointer', fontSize: '0.62rem', fontWeight: 800, fontFamily: MONO, color: '#9FB0CC', background: 'transparent', border: '1px solid #3A4860', borderRadius: '5px', padding: '2px 12px' }}>din=0</button>
                <button onClick={demo} style={{ cursor: 'pointer', fontSize: '0.58rem', fontWeight: 800, fontFamily: MONO, color: '#fff', background: ORANGE, border: 'none', borderRadius: '5px', padding: '2px 9px' }}>0110111 주입</button>
                <button onClick={reset} style={{ cursor: 'pointer', fontSize: '0.58rem', fontWeight: 700, fontFamily: MONO, color: '#E2574C', background: 'transparent', border: '1px solid #E2574C', borderRadius: '5px', padding: '2px 9px' }}>rst</button>
                <span style={{ marginLeft: 'auto', fontSize: '0.6rem', fontFamily: MONO, fontWeight: 700, color: '#C7D2E8' }}>
                  현재 <span style={{ color: modeC }}>{mode === 'moore' ? ['S0', 'S1', 'S2'][cur] : ['S0', 'S1'][cur]}</span>
                  {mode === 'moore' && <> · dout=<span style={{ color: curOut ? '#48BB78' : '#7C90B0' }}>{curOut}</span></>}
                </span>
              </div>

              {/* 파형: din / Moore dout / Mealy dout */}
              {[
                { lbl: 'din', key: 'din' as const, c: BLUE, hi: undefined as boolean | undefined },
                { lbl: 'dout · Moore', key: 'mo' as const, c: DAY11, hi: mode === 'moore' },
                { lbl: 'dout · Mealy', key: 'me' as const, c: MEALY, hi: mode === 'mealy' },
              ].map((row) => (
                <div key={row.lbl} style={{
                  display: 'flex', alignItems: 'center', gap: '5px', padding: '1.5px 0',
                  opacity: row.hi === false ? 0.45 : 1,
                  background: row.hi ? `${row.c}1F` : 'transparent', borderRadius: '4px',
                }}>
                  <span style={{ width: '72px', flexShrink: 0, textAlign: 'right', fontSize: '0.55rem', fontFamily: MONO, fontWeight: 700, color: row.c }}>{row.lbl}</span>
                  <div style={{ display: 'flex', gap: '2px', flex: 1 }}>
                    {tape.length === 0
                      ? <span style={{ fontSize: '0.55rem', color: '#4A5872', fontFamily: MONO }}>버튼으로 비트 입력…</span>
                      : tape.map((t, i) => {
                        const v = t[row.key]; const isLast = i === tape.length - 1;
                        return (
                          <div key={i} style={{
                            flex: 1, height: '16px', minWidth: '15px', borderRadius: '3px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.55rem', fontWeight: 800, fontFamily: MONO,
                            background: v ? row.c : '#243149', color: v ? '#fff' : '#6B7C99',
                            border: isLast ? '1.4px solid #F6AD55' : '1px solid transparent',
                          }}>{v}</div>
                        );
                      })}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 'auto', paddingTop: '0.3rem', fontSize: '0.57rem', color: '#94A3B8', lineHeight: 1.5, fontFamily: MONO }}>
                ‘0110111 주입’ → <span style={{ color: MEALY }}>Mealy</span>가 두 번째 1이 오는 <strong>바로 그 클럭</strong>에 1, <span style={{ color: '#A8D8A8' }}>Moore</span>는 <strong>한 클럭 뒤</strong> S2에서 1. Mealy는 1이 지속되면 계속 1(입력 추종).
              </div>
            </div>
          </div>

          {/* ══════════ 우: 비교표 + 코드 + 선택 가이드 ══════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>

            {/* 비교표 */}
            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '10px',
              boxShadow: shadow.card, overflow: 'hidden',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', fontSize: '0.6rem' }}>
                <div style={{ padding: '0.35rem 0.5rem', fontWeight: 800, color: FPGA.textLight, background: FPGA.bgAlt }} />
                <div style={{ padding: '0.35rem 0.4rem', fontWeight: 800, color: DAY11, background: `${DAY11}12`, textAlign: 'center' }}>Moore</div>
                <div style={{ padding: '0.35rem 0.4rem', fontWeight: 800, color: MEALY, background: `${MEALY}12`, textAlign: 'center' }}>Mealy</div>
                {[
                  ['출력 결정', '상태만', '상태 + 입력'],
                  ['반응 시점', '1클럭 뒤', '같은 클럭(즉시)'],
                  ['글리치', '없음(클럭 정렬)', '입력 따라 발생'],
                  ['상태 수', '많음 (3)', '적음 (2)'],
                ].map((r, i) => (
                  <div key={r[0]} style={{ display: 'contents' }}>
                    <div style={{ padding: '0.3rem 0.5rem', fontWeight: 700, color: FPGA.text, background: i % 2 ? FPGA.white : '#FAFBFD' }}>{r[0]}</div>
                    <div style={{ padding: '0.3rem 0.4rem', color: FPGA.text, textAlign: 'center', background: i % 2 ? FPGA.white : '#FAFBFD' }}>{r[1]}</div>
                    <div style={{ padding: '0.3rem 0.4rem', color: FPGA.text, textAlign: 'center', background: i % 2 ? FPGA.white : '#FAFBFD' }}>{r[2]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 코드 (토글) */}
            <div style={{
              flex: 1, minHeight: 0, background: '#16203A', borderRadius: '10px',
              padding: '0.5rem 0.7rem', boxShadow: shadow.card, borderLeft: `3px solid ${modeC}`,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.58rem', color: modeC, fontWeight: 800, fontFamily: MONO, marginBottom: '0.25rem' }}>
                {mode === 'moore' ? 'moore_fsm.v' : 'mealy_fsm.v'} · 차이는 ★ 출력 한 줄 (+ 상태 수)
              </div>
              <pre style={{
                margin: 0, flex: 1, fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
                fontSize: '0.6rem', lineHeight: 1.5, color: '#C7D2E8', whiteSpace: 'pre', overflow: 'hidden',
              }}>
                {(mode === 'moore' ? mooreCode : mealyCode).split('\n').map((ln, i) => {
                  const star = ln.includes('★');
                  return (
                    <div key={i} style={{
                      background: star ? `${modeC}26` : 'transparent',
                      borderLeft: star ? `2.5px solid ${modeC}` : '2.5px solid transparent',
                      paddingLeft: '5px', borderRadius: star ? '3px' : 0,
                      color: ln.trim().startsWith('//') || star ? (star ? '#fff' : '#5C7A99') : '#C7D2E8',
                    }}>{ln || ' '}</div>
                  );
                })}
              </pre>
            </div>

            {/* 선택 가이드 + safety */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(61,131,97,0.06), rgba(61,131,97,0.13))',
              border: `1px solid ${DAY11}30`, borderLeft: `4px solid ${DAY11}`,
              borderRadius: '9px', padding: '0.45rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>
                <strong style={{ color: DAY11 }}>안정성 우선 → Moore</strong> (출력이 클럭 정렬·글리치 없음) · <strong style={{ color: MEALY }}>속도/면적 → Mealy</strong> (1클럭 빠름·상태 ↓).
              </div>
              <div style={{ fontSize: '0.61rem', color: '#B23B3B', lineHeight: 1.45, marginTop: '0.2rem' }}>
                <strong>safety-critical:</strong> 출력이 외부 액추에이터를 직접 구동하면 글리치 없는 <strong>Moore 권장</strong> · case엔 항상 <code>default</code>로 illegal 상태 안전 복구.
              </div>
            </div>
          </div>
        </div>

        {/* ── 하단: 상태 인코딩 참고 스트립 ── */}
        <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '0.5rem', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.62rem', fontWeight: 800, color: FPGA.dark, paddingLeft: '0.2rem' }}>
            상태 인코딩<br />(별개 선택)
          </div>
          {[
            { t: 'Binary', c: BLUE, ff: '2', bits: '00·01·10·11', d: 'FF 최소 · 디코딩 복잡' },
            { t: 'One-hot', c: DAY11, ff: 'N', bits: '0001·0010·0100·1000', d: 'FPGA 기본 · 고속·디버깅 쉬움' },
            { t: 'Gray', c: ORANGE, ff: '2', bits: '00·01·11·10', d: '1비트씩 변화 · CDC·저전력' },
          ].map((g) => (
            <div key={g.t} style={{
              background: `linear-gradient(135deg, ${g.c}08, ${g.c}15)`, border: `1px solid ${g.c}30`,
              borderRadius: '8px', padding: '0.32rem 0.6rem', boxShadow: shadow.card,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: g.c }}>{g.t}</span>
                <span style={{ fontSize: '0.52rem', fontWeight: 700, color: '#fff', background: g.c, borderRadius: '4px', padding: '0 5px' }}>FF {g.ff}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.56rem', fontFamily: MONO, color: g.c, fontWeight: 700 }}>{g.bits}</span>
              </div>
              <div style={{ fontSize: '0.57rem', color: FPGA.text, lineHeight: 1.3, marginTop: '1px' }}>{g.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
