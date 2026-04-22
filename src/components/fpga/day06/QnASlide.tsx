'use client';

import { FPGA, slideBg, styles, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import KeywordTag from '../KeywordTag';

const DAY06 = '#6B46C1';

export default function QnASlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader title="Day 06 핵심 정리" />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div style={{ ...styles.grid2, flex: 1, minHeight: 0 }}>
            {/* 오늘 배운 것 */}
            <div style={{
              background: `linear-gradient(135deg, ${DAY06}08, ${DAY06}16)`,
              border: `1px solid ${DAY06}30`,
              borderRadius: '14px',
              padding: '1.3rem 1.5rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: DAY06, marginBottom: '0.6rem' }}>
                오늘 배운 것
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', lineHeight: 2.0, color: FPGA.text }}>
                <li>
                  Latch Inference (SS4)<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    else/default/분기 누락 3 원인 · DO-254 §6.2.1 초기화 요건
                  </span>
                </li>
                <li>
                  Case 불완전성 (SS2)<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    default 누락 · casex don&apos;t-care · unique 중복 · parallel/priority
                  </span>
                </li>
                <li>
                  Width · X-Propagation<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    CP7 (비트폭) · SS17 (undriven) · SS18 (reset 제어) · DAL-A/B 상향
                  </span>
                </li>
                <li>
                  FSM 안전성 (CP5 · CP6)<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    unreachable · deadend · safe transition · SEU 복구 경로
                  </span>
                </li>
                <li>
                  합성 리포트 교차 검증<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    lint + Vivado/Libero synth log 2중 확인 — safety-critical 필수
                  </span>
                </li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {/* 3줄 요약 */}
              <div style={{
                background: FPGA.white,
                border: `1px solid ${FPGA.border}`,
                borderLeft: `4px solid ${DAY06}`,
                borderRadius: '12px',
                padding: '0.8rem 1rem',
                boxShadow: shadow.card,
                flex: 1,
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.5rem' }}>
                  핵심 3줄 요약
                </div>
                {[
                  '잠재 오류 = 합성 통과 · 의도 불일치',
                  'DO-254 alias 5축: SS4(latch) · SS2(case) · CP7(width) · SS17/18(X-prop) · CP5/6(FSM)',
                  'alias 기반 triage + 합성 리포트 교차 검증 = safety-critical 필수 절차',
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', marginBottom: '4px' }}>
                    <span style={{
                      flexShrink: 0,
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: `${DAY06}15`, border: `1.5px solid ${DAY06}`,
                      color: DAY06, fontSize: '0.6rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: '"JetBrains Mono", monospace',
                      marginTop: '2px',
                    }}>{i + 1}</span>
                    <span style={{ fontSize: '0.75rem', color: FPGA.text, lineHeight: 1.55 }}>{t}</span>
                  </div>
                ))}
              </div>

              {/* Week 4 예고 */}
              <div style={{
                ...styles.card,
                borderTop: `3px solid #4A6FA5`,
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.4rem' }}>
                  다음 주 예고 (Week 4 · Day 07~08)
                </div>
                <p style={{ fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.55, margin: '0 0 0.5rem' }}>
                  <strong style={{ color: '#4A6FA5' }}>Clock Domain Crossing (CDC) 분석</strong><br />
                  다중 클록 도메인 간 데이터 전송 · metastability · synchronizer 설계 · Questa CDC 실습.
                </p>
                <KeywordTag keywords={['CDC', 'Metastability', 'Synchronizer', 'qverify cdc', 'DO-254 §6.2']} />
              </div>
            </div>
          </div>

          {/* Q&A 배너 */}
          <div style={{
            textAlign: 'center',
            padding: '0.9rem 1.5rem',
            background: `linear-gradient(135deg, ${DAY06}08, ${DAY06}16)`,
            borderRadius: '14px',
            border: `1px solid ${DAY06}30`,
            boxShadow: shadow.card,
          }}>
            <p style={{ margin: 0, fontSize: '1.15rem', color: DAY06, fontWeight: 700 }}>
              Q&amp;A
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: FPGA.textLight }}>
              질문 자유롭게.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
