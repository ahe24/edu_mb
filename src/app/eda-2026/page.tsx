'use client';

import EdaRevealWrapper from '@/components/eda2026/EdaRevealWrapper';
import TitleSlide from '@/components/eda2026/TitleSlide';
import AgendaSlide from '@/components/eda2026/AgendaSlide';
import EDAIntroSlide from '@/components/eda2026/EDAIntroSlide';
import MarketStatusSlide from '@/components/eda2026/MarketStatusSlide';
import SalesBarrierSlide from '@/components/eda2026/SalesBarrierSlide';
import AutomationSlide from '@/components/eda2026/AutomationSlide';
import LLMStrategySlide from '@/components/eda2026/LLMStrategySlide';
import QuestaAISlide from '@/components/eda2026/QuestaAISlide';
import AirGapSlide from '@/components/eda2026/AirGapSlide';
import VerificationStatusSlide from '@/components/eda2026/VerificationStatusSlide';
import RAGLogSlide from '@/components/eda2026/RAGLogSlide';
import TechnoparkSlide from '@/components/eda2026/TechnoparkSlide';
import TargetMarketSlide from '@/components/eda2026/TargetMarketSlide';
import ActionPlanSlide from '@/components/eda2026/ActionPlanSlide';
import ExpectedEffectsSlide from '@/components/eda2026/ExpectedEffectsSlide';
import ClosingSlide from '@/components/eda2026/ClosingSlide';

export default function Eda2026Page() {
  return (
    <EdaRevealWrapper>
      <TitleSlide />
      <AgendaSlide />
      <EDAIntroSlide />
      <MarketStatusSlide />
      <SalesBarrierSlide />
      <AutomationSlide />
      <LLMStrategySlide />
      <QuestaAISlide />
      <AirGapSlide />
      <VerificationStatusSlide />
      <RAGLogSlide />
      <TechnoparkSlide />
      <TargetMarketSlide />
      <ActionPlanSlide />
      <ExpectedEffectsSlide />
      <ClosingSlide />
    </EdaRevealWrapper>
  );
}
