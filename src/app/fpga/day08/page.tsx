'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day08/TitleSlide';
import AgendaSlide from '@/components/fpga/day08/AgendaSlide';
import DirectivesAnatomySlide from '@/components/fpga/day08/DirectivesAnatomySlide';
import ResultSummarySlide from '@/components/fpga/day08/ResultSummarySlide';
import CaseNoSyncSlide from '@/components/fpga/day08/CaseNoSyncSlide';
import CaseMultiBitsSlide from '@/components/fpga/day08/CaseMultiBitsSlide';
import CaseComboLogicSlide from '@/components/fpga/day08/CaseComboLogicSlide';
import GuiDebugSlide from '@/components/fpga/day08/GuiDebugSlide';
import FpgaSpecificsSlide from '@/components/fpga/day08/FpgaSpecificsSlide';
import LabAndWrapSlide from '@/components/fpga/day08/LabAndWrapSlide';

/**
 * Day 08: CDC 분석 실습 및 결과 해석
 *
 * 구성 (10 slides · 2h):
 *   1. TitleSlide              — Day 08 타이틀
 *   2. AgendaSlide             — 5단계 흐름
 *   3. DirectivesAnatomySlide  — directives.tcl 구조 + 9개 핵심 directive
 *   4. ResultSummarySlide      — 실측 결과 10 checks · status 흐름
 *   5. CaseNoSyncSlide         — BUG1 단일 bit no_sync · 2DFF 추가
 *   6. CaseMultiBitsSlide      — BUG2 multi_bits · stable/DMUX/handshake 3 옵션
 *   7. CaseComboLogicSlide     — BUG3 combo_logic · register 추가
 *   8. GuiDebugSlide           — CDC Checks · Schematic ↔ Source · Status 6종
 *   9. FpgaSpecificsSlide      — Vendor library · IP black box · HDM · V&V 산출물
 *  10. LabAndWrapSlide         — 6단계 lab + Day 9 예고
 */
export default function Day08Page() {
  return (
    <FpgaRevealWrapper header="DAY 08 · CDC 분석 실습 및 결과 해석">
      <TitleSlide />
      <AgendaSlide />
      <DirectivesAnatomySlide />
      <ResultSummarySlide />
      <CaseNoSyncSlide />
      <CaseMultiBitsSlide />
      <CaseComboLogicSlide />
      <GuiDebugSlide />
      <FpgaSpecificsSlide />
      <LabAndWrapSlide />
    </FpgaRevealWrapper>
  );
}
