'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY13 = '#087F5B';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

export default function SvaIntroSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="개념 · SVA 기초"
          title="SVA — 설계 속성을 문장으로 감시한다"
          subtitle="scoreboard 가 '값'을 비교한다면, assertion 은 '규칙(시계열 속성)'을 클럭마다 상시 감시"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: assertion 해부 + immediate/concurrent ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.55rem 0.7rem',
              boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                concurrent assertion 한 문장 해부
              </div>
              <svg viewBox="0 0 460 208" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {/* 코드 배경 */}
                <rect x="8" y="34" width="444" height="106" rx="8" fill="#1A2235" />
                <text x="24" y="58" fontSize="10" fill="#C7D2E8" fontFamily={MONO}>
                  <tspan fill="#C792EA">property</tspan> p_start_accept;
                </text>
                <text x="42" y="78" fontSize="10" fill="#C7D2E8" fontFamily={MONO}>
                  <tspan fill="#82AAFF">@(posedge clk)</tspan> <tspan fill="#FF7B72">disable iff (rst)</tspan>
                </text>
                <text x="42" y="98" fontSize="10" fill="#C7D2E8" fontFamily={MONO}>
                  <tspan fill="#FFCB6B">(start &amp;&amp; !busy)</tspan> <tspan fill="#89DDFF">|-&gt;</tspan> <tspan fill="#A8E6A8">##[1:17] busy</tspan>;
                </text>
                <text x="24" y="118" fontSize="10" fill="#C7D2E8" fontFamily={MONO}>
                  <tspan fill="#C792EA">endproperty</tspan>
                </text>
                <text x="24" y="134" fontSize="9.5" fill="#C7D2E8" fontFamily={MONO}>
                  A_START: <tspan fill="#C792EA">assert property</tspan>(p_start_accept) <tspan fill="#697A9B">else $error(...)</tspan>;
                </text>

                {/* 콜아웃 위 */}
                <path d="M110 70 V22" stroke="#82AAFF" strokeWidth="1.2" />
                <text x="110" y="14" fontSize="7.5" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>샘플링 클럭</text>
                <path d="M270 70 V22" stroke="#FF7B72" strokeWidth="1.2" />
                <text x="292" y="14" fontSize="7.5" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily={MONO}>리셋 중 평가 제외</text>

                {/* 콜아웃 아래 */}
                <path d="M104 102 V158" stroke="#FFCB6B" strokeWidth="1.2" />
                <text x="104" y="172" fontSize="7.5" fontWeight="800" fill="#B45309" textAnchor="middle" fontFamily={MONO}>선행조건 (antecedent)</text>
                <text x="104" y="183" fontSize="6.8" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>이 조건이 참일 때만</text>
                <path d="M222 102 V158" stroke="#89DDFF" strokeWidth="1.2" />
                <text x="222" y="172" fontSize="7.5" fontWeight="800" fill="#0891B2" textAnchor="middle" fontFamily={MONO}>함의 |-&gt;</text>
                <text x="222" y="183" fontSize="6.8" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>같은 클럭부터</text>
                <path d="M330 102 V158" stroke="#A8E6A8" strokeWidth="1.2" />
                <text x="342" y="172" fontSize="7.5" fontWeight="800" fill={DAY13} textAnchor="middle" fontFamily={MONO}>결과 (consequent)</text>
                <text x="342" y="183" fontSize="6.8" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>1~17클럭 안에 busy — bounded</text>
                <text x="230" y="202" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>
                  &ldquo;idle 중 start 요청이 오면, 17클럭 이내에 반드시 busy 가 선다&rdquo;
                </text>
              </svg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', flexShrink: 0 }}>
              <div style={{
                background: `linear-gradient(135deg, ${FPGA.primary}06, ${FPGA.primary}10)`,
                border: `1px solid ${FPGA.primary}28`, borderTop: `3px solid ${FPGA.primary}`,
                borderRadius: '9px', padding: '0.45rem 0.65rem', boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, color: FPGA.primary, marginBottom: '0.15rem' }}>immediate assertion</div>
                <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                  절차 코드 안에서 그 순간만 검사 — <code>if(...) $error</code> 스타일.
                  Day10 self-checking TB 가 해 온 방식.
                </div>
              </div>
              <div style={{
                background: `linear-gradient(135deg, ${DAY13}06, ${DAY13}12)`,
                border: `1px solid ${DAY13}30`, borderTop: `3px solid ${DAY13}`,
                borderRadius: '9px', padding: '0.45rem 0.65rem', boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, color: DAY13, marginBottom: '0.15rem' }}>concurrent assertion ★</div>
                <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                  클럭마다 <strong>상시 감시</strong> · 여러 클럭에 걸친 시계열 표현.
                  절차 블록 밖에 선언 — 오늘의 주인공.
                </div>
              </div>
            </div>
          </div>

          {/* ── 우: 연산자 표 + 상호보완 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.5rem 0.65rem', boxShadow: shadow.card,
              overflow: 'hidden',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>핵심 연산자 — 오늘 쓰는 것만</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.6rem' }}>
                <thead>
                  <tr style={{ background: `${DAY13}0E` }}>
                    {['연산자', '의미', '예'].map((h) => (
                      <th key={h} style={{ padding: '3px 6px', textAlign: 'left', color: DAY13, fontWeight: 800, borderBottom: `1.5px solid ${DAY13}30` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['##N · ##[m:n]', 'N클럭 뒤 · m~n클럭 사이', 'req ##[1:3] ack'],
                    ['|->', '같은 클럭부터 결과 검사', 'a |-> b'],
                    ['|=>', '다음 클럭부터 결과 검사', 'a |=> b'],
                    ['$rose · $fell', '0→1 · 1→0 엣지 검출', '$rose(busy)'],
                    ['$stable · $past', '값 유지 · 1클럭 전 값', '$past(state)'],
                    ['disable iff', '조건 중 평가 중단', 'disable iff (rst)'],
                    ['assert · cover', '위반 검출 · 발생 집계', 'A_x: assert property'],
                  ].map((r, i) => (
                    <tr key={r[0]} style={{ background: i % 2 ? '#F8FAFC' : '#fff' }}>
                      <td style={{ padding: '3.5px 6px', fontFamily: MONO, fontWeight: 700, color: '#0891B2', whiteSpace: 'nowrap', borderBottom: `1px solid ${FPGA.border}` }}>{r[0]}</td>
                      <td style={{ padding: '3.5px 6px', color: FPGA.text, borderBottom: `1px solid ${FPGA.border}` }}>{r[1]}</td>
                      <td style={{ padding: '3.5px 6px', fontFamily: MONO, color: FPGA.textLight, whiteSpace: 'nowrap', borderBottom: `1px solid ${FPGA.border}` }}>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${ORANGE}08, ${ORANGE}14)`,
              border: `1px solid ${ORANGE}35`, borderLeft: `4px solid ${ORANGE}`,
              borderRadius: '10px', padding: '0.5rem 0.85rem', boxShadow: shadow.card,
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#B45309', marginBottom: '0.15rem' }}>
                scoreboard 와 SVA 는 상호 보완
              </div>
              <div style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.5 }}>
                scoreboard — <strong>값</strong>이 맞는가 (데이터 무결성) ·
                SVA — <strong>규칙</strong>을 지키는가 (프로토콜·타이밍·천이).
                실습4 버그 주입에서 각자의 검출 사각을 확인한다.
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY13}08, ${DAY13}15)`,
              border: `1px solid ${DAY13}30`, borderRadius: '8px', padding: '0.42rem 0.8rem',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: DAY13 }}>Safety-Critical · </span>
              <span style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.45 }}>
                assertion 은 요구사항을 실행 가능한 검사로 옮긴 것 —
                &ldquo;요구사항 ↔ 속성 ↔ 검증 결과&rdquo; 추적성의 기초이자 Day17 형식 검증의 입력.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
