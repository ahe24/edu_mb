'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY12 = '#177E89';

const code = `module uart_verify_tb;
  reg clk=0, rst, start;  reg [7:0] tx_data;
  wire tx_line, busy, rx_valid;  wire [7:0] rx_data;
  always #5 clk = ~clk;

  wire tick, tick16;
  baud_gen #(.BAUD(115200))    b1 (.clk,.rst,.tick(tick));
  baud_gen #(.BAUD(115200*16)) b16(.clk,.rst,.tick(tick16));
  uart_tx u_tx(.clk,.rst,.tick,.start,.data(tx_data),.tx(tx_line),.busy);
  uart_rx u_rx(.clk,.rst,.tick16,.rx_in(tx_line),         // loopback
               .data(rx_data),.valid(rx_valid));

  reg [7:0] sb [0:15];  integer wr=0, rd=0, err=0, i;  // scoreboard

  always @(posedge clk) if (rx_valid) begin             // 수신 비교
    if (rx_data !== sb[rd]) begin
      $error("byte %0d: got %h exp %h", rd, rx_data, sb[rd]); err=err+1;
    end
    rd = rd + 1;
  end

  initial begin
    rst=1; start=0; repeat(4)@(posedge clk); rst=0;
    for (i=0;i<8;i=i+1) begin                            // 8 바이트 전송
      @(posedge clk); tx_data = 8'h3C ^ (i*8'h11); sb[wr]=tx_data; wr=wr+1;
      start=1; @(posedge clk); start=0; wait(!busy);
    end
    repeat(4000)@(posedge clk);
    if (err==0 && rd==8) $display("UART loopback PASS (%0d B)", rd);
    else $error("FAIL err=%0d rd=%0d", err, rd);
    $finish;
  end
endmodule`;

export default function UartVerifySlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 4 · 오후 ② · 프로토콜 검증"
          title="scoreboard 기반 송수신 일치 검증"
          subtitle="전송 바이트를 큐에 적재 · RX valid마다 pop 후 비교 · 프레임/순서/값 자동 판정"
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
              uart_verify_tb.v — loopback scoreboard
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
                <text x="270" y="22" fontSize="6.5" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>RX</text>
                <defs><marker id="v12" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={FPGA.textLight} /></marker></defs>
              </svg>
            </div>

            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.55rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.25rem' }}>프로토콜 검증 항목</div>
              {[
                { t: '값 일치', d: 'RX data == 전송 바이트', c: DAY12 },
                { t: '순서·개수', d: 'rd 인덱스 == wr (누락/중복 0)', c: '#4A6FA5' },
                { t: 'framing', d: 'start=0 · stop=1 · LSB 정렬', c: '#8B6FA5' },
                { t: 'bit period', d: 'start→data 간격 = DIV clk', c: '#E8913A' },
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
