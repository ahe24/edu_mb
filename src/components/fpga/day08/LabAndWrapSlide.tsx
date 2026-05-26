'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const LS_KEY = 'fpga-day08-lab-checks';
const DAY08 = '#0E7C7B';

const codeStyle: CSSProperties = {
  fontFamily: 'ui-monospace, "SF Mono", Consolas, "Liberation Mono", monospace',
  fontSize: '0.6rem',
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
    title: 'cdc run · 결과 확인',
    items: [
      <><C>make cdc</C> → 10 checks 검출 확인</>,
      <>Violations 5 / Eval 4 / Proven 1</>,
    ],
    color: '#4A6FA5',
    cmd: 'make cdc',
    shell: 'bash',
  },
  {
    num: 2,
    title: 'GUI · violation triage',
    items: [
      <><C>make view</C> → CDC Checks 윈도우 펼치기</>,
      <>3종 violation schematic + source 확인</>,
    ],
    color: DAY08,
    cmd: 'make view  # qverify cdc_result/cdc.db',
    shell: 'bash',
  },
  {
    num: 3,
    title: 'BUG1 no_sync 수정',
    items: [
      <>trip_active 에 <C>sync_2dff</C> 추가</>,
      <><C>cdc run</C> 재실행 · 해소 확인</>,
    ],
    color: '#E53E3E',
    cmd: '// cdc_demo_top.v 수정',
    shell: 'qverify',
  },
  {
    num: 4,
    title: 'BUG2 multi_bits 수정',
    items: [
      <><C>cdc signal threshold_cfg -stable</C> directive 추가</>,
      <>cascade no_sync 2건도 함께 해소</>,
    ],
    color: '#E8913A',
    cmd: 'cdc signal threshold_cfg offset_cfg -stable',
    shell: 'qverify',
  },
  {
    num: 5,
    title: 'BUG3 combo_logic 수정',
    items: [
      <>합산을 proc_clk 단에서 register → 2DFF에 register 출력 연결</>,
      <>scheme: combo_logic → bus_two_dff</>,
    ],
    color: '#8B6FA5',
    cmd: '// trip_count_sum_r register 추가',
    shell: 'qverify',
  },
  {
    num: 6,
    title: 'status.tcl · 산출물',
    items: [
      <>잔여 Caution → Verified · Export Status</>,
      <><C>run_cdc.tcl</C>에 status.tcl include · 재실행 propagate</>,
      <>cdc.rpt + status.tcl 산출물 제출</>,
    ],
    color: '#48BB78',
    cmd: 'Export Status → qs_files/status.tcl',
    shell: 'note',
  },
];

const promptFor = (shell: Shell) => {
  if (shell === 'bash') return { label: '$ ', color: '#4A5568' };
  if (shell === 'qverify') return { label: 'qverify> ', color: '#F6AD55' };
  return { label: '', color: '#4A5568' };
};

export default function LabAndWrapSlide() {
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
          badge="실습 + 정리"
          title="3종 버그 수정 · 산출물 export · Day 9 예고"
          subtitle="cdc run → debug → fix → re-run cycle 완성 · 5 violation → 0"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {/* 6단계 lab tasks */}
          {labTasks.map((task, i) => (
            <div key={task.num} style={{ display: 'flex', alignItems: 'stretch', gap: '0.55rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '26px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: `${task.color}15`,
                  border: `2px solid ${task.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 800, color: task.color,
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
                borderRadius: '0 8px 8px 0',
                padding: '0.35rem 0.65rem',
                display: 'flex', alignItems: 'center', gap: '0.55rem',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: task.color, marginBottom: '0.1rem' }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                    {task.items.map((item, idx) => {
                      const id = `${task.num}-${idx}`;
                      const on = !!checked[id];
                      return (
                        <label
                          key={idx}
                          htmlFor={`d08-lab-${id}`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            fontSize: '0.62rem',
                            color: on ? FPGA.textLight : FPGA.text,
                            textDecoration: on ? 'line-through' : 'none',
                            cursor: 'pointer', userSelect: 'none',
                          }}
                        >
                          <input
                            id={`d08-lab-${id}`}
                            type="checkbox"
                            checked={on}
                            onChange={() => toggle(id)}
                            aria-label={`task ${task.num} item ${idx + 1}`}
                            style={{
                              width: '11px', height: '11px',
                              accentColor: task.color,
                              cursor: 'pointer',
                              flexShrink: 0, margin: 0,
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
                      borderRadius: '5px',
                      padding: '0.25rem 0.55rem',
                      fontFamily: 'ui-monospace, "SF Mono", Consolas, monospace',
                      fontSize: '0.58rem',
                      color: task.shell === 'note' ? '#94A3B8' : '#A8D8A8',
                      fontStyle: task.shell === 'note' ? 'italic' : 'normal',
                      flexShrink: 0,
                      maxWidth: '360px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}>
                      {p.label && <span style={{ color: p.color, fontWeight: 600 }}>{p.label}</span>}
                      {task.cmd}
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}

          {/* 완료 조건 + Day 9 예고 */}
          {(() => {
            const totalItems = labTasks.reduce((s, t) => s + t.items.length, 0);
            const doneItems = Object.values(checked).filter(Boolean).length;
            const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.5rem', marginTop: '0.2rem' }}>
                <div style={{
                  background: `linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.12))`,
                  border: '1px solid rgba(72,187,120,0.30)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.8rem',
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  boxShadow: shadow.card,
                }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="10" cy="10" r="8.5" stroke="#48BB78" strokeWidth="1.5" />
                    <path d="M6 10l3 3 5-6" stroke="#48BB78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#48BB78' }}>완료: </span>
                    <span style={{ fontSize: '0.62rem', color: FPGA.text }}>
                      Violation 5 → 0 · status.tcl export · re-run propagate 확인
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, fontFamily: '"JetBrains Mono", monospace' }}>
                    <span style={{ fontSize: '0.62rem', color: FPGA.textLight }}>
                      {doneItems}/{totalItems} ({pct}%)
                    </span>
                    <button
                      onClick={resetAll}
                      style={{
                        fontSize: '0.56rem', fontWeight: 600,
                        color: FPGA.textLight, background: 'transparent',
                        border: `1px solid ${FPGA.border}`,
                        borderRadius: '4px', padding: '2px 7px',
                        cursor: 'pointer',
                      }}
                    >reset</button>
                  </div>
                </div>

                {/* Day 9 예고 */}
                <div style={{
                  background: `linear-gradient(135deg, ${DAY08}08, ${DAY08}16)`,
                  border: `1px solid ${DAY08}30`,
                  borderLeft: `4px solid ${DAY08}`,
                  borderRadius: '8px',
                  padding: '0.4rem 0.8rem',
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  boxShadow: shadow.card,
                }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.62rem', fontWeight: 800,
                    color: '#fff', background: DAY08,
                    padding: '2px 8px', borderRadius: '4px',
                    letterSpacing: '0.06em',
                  }}>NEXT</span>
                  <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.45 }}>
                    <strong>Day 09</strong> — QuestaSim 환경 · 기본 시뮬레이션 (Month 2 시작)
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
