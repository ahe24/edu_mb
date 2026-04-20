'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import 'reveal.js/reveal.css';

/**
 * FPGA 검증교육 전용 Reveal.js Wrapper
 * - 밝고 전문적인 커스텀 테마 (Reveal.js 기본 테마 사용하지 않음)
 * - 슬라이드 배경: 부드러운 라이트 그레이
 * - 강조색: Steel Blue (#4A6FA5) 계열
 */
export default function FpgaRevealWrapper({ children, header }: { children: React.ReactNode; header?: string }) {
  const deckRef = useRef<HTMLDivElement>(null);
  const deckInstance = useRef<any>(null);
  const keyHandler = useRef<((e: KeyboardEvent) => void) | null>(null);
  const [isPrintPDF, setIsPrintPDF] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const printMode = window.location.search.includes('print-pdf');
    setIsPrintPDF(printMode);
    setMounted(true);

    const initReveal = async () => {
      if (deckRef.current && !deckInstance.current) {
        const Reveal = (await import('reveal.js')).default;
        // @ts-ignore
        const RevealNotes = (await import('reveal.js/plugin/notes')).default;
        // @ts-ignore
        const RevealZoom = (await import('reveal.js/plugin/zoom')).default;

        deckInstance.current = new Reveal(deckRef.current, {
          hash: !printMode,
          slideNumber: true,
          controls: !printMode,
          progress: !printMode,
          center: true,
          // 16:9.5 — 일반적인 노트북/외부 모니터 (1440×900, 1920×1080, 1366×768) 의
          // 가용 영역 비율과 유사하게 맞춰 letterboxing 최소화
          width: 1280,
          height: 760,
          margin: 0.015,
          minScale: 0.2,
          maxScale: 2.5,
          help: false,
          view: printMode ? 'print' : undefined,
          pdfSeparateFragments: false,
          pdfMaxPagesPerSlide: 1,
          plugins: [RevealNotes, RevealZoom],
        });

        await deckInstance.current.initialize();

        if (!printMode) {
          keyHandler.current = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'e') {
              e.preventDefault();
              window.open(window.location.pathname + '?print-pdf', '_blank');
            }
          };
          window.addEventListener('keydown', keyHandler.current);
        }
      }
    };

    initReveal();

    return () => {
      try {
        if (deckInstance.current) {
          deckInstance.current.destroy();
          deckInstance.current = null;
        }
      } catch (e) {
        console.warn('Reveal.js destroy called on unmounted component', e);
      }
      if (keyHandler.current) {
        window.removeEventListener('keydown', keyHandler.current);
        keyHandler.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* FPGA 검증교육 전용 테마 스타일 */}
      <style dangerouslySetInnerHTML={{ __html: fpgaThemeCSS }} />

      <div className="reveal fpga-theme" ref={deckRef} style={{ height: '100vh', width: '100vw' }}>
        <div className="slides">
          {children}
        </div>

        {/* 상단 헤더 배너 */}
        {mounted && !isPrintPDF && header && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            zIndex: 50,
            background: 'rgba(248,250,253,0.92)',
            borderBottom: '1px solid #E2E8F0',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 16px',
            pointerEvents: 'none',
          }}>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#2B4570',
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: '0.06em',
              opacity: 0.92,
            }}>{header}</span>
          </div>
        )}

        {/* 뒤로가기 버튼 */}
        {mounted && !isPrintPDF && (
          <Link
            href="/fpga"
            aria-label="FPGA 커리큘럼 페이지로 돌아가기"
            style={{
              position: 'fixed',
              bottom: '8px',
              left: '12px',
              zIndex: 50,
              fontSize: '0.72rem',
              color: '#2B4570',
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 700,
              textDecoration: 'none',
              opacity: 0.85,
              letterSpacing: '0.02em',
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(74,111,165,0.30)',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >← 커리큘럼</Link>
        )}

        {/* Footer (인쇄 모드에서 숨김) */}
        <div style={{
          position: 'fixed',
          bottom: '6px',
          right: '100px',
          zIndex: 50,
          display: (mounted && isPrintPDF) ? 'none' : 'flex',
          alignItems: 'center',
          gap: '5px',
          pointerEvents: 'none',
          opacity: 0.5,
        }}>
          <img
            src="/images/edmfg_logo.png"
            alt="Company Logo"
            style={{ height: '14px', width: 'auto' }}
          />
          <span style={{
            fontSize: '0.7rem',
            color: '#4A6FA5',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 600,
          }}>©2026. Changseon Jo.</span>
        </div>
      </div>
    </>
  );
}

/* ── FPGA 전용 테마 CSS ── */
const fpgaThemeCSS = `
  /* ── 슬라이드 기본 레이아웃 ── */
  .fpga-theme .slides section {
    font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
    color: #2D3748;
    text-align: left;
    background: #FAFBFD;
    /* 전체 폭 활용: 좌우 여백 최소화, 중앙 정렬 */
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 1.2rem 2.5rem !important;
  }

  /* 슬라이드 내 직접 자식 요소 전폭 활용 */
  .fpga-theme .slides section > div,
  .fpga-theme .slides section > table {
    width: 100%;
    max-width: 1180px;
  }

  /* contentWrap fills the section and lays out children in a column */
  .fpga-theme .slides section > div.fpga-content-wrap {
    flex: 1;
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1180px;
  }

  .fpga-theme .slides section h1,
  .fpga-theme .slides section h2,
  .fpga-theme .slides section h3 {
    color: #2B4570;
    font-weight: 700;
    letter-spacing: -0.02em;
    text-transform: none;
    width: 100%;
  }

  .fpga-theme .slides section h1 { font-size: 2.8rem; text-align: center; }
  .fpga-theme .slides section h2 { font-size: 2.0rem; }
  .fpga-theme .slides section h3 { font-size: 1.5rem; color: #4A6FA5; }

  .fpga-theme .slides section p {
    line-height: 1.7;
    font-size: 1.05rem;
  }

  .fpga-theme .slides section ul,
  .fpga-theme .slides section ol {
    font-size: 1.0rem;
    line-height: 1.8;
  }

  .fpga-theme .slides section code {
    font-family: "JetBrains Mono", monospace;
    background: rgba(74, 111, 165, 0.08);
    color: #4A6FA5;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
  }

  /* ── 테이블 — 둥근 모서리 + 그림자 ── */
  .fpga-theme .slides section table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    font-size: 0.95rem;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  .fpga-theme .slides section table th {
    background: #4A6FA5;
    color: #ffffff;
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
  }

  .fpga-theme .slides section table td {
    padding: 8px 14px;
    border-bottom: 1px solid #E2E8F0;
    background: #ffffff;
  }

  .fpga-theme .slides section table tr:nth-child(even) td {
    background: #F7FAFC;
  }

  /* ── Reveal.js 컨트롤/프로그레스바 ── */
  .fpga-theme .controls .navigate-left,
  .fpga-theme .controls .navigate-right,
  .fpga-theme .controls .navigate-up,
  .fpga-theme .controls .navigate-down {
    color: #4A6FA5 !important;
    opacity: 0.85 !important;
  }
  .fpga-theme .controls button:hover,
  .fpga-theme .controls button:focus {
    opacity: 1 !important;
    outline: 2px solid #4A6FA5 !important;
    outline-offset: 2px !important;
    border-radius: 4px;
  }
  .fpga-theme .progress span {
    background: #4A6FA5 !important;
  }
  .fpga-theme .slide-number {
    color: #2B4570 !important;
    background: rgba(255,255,255,0.85) !important;
    border: 1px solid rgba(74,111,165,0.30) !important;
    border-radius: 4px !important;
    padding: 2px 7px !important;
    font-family: "JetBrains Mono", monospace !important;
    font-size: 0.78rem !important;
    font-weight: 700 !important;
    bottom: 6px !important;
    right: 8px !important;
  }

  /* ── 키보드 포커스 표시 (접근성) ── */
  .fpga-theme .slides section button:focus-visible {
    outline: 2px solid #4A6FA5 !important;
    outline-offset: 2px !important;
  }
  .fpga-theme .slides section input[type="checkbox"]:focus-visible {
    outline: 2px solid #4A6FA5 !important;
    outline-offset: 2px !important;
  }

  /* ── 인쇄(PDF) 모드 — 그림자/그라데이션 단순화 ── */
  @media print {
    .fpga-theme .slides section,
    .fpga-theme .slides section * {
      box-shadow: none !important;
      text-shadow: none !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .fpga-theme .slides section table {
      box-shadow: none !important;
    }
  }
`;
