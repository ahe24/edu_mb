'use client';

import { useEffect, useRef, useState } from 'react';
import 'reveal.js/reveal.css';

/**
 * EDA 사업부 2026 사업방향 전용 Reveal.js Wrapper
 * - 다크 네이비 헤더 + 라이트 그레이 배경 테마
 */
export default function EdaRevealWrapper({ children }: { children: React.ReactNode }) {
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
          width: 1280,
          height: 720,
          margin: 0.02,
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
      <style dangerouslySetInnerHTML={{ __html: edaThemeCSS }} />

      <div className="reveal eda-theme" ref={deckRef} style={{ height: '100vh', width: '100vw' }}>
        <div className="slides">
          {children}
        </div>

        {/* Footer */}
        {mounted && !isPrintPDF && (
          <div style={{
            position: 'fixed',
            bottom: '6px',
            right: '100px',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            pointerEvents: 'none',
            opacity: 0.45,
          }}>
            <img src="/images/edmfg_logo.png" alt="Company Logo" style={{ height: '14px', width: 'auto' }} />
            <span style={{
              fontSize: '0.7rem',
              color: '#1B2B4B',
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 600,
            }}>©2026. EDA 사업부</span>
          </div>
        )}
      </div>
    </>
  );
}

const edaThemeCSS = `
  .eda-theme .slides section {
    font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
    color: #2C3E50;
    text-align: left;
    background: #F0F2F5;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-start !important;
    padding: 0.9rem 2.2rem !important;
    box-sizing: border-box !important;
    height: 100% !important;
  }

  /* contentWrap fills the section and lays out children in a column */
  .eda-theme .slides section > div.eda-content-wrap {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1180px;
  }

  .eda-theme .slides section > div,
  .eda-theme .slides section > table {
    width: 100%;
    max-width: 1180px;
  }

  .eda-theme .slides section h1,
  .eda-theme .slides section h2,
  .eda-theme .slides section h3 {
    color: #1B2B4B;
    font-weight: 700;
    letter-spacing: -0.02em;
    text-transform: none;
    width: 100%;
  }

  .eda-theme .slides section p {
    line-height: 1.7;
    font-size: 1.0rem;
  }

  .eda-theme .slides section ul,
  .eda-theme .slides section ol {
    font-size: 0.88rem;
    line-height: 1.8;
  }

  .eda-theme .slides section code {
    font-family: "JetBrains Mono", monospace;
    background: rgba(30, 90, 156, 0.08);
    color: #1E5A9C;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.88em;
  }

  .eda-theme .slides section table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    font-size: 0.88rem;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(27,43,75,0.08);
  }

  .eda-theme .slides section table th {
    background: #1B2B4B;
    color: #ffffff;
    padding: 9px 14px;
    text-align: left;
    font-weight: 600;
  }

  .eda-theme .slides section table td {
    padding: 7px 14px;
    border-bottom: 1px solid #DCE2EA;
    background: #ffffff;
  }

  .eda-theme .slides section table tr:last-child td {
    border-bottom: none;
  }

  .eda-theme .slides section table tr:nth-child(even) td {
    background: #F5F7FA;
  }

  .eda-theme .controls .navigate-left,
  .eda-theme .controls .navigate-right,
  .eda-theme .controls .navigate-up,
  .eda-theme .controls .navigate-down {
    color: #1B2B4B !important;
  }

  .eda-theme .progress span {
    background: #1E5A9C !important;
  }

  .eda-theme .slide-number {
    color: #FFFFFF !important;
    font-family: "JetBrains Mono", monospace !important;
    font-size: 0.75rem !important;
  }
`;
