'use client';

import { FPGA, slideBg, styles, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import KeywordTag from '../KeywordTag';

/**
 * Day 02 — 핵심 정리 + Q&A 슬라이드
 */
export default function QnASlide() {
  return (
    <>
      <section data-background-color={slideBg}>
        <div className="fpga-content-wrap">
          <SlideHeader title="Day 02 핵심 정리" />

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ ...styles.grid2, flex: 1, minHeight: 0 }}>
              <div style={styles.cardHighlight}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: FPGA.primary, marginBottom: '0.6rem' }}>
                  오늘 배운 것
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', lineHeight: 2.0, color: FPGA.text }}>
                  <li>Questa 제품군 구조 — Lint / Sim / Formal 의 역할</li>
                  <li>Questa Lint 프로젝트 구성 및 파일 준비</li>
                  <li>questa_lint 실행 명령어 및 콘솔 출력 해석</li>
                  <li>4가지 Lint 검사 카테고리 이해<br />
                    <span style={{ fontSize: '0.78rem', color: FPGA.textLight }}>
                      Syntactic · Semantic · Structural · Stylistic
                    </span>
                  </li>
                  <li>HTML 리포트 생성 및 위반 항목 확인</li>
                </ul>
              </div>

              <div style={styles.card}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.6rem' }}>
                  다음 시간 예고 (Day 03)
                </div>
                <p style={{ fontSize: '0.92rem', color: FPGA.text, lineHeight: 1.7, margin: '0 0 0.8rem' }}>
                  <strong>Questa Lint: 코딩 규칙 및 가이드라인 검증</strong><br />
                  Safety-Critical 프로젝트에 적용되는<br />
                  코딩 규칙 체계와 Policy 파일 커스터마이징을 학습합니다.
                </p>
                <KeywordTag keywords={['Coding Rules', 'Policy File', 'IEC 62566', 'Waiver', 'Guideline']} />
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
                Q&amp;A
              </p>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.92rem', color: FPGA.textLight }}>
                질문이 있으시면 자유롭게 말씀해 주세요.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
