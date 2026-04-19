'use client';

import { FPGA, slideBg, styles, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import KeywordTag from '../KeywordTag';

/**
 * Day 03 — 핵심 정리 + Q&A 슬라이드
 */
export default function QnASlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader title="Day 03 핵심 정리" />

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
                  FPGA Methodology 3단계 Goal<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    start → simulation → release (점진적 체크 강화) + Xilinx 특화 Goal
                  </span>
                </li>
                <li>
                  Clock 카테고리 핵심 룰<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    clock_gated · clock_internal · async_reset_active_high (FPGA vs 표준 비교)
                  </span>
                </li>
                <li>
                  Assignment 스타일 룰<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    Sequential ← ≤, Combinational ← =, 혼용 금지
                  </span>
                </li>
                <li>
                  Structural · FSM Safety 룰<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    combo_loop · latch_inferred · FSM 리셋/Dead-end/Unreachable 상태
                  </span>
                </li>
                <li>
                  DO-254 매핑 및 Waiver 관리<br />
                  <span style={{ fontSize: '0.74rem', color: FPGA.textLight }}>
                    CP/DR/SS 카테고리 · lint preference · lint off · status 체계
                  </span>
                </li>
              </ul>
            </div>

            {/* 핵심 요약 카드 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {/* 룰 카드 요약 */}
              <div style={{
                background: FPGA.white,
                border: `1px solid ${FPGA.border}`,
                borderRadius: '12px',
                padding: '0.7rem 0.9rem',
                boxShadow: shadow.card,
                flex: 1,
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.4rem' }}>
                  오늘의 핵심 규칙 한눈에
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                  {[
                    { rule: 'blocking_assign_in_seq_block', sev: 'E', color: '#E53E3E' },
                    { rule: 'combo_loop', sev: 'E', color: '#E53E3E' },
                    { rule: 'multi_driven_signal', sev: 'E', color: '#E53E3E' },
                    { rule: 'case_default_missing', sev: 'E', color: '#E53E3E' },
                    { rule: 'latch_inferred', sev: 'W', color: '#E8913A' },
                    { rule: 'fsm_without_reset_state', sev: 'E', color: '#E53E3E' },
                    { rule: 'fsm_with_deadend_state', sev: 'E', color: '#E53E3E' },
                    { rule: 'clock_gated', sev: 'W', color: '#E8913A' },
                  ].map(({ rule, sev, color }) => (
                    <div key={rule} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{
                        width: '16px', height: '16px', borderRadius: '3px',
                        background: `${color}18`, border: `1.5px solid ${color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.55rem', fontWeight: 800, color, flexShrink: 0,
                      }}>{sev}</span>
                      <code style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.6rem', color: FPGA.text }}>{rule}</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* 다음 시간 예고 */}
              <div style={styles.card}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.4rem' }}>
                  다음 시간 예고 (Day 04)
                </div>
                <p style={{ fontSize: '0.84rem', color: FPGA.text, lineHeight: 1.7, margin: '0 0 0.6rem' }}>
                  <strong>커스텀 규칙 설정 및 예외 처리</strong><br />
                  프로젝트 전용 Policy 파일 작성,<br />
                  RTL ID 기반 Waiver 자동화 및 리포트 통합 관리.
                </p>
                <KeywordTag keywords={['Policy File', 'RTL ID', 'Waiver 자동화', 'Custom Goal', 'Audit Trail']} />
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
