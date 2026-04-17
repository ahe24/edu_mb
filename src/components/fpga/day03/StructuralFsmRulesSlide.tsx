'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Structural · FSM 핵심 룰 탐색기
 * 탭 기반 인터랙티브 뷰어 — Structural 8개 + FSM 4개
 */

type RuleKey =
  | 'combo_loop'
  | 'latch_inferred'
  | 'case_default_missing'
  | 'multi_driven_signal'
  | 'assign_width_overflow'
  | 'sensitivity_list'
  | 'undriven_logic'
  | 'fsm_without_reset_state'
  | 'fsm_with_deadend_state'
  | 'fsm_with_unreachable_state'
  | 'fsm_without_default_state';

interface RuleData {
  key: RuleKey;
  ruleId: string;
  category: 'structural' | 'fsm';
  severity: string;
  sevColor: string;
  title: string;
  do254: string;
  starc?: string;
  customizable: boolean;
  problem: string;
  solution: string;
  code: { text: string; highlight?: boolean; annotate?: string }[];
  directive?: string;
  diagram?: 'combo_loop' | 'latch_inferred' | 'assign_width_overflow' | 'sensitivity_list';
}

function WidthOverflowDiagram() {
  const [tab, setTab] = useState<'bits' | 'impact'>('bits');

  const err = '#E53E3E';
  const ok = '#48BB78';
  const warn = '#E8913A';
  const text = '#2D3748';
  const muted = '#718096';
  const bg = '#F7FAFC';

  // 255 + 1 = 256 (9-bit) → truncated to 0 (8-bit)  — classic wrap-around
  const a = [1, 1, 1, 1, 1, 1, 1, 1];
  const b = [0, 0, 0, 0, 0, 0, 0, 1];
  const sumBits = [1, 0, 0, 0, 0, 0, 0, 0, 0];
  const resultBits = [0, 0, 0, 0, 0, 0, 0, 0];

  const pitch = 32;
  const bitW = 28;
  const bitH = 24;
  const xStart8 = 120;
  const xStart9 = xStart8 - pitch;

  const impacts = [
    {
      icon: '🔇',
      color: err,
      title: 'Silent 데이터 손실',
      desc: '컴파일·합성 모두 에러 없음. 틀린 값이 조용히 다운스트림 로직으로 전파되어 최종 출력까지 오염.',
    },
    {
      icon: '💥',
      color: warn,
      title: '산술 wrap-around',
      desc: '카운터·타이머·주소 계산에서 최대값 → 0 으로 급격히 점프. 측정값 불연속, 제어 루프 불안정.',
    },
    {
      icon: '🎯',
      color: err,
      title: 'Safety-Critical 오동작',
      desc: '센서 ADC 누적, 고도·압력 계산 등에서 결과가 엉뚱한 값. Safety 로직이 오경보 또는 무경보로 빠짐.',
    },
  ];

  const renderBit = (
    bit: number,
    i: number,
    xStart: number,
    y: number,
    color: string,
    opts?: { isCarry?: boolean }
  ) => {
    const x = xStart + i * pitch;
    const isCarry = opts?.isCarry ?? false;
    const activeColor = isCarry ? err : color;
    return (
      <g key={`${y}_${i}`}>
        <rect
          className={isCarry ? 'wo-carry' : undefined}
          x={x}
          y={y}
          width={bitW}
          height={bitH}
          rx={3}
          fill={isCarry ? `${err}25` : bit ? `${activeColor}18` : bg}
          stroke={isCarry ? err : bit ? activeColor : '#CBD5E0'}
          strokeWidth={isCarry ? 2 : 1.5}
          strokeDasharray={isCarry ? '3,2' : undefined}
        />
        <text
          x={x + bitW / 2}
          y={y + 17}
          fontSize="13"
          fontWeight="800"
          textAnchor="middle"
          fill={isCarry ? err : bit ? activeColor : muted}
          fontFamily="monospace"
        >
          {bit}
        </text>
        {isCarry && (
          <g className="wo-xmark">
            <line x1={x + 6} y1={y + 6} x2={x + bitW - 6} y2={y + bitH - 6} stroke={err} strokeWidth="2.5" />
            <line x1={x + bitW - 6} y1={y + 6} x2={x + 6} y2={y + bitH - 6} stroke={err} strokeWidth="2.5" />
          </g>
        )}
      </g>
    );
  };

  const tabs: { key: 'bits' | 'impact'; label: string }[] = [
    { key: 'bits', label: '📊 비트 동작 원리' },
    { key: 'impact', label: '⚠️ 영향과 실제 사례' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
      <style>{`
        @keyframes woPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes woXFlash {
          0%, 50%, 100% { opacity: 0.35; }
          25%, 75% { opacity: 1; }
        }
        .wo-carry { animation: woPulse 1.8s ease-in-out infinite; transform-origin: center; }
        .wo-xmark { animation: woXFlash 1.8s ease-in-out infinite; }
      `}</style>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #E2E8F0', marginBottom: '0.1rem' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.4rem 1rem',
              border: 'none',
              background: tab === t.key ? `linear-gradient(180deg, ${err}08, ${err}18)` : 'transparent',
              color: tab === t.key ? err : muted,
              fontSize: '0.74rem',
              fontWeight: tab === t.key ? 800 : 600,
              cursor: 'pointer',
              borderBottom: tab === t.key ? `2.5px solid ${err}` : '2.5px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.15s ease',
              borderRadius: '6px 6px 0 0',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: 비트 동작 원리 */}
      {tab === 'bits' && (
      <div
        style={{
          background: bg,
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '0.55rem 0.9rem 0.4rem',
        }}
      >
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: text, marginBottom: '0.25rem' }}>
          🔬 비트 수준 시뮬레이션 — <code style={{ fontFamily: 'monospace', background: '#EDF2F7', padding: '1px 5px', borderRadius: '3px', fontSize: '0.66rem' }}>assign result = a + b</code>  &nbsp;  (a·b: 8 bit, result: 8 bit)
        </div>
        <svg viewBox="0 0 580 235" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Row a */}
          <text x="6" y="37" fontSize="12" fontWeight="700" fill={text} fontFamily="monospace">a</text>
          <text x="20" y="37" fontSize="9" fill={muted}>[7:0]</text>
          {a.map((bit, i) => renderBit(bit, i, xStart8, 18, ok))}
          <text x="395" y="37" fontSize="12" fontWeight="700" fill={text} fontFamily="monospace">= 255 (최대)</text>

          {/* Row b */}
          <text x="6" y="77" fontSize="12" fontWeight="700" fill={text} fontFamily="monospace">b</text>
          <text x="20" y="77" fontSize="9" fill={muted}>[7:0]</text>
          {b.map((bit, i) => renderBit(bit, i, xStart8, 58, ok))}
          <text x="395" y="77" fontSize="12" fontWeight="700" fill={text} fontFamily="monospace">= 1</text>

          {/* Plus + separator */}
          <text x="82" y="95" fontSize="16" fontWeight="800" fill={text} fontFamily="monospace">+</text>
          <line x1="80" y1="98" x2="380" y2="98" stroke={text} strokeWidth="1.2" />

          {/* Row sum (9 bits) */}
          <text x="6" y="127" fontSize="12" fontWeight="700" fill={text} fontFamily="monospace">a+b</text>
          <text x="20" y="138" fontSize="9" fill={muted}>[8:0]</text>
          {sumBits.map((bit, i) =>
            renderBit(bit, i, xStart9, 108, ok, { isCarry: i === 0 })
          )}
          <text x="395" y="127" fontSize="12" fontWeight="700" fill={ok} fontFamily="monospace">= 256 (정답·9b)</text>

          {/* 캐리 버려짐 */}
          <text x={xStart9 + bitW / 2} y={151} fontSize="8.5" fontWeight="800" textAnchor="middle" fill={err} fontFamily="monospace">
            버려짐!
          </text>
          <line x1={xStart9 + bitW / 2} y1={135} x2={xStart9 + bitW / 2} y2={144} stroke={err} strokeWidth="1.2" strokeDasharray="2,2" />

          {/* Row result (8 bits, aligned with LSB 8 of sum) */}
          <text x="6" y="187" fontSize="12" fontWeight="700" fill={err} fontFamily="monospace">result</text>
          <text x="42" y="187" fontSize="9" fill={muted}>[7:0]</text>
          {resultBits.map((bit, i) => renderBit(bit, i, xStart8, 170, err))}
          <text x="395" y="187" fontSize="12" fontWeight="700" fill={err} fontFamily="monospace">= 0 (틀린 값!)</text>

          {/* 오차 강조 */}
          <rect x="140" y="208" width="300" height="22" rx="4" fill={err} opacity="0.08" />
          <text x="290" y="223" fontSize="10.5" fontWeight="800" fill={err} textAnchor="middle" fontFamily="monospace">
            ⚠ 255 + 1 = 0 · 오차 256 (100% 빗나감, wrap-around)
          </text>
        </svg>
        <div style={{ fontSize: '0.62rem', color: muted, textAlign: 'center', marginTop: '0.3rem', lineHeight: 1.5 }}>
          상위 1-bit (캐리)이 LHS 폭(8-bit)을 초과 → 묵시적으로 잘려나감 · 합성·컴파일 에러 없이 <strong style={{ color: err }}>틀린 값</strong>이 다운스트림으로 전파.
          <br />
          <span style={{ color: text, fontWeight: 700 }}>👉 "⚠️ 영향과 실제 사례" 탭에서 이 버그가 현실 시스템에 미치는 피해 확인</span>
        </div>
      </div>
      )}

      {/* Tab 2: 영향과 실제 사례 */}
      {tab === 'impact' && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* 3 impact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem' }}>
          {impacts.map((p, i) => (
            <div key={i} style={{
              background: `linear-gradient(135deg, ${p.color}08, ${p.color}14)`,
              border: `1.5px solid ${p.color}40`,
              borderRadius: '9px',
              padding: '0.75rem 0.85rem',
              boxShadow: `0 2px 6px ${p.color}10`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: p.color, letterSpacing: '0.02em' }}>
                  {p.title}
                </div>
              </div>
              <div style={{ fontSize: '0.66rem', color: text, lineHeight: 1.65 }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Safety-Critical 사례 — 단계 흐름도 */}
        <div style={{
          background: `linear-gradient(135deg, ${warn}0A, ${warn}16)`,
          border: `1.5px solid ${warn}40`,
          borderRadius: '9px',
          padding: '0.7rem 0.9rem 0.65rem',
        }}>
          <div style={{ fontWeight: 800, color: warn, marginBottom: '0.55rem', fontSize: '0.74rem' }}>
            💡 Safety-Critical 사례 — 온도·압력 센서가 overflow 되면 벌어지는 일
          </div>

          {/* 4-step flow */}
          <div style={{ display: 'flex', gap: '2px', alignItems: 'stretch', marginBottom: '0.55rem' }}>
            {[
              { icon: '📈', color: '#4A5568', title: '1. 값 상승',     desc: '측정값이 8-bit 최대(255)까지 누적' },
              { icon: '💥', color: err,        title: '2. Overflow',   desc: '+1 증분 → 256 → 8-bit에 0 으로 wrap' },
              { icon: '🤔', color: warn,       title: '3. 제어 오판',   desc: '0 = "정상 범위"로 해석 · 위험 미인지' },
              { icon: '🔥', color: err,        title: '4. 사고',        desc: '냉각·감압 지연 → 과열·과압 피해' },
            ].flatMap((step, i) => {
              const nodes = [];
              if (i > 0) {
                nodes.push(
                  <div key={`ar-${i}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: warn, fontSize: '1rem', fontWeight: 800, padding: '0 2px',
                  }}>→</div>
                );
              }
              nodes.push(
                <div key={`st-${i}`} style={{
                  flex: 1,
                  background: FPGA.white,
                  border: `1px solid ${step.color}35`,
                  borderRadius: '7px',
                  padding: '0.45rem 0.55rem',
                  display: 'flex', flexDirection: 'column', gap: '3px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '0.95rem' }}>{step.icon}</span>
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, color: step.color }}>
                      {step.title}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.6rem', color: text, lineHeight: 1.5 }}>
                    {step.desc}
                  </div>
                </div>
              );
              return nodes;
            })}
          </div>

          {/* 적용 도메인 + 해결 */}
          <div style={{
            display: 'flex', gap: '8px',
            fontSize: '0.64rem', color: text, lineHeight: 1.6,
          }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.55)', borderRadius: '6px', padding: '0.4rem 0.55rem' }}>
              <strong style={{ color: warn }}>적용 도메인:</strong> 원전 노심 온도 · 보일러/반응기 압력 · EV 배터리 셀 온도 · 엔진·터빈 제어 등
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.55)', borderRadius: '6px', padding: '0.4rem 0.55rem' }}>
              <strong style={{ color: ok }}>해결:</strong> <code style={{ background: '#E2E8F0', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace' }}>wire [8:0] sum</code> 로 폭 확장 · 의도적 truncation은 <code style={{ background: '#E2E8F0', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace' }}>sum[7:0]</code> 명시
            </div>
          </div>
        </div>

        {/* CP7 관련 체크 — 세로 리스트 */}
        <div style={{
          background: `linear-gradient(135deg, ${ok}0C, ${ok}18)`,
          border: `1.5px solid ${ok}40`,
          borderRadius: '9px',
          padding: '0.65rem 0.9rem',
        }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: ok, marginBottom: '0.45rem' }}>
            ✅ CP7 카테고리 완전 커버 — 함께 활성화 권장 체크
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[
              { name: 'assign_width_underflow',       desc: 'RHS < LHS 비트 폭 (제로 확장)' },
              { name: 'comparison_width_mismatch',    desc: '비교 연산자 양쪽 비트 폭 불일치' },
              { name: 'expr_operands_width_mismatch', desc: '산술·논리 피연산자 비트 폭 불일치' },
            ].map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '0.66rem', color: text,
                padding: '0.25rem 0',
              }}>
                <span style={{ color: ok, fontWeight: 900, fontSize: '0.8rem', lineHeight: 1 }}>▸</span>
                <code style={{
                  fontFamily: 'monospace',
                  background: `${ok}15`, color: '#22674C',
                  padding: '2px 8px', borderRadius: '4px',
                  fontSize: '0.64rem', fontWeight: 700,
                  minWidth: '215px',
                }}>
                  {c.name}
                </code>
                <span style={{ color: muted }}>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

function LatchProblemDiagram() {
  const err = '#E53E3E';
  const ok = '#48BB78';
  const warn = '#E8913A';
  const wire = '#4A5568';
  const text = '#2D3748';

  const problems = [
    {
      icon: '🧠',
      color: err,
      title: '숨겨진 상태 메모리',
      desc: '같은 입력이어도 과거에 따라 출력이 달라짐. if에 else가 없으면 이전 값을 "기억"하는 회로가 자동으로 합성되어 순수 조합 논리가 아닌 상태가 됨.',
    },
    {
      icon: '⚡',
      color: warn,
      title: 'Level-sensitive 투명성',
      desc: 'Enable=1 구간 동안 래치는 "투명"해져 입력의 순간적 글리치·경쟁(race) 현상이 그대로 출력에 전파됨. FF는 edge에서만 샘플링하여 글리치를 차단.',
    },
    {
      icon: '📐',
      color: err,
      title: 'STA 분석 복잡도 급증',
      desc: 'Time borrowing, multi-cycle path 등 특수 케이스 처리가 필요하며 DO-254 / Safety-Critical 검증·타이밍 폐쇄(closure)가 어려워짐. 많은 프로젝트가 래치 금지 정책을 채택.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
      <style>{`
        @keyframes lpScan {
          0%, 6% { transform: translateX(0); opacity: 0; }
          10% { opacity: 0.55; }
          90% { opacity: 0.55; }
          94%, 100% { transform: translateX(490px); opacity: 0; }
        }
        @keyframes lpGlitchFlash {
          0%, 38%, 52%, 100% { opacity: 0; }
          42%, 48% { opacity: 0.35; }
        }
        .lp-scanline { animation: lpScan 5s ease-in-out infinite; }
        .lp-glitch-flash { animation: lpGlitchFlash 5s ease-in-out infinite; }
      `}</style>

      {/* 3 problems grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
        {problems.map((p, i) => (
          <div key={i} style={{
            background: `linear-gradient(135deg, ${p.color}08, ${p.color}14)`,
            border: `1.5px solid ${p.color}40`,
            borderRadius: '8px',
            padding: '0.55rem 0.7rem',
            boxShadow: `0 2px 6px ${p.color}10`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.05rem' }}>{p.icon}</span>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: p.color, letterSpacing: '0.02em' }}>
                문제 {i + 1} · {p.title}
              </div>
            </div>
            <div style={{ fontSize: '0.64rem', color: text, lineHeight: 1.55 }}>
              {p.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Waveform panel */}
      <div style={{
        background: '#F7FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '0.5rem 0.8rem 0.4rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: text }}>
            🔬 타이밍 파형 — 같은 D/CLK 에 대한 Latch vs FF 응답 비교
          </div>
          <div style={{ fontSize: '0.58rem', color: '#718096' }}>
            (scan line 이동으로 시간 흐름 표시)
          </div>
        </div>
        <svg viewBox="0 0 600 230" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <marker id="lpArrErr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <polygon points="0,0 6,3 0,6" fill={err} />
            </marker>
            <marker id="lpArrOk" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <polygon points="0,0 6,3 0,6" fill={ok} />
            </marker>
          </defs>

          {/* CLK=1 투명 영역 */}
          <rect x="150" y="12" width="80" height="200" fill={warn} opacity="0.07" />
          <rect x="310" y="12" width="80" height="200" fill={warn} opacity="0.07" />
          <text x="190" y="10" fontSize="8" fontWeight="700" fill={warn} fontFamily="monospace">CLK=1 · 래치 투명</text>
          <text x="350" y="10" fontSize="8" fontWeight="700" fill={warn} fontFamily="monospace">CLK=1 · 래치 투명</text>

          {/* 글리치 강조 (애니메이션) */}
          <rect className="lp-glitch-flash" x="195" y="12" width="28" height="200" fill={err} opacity="0" />

          {/* 트랙 라벨 + 보조선 */}
          {[
            { label: 'CLK', y: 35 },
            { label: 'D', y: 85 },
            { label: 'Q(latch)', y: 135 },
            { label: 'Q(FF)', y: 185 },
          ].map((t, i) => (
            <g key={i}>
              <text x="4" y={t.y + 5} fontSize="9" fontWeight="700" fill={wire} fontFamily="monospace">{t.label}</text>
              <line x1="70" y1={t.y + 5} x2="560" y2={t.y + 5} stroke="#CBD5E0" strokeWidth="0.4" strokeDasharray="2,3" />
            </g>
          ))}

          {/* CLK 파형 */}
          <polyline points="70,50 150,50 150,20 230,20 230,50 310,50 310,20 390,20 390,50 560,50"
            fill="none" stroke={wire} strokeWidth="1.8" strokeLinejoin="miter" />
          {/* rising edge 표시 */}
          <circle cx="150" cy="35" r="3" fill={ok} opacity="0.9" />
          <circle cx="310" cy="35" r="3" fill={ok} opacity="0.9" />

          {/* D 파형 (글리치 포함) */}
          <polyline points="70,100 170,100 170,70 195,70 195,100 222,100 222,70 560,70"
            fill="none" stroke={wire} strokeWidth="1.8" strokeLinejoin="miter" />

          {/* Q(latch) 파형 — D를 따라감 (글리치 전파) */}
          <polyline points="70,150 170,150 170,120 195,120 195,150 222,150 222,120 560,120"
            fill="none" stroke={warn} strokeWidth="2" strokeLinejoin="miter" />

          {/* Q(FF) 파형 — CLK edge 에만 샘플 */}
          <polyline points="70,200 310,200 310,170 560,170"
            fill="none" stroke={ok} strokeWidth="2" strokeLinejoin="miter" />
          {/* FF 샘플링 포인트 */}
          <circle cx="150" cy="200" r="3" fill={ok} />
          <circle cx="310" cy="170" r="3" fill={ok} />

          {/* 글리치 주석 */}
          <line x1="208" y1="168" x2="208" y2="148" stroke={err} strokeWidth="1.2" markerEnd="url(#lpArrErr)" />
          <rect x="175" y="168" width="75" height="15" fill={err} opacity="0.08" rx="2" />
          <text x="212" y="179" fontSize="9" fontWeight="800" textAnchor="middle" fill={err} fontFamily="monospace">글리치 전파!</text>

          {/* FF clean 주석 */}
          <line x1="340" y1="218" x2="315" y2="175" stroke={ok} strokeWidth="1.2" markerEnd="url(#lpArrOk)" />
          <text x="380" y="225" fontSize="9" fontWeight="700" fill={ok} fontFamily="monospace">FF: edge 에서만 깨끗한 샘플</text>

          {/* 시간축 */}
          <line x1="70" y1="215" x2="560" y2="215" stroke="#A0AEC0" strokeWidth="0.5" />
          <text x="560" y="225" fontSize="8" textAnchor="end" fill="#718096" fontFamily="monospace">time →</text>

          {/* 스캔라인 (애니메이션) */}
          <line className="lp-scanline" x1="70" y1="12" x2="70" y2="212" stroke={err} strokeWidth="1.2" opacity="0" />
        </svg>

        {/* 파형 범례 */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.6rem', color: '#718096', justifyContent: 'center' }}>
          <span><span style={{ display: 'inline-block', width: '14px', height: '2px', background: warn, verticalAlign: 'middle', marginRight: '4px' }} />Q(latch): CLK=1 동안 D 투명 전달 · CLK=0 시 값 유지</span>
          <span><span style={{ display: 'inline-block', width: '14px', height: '2px', background: ok, verticalAlign: 'middle', marginRight: '4px' }} />Q(FF): CLK 상승 에지에만 샘플 → 글리치 완전 차단</span>
        </div>
      </div>

      {/* Bottom takeaway */}
      <div style={{
        background: `linear-gradient(135deg, ${ok}10, ${ok}18)`,
        border: `1.5px solid ${ok}40`,
        borderRadius: '7px',
        padding: '0.5rem 0.75rem',
        fontSize: '0.66rem',
        color: text,
        lineHeight: 1.55,
      }}>
        <strong style={{ color: ok }}>✅ 해결:</strong> 조합 논리 always 블록에서 <strong>if에는 반드시 else</strong>, <strong>case에는 반드시 default</strong> 를 작성 — 또는 always 블록 첫 줄에 출력 신호의 <strong>기본값</strong>을 먼저 blocking 할당. 이것만 지켜도 래치 추론은 100% 제거되며, 모든 입력 조합에서 출력이 결정적(deterministic)으로 정의됨.
      </div>
    </div>
  );
}

function ComboLoopDiagram() {
  const err = '#E53E3E';
  const ok = '#48BB78';
  const wire = '#4A5568';
  const bg = '#F7FAFC';

  return (
    <div style={{ display: 'flex', gap: '0.45rem', flexShrink: 0 }}>
      {/* BEFORE */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #FFF5F5, #FFFAFA)',
        border: `1.5px solid ${err}40`,
        borderRadius: '8px',
        padding: '0.38rem 0.5rem 0.2rem',
        boxShadow: '0 2px 6px rgba(229,62,62,0.08)',
      }}>
        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: err, marginBottom: '1px', letterSpacing: '0.03em' }}>
          ❌ BEFORE — 조합 피드백 루프
        </div>
        {/*
          좌표 기준 (IEC 박스 스타일)
          AND rect: x=200..240, y=24..60  → pins: top(200,34), bot(200,50), out(240,42)
          OR  rect: x=52..92,  y=84..120 → pins: top(52,94),  bot(52,110), out(92,102)
        */}
        <svg viewBox="-60 0 400 140" style={{ width: '100%', height: '115px', display: 'block' }} preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="sh_before" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor={err} floodOpacity="0.22" />
            </filter>
          </defs>

          {/* 입력 선 (텍스트 바로 뒤에서 시작; 피드백 수직선과 교차는 색상으로 구분) */}
          <line x1="-16" y1="34" x2="200" y2="34" stroke={wire} strokeWidth="1.5" />
          <line x1="-16" y1="110" x2="52" y2="110" stroke={wire} strokeWidth="1.5" />

          {/* a 피드백 wire (AND out → 위쪽 → 왼쪽 → OR top in) — 입력선 위에 덮음 */}
          <polyline points="240,42 270,42 270,14 16,14 16,94 52,94"
            fill="none" stroke={err} strokeWidth="1.8" strokeLinejoin="round" />
          <text x="140" y="11" fontSize="9" fontWeight="700" fill={err} fontFamily="monospace">a</text>

          {/* b 피드백 wire (OR out → AND bot in) */}
          <polyline points="92,102 158,102 158,50 200,50"
            fill="none" stroke={err} strokeWidth="1.8" strokeLinejoin="round" />
          <text x="163" y="78" fontSize="9" fontWeight="700" fill={err} fontFamily="monospace">b</text>

          {/* AND 게이트 (IEC: 박스 + '&') */}
          <rect x="200" y="24" width="40" height="36" rx="2"
            fill={bg} stroke={err} strokeWidth="2" filter="url(#sh_before)" />
          <text x="220" y="47" fontSize="14" fontWeight="800" textAnchor="middle" fill={err}>&amp;</text>

          {/* OR 게이트 (IEC: 박스 + '|') */}
          <rect x="52" y="84" width="40" height="36" rx="2"
            fill={bg} stroke={err} strokeWidth="2" filter="url(#sh_before)" />
          <text x="72" y="107" fontSize="14" fontWeight="800" textAnchor="middle" fill={err}>|</text>

          {/* 출력 핀 접점 도트 */}
          <circle cx="240" cy="42" r="2.5" fill={err} />
          <circle cx="92" cy="102" r="2.5" fill={err} />

          {/* 입력 라벨 (최상위 렌더링) */}
          <text x="-58" y="37" fontSize="9" fill={wire} fontFamily="monospace">input_x</text>
          <text x="-58" y="113" fontSize="9" fill={wire} fontFamily="monospace">input_y</text>
        </svg>
        <div style={{ fontSize: '0.57rem', fontWeight: 700, color: err, textAlign: 'center', marginTop: '-2px' }}>
          ⚠ a → OR → b → AND → a 순환 · 클록 없이 값이 계속 바뀜 (발진)
        </div>
      </div>

      {/* AFTER */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #F0FFF4, #F7FFFA)',
        border: `1.5px solid ${ok}40`,
        borderRadius: '8px',
        padding: '0.38rem 0.5rem 0.2rem',
        boxShadow: '0 2px 6px rgba(72,187,120,0.08)',
      }}>
        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: ok, marginBottom: '1px', letterSpacing: '0.03em' }}>
          ✅ AFTER — FF 삽입으로 루프 차단
        </div>
        {/*
          AND rect: x=232..272, y=24..60 → pins: top(232,34), bot(232,50), out(272,42)
          OR  rect: x=52..92,   y=84..120 → pins: top(52,94), bot(52,110), out(92,102)
          FF  rect: x=134..194, y=84..120 → pins: D(134,102), Q(194,102), clk(164,120 bottom)
        */}
        <svg viewBox="-60 0 400 140" style={{ width: '100%', height: '115px', display: 'block' }} preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="sh_after" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor={ok} floodOpacity="0.22" />
            </filter>
          </defs>

          {/* 입력 선 (텍스트 바로 뒤에서 시작) */}
          <line x1="-16" y1="34" x2="232" y2="34" stroke={wire} strokeWidth="1.5" />
          <line x1="-16" y1="110" x2="52" y2="110" stroke={wire} strokeWidth="1.5" />

          {/* a 피드백 (점선: 조합 경로. FF 덕분에 루프는 아님) */}
          <polyline points="290,42 290,14 16,14 16,94 52,94"
            fill="none" stroke={ok} strokeWidth="1.3" strokeDasharray="3,2" strokeLinejoin="round" />
          <text x="140" y="11" fontSize="9" fontWeight="700" fill={ok} fontFamily="monospace">a (조합)</text>

          {/* b_reg (FF Q → AND bot in) */}
          <polyline points="194,102 212,102 212,50 232,50"
            fill="none" stroke={ok} strokeWidth="1.8" strokeLinejoin="round" />
          <text x="216" y="78" fontSize="8.5" fontWeight="700" fill={ok} fontFamily="monospace">b_reg</text>

          {/* OR out → FF D */}
          <line x1="92" y1="102" x2="134" y2="102" stroke={ok} strokeWidth="1.8" />

          {/* AND out → 외부 'a' */}
          <line x1="272" y1="42" x2="314" y2="42" stroke={wire} strokeWidth="1.5" />

          {/* 게이트 */}
          <rect x="232" y="24" width="40" height="36" rx="2"
            fill={bg} stroke={ok} strokeWidth="2" filter="url(#sh_after)" />
          <text x="252" y="47" fontSize="14" fontWeight="800" textAnchor="middle" fill={ok}>&amp;</text>

          <rect x="52" y="84" width="40" height="36" rx="2"
            fill={bg} stroke={ok} strokeWidth="2" filter="url(#sh_after)" />
          <text x="72" y="107" fontSize="14" fontWeight="800" textAnchor="middle" fill={ok}>|</text>

          {/* FF 블록 */}
          <rect x="134" y="84" width="60" height="36" rx="3"
            fill={bg} stroke={ok} strokeWidth="2" filter="url(#sh_after)" />
          <text x="138" y="94" fontSize="8" fontWeight="700" fill={ok}>D</text>
          <text x="190" y="94" fontSize="8" fontWeight="700" fill={ok} textAnchor="end">Q</text>
          <text x="164" y="106" fontSize="9" fontWeight="800" textAnchor="middle" fill={ok}>FF</text>
          {/* clk edge 삼각형 (FF 내부 하단) */}
          <polyline points="158,118 164,113 170,118" fill="none" stroke={ok} strokeWidth="1.3" strokeLinejoin="round" />

          {/* 외부 clk 입력 */}
          <line x1="164" y1="132" x2="164" y2="120" stroke={wire} strokeWidth="1.3" />
          <text x="172" y="134" fontSize="8" fill={wire} fontFamily="monospace">clk</text>

          {/* 접점 도트 */}
          <circle cx="272" cy="42" r="2.5" fill={ok} />
          <circle cx="290" cy="42" r="2.5" fill={wire} />
          <circle cx="92" cy="102" r="2.5" fill={ok} />

          {/* 외부 a 라벨 */}
          <text x="296" y="37" fontSize="9" fontWeight="700" fill={wire} fontFamily="monospace">a</text>

          {/* 입력 라벨 (최상위 렌더링) */}
          <text x="-58" y="37" fontSize="9" fill={wire} fontFamily="monospace">input_x</text>
          <text x="-58" y="113" fontSize="9" fill={wire} fontFamily="monospace">input_y</text>
        </svg>
        <div style={{ fontSize: '0.57rem', fontWeight: 700, color: ok, textAlign: 'center', marginTop: '-2px' }}>
          ✓ FF가 OR→AND 경로에 클록 경계 삽입 · 조합 루프 제거
        </div>
      </div>
    </div>
  );
}

function SensitivityListDiagram() {
  const [tab, setTab] = useState<'circuit' | 'wave'>('circuit');
  const err = '#E53E3E';
  const ok = '#48BB78';
  const warn = '#E8913A';
  const wire = '#4A5568';
  const text = '#2D3748';
  const muted = '#718096';
  const bg = '#F7FAFC';

  const tabs: { key: 'circuit' | 'wave'; label: string }[] = [
    { key: 'circuit', label: '🔌 회로 비교 — 의도 vs 시뮬 해석' },
    { key: 'wave',    label: '⏱ 타이밍 파형 — Sim-Synth 불일치' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
      <style>{`
        @keyframes slPulse { 0%,100% { opacity: 0.28 } 50% { opacity: 0.55 } }
        @keyframes slBlink { 0%,45%,100% { opacity: 0.22 } 60%,85% { opacity: 1 } }
        .sl-mismatch  { animation: slPulse 1.8s ease-in-out infinite; transform-origin: center; }
        .sl-xmark     { animation: slBlink 2.2s ease-in-out infinite; }
      `}</style>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #E2E8F0', marginBottom: '0.1rem' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.4rem 1rem',
              border: 'none',
              background: tab === t.key ? `linear-gradient(180deg, ${warn}08, ${warn}20)` : 'transparent',
              color: tab === t.key ? warn : muted,
              fontSize: '0.74rem',
              fontWeight: tab === t.key ? 800 : 600,
              cursor: 'pointer',
              borderBottom: tab === t.key ? `2.5px solid ${warn}` : '2.5px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.15s ease',
              borderRadius: '6px 6px 0 0',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Circuit comparison */}
      {tab === 'circuit' && (
        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'stretch' }}>
          {/* LEFT: Intended / Synthesized */}
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg, #F0FFF4, #F7FFFA)',
            border: `1.5px solid ${ok}40`,
            borderRadius: '8px',
            padding: '0.5rem 0.7rem 0.35rem',
            boxShadow: `0 2px 6px ${ok}10`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.63rem', fontWeight: 800, color: ok, marginBottom: '2px', letterSpacing: '0.02em' }}>
              ✅ 의도 / 합성 결과 — 순수 조합 논리
            </div>
            <div style={{ fontSize: '0.55rem', color: muted, marginBottom: '3px', fontFamily: 'monospace' }}>
              always @(*)  또는  always_comb  out = a &amp; b &amp; c;
            </div>
            <svg viewBox="0 0 340 170" style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <filter id="sl_shadow_ok" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor={ok} floodOpacity="0.28" />
                </filter>
              </defs>

              {/* Input labels + wires */}
              <text x="14" y="68" fontSize="11" fontWeight="800" fill={text} fontFamily="monospace">a</text>
              <line x1="32" y1="65" x2="160" y2="65" stroke={wire} strokeWidth="1.5" />
              <text x="14" y="93" fontSize="11" fontWeight="800" fill={text} fontFamily="monospace">b</text>
              <line x1="32" y1="90" x2="160" y2="90" stroke={wire} strokeWidth="1.5" />
              <text x="14" y="118" fontSize="11" fontWeight="800" fill={text} fontFamily="monospace">c</text>
              <line x1="32" y1="115" x2="160" y2="115" stroke={wire} strokeWidth="1.5" />

              {/* AND3 gate */}
              <rect x="160" y="50" width="55" height="80" rx="3"
                fill={bg} stroke={ok} strokeWidth="2" filter="url(#sl_shadow_ok)" />
              <text x="187.5" y="96" fontSize="17" fontWeight="800" textAnchor="middle" fill={ok} fontFamily="monospace">&amp;</text>
              <text x="187.5" y="45" fontSize="8.5" fontWeight="800" textAnchor="middle" fill={ok} fontFamily="monospace">AND3</text>

              {/* Input pin dots */}
              <circle cx="160" cy="65"  r="2.2" fill={ok} />
              <circle cx="160" cy="90"  r="2.2" fill={ok} />
              <circle cx="160" cy="115" r="2.2" fill={ok} />

              {/* Output wire */}
              <line x1="215" y1="90" x2="305" y2="90" stroke={wire} strokeWidth="1.5" />
              <circle cx="215" cy="90" r="2.2" fill={ok} />
              <text x="310" y="94" fontSize="11" fontWeight="800" fill={ok} fontFamily="monospace">out</text>

              {/* Caption */}
              <text x="170" y="155" fontSize="9" fontWeight="700" fill={text} fontFamily="monospace" textAnchor="middle">
                out  =  a · b · c   (연속 평가)
              </text>
            </svg>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: ok, textAlign: 'center', marginTop: '3px' }}>
              ✓ a · b · c 어느 쪽이든 변하면 즉시 out 재계산 — Sim ≡ Synth
            </div>
          </div>

          {/* RIGHT: Simulator view with hidden latch */}
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg, #FFF5F5, #FFFAFA)',
            border: `1.5px solid ${err}40`,
            borderRadius: '8px',
            padding: '0.5rem 0.7rem 0.35rem',
            boxShadow: `0 2px 6px ${err}10`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.63rem', fontWeight: 800, color: err, marginBottom: '2px', letterSpacing: '0.02em' }}>
              ❌ RTL 시뮬레이터 해석 — 숨겨진 래치
            </div>
            <div style={{ fontSize: '0.55rem', color: muted, marginBottom: '3px', fontFamily: 'monospace' }}>
              always @(a or b)  out = a &amp; b &amp; c;   ← c 누락
            </div>
            <svg viewBox="0 0 440 210" style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <filter id="sl_shadow_err" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor={err} floodOpacity="0.24" />
                </filter>
                <marker id="sl_arr_en" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                  <polygon points="0,0 5,2.5 0,5" fill={warn} />
                </marker>
              </defs>

              {/* Input labels + wires */}
              <text x="14" y="68"  fontSize="11" fontWeight="800" fill={text} fontFamily="monospace">a</text>
              <line x1="32" y1="65"  x2="170" y2="65"  stroke={wire} strokeWidth="1.5" />
              <text x="14" y="93"  fontSize="11" fontWeight="800" fill={text} fontFamily="monospace">b</text>
              <line x1="32" y1="90"  x2="170" y2="90"  stroke={wire} strokeWidth="1.5" />
              <text x="14" y="118" fontSize="11" fontWeight="800" fill={text} fontFamily="monospace">c</text>
              <line x1="32" y1="115" x2="170" y2="115" stroke={wire} strokeWidth="1.5" />

              {/* AND3 gate */}
              <rect x="170" y="50" width="55" height="80" rx="3"
                fill={bg} stroke={err} strokeWidth="2" filter="url(#sl_shadow_err)" />
              <text x="197.5" y="96" fontSize="17" fontWeight="800" textAnchor="middle" fill={err} fontFamily="monospace">&amp;</text>
              <text x="197.5" y="45" fontSize="8.5" fontWeight="800" textAnchor="middle" fill={err} fontFamily="monospace">AND3</text>

              {/* Input pin dots */}
              <circle cx="170" cy="65"  r="2.2" fill={err} />
              <circle cx="170" cy="90"  r="2.2" fill={err} />
              <circle cx="170" cy="115" r="2.2" fill={err} />

              {/* Wire: AND out → Latch D */}
              <line x1="225" y1="90" x2="275" y2="90" stroke={wire} strokeWidth="1.5" />

              {/* LATCH block */}
              <rect x="275" y="70" width="65" height="45" rx="3"
                fill={bg} stroke={err} strokeWidth="2" filter="url(#sl_shadow_err)" />
              <text x="280" y="82" fontSize="8" fontWeight="800" fill={err} fontFamily="monospace">D</text>
              <text x="335" y="82" fontSize="8" fontWeight="800" fill={err} fontFamily="monospace" textAnchor="end">Q</text>
              <text x="307.5" y="98" fontSize="9" fontWeight="800" textAnchor="middle" fill={err} fontFamily="monospace">LATCH</text>
              <text x="307.5" y="110" fontSize="7" fontWeight="700" textAnchor="middle" fill={err} fontFamily="monospace">EN</text>

              {/* Output wire */}
              <line x1="340" y1="90" x2="410" y2="90" stroke={wire} strokeWidth="1.5" />
              <circle cx="340" cy="90" r="2.2" fill={err} />
              <text x="415" y="94" fontSize="11" fontWeight="800" fill={err} fontFamily="monospace">out</text>

              {/* Taps on a and b */}
              <circle cx="70"  cy="65" r="3" fill={warn} />
              <circle cx="105" cy="90" r="3" fill={warn} />

              {/* Dashed tap lines going down */}
              <line x1="70"  y1="65" x2="70"  y2="165" stroke={warn} strokeWidth="1.3" strokeDasharray="3,2" />
              <line x1="105" y1="90" x2="105" y2="165" stroke={warn} strokeWidth="1.3" strokeDasharray="3,2" />

              {/* Event-detector block */}
              <rect x="50" y="165" width="175" height="26" rx="4"
                fill={`${warn}16`} stroke={warn} strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="137.5" y="183" fontSize="9" fontWeight="800" textAnchor="middle" fill={warn} fontFamily="monospace">
                ⚡ @(a or b) 이벤트 감시
              </text>

              {/* Event-detector output → Latch EN */}
              <polyline points="225,178 307.5,178 307.5,115"
                fill="none" stroke={warn} strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#sl_arr_en)" />

              {/* c tap MISSING — blinking red X at c wire */}
              <g className="sl-xmark">
                <circle cx="140" cy="115" r="9" fill="none" stroke={err} strokeWidth="1.8" strokeDasharray="2,2" />
                <line x1="134" y1="109" x2="146" y2="121" stroke={err} strokeWidth="2.2" />
                <line x1="146" y1="109" x2="134" y2="121" stroke={err} strokeWidth="2.2" />
              </g>
              <text x="152" y="140" fontSize="8.5" fontWeight="800" fill={err} fontFamily="monospace">c 감시 없음!</text>

              {/* Caption */}
              <text x="220" y="205" fontSize="9" fontWeight="700" fill={text} fontFamily="monospace" textAnchor="middle">
                out 은 (a or b) 이벤트 때만 갱신 → c 단독 변화 시 이전값 유지
              </text>
            </svg>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: err, textAlign: 'center', marginTop: '3px' }}>
              ✗ c 는 트리거가 없음 · out 업데이트 누락 (Sim ≠ Synth · 숨겨진 버그)
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Timing waveform */}
      {tab === 'wave' && (
        <div style={{
          background: bg,
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '0.55rem 0.85rem 0.45rem',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: text, marginBottom: '0.2rem' }}>
            🔬 타이밍 파형 — <code style={{ fontFamily: 'monospace', background: '#EDF2F7', padding: '1px 5px', borderRadius: '3px', fontSize: '0.66rem' }}>always @(a or b) out = a &amp; b &amp; c</code>
          </div>
          <svg viewBox="0 0 620 285" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Mismatch region highlights */}
            <rect className="sl-mismatch" x="180" y="15" width="100" height="240" fill={err} opacity="0.1" />
            <rect className="sl-mismatch" x="480" y="15" width="100" height="240" fill={err} opacity="0.1" />

            {/* Event tick markers */}
            {[
              { x: 180, label: 'c↑' },
              { x: 280, label: 'a↓' },
              { x: 380, label: 'a↑' },
              { x: 480, label: 'c↓' },
            ].map((m, i) => (
              <g key={i}>
                <line x1={m.x} y1="15" x2={m.x} y2="255" stroke="#CBD5E0" strokeWidth="0.5" strokeDasharray="2,3" />
                <text x={m.x} y="12" fontSize="8.5" fontWeight="800" textAnchor="middle" fill={wire} fontFamily="monospace">{m.label}</text>
              </g>
            ))}

            {/* Track labels + baselines */}
            {[
              { label: 'a',           y: 40,  color: wire },
              { label: 'b',           y: 80,  color: wire },
              { label: 'c',           y: 120, color: wire },
              { label: 'out (synth)', y: 170, color: ok },
              { label: 'out (sim)',   y: 220, color: err },
            ].map((t, i) => (
              <g key={i}>
                <text x="4" y={t.y + 15} fontSize="9.5" fontWeight="800" fill={t.color} fontFamily="monospace">{t.label}</text>
                <line x1="80" y1={t.y + 22} x2="580" y2={t.y + 22} stroke="#E2E8F0" strokeWidth="0.4" strokeDasharray="2,3" />
              </g>
            ))}

            {/* Signal a: 1 → 0 at 280 → 1 at 380 */}
            <polyline points="80,40 280,40 280,62 380,62 380,40 580,40"
              fill="none" stroke={wire} strokeWidth="1.8" strokeLinejoin="miter" />

            {/* Signal b: constant 1 */}
            <polyline points="80,80 580,80"
              fill="none" stroke={wire} strokeWidth="1.8" strokeLinejoin="miter" />

            {/* Signal c: 0 → 1 at 180 → 0 at 480 */}
            <polyline points="80,142 180,142 180,120 480,120 480,142 580,142"
              fill="none" stroke={wire} strokeWidth="1.8" strokeLinejoin="miter" />

            {/* out_synth = a & b & c */}
            <polyline points="80,192 180,192 180,170 280,170 280,192 380,192 380,170 480,170 480,192 580,192"
              fill="none" stroke={ok} strokeWidth="2.2" strokeLinejoin="miter" />

            {/* out_sim: updates only on a/b events */}
            <polyline points="80,242 380,242 380,220 580,220"
              fill="none" stroke={err} strokeWidth="2.2" strokeLinejoin="miter" />

            {/* Sim-evaluate markers (on a/b events) */}
            <circle cx="280" cy="242" r="3.5" fill={wire} />
            <circle cx="380" cy="220" r="3.5" fill={wire} />
            <text x="286" y="238" fontSize="7"   fontWeight="700" fill={wire} fontFamily="monospace">evaluate</text>
            <text x="386" y="216" fontSize="7"   fontWeight="700" fill={wire} fontFamily="monospace">evaluate</text>

            {/* Mismatch labels */}
            <text x="230" y="265" fontSize="9"   fontWeight="800" textAnchor="middle" fill={err} fontFamily="monospace">❌ 불일치 #1</text>
            <text x="230" y="276" fontSize="7.5" fontWeight="700" textAnchor="middle" fill={err} fontFamily="monospace">c↑ 인데 sim = 0</text>
            <text x="530" y="265" fontSize="9"   fontWeight="800" textAnchor="middle" fill={err} fontFamily="monospace">❌ 불일치 #2</text>
            <text x="530" y="276" fontSize="7.5" fontWeight="700" textAnchor="middle" fill={err} fontFamily="monospace">c↓ 인데 sim = 1</text>

            {/* Time axis */}
            <line x1="80" y1="255" x2="580" y2="255" stroke="#A0AEC0" strokeWidth="0.5" />
            <text x="580" y="252" fontSize="8" textAnchor="end" fill={muted} fontFamily="monospace">time →</text>
          </svg>

          {/* Legend */}
          <div style={{
            display: 'flex', gap: '1.4rem', marginTop: '0.35rem',
            fontSize: '0.62rem', color: text, justifyContent: 'center', flexWrap: 'wrap',
          }}>
            <span><span style={{ display: 'inline-block', width: '16px', height: '2.2px', background: ok,  verticalAlign: 'middle', marginRight: '5px' }} /><strong>out (synth)</strong> — 실제 합성 회로 (항상 a · b · c)</span>
            <span><span style={{ display: 'inline-block', width: '16px', height: '2.2px', background: err, verticalAlign: 'middle', marginRight: '5px' }} /><strong>out (sim)</strong> — 시뮬레이터 (a · b 이벤트 때만 갱신)</span>
          </div>
          <div style={{ fontSize: '0.6rem', color: muted, textAlign: 'center', marginTop: '0.3rem', lineHeight: 1.55 }}>
            ⚠ 빨간 영역: Sim ≠ Synth · Testbench 가 통과해도 실제 FPGA 에는 버그 잠복 — <strong style={{ color: warn }}>always @(*)</strong> 또는 <strong style={{ color: warn }}>always_comb</strong> 로 원천 차단
          </div>
        </div>
      )}
    </div>
  );
}

const rules: RuleData[] = [
  {
    key: 'combo_loop',
    ruleId: 'combo_loop',
    category: 'structural',
    severity: 'E',
    sevColor: '#E53E3E',
    title: '조합 피드백 루프',
    do254: 'SS3_avoid_combinational_feedback',
    starc: '1.2.1.3',
    customizable: false,
    problem: '조합 논리 경로에 피드백 루프(출력이 자신의 입력으로 직접 연결)가 존재하면 발진(oscillation) 또는 불안정 동작이 발생합니다. 시뮬레이션에서는 무한 루프로 시뮬레이터가 멈추거나 예측 불가능한 결과를 냅니다. 관련 체크: combo_loop_with_latch(SS3) — 래치를 포함한 피드백 루프도 함께 검출합니다.',
    solution: '조합 루프를 끊기 위해 레지스터(FF)를 삽입하거나 로직 구조를 재설계합니다. Questa Lint는 위반 경로의 모식도(schematic)를 제공하므로 이를 참고해 루프 위치를 확인합니다.',
    diagram: 'combo_loop',
    code: [
      { text: 'wire a, b;' },
      { text: 'assign a = b & input_x;', highlight: true },
      { text: 'assign b = a | input_y;', highlight: true, annotate: 'E: combo_loop — a↔b 조합 피드백 루프' },
      { text: '' },
      { text: '// Fix: FF 삽입으로 루프 제거' },
      { text: 'reg b_reg;' },
      { text: 'always @(posedge clk) b_reg <= a | input_y;' },
      { text: 'assign a = b_reg & input_x;  // 루프 없음' },
    ],
  },
  {
    key: 'latch_inferred',
    ruleId: 'latch_inferred',
    category: 'structural',
    severity: 'W',
    sevColor: '#E8913A',
    title: '래치 추론 (의도치 않은 상태 유지)',
    do254: 'SS4_avoid_latch_inference',
    starc: '2.4.1.1, 2.2.1.1',
    customizable: true,
    problem: 'if 문에 else가 없거나, case 문에 모든 경우를 커버하지 않으면 출력 신호가 이전 값을 유지하는 래치가 합성됩니다. 래치는 레벨 민감도를 가지며 타이밍 분석이 어렵고 Safety-Critical 설계에서는 금지되는 경우가 많습니다.',
    solution: 'if 문에는 반드시 else 절을 추가. case 문에는 default 절 추가. 또는 always 블록 시작 시 목표 신호에 기본값(default assignment)을 blocking 할당으로 먼저 지정.',
    diagram: 'latch_inferred',
    code: [
      { text: 'always @(*) begin' },
      { text: '  if (in[1])' },
      { text: '    out = 1\'b1;  // in[1]=0 일 때 out 값 미지정', highlight: true },
      { text: '  else if (in[2])' },
      { text: '    out = 1\'b0;', highlight: true, annotate: 'W: latch_inferred — else 없음 → 래치 생성' },
      { text: 'end' },
      { text: '' },
      { text: '// Fix: 기본값 먼저 할당' },
      { text: 'always @(*) begin' },
      { text: '  out = 1\'b0;  // 기본값 지정 → 래치 제거' },
      { text: '  if (in[1])      out = 1\'b1;' },
      { text: '  else if (in[2]) out = 1\'b0;' },
      { text: 'end' },
    ],
    directive: '# always_latch 블록 내 래치도 보고\nlint preference -check latch_inferred\n  -report_latches_in_always_latch_blocks',
  },
  {
    key: 'case_default_missing',
    ruleId: 'case_default_missing',
    category: 'structural',
    severity: 'E',
    sevColor: '#E53E3E',
    title: 'case 문에 default 절 누락',
    do254: 'SS2_ensure_proper_case_statement_specification',
    starc: '2.8.1.4',
    customizable: true,
    problem: 'case 문이 모든 가능한 값을 커버하지 않고 default 절도 없으면 누락된 조건에서 신호가 이전 값을 유지(래치 생성)하거나 X 전파가 발생합니다. 2비트 셀렉터라면 2\'b11 케이스를 빠뜨리는 것이 대표적인 실수입니다. 관련 체크: case_item_duplicate(SS2) — 동일한 값이 여러 branch에 중복 정의, case_with_x_z(SS2) — x/z 리터럴 포함 case 항목도 검출합니다.',
    solution: '모든 case 문에 default 절을 추가합니다. Safety-Critical 설계에서는 default: 절에 의미 있는 값이나 에러 상태 처리를 명시합니다.',
    code: [
      { text: 'always @(*) begin' },
      { text: '  case (sel)      // 2\'b11 케이스 없음!' },
      { text: '    2\'b00: y = a;', highlight: true },
      { text: '    2\'b01: y = b;', highlight: true },
      { text: '    2\'b10: y = c;', highlight: true, annotate: 'E: case_default_missing → 래치 추론' },
      { text: '  endcase' },
      { text: 'end' },
      { text: '' },
      { text: '// Fix: default 추가' },
      { text: '  case (sel)' },
      { text: '    2\'b00: y = a;  2\'b01: y = b;  2\'b10: y = c;' },
      { text: '    default: y = \'0;  // 안전한 기본값' },
      { text: '  endcase' },
    ],
    directive: '# 모든 케이스를 나열해도 default 강제 보고\nlint preference -check case_default_missing\n  -missing_others_or_default',
  },
  {
    key: 'multi_driven_signal',
    ruleId: 'multi_driven_signal',
    category: 'structural',
    severity: 'E',
    sevColor: '#E53E3E',
    title: '신호 중복 구동 (Multiple Drivers)',
    do254: 'SS6_avoid_multiple_drivers',
    customizable: false,
    problem: '동일한 신호(net)를 여러 드라이버가 동시에 구동하면 합성 후 결과가 불확정입니다. 시뮬레이션에서는 X 값이 전파되며, FPGA에서는 라우팅 에러 또는 의도치 않은 논리 결합이 발생합니다.',
    solution: '하나의 신호는 반드시 하나의 드라이버(하나의 always 블록 또는 하나의 assign 문)만 가지도록 로직을 재구성. 버스 구조에서 3-state가 필요한 경우 FPGA 전용 3-state primitive를 사용.',
    code: [
      { text: 'wire out;' },
      { text: 'assign out = a & b;', highlight: true, annotate: 'E: multi_driven_signal — out을 두 곳에서 구동' },
      { text: 'assign out = c | d;', highlight: true },
      { text: '' },
      { text: 'always @(posedge clk)' },
      { text: '  out_reg <= in_data;', highlight: true, annotate: 'E: out_reg도 별도 assign에서 구동하면 위반' },
      { text: '' },
      { text: '// Fix: 단일 드라이버로 통합' },
      { text: 'assign out = sel ? (a & b) : (c | d);  // 조건부 선택' },
    ],
  },
  {
    key: 'assign_width_overflow',
    ruleId: 'assign_width_overflow',
    category: 'structural',
    severity: 'E',
    sevColor: '#E53E3E',
    title: '비트 폭 오버플로우 (Width Mismatch)',
    do254: 'CP7_avoid_mismatching_ranges',
    starc: '2.10.3.3, 2.10.6.1',
    customizable: false,
    problem: '할당 우변(RHS)의 비트 수가 좌변(LHS)보다 많으면 상위 비트가 묵시적으로 잘립니다(truncation). Safety-Critical 연산에서 데이터 손실이 발생하며, 의도하지 않은 값이 레지스터에 저장됩니다. 관련 체크: assign_width_underflow(CP7) — RHS < LHS (제로 확장), comparison_width_mismatch(CP7) — 비교 연산자 양쪽 비트 폭 불일치, expr_operands_width_mismatch(CP7) — 산술/논리 연산 피연산자 폭 불일치도 함께 검출합니다.',
    solution: '명시적인 비트 선택([n-1:0])이나 캐스팅을 사용해 의도를 표현. 오버플로우가 예상되는 산술 연산은 결과 폭을 충분하게 확보(예: 8비트 + 8비트 → 9비트 결과).',
    diagram: 'assign_width_overflow',
    code: [
      { text: 'wire [7:0] result;' },
      { text: 'wire [8:0] sum;' },
      { text: 'assign sum    = a + b;  // 9비트 합산' },
      { text: 'assign result = sum;    // 9→8비트: 상위 1비트 손실!', highlight: true, annotate: 'E: assign_width_overflow — RHS > LHS 비트 수' },
      { text: '' },
      { text: '// Fix 1: 결과 폭 확장' },
      { text: 'wire [8:0] result9;' },
      { text: 'assign result9 = sum;   // 폭 일치' },
      { text: '// Fix 2: 명시적 선택 (하위 8비트만 사용함을 표시)' },
      { text: 'assign result = sum[7:0];  // 의도 명확화' },
    ],
  },
  {
    key: 'sensitivity_list',
    ruleId: 'sensitivity_list_var_missing',
    category: 'structural',
    severity: 'W',
    sevColor: '#E8913A',
    title: '민감도 리스트 변수 누락',
    do254: 'CP8_ensure_complete_sensitivity_list',
    starc: '2.3.1.1, 2.3.1.2',
    customizable: false,
    problem: '조합 논리 always 블록의 민감도 리스트(@(...))에 블록 내에서 참조하는 모든 신호가 포함되지 않으면, 시뮬레이션과 합성 결과가 달라집니다. 합성은 모든 입력을 추론하지만 시뮬레이션은 민감도 리스트에 없는 신호의 변화를 무시합니다. 이는 RTL 시뮬레이션에서 숨겨진 버그를 만드는 대표적 원인입니다.',
    solution: '조합 논리 always 블록에는 always @(*)를 사용하거나, SystemVerilog에서는 always_comb를 사용합니다. 명시적으로 나열할 경우 블록에서 읽는 모든 신호를 빠짐없이 포함하고, 신호 추가·제거 시 민감도 리스트도 반드시 동기화합니다.',
    diagram: 'sensitivity_list',
    code: [
      { text: 'always @(a or b) begin  // c가 민감도 리스트에 없음!' },
      { text: '  out = a & b & c;', highlight: true, annotate: 'W: sensitivity_list_var_missing — c 누락' },
      { text: 'end' },
      { text: '' },
      { text: '// c 변화 시: 시뮬레이션 = 갱신 안 됨' },
      { text: '//            합성     = c 포함 논리 생성' },
      { text: '// → 시뮬-합성 불일치 (Silent Bug!)' },
      { text: '' },
      { text: '// Fix 1: @(*) 사용 (Verilog 권장)' },
      { text: 'always @(*) begin' },
      { text: '  out = a & b & c;  // 모든 입력 자동 포함' },
      { text: 'end' },
      { text: '// Fix 2: always_comb (SystemVerilog 권장)' },
      { text: 'always_comb out = a & b & c;' },
    ],
  },
  {
    key: 'undriven_logic',
    ruleId: 'undriven_signal / undriven_reg_data',
    category: 'structural',
    severity: 'E',
    sevColor: '#E53E3E',
    title: '미구동 신호 · 미연결 포트 (SS17)',
    do254: 'SS17_no_undriven_signals',
    starc: '1.3.6.1',
    customizable: false,
    problem: '구동되지 않는 신호(undriven_signal: wire가 선언되었으나 어디서도 구동 안 됨), 데이터 입력이 없는 레지스터(undriven_reg_data: 클록·리셋만 연결), 연결되지 않은 인스턴스 포트(unconnected_inst)는 시뮬레이션에서 X 전파를 유발하고 합성에서 예기치 않은 최적화 결과를 만듭니다. Safety-Critical 설계에서 X 전파는 기능 오류의 핵심 원인입니다.',
    solution: '사용하지 않는 신호는 삭제하거나 의도적으로 구동 값을 할당합니다. 모듈 인스턴스의 모든 포트를 명시적으로 연결하고, 미사용 출력 포트는 .port_name() 형태로 명시적 개방 표기합니다.',
    code: [
      { text: 'wire unused_sig;              // 어디서도 구동 안 됨', highlight: true, annotate: 'E: undriven_signal' },
      { text: '' },
      { text: 'reg  data_reg;' },
      { text: 'always @(posedge clk or negedge rst_n)' },
      { text: '  if (!rst_n) data_reg <= 0;  // 데이터 경로 없음!', highlight: true, annotate: 'E: undriven_reg_data' },
      { text: '' },
      { text: 'my_mod u1 (.clk(clk),        // .data_in 포트 미연결!', highlight: true, annotate: 'E: unconnected_inst' },
      { text: '           .out(out_sig));' },
      { text: '' },
      { text: '// Fix: 미사용 포트 명시 개방' },
      { text: 'my_mod u1 (.clk(clk), .data_in(), .out(out_sig));' },
    ],
  },
  {
    key: 'fsm_without_reset_state',
    ruleId: 'fsm_without_reset_state',
    category: 'fsm',
    severity: 'E',
    sevColor: '#E53E3E',
    title: 'FSM에 리셋 상태 없음',
    do254: 'CP6_ensure_safe_fsm_transitions',
    customizable: false,
    problem: 'FSM이 리셋 시 돌아가는 초기 상태가 없으면 파워업 또는 리셋 해제 후 FSM이 불확정 상태에서 시작됩니다. 이는 Safety-Critical 시스템에서 심각한 기능 이상을 유발합니다.',
    solution: 'async 또는 sync 리셋 조건에서 FSM이 명확한 초기 상태(IDLE, RESET 등)로 복귀하도록 코드 작성. 리셋 상태는 시스템이 안전하게 동작을 시작할 수 있는 상태여야 합니다.',
    code: [
      { text: 'always @(posedge clk) begin  // 리셋 없음!' },
      { text: '  case (state)', highlight: true, annotate: 'E: fsm_without_reset_state — 리셋 경로 미정의' },
      { text: '    ST_IDLE: if (start) state <= ST_RUN;' },
      { text: '    ST_RUN:  if (done)  state <= ST_IDLE;' },
      { text: '  endcase' },
      { text: 'end' },
      { text: '' },
      { text: '// Fix: 리셋 상태 명시' },
      { text: 'always @(posedge clk or negedge rst_n) begin' },
      { text: '  if (!rst_n) state <= ST_IDLE;  // 리셋 → 초기 상태' },
      { text: '  else case (state) ...' },
      { text: 'end' },
    ],
  },
  {
    key: 'fsm_with_deadend_state',
    ruleId: 'fsm_with_deadend_state',
    category: 'fsm',
    severity: 'E',
    sevColor: '#E53E3E',
    title: 'FSM Dead-end 상태 (탈출 불가)',
    do254: 'CP6_ensure_safe_fsm_transitions',
    customizable: false,
    problem: '나가는 전이(outgoing transition)가 없는 상태는 FSM이 해당 상태에 진입하면 영원히 그 상태에 갇힙니다. 전체 시스템이 멈추는 결과를 초래합니다.',
    solution: '모든 FSM 상태에 조건부 또는 무조건 탈출 전이를 정의. 에러 복구 상태(ERROR → IDLE)와 같이 안전한 상태로 반드시 전이할 수 있도록 설계합니다.',
    code: [
      { text: 'parameter ST0=0, ST1=1, ST2=2, ST3=3, ST4=4;' },
      { text: 'always @(posedge clk) begin' },
      { text: '  case (state)' },
      { text: '    ST0: state <= a ? ST1 : ST2;' },
      { text: '    ST1: state <= ST3;' },
      { text: '    ST2: state <= ST3;' },
      { text: '    ST3: state <= b ? ST0 : ST4;' },
      { text: '    ST4: ;  // 탈출 전이 없음! Dead-end', highlight: true, annotate: 'E: fsm_with_deadend_state — ST4는 탈출 불가' },
      { text: '  endcase' },
      { text: 'end' },
      { text: '' },
      { text: '// Fix: ST4 → ST0 (또는 에러 처리 후 복귀)' },
      { text: '    ST4: state <= ST0;  // 안전한 복귀 전이 추가' },
    ],
  },
  {
    key: 'fsm_with_unreachable_state',
    ruleId: 'fsm_with_unreachable_state',
    category: 'fsm',
    severity: 'E',
    sevColor: '#E53E3E',
    title: 'FSM Unreachable 상태 (도달 불가)',
    do254: 'CP6_ensure_safe_fsm_transitions',
    customizable: false,
    problem: '어떤 전이 경로로도 도달할 수 없는 상태가 존재하면 해당 상태의 로직이 실질적으로 dead code입니다. 설계 의도와 구현 차이를 나타내며 ECC/TMR 같은 안전 메커니즘이 예상치 못한 상태를 유발할 수 있습니다.',
    solution: '불필요한 상태는 제거하거나, 설계 의도에 맞게 전이 경로를 추가. 코드 리뷰를 통해 해당 상태가 설계 스펙에 존재하는지 확인합니다.',
    code: [
      { text: 'parameter IDLE=0, RUN=1, DONE=2, ERROR=3;' },
      { text: 'always @(posedge clk or negedge rst_n) begin' },
      { text: '  if (!rst_n) state <= IDLE;' },
      { text: '  else case (state)' },
      { text: '    IDLE:  state <= start ? RUN : IDLE;' },
      { text: '    RUN:   state <= done  ? DONE : RUN;' },
      { text: '    DONE:  state <= IDLE;' },
      { text: '    ERROR: state <= IDLE;  // 도달 방법 없음!', highlight: true, annotate: 'E: fsm_with_unreachable_state — ERROR로 전이되는 경로 없음' },
      { text: '  endcase' },
      { text: 'end' },
      { text: '// Fix: RUN에서 ERROR로의 전이 추가' },
      { text: '    RUN: state <= err ? ERROR : (done ? DONE : RUN);' },
    ],
  },
  {
    key: 'fsm_without_default_state',
    ruleId: 'fsm_without_default_state',
    category: 'fsm',
    severity: 'W',
    sevColor: '#E8913A',
    title: 'FSM case에 default 절 없음',
    do254: 'CP6_ensure_safe_fsm_transitions',
    customizable: false,
    problem: 'FSM state case 문에 default 절이 없으면 정의되지 않은 인코딩 값(SEU, 방사선 등으로 인한 bit flip)이 발생했을 때 FSM 동작이 불확정합니다. 내방사선(radiation-hardened) 또는 고신뢰성 설계에서 특히 중요합니다.',
    solution: 'FSM state case 문에 항상 default 절을 추가하고, 그 안에서 FSM을 안전한 초기 상태(IDLE 또는 ERROR 처리 상태)로 복귀시키는 전이를 정의합니다.',
    code: [
      { text: 'always @(posedge clk) begin' },
      { text: '  case (state)       // default 없음!', highlight: true },
      { text: '    2\'b00: state <= 2\'b01;' },
      { text: '    2\'b01: state <= 2\'b10;' },
      { text: '    2\'b10: state <= 2\'b00;' },
      { text: '    // 2\'b11은? (SEU 등으로 도달 가능)', highlight: true, annotate: 'W: fsm_without_default_state — 미정의 인코딩 처리 없음' },
      { text: '  endcase' },
      { text: 'end' },
      { text: '// Fix: default 추가' },
      { text: '    default: state <= 2\'b00;  // 안전 상태로 복귀' },
    ],
  },
];

const categories = [
  { key: 'structural' as const, label: 'Structural', color: '#8B6FA5' },
  { key: 'fsm' as const, label: 'FSM Safety', color: '#E53E3E' },
];

export default function StructuralFsmRulesSlide() {
  const [activeCat, setActiveCat] = useState<'structural' | 'fsm'>('structural');
  const [activeRule, setActiveRule] = useState<RuleKey>('combo_loop');
  const [showDiagram, setShowDiagram] = useState<RuleKey | null>(null);

  const catRules = rules.filter((r) => r.category === activeCat);
  const currentRule = rules.find((r) => r.key === activeRule) ?? rules[0];
  const catColor = categories.find((c) => c.key === activeCat)?.color ?? FPGA.primary;

  const handleCatSwitch = (cat: 'structural' | 'fsm') => {
    setActiveCat(cat);
    const firstRule = rules.find((r) => r.category === cat);
    if (firstRule) setActiveRule(firstRule.key);
  };

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Rule Explorer · 2/2"
          title="Structural · FSM Safety 핵심 룰"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {/* 카테고리 탭 */}
          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCatSwitch(cat.key)}
                style={{
                  padding: '0.32rem 1.1rem',
                  borderRadius: '7px',
                  border: activeCat === cat.key ? `2px solid ${cat.color}` : `1px solid ${FPGA.border}`,
                  background: activeCat === cat.key
                    ? `linear-gradient(135deg, ${cat.color}14, ${cat.color}22)`
                    : FPGA.white,
                  color: activeCat === cat.key ? cat.color : FPGA.textLight,
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: activeCat === cat.key ? shadow.card : 'none',
                }}
              >
                {cat.key === 'structural' ? '🏗' : '🔄'} {cat.label}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ background: '#E53E3E18', color: '#E53E3E', border: '1px solid #E53E3E40', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.6rem' }}>E Error</span>
              <span style={{ background: '#E8913A18', color: '#E8913A', border: '1px solid #E8913A40', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.6rem' }}>W Warning</span>
              <span style={{ background: '#E8913A12', color: '#E8913A', border: '1px solid #E8913A30', padding: '1px 5px', borderRadius: '4px', fontWeight: 700, fontSize: '0.58rem' }}>⚙ 설정가능</span>
            </div>
          </div>

          {/* 룰 목록 + 상세 패널 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '0.6rem', alignItems: 'stretch' }}>
            {/* 룰 목록 */}
            <div style={{ width: '218px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.22rem', overflowY: 'auto' }}>
              {catRules.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setActiveRule(r.key)}
                  style={{
                    textAlign: 'left',
                    padding: '0.38rem 0.65rem',
                    borderRadius: '9px',
                    border: activeRule === r.key ? `2px solid ${catColor}` : `1px solid ${FPGA.border}`,
                    background: activeRule === r.key
                      ? `linear-gradient(135deg, ${catColor}10, ${catColor}18)`
                      : FPGA.white,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: activeRule === r.key ? shadow.card : '0 1px 3px rgba(0,0,0,0.05)',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                    <span style={{
                      width: '18px', height: '18px', borderRadius: '4px',
                      background: `${r.sevColor}18`, border: `1.5px solid ${r.sevColor}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.58rem', fontWeight: 800, color: r.sevColor, flexShrink: 0,
                    }}>{r.severity}</span>
                    {r.customizable && (
                      <span style={{ fontSize: '0.52rem', fontWeight: 700, color: '#E8913A', background: '#E8913A12', border: '1px solid #E8913A30', padding: '1px 3px', borderRadius: '3px' }}>⚙</span>
                    )}
                  </div>
                  <code style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.58rem',
                    color: activeRule === r.key ? catColor : FPGA.text,
                    fontWeight: activeRule === r.key ? 700 : 400,
                    display: 'block',
                    marginBottom: '1px',
                    wordBreak: 'break-all',
                  }}>{r.ruleId}</code>
                  <div style={{ fontSize: '0.6rem', color: FPGA.textLight, lineHeight: 1.25 }}>
                    {r.title}
                  </div>
                </button>
              ))}
            </div>

            {/* 룰 상세 패널 */}
            <div style={{
              flex: 1,
              background: FPGA.white,
              border: `1.5px solid ${catColor}25`,
              borderRadius: '13px',
              padding: '0.75rem 0.9rem',
              boxShadow: shadow.card,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.38rem',
              overflowY: 'auto',
            }}>
              {/* 룰 헤더 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', flexShrink: 0 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px', flexWrap: 'wrap' }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '5px',
                      background: `${currentRule.sevColor}18`, border: `2px solid ${currentRule.sevColor}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 800, color: currentRule.sevColor, flexShrink: 0,
                    }}>{currentRule.severity}</span>
                    <code style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', fontWeight: 700, color: catColor }}>{currentRule.ruleId}</code>
                    {currentRule.customizable && (
                      <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#E8913A', background: '#E8913A12', border: '1px solid #E8913A30', padding: '1px 6px', borderRadius: '4px' }}>⚙ 설정 가능</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: FPGA.dark }}>{currentRule.title}</div>
                    {currentRule.diagram && (
                      <button
                        onClick={() => setShowDiagram(currentRule.key)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '5px',
                          border: `1.5px solid ${catColor}50`,
                          background: `linear-gradient(135deg, ${catColor}10, ${catColor}22)`,
                          color: catColor,
                          fontSize: '0.6rem', fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'; }}
                      >
                        {currentRule.diagram === 'combo_loop' && '🔍 게이트 회로 블록도'}
                        {currentRule.diagram === 'latch_inferred' && '🔬 래치 문제 시각화'}
                        {currentRule.diagram === 'assign_width_overflow' && '📊 비트 손실 시각화'}
                        {currentRule.diagram === 'sensitivity_list' && '🔌 Sim-Synth 불일치 시각화'}
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  {currentRule.do254 && (
                    <div style={{ fontSize: '0.55rem', fontWeight: 700, color: '#8B6FA5', background: '#8B6FA512', border: '1px solid #8B6FA530', padding: '2px 6px', borderRadius: '4px', marginBottom: '3px' }}>
                      DO-254: {currentRule.do254}
                    </div>
                  )}
                  {currentRule.starc && (
                    <div style={{ fontSize: '0.55rem', fontWeight: 600, color: FPGA.textLight, background: '#F0F4F8', border: '1px solid #E2E8F0', padding: '2px 6px', borderRadius: '4px' }}>
                      STARC: {currentRule.starc}
                    </div>
                  )}
                </div>
              </div>

              {/* Problem */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '0.63rem', fontWeight: 700, color: '#E53E3E', marginBottom: '2px', letterSpacing: '0.05em' }}>PROBLEM</div>
                <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5, background: '#FFF5F5', border: '1px solid #E53E3E18', borderRadius: '6px', padding: '0.32rem 0.55rem' }}>
                  {currentRule.problem}
                </div>
              </div>

              {/* Solution */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '0.63rem', fontWeight: 700, color: '#48BB78', marginBottom: '2px', letterSpacing: '0.05em' }}>SOLUTION</div>
                <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5, background: '#F0FFF4', border: '1px solid #48BB7820', borderRadius: '6px', padding: '0.32rem 0.55rem' }}>
                  {currentRule.solution}
                </div>
              </div>

              {/* 코드 예제 + Directive */}
              <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minHeight: 0, alignItems: 'stretch' }}>
                <div style={{
                  flex: 1,
                  background: '#1A2235',
                  borderRadius: '7px',
                  padding: '0.45rem 0.65rem',
                  fontFamily: '"Roboto Mono", "Courier New", monospace',
                  fontSize: '0.58rem',
                  lineHeight: 1.52,
                  overflow: 'auto',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                }}>
                  {currentRule.code.map((line, idx) => (
                    <div key={idx}>
                      <span style={{
                        color: line.highlight ? '#FFD080' : '#A8C0D8',
                        background: line.highlight ? 'rgba(255,208,128,0.07)' : 'transparent',
                        display: 'block',
                        whiteSpace: 'pre',
                      }}>
                        {line.text || '\u00A0'}
                      </span>
                      {line.annotate && (
                        <span style={{ display: 'block', color: currentRule.sevColor, fontSize: '0.52rem', paddingLeft: '1rem', opacity: 0.88, whiteSpace: 'pre' }}>
                          // {line.annotate}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {currentRule.directive && (
                  <div style={{
                    width: '300px', flexShrink: 0,
                    background: 'rgba(232,145,58,0.06)', border: '1px solid rgba(232,145,58,0.30)',
                    borderRadius: '7px', padding: '0.5rem 0.8rem',
                    display: 'flex', flexDirection: 'column', gap: '5px',
                  }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#E8913A', letterSpacing: '0.05em' }}>⚙ CUSTOMIZATION</div>
                    <pre style={{
                      margin: 0, fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.56rem', color: FPGA.text, lineHeight: 1.6,
                      whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                    }}>{currentRule.directive}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 시각화 모달 */}
      {showDiagram && (
        <div
          onClick={() => setShowDiagram(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '2rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: FPGA.white,
              borderRadius: '14px',
              padding: '1.1rem 1.3rem 1rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
              maxWidth: '1050px',
              width: '100%',
              maxHeight: '88vh',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.7rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: catColor, letterSpacing: '0.05em', marginBottom: '3px' }}>
                  {showDiagram === 'combo_loop' && 'GATE-LEVEL SCHEMATIC · combo_loop'}
                  {showDiagram === 'latch_inferred' && 'LATCH SEMANTICS · latch_inferred'}
                  {showDiagram === 'assign_width_overflow' && 'BIT-WIDTH OVERFLOW · assign_width_overflow'}
                  {showDiagram === 'sensitivity_list' && 'SIM-SYNTH MISMATCH · sensitivity_list_var_missing'}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: FPGA.dark }}>
                  {showDiagram === 'combo_loop' && '조합 피드백 루프 — 수정 전 / 후 회로 비교'}
                  {showDiagram === 'latch_inferred' && '래치가 왜 문제인가? — 3 가지 근본 원인 + 타이밍 파형'}
                  {showDiagram === 'assign_width_overflow' && '비트 폭 오버플로우 — 어떻게 발생하고 왜 위험한가?'}
                  {showDiagram === 'sensitivity_list' && '민감도 리스트 누락 — 의도 회로 vs 시뮬레이션 해석'}
                </div>
              </div>
              <button
                onClick={() => setShowDiagram(null)}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  border: `1px solid ${FPGA.border}`, background: FPGA.white,
                  color: FPGA.textLight, fontSize: '1.1rem', fontWeight: 700,
                  cursor: 'pointer', flexShrink: 0,
                }}
                aria-label="Close"
              >×</button>
            </div>
            <div style={{ minHeight: 0 }}>
              {showDiagram === 'combo_loop' && <ComboLoopDiagram />}
              {showDiagram === 'latch_inferred' && <LatchProblemDiagram />}
              {showDiagram === 'assign_width_overflow' && <WidthOverflowDiagram />}
              {showDiagram === 'sensitivity_list' && <SensitivityListDiagram />}
            </div>
            {showDiagram === 'combo_loop' && (
              <div style={{
                display: 'flex', gap: '0.6rem',
                fontSize: '0.65rem', color: FPGA.textLight, lineHeight: 1.5,
                background: '#F7FAFC', border: `1px solid ${FPGA.border}`,
                borderRadius: '7px', padding: '0.5rem 0.75rem',
              }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#E53E3E' }}>Before:</strong> 두 조합 게이트가 a↔b로 직결 → 클록 없이 값이 계속 뒤집힘 (발진/시뮬 무한루프)
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#48BB78' }}>After:</strong> OR→AND 경로에 FF를 삽입 → 클록 경계가 루프를 끊어 안정 상태로 수렴
                </div>
              </div>
            )}
            <div style={{ fontSize: '0.6rem', color: FPGA.textLight, textAlign: 'center', marginTop: '-4px' }}>
              배경 클릭 또는 × 버튼으로 닫기
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
