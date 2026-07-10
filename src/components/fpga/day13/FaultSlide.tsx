'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import RevealCodeModal from '../RevealCodeModal';

const DAY13 = '#087F5B';
const ORANGE = '#E8913A';
const RED = '#E53E3E';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '6148';

const portsCode = `// uart_tx_bug.v — \`ifdef 로 결함 2종 선택 주입 (인터페이스 동일)
module uart_tx (
  input  wire       clk, rst,
  input  wire       tick, start,
  input  wire [7:0] data,
  output reg        tx, busy
);`;

const bodyShown = `\`ifdef BUG_ORDER
      // [BUG] MSB first 송신 — 값은 깨지지만 타이밍은 정상
      DATA:  begin tx<=sh[7];
               if (tick) begin sh<={sh[6:0], 1'b0};
                 if (idx!=3'd7) idx<=idx+1'b1; end end
\`else
      DATA:  begin tx<=sh[0];                // LSB first (정상)
               if (tick) begin sh<={1'b0, sh[7:1]};
                 if (idx!=3'd7) idx<=idx+1'b1; end end
\`endif

\`ifdef BUG_STOP
      // [BUG] stop bit 을 0 으로 구동 — framing 위반
      STOP:  tx<=1'b0;
\`else
      STOP:  tx<=1'b1;                       // stop bit (정상)
\`endif`;

type Mode = 'ok' | 'order' | 'stop';

const RESULT: Record<Mode, {
  cmd: string;
  lines: { t: string; c: string }[];
  sb: 'PASS' | 'FAIL';
  sva: 'PASS' | 'FAIL';
  note: string;
}> = {
  ok: {
    cmd: 'make sim',
    lines: [
      { t: ' RESULT: PASS  (8 bytes, 0 mismatch)', c: '#A8E6A8' },
      { t: ' SVA(bind): 0 violation', c: '#A8E6A8' },
    ],
    sb: 'PASS', sva: 'PASS',
    note: '기준선 — 결함 없으면 두 판정 모두 통과해야 한다.',
  },
  order: {
    cmd: 'make bug1   # +define+BUG_ORDER',
    lines: [
      { t: '** Error: byte 1: got b4 exp 2d', c: '#FF7B72' },
      { t: '** Error: byte 2: got 78 exp 1e  (외 4건)', c: '#FF7B72' },
      { t: ' RESULT: FAIL  (6 error, rd=8/8)', c: '#FF7B72' },
      { t: ' SVA(bind): 0 violation', c: '#A8E6A8' },
    ],
    sb: 'FAIL', sva: 'PASS',
    note: '값 결함은 scoreboard 만 잡는다 — SVA 는 프로토콜 전담이라 통과.',
  },
  stop: {
    cmd: 'make bug2   # +define+BUG_STOP',
    lines: [
      { t: '** Error: A_STOPBIT: STOP 인데 tx!=1', c: '#FF7B72' },
      { t: '** Error: framing: STOP != 1 (외 7건)', c: '#FF7B72' },
      { t: ' RESULT: FAIL  (8 error, rd=8/8)', c: '#FF7B72' },
      { t: ' SVA(bind): 8 violation', c: '#FF7B72' },
    ],
    sb: 'FAIL', sva: 'FAIL',
    note: '프로토콜 결함은 둘 다 잡는다 — SVA 가 위반 속성·시각을 즉시 지목.',
  },
};

const Chip = ({ ok, label }: { ok: boolean; label: string }) => (
  <span style={{
    fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
    color: ok ? '#2F855A' : RED,
    background: ok ? 'rgba(72,187,120,0.12)' : 'rgba(229,62,62,0.10)',
    border: `1px solid ${ok ? '#48BB78' : RED}55`,
    padding: '2px 8px', borderRadius: '5px',
  }}>{label}</span>
);

export default function FaultSlide() {
  const [mode, setMode] = useState<Mode>('ok');
  const r = RESULT[mode];

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · 검출력 확인"
          title="버그를 심어 TB를 시험한다 — fault injection"
          subtitle="버그를 못 잡는 TB는 없는 것과 같다 — 실습1 TB + 실습3 SVA를 그대로 두고 uart_tx만 결함판으로 교체"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 재사용 조립도 + 결함 코드 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.5rem 0.6rem',
              boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>
                검증 환경은 재사용 — 바꾸는 건 DUT 한 조각뿐
              </div>
              <svg viewBox="0 0 440 176" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* 재사용 TB 외곽 */}
                <rect x="8" y="10" width="424" height="158" rx="10" fill="#F7F9FC" stroke={DAY13} strokeWidth="1.4" strokeDasharray="6 4" />
                <text x="22" y="28" fontSize="8" fontWeight="800" fill={DAY13} fontFamily={MONO}>실습1 tb_top + 실습3 bind SVA — 무수정 재사용</text>

                {[
                  { x: 24, y: 44, w: 92, t: 'u_drv', d: 'driver' },
                  { x: 24, y: 92, w: 92, t: 'u_mon·u_sb', d: 'monitor·scoreboard' },
                ].map((b) => (
                  <g key={b.t}>
                    <rect x={b.x} y={b.y} width={b.w} height={38} rx="6" fill={`${DAY13}0A`} stroke={DAY13} strokeWidth="1.2" />
                    <text x={b.x + b.w / 2} y={b.y + 17} fontSize="7.2" fontWeight="800" fill={DAY13} textAnchor="middle" fontFamily={MONO}>{b.t}</text>
                    <text x={b.x + b.w / 2} y={b.y + 30} fontSize="6" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>{b.d}</text>
                  </g>
                ))}

                {/* DUT with 교체 부위 */}
                <rect x="150" y="44" width="160" height="112" rx="8" fill="#FFFFFF" stroke="#4A6FA5" strokeWidth="1.4" />
                <text x="230" y="62" fontSize="7.8" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>dut : uart_loop</text>
                <rect x="164" y="72" width="60" height="30" rx="5" fill="#F4F6F9" stroke={FPGA.border} strokeWidth="1" />
                <text x="194" y="90" fontSize="6.4" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>baud·rx</text>
                <rect x="236" y="72" width="60" height="72" rx="5"
                  fill={mode === 'ok' ? '#F4F6F9' : `${RED}10`}
                  stroke={mode === 'ok' ? FPGA.border : RED} strokeWidth={mode === 'ok' ? 1 : 2} />
                <text x="266" y="92" fontSize="6.6" fontWeight="800" fill={mode === 'ok' ? FPGA.textLight : RED} textAnchor="middle" fontFamily={MONO}>u_tx</text>
                <text x="266" y="106" fontSize="5.8" fill={mode === 'ok' ? '#94A3B8' : RED} textAnchor="middle" fontFamily={MONO}>uart_tx_bug.v</text>
                <text x="266" y="120" fontSize="6.6" fontWeight="800" fill={mode === 'ok' ? '#94A3B8' : RED} textAnchor="middle" fontFamily={MONO}>
                  {mode === 'ok' ? '(정상)' : mode === 'order' ? '💉 MSB first' : '💉 stop=0'}
                </text>
                {/* bind checker */}
                <rect x="236" y="150" width="60" height="0" rx="0" fill="none" />
                <rect x="318" y="72" width="100" height="46" rx="6" fill="#8B6FA512" stroke="#8B6FA5" strokeWidth="1.2" />
                <text x="368" y="90" fontSize="6.8" fontWeight="800" fill="#8B6FA5" textAnchor="middle" fontFamily={MONO}>u_sva (bind)</text>
                <text x="368" y="104" fontSize="5.8" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>A_STOPBIT 등 3속성</text>
                <path d="M318 95 H296" stroke="#8B6FA5" strokeWidth="1.4" strokeDasharray="4 2" />

                {/* flist 교체 표기 */}
                <rect x="150" y="126" width="80" height="0" fill="none" />
                <text x="230" y="150" fontSize="6.2" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>flist.f 에서 uart_tx.v → uart_tx_bug.v 교체</text>
              </svg>

              {/* 명령 */}
              <div style={{
                background: '#1A2235', borderRadius: '6px', padding: '0.3rem 0.6rem',
                fontFamily: MONO, fontSize: '0.6rem', color: '#A8D8A8',
              }}>
                <span style={{ color: '#F6AD55', fontWeight: 700 }}>$ </span>{r.cmd}
              </div>
            </div>

            {/* 결함 코드 (잠금 — 먼저 파형으로 원인 추적 후 열람) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${RED}`,
            }}>
              <RevealCodeModal
                title="uart_tx_bug.v — 주입 결함 (진단 후 열람)"
                accent={ORANGE}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="`ifdef BUG_ORDER / BUG_STOP — +define 컴파일 옵션으로 선택"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: 결함 선택 + 검출 결과 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            {/* 모드 선택 */}
            <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
              {([
                ['ok', '정상', DAY13],
                ['order', 'BUG_ORDER', RED],
                ['stop', 'BUG_STOP', RED],
              ] as [Mode, string, string][]).map(([m, lbl, c]) => (
                <button key={m} onClick={() => setMode(m)} style={{
                  flex: 1, cursor: 'pointer', fontSize: '0.62rem', fontWeight: 800, fontFamily: MONO,
                  color: mode === m ? '#fff' : c,
                  background: mode === m ? c : 'transparent',
                  border: `1.5px solid ${c}`, borderRadius: '6px', padding: '4px 0',
                  boxShadow: mode === m ? shadow.card : 'none',
                }}>{lbl}</button>
              ))}
            </div>

            {/* 콘솔 출력 */}
            <div style={{
              background: '#0F1626', borderRadius: '10px', padding: '0.55rem 0.8rem',
              boxShadow: shadow.card, border: '1px solid #2C3850', flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.58rem', color: '#7C90B0', fontFamily: MONO, marginBottom: '0.25rem' }}>Transcript</div>
              {r.lines.map((l) => (
                <div key={l.t} style={{ fontSize: '0.62rem', fontFamily: MONO, color: l.c, lineHeight: 1.6, whiteSpace: 'pre' }}>{l.t}</div>
              ))}
            </div>

            {/* 검출 매트릭스 */}
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.5rem 0.7rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>검출 매트릭스 — 상호 보완 확인</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginBottom: '0.4rem' }}>
                <div style={{
                  border: `1px solid ${ORANGE}35`, borderTop: `3px solid ${ORANGE}`, borderRadius: '8px',
                  padding: '0.4rem 0.6rem', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#B45309', marginBottom: '0.2rem' }}>scoreboard (값)</div>
                  <Chip ok={r.sb === 'PASS'} label={r.sb === 'PASS' ? '✓ PASS' : '✗ FAIL — 검출!'} />
                </div>
                <div style={{
                  border: '1px solid #8B6FA535', borderTop: '3px solid #8B6FA5', borderRadius: '8px',
                  padding: '0.4rem 0.6rem', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#8B6FA5', marginBottom: '0.2rem' }}>bind SVA (프로토콜)</div>
                  <Chip ok={r.sva === 'PASS'} label={r.sva === 'PASS' ? '✓ 0 violation' : '✗ 위반 — 검출!'} />
                </div>
              </div>
              <div style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.5 }}>{r.note}</div>
            </div>

            {/* palindrome 인사이트 */}
            <div style={{
              background: `linear-gradient(135deg, ${ORANGE}08, ${ORANGE}14)`,
              border: `1px solid ${ORANGE}35`, borderLeft: `4px solid ${ORANGE}`,
              borderRadius: '10px', padding: '0.5rem 0.85rem', boxShadow: shadow.card,
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#B45309', marginBottom: '0.12rem' }}>
                관찰 — bug1 에서 8바이트 중 2개는 &ldquo;통과&rdquo;한다
              </div>
              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.5 }}>
                <code>0x3C</code>·<code>0x5A</code> 는 비트열 좌우대칭 — MSB 반전 버그가 안 보인다.
                자극 패턴이 우연히 결함을 가리는 실례 → <strong>자극 다양성과 커버리지</strong>가 필요한 이유 (Day 14).
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
