'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import ToolImage from '../ToolImage';
import ProvidedFileModal from '../ProvidedFileModal';

const DAY14 = '#0B7285';
const ORANGE = '#E8913A';
const GREEN = '#48BB78';
const RED = '#E53E3E';
const MONO = '"JetBrains Mono", monospace';

const tbTrip = `// tb_trip.sv — 기본 TB [제공]
// 최소 자극 : en=1, sensor=3'b111 지속 → TRIP_S → LATCH
initial begin
  rst=1; en=1; clear=0; sensor=0;
  repeat(2) @(posedge clk); rst=0;
  sensor = 3'b111;                 // 지속 초과만 인가
  repeat(WARN_LIMIT+6) @(posedge clk);
  check(trip===1'b1,  "trip 작동");
  check(state===2'd3, "LATCH 도달");
  report;  $finish;                // RESULT: PASS
end
// 약점: clear 없음·en=0 없음·transient 없음·sensor 단조`;

// coverage report — 기본 TB 측정 결과(요약, 실측 vsim)
const SUMMARY: { module: string; label: string; hit: number; tot: number }[] = [
  { module: 'vote2oo3', label: 'Expression', hit: 0, tot: 3 },
  { module: 'vote2oo3', label: 'Statement', hit: 1, tot: 1 },
  { module: 'warn_counter', label: 'Branch', hit: 5, tot: 5 },
  { module: 'warn_counter', label: 'Condition', hit: 2, tot: 3 },
  { module: 'warn_counter', label: 'Statement', hit: 6, tot: 6 },
  { module: 'trip_fsm', label: 'Branch', hit: 10, tot: 15 },
  { module: 'trip_fsm', label: 'FSM state', hit: 4, tot: 4 },
  { module: 'trip_fsm', label: 'FSM tran', hit: 3, tot: 6 },
  { module: 'trip_fsm', label: 'Statement', hit: 15, tot: 21 },
];

const HOLES = [
  'vote2oo3 · expr : 곱항 3개 전부 0% (sensor=111 고정 → 개별 기여 미입증)',
  'warn_counter · cond : clr=1,rst=0 조합 미도달',
  'trip_fsm · branch : en=0 · WARN 회복 · LATCH clear 분기 미도달',
  'trip_fsm · fsm : WARN→MONITOR · LATCH→MONITOR · TRIP_S→MONITOR 천이 0',
];

function pct(h: number, t: number) { return Math.round((h / t) * 100); }
function tone(p: number) { return p >= 90 ? GREEN : p >= 70 ? ORANGE : RED; }

export default function MeasureSlide() {
  const [view, setView] = useState<'summary' | 'holes'>('summary');

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 1 · 커버리지 측정"
          title="커버리지 측정 · 리포트 해석 — 빈 곳 찾기"
          subtitle="기능 PASS 여도 커버리지는 낮음 · 숫자에서 &ldquo;안 해본 자극&rdquo; 판독 (DUT: trip_top = vote2oo3+warn_counter+trip_fsm)"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: coverage report 패널 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
              {([['summary', '요약 (coverage report)'], ['holes', '상세 (-details 홀)']] as const).map(([v, lbl]) => (
                <button key={v} onClick={() => setView(v)} style={{
                  flex: 1, cursor: 'pointer', fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                  color: view === v ? '#fff' : DAY14,
                  background: view === v ? DAY14 : 'transparent',
                  border: `1.5px solid ${DAY14}`, borderRadius: '6px', padding: '4px 0',
                  boxShadow: view === v ? shadow.card : 'none',
                }}>{lbl}</button>
              ))}
            </div>

            <div style={{
              flex: 1, minHeight: 0,
              background: '#0F1626', borderRadius: '10px', padding: '0.6rem 0.85rem',
              boxShadow: shadow.card, border: '1px solid #2C3850',
              display: 'flex', flexDirection: 'column',
            }}>
              {view === 'summary' ? (
                <>
                  <div style={{ fontSize: '0.58rem', color: '#7C90B0', fontFamily: MONO, marginBottom: '0.3rem' }}>
                    # coverage report — /tb_trip/dut (trip_top)
                  </div>
                  {SUMMARY.map((r, i) => {
                    const p = pct(r.hit, r.tot);
                    const c = tone(p);
                    const newGroup = i === 0 || SUMMARY[i - 1].module !== r.module;
                    return (
                      <div key={r.module + r.label}>
                        {newGroup && (
                          <div style={{ fontSize: '0.56rem', fontFamily: MONO, color: DAY14, fontWeight: 800, marginTop: i ? '0.25rem' : 0 }}>
                            === {r.module} ===
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.1rem 0' }}>
                          <span style={{ fontSize: '0.6rem', fontFamily: MONO, color: '#C7D2E8', width: '86px', flexShrink: 0 }}>{r.label}</span>
                          <div style={{ flex: 1, height: '9px', background: '#243250', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ width: `${p}%`, height: '100%', background: c, borderRadius: '5px' }} />
                          </div>
                          <span style={{ fontSize: '0.6rem', fontFamily: MONO, fontWeight: 800, color: c, width: '74px', textAlign: 'right', flexShrink: 0 }}>
                            {p}% <span style={{ color: '#5A6B87', fontWeight: 400 }}>{r.hit}/{r.tot}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 'auto', paddingTop: '0.35rem', fontSize: '0.58rem', color: '#7C90B0', fontFamily: MONO }}>
                    <span style={{ color: GREEN }}>■</span> ≥90 &nbsp;<span style={{ color: ORANGE }}>■</span> ≥70 &nbsp;<span style={{ color: RED }}>■</span> &lt;70 (홀)
                    &nbsp;· 전체(가중) <strong style={{ color: ORANGE }}>61.70%</strong>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '0.58rem', color: '#7C90B0', fontFamily: MONO, marginBottom: '0.4rem' }}>
                    # coverage report -details — 미도달 목록
                  </div>
                  {HOLES.map((h, i) => (
                    <div key={i} style={{ fontSize: '0.62rem', fontFamily: MONO, color: '#FF9B94', lineHeight: 1.75, whiteSpace: 'pre' }}>
                      <span style={{ color: '#5A6B87' }}>{String(i + 1).padStart(2, '0')} </span>{h}
                    </div>
                  ))}
                  <div style={{ marginTop: 'auto', paddingTop: '0.4rem', fontSize: '0.6rem', color: '#A8D8E0', fontFamily: MONO }}>
                    → 홀 목록 = 실습2 에서 추가할 자극의 <span style={{ color: GREEN }}>작업 지시서</span>
                  </div>
                </>
              )}
            </div>

            <div style={{
              background: '#1A2235', borderRadius: '7px', padding: '0.3rem 0.6rem',
              fontFamily: MONO, fontSize: '0.6rem', color: '#A8D8E0', flexShrink: 0,
            }}>
              <span style={{ color: '#F6AD55', fontWeight: 700 }}>$ </span>make cov  <span style={{ color: '#5A6B87' }}># → coverage report</span>
            </div>
          </div>

          {/* ── 우: Source 창 캡처 + 숫자 읽는 법 + TB ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.5rem 0.6rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                Source 창 — 라인별 hit/miss 색상
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ToolImage src="/images/fpga/day14_cov_source.png" name="Source 커버리지" width="100%" height="100%" />
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY14}08, ${DAY14}15)`,
              border: `1px solid ${DAY14}30`, borderLeft: `4px solid ${DAY14}`,
              borderRadius: '9px', padding: '0.45rem 0.8rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: DAY14, marginBottom: '0.1rem' }}>숫자 읽는 법</div>
              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                Statement 는 높아도 <strong>Branch·Condition·FSM 천이는 낮음</strong> — 라인은 실행돼도
                갈래·조건·천이는 미실행 · 낮은 유형이 곧 홀.
              </div>
            </div>

            <ProvidedFileModal
              filename="tb_trip.sv"
              accent={ORANGE}
              hint={<>기본 TB — 최소 자극(sensor=111 지속) · <strong>PASS 지만 커버리지 낮음</strong> (제공)</>}
              modalSubtitle="약한 자극이 남기는 홀을 실습2 에서 보강"
              code={tbTrip}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
