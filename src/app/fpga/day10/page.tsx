'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day10/TitleSlide';
import AgendaSlide from '@/components/fpga/day10/AgendaSlide';
import SeqConceptSlide from '@/components/fpga/day10/SeqConceptSlide';
import ClockResetSlide from '@/components/fpga/day10/ClockResetSlide';
import BlinkerSlide from '@/components/fpga/day10/BlinkerSlide';
import CounterSlide from '@/components/fpga/day10/CounterSlide';
import DebouncerSlide from '@/components/fpga/day10/DebouncerSlide';
import SelfCheckTBSlide from '@/components/fpga/day10/SelfCheckTBSlide';
import LabSlide from '@/components/fpga/day10/LabSlide';

/**
 * Day 10: 순차논리 설계 및 self-checking Testbench 기초
 *
 * 구성 (9 slides · 2h):
 *   1. TitleSlide        — Day 10 타이틀
 *   2. AgendaSlide       — 5단계 흐름
 *   3. SeqConceptSlide   — 조합 vs 순차 · flip-flop · 동기 active-high 리셋
 *   4. ClockResetSlide   — TB 클럭 생성 + 리셋 시퀀스 기본기
 *   5. BlinkerSlide      — 실습1 클럭분주 blinker · parameter override
 *   6. CounterSlide      — 실습2 N-bit 카운터 · enable
 *   7. DebouncerSlide    — 실습3 버튼 디바운서 · 2FF 동기화 + 카운터
 *   8. SelfCheckTBSlide  — 실습4 reference model 기반 self-checking TB
 *   9. LabSlide          — 4 실습 (오전2·오후2) 체크리스트 + Day 11 예고
 */
export default function Day10Page() {
  return (
    <FpgaRevealWrapper header="DAY 10 · 순차논리 설계 및 self-checking Testbench 기초">
      <TitleSlide />
      <AgendaSlide />
      <SeqConceptSlide />
      <ClockResetSlide />
      <BlinkerSlide />
      <CounterSlide />
      <DebouncerSlide />
      <SelfCheckTBSlide />
      <LabSlide />
    </FpgaRevealWrapper>
  );
}
