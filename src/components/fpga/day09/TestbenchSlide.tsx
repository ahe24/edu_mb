'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';
import ToolImage from '../ToolImage';

const DAY09 = '#2E8B57';

const tbCode = `module mux4_tb;
  reg  [3:0] btn;
  reg  [1:0] sel;
  wire       led;

  mux4 dut (.btn(btn), .sel(sel), .led(led));   // DUT 연결

  integer i;
  initial begin
    btn = 4'b1010;                  // 자극(stimulus)
    for (i = 0; i < 4; i = i + 1) begin
      sel = i[1:0];
      #10;                          // 10ns 대기 후 평가
      $display("sel=%0d led=%b exp=%b", sel, led, btn[sel]);
      if (led !== btn[sel])         // ← self-checking
        $error("MISMATCH @ sel=%0d", sel);
    end
    $display("TB DONE");
    $finish;
  end
endmodule`;

export default function TestbenchSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 4 · 오후 ② · 첫 Testbench"
          title="자극 인가 + 결과 자동 판정 Testbench"
          subtitle="$display 출력 + if/$error 자동 판정 — 파형 관찰과 자동 검증 병행"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '0.75rem' }}>
          {/* 좌: TB 코드 + 핵심 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: '#1A2235', borderRadius: '10px',
              padding: '0.65rem 0.9rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY09}`,
            }}>
              <div style={{ fontSize: '0.6rem', color: DAY09, fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                mux4_tb.v — self-checking testbench
              </div>
              <VerilogCode code={tbCode} style={{ fontSize: '0.64rem', lineHeight: 1.5 }} />
            </div>

            {/* self-checking 핵심 */}
            <div style={{
              flex: 1,
              background: FPGA.white,
              border: `1px solid ${DAY09}25`,
              borderTop: `3px solid ${DAY09}`,
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                self-checking 핵심
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li><code>exp = btn[sel]</code> — 기대값(golden)을 코드로 직접 계산</li>
                <li><code>!==</code> 사용 — X/Z 불일치까지 검출 (<code>!=</code>는 놓침)</li>
                <li><code>$error</code> 0건 = PASS · 로그·종료코드로 회귀 판정</li>
                <li>눈으로 파형 확인 불필요 → CI·반복 실행에 그대로 사용</li>
              </ul>
            </div>
          </div>

          {/* 우: 개념 + 파형 placeholder + 콘솔 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {/* 3요소 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.45rem' }}>
              {[
                { t: '자극', d: 'btn·sel 인가', c: '#4A6FA5' },
                { t: '관찰', d: '$display·파형', c: DAY09 },
                { t: '판정', d: 'if·$error', c: '#E8913A' },
              ].map((x) => (
                <div key={x.t} style={{
                  background: `linear-gradient(135deg, ${x.c}08, ${x.c}15)`,
                  border: `1px solid ${x.c}28`,
                  borderTop: `2px solid ${x.c}`,
                  borderRadius: '8px',
                  padding: '0.4rem 0.5rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: x.c }}>{x.t}</div>
                  <div style={{ fontSize: '0.62rem', color: FPGA.textLight, fontFamily: '"JetBrains Mono", monospace' }}>{x.d}</div>
                </div>
              ))}
            </div>

            {/* 파형 placeholder */}
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white,
              border: `1px solid ${DAY09}25`,
              borderTop: `3px solid ${DAY09}`,
              borderRadius: '10px',
              padding: '0.5rem 0.7rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                Visualizer 파형 — sel 스윕 시 led
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ToolImage src="/images/fpga/day09_mux4_wave.png" name="mux4 TB 파형" width="100%" height="100%" />
              </div>
              <div style={{ fontSize: '0.58rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.3rem' }}>
                day09_mux4_wave.png — sel 0→3, led가 btn[sel] 따라가는지 확인
              </div>
            </div>

            {/* 콘솔 출력 */}
            <div style={{
              background: '#0F1626', borderRadius: '8px',
              padding: '0.45rem 0.7rem', boxShadow: shadow.card,
              fontFamily: 'ui-monospace, Consolas, monospace',
              fontSize: '0.6rem', lineHeight: 1.55,
            }}>
              <div style={{ color: '#94A3B8' }}># Transcript</div>
              <div style={{ color: '#A8D8A8' }}>sel=0 led=0 exp=0</div>
              <div style={{ color: '#A8D8A8' }}>sel=1 led=1 exp=1</div>
              <div style={{ color: '#A8D8A8' }}>sel=2 led=0 exp=0</div>
              <div style={{ color: '#A8D8A8' }}>sel=3 led=1 exp=1 &nbsp; <span style={{ color: '#48BB78' }}>✓ TB DONE</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
