'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import ProvidedFileModal from '../ProvidedFileModal';

const DAY14 = '#0B7285';
const ORANGE = '#E8913A';
const GREEN = '#48BB78';
const BLUE = '#4A6FA5';
const PURPLE = '#8B6FA5';
const RED = '#E53E3E';
const MONO = '"JetBrains Mono", monospace';

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
const DECISIONS: { key: Dec; n: string; title: string; when: string; action: string; color: string }[] = [
  { key: 'add', n: '①', title: '테스트 추가', when: '자극 부재로 미도달', action: '시나리오 보강 후 재측정 (실습2)', color: BLUE },
  { key: 'excl', n: '②', title: '제외 (waiver)', when: '원천 도달불가 (방어코드 등)', action: 'coverage exclude + 사유 주석', color: ORANGE },
  { key: 'bug', n: '③', title: '설계 수정', when: '죽은 코드 · 잘못된 조건 발견', action: 'RTL 결함 수정 후 재검증', color: RED },
];

export default function ClosureSlide() {
  const [sel, setSel] = useState<Dec>('excl');
  const cur = DECISIONS.find((d) => d.key === sel)!;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 4 · 커버리지 클로저"
          title="남은 홀을 하나도 남김없이 판정"
          subtitle="클로저 = 모든 홀이 세 판정 중 하나로 정리된 상태 · 사유 없는 미달로 종료 금지"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* ── 좌: 3-way 판정 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '9px',
              padding: '0.45rem 0.7rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.62rem', color: FPGA.text }}>
                <strong style={{ color: DAY14 }}>남은 홀 하나</strong> → 셋 중 하나로 판정 (클릭)
              </span>
            </div>

            {/* 판정 카드 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {DECISIONS.map((d) => {
                const active = sel === d.key;
                return (
                  <button key={d.key} onClick={() => setSel(d.key)} style={{
                    cursor: 'pointer', textAlign: 'left',
                    background: active ? `${d.color}12` : FPGA.white,
                    border: `1px solid ${active ? d.color : FPGA.border}`,
                    borderLeft: `4px solid ${d.color}`,
                    borderRadius: '9px', padding: '0.45rem 0.7rem',
                    boxShadow: active ? shadow.card : 'none',
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                  }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: d.color, flexShrink: 0 }}>{d.n}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark }}>{d.title}</div>
                      <div style={{ fontSize: '0.58rem', color: FPGA.textLight, lineHeight: 1.4 }}>
                        <span style={{ color: d.color, fontWeight: 700 }}>언제 </span>{d.when} · <span style={{ color: d.color, fontWeight: 700 }}>조치 </span>{d.action}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* trip_fsm 적용 예 */}
            <div style={{
              flex: 1, minHeight: 0,
              background: `linear-gradient(135deg, ${cur.color}0A, ${cur.color}16)`,
              border: `1px solid ${cur.color}35`, borderRadius: '9px',
              padding: '0.5rem 0.8rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: cur.color, marginBottom: '0.15rem' }}>
                trip_fsm 적용 — {cur.title}
              </div>
              <div style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.5 }}>
                {sel === 'add' && <>WARN→MONITOR 회복, en=0, clear 미도달 → 자극 부재일 뿐 · <strong>실습2 보강</strong>으로 해소.</>}
                {sel === 'excl' && <><code>default:</code> 는 state 2비트 전수라 <strong style={{ color: RED }}>어떤 자극으로도 도달 불가</strong> → 사유 남기고 제외 · 방어코드는 유지.</>}
                {sel === 'bug' && <>도달해야 할 분기가 끝내 미실행 → 조건식·죽은 코드 의심 · <strong>설계 결함</strong> 가능성.</>}
              </div>
            </div>
          </div>

          {/* ── 우: exclude.do + 클로저 결과 + 함정 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <ProvidedFileModal
              filename="exclude.do"
              accent={ORANGE}
              hint={<>제외 판정 스크립트 — 사유(-comment)는 심사 증적 (제공)</>}
              modalSubtitle="사유(-comment)는 HTML 리포트 툴팁 = 심사 증적 · exclude.do 는 형상관리 대상"
              code={excludeCode}
            />

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
      </div>
    </section>
  );
}
