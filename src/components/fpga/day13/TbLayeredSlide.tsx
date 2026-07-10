'use client';

import { useState, useEffect, useCallback } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';
import RevealCodeModal from '../RevealCodeModal';
import ProvidedFileModal from '../ProvidedFileModal';

const DAY13 = '#087F5B';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '5824';

// TB 시나리오와 동일: b = 3C ^ (n*11)
const BYTES = [0x3c, 0x2d, 0x1e, 0x0f];
const hex = (v: number) => v.toString(16).toUpperCase().padStart(2, '0');

const portsCode = `module uart_driver #(
  parameter integer BIT_CLK = 16   // 1비트 = BIT_CLK 클럭
)(
  input  wire clk,
  output reg  rx_pin               // DUT 직렬 입력 (idle=1)
);`;

const bodyShown = `  initial rx_pin = 1'b1;           // idle 레벨

  task tx_bit(input v);            // 한 비트 = BIT_CLK 클럭 유지
    integer k;
    begin for (k=0;k<BIT_CLK;k=k+1) @(posedge clk) rx_pin = v; end
  endtask

  task send_byte(input [7:0] b);   // start + 8 data(LSB first) + stop
    integer i;
    begin
      tx_bit(1'b0);
      for (i=0;i<8;i=i+1) tx_bit(b[i]);
      tx_bit(1'b1);
    end
  endtask
endmodule`;

const tbTopCode = `// tb_top — 조립 + 시나리오만 (프로토콜 세부 없음)
uart_driver     #(.BIT_CLK(16)) u_drv (.clk(clk), .rx_pin(rx_pin));
uart_monitor    #(.BIT_CLK(16)) u_mon (.clk(clk), .rst(rst),
                  .tx_pin(tx_pin), .got(got),
                  .got_valid(got_valid), .frame_err(frame_err));
uart_scoreboard u_sb  (.clk(clk), .got(got),
                  .got_valid(got_valid), .frame_err(frame_err));

for (n = 0; n < NBYTES; n = n + 1) begin
  b = 8'h3C ^ (n * 8'h11);
  u_sb.push_exp(b);        // ① 기대값 등록
  u_drv.send_byte(b);      // ② 자극 주입 (계층 참조 태스크 호출)
end
u_sb.report(NBYTES);       // ③ RESULT: PASS/FAIL`;

const monitorFile = `// uart_monitor.sv — 관찰 전담 [제공]
// tx_pin 디코드 → got/got_valid/frame_err 보고. 판정하지 않음.
module uart_monitor #(
  parameter integer BIT_CLK = 16
)(
  input  wire       clk, rst,
  input  wire       tx_pin,
  output reg  [7:0] got,
  output reg        got_valid,   // 복원 완료 1클럭 펄스
  output reg        frame_err    // stop!=1 (got_valid 와 동시)
);
  integer i;

  initial begin
    got = 8'h00; got_valid = 1'b0; frame_err = 1'b0;
    @(negedge rst);
    forever begin
      @(negedge tx_pin);                             // start 검출
      repeat (BIT_CLK + BIT_CLK/2) @(posedge clk);   // 첫 data 중앙
      for (i = 0; i < 8; i = i + 1) begin
        got[i] = tx_pin;                             // LSB first
        if (i < 7) repeat (BIT_CLK) @(posedge clk);
      end
      repeat (BIT_CLK) @(posedge clk);               // stop 중앙
      frame_err <= (tx_pin !== 1'b1);
      got_valid <= 1'b1;
      @(posedge clk);
      got_valid <= 1'b0; frame_err <= 1'b0;
    end
  end
endmodule`;

const scoreboardFile = `// uart_scoreboard.sv — 판정 전담 [제공]
// push_exp(b) 로 기대값 등록, got_valid 마다 pop·비교, report() 최종 판정.
module uart_scoreboard (
  input  wire       clk,
  input  wire [7:0] got,
  input  wire       got_valid,
  input  wire       frame_err
);
  reg [7:0] q [0:63];                 // 기대값 queue
  integer   wr = 0, rd = 0, errors = 0;

  task push_exp(input [7:0] b);
    begin q[wr] = b; wr = wr + 1; end
  endtask

  always @(posedge clk) if (got_valid) begin
    if (frame_err) begin
      errors = errors + 1; $error("framing: STOP != 1 (got %h)", got);
    end
    if (rd >= wr) begin
      errors = errors + 1; $error("예상보다 많은 수신 (got %h)", got);
    end else begin
      if (got !== q[rd]) begin
        errors = errors + 1;
        $error("byte %0d: got %h exp %h", rd, got, q[rd]);
      end
      rd = rd + 1;
    end
  end

  task report(input integer nexp);
    begin
      if (errors == 0 && rd == nexp)
        $display(" RESULT: PASS  (%0d bytes, 0 mismatch)", rd);
      else
        $display(" RESULT: FAIL  (%0d error, rd=%0d/%0d)", errors, rd, nexp);
    end
  endtask
endmodule`;

// 진행 단계: 0 대기 · 1 push_exp · 2 drive · 3 echo · 4 decode · 5 compare
interface FlowState {
  idx: number;        // 현재 바이트 인덱스
  phase: number;      // 0..5
  exp: number[];      // scoreboard 기대값 queue
  done: number;       // 비교 완료 수
  finished: boolean;
}

const INIT: FlowState = { idx: 0, phase: 0, exp: [], done: 0, finished: false };

const PHASE_LABEL = ['대기 — ▶ 실행', 'push_exp(b) 기대값 등록', 'driver — send_byte(b) 주입', 'DUT — echo 통과', 'monitor — 디코드 got=b', 'scoreboard — pop·비교 ✓'];

export default function TbLayeredSlide() {
  const [st, setSt] = useState<FlowState>(INIT);
  const [running, setRunning] = useState(false);

  const step = useCallback(() => {
    setSt((s) => {
      if (s.finished) return s;
      const b = BYTES[s.idx];
      switch (s.phase) {
        case 0: return { ...s, phase: 1, exp: [...s.exp, b] };
        case 1: return { ...s, phase: 2 };
        case 2: return { ...s, phase: 3 };
        case 3: return { ...s, phase: 4 };
        case 4: return { ...s, phase: 5, exp: s.exp.slice(1), done: s.done + 1 };
        case 5:
          if (s.idx === BYTES.length - 1) return { ...s, finished: true };
          return { ...s, idx: s.idx + 1, phase: 1, exp: [...s.exp, BYTES[s.idx + 1]] };
        default: return s;
      }
    });
  }, []);

  // 완주(finished) 시 인터벌만 멈춘다 — running 플래그는 ▶ 실행이 재무장
  useEffect(() => {
    if (!running || st.finished) return;
    const id = setInterval(step, 720);
    return () => clearInterval(id);
  }, [running, st.finished, step]);

  const active = running && !st.finished;
  const b = BYTES[st.idx];
  const DIM = '#94A3B8';
  const lit = (on: boolean, c: string) => (on ? c : FPGA.border);

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · 계층화 TB"
          title="driver → DUT → monitor → scoreboard 조립"
          subtitle="바이트 하나가 계층을 타고 흐른다 — 기대값 등록 → 주입 → echo → 복원 → 비교"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.12fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 인터랙티브 흐름 + 구현 코드 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.45rem 0.55rem 0.3rem',
              boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.textLight, textAlign: 'center', marginBottom: '0.05rem' }}>
                <strong style={{ color: DAY13 }}>{PHASE_LABEL[st.finished ? 5 : st.phase]}</strong>
                {!st.finished && st.phase > 0 && <span> · byte 0x{hex(b)}</span>}
              </div>
              <svg viewBox="0 0 470 232" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                <defs>
                  <marker id="lay13" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                    <path d="M0 0 L5.5 3 L0 6 z" fill="#64748B" />
                  </marker>
                </defs>

                {/* driver */}
                <rect x="10" y="52" width="96" height="52" rx="8"
                  fill={st.phase === 2 ? 'rgba(74,111,165,0.16)' : '#FFF'}
                  stroke={lit(st.phase === 2, '#4A6FA5')} strokeWidth={st.phase === 2 ? 2.4 : 1.3} />
                <text x="58" y="73" fontSize="9" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>u_drv</text>
                <text x="58" y="88" fontSize="6.5" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>send_byte()</text>

                {/* DUT */}
                <rect x="176" y="44" width="118" height="68" rx="8"
                  fill={st.phase === 3 ? '#243250' : '#1A2235'}
                  stroke={st.phase === 3 ? DAY13 : '#1A2235'} strokeWidth={st.phase === 3 ? 2.4 : 1.3}
                  style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.25))' }} />
                <text x="235" y="72" fontSize="10" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily={MONO}>DUT</text>
                <text x="235" y="88" fontSize="7" fill="#9FB0CC" textAnchor="middle" fontFamily={MONO}>uart_loop (echo)</text>

                {/* monitor */}
                <rect x="364" y="52" width="96" height="52" rx="8"
                  fill={st.phase === 4 ? 'rgba(74,111,165,0.16)' : '#FFF'}
                  stroke={lit(st.phase === 4, '#4A6FA5')} strokeWidth={st.phase === 4 ? 2.4 : 1.3} />
                <text x="412" y="73" fontSize="9" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>u_mon</text>
                <text x="412" y="88" fontSize="6.5" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>
                  got={st.phase >= 4 && !st.finished ? `0x${hex(b)}` : '--'}
                </text>

                {/* 배선 */}
                <path d="M106 78 H176" stroke={st.phase === 2 ? DAY13 : '#CBD5E1'} strokeWidth={st.phase === 2 ? 2.2 : 1.4} markerEnd="url(#lay13)" />
                <text x="141" y="70" fontSize="6.5" fill={st.phase === 2 ? DAY13 : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>rx_pin</text>
                <path d="M294 78 H364" stroke={st.phase === 3 ? DAY13 : '#CBD5E1'} strokeWidth={st.phase === 3 ? 2.2 : 1.4} markerEnd="url(#lay13)" />
                <text x="329" y="70" fontSize="6.5" fill={st.phase === 3 ? DAY13 : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>tx_pin</text>

                {/* 움직이는 바이트 토큰 */}
                {!st.finished && st.phase >= 1 && st.phase <= 5 && (() => {
                  const pos: Record<number, { x: number; y: number }> = {
                    1: { x: 100, y: 168 },   // push_exp → queue 로
                    2: { x: 141, y: 78 },
                    3: { x: 235, y: 78 },
                    4: { x: 329, y: 78 },
                    5: { x: 300, y: 168 },   // 비교 지점
                  };
                  const p = pos[st.phase];
                  return (
                    <g style={{ transition: 'all 0.3s ease' }}>
                      <circle cx={p.x} cy={p.y - 14} r="12" fill={DAY13} opacity="0.9" />
                      <text x={p.x} y={p.y - 10} fontSize="7.5" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily={MONO}>{hex(b)}</text>
                    </g>
                  );
                })()}

                {/* scoreboard */}
                <rect x="120" y="150" width="240" height="66" rx="8"
                  fill={st.phase === 1 || st.phase === 5 ? `${ORANGE}14` : '#FFF'}
                  stroke={lit(st.phase === 1 || st.phase === 5, ORANGE)} strokeWidth={st.phase === 1 || st.phase === 5 ? 2.4 : 1.3} />
                <text x="136" y="168" fontSize="8.5" fontWeight="800" fill={ORANGE} fontFamily={MONO}>u_sb</text>
                <text x="136" y="180" fontSize="6.2" fill={FPGA.textLight} fontFamily={MONO}>exp queue</text>
                {/* queue 슬롯 4칸 */}
                {[0, 1, 2, 3].map((i) => {
                  const v = st.exp[i];
                  return (
                    <g key={i}>
                      <rect x={190 + i * 34} y={162} width="28" height="20" rx="4"
                        fill={v !== undefined ? `${ORANGE}18` : '#F4F6F9'}
                        stroke={v !== undefined ? ORANGE : FPGA.border} strokeWidth="1.1" />
                      <text x={204 + i * 34} y={176} fontSize="7.5" fontWeight="800"
                        fill={v !== undefined ? ORANGE : DIM} textAnchor="middle" fontFamily={MONO}>
                        {v !== undefined ? hex(v) : '·'}
                      </text>
                    </g>
                  );
                })}
                <text x="136" y="204" fontSize="6.8" fill={FPGA.text} fontFamily={MONO}>
                  비교 {st.done}/{BYTES.length} · errors 0
                </text>
                {(st.phase === 5 || st.finished) && (
                  <text x="330" y="204" fontSize="7.5" fontWeight="800" fill="#48BB78" fontFamily={MONO}>✓ match</text>
                )}

                {/* push_exp 경로 */}
                <path d="M58 104 V168 H120" stroke={st.phase === 1 ? DAY13 : '#CBD5E1'} strokeWidth={st.phase === 1 ? 2 : 1.2} fill="none" strokeDasharray="5 3" markerEnd="url(#lay13)" />
                <text x="62" y="140" fontSize="6.3" fill={st.phase === 1 ? DAY13 : FPGA.textLight} fontFamily={MONO}>push_exp</text>
                {/* monitor→scoreboard 경로 */}
                <path d="M412 104 V183 H360" stroke={st.phase === 5 ? ORANGE : '#CBD5E1'} strokeWidth={st.phase === 5 ? 2 : 1.2} fill="none" markerEnd="url(#lay13)" />
                <text x="418" y="140" fontSize="6.3" fill={st.phase === 5 ? ORANGE : FPGA.textLight} fontFamily={MONO}>got</text>

                {/* 최종 RESULT */}
                {st.finished && (
                  <g>
                    <rect x="380" y="154" width="80" height="28" rx="7" fill="rgba(72,187,120,0.14)" stroke="#48BB78" strokeWidth="2" />
                    <text x="420" y="172" fontSize="8.5" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily={MONO}>PASS (4/4)</text>
                  </g>
                )}
              </svg>

              {/* 컨트롤 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { if (st.finished) setSt(INIT); setRunning(true); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: DAY13,
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >▶ 실행</button>
                <button
                  onClick={() => setRunning(false)}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#fff', background: active ? '#E2574C' : '#C0C9D4',
                    border: 'none', borderRadius: '5px', padding: '3px 10px',
                  }}
                >⏸ 정지</button>
                <button
                  onClick={() => { setRunning(false); step(); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: DAY13, background: 'transparent',
                    border: `1px solid ${DAY13}`, borderRadius: '5px', padding: '3px 10px',
                  }}
                >⏭ step</button>
                <button
                  onClick={() => { setRunning(false); setSt(INIT); }}
                  style={{
                    cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                    color: '#E2574C', background: 'transparent',
                    border: '1px solid #E2574C', borderRadius: '5px', padding: '3px 10px',
                  }}
                >rst</button>
                <span style={{ fontSize: '0.6rem', fontFamily: MONO, fontWeight: 700, color: FPGA.dark, marginLeft: '0.2rem' }}>
                  byte {st.finished ? BYTES.length : st.idx + (st.phase > 0 ? 1 : 0)}/{BYTES.length}
                </span>
              </div>
            </div>

            {/* 설계 코드 (구현부 잠금) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY13}`,
            }}>
              <RevealCodeModal
                title="uart_driver.sv — 구현 대상"
                accent={DAY13}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="자극 주입 전담 — tx_bit()·send_byte() 태스크 모듈화"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: tb_top 시나리오 + 제공 파일 + 포인트 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: '#1A2235', borderRadius: '10px',
              padding: '0.5rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${ORANGE}`,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.6rem', color: ORANGE, fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '0.05em' }}>
                tb_top.sv — 조립 + 시나리오 (제공)
              </div>
              <VerilogCode code={tbTopCode} style={{ fontSize: '0.56rem', lineHeight: 1.42 }} />
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(74,111,165,0.05), rgba(74,111,165,0.12))',
              border: '1px solid rgba(74,111,165,0.30)', borderLeft: '4px solid #4A6FA5',
              borderRadius: '10px', padding: '0.5rem 0.85rem', boxShadow: shadow.card,
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4A6FA5', marginBottom: '0.15rem' }}>
                설계 핵심 — 계층 참조 태스크 호출
              </div>
              <div style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.5 }}>
                <code>u_drv.send_byte(b)</code> — 인스턴스 안의 태스크를 밖에서 호출.
                시나리오는 &ldquo;무엇을&rdquo;만 말하고, &ldquo;어떻게(파형)&rdquo;는 driver 가 안다.
                DUT 교체 = driver/monitor 교체, 시나리오·scoreboard 는 그대로.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
              <ProvidedFileModal
                filename="uart_monitor.sv"
                accent="#4A6FA5"
                hint={<>관찰 전담 — tx_pin 디코드 → <strong>got/got_valid</strong> 보고 (제공)</>}
                modalSubtitle="판정하지 않음 — 복원·보고만 (역할 분리)"
                code={monitorFile}
              />
              <ProvidedFileModal
                filename="uart_scoreboard.sv"
                accent={ORANGE}
                hint={<>판정 전담 — 기대값 queue 비교 · <strong>report()</strong> (제공)</>}
                modalSubtitle="push_exp → pop·비교 → RESULT: PASS/FAIL"
                code={scoreboardFile}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
