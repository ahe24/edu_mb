'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY07 = '#0891B2';

export default function MetastabilitySlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="이론"
          title="Metastability — 비동기 천이의 물리적 한계"
          subtitle="Setup/Hold 위반 → 부정한 값 → downstream 파급"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* 상단 — 발생 메커니즘 + 파형 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.7rem' }}>
            {/* 좌: 파형 다이어그램 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${DAY07}25`,
              borderTop: `3px solid ${DAY07}`,
              borderRadius: '10px',
              padding: '0.7rem 0.9rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.25rem' }}>
                Setup / Hold 위반 → META → 다음 cycle 정상 캡처
              </div>
              <div style={{ fontSize: '0.66rem', fontWeight: 500, color: FPGA.textLight, marginBottom: '0.4rem' }}>
                CLK_TX 도메인 <strong>DATA</strong> 천이가 CLK_RX의 <strong>tsu / th window</strong> 안에서 발생 시 RX flop 출력 Q 가 metastable
              </div>
              <svg viewBox="0 0 480 220" style={{ width: '100%', height: 'auto' }}>
                {/* === Setup window (RX edge 150 직전) === */}
                <rect x="142" y="10" width="8" height="198" fill="rgba(229,62,62,0.07)" stroke="#E53E3E" strokeWidth="0.7" strokeDasharray="2 2" />
                <text x="146" y="7" fontSize="6.8" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">tsu</text>
                {/* === Hold window (RX edge 330 직후) === */}
                <rect x="330" y="10" width="8" height="198" fill="rgba(229,62,62,0.07)" stroke="#E53E3E" strokeWidth="0.7" strokeDasharray="2 2" />
                <text x="334" y="7" fontSize="6.8" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">th</text>

                {/* === CLK_TX (period 63, 7 cycles) === */}
                <text x="6" y="32" fontSize="10.5" fontWeight="800" fill="#DD6B20" fontFamily="monospace">CLK_TX</text>
                <path d="M 50,38 L 80,38 L 80,18 L 112,18 L 112,38 L 143,38 L 143,18 L 175,18 L 175,38 L 206,38 L 206,18 L 238,18 L 238,38 L 269,38 L 269,18 L 301,18 L 301,38 L 332,38 L 332,18 L 364,18 L 364,38 L 395,38 L 395,18 L 427,18 L 427,38 L 458,38 L 458,18 L 478,18"
                      stroke="#DD6B20" strokeWidth="1.5" fill="none" />

                {/* === CLK_RX (period 90, 5 edges: 60/150/240/330/420) === */}
                <text x="6" y="73" fontSize="10.5" fontWeight="800" fill={DAY07} fontFamily="monospace">CLK_RX</text>
                <path d="M 50,82 L 60,82 L 60,56 L 105,56 L 105,82 L 150,82 L 150,56 L 195,56 L 195,82 L 240,82 L 240,56 L 285,56 L 285,82 L 330,82 L 330,56 L 375,56 L 375,82 L 420,82 L 420,56 L 465,56 L 465,82 L 478,82"
                      stroke={DAY07} strokeWidth="1.5" fill="none" />
                {/* RX edge 마커 — 위반(red) / 정상(green) */}
                <circle cx="150" cy="56" r="3.5" fill="#E53E3E" />
                <text x="150" y="49" fontSize="6.6" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">tsu 위반</text>
                <circle cx="240" cy="56" r="3" fill="#48BB78" />
                <text x="240" y="49" fontSize="6.6" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily="monospace">정상 (1↑)</text>
                <circle cx="330" cy="56" r="3.5" fill="#E53E3E" />
                <text x="330" y="49" fontSize="6.6" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">th 위반</text>
                <circle cx="420" cy="56" r="3" fill="#48BB78" />
                <text x="420" y="49" fontSize="6.6" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily="monospace">정상 (0↑)</text>

                {/* === DATA (TX 도메인) — LOW→HIGH @ x=145 (TX edge 143), HIGH→LOW @ x=334 (TX edge 332) === */}
                <text x="6" y="128" fontSize="10.5" fontWeight="800" fill="#DD6B20" fontFamily="monospace">DATA</text>
                <path d="M 50,138 L 143,138 L 147,114 L 332,114 L 336,138 L 478,138"
                      stroke="#DD6B20" strokeWidth="1.5" fill="none" />
                {/* TX edge 가이드 (DATA 천이 시점 표시) */}
                <line x1="143" y1="38" x2="143" y2="138" stroke="#DD6B20" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.45" />
                <line x1="332" y1="38" x2="332" y2="114" stroke="#DD6B20" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.45" />

                {/* === Q (RX flop 출력) === */}
                <text x="6" y="180" fontSize="10.5" fontWeight="800" fill={DAY07} fontFamily="monospace">Q</text>

                {/* Stable LOW : 50 → 150 (edge 1 캡처: DATA=0) */}
                <path d="M 50,188 L 150,188" stroke={DAY07} strokeWidth="1.5" fill="none" />

                {/* META 1 — persistence fan-out (LOW→HIGH, decay 시간 차등). 모든 trace 시작 (150,188) → 끝 (240,164) 공통 — settle 속도만 다름 */}
                <g stroke="#E53E3E" fill="none" strokeLinecap="round">
                  <path d="M 150,188 C 162,170 178,164 240,164" strokeWidth="1.6" opacity="0.85" />
                  <path d="M 150,188 C 175,176 200,164 240,164" strokeWidth="1.4" opacity="0.72" />
                  <path d="M 150,188 C 190,178 220,168 240,164" strokeWidth="1.3" opacity="0.62" />
                  <path d="M 150,188 C 210,182 232,172 240,164" strokeWidth="1.2" opacity="0.50" />
                  <path d="M 150,188 C 225,184 237,176 240,164" strokeWidth="1.1" opacity="0.40" />
                  <path d="M 150,188 C 232,186 239,180 240,164" strokeWidth="1.0" opacity="0.30" />
                </g>

                {/* Stable HIGH : 240 → 330 (edge 3 정상 캡처: DATA=1) */}
                <path d="M 240,164 L 330,164" stroke={DAY07} strokeWidth="1.5" fill="none" />

                {/* META 2 — persistence fan-out (HIGH→LOW, decay 시간 차등). 시작 (330,164) → 끝 (420,188) 공통 */}
                <g stroke="#E53E3E" fill="none" strokeLinecap="round">
                  <path d="M 330,164 C 342,182 362,188 420,188" strokeWidth="1.6" opacity="0.85" />
                  <path d="M 330,164 C 355,176 380,188 420,188" strokeWidth="1.4" opacity="0.72" />
                  <path d="M 330,164 C 370,174 400,184 420,188" strokeWidth="1.3" opacity="0.62" />
                  <path d="M 330,164 C 390,170 412,180 420,188" strokeWidth="1.2" opacity="0.50" />
                  <path d="M 330,164 C 405,168 417,176 420,188" strokeWidth="1.1" opacity="0.40" />
                  <path d="M 330,164 C 412,166 419,172 420,188" strokeWidth="1.0" opacity="0.30" />
                </g>

                {/* Stable LOW : 420 → 478 (edge 5 정상 캡처: DATA=0) */}
                <path d="M 420,188 L 478,188" stroke={DAY07} strokeWidth="1.5" fill="none" />

                {/* META 라벨 (각 fan-out 영역 위) */}
                <text x="195" y="155" fontSize="9" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">META</text>
                <text x="375" y="155" fontSize="9" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">META</text>

                {/* 하단 캡션 */}
                <text x="240" y="216" fontSize="7.5" fontStyle="italic" fontWeight="700" fill={FPGA.text} textAnchor="middle" fontFamily="monospace">META 이후 → 다음 RX edge에서 안정된 DATA 정상 캡처</text>
              </svg>
            </div>

            {/* 우: 핵심 개념 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))',
              border: '1px solid rgba(229,62,62,0.30)',
              borderRadius: '10px',
              padding: '0.7rem 0.9rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#E53E3E' }}>
                Out-of-band 신호
              </div>
              <div style={{ fontSize: '0.74rem', color: FPGA.text, lineHeight: 1.6 }}>
                Metastable 신호는 <strong>0도 1도 아닌</strong> 중간값. Downstream 로직이 이 신호를 sample하면:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li>여러 flop이 동일 신호를 <strong>서로 다른 값</strong>으로 받음</li>
                <li>FSM <strong>illegal state</strong> 진입</li>
                <li>Counter <strong>비결정 jump</strong> · 데이터 파괴</li>
                <li>안전 critical: <strong>silent failure</strong>로 직결</li>
              </ul>
            </div>
          </div>

          {/* 하단 — 4가지 시나리오 (HW vs SIM 비교) */}
          <div style={{
            background: FPGA.white,
            border: `1px solid ${FPGA.border}`,
            borderRadius: '10px',
            padding: '0.65rem 0.9rem',
            boxShadow: shadow.card,
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.45rem' }}>
              4가지 Metastability 시나리오 — Hardware vs RTL Simulation
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem' }}>
              {[
                { title: '① setup 위반 + HW match', sim: 'HW가 sim 예측대로 천이', label: 'OK', col: '#48BB78' },
                { title: '② setup 위반 + HW miss', sim: 'HW만 1 cycle <strong>지연</strong>', label: 'MISMATCH', col: '#E53E3E' },
                { title: '③ hold 위반 + HW match', sim: 'HW가 sim 예측대로 유지', label: 'OK', col: '#48BB78' },
                { title: '④ hold 위반 + HW miss', sim: 'HW만 1 cycle <strong>선행</strong>', label: 'MISMATCH', col: '#E53E3E' },
              ].map((s) => (
                <div key={s.title} style={{
                  background: `${s.col}08`,
                  border: `1px solid ${s.col}25`,
                  borderTop: `3px solid ${s.col}`,
                  borderRadius: '8px',
                  padding: '0.5rem 0.6rem',
                  display: 'flex', flexDirection: 'column', gap: '0.3rem',
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: FPGA.dark, lineHeight: 1.35 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}
                    dangerouslySetInnerHTML={{ __html: s.sim }} />
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.6rem', fontWeight: 800,
                    color: s.col, background: `${s.col}15`,
                    border: `1px solid ${s.col}35`,
                    padding: '1px 6px', borderRadius: '4px',
                    alignSelf: 'flex-start',
                  }}>{s.label}</span>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.7rem', color: FPGA.textLight, lineHeight: 1.55,
              fontStyle: 'italic', textAlign: 'center',
            }}>
              RTL simulation은 시나리오 ①③만 정확히 모사 · <strong style={{ color: '#E53E3E' }}>②④ (50% 확률)</strong>는 sim에서 누락 → 정적 CDC 분석 + CDC-FX injection 필수
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
