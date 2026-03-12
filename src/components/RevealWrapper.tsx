'use client';

import { useEffect, useRef } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/simple.css'; // 밝고 심플한 기본 테마로 변경

export default function RevealWrapper({ children }: { children: React.ReactNode }) {
  const deckRef = useRef<HTMLDivElement>(null);
  const deckInstance = useRef<any>(null);

  useEffect(() => {
    if (deckRef.current && !deckInstance.current) {
      deckInstance.current = new Reveal(deckRef.current, {
        hash: true,
        slideNumber: true,
        controls: true,
        progress: true,
        center: true,
        width: 1280,
        height: 720,
        margin: 0.08,
      });

      if (deckInstance.current) {
        deckInstance.current.initialize();
      }
    }

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
