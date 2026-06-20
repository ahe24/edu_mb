'use client';

import { useState, useEffect, useRef } from 'react';
import SlideModal from './SlideModal';

const MONO = '"JetBrains Mono", monospace';

interface RevealLockProps {
  /** 현재 공개 여부 */
  revealed: boolean;
  /** 암호 일치 시 호출 — 공개 */
  onReveal: () => void;
  /** 숨기기 호출 */
  onHide: () => void;
  /** 4자리 암호 (임시 숨김용 — 대단한 비밀 아님) */
  password: string;
  /** 강조색 */
  accent: string;
}

/**
 * "구현 보기" 임시 잠금 버튼.
 * 클릭 시 4자리 암호를 입력받아 일치하면 onReveal() 호출.
 * 수업 중 즉시 노출만 막는 간단 장치 (강한 보안 아님).
 */
export default function RevealLock({ revealed, onReveal, onHide, password, accent }: RevealLockProps) {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPw('');
      setError(false);
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const submit = () => {
    if (pw === password) {
      onReveal();
      setOpen(false);
    } else {
      setError(true);
    }
  };

  return (
    <>
      <button
        onClick={() => (revealed ? onHide() : setOpen(true))}
        style={{
          cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none',
          fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.03em',
          color: revealed ? '#1A2235' : accent,
          background: revealed ? accent : 'transparent',
          border: `1px solid ${accent}`, borderRadius: '5px',
          padding: '2px 9px', fontFamily: MONO, transition: 'all 0.15s ease',
        }}
      >
        {revealed ? '구현 숨기기 ▾' : '🔒 구현 보기 ▸'}
      </button>

      <SlideModal
        open={open}
        onClose={() => setOpen(false)}
        contentStyle={{
          width: 'min(320px, 90vw)',
          background: '#0F1626', borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          border: '1px solid #2C3850',
          padding: '1.1rem 1.2rem',
          display: 'flex', flexDirection: 'column', gap: '0.7rem',
        }}
      >
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: accent, fontFamily: MONO }}>
          🔒 4자리 암호
        </div>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={pw}
          onChange={(e) => { setPw(e.target.value.replace(/\D/g, '')); setError(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          placeholder="••••"
          style={{
            width: '100%', boxSizing: 'border-box',
            fontSize: '1.1rem', fontFamily: MONO, letterSpacing: '0.4em', textAlign: 'center',
            padding: '0.45rem 0.7rem', borderRadius: '7px',
            background: '#16203A', color: '#E2E8F0',
            border: `1px solid ${error ? '#E53E3E' : '#2C3850'}`,
            outline: 'none',
          }}
        />
        {error && (
          <div style={{ fontSize: '0.7rem', color: '#FF7B72', fontWeight: 700, textAlign: 'center' }}>
            ✗ 암호 불일치
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: 'transparent', border: '1px solid #3A4860', color: '#9FB0CC',
              borderRadius: '6px', padding: '4px 12px', cursor: 'pointer',
              fontSize: '0.74rem', fontWeight: 700,
            }}
          >취소</button>
          <button
            onClick={submit}
            style={{
              background: accent, border: `1px solid ${accent}`, color: '#0F1626',
              borderRadius: '6px', padding: '4px 14px', cursor: 'pointer',
              fontSize: '0.74rem', fontWeight: 800,
            }}
          >확인</button>
        </div>
      </SlideModal>
    </>
  );
}
