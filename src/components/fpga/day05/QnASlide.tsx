'use client';

import { FPGA, slideBg, styles, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import KeywordTag from '../KeywordTag';

const DAY05 = '#C05621';

export default function QnASlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader title="Day 05 핵심 정리" />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div style={{ ...styles.grid2, flex: 1, minHeight: 0 }}>
            {/* 오늘 배운 것 */}
            <div style={{
              background: `linear-gradient(135deg, ${DAY05}08, ${DAY05}16)`,
              border: `1px solid ${DAY05}30`,
              borderRadius: '14px',
              padding: '1.3rem 1.5rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: DAY05, marginBottom: '0.6rem' }}>
                오늘 배운 것
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', lineHeight: 2.0, color: FPGA.text }}>
                <li>
                  합성 불가 구문 4 카테고리<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    Procedural · Delay · System Task · Sim Artifact — 18건 카탈로그
                  </span>
                </li>
                <li>
                  Blocking/NB 오용 4 패턴<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    CP15 · CP17 · CP18 · SS6 — = / &lt;= 오용 메커니즘
                  </span>
                </li>
                <li>
                  Race Condition 4 패턴<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    CP8 감도리스트 · SS3 combo loop · SS6 multi-driver · initial 비결정성
                  </span>
                </li>
                <li>
                  DO-254 goal 기반 Triage<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    lint methodology standard -goal DO-254 · alias 필터 · waiver 5종 금지
                  </span>
                </li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {/* 3줄 요약 */}
              <div style={{
                background: FPGA.white,
                border: `1px solid ${FPGA.border}`,
                borderLeft: `4px solid ${DAY05}`,
                borderRadius: '12px',
                padding: '0.8rem 1rem',
                boxShadow: shadow.card,
                flex: 1,
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.5rem' }}>
                  핵심 3줄 요약
                </div>
                {[
                  '합성 불가 구문 = 시뮬레이션만 통과하는 유령 로직',
                  'CP15 · CP17 · CP18 = `=` / `<=` 오용의 DO-254 alias 집합',
                  '`lint methodology standard -goal DO-254` = safety-critical 1차 방어선',
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', marginBottom: '4px' }}>
                    <span style={{
                      flexShrink: 0,
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: `${DAY05}15`, border: `1.5px solid ${DAY05}`,
                      color: DAY05, fontSize: '0.6rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: '"JetBrains Mono", monospace',
                      marginTop: '2px',
                    }}>{i + 1}</span>
                    <span style={{ fontSize: '0.76rem', color: FPGA.text, lineHeight: 1.55 }}>{t}</span>
                  </div>
                ))}
              </div>

              {/* 다음 시간 예고 */}
              <div style={{
                ...styles.card,
                borderTop: `3px solid #6B46C1`,
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.4rem' }}>
                  다음 시간 예고 (Day 06)
                </div>
                <p style={{ fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.55, margin: '0 0 0.5rem' }}>
                  <strong style={{ color: '#6B46C1' }}>문법 합성 OK, 회로 거동 NG</strong><br />
                  DO-254 CP · SS 잠재 위반 식별 — latch · case · width · X-prop · FSM.
                </p>
                <KeywordTag keywords={['SS4 latch', 'SS2 case', 'CP7 width', 'CP6 FSM', 'SS17 undriven']} />
              </div>
            </div>
          </div>

          {/* Q&A 배너 */}
          <div style={{
            textAlign: 'center',
            padding: '0.9rem 1.5rem',
            background: `linear-gradient(135deg, ${DAY05}08, ${DAY05}16)`,
            borderRadius: '14px',
            border: `1px solid ${DAY05}30`,
            boxShadow: shadow.card,
          }}>
            <p style={{ margin: 0, fontSize: '1.15rem', color: DAY05, fontWeight: 700 }}>
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
