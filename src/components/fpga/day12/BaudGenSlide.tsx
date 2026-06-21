'use client';

import { useState, useEffect } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';
import SlideModal from '../SlideModal';
import RevealLock from '../RevealLock';

const DAY12 = '#177E89';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '6815';

// 항상 보이는 포트 + DIV localparam
const portsCode = `module baud_gen #(
  parameter integer CLK_HZ = 100_000_000,
  parameter integer BAUD   = 115200
)(
  input  wire clk,
  input  wire rst,               // 동기 active-high
  output reg  tick               // baud rate 1-clk 펄스
);
  localparam integer DIV = CLK_HZ / BAUD;   // ≈ 868`;

const bodyHidden = `  // ⋯ 구현부 숨김 — 🔒 구현 보기 클릭



endmodule`;

const bodyShown = `  reg [$clog2(DIV)-1:0] cnt;
  always @(posedge clk)
    if (rst)             begin cnt <= 0; tick <= 1'b0; end
    else if (cnt==DIV-1) begin cnt <= 0; tick <= 1'b1; end
    else                 begin cnt <= cnt + 1'b1; tick <= 1'b0; end
endmodule`;

const xdcCode = `## ==================================================================
## Day 12 baud_gen — arty.xdc (Arty A7-35T Master 발췌)
## ※ 시뮬 전용 — 단독 핀 배치 불필요, uart_loop 에서 통합 사용.
##   baud_gen 은 출력이 내부 tick 펄스(보드 외부 핀 없음) → 단독 합성 대상 아님.
##   아래 clk/rst 는 통합 top(uart_loop) 합성 시 참고용.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];`;

export default function BaudGenSlide() {
  const DIV = 8;                          // 데모용 분주비 (실제: CLK_HZ/BAUD ≈ 868)
  const [st, setSt] = useState({ cnt: 0, tick: false });
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [xdcOpen, setXdcOpen] = useState(false);

  const clkStep = () => {
    setPhase((p) => !p);
    setSt((s) => {
      if (s.cnt === DIV - 1) return { cnt: 0, tick: true };     // cnt==DIV-1 → 1-clk tick
      return { cnt: s.cnt + 1, tick: false };
    });
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(clkStep, 420);
    return () => clearInterval(id);
     
  }, [running]);

  const DIM = '#94A3B8';

  // 1× vs 16× 오버샘플링 다이어그램 좌표 (비트 셀 = 16 샘플 단위)
  const OS = { x0: 46, cw: 124, n: 2, y1: 46, y16: 90 };
  const osCells = Array.from({ length: OS.n }, (_, c) => OS.x0 + c * OS.cw);
  const osGap = OS.cw / 16;                  // 16× 틱 간격 = 1비트 / 16
  const osXend = OS.x0 + OS.cw * OS.n;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · baud tick generator"
          title="baud tick generator + 16× oversampling"
          subtitle="÷DIV 카운터로 시스템 클럭 분주 → 1-clk tick · RX는 16× 틱으로 비트 중앙 샘플"
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
                단일 <strong style={{ color: '#4A6FA5' }}>clk</strong> → <strong style={{ color: ORANGE }}>÷DIV 카운터</strong>가 <strong style={{ color: DAY12 }}>tick 펄스</strong> 생성 — 이 구조 그대로 설계
              </div>
              <svg viewBox="0 0 470 236" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* FPGA 칩 */}
                <rect x="90" y="22" width="296" height="200" rx="11" fill="#232C3D" stroke="#3D4A63" strokeWidth="1.2" />
                <text x="238" y="36" fontSize="9" fontWeight="700" fill="#9FB3C8" textAnchor="middle" letterSpacing="0.07em" fontFamily={MONO}>FPGA · 단일 클럭 도메인</text>

                {/* clk — 최하단 직결 + 레일 */}
                <rect x="10" y="190" width="62" height="28" rx="6" fill="#4A6FA512" stroke="#4A6FA5" strokeWidth="1.4" />
                <text x="41" y="202" fontSize="9" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>clk</text>
                <text x="41" y="213" fontSize="7" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>100MHz</text>
                <circle cx="78" cy="204" r="3" fill={running ? (phase ? '#4A6FA5' : '#A9C0E0') : '#C2CEDE'} />
                <path d="M72 204 H236" stroke="#4A6FA5" strokeWidth="1.7" fill="none" />
                <circle cx="236" cy="204" r="2.5" fill="#4A6FA5" />
                <path d="M236 204 V160" stroke="#4A6FA5" strokeWidth="1.5" />
                <text x="150" y="199" fontSize="7" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>clk → 100MHz 그대로</text>

                {/* baud_gen 블록 (이번 설계) */}
                <rect x="150" y="66" width="172" height="94" rx="9" fill={`${DAY12}1A`} stroke={DAY12} strokeWidth="1.9" />
                <text x="236" y="86" fontSize="10" fontWeight="800" fill={DAY12} textAnchor="middle" fontFamily={MONO}>baud_gen</text>
                <text x="236" y="98" fontSize="6.3" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>÷DIV 카운터 (데모 8) ← 이번 설계</text>

                {/* cnt 진행 막대 */}
                <text x="172" y="122" fontSize="8" fontWeight="800" fill={ORANGE} fontFamily={MONO}>cnt</text>
                <rect x="196" y="114" width="108" height="10" rx="3" fill="#EDE3D6" />
                <rect x="196" y="114" width={108 * ((st.cnt + 1) / DIV)} height="10" rx="3" fill={ORANGE} />
                <text x="250" y="122" fontSize="7" fontWeight="800" fill="#5A4326" textAnchor="middle" fontFamily={MONO}>{st.cnt}/{DIV - 1}</text>

                {/* tick 펄스 표시 */}
                <text x="172" y="146" fontSize="8" fontWeight="800" fill={DAY12} fontFamily={MONO}>tick</text>
                <rect x="196" y="138" width="40" height="12" rx="3" fill={st.tick ? DAY12 : '#DDE6E2'} />
                <text x="216" y="147" fontSize="8" fontWeight="800" fill={st.tick ? '#fff' : '#7A8B85'} textAnchor="middle" fontFamily={MONO}>{st.tick ? '1' : '0'}</text>
                <text x="262" y="147" fontSize="6.3" fill={FPGA.textLight} fontFamily={MONO}>cnt==DIV-1마다 1-clk</text>

                {/* clk ▷ */}
                <path d="M232 164 l4 -5 l4 5 Z" fill="#4A6FA5" />

                {/* tick → 출력 */}
                <path d="M322 113 H372" stroke={st.tick ? DAY12 : DIM} strokeWidth="1.8" opacity={st.tick ? 1 : 0.6} />
                <text x="350" y="107" fontSize="6.5" fontWeight="700" fill={DAY12} textAnchor="middle" fontFamily={MONO}>tick</text>
                {/* tick 펄스 LED */}
                {st.tick && <circle cx="400" cy="113" r="13" fill={DAY12} opacity="0.32" />}
                <circle cx="400" cy="113" r="8" fill={st.tick ? DAY12 : '#DDE6E2'} stroke={st.tick ? DAY12 : '#B7C5BF'} strokeWidth="1.2" />
                <text x="400" y="116" fontSize="7" fontWeight="800" fill={st.tick ? '#fff' : '#7A8B85'} textAnchor="middle" fontFamily={MONO}>▲</text>
              </svg>

              {/* 컨트롤 + 실시간 값 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setRunning((r) => !r)}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: running ? '#E2574C' : DAY12,
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >{running ? '⏸ 정지' : '▶ 실행'}</button>
                <button
                  onClick={() => { setRunning(false); clkStep(); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: DAY12, background: 'transparent',
                    border: `1px solid ${DAY12}`, borderRadius: '5px', padding: '3px 10px',
                  }}
                >⏭ 클럭 +1</button>
                <span style={{ fontSize: '0.62rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.3rem' }}>
                  cnt {st.cnt}/{DIV - 1} · <span style={{ color: DAY12 }}>tick {st.tick ? 1 : 0}</span>
                </span>
              </div>
              <div style={{ fontSize: '0.58rem', color: '#B45309', textAlign: 'center', marginTop: '0.15rem', lineHeight: 1.4 }}>
                ⚠ DIV=8은 데모용 — 실제 <strong>DIV = CLK_HZ / BAUD ≈ 868</strong> (100MHz / 115200)
              </div>
            </div>

            {/* 설계 코드 (구현부 잠금) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY12}`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem',
                userSelect: 'none', WebkitUserSelect: 'none',
              }}>
                <span style={{ fontSize: '0.6rem', color: DAY12, fontWeight: 800, letterSpacing: '0.05em' }}>
                  baud_gen.v — 설계
                </span>
                <RevealLock
                  revealed={revealed}
                  onReveal={() => setRevealed(true)}
                  onHide={() => setRevealed(false)}
                  password={REVEAL_PW}
                  accent={DAY12}
                />
              </div>
              <VerilogCode code={`${portsCode}\n${revealed ? bodyShown : bodyHidden}`} style={{ fontSize: '0.6rem', lineHeight: 1.42 }} />
            </div>
          </div>

          {/* ── 우: 1× vs 16× + 설명 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              background: FPGA.white, border: `1px solid ${DAY12}25`,
              borderTop: `3px solid ${DAY12}`, borderRadius: '10px',
              padding: '0.7rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>1× (TX) vs 16× (RX) — 같은 1비트 구간을 몇 번 샘플?</div>
              <svg viewBox="0 0 320 106" width="100%" style={{ height: 'auto', display: 'block' }}>
                {/* 비트 셀 배경 — 1비트 = 16 샘플 단위 (두 행 공통 경계) */}
                {osCells.map((cx, c) => (
                  <g key={`os-cell-${c}`}>
                    <rect x={cx} y="16" width={OS.cw} height="80" fill={c % 2 ? '#EEF2F7' : '#F8FAFC'} stroke={FPGA.border} strokeWidth="0.8" />
                    <text x={cx + OS.cw / 2} y="12" fontSize="7" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>1 비트 = 16 샘플</text>
                  </g>
                ))}

                {/* 비트 중앙 가이드 (8번째 틱 위치) */}
                {osCells.map((cx, c) => {
                  const xH = cx + 7.5 * osGap;
                  return <line key={`os-guide-${c}`} x1={xH} y1="18" x2={xH} y2={OS.y16} stroke={ORANGE} strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />;
                })}

                {/* 1× (TX): 비트 경계마다 1 틱 */}
                <text x="2" y={OS.y1 - 3} fontSize="8" fontWeight="800" fill={DAY12} fontFamily={MONO}>1×</text>
                <text x="2" y={OS.y1 + 6} fontSize="6" fontWeight="700" fill={DAY12} fontFamily={MONO}>TX</text>
                <line x1={OS.x0} y1={OS.y1} x2={osXend} y2={OS.y1} stroke={FPGA.border} strokeWidth="1" />
                {Array.from({ length: OS.n + 1 }, (_, i) => OS.x0 + i * OS.cw).map((x, i) => (
                  <rect key={`os-tx-${i}`} x={x - 1.4} y={OS.y1 - 14} width="2.8" height="14" rx="1" fill={DAY12} />
                ))}
                <text x={OS.x0 + OS.cw / 2} y={OS.y1 - 17} fontSize="6.3" fontWeight="700" fill={DAY12} textAnchor="middle" fontFamily={MONO}>비트당 1 틱 — 출력만</text>

                {/* 16× (RX): 비트당 16 틱, 8번째 = 중앙 샘플 */}
                <text x="2" y={OS.y16 - 3} fontSize="8" fontWeight="800" fill="#4A6FA5" fontFamily={MONO}>16×</text>
                <text x="2" y={OS.y16 + 6} fontSize="6" fontWeight="700" fill="#4A6FA5" fontFamily={MONO}>RX</text>
                <line x1={OS.x0} y1={OS.y16} x2={osXend} y2={OS.y16} stroke={FPGA.border} strokeWidth="1" />
                {osCells.map((cx, c) =>
                  Array.from({ length: 16 }, (_, j) => {
                    const x = cx + (j + 0.5) * osGap;
                    const mid = j === 7;                      // 8번째 틱 = 비트 중앙
                    return (
                      <rect key={`os-rx-${c}-${j}`} x={x - (mid ? 1.3 : 0.9)} y={mid ? OS.y16 - 20 : OS.y16 - 10}
                        width={mid ? 2.6 : 1.8} height={mid ? 20 : 10} rx="0.6"
                        fill={mid ? ORANGE : '#4A6FA5'} />
                    );
                  })
                )}

                {/* 8번째 틱에 샘플 화살표 + 번호 */}
                {osCells.map((cx, c) => {
                  const xH = cx + 7.5 * osGap;
                  return (
                    <g key={`os-arrow-${c}`}>
                      <text x={xH} y={OS.y16 - 30} fontSize="6.8" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>8</text>
                      <path d={`M${xH} ${OS.y16 - 28} v6 m-2.6 -2.6 l2.6 2.6 l2.6 -2.6`} stroke={ORANGE} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  );
                })}

                <text x={OS.x0 + OS.cw} y="104" fontSize="7.2" fontWeight="700" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>↑ 매 비트 16샘플 중 8번째(중앙)에서 값 읽기</text>
              </svg>
            </div>

            <div style={{
              flex: 1.45, minHeight: 0,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              background: `linear-gradient(135deg, ${DAY12}08, ${DAY12}15)`,
              border: `1px solid ${DAY12}30`, borderRadius: '10px',
              padding: '0.5rem 0.65rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: DAY12, marginBottom: '0.05rem' }}>
                왜 16×? — 편차는 쌓이지만 매 START에서 재동기
              </div>
              <svg viewBox="0 0 320 84" width="100%" style={{ height: 'auto', display: 'block' }}>
                {/* framing error 한계 영역 (±half-bit) */}
                <rect x="34" y="6" width="278" height="12" fill="#E2574C" opacity="0.09" />
                <line x1="34" y1="18" x2="312" y2="18" stroke="#C0392B" strokeWidth="0.9" strokeDasharray="3 2" opacity="0.7" />
                <text x="36" y="14" fontSize="6" fontWeight="700" fill="#C0392B" fontFamily={MONO}>±8 tick (half-bit) = framing error 한계</text>

                {/* 중앙(0) baseline */}
                <line x1="34" y1="60" x2="312" y2="60" stroke={FPGA.border} strokeWidth="1" />
                <text x="2" y="20" fontSize="5.6" fontWeight="700" fill="#C0392B" fontFamily={MONO}>한계</text>
                <text x="2" y="62" fontSize="5.6" fontWeight="700" fill={FPGA.textLight} fontFamily={MONO}>중앙</text>

                {/* 누적 → 리셋 톱니 (프레임 2개) */}
                {[0, 132].map((off, f) => {
                  const xs = 40 + off, xe = 170 + off, yb = 60, yp = 24;
                  const dots = Array.from({ length: 7 }, (_, i) => ({
                    x: xs + (xe - xs) * i / 6,
                    y: yb + (yp - yb) * i / 6,
                    last: i === 6,
                  }));
                  return (
                    <g key={`frame-${f}`}>
                      <polyline points={`${xs},${yb} ${xe},${yp}`} fill="none" stroke={ORANGE} strokeWidth="1.7" />
                      <line x1={xe} y1={yp} x2={xe + 2} y2={yb} stroke={ORANGE} strokeWidth="1.7" />
                      <line x1={xs} y1={yb} x2={xs} y2={yb + 6} stroke={DAY12} strokeWidth="1.4" />
                      <text x={xs} y={yb + 14} fontSize="6.2" fontWeight="800" fill={DAY12} textAnchor="middle" fontFamily={MONO}>START ↺</text>
                      {dots.map((d, i) => (
                        <circle key={i} cx={d.x} cy={d.y} r={d.last ? 2.4 : 1.5} fill={d.last ? '#C0392B' : ORANGE} />
                      ))}
                      <text x={xs + 52} y={yb - 8} fontSize="6.2" fontWeight="700" fill={ORANGE} fontFamily={MONO}>오차 누적 ↗</text>
                    </g>
                  );
                })}
                {/* 마지막 프레임 뒤 재동기 START */}
                <line x1="304" y1="60" x2="304" y2="66" stroke={DAY12} strokeWidth="1.4" />
                <text x="304" y="74" fontSize="6.2" fontWeight="800" fill={DAY12} textAnchor="middle" fontFamily={MONO}>START ↺</text>
              </svg>

              <ul style={{ margin: '0.1rem 0 0', paddingLeft: '0.9rem', fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.5 }}>
                <li>오차 누적은 <strong>1프레임(≈10비트) 안에서만</strong> — START 하강엣지마다 0으로 리셋</li>
                <li>8번째(중앙) 샘플 = 양쪽 <strong>±8 tick</strong> 마진 → 합산 편차 <strong>~±5%</strong>까지 견딤</li>
              </ul>
            </div>

            <div style={{
              flexShrink: 0,
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
              border: `1px solid ${FPGA.accent}30`, borderRadius: '8px',
              padding: '0.45rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.accent, flexShrink: 0 }}>HINT</span>
              <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>
                16× tick은 <code>baud_gen #(.BAUD(115200*16))</code>로 인스턴스 1개 더 생성.
              </span>
            </div>

            {/* ── arty.xdc 보드 핀 제약 (클릭 모달) ── */}
            <button
              onClick={() => setXdcOpen(true)}
              style={{
                flexShrink: 0,
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
                baud_gen — <strong>시뮬 전용, uart_loop에서 통합</strong> (tick은 내부 펄스, 단독 핀 없음)
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
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>baud_gen — 시뮬 전용, uart_loop에서 통합</span>
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
