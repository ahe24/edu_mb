'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY07 = '#0891B2';

export default function MultiBitCoherencySlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="이론"
          title="Multi-bit 일관성 · Reconvergence"
          subtitle="단일 bit OK ≠ bus OK · 동기화 후 합쳐지는 신호의 위험"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* 상단 — multi_bits 문제 (BAD vs GOOD) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))',
              border: '1px solid rgba(229,62,62,0.30)',
              borderLeft: '4px solid #E53E3E',
              borderRadius: '10px',
              padding: '0.7rem 0.9rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#E53E3E', marginBottom: '0.35rem' }}>
                ✗ Multi-bit + per-bit 2-DFF
              </div>
              <svg viewBox="0 0 380 100" style={{ width: '100%' }}>
                {[0, 1, 2].map((i) => (
                  <g key={i}>
                    <rect x="10" y={10 + i * 28} width="42" height="20" rx="3" stroke="#4A6FA5" strokeWidth="1.2" fill="rgba(74,111,165,0.10)" />
                    <text x="31" y={24 + i * 28} fontSize="9" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily="monospace">d[{i}]</text>
                    <path d={`M52 ${20 + i * 28} L140 ${20 + i * 28}`} stroke="#4A6FA5" strokeWidth="1.2" />
                    {/* 2DFF */}
                    <rect x="140" y={10 + i * 28} width="60" height="20" rx="3" stroke="#E53E3E" strokeWidth="1.2" fill="rgba(229,62,62,0.06)" />
                    <text x="170" y={24 + i * 28} fontSize="8" fontWeight="700" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">2DFF</text>
                    {/* receiver */}
                    <path d={`M200 ${20 + i * 28} L300 ${20 + i * 28}`} stroke="#E53E3E" strokeWidth="1.2" strokeDasharray="3 2" />
                    <rect x="300" y={10 + i * 28} width="40" height="20" rx="3" stroke="#E53E3E" strokeWidth="1.2" fill="rgba(229,62,62,0.06)" />
                    <text x="320" y={24 + i * 28} fontSize="8" fontWeight="700" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">FSM</text>
                  </g>
                ))}
                <text x="190" y="100" fontSize="9" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">각 bit의 지연이 달라 → bus 값 corrupt</text>
              </svg>
              <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1rem', fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.55 }}>
                <li>bit별 metastability 해소 시점이 서로 다름</li>
                <li>3'b011 → 3'b100 천이 시 011 / 010 / 110 / 100 등 <strong>중간값</strong> 발생</li>
                <li>scheme: <code>multi_bits</code> · Violation</li>
              </ul>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(72,187,120,0.05), rgba(72,187,120,0.12))',
              border: '1px solid rgba(72,187,120,0.30)',
              borderLeft: '4px solid #48BB78',
              borderRadius: '10px',
              padding: '0.7rem 0.9rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#48BB78', marginBottom: '0.35rem' }}>
                ✓ Bus 일관성 보장 패턴
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.72rem', color: FPGA.text, lineHeight: 1.55 }}>
                <div>
                  <strong style={{ color: '#48BB78' }}>① Stable (configuration)</strong>: SW가 한번만 write · RX는 충분히 안정된 후 read.
                  <br />→ <code>cdc signal threshold -stable</code>
                </div>
                <div>
                  <strong style={{ color: '#48BB78' }}>② Gray code</strong>: 한 번에 1 bit만 변화 → bit별 sync 가능. FIFO 포인터에 적용.
                </div>
                <div>
                  <strong style={{ color: '#48BB78' }}>③ DMUX / Handshake</strong>: 별도 동기 신호로 capture timing 제어. TX는 안정 구간 동안 hold.
                </div>
                <div>
                  <strong style={{ color: '#48BB78' }}>④ Async FIFO</strong>: 가장 깔끔. 데이터 + valid + flow control 자동.
                </div>
              </div>
            </div>
          </div>

          {/* 하단 — Reconvergence 설명 */}
          <div style={{
            flex: 1, minHeight: 0,
            background: FPGA.white,
            border: `1px solid ${DAY07}25`,
            borderTop: `3px solid ${DAY07}`,
            borderRadius: '10px',
            padding: '0.7rem 0.9rem',
            boxShadow: shadow.card,
            display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.7rem',
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.4rem' }}>
                Reconvergence — 동기화 후 합쳐지는 신호
              </div>
              <svg viewBox="0 0 460 110" style={{ width: '100%' }}>
                {/* source */}
                <rect x="10" y="40" width="50" height="22" rx="3" stroke={DAY07} strokeWidth="1.5" fill="rgba(8,145,178,0.10)" />
                <text x="35" y="55" fontSize="10" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily="monospace">CLK_A</text>
                {/* split */}
                <path d="M60 51 L120 25 L150 25" stroke={DAY07} strokeWidth="1.5" fill="none" />
                <path d="M60 51 L120 77 L150 77" stroke={DAY07} strokeWidth="1.5" fill="none" />

                {/* sync1, sync2 (서로 다른 지연) */}
                <rect x="150" y="15" width="60" height="22" rx="3" stroke="#4A6FA5" strokeWidth="1.5" fill="rgba(74,111,165,0.10)" />
                <text x="180" y="29" fontSize="9" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily="monospace">SYNC1</text>
                <rect x="150" y="67" width="60" height="22" rx="3" stroke="#4A6FA5" strokeWidth="1.5" fill="rgba(74,111,165,0.10)" />
                <text x="180" y="81" fontSize="9" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily="monospace">SYNC2</text>

                {/* recombine */}
                <path d="M210 26 L320 26 L340 51" stroke="#4A6FA5" strokeWidth="1.5" fill="none" />
                <path d="M210 78 L320 78 L340 51" stroke="#4A6FA5" strokeWidth="1.5" fill="none" />
                <rect x="340" y="38" width="60" height="28" rx="4" stroke="#E53E3E" strokeWidth="1.8" fill="rgba(229,62,62,0.08)" />
                <text x="370" y="56" fontSize="10" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">RECONV</text>
                <text x="370" y="84" fontSize="9" fontWeight="700" fill="#E53E3E" textAnchor="middle">불일치 위험</text>

                <text x="35" y="85" fontSize="8" fontWeight="700" fill={DAY07} textAnchor="middle">단일 source</text>
              </svg>
              <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.55, marginTop: '0.3rem' }}>
                두 path가 <strong>서로 다른 동기화 지연</strong>을 거친 후 다시 합쳐지면, 한 path만 metastability 해소 → 일시적으로 <strong>불일치</strong> 발생. RX 로직이 이를 견뎌야 함.
              </div>
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${DAY07}06, ${DAY07}14)`,
              border: `1px solid ${DAY07}30`,
              borderRadius: '8px',
              padding: '0.6rem 0.75rem',
              display: 'flex', flexDirection: 'column', gap: '0.35rem',
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: DAY07 }}>
                Questa CDC Reconv. 분류
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.7 }}>
                <li><code>reconvergence</code> — 일반 (Caution)</li>
                <li><code>reconvergence_bus</code> — bus bit (Violation)</li>
                <li><code>reconvergence_gray</code> — gray-coded (Evaluation)</li>
                <li><code>single_source_reconv</code> — 단일 source (Violation)</li>
                <li><code>reconvergence_multi_tx_clock</code> — 서로 다른 TX (Violation)</li>
              </ul>
              <div style={{ fontSize: '0.62rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.2rem' }}>
                Start goal에서는 off · Implementation/Release goal에서 활성화 권장.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
