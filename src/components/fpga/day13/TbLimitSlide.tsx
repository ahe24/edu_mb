'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY13 = '#087F5B';
const MONO = '"JetBrains Mono", monospace';

export default function TbLimitSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="개념 · TB 진단"
          title="모놀리식 TB의 한계 — Day12 TB 다시 보기"
          subtitle="한 모듈 안에 자극·관찰·판정이 뒤엉킨 구조 — 동작은 하지만 자산이 되지 못한다"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 모놀리식 구조 도해 ── */}
          <div style={{
            background: FPGA.white, border: `1px solid ${FPGA.border}`,
            borderRadius: '10px', padding: '0.6rem 0.7rem',
            boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.25rem' }}>
              tb_uart_loop.sv — 모든 책임이 한 파일에
            </div>
            <svg viewBox="0 0 460 280" style={{ flex: 1, minHeight: 0, width: '100%' }}>
              {/* 모놀리식 외곽 박스 */}
              <rect x="10" y="12" width="300" height="256" rx="10" fill="#F7F9FC" stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5 3" />
              <text x="160" y="30" fontSize="9" fontWeight="800" fill="#64748B" textAnchor="middle" fontFamily={MONO}>module tb_uart_loop — 1개 모듈</text>

              {/* 내부에 뒤엉킨 3책임 */}
              {([
                { x: 26, y: 44, w: 268, h: 56, c: DAY13, t: '자극 주입', d: 'tx_bit() · send_frame() · stimulus initial' },
                { x: 26, y: 112, w: 268, h: 56, c: '#4A6FA5', t: '관찰·디코드', d: 'decode_one() · negedge 검출 · 중앙 샘플' },
                { x: 26, y: 180, w: 268, h: 56, c: '#E8913A', t: '판정·집계', d: 'sb[] queue · errors · RESULT 출력' },
              ] as { x: number; y: number; w: number; h: number; c: string; t: string; d: string }[]).map((b) => (
                <g key={b.t}>
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="7" fill={`${b.c}0E`} stroke={b.c} strokeWidth="1.4" />
                  <text x={b.x + 12} y={b.y + 22} fontSize="9.5" fontWeight="800" fill={b.c} fontFamily={MONO}>{b.t}</text>
                  <text x={b.x + 12} y={b.y + 40} fontSize="7.5" fill={FPGA.textLight} fontFamily={MONO}>{b.d}</text>
                </g>
              ))}

              {/* 뒤엉킴 표시 — 서로 물고 있는 화살표 */}
              <path d="M282 100 Q 300 128, 282 152" stroke="#E53E3E" strokeWidth="1.3" fill="none" markerEnd="url(#lim13)" />
              <path d="M38 168 Q 20 140, 38 112" stroke="#E53E3E" strokeWidth="1.3" fill="none" markerEnd="url(#lim13)" />
              <path d="M282 168 Q 300 196, 282 220" stroke="#E53E3E" strokeWidth="1.3" fill="none" markerEnd="url(#lim13)" />
              <text x="316" y="140" fontSize="7" fill="#E53E3E" fontWeight="700" fontFamily={MONO}>wr/rd·errors</text>
              <text x="316" y="150" fontSize="7" fill="#E53E3E" fontWeight="700" fontFamily={MONO}>전역 공유</text>
              <defs>
                <marker id="lim13" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                  <path d="M0 0 L5.5 3 L0 6 z" fill="#E53E3E" />
                </marker>
              </defs>

              {/* 우측: DUT 교체 시나리오 */}
              <rect x="352" y="60" width="98" height="46" rx="7" fill="rgba(74,111,165,0.08)" stroke="#4A6FA5" strokeWidth="1.4" />
              <text x="401" y="79" fontSize="8.5" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>DUT 교체</text>
              <text x="401" y="94" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>SPI? I2C?</text>
              <path d="M401 106 V150" stroke="#E53E3E" strokeWidth="1.5" markerEnd="url(#lim13)" />
              <rect x="346" y="152" width="110" height="52" rx="7" fill="rgba(229,62,62,0.08)" stroke="#E53E3E" strokeWidth="1.4" />
              <text x="401" y="173" fontSize="8.5" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily={MONO}>TB 전체 재작성</text>
              <text x="401" y="190" fontSize="7" fill={FPGA.textLight} textAnchor="middle" fontFamily={MONO}>재사용 자산 0</text>
            </svg>
          </div>

          {/* ── 우: 문제점 + 방향 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.6rem 0.8rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.4rem' }}>무엇이 문제인가</div>
              {[
                { t: '책임 혼재', d: '자극·관찰·판정이 한 파일 — 한 곳 수정이 전체에 파급', c: '#E53E3E' },
                { t: '재사용 불가', d: 'DUT 가 바뀌면 통째로 재작성 — 검증 노하우가 축적되지 않음', c: '#E8913A' },
                { t: '확장 곤란', d: '시나리오 추가마다 initial 블록 복사·수정 — 회귀 관리 부담', c: '#8B6FA5' },
                { t: '리뷰 부담', d: '판정 로직이 흩어져 "TB 가 맞는지" 검토 자체가 어려움', c: '#4A6FA5' },
              ].map((x) => (
                <div key={x.t} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.22rem 0' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: x.c, marginTop: '6px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: x.c }}>{x.t}</span>
                    <span style={{ fontSize: '0.68rem', color: FPGA.text }}> — {x.d}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY13}08, ${DAY13}15)`,
              border: `1px solid ${DAY13}30`, borderLeft: `4px solid ${DAY13}`,
              borderRadius: '10px', padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: DAY13, marginBottom: '0.2rem' }}>
                해법 — 역할별 모듈 분리
              </div>
              <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.55 }}>
                자극은 <strong>driver</strong>, 관찰은 <strong>monitor</strong>, 판정은 <strong>scoreboard</strong> —
                최상위(tb_top)에는 조립과 시나리오만 남긴다. DUT 교체 시 driver/monitor 만 바꾸면 나머지는 재사용.
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(74,111,165,0.05), rgba(74,111,165,0.12))',
              border: '1px solid rgba(74,111,165,0.30)', borderLeft: '4px solid #4A6FA5',
              borderRadius: '10px', padding: '0.5rem 0.85rem', boxShadow: shadow.card,
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#4A6FA5' }}>Safety-Critical 관점 · </span>
              <span style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.5 }}>
                TB 도 V&amp;V 산출물 — 형상관리·리뷰 대상. 역할이 분리된 TB 라야
                &ldquo;판정 근거&rdquo;를 감사(audit) 가능한 형태로 제시할 수 있다.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
