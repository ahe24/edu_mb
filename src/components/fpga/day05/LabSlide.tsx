'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const LS_KEY = 'fpga-day05-lab-checks';
const DAY05 = '#C05621';

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
    title: '컴파일 & DB 생성',
    items: [
      <><C>vlog broken_rtl.v</C> — 컴파일 에러 여부 확인 (0건 기대)</>,
      <><C>base_goal.tcl</C> 존재 확인 · DO-254 methodology 포함 버전</>,
    ],
    color: '#4A6FA5',
    cmd: 'vlog broken_rtl.v',
    shell: 'bash',
  },
  {
    num: 2,
    title: 'Lint 실행 (DO-254 goal)',
    items: [
      <><C>{'qverify -c -do "do base_goal.tcl; lint run -d broken_rtl; exit"'}</C></>,
      <><C>lint_output/lint.db</C> 생성 확인</>,
    ],
    color: DAY05,
    cmd: 'qverify -c -do "do base_goal.tcl; lint run -d broken_rtl; exit"',
    shell: 'bash',
  },
  {
    num: 3,
    title: 'GUI · alias 탐색',
    items: [
      <><C>qverify lint_output/lint.db</C> 기동</>,
      <>alias tree에서 <C>CP*</C> / <C>SS*</C> 그룹 필터 적용</>,
      <>Error 12건 · Warning 다수 확인</>,
    ],
    color: '#E8913A',
    cmd: 'qverify lint_output/lint.db',
    shell: 'bash',
  },
  {
    num: 4,
    title: '이중 매핑 (alias + 슬라이드)',
    items: [
      <>각 violation → DO-254 alias (<C>CPxx</C>/<C>SSxx</C>) 기입</>,
      <>Day 05 슬라이드 분류 (<C>P1~P4</C>, <C>R1~R4</C>) 기입</>,
      <>제공 템플릿 <C>mapping.xlsx</C> 이용</>,
    ],
    color: '#8B6FA5',
    cmd: '# mapping.xlsx: RTL ID | alias | slide# | severity',
    shell: 'note',
  },
  {
    num: 5,
    title: 'RTL 수정 · 재실행',
    items: [
      <>12건 결함 전 수정 · <C>lint run</C> 재실행</>,
      <>Error severity 0건 달성 확인</>,
      <><C>lint report item -status waived</C> → baseline 갱신</>,
    ],
    color: '#E53E3E',
    cmd: 'lint run -d broken_rtl  # iteration until Error = 0',
    shell: 'qverify',
  },
  {
    num: 6,
    title: '감사 리포트 생성',
    items: [
      <><C>lint generate report -full -html</C> 실행</>,
      <>산출물명: <C>{'<project>_<date>_do254_lint.html'}</C></>,
      <>매핑표 · diff · HTML 3종 제출</>,
    ],
    color: '#48BB78',
    cmd: 'lint generate report -full -html',
    shell: 'qverify',
  },
];

const promptFor = (shell: Shell) => {
  if (shell === 'bash') return { label: '$ ', color: '#4A5568' };
  if (shell === 'qverify') return { label: 'qverify> ', color: '#F6AD55' };
  return { label: '', color: '#4A5568' };
};

export default function LabSlide() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {}
  }, []);

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const resetAll = () => {
    setChecked({});
    try { localStorage.removeItem(LS_KEY); } catch {}
  };

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습"
          title="broken_rtl 결함 12건 triage"
          subtitle="DO-254 goal 활성 · CP·SS alias 기반 검출 → 수정 → 감사 리포트"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {labTasks.map((task, i) => (
            <div key={task.num} style={{ display: 'flex', alignItems: 'stretch', gap: '0.6rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '30px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: `${task.color}15`,
                  border: `2px solid ${task.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.74rem', fontWeight: 800, color: task.color,
                  flexShrink: 0,
                }}>{task.num}</div>
                {i < labTasks.length - 1 && (
                  <div style={{ flex: 1, width: '2px', background: `${task.color}20`, marginTop: '3px' }} />
                )}
              </div>

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
                    {task.items.map((item, idx) => {
                      const id = `${task.num}-${idx}`;
                      const on = !!checked[id];
                      return (
                        <label
                          key={idx}
                          htmlFor={`d05-lab-${id}`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            fontSize: '0.66rem',
                            color: on ? FPGA.textLight : FPGA.text,
                            textDecoration: on ? 'line-through' : 'none',
                            cursor: 'pointer', userSelect: 'none',
                          }}
                        >
                          <input
                            id={`d05-lab-${id}`}
                            type="checkbox"
                            checked={on}
                            onChange={() => toggle(id)}
                            aria-label={`task ${task.num} item ${idx + 1}`}
                            style={{
                              width: '12px', height: '12px',
                              accentColor: task.color,
                              cursor: 'pointer',
                              flexShrink: 0,
                              margin: 0,
                            }}
                          />
                          {item}
                        </label>
                      );
                    })}
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
                      maxWidth: '340px',
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

          {/* 완료 조건 배너 */}
          {(() => {
            const totalItems = labTasks.reduce((s, t) => s + t.items.length, 0);
            const doneItems = Object.values(checked).filter(Boolean).length;
            const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;
            return (
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
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#48BB78' }}>완료 기준: </span>
                  <span style={{ fontSize: '0.68rem', color: FPGA.text }}>
                    Error severity violation 12→0건 · alias 매핑표 완비 · 수정 diff 제출 · <code style={{ ...codeStyle, fontSize: '0.62rem' }}>_do254_lint.html</code> 3종 제출.
                  </span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  flexShrink: 0, fontFamily: '"JetBrains Mono", monospace',
                }}>
                  <span style={{ fontSize: '0.66rem', color: FPGA.textLight }}>
                    {doneItems}/{totalItems} ({pct}%)
                  </span>
                  <button
                    onClick={resetAll}
                    style={{
                      fontSize: '0.6rem', fontWeight: 600,
                      color: FPGA.textLight, background: 'transparent',
                      border: `1px solid ${FPGA.border}`,
                      borderRadius: '4px', padding: '2px 7px',
                      cursor: 'pointer',
                    }}
                  >reset</button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
