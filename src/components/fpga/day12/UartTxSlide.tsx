'use client';

import { useState, useEffect } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';
import RevealCodeModal from '../RevealCodeModal';

const DAY12 = '#177E89';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '3927';

// 데모 전송 바이트 0xA5 = 1010_0101 (LSB first: 1,0,1,0,0,1,0,1)
const BYTE = 0xa5;
const STATES = ['IDLE', 'START', 'DATA', 'STOP'] as const;

// 항상 보이는 포트 + 상태/레지스터 선언
const portsCode = `module uart_tx (
  input  wire       clk, rst,
  input  wire       tick,        // baud 1× tick
  input  wire       start,       // 전송 요청 (1-clk)
  input  wire [7:0] data,
  output reg        tx,          // 직렬 출력 (idle=1)
  output reg        busy
);
  localparam IDLE=2'd0, START=2'd1, DATA=2'd2, STOP=2'd3;
  reg [1:0] state;
  reg [2:0] idx;
  reg [7:0] sh;`;

const bodyShown = `  always @(posedge clk)
    if (rst) begin state<=IDLE; tx<=1'b1; busy<=1'b0; end
    else case (state)
      IDLE:  begin tx<=1'b1; busy<=1'b0;
               if (start) begin sh<=data; busy<=1'b1; state<=START; end end
      START: begin tx<=1'b0;                      // start bit
               if (tick) begin state<=DATA; idx<=0; end end
      DATA:  begin tx<=sh[0];                     // LSB first
               if (tick) begin sh<={1'b0, sh[7:1]};
                 if (idx==3'd7) state<=STOP; else idx<=idx+1'b1; end end
      STOP:  begin tx<=1'b1;                      // stop bit
               if (tick) state<=IDLE; end
    endcase
endmodule`;

const xdcCode = `## ==================================================================
## Day 12 uart_tx — arty.xdc (Arty A7-35T Master 발췌)
## ※ 시뮬 전용 — 단독 핀 배치 불필요, uart_loop 에서 통합 사용.
##   uart_tx 의 tx 출력은 USB-UART 로 통합(uart_loop)에서 D10 에 매핑.
##   아래 clk/rst 는 통합 top 합성 시 참고용.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];`;

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

interface TxState {
  state: number;     // 0..3 (IDLE/START/DATA/STOP)
  idx: number;       // DATA 비트 인덱스 0..7
  sh: number;        // shift register
  tx: number;        // 직렬 출력 비트
  busy: number;
  emitted: number[]; // tx 라인에 누적된 비트 (idle 제외)
}

const INIT: TxState = { state: 0, idx: 0, sh: 0, tx: 1, busy: 0, emitted: [] };

export default function UartTxSlide() {
  const [st, setSt] = useState<TxState>(INIT);
  const [running, setRunning] = useState(false);
  const [xdcOpen, setXdcOpen] = useState(false);

  // 1 baud tick = 1 비트 진행
  const tick = () => {
    setSt((s) => {
      switch (s.state) {
        case 0: // IDLE — 정지 상태에선 tick으로 진행하지 않음
          return s;
        case 1: // START → DATA(idx 0)
          return { ...s, state: 2, idx: 0, tx: s.sh & 1, emitted: [...s.emitted, 0] };
        case 2: { // DATA — 현재 비트 출력 후 시프트
            const bit = s.sh & 1;
            const next = s.sh >> 1;
            if (s.idx === 7) return { ...s, state: 3, sh: next, tx: 1, emitted: [...s.emitted, bit] };
            return { ...s, idx: s.idx + 1, sh: next, tx: next & 1, emitted: [...s.emitted, bit] };
          }
        case 3: // STOP → IDLE
          return { ...INIT, emitted: [...s.emitted, 1] };
        default:
          return s;
      }
    });
  };

  // start: IDLE에서 data 래치 후 START 진입
  const startTx = () => {
    setSt((s) => (s.state !== 0 ? s : { ...INIT, state: 1, sh: BYTE, tx: 0, busy: 1, emitted: [] }));
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, 560);
    return () => clearInterval(id);
  }, [running]);

  const txBit = st.busy ? st.tx : 1; // idle=1
  const DIM = '#94A3B8';

  // tx 라인 표시용: idle(1) + 누적 emitted (최대 11칸 = start+8data+stop)
  const line = [1, ...st.emitted].slice(-12);

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · UART TX"
          title="송신기 — FSM + shift register"
          subtitle="start→data→stop FSM이 baud tick마다 한 비트씩 출력 · 시프트로 LSB부터 전송"
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
                <strong style={{ color: DAY12 }}>tick</strong>마다 1비트 진행 · <strong style={{ color: '#4A6FA5' }}>sh</strong> 오른쪽 시프트(LSB out) → <strong style={{ color: DAY12 }}>tx</strong> 직렬 출력 (0xA5)
              </div>
              <svg viewBox="0 0 470 236" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* rst */}
                <SlideSwitch cx={46} cy={26} on={false} onToggle={() => setSt(INIT)} label="rst" />

                {/* 상태 칩 IDLE/START/DATA/STOP */}
                {STATES.map((nm, i) => {
                  const active = st.state === i;
                  const x = 92 + i * 92;
                  return (
                    <g key={nm}>
                      {active && <rect x={x - 38} y={20} width="76" height="28" rx="7" fill={DAY12} opacity="0.16" />}
                      <rect x={x - 36} y={22} width="72" height="24" rx="6" fill={active ? `${DAY12}22` : '#F4F6F9'} stroke={active ? DAY12 : FPGA.border} strokeWidth={active ? 2.4 : 1.2} />
                      <text x={x} y={38} fontSize="8.5" fontWeight="800" fill={active ? DAY12 : DIM} textAnchor="middle" fontFamily={MONO}>{nm}</text>
                      {i < 3 && <text x={x + 46} y={38} fontSize="9" fill={FPGA.textLight} textAnchor="middle">→</text>}
                    </g>
                  );
                })}
                <text x={276} y={59} fontSize="6.5" fill={st.state === 2 ? DAY12 : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>
                  {st.state === 2 ? `DATA idx ${st.idx}/7` : '×8 (LSB→MSB)'}
                </text>

                {/* shift register sh[7:0] */}
                <text x="40" y="86" fontSize="7.5" fontWeight="800" fill={FPGA.dark} fontFamily={MONO}>sh[7:0]</text>
                <text x="430" y="86" fontSize="6.5" fill={FPGA.textLight} textAnchor="end" fontFamily={MONO}>LSB → tx</text>
                {[7, 6, 5, 4, 3, 2, 1, 0].map((b, idx) => {
                  const on = ((st.sh >> b) & 1) === 1;
                  const isLsb = b === 0;
                  const x = 44 + idx * 47;
                  return (
                    <g key={b}>
                      <rect x={x} y={92} width="40" height="32" rx="5"
                        fill={isLsb ? (on ? `${ORANGE}26` : `${ORANGE}10`) : on ? `${DAY12}22` : '#EEF1F5'}
                        stroke={isLsb ? ORANGE : on ? DAY12 : FPGA.border} strokeWidth={isLsb ? 2 : 1.2} />
                      <text x={x + 20} y={108} fontSize="12" fontWeight="800" fill={isLsb ? ORANGE : on ? DAY12 : DIM} textAnchor="middle" fontFamily={MONO}>{on ? 1 : 0}</text>
                      <text x={x + 20} y={134} fontSize="6" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>[{b}]</text>
                    </g>
                  );
                })}
                <path d="M44 108 H30 V150" stroke={ORANGE} strokeWidth="1.4" fill="none" opacity="0.7" />
                <text x="20" y="150" fontSize="6" fill={ORANGE} fontFamily={MONO}>shift →</text>

                {/* 직렬 tx 라인 (왼→오 누적) */}
                <text x="40" y="166" fontSize="7.5" fontWeight="800" fill={FPGA.dark} fontFamily={MONO}>tx</text>
                {(() => {
                  if (line.length < 2) {
                    return <text x="200" y="190" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>idle=1 (start 대기)</text>;
                  }
                  const w = 360 / Math.max(line.length, 2);
                  const x0 = 70;
                  const yHi = 158, yLo = 184;
                  let d = `M${x0} ${line[0] ? yHi : yLo}`;
                  let x = x0;
                  for (let i = 0; i < line.length; i++) {
                    const y = line[i] ? yHi : yLo;
                    d += ` L${x} ${y} L${x + w} ${y}`;
                    x += w;
                  }
                  return (
                    <>
                      <line x1={x0} y1={yLo + 8} x2={x0 + 360} y2={yLo + 8} stroke={FPGA.border} strokeWidth="0.6" />
                      <path d={d} stroke={DAY12} strokeWidth="2.2" fill="none" />
                      <text x={x0 + w / 2} y={yLo + 18} fontSize="5.6" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>idle</text>
                      <text x={x0 + w * 1.5} y={yLo + 18} fontSize="5.6" fill={DAY12} textAnchor="middle" fontFamily={MONO}>st</text>
                    </>
                  );
                })()}

                {/* tx / busy 현재값 */}
                <rect x="350" y="194" width="46" height="22" rx="5" fill={txBit ? `${DAY12}1A` : '#EEF1F5'} stroke={txBit ? DAY12 : FPGA.border} strokeWidth="1.2" />
                <text x="364" y="208" fontSize="7" fontWeight="800" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>tx</text>
                <text x="384" y="209" fontSize="10" fontWeight="800" fill={txBit ? DAY12 : DIM} textAnchor="middle" fontFamily={MONO}>{txBit}</text>
                <rect x="402" y="194" width="58" height="22" rx="5" fill={st.busy ? `${ORANGE}1E` : '#EEF1F5'} stroke={st.busy ? ORANGE : FPGA.border} strokeWidth="1.2" />
                <text x="420" y="208" fontSize="7" fontWeight="800" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>busy</text>
                <text x="446" y="209" fontSize="10" fontWeight="800" fill={st.busy ? ORANGE : DIM} textAnchor="middle" fontFamily={MONO}>{st.busy}</text>
              </svg>

              {/* 컨트롤 + 실시간 값 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={startTx}
                  disabled={st.busy === 1}
                  style={{
                    cursor: st.busy ? 'not-allowed' : 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: st.busy ? '#9FB0C0' : DAY12,
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >▶ 전송(start)</button>
                <button
                  onClick={() => setRunning(false)}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: running ? '#E2574C' : '#C0C9D4',
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >⏸ 정지</button>
                <button
                  onClick={() => { setRunning(false); tick(); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: DAY12, background: 'transparent',
                    border: `1px solid ${DAY12}`, borderRadius: '5px', padding: '3px 10px',
                  }}
                >⏭ tick</button>
                <button
                  onClick={() => { setRunning(false); setSt(INIT); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#E2574C', background: 'transparent',
                    border: '1px solid #E2574C', borderRadius: '5px', padding: '3px 10px',
                  }}
                >rst</button>
                <span style={{ fontSize: '0.6rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.2rem' }}>
                  state <span style={{ color: DAY12 }}>{STATES[st.state]}</span> · sh {st.sh.toString(2).padStart(8, '0')} · busy {st.busy}
                </span>
              </div>
              <div style={{ fontSize: '0.58rem', color: '#B45309', textAlign: 'center', marginTop: '0.15rem', lineHeight: 1.4 }}>
                ⚠ 1 tick = 1 baud bit (sub-tick clk 디테일 생략) — 실제는 baud tick마다 1비트, clk은 100MHz 그대로
              </div>
            </div>

            {/* 설계 코드 (구현부 잠금) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY12}`,
            }}>
              <RevealCodeModal
                title="uart_tx.v — 설계"
                accent={DAY12}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="start/data/stop FSM + shift · LSB first"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: FSM 흐름 + 파형 + 포인트 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY12}25`,
              borderTop: `3px solid ${DAY12}`, borderRadius: '10px',
              padding: '0.55rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>FSM 흐름</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {['IDLE', 'START', 'DATA×8', 'STOP'].map((s, i, arr) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 800, color: DAY12,
                      background: `${DAY12}12`, border: `1px solid ${DAY12}30`,
                      padding: '4px 8px', borderRadius: '6px', fontFamily: MONO,
                    }}>{s}</span>
                    {i < arr.length - 1 && <span style={{ color: FPGA.textLight, fontSize: '0.7rem' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.55rem 0.75rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.25rem' }}>tx 출력 (0xA5 = 1010_0101)</div>
              <svg width="100%" viewBox="0 0 320 64" style={{ flex: 1, minHeight: 0 }}>
                {/* idle(1), start(0), D0..D7 LSB first, stop(1) */}
                {(() => {
                  const seq = [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1];
                  const w = 280 / seq.length;
                  let d = `M20 ${seq[0] ? 14 : 42}`;
                  let x = 20;
                  for (let i = 0; i < seq.length; i++) {
                    const y = seq[i] ? 14 : 42;
                    d += ` L${x} ${y} L${x + w} ${y}`;
                    x += w;
                  }
                  return <path d={d} stroke={DAY12} strokeWidth="2" fill="none" />;
                })()}
                <text x="20" y="60" fontSize="6.5" fill={FPGA.textLight} fontFamily={MONO}>idle</text>
                <text x="48" y="60" fontSize="6.5" fill={DAY12} fontFamily={MONO}>start</text>
                <text x="120" y="60" fontSize="6.5" fill="#4A6FA5" fontFamily={MONO}>D0→D7 (LSB)</text>
                <text x="280" y="60" fontSize="6.5" fill="#48BB78" fontFamily={MONO}>stop</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY12}08, ${DAY12}15)`,
              border: `1px solid ${DAY12}30`, borderRadius: '8px', padding: '0.45rem 0.8rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: DAY12 }}>포인트 · </span>
              <span style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.45 }}>
                <code>busy</code>로 전송 중 재요청 차단. idle에서 tx=1 유지가 다음 start 검출 기준. DATA는 시프트로 LSB first.
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
                보드 핀 제약 (시뮬 전용 최소) — <strong>tx는 uart_loop에서 USB-UART(D10)로 통합</strong>
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
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>uart_tx — tx는 uart_loop에서 USB-UART(D10)로 통합</span>
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
