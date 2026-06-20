'use client';

import { useState, useEffect } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';
import ToolImage from '../ToolImage';
import SlideModal from '../SlideModal';
import RevealLock from '../RevealLock';

const DAY10 = '#1B998B';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '3041';

// 항상 보이는 포트 선언부
const portsCode = `module counter #(
  parameter integer W = 4          // 비트 폭
)(
  input  wire         clk,
  input  wire         rst,         // 동기 active-high
  input  wire         en,          // 1일 때만 증가
  output reg  [W-1:0] cnt
);`;

// 클릭 전: 구현부 숨김 (줄 수를 bodyShown 과 맞춤)
const bodyHidden = `  // ⋯ 구현부 숨김 — 🔒 구현 보기 클릭



endmodule`;

// 클릭 후: 구현부 공개
const bodyShown = `  always @(posedge clk) begin
    if (rst)      cnt <= {W{1'b0}};   // 0으로
    else if (en)  cnt <= cnt + 1'b1;  // 증가 (W비트 자동 wrap)
    // en=0 이면 값 유지
  end
endmodule`;

const xdcCode = `## ==================================================================
## Day 10 counter — arty.xdc (Arty A7-35T Master 발췌)
##   clk → 100MHz   rst → 푸시버튼   en → 슬라이드 스위치   cnt[3:0] → LED
## 쓰지 않는 핀은 주석 처리해 이후 실습에서 계속 재사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── en → 슬라이드 스위치 SW0 ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports { en }];

## ── cnt[3:0] → User LED LD4~LD7 ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { cnt[0] }];
set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports { cnt[1] }];
set_property -dict { PACKAGE_PIN T9  IOSTANDARD LVCMOS33 } [get_ports { cnt[2] }];
set_property -dict { PACKAGE_PIN T10 IOSTANDARD LVCMOS33 } [get_ports { cnt[3] }];`;

// 보드 적용 — 100MHz → 1Hz "클럭 인에이블(tick)" 생성
const tickGenCode = `// tick_gen.v — 100MHz 에서 1클럭 폭 tick(클럭 인에이블) 생성
module tick_gen #(
  parameter integer DIV = 100_000_000   // 100MHz → 1Hz
)(
  input  wire clk,        // 보드 메인 클럭 100MHz
  input  wire rst,
  output reg  tick        // DIV 클럭마다 1클럭 폭 HIGH
);
  reg [26:0] cnt;
  always @(posedge clk)
    if (rst)               begin cnt <= 0; tick <= 1'b0; end
    else if (cnt == DIV-1) begin cnt <= 0; tick <= 1'b1; end
    else                   begin cnt <= cnt + 1'b1; tick <= 1'b0; end
endmodule`;

const topWireCode = `// top.v — 새 클럭을 만들지 말 것! 단일 100MHz + 클럭 인에이블
wire tick;
tick_gen #(.DIV(100_000_000)) u_tick (.clk(clk), .rst(rst), .tick(tick));

// counter 는 여전히 100MHz clk 로 동작 — tick 일 때만 +1
counter  #(.W(4)) u_cnt (.clk(clk), .rst(rst), .en(tick), .cnt(cnt));`;

/** 실물형 슬라이드 스위치 — 라벨은 본체 왼쪽 같은 줄 */
function SlideSwitch({ cx, cy, on, onToggle, label }: { cx: number; cy: number; on: boolean; onToggle: () => void; label: string }) {
  const knobX = on ? cx + 3 : cx - 15;
  return (
    <g onClick={onToggle} style={{ cursor: 'pointer' }}>
      <text x={cx - 25} y={cy + 3} fontSize="7" fontWeight="800" fill="#475569" textAnchor="end" fontFamily={MONO}>{label}</text>
      <rect x={cx - 20} y={cy - 10} width="40" height="20" rx="4" fill={on ? '#1F7A6E' : '#245A9E'} stroke="#143468" strokeWidth="1" />
      <rect x={cx - 20} y={cy - 10} width="40" height="8" rx="4" fill="rgba(255,255,255,0.16)" />
      <rect x={cx - 16} y={cy - 5} width="32" height="10" rx="5" fill="#0E2547" />
      <rect x={knobX} y={cy - 7} width="12" height="14" rx="2.5" fill="#EDF2F7" stroke="#94A3B8" strokeWidth="0.8" />
      <text x={on ? cx - 9 : cx + 9} y={cy + 3} fontSize="7" fontWeight="800" fill="#DBE7F5" textAnchor="middle" fontFamily={MONO}>{on ? '1' : '0'}</text>
    </g>
  );
}

/** 단색 칩 LED (cnt 비트) */
function ChipLed({ cx, cy, on }: { cx: number; cy: number; on: boolean }) {
  const lit = '#2FE08A';
  const off = '#244034';
  return (
    <g>
      {on && <ellipse cx={cx} cy={cy} rx="13" ry="10" fill={lit} opacity="0.34" />}
      <rect x={cx - 9} y={cy - 5} width="3.5" height="10" rx="1" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.5" />
      <rect x={cx + 5.5} y={cy - 5} width="3.5" height="10" rx="1" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.5" />
      <rect x={cx - 6.5} y={cy - 6} width="13" height="12" rx="2" fill={on ? '#F1F4F8' : '#E5E9EE'} stroke="#C2C9D2" strokeWidth="0.8" />
      <rect x={cx - 4} y={cy - 3.6} width="8" height="7.2" rx="1.5" fill={on ? lit : off} stroke={on ? lit : '#37503F'} strokeWidth="0.6" />
      <rect x={cx - 4} y={cy - 3.6} width="8" height="2.6" rx="1.2" fill="#FFFFFF" opacity={on ? 0.55 : 0.08} />
    </g>
  );
}

export default function CounterSlide() {
  const DIV = 4;                        // 데모용 분주비 (실제 보드: 100_000_000)
  const [st, setSt] = useState({ div: 0, cnt: 0, tick: false });
  const [rst, setRst] = useState(false);
  const [enSw, setEnSw] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(false);   // clk edge 애니메이션
  const [revealed, setRevealed] = useState(false);
  const [xdcOpen, setXdcOpen] = useState(false);
  const [ceOpen, setCeOpen] = useState(false);

  // posedge clk 1회 — tick_gen 분주 + counter 증가(en = tick & en_sw)
  const clkStep = () => {
    setPhase((p) => !p);
    setSt((s) => {
      if (rst) return { div: 0, cnt: 0, tick: false };
      const isTick = s.div === DIV - 1;
      const inc = isTick && enSw;
      return {
        div: isTick ? 0 : s.div + 1,
        cnt: inc ? (s.cnt + 1) & 0xf : s.cnt,
        tick: isTick,
      };
    });
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(clkStep, 480);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, rst, enSw]);

  const cnt = st.cnt;
  const enNow = st.tick && enSw;        // counter.en (이번 클럭)
  const bitOn = (i: number) => ((cnt >> i) & 1) === 1;
  const DIM = '#94A3B8';
  const activeRow = rst ? 0 : enSw ? 1 : 2;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 2 · 오전 ② · 카운터"
          title="N-bit 카운터 · enable · wrap-around"
          subtitle="클럭마다 enable이면 +1, W비트 한계에서 자동으로 0으로 — 스위치·클럭을 직접 돌려보자"
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
                단일 <strong style={{ color: '#4A6FA5' }}>clk</strong> + <strong style={{ color: ORANGE }}>tick_gen</strong> → <strong style={{ color: DAY10 }}>counter.en</strong> — 이 구조 그대로 설계
              </div>
              <svg viewBox="0 0 470 236" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* FPGA 칩 (단일 클럭 도메인) */}
                <rect x="90" y="22" width="296" height="200" rx="11" fill="#232C3D" stroke="#3D4A63" strokeWidth="1.2" />
                <text x="238" y="36" fontSize="9" fontWeight="700" fill="#9FB3C8" textAnchor="middle" letterSpacing="0.07em" fontFamily={MONO}>FPGA · 단일 클럭 도메인</text>

                {/* rst 입력 — 최상단 → 상단 버스 직결 (꺾임 최소) */}
                <SlideSwitch cx={46} cy={46} on={rst} onToggle={() => setRst((v) => !v)} label="rst" />
                <path d="M66 46 H300 V62" stroke={rst ? '#E2574C' : DIM} strokeWidth="1.4" fill="none" opacity={rst ? 1 : 0.7} />
                <path d="M152 46 V62" stroke={rst ? '#E2574C' : DIM} strokeWidth="1.4" opacity={rst ? 1 : 0.7} />
                <text x="318" y="44" fontSize="6.5" fontWeight="700" fill={rst ? '#E2574C' : FPGA.textLight} textAnchor="end" fontFamily={MONO}>rst (동기)</text>

                {/* en 입력 — 중단 (AND 배선은 tick_gen 뒤에) */}
                <SlideSwitch cx={46} cy={150} on={enSw} onToggle={() => setEnSw((v) => !v)} label="en" />

                {/* clk 입력 — 최하단 → 공유 레일 직결 (꺾임 최소) */}
                <rect x="10" y="190" width="62" height="28" rx="6" fill="#4A6FA512" stroke="#4A6FA5" strokeWidth="1.4" />
                <text x="41" y="202" fontSize="9" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>clk</text>
                <text x="41" y="213" fontSize="7" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>100MHz</text>
                <circle cx="78" cy="204" r="3" fill={running ? (phase ? '#4A6FA5' : '#A9C0E0') : '#C2CEDE'} />
                <path d="M72 204 H322" stroke="#4A6FA5" strokeWidth="1.7" fill="none" />
                <circle cx="152" cy="204" r="2.5" fill="#4A6FA5" />
                <circle cx="312" cy="204" r="2.5" fill="#4A6FA5" />
                <path d="M152 204 V144" stroke="#4A6FA5" strokeWidth="1.5" />
                <path d="M312 204 V154" stroke="#4A6FA5" strokeWidth="1.5" />
                <text x="210" y="199" fontSize="7" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>clk → 모든 FF 동일 클럭</text>

                {/* tick_gen 블록 */}
                <rect x="118" y="62" width="94" height="82" rx="8" fill={`${ORANGE}14`} stroke={ORANGE} strokeWidth="1.6" />
                <text x="165" y="81" fontSize="9.5" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>tick_gen</text>
                <text x="165" y="93" fontSize="6.5" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>÷DIV (데모 4)</text>
                <text x="165" y="115" fontSize="9" fontWeight="800" fill={FPGA.dark} textAnchor="middle" fontFamily={MONO}>div {st.div}/{DIV}</text>
                <circle cx="150" cy="129" r="4.5" fill={st.tick ? ORANGE : '#E3D9CC'} />
                <text x="170" y="132" fontSize="7" fontWeight="700" fill={st.tick ? ORANGE : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>tick</text>
                <path d="M148 148 l4 -5 l4 5 Z" fill="#4A6FA5" />

                {/* tick → AND 상단 입력 */}
                <path d="M212 84 H219 V82 H226" stroke={st.tick ? ORANGE : DIM} strokeWidth="1.6" fill="none" opacity={st.tick ? 1 : 0.6} />
                {/* en_sw → AND 하단 입력 */}
                <path d="M66 150 H216 V94 H226" stroke={enSw ? DAY10 : DIM} strokeWidth="1.5" fill="none" opacity={enSw ? 1 : 0.6} />

                {/* AND 게이트 (en = tick & en_sw) */}
                <path d="M226 76 H238 A12 12 0 0 1 238 100 H226 Z" fill="#FFFFFF" stroke="#475569" strokeWidth="1.2" />
                <text x="233" y="92" fontSize="9" fontWeight="800" fill="#475569" textAnchor="middle" fontFamily={MONO}>&amp;</text>
                <text x="250" y="74" fontSize="6.5" fontWeight="800" fill={enNow ? ORANGE : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>en</text>
                <path d="M250 88 H270" stroke={enNow ? ORANGE : DIM} strokeWidth="1.8" opacity={enNow ? 1 : 0.6} />

                {/* counter 블록 (이번 설계) */}
                <rect x="270" y="62" width="100" height="92" rx="8" fill={`${DAY10}1A`} stroke={DAY10} strokeWidth="1.9" />
                <text x="320" y="81" fontSize="9.5" fontWeight="800" fill={DAY10} textAnchor="middle" fontFamily={MONO}>counter</text>
                <text x="320" y="93" fontSize="6.2" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>[W=4] ← 이번 설계</text>
                <text x="320" y="129" fontSize="28" fontWeight="800" fill={FPGA.dark} textAnchor="middle" fontFamily={MONO}>{cnt}</text>
                <text x="320" y="146" fontSize="7.5" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>{cnt.toString(2).padStart(4, '0')}</text>
                <circle cx="270" cy="88" r="1.8" fill={enNow ? ORANGE : DIM} />
                <path d="M308 158 l4 -5 l4 5 Z" fill="#4A6FA5" />

                {/* cnt[3:0] → LED */}
                <path d="M370 106 H392" stroke="#2FA86A" strokeWidth="1.4" />
                <path d="M392 70 V184" stroke="#2FA86A" strokeWidth="1.4" opacity="0.5" />
                {[3, 2, 1, 0].map((b, idx) => {
                  const y = 70 + idx * 38;
                  const on = bitOn(b);
                  return (
                    <g key={b}>
                      <path d={`M392 ${y} H418`} stroke={on ? '#2FE08A' : DIM} strokeWidth="1.4" opacity={on ? 1 : 0.6} />
                      <text x="402" y={y - 5} fontSize="6.5" fontWeight="700" fill={DAY10} textAnchor="middle" fontFamily={MONO}>cnt[{b}]</text>
                      <ChipLed cx={432} cy={y} on={on} />
                    </g>
                  );
                })}
              </svg>

              {/* 컨트롤 + 실시간 값 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setRunning((r) => !r)}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: running ? '#E2574C' : DAY10,
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >{running ? '⏸ 정지' : '▶ 실행'}</button>
                <button
                  onClick={() => { setRunning(false); clkStep(); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: DAY10, background: 'transparent',
                    border: `1px solid ${DAY10}`, borderRadius: '5px', padding: '3px 10px',
                  }}
                >⏭ 클럭 +1</button>
                <span style={{ fontSize: '0.62rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.3rem' }}>
                  div {st.div}/{DIV} · <span style={{ color: ORANGE }}>tick {st.tick ? 1 : 0}</span> · cnt {cnt.toString(2).padStart(4, '0')} ({cnt})
                </span>
              </div>
              <div style={{ fontSize: '0.58rem', color: '#B45309', textAlign: 'center', marginTop: '0.15rem', lineHeight: 1.4 }}>
                ⚠ DIV=4는 데모용 — 실제 보드는 <strong>100,000,000</strong>(1Hz). counter는 100MHz로 돌되 <strong>tick일 때만 +1</strong> (코드는 아래 “보드 적용”)
              </div>
            </div>

            {/* 설계 코드 (구현부 잠금) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY10}`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem',
                userSelect: 'none', WebkitUserSelect: 'none',
              }}>
                <span style={{ fontSize: '0.6rem', color: DAY10, fontWeight: 800, letterSpacing: '0.05em' }}>
                  counter.v — 설계
                </span>
                <RevealLock
                  revealed={revealed}
                  onReveal={() => setRevealed(true)}
                  onHide={() => setRevealed(false)}
                  password={REVEAL_PW}
                  accent={DAY10}
                />
              </div>
              <VerilogCode code={`${portsCode}\n${revealed ? bodyShown : bodyHidden}`} style={{ fontSize: '0.6rem', lineHeight: 1.42 }} />
            </div>
          </div>

          {/* ── 우: 제어표 + 파형 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY10}25`,
              borderTop: `3px solid ${DAY10}`, borderRadius: '10px',
              padding: '0.55rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>
                제어 동작 (현재 상태 강조)
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.68rem', fontFamily: MONO }}>
                <thead>
                  <tr style={{ color: FPGA.textLight }}>
                    <th style={{ textAlign: 'left', padding: '2px 6px' }}>rst</th>
                    <th style={{ textAlign: 'left', padding: '2px 6px' }}>en</th>
                    <th style={{ textAlign: 'left', padding: '2px 6px' }}>다음 cnt</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { r: '1', e: '–', n: '0 (리셋)', c: '#E53E3E' },
                    { r: '0', e: '1', n: 'cnt + 1', c: DAY10 },
                    { r: '0', e: '0', n: 'cnt (유지)', c: '#718096' },
                  ].map((row, i) => (
                    <tr key={row.n} style={{
                      borderTop: `1px solid ${FPGA.border}`,
                      background: activeRow === i ? `${row.c}1A` : 'transparent',
                    }}>
                      <td style={{ padding: '3px 6px', fontWeight: activeRow === i ? 800 : 600, color: FPGA.text }}>{activeRow === i ? '▶ ' : ''}{row.r}</td>
                      <td style={{ padding: '3px 6px', color: FPGA.text }}>{row.e}</td>
                      <td style={{ padding: '3px 6px', fontWeight: 700, color: row.c }}>{row.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ fontSize: '0.6rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.3rem' }}>
                W=4 → 15 다음은 0 (overflow wrap). rst는 동기 — 클럭 엣지에서만 0이 된다.
              </div>
            </div>

            {/* 파형 */}
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${DAY10}25`,
              borderTop: `3px solid ${DAY10}`, borderRadius: '10px',
              padding: '0.5rem 0.7rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                Visualizer 파형 — rst→en→wrap
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ToolImage src="/images/fpga/day10_counter_wave.png" name="counter 시뮬 파형" width="100%" height="100%" />
              </div>
              <div style={{ fontSize: '0.58rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.3rem' }}>
                day10_counter_wave.png — 리셋 해제 후 en=1 구간 증가, 15→0 wrap (클릭 시 확대)
              </div>
            </div>
          </div>
        </div>

        {/* ── 하단: 보드 적용(클럭 인에이블) + XDC 클릭 모달 ── */}
        <div style={{ marginTop: '0.55rem', display: 'flex', gap: '0.55rem' }}>
          <button
            onClick={() => setCeOpen(true)}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: `linear-gradient(135deg, ${DAY10}10, ${DAY10}20)`,
              border: `1px solid ${DAY10}45`, borderLeft: `4px solid ${DAY10}`,
              borderRadius: '9px', padding: '0.5rem 0.9rem',
              boxShadow: shadow.card, cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#fff', background: DAY10, padding: '2px 9px', borderRadius: '5px', fontFamily: MONO, flexShrink: 0 }}>🕐 보드 적용</span>
            <span style={{ fontSize: '0.68rem', color: FPGA.text }}>
              100MHz → <strong>1Hz tick(클럭 인에이블)</strong> · 파생 클럭 금지
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '0.64rem', fontWeight: 800, color: DAY10, flexShrink: 0 }}>보기 ▸</span>
          </button>
        </div>
        <button
          onClick={() => setXdcOpen(true)}
          style={{
            marginTop: '0.45rem',
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
            보드 핀 제약 — <strong>clk(100MHz) · rst(버튼) · en(스위치) · cnt(LED)</strong> + <code>create_clock</code>
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
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>Arty A7-35T Master 발췌 · clk · rst · en · cnt</span>
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

      {/* 보드 적용 — 클럭 인에이블 모달 */}
      <SlideModal
        open={ceOpen}
        onClose={() => setCeOpen(false)}
        contentStyle={{
          width: 'min(820px, 92vw)', maxHeight: '88vh',
          background: '#0F1626', borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          border: '1px solid #2C3850',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderBottom: '1px solid #2C3850', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: DAY10, fontFamily: MONO }}>🕐 100MHz를 어떻게 쓰나 — 클럭 인에이블</span>
          <button
            onClick={() => setCeOpen(false)}
            style={{
              marginLeft: 'auto', background: 'transparent', border: '1px solid #3A4860',
              color: '#9FB0CC', borderRadius: '6px', padding: '2px 10px', cursor: 'pointer',
              fontSize: '0.74rem', fontWeight: 700,
            }}
          >✕ 닫기 (Esc)</button>
        </div>

        <div style={{ padding: '0.8rem 1.1rem', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {/* 블록도 — 단일 클럭 + 클럭 인에이블 */}
          <div style={{ background: FPGA.white, borderRadius: '8px', padding: '0.5rem 0.6rem 0.3rem', boxShadow: shadow.card }}>
            <div style={{ fontSize: '0.66rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.1rem', textAlign: 'center' }}>
              블록도 — 단일 100MHz 클럭 + tick(클럭 인에이블)
            </div>
            <svg viewBox="0 0 700 174" style={{ width: '100%' }}>
              {/* clk 소스 */}
              <rect x="14" y="54" width="72" height="44" rx="7" fill="#4A6FA514" stroke="#4A6FA5" strokeWidth="1.6" />
              <text x="50" y="74" fontSize="11" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>clk</text>
              <text x="50" y="88" fontSize="8" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>100MHz</text>

              {/* 공유 clk 버스 (단일 클럭 도메인) */}
              <path d="M50 98 V146 H560" stroke="#4A6FA5" strokeWidth="1.8" fill="none" />
              <circle cx="185" cy="146" r="2.6" fill="#4A6FA5" />
              <circle cx="445" cy="146" r="2.6" fill="#4A6FA5" />
              <path d="M185 146 V104" stroke="#4A6FA5" strokeWidth="1.6" />
              <path d="M445 146 V116" stroke="#4A6FA5" strokeWidth="1.6" />
              <text x="120" y="162" fontSize="8.5" fontWeight="700" fill="#4A6FA5" fontFamily={MONO}>clk — 단일 클럭 도메인 (모든 FF 동일 클럭)</text>

              {/* tick_gen 블록 */}
              <rect x="150" y="56" width="110" height="48" rx="8" fill={`${DAY10}14`} stroke={DAY10} strokeWidth="1.6" />
              <text x="205" y="78" fontSize="10" fontWeight="800" fill={DAY10} textAnchor="middle" fontFamily={MONO}>tick_gen</text>
              <text x="205" y="92" fontSize="8" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>÷ DIV</text>
              <path d="M181 108 l4 -5 l4 5 Z" fill={DAY10} />

              {/* tick (클럭 인에이블) → counter.en */}
              <path d="M260 80 H352 V72 H398" stroke={ORANGE} strokeWidth="1.9" fill="none" />
              <path d="M398 72 l-8 -3.2 v6.4 Z" fill={ORANGE} />
              <text x="306" y="66" fontSize="9" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>tick (1클럭 폭)</text>
              <text x="430" y="68" fontSize="7.5" fontWeight="700" fill={ORANGE} fontFamily={MONO}>en</text>

              {/* counter 블록 */}
              <rect x="400" y="56" width="110" height="58" rx="8" fill={`${DAY10}14`} stroke={DAY10} strokeWidth="1.6" />
              <text x="455" y="84" fontSize="10" fontWeight="800" fill={DAY10} textAnchor="middle" fontFamily={MONO}>counter</text>
              <text x="455" y="98" fontSize="8" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>[W=4]</text>
              <path d="M441 120 l4 -5 l4 5 Z" fill={DAY10} />

              {/* cnt[3:0] → LED */}
              <path d="M510 85 H556" stroke="#2FA86A" strokeWidth="1.9" fill="none" />
              <text x="533" y="79" fontSize="7.5" fontWeight="700" fill={DAY10} textAnchor="middle" fontFamily={MONO}>cnt[3:0]</text>
              {[0, 1, 2, 3].map((i) => (
                <circle key={i} cx={576 + i * 20} cy="85" r="6.5" fill="#2FE08A" stroke="#2FA86A" strokeWidth="1" />
              ))}
              <text x="606" y="104" fontSize="7.5" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>LED ×4</text>
            </svg>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#C7D2E8', lineHeight: 1.6 }}>
            <li>Arty 메인 클럭은 <strong>100MHz</strong>. counter를 이 클럭으로 매 엣지 +1 하면 초당 1억 증가 → LED로 변화를 볼 수 없다.</li>
            <li><span style={{ color: '#FF7B72', fontWeight: 800 }}>❌ 클럭을 분주해 counter의 clk으로 사용</span> = 파생 클럭(gated/divided clock) → 스큐·타이밍·CDC 문제, safety-critical 금기.</li>
            <li><span style={{ color: '#7EE787', fontWeight: 800 }}>✅ 단일 100MHz 클럭 유지 + 1클럭 폭 tick(클럭 인에이블)</span> 을 만들어 <code style={{ color: '#9CDCFE' }}>en</code> 에 연결. counter는 100MHz로 동작하되 tick일 때만 증가.</li>
            <li>시뮬에선 <code style={{ color: '#9CDCFE' }}>DIV</code> 를 작게 override해 빨리 확인, 합성은 실제 값(1억).</li>
          </ul>

          <div style={{ background: '#1A2235', borderRadius: '8px', padding: '0.6rem 0.85rem', borderLeft: `3px solid ${DAY10}` }}>
            <div style={{ fontSize: '0.62rem', color: DAY10, fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.04em', fontFamily: MONO }}>tick_gen.v</div>
            <VerilogCode code={tickGenCode} style={{ fontSize: '0.72rem', lineHeight: 1.5 }} />
          </div>

          <div style={{ background: '#1A2235', borderRadius: '8px', padding: '0.6rem 0.85rem', borderLeft: '3px solid #E8913A' }}>
            <div style={{ fontSize: '0.62rem', color: '#E8913A', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.04em', fontFamily: MONO }}>top.v — 단일 클럭 + en=tick</div>
            <VerilogCode code={topWireCode} style={{ fontSize: '0.72rem', lineHeight: 1.5 }} />
          </div>
        </div>
      </SlideModal>
    </section>
  );
}
