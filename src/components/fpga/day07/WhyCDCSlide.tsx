'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY07 = '#0891B2';

const cases = [
  {
    title: 'Sensor / Actuator',
    sub: '독립 ADC clock · 처리 clock 분리',
    items: [
      'ADC sample clock (50 MHz)',
      '제어 알고리즘 clock (100 MHz)',
      '외부 통신 clock (25/40 MHz)',
    ],
    icon: 'sensor',
  },
  {
    title: 'SoC / FPGA 융합',
    sub: 'IP block 별 clock · 외부 host bus',
    items: [
      'CPU/MCU subsystem clock',
      'PCIe/Ethernet/USB PHY clock',
      'DDR / HBM memory clock',
    ],
    icon: 'soc',
  },
  {
    title: '안전성 분리',
    sub: '리던던시 + 도메인 격리 요구',
    items: [
      'Watchdog 독립 oscillator',
      'TMR(Triple) 별도 clock source',
      'Fail-safe 영역 격리 clock',
    ],
    icon: 'safety',
  },
];

export default function WhyCDCSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="배경"
          title="왜 CDC 검증이 필수인가"
          subtitle="단일 clock 시스템은 사실상 존재하지 않는다 — 비동기 도메인은 설계 필연"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {/* 상단 — 핵심 명제 배너 */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY07}08, ${DAY07}16)`,
            border: `1px solid ${DAY07}35`,
            borderLeft: `4px solid ${DAY07}`,
            borderRadius: '10px',
            padding: '0.65rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            boxShadow: shadow.card,
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.78rem', fontWeight: 800,
              color: '#fff', background: DAY07,
              padding: '3px 10px', borderRadius: '5px',
              letterSpacing: '0.06em',
            }}>KEY</span>
            <div style={{ fontSize: '0.85rem', color: FPGA.text, flex: 1, lineHeight: 1.5 }}>
              현대 safety-critical FPGA는 <strong>3개 이상의 비동기 도메인</strong>이 일반적 · STA로는 검증 불가능한 <strong>구조적 결함</strong>이 발생
            </div>
          </div>

          {/* 3가지 시나리오 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.7rem' }}>
            {cases.map((c) => (
              <div key={c.title} style={{
                background: FPGA.white,
                border: `1px solid ${DAY07}25`,
                borderTop: `3px solid ${DAY07}`,
                borderRadius: '10px',
                padding: '0.8rem 0.9rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    {c.icon === 'sensor' && (
                      <>
                        <circle cx="11" cy="11" r="8" stroke={DAY07} strokeWidth="1.5" />
                        <circle cx="11" cy="11" r="3" fill={DAY07} />
                        <path d="M11 3v2M11 17v2M3 11h2M17 11h2" stroke={DAY07} strokeWidth="1.5" strokeLinecap="round" />
                      </>
                    )}
                    {c.icon === 'soc' && (
                      <>
                        <rect x="3" y="3" width="16" height="16" rx="2" stroke={DAY07} strokeWidth="1.5" />
                        <path d="M7 7h8v8H7z" stroke={DAY07} strokeWidth="1.5" />
                        <path d="M3 9h2M3 13h2M17 9h2M17 13h2M9 3v2M13 3v2M9 17v2M13 17v2" stroke={DAY07} strokeWidth="1.5" />
                      </>
                    )}
                    {c.icon === 'safety' && (
                      <>
                        <path d="M11 2L4 5v6c0 4 3 7 7 9 4-2 7-5 7-9V5l-7-3z" stroke={DAY07} strokeWidth="1.5" fill="none" />
                        <path d="M8 11l2 2 4-4" stroke={DAY07} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    )}
                  </svg>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: FPGA.dark }}>{c.title}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: DAY07, fontWeight: 600, fontFamily: 'monospace' }}>
                  {c.sub}
                </div>
                <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.65 }}>
                  {c.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>

          {/* 하단 — Why static? 박스 */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.14))',
              border: '1px solid rgba(229,62,62,0.30)',
              borderLeft: '4px solid #E53E3E',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#E53E3E', marginBottom: '0.4rem' }}>
                ⚠ Simulation의 한계
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.74rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li>RTL sim은 metastability를 정확히 모사 못 함</li>
                <li>출력 천이 시점이 <strong>cycle 단위 비결정</strong></li>
                <li>실 hardware에서만 발생하는 silent fault</li>
                <li>수백 시간 sim해도 발견 못 함 · 양산 후 발견되는 사례 빈번</li>
              </ul>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.14))',
              border: '1px solid rgba(72,187,120,0.30)',
              borderLeft: '4px solid #48BB78',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#48BB78', marginBottom: '0.4rem' }}>
                ✓ 정적 CDC 분석
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.74rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li>netlist 기반 — 모든 crossing 경로 망라</li>
                <li>구조적 결함을 <strong>vector 없이</strong> 검출</li>
                <li>도메인 + 동기화 scheme 자동 분류</li>
                <li>안전 critical V&V 산출물로 채택</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
