'use client';

/**
 * 무기체계 속의 FPGA — 2장. 왜 하필 FPGA인가
 *   7. 칩의 종류 (CPU/GPU/ASIC/FPGA)
 *   8. 무기체계 개발시 FPGA 선택 이유
 */

import { FPGA, slideBg, shadow, edgeBorder } from '../fpga/FpgaSlideStyles';
import SlideHeader from '../fpga/SlideHeader';

const CH2 = '2장 · 왜 하필 FPGA인가';

const chip = (color: string) => ({
  alignSelf: 'flex-start' as const,
  fontSize: '0.8rem', fontWeight: 700 as const, color,
  background: `${color}12`, border: `1px solid ${color}30`,
  padding: '3px 12px', borderRadius: '999px',
});

/* ══════════ 슬라이드 7 — 칩의 종류 ══════════ */
const CHIPS = [
  {
    key: 'CPU', color: FPGA.textLight, metaphor: '만능 일꾼',
    full: 'Central Processing Unit', ko: '중앙처리장치',
    desc: '소프트웨어로 무엇이든 처리하는 범용 프로세서. 순차 실행이라 가장 유연하지만, 처리량·지연에서는 불리',
    flex: 5, perf: 2,
  },
  {
    key: 'GPU', color: FPGA.primaryLight, metaphor: '대규모 병렬 계산기',
    full: 'Graphics Processing Unit', ko: '그래픽처리장치',
    desc: '같은 연산을 수천 개 코어로 동시에. 그래픽·AI 대량 연산엔 강하지만, 전력·지연이 큼',
    flex: 3, perf: 3,
  },
  {
    key: 'ASIC', color: FPGA.dark, metaphor: '전용 회로 · 인쇄된 책',
    full: 'Application-Specific Integrated Circuit', ko: '주문형 반도체',
    desc: '하나의 기능만 위해 실리콘에 새긴 맞춤 칩. 성능·전력효율 최고지만, 한번 제작하면 수정 불가·초기비용 막대',
    flex: 1, perf: 5,
  },
  {
    key: 'FPGA', color: FPGA.accent, metaphor: '재구성 하드웨어 · 다시 쓰는 노트',
    full: 'Field-Programmable Gate Array', ko: '현장 프로그래머블 게이트 어레이',
    desc: '논리 블록을 현장에서 재배선하는 칩. 하드웨어 병렬성·결정론적 지연을 유지하면서 언제든 회로를 다시 그림',
    flex: 4, perf: 4,
  },
];

/** 유연성 / 성능 정도를 5칸 세그먼트 미터로 표시 */
function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.34rem' }}>
      <span style={{ fontSize: '0.68rem', color: FPGA.textLight, whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ display: 'flex', gap: '2.5px' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{
            width: '11px', height: '6px', borderRadius: '2px',
            background: i <= value ? color : FPGA.border,
            boxShadow: i <= value ? `0 1px 2px ${color}55` : 'none',
          }} />
        ))}
      </div>
    </div>
  );
}

function ChipQuadrant() {
  // x = 유연성(→), y = 성능·효율(↑)
  const pts: { k: string; x: number; y: number; c: string; r: number; hi?: boolean }[] = [
    { k: 'ASIC', x: 152, y: 92, c: FPGA.dark, r: 28 },
    { k: 'GPU', x: 250, y: 190, c: FPGA.primaryLight, r: 28 },
    { k: 'CPU', x: 362, y: 250, c: FPGA.textLight, r: 28 },
    { k: 'FPGA', x: 356, y: 104, c: FPGA.accent, r: 35, hi: true },
  ];
  return (
    <svg viewBox="0 0 460 340" style={{ width: '100%', height: 'auto' }}>
      <defs>
        {pts.map((p) => (
          <radialGradient key={p.k} id={`chipG-${p.k}`} cx="35%" cy="28%" r="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="45%" stopColor={p.c} stopOpacity="1" />
            <stop offset="100%" stopColor={p.c} stopOpacity="1" />
          </radialGradient>
        ))}
        <radialGradient id="sweetSpot" cx="100%" cy="0%" r="95%">
          <stop offset="0%" stopColor={FPGA.accent} stopOpacity="0.18" />
          <stop offset="55%" stopColor={FPGA.accent} stopOpacity="0.05" />
          <stop offset="100%" stopColor={FPGA.accent} stopOpacity="0" />
        </radialGradient>
        <filter id="chipShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#1a2a44" floodOpacity="0.3" />
        </filter>
        <filter id="chipGlow" x="-70%" y="-70%" width="240%" height="240%">
          <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor={FPGA.accent} floodOpacity="0.6" />
        </filter>
      </defs>

      {/* 우상단 '이상적 영역' 배경 (유연성+성능 동시) */}
      <rect x="60" y="40" width="360" height="260" rx="10" fill="url(#sweetSpot)" />

      {/* 격자 */}
      {[1, 2, 3, 4].map((i) => (
        <line key={`gx${i}`} x1={60 + i * 72} y1="40" x2={60 + i * 72} y2="300"
              stroke={FPGA.border} strokeWidth="1" strokeDasharray="3,5" opacity="0.7" />
      ))}
      {[1, 2, 3].map((i) => (
        <line key={`gy${i}`} x1="60" y1={40 + i * 65} x2="420" y2={40 + i * 65}
              stroke={FPGA.border} strokeWidth="1" strokeDasharray="3,5" opacity="0.7" />
      ))}

      {/* 전통적 트레이드오프 프론티어 (ASIC ↔ CPU) */}
      <line x1="152" y1="92" x2="362" y2="250" stroke={FPGA.textLight} strokeWidth="1.6"
            strokeDasharray="6,5" opacity="0.5" />
      <text x="236" y="130" textAnchor="middle" fontSize="10.5" fontWeight="600"
            fill={FPGA.textLight} transform="rotate(36.6 236 130)">전통적 트레이드오프</text>

      {/* 축 */}
      <line x1="60" y1="300" x2="426" y2="300" stroke={FPGA.dark} strokeWidth="2" />
      <line x1="60" y1="300" x2="60" y2="32" stroke={FPGA.dark} strokeWidth="2" />
      <polygon points="426,300 415,295 415,305" fill={FPGA.dark} />
      <polygon points="60,32 55,43 65,43" fill={FPGA.dark} />
      <text x="420" y="323" textAnchor="end" fontSize="13" fontWeight="700" fill={FPGA.text}>유연성 →</text>
      <text x="52" y="26" textAnchor="start" fontSize="13" fontWeight="700" fill={FPGA.text}>성능 · 효율 ↑</text>

      {/* 버블 */}
      {pts.map((p) => (
        <g key={p.k} filter={p.hi ? 'url(#chipGlow)' : undefined}>
          <circle cx={p.x} cy={p.y} r={p.r} fill={`url(#chipG-${p.k})`} stroke="#ffffff" strokeWidth="1.5"
                  filter={p.hi ? undefined : 'url(#chipShadow)'} />
          <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize={p.hi ? 14 : 12}
                fontWeight="800" fill="#ffffff" letterSpacing="0.02em">{p.k}</text>
        </g>
      ))}
    </svg>
  );
}

function ChipTypesSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH2} title="디지털 IC의 분류 — CPU · GPU · ASIC · FPGA" subtitle="유연성 ↔ 성능·효율 트레이드오프" />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: '1.4rem', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '14px',
              padding: '0.8rem 1rem', boxShadow: shadow.card, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChipQuadrant />
            </div>
            {/* 약어 풀이 덱 — 그래프 아래 여백 활용 */}
            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '14px',
              padding: '0.65rem 0.9rem', boxShadow: shadow.card, flexShrink: 0,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 700, color: FPGA.textLight, letterSpacing: '0.06em' }}>약어 풀이</div>
              {CHIPS.map((c) => (
                <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 800, color: '#ffffff',
                    background: `linear-gradient(135deg, ${c.color} 0%, ${c.color}cc 100%)`,
                    padding: '0.12rem 0.4rem', borderRadius: '6px', minWidth: '3.2rem',
                    textAlign: 'center', boxShadow: `0 1px 4px ${c.color}55`,
                  }}>{c.key}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark }}>{c.full}</span>
                  <span style={{ fontSize: '0.72rem', color: FPGA.textLight }}>· {c.ko}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', minHeight: 0 }}>
            {CHIPS.map((c) => {
              const isFpga = c.key === 'FPGA';
              return (
                <div key={c.key} style={{
                  flex: 1,
                  background: isFpga
                    ? `linear-gradient(135deg, ${c.color}14 0%, ${c.color}06 100%)`
                    : FPGA.white,
                  ...edgeBorder(`${c.color}2e`, 'left', c.color),
                  borderRadius: '12px', padding: '0.7rem 1rem',
                  boxShadow: isFpga ? shadow.cardHover : shadow.card,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.4rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <span style={{
                      fontSize: '0.9rem', fontWeight: 800, color: '#ffffff',
                      background: `linear-gradient(135deg, ${c.color} 0%, ${c.color}cc 100%)`,
                      padding: '0.28rem 0.5rem', borderRadius: '8px', minWidth: '3.6rem',
                      textAlign: 'center', boxShadow: `0 2px 6px ${c.color}55`,
                    }}>{c.key}</span>
                    <span style={{ fontSize: '0.98rem', fontWeight: 800, color: FPGA.dark }}>{c.metaphor}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: FPGA.textLight, lineHeight: 1.55 }}>{c.desc}</div>
                  <div style={{ display: 'flex', gap: '1.3rem' }}>
                    <Meter label="유연성" value={c.flex} color={c.color} />
                    <Meter label="성능·효율" value={c.perf} color={c.color} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 8 — 무기체계 개발시 FPGA 선택 이유 ══════════ */
const REASONS = [
  {
    icon: '🔧', title: '소량 다품종', tag: 'ASIC NRE 회피',
    points: [
      { k: 'ASIC', t: '마스크(NRE) 비용 수백만 달러 → 수십~수백 대 생산엔 비경제적' },
      { k: 'FPGA', t: '초기비용 없이 소량·다품종 대응' },
    ],
  },
  {
    icon: '⏳', title: '20~30년 장기 운용', tag: '단종·업그레이드 대응',
    points: [
      { k: '수명주기', t: '수십 년 운용, 부품 단종(EOL)·요구 변경 필연' },
      { k: 'FPGA', t: '비트스트림 재프로그래밍 → 야전에서 기능 갱신·대체' },
    ],
  },
  {
    icon: '⏱️', title: '결정론적 실시간', tag: '지터 없는 고정 지연',
    points: [
      { k: 'CPU', t: '인터럽트·캐시로 지연 변동(지터) 발생' },
      { k: 'FPGA', t: '병렬 파이프라인 고정 지연 → 유도·표적추적·센서융합에 필수' },
    ],
  },
  {
    icon: '🔌', title: '유연한 I/O 통합', tag: 'SWaP 절감',
    points: [
      { k: '인터페이스', t: 'MIL-STD-1553 · SpaceWire · 각종 센서 · 레거시 버스' },
      { k: 'FPGA', t: '재구성 I/O로 한 칩 통합 → 크기·무게·전력(SWaP) 절감' },
    ],
  },
];

/** 생산 수량 ↔ 운용 수명 축에서 상용 SoC와 무기체계의 정반대 포지션을 보여주는 산점 */
function ValueContrastChart() {
  const pts: { k: string; x: number; y: number; c: string; r: number; hi?: boolean }[] = [
    { k: '무기체계·방산', x: 120, y: 85, c: FPGA.accent, r: 26, hi: true },
    { k: '산업·의료', x: 228, y: 128, c: FPGA.primaryLight, r: 19 },
    { k: '자동차', x: 296, y: 163, c: FPGA.textLight, r: 19 },
    { k: '상용 SoC', x: 362, y: 200, c: FPGA.dark, r: 21 },
  ];
  return (
    <svg viewBox="0 0 450 300" style={{ width: '100%', height: 'auto' }}>
      <defs>
        {pts.map((p) => (
          <radialGradient key={p.k} id={`vcG-${p.k}`} cx="35%" cy="28%" r="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="45%" stopColor={p.c} stopOpacity="1" />
            <stop offset="100%" stopColor={p.c} stopOpacity="1" />
          </radialGradient>
        ))}
        <radialGradient id="vcZone" cx="0%" cy="0%" r="130%">
          <stop offset="0%" stopColor={FPGA.accent} stopOpacity="0.16" />
          <stop offset="60%" stopColor={FPGA.accent} stopOpacity="0.04" />
          <stop offset="100%" stopColor={FPGA.accent} stopOpacity="0" />
        </radialGradient>
        <filter id="vcShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#1a2a44" floodOpacity="0.3" />
        </filter>
        <filter id="vcGlow" x="-70%" y="-70%" width="240%" height="240%">
          <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor={FPGA.accent} floodOpacity="0.6" />
        </filter>
      </defs>

      {/* 소량·장수명 구간 (좌상단) */}
      <rect x="55" y="30" width="150" height="105" rx="10" fill="url(#vcZone)" />
      <text x="66" y="48" fontSize="10.5" fontWeight="700" fill={FPGA.accent}>소량 · 장수명 구간</text>

      {/* 격자 */}
      {[1, 2, 3, 4].map((i) => (
        <line key={`vx${i}`} x1={55 + i * 72} y1="30" x2={55 + i * 72} y2="258"
              stroke={FPGA.border} strokeWidth="1" strokeDasharray="3,5" opacity="0.7" />
      ))}
      {[1, 2, 3].map((i) => (
        <line key={`vy${i}`} x1="55" y1={30 + i * 57} x2="415" y2={30 + i * 57}
              stroke={FPGA.border} strokeWidth="1" strokeDasharray="3,5" opacity="0.7" />
      ))}

      {/* 설계 기준 대비 대각선 (상용 SoC ↔ 무기체계) */}
      <line x1="345" y1="185" x2="140" y2="103" stroke={FPGA.accent} strokeWidth="1.5"
            strokeDasharray="6,5" opacity="0.55" />

      {/* 축 */}
      <line x1="55" y1="258" x2="420" y2="258" stroke={FPGA.dark} strokeWidth="2" />
      <line x1="55" y1="258" x2="55" y2="26" stroke={FPGA.dark} strokeWidth="2" />
      <polygon points="420,258 409,253 409,263" fill={FPGA.dark} />
      <polygon points="55,26 50,37 60,37" fill={FPGA.dark} />
      <text x="414" y="281" textAnchor="end" fontSize="12.5" fontWeight="700" fill={FPGA.text}>생산 수량 →</text>
      <text x="47" y="22" textAnchor="start" fontSize="12.5" fontWeight="700" fill={FPGA.text}>운용 수명 ↑</text>

      {/* 버블 + 라벨 */}
      {pts.map((p) => (
        <g key={p.k} filter={p.hi ? 'url(#vcGlow)' : undefined}>
          <circle cx={p.x} cy={p.y} r={p.r} fill={`url(#vcG-${p.k})`} stroke="#ffffff" strokeWidth="1.5"
                  filter={p.hi ? undefined : 'url(#vcShadow)'} />
          {p.hi && (
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffffff">FPGA</text>
          )}
          <text x={p.x} y={p.y + p.r + 14} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={FPGA.text}>{p.k}</text>
        </g>
      ))}
    </svg>
  );
}

function WhyDefenseSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH2} title="무기체계 개발시 FPGA 선택 이유" subtitle="소량 · 장수명 · 결정론 · I/O 통합" />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem', alignItems: 'stretch' }}>
          {/* 좌 — 상용 vs 무기체계 포지션 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minHeight: 0 }}>
            <div style={chip(FPGA.primary)}>시장 포지션 — 상용 SoC vs 무기체계</div>
            <div style={{
              flex: 1, minHeight: 0, background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '14px', padding: '0.8rem 1rem', boxShadow: shadow.card,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ValueContrastChart />
            </div>
            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.10), rgba(232,145,58,0.03))`,
              ...edgeBorder(`${FPGA.accent}30`, 'left', FPGA.accent),
              borderRadius: '10px', padding: '0.6rem 1.1rem', fontSize: '0.88rem', color: FPGA.text, flexShrink: 0,
              display: 'flex', flexDirection: 'column', gap: '0.25rem',
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: FPGA.accent }}>최적화 목표 자체가 다름</div>
              <div><strong style={{ color: FPGA.dark }}>스마트폰 AP</strong> — PPA(성능·전력·면적) · 단위 원가</div>
              <div><strong style={{ color: FPGA.accent }}>무기체계</strong> — 결정론적 동작 · 수명주기 지원</div>
            </div>
          </div>

          {/* 우 — 네 가지 이유 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minHeight: 0 }}>
            <div style={chip(FPGA.accent)}>무기체계가 FPGA를 택하는 네 가지 이유</div>
            {REASONS.map((r) => (
              <div key={r.title} style={{
                flex: 1, background: FPGA.white, ...edgeBorder(FPGA.border, 'left', FPGA.primary),
                borderRadius: '12px', padding: '0.7rem 1rem', boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{r.icon}</span>
                  <span style={{ fontSize: '1.02rem', fontWeight: 800, color: FPGA.dark }}>{r.title}</span>
                  <span style={{
                    marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 700, color: FPGA.primary,
                    background: `${FPGA.primary}14`, border: `1px solid ${FPGA.primary}30`,
                    padding: '2px 9px', borderRadius: '999px', whiteSpace: 'nowrap', flexShrink: 0,
                  }}>{r.tag}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {r.points.map((p) => (
                    <div key={p.k} style={{ fontSize: '0.83rem', color: FPGA.textLight, lineHeight: 1.45 }}>
                      <strong style={{ color: p.k === 'FPGA' ? FPGA.primary : FPGA.text }}>{p.k}</strong> — {p.t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Chapter2WhyFpga() {
  return (
    <>
      <ChipTypesSlide />
      <WhyDefenseSlide />
    </>
  );
}
