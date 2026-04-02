'use client';

import { FPGA, shadow } from './FpgaSlideStyles';
import { ReactNode } from 'react';

interface InfoCardProps {
  icon?: ReactNode;
  label: string;
  children: ReactNode;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
}

const variantStyles = {
  default: {
    background: FPGA.white,
    border: `1px solid ${FPGA.border}`,
    labelColor: FPGA.primary,
  },
  highlight: {
    background: `linear-gradient(135deg, rgba(74, 111, 165, 0.06) 0%, rgba(74, 111, 165, 0.12) 100%)`,
    border: `1px solid ${FPGA.primaryLight}30`,
    labelColor: FPGA.primary,
  },
  warning: {
    background: `linear-gradient(135deg, rgba(232, 145, 58, 0.06) 0%, rgba(232, 145, 58, 0.12) 100%)`,
    border: `1px solid ${FPGA.accent}30`,
    labelColor: FPGA.accent,
  },
  success: {
    background: `linear-gradient(135deg, rgba(72, 187, 120, 0.06) 0%, rgba(72, 187, 120, 0.12) 100%)`,
    border: `1px solid ${FPGA.success}30`,
    labelColor: FPGA.success,
  },
};

/**
 * 정보 카드 컴포넌트
 * 입체감 있는 그림자 + gradient 배경으로 깊이감 확보
 */
export default function InfoCard({ icon, label, children, variant = 'default' }: InfoCardProps) {
  const v = variantStyles[variant];

  return (
    <div style={{
      background: v.background,
      border: v.border,
      borderRadius: '14px',
      padding: '1.3rem 1.5rem',
      textAlign: 'left',
      boxShadow: shadow.card,
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
        {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
        <span style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          color: v.labelColor,
          letterSpacing: '0.04em',
          textTransform: 'uppercase' as const,
        }}>{label}</span>
      </div>
      <div style={{ fontSize: '0.95rem', color: FPGA.text, lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}
