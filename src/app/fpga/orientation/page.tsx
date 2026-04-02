'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day01/TitleSlide';
import AgendaSlide from '@/components/fpga/day01/AgendaSlide';
import CourseOverviewSlides from '@/components/fpga/day01/CourseOverviewSlides';
import LabEnvSlide from '@/components/fpga/day01/LabEnvSlide';

/**
 * 교육 오리엔테이션
 * 교육 대상자 및 과정 성격에 따라 구성 변경 가능
 *
 * 구성:
 *   1. TitleSlide           — 과정 타이틀 (대상·일정)
 *   2. AgendaSlide          — Day 01 전체 흐름 안내
 *   3. CourseOverviewSlides — 교육 목적·로드맵·도구 소개 (3 slides)
 *   4. LabEnvSlide          — 실습 환경 확인
 */
export default function OrientationPage() {
  return (
    <FpgaRevealWrapper>
      <TitleSlide />
      <AgendaSlide />
      <CourseOverviewSlides />
      <LabEnvSlide />
    </FpgaRevealWrapper>
  );
}
