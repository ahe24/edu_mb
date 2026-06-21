'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY12 = '#177E89';

const code = `module tb_uart_loop;                  // DUT = 보드 top, rx_pin/tx_pin 2핀만
  localparam CLK_HZ=160, BAUD=10, BIT_CLK=16, NBYTES=8;  // 시뮬 가속 1× DIV=16
  reg clk=0, rst, rx_pin;  wire tx_pin;  integer errors=0;
  uart_loop #(.CLK_HZ(CLK_HZ),.BAUD(BAUD)) dut (.clk,.rst,.rx_pin,.tx_pin);
  always #5 clk = ~clk;

  reg [7:0] sb [0:63];  integer wr=0, rd=0;              // scoreboard queue

  task tx_bit(input v);                                  // 시리얼 라인 직접 토글
    integer k; begin for(k=0;k<BIT_CLK;k=k+1) @(posedge clk) rx_pin=v; end
  endtask
  task send_frame(input [7:0] b);                        // start+8data(LSB)+stop
    integer i; begin tx_bit(0); for(i=0;i<8;i=i+1) tx_bit(b[i]); tx_bit(1); end
  endtask

  task automatic decode_one;                             // echo 를 TB가 직접 샘플
    reg [7:0] got; integer i; begin
      @(negedge tx_pin); repeat(BIT_CLK+BIT_CLK/2) @(posedge clk);  // 첫 data 중앙
      for(i=0;i<8;i=i+1) begin got[i]=tx_pin; if(i<7) repeat(BIT_CLK)@(posedge clk); end
      repeat(BIT_CLK)@(posedge clk);                     // stop 중앙
      if(tx_pin!==1'b1) begin errors=errors+1; $error("STOP!=1 (%h)",got); end
      if(got!==sb[rd]) begin errors=errors+1; $error("byte %0d: got %h exp %h",rd,got,sb[rd]); end
      rd=rd+1;
    end
  endtask

  initial begin : decoder                                // echo NBYTES 수신·비교
    integer n; @(negedge rst);
    for(n=0;n<NBYTES;n=n+1) decode_one;
  end
  initial begin : stimulus                               // NBYTES 송신
    integer n; reg [7:0] b;
    rst=1; rx_pin=1; repeat(4)@(posedge clk); rst=0; repeat(BIT_CLK)@(posedge clk);
    for(n=0;n<NBYTES;n=n+1) begin
      b = 8'h3C ^ (n*8'h11); sb[wr]=b; wr=wr+1;
      send_frame(b); repeat(BIT_CLK)@(posedge clk);
    end
    wait(rd==NBYTES);
    if(errors==0 && rd==NBYTES) $display(" RESULT: PASS  (0 mismatch)");
    else $display(" RESULT: FAIL  (%0d mismatch)", errors);
    $finish;
  end
endmodule`;

export default function UartVerifySlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · 프로토콜 검증"
          title="scoreboard 기반 송수신 일치 검증"
          subtitle="rx_pin 으로 프레임 주입 · tx_pin echo 를 TB가 직접 디코드해 큐와 pop·비교 · 프레임/순서/값 자동 판정"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.75rem' }}>
          {/* 좌: TB 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.5rem 0.85rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY12}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY12, fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '0.05em' }}>
              tb_uart_loop.sv — 핀-레벨 echo scoreboard
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.555rem', lineHeight: 1.35 }} />
          </div>

          {/* 우: scoreboard 그림 + 검증 항목 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY12}25`,
              borderTop: `3px solid ${DAY12}`, borderRadius: '10px',
              padding: '0.55rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>scoreboard 동작</div>
              <svg width="100%" height="64" viewBox="0 0 300 64">
                <rect x="6" y="20" width="50" height="24" rx="4" fill={`${DAY12}12`} stroke={DAY12} strokeWidth="1.4" />
                <text x="31" y="35" fontSize="7.5" fontWeight="700" fill={DAY12} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>TX send</text>
                <path d="M56 32 H92" stroke={FPGA.textLight} strokeWidth="1.3" markerEnd="url(#v12)" />
                <rect x="92" y="14" width="70" height="36" rx="4" fill="rgba(232,145,58,0.10)" stroke="#E8913A" strokeWidth="1.4" />
                <text x="127" y="29" fontSize="7.5" fontWeight="800" fill="#E8913A" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>queue sb[]</text>
                <text x="127" y="42" fontSize="6.5" fill="#E8913A" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>wr→ →rd</text>
                <path d="M162 32 H198" stroke={FPGA.textLight} strokeWidth="1.3" markerEnd="url(#v12)" />
                <circle cx="222" cy="32" r="16" fill="rgba(72,187,120,0.12)" stroke="#48BB78" strokeWidth="1.5" />
                <text x="222" y="36" fontSize="10" fontWeight="800" fill="#48BB78" textAnchor="middle">=?</text>
                <path d="M254 32 H280" stroke="#48BB78" strokeWidth="1.3" markerEnd="url(#v12)" />
                <text x="268" y="22" fontSize="6.5" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>tx_pin</text>
                <defs><marker id="v12" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={FPGA.textLight} /></marker></defs>
              </svg>
            </div>

            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.55rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.25rem' }}>프로토콜 검증 항목</div>
              {[
                { t: '값 일치', d: '디코드 바이트 == 전송 바이트', c: DAY12 },
                { t: '순서·개수', d: 'rd 인덱스 == wr (누락/중복 0)', c: '#4A6FA5' },
                { t: 'framing', d: 'start=0 · stop=1 · LSB 정렬', c: '#8B6FA5' },
                { t: 'bit-center', d: '1.5+N·DIV clk 지점 샘플', c: '#E8913A' },
              ].map((x) => (
                <div key={x.t} style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-start', padding: '0.12rem 0' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: x.c, marginTop: '6px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, color: x.c }}>{x.t}</span>
                    <span style={{ fontSize: '0.62rem', color: FPGA.text }}> — {x.d}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY12}08, ${DAY12}15)`,
              border: `1px solid ${DAY12}30`, borderRadius: '8px', padding: '0.42rem 0.8rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: DAY12 }}>NEXT · </span>
              <span style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.45 }}>
                이 scoreboard 구조를 Day 13에서 driver/monitor/scoreboard로 모듈화.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
