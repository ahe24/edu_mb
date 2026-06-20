'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';
import RevealLock from '../RevealLock';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '2724';

const DAY09 = '#2E8B57';   // 단색 LED (led = sw) — 녹색
const ORANGE = '#E8913A';  // XDC 카드 액센트
const NCOL = '#2D6BE0';    // 반전출력 led_n — 녹색과 구분되는 파랑

// 항상 보이는 포트 선언부
const portsCode = `module sw_led (
  input  wire [3:0] sw,    // 슬라이드 스위치 SW0~SW3
  output wire [3:0] led,   // User LED LD4~LD7 — 통과
  output wire [3:0] led_n  // 반전 출력 (RGB 파랑) — 연산
);`;

// 클릭 전: 구현부 숨김
// 숨김 상태 — 줄 수를 구현부와 동일(4줄)하게 맞춰 창 높이 유지
const bodyHidden = `  // ⋯ 구현부 숨김 — [구현 보기 ▸] 클릭


endmodule`;

// 클릭 후: 구현부 공개
const bodyShown = `  // 조합논리: 클럭·레지스터 없음 — 입력이 바뀌면 즉시 반영
  assign led   = sw;       // 통과(pass-through): 배선만
  assign led_n = ~sw;      // 연산(compute): 비트 반전
endmodule`;

const xdcCode = `## Arty A7 master XDC 발췌 — sw·led 4비트 전부 할당
## ── 슬라이드 스위치 SW0~SW3 → sw[3:0] ──
set_property -dict { PACKAGE_PIN A8  IOSTANDARD LVCMOS33 } [get_ports {sw[0]}]
set_property -dict { PACKAGE_PIN C11 IOSTANDARD LVCMOS33 } [get_ports {sw[1]}]
set_property -dict { PACKAGE_PIN C10 IOSTANDARD LVCMOS33 } [get_ports {sw[2]}]
set_property -dict { PACKAGE_PIN A10 IOSTANDARD LVCMOS33 } [get_ports {sw[3]}]
## ── User LED LD4~LD7 → led[3:0] ──
set_property -dict { PACKAGE_PIN H5  IOSTANDARD LVCMOS33 } [get_ports {led[0]}]
set_property -dict { PACKAGE_PIN J5  IOSTANDARD LVCMOS33 } [get_ports {led[1]}]
set_property -dict { PACKAGE_PIN T9  IOSTANDARD LVCMOS33 } [get_ports {led[2]}]
set_property -dict { PACKAGE_PIN T10 IOSTANDARD LVCMOS33 } [get_ports {led[3]}]
## led_n[3:0] → RGB LED 파란채널 (E1/G4/H4/K2) — 단색 녹색과 색 구분`;

const MONO = '"JetBrains Mono", monospace';

/** 실물형 슬라이드 스위치 (Arty 보드 SW0~SW3 형상) — 클릭으로 토글 */
function SlideSwitch({ cx, cy, on, onToggle, idx }: { cx: number; cy: number; on: boolean; onToggle: () => void; idx: number }) {
  const knobX = on ? cx + 3 : cx - 15;
  return (
    <g onClick={onToggle} style={{ cursor: 'pointer' }}>
      <text x={cx} y={cy - 13} fontSize="6" fontWeight="700" fill="#64748B" textAnchor="middle" fontFamily={MONO}>SW{idx}</text>
      {/* 몸체 + 상단 하이라이트(입체감) */}
      <rect x={cx - 20} y={cy - 10} width="40" height="20" rx="4" fill="#245A9E" stroke="#143468" strokeWidth="1" />
      <rect x={cx - 20} y={cy - 10} width="40" height="8" rx="4" fill="rgba(255,255,255,0.16)" />
      {/* 슬라이드 트랙(눌린 홈) */}
      <rect x={cx - 16} y={cy - 5} width="32" height="10" rx="5" fill="#0E2547" />
      {/* 슬라이더 노브 */}
      <rect x={knobX} y={cy - 7} width="12" height="14" rx="2.5" fill="#EDF2F7" stroke="#94A3B8" strokeWidth="0.8" />
      <rect x={knobX + 2.5} y={cy - 5} width="7" height="3" rx="1.5" fill="rgba(255,255,255,0.85)" />
      {/* 단자 핀 */}
      <rect x={cx - 12} y={cy + 9} width="3" height="4" fill="#C9A227" />
      <rect x={cx + 9} y={cy + 9} width="3" height="4" fill="#C9A227" />
      {/* 상태값 */}
      <text x={on ? cx - 9 : cx + 9} y={cy + 3} fontSize="7" fontWeight="800" fill="#DBE7F5" textAnchor="middle" fontFamily={MONO}>{on ? '1' : '0'}</text>
    </g>
  );
}

/** NOT 게이트(인버터) 심볼 — 출력 HIGH면 파랑 발광 / LOW면 어둡게(칩 배경에 맞춤) */
function NotGate({ cx, cy, active }: { cx: number; cy: number; active: boolean }) {
  const lit = '#4A90F2';                          // 출력 HIGH (점등 파랑과 일치)
  const fill = active ? lit : '#2C3647';          // 비활성: 칩보다 살짝 밝은 어두운 면
  const stroke = active ? '#8FBBFF' : '#5C6A82';  // 비활성: 흐린 슬레이트 외곽선
  return (
    <g>
      {/* 활성 글로우 */}
      {active && <ellipse cx={cx - 2} cy={cy} rx="12" ry="9" fill={lit} opacity="0.25" />}
      <polygon points={`${cx - 10},${cy - 8} ${cx - 10},${cy + 8} ${cx + 5},${cy}`}
        fill={fill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx={cx + 8} cy={cy} r="3" fill={fill} stroke={stroke} strokeWidth="1.4" />
    </g>
  );
}

/** 단색 SMD 칩 LED (보드의 User LED) — High=밝게 점등 / Low=어둡게 소등 */
function ChipLed({ cx, cy, on }: { cx: number; cy: number; on: boolean }) {
  const lit = '#33CC6E';   // 점등(밝은 녹색)
  const off = '#27402F';   // 소등(어두운 녹색)
  return (
    <g>
      {/* 발광 글로우(점등 시) */}
      {on && <ellipse cx={cx} cy={cy} rx="14" ry="11" fill={lit} opacity="0.32" />}
      {on && <ellipse cx={cx} cy={cy} rx="8.5" ry="7.5" fill={lit} opacity="0.42" />}
      {/* 메탈 단자(양 끝) */}
      <rect x={cx - 10} y={cy - 5} width="4" height="10" rx="1" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.5" />
      <rect x={cx + 6} y={cy - 5} width="4" height="10" rx="1" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.5" />
      {/* 세라믹 패키지(점등 시 살짝 밝게) */}
      <rect x={cx - 7} y={cy - 6} width="14" height="12" rx="2" fill={on ? '#F1F4F8' : '#E5E9EE'} stroke="#C2C9D2" strokeWidth="0.8" />
      {/* 발광부 */}
      <rect x={cx - 4.5} y={cy - 3.6} width="9" height="7.2" rx="1.5" fill={on ? lit : off} stroke={on ? lit : '#37503F'} strokeWidth="0.6" />
      <rect x={cx - 4.5} y={cy - 3.6} width="9" height="2.6" rx="1.2" fill="#FFFFFF" opacity={on ? 0.55 : 0.08} />
    </g>
  );
}

/** RGB SMD LED (직사각 다단자 패키지) — 반전 출력: Low일 때 밝은 파랑 점등 */
function RgbLed({ cx, cy, on }: { cx: number; cy: number; on: boolean }) {
  const lit = '#4A90F2';   // 점등(밝은 파랑)
  const off = '#24314E';   // 소등(어두운 파랑)
  return (
    <g>
      {/* 발광 글로우(점등 시) */}
      {on && <ellipse cx={cx} cy={cy} rx="14.5" ry="11.5" fill={lit} opacity="0.32" />}
      {on && <ellipse cx={cx} cy={cy} rx="9" ry="6" fill={lit} opacity="0.42" />}
      {/* 좌·우 3단자(총 6핀) */}
      {[-4.5, 0, 4.5].map((dy, k) => (
        <g key={k}>
          <rect x={cx - 12.5} y={cy + dy - 1.4} width="3.5" height="2.8" rx="0.6" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.4" />
          <rect x={cx + 9} y={cy + dy - 1.4} width="3.5" height="2.8" rx="0.6" fill="#AEB7C4" stroke="#8A93A1" strokeWidth="0.4" />
        </g>
      ))}
      {/* 흰색 직사각 패키지 (가로형) — 점등 시 살짝 밝게 */}
      <rect x={cx - 9.5} y={cy - 7} width="19" height="14" rx="2" fill={on ? '#F6F8FB' : '#E6EAF1'} stroke="#C2C9D2" strokeWidth="0.8" />
      {/* 직사각 발광창 */}
      <rect x={cx - 6.5} y={cy - 4} width="13" height="8" rx="1.6" fill={on ? lit : off} stroke={on ? lit : '#34425F'} strokeWidth="0.7" />
      <rect x={cx - 6.5} y={cy - 4} width="13" height="2.8" rx="1.3" fill="#FFFFFF" opacity={on ? 0.5 : 0.08} />
    </g>
  );
}

export default function ComboBasicsSlide() {
  const [sw, setSw] = useState(0b1010);
  const [revealed, setRevealed] = useState(false);

  const toggle = (i: number) => setSw((v) => v ^ (1 << i));
  const bit = (v: number, i: number) => (v >> i) & 1;
  const bin = (v: number) => v.toString(2).padStart(4, '0');
  const ledN = ~sw & 0xf;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 1 · 오전 ① · 조합논리 첫걸음"
          title="sw → LED · assign 한 줄의 설계"
          subtitle="입력이 바뀌면 출력이 즉시 따라가는 조합논리 — 가장 단순한 RTL"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.75rem' }}>
          {/* 좌: 개념 + 인터랙티브 다이어그램 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: `linear-gradient(135deg, ${DAY09}07, ${DAY09}14)`,
              border: `1px solid ${DAY09}28`,
              borderRadius: '10px',
              padding: '0.6rem 0.85rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: DAY09, marginBottom: '0.3rem' }}>조합논리란</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li><code>assign</code> / <code>always @*</code> — 클럭·레지스터 없음</li>
                <li>입력 변화 → 출력 즉시 (조합 지연만)</li>
                <li>모든 입력 조합에 출력이 <strong>정의</strong>돼야 함</li>
              </ul>
            </div>

            {/* 인터랙티브 다이어그램 */}
            <div style={{
              flex: 1,
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.5rem 0.6rem 0.35rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.textLight, textAlign: 'center', marginBottom: '0.1rem' }}>
                스위치 <strong style={{ color: DAY09 }}>클릭</strong> → 내부에서 <strong style={{ color: DAY09 }}>led 직결</strong> · <strong style={{ color: NCOL }}>led_n 인버터 통과</strong>
              </div>
              <svg viewBox="0 0 318 252" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* ── FPGA 칩 패키지 ── */}
                <rect x="80" y="30" width="146" height="210" rx="10" fill="#232C3D" stroke="#3D4A63" strokeWidth="1.2" />
                {/* 상·하단 장식 핀(IC 패키지 느낌) */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
                  <g key={`pin${k}`}>
                    <rect x={94 + k * 16} y="27" width="6" height="4" rx="1" fill="#C9A227" />
                    <rect x={94 + k * 16} y="239" width="6" height="4" rx="1" fill="#C9A227" />
                  </g>
                ))}
                <circle cx="92" cy="44" r="2.5" fill="#4A6FA5" />
                <text x="153" y="47" fontSize="9.5" fontWeight="700" fill="#9FB3C8" textAnchor="middle" letterSpacing="0.08em" fontFamily={MONO}>FPGA</text>

                {[0, 1, 2, 3].map((i) => {
                  const yc = 64 + i * 52;
                  const ledY = yc - 11;
                  const ledNY = yc + 11;
                  const on = bit(sw, i) === 1;
                  // 배선 색 = 그 선이 운반하는 논리값. HIGH=밝게(구동 LED 점등색과 일치) / LOW=어둡고 흐리게
                  const raw = on ? '#33CC6E' : '#535C6B';       // 입력·분기 net (= sw)
                  const ledWire = on ? '#33CC6E' : '#535C6B';   // led 직결 경로 (= sw)
                  const ledNWire = !on ? '#4A90F2' : '#535C6B'; // led_n 인버터 출력 경로 (= ~sw)
                  return (
                    <g key={i}>
                      {/* 슬라이드 스위치 → 칩 입력 배선 */}
                      <path d={`M46 ${yc} H72`} stroke={raw} strokeWidth="1.6" />
                      <text x="58" y={yc - 5} fontSize="6" fill="#94A3B8" textAnchor="middle" fontFamily={MONO}>sw[{i}]</text>
                      {/* 입력 핀(골드) */}
                      <rect x="72" y={yc - 2.5} width="8" height="5" rx="1" fill="#C9A227" />
                      {/* 내부: 입력 → 분기 노드 */}
                      <path d={`M80 ${yc} H92`} stroke={raw} strokeWidth="1.6" />
                      <path d={`M92 ${ledY} V${ledNY}`} stroke={raw} strokeWidth="1.6" />
                      <circle cx="92" cy={yc} r="2.2" fill={raw} />

                      {/* led: 그대로 직결 */}
                      <path d={`M92 ${ledY} H218`} stroke={ledWire} strokeWidth="1.6" />

                      {/* led_n: 인버터 통과 */}
                      <path d={`M92 ${ledNY} H136`} stroke={raw} strokeWidth="1.6" />
                      <NotGate cx={146} cy={ledNY} active={!on} />
                      <path d={`M157 ${ledNY} H218`} stroke={ledNWire} strokeWidth="1.6" />

                      {/* 출력 핀(골드) */}
                      <rect x="218" y={ledY - 2.5} width="8" height="5" rx="1" fill="#C9A227" />
                      <rect x="218" y={ledNY - 2.5} width="8" height="5" rx="1" fill="#C9A227" />
                      {/* 출력 포트 이름 */}
                      <text x="229" y={ledY - 4} fontSize="6.5" fontWeight="700" fill={DAY09} fontFamily={MONO}>led[{i}]</text>
                      <text x="229" y={ledNY - 4} fontSize="6.5" fontWeight="700" fill={NCOL} fontFamily={MONO}>led_n[{i}]</text>

                      {/* 출력 포트 → LED 배선 */}
                      <path d={`M226 ${ledY} H289`} stroke={ledWire} strokeWidth="1.6" />
                      <path d={`M226 ${ledNY} H289`} stroke={ledNWire} strokeWidth="1.6" />

                      {/* 실물형 SMD LED — led(단색·녹색) / led_n(RGB·파랑) */}
                      <ChipLed cx={296} cy={ledY} on={on} />
                      <RgbLed cx={296} cy={ledNY} on={!on} />
                    </g>
                  );
                })}

                {/* 클릭 가능한 슬라이드 스위치(맨 위에 렌더) */}
                {[0, 1, 2, 3].map((i) => (
                  <SlideSwitch key={`sw${i}`} cx={26} cy={64 + i * 52} on={bit(sw, i) === 1} onToggle={() => toggle(i)} idx={i} />
                ))}
              </svg>

              {/* 실시간 값 표시 */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.7rem', fontSize: '0.64rem', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 }}>
                <span style={{ color: '#4A6FA5' }}>sw={bin(sw)}</span>
                <span style={{ color: DAY09 }}>led={bin(sw)}</span>
                <span style={{ color: NCOL }}>led_n={bin(ledN)}</span>
              </div>
            </div>
          </div>

          {/* 우: 코드 + XDC + 힌트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.6rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY09}`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem',
                userSelect: 'none', WebkitUserSelect: 'none',
              }}>
                <span style={{ fontSize: '0.6rem', color: DAY09, fontWeight: 800, letterSpacing: '0.05em' }}>
                  sw_led.v — 설계
                </span>
                <RevealLock
                  revealed={revealed}
                  onReveal={() => setRevealed(true)}
                  onHide={() => setRevealed(false)}
                  password={REVEAL_PW}
                  accent={DAY09}
                />
              </div>
              <VerilogCode code={`${portsCode}\n${revealed ? bodyShown : bodyHidden}`} style={{ fontSize: '0.66rem', lineHeight: 1.5 }} />
            </div>

            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.6rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${ORANGE}`,
            }}>
              <div style={{ fontSize: '0.6rem', color: ORANGE, fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                arty.xdc — 보드 핀 연결 (sw·led 4비트 전부)
              </div>
              <VerilogCode code={xdcCode} style={{ fontSize: '0.54rem', lineHeight: 1.42 }} />
            </div>

            {/* 힌트 */}
            <div style={{
              marginTop: 'auto',
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
              border: `1px solid ${FPGA.accent}30`,
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.accent, flexShrink: 0 }}>HINT</span>
              <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>
                시뮬에서는 XDC가 필요 없다. 핀 연결은 <strong>Vivado 합성·보드 단계(Day 16)</strong>에서만 사용.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
