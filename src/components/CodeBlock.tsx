'use client';

import { useRef, useState, ReactNode } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  style?: React.CSSProperties;
  language?: string;
}

export default function CodeBlock({ children, style, language = 'C' }: CodeBlockProps) {
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
    <div style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.4)' }}>
      {/* ── Header bar (스크롤 영역 밖) ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e2029',
        padding: '6px 14px',
        borderBottom: '1px solid #2d3141',
      }}>
        {/* 언어 레이블 */}
        <span style={{
          color: '#6b7280',
          fontSize: '0.75rem',
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {language}
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
              {/* Check icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              복사됨
            </>
          ) : (
            <>
              {/* Clipboard icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="4" rx="1"/>
                <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/>
              </svg>
              복사
            </>
          )}
        </button>
      </div>

      {/* ── 코드 본문 (스크롤 영역) ── */}
      <div
        ref={codeRef}
        className="code-block"
        style={{
          borderRadius: 0,
          boxShadow: 'none',
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}
