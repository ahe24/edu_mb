'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import Chapter1Opening from '@/components/defense/Chapter1Opening';
import Chapter2WhyFpga from '@/components/defense/Chapter2WhyFpga';
import Chapter3CivilVsDefense from '@/components/defense/Chapter3CivilVsDefense';
import Chapter4Projects from '@/components/defense/Chapter4Projects';
import Chapter5Business from '@/components/defense/Chapter5Business';
import Chapter6Closing from '@/components/defense/Chapter6Closing';

/**
 * 무기체계 속의 FPGA — 국방 항공전자 개발은 무엇이 다른가
 * 발표자: 조창선 이사 (EDA 사업부) · 40분
 *
 * 구성:
 *   1장. 오프닝 — 사고 사례 (6 + 백업 4)
 *   2장. 왜 하필 FPGA인가 (3)
 *   3장. 민수 vs 국방 (6)
 *   4장. 실전 사례 + 특허 (4)
 *   5장. 우리 회사와의 연결 (4)
 *   6장. 마무리 + Q&A (2)
 */
export default function DefenseFpgaPage() {
  return (
    <FpgaRevealWrapper header="무기체계 속의 FPGA · 국방 항공전자" backHref="/" backLabel="← 홈">
      <Chapter1Opening />
      <Chapter2WhyFpga />
      <Chapter3CivilVsDefense />
      <Chapter4Projects />
      <Chapter5Business />
      <Chapter6Closing />
    </FpgaRevealWrapper>
  );
}
