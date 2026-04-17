'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * FPGA Methodology Goals 슬라이드
 * Start → Simulation → Release 3단계 + Vendor-specific Goals
 */

const goals = [
  {
    id: 'start',
    label: 'start',
    title: 'Start Goal',
    subtitle: '설계 초기 — 컴파일 확인 단계',
    color: '#5B8C5A',
    level: 1,
    checks: ['assign_width_overflow (I)', 'always_without_event (E)', 'multi_driven_signal (W)', 'blocking_assign_in_seq_block (–)', 'condition_const (I)'],
    desc: '필수적인 구조적 오류만 검출. 설계 초기 컴파일이 통과하는지 확인하는 수준의 최소 체크 세트.',
    cmd: 'lint methodology fpga -goal start',
  },
  {
    id: 'simulation',
    label: 'simulation',
    title: 'Simulation Goal',
    subtitle: '기능 검증 — 시뮬레이션 단계',
    color: '#4A6FA5',
    level: 2,
    checks: ['blocking_assign_in_seq_block (E)', 'case_with_x_z (E)', 'always_has_inconsistent_async_control (W)', 'combo_loop_with_latch (E)', 'sensitivity_list_var_missing (E)'],
    desc: '시뮬레이션-합성 불일치를 유발하는 코드 패턴 집중 검출. Start보다 많은 체크가 활성화되고 일부 심각도 상향.',
    cmd: 'lint methodology fpga -goal simulation',
  },
  {
    id: 'release',
    label: 'release',
    title: 'Release Goal',
    subtitle: '설계 릴리즈 — 최종 검증 단계',
    color: '#8B6FA5',
    level: 3,
    checks: ['case_default_missing (E)', 'always_has_multiple_events (E)', 'combo_loop (E)', 'latch_inferred (W)', 'clock_gated (W)', 'assign_width_underflow (E)'],
    desc: '가장 엄격한 검사 세트. Safety-Critical 양산 전 최종 릴리즈 시 모든 위반이 해결되어야 함.',
    cmd: 'lint methodology fpga -goal release',
  },
];

const vendorGoals = [
  {
    vendor: 'Xilinx®',
    base: 'release',
    color: '#E53E3E',
    adjustments: [
      { type: 'off', rule: 'unsynth_initial_stmt', note: '초기값 할당 관련 비활성화' },
      { type: 'off', rule: 'unsynth_initial_value', note: '초기값 관련 비활성화' },
      { type: 'pref', rule: 'flop_output_in_initial', note: 'initial 블록 허용 설정' },
      { type: 'sev', rule: 'flop_output_in_initial → warning', note: '심각도 Warning으로 하향' },
    ],
  },
  {
    vendor: 'Intel® / Lattice® / Microsemi®',
    base: 'release',
    color: '#4A6FA5',
    adjustments: [
      { type: 'same', rule: 'Release goal 동일 적용', note: '추가 조정 없음' },
    ],
  },
];

export default function MethodologyGoalsSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="FPGA Methodology"
          title="3단계 Goal: 설계 성숙도에 따른 체크 강도"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {/* 3개 Goal 카드 */}
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'stretch' }}>
            {goals.map((g, idx) => (
              <div key={g.id} style={{
                flex: 1,
                background: `linear-gradient(160deg, ${g.color}08, ${g.color}14)`,
                border: `1px solid ${g.color}30`,
                borderTop: `4px solid ${g.color}`,
                borderRadius: '14px',
                padding: '1rem 1rem 0.9rem',
                boxShadow: shadow.card,
                position: 'relative',
              }}>
                {/* 단계 화살표 */}
                {idx < goals.length - 1 && (
                  <div style={{
                    position: 'absolute', right: '-16px', top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    background: FPGA.bg,
                    borderRadius: '50%',
                    width: '28px', height: '28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${FPGA.border}`,
                    boxShadow: shadow.card,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h7M7 4l3 3-3 3" stroke={FPGA.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* 헤더 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  {/* 막대 레벨 표시 */}
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
                    {[1, 2, 3].map((lv) => (
                      <div key={lv} style={{
                        width: '5px',
                        height: `${6 + lv * 5}px`,
                        borderRadius: '2px',
                        background: lv <= g.level ? g.color : `${g.color}22`,
                      }} />
                    ))}
                  </div>
                  <code style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem', fontWeight: 700,
                    color: g.color,
                    background: `${g.color}14`,
                    border: `1px solid ${g.color}28`,
                    padding: '2px 9px', borderRadius: '5px',
                  }}>-goal {g.label}</code>
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.18rem' }}>
                  {g.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: g.color, fontWeight: 600, marginBottom: '0.5rem' }}>
                  {g.subtitle}
                </div>
                <div style={{ fontSize: '0.68rem', color: FPGA.textLight, lineHeight: 1.5, marginBottom: '0.6rem' }}>
                  {g.desc}
                </div>

                {/* 활성화된 체크 예시 */}
                <div style={{ fontSize: '0.62rem', fontWeight: 600, color: FPGA.textLight, marginBottom: '0.3rem', letterSpacing: '0.06em' }}>
                  주요 활성화 체크 (심각도)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {g.checks.map((c) => {
                    const sev = c.includes('(E)') ? '#E53E3E' : c.includes('(W)') ? '#E8913A' : '#718096';
                    return (
                      <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: sev, flexShrink: 0 }} />
                        <code style={{ fontSize: '0.62rem', color: FPGA.text, fontFamily: '"JetBrains Mono", monospace' }}>
                          {c}
                        </code>
                      </div>
                    );
                  })}
                </div>

                {/* 커맨드 */}
                <div style={{
                  marginTop: '0.65rem',
                  background: '#1A2235',
                  borderRadius: '6px',
                  padding: '0.35rem 0.7rem',
                  fontFamily: 'monospace',
                  fontSize: '0.62rem',
                  color: '#A8D8A8',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}>
                  <span style={{ color: '#4A5568' }}>tcl&gt; </span>{g.cmd}
                </div>
              </div>
            ))}
          </div>

          {/* 벤더 특화 Goal */}
          <div style={{
            background: `linear-gradient(135deg, rgba(74,111,165,0.04), rgba(74,111,165,0.08))`,
            border: `1px solid ${FPGA.primary}22`,
            borderRadius: '12px',
            padding: '0.8rem 1.1rem',
            boxShadow: shadow.card,
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.primary, marginBottom: '0.55rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke={FPGA.primary} strokeWidth="1.5" />
                <path d="M7 4v3l2 1.5" stroke={FPGA.primary} strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              벤더 특화 Goal — release 기반에서 조정
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {vendorGoals.map((v) => (
                <div key={v.vendor} style={{
                  flex: 1,
                  background: FPGA.white,
                  border: `1px solid ${v.color}22`,
                  borderLeft: `3px solid ${v.color}`,
                  borderRadius: '8px',
                  padding: '0.55rem 0.8rem',
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: v.color, marginBottom: '0.35rem' }}>
                    {v.vendor}
                    <code style={{
                      marginLeft: '7px',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.6rem',
                      background: `${v.color}12`,
                      border: `1px solid ${v.color}22`,
                      padding: '1px 6px', borderRadius: '3px',
                      color: v.color,
                    }}>release_{v.vendor === 'Xilinx®' ? 'xilinx' : 'intel | release_lattice...'}</code>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {v.adjustments.map((adj) => (
                      <div key={adj.rule} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                        <span style={{
                          fontSize: '0.55rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px',
                          background: adj.type === 'off' ? '#E53E3E18' : adj.type === 'pref' ? '#E8913A18' : adj.type === 'sev' ? '#8B6FA518' : '#5B8C5A18',
                          color: adj.type === 'off' ? '#E53E3E' : adj.type === 'pref' ? '#E8913A' : adj.type === 'sev' ? '#8B6FA5' : '#5B8C5A',
                          flexShrink: 0, marginTop: '1px',
                        }}>
                          {adj.type === 'off' ? 'lint off' : adj.type === 'pref' ? 'preference' : adj.type === 'sev' ? 'severity' : 'same'}
                        </span>
                        <code style={{ fontSize: '0.6rem', color: FPGA.text, fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.4 }}>
                          {adj.rule}
                        </code>
                        <span style={{ fontSize: '0.58rem', color: FPGA.textLight, marginLeft: '2px' }}>— {adj.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 심각도 범례 */}
          <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', alignItems: 'center' }}>
            {[
              { sev: 'E', label: 'Error — 반드시 수정', color: '#E53E3E' },
              { sev: 'W', label: 'Warning — 검토 필요', color: '#E8913A' },
              { sev: 'I', label: 'Info — 참고', color: '#718096' },
              { sev: '–', label: '비활성화', color: '#CBD5E0' },
            ].map(({ sev, label, color }) => (
              <div key={sev} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '4px',
                  background: `${color}18`, border: `1.5px solid ${color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.68rem', fontWeight: 800, color,
                  fontFamily: '"JetBrains Mono", monospace',
                }}>{sev}</div>
                <span style={{ fontSize: '0.7rem', color: FPGA.textLight }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
