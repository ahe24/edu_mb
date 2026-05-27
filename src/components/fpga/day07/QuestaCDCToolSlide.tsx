'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY07 = '#0891B2';

const layers = [
  {
    n: '1',
    name: 'Static CDC',
    desc: 'Netlist 구조만으로 모든 clock domain crossing 경로를 추출하고 동기화 scheme을 자동 분류',
    details: [
      'RTL sim 없이 구조적 결함 검출',
      'no_sync · combo_logic · multi_bits 등 위반 보고',
      'two_dff · handshake · fifo 등 scheme 자동 식별',
    ],
    output: 'cdc.rpt · cdc_detail.rpt · cdc.db',
    cmd: 'cdc run -d top_module',
    col: '#4A6FA5',
  },
  {
    n: '2',
    name: 'Protocol SVA',
    desc: '각 scheme의 transfer protocol을 SVA assertion으로 자동 promotion → sim 또는 formal에서 검증',
    details: [
      'scheme별 protocol checker 자동 생성',
      'bind file + checker library 출력',
      'sim에서 protocol 위반 시 assertion fail',
    ],
    output: 'cdc_protocol.rpt · bind .sv',
    cmd: 'cdc generate protocol',
    col: DAY07,
  },
  {
    n: '3',
    name: 'Formal CDC',
    desc: 'Protocol checker를 formal engine으로 수학적 증명 — vector 없이 모든 입력 조합을 탐색',
    details: [
      'Caution → Proven으로 격상 가능',
      'proof 불가 시 반례(counterexample) 제공',
      'static에서 놓친 protocol 위반 발견',
    ],
    output: 'Proven badge · 반례 trace',
    cmd: 'cdc formal run',
    col: '#0E7C7B',
  },
  {
    n: '4',
    name: 'CDC-FX',
    desc: 'Sim 중 동기화 FF 출력에 random delay를 주입하여 metastability 영향을 동적으로 평가',
    details: [
      'cdc_fx / cdc_mfx / cdc_rfx checker 삽입',
      'meta window 내 0/1 랜덤 결정 + 지연',
      'functional sim에서 실제 meta 효과 관찰',
    ],
    output: 'FX cover points · sim log',
    cmd: 'cdc generate fx',
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
              Lint와 동일 — <code>qverify</code>를 통한 <strong>공통 실행파일</strong>. 명령 prefix만 <code>lint</code> → <code>cdc</code>로 변경.
            </div>
            <code style={{
              fontSize: '0.66rem', background: '#1A2235', color: '#A8D8A8',
              padding: '3px 8px', borderRadius: '4px', fontFamily: 'monospace',
            }}>qverify -c -do script.tcl</code>
          </div>

          {/* 4-layer 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.55rem' }}>
            {layers.map((l, i) => (
              <div key={l.name} style={{
                background: FPGA.white,
                border: `1px solid ${l.col}30`,
                borderTop: `3px solid ${l.col}`,
                borderRadius: '10px',
                padding: '0.55rem 0.7rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
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
                <div style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.45 }}>
                  {l.desc}
                </div>
                {/* 세부 항목 */}
                <ul style={{ margin: 0, paddingLeft: '0.85rem', fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.55 }}>
                  {l.details.map((d) => <li key={d}>{d}</li>)}
                </ul>
                {/* 산출물 */}
                <div style={{
                  fontSize: '0.58rem', color: l.col, fontWeight: 600,
                  fontFamily: '"JetBrains Mono", monospace',
                  background: `${l.col}10`,
                  padding: '2px 6px', borderRadius: '4px',
                  border: `1px solid ${l.col}20`,
                }}>→ {l.output}</div>
                {/* 명령어 */}
                <code style={{
                  fontSize: '0.56rem',
                  background: '#1A2235', color: '#A8D8A8',
                  padding: '2px 6px', borderRadius: '3px',
                  fontFamily: 'monospace',
                }}>{l.cmd}</code>
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
