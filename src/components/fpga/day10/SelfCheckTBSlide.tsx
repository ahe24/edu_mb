'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY10 = '#1B998B';

const code = `module counter_tb;
  localparam W = 4;
  reg          clk = 1'b0, rst, en;
  wire [W-1:0] cnt;
  reg  [W-1:0] model;                 // golden 기대값

  counter #(.W(W)) dut (.clk(clk), .rst(rst), .en(en), .cnt(cnt));

  always #5 clk = ~clk;               // 100MHz

  always @(posedge clk)               // 기대 모델 (DUT와 동일 규칙)
    if (rst)     model <= 0;
    else if (en) model <= model + 1'b1;

  always @(posedge clk)               // 자동 판정
    if (!rst && cnt !== model)
      $error("MISMATCH t=%0t cnt=%h exp=%h", $time, cnt, model);

  initial begin
    rst = 1; en = 0;
    repeat (2) @(posedge clk); rst = 0; en = 1;
    repeat (20) @(posedge clk);       // wrap 포함 충분히
    $display("counter_tb PASS");
    $finish;
  end
endmodule`;

export default function SelfCheckTBSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 4 · 오후 ② · self-checking"
          title="기대값 모델 기반 자동 판정 TB"
          subtitle="DUT와 병렬 동작하는 reference model로 매 클럭 결과 자동 검증"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.6rem 0.85rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY10}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY10, fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
              counter_tb.v — reference model self-check
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.62rem', lineHeight: 1.45 }} />
          </div>

          {/* 우: 구조도 + 왜 좋은가 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY10}25`,
              borderTop: `3px solid ${DAY10}`, borderRadius: '10px',
              padding: '0.6rem 0.7rem', boxShadow: shadow.card,
              flex: 1, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                DUT ∥ Model 비교 구조
              </div>
              <svg width="100%" height="100%" viewBox="0 0 300 130" style={{ flex: 1 }}>
                {/* stimulus */}
                <rect x="6" y="50" width="56" height="30" rx="5" fill="rgba(74,111,165,0.10)" stroke="#4A6FA5" strokeWidth="1.4" />
                <text x="34" y="69" fontSize="8.5" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>stimulus</text>
                {/* DUT */}
                <rect x="110" y="14" width="64" height="34" rx="5" fill={`${DAY10}14`} stroke={DAY10} strokeWidth="1.6" />
                <text x="142" y="35" fontSize="9" fontWeight="800" fill={DAY10} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>DUT</text>
                {/* model */}
                <rect x="110" y="82" width="64" height="34" rx="5" fill="rgba(139,111,165,0.12)" stroke="#8B6FA5" strokeWidth="1.6" />
                <text x="142" y="103" fontSize="8.5" fontWeight="800" fill="#8B6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>model</text>
                {/* arrows */}
                <path d="M62 60 L110 31" stroke={FPGA.textLight} strokeWidth="1.3" />
                <path d="M62 70 L110 99" stroke={FPGA.textLight} strokeWidth="1.3" />
                {/* compare */}
                <path d="M174 31 L210 56" stroke={DAY10} strokeWidth="1.4" />
                <path d="M174 99 L210 74" stroke="#8B6FA5" strokeWidth="1.4" />
                <circle cx="226" cy="65" r="16" fill="rgba(72,187,120,0.12)" stroke="#48BB78" strokeWidth="1.6" />
                <text x="226" y="69" fontSize="11" fontWeight="800" fill="#48BB78" textAnchor="middle">=?</text>
                <text x="262" y="55" fontSize="8" fill="#E53E3E" fontFamily='"JetBrains Mono", monospace'>≠ → $error</text>
                <text x="262" y="80" fontSize="8" fill="#48BB78" fontFamily='"JetBrains Mono", monospace'>= → PASS</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY10}08, ${DAY10}15)`,
              border: `1px solid ${DAY10}30`, borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: DAY10, marginBottom: '0.2rem' }}>왜 self-checking인가</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li>파형 눈으로 보기 = 회귀(regression)에 부적합</li>
                <li>모델이 자동 판정 → CI·반복 실행에 그대로 사용</li>
                <li>Day 13 scoreboard·Day 14 커버리지의 출발점</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
