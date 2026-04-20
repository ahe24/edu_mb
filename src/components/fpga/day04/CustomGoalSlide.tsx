'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Custom Goal 생성 슬라이드
 * lint generate goal 워크플로우 + 파생 Goal 설계
 */

const workflow = [
  { n: '1', title: '기준 Goal로 -review', detail: '활성화된 체크 목록 .tcl로 덤프', color: '#4A6FA5' },
  { n: '2', title: '파일 복제 · 이름 변경', detail: 'release.tcl → my_project.tcl', color: '#5B8C5A' },
  { n: '3', title: '체크 add / remove', detail: 'lint on · lint off · severity 조정', color: '#E8913A' },
  { n: '4', title: 'lint generate goal', detail: '프로젝트 Goal 저장 — 버전 관리', color: '#8B6FA5' },
  { n: '5', title: 'CI에서 고정 사용', detail: 'do my_project.tcl로 재현성 확보', color: '#E53E3E' },
];

const derivedGoals = [
  {
    name: 'do254_level_a.tcl',
    color: '#E53E3E',
    base: 'release',
    addedChecks: ['case_default_missing (E↑)', 'fsm_with_deadend_state (E)', 'flop_without_control (E↑)', 'signed_unsigned_mismatch (E↑)'],
    removed: ['unsynth_initial_stmt', 'shift_register_inferred'],
    use: 'DAL-A 인증 대상 모듈 — 최강 검사',
  },
  {
    name: 'fpga_xilinx_std.tcl',
    color: '#4A6FA5',
    base: 'release_xilinx',
    addedChecks: ['regex_user_defined (W)'],
    removed: ['async_reset_active_high', 'unsynth_initial_value'],
    use: 'Xilinx 양산 모듈 — 벤더 관례 수용',
  },
  {
    name: 'ip_integration.tcl',
    color: '#5B8C5A',
    base: 'ip release',
    addedChecks: ['inst_name_not_standard (E)', 'port_connection_not_aligned (W)'],
    removed: [],
    use: '외부 IP 통합 시 인터페이스 점검',
  },
];

export default function CustomGoalSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Custom Goal"
          title="파생 Goal 설계 및 저장"
          subtitle="release 기반 파생 · 프로젝트/안전등급별 분리 관리"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {/* 상단: 워크플로우 5단계 */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'stretch' }}>
            {workflow.map((w, i) => (
              <div key={w.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${w.color}06, ${w.color}12)`,
                  border: `1px solid ${w.color}25`,
                  borderTop: `3px solid ${w.color}`,
                  borderRadius: '10px',
                  padding: '0.55rem 0.7rem',
                  boxShadow: shadow.card,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.3rem' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: w.color, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 800,
                    }}>{w.n}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: FPGA.dark, lineHeight: 1.2 }}>
                      {w.title}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.64rem', color: FPGA.textLight, lineHeight: 1.5 }}>
                    {w.detail}
                  </div>
                </div>
                {i < workflow.length - 1 && (
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" style={{ flexShrink: 0, margin: '0 2px' }}>
                    <path d="M2 7h10M10 3l4 4-4 4" stroke={FPGA.textLight} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* 중단: 좌 명령 예시 + 우 파생 goal 카드 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '0.8rem' }}>
            {/* 좌: 터미널 예제 */}
            <div style={{
              flex: '0 0 400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              minWidth: 0,
            }}>
              <div style={{
                background: '#1A2235',
                border: '1px solid #2D3748',
                borderRadius: '10px',
                padding: '0.6rem 0.8rem',
                boxShadow: shadow.card,
                flex: 1,
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  fontSize: '0.62rem', fontWeight: 700, color: '#6B8CC7',
                  marginBottom: '0.35rem',
                  fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em',
                }}>▸ Step 1 — 기준선 덤프</div>
                <pre style={{
                  margin: 0,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.62rem',
                  color: '#E8E8E8',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  flex: 1,
                }}>
<span style={{ color: '#F6AD55' }}>qverify&gt;</span> lint methodology fpga{'\n'}
          -goal release -review{'\n'}
<span style={{ color: '#718096' }}># → ./fpga/release.tcl 생성{'\n'}# 파일 head 확인 ↓</span>{'\n'}
<span style={{ color: '#4A5568' }}>$</span> head -n 6 fpga/release.tcl{'\n'}
<span style={{ color: '#A8D8A8' }}>lint on</span> async_reset_active_high{'\n'}
<span style={{ color: '#A8D8A8' }}>lint on</span> case_default_missing{'\n'}
<span style={{ color: '#A8D8A8' }}>lint on</span> latch_inferred <span style={{ color: '#718096' }}>...</span>
                </pre>
              </div>

              <div style={{
                background: '#1A2235',
                border: '1px solid #2D3748',
                borderRadius: '10px',
                padding: '0.6rem 0.8rem',
                boxShadow: shadow.card,
                flex: 1,
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  fontSize: '0.62rem', fontWeight: 700, color: '#6B8CC7',
                  marginBottom: '0.35rem',
                  fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em',
                }}>▸ Step 3–4 — 커스터마이즈 + 저장</div>
                <pre style={{
                  margin: 0,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.62rem',
                  color: '#E8E8E8',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}>
<span style={{ color: '#718096' }}># policy/my_project.tcl 편집 후</span>{'\n'}
<span style={{ color: '#F6AD55' }}>qverify&gt;</span> do policy/my_project.tcl{'\n'}
<span style={{ color: '#F6AD55' }}>qverify&gt;</span> lint on regex_user_defined{'\n'}
<span style={{ color: '#F6AD55' }}>qverify&gt;</span> lint off unsynth_initial_stmt{'\n'}
<span style={{ color: '#F6AD55' }}>qverify&gt;</span> lint report check{'\n'}
          -severity error case_default_missing{'\n'}
<span style={{ color: '#F6AD55' }}>qverify&gt;</span> <span style={{ color: '#A8D8A8' }}>lint generate goal</span>{'\n'}
          -name my_project -dir ./goals
                </pre>
              </div>

              <div style={{
                background: '#1A2235',
                border: '1px solid #2D3748',
                borderRadius: '10px',
                padding: '0.6rem 0.8rem',
                boxShadow: shadow.card,
                flex: 1,
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  fontSize: '0.62rem', fontWeight: 700, color: '#6B8CC7',
                  marginBottom: '0.35rem',
                  fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em',
                }}>▸ Step 5 — 재사용 (CI)</div>
                <pre style={{
                  margin: 0,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.62rem',
                  color: '#E8E8E8',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}>
<span style={{ color: '#4A5568' }}>$</span> qverify -od out -c -do "{'\n'}
<span style={{ color: '#A8D8A8' }}>  do</span> goals/my_project.tcl;{'\n'}
  vlib work; vmap work work;{'\n'}
  vlog -f filelist.f;{'\n'}
<span style={{ color: '#A8D8A8' }}>  lint run</span> -d top; exit"
                </pre>
              </div>
            </div>

            {/* 우: 파생 Goal 예시 3개 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
              <div style={{
                fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                프로젝트 파생 Goal 실전 예
                <span style={{
                  fontSize: '0.62rem', fontWeight: 600, color: FPGA.textLight,
                  fontFamily: '"JetBrains Mono", monospace',
                }}>
                  — 안전등급·벤더·IP 목적별 분리
                </span>
              </div>

              {derivedGoals.map((g) => (
                <div key={g.name} style={{
                  background: FPGA.white,
                  border: `1px solid ${g.color}25`,
                  borderLeft: `3px solid ${g.color}`,
                  borderRadius: '10px',
                  padding: '0.55rem 0.75rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.3rem' }}>
                    <code style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.72rem', fontWeight: 700,
                      color: g.color, background: `${g.color}12`,
                      border: `1px solid ${g.color}25`,
                      padding: '2px 7px', borderRadius: '4px',
                    }}>{g.name}</code>
                    <span style={{ fontSize: '0.66rem', color: FPGA.textLight }}>
                      base: <code style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.66rem', color: FPGA.text,
                      }}>{g.base}</code>
                    </span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.45, marginBottom: '0.3rem' }}>
                    <strong>용도:</strong> {g.use}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {g.addedChecks.map(c => (
                      <span key={c} style={{
                        fontSize: '0.6rem', fontFamily: '"JetBrains Mono", monospace',
                        color: '#48BB78', background: 'rgba(72,187,120,0.10)',
                        border: '1px solid rgba(72,187,120,0.25)',
                        padding: '1px 6px', borderRadius: '3px',
                      }}>+ {c}</span>
                    ))}
                    {g.removed.map(c => (
                      <span key={c} style={{
                        fontSize: '0.6rem', fontFamily: '"JetBrains Mono", monospace',
                        color: '#E53E3E', background: 'rgba(229,62,62,0.08)',
                        border: '1px solid rgba(229,62,62,0.25)',
                        padding: '1px 6px', borderRadius: '3px',
                      }}>− {c}</span>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{
                background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.12))`,
                border: '1px solid rgba(232,145,58,0.3)',
                borderRadius: '10px',
                padding: '0.5rem 0.7rem',
              }}>
                <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.5 }}>
                  <strong style={{ color: '#E8913A' }}>💡 권장:</strong> 파생 Goal 파일은 git 추적 대상. 변경 이력이 곧 검증 정책 변경 이력 — DO-254 심사 시 증빙 자료.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
