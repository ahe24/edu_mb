'use client';

import { EDA, edaStyles } from './EdaSlideStyles';

const zones = [
  {
    title: '외부 인터넷 영역',
    subtitle: '모델/데이터 준비 (1회성)',
    color: '#4A6F9A',
    items: [
      'Hugging Face에서 모델 다운로드',
      '학습 데이터 전처리 및 검증',
      'PEFT/LoRA Fine-tuning 수행',
      '보안 검증 후 물리 매체에 기록',
    ],
  },
  {
    title: '에어갭 경계',
    subtitle: '에어갭 전송 프로토콜',
    color: '#5A6A7E',
    items: [
      '물리적 에어갭 (USB/광미디어)',
      '데이터 다이오드 (단방향 전송)',
      'Hash 무결성 검증',
      '악성코드 스캔 후 내부 반입',
    ],
  },
  {
    title: '내부 보안 네트워크',
    subtitle: '내부 보안 영역 (Air-Gapped)',
    color: EDA.navy,
    items: [
      '로컬 GPU 서버 (LLM 추론 전용)',
      'FAISS 벡터 DB (오프라인 RAG)',
      'RapidMiner Server (오케스트레이션)',
      '설계 DB 연동 (Questa/Verilog,VHDL)',
    ],
  },
];

const securityPrinciples = [
  { principle: 'Zero Trust 네트워크', desc: '내부에서도 모든 접근에 인증/인가 적용' },
  { principle: '데이터 유출 방지 (DLP)', desc: 'LLM 프롬프트/응답 로그의 로컬 암호화 저장' },
  { principle: 'ITAR/EAR 준수', desc: '반도체 설계 데이터의 외부 전송 원천 차단' },
  { principle: '학습 데이터 보호', desc: '추출 공격으로부터 보호: 자체 모델만 사용' },
];

export default function AirGapSlide() {
  return (
    <section data-background-color={EDA.bg}>
      <div className="eda-content-wrap" style={edaStyles.contentWrap}>
        <div style={edaStyles.slideHeader}>폐쇄망(Air-Gapped) 네트워크 AI 보안 아키텍처</div>

        {/* 3-zone flow */}
        <div style={{ display: 'flex', gap: '0', alignItems: 'stretch', flex: 1, width: '100%' }}>
          {zones.map((zone, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
              <div style={{
                flex: 1,
                background: EDA.bgCard,
                border: `1px solid ${EDA.border}`,
                borderRadius: idx === 0 ? '8px 0 0 8px' : idx === 2 ? '0 8px 8px 0' : '0',
                borderRight: idx < 2 ? 'none' : undefined,
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(27,43,75,0.08)',
              }}>
                {/* Zone header */}
                <div style={{
                  background: zone.color,
                  color: EDA.white,
                  padding: '0.5rem 0.9rem',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textAlign: 'center' as const,
                }}>
                  {zone.title}
                </div>
                <div style={{ padding: '0.7rem 0.9rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.80rem', color: zone.color, marginBottom: '0.5rem' }}>
                    {zone.subtitle}
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {zone.items.map((item, i) => (
                      <li key={i} style={{
                        fontSize: '0.77rem', color: EDA.text, lineHeight: 1.65,
                        marginBottom: '0.15rem',
                        display: 'flex', alignItems: 'flex-start', gap: '0.4rem',
                      }}>
                        <span style={{ color: zone.color, fontWeight: 700 }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Arrow between zones */}
              {idx < 2 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '28px', minWidth: '28px',
                  background: '#DDE3EC',
                  zIndex: 1,
                }}>
                  <span style={{ color: EDA.navy, fontSize: '1.1rem', fontWeight: 700 }}>→</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Security table */}
        <div style={edaStyles.card}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th style={{ background: EDA.navy, color: EDA.white, padding: '7px 12px', textAlign: 'left', borderRadius: '6px 0 0 0', fontWeight: 600, width: '30%' }}>
                  핵심 보안 원칙
                </th>
                <th style={{ background: EDA.navy, color: EDA.white, padding: '7px 12px', textAlign: 'left', borderRadius: '0 6px 0 0', fontWeight: 600 }}>
                  설명
                </th>
              </tr>
            </thead>
            <tbody>
              {securityPrinciples.map((row, i) => (
                <tr key={i}>
                  <td style={{
                    padding: '6px 12px',
                    fontWeight: 600,
                    color: EDA.navy,
                    background: i % 2 === 0 ? EDA.bgCard : '#F5F7FA',
                    borderBottom: i < securityPrinciples.length - 1 ? `1px solid ${EDA.border}` : 'none',
                  }}>
                    {row.principle}
                  </td>
                  <td style={{
                    padding: '6px 12px',
                    color: EDA.text,
                    background: i % 2 === 0 ? EDA.bgCard : '#F5F7FA',
                    borderBottom: i < securityPrinciples.length - 1 ? `1px solid ${EDA.border}` : 'none',
                  }}>
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
