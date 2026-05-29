'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const LS_KEY = 'fpga-day07-lab-checks';
const DAY07 = '#0891B2';

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
    title: '데모 회로 둘러보기',
    items: [
      <><C>lab/questa_cdc_lab/rtl/</C> — 7개 파일 구조 파악</>,
      <>3개 도메인: <C>adc_clk</C> · <C>proc_clk</C> · <C>bus_clk</C></>,
    ],
    color: '#4A6FA5',
    cmd: 'cd lab/questa_cdc_lab && ls rtl/',
    shell: 'bash',
  },
  {
    num: 2,
    title: 'RTL 컴파일',
    items: [
      <><C>vlib work</C> + <C>vlog rtl/*.v</C></>,
      <>error 0건 확인 · warning 없어야 정상</>,
    ],
    color: DAY07,
    cmd: 'qverify -c -do "vlib work; vlog rtl/*.v; exit"',
    shell: 'bash',
  },
  {
    num: 3,
    title: 'CDC setup 실행',
    items: [
      <><C>cdc setup -d cdc_demo_top</C> — clock/reset/port 추론</>,
      <>전체 분석 전에 setup만 — 도메인 정의 확인 용도</>,
    ],
    color: '#0E7C7B',
    cmd: 'make setup',
    shell: 'bash',
  },
  {
    num: 4,
    title: 'clock report 읽기',
    items: [
      <><C>cdc_result/cdc.rpt</C> — Section 1 Clock Information</>,
      <>3개 그룹 모두 user-specified 확인</>,
      <>Port Domain 표에서 primary I/O assignment 확인</>,
    ],
    color: '#8B6FA5',
    cmd: 'less cdc_result/cdc.rpt',
    shell: 'bash',
  },
  {
    num: 5,
    title: 'directives.tcl 분석',
    items: [
      <><C>netlist clock</C> · <C>cdc scheme on fifo handshake</C> · <C>cdc methodology fpga</C></>,
      <>각 directive가 분석 결과에 미치는 영향 토론</>,
    ],
    color: '#DD6B20',
    cmd: '# scripts/directives.tcl 검토',
    shell: 'note',
  },
  {
    num: 6,
    title: '예상 warning 확인',
    items: [
      <><C>hdl-41</C> · <C>hdl-238</C> · <C>hdl-289</C> · <C>hdl-271</C> — Questa 표준 expected warning</>,
      <>Day 8에서 각각 해소하는 directive 추가 학습</>,
    ],
    color: '#48BB78',
    cmd: 'grep "Warning\\|Error" cdc_result/cdc_run.log',
    shell: 'bash',
  },
];

const promptFor = (shell: Shell) => {
  if (shell === 'bash') return { label: '$ ', color: '#4A5568' };
  if (shell === 'qverify') return { label: 'qverify> ', color: '#F6AD55' };
  return { label: '', color: '#4A5568' };
};

export default function LabIntroSlide() {
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
          badge="Hands-on: 첫 CDC setup 실행"
          title="Lab — 데모 회로 + cdc setup 첫 실행"
          subtitle="Safety-critical 센서 파이프라인 · 3 도메인 · cdc setup → cdc.rpt 해석"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {/* 데모 회로 다이어그램 */}
          <div style={{
            background: FPGA.white,
            border: `1px solid ${DAY07}25`,
            borderTop: `3px solid ${DAY07}`,
            borderRadius: '10px',
            padding: '0.6rem 0.9rem',
            boxShadow: shadow.card,
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
              회로 — 3 비동기 도메인 sensor pipeline
            </div>
            <svg viewBox="0 0 760 110" style={{ width: '100%', height: '90px' }}>
              {/* adc_clk box */}
              <rect x="10" y="32" width="125" height="50" rx="7" stroke="#4A6FA5" strokeWidth="1.8" fill="rgba(74,111,165,0.08)" />
              <text x="72" y="22" fontSize="12" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>adc_clk 50MHz</text>
              <text x="72" y="62" fontSize="13" fontWeight="700" fill={FPGA.dark} textAnchor="middle">adc_capture</text>

              {/* FIFO */}
              <rect x="155" y="36" width="70" height="42" rx="7" stroke="#48BB78" strokeWidth="1.8" fill="rgba(72,187,120,0.10)" />
              <text x="190" y="22" fontSize="11" fontWeight="700" fill="#48BB78" textAnchor="middle">async</text>
              <text x="190" y="62" fontSize="13" fontWeight="800" fill="#48BB78" textAnchor="middle">FIFO</text>
              <path d="M135 57 L155 57" stroke={FPGA.text} strokeWidth="1.5" markerEnd="url(#labArrow)" />
              <path d="M225 57 L245 57" stroke={FPGA.text} strokeWidth="1.5" markerEnd="url(#labArrow)" />

              {/* proc_clk */}
              <rect x="245" y="32" width="180" height="50" rx="7" stroke={DAY07} strokeWidth="1.8" fill="rgba(8,145,178,0.08)" />
              <text x="335" y="22" fontSize="12" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>proc_clk 100MHz</text>
              <text x="335" y="62" fontSize="13" fontWeight="700" fill={FPGA.dark} textAnchor="middle">threshold_logic</text>

              {/* sync_2dff */}
              <rect x="445" y="36" width="60" height="42" rx="6" stroke="#8B6FA5" strokeWidth="1.8" fill="rgba(139,111,165,0.10)" />
              <text x="475" y="22" fontSize="10" fontWeight="700" fill="#8B6FA5" textAnchor="middle">2DFF</text>
              <text x="475" y="62" fontSize="12" fontWeight="800" fill="#8B6FA5" textAnchor="middle">sync</text>
              <path d="M425 57 L445 57" stroke={FPGA.text} strokeWidth="1.5" markerEnd="url(#labArrow)" />
              <path d="M505 57 L525 57" stroke={FPGA.text} strokeWidth="1.5" markerEnd="url(#labArrow)" />

              {/* bus_clk */}
              <rect x="525" y="32" width="190" height="50" rx="7" stroke="#DD6B20" strokeWidth="1.8" fill="rgba(221,107,32,0.08)" />
              <text x="620" y="22" fontSize="12" fontWeight="800" fill="#DD6B20" textAnchor="middle" fontFamily='"JetBrains Mono", "Pretendard", sans-serif'>bus_clk 40MHz</text>
              <text x="620" y="62" fontSize="13" fontWeight="700" fill={FPGA.dark} textAnchor="middle">bus_iface</text>

              {/* host */}
              <path d="M715 57 L755 57" stroke={FPGA.text} strokeWidth="1.5" markerEnd="url(#labArrow)" />
              <text x="745" y="100" fontSize="11" fontWeight="700" fill={FPGA.textLight} textAnchor="end">→ Host</text>

              <defs>
                <marker id="labArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0 0 L6 3 L0 6 z" fill={FPGA.text} />
                </marker>
              </defs>
            </svg>
          </div>

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
                          htmlFor={`d07-lab-${id}`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            fontSize: '0.62rem',
                            color: on ? FPGA.textLight : FPGA.text,
                            textDecoration: on ? 'line-through' : 'none',
                            cursor: 'pointer', userSelect: 'none',
                          }}
                        >
                          <input
                            id={`d07-lab-${id}`}
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
                      padding: '0.25rem 0.5rem',
                      fontFamily: 'ui-monospace, "SF Mono", Consolas, monospace',
                      fontSize: '0.58rem',
                      color: task.shell === 'note' ? '#94A3B8' : '#A8D8A8',
                      fontStyle: task.shell === 'note' ? 'italic' : 'normal',
                      flexShrink: 0,
                      maxWidth: '380px',
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

          {/* 완료 조건 */}
          {(() => {
            const totalItems = labTasks.reduce((s, t) => s + t.items.length, 0);
            const doneItems = Object.values(checked).filter(Boolean).length;
            const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;
            return (
              <div style={{
                background: `linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.12))`,
                border: '1px solid rgba(72,187,120,0.30)',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                boxShadow: shadow.card,
                marginTop: '0.15rem',
              }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="10" cy="10" r="8.5" stroke="#48BB78" strokeWidth="1.5" />
                  <path d="M6 10l3 3 5-6" stroke="#48BB78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#48BB78' }}>완료 기준: </span>
                  <span style={{ fontSize: '0.66rem', color: FPGA.text }}>
                    cdc.db 생성 · 3개 user-specified clock group 확인 · expected warning 4종 식별 · Day 8 디버그 준비 완료
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, fontFamily: '"JetBrains Mono", monospace' }}>
                  <span style={{ fontSize: '0.64rem', color: FPGA.textLight }}>
                    {doneItems}/{totalItems} ({pct}%)
                  </span>
                  <button
                    onClick={resetAll}
                    style={{
                      fontSize: '0.58rem', fontWeight: 600,
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
