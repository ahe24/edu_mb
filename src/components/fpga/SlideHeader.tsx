'use client';

import { FPGA, styles } from './FpgaSlideStyles';

interface SlideHeaderProps {
  badge?: string;       // section[data-badge]에 기록 → FpgaRevealWrapper에서 overlay 렌더링
  title: string;        // 슬라이드 제목
  subtitle?: string;    // 부제 (선택)
}

/**
 * 슬라이드 상단 공통 헤더
 * badge prop은 부모 section에 data-badge attribute로 전파됨
 */
export default function SlideHeader({ badge, title, subtitle }: SlideHeaderProps) {
  return (
    <div style={{ marginBottom: '0.8rem', width: '100%', textAlign: 'center' }}
         {...(badge ? { 'data-slide-badge': badge } : {})}
    >
      <h2 style={styles.slideTitle}>{title}</h2>
      {subtitle && <h3 style={styles.slideSubtitle}>{subtitle}</h3>}
    </div>
  );
}
