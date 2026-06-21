'use client';

import { useState, useEffect } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';
import RevealCodeModal from '../RevealCodeModal';

const DAY11 = '#3D8361';
const ORANGE = '#E8913A';
const RED = '#E53E3E';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '4471';

const MODE = ['OFF', 'DIM', 'MID', 'MAX'];
const PCT = ['0%', '12.5%', '25%', '50%'];   // RGB duty (50% 상한)
const DMAX = 16;                 // 데모 PWM 주기 (cnt 0..15, 보드는 100,000)
const DDEMO = [0, 2, 4, 8];      // 데모 duty (0 / 12.5 / 25 / 50%)

// 항상 보이는 포트 + 상수
const portsCode = `module pwm_rgb #(
  parameter integer CLK_HZ = 100_000_000,  // 메인 클럭 100MHz
  parameter integer PWM_HZ = 1000          // PWM 주파수 200~1000 권장
)(
  input  wire clk, rst,        // rst: 동기 active-high
  input  wire btn_p,           // 1-clk 펄스 (디바운서+엣지, Day10)
  output wire rgb              // RGB 한 채널 — 최대 duty 50%
);
  localparam integer PERIOD = CLK_HZ/PWM_HZ;  // =100,000 (1kHz, 1ms)
  localparam OFF=2'd0, DIM=2'd1, MID=2'd2, MAX=2'd3;`;

const bodyShown = `  reg [1:0] mode;
  reg [$clog2(PERIOD)-1:0] duty, cnt;
  always @(posedge clk)                    // 모드 순환 FSM
    if (rst) mode<=OFF; else if (btn_p) mode<=mode+1'b1;
  always @* case (mode)                    // 모드→duty (RGB 상한 50%)
    OFF: duty=0;        DIM: duty=PERIOD/8;
    MID: duty=PERIOD/4; MAX: duty=PERIOD/2;
  endcase
  always @(posedge clk)                    // PWM 주기 카운터
    if (rst||cnt==PERIOD-1) cnt<=0; else cnt<=cnt+1'b1;
  assign rgb = (cnt < duty);
endmodule`;

const xdcCode = `## ==================================================================
## Day 11 pwm_rgb — arty.xdc (Arty A7-35T Master 발췌)
##   clk → 100MHz (create_clock)   rst → BTN0   btn_p → BTN1
##   rgb → RGB LED LD0 녹색 채널 (led0_g)
## ※ RGB LED는 매우 밝아 최대 duty 50% 상한 — 코드의 PERIOD/2.
##    단색 User LED 디밍이면 같은 구조로 100%까지 사용 가능.
## ※ PWM 주파수 200Hz~1kHz (PWM_HZ). 100MHz ÷ 100,000 = 1kHz(1ms).
## ※ btn_p 는 1-clk 펄스 — Day10 디바운서+상승엣지 검출 후 연결.
## ※ 시뮬은 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── btn_p → 푸시버튼 BTN1 (디바운서+엣지검출 거친 1-clk 펄스) ──
set_property -dict { PACKAGE_PIN C9  IOSTANDARD LVCMOS33 } [get_ports { btn_p }];

## ── rgb → RGB LED LD0 녹색 채널 ──
set_property -dict { PACKAGE_PIN G6  IOSTANDARD LVCMOS33 } [get_ports { rgb }];`;

export default function PwmModeSlide() {
  const [mode, setMode] = useState(0);
  const [cnt, setCnt] = useState(0);
  const [rst, setRst] = useState(false);
  const [running, setRunning] = useState(false);
  const [xdcOpen, setXdcOpen] = useState(false);

  const clkStep = () => {
    setCnt((c) => (rst ? 0 : (c + 1) % DMAX));
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(clkStep, 240);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, rst]);

  const m = rst ? 0 : mode;
  const dDemo = DDEMO[m];
  const rgbOn = !rst && cnt < dDemo;
  const bright = dDemo / DMAX;          // 평균 밝기 0~0.5 (RGB 상한)

  const pressBtn = () => { if (!rst) setMode((v) => (v + 1) % 4); };

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · RGB PWM"
          title="버튼으로 밝기 순환 — mode FSM + PWM"
          subtitle="4단계 밝기 순환 · RGB는 눈부심 방지로 duty 50% 상한 · 100MHz → 1kHz PWM"
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
                <strong style={{ color: DAY11 }}>버튼</strong>이 mode 순환 → duty 결정 · <strong style={{ color: '#4A6FA5' }}>clk</strong>마다 cnt가 <strong style={{ color: ORANGE }}>duty와 비교</strong>해 rgb ON/OFF
              </div>
              <svg viewBox="0 0 470 220" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* 모드 순환 ring (4 노드) */}
                {[
                  { cx: 60, cy: 50 }, { cx: 150, cy: 50 }, { cx: 150, cy: 140 }, { cx: 60, cy: 140 },
                ].map((n, i) => {
                  const active = m === i;
                  const cap = i === 3;   // MAX = 50% 상한 강조
                  const col = cap ? RED : DAY11;
                  return (
                    <g key={i}>
                      {active && <circle cx={n.cx} cy={n.cy} r="27" fill={col} opacity="0.16" />}
                      <circle cx={n.cx} cy={n.cy} r="22" fill={active ? `${col}26` : '#F4F6F9'} stroke={col} strokeWidth={active ? 2.6 : 1.3} />
                      <text x={n.cx} y={n.cy - 2} fontSize="8.5" fontWeight="800" fill={col} textAnchor="middle" fontFamily={MONO}>{MODE[i]}</text>
                      <text x={n.cx} y={n.cy + 9} fontSize="6.3" fontWeight="700" fill={active ? col : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>{PCT[i]}</text>
                    </g>
                  );
                })}
                {/* 순환 화살표 */}
                <path d="M82 44 H128" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#pa)" />
                <path d="M156 72 V118" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#pa)" />
                <path d="M128 146 H82" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#pa)" />
                <path d="M54 118 V72" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#pa)" />
                <text x="105" y="178" fontSize="6.5" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>btn_p 펄스마다 mode+1</text>

                {/* PWM 비교 영역 */}
                <text x="232" y="34" fontSize="7.5" fontWeight="800" fill={ORANGE} fontFamily={MONO}>PWM: cnt &lt; duty</text>
                {/* cnt 진행 막대 */}
                <text x="222" y="58" fontSize="7" fontWeight="800" fill="#4A6FA5" fontFamily={MONO}>cnt</text>
                <rect x="248" y="50" width="120" height="11" rx="3" fill="#E6ECF4" />
                <rect x="248" y="50" width={120 * ((cnt + 1) / DMAX)} height="11" rx="3" fill="#4A6FA5" />
                <text x="308" y="59" fontSize="7" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily={MONO}>{cnt}/{DMAX - 1}</text>
                {/* duty 막대 + 50% 상한 마커 */}
                <text x="222" y="80" fontSize="7" fontWeight="800" fill={ORANGE} fontFamily={MONO}>duty</text>
                <rect x="248" y="72" width="120" height="11" rx="3" fill="#F1E6D6" />
                <rect x="248" y="72" width={120 * (dDemo / DMAX)} height="11" rx="3" fill={ORANGE} />
                <line x1="308" y1="69" x2="308" y2="85" stroke={RED} strokeWidth="1.3" strokeDasharray="2 1.5" />
                <text x="308" y="95" fontSize="5.6" fontWeight="800" fill={RED} textAnchor="middle" fontFamily={MONO}>50% 상한</text>
                <text x="378" y="80" fontSize="7" fontWeight="800" fill="#5A4326" textAnchor="start" fontFamily={MONO}>{PCT[m]}</text>
                {/* rgb 결과 */}
                <text x="222" y="116" fontSize="7" fontWeight="800" fill={DAY11} fontFamily={MONO}>rgb</text>
                <rect x="248" y="107" width="36" height="13" rx="3" fill={rgbOn ? DAY11 : '#DDE6E2'} />
                <text x="266" y="116.5" fontSize="8" fontWeight="800" fill={rgbOn ? '#fff' : '#7A8B85'} textAnchor="middle" fontFamily={MONO}>{rgbOn ? 1 : 0}</text>
                <text x="296" y="116.5" fontSize="6.3" fill={FPGA.textLight} fontFamily={MONO}>= (cnt &lt; duty)</text>

                {/* RGB LED (평균 밝기 = duty, 50%까지) */}
                <text x="418" y="46" fontSize="7" fontWeight="800" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>RGB LED</text>
                <circle cx="418" cy="104" r="34" fill={DAY11} opacity={0.1 + 1.4 * bright} />
                <circle cx="418" cy="104" r="22" fill={DAY11} opacity={0.15 + 1.6 * bright} stroke={DAY11} strokeWidth="1.5" />
                <text x="418" y="108" fontSize="8.5" fontWeight="800" fill={bright > 0.3 ? '#fff' : DAY11} textAnchor="middle" fontFamily={MONO}>{PCT[m]}</text>
                <text x="418" y="150" fontSize="6.3" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>평균 밝기 = duty/PERIOD</text>
                <text x="418" y="162" fontSize="5.8" fill={RED} textAnchor="middle" fontWeight="700" fontFamily={MONO}>RGB 상한 50%</text>

                {/* 주파수 메모 */}
                <text x="232" y="138" fontSize="6.3" fill={FPGA.textLight} fontFamily={MONO}>PWM 1kHz(주기 100,000clk) → 깜빡임 없이 연속 밝기</text>

                <defs>
                  <marker id="pa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0 0 L6 3 L0 6 z" fill={DAY11} />
                  </marker>
                </defs>
              </svg>

              {/* 컨트롤 + 실시간 값 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={pressBtn}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: ORANGE, border: 'none', borderRadius: '5px', padding: '3px 11px',
                  }}
                >🔘 버튼 (mode+1)</button>
                <button
                  onClick={() => setRunning((r) => !r)}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: running ? '#E2574C' : DAY11,
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >{running ? '⏸ 정지' : '▶ PWM'}</button>
                <button
                  onClick={() => { setRunning(false); clkStep(); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: DAY11, background: 'transparent',
                    border: `1px solid ${DAY11}`, borderRadius: '5px', padding: '3px 10px',
                  }}
                >⏭ clk+1</button>
                <button
                  onClick={() => setRst((v) => !v)}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: rst ? '#fff' : '#E2574C', background: rst ? '#E2574C' : 'transparent',
                    border: `1px solid #E2574C`, borderRadius: '5px', padding: '3px 9px',
                  }}
                >rst {rst ? 1 : 0}</button>
                <span style={{ fontSize: '0.62rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.2rem' }}>
                  mode <span style={{ color: m === 3 ? RED : DAY11 }}>{MODE[m]}</span> · duty {PCT[m]}
                </span>
              </div>
            </div>

            {/* 설계 코드 — 인라인은 인터페이스만(컴팩트), 구현은 모달로 여유있게 */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY11}`,
            }}>
              <RevealCodeModal
                title="pwm_rgb.v — 설계"
                accent={DAY11}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="mode FSM + PWM · RGB duty 50% 상한 · PWM 1kHz"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: PWM 원리 + 밝기/주파수 주의 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY11}25`,
              borderTop: `3px solid ${DAY11}`, borderRadius: '10px',
              padding: '0.55rem 0.8rem', boxShadow: shadow.card,
              flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>PWM duty 파형 (RGB 0~50%)</div>
              <svg width="100%" viewBox="0 0 320 110" style={{ flex: 1, minHeight: 0 }}>
                {[
                  { y: 16, lbl: 'OFF 0%', duty: 0, c: '#94A3B8' },
                  { y: 42, lbl: 'DIM 12.5%', duty: 0.125, c: DAY11 },
                  { y: 68, lbl: 'MID 25%', duty: 0.25, c: DAY11 },
                  { y: 94, lbl: 'MAX 50%', duty: 0.5, c: RED },
                ].map((r, k) => {
                  const x0 = 70, W = 234, period = 39;
                  // build square wave path (duty 비율만큼 HIGH)
                  let d = `M${x0} ${r.y}`;
                  for (let x = x0; x < x0 + W; x += period) {
                    const onW = period * r.duty;
                    d += ` L${x} ${r.y - 7} L${x + onW} ${r.y - 7} L${x + onW} ${r.y} L${x + period} ${r.y}`;
                  }
                  return (
                    <g key={k}>
                      <text x="4" y={r.y + 2} fontSize="6.4" fontWeight="700" fill={r.c} fontFamily={MONO}>{r.lbl}</text>
                      <line x1={x0} y1={r.y} x2={x0 + W} y2={r.y} stroke={FPGA.border} strokeWidth="0.7" />
                      {r.duty > 0 && <path d={d} stroke={r.c} strokeWidth="1.6" fill="none" />}
                    </g>
                  );
                })}
                <text x="187" y="108" fontSize="6.2" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>ON 비율(duty)↑ = 평균 전류↑ = 밝기↑ · RGB는 50%에서 정지</text>
              </svg>
            </div>

            {/* 보드 주의 — RGB 50% 상한 + 단색 100% */}
            <div style={{
              background: `linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.13))`,
              border: '1px solid rgba(229,62,62,0.30)', borderLeft: `4px solid ${RED}`,
              borderRadius: '9px', padding: '0.5rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: RED, marginBottom: '0.15rem' }}>보드 주의 · 밝기 / 주파수</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.5 }}>
                <li><strong>RGB LED는 매우 밝음</strong> → 최대 duty <strong>50% 상한</strong>(눈부심·전류). 단색 User LED는 100%까지 가능.</li>
                <li>PWM <strong>200Hz~1kHz</strong>: 100MHz ÷ PERIOD(100,000) = 1kHz. 200Hz↓는 잔상, 표시 LED엔 1kHz↑ 불필요.</li>
              </ul>
            </div>

            {/* 연결 */}
            <div style={{
              background: `linear-gradient(135deg, rgba(8,145,178,0.06), rgba(8,145,178,0.12))`,
              border: '1px solid rgba(8,145,178,0.28)', borderLeft: '4px solid #0891B2',
              borderRadius: '8px', padding: '0.42rem 0.8rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0891B2' }}>연결 · </span>
              <span style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.45 }}>
                <code>btn_p</code>는 Day 10 디바운서 출력의 <strong>상승엣지 1펄스</strong>. mode FSM(duty 결정)과 PWM 카운터(매 clk 비교)는 독립.
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
                보드 핀 제약 — <strong>clk(100MHz) · rst·btn_p(버튼) · rgb(RGB, 50% 상한)</strong> · PWM 1kHz
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
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>Arty A7-35T Master 발췌 · clk · rst · btn_p · rgb (RGB 50% 상한)</span>
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
