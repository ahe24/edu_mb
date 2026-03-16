'use client';

import { useRef, useState, ReactNode } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  style?: React.CSSProperties;
  language?: string;
  title?: string;
}

export default function CodeBlock({ children, style, language = 'C', title }: CodeBlockProps) {
  const codeRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // &nbsp; (U+00A0) → 일반 공백 치환 후 복사 (컴파일러 인코딩 오류 방지)
    const raw = codeRef.current?.innerText || '';
    const text = raw
      .replace(/\u00a0/g, ' ')
      .replace(/\u200b/g, '');

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ borderRadius: '10px', boxShadow: '0 6px 20px rgba(0,0,0,0.4)', position: 'relative' }}>
      {/* ── Header bar (스크롤 영역 밖) ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e2029',
        padding: '8px 14px',
        borderBottom: '1px solid #2d3141',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        position: 'relative',
      }}>
        {/* 터미널 윈도우 컨트롤 버튼 (Red, Yellow, Green) */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ff5f56', border: '1px solid rgba(0,0,0,0.05)' }}></span>
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ffbd2e', border: '1px solid rgba(0,0,0,0.05)' }}></span>
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#27c93f', border: '1px solid rgba(0,0,0,0.05)' }}></span>
        </div>

        {/* 중앙 상단: 언어 또는 파일명 레이블 */}
        <span style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#828bb0',
          fontSize: '0.75rem',
          fontFamily: '"JetBrains Mono", monospace',
          letterSpacing: '0.04em',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          {title || (language.toUpperCase() === 'C' ? 'main.c' : language.toUpperCase() === 'VERILOG' ? 'design.v' : language)}
        </span>

        {/* 복사 버튼 */}
        <button
          onClick={handleCopy}
          title="코드 복사"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            backgroundColor: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
            color: copied ? '#4ade80' : '#9ca3af',
            border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '5px',
            fontSize: '0.72rem',
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            userSelect: 'none',
            outline: 'none',
          }}
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              복사됨
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="4" rx="1"/>
                <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/>
              </svg>
              복사
            </>
          )}
        </button>
      </div>

      <div
        ref={codeRef}
        className="code-block"
        style={{
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
          boxShadow: 'none',
          overflow: 'auto',
          maxHeight: style?.maxHeight || '450px',
          minHeight: '200px', // 너무 낮게 표시되는 것 방지
          paddingBottom: '20px', // 마지막 줄 여유 공간
          WebkitFontSmoothing: 'antialiased',
          ...style,
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .code-block::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          .code-block::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
          }
          .code-block::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 5px;
            border: 2px solid transparent;
            background-clip: content-box;
          }
          .code-block::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.25);
            background-clip: content-box;
          }
        `}} />
        {children}
      </div>
    </div>
  );
}
