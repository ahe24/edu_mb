'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';
import RevealCodeModal from '../RevealCodeModal';

const DAY11 = '#3D8361';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '9026';

const SNAME = ['S0', 'S1', 'S10', 'S101'];
// 다음 상태표 [state][din]
const NXT = [
  [0, 1],  // S0:   0→S0,  1→S1
  [2, 1],  // S1:   0→S10, 1→S1
  [0, 3],  // S10:  0→S0,  1→S101
  [2, 1],  // S101: 0→S10, 1→S1  (overlap)
];

const portsCode = `module seq_detect (        // 패턴 "1 0 1" 검출 (overlap 허용)
  input  wire clk,
  input  wire rst,
  input  wire en,           // 클럭 인에이블 — 이 클럭에만 1비트 전진
  input  wire din,
  output wire found
);
  localparam S0=2'd0, S1=2'd1, S10=2'd2, S101=2'd3;`;

const bodyShown = `  reg [1:0] state, next;
  always @(posedge clk)             // 상태 reg (en 게이트)
    if (rst)     state <= S0;
    else if (en) state <= next;     // en=0 → 비트 유지 (손 입력 대기)
  always @* case (state)            // 다음 상태
    S0:   next = din ? S1   : S0;
    S1:   next = din ? S1   : S10;
    S10:  next = din ? S101 : S0;
    S101: next = din ? S1   : S10;   // overlap 재사용
    default: next = S0;              // 안전 복구
  endcase
  assign found = (state == S101);   // Moore 출력
endmodule`;

const xdcCode = `## ==================================================================
## Day 11 seq_detect — arty.xdc (Arty A7-35T 발췌) · 보드 top = seq_top
##   clk → 100MHz (create_clock)   rst → BTN0
##   step_btn → BTN1 (비트 1개 투입)   din → SW0 (비트 값)   found → LD4
## ※ 시뮬은 XDC 불필요 — Vivado 합성·보드 구현 시에만 사용.
## ※ 손으로 1비트/클럭 불가(100MHz) → seq_top 이 BTN1 을
##   debounce→상승엣지→1클럭 en 으로 바꿔 비트 단위 투입. clk 분주 금지.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN0 ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── step_btn → 푸시버튼 BTN1 (비트 투입 = en 펄스) ──
set_property -dict { PACKAGE_PIN C9  IOSTANDARD LVCMOS33 } [get_ports { step_btn }];

## ── din → 슬라이드 스위치 SW0 (넣을 비트 값) ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports { din }];

## ── found → User LED LD4 ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { found }];`;

// 보드 최상위 — 배선 + ② 상승엣지 검출 (참고 코드: 초보자는 그대로 사용)
const topCode = `// seq_top.v — 보드 최상위 (배선 + 엣지검출)
//   SW0→din(값)  BTN1→step(투입)  BTN0→rst  LD4→found
module seq_top (
  input  wire clk,
  input  wire rst,        // BTN0
  input  wire step_btn,   // BTN1 (raw·비동기)
  input  wire din,        // SW0  (넣을 비트 값)
  output wire found       // LD4
);
  // ① 디바운스: 채터링 제거 + 2FF 동기화 → 안정 레벨
  wire step_lvl;
  debounce u_db (
    .clk(clk), .rst(rst), .btn_in(step_btn), .btn_out(step_lvl)
  );

  // ② 상승엣지 검출: step_lvl 을 1클럭 지연시켜 0→1 전이만 잡음
  reg step_d;
  always @(posedge clk)
    if (rst) step_d <= 1'b0;
    else     step_d <= step_lvl;
  wire step = step_lvl & ~step_d;   // 한 번 누르면 정확히 1클럭만 HIGH

  // ③ FSM 코어: step(en) 인 클럭에서만 din 1비트 전진
  seq_detect u_fsm (
    .clk(clk), .rst(rst), .en(step), .din(din), .found(found)
  );
endmodule`;

// 디바운서 — Day10 재사용 (참고 코드)
const debCode = `// debounce.v — 버튼 채터링 제거 + 2FF 동기화 (Day10 재사용)
module debounce #(parameter integer STABLE = 1_000_000) (  // ~10ms@100MHz
  input  wire clk,
  input  wire rst,
  input  wire btn_in,    // raw 버튼 (비동기)
  output reg  btn_out    // 안정화된 레벨 (펄스 아님)
);
  reg [19:0] cnt;
  reg        s0, s1;     // 2단 동기화 FF
  always @(posedge clk)  // ① 메타안정 방지
    if (rst) {s1, s0} <= 2'b00;
    else     {s1, s0} <= {s0, btn_in};
  always @(posedge clk)  // ② 카운터 기반 안정화
    if (rst)                  begin cnt <= 0; btn_out <= 1'b0; end
    else if (s1 == btn_out)   cnt <= 0;                    // 변화 없음
    else if (cnt == STABLE-1) begin btn_out <= s1; cnt <= 0; end
    else                      cnt <= cnt + 1'b1;
endmodule`;

interface Step { bit: number; state: number; found: boolean; }

export default function SeqDetectorSlide() {
  const [state, setState] = useState(0);
  const [tape, setTape] = useState<Step[]>([]);
  const [xdcOpen, setXdcOpen] = useState(false);
  const [tab, setTab] = useState<'top' | 'deb' | 'xdc'>('top');

  const FILES = [
    { id: 'top' as const, label: 'seq_top.v', code: topCode },
    { id: 'deb' as const, label: 'debounce.v', code: debCode },
    { id: 'xdc' as const, label: 'arty.xdc', code: xdcCode },
  ];

  const feed = (b: number) => {
    const ns = NXT[state][b];
    setState(ns);
    setTape((t) => [...t.slice(-13), { bit: b, state: ns, found: ns === 3 }]);
  };
  const reset = () => { setState(0); setTape([]); };
  const inject = () => {
    reset();
    // 1 0 1 1 0 1 → found 2회 (overlap)
    const seq = [1, 0, 1, 1, 0, 1];
    let s = 0;
    const steps: Step[] = [];
    for (const b of seq) { s = NXT[s][b]; steps.push({ bit: b, state: s, found: s === 3 }); }
    setState(s);
    setTape(steps);
  };

  const hits = tape.filter((t) => t.found).length;

  // 상태 ring 좌표 (가로 배치)
  const ring = [
    { cx: 40, cy: 80 }, { cx: 120, cy: 80 }, { cx: 200, cy: 80 }, { cx: 280, cy: 80 },
  ];

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · 시퀀스 검출"
          title="입력 패턴 검출 FSM — overlap 처리"
          subtitle="직렬 입력에서 '101' 발견 시 found=1 · 겹치는 패턴(101101…)도 놓치지 않게"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 인터랙티브 다이어그램 + 설계 코드 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.45rem 0.55rem 0.3rem',
              boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.textLight, textAlign: 'center', marginBottom: '0.05rem' }}>
                <strong style={{ color: DAY11 }}>din 비트</strong>를 직접 넣어 보기 — 상태가 따라 이동, <strong style={{ color: '#48BB78' }}>S101 도달 시 found</strong>
                <span style={{ display: 'block', fontSize: '0.5rem', fontWeight: 600, color: FPGA.textLight }}>
                  버튼 1클릭 = 보드의 <strong>SW0(값) 설정 + BTN1(step) 1번</strong>
                </span>
              </div>
              <svg viewBox="0 0 320 116" style={{ width: '100%' }}>
                {/* 천이 화살표 (정방향) */}
                <path d="M60 80 H100" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#sa)" /><text x="80" y="73" fontSize="7" fill={DAY11} textAnchor="middle" fontFamily={MONO}>1</text>
                <path d="M140 80 H180" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#sa)" /><text x="160" y="95" fontSize="7" fill={DAY11} textAnchor="middle" fontFamily={MONO}>0</text>
                <path d="M220 80 H260" stroke={DAY11} strokeWidth="1.5" markerEnd="url(#sa)" /><text x="240" y="73" fontSize="7" fill={DAY11} textAnchor="middle" fontFamily={MONO}>1</text>
                {/* overlap S101 → S1 (din=1) — 노드 위로 완만하게 */}
                <path d="M278 64 A95 95 0 0 0 122 64" fill="none" stroke="#48BB78" strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#sa)" />
                <text x="200" y="22" fontSize="6.8" fill="#48BB78" textAnchor="middle" fontFamily={MONO}>din=1 (overlap → S1)</text>
                {/* nodes */}
                {ring.map((n, i) => {
                  const active = state === i;
                  const hit = i === 3;
                  const c = hit ? '#48BB78' : DAY11;
                  return (
                    <g key={i}>
                      {active && <circle cx={n.cx} cy={n.cy} r="24" fill={c} opacity="0.18" />}
                      <circle cx={n.cx} cy={n.cy} r="19" fill={active ? `${c}28` : '#F4F6F9'} stroke={c} strokeWidth={active ? 2.6 : 1.4} />
                      <text x={n.cx} y={n.cy + 3.5} fontSize="8" fontWeight="800" fill={c} textAnchor="middle" fontFamily={MONO}>{SNAME[i]}</text>
                    </g>
                  );
                })}
                <defs>
                  <marker id="sa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0 0 L6 3 L0 6 z" fill={DAY11} />
                  </marker>
                </defs>
              </svg>

              {/* 입력 테이프 */}
              <div style={{ marginTop: '0.1rem', padding: '0.3rem 0.4rem', background: '#0F1626', borderRadius: '7px' }}>
                <div style={{ fontSize: '0.54rem', color: '#7C90B0', fontFamily: MONO, marginBottom: '2px' }}>din 입력 스트림 →</div>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', minHeight: '26px', flexWrap: 'nowrap', overflow: 'hidden' }}>
                  {tape.length === 0 && <span style={{ fontSize: '0.6rem', color: '#4A5872', fontFamily: MONO }}>버튼으로 비트를 넣어보기…</span>}
                  {tape.map((t, i) => (
                    <div key={i} style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: '17px', height: '17px', borderRadius: '4px',
                        background: t.found ? '#48BB78' : t.bit ? `${DAY11}` : '#2C3850',
                        color: t.found || t.bit ? '#fff' : '#9FB0CC',
                        fontSize: '0.62rem', fontWeight: 800, fontFamily: MONO,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{t.bit}</div>
                      {t.found && <div style={{ fontSize: '0.46rem', color: '#48BB78', fontFamily: MONO, fontWeight: 800 }}>✓</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* 컨트롤 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <button onClick={() => feed(1)} style={{ cursor: 'pointer', fontSize: '0.62rem', fontWeight: 800, fontFamily: MONO, color: '#fff', background: DAY11, border: 'none', borderRadius: '5px', padding: '3px 12px' }}>din=1</button>
                <button onClick={() => feed(0)} style={{ cursor: 'pointer', fontSize: '0.62rem', fontWeight: 800, fontFamily: MONO, color: DAY11, background: 'transparent', border: `1px solid ${DAY11}`, borderRadius: '5px', padding: '3px 12px' }}>din=0</button>
                <button onClick={inject} style={{ cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO, color: '#fff', background: ORANGE, border: 'none', borderRadius: '5px', padding: '3px 9px' }}>101101 주입</button>
                <button onClick={reset} style={{ cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO, color: '#E2574C', background: 'transparent', border: '1px solid #E2574C', borderRadius: '5px', padding: '3px 9px' }}>rst</button>
                <span style={{ fontSize: '0.62rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.2rem' }}>
                  state <span style={{ color: state === 3 ? '#48BB78' : DAY11 }}>{SNAME[state]}</span> · found ×<span style={{ color: '#48BB78' }}>{hits}</span>
                </span>
              </div>
            </div>

            {/* 설계 코드 (구현부 잠금) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY11}`,
            }}>
              <RevealCodeModal
                title="seq_detect.v — 설계"
                accent={DAY11}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="&quot;101&quot; overlap 검출 · Moore"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: 추적 + overlap 설명 ──
              주요 정보 카드(설계 포인트·실무 활용)에 flex 가중치 → 좌측 높이에 맞춰
              세로로 늘리고 내부 콘텐츠를 펼친다. 작은 카드(코드추적·HINT·버튼)는 자연 크기 유지. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minHeight: 0 }}>
            <div style={{
              flexShrink: 0,
              background: '#0F1626', borderRadius: '9px',
              padding: '0.55rem 0.75rem', boxShadow: shadow.card,
              fontFamily: 'ui-monospace, Consolas, monospace', fontSize: '0.62rem', lineHeight: 1.65,
            }}>
              <div style={{ color: '#94A3B8' }}># din = 1 0 1 1 0 1 주입 시</div>
              <div style={{ color: '#A8D8A8' }}>state: S0→S1→S10→<span style={{ color: '#48BB78' }}>S101*</span>→S1→S10→<span style={{ color: '#48BB78' }}>S101*</span></div>
              <div style={{ color: '#F6AD55' }}>found pulses: 2 (overlap 덕분)</div>
            </div>

            <div style={{
              flex: 1, minHeight: 0,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              background: FPGA.white, border: `1px solid ${DAY11}25`,
              borderTop: `3px solid ${DAY11}`, borderRadius: '10px',
              padding: '0.6rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>설계 포인트</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.7 }}>
                <li>각 상태 = 지금까지 맞은 <strong>부분 패턴</strong>을 기억</li>
                <li>틀린 비트가 와도 가능한 만큼은 유지(완전 리셋 아님)</li>
                <li>출력은 상태만의 함수(Moore) → S101에서 found</li>
              </ul>
            </div>

            <div style={{
              flexShrink: 0,
              background: `linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.13))`,
              border: `1px solid rgba(72,187,120,0.30)`, borderLeft: '4px solid #48BB78',
              borderRadius: '8px', padding: '0.5rem 0.8rem',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#37A862', marginBottom: '0.15rem' }}>overlap 핵심</div>
              <div style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.5 }}>
                S101에서 din=1을 <strong>S1로</strong> 보내는 화살표가 overlap. 이걸 S0으로 잘못 두면 <code>101101</code>의 두 번째 패턴을 놓침.
              </div>
            </div>

            {/* ── 실무 활용 예 ── */}
            <div style={{
              flex: 1.4, minHeight: 0,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              background: FPGA.white, border: `1px solid ${DAY11}25`,
              borderTop: `3px solid ${DAY11}`, borderRadius: '10px',
              padding: '0.6rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.4rem' }}>
                실무에서 패턴 검출 FSM은 어디에?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: '0.28rem' }}>
                {[
                  { tag: '통신', t: '프레임 동기', d: 'preamble · sync word(SOF) 검출로 직렬 패킷 시작 정렬 (UART/SPI/링크)' },
                  { tag: '고속링크', t: '8b/10b comma', d: '비트스트림 워드 정렬 — SpaceWire 등 항공·우주 직렬 버스' },
                  { tag: '안전', t: 'arming 시퀀스', d: '정해진 입력 순서가 와야 동작 허용 → 오조작·단일고장 작동 차단' },
                  { tag: '진단', t: '결함 패턴', d: '센서·버스 신호의 특정 비트열 발생 감시(글리치·잠금 시퀀스)' },
                ].map((u) => (
                  <div key={u.t} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <span style={{
                      flexShrink: 0, fontSize: '0.5rem', fontWeight: 800, color: '#fff',
                      background: DAY11, borderRadius: '4px', padding: '2px 5px',
                      fontFamily: MONO, marginTop: '1px', minWidth: '42px', textAlign: 'center',
                    }}>{u.tag}</span>
                    <span style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.4 }}>
                      <strong style={{ color: FPGA.dark }}>{u.t}</strong> — {u.d}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              flexShrink: 0,
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
              border: `1px solid ${FPGA.accent}30`, borderRadius: '8px',
              padding: '0.42rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: FPGA.accent, flexShrink: 0 }}>HINT</span>
              <span style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.45 }}>
                보드: <strong>SW0</strong>로 비트값 세팅 → <strong>BTN1(step)</strong> 누르면 1비트 투입. <code>1 0 1 1 0 1</code> 순서로 넣어 found 2번 확인 → TB도 자동 판정.
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
              }}>seq_top</span>
              <span style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.4 }}>
                보드 구성·핀 — <strong>SW0(값)+BTN1(step)→디바운스·엣지·en→FSM→LED</strong>
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
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: ORANGE, fontFamily: MONO }}>보드 프로젝트 — 구성요소 & 파일</span>
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>seq_top + debounce + arty.xdc (FSM 코어는 직접 설계) · 손으로 비트 1개씩 투입</span>
          <button
            onClick={() => setXdcOpen(false)}
            style={{
              marginLeft: 'auto', background: 'transparent', border: '1px solid #3A4860',
              color: '#9FB0CC', borderRadius: '6px', padding: '2px 10px', cursor: 'pointer',
              fontSize: '0.74rem', fontWeight: 700,
            }}
          >✕ 닫기 (Esc)</button>
        </div>

        {/* ── 내부 구성요소: 데이터 흐름 (초보자용) ── */}
        <div style={{ padding: '0.7rem 1.1rem 0.4rem', borderBottom: '1px solid #2C3850' }}>
          <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#C7D2E8', marginBottom: '0.45rem' }}>
            왜 래퍼가 필요한가 — 100MHz에선 스위치를 손으로 올려둬도 "비트 1개"가 아니라 "1이 1억 번". 그래서 3단계로 비트를 정렬한다.
          </div>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { n: '①', name: 'debounce', sig: 'BTN1 → step_lvl', d: '접점 채터링 제거 + 2FF 동기화 → 안정 레벨', why: '없으면 한 번 눌러도 비트가 여러 개', c: ORANGE },
              { n: '②', name: 'edge detect', sig: 'step_lvl → step(1clk)', d: '0→1 전이만 잡아 1클럭 펄스 생성', why: '없으면 누른 동안 비트 폭주', c: '#48BB78' },
              { n: '③', name: 'seq_detect (en)', sig: 'din @ step → found', d: 'step 클럭에서만 din 1비트 샘플·전진', why: 'found는 다음 step까지 유지 → LED로 보임', c: DAY11 },
            ].map((b, i) => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: '1 1 0', minWidth: '180px' }}>
                <div style={{
                  flex: 1, background: '#16203A', border: `1px solid ${b.c}55`, borderTop: `3px solid ${b.c}`,
                  borderRadius: '8px', padding: '0.4rem 0.55rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: b.c }}>{b.n}</span>
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#E6ECF7', fontFamily: MONO }}>{b.name}</span>
                  </div>
                  <div style={{ fontSize: '0.54rem', color: '#7C90B0', fontFamily: MONO, margin: '1px 0 3px' }}>{b.sig}</div>
                  <div style={{ fontSize: '0.58rem', color: '#C7D2E8', lineHeight: 1.35 }}>{b.d}</div>
                  <div style={{ fontSize: '0.54rem', color: '#E2877A', lineHeight: 1.3, marginTop: '2px' }}>↳ {b.why}</div>
                </div>
                {i < 2 && <span style={{ fontSize: '0.9rem', color: '#4A5872', fontWeight: 800 }}>→</span>}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.56rem', color: '#7C90B0', marginTop: '0.4rem', fontFamily: MONO }}>
            SW0(din 값)은 그대로 FSM 으로 · BTN0 = rst · 시뮬은 en=1 고정(1비트/클럭), 보드는 en=step
          </div>
        </div>

        {/* ── 파일 탭: 보드에 필요한 3개 파일 ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 1.1rem 0', flexWrap: 'wrap' }}>
          {FILES.map((f) => {
            const on = tab === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setTab(f.id)}
                style={{
                  cursor: 'pointer', fontFamily: MONO, fontSize: '0.66rem', fontWeight: 800,
                  color: on ? '#0F1626' : '#9FB0CC', background: on ? ORANGE : 'transparent',
                  border: `1px solid ${on ? ORANGE : '#3A4860'}`, borderRadius: '6px 6px 0 0',
                  padding: '3px 12px',
                }}
              >{f.label}</button>
            );
          })}
          <span style={{
            marginLeft: 'auto', fontSize: '0.56rem', color: '#7C90B0', fontFamily: MONO,
            border: '1px dashed #3A4860', borderRadius: '5px', padding: '2px 8px',
          }}>
            ③ seq_detect.v 는 좌측에서 직접 설계 🔒
          </span>
        </div>

        <pre style={{
          margin: 0, flex: 1, minHeight: 0, overflow: 'auto',
          padding: '0.7rem 1.1rem 1rem', background: '#16203A',
          fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
          fontSize: '0.72rem', lineHeight: 1.5, color: '#C7D2E8', whiteSpace: 'pre',
        }}>
          {FILES.find((f) => f.id === tab)!.code}
        </pre>
      </SlideModal>
    </section>
  );
}
