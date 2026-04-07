'use client';

import { EDA, edaStyles } from './EdaSlideStyles';
import { useEffect, useRef, useState, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
type LineType = 'normal' | 'cmd' | 'section' | 'success' | 'warn' | 'info' | 'arrow' | 'thinking';

interface TermLine {
  text: string;
  type: LineType;
  /** ms to wait before this line appears (cumulative from start) */
  at: number;
  /** if true, replaces the last 'thinking' line */
  replacesThinking?: boolean;
}

const LINE_COLOR: Record<LineType, string> = {
  normal:   '#CDD6E0',
  cmd:      '#7EC8E3',
  section:  '#F0E68C',
  success:  '#86EFAC',
  warn:     '#FCA5A5',
  info:     '#94A3B8',
  arrow:    '#A5D6A7',
  thinking: '#5B8DB8',
};

// ── Build lines with absolute timestamps ──────────────────────────────────
function build(items: { text: string; type: LineType; gap: number; replacesThinking?: boolean }[]): TermLine[] {
  let t = 0;
  return items.map(item => {
    t += item.gap;
    return { text: item.text, type: item.type, at: t, replacesThinking: item.replacesThinking };
  });
}

const LEFT_LINES = build([
  { text: '$ rm -rf ./chroma_db',               type: 'cmd',     gap: 700  },
  { text: '$ python rag_test.py',                type: 'cmd',     gap: 350  },
  { text: '',                                     type: 'normal',  gap: 120  },
  { text: '══════════════════════════',           type: 'section', gap: 250  },
  { text: '[1/5] 문서 로딩 중...',               type: 'section', gap: 160  },
  { text: '══════════════════════════',           type: 'section', gap: 120  },
  { text: '→ 4개 문서 로딩 완료',                type: 'arrow',   gap: 680  },
  { text: '  회사소개_EDnC.txt: 1349자',         type: 'info',    gap: 100  },
  { text: '  CAD_솔루션_안내.txt: 1284자',       type: 'info',    gap: 100  },
  { text: '  EDA_솔루션_안내.txt: 1316자',       type: 'info',    gap: 100  },
  { text: '  휴가_정책.txt: 799자',              type: 'info',    gap: 100  },
  { text: '',                                     type: 'normal',  gap: 120  },
  { text: '══════════════════════════',           type: 'section', gap: 200  },
  { text: '[2/5] 텍스트 청킹 중...',             type: 'section', gap: 160  },
  { text: '══════════════════════════',           type: 'section', gap: 120  },
  { text: '→ 23개 청크 생성 완료',               type: 'arrow',   gap: 520  },
  { text: '→ 평균 길이: 204자',                  type: 'arrow',   gap: 140  },
  { text: '',                                     type: 'normal',  gap: 120  },
  { text: '══════════════════════════',           type: 'section', gap: 200  },
  { text: '[3/5] 임베딩/벡터DB 저장...',         type: 'section', gap: 160  },
  { text: '══════════════════════════',           type: 'section', gap: 120  },
  { text: 'embeddings = OllamaEmbeddings(',       type: 'info',    gap: 420  },
  { text: '    model="nomic-embed-text")',         type: 'info',    gap: 110  },
  { text: '⏳ 임베딩 처리 중...',                type: 'thinking', gap: 200  },
  { text: '→ 벡터DB 저장 완료 (3.9초)',          type: 'arrow',   gap: 1400, replacesThinking: true },
]);

const RIGHT_LINES = build([
  { text: '══════════════════════════',           type: 'section', gap: 220  },
  { text: '[4/5] 검색 테스트...',                type: 'section', gap: 160  },
  { text: '══════════════════════════',           type: 'section', gap: 120  },
  { text: '질문: ED&C는 어떤 회사?',             type: 'normal',  gap: 430  },
  { text: '→ 3개 문서 검색됨',                   type: 'arrow',   gap: 640  },
  { text: '  [1] EDA_솔루션_안내.txt',           type: 'info',    gap: 110  },
  { text: '  [2] 회사소개_EDnC.txt',             type: 'info',    gap: 110  },
  { text: '  [3] CAD_솔루션_안내.txt',           type: 'info',    gap: 110  },
  { text: '',                                     type: 'normal',  gap: 120  },
  { text: '══════════════════════════',           type: 'section', gap: 200  },
  { text: '[5/5] RAG Q&A 테스트...',             type: 'section', gap: 160  },
  { text: '══════════════════════════',           type: 'section', gap: 120  },
  { text: 'Q1: ED&C 는 언제 설립된 회사인가요?', type: 'normal',  gap: 380  },
  { text: '🤖 LLM 추론 중...',                   type: 'thinking', gap: 200  },
  { text: 'A: 이디앤씨(ED&C)는 1998년 12월 설립.', type: 'success', gap: 1600, replacesThinking: true },
  { text: '   응답 시간: 9.4초',                 type: 'info',    gap: 150  },
  { text: '',                                     type: 'normal',  gap: 120  },
  { text: 'Q2: Calibre 제품과 교육 내용은?',     type: 'normal',  gap: 320  },
  { text: '🤖 LLM 추론 중...',                   type: 'thinking', gap: 200  },
  { text: 'A: Calibre는 IC 검증 및 DFM 도구입니다.', type: 'warn', gap: 2000, replacesThinking: true },
  { text: '⚠ 할루시네이션 발생   응답: 31.7초', type: 'warn',    gap: 180  },
  { text: '',                                     type: 'normal',  gap: 120  },
  { text: 'Q3: 오토데스크 PDMC 패키지 구성은?',  type: 'normal',  gap: 320  },
  { text: '🤖 LLM 추론 중...',                   type: 'thinking', gap: 200  },
  { text: 'A: 관련 정보를 찾을 수 없습니다.',   type: 'warn',    gap: 1600, replacesThinking: true },
  { text: '⚠ 할루시네이션 발생   응답: 23.9초', type: 'warn',    gap: 180  },
  { text: '',                                     type: 'normal',  gap: 120  },
  { text: '✓ RAG 테스트 완료!',                  type: 'success', gap: 480  },
]);

// ── Thinking line with animated dots ──────────────────────────────────────
function ThinkingLine({ text }: { text: string }) {
  const [frame, setFrame] = useState(0);
  const frames = ['', '▋', '▋▋', '▋▋▋'];
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % frames.length), 260);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", "Consolas", monospace',
      fontSize: '0.68rem', lineHeight: 1.55,
      color: LINE_COLOR.thinking, whiteSpace: 'pre' as const, opacity: 0.9,
    }}>
      {text}{frames[frame]}
    </div>
  );
}

// ── Blinking cursor ────────────────────────────────────────────────────────
function Cursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 520);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '0.68rem', lineHeight: 1.55,
      color: '#86EFAC', opacity: on ? 1 : 0,
    }}>█</div>
  );
}

// ── Terminal panel ─────────────────────────────────────────────────────────
function Terminal({ title, lines, done }: { title: string; lines: TermLine[]; done: boolean }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines.length]);

  return (
    <div style={{
      background: '#0D1117', borderRadius: '8px', overflow: 'hidden',
      boxShadow: '0 6px 24px rgba(0,0,0,0.40)', border: '1px solid #30363D',
      display: 'flex', flexDirection: 'column', height: '490px',
    }}>
      <div style={{
        background: '#21262D', padding: '0.4rem 0.9rem',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        borderBottom: '1px solid #30363D', flexShrink: 0,
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FEBC2E' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28C840' }} />
        <span style={{ color: '#8B949E', fontSize: '0.72rem', marginLeft: '0.4rem', fontFamily: 'monospace' }}>
          {title}
        </span>
      </div>
      <div ref={bodyRef} style={{
        padding: '0.75rem 0.9rem', display: 'flex', flexDirection: 'column',
        gap: '1px', overflowY: 'auto', flex: 1, scrollbarWidth: 'none' as const,
      }}>
        {lines.map((line, i) =>
          line.type === 'thinking'
            ? <ThinkingLine key={i} text={line.text} />
            : <div key={i} style={{
                fontFamily: '"JetBrains Mono", "Consolas", monospace',
                fontSize: '0.68rem', lineHeight: 1.55,
                color: LINE_COLOR[line.type] ?? LINE_COLOR.normal,
                whiteSpace: 'pre' as const,
              }}>{line.text}</div>
        )}
        {!done && <Cursor />}
      </div>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────
function addLine(prev: TermLine[], line: TermLine): TermLine[] {
  if (line.replacesThinking) {
    const idx = [...prev].reverse().findIndex(l => l.type === 'thinking');
    if (idx !== -1) {
      const real = prev.length - 1 - idx;
      const next = [...prev];
      next[real] = line;
      return next;
    }
  }
  return [...prev, line];
}

// ── Main slide ─────────────────────────────────────────────────────────────
export default function RAGLogSlide() {
  const sectionRef = useRef<HTMLElement>(null);
  const timersRef  = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [leftLines,  setLeftLines]  = useState<TermLine[]>([]);
  const [rightLines, setRightLines] = useState<TermLine[]>([]);
  const [leftDone,   setLeftDone]   = useState(false);
  const [rightDone,  setRightDone]  = useState(false);

  /** Cancel all pending timeouts and reset both terminals */
  const resetAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setLeftLines([]);
    setRightLines([]);
    setLeftDone(false);
    setRightDone(false);
  }, []);

  /** Schedule every line for both terminals from time 0, simultaneously */
  const startAll = useCallback(() => {
    resetAll();

    const timers: ReturnType<typeof setTimeout>[] = [];

    LEFT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setLeftLines(prev => addLine(prev, line));
        if (i === LEFT_LINES.length - 1) setLeftDone(true);
      }, line.at));
    });

    const RIGHT_OFFSET = 3500; // right terminal starts after left has been running for 3.5s
    RIGHT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setRightLines(prev => addLine(prev, line));
        if (i === RIGHT_LINES.length - 1) setRightDone(true);
      }, line.at + RIGHT_OFFSET));
    });

    timersRef.current = timers;
  }, [resetAll]);

  // Watch for Reveal.js 'present' class on this section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      if (el.classList.contains('present')) startAll();
      else resetAll();
    });

    observer.observe(el, { attributes: true, attributeFilter: ['class'] });

    if (el.classList.contains('present')) startAll();

    return () => { observer.disconnect(); resetAll(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={sectionRef} data-background-color={EDA.bg}>
      <div style={edaStyles.contentWrap}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ ...edaStyles.slideHeader, marginBottom: 0, flex: 1 }}>
            RAG 파이프라인 실행 로그
          </div>
          <button
            onClick={startAll}
            style={{
              marginLeft: '0.8rem', background: '#21262D', color: '#7EC8E3',
              border: '1px solid #30363D', borderRadius: '5px',
              padding: '4px 12px', fontSize: '0.72rem',
              fontFamily: '"JetBrains Mono", monospace', cursor: 'pointer', flexShrink: 0,
            }}
          >
            ↺ replay
          </button>
        </div>

        <div style={edaStyles.grid2}>
          <Terminal title="rag_test.py — Steps 1-3" lines={leftLines}  done={leftDone}  />
          <Terminal title="rag_test.py — Steps 4-5" lines={rightLines} done={rightDone} />
        </div>
      </div>
    </section>
  );
}
