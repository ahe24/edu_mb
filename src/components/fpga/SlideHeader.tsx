'use client';

import { FPGA, styles } from './FpgaSlideStyles';

interface SlideHeaderProps {
  badge?: string;       // 선택: 배지 텍스트 (없으면 표시하지 않음)
  title: string;        // 슬라이드 제목
  subtitle?: string;    // 부제 (선택)
}

/**
 * 슬라이드 상단 공통 헤더
 * Title + optional Subtitle — 중앙 정렬
 */
export default function SlideHeader({ badge, title, subtitle }: SlideHeaderProps) {
  return (
    <div style={{ marginBottom: '0.8rem', width: '100%', textAlign: 'center' }}>
      {badge && (
        <div style={{ marginBottom: '0.2rem' }}>
          <span style={styles.badge()}>● {badge}</span>
        </div>
      )}
      <h2 style={styles.slideTitle}>{title}</h2>
      {subtitle && <h3 style={styles.slideSubtitle}>{subtitle}</h3>}
    </div>
  );
}
