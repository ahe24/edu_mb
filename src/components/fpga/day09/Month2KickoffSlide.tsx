'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY09 = '#2E8B57';

/** Arty-7 보드 자원 (이번 달 활용) */
const resources = [
  { icon: '🟢', name: '4 × User LED', pin: 'LD4–LD7', use: '조합·순차 출력 확인', spec: 'active-high · 직접 구동', tag: '오늘 사용', color: DAY09 },
  { icon: '🔴', name: '4 × RGB LED', pin: 'LD0–LD3', use: 'PWM 밝기·상태 표시', spec: 'R·G·B 3채널 PWM', tag: 'Day 11', color: '#E53E3E' },
  { icon: '🎚', name: '4 × Slide SW', pin: 'SW0–SW3', use: '조합 입력·MUX select', spec: '정적 입력 · 디바운스 불필요', tag: '오늘 사용', color: '#4A6FA5' },
  { icon: '🔘', name: '4 × Push BTN', pin: 'BTN0–BTN3', use: '이벤트·FSM 트리거', spec: '디바운스 필요 (Day 10)', tag: 'Day 10', color: '#8B6FA5' },
  { icon: '📡', name: 'USB-UART', pin: 'FT2232', use: '시리얼 통신', spec: '115200 8N1 · 2FF 동기화', tag: 'Day 12', color: '#0891B2' },
  { icon: '⏱', name: '100 MHz CLK', pin: 'E3', use: '순차논리 클럭', spec: '주기 10 ns · 타이밍 기준', tag: 'Day 10~', color: '#E8913A' },
];

export default function Month2KickoffSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Month 2 — 설계 기반 검증"
          title="설계 기반 검증 접근법"
          subtitle="검증 엔지니어가 RTL을 직접 만들어 봐야 검증 포인트가 보인다"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '0.9rem' }}>
          {/* 좌: 철학 카드 3장 — 내용 높이 카드 + space-between 분산 */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.6rem' }}>
            {[
              {
                t: '1개월차 → 2개월차',
                d: 'Lint·CDC로 남의 RTL을 정적 분석했다면, 이제 직접 설계해 동적으로 검증한다.',
                points: ['코드 검사(정적) → 자극·파형 기반 시뮬(동적)으로 검증 축 이동', '검증 대상 = 직접 작성한 RTL → 검증 의도가 명확'],
                color: '#4A6FA5',
              },
              {
                t: '설계 경험 = 검증 직관',
                d: '직접 만든 DUT는 취약 지점을 안다.',
                points: ['리셋·클럭·CDC·latch 등 깨지기 쉬운 곳을 설계하며 체득', 'testbench·assertion·커버리지의 필요성을 사례로 확인'],
                color: DAY09,
              },
              {
                t: '진입장벽 최소화',
                d: '쉬운 것부터 시작해 툴 부담을 먼저 없앤다.',
                points: ['명령은 스크립트로 자동화 · 파형으로 결과 즉시 확인', '조합(Day09) → 순차(10) → FSM(11) → UART(12) 난이도 점증'],
                color: '#E8913A',
              },
            ].map((c) => (
              <div key={c.t} style={{
                background: `linear-gradient(135deg, ${c.color}07, ${c.color}13)`,
                border: `1px solid ${c.color}28`,
                borderLeft: `4px solid ${c.color}`,
                borderRadius: '10px',
                padding: '0.9rem 1.05rem',
                boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: c.color, marginBottom: '0.3rem' }}>{c.t}</div>
                <div style={{ fontSize: '0.85rem', color: FPGA.text, lineHeight: 1.55, marginBottom: '0.5rem' }}>{c.d}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem' }}>
                  {c.points.map((p, pi) => (
                    <div key={pi} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.76rem', color: FPGA.textLight, lineHeight: 1.45 }}>
                      <span style={{ color: c.color, fontWeight: 800, flexShrink: 0, marginTop: '1px' }}>›</span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* 흐름 블록도 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${DAY09}25`,
              borderRadius: '10px',
              padding: '0.6rem 0.7rem',
              boxShadow: shadow.card,
            }}>
              <div style={{
                fontSize: '0.64rem', fontWeight: 700, color: FPGA.textLight,
                letterSpacing: '0.08em', marginBottom: '0.5rem',
                fontFamily: '"JetBrains Mono", monospace',
              }}>WORKFLOW</div>
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                {[
                  { t: '설계', sub: 'RTL .v', io: 'in' },
                  { t: '시뮬레이션', sub: 'QuestaSim', io: 'mid' },
                  { t: '파형 분석', sub: 'Visualizer', io: 'mid' },
                  { t: '검증·산출물', sub: 'TB · log', io: 'out' },
                ].map((s, i, arr) => (
                  <div key={s.t} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{
                      flex: 1,
                      background: `linear-gradient(180deg, ${DAY09}0E, ${FPGA.white})`,
                      border: `1px solid ${DAY09}30`,
                      borderTop: `2.5px solid ${DAY09}`,
                      borderRadius: '6px',
                      padding: '0.5rem 0.35rem',
                      textAlign: 'center',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, color: FPGA.dark, lineHeight: 1.2 }}>{s.t}</div>
                      <div style={{
                        fontSize: '0.58rem', color: DAY09, fontWeight: 600,
                        fontFamily: '"JetBrains Mono", monospace', marginTop: '2px',
                      }}>{s.sub}</div>
                    </div>
                    {i < arr.length - 1 && (
                      <svg width="16" height="12" viewBox="0 0 16 12" style={{ flexShrink: 0 }}>
                        <path d="M0 6 H11" stroke={DAY09} strokeWidth="1.4" />
                        <path d="M9 2 L13 6 L9 10" stroke={DAY09} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 우: Arty-7 자원 맵 */}
          <div style={{
            background: FPGA.white,
            border: `1px solid ${DAY09}25`,
            borderTop: `3px solid ${DAY09}`,
            borderRadius: '12px',
            padding: '0.8rem 1rem',
            boxShadow: shadow.card,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: FPGA.dark }}>Arty-7 자원 맵</span>
              <span style={{
                fontSize: '0.6rem', fontWeight: 700, color: DAY09,
                background: `${DAY09}12`, border: `1px solid ${DAY09}28`,
                padding: '1px 7px', borderRadius: '4px', fontFamily: '"JetBrains Mono", monospace',
              }}>Microblaze 미사용</span>
            </div>

            {/* flex:1 그리드지만 카드는 내용 높이(alignItems:start) + 행을 space-between로 분산 */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '0.6rem',
              flex: 1, alignContent: 'space-between', alignItems: 'start',
            }}>
              {resources.map((r) => (
                <div key={r.name} style={{
                  background: `linear-gradient(135deg, ${r.color}06, ${r.color}10)`,
                  border: `1px solid ${r.color}22`,
                  borderRadius: '9px',
                  padding: '0.7rem 0.8rem',
                  display: 'flex', flexDirection: 'column', gap: '0.3rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.05rem' }}>{r.icon}</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 800, color: FPGA.dark }}>{r.name}</span>
                    <span style={{
                      marginLeft: 'auto', fontSize: '0.56rem', fontWeight: 700,
                      color: r.color, background: `${r.color}14`,
                      border: `1px solid ${r.color}28`,
                      padding: '1px 6px', borderRadius: '999px',
                      fontFamily: '"JetBrains Mono", monospace', whiteSpace: 'nowrap',
                    }}>{r.tag}</span>
                  </div>
                  <code style={{
                    fontSize: '0.66rem', color: r.color, background: `${r.color}10`,
                    padding: '1px 6px', borderRadius: '3px', width: 'fit-content',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}>{r.pin}</code>
                  <div style={{ fontSize: '0.74rem', color: FPGA.text, lineHeight: 1.45 }}>{r.use}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.66rem', color: FPGA.textLight, lineHeight: 1.4 }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                    {r.spec}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.72rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.6rem' }}>
              오늘(Day 09)은 클럭 없는 <strong style={{ color: DAY09 }}>조합논리</strong>만 — 스위치·버튼·LED로 입력→출력을 즉시 확인.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
