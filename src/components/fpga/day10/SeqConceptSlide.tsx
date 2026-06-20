'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY10 = '#1B998B';
const BLUE = '#4A6FA5';
const RED = '#E2574C';
const GREEN = '#2F855A';
const MONO = '"JetBrains Mono", monospace';

const ffCode = `// D flip-flop — 순차논리의 기본 소자
// 동기 · active-high 리셋
always @(posedge clk) begin
  if (rst)  q <= 1'b0;   // 클럭 엣지에서만 리셋
  else      q <= d;      // 평소엔 d를 기억 (비차단 <=)
end`;

export default function SeqConceptSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="순차논리 · 개념"
          title="조합 vs 순차 — 클럭과 기억"
          subtitle="순차논리는 클럭 상승 엣지마다 상태를 레지스터(D flip-flop)에 저장한다"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* 상단: 조합 vs 순차 + 코드 / D-FF 타이밍 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: '0.75rem', flex: 1, minHeight: 0 }}>
            {/* 좌 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                <div style={{
                  background: `linear-gradient(135deg, ${BLUE}0F, ${BLUE}20)`,
                  border: `1px solid ${BLUE}40`, borderTop: `3px solid ${BLUE}`,
                  borderRadius: '10px', padding: '0.5rem 0.7rem', boxShadow: shadow.card,
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: BLUE, marginBottom: '0.25rem' }}>조합논리</div>
                  <ul style={{ margin: 0, paddingLeft: '0.9rem', fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.55 }}>
                    <li>클럭 없음</li>
                    <li>입력 → 출력 즉시</li>
                    <li><code>assign</code> / <code>always @*</code></li>
                    <li>기억(상태) 없음</li>
                  </ul>
                </div>
                <div style={{
                  background: `linear-gradient(135deg, ${DAY10}0F, ${DAY10}20)`,
                  border: `1px solid ${DAY10}40`, borderTop: `3px solid ${DAY10}`,
                  borderRadius: '10px', padding: '0.5rem 0.7rem', boxShadow: shadow.card,
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: DAY10, marginBottom: '0.25rem' }}>순차논리</div>
                  <ul style={{ margin: 0, paddingLeft: '0.9rem', fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.55 }}>
                    <li>클럭 상승 엣지 동기</li>
                    <li>상태를 <strong>기억</strong></li>
                    <li><code>always @(posedge clk)</code></li>
                    <li>비차단 대입 <code>{'<='}</code></li>
                  </ul>
                </div>
              </div>

              <div style={{
                flex: 1, minHeight: 0,
                background: '#1A2235', borderRadius: '10px',
                padding: '0.6rem 0.85rem', boxShadow: shadow.card,
                borderLeft: `3px solid ${DAY10}`,
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
              }}>
                <VerilogCode code={ffCode} style={{ fontSize: '0.66rem', lineHeight: 1.55 }} />
              </div>
            </div>

            {/* 우: D-FF 심볼 + 타이밍 다이어그램 */}
            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.45rem 0.6rem 0.3rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', minHeight: 0,
            }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: FPGA.dark, textAlign: 'center', marginBottom: '0.1rem' }}>
                D flip-flop — 엣지마다 표본화 + 기억
              </div>
              <svg viewBox="0 0 360 226" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* FF 심볼 */}
                <text x="181" y="12" fontSize="9" fontWeight="800" fill={DAY10} textAnchor="middle" fontFamily={MONO}>D-FF</text>
                <rect x="146" y="16" width="70" height="52" rx="6" fill={`${DAY10}12`} stroke={DAY10} strokeWidth="1.8" />
                <text x="118" y="37" fontSize="11" fontWeight="700" fill={BLUE} textAnchor="middle" fontFamily={MONO}>D</text>
                <path d="M128 33 H146" stroke={BLUE} strokeWidth="1.6" />
                <text x="244" y="37" fontSize="11" fontWeight="700" fill={DAY10} textAnchor="middle" fontFamily={MONO}>Q</text>
                <path d="M216 33 H236" stroke={DAY10} strokeWidth="1.6" />
                <path d="M146 49 l10 6 l-10 6 z" fill={FPGA.dark} />
                <text x="116" y="59" fontSize="9.5" fontWeight="700" fill={FPGA.dark} textAnchor="middle" fontFamily={MONO}>clk</text>
                <path d="M128 55 H146" stroke={FPGA.dark} strokeWidth="1.6" />

                {/* 상승 엣지 점선 */}
                {[80, 150, 220, 290].map((ex) => (
                  <line key={ex} x1={ex} y1="90" x2={ex} y2="200" stroke="#C9D2E0" strokeWidth="1" strokeDasharray="3 3" />
                ))}

                {/* clk */}
                <text x="22" y="106" fontSize="8.5" fontWeight="700" fill={FPGA.dark} fontFamily={MONO}>clk</text>
                <path d="M40 110 H80 V96 H115 V110 H150 V96 H185 V110 H220 V96 H255 V110 H290 V96 H325 V110 H340"
                  stroke={FPGA.dark} strokeWidth="1.4" fill="none" />
                {[80, 150, 220, 290].map((ex) => (
                  <path key={ex} d={`M${ex - 3} 100 l3 -5 l3 5 z`} fill={DAY10} />
                ))}

                {/* D */}
                <text x="22" y="148" fontSize="8.5" fontWeight="700" fill={BLUE} fontFamily={MONO}>D</text>
                <path d="M40 152 H110 V138 H245 V152 H340" stroke={BLUE} strokeWidth="1.7" fill="none" />

                {/* Q (엣지에서 D 표본화) */}
                <text x="22" y="190" fontSize="8.5" fontWeight="700" fill={DAY10} fontFamily={MONO}>Q</text>
                <path d="M40 194 H150 V180 H290 V194 H340" stroke={DAY10} strokeWidth="2.1" fill="none" />

                {/* 표본화 강조 (엣지 150: D=1 포착 → Q↑ / 엣지 290: D=0 → Q↓) */}
                <circle cx="150" cy="180" r="3" fill={DAY10} />
                <circle cx="290" cy="194" r="3" fill={DAY10} />

                <text x="180" y="218" fontSize="7.5" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>
                  ↑ 상승 엣지마다 D 표본화 → Q · 그 사이엔 값을 기억(hold)
                </text>
              </svg>
            </div>
          </div>

          {/* 하단: 리셋 — 동기 active-high(권장) vs 비동기 active-low(불리) */}
          <div style={{
            background: FPGA.white, border: `1px solid ${FPGA.border}`,
            borderRadius: '10px', padding: '0.55rem 0.8rem 0.5rem', boxShadow: shadow.card,
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>
              리셋 선택 — Xilinx/AMD는 <span style={{ color: GREEN }}>동기 · active-high</span> 권장
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '0.6rem' }}>
              {/* 권장 */}
              <div style={{
                background: `linear-gradient(135deg, ${GREEN}0C, ${GREEN}1A)`,
                border: `1px solid ${GREEN}40`, borderLeft: `4px solid ${GREEN}`,
                borderRadius: '8px', padding: '0.45rem 0.7rem',
              }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, color: GREEN, marginBottom: '0.2rem' }}>✓ 동기 · active-high (권장)</div>
                <ul style={{ margin: 0, paddingLeft: '0.95rem', fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.5 }}>
                  <li>동기 리셋은 DSP48·BRAM·SRL 등 <strong>더 많은 자원에 직접 매핑</strong> <span style={{ color: FPGA.textLight }}>(UG949)</span></li>
                  <li>컨트롤셋 리매핑 유연 · 필요시 데이터 경로로 재매핑 <span style={{ color: FPGA.textLight }}>(UG949)</span></li>
                  <li>FF set/reset 제어 입력이 native <strong>active-High</strong> → 인버터 불필요 <span style={{ color: FPGA.textLight }}>(UG474)</span></li>
                </ul>
              </div>
              {/* 불리 */}
              <div style={{
                background: `linear-gradient(135deg, ${RED}0C, ${RED}1A)`,
                border: `1px solid ${RED}40`, borderLeft: `4px solid ${RED}`,
                borderRadius: '8px', padding: '0.45rem 0.7rem',
              }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, color: RED, marginBottom: '0.2rem' }}>✗ 비동기 · active-low — FPGA에서 불리</div>
                <ul style={{ margin: 0, paddingLeft: '0.95rem', fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.5 }}>
                  <li>DSP48·BRAM 내부 레지스터는 <strong>동기 리셋만</strong> 존재 → 비동기면 그 블록에 직접 추론 불가(기능 영향) → 성능·자원 손해 <span style={{ color: FPGA.textLight }}>(UG949)</span></li>
                  <li>리셋 assert 중 <strong>BRAM·LUTRAM·SRL 내용 손상</strong> 확률↑ <span style={{ color: FPGA.textLight }}>(UG949)</span></li>
                  <li>리셋 해제를 클럭에 동기화 안 하면 <strong>recovery/removal 위반 → 메타안정</strong>; 대형 칩 스큐로 FF마다 다른 엣지에 해제 <span style={{ color: FPGA.textLight }}>(UG949·WP272)</span></li>
                  <li>모든 FF로 리셋 라우팅 → 라우팅 복잡도↑ <span style={{ color: FPGA.textLight }}>(UG949)</span> · active-low는 인버터 추가 <span style={{ color: FPGA.textLight }}>(UG474)</span></li>
                </ul>
              </div>
            </div>
            <div style={{ fontSize: '0.56rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.35rem' }}>
              출처: AMD UG949 <em>Synchronous Reset vs. Asynchronous Reset</em> · WP272 <em>Get Smart About Reset</em> · UG474 <em>7&nbsp;Series CLB</em>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
