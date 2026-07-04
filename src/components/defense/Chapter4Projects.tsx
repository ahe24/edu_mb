'use client';

/**
 * 무기체계 속의 FPGA — 4장. 실전 사례 + 특허
 *   16. 사례 ① 10GbE 비압축 영상 전송 (Kintex-7, DO-254)
 *   17. 왜 압축하면 안 되는가 (지연·결정론)
 *   18. 사례 ② ARINC-818 SMFD / RDC DAL-B V&V
 *   19. 등록 특허 3건
 *
 * 공개 범위: 사내 실무 수준 (사업명·발주처·기종 실명 제외)
 */

import { FPGA, slideBg, shadow, edgeBorder } from '../fpga/FpgaSlideStyles';
import SlideHeader from '../fpga/SlideHeader';
import ImagePlaceholder from '../ImagePlaceholder';

const CH4 = '4장 · 실전 사례';

const chip = (color: string) => ({
  alignSelf: 'flex-start' as const,
  fontSize: '0.8rem', fontWeight: 700 as const, color,
  background: `${color}12`, border: `1px solid ${color}30`,
  padding: '3px 12px', borderRadius: '999px',
});

/* ══════════ 슬라이드 16 — 사례 ① ══════════ */
function Case1Slide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH4} title="사례 ① 10GbE 비압축 영상 전송" subtitle="DVI / ARINC-818 영상 · Kintex-7 · DO-254 대응" />
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '1.4rem', alignItems: 'center' }}>
          <div style={{ background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '12px', padding: '0.7rem', boxShadow: shadow.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImagePlaceholder src="/images/defense/patents/patent_2015_10-1579850_10GbE-HDMI-DVI.jpg" label="시스템 블록도" desc="10GbE 비압축 영상 송수신 (공개 특허 도면, 일반화)" maxHeight="360px" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              ['영상 소스', 'DVI/HDMI · ARINC-818 (항공 디지털 영상)'],
              ['전송', '10GbE 비압축 · 광 인터페이스'],
              ['디바이스', 'Xilinx Kintex-7 FPGA'],
              ['핵심 로직', 'Tx/Rx 패킷화 · FSM · Dualport FIFO · 10GbE MAC/PHY'],
              ['인증', 'DO-254 설계 보증 대응'],
            ].map(([t, d]) => (
              <div key={t} style={{ background: FPGA.white, ...edgeBorder(FPGA.border, 'left', FPGA.primary), borderRadius: '10px', padding: '0.55rem 0.85rem', boxShadow: shadow.card }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: FPGA.primary }}>{t}</div>
                <div style={{ fontSize: '0.85rem', color: FPGA.text, lineHeight: 1.4 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 17 — 왜 압축하면 안 되는가 ══════════ */
function LatencyBar({ label, color, blocks, note }: { label: string; color: string; blocks: { w: number; c: string; t: string }[]; note: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 800, color }}>{label}</div>
      <div style={{ display: 'flex', height: '46px', borderRadius: '9px', overflow: 'hidden', border: `1px solid ${FPGA.border}`, boxShadow: shadow.card }}>
        {blocks.map((b, i) => (
          <div key={i} style={{ width: `${b.w}%`, background: b.c, color: '#fff', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: 1.15 }}>{b.t}</div>
        ))}
      </div>
      <div style={{ fontSize: '0.82rem', color: FPGA.textLight }}>{note}</div>
    </div>
  );
}

function WhyNoCompressSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH4} title="왜 압축하면 안 되는가" subtitle="지연시간(latency) · 결정론성" />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.4rem' }}>
          <LatencyBar label="압축 전송" color={FPGA.danger}
            blocks={[
              { w: 30, c: FPGA.danger, t: '인코딩' },
              { w: 22, c: FPGA.accent, t: '네트워크' },
              { w: 30, c: FPGA.danger, t: '디코딩' },
              { w: 18, c: FPGA.textLight, t: '버퍼' },
            ]}
            note="프레임 단위 지연 · 가변(지터) · 압축 아티팩트 → 조종·표적 판단에 부적합" />
          <LatencyBar label="비압축 전송" color={FPGA.primary}
            blocks={[
              { w: 12, c: FPGA.primary, t: '패킷화' },
              { w: 22, c: FPGA.primaryLight, t: '네트워크' },
              { w: 12, c: FPGA.primary, t: '디패킷화' },
            ]}
            note="라인/픽셀 단위 · 고정 저지연 · 지터 없음 → 결정론적 실시간" />
          <div style={{ background: `linear-gradient(135deg, ${FPGA.primary}0e, ${FPGA.accent}0e)`, border: `1px solid ${FPGA.primary}30`, borderRadius: '10px', padding: '0.8rem 1.2rem', fontSize: '0.95rem', color: FPGA.text, lineHeight: 1.6 }}>
            safety-critical 영상은 <strong style={{ color: FPGA.primary }}>지연이 작고 예측 가능</strong>해야 함 → 대역폭을 써서라도 비압축
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 18 — 사례 ② ══════════ */
const VV_FLOW = ['요구사항', '설계 (RTL)', '시뮬 · 커버리지', '형식 검증', '실물 HW 시험', '인증 산출물'];

function Case2Slide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH4} title="사례 ② ARINC-818 SMFD / RDC" subtitle="DO-254 DAL-B V&V · 커버리지 클로저 수행" />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.3rem' }}>
          <div style={chip(FPGA.primary)}>V&V 흐름</div>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.4rem' }}>
            {VV_FLOW.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.4rem' }}>
                <div style={{
                  flex: 1, background: FPGA.white,
                  ...edgeBorder(FPGA.border, 'top', i === VV_FLOW.length - 1 ? FPGA.accent : FPGA.primary, '3px'),
                  borderRadius: '10px', padding: '0.7rem 0.4rem', boxShadow: shadow.card, textAlign: 'center',
                  fontSize: '0.82rem', fontWeight: 700, color: FPGA.dark,
                }}>{s}</div>
                {i < VV_FLOW.length - 1 && <span style={{ color: FPGA.textLight, fontWeight: 800 }}>→</span>}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              ['대상', 'ARINC-818 SMFD 영상 전송 · RDC(원격 데이터 집중기)'],
              ['등급', 'DO-254 DAL-B'],
              ['활동', '독립 검증 · 구조/기능 커버리지 클로저'],
              ['산출물', '추적성 · 커버리지 리포트 · HW 시험 증적'],
            ].map(([t, d]) => (
              <div key={t} style={{ background: FPGA.white, ...edgeBorder(FPGA.border, 'left', FPGA.primary), borderRadius: '10px', padding: '0.6rem 0.9rem', boxShadow: shadow.card }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.primary }}>{t}</div>
                <div style={{ fontSize: '0.84rem', color: FPGA.text, lineHeight: 1.4 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ 슬라이드 19 — 등록 특허 3건 ══════════ */
const PATENTS = [
  { src: 'patent_2015_10-1579850_10GbE-HDMI-DVI.jpg', no: '10-1579850 (2015)', meaning: '비압축 영상 전송' },
  { src: 'patent_2017_10-1805850_multi-video.jpg', no: '10-1805850 (2017)', meaning: '다종 영상 확장' },
  { src: 'patent_2019_10-2001881_traffic-gen.jpg', no: '10-2001881 (2019, 단독)', meaning: '시험 장비화' },
];

function PatentsSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH4} title="등록 특허 3건" subtitle="비압축 영상 전송 → 다종 영상 확장 → 시험 장비화" />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {PATENTS.map((p, i) => (
              <div key={p.no} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ background: FPGA.white, border: `1px solid ${FPGA.border}`, borderRadius: '10px', padding: '0.5rem', boxShadow: shadow.card, height: '210px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImagePlaceholder src={`/images/defense/patents/${p.src}`} label={p.no} desc="공개 특허 대표도면" maxHeight="195px" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark, fontFamily: '"JetBrains Mono", monospace' }}>{p.no}</div>
                  <div style={{ display: 'inline-block', marginTop: '3px', fontSize: '0.82rem', fontWeight: 700, color: i === 2 ? FPGA.accent : FPGA.primary, background: `${i === 2 ? FPGA.accent : FPGA.primary}12`, borderRadius: '999px', padding: '2px 12px' }}>{p.meaning}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1, background: FPGA.bgAlt, border: `1px solid ${FPGA.border}`, borderRadius: '10px', padding: '0.7rem 1.1rem', fontSize: '0.85rem', color: FPGA.text, lineHeight: 1.5 }}>
              그 개발 과정에서 나온 결과물 · 현 권리자 <strong style={{ color: FPGA.dark }}>(주)솔디펜스</strong> · KSAS 논문(2015) 병행
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Chapter4Projects() {
  return (
    <>
      <Case1Slide />
      <WhyNoCompressSlide />
      <Case2Slide />
      <PatentsSlide />
    </>
  );
}
