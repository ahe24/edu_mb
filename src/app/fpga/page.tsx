'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FPGA } from '@/components/fpga/FpgaSlideStyles';

/** 월별 커리큘럼 데이터 */
const curriculum = [
  {
    month: 1,
    theme: '정적 분석 기초 및 코딩 규칙 검증',
    color: '#4A6FA5',
    weeks: [
      {
        week: 1, title: '교육 환경 구축 및 FPGA 검증 개론',
        days: [
          { day: 1, title: 'Safety-Critical FPGA 검증 프레임워크', ready: true },
          { day: 2, title: 'Questa 도구 환경 설정 및 기본 사용법', ready: false },
        ],
      },
      {
        week: 2, title: 'Questa Lint: 코딩 규칙 및 가이드라인 검증',
        days: [
          { day: 3, title: 'RTL 코딩 규칙 검증 기본', ready: false },
          { day: 4, title: '커스텀 규칙 설정 및 예외 처리', ready: false },
        ],
      },
      {
        week: 3, title: '정적 분석: 논리 구조 및 설계 결함 추출',
        days: [
          { day: 5, title: '합성 불가 구문 및 시뮬레이션-합성 불일치 검출', ready: false },
          { day: 6, title: '잠재적 설계 오류 식별', ready: false },
        ],
      },
      {
        week: 4, title: 'CDC(Clock Domain Crossing) 분석',
        days: [
          { day: 7, title: 'CDC 기초 이론 및 Questa CDC 소개', ready: false },
          { day: 8, title: 'CDC 분석 실습 및 결과 해석', ready: false },
        ],
      },
    ],
  },
  {
    month: 2,
    theme: '동적 시뮬레이션 및 커버리지 검증',
    color: '#5B8C5A',
    weeks: [
      {
        week: 5, title: 'QuestaSim 기본 및 Testbench 설계',
        days: [
          { day: 9, title: 'QuestaSim 환경 및 기본 시뮬레이션', ready: false },
          { day: 10, title: 'Testbench 구조 설계 원칙', ready: false },
        ],
      },
      {
        week: 6, title: '기능 시뮬레이션 단계별 검증',
        days: [
          { day: 11, title: '합성 전 기능 시뮬레이션', ready: false },
          { day: 12, title: '합성 후 및 Post-P&R 시뮬레이션', ready: false },
        ],
      },
      {
        week: 7, title: '커버리지(Coverage) 분석',
        days: [
          { day: 13, title: '코드 커버리지 측정 및 분석', ready: false },
          { day: 14, title: '기능 커버리지 및 커버리지 클로저 전략', ready: false },
        ],
      },
      {
        week: 8, title: 'Questa Autocheck & Covercheck',
        days: [
          { day: 15, title: 'Autocheck를 이용한 자동 속성 검증', ready: false },
          { day: 16, title: 'Covercheck를 이용한 커버리지 분석 보완', ready: false },
        ],
      },
    ],
  },
  {
    month: 3,
    theme: '형식 검증, 타이밍 분석 및 인허가 산출물',
    color: '#8B6FA5',
    weeks: [
      {
        week: 9, title: '형식 검증: 모델 및 등가성 확인',
        days: [
          { day: 17, title: '형식 검증 기초 이론', ready: false },
          { day: 18, title: '등가성 검증 실습', ready: false },
        ],
      },
      {
        week: 10, title: '타이밍 분석(STA) 및 후속 검증',
        days: [
          { day: 19, title: '정적 타이밍 분석 기본', ready: false },
          { day: 20, title: 'Post-P&R 타이밍 검증 및 최적화', ready: false },
        ],
      },
      {
        week: 11, title: '통합개발 툴 활용 및 결과물 관리',
        days: [
          { day: 21, title: 'Vivado/Libero 효율적 활용', ready: false },
          { day: 22, title: '검증 결과물의 신뢰도 확보 및 증빙 데이터 추출', ready: false },
        ],
      },
      {
        week: 12, title: 'V&V Report 작성 및 인허가 절차 종합',
        days: [
          { day: 23, title: 'V&V Report 작성 실습', ready: false },
          { day: 24, title: '인허가 절차 이해 및 종합 정리', ready: false },
        ],
      },
    ],
  },
];

export default function FpgaCurriculumPage() {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 50%, #F0F4F8 100%)',
      color: FPGA.text,
      padding: '2.5rem 2rem',
      fontFamily: '"Pretendard", -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <Link href="/" style={{
          fontSize: '0.8rem', color: FPGA.textLight, textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1rem',
        }}>
          ← 대시보드로 돌아가기
        </Link>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: FPGA.primaryBg, border: `1px solid ${FPGA.primaryLight}40`,
          borderRadius: '999px', padding: '4px 16px', marginBottom: '1rem',
          fontSize: '0.78rem', color: FPGA.primary, letterSpacing: '0.1em', fontWeight: 700,
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%', backgroundColor: FPGA.primary,
            display: 'inline-block', boxShadow: `0 0 6px ${FPGA.primary}`,
          }} />
          FPGA VERIFICATION COURSE
        </div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
          color: FPGA.dark, letterSpacing: '-0.03em', lineHeight: 1.2,
          marginBottom: '0.5rem',
        }}>
          Safety-Critical FPGA 설계 검증 교육
        </h1>
        <p style={{ fontSize: '1rem', color: FPGA.textLight, maxWidth: '520px', margin: '0 auto' }}>
          3개월 (12주) · 24회차 · 총 84시간 과정
        </p>
      </div>

      {/* 오리엔테이션 별도 항목 */}
      <div style={{ maxWidth: '960px', margin: '0 auto 2rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '0.8rem', paddingBottom: '0.6rem',
          borderBottom: `2px solid ${FPGA.primary}30`,
        }}>
          <span style={{
            background: `linear-gradient(135deg, ${FPGA.primary}, ${FPGA.dark})`,
            color: '#fff', fontSize: '0.82rem', fontWeight: 700,
            padding: '5px 16px', borderRadius: '8px',
            boxShadow: `0 2px 8px ${FPGA.primary}30`,
          }}>오리엔테이션</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, color: FPGA.dark }}>
            교육 대상·환경에 따라 별도 운영
          </span>
        </div>
        <Link href="/fpga/orientation" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            background: FPGA.white,
            border: `1px solid ${FPGA.primary}30`,
            borderLeft: `4px solid ${FPGA.primary}`,
            borderRadius: '12px',
            padding: '1rem 1.3rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  fontFamily: '"JetBrains Mono", monospace',
                  color: FPGA.primary,
                  background: FPGA.primaryBg,
                  padding: '2px 8px', borderRadius: '4px',
                  border: `1px solid ${FPGA.primary}25`,
                }}>ORIENTATION</span>
                <span style={{
                  fontSize: '0.62rem', fontWeight: 700, color: FPGA.success,
                  background: FPGA.successBg, padding: '1px 6px',
                  borderRadius: '3px', letterSpacing: '0.06em',
                }}>READY</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: FPGA.text, fontWeight: 500 }}>
                교육 과정 소개 · 3개월 로드맵 · EDA 도구 안내 · 실습 환경 확인
              </p>
            </div>
            <span style={{ marginLeft: 'auto', color: FPGA.primary, fontSize: '1.1rem' }}>→</span>
          </div>
        </Link>
      </div>

      {/* Month sections */}
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {curriculum.map((month) => (
          <div key={month.month} style={{ marginBottom: '2.5rem' }}>
            {/* Month header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '1rem', paddingBottom: '0.6rem',
              borderBottom: `2px solid ${month.color}30`,
            }}>
              <span style={{
                background: `linear-gradient(135deg, ${month.color}, ${month.color}dd)`,
                color: '#fff',
                fontSize: '0.82rem', fontWeight: 700,
                padding: '5px 16px', borderRadius: '8px',
                boxShadow: `0 2px 8px ${month.color}30`,
              }}>
                {month.month}개월차
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: FPGA.dark }}>
                {month.theme}
              </span>
            </div>

            {/* Weeks */}
            {month.weeks.map((week) => (
              <div key={week.week} style={{ marginBottom: '1rem', marginLeft: '0.5rem' }}>
                <div style={{
                  fontSize: '0.88rem', fontWeight: 600, color: FPGA.textLight,
                  marginBottom: '0.5rem',
                  fontFamily: '"JetBrains Mono", monospace',
                }}>
                  Week {week.week} — {week.title}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginLeft: '1rem' }}>
                  {week.days.map((day) => {
                    const isHovered = hoveredDay === day.day;
                    const DayWrapper = day.ready ? Link : 'div';
                    const dayProps = day.ready
                      ? { href: `/fpga/day${String(day.day).padStart(2, '0')}`, style: { textDecoration: 'none' } }
                      : {};

                    return (
                      // @ts-ignore
                      <DayWrapper key={day.day} {...dayProps}>
                        <div
                          onMouseEnter={() => day.ready && setHoveredDay(day.day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          style={{
                            background: isHovered
                              ? `linear-gradient(135deg, ${month.color}08, ${month.color}04)`
                              : FPGA.white,
                            border: `1px solid ${isHovered ? month.color + '40' : FPGA.border}`,
                            borderRadius: '12px',
                            padding: '0.9rem 1.1rem',
                            cursor: day.ready ? 'pointer' : 'default',
                            transition: 'all 0.25s ease',
                            transform: isHovered ? 'translateY(-3px)' : 'none',
                            boxShadow: isHovered
                              ? `0 8px 24px rgba(0,0,0,0.12), 0 2px 6px ${month.color}20`
                              : '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                            opacity: day.ready ? 1 : 0.6,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontSize: '0.72rem', fontWeight: 700,
                              fontFamily: '"JetBrains Mono", monospace',
                              color: day.ready ? month.color : FPGA.textLight,
                              background: day.ready ? `${month.color}12` : '#F7FAFC',
                              padding: '2px 8px', borderRadius: '4px',
                              border: `1px solid ${day.ready ? month.color + '25' : FPGA.border}`,
                            }}>
                              DAY {String(day.day).padStart(2, '0')}
                            </span>
                            {day.ready ? (
                              <span style={{
                                fontSize: '0.62rem', fontWeight: 700, color: FPGA.success,
                                background: FPGA.successBg, padding: '1px 6px',
                                borderRadius: '3px', letterSpacing: '0.06em',
                              }}>READY</span>
                            ) : (
                              <span style={{
                                fontSize: '0.62rem', fontWeight: 600, color: FPGA.textLight,
                                letterSpacing: '0.04em',
                              }}>준비중</span>
                            )}
                          </div>
                          <p style={{
                            margin: '0.4rem 0 0', fontSize: '0.88rem',
                            color: FPGA.text, fontWeight: 500, lineHeight: 1.4,
                          }}>
                            {day.title}
                          </p>
                        </div>
                      </DayWrapper>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ fontSize: '0.78rem', color: FPGA.textLight }}>
          © 2026 cs.jo · ED&C FPGA Verification Training
        </p>
      </div>
    </div>
  );
}
