'use client';

import { FPGA } from './FpgaSlideStyles';

interface TimelineItemProps {
  time: string;       // 예: "1.0h"
  title: string;
  description?: string;
  isLab?: boolean;    // 실습 여부
}

/**
 * 타임라인 아이템 (수업 시간표용)
 * 각 시간대별 내용을 시각적으로 표현
 */
export default function TimelineItem({ time, title, description, isLab = false }: TimelineItemProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '14px',
      padding: '0.7rem 0',
      borderBottom: `1px solid ${FPGA.border}`,
    }}>
      {/* 시간 */}
      <div style={{
        minWidth: '52px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: FPGA.primary,
        paddingTop: '2px',
      }}>
        {time}
      </div>

      {/* 내용 */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isLab && (
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              background: FPGA.accentBg,
              color: FPGA.accent,
              border: `1px solid ${FPGA.accent}30`,
              padding: '1px 8px',
              borderRadius: '4px',
              letterSpacing: '0.06em',
            }}>실습</span>
          )}
          <span style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: FPGA.text,
          }}>{title}</span>
        </div>
        {description && (
          <p style={{
            margin: '4px 0 0',
            fontSize: '0.85rem',
            color: FPGA.textLight,
            lineHeight: 1.5,
          }}>{description}</p>
        )}
      </div>
    </div>
  );
}
