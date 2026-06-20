'use client';

import type { CSSProperties } from 'react';
import { useState, useEffect, useRef } from 'react';
import SlideModal from './SlideModal';
import VerilogCode from './VerilogCode';

const MONO = '"JetBrains Mono", monospace';

interface RevealCodeModalProps {
  /** 코드 라벨 (예: "pwm_rgb.v — 설계") */
  title: string;
  /** 강조색 */
  accent: string;
  /** 4자리 암호 (임시 숨김용 — 대단한 비밀 아님) */
  password: string;
  /** 인라인에 항상 표시하는 인터페이스부 (포트·파라미터 등) */
  portsCode: string;
  /** 잠금 해제 시 모달에서 보여줄 전체 코드 (인터페이스 + 구현) */
  fullCode: string;
  /** 인라인 잠금 상태 안내(짧게 — 빈 줄로 높이를 늘리지 않음) */
  placeholder?: string;
  /** 인라인 VerilogCode 스타일 */
  inlineStyle?: CSSProperties;
  /** 모달 VerilogCode 스타일(여유있게 크게) */
  modalStyle?: CSSProperties;
  /** 모달 헤더 보조 설명 */
  subtitle?: string;
}

/**
 * 긴 설계 코드용 "구현 보기" — 인라인은 인터페이스부만 컴팩트하게 두고,
 * 잠금 해제하면 전체 코드를 모달로 여유있게 표시한다.
 * (빈 줄 패딩으로 카드 높이를 키워 위쪽 다이어그램을 가리지 않도록.)
 * 짧은 코드는 기존 인라인 토글(RevealLock)을 그대로 써도 됨.
 */
export default function RevealCodeModal({
  title,
  accent,
  password,
  portsCode,
  fullCode,
  placeholder = '  // ⋯ 구현부 숨김 — 🔒 구현 보기 클릭(모달로 표시)\nendmodule',
  inlineStyle = { fontSize: '0.6rem', lineHeight: 1.42 },
  modalStyle = { fontSize: '0.84rem', lineHeight: 1.6 },
  subtitle,
}: RevealCodeModalProps) {
  const [pwOpen, setPwOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pwOpen) {
      setPw('');
      setError(false);
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [pwOpen]);

  const openCode = () => (unlocked ? setCodeOpen(true) : setPwOpen(true));
  const submit = () => {
    if (pw === password) {
      setUnlocked(true);
      setPwOpen(false);
      setCodeOpen(true);
    } else {
      setError(true);
    }
  };

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}>
        <span style={{ fontSize: '0.6rem', color: accent, fontWeight: 800, letterSpacing: '0.05em' }}>{title}</span>
        <button
          onClick={openCode}
          style={{
            cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none',
            fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.03em',
            color: unlocked ? '#1A2235' : accent,
            background: unlocked ? accent : 'transparent',
            border: `1px solid ${accent}`, borderRadius: '5px',
            padding: '2px 9px', fontFamily: MONO, transition: 'all 0.15s ease',
          }}
        >{unlocked ? '📄 구현 보기 ▸' : '🔒 구현 보기 ▸'}</button>
      </div>
      <VerilogCode code={`${portsCode}\n${placeholder}`} style={inlineStyle} />

      {/* 암호 입력 모달 */}
      <SlideModal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        contentStyle={{
          width: 'min(320px, 90vw)',
          background: '#0F1626', borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          border: '1px solid #2C3850',
          padding: '1.1rem 1.2rem',
          display: 'flex', flexDirection: 'column', gap: '0.7rem',
        }}
      >
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: accent, fontFamily: MONO }}>🔒 4자리 암호</div>
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
            border: `1px solid ${error ? '#E53E3E' : '#2C3850'}`, outline: 'none',
          }}
        />
        {error && (
          <div style={{ fontSize: '0.7rem', color: '#FF7B72', fontWeight: 700, textAlign: 'center' }}>✗ 암호 불일치</div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setPwOpen(false)}
            style={{ background: 'transparent', border: '1px solid #3A4860', color: '#9FB0CC', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700 }}
          >취소</button>
          <button
            onClick={submit}
            style={{ background: accent, border: `1px solid ${accent}`, color: '#0F1626', borderRadius: '6px', padding: '4px 14px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 800 }}
          >확인</button>
        </div>
      </SlideModal>

      {/* 전체 코드 모달 — 여유있게 */}
      <SlideModal
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        contentStyle={{
          width: 'min(840px, 92vw)', maxHeight: '88vh',
          background: '#0F1626', borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          border: '1px solid #2C3850',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderBottom: '1px solid #2C3850', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: accent, fontFamily: MONO }}>{title}</span>
          {subtitle && <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>{subtitle}</span>}
          <button
            onClick={() => setCodeOpen(false)}
            style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #3A4860', color: '#9FB0CC', borderRadius: '6px', padding: '2px 10px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700 }}
          >✕ 닫기 (Esc)</button>
        </div>
        <div style={{
          flex: 1, minHeight: 0, overflow: 'auto',
          padding: '0.9rem 1.2rem 1.1rem', background: '#16203A',
        }}>
          <VerilogCode code={fullCode} style={modalStyle} />
        </div>
      </SlideModal>
    </>
  );
}
