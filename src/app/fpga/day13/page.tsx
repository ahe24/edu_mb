'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day13/TitleSlide';
import AgendaSlide from '@/components/fpga/day13/AgendaSlide';
import TbLimitSlide from '@/components/fpga/day13/TbLimitSlide';
import TbArchSlide from '@/components/fpga/day13/TbArchSlide';
import TbLayeredSlide from '@/components/fpga/day13/TbLayeredSlide';
import SvaIntroSlide from '@/components/fpga/day13/SvaIntroSlide';
import SvaUartSlide from '@/components/fpga/day13/SvaUartSlide';
import BindSlide from '@/components/fpga/day13/BindSlide';
import FaultSlide from '@/components/fpga/day13/FaultSlide';
import LabSlide from '@/components/fpga/day13/LabSlide';

/**
 * Day 13: 재사용 Testbench 구조 및 SVA Assertion 기초
 *
 * 구성 (10 slides · 2h):
 *   1. TitleSlide     — Day 13 타이틀
 *   2. AgendaSlide    — 5단계 흐름
 *   3. TbLimitSlide   — 모놀리식 TB 진단 · 책임 혼재 · 재사용 불가
 *   4. TbArchSlide    — 계층화 TB 아키텍처: driver/monitor/scoreboard
 *   5. TbLayeredSlide — 실습1 계층화 TB 조립 (uart_driver 구현)
 *   6. SvaIntroSlide  — SVA 기초: concurrent · |-> · ##N · $past · disable iff
 *   7. SvaUartSlide   — 실습2 uart_tx 프로토콜 SVA 4속성 + cover
 *   8. BindSlide      — 실습3 bind 비침습 결합 · 내부 state 감시
 *   9. FaultSlide     — 실습4 버그 주입 · scoreboard vs SVA 검출 매트릭스
 *  10. LabSlide       — 4 실습 (순서 무관) 체크리스트 + Day 14 예고
 */
export default function Day13Page() {
  return (
    <FpgaRevealWrapper header="DAY 13 · 재사용 Testbench 구조 및 SVA Assertion 기초">
      <TitleSlide />
      <AgendaSlide />
      <TbLimitSlide />
      <TbArchSlide />
      <TbLayeredSlide />
      <SvaIntroSlide />
      <SvaUartSlide />
      <BindSlide />
      <FaultSlide />
      <LabSlide />
    </FpgaRevealWrapper>
  );
}
