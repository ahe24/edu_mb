'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const LS_KEY = 'fpga-day14-lab-checks';
const DAY14 = '#0B7285';

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

const labTasks: {
  num: number;
  title: string;
  items: ReactNode[];
  color: string;
  cmd: string;
}[] = [
  {
    num: 1,
    title: '커버리지 측정',
    items: [
      <><C>make cov</C> · trip_top 커버리지 수집</>,
      <>요약/상세 리포트에서 홀 목록 읽기</>,
    ],
    color: '#4A6FA5',
    cmd: 'make cov  // cov_measure',
  },
  {
    num: 2,
    title: '홀 보강',
    items: [
      <><C>boost_scenario</C> · 미도달 5시나리오 자극</>,
      <>재측정 → branch/condition/FSM 상승 확인</>,
    ],
    color: DAY14,
    cmd: 'make cov  // cov_hole',
  },
  {
    num: 3,
    title: '회귀 병합',
    items: [
      <>테스트별 <C>-testname</C> UCDB 저장</>,
      <><C>vcover merge</C> → 개별 &lt; 병합 확인</>,
    ],
    color: '#8B6FA5',
    cmd: 'make merge  // cov_merge',
  },
  {
    num: 4,
    title: '클로저 (제외)',
    items: [
      <><C>exclude.do</C> · 도달불가 default 사유 제외</>,
      <>재리포트 → 100% + waiver 확인</>,
    ],
    color: '#E8913A',
    cmd: 'make closure  // cov_closure',
  },
];

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

  const totalItems = labTasks.reduce((s, t) => s + t.items.length, 0);
  const doneItems = Object.values(checked).filter(Boolean).length;
  const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Hands-on · 오늘의 실습"
          title="오늘의 실습 · 측정 → 보강 → 병합 → 클로저"
          subtitle="커버리지 측정 · 홀 보강 · 회귀 병합 · 남은 도달불가 홀 사유 제외 (순서 무관 · 실습4는 2 산출물 재사용)"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* 4 lab tasks (2x2) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
            {labTasks.map((task) => (
              <div key={task.num} style={{
                background: `linear-gradient(135deg, ${task.color}05, ${task.color}0E)`,
                border: `1px solid ${task.color}22`,
                borderLeft: `3px solid ${task.color}`,
                borderRadius: '0 10px 10px 0',
                padding: '0.55rem 0.8rem',
                boxShadow: shadow.card,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.4rem' }}>
                  <span style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: `${task.color}15`, border: `2px solid ${task.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, color: task.color, flexShrink: 0,
                  }}>{task.num}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: FPGA.dark }}>{task.title}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.4rem' }}>
                  {task.items.map((item, idx) => {
                    const id = `${task.num}-${idx}`;
                    const on = !!checked[id];
                    return (
                      <label key={idx} htmlFor={`d14-lab-${id}`} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '0.64rem',
                        color: on ? FPGA.textLight : FPGA.text,
                        textDecoration: on ? 'line-through' : 'none',
                        cursor: 'pointer', userSelect: 'none',
                      }}>
                        <input
                          id={`d14-lab-${id}`} type="checkbox" checked={on}
                          onChange={() => toggle(id)}
                          aria-label={`task ${task.num} item ${idx + 1}`}
                          style={{ width: '11px', height: '11px', accentColor: task.color, cursor: 'pointer', flexShrink: 0, margin: 0 }}
                        />
                        {item}
                      </label>
                    );
                  })}
                </div>

                <div style={{
                  background: '#1A2235', borderRadius: '5px',
                  padding: '0.22rem 0.5rem',
                  fontFamily: 'ui-monospace, Consolas, monospace',
                  fontSize: '0.58rem', color: '#A8D8E0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}>
                  <span style={{ color: '#F6AD55', fontWeight: 600 }}>$ </span>{task.cmd}
                </div>
              </div>
            ))}
          </div>

          {/* 완료 + Day 15 예고 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
            <div style={{
              background: `linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.12))`,
              border: '1px solid rgba(72,187,120,0.30)',
              borderRadius: '8px',
              padding: '0.45rem 0.8rem',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              boxShadow: shadow.card,
            }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="10" cy="10" r="8.5" stroke="#48BB78" strokeWidth="1.5" />
                <path d="M6 10l3 3 5-6" stroke="#48BB78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#48BB78' }}>완료 기준: </span>
                <span style={{ fontSize: '0.62rem', color: FPGA.text }}>
                  측정·홀 목록 확인 · 보강 후 상승 · 병합본 &gt; 개별 · 제외 후 100%+waiver
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, fontFamily: '"JetBrains Mono", monospace' }}>
                <span style={{ fontSize: '0.62rem', color: FPGA.textLight }}>{doneItems}/{totalItems} ({pct}%)</span>
                <button onClick={resetAll} style={{
                  fontSize: '0.56rem', fontWeight: 600, color: FPGA.textLight,
                  background: 'transparent', border: `1px solid ${FPGA.border}`,
                  borderRadius: '4px', padding: '2px 7px', cursor: 'pointer',
                }}>reset</button>
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY14}08, ${DAY14}16)`,
              border: `1px solid ${DAY14}30`,
              borderLeft: `4px solid ${DAY14}`,
              borderRadius: '8px',
              padding: '0.45rem 0.8rem',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              boxShadow: shadow.card,
            }}>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.62rem', fontWeight: 800,
                color: '#fff', background: DAY14,
                padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.06em',
              }}>NEXT</span>
              <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.45 }}>
                <strong>Day 15</strong> — 통합 미니 프로젝트 설계 · 시뮬레이션
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
