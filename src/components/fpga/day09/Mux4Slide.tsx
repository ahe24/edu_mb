'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';
import RevealCodeModal from '../RevealCodeModal';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '7710';

const DAY09 = '#2E8B57';
const ORANGE = '#E8913A';
const PURPLE = '#8B6FA5';  // sel 액센트
const MONO = '"JetBrains Mono", monospace';

// 4:1 MUX 데이터 입력 = 미리 정의한 4색 (sel 로 하나 선택)
const COLORS = [
  { sel: '00', name: 'R', label: '빨강', bits: '100', css: '#E53E3E' },
  { sel: '01', name: 'G', label: '초록', bits: '010', css: '#33CC6E' },
  { sel: '10', name: 'B', label: '파랑', bits: '001', css: '#4A90F2' },
  { sel: '11', name: 'W', label: '흰색', bits: '111', css: '#ECECEC' },
];

// ── 코드: 항상 보이는 포트 선언부 ──
const portsCode = `module mux4 (
  input  wire [1:0] sw,    // sw[1:0] = sel — 슬라이드 스위치로 색 선택
  output reg  [2:0] rgb    // 선택된 색 → RGB LED  ({R,G,B})
);`;

// 클릭 후: 구현부 공개
const bodyShown = `  always @* begin            // 조합논리 (클럭 없음)
    case (sw)                // 2비트로 4색 중 하나 선택
      2'd0: rgb = 3'b100;    // R 빨강
      2'd1: rgb = 3'b010;    // G 초록
      2'd2: rgb = 3'b001;    // B 파랑
      2'd3: rgb = 3'b111;    // W 흰색
      default: rgb = 3'b000; // 4조합이라 이미 full-case · default는 X/Z 안전망
    endcase
  end
endmodule`;

// ── XDC (모달) — sw · RGB LED ──
const xdcCode = `## ==================================================================
## Day 09 mux4 — arty.xdc (Arty A7-35T Master 발췌)
##   sw[1:0] = sel → SW0,SW1        rgb[2:0] → RGB LED LD0
## rgb[2:0] = {R, G, B}  (rgb[2]=R, rgb[1]=G, rgb[0]=B)
## 쓰지 않는 핀은 주석 처리해 이후 실습에서 계속 재사용.
## ==================================================================

## ── 슬라이드 스위치 SW0~SW3 (sel = sw[1:0]) ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports { sw[0] }];
set_property -dict { PACKAGE_PIN C11 IOSTANDARD LVCMOS33 } [get_ports { sw[1] }];
# set_property -dict { PACKAGE_PIN C10 IOSTANDARD LVCMOS33 } [get_ports { sw[2] }];
# set_property -dict { PACKAGE_PIN A10 IOSTANDARD LVCMOS33 } [get_ports { sw[3] }];

## ── RGB LED LD0 → rgb (선택된 색) ──
set_property -dict { PACKAGE_PIN G6  IOSTANDARD LVCMOS33 } [get_ports { rgb[2] }];  ;# LD0_R
set_property -dict { PACKAGE_PIN F6  IOSTANDARD LVCMOS33 } [get_ports { rgb[1] }];  ;# LD0_G
set_property -dict { PACKAGE_PIN E1  IOSTANDARD LVCMOS33 } [get_ports { rgb[0] }];  ;# LD0_B

## ── 단색 User LED / 추가 RGB LED — 미사용 (필요 시 활성화) ──
# set_property -dict { PACKAGE_PIN H5 IOSTANDARD LVCMOS33 } [get_ports { led[0] }];
# set_property -dict { PACKAGE_PIN G3 IOSTANDARD LVCMOS33 } [get_ports { rgb1[2] }]; ;# LD1_R ...`;

/** 실물형 슬라이드 스위치 — 클릭으로 토글 */
function SlideSwitch({ cx, cy, on, onToggle, idx }: { cx: number; cy: number; on: boolean; onToggle: () => void; idx: number }) {
  const knobX = on ? cx + 3 : cx - 15;
  return (
    <g onClick={onToggle} style={{ cursor: 'pointer' }}>
      <text x={cx - 25} y={cy + 3} fontSize="6.5" fontWeight="700" fill="#64748B" textAnchor="end" fontFamily={MONO}>SW{idx}</text>
      <rect x={cx - 20} y={cy - 10} width="40" height="20" rx="4" fill="#245A9E" stroke="#143468" strokeWidth="1" />
      <rect x={cx - 20} y={cy - 10} width="40" height="8" rx="4" fill="rgba(255,255,255,0.16)" />
      <rect x={cx - 16} y={cy - 5} width="32" height="10" rx="5" fill="#0E2547" />
      <rect x={knobX} y={cy - 7} width="12" height="14" rx="2.5" fill="#EDF2F7" stroke="#94A3B8" strokeWidth="0.8" />
      <rect x={knobX + 2.5} y={cy - 5} width="7" height="3" rx="1.5" fill="rgba(255,255,255,0.85)" />
      <text x={on ? cx - 9 : cx + 9} y={cy + 3} fontSize="7" fontWeight="800" fill="#DBE7F5" textAnchor="middle" fontFamily={MONO}>{on ? '1' : '0'}</text>
    </g>
  );
}

/** RGB SMD LED — on일 때 color 점등 */
function RgbLed({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="17" ry="13" fill={color} opacity="0.34" />
      <ellipse cx={cx} cy={cy} rx="10" ry="7" fill={color} opacity="0.42" />
      {[-5, 0, 5].map((dy, k) => (
        <g key={k}>
          <rect x={cx - 14} y={cy + dy - 1.5} width="4" height="3" rx="0.6" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.4" />
          <rect x={cx + 10} y={cy + dy - 1.5} width="4" height="3" rx="0.6" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.4" />
        </g>
      ))}
      <rect x={cx - 11} y={cy - 8} width="22" height="16" rx="2.5" fill="#F6F8FB" stroke="#C2C9D2" strokeWidth="0.9" />
      <rect x={cx - 7.5} y={cy - 4.5} width="15" height="9" rx="1.8" fill={color} stroke={color} strokeWidth="0.8" />
      <rect x={cx - 7.5} y={cy - 4.5} width="15" height="3" rx="1.4" fill="#FFFFFF" opacity="0.5" />
    </g>
  );
}

export default function Mux4Slide() {
  const [sw, setSw] = useState(0b10);   // 기본 sel=10 → B
  const [xdcOpen, setXdcOpen] = useState(false);

  const toggle = (i: number) => setSw((v) => v ^ (1 << i));
  const bit = (i: number) => (sw >> i) & 1;
  const s0 = bit(0) === 1;
  const s1 = bit(1) === 1;
  const sel = sw;                        // 0..3
  const cur = COLORS[sel];

  const DIM = '#4A5568';
  const selWire = cur.css;
  // 흰색은 헤더 강조색으로 너무 밝아 보정
  const accent = cur.css === '#ECECEC' ? PURPLE : cur.css;

  // 입력 행 y 좌표 — MUX 좌측 변(62~178)에 균등 간격(28)으로 연결
  const rowY = [78, 106, 134, 162];

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 3 · 오후 ① · 4:1 MUX"
          title="case 문 4:1 MUX — 스위치로 4색 골라 RGB LED"
          subtitle="sel 2비트로 미리 정의한 R·G·B·W 중 하나 선택 — 조합 always는 모든 경로에 출력을 줘야 한다"
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
                <strong style={{ color: PURPLE }}>sel</strong> 스위치 <strong style={{ color: DAY09 }}>클릭</strong> → 4색 중 하나가 <strong style={{ color: accent }}>RGB LED</strong> 로 출력
              </div>
              <svg viewBox="0 0 320 262" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* 데이터 입력 4색 swatch */}
                {COLORS.map((c, i) => {
                  const y = rowY[i];
                  const on = sel === i;
                  return (
                    <g key={c.sel}>
                      <rect x="12" y={y - 12} width="24" height="24" rx="5"
                        fill={c.css} stroke={on ? '#1A2235' : '#CBD5E0'} strokeWidth={on ? 2 : 1}
                        opacity={on ? 1 : 0.4} />
                      {on && <rect x="9" y={y - 15} width="30" height="30" rx="7" fill="none" stroke={c.css} strokeWidth="1.6" opacity="0.6" />}
                      <text x="24" y={y + 3} fontSize="9" fontWeight="800" textAnchor="middle"
                        fill={c.name === 'W' ? '#444' : '#fff'} fontFamily={MONO}>{c.name}</text>
                      <text x="44" y={y - 1} fontSize="6.5" fontWeight="700" fill={on ? FPGA.dark : '#A0AEC0'} fontFamily={MONO}>in{i} ({c.sel})</text>
                      <text x="44" y={y + 8} fontSize="6" fill={on ? FPGA.textLight : '#B8C2CE'} fontFamily={MONO}>{`3'b${c.bits}`}</text>
                      {/* 입력 → MUX 배선 (좌측 변에 균등 연결) */}
                      <path d={`M88 ${y} H128`} stroke={on ? c.css : DIM} strokeWidth={on ? 2.6 : 1.3} opacity={on ? 1 : 0.55} />
                      <circle cx="128" cy={y} r={on ? 2.6 : 1.8} fill={on ? c.css : DIM} opacity={on ? 1 : 0.55} />
                    </g>
                  );
                })}

                {/* MUX 사다리꼴 */}
                <path d="M128 62 L178 90 L178 165 L128 178 Z"
                  fill="rgba(139,111,165,0.12)" stroke={PURPLE} strokeWidth="1.8" strokeLinejoin="round" />
                <text x="150" y="116" fontSize="11" fontWeight="800" fill={PURPLE} textAnchor="middle" fontFamily={MONO}>4:1</text>
                <text x="150" y="130" fontSize="7.5" fontWeight="700" fill={PURPLE} textAnchor="middle" fontFamily={MONO}>MUX</text>

                {/* MUX 출력 → RGB LED */}
                <path d={`M178 127 H286`} stroke={selWire} strokeWidth="2.6" />
                <text x="222" y="120" fontSize="6.5" fontWeight="700" fill={FPGA.dark} fontFamily={MONO}>{`rgb = 3'b${cur.bits}`}</text>
                <RgbLed cx={300} cy={127} color={cur.css} />

                {/* sel 입력 — 좌측 하단 2줄 스위치 → 꺾은선으로 MUX 하단 진입 */}
                <text x="58" y="192" fontSize="6.5" fontWeight="800" fill={PURPLE} textAnchor="middle" fontFamily={MONO}>sel[1:0]</text>
                <path d="M78 208 H143 V174" fill="none" stroke={s0 ? PURPLE : DIM} strokeWidth="1.6" opacity={s0 ? 1 : 0.6} strokeLinejoin="round" />
                <path d="M78 232 H160 V170" fill="none" stroke={s1 ? PURPLE : DIM} strokeWidth="1.6" opacity={s1 ? 1 : 0.6} strokeLinejoin="round" />
                <circle cx="143" cy="174" r="2.2" fill={s0 ? PURPLE : DIM} opacity={s0 ? 1 : 0.6} />
                <circle cx="160" cy="170" r="2.2" fill={s1 ? PURPLE : DIM} opacity={s1 ? 1 : 0.6} />

                {/* 클릭 스위치 — 좌측 하단 2줄 (라벨은 본체 왼쪽 같은 줄) */}
                <SlideSwitch cx={58} cy={208} on={s0} onToggle={() => toggle(0)} idx={0} />
                <SlideSwitch cx={58} cy={232} on={s1} onToggle={() => toggle(1)} idx={1} />
              </svg>

              {/* 실시간 값 */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', fontSize: '0.64rem', fontFamily: MONO, fontWeight: 700 }}>
                <span style={{ color: PURPLE }}>sel={s1 ? 1 : 0}{s0 ? 1 : 0}</span>
                <span style={{ color: FPGA.textLight }}>→ 선택:</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: FPGA.dark }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: cur.css, border: '1px solid rgba(0,0,0,0.2)', display: 'inline-block' }} />
                  {cur.name} ({cur.label}) · rgb={cur.bits}
                </span>
              </div>
            </div>

            {/* 설계 코드 (구현부 숨김 토글) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY09}`,
            }}>
              <RevealCodeModal
                title="mux4.v — case 기반 설계"
                accent={DAY09}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="4:1 컬러 MUX · full-case"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: sel→색 표 + latch 교육 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              background: FPGA.white,
              border: `1px solid ${PURPLE}25`,
              borderTop: `3px solid ${PURPLE}`,
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.4rem' }}>
                sel → 선택 색 (case 매핑)
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem', fontFamily: MONO }}>
                <thead>
                  <tr style={{ color: FPGA.textLight }}>
                    <th style={{ textAlign: 'left', padding: '3px 6px' }}>sel</th>
                    <th style={{ textAlign: 'left', padding: '3px 6px' }}>색</th>
                    <th style={{ textAlign: 'left', padding: '3px 6px', color: DAY09 }}>rgb {'{R,G,B}'}</th>
                    <th style={{ padding: '3px 6px' }}>LED</th>
                  </tr>
                </thead>
                <tbody>
                  {COLORS.map((c, i) => {
                    const on = sel === i;
                    return (
                      <tr key={c.sel} style={{
                        borderTop: `1px solid ${FPGA.border}`,
                        background: on ? `${c.css}1A` : 'transparent',
                      }}>
                        <td style={{ padding: '3px 6px', fontWeight: on ? 800 : 600, color: on ? FPGA.dark : FPGA.text }}>
                          {on ? '▶ ' : ''}{c.sel}
                        </td>
                        <td style={{ padding: '3px 6px', color: FPGA.text }}>{c.name} · {c.label}</td>
                        <td style={{ padding: '3px 6px', color: FPGA.text }}>{c.bits}</td>
                        <td style={{ padding: '3px 6px', textAlign: 'center' }}>
                          <span style={{ display: 'inline-block', width: '15px', height: '15px', borderRadius: '50%', background: c.css, border: '1px solid rgba(0,0,0,0.15)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* full-case 포인트 */}
            <div style={{
              background: `linear-gradient(135deg, ${DAY09}07, ${DAY09}14)`,
              border: `1px solid ${DAY09}28`,
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: DAY09, marginBottom: '0.25rem' }}>full-case면 latch 없음</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.55 }}>
                <li>조합 <code>always @*</code> — 모든 입력 조합에 출력 대입 필요</li>
                <li><code>sel</code> 2비트 → <code>00·01·10·11</code> 4조합을 다 기술 = <strong>full-case</strong></li>
                <li>→ <code>default</code> 없어도 <strong>latch 안 생김</strong> (모든 값이 덮임)</li>
              </ul>
            </div>

            {/* latch 경고 (Day 06 연결) */}
            <div style={{
              flex: 1, minHeight: 0,
              background: `linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))`,
              border: '1px solid rgba(229,62,62,0.30)',
              borderLeft: '4px solid #E53E3E',
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E53E3E', marginBottom: '0.3rem' }}>
                latch는 “불완전 case”에서 — default의 진짜 역할 (Lint·Day 06)
              </div>
              <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.55 }}>
                일부 <code>sel</code> 조합의 <code>rgb</code> 대입을 빠뜨리고 <code>default</code> 도 없으면 → 미기술
                값에서 직전 값 유지 = <strong>latch</strong>. 4조합을 다 쓰면 latch는 없지만, <code>default</code> 는
                ① 향후 case 누락 ② <code>sel</code> 의 <strong>X/Z</strong> 시뮬을 방어 → safety-critical 권장.
              </div>
              <pre style={{
                margin: '0.4rem 0 0', fontSize: '0.58rem', lineHeight: 1.5,
                background: '#1A2235', color: '#FF9A9A',
                padding: '0.4rem 0.6rem', borderRadius: '5px',
                fontFamily: 'ui-monospace, monospace', whiteSpace: 'pre-wrap',
              }}>
{`// ✗ 불완전 case + default 없음
case (sw)
  2'd0: rgb = 3'b100;
  2'd1: rgb = 3'b010;   // 2'd2,2'd3 누락 → LATCH`}
              </pre>
            </div>
          </div>
        </div>

        {/* ── 하단: XDC 클릭 모달 트리거 ── */}
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
            보드 핀 제약 — <strong>슬라이드 스위치(sel) · RGB LED</strong> 매핑 (필요 없는 핀은 주석 처리해 재사용)
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '0.66rem', fontWeight: 800, color: ORANGE, flexShrink: 0 }}>📄 전체 보기 ▸</span>
        </button>
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
          <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>Arty A7-35T Master 발췌 · sw(sel) · RGB LED</span>
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
