'use client';

import { useEffect, useState, CSSProperties, ReactNode, MouseEvent } from 'react';
import { createPortal } from 'react-dom';

/**
 * Reveal.js 슬라이드 위에 띄우는 공용 모달.
 *
 * Reveal.js 는 `.slides section` 에 `transform: scale(...)` 을 적용해
 * 1280×720 기준으로 렌더된 콘텐츠를 뷰포트에 맞춰 확대한다.
 * 모달을 슬라이드 내부에 그대로 두면 같은 스케일 변환을 타면서
 * 확대 보간이 걸려 뿌옇게 보인다.
 *
 * 해결: `createPortal` 로 `document.body` 에 직접 렌더하면
 * 스케일 변환 밖에서 네이티브 해상도로 그려진다.
 */
export interface SlideModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 배경 클릭으로 닫을지 여부 (기본 true) */
  closeOnBackdrop?: boolean;
  /** ESC 키로 닫을지 여부 (기본 true) */
  closeOnEsc?: boolean;
  /** 배경(백드롭) 스타일 오버라이드 */
  backdropStyle?: CSSProperties;
  /** 모달 컨테이너(내부 박스) 스타일 오버라이드. 지정 안하면 children 을 감싸는 래퍼 없이 그대로 렌더. */
  contentStyle?: CSSProperties;
  /** true 면 children 을 backdrop 위에 wrapper 없이 직접 렌더 (이미지 라이트박스용) */
  bare?: boolean;
  zIndex?: number;
}

export default function SlideModal({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEsc = true,
  backdropStyle,
  contentStyle,
  bare = false,
  zIndex = 9999,
}: SlideModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, closeOnEsc, onClose]);

  if (!open || !mounted) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop) onClose();
  };

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  const defaultBackdrop: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex,
    padding: '2rem',
    animation: 'fadeIn 0.2s ease',
  };

  return createPortal(
    <div onClick={handleBackdropClick} style={{ ...defaultBackdrop, ...backdropStyle }}>
      {bare ? (
        <div onClick={stopPropagation} style={{ display: 'contents' }}>
          {children}
        </div>
      ) : (
        <div onClick={stopPropagation} style={contentStyle}>
          {children}
        </div>
      )}
    </div>,
    document.body
  );
}
