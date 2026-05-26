'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day07/TitleSlide';
import AgendaSlide from '@/components/fpga/day07/AgendaSlide';
import WhyCDCSlide from '@/components/fpga/day07/WhyCDCSlide';
import MetastabilitySlide from '@/components/fpga/day07/MetastabilitySlide';
import SynchronizerFamilySlide from '@/components/fpga/day07/SynchronizerFamilySlide';
import MultiBitCoherencySlide from '@/components/fpga/day07/MultiBitCoherencySlide';
import QuestaCDCToolSlide from '@/components/fpga/day07/QuestaCDCToolSlide';
import StaticFlowSlide from '@/components/fpga/day07/StaticFlowSlide';
import LabIntroSlide from '@/components/fpga/day07/LabIntroSlide';
import QnASlide from '@/components/fpga/day07/QnASlide';

/**
 * Day 07: CDC 기초 이론 및 Questa CDC 소개
 *
 * 구성 (10 slides · 1.5–2h):
 *   1. TitleSlide              — Day 07 타이틀
 *   2. AgendaSlide             — 5단계 흐름
 *   3. WhyCDCSlide             — multi-clock 필연성 · safety-critical 사례
 *   4. MetastabilitySlide      — setup/hold 위반 · 4 시나리오
 *   5. SynchronizerFamilySlide — 2-DFF / 4-latch / pulse / DMUX / handshake / FIFO
 *   6. MultiBitCoherencySlide  — bus 일관성 · reconvergence
 *   7. QuestaCDCToolSlide      — qverify · 4-layer · methodology/goal
 *   8. StaticFlowSlide         — compile→setup→run→debug + 산출물 + 등급
 *   9. LabIntroSlide           — Lab: 데모 회로 둘러보기 + cdc setup
 *  10. QnASlide                — 정리 + Day 08 예고
 */
export default function Day07Page() {
  return (
    <FpgaRevealWrapper header="DAY 07 · CDC 기초 이론 및 Questa CDC 소개">
      <TitleSlide />
      <AgendaSlide />
      <WhyCDCSlide />
      <MetastabilitySlide />
      <SynchronizerFamilySlide />
      <MultiBitCoherencySlide />
      <QuestaCDCToolSlide />
      <StaticFlowSlide />
      <LabIntroSlide />
      <QnASlide />
    </FpgaRevealWrapper>
  );
}
