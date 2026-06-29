'use client';

import { useState, useEffect } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import ProvidedFileModal from '../ProvidedFileModal';
import RevealCodeModal from '../RevealCodeModal';

const DAY11 = '#3D8361';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '5130';

// 화면 데모용 축약 틱값 (실제 30/25/5 tick) — en 1펄스 = 1틱, 보드는 tick_gen 1Hz
const T = [3, 2, 1];                 // [RED, GRN, YEL] (데모 표시값)
const NAME = ['RED', 'GRN', 'YEL'];
const NEXT = [1, 2, 0];              // RED→GRN→YEL→RED
const LIGHT = [0b100, 0b001, 0b010]; // [2]=R [1]=Y [0]=G

// 항상 보이는 포트 + 상태/타이머 상수 (en 클럭 인에이블 · 틱 단위 타이머)
const portsCode = `module traffic_light (
  input  wire       clk,
  input  wire       rst,        // 동기 active-high
  input  wire       en,         // 클럭 인에이블 — 이 클럭에서만 1틱 전진
  output reg  [2:0] rgb_led_r,  // RGB LED R채널 [i]=LDi (LD0/LD1/LD2)
  output reg  [2:0] rgb_led_g,  // RGB LED G채널
  output reg  [2:0] rgb_led_b,  // RGB LED B채널 — 신호등 미사용(항상 0)
  output reg  [2:0] mono_led    // 상태 one-hot 디버그 [2]=R [1]=Y [0]=G → LD4~6
);
  localparam RED=2'd0, GRN=2'd1, YEL=2'd2;
  localparam [7:0] T_RED=30, T_GRN=25, T_YEL=5;  // 틱 단위 (보드 1Hz→30s/25s/5s)`;

const bodyShown = `  reg [1:0] state, next;  reg [7:0] tmr;
  wire done = (state==RED&&tmr==T_RED-1)
            ||(state==GRN&&tmr==T_GRN-1)||(state==YEL&&tmr==T_YEL-1);
  always @(posedge clk)                  // ① 상태 reg + 타이머 (en 게이트)
    if (rst)      begin state<=RED; tmr<=0; end
    else if (en) begin                   // en=1 인 틱에서만 전진, en=0 이면 유지
      if (done)   begin state<=next; tmr<=0; end
      else        tmr <= tmr + 1'b1;
    end
  always @* case (state)                 // ② 다음 상태
    RED: next=GRN; GRN: next=YEL; YEL: next=RED; default: next=RED;
  endcase
  always @* case (state)                 // ③ 상태 one-hot → mono LED (디버그)
    RED: mono_led=3'b100; GRN: mono_led=3'b001;
    YEL: mono_led=3'b010; default: mono_led=3'b100;   // 안전: 적색
  endcase
  always @* begin                        // ④ 램프 → RGB LED 색 (YEL=R+G ★)
    rgb_led_r=3'b000; rgb_led_g=3'b000; rgb_led_b=3'b000;  // 파랑 미사용
    case (state)
      RED: rgb_led_r[0]=1'b1;                              // LD0: 빨강
      YEL: begin rgb_led_r[1]=1'b1; rgb_led_g[1]=1'b1; end // LD1: 빨강+초록=노랑
      GRN: rgb_led_g[2]=1'b1;                              // LD2: 초록
      default: rgb_led_r[0]=1'b1;                          // 안전: 적색
    endcase
  end
endmodule`;

const xdcCode = `## ==================================================================
## Day 11 traffic_light — arty.xdc (Arty A7-35T Master 발췌)
## 보드 top = top_traffic_light (clk 100MHz + tick_gen 1Hz 클럭 인에이블)
##   clk → 100MHz   rst → 푸시버튼 BTN0
##   램프 3개 = RGB LED 3개 (LD0=RED, LD1=YEL=R+G, LD2=GRN) — B 미사용
##   mono_led[2:0] → LD4/LD5/LD6 : 상태 one-hot 디버그
## ※ RGB LED 는 노랑 핀이 없음 → YEL(LD1)은 R+G 두 채널 동시 점등.
## ※ top 안의 tick_gen 이 100MHz→1Hz en → FSM 초당 한 칸(30/25/5 틱).
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 (동기 active-high) ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── 램프 = RGB LED (LD0=RED / LD1=YEL=R+G / LD2=GRN) ──
set_property -dict { PACKAGE_PIN G6  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_r[0] }];
set_property -dict { PACKAGE_PIN F6  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_g[0] }];
set_property -dict { PACKAGE_PIN E1  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_b[0] }];
set_property -dict { PACKAGE_PIN G3  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_r[1] }];
set_property -dict { PACKAGE_PIN J4  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_g[1] }];
set_property -dict { PACKAGE_PIN G4  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_b[1] }];
set_property -dict { PACKAGE_PIN J3  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_r[2] }];
set_property -dict { PACKAGE_PIN J2  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_g[2] }];
set_property -dict { PACKAGE_PIN H4  IOSTANDARD LVCMOS33 } [get_ports { rgb_led_b[2] }];

## ── mono LED 상태 디버그 (R=LD6 / Y=LD5 / G=LD4) ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { mono_led[0] }];
set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports { mono_led[1] }];
set_property -dict { PACKAGE_PIN T9  IOSTANDARD LVCMOS33 } [get_ports { mono_led[2] }];`;

// 우리가 미리 제공하는 테스트벤치 (학생은 traffic_light.v 설계만 작성)
// 원본: ref_lab/day11/traffic_light/testbench/tb_traffic_light.sv
const tbCode = `// =============================================================================
// Day 11 — tb_traffic_light.sv  (제공 — 그대로 복사해 사용)
// DUT 는 en 클럭 인에이블 FSM — TB 가 EN_DIV 클럭마다 en 1펄스를 줘서 1틱씩 전진.
//   ※ 보드 1Hz tick_gen(DIV=1억)은 여기서 시뮬 안 함 — en 을 직접 빨리 줘서
//     분주 없이 수백 클럭이면 순환 관찰. FUNC_SIM 같은 타이머 축소 불필요.
// reference 모델과 매 클럭 RGB/mono LED 비교 — $error 0 건 = PASS.
//   검증: ① 순서·유지 틱 ② 상태 one-hot(mono) ③ RGB 색(YEL=R+G ★) ④ en 게이팅.
// =============================================================================
\`timescale 1ns/1ps

module tb_traffic_light;

  localparam RED=2'd0, GRN=2'd1, YEL=2'd2;
  localparam [7:0] T_RED=30, T_GRN=25, T_YEL=5;   // DUT 와 동일 (틱 단위, 실제 값)
  localparam integer EN_DIV = 4;                  // en 펄스 주기(클럭) — 게이팅 검증용

  reg        clk = 1'b0, rst;
  wire [2:0] rgb_led_r, rgb_led_g, rgb_led_b, mono_led;
  integer    errors = 0;

  // en 펄스 생성 — EN_DIV 클럭마다 1클럭 폭 HIGH (보드 tick_gen 의 tick 역할)
  reg [7:0] encnt = 0;
  always @(posedge clk)
    if (rst)                  encnt <= 0;
    else if (encnt==EN_DIV-1) encnt <= 0;
    else                      encnt <= encnt + 1'b1;
  wire en = (~rst) & (encnt==EN_DIV-1);

  // golden 모델 — DUT 와 동일 규칙 (상태+타이머), 같은 en 으로 게이트
  reg  [1:0] mstate; reg [7:0] mtmr;
  reg  [1:0] mnext;
  reg  [2:0] m_r, m_g, m_b, m_mono;
  wire mdone = (mstate==RED && mtmr==T_RED-1) ||
               (mstate==GRN && mtmr==T_GRN-1) ||
               (mstate==YEL && mtmr==T_YEL-1);

  traffic_light dut (.clk(clk), .rst(rst), .en(en),
    .rgb_led_r(rgb_led_r), .rgb_led_g(rgb_led_g), .rgb_led_b(rgb_led_b),
    .mono_led(mono_led));

  always #5 clk = ~clk;               // 100MHz

  always @(posedge clk)
    if (rst)         begin mstate<=RED; mtmr<=0; end
    else if (en) begin
      if (mdone)     begin mstate<=mnext; mtmr<=0; end
      else           mtmr <= mtmr + 1'b1;
    end

  always @* case (mstate)
    RED:     mnext = GRN;
    GRN:     mnext = YEL;
    YEL:     mnext = RED;
    default: mnext = RED;
  endcase

  always @* case (mstate)                // 기대 mono(one-hot 상태)
    RED:     m_mono = 3'b100;
    GRN:     m_mono = 3'b001;
    YEL:     m_mono = 3'b010;
    default: m_mono = 3'b100;
  endcase

  always @* begin                        // 기대 RGB 색 (YEL = R+G)
    m_r=3'b000; m_g=3'b000; m_b=3'b000;
    case (mstate)
      RED: m_r[0]=1'b1;                          // LD0 빨강
      YEL: begin m_r[1]=1'b1; m_g[1]=1'b1; end   // LD1 빨강+초록 = 노랑
      GRN: m_g[2]=1'b1;                          // LD2 초록
      default: m_r[0]=1'b1;
    endcase
  end

  // one-hot 검사 — 상태 표시는 항상 정확히 한 비트만 HIGH
  function automatic is_onehot(input [2:0] v);
    is_onehot = (v==3'b100) || (v==3'b010) || (v==3'b001);
  endfunction

  // 자동 판정 — 매 클럭 RGB/mono 일치(!==) + 상태 one-hot
  always @(posedge clk)
    if (!rst) begin
      if ({rgb_led_r,rgb_led_g,rgb_led_b,mono_led} !== {m_r,m_g,m_b,m_mono}) begin
        errors = errors + 1;
        $error("MISMATCH t=%0t r=%b g=%b b=%b mono=%b exp r=%b g=%b b=%b mono=%b",
               $time, rgb_led_r,rgb_led_g,rgb_led_b,mono_led, m_r,m_g,m_b,m_mono);
      end
      if (!is_onehot(mono_led)) begin
        errors = errors + 1;
        $error("STATE NOT ONE-HOT t=%0t mono=%b", $time, mono_led);
      end
    end

  initial begin
    rst = 1; repeat (2) @(posedge clk); rst = 0;
    repeat (3*(T_RED+T_GRN+T_YEL)*EN_DIV + 4*EN_DIV) @(posedge clk);  // 여러 바퀴

    if (errors == 0) $display(" RESULT: PASS  (0 mismatch)");
    else             $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end

endmodule`;

// 보드 최상위 — tick_gen(1Hz en) + traffic_light 배선 (제공)
// 원본: ref_lab/day11/traffic_light/rtl/top_traffic_light.v
const topCode = `// =============================================================================
// top_traffic_light.v — 보드 최상위 (제공 — 그대로 복사해 사용)
// 단일 100MHz clk + 클럭 인에이블(tick) 패턴 — clk 분주 금지(파생 클럭 X).
//   clk(100MHz) ─►[tick_gen DIV=1억]─► tick(1Hz, 1클럭폭) ─► en
//                                      [traffic_light FSM] ─► RGB/mono LED
// =============================================================================
module top_traffic_light (
  input  wire       clk,        // 100MHz 시스템 클럭
  input  wire       rst,        // BTN0 (동기 active-high)
  output wire [2:0] rgb_led_r,  // RGB LED R채널 → LD0/LD1/LD2
  output wire [2:0] rgb_led_g,  // RGB LED G채널
  output wire [2:0] rgb_led_b,  // RGB LED B채널 (미사용 → 0)
  output wire [2:0] mono_led    // 상태 one-hot 디버그 → LD4/LD5/LD6
);
  wire tick;                                                   // 1Hz 1클럭 폭 펄스
  tick_gen      u_tick (.clk(clk), .rst(rst), .tick(tick));    // Day10 원본 재사용
  traffic_light u_fsm  (.clk(clk), .rst(rst), .en(tick),
    .rgb_led_r(rgb_led_r), .rgb_led_g(rgb_led_g), .rgb_led_b(rgb_led_b),
    .mono_led(mono_led));
endmodule

// ── tick_gen.v 은 Day10 공용 모듈을 그대로 재사용 (아래 제공 파일에 동봉) ──
//   board_flist.f 는 ../../../day10/counter/rtl/tick_gen.v 상대참조(원본 1곳·사본 금지).`;

// 공용 1Hz en 생성기 — Day10 원본을 그대로 재사용 (제공)
// 원본: ref_lab/day10/counter/rtl/tick_gen.v  (board_flist.f 상대참조, 사본 금지)
const tickGenCode = `// =============================================================================
// tick_gen.v — Day10 공용 모듈 재사용 (제공 — 그대로 복사해 사용)
// 보드 100MHz 에서 1클럭 폭 tick(클럭 인에이블) 생성 — 파생 클럭 금지(단일 도메인).
//   DIV 클럭마다 tick 1클럭 HIGH → top 에서 traffic_light.en 으로 연결.
//   시뮬: +define+FUNC_SIM → DIV 축소(빠른 순환) · 합성: 실제 값(1억 = 1Hz).
// ※ Day10~11 동일 파일 공유 — top_traffic_light 이 이 모듈을 인스턴스화.
// =============================================================================
module tick_gen (
  input  wire clk,        // 보드 메인 클럭 100MHz
  input  wire rst,        // 동기 active-high
  output reg  tick        // DIV 클럭마다 1클럭 폭 HIGH
);
\`ifdef FUNC_SIM
  localparam integer DIV = 4;            // 시뮬용 (빠른 순환)
\`else
  localparam integer DIV = 100_000_000;  // 100MHz → 1Hz
\`endif

  reg [26:0] cnt;
  always @(posedge clk)
    if (rst)               begin cnt <= 0; tick <= 1'b0; end
    else if (cnt == DIV-1) begin cnt <= 0; tick <= 1'b1; end
    else                   begin cnt <= cnt + 1'b1; tick <= 1'b0; end
endmodule`;

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

  // RGB LED 채널 — 램프 3개를 LD0/LD1/LD2 로 독립 구동 (YEL = R+G)
  // stt: 0=RED, 1=GRN, 2=YEL
  const ledRGB = [
    { r: stt === 0, g: false, b: false }, // LD0 = RED 램프
    { r: stt === 2, g: stt === 2, b: false }, // LD1 = YEL 램프 (R+G)
    { r: false, g: stt === 1, b: false }, // LD2 = GRN 램프
  ];
  const mixColor = (l: { r: boolean; g: boolean; b: boolean }) =>
    l.r && l.g ? '#F6C544' : l.r ? '#FF4D4D' : l.g ? '#48E08A' : l.b ? '#4D7DFF' : '#2A2E33';

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
          subtitle="RED→GREEN→YELLOW 순환 · RGB LED 3개 독립 구동(YEL=R+G) · 안전 default는 적색"
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
                <strong style={{ color: '#4A6FA5' }}>tick(en)</strong>마다 타이머 +1 → <strong style={{ color: DAY11 }}>done</strong>이면 다음 상태 · 상태가 곧 <strong style={{ color: DAY11 }}>출력(Moore)</strong>
              </div>
              <svg viewBox="0 0 470 236" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* 신호등 하우징 */}
                <rect x="36" y="34" width="58" height="160" rx="12" fill="#232C3D" stroke="#3D4A63" strokeWidth="1.4" />
                <rect x="58" y="22" width="14" height="14" rx="3" fill="#1A2230" stroke="#3D4A63" strokeWidth="1" />
                <Lamp cx={65} cy={66} on={isR} lit="#FF4D4D" />
                <Lamp cx={65} cy={110} on={isY} lit="#F6C544" />
                <Lamp cx={65} cy={154} on={isG} lit="#48E08A" />

                {/* 램프 → RGB LED 매핑 라벨 (하우징 우측) */}
                {[
                  { cy: 66, name: 'LD0', sub: 'R', c: '#E53E3E', active: isR },
                  { cy: 110, name: 'LD1', sub: 'R+G', c: ORANGE, active: isY },
                  { cy: 154, name: 'LD2', sub: 'G', c: '#48BB78', active: isG },
                ].map((m) => (
                  <g key={m.name} opacity={m.active ? 1 : 0.5}>
                    <line x1="94" y1={m.cy} x2="103" y2={m.cy} stroke={m.c} strokeWidth="1.3" />
                    <circle cx="94" cy={m.cy} r="1.7" fill={m.c} />
                    <text x="106" y={m.cy - 0.5} fontSize="8.5" fontWeight="800" fill={m.c} fontFamily={MONO}>{m.name}</text>
                    <text x="106" y={m.cy + 8} fontSize="5.5" fontWeight="700" fill={FPGA.textLight} fontFamily={MONO}>{m.sub}</text>
                  </g>
                ))}

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
                        {active ? `${st.tmr}/${T[i] - 1}` : `${T[i]}tick`}
                      </text>
                    </g>
                  );
                })}

                {/* 출력 — RGB LED 3개 (LD0=R / LD1=Y=R+G / LD2=G) */}
                <text x="406" y="54" fontSize="7" fontWeight="800" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>RGB LED 출력</text>
                <text x="392" y="72" fontSize="6" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily={MONO}>R</text>
                <text x="414" y="72" fontSize="6" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily={MONO}>G</text>
                <text x="436" y="72" fontSize="6" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>B</text>
                {ledRGB.map((l, i) => {
                  const y = 90 + i * 34;
                  const mix = mixColor(l);
                  const litAny = l.r || l.g || l.b;
                  const cells = [{ on: l.r, c: '#E53E3E', x: 392 }, { on: l.g, c: '#48BB78', x: 414 }, { on: l.b, c: '#4A6FA5', x: 436 }];
                  const lampName = ['LD0·R', 'LD1·Y', 'LD2·G'][i];
                  return (
                    <g key={i}>
                      {litAny && <circle cx={360} cy={y} r="11" fill={mix} opacity="0.32" />}
                      <circle cx={360} cy={y} r="8" fill={litAny ? mix : '#2A2E33'} stroke={litAny ? mix : '#454B52'} strokeWidth="1" />
                      <text x={360} y={y + 20} fontSize="5.5" fontWeight="700" fill={litAny ? mix : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>{lampName}</text>
                      {cells.map((cell, j) => (
                        <g key={j}>
                          <rect x={cell.x - 9} y={y - 9} width="18" height="18" rx="3" fill={cell.on ? `${cell.c}26` : '#EEF1F5'} stroke={cell.on ? cell.c : FPGA.border} strokeWidth="1" />
                          <text x={cell.x} y={y + 3.5} fontSize="8" fontWeight="800" fill={cell.on ? cell.c : DIM} textAnchor="middle" fontFamily={MONO}>{cell.on ? 1 : 0}</text>
                        </g>
                      ))}
                    </g>
                  );
                })}
                {stt === 2 && (
                  <text x="400" y="208" fontSize="6.5" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>LD1: R+G = 노랑 ★</text>
                )}

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
                >⏭ tick +1</button>
                <span style={{ fontSize: '0.62rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.3rem' }}>
                  state <span style={{ color: DAY11 }}>{NAME[stt]}</span> · tmr {st.tmr}/{T[stt] - 1} · light {light.toString(2).padStart(3, '0')}
                </span>
              </div>
              <div style={{ fontSize: '0.58rem', color: '#B45309', textAlign: 'center', marginTop: '0.15rem', lineHeight: 1.4 }}>
                ⚠ 화면 데모는 타이머를 3/2/1로 축약 — 실제는 30/25/5 <strong>틱</strong> · 1 tick = en 1펄스(보드 tick_gen 1Hz)
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
                subtitle="Moore FSM · en 게이트 · RGB LED 출력(YEL=R+G) · 안전 default 적색"
                inlineStyle={{ fontSize: '0.54rem', lineHeight: 1.38 }}
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
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.45 }}>
                <li>램프 3개 = <strong>RGB LED 3개</strong>(LD0/LD1/LD2) 독립 구동 — 한 번에 하나만 점등</li>
                <li><strong style={{ color: '#B45309' }}>YEL = R+G 동시</strong> — RGB LED는 노랑 핀이 없음(가산혼합) · B 미사용</li>
                <li>타이머/상태는 <code>en</code>(틱)일 때만 전진 · <code>done</code>이면 천이 → 시간 제어</li>
                <li>출력은 <strong>상태만</strong>의 함수(Moore) · <code>default</code> 적색(fail-safe) · <code>mono_led</code> one-hot 디버그</li>
              </ul>
            </div>

            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.55rem 0.75rem', boxShadow: shadow.card,
              flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>상태 타이밍 (틱 단위 · 화면 축약)</div>
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
                        <text x={x + w / 2} y="51" fontSize="6" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>{sg.w}tick</text>
                      </g>
                    );
                    x += w;
                    return el;
                  });
                })()}
                <text x="12" y="13" fontSize="6.5" fill={FPGA.textLight} fontFamily={MONO}>state ▶ (tick 진행)</text>
                <text x="160" y="72" fontSize="6.5" fill={FPGA.text} textAnchor="middle" fontFamily={MONO}>각 상태 = 타이머가 정한 tick(en) 수만큼 유지 → 순환</text>
                <text x="160" y="86" fontSize="6.5" fill={DAY11} textAnchor="middle" fontWeight="700" fontFamily={MONO}>실제 보드: 30 / 25 / 5 tick (1Hz tick 기준 = 30s/25s/5s)</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
              border: `1px solid ${FPGA.accent}30`, borderRadius: '8px',
              padding: '0.45rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.accent, flexShrink: 0 }}>HINT</span>
              <span style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.45 }}>
                보드는 <code>tick_gen</code>(DIV=1억, 합성 전용)으로 en 1Hz. 시뮬은 TB가 en 펄스로 직접 구동 → 1억 분주는 시뮬 안 함(수백 클럭이면 순환).
              </span>
            </div>

            {/* ── 제공 파일 (클릭 → 전체 코드 · 복사) ── */}
            <div>
              <div style={{ fontSize: '0.55rem', fontWeight: 700, color: FPGA.textLight, marginBottom: '0.28rem', letterSpacing: '0.02em' }}>
                제공 파일 — 클릭하면 전체 코드, <strong style={{ color: FPGA.text }}>복사</strong>해 그대로 사용 (설계는 <code>traffic_light.v</code>만)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                <ProvidedFileModal
                  filename="tb_traffic_light.sv"
                  accent={DAY11}
                  hint={<>기능검증 TB <strong>자동 PASS/FAIL</strong></>}
                  modalSubtitle="en 펄스 구동 · golden과 매 clk RGB/mono 비교 · YEL=R+G 색·순서·게이팅"
                  code={tbCode}
                />
                <ProvidedFileModal
                  filename="arty.xdc"
                  accent={ORANGE}
                  hint={<>보드 핀 제약 <strong>clk·rst·RGB LED</strong></>}
                  modalSubtitle="Arty A7-35T 발췌 · clk(100MHz) · rst(BTN0) · RGB LED LD0/LD1/LD2 · mono LD4~6"
                  code={xdcCode}
                />
                <ProvidedFileModal
                  filename="top_traffic_light.v"
                  accent="#4A6FA5"
                  hint={<>보드 배선 <strong>tick_gen → en</strong></>}
                  modalSubtitle="보드 top · tick_gen(1Hz en) + traffic_light · board_flist.f 로 합성"
                  code={topCode}
                />
                <ProvidedFileModal
                  filename="tick_gen.v"
                  accent="#8B6FA5"
                  hint={<>1Hz en 생성 <strong>Day10 공용 모듈</strong></>}
                  modalSubtitle="Day10 원본 재사용 · 100MHz→1Hz en · +define+FUNC_SIM 시 DIV 축소"
                  code={tickGenCode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
