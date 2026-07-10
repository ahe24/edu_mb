'use client';

import { useState, useEffect, useCallback } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import RevealCodeModal from '../RevealCodeModal';

const DAY13 = '#087F5B';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '7391';

const portsCode = `module sva_uart_tx #(
  parameter integer BIT_CLK = 16   // 1비트 = BIT_CLK 클럭
)(
  input wire clk, rst,
  input wire start, busy, tx       // DUT 포트만 관찰 (비침습)
);`;

const bodyShown = `  // P1. 요청 수락 — bounded response (pend 래치 → 다음 tick 경계 수락)
  A_START: assert property (@(posedge clk) disable iff (rst)
    (start && !busy) |-> ##[1:BIT_CLK+1] busy)
    else $error("A_START: start 후 busy 미상승");

  // P2. idle 라인 레벨 — 전송 중이 아니면 tx 는 항상 1
  A_IDLE: assert property (@(posedge clk) disable iff (rst)
    !busy |-> tx)
    else $error("A_IDLE: idle 인데 tx==0");

  // P3. 전송 시작 정합 — 라인 하강(start bit)은 전송 중에만
  A_FELL: assert property (@(posedge clk) disable iff (rst)
    $fell(tx) |-> busy)
    else $error("A_FELL: busy 없이 tx 하강");

  // P4. 수락 클럭엔 start bit(0) 구동
  A_ROSE: assert property (@(posedge clk) disable iff (rst)
    $rose(busy) |-> !tx)
    else $error("A_ROSE: busy 상승인데 tx!=0");

  // C1. 요청 발생 확인 — vacuous pass 방지 (Day14 커버리지 예고)
  C_REQ: cover property (@(posedge clk) disable iff (rst)
    start && !busy);
endmodule`;

// 0xA5 프레임 타임라인 (비트 슬롯 단위): idle · start · d0..d7 · stop · idle
const N = 12;
const TX_OK = [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1];
const BUSY_OK = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0];
const START_P = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const SLOT_LBL = ['idle', 'st', 'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'sp', 'idle'];

type Mode = 'ok' | 'bug';

type ChipStatus = { s: '대기' | '평가중' | 'pass' | 'fail' | 'vacuous' | 'cover'; at?: number };

function chipStatuses(mode: Mode, t: number): Record<string, ChipStatus> {
  if (mode === 'ok') {
    return {
      A_START: t >= 1 ? { s: 'pass', at: 1 } : t >= 0 ? { s: '평가중' } : { s: '대기' },
      A_IDLE: t >= 0 ? { s: 'pass' } : { s: '대기' },
      A_FELL: t >= 1 ? { s: 'pass', at: 1 } : { s: '대기' },
      A_ROSE: t >= 1 ? { s: 'pass', at: 1 } : { s: '대기' },
      C_REQ: t >= 0 ? { s: 'cover', at: 0 } : { s: '대기' },
    };
  }
  return {
    A_START: t >= 2 ? { s: 'fail', at: 2 } : t >= 0 ? { s: '평가중' } : { s: '대기' },
    A_IDLE: t >= 0 ? { s: 'pass' } : { s: '대기' },
    A_FELL: t >= 1 ? { s: 'vacuous' } : { s: '대기' },
    A_ROSE: t >= 1 ? { s: 'vacuous' } : { s: '대기' },
    C_REQ: t >= 0 ? { s: 'cover', at: 0 } : { s: '대기' },
  };
}

const CHIP_STYLE: Record<ChipStatus['s'], { c: string; label: string }> = {
  대기: { c: '#94A3B8', label: '대기' },
  평가중: { c: '#B45309', label: '평가중…' },
  pass: { c: '#48BB78', label: '✓ pass' },
  fail: { c: '#E53E3E', label: '✗ FAIL' },
  vacuous: { c: '#94A3B8', label: '평가 없음(vacuous)' },
  cover: { c: '#0891B2', label: '✓ covered' },
};

export default function SvaUartSlide() {
  const [t, setT] = useState(-1);           // 현재 슬롯 (-1 = 시작 전)
  const [mode, setMode] = useState<Mode>('ok');
  const [running, setRunning] = useState(false);

  const step = useCallback(() => {
    setT((v) => (v >= N - 1 ? v : v + 1));
  }, []);

  // 끝 슬롯 도달 시 인터벌만 멈춘다 — running 플래그는 ▶ 재생이 재무장
  useEffect(() => {
    if (!running || t >= N - 1) return;
    const id = setInterval(step, 620);
    return () => clearInterval(id);
  }, [running, t, step]);

  const active = running && t < N - 1;
  const reset = (m: Mode) => { setRunning(false); setMode(m); setT(-1); };

  const tx = mode === 'ok' ? TX_OK : Array(N).fill(1);
  const busy = mode === 'ok' ? BUSY_OK : Array(N).fill(0);
  const chips = chipStatuses(mode, t);

  // 파형 그리기 파라미터
  const X0 = 64, W = 32, ROWS = [{ name: 'start', sig: START_P, c: ORANGE }, { name: 'busy', sig: busy, c: '#4A6FA5' }, { name: 'tx', sig: tx, c: DAY13 }];

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · SVA 작성"
          title="uart_tx 프로토콜을 4개 속성으로 감시"
          subtitle="포트(start·busy·tx)만 관찰하는 checker — 프레임이 흐르는 동안 클럭마다 자동 평가"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.18fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 파형 + 속성 평가 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.45rem 0.55rem 0.3rem',
              boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              {/* 모드 토글 */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.1rem' }}>
                {([['ok', '정상 프레임 (0xA5)'], ['bug', '버그: 요청 무시 (busy 안 섬)']] as [Mode, string][]).map(([m, lbl]) => (
                  <button key={m} onClick={() => reset(m)} style={{
                    cursor: 'pointer', fontSize: '0.58rem', fontWeight: 800, fontFamily: MONO,
                    color: mode === m ? '#fff' : m === 'bug' ? '#E53E3E' : DAY13,
                    background: mode === m ? (m === 'bug' ? '#E53E3E' : DAY13) : 'transparent',
                    border: `1px solid ${m === 'bug' ? '#E53E3E' : DAY13}`,
                    borderRadius: '5px', padding: '2px 10px',
                  }}>{lbl}</button>
                ))}
              </div>

              <svg viewBox="0 0 470 190" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* 슬롯 눈금 + 현재 슬롯 하이라이트 */}
                {Array.from({ length: N }, (_, i) => (
                  <g key={i}>
                    {i === t && <rect x={X0 + i * W} y={8} width={W} height={150} fill={`${DAY13}10`} />}
                    <line x1={X0 + i * W} y1={12} x2={X0 + i * W} y2={158} stroke={FPGA.border} strokeWidth="0.5" />
                    <text x={X0 + i * W + W / 2} y={170} fontSize="6.5" fill={i <= t ? FPGA.text : '#B8C2CE'} textAnchor="middle" fontFamily={MONO}>{SLOT_LBL[i]}</text>
                  </g>
                ))}

                {/* 3행 파형 */}
                {ROWS.map((row, r) => {
                  const yHi = 22 + r * 48, yLo = yHi + 26;
                  const upto = Math.min(t, N - 1);
                  let d = '';
                  if (upto >= 0) {
                    d = `M${X0} ${row.sig[0] ? yHi : yLo}`;
                    let x = X0;
                    for (let i = 0; i <= upto; i++) {
                      const y = row.sig[i] ? yHi : yLo;
                      d += ` L${x} ${y} L${x + W} ${y}`;
                      x += W;
                    }
                  }
                  return (
                    <g key={row.name}>
                      <text x={X0 - 10} y={yLo - 8} fontSize="8" fontWeight="800" fill={row.c} textAnchor="end" fontFamily={MONO}>{row.name}</text>
                      <line x1={X0} y1={yLo + 4} x2={X0 + N * W} y2={yLo + 4} stroke={FPGA.border} strokeWidth="0.5" />
                      {d && <path d={d} stroke={row.c} strokeWidth="2" fill="none" />}
                    </g>
                  );
                })}

                {/* 평가 마커 */}
                {t >= 1 && mode === 'ok' && (
                  <g>
                    <circle cx={X0 + 1.5 * W} cy={152} r="7" fill="rgba(72,187,120,0.15)" stroke="#48BB78" strokeWidth="1.5" />
                    <text x={X0 + 1.5 * W} y={155} fontSize="7.5" fontWeight="800" fill="#48BB78" textAnchor="middle">✓</text>
                    <text x={X0 + 1.5 * W + 12} y={155} fontSize="6" fill="#48BB78" fontFamily={MONO}>P1·P3·P4</text>
                  </g>
                )}
                {t >= 2 && mode === 'bug' && (
                  <g>
                    <circle cx={X0 + 2.5 * W} cy={152} r="7" fill="rgba(229,62,62,0.14)" stroke="#E53E3E" strokeWidth="1.5" />
                    <text x={X0 + 2.5 * W} y={155} fontSize="7.5" fontWeight="800" fill="#E53E3E" textAnchor="middle">✗</text>
                    <text x={X0 + 2.5 * W + 12} y={155} fontSize="6" fill="#E53E3E" fontFamily={MONO}>A_START 윈도 만료</text>
                  </g>
                )}
                {t >= 0 && (
                  <g>
                    <circle cx={X0 + 0.5 * W} cy={152} r="7" fill="rgba(8,145,178,0.12)" stroke="#0891B2" strokeWidth="1.3" />
                    <text x={X0 + 0.5 * W} y={155} fontSize="6.5" fontWeight="800" fill="#0891B2" textAnchor="middle">C</text>
                  </g>
                )}
                <text x={X0 + N * W - 4} y={185} fontSize="6" fill={FPGA.textLight} textAnchor="end" fontFamily={MONO}>
                  ⚠ 1칸 = 1 baud bit 로 축약 (실제 평가는 clk 단위 · A_START 상한 = BIT_CLK+1 클럭)
                </text>
              </svg>

              {/* 컨트롤 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button onClick={() => { if (t >= N - 1) setT(-1); setRunning(true); }} style={{
                  cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                  color: '#fff', background: DAY13, border: 'none', borderRadius: '5px', padding: '3px 10px',
                }}>▶ 재생</button>
                <button onClick={() => setRunning(false)} style={{
                  cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                  color: '#fff', background: active ? '#E2574C' : '#C0C9D4', border: 'none', borderRadius: '5px', padding: '3px 10px',
                }}>⏸ 정지</button>
                <button onClick={() => { setRunning(false); step(); }} style={{
                  cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                  color: DAY13, background: 'transparent', border: `1px solid ${DAY13}`, borderRadius: '5px', padding: '3px 10px',
                }}>⏭ bit</button>
                <button onClick={() => reset(mode)} style={{
                  cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                  color: '#E2574C', background: 'transparent', border: '1px solid #E2574C', borderRadius: '5px', padding: '3px 10px',
                }}>rst</button>
              </div>
            </div>

            {/* 설계 코드 (구현부 잠금) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY13}`,
            }}>
              <RevealCodeModal
                title="sva_uart_tx.sv — 구현 대상"
                accent={DAY13}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="4속성 + cover 1 — ref_lab 은 property 블록 선언형(동일 의미)"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: 속성 평가 현황 + vacuous 경고 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${DAY13}25`,
              borderTop: `3px solid ${DAY13}`, borderRadius: '10px',
              padding: '0.55rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>
                속성 평가 현황 <span style={{ fontSize: '0.55rem', fontWeight: 600, color: FPGA.textLight }}>(파형 진행에 따라 갱신)</span>
              </div>
              {[
                { k: 'A_START', d: '(start && !busy) |-> ##[1:17] busy' },
                { k: 'A_IDLE', d: '!busy |-> tx' },
                { k: 'A_FELL', d: '$fell(tx) |-> busy' },
                { k: 'A_ROSE', d: '$rose(busy) |-> !tx' },
                { k: 'C_REQ', d: 'cover (start && !busy)' },
              ].map((p) => {
                const st = chips[p.k];
                const cs = CHIP_STYLE[st.s];
                return (
                  <div key={p.k} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.28rem 0.4rem', borderRadius: '6px', marginBottom: '0.18rem',
                    background: st.s === 'fail' ? 'rgba(229,62,62,0.07)' : st.s === 'pass' || st.s === 'cover' ? 'rgba(72,187,120,0.06)' : '#F8FAFC',
                    border: `1px solid ${st.s === 'fail' ? '#E53E3E40' : FPGA.border}`,
                  }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.dark, fontFamily: MONO, width: '58px', flexShrink: 0 }}>{p.k}</span>
                    <span style={{ fontSize: '0.56rem', color: FPGA.textLight, fontFamily: MONO, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.d}</span>
                    <span style={{
                      fontSize: '0.56rem', fontWeight: 800, color: cs.c, flexShrink: 0,
                      fontStyle: st.s === 'vacuous' ? 'italic' : 'normal', fontFamily: MONO,
                    }}>{cs.label}{st.at !== undefined && st.s !== 'cover' ? ` @${SLOT_LBL[st.at]}` : ''}</span>
                  </div>
                );
              })}
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${ORANGE}08, ${ORANGE}14)`,
              border: `1px solid ${ORANGE}35`, borderLeft: `4px solid ${ORANGE}`,
              borderRadius: '10px', padding: '0.5rem 0.85rem', boxShadow: shadow.card,
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#B45309', marginBottom: '0.15rem' }}>
                주의 — 공허한 통과 (vacuous pass)
              </div>
              <div style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.5 }}>
                선행조건이 한 번도 참이 안 되면 assertion 은 &ldquo;위반 0&rdquo;으로 통과 —
                검사가 실행됐다는 뜻이 아니다. <code>cover</code> 로 <strong>발생 자체</strong>를
                함께 집계해야 신뢰 가능 (버그 모드에서 A_FELL/A_ROSE 확인).
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY13}08, ${DAY13}15)`,
              border: `1px solid ${DAY13}30`, borderRadius: '8px', padding: '0.42rem 0.8rem',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: DAY13 }}>실행 · </span>
              <span style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.45, fontFamily: MONO }}>
                make sim → &ldquo;RESULT: PASS (SVA 0 violation)&rdquo; · 위반 시 $error 로 시각·위치 출력
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
