'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY13 = '#087F5B';
const ORANGE = '#E8913A';
const MONO = '"JetBrains Mono", monospace';

export default function TbArchSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="개념 · TB 아키텍처"
          title="계층화 TB — 역할별 컴포넌트로 분해"
          subtitle="트랜잭션(바이트)과 핀 파형의 변환을 driver·monitor 가 전담 — 판정은 scoreboard 한 곳으로"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* ── 상단: 아키텍처 다이어그램 ── */}
          <div style={{
            flex: 1, minHeight: 0,
            background: FPGA.white, border: `1px solid ${FPGA.border}`,
            borderRadius: '10px', padding: '0.5rem 0.7rem',
            boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
          }}>
            <svg viewBox="0 0 640 200" style={{ flex: 1, minHeight: 0, width: '100%' }}>
              <defs>
                <marker id="arch13" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0 0 L6 3 L0 6 z" fill="#64748B" />
                </marker>
                <marker id="arch13g" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0 0 L6 3 L0 6 z" fill={DAY13} />
                </marker>
                <marker id="arch13o" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0 0 L6 3 L0 6 z" fill={ORANGE} />
                </marker>
              </defs>

              {/* tb_top 외곽 */}
              <rect x="6" y="8" width="628" height="186" rx="10" fill="none" stroke={`${DAY13}55`} strokeWidth="1.4" strokeDasharray="6 4" />
              <text x="20" y="26" fontSize="9" fontWeight="800" fill={DAY13} fontFamily={MONO}>tb_top — 조립 + 시나리오</text>

              {/* 시나리오 */}
              <rect x="22" y="72" width="104" height="58" rx="8" fill={`${DAY13}0C`} stroke={DAY13} strokeWidth="1.6" />
              <text x="74" y="94" fontSize="9.5" fontWeight="800" fill={DAY13} textAnchor="middle" fontFamily={MONO}>시나리오</text>
              <text x="74" y="108" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>무엇을 보낼지만</text>
              <text x="74" y="119" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>push_exp · send</text>

              {/* driver */}
              <rect x="164" y="72" width="104" height="58" rx="8" fill="rgba(74,111,165,0.08)" stroke="#4A6FA5" strokeWidth="1.6" />
              <text x="216" y="94" fontSize="9.5" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>driver</text>
              <text x="216" y="108" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>바이트 → 핀 파형</text>
              <text x="216" y="119" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>send_byte()</text>

              {/* DUT */}
              <rect x="306" y="64" width="112" height="74" rx="8" fill="#1A2235" stroke="#1A2235" strokeWidth="1.6" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.25))' }} />
              <text x="362" y="94" fontSize="10.5" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily={MONO}>DUT</text>
              <text x="362" y="110" fontSize="7.5" fill="#9FB0CC" textAnchor="middle" fontFamily={MONO}>uart_loop</text>
              <text x="362" y="122" fontSize="7" fill="#9FB0CC" textAnchor="middle" fontFamily={MONO}>(Day12 재사용)</text>

              {/* monitor */}
              <rect x="456" y="72" width="104" height="58" rx="8" fill="rgba(74,111,165,0.08)" stroke="#4A6FA5" strokeWidth="1.6" />
              <text x="508" y="94" fontSize="9.5" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>monitor</text>
              <text x="508" y="108" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>핀 파형 → 바이트</text>
              <text x="508" y="119" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>got · got_valid</text>

              {/* scoreboard */}
              <rect x="380" y="152" width="180" height="36" rx="8" fill={`${ORANGE}10`} stroke={ORANGE} strokeWidth="1.6" />
              <text x="470" y="168" fontSize="9.5" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>scoreboard</text>
              <text x="470" y="181" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>기대값 queue 비교 · errors · report()</text>

              {/* 흐름 화살표 */}
              <path d="M126 101 H164" stroke="#64748B" strokeWidth="1.6" markerEnd="url(#arch13)" />
              <text x="145" y="94" fontSize="6.5" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>byte</text>
              <path d="M268 101 H306" stroke="#64748B" strokeWidth="1.6" markerEnd="url(#arch13)" />
              <text x="287" y="94" fontSize="6.5" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>rx_pin</text>
              <path d="M418 101 H456" stroke="#64748B" strokeWidth="1.6" markerEnd="url(#arch13)" />
              <text x="437" y="94" fontSize="6.5" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>tx_pin</text>
              <path d="M508 130 V152" stroke={ORANGE} strokeWidth="1.6" markerEnd="url(#arch13o)" />
              <text x="522" y="145" fontSize="6.5" fill={ORANGE} fontFamily={MONO}>got</text>

              {/* 기대값 경로 */}
              <path d="M74 130 V170 H380" stroke={DAY13} strokeWidth="1.6" fill="none" markerEnd="url(#arch13g)" strokeDasharray="5 3" />
              <text x="200" y="163" fontSize="6.8" fill={DAY13} fontWeight="700" fontFamily={MONO}>push_exp(b) — 기대값 등록</text>

              {/* RESULT */}
              <rect x="580" y="155" width="52" height="30" rx="7" fill="rgba(72,187,120,0.12)" stroke="#48BB78" strokeWidth="1.6" />
              <text x="606" y="174" fontSize="8" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily={MONO}>PASS?</text>
              <path d="M560 170 H580" stroke="#48BB78" strokeWidth="1.6" markerEnd="url(#arch13)" />
            </svg>
          </div>

          {/* ── 하단: 역할 카드 4 + UVM 연결 ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.55rem', flexShrink: 0 }}>
            {[
              { t: 'driver', c: '#4A6FA5', does: '트랜잭션 → 핀 구동', not: '관찰·판정 안 함' },
              { t: 'monitor', c: '#4A6FA5', does: '핀 관찰 → 트랜잭션 복원', not: '자극·판정 안 함' },
              { t: 'scoreboard', c: ORANGE, does: '기대 vs 실제 비교·집계', not: '핀 접근 안 함' },
              { t: 'tb_top', c: DAY13, does: '조립 + 시나리오 서술', not: '프로토콜 세부 모름' },
            ].map((x) => (
              <div key={x.t} style={{
                background: `linear-gradient(135deg, ${x.c}06, ${x.c}10)`,
                border: `1px solid ${x.c}28`, borderTop: `3px solid ${x.c}`,
                borderRadius: '9px', padding: '0.45rem 0.65rem', boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: x.c, fontFamily: MONO, marginBottom: '0.15rem' }}>{x.t}</div>
                <div style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.45 }}>{x.does}</div>
                <div style={{ fontSize: '0.58rem', color: FPGA.textLight, lineHeight: 1.4 }}>✕ {x.not}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${DAY13}08, ${DAY13}15)`,
            border: `1px solid ${DAY13}30`, borderRadius: '8px', padding: '0.42rem 0.8rem',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: DAY13 }}>산업 표준으로 · </span>
            <span style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.45 }}>
              같은 역할 분리가 UVM 에선 <code>agent(driver·monitor)</code> · <code>scoreboard</code> 로 표준화 —
              오늘 구조를 익히면 UVM 도 &ldquo;이름만 다른 같은 그림&rdquo;.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
