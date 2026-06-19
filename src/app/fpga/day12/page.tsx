'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day12/TitleSlide';
import AgendaSlide from '@/components/fpga/day12/AgendaSlide';
import UartProtocolSlide from '@/components/fpga/day12/UartProtocolSlide';
import BaudGenSlide from '@/components/fpga/day12/BaudGenSlide';
import UartTxSlide from '@/components/fpga/day12/UartTxSlide';
import UartRxSlide from '@/components/fpga/day12/UartRxSlide';
import LoopbackSlide from '@/components/fpga/day12/LoopbackSlide';
import UartVerifySlide from '@/components/fpga/day12/UartVerifySlide';
import LabSlide from '@/components/fpga/day12/LabSlide';

/**
 * Day 12: UART 통신 설계 및 프로토콜 검증
 *
 * 구성 (9 slides · 2h):
 *   1. TitleSlide        — Day 12 타이틀
 *   2. AgendaSlide       — 5단계 흐름
 *   3. UartProtocolSlide — UART frame 구조 · baud · bit period · async
 *   4. BaudGenSlide      — baud tick generator · 16× oversampling
 *   5. UartTxSlide       — 실습1 TX FSM + shift register
 *   6. UartRxSlide       — 실습2 RX start 검출 + mid-bit 샘플
 *   7. LoopbackSlide     — 실습3 TX→RX 루프백 통합
 *   8. UartVerifySlide   — 실습4 프로토콜 검증 TB · scoreboard
 *   9. LabSlide          — 4 실습 (오전2·오후2) 체크리스트 + Day 13 예고
 */
export default function Day12Page() {
  return (
    <FpgaRevealWrapper header="DAY 12 · UART 통신 설계 및 프로토콜 검증">
      <TitleSlide />
      <AgendaSlide />
      <UartProtocolSlide />
      <BaudGenSlide />
      <UartTxSlide />
      <UartRxSlide />
      <LoopbackSlide />
      <UartVerifySlide />
      <LabSlide />
    </FpgaRevealWrapper>
  );
}
