'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';
import RevealCodeModal from '../RevealCodeModal';

const DAY11 = '#3D8361';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '9026';

const SNAME = ['S0', 'S1', 'S10', 'S101'];
// 다음 상태표 [state][din]
const NXT = [
  [0, 1],  // S0:   0→S0,  1→S1
  [2, 1],  // S1:   0→S10, 1→S1
  [0, 3],  // S10:  0→S0,  1→S101
  [2, 1],  // S101: 0→S10, 1→S1  (overlap)
];

const portsCode = `module seq_detect (        // 패턴 "1 0 1" 검출 (overlap 허용)
  input  wire clk,
  input  wire rst,
  input  wire din,
  output wire found
);
  localparam S0=2'd0, S1=2'd1, S10=2'd2, S101=2'd3;`;

const bodyShown = `  reg [1:0] state, next;
  always @(posedge clk)             // 상태 reg
    if (rst) state <= S0;
    else     state <= next;
  always @* case (state)            // 다음 상태
    S0:   next = din ? S1   : S0;
    S1:   next = din ? S1   : S10;
    S10:  next = din ? S101 : S0;
    S101: next = din ? S1   : S10;   // overlap 재사용
    default: next = S0;              // 안전 복구
  endcase
  assign found = (state == S101);   // Moore 출력
endmodule`;

const xdcCode = `## ==================================================================
## Day 11 seq_detect — arty.xdc (Arty A7-35T Master 발췌)
##   clk → 100MHz (create_clock)   rst → BTN0
##   din → SW0 (직렬 입력)   found → LD4
## ※ 시뮬은 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ※ 보드에서 din 을 손으로 토글하면 클럭당 1비트가 안 됨 →
##   직렬 소스(또는 tick 인에이블)로 비트당 1클럭 정렬 필요.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── din → 슬라이드 스위치 SW0 ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports { din }];

## ── found → User LED LD4 ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { found }];`;

interface Step { bit: number; state: number; found: boolean; }

export default function SeqDetectorSlide() {
  const [state, setState] = useState(0);
  const [tape, setTape] = useState<Step[]>([]);
  const [xdcOpen, setXdcOpen] = useState(false);

  const feed = (b: number) => {
    const ns = NXT[state][b];
    setState(ns);
    setTape((t) => [...t.slice(-13), { bit: b, state: ns, found: ns === 3 }]);
  };
  const reset = () => { setState(0); setTape([]); };
  const inject = () => {
    reset();
    // 1 0 1 1 0 1 → found 2회 (overlap)
    const seq = [1, 0, 1, 1, 0, 1];
    let s = 0;
    const steps: Step[] = [];
    for (const b of seq) { s = NXT[s][b]; steps.push({ bit: b, state: s, found: s === 3 }); }
    setState(s);
    setTape(steps);
  };

  const hits = tape.filter((t) => t.found).length;

  // 상태 ring 좌표 (가로 배치)
  const ring = [
    { cx: 40, cy: 80 }, { cx: 120, cy: 80 }, { cx: 200, cy: 80 }, { cx: 280, cy: 80 },
  ];

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · 시퀀스 검출"
          title="입력 패턴 검출 FSM — overlap 처리"
          subtitle="직렬 입력에서 '101' 발견 시 found=1 · 겹치는 패턴(101101…)도 놓치지 않게"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 인터랙티브 다이어그램 + 설계 코드 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.45rem 0.55rem 0.3rem',
              boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.textLight, textAlign: 'center', marginBottom: '0.05rem' }}>
                <strong style={{ color: DAY11 }}>din 비트</strong>를 직접 넣어 보기 — 상태가 따라 이동, <strong style={{ color: '#48BB78' }}>S101 도달 시 found</strong>
              </div>
              <svg viewBox="0 0 320 116" style={{ width: '100%' }}>
                {/* 천이 화살표 (정방향) */}
                <path d="M60 80 H100" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#sa)" /><text x="80" y="73" fontSize="7" fill={DAY11} textAnchor="middle" fontFamily={MONO}>1</text>
                <path d="M140 80 H180" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#sa)" /><text x="160" y="95" fontSize="7" fill={DAY11} textAnchor="middle" fontFamily={MONO}>0</text>
                <path d="M220 80 H260" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#sa)" /><text x="240" y="73" fontSize="7" fill={DAY11} textAnchor="middle" fontFamily={MONO}>1</text>
                {/* overlap S101 → S1 (din=1) — 노드 위로 완만하게 */}
                <path d="M278 64 A95 95 0 0 0 122 64" fill="none" stroke="#48BB78" strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#sa)" />
                <text x="200" y="22" fontSize="6.8" fill="#48BB78" textAnchor="middle" fontFamily={MONO}>din=1 (overlap → S1)</text>
                {/* nodes */}
                {ring.map((n, i) => {
                  const active = state === i;
                  const hit = i === 3;
                  const c = hit ? '#48BB78' : DAY11;
                  return (
                    <g key={i}>
                      {active && <circle cx={n.cx} cy={n.cy} r="24" fill={c} opacity="0.18" />}
                      <circle cx={n.cx} cy={n.cy} r="19" fill={active ? `${c}28` : '#F4F6F9'} stroke={c} strokeWidth={active ? 2.6 : 1.4} />
                      <text x={n.cx} y={n.cy + 3.5} fontSize="8" fontWeight="800" fill={c} textAnchor="middle" fontFamily={MONO}>{SNAME[i]}</text>
                    </g>
                  );
                })}
                <defs>
                  <marker id="sa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0 0 L6 3 L0 6 z" fill={DAY11} />
                  </marker>
                </defs>
              </svg>

              {/* 입력 테이프 */}
              <div style={{ marginTop: '0.1rem', padding: '0.3rem 0.4rem', background: '#0F1626', borderRadius: '7px' }}>
                <div style={{ fontSize: '0.54rem', color: '#7C90B0', fontFamily: MONO, marginBottom: '2px' }}>din 입력 스트림 →</div>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', minHeight: '26px', flexWrap: 'nowrap', overflow: 'hidden' }}>
                  {tape.length === 0 && <span style={{ fontSize: '0.6rem', color: '#4A5872', fontFamily: MONO }}>버튼으로 비트를 넣어보기…</span>}
                  {tape.map((t, i) => (
                    <div key={i} style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: '17px', height: '17px', borderRadius: '4px',
                        background: t.found ? '#48BB78' : t.bit ? `${DAY11}` : '#2C3850',
                        color: t.found || t.bit ? '#fff' : '#9FB0CC',
                        fontSize: '0.62rem', fontWeight: 800, fontFamily: MONO,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{t.bit}</div>
                      {t.found && <div style={{ fontSize: '0.46rem', color: '#48BB78', fontFamily: MONO, fontWeight: 800 }}>✓</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* 컨트롤 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <button onClick={() => feed(1)} style={{ cursor: 'pointer', fontSize: '0.62rem', fontWeight: 800, fontFamily: MONO, color: '#fff', background: DAY11, border: 'none', borderRadius: '5px', padding: '3px 12px' }}>din=1</button>
                <button onClick={() => feed(0)} style={{ cursor: 'pointer', fontSize: '0.62rem', fontWeight: 800, fontFamily: MONO, color: DAY11, background: 'transparent', border: `1px solid ${DAY11}`, borderRadius: '5px', padding: '3px 12px' }}>din=0</button>
                <button onClick={inject} style={{ cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO, color: '#fff', background: ORANGE, border: 'none', borderRadius: '5px', padding: '3px 9px' }}>101101 주입</button>
                <button onClick={reset} style={{ cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO, color: '#E2574C', background: 'transparent', border: '1px solid #E2574C', borderRadius: '5px', padding: '3px 9px' }}>rst</button>
                <span style={{ fontSize: '0.62rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.2rem' }}>
                  state <span style={{ color: state === 3 ? '#48BB78' : DAY11 }}>{SNAME[state]}</span> · found ×<span style={{ color: '#48BB78' }}>{hits}</span>
                </span>
              </div>
            </div>

            {/* 설계 코드 (구현부 잠금) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY11}`,
            }}>
              <RevealCodeModal
                title="seq_detect.v — 설계"
                accent={DAY11}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="&quot;101&quot; overlap 검출 · Moore"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: 추적 + overlap 설명 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: '#0F1626', borderRadius: '9px',
              padding: '0.55rem 0.75rem', boxShadow: shadow.card,
              fontFamily: 'ui-monospace, Consolas, monospace', fontSize: '0.62rem', lineHeight: 1.65,
            }}>
              <div style={{ color: '#94A3B8' }}># din = 1 0 1 1 0 1 주입 시</div>
              <div style={{ color: '#A8D8A8' }}>state: S0→S1→S10→<span style={{ color: '#48BB78' }}>S101*</span>→S1→S10→<span style={{ color: '#48BB78' }}>S101*</span></div>
              <div style={{ color: '#F6AD55' }}>found pulses: 2 (overlap 덕분)</div>
            </div>

            <div style={{
              background: FPGA.white, border: `1px solid ${DAY11}25`,
              borderTop: `3px solid ${DAY11}`, borderRadius: '10px',
              padding: '0.55rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>설계 포인트</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.55 }}>
                <li>각 상태 = 지금까지 맞은 <strong>부분 패턴</strong>을 기억</li>
                <li>틀린 비트가 와도 가능한 만큼은 유지(완전 리셋 아님)</li>
                <li>출력은 상태만의 함수(Moore) → S101에서 found</li>
              </ul>
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.13))`,
              border: `1px solid rgba(72,187,120,0.30)`, borderLeft: '4px solid #48BB78',
              borderRadius: '8px', padding: '0.5rem 0.8rem',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#37A862', marginBottom: '0.15rem' }}>overlap 핵심</div>
              <div style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.5 }}>
                S101에서 din=1을 <strong>S1로</strong> 보내는 화살표가 overlap. 이걸 S0으로 잘못 두면 <code>101101</code>의 두 번째 패턴을 놓침.
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
              border: `1px solid ${FPGA.accent}30`, borderRadius: '8px',
              padding: '0.42rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: FPGA.accent, flexShrink: 0 }}>HINT</span>
              <span style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.45 }}>
                버튼으로 <code>1 0 1 1 0 1</code>을 직접 넣어 found가 2번 뜨는지 확인 → TB는 이 카운트를 자동 판정.
              </span>
            </div>
          </div>
        </div>

        {/* ── 하단: XDC 클릭 모달 ── */}
        <button
          onClick={() => setXdcOpen(true)}
          style={{
            marginTop: '0.55rem',
            display: 'flex', alignItems: 'center', gap: '0.55rem',
            background: `linear-gradient(135deg, ${ORANGE}0F, ${ORANGE}1E)`,
            border: `1px solid ${ORANGE}45`, borderLeft: `4px solid ${ORANGE}`,
            borderRadius: '9px', padding: '0.5rem 0.9rem',
            boxShadow: shadow.card, cursor: 'pointer', textAlign: 'left', width: '100%',
          }}
        >
          <span style={{
            fontSize: '0.62rem', fontWeight: 800, color: '#fff', background: ORANGE,
            padding: '2px 9px', borderRadius: '5px', fontFamily: MONO, flexShrink: 0,
          }}>arty.xdc</span>
          <span style={{ fontSize: '0.7rem', color: FPGA.text }}>
            보드 핀 제약 — <strong>clk(100MHz) · rst(버튼) · din(스위치) · found(LED)</strong>
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '0.66rem', fontWeight: 800, color: ORANGE, flexShrink: 0 }}>📄 전체 보기 ▸</span>
        </button>
      </div>

      <SlideModal
        open={xdcOpen}
        onClose={() => setXdcOpen(false)}
        contentStyle={{
          width: 'min(860px, 92vw)', maxHeight: '88vh',
          background: '#0F1626', borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          border: '1px solid #2C3850',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderBottom: '1px solid #2C3850', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: ORANGE, fontFamily: MONO }}>arty.xdc</span>
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>Arty A7-35T Master 발췌 · clk · rst · din · found</span>
          <button
            onClick={() => setXdcOpen(false)}
            style={{
              marginLeft: 'auto', background: 'transparent', border: '1px solid #3A4860',
              color: '#9FB0CC', borderRadius: '6px', padding: '2px 10px', cursor: 'pointer',
              fontSize: '0.74rem', fontWeight: 700,
            }}
          >✕ 닫기 (Esc)</button>
        </div>
        <pre style={{
          margin: 0, flex: 1, minHeight: 0, overflow: 'auto',
          padding: '0.7rem 1.1rem 1rem', background: '#16203A',
          fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
          fontSize: '0.74rem', lineHeight: 1.55, color: '#C7D2E8', whiteSpace: 'pre',
        }}>
          {xdcCode}
        </pre>
      </SlideModal>
    </section>
  );
}
