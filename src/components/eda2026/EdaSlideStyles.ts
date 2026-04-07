/**
 * EDA 사업부 2026 발표 슬라이드 공통 스타일 상수
 *
 * 색상 팔레트 (원본 PPT 스타일 기반):
 *   Primary   : #1B2B4B (Dark Navy) — 헤더, 강조 배경
 *   Blue      : #1E5A9C (Corporate Blue) — 버튼, 배지
 *   BlueLight : #2E7CC4 — 보조 강조
 *   Accent    : #0093D0 (Bright Blue) — 핵심 포인트
 *   BG        : #F0F2F5 — 기본 배경
 *   Text      : #2C3E50 — 본문
 *   TextLight : #64748B — 부가 설명
 */

export const EDA = {
  navy: '#1B2B4B',
  navyMid: '#243655',
  navyLight: '#2E4A78',
  blue: '#1E5A9C',
  blueLight: '#2E7CC4',
  accent: '#0093D0',
  accentBg: 'rgba(0, 147, 208, 0.10)',
  bg: '#F0F2F5',
  bgAlt: '#E8ECF1',
  bgCard: '#FFFFFF',
  text: '#2C3E50',
  textLight: '#64748B',
  border: '#DCE2EA',
  success: '#27AE60',
  successBg: 'rgba(39, 174, 96, 0.10)',
  warning: '#E67E22',
  warningBg: 'rgba(230, 126, 34, 0.10)',
  danger: '#C0392B',
  white: '#FFFFFF',
} as const;

export const edaShadow = {
  card: '0 2px 12px rgba(27, 43, 75, 0.10), 0 1px 3px rgba(27, 43, 75, 0.06)',
  cardHover: '0 6px 24px rgba(27, 43, 75, 0.14)',
  deep: '0 10px 40px rgba(27, 43, 75, 0.18)',
  table: '0 2px 10px rgba(27, 43, 75, 0.08)',
} as const;

export const edaStyles = {
  /** Use this as className="eda-content-wrap" AND style={edaStyles.contentWrap} */
  contentWrap: {
    width: '100%',
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '0 0.5rem',
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column' as const,
  } as const,

  /** 슬라이드 상단 헤더 바 (네이비) */
  slideHeader: {
    background: EDA.navy,
    color: EDA.white,
    fontSize: '1.6rem',
    fontWeight: 800 as const,
    letterSpacing: '-0.01em',
    padding: '0.55rem 1.2rem',
    marginBottom: '1.0rem',
    borderRadius: '6px',
    width: '100%',
  } as const,

  /** 슬라이드 부제목 이탤릭 */
  subtitle: {
    color: EDA.textLight,
    fontStyle: 'italic' as const,
    fontSize: '0.9rem',
    marginBottom: '0.9rem',
    display: 'block' as const,
  } as const,

  /** 기본 카드 */
  card: {
    background: EDA.bgCard,
    border: `1px solid ${EDA.border}`,
    borderRadius: '10px',
    padding: '1.1rem 1.3rem',
    boxShadow: '0 2px 12px rgba(27,43,75,0.09)',
  } as const,

  /** 강조 카드 (navy 배경) */
  cardNavy: {
    background: EDA.navy,
    color: EDA.white,
    borderRadius: '10px',
    padding: '1.1rem 1.3rem',
    boxShadow: '0 4px 16px rgba(27,43,75,0.20)',
  } as const,

  /** 2열 그리드 — flex:1 로 남은 세로 공간 채움 */
  grid2: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr',
    gridAutoRows: '1fr',
    gap: '1.1rem',
    width: '100%',
    flex: 1,
    minHeight: 0,
  } as const,

  /** 3열 그리드 — flex:1 로 남은 세로 공간 채움 */
  grid3: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr 1fr',
    gridAutoRows: '1fr',
    gap: '1.0rem',
    width: '100%',
    flex: 1,
    minHeight: 0,
  } as const,

  /** 결론/키포인트 하단 바 */
  conclusionBar: {
    background: EDA.navy,
    color: EDA.white,
    borderRadius: '6px',
    padding: '0.65rem 1.2rem',
    fontSize: '0.88rem',
    fontWeight: 600 as const,
    marginTop: '0.8rem',
    width: '100%',
    textAlign: 'center' as const,
  } as const,

  /** 번호 배지 (원형) */
  numBadge: (color: string = EDA.navy) => ({
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: '32px',
    height: '32px',
    minWidth: '32px',
    borderRadius: '50%',
    background: color,
    color: EDA.white,
    fontSize: '0.9rem',
    fontWeight: 800 as const,
    marginRight: '10px',
    flexShrink: 0 as const,
  }),

  /** 알파벳 배지 (원형, 큰) */
  alphaBadge: (color: string = EDA.navy) => ({
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: '40px',
    height: '40px',
    minWidth: '40px',
    borderRadius: '50%',
    background: color,
    color: EDA.white,
    fontSize: '1.1rem',
    fontWeight: 800 as const,
    marginRight: '12px',
    flexShrink: 0 as const,
  }),

  /** 태그 (인라인 pill) */
  tag: {
    display: 'inline-block' as const,
    background: 'rgba(30,90,156,0.08)',
    border: '1px solid rgba(30,90,156,0.18)',
    borderRadius: '4px',
    padding: '2px 9px',
    fontSize: '0.80rem',
    color: EDA.blue,
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: 500 as const,
    marginRight: '6px',
    marginBottom: '4px',
  } as const,

  /** 본문 텍스트 */
  bodyText: {
    fontSize: '0.88rem',
    color: EDA.text,
    lineHeight: 1.7,
  } as const,

  /** 리스트 항목 */
  listItem: {
    fontSize: '0.88rem',
    color: EDA.text,
    lineHeight: 1.75,
    listStyle: 'disc' as const,
    marginLeft: '1.2em',
  } as const,
} as const;
