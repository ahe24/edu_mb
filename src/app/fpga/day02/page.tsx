'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day02/TitleSlide';
import AgendaSlide from '@/components/fpga/day02/AgendaSlide';
import QuestaArchSlide from '@/components/fpga/day02/QuestaArchSlide';
import QuestaLintSetupSlides from '@/components/fpga/day02/QuestaLintSetupSlides';
import FirstRunSlides from '@/components/fpga/day02/FirstRunSlides';
import ReportSlides from '@/components/fpga/day02/ReportSlides';
import LabSlide from '@/components/fpga/day02/LabSlide';
import QnASlide from '@/components/fpga/day02/QnASlide';

/**
 * Day 02: Questa 도구 환경 설정 및 기본 사용법
 *
 * 구성:
 *   1. TitleSlide              — Day 02 타이틀 (1 slide)
 *   2. AgendaSlide             — 오늘의 학습 흐름 (1 slide)
 *   3. QuestaArchSlide         — Questa 제품군 아키텍처 (1 slide)
 *   4. QuestaLintSetupSlides   — 프로젝트 구성 & 예제 RTL (2 slides)
 *   5. FirstRunSlides          — 첫 실행 워크플로우 & 콘솔 출력 (2 slides)
 *   6. ReportSlides            — 4-카테고리 인터랙티브 뷰어 & GUI 리포트 (2 slides)
 *   7. LabSlide                — 실습 체크리스트 (1 slide)
 *   8. QnASlide                — Day 02 핵심 정리 + Q&A (1 slide)
 */
export default function Day02Page() {
  return (
    <FpgaRevealWrapper header="DAY 02 · Questa 도구 환경 설정 및 기본 사용법">
      <TitleSlide />
      <AgendaSlide />
      <QuestaArchSlide />
      <QuestaLintSetupSlides />
      <FirstRunSlides />
      <ReportSlides />
      <LabSlide />
      <QnASlide />
    </FpgaRevealWrapper>
  );
}
