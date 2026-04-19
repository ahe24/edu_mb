'use client';

import FpgaRevealWrapper from '@/components/fpga/FpgaRevealWrapper';
import TitleSlide from '@/components/fpga/day04/TitleSlide';
import AgendaSlide from '@/components/fpga/day04/AgendaSlide';
import PolicyArchitectureSlide from '@/components/fpga/day04/PolicyArchitectureSlide';
import PreferenceDeepDiveSlide from '@/components/fpga/day04/PreferenceDeepDiveSlide';
import CustomGoalSlide from '@/components/fpga/day04/CustomGoalSlide';
import WaiverMethodsSlide from '@/components/fpga/day04/WaiverMethodsSlide';
import AuditTrailSlide from '@/components/fpga/day04/AuditTrailSlide';
import CaseStudySlide from '@/components/fpga/day04/CaseStudySlide';
import LabSlide from '@/components/fpga/day04/LabSlide';
import QnASlide from '@/components/fpga/day04/QnASlide';

/**
 * Day 04: 커스텀 규칙 설정 및 예외 처리
 *
 * 구성 (10 slides · 1.5–2h):
 *   1. TitleSlide              — Day 04 타이틀
 *   2. AgendaSlide             — 학습 흐름
 *   3. PolicyArchitectureSlide — 정책 파일 3계층 구조
 *   4. PreferenceDeepDiveSlide — lint preference 카테고리별 심화
 *   5. CustomGoalSlide         — Custom Goal 생성 워크플로우
 *   6. WaiverMethodsSlide      — Waiver 4방식 비교
 *   7. AuditTrailSlide         — RTL ID · status history · CI baseline
 *   8. CaseStudySlide          — 512 → 26 triage 실전 사례
 *   9. LabSlide                — 실습 체크리스트 (6 task)
 *  10. QnASlide                — Day 04 핵심 정리 + 다음 시간 예고
 */
export default function Day04Page() {
  return (
    <FpgaRevealWrapper header="DAY 04 · 커스텀 규칙 설정 및 예외 처리">
      <TitleSlide />
      <AgendaSlide />
      <PolicyArchitectureSlide />
      <PreferenceDeepDiveSlide />
      <CustomGoalSlide />
      <WaiverMethodsSlide />
      <AuditTrailSlide />
      <CaseStudySlide />
      <LabSlide />
      <QnASlide />
    </FpgaRevealWrapper>
  );
}
