'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const LS_KEY = 'fpga-day09-lab-checks';
const DAY09 = '#2E8B57';

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
  slot: string;
  title: string;
  items: ReactNode[];
  color: string;
  cmd: string;
}[] = [
  {
    num: 1, slot: '오전 ①',
    title: 'sw → LED · 조합 첫 설계',
    items: [
      <><C>sw_led.v</C> 작성 · led=sw, led_n=~sw</>,
      <><C>make sim</C> → 입력 변화에 출력 즉시 반영 확인</>,
    ],
    color: '#4A6FA5',
    cmd: 'make sim',
  },
  {
    num: 2, slot: '오전 ②',
    title: 'logic_gates → RGB LED',
    items: [
      <>AND/OR/XOR → <C>rgb[2:0]</C> 매핑</>,
      <>4조합 파형 ↔ 진리표 대조</>,
    ],
    color: DAY09,
    cmd: 'make wave  # Visualizer',
  },
  {
    num: 3, slot: '오후 ①',
    title: '4:1 MUX · latch 회피',
    items: [
      <><C>case</C> + <C>default</C>로 mux4 작성</>,
      <>default 제거 시 latch 경고 관찰(Lint)</>,
    ],
    color: '#8B6FA5',
    cmd: 'qverify -c -do "lint run -d mux4"',
  },
  {
    num: 4, slot: '오후 ②',
    title: 'self-checking TB',
    items: [
      <><C>mux4_tb.v</C> · for 루프 sel 스윕</>,
      <><C>$error</C>로 자동 판정 · TB DONE 확인</>,
    ],
    color: '#E8913A',
    cmd: 'make sim  // 0 error',
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
          badge="Hands-on · 오전 2 · 오후 2"
          title="오늘의 실습 4 · 설계 → 시뮬 → 검증"
          subtitle="조합논리 3종을 직접 만들고 self-checking TB로 검증한다"
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
                  <span style={{
                    fontSize: '0.58rem', fontWeight: 700, color: task.color,
                    background: `${task.color}12`, border: `1px solid ${task.color}25`,
                    padding: '1px 6px', borderRadius: '4px', fontFamily: '"JetBrains Mono", monospace',
                  }}>{task.slot}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: FPGA.dark }}>{task.title}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.4rem' }}>
                  {task.items.map((item, idx) => {
                    const id = `${task.num}-${idx}`;
                    const on = !!checked[id];
                    return (
                      <label key={idx} htmlFor={`d09-lab-${id}`} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '0.64rem',
                        color: on ? FPGA.textLight : FPGA.text,
                        textDecoration: on ? 'line-through' : 'none',
                        cursor: 'pointer', userSelect: 'none',
                      }}>
                        <input
                          id={`d09-lab-${id}`} type="checkbox" checked={on}
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

          {/* 완료 + Day 10 예고 */}
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
                  3종 설계 시뮬 통과 · MUX latch 회피 · TB 0 error
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
              background: `linear-gradient(135deg, ${DAY09}08, ${DAY09}16)`,
              border: `1px solid ${DAY09}30`,
              borderLeft: `4px solid ${DAY09}`,
              borderRadius: '8px',
              padding: '0.45rem 0.8rem',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              boxShadow: shadow.card,
            }}>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.62rem', fontWeight: 800,
                color: '#fff', background: DAY09,
                padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.06em',
              }}>NEXT</span>
              <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.45 }}>
                <strong>Day 10</strong> — 순차논리 설계(카운터·디바운서) · self-checking TB 고도화
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
