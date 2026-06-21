'use client';

import { useState, useEffect } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';
import RevealCodeModal from '../RevealCodeModal';

const DAY11 = '#3D8361';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '5130';

// 데모용 축소 타이머 (실제 보드는 1Hz tick 인에이블로 느리게)
const T = [3, 2, 1];                 // [RED, GRN, YEL]
const NAME = ['RED', 'GRN', 'YEL'];
const NEXT = [1, 2, 0];              // RED→GRN→YEL→RED
const LIGHT = [0b100, 0b001, 0b010]; // [2]=R [1]=Y [0]=G

// 항상 보이는 포트 + 상태/타이머 상수
const portsCode = `module traffic_light (
  input  wire       clk,
  input  wire       rst,       // 동기 active-high
  output reg  [2:0] light      // [2]=R [1]=Y [0]=G
);
  localparam RED=2'd0, GRN=2'd1, YEL=2'd2;
\`ifdef FUNC_SIM
  localparam [7:0] T_RED=3,  T_GRN=2,  T_YEL=1;   // 시뮬 축소
\`else
  localparam [7:0] T_RED=30, T_GRN=25, T_YEL=5;   // 실제
\`endif`;

const bodyShown = `  reg [1:0] state, next;  reg [7:0] tmr;
  wire done = (state==RED&&tmr==T_RED-1)
            ||(state==GRN&&tmr==T_GRN-1)||(state==YEL&&tmr==T_YEL-1);
  always @(posedge clk)                  // ① 상태 reg + 타이머
    if (rst)       begin state<=RED; tmr<=0; end
    else if (done) begin state<=next; tmr<=0; end
    else           tmr <= tmr + 1'b1;
  always @* case (state)                 // ② 다음 상태
    RED: next=GRN; GRN: next=YEL; YEL: next=RED; default: next=RED;
  endcase
  always @* case (state)                 // ③ 출력 (Moore · one-hot)
    RED: light=3'b100; GRN: light=3'b001;
    YEL: light=3'b010; default: light=3'b100;   // 안전: 적색
  endcase
endmodule`;

const xdcCode = `## ==================================================================
## Day 11 traffic_light — arty.xdc (Arty A7-35T Master 발췌)
##   clk → 100MHz (create_clock 필수)   rst → 푸시버튼 BTN0
##   light[2:0] → User LED LD6/LD5/LD4 (R/Y/G)
## ※ 시뮬은 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ※ 실제 보드는 100MHz 그대로 카운트하면 천이가 너무 빠름 →
##   Day10 tick_gen(클럭 인에이블)로 1Hz 단위 천이. 파생 클럭 금지.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── light[2:0] → User LED (R=LD6 / Y=LD5 / G=LD4) ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { light[0] }];
set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports { light[1] }];
set_property -dict { PACKAGE_PIN T9  IOSTANDARD LVCMOS33 } [get_ports { light[2] }];`;

/** 실물형 슬라이드 스위치 — 라벨은 본체 왼쪽 같은 줄 */
function SlideSwitch({ cx, cy, on, onToggle, label }: { cx: number; cy: number; on: boolean; onToggle: () => void; label: string }) {
  const knobX = on ? cx + 3 : cx - 15;
  return (
    <g onClick={onToggle} style={{ cursor: 'pointer' }}>
      <text x={cx - 25} y={cy + 3} fontSize="7" fontWeight="800" fill="#475569" textAnchor="end" fontFamily={MONO}>{label}</text>
      <rect x={cx - 20} y={cy - 10} width="40" height="20" rx="4" fill={on ? '#C0392B' : '#245A9E'} stroke="#143468" strokeWidth="1" />
      <rect x={cx - 20} y={cy - 10} width="40" height="8" rx="4" fill="rgba(255,255,255,0.16)" />
      <rect x={cx - 16} y={cy - 5} width="32" height="10" rx="5" fill="#0E2547" />
      <rect x={knobX} y={cy - 7} width="12" height="14" rx="2.5" fill="#EDF2F7" stroke="#94A3B8" strokeWidth="0.8" />
      <text x={on ? cx - 9 : cx + 9} y={cy + 3} fontSize="7" fontWeight="800" fill="#DBE7F5" textAnchor="middle" fontFamily={MONO}>{on ? '1' : '0'}</text>
    </g>
  );
}

/** 신호등 램프 — 점등 시 발광 */
function Lamp({ cx, cy, on, lit }: { cx: number; cy: number; on: boolean; lit: string }) {
  const off = '#2A2E33';
  return (
    <g>
      {on && <circle cx={cx} cy={cy} r="17" fill={lit} opacity="0.35" />}
      <circle cx={cx} cy={cy} r="11.5" fill={on ? lit : off} stroke={on ? lit : '#454B52'} strokeWidth="1.2" />
      {on && <circle cx={cx - 3.5} cy={cy - 3.5} r="3.2" fill="#FFFFFF" opacity="0.55" />}
    </g>
  );
}

export default function TrafficLightSlide() {
  const [st, setSt] = useState({ state: 0, tmr: 0 });
  const [rst, setRst] = useState(false);
  const [running, setRunning] = useState(false);
  const [xdcOpen, setXdcOpen] = useState(false);

  const clkStep = () => {
    setSt((s) => {
      if (rst) return { state: 0, tmr: 0 };
      const done = s.tmr === T[s.state] - 1;
      if (done) return { state: NEXT[s.state], tmr: 0 };
      return { state: s.state, tmr: s.tmr + 1 };
    });
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(clkStep, 520);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, rst]);

  const stt = rst ? 0 : st.state;
  const light = LIGHT[stt];
  const isR = (light & 0b100) !== 0;
  const isY = (light & 0b010) !== 0;
  const isG = (light & 0b001) !== 0;
  const DIM = '#94A3B8';

  // 상태 ring 노드 좌표
  const ring = [
    { cx: 250, cy: 58, c: '#E53E3E' },   // RED top
    { cx: 320, cy: 150, c: '#48BB78' },  // GRN br
    { cx: 180, cy: 150, c: ORANGE },     // YEL bl
  ];

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · 신호등 FSM"
          title="타이머 기반 신호등 — Moore FSM 구현"
          subtitle="RED→GREEN→YELLOW 순환 · 각 상태를 타이머로 유지 · 안전 default는 적색"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.12fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 인터랙티브 다이어그램 + 설계 코드 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.45rem 0.55rem 0.3rem',
              boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.textLight, textAlign: 'center', marginBottom: '0.05rem' }}>
                <strong style={{ color: '#4A6FA5' }}>clk</strong>마다 타이머 +1 → <strong style={{ color: DAY11 }}>done</strong>이면 다음 상태 · 상태가 곧 <strong style={{ color: DAY11 }}>출력(Moore)</strong>
              </div>
              <svg viewBox="0 0 470 236" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* 신호등 하우징 */}
                <rect x="36" y="34" width="58" height="160" rx="12" fill="#232C3D" stroke="#3D4A63" strokeWidth="1.4" />
                <rect x="58" y="22" width="14" height="14" rx="3" fill="#1A2230" stroke="#3D4A63" strokeWidth="1" />
                <Lamp cx={65} cy={66} on={isR} lit="#FF4D4D" />
                <Lamp cx={65} cy={110} on={isY} lit="#F6C544" />
                <Lamp cx={65} cy={154} on={isG} lit="#48E08A" />

                {/* rst 입력 → housing 클럭 도메인 */}
                <SlideSwitch cx={150} cy={40} on={rst} onToggle={() => setRst((v) => !v)} label="rst" />

                {/* 상태 ring (FSM) */}
                {/* 천이 화살표 */}
                <path d="M268 70 A92 92 0 0 1 318 126" fill="none" stroke={DAY11} strokeWidth="1.8" markerEnd="url(#tla)" />
                <path d="M300 162 A92 92 0 0 1 198 162" fill="none" stroke={DAY11} strokeWidth="1.8" markerEnd="url(#tla)" />
                <path d="M180 126 A92 92 0 0 1 232 70" fill="none" stroke={DAY11} strokeWidth="1.8" markerEnd="url(#tla)" />
                {ring.map((n, i) => {
                  const active = stt === i;
                  return (
                    <g key={i}>
                      {active && <circle cx={n.cx} cy={n.cy} r="30" fill={n.c} opacity="0.16" />}
                      <circle cx={n.cx} cy={n.cy} r="25" fill={active ? `${n.c}26` : '#F4F6F9'} stroke={n.c} strokeWidth={active ? 2.6 : 1.4} />
                      <text x={n.cx} y={n.cy - 2} fontSize="9" fontWeight="800" fill={n.c} textAnchor="middle" fontFamily={MONO}>{NAME[i]}</text>
                      <text x={n.cx} y={n.cy + 9} fontSize="6.5" fontWeight="700" fill={active ? n.c : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>
                        {active ? `${st.tmr}/${T[i] - 1}` : `${T[i]}clk`}
                      </text>
                    </g>
                  );
                })}

                {/* 출력 light[2:0] */}
                <text x="408" y="60" fontSize="7" fontWeight="800" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>light[2:0]</text>
                {[2, 1, 0].map((b, idx) => {
                  const on = ((light >> b) & 1) === 1;
                  const c = b === 2 ? '#E53E3E' : b === 1 ? ORANGE : '#48BB78';
                  const y = 82 + idx * 34;
                  return (
                    <g key={b}>
                      <rect x="384" y={y - 11} width="48" height="22" rx="5" fill={on ? `${c}22` : '#EEF1F5'} stroke={on ? c : FPGA.border} strokeWidth="1.2" />
                      <text x="396" y={y + 3.5} fontSize="8" fontWeight="800" fill={on ? c : DIM} textAnchor="middle" fontFamily={MONO}>[{b}]</text>
                      <text x="420" y={y + 3.5} fontSize="9" fontWeight="800" fill={on ? c : DIM} textAnchor="middle" fontFamily={MONO}>{on ? 1 : 0}</text>
                    </g>
                  );
                })}

                <defs>
                  <marker id="tla" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0 0 L6 3 L0 6 z" fill={DAY11} />
                  </marker>
                </defs>
              </svg>

              {/* 컨트롤 + 실시간 값 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setRunning((r) => !r)}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: running ? '#E2574C' : DAY11,
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >{running ? '⏸ 정지' : '▶ 실행'}</button>
                <button
                  onClick={() => { setRunning(false); clkStep(); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: DAY11, background: 'transparent',
                    border: `1px solid ${DAY11}`, borderRadius: '5px', padding: '3px 10px',
                  }}
                >⏭ 클럭 +1</button>
                <span style={{ fontSize: '0.62rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.3rem' }}>
                  state <span style={{ color: DAY11 }}>{NAME[stt]}</span> · tmr {st.tmr}/{T[stt] - 1} · light {light.toString(2).padStart(3, '0')}
                </span>
              </div>
              <div style={{ fontSize: '0.58rem', color: '#B45309', textAlign: 'center', marginTop: '0.15rem', lineHeight: 1.4 }}>
                ⚠ 타이머 3/2/1은 데모용(<code>+define+FUNC_SIM</code>) — 실제 30/25/5 · 보드는 1Hz tick 인에이블로 천이
              </div>
            </div>

            {/* 설계 코드 (구현부 잠금) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY11}`,
            }}>
              <RevealCodeModal
                title="traffic_light.v — 설계"
                accent={DAY11}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="Moore FSM · 타이머 천이 · 안전 default 적색"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: 설계 포인트 + 타이밍 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY11}25`,
              borderTop: `3px solid ${DAY11}`, borderRadius: '10px',
              padding: '0.55rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>설계 포인트</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.55 }}>
                <li>타이머 <code>done</code>일 때만 상태 천이 → 시간 제어</li>
                <li>3색 동시 점등 불가 — one-hot 출력으로 안전 보장</li>
                <li>출력은 <strong>상태만</strong>의 함수(Moore) → 글리치 없음</li>
                <li><code>default</code>는 적색 — illegal 인코딩도 안전측</li>
              </ul>
            </div>

            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.55rem 0.75rem', boxShadow: shadow.card,
              flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>상태 타이밍 (시뮬 축소값)</div>
              <svg width="100%" viewBox="0 0 320 96" style={{ flex: 1, minHeight: 0 }}>
                {/* 상태 색띠 */}
                {(() => {
                  const segs = [
                    { n: 'RED', w: 3, c: '#E53E3E' },
                    { n: 'GRN', w: 2, c: '#48BB78' },
                    { n: 'YEL', w: 1, c: ORANGE },
                    { n: 'RED', w: 3, c: '#E53E3E' },
                    { n: 'GRN', w: 2, c: '#48BB78' },
                  ];
                  const total = segs.reduce((s, x) => s + x.w, 0);
                  const W = 300, x0 = 12;
                  let x = x0;
                  return segs.map((sg, i) => {
                    const w = (sg.w / total) * W;
                    const el = (
                      <g key={i}>
                        <rect x={x} y="18" width={w - 1} height="22" rx="3" fill={`${sg.c}28`} stroke={sg.c} strokeWidth="1" />
                        <text x={x + w / 2} y="33" fontSize="7" fontWeight="800" fill={sg.c} textAnchor="middle" fontFamily={MONO}>{sg.n}</text>
                        <text x={x + w / 2} y="51" fontSize="6" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>{sg.w}clk</text>
                      </g>
                    );
                    x += w;
                    return el;
                  });
                })()}
                <text x="12" y="13" fontSize="6.5" fill={FPGA.textLight} fontFamily={MONO}>state ▶ (clk 진행)</text>
                <text x="160" y="72" fontSize="6.5" fill={FPGA.text} textAnchor="middle" fontFamily={MONO}>각 상태 = 타이머가 정한 clk 수만큼 유지 → 순환</text>
                <text x="160" y="86" fontSize="6.5" fill={DAY11} textAnchor="middle" fontWeight="700" fontFamily={MONO}>실제 보드: 30 / 25 / 5 clk (1Hz tick 기준 = 30s/25s/5s)</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
              border: `1px solid ${FPGA.accent}30`, borderRadius: '8px',
              padding: '0.45rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.accent, flexShrink: 0 }}>HINT</span>
              <span style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.5 }}>
                시뮬은 <code>+define+FUNC_SIM</code>으로 타이머 축소 → 순환을 빨리 확인. 합성은 define 없이 실제값.
              </span>
            </div>

            {/* ── arty.xdc 보드 핀 제약 (클릭 모달) ── */}
            <button
              onClick={() => setXdcOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: `linear-gradient(135deg, ${ORANGE}0F, ${ORANGE}1E)`,
                border: `1px solid ${ORANGE}45`, borderLeft: `4px solid ${ORANGE}`,
                borderRadius: '9px', padding: '0.5rem 0.8rem',
                boxShadow: shadow.card, cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              <span style={{
                fontSize: '0.6rem', fontWeight: 800, color: '#fff', background: ORANGE,
                padding: '2px 8px', borderRadius: '5px', fontFamily: MONO, flexShrink: 0,
              }}>arty.xdc</span>
              <span style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.4 }}>
                보드 핀 제약 — <strong>clk(100MHz, create_clock) · rst(버튼) · light[2:0](R/Y/G LED)</strong>
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '0.62rem', fontWeight: 800, color: ORANGE, flexShrink: 0 }}>📄 ▸</span>
            </button>
          </div>
        </div>
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
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>Arty A7-35T Master 발췌 · clk · rst · light[2:0]</span>
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
