'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import ProvidedFileModal from '../ProvidedFileModal';

const DAY14 = '#0B7285';
const ORANGE = '#E8913A';
const GREEN = '#48BB78';
const RED = '#E53E3E';
const MONO = '"JetBrains Mono", monospace';

type Key = 'en0' | 'recover' | 'diverse' | 'clear' | 'resetTrip';

// 실측(vsim) 기반 — 각 boost 가 닫는 항목 수(hit 증가분). 분모(total)는 고정.
const BOOSTS: { key: Key; label: string; fixes: string; d: Partial<Record<'expr' | 'cond' | 'branch' | 'fsmtran' | 'stmt', number>> }[] = [
  { key: 'en0', label: 'en=0 구간', fixes: 'trip_fsm en 분기 false 도달', d: { branch: 1 } },
  { key: 'recover', label: '일시 초과 회복', fixes: 'WARN→MONITOR 천이 + MONITOR vote=0', d: { branch: 2, stmt: 3, fsmtran: 1, cond: 1 } },
  { key: 'diverse', label: 'sensor 조합 전수', fixes: 'vote2oo3 곱항 개별 기여(expression)', d: { expr: 3 } },
  { key: 'clear', label: 'LATCH 에서 clear', fixes: 'LATCH→MONITOR 천이', d: { branch: 1, stmt: 2, fsmtran: 1 } },
  { key: 'resetTrip', label: 'TRIP_S 중 reset', fixes: 'TRIP_S→MONITOR 천이(리셋 최우선)', d: { fsmtran: 1 } },
];

const METRICS: { k: 'expr' | 'cond' | 'branch' | 'fsmtran' | 'stmt'; label: string; total: number; base: number }[] = [
  { k: 'expr', label: 'vote2oo3 · Expression', total: 3, base: 0 },
  { k: 'cond', label: 'warn_counter · Condition', total: 3, base: 2 },
  { k: 'branch', label: 'trip_fsm · Branch', total: 15, base: 10 },
  { k: 'fsmtran', label: 'trip_fsm · FSM 천이', total: 6, base: 3 },
  { k: 'stmt', label: 'trip_fsm · Statement', total: 21, base: 15 },
];

const boostCode = `// tb_trip_boost.sv — boost_scenario (5가지 미도달 시나리오)
task boost_scenario;
  begin
    // (1) en=0 구간 → enable 분기 false 로 도달
    en = 1'b0;  hold(3'b111, 3);  en = 1'b1;

    // (2) 일시 초과 회복 → WARN 진입 후 vote 소멸 → WARN→MONITOR
    hold(3'b110, 2);        // 2oo3 성립 → WARN
    hold(3'b000, 3);        // vote 소멸 → 회복

    // (3) sensor 조합 전수 → vote2oo3 곱항별 개별 기여 입증(expression)
    hold(3'b000,1); hold(3'b001,1); hold(3'b010,1); hold(3'b011,1);
    hold(3'b100,1); hold(3'b101,1); hold(3'b110,1); hold(3'b111,1);
    hold(3'b000, 3);        // 카운터 원위치

    // (4) TRIP→LATCH 도달 후 clear → LATCH→MONITOR 천이
    hold(3'b111, WARN_LIMIT + 8);
    check(state === 2'd3, "LATCH 도달 확인");
    clear = 1'b1; @(posedge clk);
    clear = 1'b0; @(posedge clk);
    check(state === 2'd0, "clear 로 MONITOR 회복");

    // (5) TRIP_S 진입 순간 reset → 리셋 최우선 확인
    sensor = 3'b111;
    @(posedge clk); #1;
    while (state !== 2'd2) begin @(posedge clk); #1; end
    rst = 1'b1; @(posedge clk);
    rst = 1'b0; @(posedge clk);
    check(state === 2'd0, "TRIP_S 중 reset 은 즉시 MONITOR");
  end
endtask`;

function val(m: typeof METRICS[number], on: Set<Key>) {
  let hits = m.base;
  BOOSTS.forEach((b) => { if (on.has(b.key)) hits += b.d[m.k] ?? 0; });
  return Math.round((hits / m.total) * 100);
}
function tone(p: number) { return p >= 90 ? GREEN : p >= 70 ? ORANGE : RED; }

export default function HoleBoostSlide() {
  const [on, setOn] = useState<Set<Key>>(new Set());
  const toggle = (k: Key) => setOn((prev) => {
    const n = new Set(prev);
    if (n.has(k)) n.delete(k); else n.add(k);
    return n;
  });
  const allOn = on.size === BOOSTS.length;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 2 · 홀 보강"
          title="홀에서 누락 자극 역추적 · 보강"
          subtitle="보강 자극 ON → 해당 커버리지 상승(실측) — 홀 = &ldquo;안 해본 자극&rdquo;의 목록 (default 만 보강 불가)"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 보강 토글 + 오르는 커버리지 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            {/* 보강 토글 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', flexShrink: 0 }}>
              {BOOSTS.map((b) => {
                const active = on.has(b.key);
                return (
                  <button key={b.key} onClick={() => toggle(b.key)} style={{
                    cursor: 'pointer', textAlign: 'left',
                    background: active ? `${DAY14}14` : FPGA.white,
                    border: `1.5px solid ${active ? DAY14 : FPGA.border}`,
                    borderRadius: '8px', padding: '0.32rem 0.55rem',
                    boxShadow: active ? shadow.card : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{
                        width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0,
                        border: `1.5px solid ${active ? DAY14 : '#CBD5E1'}`,
                        background: active ? DAY14 : '#fff',
                        color: '#fff', fontSize: '0.55rem', fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{active ? '✓' : ''}</span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: active ? DAY14 : FPGA.dark }}>{b.label}</span>
                    </div>
                    <div style={{ fontSize: '0.53rem', color: FPGA.textLight, marginTop: '1px', paddingLeft: '18px' }}>→ {b.fixes}</div>
                  </button>
                );
              })}
            </div>

            {/* 커버리지 막대 */}
            <div style={{
              flex: 1, minHeight: 0,
              background: '#0F1626', borderRadius: '10px', padding: '0.55rem 0.85rem',
              boxShadow: shadow.card, border: '1px solid #2C3850',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.3rem',
            }}>
              {METRICS.map((m) => {
                const v = val(m, on);
                const c = tone(v);
                return (
                  <div key={m.k} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.58rem', fontFamily: MONO, color: '#C7D2E8', width: '132px', flexShrink: 0 }}>{m.label}</span>
                    <div style={{ flex: 1, height: '12px', background: '#243250', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: `${Math.round((m.base / m.total) * 100)}%`, top: 0, bottom: 0, width: '2px', background: '#5A6B87' }} />
                      <div style={{ width: `${v}%`, height: '100%', background: c, borderRadius: '6px', transition: 'width 0.35s ease' }} />
                    </div>
                    <span style={{ fontSize: '0.6rem', fontFamily: MONO, fontWeight: 800, color: c, width: '34px', textAlign: 'right', flexShrink: 0 }}>{v}%</span>
                  </div>
                );
              })}
              <div style={{ fontSize: '0.54rem', color: '#7C90B0', fontFamily: MONO, marginTop: '0.15rem' }}>
                │ = 실습1 기준선 · 막대 = 보강 후 {allOn && <span style={{ color: ORANGE }}> (branch 93%·FSM천이 100% = default 1건만 잔여)</span>}
              </div>
            </div>
          </div>

          {/* ── 우: boost_scenario 코드 + 남는 홀 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <ProvidedFileModal
              filename="tb_trip_boost.sv"
              accent={DAY14}
              hint={<>미도달 시나리오 자극 — en=0 · 회복 · sensor 전수 · clear · TRIP_S reset (제공)</>}
              modalSubtitle="실습1 의 홀을 그대로 겨냥한 추가 자극 — 실행 전 코드를 먼저 읽고 이해"
              code={boostCode}
            />

            <div style={{
              background: `linear-gradient(135deg, ${GREEN}0A, ${GREEN}16)`,
              border: `1px solid ${GREEN}35`, borderLeft: `4px solid ${GREEN}`,
              borderRadius: '9px', padding: '0.45rem 0.8rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#2F855A', marginBottom: '0.1rem' }}>핵심 — 홀은 작업 지시서</div>
              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                리포트의 미도달 항목을 &ldquo;없는 자극&rdquo;으로 뒤집으면 곧 추가할 테스트 목록.
                자극 추가 후 <strong>재측정</strong> 시 61.70% → 98.57% 로 상승(실측).
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${ORANGE}0A, ${ORANGE}16)`,
              border: `1px solid ${ORANGE}35`, borderLeft: `4px solid ${ORANGE}`,
              borderRadius: '9px', padding: '0.45rem 0.8rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#B45309', marginBottom: '0.1rem' }}>그래도 100% 아님</div>
              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                <code>trip_fsm.v</code> 의 <code>default:</code> 분기는 state 2비트 전수라 <strong style={{ color: RED }}>원천 도달불가</strong> —
                어떤 자극으로도 보강 불가 → 실습4 에서 사유와 함께 제외.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
