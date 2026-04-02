'use client';

import { FPGA, slideBg, styles } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * 실습 환경 확인 슬라이드 — 오리엔테이션 전용
 * (교육 대상·환경에 따라 체크리스트 항목 수정 가능)
 */
export default function LabEnvSlide() {
  return (
    <section data-background-color={slideBg}>
      <SlideHeader
        title="실습 환경 확인"
        subtitle="Lab Environment Check"
      />

      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: FPGA.primary, marginBottom: '0.8rem' }}>
            확인 항목 체크리스트
          </div>
          {[
            'Questa 라이선스 서버 접속 가능 여부',
            'QuestaSim GUI 실행 확인',
            'Questa Lint 명령어 실행 테스트',
            '예제 RTL 파일 컴파일 테스트',
            '네트워크 및 파일 공유 경로 확인',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '0.5rem 0.4rem',
              borderBottom: `1px solid ${FPGA.border}`,
              fontSize: '0.9rem',
            }}>
              <span style={{
                width: '20px', height: '20px',
                border: `2px solid ${FPGA.primary}`,
                borderRadius: '5px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '0.7rem',
                color: FPGA.primary,
                background: FPGA.primaryBg,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>✓</span>
              <span style={{ color: FPGA.text }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={styles.cardWarning}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: FPGA.accent, marginBottom: '0.8rem' }}>
            문제 발생 시
          </div>
          <p style={{ fontSize: '0.92rem', color: FPGA.text, lineHeight: 1.7, margin: 0 }}>
            라이선스 오류, 네트워크 접속 불가 등의 문제가 있는 경우
            실습 시간에 개별적으로 해결하겠습니다.
          </p>
          <p style={{ fontSize: '0.92rem', color: FPGA.text, lineHeight: 1.7, marginTop: '0.8rem', marginBottom: 0 }}>
            모든 실습 환경이 정상 동작해야
            다음 차시(Day 01)의 교육 실습에 무리 없이 진입할 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
