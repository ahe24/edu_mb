'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY06 = '#6B46C1';

type IssueKey = 'F1' | 'F2' | 'F3' | 'F4';

const issues: { key: IssueKey; alias: string; title: string; desc: string; check: string; color: string }[] = [
  {
    key: 'F1',
    alias: 'CP6',
    title: 'Unreachable state',
    desc: '진입 불가 state — 전이 그래프 분석으로 도달 불가 판정',
    check: 'fsm_with_unreachable_state',
    color: '#E8913A',
  },
  {
    key: 'F2',
    alias: 'CP6',
    title: 'Deadend state',
    desc: '탈출 불가 state — SEU 발생 시 영구 잠금',
    check: 'fsm_with_deadend_state',
    color: '#E53E3E',
  },
  {
    key: 'F3',
    alias: 'CP5',
    title: '비인코딩 state',
    desc: 'state reg bit > 실제 state — 미정의 조합에서 임의 거동',
    check: 'fsm_state_value_hardcoded',
    color: '#DD6B20',
  },
  {
    key: 'F4',
    alias: 'CP6',
    title: 'Safe transition 부재',
    desc: 'Recovery path 없음 — SEU 복구 불가 (우주·항공 필수)',
    check: 'fsm_without_default_state\nfsm_without_reset_state',
    color: '#8B6FA5',
  },
];

function FsmDiagram({ sel }: { sel: IssueKey }) {
  const S0 = { x: 50,  y: 80, label: 'S0' };
  const S1 = { x: 150, y: 40, label: 'S1' };
  const S2 = { x: 150, y: 120, label: 'S2' };
  const S3 = { x: 250, y: 80, label: 'S3' };
  const Sx = { x: 350, y: 80, label: '???' };

  const isF1 = sel === 'F1';
  const isF2 = sel === 'F2';
  const isF3 = sel === 'F3';
  const isF4 = sel === 'F4';

  return (
    <svg viewBox="0 0 400 180" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <marker id="fsm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0,0 6,3 0,6" fill="#4A6FA5" />
        </marker>
        <marker id="fsm-arr-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0,0 6,3 0,6" fill="#E53E3E" />
        </marker>
      </defs>

      {/* S0 */}
      <circle cx={S0.x} cy={S0.y} r="20" stroke="#4A6FA5" strokeWidth="2" fill="rgba(74,111,165,0.08)" />
      <text x={S0.x} y={S0.y + 4} fontSize="11" fontWeight="800" textAnchor="middle" fill="#4A6FA5" fontFamily="monospace">{S0.label}</text>

      {/* S1 */}
      <circle cx={S1.x} cy={S1.y} r="20"
        stroke={isF1 ? '#E53E3E' : '#4A6FA5'}
        strokeWidth={isF1 ? 2.5 : 2}
        strokeDasharray={isF1 ? '5 3' : 'none'}
        fill={isF1 ? 'rgba(229,62,62,0.08)' : 'rgba(74,111,165,0.08)'} />
      <text x={S1.x} y={S1.y + 4} fontSize="11" fontWeight="800" textAnchor="middle"
        fill={isF1 ? '#E53E3E' : '#4A6FA5'} fontFamily="monospace">{S1.label}</text>
      {isF1 && <text x={S1.x} y={S1.y - 25} fontSize="9" fontWeight="800" textAnchor="middle" fill="#E53E3E">unreachable</text>}

      {/* S2 (deadend) */}
      <circle cx={S2.x} cy={S2.y} r="20"
        stroke={isF2 ? '#E53E3E' : '#4A6FA5'}
        strokeWidth={isF2 ? 2.5 : 2}
        fill={isF2 ? 'rgba(229,62,62,0.12)' : 'rgba(74,111,165,0.08)'} />
      <text x={S2.x} y={S2.y + 4} fontSize="11" fontWeight="800" textAnchor="middle"
        fill={isF2 ? '#E53E3E' : '#4A6FA5'} fontFamily="monospace">{S2.label}</text>
      {isF2 && <text x={S2.x} y={S2.y + 36} fontSize="9" fontWeight="800" textAnchor="middle" fill="#E53E3E">deadend</text>}

      {/* S3 */}
      <circle cx={S3.x} cy={S3.y} r="20" stroke="#4A6FA5" strokeWidth="2" fill="rgba(74,111,165,0.08)" />
      <text x={S3.x} y={S3.y + 4} fontSize="11" fontWeight="800" textAnchor="middle" fill="#4A6FA5" fontFamily="monospace">{S3.label}</text>

      {/* Sx — 미정의 조합 (F3) */}
      {isF3 && (
        <>
          <circle cx={Sx.x} cy={Sx.y} r="20" stroke="#DD6B20" strokeWidth="2.5" strokeDasharray="5 3" fill="rgba(221,107,32,0.12)" />
          <text x={Sx.x} y={Sx.y + 4} fontSize="11" fontWeight="800" textAnchor="middle" fill="#DD6B20" fontFamily="monospace">{Sx.label}</text>
          <text x={Sx.x} y={Sx.y + 36} fontSize="9" fontWeight="800" textAnchor="middle" fill="#DD6B20">미정의 조합</text>
        </>
      )}

      {/* 전이 */}
      <line x1={S0.x + 18} y1={S0.y - 4} x2={S1.x - 20} y2={S1.y + 12}
        stroke={isF1 ? '#CBD5E0' : '#4A6FA5'} strokeWidth="1.5"
        markerEnd={isF1 ? '' : 'url(#fsm-arr)'} />
      <line x1={S0.x + 18} y1={S0.y + 8} x2={S2.x - 20} y2={S2.y - 8}
        stroke="#4A6FA5" strokeWidth="1.5" markerEnd="url(#fsm-arr)" />
      <line x1={S1.x + 18} y1={S1.y + 8} x2={S3.x - 20} y2={S3.y - 8}
        stroke="#4A6FA5" strokeWidth="1.5" markerEnd="url(#fsm-arr)" />

      {/* S2→S3 (F2 없으면 있음) */}
      {!isF2 && (
        <line x1={S2.x + 18} y1={S2.y - 8} x2={S3.x - 20} y2={S3.y + 8}
          stroke="#4A6FA5" strokeWidth="1.5" markerEnd="url(#fsm-arr)" />
      )}

      {/* F4 — safe transition 필요 표시 */}
      {isF4 && (
        <>
          <path d={`M${S3.x + 20} ${S3.y - 15} Q${S3.x + 40} ${S3.y - 50} ${S0.x + 20} ${S0.y - 20}`}
            stroke="#8B6FA5" strokeWidth="1.8" strokeDasharray="5 3" fill="none" markerEnd="url(#fsm-arr-red)" />
          <text x="200" y="20" fontSize="9" fontWeight="800" textAnchor="middle" fill="#8B6FA5">recovery path 필요</text>
        </>
      )}
    </svg>
  );
}

export default function FsmLatentSlide() {
  const [sel, setSel] = useState<IssueKey>('F1');
  const issue = issues.find(i => i.key === sel)!;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="DO-254 · CP5 · CP6"
          title="FSM 잠재 오류"
          subtitle="Day 03 FSM 룰 심화 — SEU 복구 · 인코딩 일관성"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* alias 배너 */}
          <div style={{
            display: 'flex', gap: '0.5rem',
          }}>
            {['CP5 — 인코딩 일관성', 'CP6 — 안전 전이'].map((l) => (
              <div key={l} style={{
                flex: 1,
                background: `linear-gradient(135deg, ${DAY06}08, ${DAY06}16)`,
                border: `1px solid ${DAY06}35`,
                borderLeft: `4px solid ${DAY06}`,
                borderRadius: '10px',
                padding: '0.5rem 0.8rem',
                fontSize: '0.75rem',
                color: FPGA.text,
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: shadow.card,
              }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: '0.74rem', fontWeight: 800,
                  color: '#fff', background: DAY06,
                  padding: '3px 10px', borderRadius: '5px',
                }}>{l.split(' — ')[0]}</span>
                <span>{l.split(' — ')[1]}</span>
              </div>
            ))}
          </div>

          {/* 좌 FSM + 우 이슈 리스트 */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white,
              border: `1px solid ${issue.color}30`,
              borderTop: `3px solid ${issue.color}`,
              borderRadius: '10px',
              padding: '0.6rem 0.8rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: '0.68rem', fontWeight: 800,
                  color: issue.color, background: `${issue.color}15`,
                  border: `1px solid ${issue.color}40`,
                  padding: '2px 7px', borderRadius: '4px',
                }}>{issue.key} · {issue.alias}</span>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: FPGA.dark }}>{issue.title}</span>
              </div>
              <FsmDiagram sel={sel} />
              <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.5 }}>
                {issue.desc}
              </div>
              <code style={{
                fontSize: '0.6rem', color: FPGA.primary,
                fontFamily: 'monospace', whiteSpace: 'pre-wrap',
              }}>{issue.check}</code>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {issues.map((x) => {
                const active = sel === x.key;
                return (
                  <button
                    key={x.key}
                    onClick={() => setSel(x.key)}
                    style={{
                      textAlign: 'left',
                      background: active
                        ? `linear-gradient(135deg, ${x.color}14, ${x.color}24)`
                        : FPGA.white,
                      border: active ? `2px solid ${x.color}` : `1px solid ${FPGA.border}`,
                      borderLeft: `3px solid ${x.color}`,
                      borderRadius: '10px',
                      padding: '0.55rem 0.8rem',
                      boxShadow: active ? shadow.card : '0 2px 6px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      display: 'flex', flexDirection: 'column', gap: '3px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontFamily: 'monospace', fontSize: '0.6rem', fontWeight: 800,
                        color: x.color, background: `${x.color}15`,
                        border: `1px solid ${x.color}35`,
                        padding: '1px 6px', borderRadius: '4px',
                      }}>{x.key} · {x.alias}</span>
                      <span style={{ fontSize: '0.76rem', fontWeight: 800, color: FPGA.dark }}>{x.title}</span>
                    </div>
                    <div style={{ fontSize: '0.64rem', color: FPGA.textLight, lineHeight: 1.45 }}>
                      {x.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEU 복구 주의 배너 */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY06}08, ${DAY06}16)`,
            border: `1px solid ${DAY06}35`,
            borderRadius: '10px',
            padding: '0.55rem 0.9rem',
            fontSize: '0.72rem',
            color: FPGA.text,
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            boxShadow: shadow.card,
          }}>
            <span style={{ color: DAY06, fontWeight: 800 }}>safe-FSM 구조:</span>
            <span>
              우주·항공 의무 · DO-254 §6.3 설계 보증 —
              <code style={{ fontFamily: 'monospace' }}>default</code> 분기에서 <strong>reset state로 강제 전이</strong> · one-hot + 미정의 조합 decode → reset.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
