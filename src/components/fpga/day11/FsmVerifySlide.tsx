'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY11 = '#3D8361';

const code = `module seq_detect_tb;
  reg clk=0, rst, din;
  wire found;
  seq_detect dut(.clk(clk), .rst(rst), .din(din), .found(found));
  always #5 clk = ~clk;

  reg [5:0] visited = 0;            // 방문 상태 마스크 (coverage)
  always @(posedge clk) visited[dut.state] <= 1'b1;

  reg [7:0] seq = 8'b1011_0110;    // 인가 패턴 (MSB first)
  integer i, hits = 0;
  initial begin
    rst=1; din=0; repeat(2)@(posedge clk); rst=0;
    for (i=7; i>=0; i=i-1) begin
      din = seq[i]; @(posedge clk);
      if (found) hits = hits + 1;   // self-check: 카운트
    end
    if (hits != 2) $error("expected 2 found, got %0d", hits);
    if (visited[3:0] != 4'hF) $error("state not fully covered");
    $display("PASS · found=%0d · states covered", hits);
    $finish;
  end
endmodule`;

export default function FsmVerifySlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 4 · 오후 ② · 천이 검증"
          title="상태 천이·corner case·커버리지까지"
          subtitle="기대 출력 자동 판정 + 전체 상태 방문 확인 + 미사용 상태·천이 검증"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
          {/* 좌: TB 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY11}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY11, fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
              seq_detect_tb.v — 천이 + state coverage
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.6rem', lineHeight: 1.4 }} />
          </div>

          {/* 우: corner case 체크리스트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY11}25`,
              borderTop: `3px solid ${DAY11}`, borderRadius: '10px',
              padding: '0.55rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>FSM corner case 점검</div>
              {[
                { t: '모든 상태 방문', d: 'state coverage = 4/4 · 미방문 = dead state 의심', c: DAY11 },
                { t: '모든 천이 발생', d: '각 case 분기 1회 이상 · overlap 경로 포함', c: '#4A6FA5' },
                { t: 'illegal state 복구', d: 'force로 미사용 인코딩 주입 → default 안전 복구 확인', c: '#E53E3E' },
                { t: 'reset 중 천이 금지', d: '리셋 동안 found=0 · 해제 후 정상 시작', c: '#8B6FA5' },
              ].map((x) => (
                <div key={x.t} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.2rem 0' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: x.c, marginTop: '6px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: x.c }}>{x.t}</span>
                    <span style={{ fontSize: '0.63rem', color: FPGA.text }}> — {x.d}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))',
              border: '1px solid rgba(229,62,62,0.30)', borderLeft: '4px solid #E53E3E',
              borderRadius: '9px', padding: '0.5rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#E53E3E', marginBottom: '0.15rem' }}>
                illegal state 주입 (force)
              </div>
              <code style={{ fontSize: '0.6rem', color: '#1A2235', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px', display: 'block' }}>
                force dut.state = 2'bxx; #10; release dut.state;
              </code>
              <div style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.45, marginTop: '0.25rem' }}>
                다음 클럭에 default로 S0 복귀하는지 = safety-critical 필수 검증.
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY11}08, ${DAY11}15)`,
              border: `1px solid ${DAY11}30`, borderRadius: '8px',
              padding: '0.45rem 0.8rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: DAY11 }}>NEXT · </span>
              <span style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.45 }}>
                여기서 손으로 센 커버리지를 Day 14에서 <strong>Questa Code Coverage</strong>로 자동 측정.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
