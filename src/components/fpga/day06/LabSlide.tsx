'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const LS_KEY = 'fpga-day06-lab-checks';
const DAY06 = '#6B46C1';

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
    title: '컴파일 · warning 확인',
    items: [
      <><C>vlog -sv latent_bug.v</C> — error 0건 · warning 다수 기대</>,
      <>합성 가능 RTL임에도 의도와 다른 회로 생성되는지 관찰</>,
    ],
    color: '#4A6FA5',
    cmd: 'vlog -sv latent_bug.v',
    shell: 'bash',
  },
  {
    num: 2,
    title: 'Lint 실행 (DO-254 goal)',
    items: [
      <><C>{'qverify -c -do "lint methodology standard -goal DO-254; lint run -d latent_bug; exit"'}</C></>,
      <>15건 violation 검출 확인</>,
    ],
    color: DAY06,
    cmd: 'qverify -c -do "lint methodology standard -goal DO-254; lint run -d latent_bug; exit"',
    shell: 'bash',
  },
  {
    num: 3,
    title: 'alias 필터 · 5축 분류',
    items: [
      <>GUI에서 <C>CP5</C>·<C>CP6</C>·<C>CP7</C>·<C>SS2</C>·<C>SS4</C>·<C>SS17</C>·<C>SS18</C> 필터</>,
      <>각 alias 그룹별 violation 수 기록</>,
    ],
    color: '#8B6FA5',
    cmd: 'qverify lint_output/lint.db  # alias tree 탐색',
    shell: 'bash',
  },
  {
    num: 4,
    title: '이중 매핑 (alias + 슬라이드)',
    items: [
      <>DO-254 alias + Day 06 분류 (<C>C1~C3</C>, <C>ST1~ST4</C>, <C>W1~W4</C>, <C>F1~F4</C>) 기입</>,
      <>제공 템플릿 <C>mapping.xlsx</C> 활용</>,
    ],
    color: '#E8913A',
    cmd: '# mapping.xlsx: RTL ID | alias | slide_tag | severity',
    shell: 'note',
  },
  {
    num: 5,
    title: '수정 후 합성 교차 검증',
    items: [
      <>latent bug 15건 전부 수정 · <C>lint run</C> 재실행</>,
      <>Vivado <C>synth_design</C> 재실행 · latch count <strong>0</strong> 확인</>,
      <>cell 수 감소 (FF 대비 latch 제거) 관찰</>,
    ],
    color: '#E53E3E',
    cmd: 'synth_design -top latent_bug  # Vivado TCL',
    shell: 'qverify',
  },
  {
    num: 6,
    title: '리포트 · 합성 log 교차 제출',
    items: [
      <><C>lint generate report -full -html</C> 실행</>,
      <>Vivado 합성 log + lint HTML 교차 검증 결과 제출</>,
      <>산출물 2종: <C>{'<project>_<date>_do254_lint.html'}</C> · <C>synth_crosscheck.md</C></>,
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
          title="latent_bug 결함 15건 검출 · 합성 교차 검증"
          subtitle="DO-254 goal · CP5·6·7 · SS2·4·17·18 alias 중심"
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
                          htmlFor={`d06-lab-${id}`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            fontSize: '0.66rem',
                            color: on ? FPGA.textLight : FPGA.text,
                            textDecoration: on ? 'line-through' : 'none',
                            cursor: 'pointer', userSelect: 'none',
                          }}
                        >
                          <input
                            id={`d06-lab-${id}`}
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
                    alias 기준 violation 15→0건 · latch count 0 · 합성 cell 수 감소 · alias 매핑표 · 합성 교차 검증 결과 제출.
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
