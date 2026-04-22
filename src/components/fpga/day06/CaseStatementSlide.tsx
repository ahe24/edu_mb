'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY06 = '#6B46C1';

type Sub = {
  id: string;
  subAlias: string;
  title: string;
  syntax: string;
  risk: string;
  check: string[];
  sev: 'E' | 'W' | 'I';
};

const subs: Sub[] = [
  {
    id: 'ST1', subAlias: 'SS2-a',
    title: 'plain `case` + default 누락',
    syntax: 'case (sel)\n  2\'b00: y = a;\n  2\'b01: y = b;\nendcase',
    risk: '미매칭 시 이전 값 유지 → latch 추론 (SS4 동반)',
    check: ['case_default_missing'],
    sev: 'E',
  },
  {
    id: 'ST2', subAlias: 'SS2-b',
    title: '`casex` / `casez` don\'t-care',
    syntax: 'casex (sel)\n  2\'b?0: y = a;  // x/z 해석',
    risk: 'sim/synth 해석 상이 · safety-critical 도메인 사용 금지 권고',
    check: ['case_with_x_z', 'casex', 'casez'],
    sev: 'W',
  },
  {
    id: 'ST3', subAlias: 'SS2-c',
    title: '`unique case` 중복 매칭',
    syntax: 'unique case (sel)\n  3\'b00?: …\n  3\'b001: …   // overlap',
    risk: 'sim 런타임 error · synth 무시 → 회로 오동작',
    check: ['case_item_duplicate'],
    sev: 'E',
  },
  {
    id: 'ST4', subAlias: '(SS2 외)',
    title: '`priority` vs `parallel`',
    syntax: 'priority case (sel) …\nparallel case (sel) …',
    risk: 'priority: 자원 폭증 · parallel: 중첩 입력 시 X',
    check: ['parallel_case_violation', 'full_case_violation'],
    sev: 'I',
  },
];

function SevBadge({ sev }: { sev: Sub['sev'] }) {
  const col = sev === 'E' ? '#E53E3E' : sev === 'W' ? '#E8913A' : '#718096';
  return (
    <span style={{
      fontSize: '0.58rem', fontWeight: 800, color: '#fff',
      background: col,
      padding: '2px 7px', borderRadius: '4px',
      letterSpacing: '0.06em',
      fontFamily: '"JetBrains Mono", monospace',
    }}>{sev}</span>
  );
}

export default function CaseStatementSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="DO-254 · SS2"
          title="Case 불완전성"
          subtitle="`SS2 — Case 문 완전 명세` · Error · case/casex/casez/unique/priority"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* alias 배너 */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY06}08, ${DAY06}16)`,
            border: `1px solid ${DAY06}35`,
            borderLeft: `4px solid ${DAY06}`,
            borderRadius: '10px',
            padding: '0.55rem 0.9rem',
            fontSize: '0.75rem',
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            boxShadow: shadow.card,
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.78rem', fontWeight: 800,
              color: '#fff', background: DAY06,
              padding: '3px 10px', borderRadius: '5px',
              letterSpacing: '0.06em',
            }}>SS2</span>
            <span style={{ color: FPGA.text, flex: 1, lineHeight: 1.5 }}>
              <strong>Case 문 완전 명세</strong> — default 누락 시 latch 추론 · <strong style={{ color: '#E53E3E' }}>Error</strong> severity · safety-critical 도메인 <code style={{ fontFamily: 'monospace' }}>casex</code> 금지 권고.
            </span>
          </div>

          {/* 4 서브 토픽 */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '0.55rem',
          }}>
            {subs.map((s) => (
              <div key={s.id} style={{
                background: FPGA.white,
                border: `1px solid ${DAY06}25`,
                borderLeft: `4px solid ${DAY06}`,
                borderRadius: '10px',
                padding: '0.55rem 0.8rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.4rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = shadow.cardHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = shadow.card;
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.62rem', fontWeight: 800,
                    color: '#fff', background: DAY06,
                    padding: '2px 7px', borderRadius: '4px',
                  }}>{s.id} · {s.subAlias}</span>
                  <SevBadge sev={s.sev} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: FPGA.dark }}>
                    {s.title}
                  </span>
                </div>

                <pre style={{
                  margin: 0, fontSize: '0.62rem', lineHeight: 1.45,
                  background: '#1A2235', color: '#DCDCDC',
                  padding: '5px 7px', borderRadius: '5px',
                  fontFamily: '"JetBrains Mono", monospace',
                  whiteSpace: 'pre-wrap',
                }}>{s.syntax}</pre>

                <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>
                  <strong style={{ color: '#E53E3E' }}>▲ 리스크: </strong>
                  {s.risk}
                </div>

                <div style={{
                  display: 'flex', gap: '8px', flexWrap: 'wrap',
                  paddingTop: '3px',
                  borderTop: '1px dashed #E2E8F0',
                }}>
                  {s.check.map((c) => (
                    <code key={c} style={{
                      fontSize: '0.6rem', color: FPGA.primary,
                      fontFamily: 'monospace',
                    }}>{c}</code>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 하단 safety-critical 주의 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.12))',
            border: '1px solid rgba(229,62,62,0.30)',
            borderRadius: '8px',
            padding: '0.5rem 0.9rem',
            fontSize: '0.72rem',
            color: FPGA.text,
            display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}>
            <span style={{ color: '#E53E3E', fontWeight: 800 }}>safety-critical 주의:</span>
            <span>
              <code style={{ fontFamily: 'monospace' }}>casex</code> · <code style={{ fontFamily: 'monospace' }}>casez</code> 도메인 사용 금지 권고 · DO-254 SS2-b 위반 시 CAPA 대상. 명시적 <code style={{ fontFamily: 'monospace' }}>case</code> + <code style={{ fontFamily: 'monospace' }}>default</code> 사용.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
