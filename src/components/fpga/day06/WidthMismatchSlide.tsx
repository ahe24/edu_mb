'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY06 = '#6B46C1';

const types = [
  {
    id: 'W1',
    title: 'Overflow',
    subtitle: '좌 < 우 · 상위 비트 절단',
    icon: '▲',
    desc: '카운터·누적기 wrap-around → silent 데이터 손실',
    check: 'assign_width_overflow',
    color: '#E53E3E',
  },
  {
    id: 'W2',
    title: 'Underflow',
    subtitle: '좌 > 우 · zero/sign 확장',
    icon: '▼',
    desc: 'signed/unsigned 확장 의도 상이 → 부호 오류',
    check: 'assign_width_underflow',
    color: '#E8913A',
  },
  {
    id: 'W3',
    title: 'Signed/Unsigned',
    subtitle: '혼용 비교 연산',
    icon: '±',
    desc: '비교 결과 왜곡 · 음수 값 양수 해석',
    check: 'comparison_width_mismatch\nexpr_operands_width_mismatch',
    color: '#8B6FA5',
  },
  {
    id: 'W4',
    title: 'Case Selector',
    subtitle: 'selector bit ≠ label bit',
    icon: '≠',
    desc: '4개 label 매칭 불가 bit 패턴 존재 · 설계 결함',
    check: 'case_width_mismatch',
    color: '#4A6FA5',
  },
];

export default function WidthMismatchSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="DO-254 · CP7"
          title="비트폭 · 부호 불일치"
          subtitle="`CP7 — 비트폭 정합성` · Warning (DAL-A/B Error 상향 권장)"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* alias 배너 */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY06}08, ${DAY06}14)`,
            border: `1px solid ${DAY06}35`,
            borderLeft: `4px solid ${DAY06}`,
            borderRadius: '10px',
            padding: '0.5rem 0.9rem',
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            boxShadow: shadow.card,
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.76rem', fontWeight: 800,
              color: '#fff', background: DAY06,
              padding: '3px 10px', borderRadius: '5px',
            }}>CP7</span>
            <span style={{ fontSize: '0.78rem', color: FPGA.text, flex: 1 }}>
              safety-critical: <strong>DAL-A/B</strong> 에서는 <strong style={{ color: '#E53E3E' }}>Error 상향 필수</strong> — 측정·제어 경로에서 silent 데이터 손실 차단.
            </span>
          </div>

          {/* 4 유형 아이콘 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem' }}>
            {types.map((t) => (
              <div key={t.id} style={{
                background: FPGA.white,
                border: `1px solid ${t.color}30`,
                borderTop: `3px solid ${t.color}`,
                borderRadius: '10px',
                padding: '0.6rem 0.7rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: `${t.color}15`, border: `1.5px solid ${t.color}`,
                    color: t.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', fontWeight: 900,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}>{t.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.58rem', fontWeight: 700, color: t.color, letterSpacing: '0.06em', fontFamily: 'monospace' }}>
                      {t.id} · CP7
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: FPGA.dark }}>
                      {t.title}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.64rem', color: FPGA.textLight, fontStyle: 'italic' }}>
                  {t.subtitle}
                </div>
                <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>
                  {t.desc}
                </div>
                <code style={{
                  fontSize: '0.56rem', color: FPGA.primary,
                  fontFamily: 'monospace', whiteSpace: 'pre-wrap',
                  paddingTop: '3px',
                  borderTop: '1px dashed #E2E8F0',
                }}>{t.check}</code>
              </div>
            ))}
          </div>

          {/* 하단 예제 코드 */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.55rem',
          }}>
            <div style={{
              background: '#1A2235',
              borderRadius: '10px',
              padding: '0.7rem 0.9rem',
              borderLeft: '3px solid #E53E3E',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.3rem',
            }}>
              <div style={{ fontSize: '0.62rem', color: '#E53E3E', fontWeight: 800, letterSpacing: '0.06em' }}>
                ✗ 예제 — W1 Overflow (상위 8bit 소실)
              </div>
              <pre style={{
                margin: 0, fontSize: '0.72rem', color: '#F0A0A0', lineHeight: 1.55,
                fontFamily: '"JetBrains Mono", monospace',
              }}>
{`reg  [7:0]  a;
reg  [15:0] b;

assign a = b;          // CP7-W1
// 상위 8bit 경고없이 절단
// 시뮬레이터도 경고 없이 통과`}
              </pre>
            </div>

            <div style={{
              background: '#1A2235',
              borderRadius: '10px',
              padding: '0.7rem 0.9rem',
              borderLeft: '3px solid #48BB78',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.3rem',
            }}>
              <div style={{ fontSize: '0.62rem', color: '#48BB78', fontWeight: 800, letterSpacing: '0.06em' }}>
                ✓ 수정 — 의도 명시 · 슬라이스 지정
              </div>
              <pre style={{
                margin: 0, fontSize: '0.72rem', color: '#A8D8A8', lineHeight: 1.55,
                fontFamily: '"JetBrains Mono", monospace',
              }}>
{`reg  [7:0]  a;
reg  [15:0] b;

assign a = b[7:0];     // 의도 명시
// or: assign a = (b > 255) ? 8'hFF : b[7:0];
//     (saturation clipping)`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
