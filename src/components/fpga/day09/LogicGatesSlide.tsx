'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';
import ToolImage from '../ToolImage';
import SlideModal from '../SlideModal';
import RevealLock from '../RevealLock';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '8123';

const DAY09 = '#2E8B57';   // 단색 녹색 LED (입력 통과)
const ORANGE = '#E8913A';  // XDC 액센트

const MONO = '"JetBrains Mono", monospace';

// 게이트별 색 = 해당 RGB LED가 켜질 때 보이는 합성색
const MAGENTA = '#E03AD0'; // AND → R+B
const CYAN = '#22C7D6';    // OR  → G+B
const YELLOW = '#F2C81E';  // XOR → R+G

// ── 코드: 항상 보이는 포트 선언부 ──
const portsCode = `module logic_gates (
  input  wire [1:0] sw,    // 슬라이드 스위치 SW0, SW1
  output wire [1:0] led,   // 단색 녹색 LED — 입력 그대로 통과
  output wire [2:0] rgb0,  // RGB LED ch0 = AND  → R+B
  output wire [2:0] rgb1,  // RGB LED ch1 = OR   → G+B
  output wire [2:0] rgb2   // RGB LED ch2 = XOR  → R+G
);`;

// 클릭 전: 구현부 숨김 (줄 수를 bodyShown과 맞춰 창 높이 유지)
const bodyHidden = `  // ⋯ 구현부 숨김 — [구현 보기 ▸] 클릭




endmodule`;

// 클릭 후: 구현부 공개
const bodyShown = `  assign led  = sw;                            // 통과: 스위치 → 단색 LED
  // rgb = {R, G, B}  ·  결과 1일 때만 두 채널 점등
  assign rgb0 = (sw[0] & sw[1]) ? 3'b101 : 3'b000;  // AND → R+B (자홍)
  assign rgb1 = (sw[0] | sw[1]) ? 3'b011 : 3'b000;  // OR  → G+B (청록)
  assign rgb2 = (sw[0] ^ sw[1]) ? 3'b110 : 3'b000;  // XOR → R+G (노랑)
endmodule`;

// ── 테스트벤치 ──
const tbCode = `module logic_gates_tb;
  reg  [1:0] sw;
  wire [1:0] led;
  wire [2:0] rgb0, rgb1, rgb2;

  logic_gates dut (.sw(sw), .led(led),
    .rgb0(rgb0), .rgb1(rgb1), .rgb2(rgb2));

  integer i;
  initial begin
    for (i = 0; i < 4; i = i + 1) begin
      sw = i[1:0];  #10;          // 00→01→10→11
      $display("sw=%b | led=%b rgb0=%b rgb1=%b rgb2=%b",
               sw, led, rgb0, rgb1, rgb2);
    end
    $finish;
  end
endmodule`;

// ── XDC (모달) — sw · 단색 LED · RGB LED 핀 전체 ──
const xdcCode = `## ==================================================================
## Arty A7-35T — Master XDC 발췌 (sw · 단색 LED · RGB LED 전부)
## 이 설계에서 쓰는 포트만 남기고 나머지는 주석 처리해 계속 재사용.
##   sw[1:0]   → SW0,SW1          led[1:0] → LD4,LD5 (녹색)
##   rgb0=AND  → LD0 (R+B)   rgb1=OR → LD1 (G+B)   rgb2=XOR → LD2 (R+G)
## rgb*[2:0] = {R, G, B}  (rgb*[2]=R, rgb*[1]=G, rgb*[0]=B)
## ==================================================================

## ── 슬라이드 스위치 SW0~SW3 ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports { sw[0] }];
set_property -dict { PACKAGE_PIN C11 IOSTANDARD LVCMOS33 } [get_ports { sw[1] }];
# set_property -dict { PACKAGE_PIN C10 IOSTANDARD LVCMOS33 } [get_ports { sw[2] }];
# set_property -dict { PACKAGE_PIN A10 IOSTANDARD LVCMOS33 } [get_ports { sw[3] }];

## ── 단색 User LED LD4~LD7 (녹색) ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { led[0] }];
set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports { led[1] }];
# set_property -dict { PACKAGE_PIN T9  IOSTANDARD LVCMOS33 } [get_ports { led[2] }];
# set_property -dict { PACKAGE_PIN T10 IOSTANDARD LVCMOS33 } [get_ports { led[3] }];

## ── RGB LED LD0 → rgb0 (AND, R+B) ──
set_property -dict { PACKAGE_PIN G6  IOSTANDARD LVCMOS33 } [get_ports { rgb0[2] }];  ;# LD0_R
set_property -dict { PACKAGE_PIN F6  IOSTANDARD LVCMOS33 } [get_ports { rgb0[1] }];  ;# LD0_G
set_property -dict { PACKAGE_PIN E1  IOSTANDARD LVCMOS33 } [get_ports { rgb0[0] }];  ;# LD0_B

## ── RGB LED LD1 → rgb1 (OR, G+B) ──
set_property -dict { PACKAGE_PIN G3  IOSTANDARD LVCMOS33 } [get_ports { rgb1[2] }];  ;# LD1_R
set_property -dict { PACKAGE_PIN J4  IOSTANDARD LVCMOS33 } [get_ports { rgb1[1] }];  ;# LD1_G
set_property -dict { PACKAGE_PIN G4  IOSTANDARD LVCMOS33 } [get_ports { rgb1[0] }];  ;# LD1_B

## ── RGB LED LD2 → rgb2 (XOR, R+G) ──
set_property -dict { PACKAGE_PIN J3  IOSTANDARD LVCMOS33 } [get_ports { rgb2[2] }];  ;# LD2_R
set_property -dict { PACKAGE_PIN J2  IOSTANDARD LVCMOS33 } [get_ports { rgb2[1] }];  ;# LD2_G
set_property -dict { PACKAGE_PIN H4  IOSTANDARD LVCMOS33 } [get_ports { rgb2[0] }];  ;# LD2_B

## ── RGB LED LD3 (미사용 — 필요 시 활성화) ──
# set_property -dict { PACKAGE_PIN K1 IOSTANDARD LVCMOS33 } [get_ports { rgb3[2] }];  ;# LD3_R
# set_property -dict { PACKAGE_PIN H6 IOSTANDARD LVCMOS33 } [get_ports { rgb3[1] }];  ;# LD3_G
# set_property -dict { PACKAGE_PIN K2 IOSTANDARD LVCMOS33 } [get_ports { rgb3[0] }];  ;# LD3_B`;

/** 실물형 슬라이드 스위치 — 클릭으로 토글 */
function SlideSwitch({ cx, cy, on, onToggle, idx }: { cx: number; cy: number; on: boolean; onToggle: () => void; idx: number }) {
  const knobX = on ? cx + 3 : cx - 15;
  return (
    <g onClick={onToggle} style={{ cursor: 'pointer' }}>
      <text x={cx} y={cy - 13} fontSize="6.5" fontWeight="700" fill="#64748B" textAnchor="middle" fontFamily={MONO}>SW{idx}</text>
      <rect x={cx - 20} y={cy - 10} width="40" height="20" rx="4" fill="#245A9E" stroke="#143468" strokeWidth="1" />
      <rect x={cx - 20} y={cy - 10} width="40" height="8" rx="4" fill="rgba(255,255,255,0.16)" />
      <rect x={cx - 16} y={cy - 5} width="32" height="10" rx="5" fill="#0E2547" />
      <rect x={knobX} y={cy - 7} width="12" height="14" rx="2.5" fill="#EDF2F7" stroke="#94A3B8" strokeWidth="0.8" />
      <rect x={knobX + 2.5} y={cy - 5} width="7" height="3" rx="1.5" fill="rgba(255,255,255,0.85)" />
      <text x={on ? cx - 9 : cx + 9} y={cy + 3} fontSize="7" fontWeight="800" fill="#DBE7F5" textAnchor="middle" fontFamily={MONO}>{on ? '1' : '0'}</text>
    </g>
  );
}

/** AND 게이트 (D자형) */
function AndGate({ cx, cy, active, color }: { cx: number; cy: number; active: boolean; color: string }) {
  const fill = active ? color : '#2C3647';
  const stroke = active ? '#FFFFFF' : '#5C6A82';
  return (
    <g>
      {active && <ellipse cx={cx} cy={cy} rx="17" ry="14" fill={color} opacity="0.22" />}
      <path d={`M${cx - 14} ${cy - 11} L${cx} ${cy - 11} A11 11 0 0 1 ${cx} ${cy + 11} L${cx - 14} ${cy + 11} Z`}
        fill={fill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <text x={cx - 4} y={cy + 3} fontSize="8" fontWeight="800" fill={active ? '#fff' : '#8C99B0'} textAnchor="middle" fontFamily={MONO}>&amp;</text>
    </g>
  );
}

/** OR 게이트 */
function OrGate({ cx, cy, active, color }: { cx: number; cy: number; active: boolean; color: string }) {
  const fill = active ? color : '#2C3647';
  const stroke = active ? '#FFFFFF' : '#5C6A82';
  return (
    <g>
      {active && <ellipse cx={cx} cy={cy} rx="17" ry="14" fill={color} opacity="0.22" />}
      <path d={`M${cx - 14} ${cy - 11} Q${cx - 4} ${cy} ${cx - 14} ${cy + 11} Q${cx + 4} ${cy + 10} ${cx + 13} ${cy} Q${cx + 4} ${cy - 10} ${cx - 14} ${cy - 11} Z`}
        fill={fill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <text x={cx - 2} y={cy + 3} fontSize="6.5" fontWeight="800" fill={active ? '#fff' : '#8C99B0'} textAnchor="middle" fontFamily={MONO}>≥1</text>
    </g>
  );
}

/** XOR 게이트 (OR + 입력측 보조 곡선) */
function XorGate({ cx, cy, active, color }: { cx: number; cy: number; active: boolean; color: string }) {
  const fill = active ? color : '#2C3647';
  const stroke = active ? '#FFFFFF' : '#5C6A82';
  return (
    <g>
      {active && <ellipse cx={cx} cy={cy} rx="17" ry="14" fill={color} opacity="0.22" />}
      <path d={`M${cx - 18} ${cy - 11} Q${cx - 8} ${cy} ${cx - 18} ${cy + 11}`} fill="none" stroke={stroke} strokeWidth="1.4" />
      <path d={`M${cx - 14} ${cy - 11} Q${cx - 4} ${cy} ${cx - 14} ${cy + 11} Q${cx + 4} ${cy + 10} ${cx + 13} ${cy} Q${cx + 4} ${cy - 10} ${cx - 14} ${cy - 11} Z`}
        fill={fill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <text x={cx - 2} y={cy + 3} fontSize="6.5" fontWeight="800" fill={active ? '#fff' : '#8C99B0'} textAnchor="middle" fontFamily={MONO}>=1</text>
    </g>
  );
}

/** 단색 SMD 칩 LED (녹색) */
function MonoLed({ cx, cy, on }: { cx: number; cy: number; on: boolean }) {
  const lit = '#33CC6E';
  const off = '#27402F';
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

/** RGB SMD LED — on일 때 color(합성색) 점등 */
function RgbLed({ cx, cy, on, color }: { cx: number; cy: number; on: boolean; color: string }) {
  const off = '#1E2740';
  return (
    <g>
      {on && <ellipse cx={cx} cy={cy} rx="15" ry="12" fill={color} opacity="0.34" />}
      {on && <ellipse cx={cx} cy={cy} rx="9" ry="6" fill={color} opacity="0.42" />}
      {[-4.5, 0, 4.5].map((dy, k) => (
        <g key={k}>
          <rect x={cx - 12.5} y={cy + dy - 1.4} width="3.5" height="2.8" rx="0.6" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.4" />
          <rect x={cx + 9} y={cy + dy - 1.4} width="3.5" height="2.8" rx="0.6" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.4" />
        </g>
      ))}
      <rect x={cx - 9.5} y={cy - 7} width="19" height="14" rx="2" fill={on ? '#F6F8FB' : '#E6EAF1'} stroke="#C2C9D2" strokeWidth="0.8" />
      <rect x={cx - 6.5} y={cy - 4} width="13" height="8" rx="1.6" fill={on ? color : off} stroke={on ? color : '#34425F'} strokeWidth="0.7" />
      <rect x={cx - 6.5} y={cy - 4} width="13" height="2.8" rx="1.3" fill="#FFFFFF" opacity={on ? 0.5 : 0.08} />
    </g>
  );
}

export default function LogicGatesSlide() {
  const [sw, setSw] = useState(0b10);   // sw[1]=1, sw[0]=0
  const [revealed, setRevealed] = useState(false);
  const [xdcOpen, setXdcOpen] = useState(false);

  const toggle = (i: number) => setSw((v) => v ^ (1 << i));
  const bit = (i: number) => (sw >> i) & 1;
  const s0 = bit(0) === 1;
  const s1 = bit(1) === 1;
  const aAnd = s0 && s1;
  const aOr = s0 || s1;
  const aXor = s0 !== s1;

  // 배선 색: HIGH=구동색 / LOW=흐린 슬레이트
  const DIM = '#535C6B';
  const w0 = s0 ? '#33CC6E' : DIM;
  const w1 = s1 ? '#33CC6E' : DIM;

  // 출력 행 정의
  const gates = [
    { cy: 150, gate: 'AND', Comp: AndGate, color: MAGENTA, active: aAnd, port: 'rgb0', chan: 'R+B', val: aAnd ? '101' : '000' },
    { cy: 200, gate: 'OR', Comp: OrGate, color: CYAN, active: aOr, port: 'rgb1', chan: 'G+B', val: aOr ? '011' : '000' },
    { cy: 250, gate: 'XOR', Comp: XorGate, color: YELLOW, active: aXor, port: 'rgb2', chan: 'R+G', val: aXor ? '110' : '000' },
  ];

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 2 · 오전 ② · 논리 게이트"
          title="AND · OR · XOR → RGB LED 색으로 보기"
          subtitle="스위치는 단색 녹색 LED로 통과, 세 게이트 결과는 각 RGB LED의 두 채널 색으로 즉시 표시"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.12fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 인터랙티브 다이어그램 + 설계 코드(숨김) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.45rem 0.55rem 0.3rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.textLight, textAlign: 'center', marginBottom: '0.05rem' }}>
                스위치 <strong style={{ color: DAY09 }}>클릭</strong> → 단색 LED 통과 · 세 게이트가 <strong style={{ color: MAGENTA }}>RGB</strong> 색으로 발광
              </div>
              <svg viewBox="0 0 340 290" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* FPGA 칩 패키지 */}
                <rect x="95" y="24" width="140" height="252" rx="10" fill="#232C3D" stroke="#3D4A63" strokeWidth="1.2" />
                {[0, 1, 2, 3, 4, 5, 6].map((k) => (
                  <g key={`pin${k}`}>
                    <rect x={108 + k * 18} y="21" width="6" height="4" rx="1" fill="#C9A227" />
                    <rect x={108 + k * 18} y="275" width="6" height="4" rx="1" fill="#C9A227" />
                  </g>
                ))}
                <circle cx="107" cy="38" r="2.5" fill="#4A6FA5" />
                <text x="165" y="41" fontSize="9.5" fontWeight="700" fill="#9FB3C8" textAnchor="middle" letterSpacing="0.08em" fontFamily={MONO}>FPGA</text>

                {/* 내부 입력 레일 (sw[0], sw[1]) */}
                <path d={`M110 44 V245`} stroke={w0} strokeWidth="1.6" />
                <path d={`M122 88 V255`} stroke={w1} strokeWidth="1.6" />

                {/* 스위치 → 칩 입력 */}
                <path d={`M46 80 H95`} stroke={w0} strokeWidth="1.6" />
                <path d={`M46 140 H95`} stroke={w1} strokeWidth="1.6" />
                <path d={`M95 80 H110`} stroke={w0} strokeWidth="1.6" />
                <path d={`M95 140 H122`} stroke={w1} strokeWidth="1.6" />
                <text x="70" y="75" fontSize="6.5" fill="#94A3B8" textAnchor="middle" fontFamily={MONO}>sw[0]</text>
                <text x="70" y="135" fontSize="6.5" fill="#94A3B8" textAnchor="middle" fontFamily={MONO}>sw[1]</text>
                <rect x="92" y="77.5" width="6" height="5" rx="1" fill="#C9A227" />
                <rect x="92" y="137.5" width="6" height="5" rx="1" fill="#C9A227" />
                <circle cx="110" cy="80" r="2.2" fill={w0} />
                <circle cx="122" cy="140" r="2.2" fill={w1} />

                {/* 단색 LED 통과 경로 (led[0]=sw[0], led[1]=sw[1]) */}
                <path d={`M110 44 H235`} stroke={w0} strokeWidth="1.6" />
                <path d={`M122 88 H235`} stroke={w1} strokeWidth="1.6" />
                <circle cx="110" cy="44" r="2.2" fill={w0} />
                <circle cx="122" cy="88" r="2.2" fill={w1} />
                {[{ y: 44, on: s0, p: 'led[0]' }, { y: 88, on: s1, p: 'led[1]' }].map((m) => (
                  <g key={m.p}>
                    <rect x="235" y={m.y - 2.5} width="8" height="5" rx="1" fill="#C9A227" />
                    <text x="246" y={m.y - 4} fontSize="6.5" fontWeight="700" fill={DAY09} fontFamily={MONO}>{m.p}</text>
                    <path d={`M243 ${m.y} H300`} stroke={m.on ? '#33CC6E' : DIM} strokeWidth="1.6" />
                    <MonoLed cx={310} cy={m.y} on={m.on} />
                  </g>
                ))}

                {/* 게이트 3종 (AND / OR / XOR) */}
                {gates.map((g) => {
                  const ow = g.active ? g.color : DIM;
                  const Comp = g.Comp;
                  return (
                    <g key={g.gate}>
                      {/* 레일 → 게이트 입력 */}
                      <path d={`M110 ${g.cy - 5} H${165 - 14}`} stroke={w0} strokeWidth="1.6" />
                      <path d={`M122 ${g.cy + 5} H${165 - 14}`} stroke={w1} strokeWidth="1.6" />
                      <circle cx="110" cy={g.cy - 5} r="2" fill={w0} />
                      <circle cx="122" cy={g.cy + 5} r="2" fill={w1} />
                      {/* 게이트 라벨 */}
                      <text x="165" y={g.cy - 16} fontSize="6.5" fontWeight="800" fill={g.active ? g.color : '#8C99B0'} textAnchor="middle" fontFamily={MONO}>{g.gate}</text>
                      <Comp cx={165} cy={g.cy} active={g.active} color={g.color} />
                      {/* 게이트 출력 → 칩 핀 → RGB LED */}
                      <path d={`M178 ${g.cy} H235`} stroke={ow} strokeWidth="1.6" />
                      <rect x="235" y={g.cy - 2.5} width="8" height="5" rx="1" fill="#C9A227" />
                      <text x="246" y={g.cy - 4} fontSize="6.5" fontWeight="700" fill={g.color} fontFamily={MONO}>{g.port}</text>
                      <text x="246" y={g.cy + 12} fontSize="5.5" fill="#94A3B8" fontFamily={MONO}>{g.chan}</text>
                      <path d={`M243 ${g.cy} H300`} stroke={ow} strokeWidth="1.6" />
                      <RgbLed cx={310} cy={g.cy} on={g.active} color={g.color} />
                    </g>
                  );
                })}

                {/* 클릭 스위치 (최상단 렌더) */}
                <SlideSwitch cx={26} cy={80} on={s0} onToggle={() => toggle(0)} idx={0} />
                <SlideSwitch cx={26} cy={140} on={s1} onToggle={() => toggle(1)} idx={1} />
              </svg>

              {/* 실시간 값 */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', fontSize: '0.6rem', fontFamily: MONO, fontWeight: 700, flexWrap: 'wrap' }}>
                <span style={{ color: '#4A6FA5' }}>sw={s1 ? 1 : 0}{s0 ? 1 : 0}</span>
                <span style={{ color: DAY09 }}>led={s1 ? 1 : 0}{s0 ? 1 : 0}</span>
                <span style={{ color: MAGENTA }}>AND={aAnd ? 1 : 0}</span>
                <span style={{ color: CYAN }}>OR={aOr ? 1 : 0}</span>
                <span style={{ color: YELLOW }}>XOR={aXor ? 1 : 0}</span>
              </div>
            </div>

            {/* 설계 코드 (구현부 숨김 토글) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY09}`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem',
                userSelect: 'none', WebkitUserSelect: 'none',
              }}>
                <span style={{ fontSize: '0.6rem', color: DAY09, fontWeight: 800, letterSpacing: '0.05em' }}>
                  logic_gates.v — 설계
                </span>
                <RevealLock
                  revealed={revealed}
                  onReveal={() => setRevealed(true)}
                  onHide={() => setRevealed(false)}
                  password={REVEAL_PW}
                  accent={DAY09}
                />
              </div>
              <VerilogCode code={`${portsCode}\n${revealed ? bodyShown : bodyHidden}`} style={{ fontSize: '0.6rem', lineHeight: 1.45 }} />
            </div>
          </div>

          {/* ── 우: 테스트벤치 + 파형 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY09}`,
            }}>
              <div style={{ fontSize: '0.6rem', color: DAY09, fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                logic_gates_tb.v — 4조합 스윕 + $display
              </div>
              <VerilogCode code={tbCode} style={{ fontSize: '0.59rem', lineHeight: 1.42 }} />
            </div>

            {/* 파형 캡쳐 */}
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white,
              border: `1px solid ${DAY09}25`,
              borderTop: `3px solid ${DAY09}`,
              borderRadius: '10px',
              padding: '0.5rem 0.7rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                Visualizer 파형 — sw 4조합 스윕 시 rgb0/1/2
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ToolImage src="/images/fpga/day09_logic_gates_wave.png" name="logic_gates 시뮬 파형" width="100%" height="100%" />
              </div>
              <div style={{ fontSize: '0.58rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.3rem' }}>
                day09_logic_gates_wave.png — 각 조합의 rgb*를 진리표와 대조 (클릭 시 확대)
              </div>
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
                보드 핀 제약 — <strong>슬라이드 스위치 · 단색 LED · RGB LED</strong> 전체 표시 (필요 없는 핀은 주석 처리해 재사용)
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '0.62rem', fontWeight: 800, color: ORANGE, flexShrink: 0 }}>📄 ▸</span>
            </button>
          </div>
        </div>
      </div>

      {/* XDC 모달 */}
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
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>Arty A7-35T Master 발췌 · sw · 단색 LED · RGB LED</span>
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
          padding: '0.7rem 1.1rem 1rem',
          background: '#16203A',
          fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
          fontSize: '0.74rem', lineHeight: 1.55, color: '#C7D2E8',
          whiteSpace: 'pre',
        }}>
          {xdcCode}
        </pre>
      </SlideModal>
    </section>
  );
}
