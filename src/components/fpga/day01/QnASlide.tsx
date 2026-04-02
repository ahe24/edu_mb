'use client';

import { FPGA, slideBg, styles, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import KeywordTag from '../KeywordTag';

/**
 * Day 01 — 핵심 정리 + Q&A 슬라이드
 * (실습 환경 확인은 오리엔테이션에서 별도 처리 — LabEnvSlide.tsx)
 */
export default function QnASlide() {
  return (
    <>
      {/* ── 슬라이드: Day 01 정리 ── */}
      <section data-background-color={slideBg}>
        <SlideHeader title="Day 01 핵심 정리" />

        <div style={{ ...styles.grid2, marginBottom: '1.2rem' }}>
          <div style={styles.cardHighlight}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: FPGA.primary, marginBottom: '0.6rem' }}>
              오늘 배운 것
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', lineHeight: 2.0, color: FPGA.text }}>
              <li>Safety-Critical FPGA의 특수성과 안전 등급 체계</li>
              <li>V&V 절차 (Verification vs Validation)</li>
              <li>정적 분석 vs 동적 검증의 역할 분담</li>
              <li>Shift-Left: 조기 결함 발견의 중요성</li>
            </ul>
          </div>

          <div style={styles.card}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.6rem' }}>
              다음 시간 예고 (Day 02)
            </div>
            <p style={{ fontSize: '0.92rem', color: FPGA.text, lineHeight: 1.7, margin: '0 0 0.8rem' }}>
              <strong>Questa 도구 환경 설정 및 기본 사용법</strong><br />
              Questa 제품군 아키텍처를 이해하고,<br />
              Questa Lint의 첫 실행 및 결과 리포트를 확인합니다.
            </p>
            <KeywordTag keywords={['Questa Lint', 'Project Setup', 'First Run', 'Report']} />
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '1rem 1.5rem',
          width: '100%',
          background: `linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.12))`,
          borderRadius: '14px',
          border: `1px solid ${FPGA.primaryLight}20`,
          boxShadow: shadow.card,
        }}>
          <p style={{ margin: 0, fontSize: '1.2rem', color: FPGA.primary, fontWeight: 700 }}>
            Q&A
          </p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.92rem', color: FPGA.textLight }}>
            질문이 있으시면 자유롭게 말씀해 주세요.
          </p>
        </div>
      </section>
    </>
  );
}
