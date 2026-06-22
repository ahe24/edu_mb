'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const LS_KEY = 'fpga-day11-lab-checks';
const DAY11 = '#3D8361';

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
    title: '신호등 Moore FSM',
    items: [
      <><C>traffic_light.v</C> · 3상태 <C>en</C> 게이트 · RGB LED 3개(YEL=R+G)</>,
      <>제공 TB가 en 펄스 구동 → 순환·RGB 색·안전 default 확인</>,
    ],
    color: '#4A6FA5',
    cmd: 'make sim',
  },
  {
    num: 2,
    title: 'RGB PWM 밝기 FSM',
    items: [
      <><C>pwm_rgb.v</C> · 1kHz PWM · RGB duty 50% 상한</>,
      <>btn_p 펄스로 OFF→DIM→MID→MAX(50%)</>,
    ],
    color: DAY11,
    cmd: 'make wave',
  },
  {
    num: 3,
    title: '시퀀스 검출 FSM',
    items: [
      <><C>seq_detect.v</C> · {'"101"'} overlap</>,
      <>101101 인가 → found 2회 확인</>,
    ],
    color: '#8B6FA5',
    cmd: '// din 패턴 인가',
  },
  {
    num: 4,
    title: '천이·corner 검증',
    items: [
      <>state coverage 4/4 · 기대 found 자동판정</>,
      <><C>force</C>로 illegal state → 안전 복구</>,
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
          title="오늘의 실습 4 · FSM 설계 → 천이 검증"
          subtitle="상태로 동작을 설계하고, 모든 천이와 illegal state까지 검증한다"
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
                      <label key={idx} htmlFor={`d11-lab-${id}`} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '0.64rem',
                        color: on ? FPGA.textLight : FPGA.text,
                        textDecoration: on ? 'line-through' : 'none',
                        cursor: 'pointer', userSelect: 'none',
                      }}>
                        <input
                          id={`d11-lab-${id}`} type="checkbox" checked={on}
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

          {/* 완료 + Day 12 예고 */}
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
                  3 FSM 동작 · state coverage 4/4 · illegal 복구 · TB 0 error
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
              background: `linear-gradient(135deg, ${DAY11}08, ${DAY11}16)`,
              border: `1px solid ${DAY11}30`,
              borderLeft: `4px solid ${DAY11}`,
              borderRadius: '8px',
              padding: '0.45rem 0.8rem',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              boxShadow: shadow.card,
            }}>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.62rem', fontWeight: 800,
                color: '#fff', background: DAY11,
                padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.06em',
              }}>NEXT</span>
              <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.45 }}>
                <strong>Day 12</strong> — UART 통신 설계 및 프로토콜 검증 (TX/RX 루프백)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
