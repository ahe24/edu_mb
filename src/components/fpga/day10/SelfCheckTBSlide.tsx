'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY10 = '#1B998B';
const MONO = '"JetBrains Mono", monospace';

const code = `module counter_tb;
  localparam W = 4;
  reg          clk = 1'b0, rst, en;
  wire [W-1:0] cnt;
  reg  [W-1:0] model;                 // golden 기대값
  integer      errors = 0;            // 누적 에러 카운트

  counter #(.W(W)) dut (.clk(clk), .rst(rst), .en(en), .cnt(cnt));

  always #5 clk = ~clk;               // 100MHz

  always @(posedge clk)               // 기대 모델 (DUT와 동일 규칙)
    if (rst)     model <= 0;
    else if (en) model <= model + 1'b1;

  always @(posedge clk)               // 자동 판정
    if (!rst && cnt !== model) begin
      errors = errors + 1;            // CI 가 읽을 카운트
      $error("MISMATCH t=%0t cnt=%h exp=%h", $time, cnt, model);
    end                               // ↑ severity+시간+종료코드≠0

  initial begin
    rst = 1; en = 0;
    repeat (2) @(posedge clk); rst = 0; en = 1;
    repeat (20) @(posedge clk);       // wrap 포함 충분히
    if (errors == 0) $display("RESULT: PASS (0 mismatch)");
    else             $display("RESULT: FAIL (%0d mismatch)", errors);
    $finish;
  end
endmodule`;

export default function SelfCheckTBSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 · self-checking"
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

          {/* 우: 구조도 + $error vs $display */}
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
              <svg width="100%" height="100%" viewBox="0 0 360 150" style={{ flex: 1 }}>
                <defs>
                  <filter id="sc-sh" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="1.4" stdDeviation="1.5" floodColor="#1F2D3D" floodOpacity="0.22" />
                  </filter>
                  <linearGradient id="sc-stim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#EAF1FA" /><stop offset="1" stopColor="#D3E2F3" />
                  </linearGradient>
                  <linearGradient id="sc-dut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#E7F6F2" /><stop offset="1" stopColor="#C9EBE4" />
                  </linearGradient>
                  <linearGradient id="sc-mdl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#F1EAF8" /><stop offset="1" stopColor="#E0D2EF" />
                  </linearGradient>
                  <linearGradient id="sc-cmp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#E8F8EE" /><stop offset="1" stopColor="#CDEFD7" />
                  </linearGradient>
                  <marker id="sc-ar" markerWidth="8" markerHeight="8" refX="5.2" refY="3" orient="auto">
                    <path d="M0 0 L6 3 L0 6 Z" fill="#8493A6" />
                  </marker>
                </defs>

                {/* connectors */}
                <path d="M70 69 C96 69 96 38 116 38" fill="none" stroke="#8493A6" strokeWidth="1.4" markerEnd="url(#sc-ar)" />
                <path d="M70 81 C96 81 96 112 116 112" fill="none" stroke="#8493A6" strokeWidth="1.4" markerEnd="url(#sc-ar)" />
                <path d="M194 38 C220 38 222 62 224 65" fill="none" stroke="#8493A6" strokeWidth="1.4" markerEnd="url(#sc-ar)" />
                <path d="M194 112 C220 112 222 88 224 85" fill="none" stroke="#8493A6" strokeWidth="1.4" markerEnd="url(#sc-ar)" />

                {/* stimulus */}
                <rect x="8" y="57" width="62" height="36" rx="7" fill="url(#sc-stim)" stroke="#4A6FA5" strokeWidth="1.4" filter="url(#sc-sh)" />
                <text x="39" y="72" fontSize="8" fontWeight="800" fill="#33567F" textAnchor="middle" fontFamily={MONO}>stimulus</text>
                <text x="39" y="84" fontSize="6" fontWeight="600" fill="#5B7494" textAnchor="middle" fontFamily={MONO}>clk·rst·en</text>

                {/* DUT */}
                <rect x="116" y="18" width="78" height="40" rx="7" fill="url(#sc-dut)" stroke={DAY10} strokeWidth="1.6" filter="url(#sc-sh)" />
                <text x="155" y="36" fontSize="9.5" fontWeight="800" fill="#127C70" textAnchor="middle" fontFamily={MONO}>DUT</text>
                <text x="155" y="48" fontSize="6" fontWeight="600" fill="#2C7E73" textAnchor="middle" fontFamily={MONO}>설계 RTL → cnt</text>

                {/* model */}
                <rect x="116" y="92" width="78" height="40" rx="7" fill="url(#sc-mdl)" stroke="#8B6FA5" strokeWidth="1.6" filter="url(#sc-sh)" />
                <text x="155" y="110" fontSize="9" fontWeight="800" fill="#6E4F8C" textAnchor="middle" fontFamily={MONO}>model</text>
                <text x="155" y="122" fontSize="6" fontWeight="600" fill="#7A5C97" textAnchor="middle" fontFamily={MONO}>golden → exp</text>

                {/* compare */}
                <circle cx="244" cy="75" r="21" fill="url(#sc-cmp)" stroke="#48BB78" strokeWidth="1.7" filter="url(#sc-sh)" />
                <text x="244" y="79" fontSize="12" fontWeight="800" fill="#2F9E5B" textAnchor="middle" fontFamily={MONO}>=?</text>
                <text x="244" y="105" fontSize="6" fontWeight="600" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>매 clk 비교</text>

                {/* outcomes */}
                <path d="M265 67 L288 57" stroke="#E53E3E" strokeWidth="1.3" />
                <path d="M265 83 L288 93" stroke="#2F9E5B" strokeWidth="1.3" />
                <text x="292" y="55" fontSize="7.5" fontWeight="800" fill="#E53E3E" fontFamily={MONO}>≠ → $error</text>
                <text x="292" y="64" fontSize="5.6" fontWeight="600" fill="#C05050" fontFamily={MONO}>+errors, exit≠0</text>
                <text x="292" y="92" fontSize="7.5" fontWeight="800" fill="#2F9E5B" fontFamily={MONO}>= → 유지</text>
                <text x="292" y="101" fontSize="5.6" fontWeight="600" fill="#4A8C66" fontFamily={MONO}>끝에 PASS 요약</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY10}08, ${DAY10}15)`,
              border: `1px solid ${DAY10}30`, borderRadius: '10px',
              padding: '0.55rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: DAY10, marginBottom: '0.35rem' }}>
                왜 <code>$error</code> 인가 — vs <code>$display</code>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                <div style={{ background: '#fff', border: '1px solid #E2B8B8', borderRadius: '7px', padding: '0.4rem 0.5rem', boxShadow: shadow.card }}>
                  <div style={{ fontSize: '0.6rem', fontFamily: MONO, fontWeight: 800, color: '#C53030', marginBottom: '0.2rem' }}>$display(&quot;FAIL&quot;)</div>
                  <ul style={{ margin: 0, paddingLeft: '0.85rem', fontSize: '0.56rem', color: FPGA.text, lineHeight: 1.5 }}>
                    <li>그냥 로그 한 줄</li>
                    <li>종료코드 0 → CI가 <strong>PASS로 오인</strong></li>
                    <li>로그 grep 에 의존(취약)</li>
                  </ul>
                </div>
                <div style={{ background: '#fff', border: `1px solid ${DAY10}55`, borderRadius: '7px', padding: '0.4rem 0.5rem', boxShadow: shadow.card }}>
                  <div style={{ fontSize: '0.6rem', fontFamily: MONO, fontWeight: 800, color: DAY10, marginBottom: '0.2rem' }}>$error(...)</div>
                  <ul style={{ margin: 0, paddingLeft: '0.85rem', fontSize: '0.56rem', color: FPGA.text, lineHeight: 1.5 }}>
                    <li>severity·시간·scope 자동</li>
                    <li>에러 카운트+, <strong>종료코드 ≠ 0</strong></li>
                    <li>CI·회귀가 바로 감지</li>
                  </ul>
                </div>
              </div>
              <div style={{ fontSize: '0.56rem', color: FPGA.textLight, marginTop: '0.35rem', lineHeight: 1.45 }}>
                실무: 불일치는 <code>$error</code>(+에러 카운트), 마지막 PASS/FAIL 요약만 <code>$display</code>. 더 엄격히는 SVA <code>assert</code>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
