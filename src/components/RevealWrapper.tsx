'use client';

import { useEffect, useRef, useState } from 'react';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/simple.css';

export default function RevealWrapper({ children }: { children: React.ReactNode }) {
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
          margin: 0.08,
          help: false,
          view: printMode ? 'print' : undefined,
          pdfSeparateFragments: false,
          pdfMaxPagesPerSlide: 1,
          plugins: [RevealNotes, RevealZoom],
        });

        await deckInstance.current.initialize();

        // Ctrl+E: PDF 내보내기 (새 탭에서 ?print-pdf 모드)
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
    <div className="reveal" ref={deckRef} style={{ height: '100vh', width: '100vw' }}>
      <div className="slides">
        {children}
      </div>

      {/* ── Footer UI (Logo & Copyright) — 인쇄 모드에서 숨김 ── */}
      <div style={{
        position: 'fixed',
        bottom: '0.1px',
        left: '30px',
        zIndex: 50,
        display: (mounted && isPrintPDF) ? 'none' : 'flex',
        alignItems: 'center',
        gap: '5px',
        pointerEvents: 'none',
        opacity: 0.6,
      }}>
        <img
          src="/images/edmfg_logo.png"
          alt="Company Logo"
          style={{
            height: '16px',
            width: 'auto',
          }}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '0.8rem',
          color: '#5f796aff', // 'var(--primary-dark)',
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: 600,
        }}>
          <span>©2026. Changseon Jo. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
