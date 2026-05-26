'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY07 = '#0891B2';

const phases = [
  {
    n: '1',
    name: 'Compile',
    cmd: 'vlog -f filelist',
    desc: 'RTL → work library',
    col: '#4A6FA5',
  },
  {
    n: '2',
    name: 'Setup',
    cmd: 'cdc setup -d top',
    desc: 'Clock / reset / port domain 추론',
    col: DAY07,
  },
  {
    n: '3',
    name: 'Run',
    cmd: 'cdc run -d top',
    desc: 'CDC 분석 + scheme 분류',
    col: '#0E7C7B',
  },
  {
    n: '4',
    name: 'Debug',
    cmd: 'qverify cdc.db',
    desc: 'GUI · schematic · waiver',
    col: '#8B6FA5',
  },
];

const severities = [
  { name: 'Violation', desc: '구조적 오류 · 반드시 수정', col: '#E53E3E' },
  { name: 'Caution', desc: 'Protocol 검증 필요 · SVA 자동 promote', col: '#E8913A' },
  { name: 'Evaluation', desc: '정상 sync · metastability 불가', col: '#4A6FA5' },
  { name: 'Proven', desc: 'Formal 증명 완료', col: '#48BB78' },
];

export default function StaticFlowSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="흐름"
          title="정적 CDC 분석 흐름 + 산출물"
          subtitle="Compile → Setup → Run → Debug · 4단계 · 결과 등급 4종"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* 4-phase flow */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>
            {phases.map((p, i) => (
              <div key={p.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${p.col}06, ${p.col}14)`,
                  border: `1px solid ${p.col}25`,
                  borderTop: `3px solid ${p.col}`,
                  borderRadius: '10px',
                  padding: '0.7rem 0.8rem',
                  boxShadow: shadow.card,
                  display: 'flex', flexDirection: 'column', gap: '0.35rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: `${p.col}20`,
                      border: `2px solid ${p.col}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.74rem', fontWeight: 800, color: p.col,
                    }}>{p.n}</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: FPGA.dark }}>{p.name}</span>
                  </div>
                  <code style={{
                    fontSize: '0.66rem',
                    background: '#1A2235', color: '#A8D8A8',
                    padding: '3px 7px', borderRadius: '4px',
                    fontFamily: 'monospace',
                    alignSelf: 'flex-start',
                  }}>{p.cmd}</code>
                  <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.45 }}>
                    {p.desc}
                  </div>
                </div>
                {i < phases.length - 1 && (
                  <div style={{ padding: '0 4px', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <path d="M3 8h8M8 4l4 4-4 4" stroke={FPGA.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 산출물 + 결과 등급 */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.6rem',
          }}>
            {/* 산출물 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.65rem 0.9rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: FPGA.dark }}>
                생성되는 산출물 (<code>-od cdc_result</code>)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem 0.5rem', fontSize: '0.67rem' }}>
                {[
                  { f: 'cdc.db', d: 'GUI 로드용 binary DB' },
                  { f: 'cdc.rpt', d: '요약 + clock summary + port domain' },
                  { f: 'cdc_detail.rpt', d: 'crossing 별 상세' },
                  { f: 'cdc_design.rpt', d: '설계 분석 결과' },
                  { f: 'cdc_setting.rpt', d: '적용된 directives' },
                  { f: 'cdc_run.log', d: '전체 transcript' },
                ].map((o) => (
                  <div key={o.f} style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <code style={{
                      fontSize: '0.62rem',
                      background: `${DAY07}10`, color: DAY07,
                      padding: '1px 6px', borderRadius: '3px',
                      fontFamily: 'monospace',
                      alignSelf: 'flex-start',
                      border: `1px solid ${DAY07}25`,
                    }}>{o.f}</code>
                    <span style={{ fontSize: '0.62rem', color: FPGA.textLight, lineHeight: 1.35, paddingLeft: '6px' }}>{o.d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 결과 등급 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.65rem 0.9rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.35rem',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: FPGA.dark }}>
                결과 등급 — 심각도
              </div>
              {severities.map((s) => (
                <div key={s.name} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: `${s.col}08`,
                  border: `1px solid ${s.col}25`,
                  borderLeft: `3px solid ${s.col}`,
                  borderRadius: '6px',
                  padding: '0.3rem 0.55rem',
                }}>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 800,
                    color: s.col, minWidth: '78px',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}>{s.name}</span>
                  <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.4 }}>{s.desc}</span>
                </div>
              ))}
              <div style={{ fontSize: '0.6rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.2rem' }}>
                Status: Uninspected → Waived / Fixed / Verified / Pending / Bug
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
