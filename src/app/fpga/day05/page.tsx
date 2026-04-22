'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day05/TitleSlide';
import AgendaSlide from '@/components/fpga/day05/AgendaSlide';
import WhyMismatchSlide from '@/components/fpga/day05/WhyMismatchSlide';
import UnsynthCatalogSlide from '@/components/fpga/day05/UnsynthCatalogSlide';
import BlockingNonBlockingSlide from '@/components/fpga/day05/BlockingNonBlockingSlide';
import RaceConditionSlide from '@/components/fpga/day05/RaceConditionSlide';
import Do254CheckMapSlide from '@/components/fpga/day05/Do254CheckMapSlide';
import TriageWorkflowSlide from '@/components/fpga/day05/TriageWorkflowSlide';
import LabSlide from '@/components/fpga/day05/LabSlide';
import QnASlide from '@/components/fpga/day05/QnASlide';

/**
 * Day 05: 합성 불가 구문 · Sim-Synth Mismatch 검출
 *
 * 구성 (10 slides · 1.5–2h):
 *   1. TitleSlide              — Day 05 타이틀
 *   2. AgendaSlide             — 학습 흐름
 *   3. WhyMismatchSlide        — sim-synth mismatch 리스크
 *   4. UnsynthCatalogSlide     — 합성 불가 구문 카탈로그 (탭 탐색기)
 *   5. BlockingNonBlockingSlide— Blocking vs NB 오용 4 패턴 (CP15·17·18·SS6)
 *   6. RaceConditionSlide      — Race 4 패턴 (SS3·SS6·CP8)
 *   7. Do254CheckMapSlide      — DO-254 CP·SS 체크 매핑표
 *   8. TriageWorkflowSlide     — 검출 → Triage → Waiver 흐름
 *   9. LabSlide                — 실습 체크리스트 (6 task · broken_rtl)
 *  10. QnASlide                — 정리 + Day 06 예고
 */
export default function Day05Page() {
  return (
    <FpgaRevealWrapper header="DAY 05 · 합성 불가 구문 · Sim-Synth Mismatch 검출">
      <TitleSlide />
      <AgendaSlide />
      <WhyMismatchSlide />
      <UnsynthCatalogSlide />
      <BlockingNonBlockingSlide />
      <RaceConditionSlide />
      <Do254CheckMapSlide />
      <TriageWorkflowSlide />
      <LabSlide />
      <QnASlide />
    </FpgaRevealWrapper>
  );
}
