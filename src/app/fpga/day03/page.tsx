'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day03/TitleSlide';
import AgendaSlide from '@/components/fpga/day03/AgendaSlide';
import MethodologyGoalsSlide from '@/components/fpga/day03/MethodologyGoalsSlide';
import ClockAssignRulesSlide from '@/components/fpga/day03/ClockAssignRulesSlide';
import StructuralFsmRulesSlide from '@/components/fpga/day03/StructuralFsmRulesSlide';
import DO254MappingSlide from '@/components/fpga/day03/DO254MappingSlide';
import CustomizationSlide from '@/components/fpga/day03/CustomizationSlide';
import LabSlide from '@/components/fpga/day03/LabSlide';
import QnASlide from '@/components/fpga/day03/QnASlide';

/**
 * Day 03: Questa Lint 코딩 규칙 및 가이드라인 검증
 *
 * 구성:
 *   1. TitleSlide              — Day 03 타이틀 (1 slide)
 *   2. AgendaSlide             — 오늘의 학습 흐름 (1 slide)
 *   3. MethodologyGoalsSlide   — FPGA Methodology 3단계 Goals + Vendor 특화 (1 slide)
 *   4. ClockAssignRulesSlide   — Clock · Assignment 핵심 룰 탐색기 (1 slide)
 *   5. StructuralFsmRulesSlide — Structural · FSM 핵심 룰 탐색기 (1 slide)
 *   6. DO254MappingSlide       — DO-254 CP/DR/SS 카테고리 매핑 (1 slide)
 *   7. CustomizationSlide      — lint preference · off · report item 커스터마이징 (1 slide)
 *   8. LabSlide                — 실습 체크리스트 (1 slide)
 *   9. QnASlide                — Day 03 핵심 정리 + Q&A (1 slide)
 */
export default function Day03Page() {
  return (
    <FpgaRevealWrapper header="DAY 03 · Questa Lint 코딩 규칙 및 가이드라인 검증">
      <TitleSlide />
      <AgendaSlide />
      <MethodologyGoalsSlide />
      <ClockAssignRulesSlide />
      <StructuralFsmRulesSlide />
      <DO254MappingSlide />
      <CustomizationSlide />
      <LabSlide />
      <QnASlide />
    </FpgaRevealWrapper>
  );
}
