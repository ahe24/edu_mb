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
const REVEAL_PW = '7253';

// 항상 보이는 포트 + 내부 wire 선언
const portsCode = `module uart_loop #(
  parameter integer CLK_HZ = 100_000_000,
  parameter integer BAUD   = 115200
)(
  input  wire clk, rst,
  input  wire rx_pin,           // FT2232 → FPGA
  output wire tx_pin            // FPGA → FT2232
);
  wire tick, tick16, valid;
  wire [7:0] rdata;`;

const bodyShown = `  baud_gen #(.CLK_HZ(CLK_HZ), .BAUD(BAUD))    u_b1 (.clk,.rst,.tick(tick));
  baud_gen #(.CLK_HZ(CLK_HZ), .BAUD(BAUD*16)) u_b16(.clk,.rst,.tick(tick16));
  // 수신
  uart_rx u_rx (.clk,.rst,.tick16,.rx_in(rx_pin),
                .data(rdata), .valid(valid));
  // 받은 바이트를 그대로 재전송 (echo) — valid → start
  uart_tx u_tx (.clk,.rst,.tick,.start(valid),.data(rdata),
                .tx(tx_pin), .busy());
endmodule`;

const xdcCode = `## ==================================================================
## Day 12 uart_loop — arty.xdc (Arty A7-35T Master 발췌)
## 보드 top = uart_loop (USB-UART echo 루프백)
##   clk → 100MHz   rst → 푸시버튼 BTN0
##   rx_pin → USB-UART RXD (FT2232 → FPGA, Master 의 uart_txd_in=A9)
##   tx_pin → USB-UART TXD (FPGA → FT2232, Master 의 uart_rxd_out=D10)
## ※ Arty 마스터 신호명 기준: 호스트가 보내는 선(uart_txd_in)이 FPGA 입력(rx_pin),
##   FPGA 가 내보내는 선(uart_rxd_out)이 출력(tx_pin) — 매핑 방향 주의.
## ※ 시뮬레이션 단계에서는 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── rx_pin → USB-UART RXD (호스트→FPGA, Master uart_txd_in=A9) ──
set_property -dict { PACKAGE_PIN A9  IOSTANDARD LVCMOS33 } [get_ports { rx_pin }];

## ── tx_pin → USB-UART TXD (FPGA→호스트, Master uart_rxd_out=D10) ──
set_property -dict { PACKAGE_PIN D10 IOSTANDARD LVCMOS33 } [get_ports { tx_pin }];`;

// echo 흐름 5단계: rx_pin 입력 → rx 수신중 → valid 펄스 → tx 전송중 → tx_pin 출력
const STAGES = [
  { key: 'rx_pin', label: 'rx_pin 입력', desc: '0x41 프레임이 rx_pin 으로 진입' },
  { key: 'rx',     label: 'uart_rx 수신중', desc: 'tick16 오버샘플로 8비트 조립' },
  { key: 'valid',  label: 'valid 펄스', desc: 'rdata 확정 · valid 1-clk → start' },
  { key: 'tx',     label: 'uart_tx 전송중', desc: 'tick 단위로 동일 바이트 송출' },
  { key: 'tx_pin', label: 'tx_pin 출력', desc: 'echo 완료 — 호스트로 0x41 복귀' },
];

export default function LoopbackSlide() {
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);
  const [xdcOpen, setXdcOpen] = useState(false);

  const step = () => setStage((s) => (s + 1) % STAGES.length);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, 760);
    return () => clearInterval(id);
     
  }, [running]);

  const cur = STAGES[stage];
  const isRx = stage === 1;
  const isValid = stage === 2;
  const isTx = stage === 3;
  const rxBlk = stage === 0 || stage === 1;   // rx_pin 진입 + rx 수신
  const txBlk = stage === 3 || stage === 4;   // tx 전송 + tx_pin 출력
  const DIM = '#94A3B8';

  // 이동 바이트(0x41 'A') 좌표 — 단계별 위치
  const tokenPos = [
    { x: 150, y: 75 },   // FT2232 → rx_pin
    { x: 194, y: 36 },   // uart_rx 내부
    { x: 248, y: 75 },   // valid→start 커플링
    { x: 194, y: 114 },  // uart_tx 내부
    { x: 110, y: 75 },   // tx_pin → FT2232
  ][stage];

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · 루프백(echo)"
          title="TX + RX 통합 — echo 루프백"
          subtitle="RX valid를 TX start로 연결 · 수신 바이트를 즉시 재전송 · Arty USB-UART로 확인"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 인터랙티브 echo 흐름 + 설계 코드 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.45rem 0.55rem 0.3rem',
              boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.textLight, textAlign: 'center', marginBottom: '0.05rem' }}>
                바이트 <strong style={{ color: ORANGE }}>0x41</strong> 가 <strong style={{ color: '#4A6FA5' }}>uart_rx</strong> → <strong style={{ color: ORANGE }}>valid→start</strong> → <strong style={{ color: DAY12 }}>uart_tx</strong> 로 echo
              </div>
              <svg viewBox="0 0 300 150" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* PC term */}
                <rect x="8" y="58" width="50" height="34" rx="5" fill="rgba(74,111,165,0.10)" stroke="#4A6FA5" strokeWidth="1.5" />
                <text x="33" y="79" fontSize="8" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>PC term</text>
                {/* FT2232 */}
                <rect x="86" y="58" width="46" height="34" rx="5" fill="rgba(113,128,150,0.10)" stroke="#718096" strokeWidth="1.5" />
                <text x="109" y="79" fontSize="7.5" fontWeight="700" fill="#718096" textAnchor="middle" fontFamily={MONO}>FT2232</text>

                {/* RX block */}
                <rect x="166" y="20" width="56" height="32" rx="5"
                  fill={rxBlk ? 'rgba(74,111,165,0.28)' : 'rgba(74,111,165,0.12)'}
                  stroke="#4A6FA5" strokeWidth={rxBlk ? 2.6 : 1.5} />
                <text x="194" y="34" fontSize="8.5" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>uart_rx</text>
                <text x="194" y="45" fontSize="5.6" fontWeight="700" fill={isRx ? '#4A6FA5' : '#9FB3C8'} textAnchor="middle" fontFamily={MONO}>{isRx ? '수신중…' : 'tick16 ×16'}</text>

                {/* TX block */}
                <rect x="166" y="98" width="56" height="32" rx="5"
                  fill={txBlk ? `${DAY12}30` : `${DAY12}15`}
                  stroke={DAY12} strokeWidth={txBlk ? 2.6 : 1.5} />
                <text x="194" y="112" fontSize="8.5" fontWeight="800" fill={DAY12} textAnchor="middle" fontFamily={MONO}>uart_tx</text>
                <text x="194" y="123" fontSize="5.6" fontWeight="700" fill={isTx ? DAY12 : '#7FB3B9'} textAnchor="middle" fontFamily={MONO}>{isTx ? '전송중…' : 'tick ×1'}</text>

                {/* PC ↔ FT2232 */}
                <path d="M58 75 H86" stroke="#4A6FA5" strokeWidth="1.4" />
                {/* rx_pin: FT2232 → rx */}
                <path d="M132 70 L166 40" stroke="#4A6FA5" strokeWidth={rxBlk ? 2.2 : 1.4} markerEnd="url(#l12)" />
                <text x="148" y="50" fontSize="6.5" fill="#4A6FA5" fontFamily={MONO}>rx_pin</text>
                {/* valid → start 커플링 펄스 */}
                <path d="M222 36 H252 V114 H222" fill="none"
                  stroke={ORANGE} strokeWidth={isValid ? 2.6 : 1.4} strokeDasharray="4 3" markerEnd="url(#l12v)" />
                <text x="256" y="74" fontSize="6.5" fill={ORANGE} fontWeight={isValid ? 800 : 400} fontFamily={MONO}>valid</text>
                <text x="256" y="84" fontSize="6.5" fill={ORANGE} fontWeight={isValid ? 800 : 400} fontFamily={MONO}>→start</text>
                {isValid && <circle cx="252" cy="75" r="4.5" fill={ORANGE} opacity="0.9" />}
                {/* tx_pin: tx → FT2232 */}
                <path d="M166 114 L132 84" stroke={DAY12} strokeWidth={txBlk ? 2.2 : 1.4} markerEnd="url(#l12t)" />
                <text x="138" y="108" fontSize="6.5" fill={DAY12} fontFamily={MONO}>tx_pin</text>

                {/* 이동 바이트 토큰 0x41 'A' */}
                <g>
                  <rect x={tokenPos.x - 13} y={tokenPos.y - 8} width="26" height="16" rx="4" fill={ORANGE} stroke="#B45309" strokeWidth="1" />
                  <text x={tokenPos.x} y={tokenPos.y + 4} fontSize="7.5" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily={MONO}>0x41</text>
                </g>

                <defs>
                  <marker id="l12" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#4A6FA5" /></marker>
                  <marker id="l12v" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={ORANGE} /></marker>
                  <marker id="l12t" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={DAY12} /></marker>
                </defs>
              </svg>

              {/* 컨트롤 + 상태 라인 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setRunning((r) => !r)}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: running ? '#E2574C' : DAY12,
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >{running ? '⏸ 정지' : '▶ echo 흐름'}</button>
                <button
                  onClick={() => { setRunning(false); step(); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: DAY12, background: 'transparent',
                    border: `1px solid ${DAY12}`, borderRadius: '5px', padding: '3px 10px',
                  }}
                >⏭ 단계</button>
                <button
                  onClick={() => { setRunning(false); setStage(0); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: DIM, background: 'transparent',
                    border: `1px solid ${DIM}`, borderRadius: '5px', padding: '3px 10px',
                  }}
                >rst</button>
                <span style={{ fontSize: '0.62rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.3rem' }}>
                  stage <span style={{ color: DAY12 }}>{stage + 1}/5</span> · {cur.label}
                </span>
              </div>
              <div style={{ fontSize: '0.58rem', color: '#5A6B7A', textAlign: 'center', marginTop: '0.15rem', lineHeight: 1.4 }}>
                {cur.desc}
              </div>
            </div>

            {/* 설계 코드 (구현부 잠금) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY12}`,
            }}>
              <RevealCodeModal
                title="uart_loop.v — 설계"
                accent={DAY12}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="TX+RX echo · valid→start"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: 통합 블록도 + 확인 방법 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minHeight: 0 }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY12}25`,
              borderTop: `3px solid ${DAY12}`, borderRadius: '10px',
              padding: '0.5rem', boxShadow: shadow.card,
              flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>통합 블록도 — uart_loop</div>
              <svg width="100%" height="100%" viewBox="0 0 300 150" style={{ flex: 1, minHeight: 0 }}>
                {/* PC */}
                <rect x="8" y="58" width="50" height="34" rx="5" fill="rgba(74,111,165,0.10)" stroke="#4A6FA5" strokeWidth="1.5" />
                <text x="33" y="79" fontSize="8" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>PC term</text>
                {/* FT2232 */}
                <rect x="86" y="58" width="46" height="34" rx="5" fill="rgba(113,128,150,0.10)" stroke="#718096" strokeWidth="1.5" />
                <text x="109" y="79" fontSize="7.5" fontWeight="700" fill="#718096" textAnchor="middle" fontFamily={MONO}>FT2232</text>
                {/* RX block */}
                <rect x="166" y="20" width="56" height="32" rx="5" fill="rgba(74,111,165,0.12)" stroke="#4A6FA5" strokeWidth="1.5" />
                <text x="194" y="40" fontSize="8.5" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>uart_rx</text>
                {/* TX block */}
                <rect x="166" y="98" width="56" height="32" rx="5" fill={`${DAY12}15`} stroke={DAY12} strokeWidth="1.5" />
                <text x="194" y="118" fontSize="8.5" fontWeight="800" fill={DAY12} textAnchor="middle" fontFamily={MONO}>uart_tx</text>
                {/* arrows */}
                <path d="M58 75 H86" stroke="#4A6FA5" strokeWidth="1.4" />
                <path d="M132 70 L166 40" stroke="#4A6FA5" strokeWidth="1.4" markerEnd="url(#bl12)" /><text x="148" y="50" fontSize="6.5" fill="#4A6FA5">rx_pin</text>
                <path d="M222 36 H252 V114 H222" fill="none" stroke="#E8913A" strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#bl12)" />
                <text x="256" y="78" fontSize="6.5" fill="#E8913A" fontFamily={MONO}>valid→start</text>
                <path d="M166 114 L132 84" stroke={DAY12} strokeWidth="1.4" markerEnd="url(#bl12)" /><text x="140" y="108" fontSize="6.5" fill={DAY12}>tx_pin</text>
                <defs><marker id="bl12" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={FPGA.textLight} /></marker></defs>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY12}08, ${DAY12}15)`,
              border: `1px solid ${DAY12}30`, borderRadius: '9px',
              padding: '0.5rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: DAY12, marginBottom: '0.15rem' }}>확인 방법</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.55 }}>
                <li>PC 터미널에서 문자 입력 → 동일 문자 echo 수신</li>
                <li>시뮬: rx_pin에 frame 주입 → tx_pin에 동일 frame 출력</li>
                <li>valid→start 1-clk 타이밍 정합 확인</li>
              </ul>
              <div style={{ fontSize: '0.6rem', color: DAY12, fontWeight: 700, marginTop: '0.3rem' }}>
                → scoreboard로 자동검증 → 다음 슬라이드
              </div>
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
            uart_loop — <strong>Arty USB-UART 실연결 · clk(E3, create_clock) · rst(D9) · rx_pin(A9) · tx_pin(D10)</strong>
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
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>Arty A7-35T Master 발췌 · clk · rst · rx_pin · tx_pin</span>
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
