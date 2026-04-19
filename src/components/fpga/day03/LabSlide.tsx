'use client';

import type { CSSProperties, ReactNode } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Day 03 실습 체크리스트
 * FPGA Methodology Goal 적용 + DO-254 룰 점검
 */

const codeStyle: CSSProperties = {
  fontFamily: 'ui-monospace, "SF Mono", Consolas, "Liberation Mono", monospace',
  fontSize: '0.66rem',
  background: 'rgba(26,34,53,0.08)',
  color: '#1A2235',
  padding: '1px 5px',
  borderRadius: '3px',
  border: '1px solid rgba(26,34,53,0.12)',
};

const C = ({ children }: { children: ReactNode }) => <code style={codeStyle}>{children}</code>;

type Shell = 'bash' | 'qverify' | 'note';

const labTasks: {
  num: number;
  title: string;
  items: ReactNode[];
  color: string;
  cmd: string;
  shell: Shell;
}[] = [
  {
    num: 1,
    title: 'Release Goal 적용 및 전체 분석',
    items: [
      <>run_lint.tcl에 <C>lint methodology fpga -goal release</C> 추가</>,
      <>Day02 예제 RTL 재사용: <C>ctrl_logic.v</C> / <C>state_machine.v</C> / <C>reset_flop.v</C></>,
      <><C>qverify -od lint_day03 -c -do scripts/run_lint.tcl</C> 실행</>,
    ],
    color: '#4A6FA5',
    cmd: 'qverify -od lint_day03 -c -do scripts/run_lint.tcl',
    shell: 'bash',
  },
  {
    num: 2,
    title: 'Goal별 체크 차이 비교',
    items: [
      <><C>-goal simulation</C> → <C>lint.rpt</C> 위반 수 확인</>,
      <><C>-goal release</C> → 동일 RTL 대비 추가 위반 수 확인</>,
      <><C>-review</C> 옵션으로 활성화 체크 목록 파일 생성</>,
    ],
    color: '#5B8C5A',
    cmd: 'lint methodology fpga -goal release -review  # ./fpga/release.tcl 생성',
    shell: 'qverify',
  },
  {
    num: 3,
    title: 'FSM RTL 추가 및 FSM 관련 룰 확인',
    items: [
      <><C>fsm_demo.v</C> 작성: reset 없는 FSM + Dead-end 상태 포함</>,
      <>qverify 재실행 → <C>fsm_without_reset_state</C> / <C>fsm_with_deadend_state</C> 위반 확인</>,
      <>FSM 수정 후 위반 해소 여부 확인</>,
    ],
    color: '#8B6FA5',
    cmd: 'qverify -od lint_day03 -c -do scripts/run_lint.tcl  # fsm_demo.v 포함',
    shell: 'bash',
  },
  {
    num: 4,
    title: 'lint preference 커스터마이징',
    items: [
      <><C>lint preference -clock_gating_module clk_gate_dummy</C> 추가</>,
      <><C>lint preference -missing_others_or_default</C> 추가 후 case 위반 수 변화 확인</>,
      <><C>lint off unsynth_initial_stmt</C> 추가 후 위반 수 변화 확인</>,
    ],
    color: '#E8913A',
    cmd: '# run_lint.tcl에 preference 추가 후 재실행',
    shell: 'note',
  },
  {
    num: 5,
    title: 'Waiver 처리 및 상태 관리',
    items: [
      <><C>async_reset_active_high</C> 위반에 <C>-status waived</C> 처리 (Xilinx 관례 근거 주석)</>,
      <><C>combo_loop</C> 위반에 <C>-status bug</C> 처리</>,
      <><C>lint.rpt</C> 재확인: 상태 변경 반영 여부 검증</>,
    ],
    color: '#E53E3E',
    cmd: 'lint report item -status waived -check async_reset_active_high -arg reset=rst',
    shell: 'qverify',
  },
];

const promptFor = (shell: Shell) => {
  if (shell === 'bash') return { label: '$ ', color: '#4A5568' };
  if (shell === 'qverify') return { label: 'qverify> ', color: '#F6AD55' };
  return { label: '', color: '#4A5568' };
};

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
                    {task.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: FPGA.text }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                          <rect x="0.75" y="0.75" width="11.5" height="11.5" rx="2.5" stroke={task.color} strokeWidth="1.2" fill={`${task.color}08`} />
                        </svg>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                {(() => {
                  const p = promptFor(task.shell);
                  return (
                    <div style={{
                      background: '#1A2235',
                      borderRadius: '7px',
                      padding: '0.4rem 0.65rem',
                      fontFamily: 'ui-monospace, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                      fontSize: '0.62rem',
                      color: task.shell === 'note' ? '#94A3B8' : '#A8D8A8',
                      fontStyle: task.shell === 'note' ? 'italic' : 'normal',
                      flexShrink: 0,
                      maxWidth: '320px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}>
                      {p.label && <span style={{ color: p.color, fontWeight: 600 }}>{p.label}</span>}
                      {task.cmd}
                    </div>
                  );
                })()}
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
