'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY09 = '#2E8B57';

const steps = [
  {
    n: 1, tool: '컴파일', color: '#4A6FA5',
    cmds: ['vlib work', 'vmap work work', 'vlog -f flist.f'],
    title: '컴파일',
    desc: 'work 라이브러리 생성·매핑 후, 파일리스트(flist.f)로 전체 소스를 한 번에 컴파일.',
  },
  {
    n: 2, tool: '최적화', color: DAY09,
    cmds: ['vopt tb_top -o opt \\', '     -debug +designfile'],
    title: '최적화 · 디버그 DB',
    desc: '-debug +designfile → 설계 구조 DB(design.bin) 생성. Visualizer가 계층·신호를 읽는 근거.',
  },
  {
    n: 3, tool: '시뮬레이션', color: '#8B6FA5',
    cmds: ['vsim -c opt \\', '     -qwavedb=+signal+class'],
    title: '시뮬레이션 (post-sim)',
    desc: '-c 배치 모드로 opt 실행, qwavedb 포맷 파형 DB 기록. 종료 후 Visualizer로 오프라인 디버그.',
  },
];

const tree = [
  { name: 'rtl/',        desc: '설계 RTL 소스',                        color: '#4A6FA5' },
  { name: 'testbench/',  desc: 'TB · 검증 환경',                       color: '#8B6FA5' },
  { name: 'sim/',        desc: '스크립트 · flist · 컴파일/시뮬 생성물', color: DAY09 },
  { name: 'fpga/',       desc: '합성 · P&R 프로젝트 (벤더 툴)',         color: '#E8913A' },
];

export default function QuestaFlowSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 2 · 도구 흐름"
          title="QuestaSim · Visualizer — Post-sim 디버그 흐름"
          subtitle="컴파일 → 최적화(design.bin) → 시뮬(qwavedb) → Visualizer로 파형 분석"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* 3단계 카드 */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '0px' }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  flex: 1, alignSelf: 'stretch',
                  background: `linear-gradient(135deg, ${s.color}06, ${s.color}12)`,
                  border: `1px solid ${s.color}25`,
                  borderTop: `3px solid ${s.color}`,
                  borderRadius: '12px',
                  padding: '0.7rem 0.85rem',
                  boxShadow: shadow.card,
                  display: 'flex', flexDirection: 'column',
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
                    padding: '0.4rem 0.6rem', marginBottom: '0.45rem',
                    fontFamily: 'ui-monospace, Consolas, monospace',
                    fontSize: '0.62rem', lineHeight: 1.7,
                    boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.3)',
                    whiteSpace: 'pre',
                  }}>
                    {s.cmds.map((c, k) => (
                      <div key={k}>
                        {!c.startsWith(' ') && <span style={{ color: '#F6AD55', fontWeight: 700 }}>$ </span>}
                        <span style={{ color: '#A8D8A8' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: FPGA.textLight, lineHeight: 1.5, marginTop: 'auto' }}>{s.desc}</div>
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

          {/* 하단: Makefile + 폴더 구조 + Visualizer 개념 */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.15fr 0.85fr 1fr', gap: '0.6rem' }}>
            {/* Makefile */}
            <div style={{
              background: '#1A2235',
              border: '1px solid rgba(46,139,87,0.30)',
              borderRadius: '10px',
              padding: '0.6rem 0.9rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.66rem', color: DAY09, fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                Makefile — 4단계를 타겟 하나로
              </div>
              <pre style={{ margin: 0, fontSize: '0.6rem', lineHeight: 1.55, color: '#D4D4D4', whiteSpace: 'pre', fontFamily: 'ui-monospace, Consolas, monospace', flex: 1 }}>
                <span style={{ color: '#9CDCFE' }}>TOP</span>   = tb_top{"\n"}
                <span style={{ color: '#9CDCFE' }}>FLIST</span> = flist.f{"\n"}
                {"\n"}
                <span style={{ color: '#DCDCAA' }}>comp</span>:{"        "}<span style={{ color: '#6A9955' }}>## 1. 라이브러리+컴파일</span>{"\n"}
                {"\t"}vlib work{"\n"}
                {"\t"}vmap work work{"\n"}
                {"\t"}vlog -f $(<span style={{ color: '#9CDCFE' }}>FLIST</span>){"\n"}
                {"\n"}
                <span style={{ color: '#DCDCAA' }}>opt</span>: comp{"   "}<span style={{ color: '#6A9955' }}>## 2. design.bin 생성</span>{"\n"}
                {"\t"}vopt $(<span style={{ color: '#9CDCFE' }}>TOP</span>) -o opt -debug +designfile{"\n"}
                {"\n"}
                <span style={{ color: '#DCDCAA' }}>sim</span>: opt{"    "}<span style={{ color: '#6A9955' }}>## 3. qwavedb 기록</span>{"\n"}
                {"\t"}vsim -c opt -qwavedb=+signal+class \{"\n"}
                {"\t"}{"     "}-do <span style={{ color: '#CE9178' }}>"run -all; quit"</span>{"\n"}
                {"\n"}
                <span style={{ color: '#DCDCAA' }}>wave</span>:{"        "}<span style={{ color: '#6A9955' }}>## 4. Visualizer로 열기</span>{"\n"}
                {"\t"}visualizer -designfile design.bin \{"\n"}
                {"\t"}{"           "}-wavefile qwave.db &
              </pre>
              <div style={{ marginTop: '0.45rem', fontSize: '0.6rem', color: '#8Fb8a0', fontFamily: 'ui-monospace, Consolas, monospace' }}>
                <span style={{ color: '#F6AD55' }}>$ </span>make sim   <span style={{ color: '#6A9955' }}># comp→opt→sim 자동</span>{"   "}
                <span style={{ color: '#F6AD55' }}>$ </span>make wave
              </div>
            </div>

            {/* 권장 폴더 구조 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.6rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.5rem' }}>
                권장 프로젝트 구조
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.85rem' }}>📁</span>
                <code style={{
                  fontSize: '0.68rem', fontWeight: 800, color: FPGA.dark,
                  fontFamily: '"JetBrains Mono", monospace',
                }}>&lt;project&gt;/</code>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                {tree.map((t, i) => (
                  <div key={t.name} style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{
                      color: FPGA.textLight, fontFamily: 'ui-monospace, monospace',
                      fontSize: '0.66rem', flexShrink: 0,
                    }}>{i === tree.length - 1 ? '└─' : '├─'}</span>
                    <code style={{
                      fontSize: '0.66rem', fontWeight: 800, color: t.color,
                      background: `${t.color}12`, padding: '1px 6px', borderRadius: '4px',
                      fontFamily: '"JetBrains Mono", monospace', flexShrink: 0,
                    }}>{t.name}</code>
                    <span style={{ fontSize: '0.62rem', color: FPGA.textLight, lineHeight: 1.35 }}>{t.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.58rem', color: FPGA.textLight, marginTop: '0.5rem', lineHeight: 1.4 }}>
                생성물은 <code style={{ color: DAY09, fontFamily: 'ui-monospace, monospace' }}>sim/</code>에만 — 소스(rtl·tb)는 깨끗하게 유지.
              </div>
            </div>

            {/* Visualizer 개념 + post-sim 산출물 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                background: `linear-gradient(135deg, ${DAY09}07, ${DAY09}14)`,
                border: `1px solid ${DAY09}30`,
                borderRadius: '10px',
                padding: '0.6rem 0.85rem',
                boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: DAY09, marginBottom: '0.3rem' }}>
                  Visualizer = Post-sim 파형 디버거
                </div>
                <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.67rem', color: FPGA.text, lineHeight: 1.5 }}>
                  <li>시뮬을 <strong>배치(-c)로 끝낸 뒤</strong> 결과를 오프라인 분석</li>
                  <li>소스↔파형 양방향 연동 → 원인 신호로 점프</li>
                  <li>드라이버/값 추적으로 버그 근원 역추적</li>
                </ul>
              </div>

              {/* 두 개의 산출물 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[
                  { k: 'design.bin', by: 'vopt +designfile', d: '설계 계층·신호 구조' },
                  { k: 'qwavedb', by: 'vsim -qwavedb', d: '시간축 신호 값' },
                ].map((a) => (
                  <div key={a.k} style={{
                    background: FPGA.white,
                    border: `1px solid ${FPGA.border}`,
                    borderRadius: '10px',
                    padding: '0.5rem 0.7rem',
                    boxShadow: shadow.card,
                  }}>
                    <code style={{
                      fontSize: '0.66rem', color: DAY09, background: `${DAY09}12`,
                      padding: '1px 6px', borderRadius: '4px', fontWeight: 700,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}>{a.k}</code>
                    <div style={{ fontSize: '0.62rem', color: FPGA.dark, fontWeight: 700, marginTop: '0.3rem' }}>{a.d}</div>
                    <div style={{ fontSize: '0.58rem', color: FPGA.textLight, marginTop: '1px', fontFamily: 'ui-monospace, monospace' }}>← {a.by}</div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 'auto',
                background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.13))`,
                border: `1px solid ${FPGA.accent}30`,
                borderLeft: `4px solid ${FPGA.accent}`,
                borderRadius: '10px',
                padding: '0.5rem 0.85rem',
                boxShadow: shadow.card,
                display: 'flex', alignItems: 'center', gap: '0.6rem',
              }}>
                <span style={{ fontSize: '1.2rem' }}>💡</span>
                <div style={{ fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.45 }}>
                  명령은 외우지 말고 <strong style={{ color: FPGA.accent }}>Makefile에 고정</strong> · 학습 초점은 설계와 파형 분석.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
