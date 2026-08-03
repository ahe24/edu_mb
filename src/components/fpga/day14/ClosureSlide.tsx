'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY14 = '#0B7285';
const ORANGE = '#E8913A';
const GREEN = '#48BB78';
const BLUE = '#4A6FA5';
const PURPLE = '#8B6FA5';
const RED = '#E53E3E';
const MONO = '"JetBrains Mono", monospace';

// 코드 기호(<=, == 등)가 <div> monospace 에서 ligature 로 합쳐지지 않도록
const noLig: CSSProperties = {
  fontVariantLigatures: 'none',
  fontFeatureSettings: '"liga" 0, "calt" 0',
};

// 코드 라인 색상 역할: c=주석 · n=일반 · m=판정 근거가 되는 라인 강조
const LC: Record<string, string> = { c: '#7C90B0', n: '#C9D4E5', m: '#FF7B72' };

// 상황/조치 라벨 pill
const pill = (c: string): CSSProperties => ({
  fontSize: '0.5rem', fontWeight: 800, color: c, background: `${c}15`,
  border: `1px solid ${c}35`, borderRadius: '4px', padding: '1px 6px',
  flexShrink: 0, minWidth: '30px', textAlign: 'center', fontFamily: MONO,
});

const excludeCode = `# exclude.do — 커버리지 클로저 : 도달불가 홀을 사유와 함께 제외(waiver)
#   Coverage View 모드(vsim -viewcov <ucdb>)에서 실행 — -comment 는 여기서만 지원
transcript on

# [도달불가] trip_fsm.v:71  default: state <= MONITOR;
#   state 는 2비트 전수 열거(0~3) → case default 는 원천 도달불가.
#   방어적 코딩으로 코드는 유지, 커버리지는 사유 남기고 제외.
#   -srcfile 은 UCDB 에 기록된 경로(flist.f 기준 상대경로)와 일치해야 매칭된다.
coverage exclude -srcfile ../../rtl/trip_fsm.v -linerange 71 \\
  -comment "UNREACH: state 2-bit fully-enumerated; default is defensive/unreachable"

coverage report   # 제외 반영 → DUT 전체 100.00% (waiver 1건)`;

type Dec = 'add' | 'excl' | 'bug';
type CodeBlock = { file: string; kind: string; lines: { t: string; k: string }[] };
const DECISIONS: {
  key: Dec; n: string; title: string; situation: string; action: string; color: string;
  code: CodeBlock[]; criterion: string; result: string;
  before?: number; after?: number;
}[] = [
  {
    key: 'add', n: '①', title: '테스트 추가', situation: '자극 부재로 미도달', action: '시나리오 보강 후 재측정 (실습2)', color: BLUE,
    code: [
      {
        file: 'tb_trip_boost.sv', kind: 'SV 테스트벤치', lines: [
          { t: '// en=0 구간 자극 추가', k: 'c' },
          { t: "en = 1'b0;  hold(3'b111, 3);  en = 1'b1;", k: 'n' },
        ],
      },
    ],
    criterion: '정상 코드 · 해당 경로로 가는 자극 미제작(설계 결함 아님)',
    result: '보강 시나리오 5건 적용 후 DUT 전체 상승(실측)',
    before: 61.70, after: 98.57,
  },
  {
    key: 'excl', n: '②', title: '제외 (waiver)', situation: '원천 도달불가 (방어코드 등)', action: 'coverage exclude + 사유 주석', color: ORANGE,
    code: [
      {
        file: 'trip_fsm.v', kind: 'RTL · 71행', lines: [
          { t: '// state 는 2bit 전수 열거(0~3)', k: 'c' },
          { t: 'default: state <= MONITOR;  // 도달 불가', k: 'm' },
        ],
      },
      {
        file: 'exclude.do', kind: 'Tcl 스크립트', lines: [
          { t: 'coverage exclude -srcfile ../../rtl/trip_fsm.v -linerange 71 \\', k: 'n' },
          { t: '  -comment "UNREACH: state 2-bit fully-enumerated"', k: 'n' },
        ],
      },
    ],
    criterion: '폭(width) 검증 — state 값은 0~3 뿐, default 진입 조건이 설계상 존재하지 않음(정적 증명 가능)',
    result: '제외 반영 후 waiver 1건 포함 DUT 전체 종료 기준 도달(실측)',
    before: 98.57, after: 100.00,
  },
  {
    key: 'bug', n: '③', title: '설계 수정', situation: '죽은 코드 · 잘못된 조건 발견', action: 'RTL 결함 수정 후 재검증', color: RED,
    code: [
      {
        file: '가상 예시', kind: '실제 파일 아님', lines: [
          { t: '// trip_fsm 실제 사례 아님', k: 'c' },
          { t: "if (mode == 2'b11) state <= FAULT;  // mode 는 0~2만 배정", k: 'm' },
        ],
      },
    ],
    criterion: '②와 겉보기는 같은 미도달이지만 "도달불가"가 설계 의도가 아니라 조건식·배선 실수로 생긴 경우(정적으로 의도됨을 증명 못 함)',
    result: '오늘 예제엔 해당 사례 없음 — 발견 시 exclude 대신 RTL 수정 후 재측정부터 다시 시작',
  },
];

// ②/③ 판별 흐름 — 겉보기엔 같은 "미도달"이지만 판정이 갈리는 지점
const BUG_FLOW_CHAIN: { t: string; c: string }[] = [
  { t: '미도달 홀 발견', c: FPGA.textLight },
  { t: '설계상 도달불가?\n(폭·열거로 정적 증명)', c: FPGA.dark },
];
const BUG_FLOW_BRANCH: { q: string; t: string; c: string }[] = [
  { q: '예', t: '② 제외(waiver)', c: ORANGE },
  { q: '아니오', t: '③ 설계 수정', c: RED },
];

export default function ClosureSlide() {
  const [sel, setSel] = useState<Dec>('excl');
  const cur = DECISIONS.find((d) => d.key === sel)!;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 4 · 커버리지 클로저"
          title="커버리지 홀 처리 — 테스트 추가 · 제외(waiver) · 설계 수정"
          subtitle="클로저 활동 — 처리 방법 결정 근거 명시 필수"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 3-way 판정 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '9px',
              padding: '0.45rem 0.7rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.62rem', color: FPGA.text }}>
                <strong style={{ color: DAY14 }}>처리 방법 선택</strong> — trip_fsm 실제 사례로 확인 (클릭)
              </span>
            </div>

            {/* 판정 카드 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {DECISIONS.map((d, i) => {
                const active = sel === d.key;
                return (
                  <button key={d.key} onClick={() => setSel(d.key)} style={{
                    cursor: 'pointer', textAlign: 'left',
                    background: active ? `${d.color}12` : FPGA.white,
                    borderTop: `1px solid ${active ? d.color : FPGA.border}`,
                    borderRight: `1px solid ${active ? d.color : FPGA.border}`,
                    borderBottom: `1px solid ${active ? d.color : FPGA.border}`,
                    borderLeft: `4px solid ${d.color}`,
                    borderRadius: '10px', padding: '0.55rem 0.75rem',
                    boxShadow: active ? shadow.card : '0 1px 3px rgba(0,0,0,0.06)',
                    display: 'flex', alignItems: 'flex-start', gap: '0.7rem',
                    transition: 'box-shadow 0.15s ease',
                  }}>
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                      background: d.color, color: '#fff', fontWeight: 800, fontSize: '0.72rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 2px 5px ${d.color}66`,
                    }}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.32rem' }}>{d.title}</div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={pill(d.color)}>상황</span>
                        <span style={{ fontSize: '0.6rem', color: FPGA.textLight, lineHeight: 1.4 }}>{d.situation}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '3px' }}>
                        <span style={pill(d.color)}>조치</span>
                        <span style={{ fontSize: '0.6rem', color: FPGA.dark, fontWeight: 600, lineHeight: 1.4 }}>{d.action}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* trip_fsm 적용 예 */}
            <div style={{
              flexShrink: 0,
              background: `linear-gradient(135deg, ${cur.color}0A, ${cur.color}16)`,
              border: `1px solid ${cur.color}35`, borderRadius: '9px',
              padding: '0.5rem 0.8rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: cur.color, flexShrink: 0 }}>
                trip_fsm 적용 — {cur.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
                {cur.code.map((block, bi) => (
                  <div key={bi} style={{
                    background: '#0F1626', borderRadius: '7px', padding: '0.35rem 0.6rem',
                    overflowX: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', ...noLig,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{
                        fontSize: '0.5rem', fontWeight: 800, color: '#0F1626', background: cur.color,
                        padding: '1px 6px', borderRadius: '4px', fontFamily: MONO, flexShrink: 0,
                      }}>{block.file}</span>
                      <span style={{ fontSize: '0.5rem', color: '#7C90B0' }}>{block.kind}</span>
                    </div>
                    {block.lines.map((ln, i) => (
                      <div key={i} style={{
                        fontFamily: MONO, fontSize: '0.58rem', lineHeight: 1.55,
                        whiteSpace: 'pre', color: LC[ln.k],
                      }}>{ln.t}</div>
                    ))}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                <span style={{ fontWeight: 800, color: cur.color }}>판단 근거 · </span>{cur.criterion}
              </div>
              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                <span style={{ fontWeight: 800, color: cur.color }}>결과 · </span>{cur.result}
              </div>

              {cur.before !== undefined && cur.after !== undefined && (
                <div style={{ marginTop: '0.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', fontFamily: MONO, color: FPGA.textLight, marginBottom: '3px' }}>
                    <span>DUT 전체 커버리지</span>
                    <span>{cur.before.toFixed(2)}% → <strong style={{ color: cur.color }}>{cur.after.toFixed(2)}%</strong></span>
                  </div>
                  <div style={{ position: 'relative', height: '15px', background: '#E2E8F0', borderRadius: '8px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)' }}>
                    <div style={{ position: 'absolute', inset: 0, width: `${cur.after}%`, background: cur.color, borderRadius: '8px', boxShadow: `0 1px 4px ${cur.color}55`, transition: 'width 0.35s ease' }} />
                    <div style={{ position: 'absolute', left: `${cur.before}%`, top: '-3px', bottom: '-3px', width: '2px', background: '#334155' }} />
                  </div>
                  <div style={{ fontSize: '0.5rem', color: FPGA.textLight, marginTop: '2px' }}>│ = 판정 전 기준선</div>
                </div>
              )}

              {sel === 'bug' && (
                <div style={{
                  marginTop: '0.1rem', background: '#fff', border: `1px solid ${RED}30`, borderRadius: '8px',
                  padding: '0.45rem 0.6rem',
                }}>
                  <div style={{ fontSize: '0.56rem', fontWeight: 800, color: FPGA.textLight, marginBottom: '0.3rem' }}>
                    ② 제외 vs ③ 수정 — 판별 흐름
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                    {BUG_FLOW_CHAIN.map((f, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{
                          fontSize: '0.53rem', fontWeight: 700, color: f.c, whiteSpace: 'pre-line',
                          background: i === 0 ? FPGA.bgAlt : `${FPGA.dark}0F`,
                          border: `1px solid ${FPGA.border}`, borderRadius: '6px', padding: '3px 7px', lineHeight: 1.3,
                        }}>{f.t}</span>
                        <span style={{ color: FPGA.textLight, fontSize: '0.6rem' }}>→</span>
                      </span>
                    ))}
                    {BUG_FLOW_BRANCH.map((b) => (
                      <span key={b.q} style={{
                        fontSize: '0.53rem', fontWeight: 700, color: b.c,
                        background: `${b.c}12`, border: `1px solid ${b.c}40`, borderRadius: '6px',
                        padding: '3px 7px', lineHeight: 1.3,
                      }}>{b.q} · {b.t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── 우: exclude.do + 클로저 결과 + 함정 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={{
              background: '#0F1626', border: `1px solid ${ORANGE}35`, borderLeft: `4px solid ${ORANGE}`,
              borderRadius: '9px', padding: '0.5rem 0.7rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.55rem', fontWeight: 800, color: '#fff', background: ORANGE,
                  padding: '2px 6px', borderRadius: '5px', fontFamily: MONO, flexShrink: 0,
                }}>exclude.do</span>
                <span style={{ fontSize: '0.55rem', color: '#9FB0CC' }}>
                  사유(-comment)는 HTML 리포트 툴팁 = 심사 증적 · 형상관리 대상
                </span>
              </div>
              <pre style={{
                margin: 0, ...noLig, fontFamily: MONO, fontSize: '0.52rem', lineHeight: 1.5,
                color: '#C7D2E8', whiteSpace: 'pre-wrap', overflowX: 'auto',
              }}>{excludeCode}</pre>
            </div>

            {/* 클로저 결과 */}
            <div style={{
              background: `linear-gradient(135deg, ${GREEN}0A, ${GREEN}18)`,
              border: `1px solid ${GREEN}35`, borderLeft: `4px solid ${GREEN}`,
              borderRadius: '9px', padding: '0.45rem 0.8rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#2F855A', marginBottom: '0.2rem' }}>클로저 달성(실측)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6rem', fontFamily: MONO, color: FPGA.text }}>
                <span>branch 93%·stmt 95% <strong style={{ color: ORANGE }}>(98.57%)</strong></span>
                <span style={{ color: GREEN }}>—제외→</span>
                <span><strong style={{ color: '#2F855A' }}>100.00%</strong> + waiver 1건</span>
                <span style={{ marginLeft: 'auto', color: FPGA.textLight }}>= 검증 종료 근거</span>
              </div>
            </div>

            {/* 판정 매핑 — 좌측 3분류가 오늘 예제에서 실제 몇 건씩 나왔나 */}
            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '9px',
              padding: '0.45rem 0.8rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.25rem' }}>
                trip_fsm 최종 판정 매핑
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {[
                  { n: '①', label: '추가', color: BLUE, v: '5건 — 실습2 보강 시나리오로 해소' },
                  { n: '②', label: '제외', color: ORANGE, v: '1건 — default: (waiver)' },
                  { n: '③', label: '수정', color: RED, v: '0건 — 오늘 예제엔 없음 · 실무에선 최우선 점검 대상' },
                ].map((r) => (
                  <div key={r.n} style={{ display: 'flex', alignItems: 'baseline', gap: '6px', fontSize: '0.6rem' }}>
                    <span style={{ fontWeight: 800, color: r.color, width: '16px', flexShrink: 0 }}>{r.n}</span>
                    <span style={{ fontWeight: 700, color: FPGA.dark, width: '30px', flexShrink: 0 }}>{r.label}</span>
                    <span style={{ color: FPGA.textLight }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 함정 — 100% ≠ 기능 완전성 */}
            <div style={{
              background: `linear-gradient(135deg, ${PURPLE}0A, ${PURPLE}18)`,
              border: `1px solid ${PURPLE}35`, borderLeft: `4px solid ${PURPLE}`,
              borderRadius: '9px', padding: '0.45rem 0.8rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: PURPLE, marginBottom: '0.1rem' }}>함정 — 100% ≠ 기능 완전성</div>
              <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>
                코드 커버리지 100% = &ldquo;모든 코드 <strong>실행됨</strong>&rdquo;일 뿐, &ldquo;결과가 <strong>옳음</strong>&rdquo;의 보장 아님.
                기능 커버리지·형식 검증이 그 공백 보완 → <strong>Day 18 Covercheck</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* 하단 — 판정 이후 심사 제출까지의 흐름 */}
        <div style={{
          marginTop: '0.55rem', flexShrink: 0,
          background: `linear-gradient(135deg, ${DAY14}08, ${DAY14}14)`,
          border: `1px solid ${DAY14}30`, borderRadius: '8px', padding: '0.45rem 0.85rem',
          display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '0.64rem', fontWeight: 800, color: DAY14 }}>클로저 워크플로우 · </span>
          {['홀 판정', '사유 기록(exclude.do)', '리포트 재생성', '심사 제출'].map((step, i, arr) => (
            <span key={step} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.dark, fontFamily: MONO }}>{step}</span>
              {i < arr.length - 1 && <span style={{ color: DAY14 }}>→</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
