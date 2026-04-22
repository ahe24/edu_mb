'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY05 = '#C05621';
const DAY06 = '#6B46C1';

export default function LatentVsExplicitSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="도입"
          title="명시적 위반 vs 잠재 오류"
          subtitle="Day 05 (mismatch) ↔ Day 06 (latent) 경계 구분"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', position: 'relative' }}>
            {/* 중앙 구분선 */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%',
              width: 0, borderLeft: '2px dashed #CBD5E0',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }} />

            {/* 좌 — Day 05 */}
            <div style={{
              background: `linear-gradient(135deg, ${DAY05}06, ${DAY05}14)`,
              border: `1px solid ${DAY05}30`,
              borderTop: `3px solid ${DAY05}`,
              borderRadius: '14px',
              padding: '1.1rem 1.3rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.6rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.72rem', fontWeight: 800,
                  color: '#fff', background: DAY05,
                  padding: '3px 10px', borderRadius: '5px',
                  letterSpacing: '0.06em',
                }}>DAY 05</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: FPGA.dark }}>명시적 위반 (Mismatch)</span>
              </div>

              <div style={{ fontSize: '0.84rem', color: FPGA.text, lineHeight: 1.6 }}>
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  <li><strong>sim ≠ synth</strong> — 시뮬 단계에서 검출 가능</li>
                  <li>lint error 직접 탐지 · severity 명확</li>
                  <li>대표 alias: <code style={{ fontFamily: 'monospace', color: DAY05 }}>CP15 · CP17 · CP18 · SS3 · SS6</code></li>
                  <li>패턴: <code style={{ fontFamily: 'monospace' }}>= / &lt;=</code> 오용 · race · delay · unsynth</li>
                </ul>
              </div>

              <div style={{
                background: FPGA.white,
                border: `1px solid ${DAY05}25`,
                borderRadius: '8px',
                padding: '0.5rem 0.8rem',
                fontSize: '0.72rem', color: FPGA.text, lineHeight: 1.5,
                fontFamily: 'monospace',
              }}>
                ✓ <strong>증상</strong>: sim 동작 ≠ 보드 동작<br />
                ✓ <strong>탐지</strong>: lint <strong>Error</strong> severity 즉시 차단
              </div>
            </div>

            {/* 우 — Day 06 */}
            <div style={{
              background: `linear-gradient(135deg, ${DAY06}06, ${DAY06}14)`,
              border: `1px solid ${DAY06}30`,
              borderTop: `3px solid ${DAY06}`,
              borderRadius: '14px',
              padding: '1.1rem 1.3rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.6rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.72rem', fontWeight: 800,
                  color: '#fff', background: DAY06,
                  padding: '3px 10px', borderRadius: '5px',
                  letterSpacing: '0.06em',
                }}>DAY 06</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: FPGA.dark }}>잠재 오류 (Latent)</span>
              </div>

              <div style={{ fontSize: '0.84rem', color: FPGA.text, lineHeight: 1.6 }}>
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  <li><strong>sim = synth</strong> — but 의도와 불일치</li>
                  <li>대부분 <strong>Warning</strong> 등급 · 의도적 판독 필요</li>
                  <li>대표 alias: <code style={{ fontFamily: 'monospace', color: DAY06 }}>SS4 · SS2 · CP7 · SS17/18 · CP5/6</code></li>
                  <li>패턴: latch · incomplete case · width truncation · X-prop</li>
                </ul>
              </div>

              <div style={{
                background: FPGA.white,
                border: `1px solid ${DAY06}25`,
                borderRadius: '8px',
                padding: '0.5rem 0.8rem',
                fontSize: '0.72rem', color: FPGA.text, lineHeight: 1.5,
                fontFamily: 'monospace',
              }}>
                ✓ <strong>증상</strong>: 시험 통과 · 실환경 미세 오동작<br />
                ✓ <strong>탐지</strong>: 합성 리포트 교차 검증 필요
              </div>
            </div>
          </div>

          {/* 하단 배너 */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY06}08, ${DAY06}18)`,
            border: `1px solid ${DAY06}35`,
            borderLeft: `4px solid ${DAY06}`,
            borderRadius: '10px',
            padding: '0.7rem 1rem',
            fontSize: '0.82rem',
            color: FPGA.text,
            lineHeight: 1.6,
            boxShadow: shadow.card,
            display: 'flex', alignItems: 'center', gap: '0.7rem',
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="9" stroke={DAY06} strokeWidth="2" fill={`${DAY06}15`} />
              <path d="M11 6v5l3 2" stroke={DAY06} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div>
              <strong style={{ color: DAY06 }}>잠재 오류 = 코드 리뷰에서 놓치기 쉬움</strong>
              — lint 자동화 + 합성 리포트 교차 검증이 safety-critical 필수 절차.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
