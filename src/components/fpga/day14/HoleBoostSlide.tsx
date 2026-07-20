'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import RevealCodeModal from '../RevealCodeModal';

const DAY14 = '#0B7285';
const ORANGE = '#E8913A';
const GREEN = '#48BB78';
const RED = '#E53E3E';
const MONO = '"JetBrains Mono", monospace';

// 구현부 임시 잠금 암호 (기록: ref_lab/SOLUTION_PASSWORDS.txt)
const REVEAL_PW = '4207';

type Key = 'en0' | 'recover' | 'diverse' | 'clear';

const BOOSTS: { key: Key; label: string; fixes: string; d: Partial<Record<'stmt' | 'branch' | 'cond' | 'fsm', number>> }[] = [
  { key: 'en0', label: 'en=0 구간', fixes: 'else if(en) false 분기', d: { branch: 8 } },
  { key: 'recover', label: '일시 초과 회복', fixes: 'WARN→MONITOR 천이', d: { stmt: 5, branch: 13, fsm: 21 } },
  { key: 'diverse', label: 'sensor 조합 다양화', fixes: 'vote 곱항 condition', d: { cond: 57 } },
  { key: 'clear', label: 'LATCH 에서 clear', fixes: 'LATCH→MONITOR 천이', d: { stmt: 5, branch: 13, fsm: 21 } },
];

const BASE = { stmt: 90, branch: 58, cond: 43, fsm: 50 };
const METRICS: { k: keyof typeof BASE; label: string }[] = [
  { k: 'stmt', label: 'Statement' },
  { k: 'branch', label: 'Branch' },
  { k: 'cond', label: 'Condition' },
  { k: 'fsm', label: 'FSM tran' },
];

const boostPorts = `// tb_trip_boost.sv — boost_scenario 구현 대상
// [제공] hold(sensor,n) · do_reset · check · report 하네스
task boost_scenario;
  begin
    // ⋯ 4가지 미도달 시나리오 자극 (아래 잠금)
  end
endtask`;

const boostFull = `// tb_trip_boost.sv — boost_scenario [정답]
task boost_scenario;
  begin
    // (1) en=0 구간 — enable 분기 false 도달
    en = 1'b0; hold(3'b111, 3); en = 1'b1;

    // (2) 일시 초과 회복 — WARN 진입 후 vote 제거
    hold(3'b110, 2);          // 2oo3 성립 → WARN
    hold(3'b000, 3);          // vote 소멸 → WARN→MONITOR

    // (3) sensor 조합 다양화 — vote 곱항 condition 보강
    hold(3'b100,1); hold(3'b010,1); hold(3'b001,1);
    hold(3'b011,1); hold(3'b101,1); hold(3'b000,1);

    // (4) TRIP_S→LATCH 후 clear — LATCH→MONITOR 천이
    hold(3'b111, WARN_LIMIT+4);
    check(state===2'd3, "LATCH 도달");
    clear=1'b1; @(posedge clk);
    clear=1'b0; @(posedge clk);
    check(state===2'd0, "clear 로 MONITOR 회복");
  end
endtask`;

function val(base: number, k: keyof typeof BASE, on: Set<Key>) {
  let v = base;
  BOOSTS.forEach((b) => { if (on.has(b.key)) v += b.d[k] ?? 0; });
  return Math.min(v, 100);
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
          subtitle="보강 자극 ON → 해당 커버리지 상승 — 홀 = &ldquo;안 해본 자극&rdquo;의 목록 (default 만 보강 불가)"
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
                    borderRadius: '8px', padding: '0.35rem 0.55rem',
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
                      <span style={{ fontSize: '0.64rem', fontWeight: 800, color: active ? DAY14 : FPGA.dark }}>{b.label}</span>
                    </div>
                    <div style={{ fontSize: '0.55rem', color: FPGA.textLight, marginTop: '1px', paddingLeft: '18px' }}>→ {b.fixes}</div>
                  </button>
                );
              })}
            </div>

            {/* 커버리지 막대 */}
            <div style={{
              flex: 1, minHeight: 0,
              background: '#0F1626', borderRadius: '10px', padding: '0.6rem 0.85rem',
              boxShadow: shadow.card, border: '1px solid #2C3850',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem',
            }}>
              {METRICS.map((m) => {
                const base = BASE[m.k];
                const v = val(base, m.k, on);
                const c = tone(v);
                return (
                  <div key={m.k} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.62rem', fontFamily: MONO, color: '#C7D2E8', width: '76px', flexShrink: 0 }}>{m.label}</span>
                    <div style={{ flex: 1, height: '13px', background: '#243250', borderRadius: '7px', overflow: 'hidden', position: 'relative' }}>
                      {/* baseline 마커 */}
                      <div style={{ position: 'absolute', left: `${base}%`, top: 0, bottom: 0, width: '2px', background: '#5A6B87' }} />
                      <div style={{ width: `${v}%`, height: '100%', background: c, borderRadius: '7px', transition: 'width 0.35s ease' }} />
                    </div>
                    <span style={{ fontSize: '0.62rem', fontFamily: MONO, fontWeight: 800, color: c, width: '40px', textAlign: 'right', flexShrink: 0 }}>{v}%</span>
                  </div>
                );
              })}
              <div style={{ fontSize: '0.56rem', color: '#7C90B0', fontFamily: MONO, marginTop: '0.2rem' }}>
                │ = 실습1 기준선 · 막대 = 보강 후 {allOn && <span style={{ color: ORANGE }}> (branch·fsm 92% = default 도달불가 잔여)</span>}
              </div>
            </div>
          </div>

          {/* ── 우: boost_scenario 잠금 + 남는 홀 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: '#1A2235', borderRadius: '10px',
              padding: '0.55rem 0.85rem', boxShadow: shadow.card,
              borderLeft: `3px solid ${DAY14}`,
              display: 'flex', flexDirection: 'column',
            }}>
              <RevealCodeModal
                title="boost_scenario — 구현 대상"
                accent={DAY14}
                password={REVEAL_PW}
                portsCode={boostPorts}
                fullCode={boostFull}
                subtitle="미도달 4시나리오 자극 — en=0 · 회복 · sensor 다양화 · clear"
                inlineStyle={{ fontSize: '0.58rem', lineHeight: 1.5 }}
              />
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${GREEN}0A, ${GREEN}16)`,
              border: `1px solid ${GREEN}35`, borderLeft: `4px solid ${GREEN}`,
              borderRadius: '9px', padding: '0.45rem 0.8rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#2F855A', marginBottom: '0.1rem' }}>핵심 — 홀은 작업 지시서</div>
              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                리포트의 미도달 항목을 &ldquo;없는 자극&rdquo;으로 뒤집으면 곧 추가할 테스트 목록.
                자극 추가 후 <strong>재측정</strong> 시 해당 유형 상승.
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${ORANGE}0A, ${ORANGE}16)`,
              border: `1px solid ${ORANGE}35`, borderLeft: `4px solid ${ORANGE}`,
              borderRadius: '9px', padding: '0.45rem 0.8rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#B45309', marginBottom: '0.1rem' }}>그래도 100% 아님</div>
              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                <code>default:</code> 분기는 state 2비트 전수라 <strong style={{ color: RED }}>원천 도달불가</strong> —
                어떤 자극으로도 보강 불가 → 실습4 에서 사유와 함께 제외.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
