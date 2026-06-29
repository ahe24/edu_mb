'use client';

import { useState, useEffect } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';
import RevealCodeModal from '../RevealCodeModal';
import VerilogCode from '../VerilogCode';

const DAY11 = '#3D8361';
const ORANGE = '#E8913A';
const BLUE = '#4A6FA5';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '4471';

const DMAX = 20;   // 데모 PWM 주기 (cnt 0..19, 보드는 100,000)

// ── 직접 구현 모듈: pwm_gen ──
const portsCode = `module pwm_gen #(
  parameter integer CLK_HZ = 100_000_000, // 메인 클럭 100MHz
  parameter integer PWM_HZ = 1000,         // PWM 주파수 200~1000 권장
  parameter integer STEP   = 5             // 버튼 1회당 밝기 ±5%
)(
  input  wire clk, rst,        // rst: 동기 active-high
  input  wire up_p, dn_p,      // +STEP% / -STEP% 1-clk 펄스 (top 엣지검출)
  output wire pwm              // PWM 비트 — duty 0~100% (상한 없음)
);
\`ifdef FUNC_SIM
  localparam integer PERIOD = 100;            // 시뮬: % 정확 (100의 배수)
\`else
  localparam integer PERIOD = CLK_HZ/PWM_HZ;  // =100,000 (1kHz, 1ms)
\`endif
  localparam integer DW       = $clog2(PERIOD+1);
  localparam integer STEP_CNT = (PERIOD*STEP)/100; // ★상수접기: 5% = PERIOD/20 (보드 5000/sim 5)`;

const bodyShown = `  reg [DW-1:0] duty;                        // PWM 비교 임계값 (카운트 단위)
  always @(posedge clk)                     // 곱·나눗셈 없이 ±STEP_CNT 상수 누산
    if (rst)                duty <= 0;
    else if (up_p && !dn_p) duty <= (duty >= PERIOD-STEP_CNT) ? PERIOD : duty + STEP_CNT;
    else if (dn_p && !up_p) duty <= (duty <=         STEP_CNT) ? 0      : duty - STEP_CNT;

  reg [DW-1:0] cnt;
  always @(posedge clk)                      // PWM 주기 카운터
    if (rst || cnt==PERIOD-1) cnt <= 0; else cnt <= cnt + 1'b1;
  assign pwm = (cnt < duty);                 // duty 비율만큼 ON
endmodule`;

// ── 제공 모듈 3종 (모달에서 복사) ──
const topCode = `module pwm_top (                        // 보드 최상위 — 배선 + 엣지검출
  input  wire clk, rst,                 // rst: BTN0 (동기 active-high)
  input  wire btn_up, btn_dn,           // BTN1(+5%) / BTN2(-5%) raw 버튼
  output wire rgb_r, rgb_g, rgb_b,      // RGB LED LD0 (녹=밝기)
  output wire mono                      // 단색 User LED (동일 밝기)
);
  // ① 버튼 2개 디바운스(+2FF) — Day10 debounce 재사용
  wire up_lvl, dn_lvl;
  debounce u_db_up (.clk(clk), .rst(rst), .btn_in(btn_up), .btn_out(up_lvl));
  debounce u_db_dn (.clk(clk), .rst(rst), .btn_in(btn_dn), .btn_out(dn_lvl));
  // ② 상승엣지 검출 — 누른 순간만 1클럭 펄스
  reg up_d, dn_d;
  always @(posedge clk)
    if (rst) {up_d, dn_d} <= 2'b00;
    else     {up_d, dn_d} <= {up_lvl, dn_lvl};
  wire up_p = up_lvl & ~up_d;
  wire dn_p = dn_lvl & ~dn_d;
  // ③ PWM 생성기(직접 구현) → ④ LED 드라이버
  wire pwm;
  pwm_gen u_pwm (.clk(clk), .rst(rst), .up_p(up_p), .dn_p(dn_p), .pwm(pwm));
  led_driver u_led (.pwm(pwm), .rgb_r(rgb_r), .rgb_g(rgb_g),
                    .rgb_b(rgb_b), .mono(mono));
endmodule`;

const ledCode = `module led_driver (        // PWM 1비트를 보드 LED 핀에 분배 (I/O 추상화)
  input  wire pwm,         // 밝기 PWM (pwm_gen 출력)
  output wire rgb_r,       // RGB 적 — 미사용(0)
  output wire rgb_g,       // RGB 녹 — 밝기 표시
  output wire rgb_b,       // RGB 청 — 미사용(0)
  output wire mono         // 단색 User LED — 동일 밝기(풀레인지 확인)
);
  assign rgb_g = pwm;      // 녹색 채널에 PWM
  assign mono  = pwm;      // 단색 LED 에도 같은 PWM
  assign rgb_r = 1'b0;
  assign rgb_b = 1'b0;
endmodule`;

const debCode = `module debounce #(         // Day10 재사용 — 채터링 제거 + 2FF 동기화
  parameter integer STABLE = 1_000_000   // ~10ms @100MHz
)(
  input  wire clk, rst,
  input  wire btn_in,      // 노이즈 있는 raw 버튼 (비동기)
  output reg  btn_out      // 안정화된 버튼 레벨
);
  reg [19:0] cnt;
  reg        s0, s1;       // 2단 동기화 FF
  always @(posedge clk)    // ① 메타안정 방지 2FF
    if (rst) {s1, s0} <= 2'b00;
    else     {s1, s0} <= {s0, btn_in};
  always @(posedge clk) begin                     // ② 카운터 기반 안정화
    if (rst)                  begin cnt <= 0; btn_out <= 1'b0; end
    else if (s1 == btn_out)   cnt <= 0;           // 변화 없음 → 리셋
    else if (cnt == STABLE-1) begin btn_out <= s1; cnt <= 0; end
    else                      cnt <= cnt + 1'b1;
  end
endmodule`;

const PROVIDED = [
  { name: 'pwm_top.v', desc: '보드 top — 디바운스 2개 + 엣지검출 + 배선', code: topCode },
  { name: 'led_driver.v', desc: 'PWM → RGB 녹색 + 단색 LED 분배', code: ledCode },
  { name: 'debounce.v', desc: 'Day10 재사용 (사본 금지 · 원본 상대참조)', code: debCode },
];

const xdcCode = `## ==================================================================
## Day 11 pwm_rgb — arty.xdc (Arty A7-35T Master 발췌)
##   보드 top = pwm_top (clk 100MHz, PWM 1kHz)
##   clk → 100MHz   rst → BTN0   btn_up → BTN1(+5%)   btn_dn → BTN2(-5%)
##   RGB LED LD0 (녹=밝기, 적·청 off) + 단색 User LED LD4 (동일 밝기)
## ※ 밝기 0~100% ±5% — duty 상한 없음. RGB 100% 눈부심 시 단색 LED 로 확인.
## ※ PWM 200Hz~1kHz. 100MHz ÷ 100,000 = 1kHz(1ms).
## ※ btn_up/btn_dn 은 raw 버튼 — top 내부 debounce+엣지로 1펄스 생성.
## ※ 시뮬은 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → BTN0  /  btn_up → BTN1  /  btn_dn → BTN2 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];
set_property -dict { PACKAGE_PIN C9  IOSTANDARD LVCMOS33 } [get_ports { btn_up }];
set_property -dict { PACKAGE_PIN B9  IOSTANDARD LVCMOS33 } [get_ports { btn_dn }];

## ── RGB LED LD0 (녹=밝기, 적·청 off) ──
set_property -dict { PACKAGE_PIN F6  IOSTANDARD LVCMOS33 } [get_ports { rgb_g }];
set_property -dict { PACKAGE_PIN G6  IOSTANDARD LVCMOS33 } [get_ports { rgb_r }];
set_property -dict { PACKAGE_PIN E1  IOSTANDARD LVCMOS33 } [get_ports { rgb_b }];

## ── 단색 User LED LD4 (동일 밝기) ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { mono }];`;

export default function PwmModeSlide() {
  const [pct, setPct] = useState(0);
  const [cnt, setCnt] = useState(0);
  const [rst, setRst] = useState(false);
  const [running, setRunning] = useState(false);
  const [xdcOpen, setXdcOpen] = useState(false);
  const [provOpen, setProvOpen] = useState(false);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setCnt((c) => (rst ? 0 : (c + 1) % DMAX)), 240);
    return () => clearInterval(id);
  }, [running, rst]);

  const p = rst ? 0 : pct;
  const dutyDemo = Math.round((p / 100) * DMAX);  // 0..20
  const pwmOn = !rst && cnt < dutyDemo;
  const bright = p / 100;

  const inc = () => { if (!rst) setPct((v) => Math.min(100, v + 5)); };
  const dec = () => { if (!rst) setPct((v) => Math.max(0, v - 5)); };
  const stepClk = () => setCnt((c) => (rst ? 0 : (c + 1) % DMAX));

  const copy = (name: string, code: string) => {
    try { navigator.clipboard?.writeText(code); } catch {}
    setCopied(name);
    setTimeout(() => setCopied(''), 1200);
  };

  const barFillH = 150 * bright;

  // ── 타이밍도 좌표 (한 주기 cnt 0..DMAX-1) ──
  const TX0 = 150, TW = 186, TYH = 72, TYL = 116;
  const cellW = TW / DMAX;
  const xDuty = TX0 + dutyDemo * cellW;          // duty 경계 (cnt=dutyDemo)
  const xCnt = TX0 + (cnt + 0.5) * cellW;        // 현재 cnt 셀 중앙
  const wavePath =
    dutyDemo <= 0    ? `M${TX0} ${TYL} H${TX0 + TW}` :          // 0% → 항상 LOW
    dutyDemo >= DMAX ? `M${TX0} ${TYH} H${TX0 + TW}` :          // 100% → 항상 HIGH
    `M${TX0} ${TYH} H${xDuty} V${TYL} H${TX0 + TW}`;            // cnt<duty HIGH, 이후 LOW

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · RGB PWM"
          title="버튼 2개로 밝기 조절 — pwm_gen + 모듈 분해"
          subtitle="감소·증가 ±5% (0~100%, 상한 없음) · top·pwm_gen·debounce·led_driver · pwm_gen만 직접 구현"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.12fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 인터랙티브 데모 + 직접 구현 코드 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.45rem 0.55rem 0.3rem',
              boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.textLight, textAlign: 'center', marginBottom: '0.05rem' }}>
                <strong style={{ color: DAY11 }}>▲▼ 버튼</strong>이 duty를 ±5%(PERIOD/20) 누산 · <strong style={{ color: BLUE }}>clk</strong>마다 cnt가 <strong style={{ color: ORANGE }}>duty와 비교</strong>해 pwm ON/OFF
              </div>
              <svg viewBox="0 0 470 220" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* 밝기 세로 바 (0~100%) */}
                <text x="58" y="26" fontSize="8" fontWeight="800" fill={DAY11} textAnchor="middle" fontFamily={MONO}>밝기 pct</text>
                <rect x="44" y="35" width="28" height="150" rx="5" fill="#E6ECF4" />
                <rect x="44" y={185 - barFillH} width="28" height={barFillH} rx="5" fill={DAY11} />
                {[
                  { v: 100, y: 38 }, { v: 50, y: 112 }, { v: 0, y: 186 },
                ].map((t) => (
                  <text key={t.v} x="80" y={t.y} fontSize="6" fill={FPGA.textLight} fontFamily={MONO}>{t.v}</text>
                ))}
                <text x="58" y="205" fontSize="11" fontWeight="800" fill={p === 100 ? ORANGE : DAY11} textAnchor="middle" fontFamily={MONO}>{p}%</text>

                {/* ── PWM 타이밍도 (한 주기 cnt 0..DMAX-1) ── */}
                <text x={TX0} y="32" fontSize="7.5" fontWeight="800" fill={ORANGE} fontFamily={MONO}>PWM 타이밍도 — cnt &lt; duty 동안 pwm = 1</text>

                {/* ON/OFF 구간 음영 */}
                <rect x={TX0} y={TYH - 9} width={Math.max(0, xDuty - TX0)} height={TYL - TYH + 18} fill={`${DAY11}1F`} />
                <rect x={xDuty} y={TYH - 9} width={Math.max(0, TX0 + TW - xDuty)} height={TYL - TYH + 18} fill="#E7ECF3" />
                {dutyDemo > 1 && (
                  <text x={(TX0 + xDuty) / 2} y={TYH - 1} fontSize="5.6" fontWeight="700" fill={DAY11} textAnchor="middle" fontFamily={MONO}>ON (1)</text>
                )}
                {dutyDemo < DMAX - 1 && (
                  <text x={(xDuty + TX0 + TW) / 2} y={TYH - 1} fontSize="5.6" fontWeight="700" fill="#8593A8" textAnchor="middle" fontFamily={MONO}>OFF (0)</text>
                )}

                {/* 0/1 레벨 가이드 */}
                <line x1={TX0} y1={TYH} x2={TX0 + TW} y2={TYH} stroke={FPGA.border} strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1={TX0} y1={TYL} x2={TX0 + TW} y2={TYL} stroke={FPGA.border} strokeWidth="0.7" />
                <text x={TX0 - 5} y={TYH + 2.5} fontSize="6.5" fontWeight="800" fill={DAY11} textAnchor="end" fontFamily={MONO}>1</text>
                <text x={TX0 - 5} y={TYL + 2.5} fontSize="6.5" fontWeight="800" fill={FPGA.textLight} textAnchor="end" fontFamily={MONO}>0</text>

                {/* pwm 파형 */}
                <path d={wavePath} stroke={DAY11} strokeWidth="2.3" fill="none" strokeLinejoin="round" />

                {/* duty 경계선 */}
                <line x1={xDuty} y1={TYH - 14} x2={xDuty} y2={TYL + 12} stroke={ORANGE} strokeWidth="1.3" strokeDasharray="3 2" />
                <text x={xDuty} y={TYL + 22} fontSize="6.2" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>duty {dutyDemo}</text>

                {/* cnt 커서 */}
                <line x1={xCnt} y1={TYH - 14} x2={xCnt} y2={TYL + 12} stroke={BLUE} strokeWidth="1.4" />
                <path d={`M${xCnt - 3.2} ${TYH - 19} L${xCnt + 3.2} ${TYH - 19} L${xCnt} ${TYH - 13} z`} fill={BLUE} />
                <circle cx={xCnt} cy={pwmOn ? TYH : TYL} r="3.1" fill={BLUE} stroke="#fff" strokeWidth="1.1" />
                <text x={xCnt} y={TYH - 22} fontSize="6" fontWeight="800" fill={BLUE} textAnchor="middle" fontFamily={MONO}>cnt {cnt}</text>

                {/* x축 끝 라벨 */}
                <text x={TX0} y={TYL + 22} fontSize="5.6" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>0</text>
                <text x={TX0 + TW} y={TYL + 22} fontSize="5.6" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>{DMAX - 1}</text>

                {/* pwm 결과 readout */}
                <rect x={TX0} y={TYL + 30} width="34" height="13" rx="3" fill={pwmOn ? DAY11 : '#DDE6E2'} />
                <text x={TX0 + 17} y={TYL + 39.5} fontSize="7.6" fontWeight="800" fill={pwmOn ? '#fff' : '#7A8B85'} textAnchor="middle" fontFamily={MONO}>pwm {pwmOn ? 1 : 0}</text>
                <text x={TX0 + 40} y={TYL + 39.5} fontSize="6.2" fontWeight="700" fill={FPGA.text} fontFamily={MONO}>{pwmOn ? `cnt ${cnt} < duty ${dutyDemo} → ON` : `cnt ${cnt} ≥ duty ${dutyDemo} → OFF`}</text>

                {/* 주파수 메모 */}
                <text x={TX0} y={TYL + 54} fontSize="6" fill={FPGA.textLight} fontFamily={MONO}>PWM 1kHz(주기 100,000clk) · duty {p}% → 깜빡임 없이 연속 밝기</text>

                {/* LED 2개 — RGB 녹 + 단색 (같은 밝기) */}
                <text x="410" y="28" fontSize="7" fontWeight="800" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>RGB(녹) · 단색</text>
                <circle cx="410" cy="72" r="26" fill={DAY11} opacity={0.08 + 0.85 * bright} />
                <circle cx="410" cy="72" r="16" fill={DAY11} opacity={0.12 + 0.88 * bright} stroke={DAY11} strokeWidth="1.4" />
                <text x="410" y="104" fontSize="6" fill={DAY11} textAnchor="middle" fontWeight="700" fontFamily={MONO}>RGB 녹색</text>
                <circle cx="410" cy="150" r="22" fill={ORANGE} opacity={0.08 + 0.85 * bright} />
                <circle cx="410" cy="150" r="13" fill={ORANGE} opacity={0.12 + 0.88 * bright} stroke={ORANGE} strokeWidth="1.4" />
                <text x="410" y="178" fontSize="6" fill={ORANGE} textAnchor="middle" fontWeight="700" fontFamily={MONO}>단색 User LED</text>
              </svg>

              {/* 컨트롤 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button onClick={dec} style={btn(DAY11)}>▼ −5%</button>
                <button onClick={inc} style={btn(ORANGE)}>▲ +5%</button>
                <button onClick={() => setRunning((r) => !r)} style={btn(running ? '#E2574C' : DAY11)}>{running ? '⏸ 정지' : '▶ PWM'}</button>
                <button onClick={() => { setRunning(false); stepClk(); }} style={btnOutline(DAY11)}>⏭ clk+1</button>
                <button
                  onClick={() => setRst((v) => !v)}
                  style={{ ...btnOutline('#E2574C'), color: rst ? '#fff' : '#E2574C', background: rst ? '#E2574C' : 'transparent' }}
                >rst {rst ? 1 : 0}</button>
                <span style={{ fontSize: '0.62rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.2rem' }}>
                  밝기 <span style={{ color: p === 100 ? ORANGE : DAY11 }}>{p}%</span> · cnt {cnt}/{DMAX - 1}
                </span>
              </div>
            </div>

            {/* 직접 구현 코드 — pwm_gen (잠금) + 제공 코드 모달 버튼 */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY11}`,
            }}>
              <RevealCodeModal
                title="pwm_gen.v — ★ 직접 구현"
                accent={DAY11}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="duty ±STEP_CNT 상수 누산(곱·나눗셈 없음) + PWM 비교 · PWM 1kHz"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
              <button
                onClick={() => setProvOpen(true)}
                style={{
                  marginTop: '0.4rem', width: '100%', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.45rem',
                  fontSize: '0.58rem', fontWeight: 800, fontFamily: MONO,
                  color: '#C7D2E8', background: '#222C42',
                  border: '1px solid #3A4860', borderRadius: '6px', padding: '4px 9px',
                }}
              >
                <span style={{ color: ORANGE }}>📋 제공 코드</span>
                <span style={{ color: '#8FA0BC' }}>pwm_top · led_driver · debounce — 복사해서 사용</span>
                <span style={{ marginLeft: 'auto', color: ORANGE }}>▸</span>
              </button>
            </div>
          </div>

          {/* ── 우: 구성도 + PWM 파형 + 핵심 노트 + xdc ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            {/* 구성도 다이어그램 (첫 카드) */}
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY11}25`,
              borderTop: `3px solid ${DAY11}`, borderRadius: '10px',
              padding: '0.45rem 0.7rem 0.3rem', boxShadow: shadow.card,
              flex: 1.05, minHeight: 0, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark }}>구성도 — top · pwm_gen · debounce · led_driver</span>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, color: DAY11, fontFamily: MONO }}>★ 직접 구현 / 그 외 제공</span>
              </div>
              <svg viewBox="0 0 330 132" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* 입력 버튼 2개 */}
                <Blk x={2} y={14} w={50} h={26} c={BLUE} t1="BTN1" t2="▲ +5%" />
                <Blk x={2} y={92} w={50} h={26} c={BLUE} t1="BTN2" t2="▼ −5%" />
                {/* debounce + edge 2개 (제공) */}
                <Blk x={64} y={14} w={62} h={26} c={ORANGE} t1="debounce" t2="+ 엣지검출" />
                <Blk x={64} y={92} w={62} h={26} c={ORANGE} t1="debounce" t2="+ 엣지검출" />
                {/* pwm_gen (직접 구현, 강조) */}
                <g>
                  <rect x={142} y={40} width={66} height={52} rx="7" fill={`${DAY11}1A`} stroke={DAY11} strokeWidth="2.4" />
                  <text x={175} y={58} fontSize="9" fontWeight="800" fill={DAY11} textAnchor="middle" fontFamily={MONO}>★ pwm_gen</text>
                  <text x={175} y={70} fontSize="6.3" fill={FPGA.text} textAnchor="middle" fontFamily={MONO}>±5% 누산</text>
                  <text x={175} y={80} fontSize="6.3" fill={FPGA.text} textAnchor="middle" fontFamily={MONO}>+ PWM 비교</text>
                </g>
                {/* led_driver (제공) */}
                <Blk x={224} y={40} w={56} h={52} c={ORANGE} t1="led_driver" t2="RGB+단색" big />
                {/* LED */}
                <circle cx={310} cy={54} r={9} fill={DAY11} />
                <circle cx={310} cy={80} r={7} fill={ORANGE} />
                <text x={310} y={100} fontSize="5.6" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>LED</text>

                {/* 화살표 */}
                <defs>
                  <marker id="pa2" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
                    <path d="M0 0 L5.5 3 L0 6 z" fill="#8593A8" />
                  </marker>
                </defs>
                {[
                  'M52 27 H62',     // btn1→deb
                  'M52 105 H62',    // btn2→deb
                  'M126 27 H132 V44 H140',   // deb_up→pwm_gen (up_p)
                  'M126 105 H132 V88 H140',  // deb_dn→pwm_gen (dn_p)
                  'M208 66 H222',   // pwm_gen→led
                  'M280 60 H300',   // led→RGB
                  'M280 74 H302',   // led→mono
                ].map((d, i) => (
                  <path key={i} d={d} stroke="#8593A8" strokeWidth="1.4" fill="none" markerEnd="url(#pa2)" />
                ))}
                <text x={133} y={50} fontSize="5.4" fill={DAY11} fontFamily={MONO}>up_p</text>
                <text x={133} y={84} fontSize="5.4" fill={DAY11} fontFamily={MONO}>dn_p</text>
                <text x={215} y={62} fontSize="5.4" fill={ORANGE} fontFamily={MONO}>pwm</text>
              </svg>
            </div>

            {/* PWM duty 파형 (0~100%) */}
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY11}25`,
              borderRadius: '10px', padding: '0.4rem 0.7rem 0.2rem',
              boxShadow: shadow.card, flex: 0.95, minHeight: 0, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.1rem' }}>PWM duty 파형 (0~100%)</div>
              <svg width="100%" viewBox="0 0 320 96" style={{ flex: 1, minHeight: 0 }}>
                {[
                  { y: 14, lbl: '0%', duty: 0, c: '#94A3B8' },
                  { y: 34, lbl: '25%', duty: 0.25, c: DAY11 },
                  { y: 54, lbl: '50%', duty: 0.5, c: DAY11 },
                  { y: 74, lbl: '100%', duty: 1, c: ORANGE },
                ].map((r, k) => {
                  const x0 = 56, W = 250, period = 50;
                  let d = `M${x0} ${r.y}`;
                  for (let x = x0; x < x0 + W; x += period) {
                    const onW = period * r.duty;
                    d += ` L${x} ${r.y - 9} L${x + onW} ${r.y - 9} L${x + onW} ${r.y} L${x + period} ${r.y}`;
                  }
                  return (
                    <g key={k}>
                      <text x="4" y={r.y + 1} fontSize="6.6" fontWeight="700" fill={r.c} fontFamily={MONO}>{r.lbl}</text>
                      <line x1={x0} y1={r.y} x2={x0 + W} y2={r.y} stroke={FPGA.border} strokeWidth="0.7" />
                      {r.duty > 0 && <path d={d} stroke={r.c} strokeWidth="1.7" fill="none" />}
                    </g>
                  );
                })}
                <text x="180" y="92" fontSize="6.2" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>ON 비율(duty)↑ = 평균 전류↑ = 밝기↑ · 상한 없이 100%까지</text>
              </svg>
            </div>

            {/* 핵심 노트 */}
            <div style={{
              background: `linear-gradient(135deg, rgba(8,145,178,0.06), rgba(8,145,178,0.12))`,
              border: '1px solid rgba(8,145,178,0.28)', borderLeft: '4px solid #0891B2',
              borderRadius: '8px', padding: '0.42rem 0.7rem',
            }}>
              <ul style={{ margin: 0, paddingLeft: '0.9rem', fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.5 }}>
                <li><strong>duty 직접 ±STEP_CNT 누산</strong> — 곱셈·나눗셈 없이 상수 가감산만(0~100% 포화). RGB 100% 눈부심 시 단색 LED 확인.</li>
                <li><code>btn_up/dn</code>은 top 내부 <strong>디바운스+상승엣지 1펄스</strong>. <strong>pwm_gen만 구현</strong>, top·led_driver·debounce 제공.</li>
              </ul>
            </div>

            {/* arty.xdc 모달 버튼 */}
            <button
              onClick={() => setXdcOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: `linear-gradient(135deg, ${ORANGE}0F, ${ORANGE}1E)`,
                border: `1px solid ${ORANGE}45`, borderLeft: `4px solid ${ORANGE}`,
                borderRadius: '9px', padding: '0.42rem 0.7rem',
                boxShadow: shadow.card, cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              <span style={{
                fontSize: '0.6rem', fontWeight: 800, color: '#fff', background: ORANGE,
                padding: '2px 8px', borderRadius: '5px', fontFamily: MONO, flexShrink: 0,
              }}>arty.xdc</span>
              <span style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.4 }}>
                보드 핀 — <strong>clk · rst·btn_up·btn_dn(버튼3) · RGB+단색 LED</strong>
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '0.62rem', fontWeight: 800, color: ORANGE, flexShrink: 0 }}>📄 ▸</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 제공 코드 모달 ── */}
      <SlideModal
        open={provOpen}
        onClose={() => setProvOpen(false)}
        contentStyle={{
          width: 'min(900px, 94vw)', maxHeight: '90vh',
          background: '#0F1626', borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)', border: '1px solid #2C3850',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderBottom: '1px solid #2C3850', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: ORANGE, fontFamily: MONO }}>📋 제공 코드 (복사해서 사용)</span>
          <span style={{ fontSize: '0.63rem', color: '#7C90B0' }}>pwm_gen 만 직접 구현 · 나머지는 그대로 사용</span>
          <button
            onClick={() => setProvOpen(false)}
            style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #3A4860', color: '#9FB0CC', borderRadius: '6px', padding: '2px 10px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700 }}
          >✕ 닫기 (Esc)</button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0.8rem 1rem 1rem', background: '#16203A', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {PROVIDED.map((f) => (
            <div key={f.name} style={{ background: '#0F1626', border: '1px solid #2C3850', borderRadius: '9px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.7rem', borderBottom: '1px solid #2C3850' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: ORANGE, fontFamily: MONO }}>{f.name}</span>
                <span style={{ fontSize: '0.6rem', color: '#7C90B0' }}>{f.desc}</span>
                <button
                  onClick={() => copy(f.name, f.code)}
                  style={{
                    marginLeft: 'auto', cursor: 'pointer',
                    fontSize: '0.62rem', fontWeight: 800, fontFamily: MONO,
                    color: copied === f.name ? '#0F1626' : ORANGE,
                    background: copied === f.name ? '#5BC98A' : 'transparent',
                    border: `1px solid ${copied === f.name ? '#5BC98A' : '#3A4860'}`,
                    borderRadius: '5px', padding: '2px 10px',
                  }}
                >{copied === f.name ? '✓ 복사됨' : '복사'}</button>
              </div>
              <div style={{ padding: '0.5rem 0.8rem' }}>
                <VerilogCode code={f.code} style={{ fontSize: '0.72rem', lineHeight: 1.5 }} />
              </div>
            </div>
          ))}
        </div>
      </SlideModal>

      {/* ── arty.xdc 모달 ── */}
      <SlideModal
        open={xdcOpen}
        onClose={() => setXdcOpen(false)}
        contentStyle={{
          width: 'min(860px, 92vw)', maxHeight: '88vh',
          background: '#0F1626', borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)', border: '1px solid #2C3850',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderBottom: '1px solid #2C3850', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: ORANGE, fontFamily: MONO }}>arty.xdc</span>
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>Arty A7-35T 발췌 · top=pwm_top · clk·rst·btn_up·btn_dn·RGB·단색</span>
          <button
            onClick={() => setXdcOpen(false)}
            style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #3A4860', color: '#9FB0CC', borderRadius: '6px', padding: '2px 10px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700 }}
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

// ── 작은 헬퍼 ──
function btn(bg: string) {
  return {
    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
    color: '#fff', background: bg, border: 'none', borderRadius: '5px', padding: '3px 10px',
  } as const;
}
function btnOutline(c: string) {
  return {
    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
    color: c, background: 'transparent', border: `1px solid ${c}`, borderRadius: '5px', padding: '3px 9px',
  } as const;
}

// 구성도 블록
function Blk({ x, y, w, h, c, t1, t2, big }: {
  x: number; y: number; w: number; h: number; c: string; t1: string; t2: string; big?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={`${c}12`} stroke={c} strokeWidth="1.4" />
      <text x={x + w / 2} y={y + (big ? h / 2 - 2 : h / 2 - 1)} fontSize={big ? 8 : 7.2} fontWeight="800" fill={c} textAnchor="middle" fontFamily={MONO}>{t1}</text>
      <text x={x + w / 2} y={y + (big ? h / 2 + 9 : h / 2 + 8)} fontSize="6" fill={FPGA.text} textAnchor="middle" fontFamily={MONO}>{t2}</text>
    </g>
  );
}
