'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY10 = '#1B998B';

const clkCode = `// 1) 클럭 생성 — 10ns 주기 = 100MHz
reg clk = 1'b0;
always #5 clk = ~clk;     // 5ns마다 반전

// 2) 리셋 시퀀스 — 몇 클럭 유지 후 해제
initial begin
  rst = 1'b1;             // 리셋 인가
  repeat (2) @(posedge clk);
  rst = 1'b0;             // 2클럭 후 해제
end

// 3) 동기 자극 — 엣지에 맞춰 입력
@(posedge clk);  en <= 1'b1;`;

export default function ClockResetSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 2 · TB 기본기"
          title="Testbench에서 클럭과 리셋 만들기"
          subtitle="순차 회로 검증의 3요소 — 클럭 생성 · 리셋 시퀀스 · 엣지 동기 자극"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.65rem 0.9rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY10}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY10, fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
              TB 골격 — clock & reset harness
            </div>
            <VerilogCode code={clkCode} style={{ fontSize: '0.68rem', lineHeight: 1.6 }} />
          </div>

          {/* 우: 타이밍 다이어그램 + 포인트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY10}25`,
              borderTop: `3px solid ${DAY10}`,
              borderRadius: '10px', padding: '0.6rem 0.7rem', boxShadow: shadow.card,
              flex: 1, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                리셋 시퀀스 타이밍
              </div>
              <svg width="100%" height="100%" viewBox="0 0 320 130" style={{ flex: 1 }}>
                {/* clk */}
                <text x="2" y="24" fontSize="9" fontWeight="700" fill="#4A6FA5" fontFamily='"JetBrains Mono", monospace'>clk</text>
                <path d="M34 30 H46 V12 H58 V30 H70 V12 H82 V30 H94 V12 H106 V30 H118 V12 H130 V30 H142 V12 H154 V30 H300"
                      stroke="#4A6FA5" strokeWidth="1.5" fill="none" />
                {/* rst */}
                <text x="2" y="64" fontSize="9" fontWeight="700" fill="#E53E3E" fontFamily='"JetBrains Mono", monospace'>rst</text>
                <path d="M34 52 H82 V70 H300" stroke="#E53E3E" strokeWidth="2" fill="none" />
                <text x="50" y="48" fontSize="7.5" fill="#E53E3E" fontFamily='"JetBrains Mono", monospace'>2 clk 유지</text>
                {/* q/cnt */}
                <text x="2" y="104" fontSize="9" fontWeight="700" fill={DAY10} fontFamily='"JetBrains Mono", monospace'>cnt</text>
                <path d="M34 110 H82" stroke={DAY10} strokeWidth="2" fill="none" />
                <path d="M82 110 L94 92 L130 92 M94 92 V110" stroke={DAY10} strokeWidth="2" fill="none" />
                <text x="55" y="124" fontSize="7.5" fill={FPGA.textLight} fontFamily='"JetBrains Mono", monospace'>0 (held)</text>
                <text x="100" y="88" fontSize="7.5" fill={DAY10} fontFamily='"JetBrains Mono", monospace'>1,2,3..</text>
                {/* release marker */}
                <line x1="82" y1="6" x2="82" y2="118" stroke={FPGA.textLight} strokeDasharray="3 2" strokeWidth="1" />
                <text x="82" y="6" fontSize="7.5" fill={FPGA.textLight} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>해제</text>
              </svg>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY10}08, ${DAY10}15)`,
              border: `1px solid ${DAY10}30`, borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: DAY10, marginBottom: '0.2rem' }}>핵심 포인트</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li><code>clk = 0</code> 초기화 후 <code>always #5</code> — 미초기화 시 X 전파</li>
                <li>리셋은 <strong>충분히 유지</strong> 후 해제 (최소 1~2 클럭)</li>
                <li>입력은 <code>@(posedge clk)</code> 동기 + 비차단(<code>{'<='}</code>)으로 race 방지</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
