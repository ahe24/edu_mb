'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import FpgaProcessSlides from '@/components/fpga/day01/FpgaProcessSlides';
import VerificationMethodsSlides from '@/components/fpga/day01/VerificationMethodsSlides';
import QnASlide from '@/components/fpga/day01/QnASlide';

/**
 * Day 01: Safety-Critical FPGA 검증 프레임워크
 *
 * 교육 내용만으로 구성 (오리엔테이션은 /fpga/orientation 별도 운영)
 *
 * 구성:
 *   1. FpgaProcessSlides        — Safety-Critical FPGA 프로세스 및 인허가 요건 (4 slides)
 *   2. VerificationMethodsSlides — 정적 분석 vs 동적 검증 (3 slides)
 *   3. QnASlide                 — Day 01 핵심 정리 + Q&A (1 slide)
 */
export default function Day01Page() {
  return (
    <FpgaRevealWrapper header="DAY 01 · Safety-Critical FPGA 검증 프레임워크">
      <FpgaProcessSlides />
      <VerificationMethodsSlides />
      <QnASlide />
    </FpgaRevealWrapper>
  );
}
