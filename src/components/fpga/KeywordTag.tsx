'use client';

import { styles } from './FpgaSlideStyles';

interface KeywordTagProps {
  keywords: string[];
}

/**
 * 키워드 태그 목록
 * 슬라이드 내 핵심 기술 용어를 태그 형태로 나열
 */
export default function KeywordTag({ keywords }: KeywordTagProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {keywords.map((kw) => (
        <span key={kw} style={styles.tag}>{kw}</span>
      ))}
    </div>
  );
}
