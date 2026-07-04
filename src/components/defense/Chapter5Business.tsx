'use client';

/**
 * 무기체계 속의 FPGA — 5장. 이 이야기가 우리 회사와 무슨 상관인가
 *   20. 시장의 본질 (증명을 파는 시장 → V&V 툴)
 *   21. 민수로의 확산 (기능안전 표준 맵)
 *   22. 고객 대응 키워드
 *   23. 회사 차원 시사점 (4개 팀 연결)
 */

import { FPGA, slideBg, shadow, edgeBorder } from '../fpga/FpgaSlideStyles';
import SlideHeader from '../fpga/SlideHeader';

const CH5 = '5장 · 우리 회사와의 연결';

const chip = (color: string) => ({
  alignSelf: 'flex-start' as const,
  fontSize: '0.8rem', fontWeight: 700 as const, color,
  background: `${color}12`, border: `1px solid ${color}30`,
  padding: '3px 12px', borderRadius: '999px',
});

/* ══════════ 슬라이드 20 — 시장의 본질 ══════════ */
const CHAIN = [
  { t: '안전 규제 · 인증', d: 'DO-254 / 감항', color: FPGA.textLight },
  { t: '증명 의무', d: '동작함을 문서로', color: FPGA.primary },
  { t: 'V&V 활동', d: 'Lint·CDC·Sim·Coverage·Formal', color: FPGA.primary },
  { t: 'EDA 툴 수요', d: '= 우리 비즈니스', color: FPGA.accent },
];

function MarketSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH5} title="시장의 본질" subtitle="국방·항공 = &lsquo;품질과 증명&rsquo;에 돈을 쓰는 시장" />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.5rem' }}>
            {CHAIN.map((n, i) => (
              <div key={n.t} style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.5rem' }}>
                <div style={{
                  flex: 1, background: n.color === FPGA.accent ? `${FPGA.accent}0e` : FPGA.white,
                  ...edgeBorder(`${n.color}35`, 'top', n.color, '3px'),
                  borderRadius: '12px', padding: '1rem 0.7rem', boxShadow: shadow.card, textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: FPGA.dark }}>{n.t}</div>
                  <div style={{ fontSize: '0.76rem', color: n.color === FPGA.accent ? FPGA.accent : FPGA.textLight, marginTop: '3px', fontWeight: n.color === FPGA.accent ? 700 : 500 }}>{n.d}</div>
                </div>
                {i < CHAIN.length - 1 && <span style={{ color: FPGA.textLight, fontWeight: 800, fontSize: '1.1rem' }}>→</span>}
              </div>
            ))}
          </div>
          <div style={{ background: FPGA.dark, color: '#fff', borderRadius: '12px', padding: '1.1rem 1.4rem', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center', boxShadow: shadow.deep }}>
            고객이 사는 것은 &lsquo;동작&rsquo;이 아니라 <span style={{ color: FPGA.accent }}>&lsquo;동작함의 증명&rsquo;</span> → 그 증명을 만드는 도구가 <span style={{ color: FPGA.accent }}>우리 제품(Questa 등)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 21 — 민수로의 확산 ══════════ */
const INDUSTRIES = [
  { name: '항공', std: 'DO-254 / DO-178C', color: FPGA.primary },
  { name: '자동차', std: 'ISO 26262 (ASIL)', color: FPGA.accent },
  { name: '의료', std: 'IEC 62304 / 60601', color: FPGA.primaryLight },
  { name: '산업', std: 'IEC 61508 (SIL)', color: FPGA.dark },
  { name: '원전', std: 'IEC 60880 / 62566', color: FPGA.textLight },
  { name: '철도', std: 'EN 50128 / 50129', color: FPGA.primary },
];

function DiffusionSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH5} title="민수로의 확산" subtitle="자동차·의료·산업 — 같은 &lsquo;증명&rsquo; 흐름" />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.9rem' }}>
            {INDUSTRIES.map((x) => (
              <div key={x.name} style={{ background: FPGA.white, ...edgeBorder(`${x.color}30`, 'left', x.color), borderRadius: '10px', padding: '0.8rem 1rem', boxShadow: shadow.card }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: x.color }}>{x.name}</div>
                <div style={{ fontSize: '0.8rem', color: FPGA.text, fontFamily: '"JetBrains Mono", monospace', marginTop: '2px' }}>{x.std}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: `${FPGA.primary}0c`, border: `1px solid ${FPGA.primary}30`, borderRadius: '10px', padding: '0.8rem 1.1rem', fontSize: '0.88rem', color: FPGA.text, lineHeight: 1.55 }}>
              <strong style={{ color: FPGA.primary }}>PADS팀 · Moldflow팀 고객사</strong>에도 동일한 기능안전 흐름 확산
            </div>
            <div style={{ background: `${FPGA.accent}0c`, border: `1px solid ${FPGA.accent}30`, borderRadius: '10px', padding: '0.8rem 1.1rem', fontSize: '0.88rem', color: FPGA.text, lineHeight: 1.55 }}>
              <strong style={{ color: FPGA.accent }}>737 MAX 이후</strong> 소프트웨어·하드웨어 인증 강화 추세
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 22 — 고객 대응 키워드 ══════════ */
const KEYWORDS = [
  { k: 'DO-254', d: '항공전자 하드웨어(FPGA/ASIC) 설계 보증' },
  { k: 'DO-178C', d: '항공 소프트웨어 인증 (레벨 A~E)' },
  { k: 'MIL-STD', d: '군용 표준 (1553B 버스 · 810 환경시험 등)' },
  { k: '감항인증', d: 'Airworthiness — 비행 안전성 공식 인증' },
  { k: 'ARINC-818', d: '항공 디지털 비디오 전송 규격' },
  { k: 'DAL / ASIL', d: '항공 / 자동차 안전 무결성 등급' },
];

function KeywordsSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH5} title="고객 대응 키워드" subtitle="방산 협력업체 미팅에서 알아두면 좋은 용어" />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: '0.9rem', alignContent: 'center' }}>
          {KEYWORDS.map((x) => (
            <div key={x.k} style={{ background: FPGA.white, ...edgeBorder(FPGA.border, 'top', FPGA.primary, '3px'), borderRadius: '10px', padding: '0.8rem 1.1rem', boxShadow: shadow.card, display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: FPGA.primary, fontFamily: '"JetBrains Mono", monospace', minWidth: '6.5rem' }}>{x.k}</span>
              <span style={{ fontSize: '0.86rem', color: FPGA.text, lineHeight: 1.45 }}>{x.d}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 23 — 회사 차원 시사점 ══════════ */
const TEAMS = [
  { team: 'EDA팀', msg: 'V&V 툴 = 증명을 만드는 도구, 방산의 핵심 수요' },
  { team: 'PADS팀', msg: 'PCB도 방산 신뢰성·문서·형상관리 요구 대상' },
  { team: 'Moldflow팀', msg: '하우징·열해석도 항공·차량 안전 부품의 일부' },
  { team: 'AutoCAD팀', msg: '도면·형상관리 자체가 인증 산출물' },
];

function ImplicationSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH5} title="회사 차원 시사점" subtitle="인증 대응 컨설팅 + 툴 판매 결합 기회" />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: '1.4rem', alignItems: 'center' }}>
          <div style={{ background: `linear-gradient(135deg, ${FPGA.dark}, ${FPGA.primary})`, color: '#fff', borderRadius: '14px', padding: '1.6rem 1.3rem', boxShadow: shadow.deep }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.85, letterSpacing: '0.04em' }}>기회 영역</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.6rem 0', lineHeight: 1.3 }}>인증 대응 컨설팅<br />+ V&V 툴 판매</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.6 }}>&lsquo;증명&rsquo;이 필요한 모든 고객에게 툴 + 방법론 + 산출물 지원을 묶어 제공</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={chip(FPGA.accent)}>당신 고객에게도 해당된다</div>
            {TEAMS.map((t) => (
              <div key={t.team} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', background: FPGA.white, ...edgeBorder(FPGA.border, 'left', FPGA.accent), borderRadius: '10px', padding: '0.6rem 0.95rem', boxShadow: shadow.card }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: FPGA.accent, minWidth: '5.5rem' }}>{t.team}</span>
                <span style={{ fontSize: '0.86rem', color: FPGA.text, lineHeight: 1.45 }}>{t.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Chapter5Business() {
  return (
    <>
      <MarketSlide />
      <DiffusionSlide />
      <KeywordsSlide />
      <ImplicationSlide />
    </>
  );
}
