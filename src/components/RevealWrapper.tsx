'use client';

import { useEffect, useRef } from 'react';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/simple.css'; // 밝고 심플한 기본 테마로 변경

export default function RevealWrapper({ children }: { children: React.ReactNode }) {
  const deckRef = useRef<HTMLDivElement>(null);
  const deckInstance = useRef<any>(null);

  useEffect(() => {
    const initReveal = async () => {
      if (deckRef.current && !deckInstance.current) {
        // SSR 대응: 브라우저 환경에서만 동적으로 모듈 로드
        const Reveal = (await import('reveal.js')).default;
        // @ts-ignore
        const RevealNotes = (await import('reveal.js/plugin/notes')).default;
        // @ts-ignore
        const RevealZoom = (await import('reveal.js/plugin/zoom')).default;

        deckInstance.current = new Reveal(deckRef.current, {
          hash: true,
          slideNumber: true,
          controls: true,
          progress: true,
          center: true,
          width: 1280,
          height: 720,
          margin: 0.08,
          help: false, // 도움말(N 아이콘 등) 숨기기
          plugins: [RevealNotes, RevealZoom],
        });

        await deckInstance.current.initialize();
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
    };
  }, []);

  return (
    <div className="reveal" ref={deckRef} style={{ height: '100vh', width: '100vw' }}>
      <div className="slides">
        {children}
      </div>
    </div>
  );
}
