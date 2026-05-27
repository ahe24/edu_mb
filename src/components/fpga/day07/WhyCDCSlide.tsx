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
          badge="CDC 검증 필요성"
          title="왜 CDC 검증이 필수인가"
          subtitle="단일 clock 시스템은 사실상 존재하지 않는다 — 비동기 도메인은 설계 필연"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {/* 배너 SVG — 다중 clock domain 인터페이스 구조도 */}
          <div style={{
            width: '100%',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: shadow.card,
            border: `1px solid ${DAY07}20`,
            background: 'linear-gradient(135deg, #1e293b, #2a3a50)',
            lineHeight: 0,
          }}>
            <svg viewBox="0 0 1180 155" style={{ width: '100%', display: 'block' }}>
              {/* ── System A: Sensor / Actuator ── */}
              {/* 외부 인터페이스 블록들 */}
              <rect x="18" y="18" width="90" height="32" rx="5" fill="rgba(221,107,32,0.15)" stroke="#DD6B20" strokeWidth="1.2" />
              <text x="63" y="32" fontSize="8.5" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>ADC / DAC</text>
              <text x="63" y="43" fontSize="7" fill="#DD6B20" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.7">50 MHz</text>

              <rect x="18" y="60" width="90" height="32" rx="5" fill="rgba(72,187,120,0.12)" stroke="#48BB78" strokeWidth="1.2" />
              <text x="63" y="74" fontSize="8.5" fontWeight="700" fill="#48BB78" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>SPI / I²C</text>
              <text x="63" y="85" fontSize="7" fill="#48BB78" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.7">25 MHz</text>

              <rect x="18" y="102" width="90" height="32" rx="5" fill="rgba(139,111,165,0.15)" stroke="#8B6FA5" strokeWidth="1.2" />
              <text x="63" y="116" fontSize="8.5" fontWeight="700" fill="#8B6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>Watchdog</text>
              <text x="63" y="127" fontSize="7" fill="#8B6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.7">32 kHz (RC osc)</text>

              {/* FPGA 블록 A */}
              <rect x="140" y="12" width="130" height="132" rx="8" fill="rgba(8,145,178,0.08)" stroke={DAY07} strokeWidth="1.5" />
              <text x="205" y="28" fontSize="9" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>FPGA Fabric</text>
              {/* 내부 도메인 표시 */}
              <rect x="150" y="35" width="110" height="22" rx="4" fill="rgba(221,107,32,0.10)" stroke="#DD6B20" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="205" y="49" fontSize="7" fill="#DD6B20" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>clk_adc (50 MHz)</text>
              <rect x="150" y="62" width="110" height="22" rx="4" fill="rgba(72,187,120,0.10)" stroke="#48BB78" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="205" y="76" fontSize="7" fill="#48BB78" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>clk_ctrl (100 MHz)</text>
              <rect x="150" y="89" width="110" height="22" rx="4" fill="rgba(139,111,165,0.10)" stroke="#8B6FA5" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="205" y="103" fontSize="7" fill="#8B6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>clk_wdt (32 kHz)</text>
              {/* CDC crossing 표시 */}
              <line x1="152" y1="57" x2="258" y2="57" stroke="#E53E3E" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
              <line x1="152" y1="84" x2="258" y2="84" stroke="#E53E3E" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
              <text x="205" y="121" fontSize="6.5" fontWeight="700" fill="#E53E3E" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.8">3 CDC boundaries</text>

              {/* 연결선 A */}
              <line x1="108" y1="34" x2="140" y2="46" stroke="#DD6B20" strokeWidth="1" opacity="0.6" />
              <line x1="108" y1="76" x2="140" y2="73" stroke="#48BB78" strokeWidth="1" opacity="0.6" />
              <line x1="108" y1="118" x2="140" y2="100" stroke="#8B6FA5" strokeWidth="1" opacity="0.6" />

              {/* 시스템 라벨 A */}
              <text x="150" y="152" fontSize="7.5" fontWeight="700" fill="rgba(255,255,255,0.5)" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>Sensor / Actuator System</text>

              {/* ── System B: SoC / Communication ── */}
              <rect x="320" y="18" width="90" height="32" rx="5" fill="rgba(74,111,165,0.18)" stroke="#4A6FA5" strokeWidth="1.2" />
              <text x="365" y="32" fontSize="8.5" fontWeight="700" fill="#6B8CC7" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>PCIe Gen3</text>
              <text x="365" y="43" fontSize="7" fill="#6B8CC7" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.7">250 MHz</text>

              <rect x="320" y="60" width="90" height="32" rx="5" fill="rgba(8,145,178,0.15)" stroke={DAY07} strokeWidth="1.2" />
              <text x="365" y="74" fontSize="8.5" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>GbE RGMII</text>
              <text x="365" y="85" fontSize="7" fill={DAY07} textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.7">125 MHz</text>

              <rect x="320" y="102" width="90" height="32" rx="5" fill="rgba(221,107,32,0.15)" stroke="#DD6B20" strokeWidth="1.2" />
              <text x="365" y="116" fontSize="8.5" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>DDR4</text>
              <text x="365" y="127" fontSize="7" fill="#DD6B20" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.7">1200 MHz</text>

              {/* FPGA 블록 B */}
              <rect x="442" y="12" width="130" height="132" rx="8" fill="rgba(8,145,178,0.08)" stroke={DAY07} strokeWidth="1.5" />
              <text x="507" y="28" fontSize="9" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>FPGA Fabric</text>
              <rect x="452" y="35" width="110" height="22" rx="4" fill="rgba(74,111,165,0.10)" stroke="#4A6FA5" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="507" y="49" fontSize="7" fill="#6B8CC7" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>clk_pcie (250 MHz)</text>
              <rect x="452" y="62" width="110" height="22" rx="4" fill="rgba(8,145,178,0.10)" stroke={DAY07} strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="507" y="76" fontSize="7" fill={DAY07} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>clk_eth (125 MHz)</text>
              <rect x="452" y="89" width="110" height="22" rx="4" fill="rgba(221,107,32,0.10)" stroke="#DD6B20" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="507" y="103" fontSize="7" fill="#DD6B20" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>clk_ddr (1200 MHz)</text>
              <line x1="454" y1="57" x2="560" y2="57" stroke="#E53E3E" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
              <line x1="454" y1="84" x2="560" y2="84" stroke="#E53E3E" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
              <text x="507" y="121" fontSize="6.5" fontWeight="700" fill="#E53E3E" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.8">3 CDC boundaries</text>

              <line x1="410" y1="34" x2="442" y2="46" stroke="#4A6FA5" strokeWidth="1" opacity="0.6" />
              <line x1="410" y1="76" x2="442" y2="73" stroke={DAY07} strokeWidth="1" opacity="0.6" />
              <line x1="410" y1="118" x2="442" y2="100" stroke="#DD6B20" strokeWidth="1" opacity="0.6" />

              <text x="450" y="152" fontSize="7.5" fontWeight="700" fill="rgba(255,255,255,0.5)" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>SoC / Communication</text>

              {/* ── System C: Safety-Critical ── */}
              <rect x="622" y="18" width="90" height="32" rx="5" fill="rgba(8,145,178,0.15)" stroke={DAY07} strokeWidth="1.2" />
              <text x="667" y="32" fontSize="8.5" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>TMR Ch.A</text>
              <text x="667" y="43" fontSize="7" fill={DAY07} textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.7">80 MHz (osc1)</text>

              <rect x="622" y="60" width="90" height="32" rx="5" fill="rgba(72,187,120,0.12)" stroke="#48BB78" strokeWidth="1.2" />
              <text x="667" y="74" fontSize="8.5" fontWeight="700" fill="#48BB78" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>TMR Ch.B</text>
              <text x="667" y="85" fontSize="7" fill="#48BB78" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.7">80 MHz (osc2)</text>

              <rect x="622" y="102" width="90" height="32" rx="5" fill="rgba(232,145,58,0.12)" stroke="#E8913A" strokeWidth="1.2" />
              <text x="667" y="116" fontSize="8.5" fontWeight="700" fill="#E8913A" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>Voter + WDT</text>
              <text x="667" y="127" fontSize="7" fill="#E8913A" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.7">40 MHz (osc3)</text>

              {/* FPGA 블록 C */}
              <rect x="744" y="12" width="130" height="132" rx="8" fill="rgba(8,145,178,0.08)" stroke={DAY07} strokeWidth="1.5" />
              <text x="809" y="28" fontSize="9" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>FPGA Fabric</text>
              <rect x="754" y="35" width="110" height="18" rx="4" fill="rgba(8,145,178,0.10)" stroke={DAY07} strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="809" y="47" fontSize="6.5" fill={DAY07} textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>clk_tmrA (80 MHz)</text>
              <rect x="754" y="57" width="110" height="18" rx="4" fill="rgba(72,187,120,0.10)" stroke="#48BB78" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="809" y="69" fontSize="6.5" fill="#48BB78" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>clk_tmrB (80 MHz)</text>
              <rect x="754" y="79" width="110" height="18" rx="4" fill="rgba(232,145,58,0.10)" stroke="#E8913A" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="809" y="91" fontSize="6.5" fill="#E8913A" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>clk_voter (40 MHz)</text>
              <line x1="756" y1="53" x2="862" y2="53" stroke="#E53E3E" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
              <line x1="756" y1="75" x2="862" y2="75" stroke="#E53E3E" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
              {/* 동일 주파수지만 비동기 osc → CDC 필요 강조 */}
              <text x="809" y="108" fontSize="6.5" fontWeight="700" fill="#E8913A" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.9">동일 주파수 · 다른 oscillator</text>
              <text x="809" y="119" fontSize="6.5" fontWeight="700" fill="#E53E3E" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.8">= 비동기 → CDC 필수</text>
              <text x="809" y="133" fontSize="6.5" fontWeight="700" fill="#E53E3E" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' opacity="0.8">4 CDC boundaries</text>

              <line x1="712" y1="34" x2="744" y2="44" stroke={DAY07} strokeWidth="1" opacity="0.6" />
              <line x1="712" y1="76" x2="744" y2="66" stroke="#48BB78" strokeWidth="1" opacity="0.6" />
              <line x1="712" y1="118" x2="744" y2="88" stroke="#E8913A" strokeWidth="1" opacity="0.6" />

              <text x="750" y="152" fontSize="7.5" fontWeight="700" fill="rgba(255,255,255,0.5)" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>Safety-Critical (TMR)</text>

              {/* ── 우측 요약 패널 ── */}
              <rect x="905" y="16" width="258" height="126" rx="8" fill="rgba(229,62,62,0.06)" stroke="#E53E3E" strokeWidth="1" strokeDasharray="4 3" />
              <text x="1034" y="35" fontSize="10" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>Why CDC Verification?</text>
              <line x1="935" y1="42" x2="1133" y2="42" stroke="#E53E3E" strokeWidth="0.5" opacity="0.4" />
              <text x="925" y="58" fontSize="8" fill="rgba(255,255,255,0.75)" fontFamily='"JetBrains Mono", monospace'>
                <tspan x="925" dy="0">▸ 3개 이상의 비동기 도메인이 일반적</tspan>
                <tspan x="925" dy="16">▸ 동일 주파수도 oscillator가 다르면 비동기</tspan>
                <tspan x="925" dy="16">▸ 매 crossing마다 metastability 위험</tspan>
                <tspan x="925" dy="16">▸ simulation으로 검출 불가능</tspan>
                <tspan x="925" dy="16">▸ 정적 구조 분석만이 전수 검사 보장</tspan>
              </text>
            </svg>
          </div>

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
