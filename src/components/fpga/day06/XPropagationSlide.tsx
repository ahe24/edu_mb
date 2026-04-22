'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY06 = '#6B46C1';

function XPropWave() {
  return (
    <svg viewBox="0 0 340 180" style={{ width: '100%', height: 'auto' }}>
      <style>{`
        @keyframes xpPulse { 0%, 100% { opacity: 0.3 } 50% { opacity: 1 } }
        .xp-x { animation: xpPulse 1.8s ease-in-out infinite; }
      `}</style>
      {/* clk */}
      <text x="4" y="20" fontSize="10" fontWeight="800" fill="#4A6FA5" fontFamily="monospace">clk</text>
      <path d="M30 18h18v-10h18v10h18v-10h18v10h18v-10h18v10h18v-10h18v10h18v-10h18v10"
        stroke="#4A6FA5" strokeWidth="1.5" fill="none" />

      {/* reset 없는 FF */}
      <text x="4" y="56" fontSize="10" fontWeight="800" fill="#E53E3E" fontFamily="monospace">FF_no_rst</text>
      <rect className="xp-x" x="30" y="44" width="160" height="18" rx="2" fill="rgba(229,62,62,0.12)" stroke="#E53E3E" strokeWidth="1.3" strokeDasharray="4 2" />
      <text x="110" y="57" fontSize="11" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">X X X X X X X</text>
      <path d="M190 54h18v-12h18v12h18v-12h18v12h18v-12h18v12" stroke="#E53E3E" strokeWidth="1.5" fill="none" />

      {/* undriven source */}
      <text x="4" y="96" fontSize="10" fontWeight="800" fill="#E8913A" fontFamily="monospace">undriven</text>
      <rect className="xp-x" x="30" y="84" width="280" height="18" rx="2" fill="rgba(232,145,58,0.12)" stroke="#E8913A" strokeWidth="1.3" strokeDasharray="4 2" />
      <text x="170" y="97" fontSize="11" fontWeight="800" fill="#E8913A" textAnchor="middle" fontFamily="monospace">X X X X X X X X X X</text>

      {/* downstream */}
      <text x="4" y="136" fontSize="10" fontWeight="800" fill="#E53E3E" fontFamily="monospace">downstream</text>
      <rect className="xp-x" x="30" y="124" width="280" height="18" rx="2" fill="rgba(229,62,62,0.14)" stroke="#E53E3E" strokeWidth="1.3" />
      <text x="170" y="137" fontSize="11" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">X 전파 → V&amp;V 무효</text>

      {/* 시간 축 */}
      <line x1="30" y1="160" x2="320" y2="160" stroke="#718096" strokeWidth="0.8" />
      <text x="330" y="164" fontSize="9" fill="#718096" fontFamily="monospace">t</text>
    </svg>
  );
}

export default function XPropagationSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="DO-254 · SS17 · SS18"
          title="X-Propagation & Reset 취약성"
          subtitle="미구동 / 미제어 로직 → X 상태 전파 → 테스트 증빙 무효화"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* alias 배너 2개 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div style={{
              background: `linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.14))`,
              border: '1px solid rgba(229,62,62,0.35)',
              borderLeft: '4px solid #E53E3E',
              borderRadius: '10px',
              padding: '0.5rem 0.8rem',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: shadow.card,
            }}>
              <span style={{
                fontFamily: 'monospace', fontSize: '0.74rem', fontWeight: 800,
                color: '#fff', background: '#E53E3E',
                padding: '3px 10px', borderRadius: '5px',
              }}>SS17</span>
              <span style={{ fontSize: '0.72rem', color: FPGA.text, lineHeight: 1.45 }}>
                <strong>미구동/미사용 로직 금지</strong> · Error — X 원천
              </span>
            </div>
            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.14))`,
              border: '1px solid rgba(232,145,58,0.35)',
              borderLeft: '4px solid #E8913A',
              borderRadius: '10px',
              padding: '0.5rem 0.8rem',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: shadow.card,
            }}>
              <span style={{
                fontFamily: 'monospace', fontSize: '0.74rem', fontWeight: 800,
                color: '#fff', background: '#E8913A',
                padding: '3px 10px', borderRadius: '5px',
              }}>SS18</span>
              <span style={{ fontSize: '0.72rem', color: FPGA.text, lineHeight: 1.45 }}>
                <strong>레지스터 제어성 확보</strong> · Warning — DAL-A/B Error 상향
              </span>
            </div>
          </div>

          {/* 좌 파형 + 우 설명 */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white,
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '0.7rem 0.9rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.3rem',
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: FPGA.dark }}>
                X 전파 파형 — reset 미연결 FF · undriven signal
              </div>
              <XPropWave />
              <div style={{ fontSize: '0.66rem', color: FPGA.textLight, fontStyle: 'italic', textAlign: 'center' }}>
                X-optimism — sim 무시 · synth 실제 X 전파
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                {
                  alias: 'SS18',
                  color: '#E8913A',
                  title: 'reset 미연결 FF',
                  check: 'flop_without_control · const_reg_data',
                  body: 'reset 신호 부재 → 전원인가 시 X 상태 지속',
                },
                {
                  alias: 'SS17',
                  color: '#E53E3E',
                  title: 'undriven signal',
                  check: 'undriven_signal · undriven_reg_data · unconnected_inst',
                  body: '구동자 없는 wire → X 원천 · 다운스트림 오염',
                },
                {
                  alias: 'X-opt',
                  color: '#8B6FA5',
                  title: 'X-optimism 함정',
                  check: '(sim 도구 기본 설정)',
                  body: 'sim이 X 무시 → 테스트 증빙 부정확 · 감사 무효',
                },
              ].map((c) => (
                <div key={c.alias} style={{
                  background: FPGA.white,
                  border: `1px solid ${c.color}30`,
                  borderLeft: `3px solid ${c.color}`,
                  borderRadius: '8px',
                  padding: '0.5rem 0.7rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  display: 'flex', flexDirection: 'column', gap: '2px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '0.62rem', fontWeight: 800,
                      color: c.color, background: `${c.color}15`,
                      border: `1px solid ${c.color}35`,
                      padding: '1px 6px', borderRadius: '4px',
                    }}>{c.alias}</span>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: FPGA.dark }}>{c.title}</span>
                  </div>
                  <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.45 }}>{c.body}</div>
                  <code style={{ fontSize: '0.58rem', color: FPGA.textLight, fontFamily: 'monospace' }}>{c.check}</code>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 safety-critical 배너 */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY06}08, ${DAY06}16)`,
            border: `1px solid ${DAY06}35`,
            borderRadius: '10px',
            padding: '0.55rem 0.9rem',
            fontSize: '0.72rem',
            color: FPGA.text,
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            boxShadow: shadow.card,
          }}>
            <span style={{ color: DAY06, fontWeight: 800 }}>safety-critical:</span>
            <span>
              <strong>DO-254 §6.2.1</strong> · <strong>IEC 62566</strong> deterministic initialization 요구 —
              DAL-A/B 프로젝트는 <code style={{ fontFamily: 'monospace' }}>SS18</code> severity를 <strong style={{ color: '#E53E3E' }}>Error로 상향</strong> 필요 (prefs Tcl 오버라이드).
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
