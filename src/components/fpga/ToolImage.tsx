'use client';

import { useState } from 'react';
import { FPGA } from './FpgaSlideStyles';
import SlideModal from './SlideModal';

interface ToolImageProps {
  src: string;
  name: string;
  width?: string;
  height?: string;
  /** 썸네일 이미지 맞춤 방식 (기본 contain — 전체가 잘림 없이 보임) */
  fit?: 'contain' | 'cover';
}

export default function ToolImage({ src, name, width = '100%', height = '60px', fit = 'contain' }: ToolImageProps) {
  const [hasError, setHasError] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div
        onClick={() => !hasError && setLightbox(true)}
        style={{
          width,
          height,
          background: `linear-gradient(135deg, ${FPGA.primaryBg}, ${FPGA.bgAlt})`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px dashed ${FPGA.primaryLight}30`,
          overflow: 'hidden',
          cursor: hasError ? 'default' : 'zoom-in',
        }}
      >
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
            style={{ width: '100%', height: '100%', objectFit: fit }}
            onError={() => setHasError(true)}
          />
        )}
      </div>

      <SlideModal
        open={lightbox}
        onClose={() => setLightbox(false)}
        backdropStyle={{
          background: 'rgba(0,0,0,0.80)',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          cursor: 'zoom-out',
          padding: 0,
        }}
        contentStyle={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
      >
        <img
          src={src}
          alt={name}
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '-2rem',
          left: 0,
          right: 0,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.8rem',
        }}>
          {name} — 클릭하면 닫힘
        </div>
      </SlideModal>
    </>
  );
}
