'use client';

import { useState } from 'react';
import { FPGA } from './FpgaSlideStyles';

interface ToolImageProps {
  src: string;
  name: string;
  width?: string;
  height?: string;
}

/**
 * 도구 이미지 컴포넌트
 * 이미지 로드 실패 시 fallback 텍스트 표시 (innerHTML 사용 없이)
 */
export default function ToolImage({ src, name, width = '100%', height = '60px' }: ToolImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div style={{
      width,
      height,
      background: `linear-gradient(135deg, ${FPGA.primaryBg}, ${FPGA.bgAlt})`,
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px dashed ${FPGA.primaryLight}30`,
      overflow: 'hidden',
    }}>
      {hasError ? (
        <span style={{
          fontSize: '0.68rem',
          color: FPGA.textLight,
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          {name} 캡쳐
        </span>
      ) : (
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
