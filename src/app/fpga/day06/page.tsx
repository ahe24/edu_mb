'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day06/TitleSlide';
import AgendaSlide from '@/components/fpga/day06/AgendaSlide';
import LatentVsExplicitSlide from '@/components/fpga/day06/LatentVsExplicitSlide';
import LatchInferenceSlide from '@/components/fpga/day06/LatchInferenceSlide';
import CaseStatementSlide from '@/components/fpga/day06/CaseStatementSlide';
import WidthMismatchSlide from '@/components/fpga/day06/WidthMismatchSlide';
import XPropagationSlide from '@/components/fpga/day06/XPropagationSlide';
import FsmLatentSlide from '@/components/fpga/day06/FsmLatentSlide';
import LabSlide from '@/components/fpga/day06/LabSlide';
import QnASlide from '@/components/fpga/day06/QnASlide';

/**
 * Day 06: 잠재적 설계 오류 식별
 *
 * 구성 (10 slides · 1.5–2h):
 *   1. TitleSlide             — Day 06 타이틀
 *   2. AgendaSlide            — 학습 흐름
 *   3. LatentVsExplicitSlide  — 명시 vs 잠재 경계 구분
 *   4. LatchInferenceSlide    — SS4 래치 추론
 *   5. CaseStatementSlide     — SS2 case 불완전성
 *   6. WidthMismatchSlide     — CP7 비트폭 정합성
 *   7. XPropagationSlide      — SS17/SS18 X-prop · reset 취약성
 *   8. FsmLatentSlide         — CP5/CP6 FSM 잠재 오류
 *   9. LabSlide               — latent_bug 실습 (DO-254 goal)
 *  10. QnASlide               — 정리 + Week 4 CDC 예고
 */
export default function Day06Page() {
  return (
    <FpgaRevealWrapper header="DAY 06 · 잠재적 설계 오류 식별">
      <TitleSlide />
      <AgendaSlide />
      <LatentVsExplicitSlide />
      <LatchInferenceSlide />
      <CaseStatementSlide />
      <WidthMismatchSlide />
      <XPropagationSlide />
      <FsmLatentSlide />
      <LabSlide />
      <QnASlide />
    </FpgaRevealWrapper>
  );
}
