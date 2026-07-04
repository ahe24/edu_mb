'use client';

/**
 * 무기체계 속의 FPGA — 6장. 마무리 + Q&A
 *   24. 3줄 요약
 *   25. Q&A / 감사
 */

import { FPGA, slideBg, shadow, edgeBorder } from '../fpga/FpgaSlideStyles';
import SlideHeader from '../fpga/SlideHeader';

const CH6 = '6장 · 마무리';

const SUMMARY = [
  { n: '1', title: '국방 개발의 본질 = 증명', desc: "'동작'이 아니라 '동작함의 증명'", color: FPGA.primary },
  { n: '2', title: '그 증명이 곧 우리 비즈니스', desc: 'Questa 등 V&V 툴 = 증명을 만드는 도구', color: FPGA.accent },
  { n: '3', title: '민수도 같은 방향', desc: '자동차·의료·산업으로 기능안전 확산', color: FPGA.primaryLight },
];

function SummarySlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader badge={CH6} title="3줄 요약" subtitle="오늘 남길 세 문장" />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.1rem' }}>
          {SUMMARY.map((s) => (
            <div key={s.n} style={{
              display: 'flex', alignItems: 'center', gap: '1.3rem',
              background: FPGA.white, ...edgeBorder(`${s.color}30`, 'left', s.color, '6px'),
              borderRadius: '14px', padding: '1.2rem 1.6rem', boxShadow: shadow.card,
            }}>
              <span style={{
                flexShrink: 0, width: '52px', height: '52px', borderRadius: '50%',
                background: s.color, color: '#fff', fontSize: '1.5rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: shadow.card,
              }}>{s.n}</span>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: FPGA.dark }}>{s.title}</div>
                <div style={{ fontSize: '0.95rem', color: FPGA.textLight, marginTop: '2px' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QnASlide() {
  return (
    <section
      data-background-color="#0D1B2E"
      style={{
        backgroundImage: 'radial-gradient(1000px 520px at 70% -10%, rgba(74,111,165,0.28) 0%, transparent 60%), linear-gradient(160deg, #0D1B2E 0%, #14233b 55%, #0D1B2E 100%)',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(107,140,199,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(107,140,199,0.10) 1px, transparent 1px)`,
        backgroundSize: '52px 52px', pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', margin: 'auto 0', textShadow: '0 2px 14px rgba(0,0,0,0.5)' }}>
        <div style={{ fontSize: '4.2rem', fontWeight: 800, color: '#fff', letterSpacing: '0.08em' }}>
          Q <span style={{ color: FPGA.primaryLight }}>&amp;</span> A
        </div>
        <div style={{ width: '150px', height: '2px', margin: '1.8rem auto', background: 'linear-gradient(90deg, transparent, rgba(107,140,199,0.7), transparent)' }} />
        <div style={{ fontSize: '1.5rem', color: 'rgba(220,230,245,0.92)', fontWeight: 400 }}>감사합니다</div>
        <div style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.9rem', color: 'rgba(200,215,235,0.9)', fontSize: '1.05rem' }}>
          <span style={{ fontWeight: 700 }}>조창선 이사</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>EDA 사업부</span>
        </div>
      </div>
    </section>
  );
}

export default function Chapter6Closing() {
  return (
    <>
      <SummarySlide />
      <QnASlide />
    </>
  );
}
