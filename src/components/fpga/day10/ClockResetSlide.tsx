'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY10 = '#1B998B';
const BLUE = '#4A6FA5';
const RED = '#E2574C';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

const clkA = `// 방식 A — always (가장 간결)
reg clk = 1'b0;        // 반드시 초기화 (X 방지)
always #5 clk = ~clk;  // 10ns 주기 = 100MHz`;

const clkB = `// 방식 B — initial + forever
reg clk;
initial begin
  clk = 1'b0;            // 초기화
  forever #5 clk = ~clk; // 같은 10ns 주기
end`;

const rstCode = `// DUT (예: 4-bit 카운터) — cnt 는 DUT 출력
wire [3:0] cnt;
counter dut (.clk(clk), .rst(rst), .en(1'b1), .cnt(cnt));

// 리셋 — 충분히 유지 후 "동기" 해제
initial begin
  rst = 1'b1;                 // 인가
  repeat (2) @(posedge clk);  // 2클럭 유지
  rst = 1'b0;                 // 해제 → 다음 엣지부터 cnt 증가
end`;

// 자극 방식 카탈로그 — 모두 initial/always/task 내부 (절차적)
const STIM = [
  { k: 'directed (직접)', c: `@(posedge clk); en <= 1'b1;` },
  { k: '반복 loop', c: `repeat (16) @(posedge clk) sw <= sw + 1;` },
  { k: 'task 재사용', c: `task drive(input [1:0] v); ... endtask` },
  { k: '파일 벡터', c: `$readmemh("vec.hex", mem);` },
  { k: '랜덤', c: `sw <= $random;  // SV: std::randomize` },
  { k: 'SV clocking', c: `@(cb); cb.sw <= 2'b10;  // race-free` },
];

export default function ClockResetSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Testbench 기본기"
          title="Testbench에서 클럭과 리셋 만들기"
          subtitle="클럭 생성(2 방식) · 리셋 시퀀스 · 다양한 자극(stimulus) 인가"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: ① 클럭 생성 + ③ 자극 방식 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: FPGA.dark }}>
              ① 클럭 생성 — 두 방식 (기능 동일)
            </div>
            <div style={{ background: '#1A2235', borderRadius: '9px', padding: '0.5rem 0.8rem', boxShadow: shadow.card, borderLeft: `3px solid ${BLUE}` }}>
              <VerilogCode code={clkA} style={{ fontSize: '0.6rem', lineHeight: 1.45 }} />
            </div>
            <div style={{ background: '#1A2235', borderRadius: '9px', padding: '0.5rem 0.8rem', boxShadow: shadow.card, borderLeft: `3px solid ${DAY10}` }}>
              <VerilogCode code={clkB} style={{ fontSize: '0.6rem', lineHeight: 1.45 }} />
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${BLUE}0C, ${BLUE}18)`,
              border: `1px solid ${BLUE}33`, borderRadius: '8px', padding: '0.45rem 0.7rem',
            }}>
              <div style={{ fontSize: '0.61rem', color: FPGA.text, lineHeight: 1.5 }}>
                <strong>차이</strong> — 둘 다 자유 구동 클럭, 동작은 동일.
                <strong style={{ color: BLUE }}> always</strong>는 독립 프로세스로 가장 간결,
                <strong style={{ color: DAY10 }}> initial+forever</strong>는 같은 블록에서 초기화·셋업과 함께 기술하고 <code>disable</code>/조건으로 정지 제어가 쉽다.
                비대칭 duty는 <code>always begin #4 clk=0; #6 clk=1; end</code>. <strong>clk 초기화 필수</strong>(미초기화 시 <code>~X=X</code> 전파).
              </div>
            </div>

            {/* ③ 자극 방식 — 좌측 하단 공간 채움 */}
            <div style={{
              flex: 1, minHeight: 0, marginTop: '0.1rem',
              background: FPGA.white, border: `1px solid ${DAY10}25`,
              borderTop: `3px solid ${DAY10}`, borderRadius: '9px',
              padding: '0.5rem 0.8rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                ③ 자극(stimulus) 방식 — 목적에 맞게 선택
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                {STIM.map((s) => (
                  <div key={s.k} style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: DAY10, flexShrink: 0, minWidth: '5.2rem', fontSize: '0.62rem' }}>{s.k}</span>
                    <code style={{ fontFamily: MONO, color: FPGA.text, fontSize: '0.6rem' }}>{s.c}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 우: ② 리셋 시퀀스 + 타이밍 + 핵심 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: FPGA.dark }}>
              ② 리셋 시퀀스 + 타이밍
            </div>
            <div style={{ background: '#1A2235', borderRadius: '9px', padding: '0.5rem 0.8rem', boxShadow: shadow.card, borderLeft: `3px solid ${RED}` }}>
              <VerilogCode code={rstCode} style={{ fontSize: '0.6rem', lineHeight: 1.45 }} />
            </div>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '9px', padding: '0.4rem 0.5rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <svg viewBox="0 0 340 152" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* rst 해제 점선 */}
                <line x1="105" y1="24" x2="105" y2="140" stroke="#C9D2E0" strokeWidth="1" strokeDasharray="3 3" />
                <text x="105" y="20" fontSize="8" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>rst 해제</text>

                {/* clk — 상승 엣지 60·100·140·180·220·260 */}
                <text x="18" y="44" fontSize="8.5" fontWeight="700" fill={FPGA.dark} fontFamily={MONO}>clk</text>
                <path d="M52 48 H60 V32 H80 V48 H100 V32 H120 V48 H140 V32 H160 V48 H180 V32 H200 V48 H220 V32 H240 V48 H260 V32 H280 V48 H300"
                  stroke={FPGA.dark} strokeWidth="1.3" fill="none" />

                {/* rst */}
                <text x="18" y="80" fontSize="8.5" fontWeight="700" fill={RED} fontFamily={MONO}>rst</text>
                <path d="M52 68 H105 V84 H300" stroke={RED} strokeWidth="1.8" fill="none" />
                <text x="78" y="62" fontSize="7.5" fontWeight="700" fill={RED} textAnchor="middle" fontFamily={MONO}>2 clk 유지</text>

                {/* cnt[3:0] — 멀티비트 버스, 해제 다음 엣지(140)부터 증가 */}
                <text x="18" y="126" fontSize="8.5" fontWeight="700" fill={DAY10} fontFamily={MONO}>cnt</text>
                <text x="18" y="135" fontSize="6" fontWeight="700" fill={DAY10} fontFamily={MONO}>[3:0]</text>
                <path d="M52 114 H300" stroke={DAY10} strokeWidth="1.5" fill="none" />
                <path d="M52 130 H300" stroke={DAY10} strokeWidth="1.5" fill="none" />
                {[140, 180, 220, 260].map((bx) => (
                  <path key={bx} d={`M${bx - 4} 114 L${bx + 4} 130 M${bx - 4} 130 L${bx + 4} 114`} stroke={DAY10} strokeWidth="1.5" fill="none" />
                ))}
                {[{ x: 96, v: '0' }, { x: 160, v: '1' }, { x: 200, v: '2' }, { x: 240, v: '3' }, { x: 282, v: '4' }].map((s) => (
                  <text key={s.v} x={s.x} y="126" fontSize="8.5" fontWeight="800" fill={FPGA.dark} textAnchor="middle" fontFamily={MONO}>{s.v}</text>
                ))}
                <text x="96" y="148" fontSize="6.5" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>리셋 중 0 유지</text>
                <text x="220" y="148" fontSize="6.5" fontWeight="700" fill={DAY10} textAnchor="middle" fontFamily={MONO}>해제 다음 엣지부터 +1</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${ORANGE}0C, ${ORANGE}18)`,
              border: `1px solid ${ORANGE}33`, borderLeft: `4px solid ${ORANGE}`,
              borderRadius: '9px', padding: '0.5rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#B45309', marginBottom: '0.2rem' }}>핵심 포인트</div>
              <ul style={{ margin: 0, paddingLeft: '0.95rem', fontSize: '0.59rem', color: FPGA.text, lineHeight: 1.5 }}>
                <li><code>@(posedge clk)</code>·<code>#delay</code> 등 <strong>절차적 타이밍 제어는 initial/always/task 안에서만</strong> — 모듈 레벨 단독 불가</li>
                <li>일회성 자극은 <code>initial</code>(또는 <code>task</code>), 반복 구동은 <code>always</code></li>
                <li>자극은 <code>@(posedge clk)</code> 동기 + 비차단 <code>{'<='}</code> 으로 race 방지</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
