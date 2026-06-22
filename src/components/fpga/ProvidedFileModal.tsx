'use client';

import { useState, type ReactNode } from 'react';
import { FPGA, shadow } from './FpgaSlideStyles';
import SlideModal from './SlideModal';

const MONO = '"JetBrains Mono", monospace';

interface ProvidedFileModalProps {
  /** 파일명 배지 (예: "arty.xdc", "tb_traffic_light.sv") */
  filename: string;
  /** 강조색 */
  accent: string;
  /** 버튼에 표시할 짧은 설명 */
  hint: ReactNode;
  /** 모달 헤더 보조 설명 */
  modalSubtitle?: string;
  /** 파일 내용 (모달 표시 + 클립보드 복사) */
  code: string;
}

/**
 * 교육생에게 "미리 제공"하는 파일(XDC 핀 제약 · 테스트벤치 등)을
 * 클릭하면 전체 코드를 모달로 띄우고, 그대로 복사해 쓸 수 있게 한다.
 * (학생이 직접 작성하는 설계 코드는 RevealCodeModal 로 잠금 — 역할 분리.)
 */
export default function ProvidedFileModal({ filename, accent, hint, modalSubtitle, code }: ProvidedFileModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 일부 환경(비-https 등)은 clipboard API 미지원 — 모달에서 직접 선택 복사
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: `linear-gradient(135deg, ${accent}0F, ${accent}1E)`,
          border: `1px solid ${accent}45`, borderLeft: `4px solid ${accent}`,
          borderRadius: '9px', padding: '0.42rem 0.6rem',
          boxShadow: shadow.card, cursor: 'pointer', textAlign: 'left', width: '100%',
        }}
      >
        <span style={{
          fontSize: '0.55rem', fontWeight: 800, color: '#fff', background: accent,
          padding: '2px 6px', borderRadius: '5px', fontFamily: MONO, flexShrink: 0,
        }}>{filename}</span>
        <span style={{ fontSize: '0.58rem', color: FPGA.text, lineHeight: 1.3 }}>{hint}</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 800, color: accent, flexShrink: 0 }}>📋 ▸</span>
      </button>

      <SlideModal
        open={open}
        onClose={() => setOpen(false)}
        contentStyle={{
          width: 'min(860px, 92vw)', maxHeight: '88vh',
          background: '#0F1626', borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          border: '1px solid #2C3850',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderBottom: '1px solid #2C3850', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: accent, fontFamily: MONO }}>{filename}</span>
          {modalSubtitle && <span style={{ fontSize: '0.64rem', color: '#7C90B0' }}>{modalSubtitle}</span>}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
            <button
              onClick={copy}
              style={{
                background: copied ? accent : 'transparent', border: `1px solid ${accent}`,
                color: copied ? '#0F1626' : accent, borderRadius: '6px', padding: '2px 12px',
                cursor: 'pointer', fontSize: '0.72rem', fontWeight: 800, fontFamily: MONO,
                transition: 'all 0.15s ease',
              }}
            >{copied ? '✓ 복사됨' : '📋 복사'}</button>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent', border: '1px solid #3A4860',
                color: '#9FB0CC', borderRadius: '6px', padding: '2px 10px', cursor: 'pointer',
                fontSize: '0.74rem', fontWeight: 700,
              }}
            >✕ 닫기 (Esc)</button>
          </div>
        </div>
        <pre style={{
          margin: 0, flex: 1, minHeight: 0, overflow: 'auto',
          padding: '0.7rem 1.1rem 1rem', background: '#16203A',
          fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
          fontSize: '0.74rem', lineHeight: 1.55, color: '#C7D2E8', whiteSpace: 'pre',
        }}>
          {code}
        </pre>
      </SlideModal>
    </>
  );
}
