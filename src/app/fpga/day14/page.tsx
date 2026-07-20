'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day14/TitleSlide';
import AgendaSlide from '@/components/fpga/day14/AgendaSlide';
import WhyCoverageSlide from '@/components/fpga/day14/WhyCoverageSlide';
import CovTypesSlide from '@/components/fpga/day14/CovTypesSlide';
import QuestaFlowSlide from '@/components/fpga/day14/QuestaFlowSlide';
import MeasureSlide from '@/components/fpga/day14/MeasureSlide';
import HoleBoostSlide from '@/components/fpga/day14/HoleBoostSlide';
import MergeSlide from '@/components/fpga/day14/MergeSlide';
import ClosureSlide from '@/components/fpga/day14/ClosureSlide';
import LabSlide from '@/components/fpga/day14/LabSlide';

/**
 * Day 14: 코드 커버리지 측정 및 커버리지 클로저
 *
 * 구성 (10 slides · 2h):
 *   1. TitleSlide       — Day 14 타이틀
 *   2. AgendaSlide      — 5단계 흐름
 *   3. WhyCoverageSlide — PASS ≠ 충분 · 정상 시나리오가 못 밟는 결함 3종(분기/상태/조건) + 커버리지 정의·관리 질문
 *   4. CovTypesSlide    — 코드 커버리지 종류 (statement/branch/condition/FSM/toggle) 인터랙티브
 *   5. QuestaFlowSlide  — +cover=bcesf · vsim -coverage · coverage save → UCDB (GUI 캡처)
 *   6. MeasureSlide     — 실습1 측정 · coverage report 해석 (Source 캡처)
 *   7. HoleBoostSlide   — 실습2 홀 보강 · boost_scenario 잠금 · 재측정 상승
 *   8. MergeSlide       — 실습3 테스트별 UCDB → vcover merge (HTML 캡처)
 *   9. ClosureSlide     — 실습4 3-way 판정 · exclude.do 제외 · 100%≠기능완전성
 *  10. LabSlide         — 4 실습 (순서 무관) 체크리스트 + Day 15 예고
 */
export default function Day14Page() {
  return (
    <FpgaRevealWrapper header="DAY 14 · 코드 커버리지 측정 및 커버리지 클로저">
      <TitleSlide />
      <AgendaSlide />
      <WhyCoverageSlide />
      <CovTypesSlide />
      <QuestaFlowSlide />
      <MeasureSlide />
      <HoleBoostSlide />
      <MergeSlide />
      <ClosureSlide />
      <LabSlide />
    </FpgaRevealWrapper>
  );
}
