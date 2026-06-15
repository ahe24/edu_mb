'use client';

import { type CSSProperties, type ReactNode } from 'react';

/**
 * 의존성 없는 경량 Verilog/SystemVerilog syntax highlighter.
 * 정규식 토크나이저로 keyword/comment/number/string/system-task만 색칠하고
 * 그 외(식별자·연산자·공백)는 <pre>의 기본 색을 그대로 상속.
 */

const KEYWORDS = new Set([
  'module', 'endmodule', 'input', 'output', 'inout', 'reg', 'wire', 'logic',
  'always', 'always_ff', 'always_comb', 'always_latch', 'posedge', 'negedge',
  'begin', 'end', 'if', 'else', 'case', 'casex', 'casez', 'endcase', 'default',
  'for', 'while', 'repeat', 'forever', 'assign', 'parameter', 'localparam',
  'generate', 'endgenerate', 'genvar', 'integer', 'initial', 'function',
  'endfunction', 'task', 'endtask', 'disable', 'wait', 'or', 'signed',
  'unsigned', 'typedef', 'enum', 'struct', 'union', 'packed', 'real', 'time',
]);

// VS Code Dark+ 계열 — 어두운 배경(#1A2235 등)에서 가독성 좋음
const COLOR = {
  keyword: '#569CD6',
  comment: '#6A9955',
  number: '#B5CEA8',
  string: '#CE9178',
  systask: '#DCDCAA',
};

// 1=comment 2=string 3=number(sized literal 또는 일반 숫자) 4=$systask 5=word
const TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*")|(\d+'[sS]?[bdhoBDHO][0-9a-fA-FxXzZ?_]+|\b\d[\d_]*\b)|(\$[A-Za-z_]\w*)|([A-Za-z_]\w*)/g;

function tokenize(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index)); // 식별자/연산자/공백 = 기본색
    const [full, cmt, str, num, sys, word] = m;
    if (cmt) {
      out.push(<span key={key++} style={{ color: COLOR.comment, fontStyle: 'italic' }}>{full}</span>);
    } else if (str) {
      out.push(<span key={key++} style={{ color: COLOR.string }}>{full}</span>);
    } else if (num) {
      out.push(<span key={key++} style={{ color: COLOR.number }}>{full}</span>);
    } else if (sys) {
      out.push(<span key={key++} style={{ color: COLOR.systask }}>{full}</span>);
    } else if (word) {
      if (KEYWORDS.has(word)) {
        out.push(<span key={key++} style={{ color: COLOR.keyword, fontWeight: 600 }}>{full}</span>);
      } else {
        out.push(full);
      }
    }
    last = TOKEN_RE.lastIndex;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export default function VerilogCode({ code, style }: { code: string; style?: CSSProperties }) {
  return (
    <pre
      style={{
        margin: 0,
        color: '#E2E8F0',
        fontFamily: 'Consolas, "Courier New", "Liberation Mono", monospace',
        fontVariantLigatures: 'none',
        WebkitFontVariantLigatures: 'none' as CSSProperties['fontVariantLigatures'],
        fontFeatureSettings: '"liga" 0, "calt" 0',
        whiteSpace: 'pre-wrap',
        ...style,
      }}
    >
      {tokenize(code)}
    </pre>
  );
}
