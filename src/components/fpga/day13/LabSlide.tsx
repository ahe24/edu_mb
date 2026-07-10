'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const LS_KEY = 'fpga-day13-lab-checks';
const DAY13 = '#087F5B';

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
    title: '계층화 TB',
    items: [
      <><C>uart_driver.sv</C> · send_byte 태스크 모듈화</>,
      <>driver→DUT→monitor→scoreboard PASS</>,
    ],
    color: '#4A6FA5',
    cmd: 'make sim  // tb_layered',
  },
  {
    num: 2,
    title: 'SVA 프로토콜 감시',
    items: [
      <><C>sva_uart_tx.sv</C> · 4속성 + cover 작성</>,
      <>정상 프레임에서 0 violation 확인</>,
    ],
    color: DAY13,
    cmd: 'make sim  // sva_uart',
  },
  {
    num: 3,
    title: 'bind 비침습 결합',
    items: [
      <><C>bind_uart_tx.sv</C> · RTL/TB 무수정 부착</>,
      <>내부 state 속성 + SVA(bind) 라인 확인</>,
    ],
    color: '#8B6FA5',
    cmd: 'make sim  // sva_bind',
  },
  {
    num: 4,
    title: '버그 주입 검출력',
    items: [
      <><C>bug1</C> scoreboard 검출 · SVA 통과 확인</>,
      <><C>bug2</C> framing + A_STOPBIT 동시 검출</>,
    ],
    color: '#E8913A',
    cmd: 'make bug1 && make bug2',
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
          badge="Hands-on · 실습 4종"
          title="오늘의 실습 4종 · 재사용 TB → SVA → 검출력"
          subtitle="계층화 TB를 조립하고 SVA를 얹은 뒤, 버그를 심어 TB가 잡는지 확인 (순서 무관 · 실습4는 1·3 산출물 재사용)"
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
                      <label key={idx} htmlFor={`d13-lab-${id}`} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '0.64rem',
                        color: on ? FPGA.textLight : FPGA.text,
                        textDecoration: on ? 'line-through' : 'none',
                        cursor: 'pointer', userSelect: 'none',
                      }}>
                        <input
                          id={`d13-lab-${id}`} type="checkbox" checked={on}
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
                  fontSize: '0.58rem', color: '#A8D8A8',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}>
                  <span style={{ color: '#F6AD55', fontWeight: 600 }}>$ </span>{task.cmd}
                </div>
              </div>
            ))}
          </div>

          {/* 완료 + Day 14 예고 */}
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
                  계층화 PASS · SVA 0 violation · bind 결합 · bug1/bug2 모두 FAIL 검출
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
              background: `linear-gradient(135deg, ${DAY13}08, ${DAY13}16)`,
              border: `1px solid ${DAY13}30`,
              borderLeft: `4px solid ${DAY13}`,
              borderRadius: '8px',
              padding: '0.45rem 0.8rem',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              boxShadow: shadow.card,
            }}>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.62rem', fontWeight: 800,
                color: '#fff', background: DAY13,
                padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.06em',
              }}>NEXT</span>
              <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.45 }}>
                <strong>Day 14</strong> — 코드 커버리지 측정 · 커버리지 클로저
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
