'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Case Study 슬라이드
 * 500건 위반 triage 시나리오 — 실무 의사결정 흐름
 */

const stages = [
  {
    n: 1,
    title: '초기 분석',
    color: '#E53E3E',
    count: 512,
    breakdown: [
      { label: 'Error', n: 186, color: '#E53E3E' },
      { label: 'Warning', n: 247, color: '#E8913A' },
      { label: 'Info', n: 79, color: '#4A6FA5' },
    ],
    action: 'release Goal 적용 · 모든 체크 활성',
    insight: '처음엔 압도적으로 많아 보이지만 75%는 패턴화 가능',
  },
  {
    n: 2,
    title: '정책·벤더 필터',
    color: '#E8913A',
    count: 342,
    breakdown: [
      { label: '정책 수용', n: 170, color: '#48BB78' },
      { label: '잔여 검토', n: 342, color: '#E8913A' },
    ],
    action: 'Xilinx goal + project_prefs.tcl 적용',
    insight: 'async_reset_active_high, unsynth_initial_stmt 등 170건이 정당한 FPGA 관례',
  },
  {
    n: 3,
    title: '모듈 분류',
    color: '#8B6FA5',
    count: 342,
    breakdown: [
      { label: '외부 IP', n: 85, color: '#718096' },
      { label: '레거시', n: 47, color: '#8B6FA5' },
      { label: '신규 RTL', n: 210, color: '#4A6FA5' },
    ],
    action: 'lint suppress로 외부 IP·레거시 분리',
    insight: '132건은 검증 대상 아님 — 남은 210건이 실제 검토 대상',
  },
  {
    n: 4,
    title: '신규 RTL 수정',
    color: '#4A6FA5',
    count: 210,
    breakdown: [
      { label: '코드 수정', n: 168, color: '#48BB78' },
      { label: '재검토', n: 42, color: '#E8913A' },
    ],
    action: 'case default · latch · combo loop 등 즉시 수정',
    insight: '80%는 RTL 개선으로 해소. 남은 42건이 진짜 결정 사항',
  },
  {
    n: 5,
    title: '최종 triage',
    color: '#48BB78',
    count: 42,
    breakdown: [
      { label: 'waived + 근거', n: 26, color: '#4A6FA5' },
      { label: 'bug 등록', n: 12, color: '#E53E3E' },
      { label: '설계변경', n: 4, color: '#8B6FA5' },
    ],
    action: '개별 lint report item -status · DO-254 근거 문서화',
    insight: 'waiver 26건에 REASON/REVIEWER/DATE/TRACE 4필드 완비',
  },
];

const learnings = [
  { emoji: '📉', title: '수치의 함정', desc: '512 → 42 (92% 감소)는 코드 개선이 아니라 \'분류\'에서 대부분 발생. 초기 숫자에 놀라지 말 것.' },
  { emoji: '⚡', title: '벌크 vs 개별', desc: '정책·suppress로 벌크 처리할 것과 item 단위로 처리할 것의 경계 판단이 효율 핵심.' },
  { emoji: '📝', title: '감사 자료화', desc: '최종 26 waived만 감사 대상 — 여기에 근거·리뷰어·날짜·trace 반드시 기록.' },
  { emoji: '🔁', title: '기준선 보관', desc: '이 시점의 lint.db를 baseline으로 고정 — 이후 PR마다 diff로 회귀 방지.' },
];

export default function CaseStudySlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Case Study"
          title="512건 위반을 26건 waiver로 — triage 실전"
          subtitle="Xilinx FPGA · 중간 규모 RTL (~30 모듈, ~15K LOC)"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* 상단: 5단계 triage flow */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.3rem' }}>
            {stages.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
                <div style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${s.color}08, ${s.color}14)`,
                  border: `1px solid ${s.color}30`,
                  borderTop: `3px solid ${s.color}`,
                  borderRadius: '10px',
                  padding: '0.5rem 0.65rem',
                  boxShadow: shadow.card,
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.3rem' }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: s.color, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 800, flexShrink: 0,
                    }}>{s.n}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, lineHeight: 1.2 }}>
                      {s.title}
                    </div>
                  </div>

                  {/* 큰 카운트 */}
                  <div style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '1.4rem', fontWeight: 800,
                    color: s.color, textAlign: 'center',
                    lineHeight: 1, margin: '0.2rem 0',
                    textShadow: `0 2px 8px ${s.color}30`,
                  }}>{s.count}</div>
                  <div style={{
                    fontSize: '0.54rem', color: FPGA.textLight,
                    textAlign: 'center', marginBottom: '0.3rem',
                    fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em',
                  }}>
                    VIOLATIONS
                  </div>

                  {/* breakdown 바 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '0.3rem' }}>
                    {s.breakdown.map(b => (
                      <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{
                          fontSize: '0.55rem', fontFamily: '"JetBrains Mono", monospace',
                          color: b.color, fontWeight: 700,
                          minWidth: '38px',
                        }}>{b.n}</span>
                        <span style={{
                          fontSize: '0.55rem', color: FPGA.textLight, lineHeight: 1.3,
                        }}>{b.label}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    fontSize: '0.57rem', color: FPGA.text, lineHeight: 1.4,
                    padding: '0.25rem 0.35rem',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '4px',
                    border: `1px solid ${s.color}18`,
                    marginTop: 'auto',
                  }}>
                    <div style={{ fontWeight: 700, color: s.color, fontSize: '0.55rem', marginBottom: '1px' }}>ACTION</div>
                    {s.action}
                  </div>
                </div>

                {i < stages.length - 1 && (() => {
                  const delta = stages[i + 1].count - s.count;
                  const sign = delta > 0 ? '+' : '';
                  const isZero = delta === 0;
                  const dColor = isZero ? FPGA.textLight : delta < 0 ? '#48BB78' : '#E53E3E';
                  return (
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px', gap: '2px',
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.6rem', fontWeight: 800,
                        color: dColor,
                        background: `${dColor}15`,
                        border: `1px solid ${dColor}40`,
                        padding: '0 5px', borderRadius: '3px',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.3,
                      }}>{isZero ? '±0' : `${sign}${delta}`}</span>
                      <svg width="16" height="10" viewBox="0 0 16 10">
                        <path d="M2 5h10M10 2l4 3-4 3" stroke={dColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" fill="none" />
                      </svg>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>

          {/* 중단: 최종 결과 배너 + 시간 배분 */}
          <div style={{ display: 'flex', gap: '0.7rem' }}>
            <div style={{
              flex: 1.3,
              background: `linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.14))`,
              border: '1.5px solid rgba(72,187,120,0.35)',
              borderRadius: '10px',
              padding: '0.6rem 0.9rem',
              display: 'flex', alignItems: 'center', gap: '0.9rem',
              boxShadow: shadow.card,
            }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                textAlign: 'center', flexShrink: 0,
              }}>
                <div style={{ fontSize: '0.62rem', color: FPGA.textLight, letterSpacing: '0.1em' }}>최종</div>
                <div style={{
                  fontSize: '1.3rem', fontWeight: 800, color: '#48BB78',
                  lineHeight: 1,
                }}>26</div>
                <div style={{ fontSize: '0.56rem', color: FPGA.textLight }}>waived</div>
              </div>
              <div style={{ fontSize: '0.9rem', color: FPGA.textLight }}>+</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '0.62rem', color: FPGA.textLight, letterSpacing: '0.1em' }}></div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#E53E3E', lineHeight: 1 }}>12</div>
                <div style={{ fontSize: '0.56rem', color: FPGA.textLight }}>bug (수정 중)</div>
              </div>
              <div style={{ fontSize: '0.9rem', color: FPGA.textLight }}>+</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '0.62rem', color: FPGA.textLight, letterSpacing: '0.1em' }}></div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#8B6FA5', lineHeight: 1 }}>4</div>
                <div style={{ fontSize: '0.56rem', color: FPGA.textLight }}>설계 변경</div>
              </div>
              <div style={{ fontSize: '0.95rem', color: FPGA.textLight, fontWeight: 700 }}>=</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '0.62rem', color: FPGA.textLight, letterSpacing: '0.1em' }}>합계</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: FPGA.dark, lineHeight: 1 }}>42</div>
                <div style={{ fontSize: '0.56rem', color: FPGA.textLight }}>final 42</div>
              </div>
              <div style={{ flex: 1, fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.55, paddingLeft: '0.3rem' }}>
                <strong style={{ color: FPGA.dark }}>92% 감소</strong> — 이 중 감사 증빙 필요한 것은 <strong style={{ color: '#48BB78' }}>26 waived</strong>뿐.
                나머지는 설계 활동의 자연스러운 결과물.
              </div>
            </div>

            <div style={{
              flex: 1,
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.55rem 0.75rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.3rem' }}>
                소요 시간 배분 (총 ~8h)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.62rem' }}>
                {[
                  { t: '0.5h', w: '정책·필터', color: '#E8913A', pct: 6 },
                  { t: '1.0h', w: '모듈 분류', color: '#8B6FA5', pct: 12 },
                  { t: '4.5h', w: 'RTL 수정', color: '#4A6FA5', pct: 56 },
                  { t: '1.5h', w: 'Waiver 근거', color: '#48BB78', pct: 19 },
                  { t: '0.5h', w: 'CI 기준선', color: '#5B8C5A', pct: 7 },
                ].map(x => (
                  <div key={x.w} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{
                      fontFamily: '"JetBrains Mono", monospace', color: FPGA.textLight,
                      minWidth: '28px', fontSize: '0.6rem',
                    }}>{x.t}</span>
                    <div style={{ flex: 1, height: '10px', background: '#F0F4F8', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${x.pct * 1.5}%`, height: '100%',
                        background: x.color, borderRadius: '3px',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.6rem', color: FPGA.text, minWidth: '70px' }}>{x.w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 하단: 4가지 교훈 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {learnings.map(L => (
              <div key={L.title} style={{
                background: FPGA.white,
                border: `1px solid ${FPGA.border}`,
                borderRadius: '10px',
                padding: '0.5rem 0.7rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <div style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>{L.emoji}</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.2rem' }}>
                  {L.title}
                </div>
                <div style={{ fontSize: '0.6rem', color: FPGA.textLight, lineHeight: 1.5 }}>
                  {L.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
