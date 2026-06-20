'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day09/TitleSlide';
import AgendaSlide from '@/components/fpga/day09/AgendaSlide';
import Month2KickoffSlide from '@/components/fpga/day09/Month2KickoffSlide';
import QuestaFlowSlide from '@/components/fpga/day09/QuestaFlowSlide';
import ComboBasicsSlide from '@/components/fpga/day09/ComboBasicsSlide';
import LogicGatesSlide from '@/components/fpga/day09/LogicGatesSlide';
import Mux4Slide from '@/components/fpga/day09/Mux4Slide';
import TestbenchSlide from '@/components/fpga/day09/TestbenchSlide';
import LabSlide from '@/components/fpga/day09/LabSlide';

/**
 * Day 09: QuestaSim·Visualizer 환경 및 조합논리 설계 (Month 2 시작)
 *
 * 구성 (9 slides · 2h):
 *   1. TitleSlide          — Day 09 타이틀 · Month 2 kickoff
 *   2. AgendaSlide         — 5단계 흐름
 *   3. Month2KickoffSlide  — 설계 기반 검증 철학 + Arty-7 자원 맵
 *   4. QuestaFlowSlide     — vlib/vlog/vsim 3-step + Visualizer · 진입장벽 제거
 *   5. ComboBasicsSlide    — 실습1 조합논리 개념 · sw→LED passthrough/invert
 *   6. LogicGatesSlide     — 실습2 logic gates → RGB LED · 진리표
 *   7. Mux4Slide           — 실습3 4:1 컬러 MUX (sel→R/G/B/W) · case · latch 회피
 *   8. TestbenchSlide      — 실습4 mux4 self-checking TB · Visualizer 파형 읽기
 *   9. LabSlide            — 4 실습 (오전2·오후2) 체크리스트 + Day 10 예고
 */
export default function Day09Page() {
  return (
    <FpgaRevealWrapper header="DAY 09 · QuestaSim·Visualizer 환경 및 조합논리 설계">
      <TitleSlide />
      <AgendaSlide />
      <Month2KickoffSlide />
      <QuestaFlowSlide />
      <ComboBasicsSlide />
      <LogicGatesSlide />
      <Mux4Slide />
      <TestbenchSlide />
      <LabSlide />
    </FpgaRevealWrapper>
  );
}
