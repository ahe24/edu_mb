'use client';

/**
 * 무기체계 속의 FPGA — 1장. 오프닝 (사고에서 시작하는 이야기)
 *
 * 슬라이드:
 *   1. 타이틀
 *   2. 도입 질문
 *   3. 사례 ① 보잉 737 MAX (346명)
 *   4. 사례 ② 패트리어트 요격 실패 (28명) — 어셈블리 코드 + range gate 다이어그램
 *   5. 사례 ③ F-22 날짜변경선 (인명피해 없음, 긴장 완화)
 *   6. 공통점 정리 + 항공전자란? (+ 하향 ↓ 백업 사례 4건)
 */

import { useEffect, useState } from 'react';
import { FPGA, slideBg, styles, shadow, edgeBorder } from '../fpga/FpgaSlideStyles';
import SlideHeader from '../fpga/SlideHeader';
import ImagePlaceholder from '../ImagePlaceholder';

const CH1 = '1장 · 사고에서 시작하는 이야기';
const RED = FPGA.danger;

/* ── 재사용: 사상자/결과 강조 배지 ── */
function ResultStat({ value, label, tone = 'danger' }: { value: string; label: string; tone?: 'danger' | 'neutral' }) {
  const color = tone === 'danger' ? RED : FPGA.primary;
  const bg = tone === 'danger'
    ? 'linear-gradient(135deg, rgba(229,62,62,0.10), rgba(229,62,62,0.04))'
    : 'linear-gradient(135deg, rgba(74,111,165,0.10), rgba(74,111,165,0.04))';
  return (
    <div style={{
      background: bg,
      ...edgeBorder(`${color}30`, 'left', color),
      borderRadius: '12px',
      padding: '0.85rem 1.2rem',
      boxShadow: shadow.card,
      display: 'flex',
      alignItems: 'baseline',
      gap: '0.7rem',
    }}>
      <span style={{ fontSize: '1.9rem', fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '0.9rem', color: FPGA.text, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

/* ── 재사용: 흐름 단계 박스 ── */
function FlowStep({ text, color }: { text: string; color: string }) {
  return (
    <div style={{
      flex: 1,
      background: FPGA.white,
      ...edgeBorder(`${color}30`, 'top', color, '3px'),
      borderRadius: '10px',
      padding: '0.7rem 0.85rem',
      boxShadow: shadow.card,
      fontSize: '0.9rem',
      color: FPGA.text,
      lineHeight: 1.45,
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
    }}>{text}</div>
  );
}

/* ── 재사용: 사진 카드 (사진 비율 그대로 contain, 카드는 사진 크기에 맞춤) ── */
function PhotoCard({ src, label, desc, caption, maxH = '380px' }: { src: string; label: string; desc: string; caption?: string; maxH?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '100%',
        background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '14px',
        boxShadow: shadow.card, padding: '0.6rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ImagePlaceholder src={src} label={label} desc={desc} maxHeight={maxH} />
      </div>
      {caption && (
        <div style={{ fontSize: '0.72rem', color: FPGA.textLight, textAlign: 'center', fontFamily: '"JetBrains Mono", monospace' }}>
          {caption}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   슬라이드 1 — 타이틀
   ══════════════════════════════════════════════════════════════ */
function TitleSlide() {
  return (
    <section
      data-background-color="#0D1B2E"
      style={{
        backgroundImage: 'radial-gradient(1100px 560px at 72% -10%, rgba(74,111,165,0.22) 0%, transparent 60%), linear-gradient(160deg, rgba(9,16,28,0.58) 0%, rgba(11,22,38,0.74) 55%, rgba(9,16,28,0.88) 100%), url(/images/defense/cockpit.png)',
        backgroundSize: 'cover, cover, cover',
        backgroundPosition: 'center, center, center',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
      }}
    >
      {/* 회로 그리드 오버레이 */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(107,140,199,0.10) 1px, transparent 1px),
          linear-gradient(90deg, rgba(107,140,199,0.10) 1px, transparent 1px)`,
        backgroundSize: '52px 52px',
        pointerEvents: 'none',
      }} />
      {/* 발광 오브 */}
      <div style={{
        position: 'absolute', bottom: '-90px', left: '-60px',
        width: '360px', height: '360px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,111,165,0.20) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '900px', margin: 'auto 0', textShadow: '0 2px 14px rgba(0,0,0,0.55)' }}>
        {/* 상단 라벨 */}
        <div style={{
          color: 'rgba(160,185,220,0.85)', fontSize: '0.95rem', fontWeight: 600,
          letterSpacing: '0.28em', marginBottom: '1.8rem',
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          무기체계 · 국방 항공전자
        </div>

        {/* 메인 타이틀 */}
        <div style={{ color: '#FFFFFF', fontSize: '3.4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
          무기체계 속의 <span style={{ color: FPGA.primaryLight }}>FPGA</span>
        </div>
        <div style={{ color: 'rgba(210,222,240,0.92)', fontSize: '1.5rem', fontWeight: 400, marginTop: '1.1rem' }}>
          국방 항공전자 개발은 무엇이 다른가
        </div>

        {/* 구분선 */}
        <div style={{ width: '160px', height: '2px', margin: '2rem auto', background: 'linear-gradient(90deg, transparent, rgba(107,140,199,0.7), transparent)' }} />

        <div style={{ color: 'rgba(180,200,230,0.85)', fontSize: '1.05rem' }}>
          Safety / Mission Critical 시스템 개발 프로세스
        </div>

        {/* 발표자 */}
        <div style={{
          marginTop: '2.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.9rem',
          color: 'rgba(200,215,235,0.9)', fontSize: '1.05rem',
        }}>
          <span style={{ fontWeight: 700 }}>조창선 이사</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>EDA 사업부</span>
        </div>
      </div>

    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   슬라이드 2 — 도입 질문
   ══════════════════════════════════════════════════════════════ */
function QuestionSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em',
          color: FPGA.textLight, fontFamily: '"JetBrains Mono", monospace', marginBottom: '1.6rem',
        }}>
          QUESTION
        </div>
        <div style={{ fontSize: '2.6rem', fontWeight: 800, color: FPGA.dark, lineHeight: 1.35, letterSpacing: '-0.02em' }}>
          전자계통 하나가 잘못되면,<br />
          <span style={{ color: RED }}>무슨 일</span>이 벌어질까?
        </div>
        <div style={{ marginTop: '2rem', fontSize: '1.05rem', color: FPGA.textLight, lineHeight: 1.7 }}>
          작은 신호 하나 · 코드 한 줄 → 시스템 전체로. 실제 사고 3건.
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   슬라이드 3 — 사례 ① 보잉 737 MAX
   ══════════════════════════════════════════════════════════════ */
function Case737Slide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH1} title="사례 ① 보잉 737 MAX 연쇄 추락" subtitle="센서 1개 · 소프트웨어 1개 → 항공기 2대" />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '1.4rem', alignItems: 'center' }}>
          {/* 좌: 사진 (882×855 ≈ 정사각 → 좌우 레터박스 방지 위해 카드 높이 확대) */}
          <PhotoCard src="/images/defense/737max.png" label="737 MAX 8" desc="보도 사진 (출처 표기)" caption="라이온에어 610편(2018) · 에티오피아항공 302편(2019)" maxH="520px" />

          {/* 우: 흐름 + 결과 */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.5rem' }}>
              <FlowStep text="받음각(AoA) 센서 1개 고장 → 잘못된 각도 데이터" color={FPGA.primary} />
              <div style={{ display: 'flex', alignItems: 'center', color: FPGA.textLight, fontWeight: 700 }}>→</div>
              <FlowStep text="MCAS 소프트웨어가 '실속(Stall)'으로 오판" color={FPGA.accent} />
              <div style={{ display: 'flex', alignItems: 'center', color: FPGA.textLight, fontWeight: 700 }}>→</div>
              <FlowStep text="기수를 강제로 반복 하강" color={RED} />
            </div>

            <ResultStat value="346명" label="두 사고 합계 전원 사망 · 전 세계 기종 운항 정지" />

            <div style={{
              background: FPGA.bgAlt, border: `1px solid ${FPGA.border}`, borderRadius: '10px',
              padding: '0.85rem 1.1rem', fontSize: '0.88rem', color: FPGA.text, lineHeight: 1.65,
            }}>
              단일 센서 이중화 없이 신뢰 · SW는 그 값을 검증 없이 그대로 실행.
              <strong style={{ color: FPGA.dark }}> '동작'은 함 · '안전함의 증명'은 없음.</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   슬라이드 4 — 사례 ② 패트리어트 (오차 누적 그래프)
   ══════════════════════════════════════════════════════════════ */
const chipTitle = (color: string) => ({
  alignSelf: 'flex-start' as const,
  fontSize: '0.8rem', fontWeight: 700 as const, color,
  background: `${color}12`, border: `1px solid ${color}30`,
  padding: '3px 12px', borderRadius: '999px',
});

/** 패트리어트 시간 변환 버그 — 개념 재현 (의사 어셈블리, 실제 ISA 아님) */
const ASM_CODE: { t: 'c' | 'k' | 'h'; s: string }[] = [
  { t: 'c', s: '; R0 = ticks (1/10초 정수, 100h→3,600,000)' },
  { t: 'c', s: '; 의도한 상수 : ONE_TENTH = 0.1' },
  { t: 'c', s: ';   0.1(2)=0.0001100110011…(무한반복)' },
  { t: 'c', s: ';   → 24비트 고정소수점에서 잘림(절삭)' },
  { t: 'c', s: '' },
  { t: 'k', s: '     LD   R1, ONE_TENTH   ; 저장된 상수 로드' },
  { t: 'k', s: '     MUL  R2, R0, R1      ; t_sec = ticks × R1' },
  { t: 'k', s: '     ST   T_SEC, R2' },
  { t: 'c', s: '' },
  { t: 'c', s: '; 저장된 값은 0.1 이 아님 ↓' },
  { t: 'h', s: 'ONE_TENTH: .word 0x199999  ; 0.0999999046(≠0.1)' },
  { t: 'h', s: ';          Δ = 9.54e-8 → ticks에 비례 누적' },
];

/** range gate(예측 탐색창) 이탈 다이어그램 */
function RangeGateDiagram() {
  return (
    <svg viewBox="0 0 460 250" style={{ width: '100%', height: 'auto', maxHeight: '100%', display: 'block' }}>
      {/* 궤적 */}
      <line x1="18" y1="115" x2="444" y2="115" stroke={FPGA.border} strokeWidth="2" strokeDasharray="7,5" />
      <polygon points="444,115 434,110 434,120" fill={FPGA.border} />
      <text x="20" y="107" fontSize="10" fill={FPGA.textLight} fontFamily="JetBrains Mono, monospace">스커드 궤적 →</text>

      {/* 시스템이 실제로 탐색한 창 — 시계 오차로 뒤처짐, 표적 없음 */}
      <rect x="52" y="84" width="140" height="62" rx="8" fill="rgba(74,111,165,0.10)" stroke={FPGA.primary} strokeWidth="1.6" strokeDasharray="5,3" />
      <circle cx="122" cy="115" r="7" fill="#fff" stroke={FPGA.primary} strokeWidth="2" />
      <text x="122" y="72" textAnchor="middle" fontSize="11" fontWeight="700" fill={FPGA.primary}>시스템이 탐색한 창</text>
      <text x="122" y="166" textAnchor="middle" fontSize="9.5" fill={FPGA.primary}>예측 위치 (시계 오차로 뒤처짐)</text>

      {/* 있어야 할 창 = 실제 스커드 위치 */}
      <rect x="268" y="84" width="140" height="62" rx="8" fill="rgba(113,128,150,0.06)" stroke={FPGA.textLight} strokeWidth="1.4" strokeDasharray="4,4" />
      <circle cx="338" cy="115" r="7" fill={RED} />
      <text x="338" y="72" textAnchor="middle" fontSize="11" fontWeight="700" fill={RED}>실제 스커드</text>
      <text x="338" y="166" textAnchor="middle" fontSize="9.5" fill={FPGA.textLight}>있어야 할 탐색창</text>

      {/* 어긋난 거리 */}
      <line x1="122" y1="190" x2="338" y2="190" stroke={FPGA.textLight} strokeWidth="1.2" />
      <line x1="122" y1="185" x2="122" y2="195" stroke={FPGA.textLight} strokeWidth="1.2" />
      <line x1="338" y1="185" x2="338" y2="195" stroke={FPGA.textLight} strokeWidth="1.2" />
      <text x="230" y="184" textAnchor="middle" fontSize="13" fontWeight="800" fill={FPGA.dark}>≈ 570 m</text>
      <text x="230" y="209" textAnchor="middle" fontSize="10" fill={FPGA.textLight} fontFamily="JetBrains Mono, monospace">= 1,676 m/s × 0.34s</text>
      <text x="230" y="233" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={RED}>탐색창이 570m 뒤처짐 → 창 안에 표적 없음 → 무시(미발사)</text>
    </svg>
  );
}

function PatriotSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH1} title="사례 ② 패트리어트 요격 실패" subtitle="1991 걸프전 · 시간 변환 코드의 절삭 오차" />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.3rem', alignItems: 'stretch' }}>
          {/* 좌: 버그 코드 (개념 재현) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={chipTitle(FPGA.primary)}>① 버그 — 시간 변환 (어셈블리)</div>
            <div style={{
              flex: 1, minHeight: 0,
              background: '#0F1E33', border: '1px solid #263a58', borderRadius: '10px',
              padding: '0.85rem 1.05rem', boxShadow: shadow.card,
              fontFamily: '"JetBrains Mono", Consolas, monospace', fontSize: '0.73rem', lineHeight: 1.75,
              overflowX: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              {ASM_CODE.map((ln, i) => (
                <div key={i} style={{ whiteSpace: 'pre', color: ln.t === 'c' ? '#7f9ac2' : ln.t === 'h' ? '#f6b26b' : '#dce6f5', fontWeight: ln.t === 'h' ? 700 : 400 }}>
                  {ln.s || ' '}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.71rem', color: FPGA.textLight, fontFamily: '"JetBrains Mono", monospace' }}>
              개념 재현 · 의사 어셈블리(실제 ISA 아님) · 100h 누적 → 시간오차 0.34초
            </div>
          </div>

          {/* 우: range gate 이탈 다이어그램 + 결과·브릿지 (다이어그램 카드 아래) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minHeight: 0 }}>
            <div style={chipTitle(FPGA.accent)}>② 왜 요격 실패? — 탐색창(range gate) 어긋남</div>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '10px',
              padding: '0.4rem 0.9rem', boxShadow: shadow.card,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RangeGateDiagram />
            </div>

            {/* 결과 + 브릿지 — 다이어그램 카드 아래 */}
            <ResultStat value="28명" label="병영 명중 · 미군 사망" />
            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.10), rgba(232,145,58,0.03))`,
              ...edgeBorder(`${FPGA.accent}30`, 'left', FPGA.accent),
              borderRadius: '10px', padding: '0.6rem 1rem', boxShadow: shadow.card,
            }}>
              {/* 원인 요약 */}
              <div style={{ fontSize: '0.8rem', color: FPGA.text, lineHeight: 1.5 }}>
                부품 고장이 아니라, 초 변환의 미세한 잘림 오차가 <strong style={{ color: FPGA.dark }}>장시간 연속 가동에서 서서히 누적</strong> — 재부팅하면 초기화돼 짧은 기능시험으론 안 드러남.
              </div>
              {/* 있었어야 할 검증 */}
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: `1px dashed ${FPGA.accent}40` }}>
                <span style={{
                  display: 'inline-block', fontSize: '0.62rem', fontWeight: 700, color: FPGA.accent,
                  background: `${FPGA.accent}12`, border: `1px solid ${FPGA.accent}30`, borderRadius: '4px',
                  padding: '1px 6px', marginBottom: '0.35rem', letterSpacing: '0.02em',
                }}>있었어야 할 검증</span>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li style={{ display: 'flex', gap: '0.45rem', alignItems: 'baseline' }}>
                    <span style={{ flexShrink: 0, color: FPGA.accent, fontSize: '0.72rem', lineHeight: 1.4 }}>✓</span>
                    <span style={{ fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.4 }}>철저한 <strong style={{ color: FPGA.dark }}>장시간 연속가동(에이징) 시험</strong> 계획·수행</span>
                  </li>
                  <li style={{ display: 'flex', gap: '0.45rem', alignItems: 'baseline' }}>
                    <span style={{ flexShrink: 0, color: FPGA.accent, fontSize: '0.72rem', lineHeight: 1.4 }}>✓</span>
                    <span style={{ fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.4 }}>수치정밀도(고정소수점) 분석</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 태평양 비행 경로 지도 (F-22 날짜변경선) — SVG ──
   하와이(우하) →① 서진 일본행 시도 →② 경도 180°(IDL)에서 전 시스템 마비 →③ 하와이로 회항.
   일본·오키나와(좌)는 끝내 미도달(ghost 점선). 화살표 방향으로 왕복 구조를 명시. */
function PacificRouteMap() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
      <div style={{
        width: '100%', borderRadius: '14px', overflow: 'hidden',
        boxShadow: shadow.card, border: `1px solid ${FPGA.border}`,
      }}>
        <svg
          viewBox="0 0 680 430"
          role="img"
          aria-label="태평양 비행 경로: 하와이에서 서진하여 일본으로 향하던 F-22 편대가 경도 180도 국제 날짜변경선에서 전 시스템 마비로 하와이로 회항"
          style={{ display: 'block', width: '100%', height: 'auto', fontFamily: 'system-ui, "Segoe UI", sans-serif' }}
        >
          <defs>
            <linearGradient id="prm-ocean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0f2338" />
              <stop offset="1" stopColor="#0a1626" />
            </linearGradient>
            <pattern id="prm-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0 L0 0 0 56" fill="none" stroke="#5b82b5" strokeWidth="1" opacity="0.10" />
            </pattern>
            <filter id="prm-soft" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <marker id="prm-ahW" markerWidth="12" markerHeight="12" refX="7.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L9,4 L0,8 Z" fill="#eaf2ff" />
            </marker>
            <marker id="prm-ahE" markerWidth="12" markerHeight="12" refX="7.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L9,4 L0,8 Z" fill="#E8913A" />
            </marker>
            <marker id="prm-ahG" markerWidth="11" markerHeight="11" refX="7" refY="3.6" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L8,3.6 L0,7.2 Z" fill="#8fa6c0" />
            </marker>
          </defs>

          {/* 바다 + 위경도 격자 */}
          <rect x="0" y="0" width="680" height="430" fill="url(#prm-ocean)" />
          <rect x="0" y="0" width="680" height="430" fill="url(#prm-grid)" />

          {/* ── 육지 (좌: 동아시아 / 우하: 하와이) ── */}
          <g stroke="rgba(120,150,190,0.35)" strokeWidth="1" fill="#20344d">
            {/* 아시아 대륙 + 캄차카 */}
            <path d="M-5,-5 L220,-5 L198,34 Q170,52 184,82 L150,98 Q126,122 96,106 L52,130 L-5,152 Z" />
            {/* 일본 혼슈 */}
            <path d="M160,150 Q184,182 170,222 Q160,250 130,272 Q114,286 120,262 Q140,232 142,202 Q144,172 160,150 Z" />
            {/* 홋카이도 */}
            <ellipse cx="182" cy="150" rx="18" ry="13" />
            {/* 규슈 */}
            <ellipse cx="112" cy="285" rx="15" ry="12" />
            {/* 시코쿠 */}
            <ellipse cx="135" cy="273" rx="9" ry="6" />
            {/* 한반도 */}
            <path d="M62,196 Q80,206 76,233 Q72,256 54,259 Q42,255 48,232 Q52,210 62,196 Z" />
            {/* 오키나와 (예정 목적지) */}
            <ellipse cx="150" cy="312" rx="7" ry="4" />
            <ellipse cx="140" cy="305" rx="3" ry="2" />
          </g>
          <g fill="#26456a" stroke="rgba(120,150,190,0.40)" strokeWidth="0.8">
            {/* 하와이 제도 */}
            <ellipse cx="530" cy="323" rx="3" ry="2" />
            <ellipse cx="536" cy="328" rx="5" ry="3" />
            <ellipse cx="544" cy="334" rx="4" ry="3" />
            <ellipse cx="552" cy="339" rx="5" ry="3.5" transform="rotate(-25 552 339)" />
            <ellipse cx="566" cy="347" rx="8" ry="5.5" transform="rotate(-25 566 347)" />
          </g>

          {/* ── 국제 날짜변경선 (경도 180°) ── */}
          <line x1="350" y1="14" x2="350" y2="420" stroke="#2fd2ee" strokeWidth="7" opacity="0.22" filter="url(#prm-soft)" />
          <line x1="350" y1="14" x2="350" y2="420" stroke="#5fe0f5" strokeWidth="2.4" strokeDasharray="7 5" opacity="0.9" />

          {/* ── ① 하와이 → 서진 (일본행 시도, IDL에서 중단) ── */}
          <path d="M556,338 C455,315 388,245 352,178" fill="none" stroke="#eaf2ff" strokeWidth="3.2"
            strokeLinecap="round" strokeDasharray="0.5 10" markerEnd="url(#prm-ahW)" />
          {/* ── ③ IDL → 하와이 회항 (동진) ── */}
          <path d="M352,178 C460,210 545,285 556,338" fill="none" stroke="#E8913A" strokeWidth="3.2"
            strokeLinecap="round" strokeDasharray="0.5 10" markerEnd="url(#prm-ahE)" />
          {/* ── ⋯ 예정 목적지(일본) · 미도달 (ghost) ── */}
          <path d="M352,178 C282,196 216,244 152,300" fill="none" stroke="#8fa6c0" strokeWidth="2.4"
            strokeLinecap="round" strokeDasharray="1 11" markerEnd="url(#prm-ahG)" opacity="0.42" />

          {/* ── ② 시스템 마비 지점 (IDL 위) ── */}
          <g>
            <circle cx="352" cy="178" r="15" fill="#E53E3E" opacity="0.22" filter="url(#prm-soft)" />
            <circle cx="352" cy="178" r="12" fill="none" stroke="#ff6b6b" strokeWidth="1.6" opacity="0.7" />
            {/* 마비 순간 제트기 (서진 중) */}
            <path d="M0,-7 L4.5,6 L0,3 L-4.5,6 Z" fill="#ffffff" transform="translate(352 178) rotate(270)" />
            <circle cx="352" cy="178" r="3" fill="#E53E3E" />
          </g>

          {/* ── 단계 배지 ── */}
          <g>
            <circle cx="451" cy="291" r="11" fill="#eaf2ff" stroke="#c3d4ea" strokeWidth="1" />
            <text x="451" y="295.5" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1b3a5f">1</text>
          </g>
          <g>
            <circle cx="374" cy="158" r="10.5" fill="#E53E3E" stroke="#ffb3b3" strokeWidth="1" />
            <text x="374" y="162.5" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#ffffff">2</text>
          </g>
          <g>
            <circle cx="512" cy="266" r="11" fill="#E8913A" stroke="#f5c690" strokeWidth="1" />
            <text x="512" y="270.5" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff">3</text>
          </g>

          {/* ── 라벨 ── */}
          <text x="350" y="30" textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#7ee7f7">국제 날짜변경선 (IDL) · 경도 180°</text>
          <text x="352" y="116" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ff8a8a">경도 180° 통과 → 전 시스템 마비</text>
          <text x="451" y="320" textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#dfe9f7">일본행 시도</text>
          <text x="540" y="250" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#f0a961">하와이로 회항</text>
          <text x="560" y="372" textAnchor="middle" fontSize="14" fontWeight="800" fill="#ffffff">하와이</text>
          <text x="560" y="388" textAnchor="middle" fontSize="11" fill="#9fb4cc">출발 · 귀환지</text>
          <text x="118" y="342" textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#c7d5e6">일본 · 오키나와</text>
          <text x="118" y="358" textAnchor="middle" fontSize="10.5" fill="#7f93ad">예정 목적지 · 미도달</text>
        </svg>
      </div>
      <div style={{ fontSize: '0.72rem', color: FPGA.textLight, textAlign: 'center', fontFamily: '"JetBrains Mono", monospace' }}>
        2007.02 · 하와이발 오키나와행 편대 6대 · 경도 180° 통과 순간 회항
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   슬라이드 5 — 사례 ③ F-22 날짜변경선 (긴장 완화)
   ══════════════════════════════════════════════════════════════ */
function F22Slide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH1} title="사례 ③ F-22 날짜변경선 먹통" subtitle="2007 · 경도 180° 처리 버그" />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem', alignItems: 'center' }}>
          {/* 좌: 태평양 비행 경로 SVG (왕복 화살표 명시) */}
          <PacificRouteMap />

          {/* 우: 설명 */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', minHeight: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FlowStep text="경도 180° 통과 순간, 항법 SW가 값 변화를 처리 못 함" color={FPGA.primary} />
              <FlowStep text="항법 · 연료관리 · 통신(일부) 동시 다운 — 재부팅 반복도 무효" color={RED} />
              <FlowStep text="맑은 날씨 · 공중급유기를 육안으로 따라가 비상 회항" color={FPGA.success} />
            </div>

            <ResultStat value="인명 피해 0" label="무사 회항 · 종이 한 장 차이" tone="neutral" />

            <div style={{
              background: FPGA.bgAlt, border: `1px solid ${FPGA.border}`, borderRadius: '10px',
              padding: '0.8rem 1.1rem', fontSize: '0.88rem', color: FPGA.text, lineHeight: 1.6,
            }}>
              <strong style={{ color: FPGA.dark }}>작전 손실</strong> — F-22 사상 첫 해외전개 무산(전량 회항 · 48h 지연). <strong style={{ color: FPGA.dark }}>잠재 손실</strong> — 편대 6대(약 1조 원) 전손 위기.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   슬라이드 6 — 공통점 정리 + 항공전자란? (+ 백업 하향 슬라이드)
   ══════════════════════════════════════════════════════════════ */
const AVIONICS = [
  {
    icon: '🖥️', name: '디스플레이', en: 'MFD', color: FPGA.primary,
    img: '/images/defense/board_display.png', role: '실시간 영상·심볼로지 렌더링, 다중 영상 합성'
  },
  {
    icon: '🧠', name: '임무 컴퓨터', en: 'Mission Computer', color: FPGA.dark,
    img: '/images/defense/board_mission_computer.png', role: '센서 데이터 융합, MIL-STD-1553·버스 인터페이스'
  },
  {
    icon: '📡', name: '레이더', en: 'Radar', color: FPGA.accent,
    img: '/images/defense/board_radar.png', role: '빔포밍·도플러 FFT 등 실시간 신호처리'
  },
  {
    icon: '📶', name: '통신', en: 'Comm', color: FPGA.success,
    img: '/images/defense/board_comm.png', role: '파형 처리·데이터링크, 암호 가속'
  },
];

/* ── 재사용: 모듈 보드 사진 (로드 성공 시 사진, 실패/로딩 중 컴팩트 플레이스홀더) ── */
function BoardPhoto({ src, color }: { src: string; color: string }) {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setStatus('success');
    img.onerror = () => setStatus('error');
    img.src = src;
  }, [src]);

  if (status === 'success') {
    return (
      <img src={src} alt="" style={{
        width: '100%', height: '100%', objectFit: 'cover',
        borderRadius: '8px', display: 'block', boxShadow: shadow.inset,
      }} />
    );
  }
  return (
    <div style={{
      width: '100%', height: '100%', minHeight: '86px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
      background: FPGA.bgAlt, border: `1.5px dashed ${color}66`, borderRadius: '8px', padding: '0.4rem',
    }}>
      <span style={{ fontSize: '1.4rem', opacity: 0.6 }}>📷</span>
      <code style={{ fontSize: '0.54rem', color: FPGA.textLight, textAlign: 'center', wordBreak: 'break-all', lineHeight: 1.3 }}>
        public{src}
      </code>
    </div>
  );
}

const BACKUP_CASES = [
  {
    tag: '민항 · 2008', title: '콴타스 72편 (ADIRU)',
    cause: 'ADIRU 1대가 비정상 받음각 데이터 송출 → 비행제어 컴퓨터가 강제 급강하(pitch-down) 2회.',
    stat: '사망 0', statLabel: '중경상 119명 · 비상 착륙 성공', color: FPGA.primary, fatal: false,
  },
  {
    tag: '민항 · 2009', title: '터키항공 1951편 (전파고도계)',
    cause: '전파고도계가 -8ft 오측 → 오토스로틀이 착륙 오판, 공중에서 엔진 출력 Idle로 감소.',
    stat: '9명 사망', statLabel: '부상 86명 · 기체 세 동강', color: RED, fatal: true,
  },
  {
    tag: '민항 · 2009', title: '에어프랑스 447편 (피토관 결빙)',
    cause: '피토관 결빙 → 속도 데이터 불일치 → 오토파일럿 자동 해제 → 수동 조종 중 실속.',
    stat: '228명', statLabel: '탑승 전원 사망 · 기체 완파', color: RED, fatal: true,
  },
  {
    tag: '군용 · 2015', title: 'A400M (엔진 SW 파라미터 누락)',
    cause: '최종 조립 중 토크 보정 파라미터 파일 누락 → 엔진 3기 Idle 고정, 제어 불능.',
    stat: '4명 사망', statLabel: '시험비행 승무원 · 기체 완파', color: FPGA.accent, fatal: true,
  },
];

function CommonAndAvionicsSlide() {
  return (
    <section>
      {/* ── 6번: 부모 슬라이드 ── */}
      <section data-background-color={slideBg}>
        <div className="fpga-content-wrap">
          <SlideHeader badge={CH1} title="세 사고의 공통점, 그리고 항공전자" subtitle="작은 전자적 결함 → 시스템 전체의 위기" />

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {/* 상단: 3사고 공통점 카드 — 원인 + 했어야 할 V&V */}
            <div style={styles.grid3}>
              {[
                { c: '737 MAX', d: '센서 1개 + SW 오판', vv: ['단일고장점(SPOF) 위험분석', '센서 이중화·교차검증 요구사항 검증'], color: RED },
                { c: '패트리어트', d: '코드의 미세 오차 누적', vv: ['장시간 연속운용 누적오차 검증', '수치정밀도(고정소수점) 분석'], color: FPGA.primary },
                { c: 'F-22', d: '경계값 처리 버그', vv: ['경계값·극단조건(edge-case) 테스트', '테스트 커버리지 분석'], color: FPGA.accent },
              ].map((x) => (
                <div key={x.c} style={{
                  background: FPGA.white, ...edgeBorder(`${x.color}30`, 'top', x.color, '3px'),
                  borderRadius: '10px', padding: '0.75rem 0.95rem', boxShadow: shadow.card,
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: x.color }}>{x.c}</div>
                  {/* 원인 */}
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '5px', alignItems: 'baseline' }}>
                    <span style={{
                      flexShrink: 0, fontSize: '0.58rem', fontWeight: 700, color: RED,
                      background: FPGA.dangerBg, border: `1px solid ${RED}30`, borderRadius: '4px',
                      padding: '1px 5px', letterSpacing: '0.02em',
                    }}>원인</span>
                    <span style={{ fontSize: '0.8rem', color: FPGA.textLight, lineHeight: 1.35 }}>{x.d}</span>
                  </div>
                  {/* 했어야 할 V&V — 목록 */}
                  <div style={{ marginTop: '7px', paddingTop: '7px', borderTop: `1px dashed ${FPGA.border}` }}>
                    <span style={{
                      display: 'inline-block', fontSize: '0.58rem', fontWeight: 700, color: FPGA.success,
                      background: FPGA.successBg, border: `1px solid ${FPGA.success}30`, borderRadius: '4px',
                      padding: '1px 5px', letterSpacing: '0.02em', marginBottom: '5px',
                    }}>했어야 할 V&V</span>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {x.vv.map((v) => (
                        <li key={v} style={{ display: 'flex', gap: '0.4rem', alignItems: 'baseline' }}>
                          <span style={{ flexShrink: 0, color: FPGA.success, fontSize: '0.72rem', lineHeight: 1.4 }}>✓</span>
                          <span style={{ fontSize: '0.78rem', color: FPGA.text, fontWeight: 500, lineHeight: 1.4 }}>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* 중단: 항공전자 정의 + 대표 4대 계통 모듈 보드 (2×2) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1, minHeight: 0 }}>
              <div style={{ fontSize: '0.9rem', color: FPGA.text, lineHeight: 1.5 }}>
                <strong style={{ color: FPGA.dark }}>항공전자(Avionics)</strong> — 디스플레이·임무컴퓨터·레이더·통신 4대 계통.
                각 계통 보드에서 <strong style={{ color: FPGA.primary }}>FPGA</strong>가 실시간 신호처리·인터페이스 로직 담당.
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
                gap: '0.7rem', flex: 1, minHeight: 0,
              }}>
                {AVIONICS.map((a) => (
                  <div key={a.name} style={{
                    display: 'flex', gap: '0.85rem', alignItems: 'stretch', minHeight: 0,
                    background: FPGA.white, ...edgeBorder(FPGA.border, 'left', a.color, '3px'),
                    borderRadius: '12px', padding: '0.6rem 0.7rem', boxShadow: shadow.card,
                  }}>
                    {/* 모듈 보드 사진 */}
                    <div style={{ flex: '0 0 38%', minWidth: 0, display: 'flex' }}>
                      <BoardPhoto src={a.img} color={a.color} />
                    </div>
                    {/* 계통명 + FPGA 역할 */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.45rem', lineHeight: 1 }}>{a.icon}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: FPGA.dark, lineHeight: 1.15 }}>{a.name}</div>
                          <div style={{ fontSize: '0.62rem', color: a.color, fontWeight: 600, letterSpacing: '0.02em', fontFamily: '"JetBrains Mono", monospace' }}>{a.en}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: FPGA.textLight, lineHeight: 1.4 }}>{a.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단: 브릿지 + 백업 안내 */}
            <div style={{
              background: `linear-gradient(135deg, rgba(74,111,165,0.09), rgba(74,111,165,0.03))`,
              border: `1px solid ${FPGA.primary}30`, borderRadius: '10px',
              padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
            }}>
              <div style={{ fontSize: '0.9rem', color: FPGA.text, lineHeight: 1.55 }}>
                특정 부품의 결함이 아님 → <strong style={{ color: FPGA.primary }}>safety-critical 전자계통 전체가 동일한 '증명 체계' 요구</strong>.
              </div>
              <div style={{
                flexShrink: 0, fontSize: '0.72rem', color: FPGA.textLight, textAlign: 'center',
                fontFamily: '"JetBrains Mono", monospace', border: `1px dashed ${FPGA.border}`, borderRadius: '8px', padding: '0.4rem 0.7rem',
              }}>
                ↓ 백업 사례 4건<br />(요청 시)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 하향(↓) 백업 사례 4건 ── */}
      {BACKUP_CASES.map((b) => (
        <section key={b.title} data-background-color={slideBg}>
          <div className="fpga-content-wrap">
            <SlideHeader badge="백업 사례 · 요청 시" title={b.title} />
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.1rem', maxWidth: '860px', margin: '0 auto', width: '100%' }}>
              <div style={{
                display: 'inline-flex', alignSelf: 'flex-start',
                fontSize: '0.72rem', fontWeight: 700, color: b.color,
                background: `${b.color}12`, border: `1px solid ${b.color}30`,
                padding: '3px 12px', borderRadius: '999px', fontFamily: '"JetBrains Mono", monospace',
              }}>{b.tag}</div>
              <div style={{
                background: FPGA.white, ...edgeBorder(FPGA.border, 'left', b.color),
                borderRadius: '12px', padding: '1.2rem 1.4rem', boxShadow: shadow.card,
                fontSize: '1.05rem', color: FPGA.text, lineHeight: 1.75,
              }}>{b.cause}</div>
              <ResultStat value={b.stat} label={b.statLabel} tone={b.fatal ? 'danger' : 'neutral'} />
              <div style={{ fontSize: '0.78rem', color: FPGA.textLight, textAlign: 'center' }}>
                ← → 로 다른 백업 사례 · ↑ 로 본편 복귀
              </div>
            </div>
          </div>
        </section>
      ))}
    </section>
  );
}

/* ── Export: 1장 전체 ── */
export default function Chapter1Opening() {
  return (
    <>
      <TitleSlide />
      <QuestionSlide />
      <Case737Slide />
      <PatriotSlide />
      <F22Slide />
      <CommonAndAvionicsSlide />
    </>
  );
}
