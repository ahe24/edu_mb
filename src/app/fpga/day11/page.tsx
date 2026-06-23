'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day11/TitleSlide';
import AgendaSlide from '@/components/fpga/day11/AgendaSlide';
import FsmConceptSlide from '@/components/fpga/day11/FsmConceptSlide';
import FsmStyleSlide from '@/components/fpga/day11/FsmStyleSlide';
import TrafficLightSlide from '@/components/fpga/day11/TrafficLightSlide';
import PwmModeSlide from '@/components/fpga/day11/PwmModeSlide';
import SeqDetectorSlide from '@/components/fpga/day11/SeqDetectorSlide';
import FsmVerifySlide from '@/components/fpga/day11/FsmVerifySlide';
import LabSlide from '@/components/fpga/day11/LabSlide';

/**
 * Day 11: FSM 설계 및 상태 천이 검증
 *
 * 구성 (9 slides · 2h):
 *   1. TitleSlide        — Day 11 타이틀
 *   2. AgendaSlide       — 5단계 흐름
 *   3. FsmConceptSlide   — FSM 구조 · Moore/Mealy · encoding · 안전 상태
 *   4. FsmStyleSlide     — 1·2·3-process 비교 · 6-state 3-process 템플릿 · full-case default · illegal 복구
 *   5. TrafficLightSlide — 실습1 신호등 Moore FSM · state diagram · timed
 *   6. PwmModeSlide      — 실습2 RGB PWM 밝기 ±5% · 모듈 분해(top·pwm_gen·debounce·led_driver)
 *   7. SeqDetectorSlide  — 실습3 시퀀스 검출 FSM · overlap 처리
 *   8. FsmVerifySlide    — 실습4 상태 천이 검증 TB · corner case · state coverage
 *   9. LabSlide          — 4 실습 (오전2·오후2) 체크리스트 + Day 12 예고
 */
export default function Day11Page() {
  return (
    <FpgaRevealWrapper header="DAY 11 · FSM 설계 및 상태 천이 검증">
      <TitleSlide />
      <AgendaSlide />
      <FsmConceptSlide />
      <FsmStyleSlide />
      <TrafficLightSlide />
      <PwmModeSlide />
      <SeqDetectorSlide />
      <FsmVerifySlide />
      <LabSlide />
    </FpgaRevealWrapper>
  );
}
