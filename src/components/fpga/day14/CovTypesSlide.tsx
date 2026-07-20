'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY14 = '#0B7285';
const RED = '#E53E3E';
const MONO = '"JetBrains Mono", monospace';

// 코드 기호(<=, ==, >=, & 등)가 <div> monospace 에서 ligature 로 합쳐지지 않도록 (전역 CSS 는 pre/code 만 커버)
const noLig: CSSProperties = {
  fontVariantLigatures: 'none',
  fontFeatureSettings: '"liga" 0, "calt" 0',
};

type Key = 's' | 'b' | 'ce' | 'f' | 't';

const TYPES: {
  key: Key; label: string; letter: string; color: string;
  measures: string; catch: string; target: string; foot: string; hit: string; miss: string;
}[] = [
  {
    key: 's', label: 'Statement / Block', letter: 's', color: '#48BB78',
    measures: '각 실행문(블록)의 1회 이상 실행 여부',
    catch: '한 번도 실행 안 된 문장 — 예: 차단(trip) 구동문',
    target: '안전 설계 통상 목표 100% (미달 = 데드코드·미시험)',
    foot: '실행 안 된 문장 = 홀',
    hit: "trip <= 1'b1; 문장 실행됨",
    miss: 'TRIP_S 미도달 시 그 안의 문장',
  },
  {
    key: 'b', label: 'Branch', letter: 'b', color: '#E8913A',
    measures: 'if/else · case 각 갈래의 실행 여부',
    catch: '한쪽으로만 실행된 분기 — 예: 트립 참 갈래 미실행',
    target: '목표 100% (참·거짓 양방향 모두)',
    foot: '안 밟은 갈래 = 홀',
    hit: 'if (rst) 의 참·거짓 양쪽 실행',
    miss: 'if (vote) 참 갈래·en=0 갈래 미도달',
  },
  {
    key: 'ce', label: 'Condition / Expression', letter: 'c·e', color: '#0891B2',
    measures: '논리식 각 항의 독립적 결과 반전 여부 (FEC)',
    catch: '개별 항 미구분 — 예: 2oo3 배선오류·단일채널 오검출',
    target: 'FEC 100% · 상위 인증 등급은 MC/DC',
    foot: '독립 반전 안 된 항 = 홀',
    hit: 'vote 세 곱항 각각 참·거짓 구분',
    miss: 'sensor=111 만 주면 개별 곱항 미구분',
  },
  {
    key: 'f', label: 'FSM (state · transition)', letter: 'f', color: DAY14,
    measures: '모든 상태 도달 + 정의된 모든 천이 발생',
    catch: '미방문 상태·미발생 천이 — 예: WARN·TRIP_S·LATCH',
    target: '상태 100% + 천이 100%',
    foot: '미방문 상태·천이 = 홀',
    hit: 'MONITOR→WARN→TRIP_S→LATCH 도달',
    miss: 'WARN→MONITOR 회복 천이 미발생',
  },
  {
    key: 't', label: 'Toggle', letter: 't·x', color: '#8B6FA5',
    measures: '각 신호 비트의 0→1 · 1→0 양방향 토글 여부',
    catch: '한 방향으로만 변한 비트 — 예: 항상 0 인 예약 비트',
    target: '신호별 목표 · 상수 고정 비트는 제외 관리',
    foot: '한 방향만 변한 비트 = 홀',
    hit: 'sensor[2:0] 각 비트 0↔1 토글',
    miss: 'trip 이 항상 0 (트립 미발생)',
  },
];

// 미니 코드 (trip_ctrl.v) — 각 라인이 어떤 커버리지 유형의 계측 소재인지 태그
// cm=주석 라인 (항상 회색). state 는 2비트(0~3) 전수 → default 는 원천 도달불가(실습4 제외 소재)
const CODE: { t: string; on: Key[]; cm?: boolean }[] = [
  { t: 'module trip_ctrl #(parameter WARN_LIMIT=3) (', on: [] },
  { t: '  input        clk, rst, en,   // rst: 동기·active-high', on: ['t'] },
  { t: '  input  [2:0] sensor,         // 3중 초과-임계 플래그', on: ['t'] },
  { t: '  input        clear,          // LATCH 운전원 해제', on: ['t'] },
  { t: '  output reg   trip,           // 트립 작동 신호', on: ['t'] },
  { t: '  output reg [1:0] state );    // 상태 (2비트)', on: ['t', 'f'] },
  { t: '  localparam MONITOR=0, WARN=1, TRIP_S=2, LATCH=3;', on: ['f'] },
  { t: '  reg [1:0] cnt;               // 연속 vote 카운트', on: ['t'] },
  { t: '  // 2oo3 다수결: 3중 센서 중 2개↑ 초과 → 위험', on: [], cm: true },
  { t: '  wire vote = (sensor[0] & sensor[1])', on: ['ce'] },
  { t: '            | (sensor[1] & sensor[2])', on: ['ce'] },
  { t: '            | (sensor[0] & sensor[2]);', on: ['ce'] },
  { t: '  always @(posedge clk)', on: [] },
  { t: '    if (rst)     state <= MONITOR;   // 동기 리셋', on: ['s', 'b'] },
  { t: '    else if (en) case (state)        // en=0 → 정지', on: ['b', 'f'] },
  { t: '      MONITOR: if (vote) state <= WARN;', on: ['s', 'b', 'ce', 'f'] },
  { t: '      WARN: if (!vote) state <= MONITOR; // 일시 회복', on: ['b', 'ce', 'f'] },
  { t: '            else if (cnt >= WARN_LIMIT)', on: ['b', 'ce', 'f'] },
  { t: '                 state <= TRIP_S;    // 지속→트립', on: ['s', 'f'] },
  { t: "      TRIP_S: begin trip <= 1'b1; state <= LATCH; end", on: ['s', 'b', 'f'] },
  { t: '      LATCH: if (clear) state <= MONITOR;', on: ['s', 'b', 'f'] },
  { t: '      default: state <= MONITOR;     // 도달불가', on: ['b', 'f'] },
  { t: '    endcase', on: [] },
];

export default function CovTypesSlide() {
  const [sel, setSel] = useState<Key>('b');
  const cur = TYPES.find((x) => x.key === sel)!;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="개념 · 커버리지 종류"
          title="코드 커버리지 종류 — 계측 대상"
          subtitle="유형 클릭 시 예제 코드에서 계측 대상 강조 · 한 DUT(trip_ctrl.v), 서로 다른 관점"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.42fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 미니 코드 (선택 유형 하이라이트) ── */}
          <div style={{
            background: '#0F1626', borderRadius: '10px',
            padding: '0.55rem 0.8rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${cur.color}`,
            display: 'flex', flexDirection: 'column', minHeight: 0,
          }}>
            <div style={{ fontSize: '0.6rem', color: cur.color, fontWeight: 800, marginBottom: '0.2rem', letterSpacing: '0.04em', flexShrink: 0 }}>
              trip_ctrl.v — <span style={{ color: '#7C90B0' }}>{cur.label} 관점 강조</span>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
              {CODE.map((ln, i) => {
                if (ln.t === '') return <div key={i} style={{ height: '0.4em' }} />;
                if (ln.cm) {
                  return (
                    <div key={i} style={{
                      fontFamily: MONO, fontSize: '0.58rem', lineHeight: 1.62, ...noLig,
                      whiteSpace: 'pre', padding: '0 6px', color: '#6A8759', fontStyle: 'italic',
                    }}>{ln.t}</div>
                  );
                }
                const active = ln.on.includes(sel);
                return (
                  <div key={i} style={{
                    fontFamily: MONO, fontSize: '0.58rem', lineHeight: 1.62, ...noLig,
                    whiteSpace: 'pre', padding: '0 6px', borderRadius: '4px',
                    color: active ? '#fff' : '#5A6B87',
                    background: active ? `${cur.color}33` : 'transparent',
                    borderLeft: active ? `2px solid ${cur.color}` : '2px solid transparent',
                    transition: 'all 0.15s ease',
                  }}>{ln.t}</div>
                );
              })}
            </div>
            <div style={{ fontSize: '0.55rem', color: '#7C90B0', fontFamily: MONO, marginTop: '0.25rem', flexShrink: 0 }}>
              강조 = <span style={{ color: cur.color, fontWeight: 700 }}>{cur.label}</span> 계측 지점 · {cur.foot}
            </div>
          </div>

          {/* ── 우: 유형 선택 + 설명 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            {/* 유형 칩 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', flexShrink: 0 }}>
              {TYPES.map((x) => (
                <button key={x.key} onClick={() => setSel(x.key)} style={{
                  cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.62rem', fontWeight: 700, fontFamily: MONO,
                  color: sel === x.key ? '#fff' : x.color,
                  background: sel === x.key ? x.color : `${x.color}0E`,
                  border: `1.5px solid ${x.color}${sel === x.key ? '' : '55'}`,
                  borderRadius: '7px', padding: '4px 8px',
                  boxShadow: sel === x.key ? shadow.card : 'none',
                }}>
                  <span style={{
                    fontSize: '0.56rem', fontWeight: 800,
                    background: sel === x.key ? 'rgba(255,255,255,0.25)' : `${x.color}22`,
                    color: sel === x.key ? '#fff' : x.color,
                    borderRadius: '3px', padding: '0 4px',
                  }}>+{x.letter}</span>
                  {x.label}
                </button>
              ))}
              {/* 마지막 칸 — +cover 통합 안내 */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.58rem', fontWeight: 700, fontFamily: MONO, color: FPGA.textLight,
                border: `1px dashed ${FPGA.border}`, borderRadius: '7px', padding: '4px 6px',
              }}>
                = <span style={{ color: DAY14, margin: '0 3px' }}>+cover=bcesf</span> 한 번에
              </div>
            </div>

            {/* 선택 유형 설명 */}
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderTop: `3px solid ${cur.color}`,
              borderRadius: '10px', padding: '0.6rem 0.85rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexShrink: 0 }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: cur.color }}>{cur.label}</span>
                <span style={{
                  fontSize: '0.6rem', fontWeight: 800, fontFamily: MONO,
                  color: '#fff', background: cur.color, borderRadius: '4px', padding: '1px 7px',
                }}>+cover={cur.letter}</span>
              </div>

              {/* 계측 대상 · 잡는 결함 · 인증 목표 */}
              {([
                ['계측 대상', cur.measures, FPGA.textLight, cur.color],
                ['잡는 결함', cur.catch, FPGA.text, RED],
                ['인증 목표', cur.target, FPGA.text, DAY14],
              ] as const).map(([lab, txt, txtColor, chip], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                  <span style={{
                    flexShrink: 0, fontSize: '0.55rem', fontWeight: 800, color: '#fff',
                    background: chip, borderRadius: '4px', padding: '2px 6px', marginTop: '1px',
                    whiteSpace: 'nowrap',
                  }}>{lab}</span>
                  <span style={{ fontSize: '0.66rem', color: txtColor, lineHeight: 1.4 }}>{txt}</span>
                </div>
              ))}

              {/* hit / miss 예 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginTop: 'auto' }}>
                <div style={{
                  background: 'rgba(72,187,120,0.10)', border: '1px solid rgba(72,187,120,0.4)',
                  borderRadius: '8px', padding: '0.4rem 0.55rem',
                }}>
                  <div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#2F855A', marginBottom: '0.15rem' }}>✓ HIT</div>
                  <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.4, ...noLig }}>{cur.hit}</div>
                </div>
                <div style={{
                  background: 'rgba(229,62,62,0.08)', border: '1px solid rgba(229,62,62,0.35)',
                  borderRadius: '8px', padding: '0.4rem 0.55rem',
                }}>
                  <div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#C53030', marginBottom: '0.15rem' }}>✗ MISS(홀)</div>
                  <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.4, ...noLig }}>{cur.miss}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
