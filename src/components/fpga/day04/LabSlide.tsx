'use client';

import type { CSSProperties, ReactNode } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Day 04 실습 체크리스트
 * 정책 파일 작성 · 파생 Goal · 4가지 Waiver · 기준선 diff
 */

const codeStyle: CSSProperties = {
  fontFamily: 'ui-monospace, "SF Mono", Consolas, "Liberation Mono", monospace',
  fontSize: '0.64rem',
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
    title: '정책 파일 레이아웃 만들기',
    items: [
      <>Day03 프로젝트에 <C>policy/</C>, <C>waivers/</C> 디렉토리 추가</>,
      <><C>policy/base_goal.tcl</C>, <C>project_prefs.tcl</C> 생성</>,
      <><C>scripts/run_lint.tcl</C>이 순차적으로 do 호출하도록 수정</>,
    ],
    color: '#4A6FA5',
    cmd: 'mkdir -p policy waivers && touch policy/{base_goal,project_prefs}.tcl',
    shell: 'bash',
  },
  {
    num: 2,
    title: 'Custom Goal 생성 · 저장',
    items: [
      <><C>lint methodology fpga -goal release -review</C>로 기준선 덤프</>,
      <><C>./fpga/release.tcl</C> 복제 후 3개 이상 체크 조정(on/off/severity)</>,
      <><C>lint generate goal -name my_fpga -dir ./goals</C> 실행</>,
    ],
    color: '#5B8C5A',
    cmd: 'lint methodology fpga -goal release -review',
    shell: 'qverify',
  },
  {
    num: 3,
    title: 'lint preference 3종 적용',
    items: [
      <>Naming: <C>name -check inst_name_not_standard -disallow_mix_case</C></>,
      <>Reset: <C>-valid_flop_controls async_reset sync_reset initial_value</C></>,
      <>Case: <C>-missing_others_or_default</C> 적용 전후 위반 수 기록</>,
    ],
    color: '#E8913A',
    cmd: '# project_prefs.tcl에 3가지 preference 추가',
    shell: 'note',
  },
  {
    num: 4,
    title: 'Waiver 4가지 방법 동시 적용',
    items: [
      <>Pragma: 특정 블록 1개에 <C>// lint_checking X off</C> 적용</>,
      <>lint suppress: 레거시 모듈에 <C>-arg module=</C> + <C>-comment</C> 근거</>,
      <>lint report item: 위반 1건에 <C>-status waived</C> + 4필드 근거</>,
      <>lint off: 정당한 벤더 관례 1건만 (예: <C>unsynth_initial_stmt</C>)</>,
    ],
    color: '#8B6FA5',
    cmd: 'lint report item -status waived -rtl_id <ID> # + REASON/REVIEWER/DATE/TRACE',
    shell: 'qverify',
  },
  {
    num: 5,
    title: '기준선 · Status History 확인',
    items: [
      <>현재 <C>lint.db</C>를 <C>baseline/lint.db</C>로 복사</>,
      <>RTL 한 곳 수정 후 재분석 → <C>lint diff</C>로 <C>lint_incremental.rpt</C> 생성</>,
      <><C>lint_status_history.rpt</C>에서 개별 위반 이력 확인</>,
    ],
    color: '#E53E3E',
    cmd: 'lint diff output/lint.db -refdb baseline/lint.db',
    shell: 'qverify',
  },
  {
    num: 6,
    title: '(Challenge) Triage 시뮬레이션',
    items: [
      <>초기 위반 수 → 정책 적용 후 → 개별 처리 후 수를 표로 정리</>,
      <>waived 항목의 4필드(REASON/REVIEWER/DATE/TRACE) 완비 여부 검증</>,
      <>신규 PR 시뮬레이션: RTL에 의도적 버그 추가 → diff로 탐지되는지 확인</>,
    ],
    color: '#48BB78',
    cmd: '# 팀별 triage 표 작성 + waiver 검증 스크립트 실행',
    shell: 'note',
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
          title="Day 04 실습 체크리스트"
          subtitle="정책 3계층 · Custom Goal · 4가지 Waiver · CI 기준선 diff"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {labTasks.map((task, i) => (
            <div key={task.num} style={{ display: 'flex', alignItems: 'stretch', gap: '0.6rem' }}>
              {/* 번호 + 연결선 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '30px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: `${task.color}15`,
                  border: `2px solid ${task.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.74rem', fontWeight: 800, color: task.color, flexShrink: 0,
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
                padding: '0.4rem 0.7rem',
                display: 'flex', alignItems: 'center', gap: '0.7rem',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: task.color, marginBottom: '0.15rem' }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {task.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.66rem', color: FPGA.text }}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
                          <rect x="0.75" y="0.75" width="9.5" height="9.5" rx="2" stroke={task.color} strokeWidth="1" fill={`${task.color}08`} />
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
                      borderRadius: '6px',
                      padding: '0.3rem 0.55rem',
                      fontFamily: 'ui-monospace, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                      fontSize: '0.6rem',
                      color: task.shell === 'note' ? '#94A3B8' : '#A8D8A8',
                      fontStyle: task.shell === 'note' ? 'italic' : 'normal',
                      flexShrink: 0,
                      maxWidth: '360px',
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
            padding: '0.5rem 0.9rem',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            boxShadow: shadow.card,
            marginTop: '0.2rem',
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="10" cy="10" r="8.5" stroke="#48BB78" strokeWidth="1.5" />
              <path d="M6 10l3 3 5-6" stroke="#48BB78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#48BB78' }}>실습 완료 조건: </span>
              <span style={{ fontSize: '0.68rem', color: FPGA.text }}>
                Custom Goal 1개 생성, 4가지 waiver 방식 각 1건 이상 적용, REASON 4필드 완비된 waiver 1건, <code style={{ ...codeStyle, fontSize: '0.62rem' }}>lint diff</code> 결과로 RTL 변경이 정확히 탐지됨.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
