'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY09 = '#2E8B57';

const steps = [
  {
    n: 1, cmd: 'vlib work', tool: 'vlib',
    title: '라이브러리 생성',
    desc: 'work 작업 라이브러리 한 번만 생성. 이미 있으면 건너뜀.',
    color: '#4A6FA5',
  },
  {
    n: 2, cmd: 'vlog sw_led.v sw_led_tb.v', tool: 'vlog',
    title: '컴파일',
    desc: 'Verilog 소스+TB를 work에 컴파일. (VHDL은 vcom)',
    color: DAY09,
  },
  {
    n: 3, cmd: 'vsim work.sw_led_tb', tool: 'vsim',
    title: '시뮬레이션 elaborate·실행',
    desc: 'top(TB) 로드 → run -all → 파형 생성.',
    color: '#8B6FA5',
  },
];

export default function QuestaFlowSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 2 · 도구 흐름"
          title="QuestaSim · Visualizer — 딱 3단계"
          subtitle="vlib → vlog → vsim · 명령은 외우지 말고 Makefile 한 줄로"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* 3단계 카드 */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '0px' }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${s.color}06, ${s.color}12)`,
                  border: `1px solid ${s.color}25`,
                  borderTop: `3px solid ${s.color}`,
                  borderRadius: '12px',
                  padding: '0.75rem 0.9rem',
                  boxShadow: shadow.card,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.45rem' }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: s.color, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.74rem', fontWeight: 800,
                    }}>{s.n}</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: FPGA.dark }}>{s.title}</span>
                  </div>
                  <div style={{
                    background: '#1A2235', borderRadius: '6px',
                    padding: '0.35rem 0.6rem', marginBottom: '0.4rem',
                    fontFamily: 'ui-monospace, Consolas, monospace',
                    fontSize: '0.66rem', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.3)',
                  }}>
                    <span style={{ color: '#F6AD55', fontWeight: 700 }}>$ </span>
                    <span style={{ color: '#A8D8A8' }}>{s.cmd}</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: FPGA.textLight, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ padding: '0 5px', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3 9h9M9 5l4 4-4 4" stroke={FPGA.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 하단: Makefile 한 줄 + Visualizer + 안심 메시지 */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.6rem' }}>
            {/* Makefile / batch */}
            <div style={{
              background: '#1A2235',
              border: '1px solid rgba(46,139,87,0.30)',
              borderRadius: '10px',
              padding: '0.7rem 0.9rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.66rem', color: DAY09, fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                실전에서는 — 한 줄 / 한 번의 클릭
              </div>
              <pre style={{ margin: 0, fontSize: '0.62rem', lineHeight: 1.65, color: '#D4D4D4', whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, Consolas, monospace' }}>
                <span style={{ color: '#6A9955' }}># 배치 스크립트 sim.do</span>{"\n"}
                vlib work{"\n"}
                vlog *.v{"\n"}
                vsim -c work.sw_led_tb <span style={{ color: '#6A9955' }}>-do "run -all; quit"</span>{"\n"}
                {"\n"}
                <span style={{ color: '#6A9955' }}># 또는 Makefile 타겟</span>{"\n"}
                <span style={{ color: '#F6AD55' }}>$ </span>make sim   <span style={{ color: '#6A9955' }}>// 컴파일+실행 한 번에</span>{"\n"}
                <span style={{ color: '#F6AD55' }}>$ </span>make wave  <span style={{ color: '#6A9955' }}>// Visualizer로 파형 열기</span>
              </pre>
            </div>

            {/* Visualizer 설명 + 명령 레퍼런스 + 안심 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                background: `linear-gradient(135deg, ${DAY09}07, ${DAY09}14)`,
                border: `1px solid ${DAY09}30`,
                borderRadius: '10px',
                padding: '0.6rem 0.85rem',
                boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: DAY09, marginBottom: '0.3rem' }}>
                  Visualizer = 파형 디버깅 환경
                </div>
                <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.55 }}>
                  <li>신호 파형(wave) · 값 추적 · 드라이버 추적</li>
                  <li>소스↔파형 양방향 연동 → 원인 신호로 점프</li>
                  <li>compile/sim 시 <code>-debug,acc</code> 가시성 확보 필요</li>
                </ul>
              </div>

              {/* 자주 쓰는 명령 레퍼런스 */}
              <div style={{
                background: FPGA.white,
                border: `1px solid ${FPGA.border}`,
                borderRadius: '10px',
                padding: '0.55rem 0.85rem',
                boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem' }}>
                  자주 쓰는 시뮬 명령
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 0.5rem' }}>
                  {[
                    { c: 'run -all', d: '끝까지 실행' },
                    { c: 'add wave -r /*', d: '전 신호 파형' },
                    { c: 'force sig val', d: '신호 강제' },
                    { c: 'examine sig', d: '값 조회' },
                    { c: 'restart -f', d: '0ns 재시작' },
                    { c: 'run 100ns', d: '구간 실행' },
                  ].map((x) => (
                    <div key={x.c} style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                      <code style={{
                        fontSize: '0.6rem', color: DAY09, background: `${DAY09}10`,
                        padding: '1px 5px', borderRadius: '3px', fontFamily: '"JetBrains Mono", monospace', whiteSpace: 'nowrap',
                      }}>{x.c}</code>
                      <span style={{ fontSize: '0.6rem', color: FPGA.textLight }}>{x.d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                marginTop: 'auto',
                background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.13))`,
                border: `1px solid ${FPGA.accent}30`,
                borderLeft: `4px solid ${FPGA.accent}`,
                borderRadius: '10px',
                padding: '0.55rem 0.85rem',
                boxShadow: shadow.card,
                display: 'flex', alignItems: 'center', gap: '0.6rem',
              }}>
                <span style={{ fontSize: '1.2rem' }}>💡</span>
                <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.5 }}>
                  반복 명령은 <strong style={{ color: FPGA.accent }}>스크립트로 자동화</strong> · 학습 초점은 설계와 파형 분석.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
