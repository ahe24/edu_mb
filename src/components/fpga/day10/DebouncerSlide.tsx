'use client';

import { useState, useEffect } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import ToolImage from '../ToolImage';
import SlideModal from '../SlideModal';
import RevealCodeModal from '../RevealCodeModal';

const DAY10 = '#1B998B';
const ORANGE = '#E8913A';
const CDC = '#0891B2';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '2086';

const portsCode = `module debounce #(
  parameter integer STABLE = 1_000_000  // ~10ms @100MHz
)(
  input  wire clk,
  input  wire rst,
  input  wire btn_in,        // 노이즈 있는 raw 버튼
  output reg  btn_out        // 안정화된 버튼
);`;

const bodyShown = `  reg [19:0] cnt;
  reg        s0, s1;         // 2단 동기화 FF

  always @(posedge clk)      // ① 메타안정 방지 2FF
    if (rst) {s1, s0} <= 2'b00;
    else     {s1, s0} <= {s0, btn_in};

  always @(posedge clk) begin // ② 카운터 기반 안정화
    if (rst)                 begin cnt <= 0; btn_out <= 1'b0; end
    else if (s1 == btn_out)  cnt <= 0;            // 변화 없음 → 리셋
    else if (cnt == STABLE-1) begin btn_out <= s1; cnt <= 0; end
    else                     cnt <= cnt + 1'b1;
  end
endmodule`;

const xdcCode = `## ==================================================================
## Day 10 debounce — arty.xdc (Arty A7-35T Master 발췌)
##   clk → 100MHz (create_clock)   rst → BTN1   btn_in → BTN0   btn_out → LED
## btn_in 은 클럭과 무관한 비동기 입력 → 2FF 동기화 후 디바운스.
## ==================================================================

## ── 100MHz 시스템 클럭 ──
set_property -dict { PACKAGE_PIN E3  IOSTANDARD LVCMOS33 } [get_ports { clk }];
create_clock -name sys_clk -period 10.0 [get_ports { clk }];

## ── rst → 푸시버튼 BTN1 ──
set_property -dict { PACKAGE_PIN C9  IOSTANDARD LVCMOS33 } [get_ports { rst }];

## ── btn_in → 푸시버튼 BTN0 (raw, 비동기) ──
set_property -dict { PACKAGE_PIN D9  IOSTANDARD LVCMOS33 } [get_ports { btn_in }];

## ── btn_out → User LED LD4 ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports { btn_out }];`;

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

/** 푸시버튼 (raw btn_in) — 클릭으로 누름/뗌 */
function PushButton({ cx, cy, on, onClick }: { cx: number; cy: number; on: boolean; onClick: () => void }) {
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <text x={cx} y={cy - 14} fontSize="6.5" fontWeight="800" fill="#475569" textAnchor="middle" fontFamily={MONO}>btn_in</text>
      <rect x={cx - 13} y={cy - 9} width="26" height="18" rx="4" fill="#33405A" stroke="#1C2638" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={on ? 6.5 : 7} fill={on ? '#E2574C' : '#C9D2E0'} stroke={on ? '#A83228' : '#94A3B8'} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="2.4" fill={on ? '#FFD2CC' : '#8A97AC'} />
    </g>
  );
}

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

export default function DebouncerSlide() {
  const STABLE = 3;                    // 데모용 (실제 보드: 1_000_000)
  const [st, setSt] = useState({ btnIn: 0, s0: 0, s1: 0, out: 0, cnt: 0, q: [] as number[] });
  const [pressed, setPressed] = useState(false);
  const [rst, setRst] = useState(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(false);
  const [xdcOpen, setXdcOpen] = useState(false);

  const clkStep = () => {
    setPhase((p) => !p);
    setSt((s) => {
      if (rst) return { btnIn: pressed ? 1 : 0, s0: 0, s1: 0, out: 0, cnt: 0, q: [] };
      const cur = s.q.length ? s.q[0] : pressed ? 1 : 0;   // 이번 사이클 raw
      const restQ = s.q.slice(1);
      // 2FF: 새 s0=cur, 새 s1=이전 s0
      const ns0 = cur;
      const ns1 = s.s0;
      // 카운터: NB 의미 — 이전 s1/out 으로 판정
      let ncnt = s.cnt;
      let nout = s.out;
      if (s.s1 === s.out) ncnt = 0;
      else if (s.cnt === STABLE - 1) { nout = s.s1; ncnt = 0; }
      else ncnt = s.cnt + 1;
      return { btnIn: cur, s0: ns0, s1: ns1, out: nout, cnt: ncnt, q: restQ };
    });
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(clkStep, 430);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, rst, pressed]);

  // 버튼 누름/뗌 — 목표값 주변 바운스(채터링) 주입
  const press = () => {
    const target = !pressed;
    setPressed(target);
    setSt((s) => ({ ...s, q: target ? [1, 0, 1, 0, 1] : [0, 1, 0, 1, 0] }));
  };

  const DIM = '#94A3B8';
  const bouncing = st.q.length > 0;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · 디바운서"
          title="버튼 디바운서 — raw → clean"
          subtitle="비동기 버튼 2FF 동기화 → 카운터 안정화로 채터링 제거"
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
                <strong style={{ color: '#E2574C' }}>btn_in</strong>(바운스) → <strong style={{ color: CDC }}>2FF 동기</strong> → <strong style={{ color: ORANGE }}>STABLE 카운터</strong> → <strong style={{ color: DAY10 }}>btn_out</strong>
              </div>
              <svg viewBox="0 0 470 236" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* FPGA 칩 */}
                <rect x="90" y="22" width="296" height="200" rx="11" fill="#232C3D" stroke="#3D4A63" strokeWidth="1.2" />
                <text x="238" y="36" fontSize="9" fontWeight="700" fill="#9FB3C8" textAnchor="middle" letterSpacing="0.07em" fontFamily={MONO}>FPGA · 단일 클럭 도메인</text>

                {/* rst — 최상단 직결 */}
                <SlideSwitch cx={46} cy={46} on={rst} onToggle={() => setRst((v) => !v)} label="rst" />
                <path d="M66 46 H304 V66" stroke={rst ? '#E2574C' : DIM} strokeWidth="1.4" fill="none" opacity={rst ? 1 : 0.7} />
                <path d="M177 46 V66" stroke={rst ? '#E2574C' : DIM} strokeWidth="1.4" opacity={rst ? 1 : 0.7} />
                <text x="318" y="44" fontSize="6.5" fontWeight="700" fill={rst ? '#E2574C' : FPGA.textLight} textAnchor="end" fontFamily={MONO}>rst</text>

                {/* clk — 최하단 직결 + 레일 */}
                <rect x="10" y="190" width="62" height="28" rx="6" fill="#4A6FA512" stroke="#4A6FA5" strokeWidth="1.4" />
                <text x="41" y="202" fontSize="9" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>clk</text>
                <text x="41" y="213" fontSize="7" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>100MHz</text>
                <circle cx="78" cy="204" r="3" fill={running ? (phase ? '#4A6FA5' : '#A9C0E0') : '#C2CEDE'} />
                <path d="M72 204 H322" stroke="#4A6FA5" strokeWidth="1.7" fill="none" />
                <circle cx="177" cy="204" r="2.5" fill="#4A6FA5" />
                <circle cx="304" cy="204" r="2.5" fill="#4A6FA5" />
                <path d="M177 204 V158" stroke="#4A6FA5" strokeWidth="1.5" />
                <path d="M304 204 V158" stroke="#4A6FA5" strokeWidth="1.5" />
                <text x="210" y="199" fontSize="7" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>clk → 모든 FF 동일 클럭</text>

                {/* btn_in 푸시버튼 → 2FF */}
                <PushButton cx={48} cy={118} on={pressed} onClick={press} />
                <path d="M61 118 H130" stroke={st.btnIn ? '#E2574C' : DIM} strokeWidth="1.6" opacity={st.btnIn ? 1 : 0.7} />
                {bouncing && <text x="95" y="111" fontSize="6.5" fontWeight="800" fill="#E2574C" textAnchor="middle" fontFamily={MONO}>～bounce</text>}

                {/* 2FF 동기 블록 */}
                <rect x="130" y="66" width="94" height="92" rx="8" fill={`${CDC}14`} stroke={CDC} strokeWidth="1.7" />
                <text x="177" y="84" fontSize="9" fontWeight="800" fill={CDC} textAnchor="middle" fontFamily={MONO}>2FF 동기</text>
                <text x="177" y="95" fontSize="6" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>메타안정 방지</text>
                {/* s0, s1 */}
                <rect x="146" y="108" width="26" height="16" rx="3" fill={st.s0 ? CDC : '#DCE7EA'} />
                <text x="159" y="119" fontSize="7" fontWeight="800" fill={st.s0 ? '#fff' : '#6A8088'} textAnchor="middle" fontFamily={MONO}>s0:{st.s0}</text>
                <rect x="182" y="108" width="26" height="16" rx="3" fill={st.s1 ? CDC : '#DCE7EA'} />
                <text x="195" y="119" fontSize="7" fontWeight="800" fill={st.s1 ? '#fff' : '#6A8088'} textAnchor="middle" fontFamily={MONO}>s1:{st.s1}</text>
                <path d="M173 142 l4 -5 l4 5 Z" fill="#4A6FA5" />

                {/* s1 → debounce */}
                <path d="M224 100 H250" stroke={st.s1 ? CDC : DIM} strokeWidth="1.6" opacity={st.s1 ? 1 : 0.7} />
                <text x="237" y="95" fontSize="6" fontWeight="700" fill={CDC} textAnchor="middle" fontFamily={MONO}>s1</text>

                {/* debounce 카운터 블록 (이번 설계) */}
                <rect x="250" y="66" width="108" height="92" rx="8" fill={`${DAY10}1A`} stroke={DAY10} strokeWidth="1.9" />
                <text x="304" y="84" fontSize="9" fontWeight="800" fill={DAY10} textAnchor="middle" fontFamily={MONO}>debounce</text>
                <text x="304" y="95" fontSize="5.8" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>STABLE 카운터 ← 이번 설계</text>
                {/* cnt 막대 */}
                <text x="266" y="118" fontSize="7" fontWeight="800" fill={ORANGE} fontFamily={MONO}>cnt</text>
                <rect x="284" y="111" width="60" height="9" rx="3" fill="#EDE3D6" />
                <rect x="284" y="111" width={60 * ((st.cnt) / (STABLE - 1 || 1))} height="9" rx="3" fill={ORANGE} />
                <text x="314" y="118" fontSize="6.3" fontWeight="800" fill="#5A4326" textAnchor="middle" fontFamily={MONO}>{st.cnt}/{STABLE - 1}</text>
                {/* out */}
                <rect x="284" y="134" width="40" height="13" rx="3" fill={st.out ? DAY10 : '#DDE6E2'} />
                <text x="304" y="144" fontSize="7.5" fontWeight="800" fill={st.out ? '#fff' : '#7A8B85'} textAnchor="middle" fontFamily={MONO}>out:{st.out}</text>
                <path d="M300 162 l4 -5 l4 5 Z" fill="#4A6FA5" />

                {/* btn_out → LED */}
                <path d="M358 110 H392" stroke={st.out ? '#2FE08A' : DIM} strokeWidth="1.8" opacity={st.out ? 1 : 0.6} />
                <text x="375" y="104" fontSize="6.3" fontWeight="700" fill={DAY10} textAnchor="middle" fontFamily={MONO}>btn_out</text>
                <ChipLed cx={416} cy={110} on={!!st.out} r={1.15} />
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
                <button
                  onClick={press}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: '#E2574C',
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >🔘 버튼 {pressed ? '뗌' : '누름'}</button>
                <span style={{ fontSize: '0.6rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.2rem' }}>
                  in {st.btnIn} · s1 {st.s1} · cnt {st.cnt}/{STABLE - 1} · <span style={{ color: DAY10 }}>out {st.out}</span>
                </span>
              </div>
              <div style={{ fontSize: '0.58rem', color: '#B45309', textAlign: 'center', marginTop: '0.15rem', lineHeight: 1.4 }}>
                ⚠ STABLE=3은 데모용 — 실제 보드는 <strong>1,000,000</strong>(~10ms). 누른 뒤 바운스가 흡수돼야 out이 바뀐다
              </div>
            </div>

            {/* 설계 코드 (구현부 잠금) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY10}`,
            }}>
              <RevealCodeModal
                title="debounce.v — 설계"
                accent={DAY10}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="2FF 동기화 + 카운터 안정화"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: 채터링 원리 + CDC 연결 + 파형 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY10}25`,
              borderTop: `3px solid ${DAY10}`, borderRadius: '10px',
              padding: '0.55rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>채터링 → 안정화</div>
              <svg width="100%" height="68" viewBox="0 0 320 68">
                <text x="2" y="18" fontSize="8.5" fontWeight="700" fill="#E53E3E" fontFamily={MONO}>raw</text>
                <path d="M34 28 H70 V10 H76 V24 H82 V10 H88 V24 H94 V10 H180 V26 H186 V12 H192 V26 H260 V28 H300"
                  stroke="#E53E3E" strokeWidth="1.4" fill="none" />
                <text x="2" y="56" fontSize="8.5" fontWeight="700" fill={DAY10} fontFamily={MONO}>clean</text>
                <path d="M34 60 H120 V42 H230 V60 H300" stroke={DAY10} strokeWidth="2.2" fill="none" />
                <text x="120" y="40" fontSize="7" fill={FPGA.textLight} fontFamily={MONO}>STABLE 만족 후 반영</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${CDC}0E, ${CDC}1C)`,
              border: `1px solid ${CDC}40`, borderLeft: `4px solid ${CDC}`,
              borderRadius: '10px', padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: CDC, marginBottom: '0.2rem' }}>
                CDC 연결 — 2FF 동기화 (Day 07~08)
              </div>
              <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.55 }}>
                버튼은 클럭과 무관한 <strong>비동기 입력</strong> → 바로 쓰면 메타안정 위험.
                <code>s0/s1</code> 2단 FF로 먼저 동기화한 뒤 디바운스 — Lint/CDC가 요구하는 그 패턴.
              </div>
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
                Visualizer 파형 — btn_in 글리치 흡수
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ToolImage src="/images/fpga/day10_debounce_wave.png" name="debounce 시뮬 파형" width="100%" height="100%" />
              </div>
              <div style={{ fontSize: '0.58rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.3rem' }}>
                day10_debounce_wave.png — 짧은 글리치는 흡수, STABLE 지속 시에만 btn_out 변화 (클릭 시 확대)
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
            보드 핀 제약 — <strong>clk(100MHz) · rst(BTN1) · btn_in(BTN0) · btn_out(LED)</strong>
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
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>Arty A7-35T Master 발췌 · clk · rst · btn_in · btn_out</span>
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
