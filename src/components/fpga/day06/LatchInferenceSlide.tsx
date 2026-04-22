'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY06 = '#6B46C1';

const causes = [
  {
    id: 'C1',
    title: 'if 없는 else',
    desc: '`always @(*)` 내 else 누락 · 이전 값 유지 → 묵시적 memory',
    code: 'always @(*) if (en) q = d;',
    check: ['latch_inferred', 'if_stmt_without_else'],
  },
  {
    id: 'C2',
    title: 'case default 누락',
    desc: 'SS2와 중첩 발생 · 미매칭 입력에서 이전 값 유지',
    code: 'case (sel)\n  2\'b00: y = a;\n  2\'b01: y = b;\nendcase',
    check: ['case_default_missing'],
  },
  {
    id: 'C3',
    title: '분기 미커버',
    desc: '조건부 할당에서 일부 신호 분기 누락',
    code: 'if (en) begin\n  q1 = d;\n  // q2 미할당\nend',
    check: ['latch_inferred'],
  },
];

export default function LatchInferenceSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="DO-254 · SS4"
          title="Latch Inference"
          subtitle="`SS4 — 래치 추론 금지` · Warning · DAL-A/B 수정 필수"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* alias 배너 */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY06}08, ${DAY06}16)`,
            border: `1px solid ${DAY06}35`,
            borderLeft: `4px solid ${DAY06}`,
            borderRadius: '10px',
            padding: '0.55rem 0.9rem',
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            boxShadow: shadow.card,
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.78rem', fontWeight: 800,
              color: '#fff', background: DAY06,
              padding: '3px 10px', borderRadius: '5px',
              letterSpacing: '0.06em',
            }}>SS4</span>
            <div style={{ fontSize: '0.8rem', color: FPGA.text, flex: 1, lineHeight: 1.55 }}>
              DO-254 Severity: <strong style={{ color: '#E8913A' }}>Warning</strong> — DAL-A/B 대상 프로젝트는 <strong>Error 상향 권장</strong>
            </div>
            <code style={{
              fontSize: '0.66rem', background: '#1A2235', color: '#A8D8A8',
              padding: '3px 8px', borderRadius: '4px', fontFamily: 'monospace',
            }}>latch_inferred</code>
          </div>

          {/* 3 원인 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.55rem' }}>
            {causes.map((c) => (
              <div key={c.id} style={{
                background: FPGA.white,
                border: `1px solid ${DAY06}25`,
                borderTop: `3px solid ${DAY06}`,
                borderRadius: '10px',
                padding: '0.6rem 0.75rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.4rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.64rem', fontWeight: 800,
                    color: DAY06, background: `${DAY06}15`,
                    border: `1px solid ${DAY06}40`,
                    padding: '2px 7px', borderRadius: '4px',
                  }}>{c.id}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: FPGA.dark }}>{c.title}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.5 }}>
                  {c.desc}
                </div>
                <pre style={{
                  margin: 0, fontSize: '0.6rem', lineHeight: 1.4,
                  background: '#1A2235', color: '#F0A0A0',
                  padding: '5px 7px', borderRadius: '5px',
                  borderLeft: '2px solid #E53E3E',
                  fontFamily: '"JetBrains Mono", monospace',
                  whiteSpace: 'pre-wrap',
                }}>{c.code}</pre>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {c.check.map((k) => (
                    <code key={k} style={{
                      fontSize: '0.58rem',
                      color: FPGA.textLight,
                      fontFamily: 'monospace',
                    }}>{k}</code>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Before/After + safety-critical 영향 */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.6rem' }}>
            {/* Before/After */}
            <div style={{
              background: FPGA.white,
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '0.6rem 0.8rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: FPGA.dark }}>
                수정 예시 — C1 `if 없는 else`
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', flex: 1 }}>
                <div style={{
                  background: '#1A2235', color: '#F0A0A0',
                  padding: '0.5rem 0.7rem', borderRadius: '6px',
                  borderLeft: '3px solid #E53E3E',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.66rem', lineHeight: 1.5,
                }}>
                  <div style={{ fontSize: '0.58rem', color: '#E53E3E', fontWeight: 800, marginBottom: '3px', letterSpacing: '0.06em' }}>✗ BEFORE · 래치 추론</div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`always @(*) begin
  if (en) q = d;
  // else 없음 → latch
end`}
                  </pre>
                </div>
                <div style={{
                  background: '#1A2235', color: '#A8D8A8',
                  padding: '0.5rem 0.7rem', borderRadius: '6px',
                  borderLeft: '3px solid #48BB78',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.66rem', lineHeight: 1.5,
                }}>
                  <div style={{ fontSize: '0.58rem', color: '#48BB78', fontWeight: 800, marginBottom: '3px', letterSpacing: '0.06em' }}>✓ AFTER · 완전 분기</div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`always @(*) begin
  if (en) q = d;
  else    q = 1'b0;
end`}
                  </pre>
                </div>
              </div>
            </div>

            {/* safety-critical 영향 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.12))',
              border: '1px solid rgba(229,62,62,0.30)',
              borderLeft: '4px solid #E53E3E',
              borderRadius: '10px',
              padding: '0.65rem 0.8rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#E53E3E' }}>
                safety-critical 영향
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.55 }}>
                <li>의도치 않은 memory → 미초기화 · 랜덤 시작 거동</li>
                <li>GSR 우회 → 리셋 불가 영역 · DO-254 §6.2.1 위반</li>
                <li>FF 대비 latch 합성 자원·타이밍 제약</li>
                <li>IEC 62566 초기화 요건 동일 적용</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
