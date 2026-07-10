'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import RevealCodeModal from '../RevealCodeModal';
import ProvidedFileModal from '../ProvidedFileModal';

const DAY13 = '#087F5B';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '2565';

const portsCode = `// bind — RTL 파일 무수정으로 checker 를 결합
module bind_uart_tx;`;

const bodyShown = `  // 'uart_tx 모듈의 모든 인스턴스' 내부에 checker 삽입.
  // 포트 연결명은 uart_tx 스코프에서 해석 → 내부 reg 도 접근.
  bind uart_tx sva_uart_tx_int #(.BIT_CLK(16)) u_sva (
    .clk   (clk),
    .rst   (rst),
    .tick  (tick),
    .start (start),
    .busy  (busy),
    .tx    (tx),
    .state (state),   // 내부 reg — bind 라서 접근 가능
    .idx   (idx)
  );
endmodule`;

const chkFile = `// sva_uart_tx_int.sv — 내부 관찰 checker [제공]
// $past(state) 정렬: Moore 등록 출력은 상태보다 1클럭 늦다.
module sva_uart_tx_int #(
  parameter integer BIT_CLK = 16
)(
  input wire       clk, rst, tick, start, busy, tx,
  input wire [1:0] state,          // bind 로 내부 reg 직접 관찰
  input wire [2:0] idx
);
  localparam [1:0] S_IDLE=2'd0, S_START=2'd1, S_DATA=2'd2, S_STOP=2'd3;
  integer sva_err = 0;

  // P5. START 상태는 start bit(0) 구동
  A_STARTBIT: assert property (@(posedge clk) disable iff (rst)
    ($past(state) == S_START) |-> !tx)
    else begin sva_err=sva_err+1; $error("A_STARTBIT"); end

  // P6. STOP 상태는 stop bit(1) 구동
  A_STOPBIT: assert property (@(posedge clk) disable iff (rst)
    ($past(state) == S_STOP) |-> tx)
    else begin sva_err=sva_err+1; $error("A_STOPBIT"); end

  // P7. 천이 합법성 — IDLE→START→DATA→STOP→IDLE 링만
  A_TRANS: assert property (@(posedge clk) disable iff (rst)
    !$stable(state) |->
      ($past(state)==S_IDLE  && state==S_START) ||
      ($past(state)==S_START && state==S_DATA ) ||
      ($past(state)==S_DATA  && state==S_STOP ) ||
      ($past(state)==S_STOP  && state==S_IDLE ))
    else begin sva_err=sva_err+1; $error("A_TRANS"); end

  // C2. 프레임 완주 확인
  C_STOP: cover property (@(posedge clk) disable iff (rst)
    state == S_STOP);

  final begin
    if (sva_err == 0) $display(" SVA(bind): 0 violation");
    else              $display(" SVA(bind): %0d violation", sva_err);
  end
endmodule`;

export default function BindSlide() {
  const [bound, setBound] = useState(false);

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · bind 결합"
          title="bind — RTL 무수정으로 내부까지 감시"
          subtitle="Day12 RTL도 TB도 한 줄 안 고친다 — bind 파일 하나로 checker 를 uart_tx 안에 삽입"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.12fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 계층 트리 + bind 삽입 애니메이션 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.45rem 0.55rem 0.35rem',
              boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.textLight, textAlign: 'center', marginBottom: '0.05rem' }}>
                <strong style={{ color: DAY13 }}>bind 적용</strong>을 눌러 checker 가 어디에 생기는지 확인
              </div>
              <svg viewBox="0 0 470 238" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                <defs>
                  <marker id="bind13" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                    <path d="M0 0 L5.5 3 L0 6 z" fill={DAY13} />
                  </marker>
                </defs>

                {/* tb 외곽 */}
                <rect x="8" y="10" width="330" height="220" rx="10" fill="#F7F9FC" stroke="#94A3B8" strokeWidth="1.3" />
                <text x="20" y="28" fontSize="8.5" fontWeight="800" fill="#64748B" fontFamily={MONO}>tb_uart_loop — Day12 TB 무수정</text>

                {/* dut 박스 */}
                <rect x="24" y="40" width="298" height="178" rx="8" fill="#FFFFFF" stroke="#4A6FA5" strokeWidth="1.4" />
                <text x="36" y="58" fontSize="8" fontWeight="800" fill="#4A6FA5" fontFamily={MONO}>dut : uart_loop — RTL 무수정</text>

                {/* 서브 인스턴스 */}
                {[
                  { x: 38, y: 70, w: 90, h: 34, t: 'u_b1·u_b16', d: 'baud_gen' },
                  { x: 38, y: 116, w: 90, h: 34, t: 'u_rx', d: 'uart_rx' },
                ].map((b) => (
                  <g key={b.t}>
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="6" fill="#F4F6F9" stroke={FPGA.border} strokeWidth="1.1" />
                    <text x={b.x + b.w / 2} y={b.y + 15} fontSize="7.5" fontWeight="800" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>{b.t}</text>
                    <text x={b.x + b.w / 2} y={b.y + 27} fontSize="6.3" fill="#94A3B8" textAnchor="middle" fontFamily={MONO}>{b.d}</text>
                  </g>
                ))}

                {/* u_tx — bind 대상 */}
                <rect x="152" y="70" width="156" height="136" rx="7"
                  fill={bound ? `${DAY13}08` : '#F4F6F9'}
                  stroke={bound ? DAY13 : FPGA.border} strokeWidth={bound ? 2 : 1.2} />
                <text x="230" y="88" fontSize="8" fontWeight="800" fill={bound ? DAY13 : FPGA.textLight} textAnchor="middle" fontFamily={MONO}>u_tx : uart_tx</text>
                <text x="230" y="102" fontSize="6.3" fill="#94A3B8" textAnchor="middle" fontFamily={MONO}>state · idx · sh (내부 reg)</text>

                {/* 삽입된 checker */}
                {bound && (
                  <g>
                    <rect x="166" y="116" width="128" height="74" rx="7" fill={`${DAY13}14`} stroke={DAY13} strokeWidth="1.8"
                      style={{ filter: `drop-shadow(0 2px 6px ${DAY13}50)` }} />
                    <text x="230" y="136" fontSize="7.8" fontWeight="800" fill={DAY13} textAnchor="middle" fontFamily={MONO}>u_sva</text>
                    <text x="230" y="150" fontSize="6.5" fill={DAY13} textAnchor="middle" fontFamily={MONO}>sva_uart_tx_int</text>
                    <text x="230" y="166" fontSize="6.2" fill={FPGA.text} textAnchor="middle" fontFamily={MONO}>A_STARTBIT · A_STOPBIT</text>
                    <text x="230" y="178" fontSize="6.2" fill={FPGA.text} textAnchor="middle" fontFamily={MONO}>A_TRANS · C_STOP</text>
                  </g>
                )}

                {/* bind 소스 박스 */}
                <rect x="360" y="70" width="100" height="60" rx="8"
                  fill={`${ORANGE}0E`} stroke={ORANGE} strokeWidth="1.5" />
                <text x="410" y="90" fontSize="7.5" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>bind_uart_tx</text>
                <text x="410" y="104" fontSize="6.3" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>bind 문 1개</text>
                <text x="410" y="116" fontSize="6.3" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>(별도 파일)</text>

                {/* bind 화살표 */}
                {bound && (
                  <path d="M360 110 Q 320 130, 296 140" stroke={DAY13} strokeWidth="2" fill="none" strokeDasharray="6 3" markerEnd="url(#bind13)" />
                )}
                <text x="402" y="150" fontSize="6.4" fill={bound ? DAY13 : '#B8C2CE'} textAnchor="middle" fontFamily={MONO}>
                  {bound ? '모든 uart_tx 인스턴스에 삽입' : '아직 미결합'}
                </text>

                {/* elaboration 명령 */}
                <rect x="360" y="168" width="100" height="50" rx="7" fill="#1A2235" />
                <text x="368" y="186" fontSize="6.2" fill="#F6AD55" fontFamily={MONO}>$ vopt tb_uart_loop \</text>
                <text x="376" y="198" fontSize="6.2" fill="#A8D8A8" fontFamily={MONO}>bind_uart_tx -o opt</text>
                <text x="368" y="212" fontSize="5.8" fill="#697A9B" fontFamily={MONO}>← 멀티-top 지정 필수</text>
              </svg>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                <button onClick={() => setBound(true)} style={{
                  cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                  color: bound ? '#1A2235' : '#fff', background: bound ? '#C0C9D4' : DAY13,
                  border: 'none', borderRadius: '5px', padding: '3px 12px',
                }}>bind 적용</button>
                <button onClick={() => setBound(false)} style={{
                  cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                  color: '#E2574C', background: 'transparent', border: '1px solid #E2574C', borderRadius: '5px', padding: '3px 12px',
                }}>해제</button>
              </div>
            </div>

            {/* bind 구문 (구현부 잠금) */}
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY13}`,
            }}>
              <RevealCodeModal
                title="bind_uart_tx.sv — 구현 대상"
                accent={DAY13}
                password={REVEAL_PW}
                portsCode={portsCode}
                fullCode={`${portsCode}\n${bodyShown}`}
                subtitle="bind <대상 모듈> <checker> <인스턴스명> (포트 연결)"
                inlineStyle={{ fontSize: '0.56rem', lineHeight: 1.4 }}
              />
            </div>
          </div>

          {/* ── 우: 왜 bind 인가 + $past 포인트 + 제공 checker ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${DAY13}25`,
              borderTop: `3px solid ${DAY13}`, borderRadius: '10px',
              padding: '0.55rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>왜 bind 인가 — safety-critical 3원칙</div>
              {[
                { t: '형상 불변', d: '검증 코드를 넣으려 RTL 을 고치면 검증 대상이 달라진다 — 소스 무수정 결합', c: DAY13 },
                { t: '일괄 적용', d: '모듈명 기준 결합 — 인스턴스가 몇 개든 전부 감시', c: '#4A6FA5' },
                { t: '내부 접근', d: '포트 연결명이 uart_tx 스코프에서 해석 — state·idx 내부 reg 관찰', c: '#8B6FA5' },
              ].map((x) => (
                <div key={x.t} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.22rem 0' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: x.c, marginTop: '6px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: x.c }}>{x.t}</span>
                    <span style={{ fontSize: '0.65rem', color: FPGA.text }}> — {x.d}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(74,111,165,0.05), rgba(74,111,165,0.12))',
              border: '1px solid rgba(74,111,165,0.30)', borderLeft: '4px solid #4A6FA5',
              borderRadius: '10px', padding: '0.5rem 0.85rem', boxShadow: shadow.card,
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4A6FA5', marginBottom: '0.15rem' }}>
                작성 핵심 — $past(state) 정렬
              </div>
              <div style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.5 }}>
                Moore 등록 출력은 상태 반영이 <strong>1클럭 늦다</strong>:
                tx(지금) = f(state 1클럭 전). 그래서 <code>state==S_STOP |-&gt; tx</code> 가 아니라
                <code> $past(state)==S_STOP |-&gt; tx</code> — 등록 출력 FSM SVA 의 표준 기법.
              </div>
            </div>

            <div style={{ flexShrink: 0 }}>
              <ProvidedFileModal
                filename="sva_uart_tx_int.sv"
                accent="#8B6FA5"
                hint={<>내부 관찰 checker — <strong>A_STARTBIT·A_STOPBIT·A_TRANS</strong> + C_STOP (제공)</>}
                modalSubtitle="$past(state) 정렬 · final 블록이 SVA(bind) 요약 출력"
                code={chkFile}
              />
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY13}08, ${DAY13}15)`,
              border: `1px solid ${DAY13}30`, borderRadius: '8px', padding: '0.42rem 0.8rem',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: DAY13 }}>확인 · </span>
              <span style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.45 }}>
                <code>make sim</code> → Day12 와 같은 <code>RESULT: PASS</code> 에
                <code> SVA(bind): 0 violation</code> 한 줄이 &ldquo;추가&rdquo;로 출력되면 성공.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
