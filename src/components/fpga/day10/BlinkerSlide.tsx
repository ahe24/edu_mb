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
const REVEAL_PW = '8220';

// 항상 보이는 포트 선언부
const portsCode = `module blinker #(
  parameter integer DIV = 50_000_000  // 100MHz → ~1Hz 토글
)(
  input  wire clk,
  input  wire rst,          // 동기 active-high
  output reg  led
);`;

const bodyHidden = `  // ⋯ 구현부 숨김 — 🔒 구현 보기 클릭




endmodule`;

const bodyShown = `  reg [25:0] cnt;
  always @(posedge clk) begin
    if (rst)               begin cnt <= 0; led <= 1'b0; end
    else if (cnt == DIV-1) begin cnt <= 0; led <= ~led; end  // 주기마다 토글
    else                   cnt <= cnt + 1'b1;
  end
endmodule`;

const tbCode = `// TB에서 DIV를 작게 override → 빨리 본다
blinker #(.DIV(4)) dut (.clk(clk), .rst(rst), .led(led));`;

const xdcCode = `## ==================================================================
## Day 10 blinker — arty.xdc (Arty A7-35T Master 발췌)
##   clk → 100MHz (create_clock 필수)   rst → 푸시버튼   led → LED
## clk 을 분주해 새 클럭으로 쓰지 말 것 — 카운터로 led 토글(단일 클럭).
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── led → User LED LD4 ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { led }];`;

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

/** 단색 칩 LED */
function ChipLed({ cx, cy, on, r = 1 }: { cx: number; cy: number; on: boolean; r?: number }) {
  const lit = '#2FE08A';
  const off = '#244034';
  const s = r;
  return (
    <g>
      {on && <ellipse cx={cx} cy={cy} rx={15 * s} ry={12 * s} fill={lit} opacity="0.34" />}
      <rect x={cx - 10 * s} y={cy - 6 * s} width={4 * s} height={12 * s} rx="1" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.5" />
      <rect x={cx + 6 * s} y={cy - 6 * s} width={4 * s} height={12 * s} rx="1" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.5" />
      <rect x={cx - 7.5 * s} y={cy - 7 * s} width={15 * s} height={14 * s} rx="2" fill={on ? '#F1F4F8' : '#E5E9EE'} stroke="#C2C9D2" strokeWidth="0.8" />
      <rect x={cx - 5 * s} y={cy - 4.5 * s} width={10 * s} height={9 * s} rx="1.5" fill={on ? lit : off} stroke={on ? lit : '#37503F'} strokeWidth="0.6" />
      <rect x={cx - 5 * s} y={cy - 4.5 * s} width={10 * s} height={3 * s} rx="1.2" fill="#FFFFFF" opacity={on ? 0.55 : 0.08} />
    </g>
  );
}

export default function BlinkerSlide() {
  const DIV = 4;                        // 데모용 분주비 (실제 보드: 50_000_000)
  const [st, setSt] = useState({ cnt: 0, led: false });
  const [rst, setRst] = useState(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [xdcOpen, setXdcOpen] = useState(false);

  const clkStep = () => {
    setPhase((p) => !p);
    setSt((s) => {
      if (rst) return { cnt: 0, led: false };
      if (s.cnt === DIV - 1) return { cnt: 0, led: !s.led };  // 주기마다 토글
      return { cnt: s.cnt + 1, led: s.led };
    });
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(clkStep, 420);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, rst]);

  const DIM = '#94A3B8';

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 1 · 오전 ① · 클럭 분주"
          title="blinker — 100MHz를 1Hz LED로"
          subtitle="카운터로 클럭을 분주해 LED를 토글 — 클럭을 직접 돌려 분주를 눈으로 본다"
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
                단일 <strong style={{ color: '#4A6FA5' }}>clk</strong> → <strong style={{ color: ORANGE }}>÷DIV 카운터</strong>가 <strong style={{ color: DAY10 }}>led 토글</strong> — 이 구조 그대로 설계
              </div>
              <svg viewBox="0 0 470 236" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* FPGA 칩 */}
                <rect x="90" y="22" width="296" height="200" rx="11" fill="#232C3D" stroke="#3D4A63" strokeWidth="1.2" />
                <text x="238" y="36" fontSize="9" fontWeight="700" fill="#9FB3C8" textAnchor="middle" letterSpacing="0.07em" fontFamily={MONO}>FPGA · 단일 클럭 도메인</text>

                {/* rst — 최상단 직결 */}
                <SlideSwitch cx={46} cy={46} on={rst} onToggle={() => setRst((v) => !v)} label="rst" />
                <path d="M66 46 H236 V66" stroke={rst ? '#E2574C' : DIM} strokeWidth="1.4" fill="none" opacity={rst ? 1 : 0.7} />
                <text x="318" y="44" fontSize="6.5" fontWeight="700" fill={rst ? '#E2574C' : FPGA.textLight} textAnchor="end" fontFamily={MONO}>rst (동기)</text>

                {/* clk — 최하단 직결 + 레일 */}
                <rect x="10" y="190" width="62" height="28" rx="6" fill="#4A6FA512" stroke="#4A6FA5" strokeWidth="1.4" />
                <text x="41" y="202" fontSize="9" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>clk</text>
                <text x="41" y="213" fontSize="7" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>100MHz</text>
                <circle cx="78" cy="204" r="3" fill={running ? (phase ? '#4A6FA5' : '#A9C0E0') : '#C2CEDE'} />
                <path d="M72 204 H236" stroke="#4A6FA5" strokeWidth="1.7" fill="none" />
                <circle cx="236" cy="204" r="2.5" fill="#4A6FA5" />
                <path d="M236 204 V160" stroke="#4A6FA5" strokeWidth="1.5" />
                <text x="150" y="199" fontSize="7" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>clk → 100MHz 그대로</text>

                {/* blinker 블록 (이번 설계) */}
                <rect x="150" y="66" width="172" height="94" rx="9" fill={`${DAY10}1A`} stroke={DAY10} strokeWidth="1.9" />
                <text x="236" y="86" fontSize="10" fontWeight="800" fill={DAY10} textAnchor="middle" fontFamily={MONO}>blinker</text>
                <text x="236" y="98" fontSize="6.3" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>÷DIV 카운터 (데모 4) ← 이번 설계</text>

                {/* cnt 진행 막대 */}
                <text x="172" y="122" fontSize="8" fontWeight="800" fill={ORANGE} fontFamily={MONO}>cnt</text>
                <rect x="196" y="114" width="108" height="10" rx="3" fill="#EDE3D6" />
                <rect x="196" y="114" width={108 * ((st.cnt + 1) / DIV)} height="10" rx="3" fill={ORANGE} />
                <text x="250" y="122" fontSize="7" fontWeight="800" fill="#5A4326" textAnchor="middle" fontFamily={MONO}>{st.cnt}/{DIV - 1}</text>

                {/* led FF 토글 표시 */}
                <text x="172" y="146" fontSize="8" fontWeight="800" fill={DAY10} fontFamily={MONO}>led</text>
                <rect x="196" y="138" width="40" height="12" rx="3" fill={st.led ? DAY10 : '#DDE6E2'} />
                <text x="216" y="147" fontSize="8" fontWeight="800" fill={st.led ? '#fff' : '#7A8B85'} textAnchor="middle" fontFamily={MONO}>{st.led ? '1' : '0'}</text>
                <text x="262" y="147" fontSize="6.3" fill={FPGA.textLight} fontFamily={MONO}>cnt==DIV-1마다 ~led</text>

                {/* clk ▷ */}
                <path d="M232 164 l4 -5 l4 5 Z" fill="#4A6FA5" />

                {/* led → LED */}
                <path d="M322 113 H372" stroke={st.led ? '#2FE08A' : DIM} strokeWidth="1.8" opacity={st.led ? 1 : 0.6} />
                <text x="350" y="107" fontSize="6.5" fontWeight="700" fill={DAY10} textAnchor="middle" fontFamily={MONO}>led</text>
                <ChipLed cx={400} cy={113} on={st.led} r={1.25} />
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
                  cnt {st.cnt}/{DIV - 1} · <span style={{ color: DAY10 }}>led {st.led ? 1 : 0}</span>
                </span>
              </div>
              <div style={{ fontSize: '0.58rem', color: '#B45309', textAlign: 'center', marginTop: '0.15rem', lineHeight: 1.4 }}>
                ⚠ DIV=4는 데모용 — 실제 보드는 <strong>50,000,000</strong> (LED 주기 = 2×DIV×Tclk ≈ 1초 ON/OFF)
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
                  blinker.v — 설계
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

          {/* ── 우: 분주 원리 + override + 파형 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY10}25`,
              borderTop: `3px solid ${DAY10}`, borderRadius: '10px',
              padding: '0.55rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>분주 원리</div>
              <svg width="100%" height="64" viewBox="0 0 320 64">
                <text x="2" y="18" fontSize="8.5" fontWeight="700" fill="#4A6FA5" fontFamily={MONO}>clk</text>
                <path d="M30 22 H38 V8 H46 V22 H54 V8 H62 V22 H70 V8 H78 V22 H86 V8 H94 V22 H102 V8 H110 V22 H300"
                  stroke="#4A6FA5" strokeWidth="1.1" fill="none" />
                <text x="2" y="50" fontSize="8.5" fontWeight="700" fill={DAY10} fontFamily={MONO}>led</text>
                <path d="M30 54 H110 V32 H190 V54 H270 V32 H300" stroke={DAY10} strokeWidth="2.2" fill="none" />
                <text x="120" y="28" fontSize="7.5" fill={FPGA.textLight} fontFamily={MONO}>DIV 클럭마다 1회 토글</text>
              </svg>
              <div style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.5, marginTop: '0.2rem' }}>
                LED 주기 = <code>2 × DIV × Tclk</code>. DIV=50M → 1초 ON / 1초 OFF.
              </div>
            </div>

            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${ORANGE}`,
            }}>
              <div style={{ fontSize: '0.6rem', color: ORANGE, fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                시뮬 팁 — parameter override
              </div>
              <VerilogCode code={tbCode} style={{ fontSize: '0.62rem', lineHeight: 1.5 }} />
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
                Visualizer 파형 — cnt 분주 → led 토글
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ToolImage src="/images/fpga/day10_blinker_wave.png" name="blinker 시뮬 파형" width="100%" height="100%" />
              </div>
              <div style={{ fontSize: '0.58rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.3rem' }}>
                day10_blinker_wave.png — DIV override 후 cnt 분주·led 토글 (클릭 시 확대)
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
            보드 핀 제약 — <strong>clk(100MHz, create_clock) · rst(버튼) · led(LED)</strong>
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
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>Arty A7-35T Master 발췌 · clk · rst · led</span>
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
