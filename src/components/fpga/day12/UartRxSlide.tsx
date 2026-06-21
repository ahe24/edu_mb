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
const REVEAL_PW = '1448';

// 수신 대상 바이트 0x53 = 0101_0011 (LSB first 전송)
const TARGET = 0x53;
const DBITS = [1, 1, 0, 0, 1, 0, 1, 0]; // D0..D7 (LSB first) of 0x53

// ── 항상 보이는 포트 + 2FF + 상수/reg 선언 ──
const portsCode = `module uart_rx (
  input  wire       clk, rst,
  input  wire       tick16,     // 16× baud tick
  input  wire       rx_in,      // 직렬 입력 (raw·비동기)
  output reg  [7:0] data,
  output reg        valid
);
  reg s0, s1;                    // 2FF 동기화 (메타안정 방어)
  always @(posedge clk) {s1,s0} <= {s0, rx_in};
  wire rx = s1;
  localparam IDLE=2'd0, START=2'd1, DATA=2'd2, STOP=2'd3;
  reg [1:0] state;  reg [3:0] os;  reg [2:0] idx;  reg [7:0] sh;`;

// 잠금 가능한 본체 (ref_lab RTL 그대로)
const bodyShown = `  always @(posedge clk) begin
    valid <= 1'b0;
    if (rst) begin state<=IDLE; os<=0; end
    else if (tick16) case (state)
      IDLE:  if (!rx) begin state<=START; os<=0; end         // start 하강
      START: if (os==4'd7) begin os<=0; state<=DATA; idx<=0; end // 중앙 확인
             else os<=os+1'b1;
      DATA:  if (os==4'd15) begin os<=0; sh<={rx, sh[7:1]};   // 비트 중앙 샘플
               if (idx==3'd7) state<=STOP; else idx<=idx+1'b1; end
             else os<=os+1'b1;
      STOP:  if (os==4'd15) begin data<=sh; valid<=1'b1; state<=IDLE; end
             else os<=os+1'b1;
    endcase
  end
endmodule`;

const xdcCode = `## ==================================================================
## Day 12 uart_rx — arty.xdc (Arty A7-35T Master 발췌)
## ※ 시뮬 전용 — 단독 핀 배치 불필요, uart_loop 에서 통합 사용.
##   uart_rx 의 rx_in 은 USB-UART 로 통합(uart_loop)에서 A9 에 매핑.
##   아래 clk/rst 는 통합 top 합성 시 참고용.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];`;

// ── 프레임 비트 시퀀스 (한 step = 한 비트 = 1 비트구간) ──
// idle 다음에 start→D0..D7→stop. step idx 의미:
//  -1 : idle  / 0 : start / 1..8 : D0..D7 / 9 : stop
const FRAME_LEN = 10; // start + 8 data + stop
type Phase = 'IDLE' | 'START' | 'DATA' | 'STOP';

interface RxState {
  step: number;   // -1 idle, 0 start, 1..8 data(D0..D7), 9 stop
  state: Phase;   // 수신 FSM 상태
  idx: number;    // data 비트 인덱스 0..7
  sh: number;     // shift reg (조립 중)
  data: number;   // 확정 data (STOP에서 래치)
  valid: boolean; // 1-clk valid 펄스
}

const INIT: RxState = { step: -1, state: 'IDLE', idx: 0, sh: 0, data: 0, valid: false };

// 현재 step 의 rx 라인 비트
function rxBit(step: number): number {
  if (step < 0) return 1;          // idle = 1
  if (step === 0) return 0;        // start = 0
  if (step >= 1 && step <= 8) return DBITS[step - 1]; // D0..D7
  return 1;                        // stop = 1
}

export default function UartRxSlide() {
  const [rx, setRx] = useState<RxState>(INIT);
  const [running, setRunning] = useState(false);

  const [xdcOpen, setXdcOpen] = useState(false);

  // 한 비트 진행 (= 16× tick 한 비트구간을 한 step 으로 압축)
  const bitStep = () => {
    setRx((s) => {
      // 프레임 종료 후엔 정지
      if (s.step >= FRAME_LEN - 1 && s.state === 'IDLE' && s.valid) {
        setRunning(false);
        return s;
      }
      const next = s.step + 1;
      const bit = rxBit(next);

      // idle→start 진입
      if (s.state === 'IDLE') {
        if (next === 0) return { ...s, step: 0, state: 'START', idx: 0, valid: false };
        return { ...s, step: next, valid: false };
      }
      if (s.state === 'START') {
        // start 중앙(os=7) 확인 후 DATA 진입
        return { ...s, step: next, state: 'DATA', idx: 0, sh: 0, valid: false };
      }
      if (s.state === 'DATA') {
        // 비트 중앙(os=15) 샘플 → LSB first 시프트
        const sh = ((s.sh >> 1) | (bit << 7)) & 0xff;
        if (s.idx === 7) return { ...s, step: next, state: 'STOP', sh, valid: false };
        return { ...s, step: next, idx: s.idx + 1, sh, valid: false };
      }
      // STOP: data 확정 + valid 펄스 → IDLE
      return { ...s, step: next, state: 'IDLE', data: s.sh, valid: true };
    });
  };

  const reset = () => { setRunning(false); setRx(INIT); };
  const inject = () => { setRx(INIT); setRunning(true); };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(bitStep, 620);
    return () => clearInterval(id);
     
  }, [running]);

  const curBit = rxBit(rx.step);
  // 2FF 파이프 (시각화): s1 = 한 step 전 rx, s0 = 현재 rx
  const s0 = curBit;
  const s1 = rx.step <= -1 ? 1 : rxBit(rx.step - 1);

  // 단계별 색
  const PH: Record<Phase, string> = { IDLE: '#E53E3E', START: DAY12, DATA: '#4A6FA5', STOP: '#48BB78' };
  const phaseC = PH[rx.state];

  // 라벨: 현재 step 이름
  const stepName =
    rx.step < 0 ? 'idle' :
    rx.step === 0 ? 'start' :
    rx.step <= 8 ? `D${rx.step - 1}` : 'stop';

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · UART RX"
          title="수신기 — 2FF 동기화 + 비트 중앙 샘플"
          subtitle="16× oversample로 start 하강엣지 검출 후 각 비트 중앙에서 샘플 · 비동기 입력은 2FF 동기화"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 인터랙티브 수신 + 설계 코드 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.45rem 0.55rem 0.3rem',
              boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.textLight, textAlign: 'center', marginBottom: '0.05rem' }}>
                rx_in <strong style={{ color: '#E53E3E' }}>2FF(s0→s1)</strong> 동기화 → 비트 <strong style={{ color: DAY12 }}>중앙 샘플</strong> → STOP에서 <strong style={{ color: '#48BB78' }}>valid</strong>
              </div>

              <svg viewBox="0 0 470 236" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* ── 프레임 비트 스트림 (idle·start·D0..D7·stop) ── */}
                <text x="14" y="22" fontSize="6.5" fill={FPGA.textLight} fontFamily={MONO}>rx_in (raw·비동기)</text>
                {(() => {
                  // 11칸: idle, start, D0..D7, stop
                  const cells = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                  const x0 = 14, W = 442, cw = W / cells.length;
                  return cells.map((c, i) => {
                    const bit = rxBit(c);
                    const x = x0 + i * cw;
                    const active = c === rx.step;
                    const top = bit === 1;
                    const yLvl = top ? 30 : 52;
                    const isData = c >= 1 && c <= 8;
                    return (
                      <g key={c}>
                        <rect x={x} y="28" width={cw - 1.5} height="28" rx="2"
                          fill={active ? `${phaseC}22` : '#F4F6F9'}
                          stroke={active ? phaseC : FPGA.border} strokeWidth={active ? 2 : 0.8} />
                        <line x1={x + 1} y1={yLvl} x2={x + cw - 2} y2={yLvl}
                          stroke={active ? phaseC : (top ? '#94A3B8' : '#E53E3E')} strokeWidth={active ? 2.4 : 1.6} />
                        <text x={x + cw / 2} y="66" fontSize="6" fontWeight={active ? 800 : 600}
                          fill={active ? phaseC : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>
                          {c < 0 ? 'idle' : c === 0 ? 'st' : c <= 8 ? `D${c - 1}` : 'sp'}
                        </text>
                        {/* 데이터 비트 중앙 샘플 마커 */}
                        {isData && (
                          <>
                            <line x1={x + cw / 2} y1="24" x2={x + cw / 2} y2={yLvl}
                              stroke={ORANGE} strokeWidth={active ? 1.3 : 0.7} strokeDasharray="2 1.6" opacity={active ? 1 : 0.5} />
                            <circle cx={x + cw / 2} cy={yLvl} r={active ? 3 : 2}
                              fill={ORANGE} opacity={active ? 1 : 0.55} />
                          </>
                        )}
                      </g>
                    );
                  });
                })()}
                <text x="235" y="80" fontSize="6.3" fill={ORANGE} textAnchor="middle" fontWeight="700" fontFamily={MONO}>
                  os=7 start 중앙 · os=15 data 중앙에서 샘플
                </text>

                {/* ── 2FF 동기화 체인 ── */}
                <text x="14" y="104" fontSize="6.5" fill="#E53E3E" fontFamily={MONO}>2FF 동기화</text>
                {[
                  { lbl: 'rx_in', v: curBit, x: 70, c: '#94A3B8' },
                  { lbl: 's0', v: s0, x: 150, c: '#E53E3E' },
                  { lbl: 's1=rx', v: s1, x: 230, c: DAY12 },
                ].map((ff, i, arr) => (
                  <g key={ff.lbl}>
                    <rect x={ff.x - 22} y="108" width="44" height="24" rx="4"
                      fill={`${ff.c}18`} stroke={ff.c} strokeWidth="1.3" />
                    <text x={ff.x} y="118" fontSize="6.2" fontWeight="700" fill={ff.c} textAnchor="middle" fontFamily={MONO}>{ff.lbl}</text>
                    <text x={ff.x} y="128" fontSize="8" fontWeight="800" fill={ff.c} textAnchor="middle" fontFamily={MONO}>{ff.v}</text>
                    {i < arr.length - 1 && (
                      <line x1={ff.x + 22} y1="120" x2={arr[i + 1].x - 22} y2="120"
                        stroke="#94A3B8" strokeWidth="1.4" markerEnd="url(#rxa)" />
                    )}
                  </g>
                ))}
                <text x="300" y="124" fontSize="6.3" fill={FPGA.textLight} fontFamily={MONO}>→ 샘플러는 rx=s1 사용</text>

                {/* ── FSM 상태 + idx ── */}
                {(() => {
                  const sts: Phase[] = ['IDLE', 'START', 'DATA', 'STOP'];
                  const x0 = 14, sw = 78, y = 152;
                  return sts.map((s, i) => {
                    const on = rx.state === s;
                    const c = PH[s];
                    const x = x0 + i * (sw + 8);
                    return (
                      <g key={s}>
                        <rect x={x} y={y} width={sw} height="26" rx="6"
                          fill={on ? `${c}22` : '#F4F6F9'} stroke={c} strokeWidth={on ? 2.4 : 1} />
                        <text x={x + sw / 2} y={y + 17} fontSize="8.5" fontWeight="800"
                          fill={on ? c : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>{s}</text>
                        {i < 3 && <text x={x + sw + 1} y={y + 17} fontSize="8" fill={FPGA.textLight} textAnchor="middle">›</text>}
                      </g>
                    );
                  });
                })()}
                <text x="14" y="148" fontSize="6.5" fill={FPGA.textLight} fontFamily={MONO}>
                  수신 FSM · idx={rx.state === 'DATA' ? rx.idx : '-'}
                </text>

                {/* ── shift reg / data / valid ── */}
                <text x="14" y="200" fontSize="6.5" fill={FPGA.textLight} fontFamily={MONO}>조립 shift</text>
                {[7, 6, 5, 4, 3, 2, 1, 0].map((b, i) => {
                  const filled = rx.state === 'DATA' ? rx.idx >= (7 - b) : (rx.state === 'STOP' || rx.valid);
                  const v = (rx.sh >> b) & 1;
                  const x = 70 + i * 18;
                  return (
                    <g key={b}>
                      <rect x={x} y="190" width="15" height="16" rx="2"
                        fill={filled ? `${DAY12}1E` : '#EEF1F5'} stroke={filled ? DAY12 : FPGA.border} strokeWidth="1" />
                      <text x={x + 7.5} y="201.5" fontSize="7.5" fontWeight="800"
                        fill={filled ? DAY12 : '#94A3B8'} textAnchor="middle" fontFamily={MONO}>{filled ? v : '·'}</text>
                    </g>
                  );
                })}
                {/* valid + data */}
                <rect x="232" y="188" width="86" height="20" rx="5"
                  fill={rx.valid ? '#48BB7822' : '#EEF1F5'} stroke={rx.valid ? '#48BB78' : FPGA.border} strokeWidth={rx.valid ? 2.2 : 1} />
                <text x="275" y="201" fontSize="7.5" fontWeight="800"
                  fill={rx.valid ? '#48BB78' : '#94A3B8'} textAnchor="middle" fontFamily={MONO}>
                  valid {rx.valid ? '1 ▲' : '0'}
                </text>
                <text x="330" y="201" fontSize="8" fontWeight="800"
                  fill={rx.valid ? '#48BB78' : FPGA.textLight} fontFamily={MONO}>
                  data=0x{(rx.valid ? rx.data : rx.sh).toString(16).toUpperCase().padStart(2, '0')}
                </text>

                <defs>
                  <marker id="rxa" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                    <path d="M0 0 L5 3 L0 6 z" fill="#94A3B8" />
                  </marker>
                </defs>
              </svg>

              {/* ── 컨트롤 + 실시간 값 ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={inject}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: DAY12,
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >▶ 수신(프레임 주입)</button>
                <button
                  onClick={() => setRunning(false)}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: running ? '#E2574C' : '#9FB0CC',
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >⏸ 정지</button>
                <button
                  onClick={() => { setRunning(false); bitStep(); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: DAY12, background: 'transparent',
                    border: `1px solid ${DAY12}`, borderRadius: '5px', padding: '3px 10px',
                  }}
                >⏭ bit</button>
                <button
                  onClick={reset}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#64748B', background: 'transparent',
                    border: '1px solid #CBD5E1', borderRadius: '5px', padding: '3px 10px',
                  }}
                >rst</button>
                <span style={{ fontSize: '0.6rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.2rem' }}>
                  bit <span style={{ color: phaseC }}>{stepName}</span> · state {rx.state} · sh 0x{rx.sh.toString(16).toUpperCase().padStart(2, '0')}
                </span>
              </div>
              <div style={{ fontSize: '0.57rem', color: '#B45309', textAlign: 'center', marginTop: '0.12rem', lineHeight: 1.4 }}>
                ⚠ 1 step = 1 비트구간(16 tick16 압축) · 주입 바이트 0x{TARGET.toString(16).toUpperCase()} = {TARGET.toString(2).padStart(8, '0')}
              </div>
            </div>

            {/* ── 설계 코드 (구현부 잠금) ── */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.5rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY12}`,
            }}>
              <RevealCodeModal
                title="uart_rx.v — 설계"
                accent={DAY12}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="2FF 동기화 + 16× 중앙 샘플"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: 샘플 타이밍 + CDC + 출력 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY12}25`,
              borderTop: `3px solid ${DAY12}`, borderRadius: '10px',
              padding: '0.6rem 0.75rem', boxShadow: shadow.card,
              flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>중앙 샘플 타이밍</div>
              <svg width="100%" viewBox="0 0 320 96" style={{ flex: 1, minHeight: 0 }}>
                {/* rx line */}
                <path d="M10 30 H50 V52 H110 V30 V52 H170 V30 H300" stroke={DAY12} strokeWidth="2" fill="none" />
                <text x="14" y="24" fontSize="7" fill="#E53E3E" fontFamily={MONO}>idle</text>
                <text x="62" y="66" fontSize="7" fill={DAY12} fontFamily={MONO}>start</text>
                {/* sample markers at mid */}
                {[80, 140, 200].map((x) => (
                  <g key={x}>
                    <line x1={x} y1="16" x2={x} y2="56" stroke={ORANGE} strokeWidth="1" strokeDasharray="3 2" />
                    <circle cx={x} cy={x === 80 ? 52 : 40} r="3" fill={ORANGE} />
                  </g>
                ))}
                <text x="160" y="80" fontSize="7" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>os=7(start), os=15(data) 중앙</text>
                <text x="160" y="92" fontSize="6.3" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>16× oversample → 비트 중앙이 가장 안정적인 샘플점</text>
              </svg>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))',
              border: '1px solid rgba(229,62,62,0.30)', borderLeft: '4px solid #E53E3E',
              borderRadius: '10px', padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E53E3E', marginBottom: '0.2rem' }}>
                CDC 필수 — rx 2FF 동기화
              </div>
              <div style={{ fontSize: '0.65rem', color: FPGA.text, lineHeight: 1.55 }}>
                rx_in은 수신 clk와 무관한 비동기 신호. <code>s0/s1</code> 2FF 없이 바로 샘플하면 메타안정 → 프레임 깨짐. Day 07~08 CDC 규칙 그대로 적용.
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY12}08, ${DAY12}15)`,
              border: `1px solid ${DAY12}30`, borderRadius: '8px', padding: '0.45rem 0.8rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: DAY12 }}>출력 · </span>
              <span style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.45 }}>
                STOP에서 <code>valid</code> 1-clk 펄스 + <code>data</code> 확정. 상위 로직은 valid로 수신 인지.
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
                uart_rx — <strong>rx_in</strong>은 uart_loop에서 USB-UART(A9), 비동기 → <strong>2FF 필수</strong>
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
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>uart_rx — rx_in은 uart_loop에서 USB-UART(A9), 비동기 → 2FF 필수</span>
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
