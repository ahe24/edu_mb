'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY07 = '#0891B2';

const layers = [
  {
    n: '1',
    name: 'Static CDC',
    desc: 'netlist 구조 검사 · 모든 crossing 망라',
    output: '구조 위반 · 동기화 scheme 분류',
    col: '#4A6FA5',
  },
  {
    n: '2',
    name: 'Protocol SVA',
    desc: '동기화 scheme별 transfer protocol → SVA 자동 promotion',
    output: 'cdc_protocol checker · sim/formal 사용',
    col: DAY07,
  },
  {
    n: '3',
    name: 'Formal CDC',
    desc: '수학적 증명 — proof 가능한 path는 Proven 마킹',
    output: 'Caution → Proven 격상',
    col: '#0E7C7B',
  },
  {
    n: '4',
    name: 'CDC-FX',
    desc: 'Sim 중 random metastability injection',
    output: '동적 + 메타 영향 평가',
    col: '#8B6FA5',
  },
];

const goals = [
  { name: 'Start', desc: '초기 구조 + 기본 scheme', col: '#4A6FA5' },
  { name: 'Planning', desc: 'P&R 전 hand-off 검증', col: DAY07 },
  { name: 'Implementation', desc: 'Synth 직전 · reconv. 활성', col: '#8B6FA5' },
  { name: 'Release', desc: '최종 release · 최엄격', col: '#DD6B20' },
];

export default function QuestaCDCToolSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Questa CDC 운용 구조"
          title="Questa CDC — 4-Layer 검증"
          subtitle="qverify 단일 실행파일 · methodology + goal 으로 검증 강도 조절"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* 상단 — qverify 단일 실행파일 배너 */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY07}08, ${DAY07}16)`,
            border: `1px solid ${DAY07}35`,
            borderLeft: `4px solid ${DAY07}`,
            borderRadius: '10px',
            padding: '0.55rem 0.9rem',
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            boxShadow: shadow.card,
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.78rem', fontWeight: 800,
              color: '#fff', background: DAY07,
              padding: '3px 10px', borderRadius: '5px',
              letterSpacing: '0.06em',
            }}>CLI</span>
            <div style={{ fontSize: '0.78rem', color: FPGA.text, flex: 1, lineHeight: 1.5 }}>
              Lint와 동일 — <code>qverify</code>가 <strong>유일한 실행파일</strong>. 명령 prefix만 <code>lint</code> → <code>cdc</code>로 변경.
            </div>
            <code style={{
              fontSize: '0.66rem', background: '#1A2235', color: '#A8D8A8',
              padding: '3px 8px', borderRadius: '4px', fontFamily: 'monospace',
            }}>qverify -c -do script.tcl</code>
          </div>

          {/* 4-layer 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.55rem' }}>
            {layers.map((l) => (
              <div key={l.name} style={{
                background: FPGA.white,
                border: `1px solid ${l.col}30`,
                borderTop: `3px solid ${l.col}`,
                borderRadius: '10px',
                padding: '0.6rem 0.75rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.35rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: `${l.col}18`,
                    border: `1.5px solid ${l.col}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, color: l.col,
                  }}>{l.n}</span>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: FPGA.dark }}>{l.name}</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.5 }}>
                  {l.desc}
                </div>
                <div style={{
                  fontSize: '0.62rem', color: l.col, fontWeight: 600,
                  fontFamily: '"JetBrains Mono", monospace',
                  background: `${l.col}10`,
                  padding: '2px 6px', borderRadius: '4px',
                  border: `1px solid ${l.col}20`,
                }}>{l.output}</div>
              </div>
            ))}
          </div>

          {/* 하단 — Methodology + Goal */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.6rem',
          }}>
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: FPGA.dark }}>
                Methodology — 설계 type
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.72rem', color: FPGA.text }}>
                <div><strong style={{ color: DAY07 }}>FPGA</strong> — 본 과정 default</div>
                <div><strong style={{ color: '#4A6FA5' }}>SoC</strong> — 통합칩</div>
                <div><strong style={{ color: '#8B6FA5' }}>IP</strong> — 재사용 블록</div>
                <div style={{ fontSize: '0.66rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.2rem' }}>
                  goal 미지정 시 Start 자동 선택
                </div>
                <code style={{
                  fontSize: '0.62rem',
                  background: '#1A2235', color: '#A8D8A8',
                  padding: '4px 7px', borderRadius: '4px',
                  fontFamily: 'monospace',
                  marginTop: '0.2rem',
                }}>cdc methodology fpga -goal release</code>
              </div>
            </div>

            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: FPGA.dark }}>
                Goal — 단계별 강도
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {goals.map((g, i) => (
                  <div key={g.name} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{
                      flex: 1,
                      background: `linear-gradient(135deg, ${g.col}06, ${g.col}14)`,
                      border: `1px solid ${g.col}30`,
                      borderTop: `2px solid ${g.col}`,
                      borderRadius: '6px',
                      padding: '0.4rem 0.5rem',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        fontSize: '0.7rem', fontWeight: 800, color: g.col,
                        fontFamily: '"JetBrains Mono", monospace',
                        marginBottom: '0.15rem',
                      }}>{g.name}</div>
                      <div style={{ fontSize: '0.6rem', color: FPGA.textLight, lineHeight: 1.3 }}>{g.desc}</div>
                    </div>
                    {i < goals.length - 1 && (
                      <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                        <path d="M2 7h7M7 4l3 3-3 3" stroke={FPGA.textLight} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.65rem', color: FPGA.textLight, fontStyle: 'italic' }}>
                Reconvergence check는 Implementation/Release에서만 권장 — Start에서는 noise 너무 많음.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
