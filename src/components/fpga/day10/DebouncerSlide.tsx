'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY10 = '#1B998B';

const code = `module debounce #(
  parameter integer STABLE = 1_000_000  // ~10ms @100MHz
)(
  input  wire clk,
  input  wire rst,
  input  wire btn_in,        // 노이즈 있는 raw 버튼
  output reg  btn_out        // 안정화된 버튼
);
  reg [19:0] cnt;
  reg        s0, s1;         // 2단 동기화 FF

  always @(posedge clk)      // ① 메타안정 방지 2FF
    if (rst) {s1, s0} <= 2'b00;
    else     {s1, s0} <= {s0, btn_in};

  always @(posedge clk) begin // ② 카운터 기반 안정화
    if (rst) begin
      cnt <= 0; btn_out <= 1'b0;
    end else if (s1 == btn_out) begin
      cnt <= 0;                       // 변화 없음 → 리셋
    end else if (cnt == STABLE-1) begin
      btn_out <= s1; cnt <= 0;        // 충분히 안정 → 반영
    end else
      cnt <= cnt + 1'b1;
  end
endmodule`;

export default function DebouncerSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 3 · 오후 ① · 디바운서"
          title="버튼 디바운서 — raw → clean"
          subtitle="기계식 버튼의 채터링(bounce)을 제거 · 비동기 입력은 2FF로 먼저 동기화"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.6rem 0.85rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY10}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY10, fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
              debounce.v
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.62rem', lineHeight: 1.45 }} />
          </div>

          {/* 우: 채터링 파형 + CDC 연결 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY10}25`,
              borderTop: `3px solid ${DAY10}`, borderRadius: '10px',
              padding: '0.6rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>
                채터링 → 안정화
              </div>
              <svg width="100%" height="76" viewBox="0 0 320 76">
                {/* btn_in raw with bounce */}
                <text x="2" y="18" fontSize="8.5" fontWeight="700" fill="#E53E3E" fontFamily='"JetBrains Mono", monospace'>raw</text>
                <path d="M34 28 H70 V10 H76 V24 H82 V10 H88 V24 H94 V10 H180 V26 H186 V12 H192 V26 H260 V28 H300"
                      stroke="#E53E3E" strokeWidth="1.4" fill="none" />
                {/* btn_out clean */}
                <text x="2" y="58" fontSize="8.5" fontWeight="700" fill={DAY10} fontFamily='"JetBrains Mono", monospace'>clean</text>
                <path d="M34 68 H120 V50 H230 V68 H300" stroke={DAY10} strokeWidth="2.2" fill="none" />
                <text x="120" y="46" fontSize="7" fill={FPGA.textLight} fontFamily='"JetBrains Mono", monospace'>STABLE 만족 후 반영</text>
              </svg>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(8,145,178,0.06), rgba(8,145,178,0.13))',
              border: '1px solid rgba(8,145,178,0.30)',
              borderLeft: '4px solid #0891B2',
              borderRadius: '10px', padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0891B2', marginBottom: '0.2rem' }}>
                CDC 연결 — 2FF 동기화 (Day 07~08)
              </div>
              <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.55 }}>
                버튼은 클럭과 무관한 <strong>비동기 입력</strong> → 바로 쓰면 메타안정 위험.
                <code>s0/s1</code> 2단 FF로 먼저 동기화한 뒤 디바운스 — Lint/CDC가 요구하는 그 패턴.
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
              border: `1px solid ${FPGA.accent}30`, borderRadius: '8px',
              padding: '0.45rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.accent, flexShrink: 0 }}>HINT</span>
              <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>
                시뮬에선 STABLE을 작게(예 4) override하고, btn_in에 짧은 글리치를 섞어 흡수되는지 확인.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
