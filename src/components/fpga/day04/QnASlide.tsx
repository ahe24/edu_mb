'use client';

import { FPGA, slideBg, styles, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import KeywordTag from '../KeywordTag';

/**
 * Day 04 — 핵심 정리 + Q&A 슬라이드
 */
export default function QnASlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader title="Day 04 핵심 정리" />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {/* 상단 2열 */}
          <div style={{ ...styles.grid2, flex: 1, minHeight: 0 }}>
            {/* 오늘 배운 것 */}
            <div style={styles.cardHighlight}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: FPGA.primary, marginBottom: '0.6rem' }}>
                오늘 배운 것
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', lineHeight: 2.0, color: FPGA.text }}>
                <li>
                  정책 파일 3계층 구조<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    Methodology Goal → Project Preference → Module Waiver · 하향식 오버라이드
                  </span>
                </li>
                <li>
                  lint preference 심화<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    Naming · Reset · Clock · Case · Flop 카테고리별 세부 옵션
                  </span>
                </li>
                <li>
                  Custom Goal 파생<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    lint generate goal · do254/벤더/IP 목적별 분리 운용
                  </span>
                </li>
                <li>
                  Waiver 4방식 비교<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    pragma · lint off · lint suppress · lint report item — 감사 적합성 A→D
                  </span>
                </li>
                <li>
                  RTL ID 기반 감사 추적<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    status history · CI baseline diff · DO-254 waiver 4필드
                  </span>
                </li>
              </ul>
            </div>

            {/* 핵심 요약 카드 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {/* 실무 체크리스트 */}
              <div style={{
                background: FPGA.white,
                border: `1px solid ${FPGA.border}`,
                borderRadius: '12px',
                padding: '0.7rem 0.9rem',
                boxShadow: shadow.card,
                flex: 1,
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.4rem' }}>
                  실무 체크리스트 — 프로젝트 킥오프 시
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { t: '정책 파일 디렉토리 구조 확정', done: true },
                    { t: 'base_goal.tcl · project_prefs.tcl 초안', done: true },
                    { t: 'Custom Goal (안전등급별) 생성', done: true },
                    { t: 'Waiver 템플릿 (4필드 REASON) 준비', done: true },
                    { t: 'CI baseline 기준 commit 지정', done: true },
                    { t: 'status history 리포트 자동 수집 설정', done: true },
                  ].map((x, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <rect x="1" y="1" width="11" height="11" rx="2.5" fill="rgba(72,187,120,0.12)" stroke="#48BB78" strokeWidth="1.2" />
                        <path d="M3.5 6.8l2 2 4-4.5" stroke="#48BB78" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                      <span style={{ fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.5 }}>{x.t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 다음 시간 예고 */}
              <div style={styles.card}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.4rem' }}>
                  다음 시간 예고 (Day 05)
                </div>
                <p style={{ fontSize: '0.8rem', color: FPGA.text, lineHeight: 1.6, margin: '0 0 0.5rem' }}>
                  <strong>합성 불가 구문 및 시뮬레이션-합성 불일치 검출</strong><br />
                  initial·delay·event 구문의 합성 제약,
                  blocking vs non-blocking 오용으로 인한
                  sim/synth mismatch 패턴 검출.
                </p>
                <KeywordTag keywords={['Unsynthesizable', 'Sim-Synth Mismatch', 'Race Condition', 'Delay Statement']} />
              </div>
            </div>
          </div>

          {/* Q&A 배너 */}
          <div style={{
            textAlign: 'center',
            padding: '0.9rem 1.5rem',
            background: `linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.12))`,
            borderRadius: '14px',
            border: `1px solid ${FPGA.primaryLight}20`,
            boxShadow: shadow.card,
          }}>
            <p style={{ margin: 0, fontSize: '1.15rem', color: FPGA.primary, fontWeight: 700 }}>
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
