'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Day 03 실습 체크리스트
 * FPGA Methodology Goal 적용 + DO-254 룰 점검
 */

const labTasks = [
  {
    num: 1,
    title: 'Release Goal 적용 및 전체 분석',
    items: [
      'run_lint.tcl에 lint methodology fpga -goal release 추가',
      'Day02 예제 RTL 재사용: ctrl_logic.v / state_machine.v / reset_flop.v',
      'qverify -od lint_day03 -c -do scripts/run_lint.tcl 실행',
    ],
    color: '#4A6FA5',
    cmd: 'qverify -od lint_day03 -c -do scripts/run_lint.tcl',
  },
  {
    num: 2,
    title: 'Goal별 체크 차이 비교',
    items: [
      '-goal simulation → lint.rpt 위반 수 확인',
      '-goal release → 동일 RTL 대비 추가 위반 수 확인',
      '-review 옵션으로 활성화 체크 목록 파일 생성',
    ],
    color: '#5B8C5A',
    cmd: 'lint methodology fpga -goal release -review  # ./fpga/release.tcl 생성',
  },
  {
    num: 3,
    title: 'FSM RTL 추가 및 FSM 관련 룰 확인',
    items: [
      'fsm_demo.v 작성: reset 없는 FSM + Dead-end 상태 포함',
      'qverify 재실행 → fsm_without_reset_state / fsm_with_deadend_state 위반 확인',
      'FSM 수정 후 위반 해소 여부 확인',
    ],
    color: '#8B6FA5',
    cmd: 'qverify -od lint_day03 -c -do scripts/run_lint.tcl  # fsm_demo.v 포함',
  },
  {
    num: 4,
    title: 'lint preference 커스터마이징',
    items: [
      'lint preference -clock_gating_module clk_gate_dummy 추가',
      'lint preference -missing_others_or_default 추가 후 case 위반 수 변화 확인',
      'lint off unsynth_initial_stmt 추가 후 위반 수 변화 확인',
    ],
    color: '#E8913A',
    cmd: '# run_lint.tcl에 preference 추가 후 재실행',
  },
  {
    num: 5,
    title: 'Waiver 처리 및 상태 관리',
    items: [
      'async_reset_active_high 위반에 -status waived 처리 (Xilinx 관례 근거 주석)',
      'combo_loop 위반에 -status bug 처리',
      'lint.rpt 재확인: 상태 변경 반영 여부 검증',
    ],
    color: '#E53E3E',
    cmd: 'lint report item -status waived -check async_reset_active_high -arg reset=rst',
  },
];

export default function LabSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습"
          title="Day 03 실습 체크리스트"
          subtitle="FPGA Methodology Goal · DO-254 룰 · Waiver 관리"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {labTasks.map((task, i) => (
            <div key={task.num} style={{ display: 'flex', alignItems: 'stretch', gap: '0.8rem' }}>
              {/* 번호 + 연결선 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '32px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: `${task.color}15`,
                  border: `2px solid ${task.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.82rem', fontWeight: 800, color: task.color, flexShrink: 0,
                }}>{task.num}</div>
                {i < labTasks.length - 1 && (
                  <div style={{ flex: 1, width: '2px', background: `${task.color}20`, marginTop: '3px' }} />
                )}
              </div>

              {/* 내용 */}
              <div style={{
                flex: 1,
                background: `linear-gradient(135deg, ${task.color}04, ${task.color}08)`,
                border: `1px solid ${task.color}18`,
                borderLeft: `3px solid ${task.color}`,
                borderRadius: '0 10px 10px 0',
                padding: '0.5rem 0.8rem',
                display: 'flex', alignItems: 'center', gap: '0.9rem',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: task.color, marginBottom: '0.2rem' }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                    {task.items.map((item) => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: FPGA.text }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                          <rect x="0.75" y="0.75" width="11.5" height="11.5" rx="2.5" stroke={task.color} strokeWidth="1.2" fill={`${task.color}08`} />
                        </svg>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{
                  background: '#1A2235',
                  borderRadius: '7px',
                  padding: '0.4rem 0.65rem',
                  fontFamily: 'monospace',
                  fontSize: '0.62rem',
                  color: '#A8D8A8',
                  flexShrink: 0,
                  maxWidth: '320px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}>
                  <span style={{ color: '#4A5568' }}>$ </span>{task.cmd}
                </div>
              </div>
            </div>
          ))}

          {/* 실습 완료 조건 배너 */}
          <div style={{
            background: `linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.12))`,
            border: '1px solid rgba(72,187,120,0.30)',
            borderRadius: '10px',
            padding: '0.6rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            boxShadow: shadow.card,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8.5" stroke="#48BB78" strokeWidth="1.5" />
              <path d="M6 10l3 3 5-6" stroke="#48BB78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#48BB78' }}>실습 완료 조건: </span>
              <span style={{ fontSize: '0.74rem', color: FPGA.text }}>
                Release Goal 적용 후 FSM 관련 위반(fsm_without_reset_state, fsm_with_deadend_state) 2건 이상 검출 및 수정 완료,
                async_reset_active_high 위반 1건에 Waiver 처리(근거 주석 포함)를 확인합니다.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
