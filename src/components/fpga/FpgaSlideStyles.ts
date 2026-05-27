/**
 * FPGA 검증교육 슬라이드 공통 스타일 상수
 *
 * 색상 팔레트:
 *   Primary   : #4A6FA5 (Steel Blue) — 제목, 강조
 *   Secondary : #6B8CC7 (Light Steel) — 보조 강조
 *   Accent    : #E8913A (Warm Orange) — 주의/경고, 핵심 포인트
 *   Dark      : #2B4570 (Navy) — 대제목
 *   BG        : #FAFBFD (Light) — 기본 배경
 *   BG Alt    : #F0F4F8 (Cool Gray) — 카드/박스 배경
 *   Text      : #2D3748 — 본문
 *   TextLight : #718096 — 부가 설명
 */

export const FPGA = {
  // ── Colors ──
  primary: '#4A6FA5',
  primaryLight: '#6B8CC7',
  primaryBg: 'rgba(74, 111, 165, 0.08)',
  accent: '#E8913A',
  accentBg: 'rgba(232, 145, 58, 0.10)',
  dark: '#2B4570',
  bg: '#FAFBFD',
  bgAlt: '#F0F4F8',
  text: '#2D3748',
  textLight: '#718096',
  border: '#E2E8F0',
  success: '#48BB78',
  successBg: 'rgba(72, 187, 120, 0.10)',
  danger: '#E53E3E',
  dangerBg: 'rgba(229, 62, 62, 0.08)',
  white: '#FFFFFF',
} as const;

// ── 그림자 프리셋 (입체감 확보) ──
export const shadow = {
  /** 카드 기본 그림자 */
  card: '0 4px 16px rgba(0, 0, 0, 0.10), 0 1px 4px rgba(0, 0, 0, 0.06)',
  /** 강조 카드 / hover 그림자 */
  cardHover: '0 8px 30px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.08)',
  /** 깊은 그림자 (팝업, 모달급) */
  deep: '0 12px 40px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.10)',
  /** 인셋 그림자 (눌린 느낌) */
  inset: 'inset 0 2px 6px rgba(0, 0, 0, 0.06)',
  /** 테이블 그림자 */
  table: '0 2px 12px rgba(0, 0, 0, 0.08)',
} as const;

// ── Slide background (section data-background-color에 사용) ──
export const slideBg = FPGA.bg;
export const slideBgAlt = FPGA.bgAlt;

// ── 슬라이드 컨텐츠 래퍼 (중앙 정렬 + 전체 폭 활용) ──
export const slideContentWrapper = {
  width: '100%',
  maxWidth: '1180px',
  margin: '0 auto',
  padding: '0 1rem',
} as const;

// ── 공통 인라인 스타일 ──
export const styles = {
  /** 슬라이드 컨텐츠 래퍼 — 모든 슬라이드에서 감싸기 */
  contentWrap: slideContentWrapper,

  /** 슬라이드 상단 태그 배지 */
  badge: (label?: string) => ({
    display: 'inline-block' as const,
    background: 'transparent',
    borderLeft: `3px solid ${FPGA.primary}`,
    borderRadius: '2px',
    padding: '1px 10px',
    fontSize: '0.7rem',
    color: FPGA.textLight,
    letterSpacing: '0.02em',
    fontWeight: 600 as const,
  }),

  /** 슬라이드 제목 (h2) */
  slideTitle: {
    color: FPGA.dark,
    fontSize: '2.2rem',
    fontWeight: 800 as const,
    letterSpacing: '-0.03em',
    marginBottom: '1.2rem',
    textAlign: 'center' as const,
  },

  /** 슬라이드 부제 (h3) */
  slideSubtitle: {
    color: FPGA.primary,
    fontSize: '1.4rem',
    fontWeight: 600 as const,
    marginBottom: '1rem',
    textAlign: 'center' as const,
  },

  /** 정보 카드 (그리드 아이템) — 입체감 + 그림자 */
  card: {
    background: FPGA.white,
    border: `1px solid ${FPGA.border}`,
    borderRadius: '14px',
    padding: '1.3rem 1.5rem',
    textAlign: 'left' as const,
    boxShadow: shadow.card,
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },

  /** 강조 카드 (primary 계열) */
  cardHighlight: {
    background: `linear-gradient(135deg, rgba(74, 111, 165, 0.06) 0%, rgba(74, 111, 165, 0.12) 100%)`,
    border: `1px solid ${FPGA.primaryLight}30`,
    borderRadius: '14px',
    padding: '1.3rem 1.5rem',
    textAlign: 'left' as const,
    boxShadow: shadow.card,
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },

  /** 경고/주의 카드 */
  cardWarning: {
    background: `linear-gradient(135deg, rgba(232, 145, 58, 0.06) 0%, rgba(232, 145, 58, 0.12) 100%)`,
    border: `1px solid ${FPGA.accent}30`,
    borderRadius: '14px',
    padding: '1.3rem 1.5rem',
    textAlign: 'left' as const,
    boxShadow: shadow.card,
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },

  /** 2열 그리드 — 전체 폭 활용 */
  grid2: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr',
    gap: '1.2rem',
    width: '100%',
  },

  /** 3열 그리드 — 전체 폭 활용 */
  grid3: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1.2rem',
    width: '100%',
  },

  /** 키워드 태그 (인라인) */
  tag: {
    display: 'inline-block' as const,
    background: FPGA.primaryBg,
    border: `1px solid ${FPGA.primaryLight}30`,
    borderRadius: '6px',
    padding: '2px 10px',
    fontSize: '0.82rem',
    color: FPGA.primary,
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: 500 as const,
    marginRight: '6px',
    marginBottom: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
  },

  /** 핵심 포인트 강조 텍스트 */
  keyPoint: {
    color: FPGA.accent,
    fontWeight: 700 as const,
  },

  /** 부가 설명 텍스트 */
  caption: {
    fontSize: '0.85rem',
    color: FPGA.textLight,
    lineHeight: 1.6,
  },

  /** 리스트 아이템 앞 불릿 대용 아이콘 */
  bulletIcon: {
    color: FPGA.primary,
    marginRight: '8px',
    fontWeight: 700 as const,
  },

  /** 테이블 래퍼 — 그림자 + 둥근 모서리 */
  tableWrap: {
    borderRadius: '12px',
    overflow: 'hidden' as const,
    boxShadow: shadow.table,
    width: '100%',
  },

  /** 타이틀 슬라이드 전용 */
  titleSlide: {
    title: {
      color: FPGA.primary,
      fontSize: '3.2rem',
      fontWeight: 800 as const,
      letterSpacing: '-0.03em',
      textAlign: 'center' as const,
    },
    subtitle: {
      color: FPGA.text,
      fontSize: '1.8rem',
      fontWeight: 400 as const,
      marginTop: '0.8rem',
      textAlign: 'center' as const,
    },
    meta: {
      marginTop: '2.5rem',
      fontSize: '1.1rem',
      color: FPGA.textLight,
      textAlign: 'center' as const,
    },
  },
} as const;
