'use client';

/**
 * 무기체계 속의 FPGA — 3장. 민수 개발 vs 국방 개발 (핵심)
 *   10. 개발 목표의 차이 (동작 vs 증명)
 *   11. DO-254 개요 + DAL 등급
 *   12. 요구사항 추적성
 *   13. 검증과 커버리지
 *   14. 산출물의 무게
 *   15. 결론 — 증명 비용
 */

import { FPGA, slideBg, shadow, edgeBorder } from '../fpga/FpgaSlideStyles';
import SlideHeader from '../fpga/SlideHeader';
import ImagePlaceholder from '../ImagePlaceholder';

const CH3 = '3장 · 민수 vs 국방';

const chip = (color: string) => ({
  alignSelf: 'flex-start' as const,
  fontSize: '0.8rem', fontWeight: 700 as const, color,
  background: `${color}12`, border: `1px solid ${color}30`,
  padding: '3px 12px', borderRadius: '999px',
});

/* ══════════ 슬라이드 10 — 동작 vs 증명 (+ 방산 V 모델) ══════════ */

/* V 모델 좌(정의·설계) ↔ 우(통합·검증) 레벨 대응 · 대표 기술검토/산출물 */
const V_LEVELS = [
  { y: 26, lx: 34, rx: 816, lt: '운용 개념', lg: 'ConOps', rt: '인수 · 운용', rg: 'PCA', vl: '운용 확인' },
  { y: 84, lx: 92, rx: 758, lt: '시스템 요구사항', lg: 'SRR · SRS', rt: '시스템 검증', rg: 'SVR · FCA', vl: '요구 검증' },
  { y: 142, lx: 150, rx: 700, lt: '예비 설계', lg: 'SFR · PDR', rt: '통합 시험', rg: 'TRR', vl: '설계 검증' },
  { y: 200, lx: 208, rx: 642, lt: '상세 설계', lg: 'CDR', rt: '단위 시험', rg: '구조 커버리지', vl: '구현 검증' },
];

function VBox({ x, y, w = 150, h = 46, title, gate, color, gbg, gtext }: {
  x: number; y: number; w?: number; h?: number; title: string; gate: string; color: string; gbg: string; gtext?: string;
}) {
  const cx = x + w / 2;
  const gw = Math.max(46, gate.length * 8 + 14);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={9} fill={FPGA.white} stroke={color} strokeWidth={1.6} filter="url(#vShadow)" />
      <text x={cx} y={y + 20} textAnchor="middle" fontSize={13.5} fontWeight={700} fill={FPGA.dark}>{title}</text>
      <rect x={cx - gw / 2} y={y + 27} width={gw} height={14} rx={7} fill={gbg} />
      <text x={cx} y={y + 37} textAnchor="middle" fontSize={10} fontWeight={700} fill={gtext || color}>{gate}</text>
    </g>
  );
}

function VModelSvg() {
  return (
    <svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <filter id="vShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#1a2a4a" floodOpacity="0.16" />
        </filter>
        <marker id="vArrowP" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
          <path d="M1,1 L8,4.5 L1,8 Z" fill={FPGA.primary} fillOpacity="0.55" />
        </marker>
        <marker id="vArrowA" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
          <path d="M1,1 L8,4.5 L1,8 Z" fill={FPGA.accent} fillOpacity="0.75" />
        </marker>
      </defs>

      {/* V 양다리 (박스 뒤 backbone) */}
      <polyline points="109,49 167,107 225,165 283,223 500,272" fill="none" stroke={FPGA.primary} strokeOpacity="0.4" strokeWidth="2.5" strokeLinejoin="round" markerEnd="url(#vArrowP)" />
      <polyline points="500,272 717,223 775,165 833,107 891,49" fill="none" stroke={FPGA.accent} strokeOpacity="0.45" strokeWidth="2.5" strokeLinejoin="round" markerEnd="url(#vArrowA)" />

      {/* 좌↔우 대응 (설계 ↔ 시험 추적) */}
      {V_LEVELS.map((l) => {
        const yc = l.y + 23;
        const w = l.vl.length * 12 + 12;
        return (
          <g key={`v${l.y}`}>
            <line x1={l.lx + 150} y1={yc} x2={l.rx} y2={yc} stroke={FPGA.primaryLight} strokeWidth="1.2" strokeDasharray="5 5" strokeOpacity="0.5" />
            <rect x={500 - w / 2} y={yc - 9} width={w} height={18} rx={9} fill={FPGA.white} stroke={FPGA.border} strokeWidth="0.8" />
            <text x={500} y={yc + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={FPGA.textLight}>{l.vl}</text>
          </g>
        );
      })}

      {/* 좌: 정의·설계 / 우: 통합·검증 박스 */}
      {V_LEVELS.map((l) => (
        <VBox key={`L${l.y}`} x={l.lx} y={l.y} title={l.lt} gate={l.lg} color={FPGA.primary} gbg="rgba(74,111,165,0.12)" />
      ))}
      {V_LEVELS.map((l) => (
        <VBox key={`R${l.y}`} x={l.rx} y={l.y} title={l.rt} gate={l.rg} color={FPGA.accent} gbg="rgba(232,145,58,0.14)" gtext="#B4701F" />
      ))}
      <VBox x={413} y={250} w={174} title="구현 · 제작" gate="HDL · 합성" color={FPGA.dark} gbg="rgba(43,69,112,0.10)" />

      {/* 다리 방향 캡션 (빈 삼각 코너 활용) */}
      <text x={38} y={250} fontSize={13} fontWeight={800} fill={FPGA.primary}>정의 · 설계</text>
      <text x={38} y={268} fontSize={10.5} fontWeight={600} fill={FPGA.textLight}>요구 → 설계</text>
      <text x={962} y={250} textAnchor="end" fontSize={13} fontWeight={800} fill={FPGA.accent}>통합 · 검증</text>
      <text x={962} y={268} textAnchor="end" fontSize={10.5} fontWeight={600} fill={FPGA.textLight}>시험 → 인수</text>
    </svg>
  );
}

function ThesisSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH3} title="개발 목표의 차이" subtitle="민수와 국방, &lsquo;완성&rsquo; 기준의 차이" />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingTop: '0.3rem' }}>
          {/* 대비 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'stretch' }}>
            <div style={{ background: FPGA.white, ...edgeBorder(FPGA.border, 'top', FPGA.textLight), borderRadius: '12px', padding: '0.7rem 1rem', boxShadow: shadow.card, textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.textLight, letterSpacing: '0.04em' }}>민수 개발</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: FPGA.dark, margin: '0.25rem 0' }}>&ldquo;동작하는 것&rdquo;</div>
              <div style={{ fontSize: '0.82rem', color: FPGA.textLight, lineHeight: 1.5 }}>테스트 통과 → 출시 · 문제 시 업데이트</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.3rem', fontWeight: 800, color: FPGA.textLight }}>vs</div>
            <div style={{ background: `linear-gradient(135deg, ${FPGA.primary}0e, ${FPGA.accent}0e)`, ...edgeBorder(`${FPGA.primary}30`, 'top', FPGA.accent), borderRadius: '12px', padding: '0.7rem 1rem', boxShadow: shadow.card, textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.accent, letterSpacing: '0.04em' }}>국방 · safety-critical</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: FPGA.dark, margin: '0.25rem 0' }}>&ldquo;동작함을 증명하는 것&rdquo;</div>
              <div style={{ fontSize: '0.82rem', color: FPGA.text, lineHeight: 1.5 }}>모든 동작에 근거·추적·독립 검증 · 작전 중 시스템 오류는 임무 실패</div>
            </div>
          </div>

          {/* 방산 V 모델 (히어로) */}
          <div style={{ flex: 1, minHeight: 0, background: FPGA.bgAlt, border: `1px solid ${FPGA.border}`, borderRadius: '14px', boxShadow: shadow.card, padding: '0.5rem 0.9rem 0.4rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 0.1rem 0.1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: FPGA.dark }}>방산 개발 V 모델 <span style={{ color: FPGA.textLight, fontWeight: 600 }}>· V&amp;V 생명주기</span></span>
              <span style={{ display: 'flex', gap: '0.85rem', fontSize: '0.7rem', fontWeight: 700 }}>
                <span style={{ color: FPGA.primary }}>■ 정의·설계 검토회의</span>
                <span style={{ color: FPGA.accent }}>■ 통합·검증 검토·감사</span>
                <span style={{ color: FPGA.textLight }}>┄ 설계 ↔ 시험 추적</span>
              </span>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <VModelSvg />
            </div>
          </div>

          {/* V 모델이 '증명'을 강제하는 장치 */}
          <div style={{
            background: FPGA.dark, borderRadius: '12px', padding: '0.65rem 1.2rem',
            boxShadow: shadow.deep, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.1rem',
          }}>
            {[
              ['설계 ↔ 시험 1:1 대응', '모든 설계 레벨에 대응 시험 존재 · 설계 산출물이 곧 시험 합격 기준'],
              ['기술검토회의 통과', '단계마다 공식 기술검토회의 — 증빙 없이는 다음 단계 진행 불가'],
              ['검증 조기 계획', '시험 계획은 설계와 동시 수립 · 결함 발견이 늦을수록 수정 비용 급증'],
            ].map(([t, d], i) => (
              <div key={t} style={{ paddingLeft: i ? '1.1rem' : 0, borderLeft: i ? '1px solid rgba(255,255,255,0.18)' : 'none' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: FPGA.accent }}>{t}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.45, marginTop: '2px' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 11 — DO-254 + DAL ══════════ */
const DAL = [
  { g: 'A', cond: 'Catastrophic', ko: '항공기 상실', color: FPGA.danger },
  { g: 'B', cond: 'Hazardous', ko: '심각한 부상 / 대형 피해', color: FPGA.accent },
  { g: 'C', cond: 'Major', ko: '안전 마진 감소', color: FPGA.primary },
  { g: 'D', cond: 'Minor', ko: '경미한 불편', color: FPGA.primaryLight },
  { g: 'E', cond: 'No Effect', ko: '안전 영향 없음', color: FPGA.textLight },
];

function DO254Slide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH3} title="DO-254 — 항공전자 하드웨어 설계 보증" subtitle="DAL 등급에 따라 요구 활동 강도 결정" />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '1.4rem', alignItems: 'center' }}>
          {/* DAL 스택 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {DAL.map((d, i) => (
              <div key={d.g} style={{
                display: 'flex', alignItems: 'center', gap: '0.9rem',
                background: `${d.color}0e`, ...edgeBorder(`${d.color}35`, 'left', d.color, '5px'),
                borderRadius: '10px', padding: '0.6rem 1rem', boxShadow: shadow.card,
                marginLeft: `${i * 22}px`,
              }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: d.color, minWidth: '2.4rem' }}>DAL {d.g}</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: FPGA.dark }}>{d.cond}</div>
                  <div style={{ fontSize: '0.78rem', color: FPGA.textLight }}>{d.ko}</div>
                </div>
              </div>
            ))}
            <div style={{ fontSize: '0.75rem', color: FPGA.textLight, marginTop: '0.2rem' }}>↑ 위로 갈수록 실패 영향 · 검증 강도 최고</div>
          </div>
          {/* 개요 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {[
              ['적용 대상', 'FPGA · ASIC · PLD 등 항공전자 하드웨어'],
              ['용도', 'FAA / EASA 감항 인증의 하드웨어 설계 보증'],
              ['생명주기', '계획(PHAC) → 요구사항 → 설계 → 검증 → 형상관리'],
              ['DAL A/B', '독립 검증 + 구조 커버리지 + 실물 HW 시험 필수'],
            ].map(([t, d]) => (
              <div key={t} style={{ background: FPGA.white, ...edgeBorder(FPGA.border, 'left', FPGA.primary), borderRadius: '10px', padding: '0.6rem 0.9rem', boxShadow: shadow.card }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.primary }}>{t}</div>
                <div style={{ fontSize: '0.84rem', color: FPGA.text, lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 12 — 요구사항 추적성 ══════════ */
const TRACE = [
  { t: '요구사항', d: 'Requirements', color: FPGA.primary },
  { t: '설계', d: 'Design', color: FPGA.primary },
  { t: 'HDL 코드', d: 'Implementation', color: FPGA.accent },
  { t: '검증', d: 'Verification', color: FPGA.primary },
];

function TraceabilitySlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH3} title="요구사항 추적성 (Traceability)" subtitle="요구사항 → 설계 → 코드 → 검증 전 구간 양방향 연결" />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.9rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: FPGA.primary, textAlign: 'center' }}>순방향 전개 →</div>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.6rem' }}>
            {TRACE.map((n, i) => (
              <div key={n.t} style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.6rem' }}>
                <div style={{
                  flex: 1, background: FPGA.white, ...edgeBorder(`${n.color}35`, 'top', n.color, '3px'),
                  borderRadius: '12px', padding: '1rem 0.8rem', boxShadow: shadow.card, textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: FPGA.dark }}>{n.t}</div>
                  <div style={{ fontSize: '0.72rem', color: FPGA.textLight, fontFamily: '"JetBrains Mono", monospace' }}>{n.d}</div>
                </div>
                {i < TRACE.length - 1 && <span style={{ color: FPGA.textLight, fontWeight: 800, fontSize: '1.1rem' }}>↔</span>}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: FPGA.accent, textAlign: 'center' }}>← 역방향 추적</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              ['모든 요구사항 → 검증 존재', '테스트 안 된 요구사항 없음'],
              ['모든 코드 → 근거 요구사항 존재', '근거 없는 코드 없음'],
            ].map(([a, b]) => (
              <div key={a} style={{ background: FPGA.bgAlt, border: `1px solid ${FPGA.border}`, borderRadius: '10px', padding: '0.7rem 1rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: FPGA.dark }}>{a}</div>
                <div style={{ fontSize: '0.8rem', color: FPGA.textLight }}>{b}</div>
              </div>
            ))}
          </div>
          {/* 실제 도구 화면 (1901×623 가로형) — 전체 폭 하단 배치, 클릭 확대 */}
          <div style={{ flexShrink: 0, background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '12px', padding: '0.55rem 0.7rem 0.4rem', boxShadow: shadow.card }}>
            <ImagePlaceholder src="/images/defense/traceability.png" label="추적성 도구 화면" desc="요구사항 추적성 관리 도구 그래픽 뷰" maxHeight="245px" />
            <div style={{ marginTop: '0.3rem', fontSize: '0.74rem', color: FPGA.textLight, textAlign: 'center' }}>
              추적성 관리 도구 그래픽 뷰 — 상하위 요구사항 ↔ HDL 코드 ↔ 테스트벤치 · 테스트플랜 ↔ 시험 결과(PASS/FAIL) 링크
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 13 — 검증과 커버리지 ══════════ */
function CoverageSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH3} title="검증과 커버리지" subtitle="&ldquo;테스트 안 된 코드는 없는 코드&rdquo;" />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={chip(FPGA.primary)}>커버리지 유형</div>
            {[
              ['코드 커버리지', 'Statement · Branch · Toggle · FSM 상태/천이'],
              ['기능 커버리지', '요구된 시나리오·조건을 실제로 검증했는가'],
            ].map(([t, d]) => (
              <div key={t} style={{ background: FPGA.white, ...edgeBorder(FPGA.border, 'left', FPGA.primary), borderRadius: '10px', padding: '0.7rem 1rem', boxShadow: shadow.card }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: FPGA.dark }}>{t}</div>
                <div style={{ fontSize: '0.82rem', color: FPGA.textLight, marginTop: '1px' }}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={chip(FPGA.accent)}>패트리어트 회수 (슬라이드 4)</div>
            <div style={{ background: `${FPGA.accent}0c`, border: `1px solid ${FPGA.accent}30`, borderRadius: '10px', padding: '0.9rem 1.1rem', fontSize: '0.9rem', color: FPGA.text, lineHeight: 1.65 }}>
              그 절삭 오차는 코드가 <strong>정상 실행</strong>돼 <strong style={{ color: FPGA.danger }}>코드 커버리지로는 안 잡힘</strong>.
            </div>
            <div style={{ background: FPGA.white, ...edgeBorder(FPGA.border, 'left', FPGA.accent), borderRadius: '10px', padding: '0.9rem 1.1rem', fontSize: '0.9rem', color: FPGA.text, lineHeight: 1.65 }}>
              &lsquo;100시간 연속 가동&rsquo; 같은 지속운용·경계 시나리오를 <strong style={{ color: FPGA.accent }}>요구사항 기반 검증</strong>에서 강제해야 걸러짐 → DO-254/178C가 추적성을 강조하는 이유
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 14 — 산출물의 무게 ══════════ */
const ARTIFACTS = ['PHAC (인증 계획)', '하드웨어 요구사항', '설계 문서', 'V&V 계획·절차', '추적성 매트릭스', '커버리지 리포트', '형상관리 기록', '리뷰·감사 기록', '문제/변경 이력'];

function ArtifactsSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH3} title="산출물의 무게" subtitle="형상관리 · 감사(Audit) · 문서 산출물" />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.4rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <div style={chip(FPGA.primary)}>인증 산출물 (일부)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {ARTIFACTS.map((a) => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '8px', padding: '0.45rem 0.7rem', fontSize: '0.82rem', color: FPGA.text, boxShadow: shadow.card }}>
                  <span style={{ color: FPGA.primary, fontWeight: 800 }}>▪</span>{a}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.8rem', color: FPGA.textLight }}>+ 독립 검증(IV&V) · FAA SOI 단계 감사 대응</div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${FPGA.dark}, ${FPGA.primary})`, color: '#fff', borderRadius: '14px', padding: '1.6rem 1.2rem', boxShadow: shadow.deep, textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>체감 비율</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0.4rem 0', lineHeight: 1.1 }}>코드 1줄<br /><span style={{ color: FPGA.accent }}>: 문서 수 페이지</span></div>
            <div style={{ fontSize: '0.82rem', opacity: 0.9, lineHeight: 1.5 }}>설계보다 &lsquo;증명 문서&rsquo;가 더 큰 비중</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 15 — 결론: 증명 비용 ══════════ */
function CostBar({ label, segs }: { label: string; segs: { h: number; c: string; t: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ width: '110px', height: '230px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: '10px', overflow: 'hidden', boxShadow: shadow.card, border: `1px solid ${FPGA.border}` }}>
        {segs.map((s, i) => (
          <div key={i} style={{ height: `${s.h}%`, background: s.c, color: '#fff', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: 1.2 }}>{s.t}</div>
        ))}
      </div>
      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: FPGA.dark }}>{label}</div>
    </div>
  );
}

function ConclusionSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH3} title="결론 — 개발비 급증의 정체" subtitle="비용 구성의 무게중심이 &lsquo;증명&rsquo;으로 이동 (개념 비교)" />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '1.6rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.2rem', alignItems: 'flex-end' }}>
            <CostBar label="민수" segs={[
              { h: 10, c: FPGA.textLight, t: '문서' },
              { h: 25, c: FPGA.primaryLight, t: '검증' },
              { h: 65, c: FPGA.primary, t: '설계·구현' },
            ]} />
            <CostBar label="국방" segs={[
              { h: 40, c: FPGA.accent, t: '문서·인증·감사' },
              { h: 35, c: FPGA.primaryLight, t: '검증' },
              { h: 25, c: FPGA.primary, t: '설계·구현' },
            ]} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '1rem', color: FPGA.text, lineHeight: 1.7 }}>
              같은 &lsquo;동작하는 설계&rsquo;라도 국방에서는 <strong style={{ color: FPGA.accent }}>검증 · 증명 · 문서 · 감사</strong>가 비용의 대부분.
            </div>
            <div style={{ background: FPGA.dark, color: '#fff', borderRadius: '12px', padding: '1.1rem 1.4rem', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', boxShadow: shadow.deep }}>
              개발비 급증의 정체 = <span style={{ color: FPGA.accent }}>증명 비용</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: FPGA.textLight }}>※ 비율은 구성 차이를 보이기 위한 개념값(실측 아님)</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Chapter3CivilVsDefense() {
  return (
    <>
      <ThesisSlide />
      <DO254Slide />
      <TraceabilitySlide />
      <CoverageSlide />
      <ArtifactsSlide />
      <ConclusionSlide />
    </>
  );
}
