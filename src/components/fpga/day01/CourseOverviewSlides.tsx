'use client';

import { FPGA, slideBg, styles, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import InfoCard from '../InfoCard';
import KeywordTag from '../KeywordTag';
import ToolImage from '../ToolImage';

/**
 * Day 01 — 교육 과정 소개 섹션 (3 슬라이드)
 */
export default function CourseOverviewSlides() {
  return (
    <>
      {/* ── 슬라이드: 교육 개요 ── */}
      <section data-background-color={slideBg}>
        <div className="fpga-content-wrap">
        <SlideHeader title="과정 개요" subtitle="Course Overview" />

        <div style={{ ...styles.grid2, flex: 1, minHeight: 0 }}>
          <InfoCard icon="🎯" label="과정 목적" variant="highlight">
            <p style={{ margin: 0 }}>
              협력업체가 설계한 FPGA 로직을<br />
              <strong style={{ color: FPGA.primary }}>독립적으로 검증·평가</strong>하고,<br />
              보완점 지적 및 수정 요청 능력 확보
            </p>
          </InfoCard>

          <InfoCard icon="📋" label="최종 목표">
            <p style={{ margin: 0 }}>
              Safety-Critical FPGA 설계 산출물에 대한<br />
              <strong style={{ color: FPGA.accent }}>인허가 절차</strong> 진행에 필요한<br />
              사항 이해 및 실무 적용
            </p>
          </InfoCard>

          <InfoCard icon="👥" label="참여 대상">
            <p style={{ margin: 0 }}>원전 · 방산 · 항공우주 분야<br />Safety-Critical FPGA 담당 엔지니어</p>
          </InfoCard>

          <InfoCard icon="⏱" label="운영 일정">
            <p style={{ margin: 0 }}>
              3개월 (12주) · 주 2일<br />
              1일 3.5시간 · 총 24회 (84시간)
            </p>
          </InfoCard>
        </div>
        </div>
      </section>

      {/* ── 슬라이드: 3개월 로드맵 (수평 타임라인) ── */}
      <section data-background-color={slideBg}>
        <div className="fpga-content-wrap">
        <SlideHeader title="3개월 학습 로드맵" subtitle="Learning Roadmap" />

        {/* 타임라인 */}
        <div style={{ flex: 1, minHeight: 0, width: '100%', position: 'relative', padding: '0.5rem 0' }}>
          {/* 중앙 수평선 */}
          <div style={{
            position: 'absolute',
            top: '38px',
            left: '5%',
            right: '5%',
            height: '4px',
            background: `linear-gradient(90deg, #4A6FA5, #5B8C5A, #8B6FA5)`,
            borderRadius: '2px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
          }} />

          {/* 3개월 노드 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 3%' }}>
            {[
              {
                month: '1개월차',
                weeks: 'Week 1~4',
                title: '정적 분석',
                color: '#4A6FA5',
                keywords: ['Questa Lint', 'CDC', '코딩 규칙', '설계 결함'],
                topics: [
                  '환경 구축 · 검증 개론',
                  '코딩 규칙 검증 (Lint)',
                  '설계 결함 추출',
                  'CDC 분석',
                ],
              },
              {
                month: '2개월차',
                weeks: 'Week 5~8',
                title: '설계 기반 검증',
                color: '#5B8C5A',
                keywords: ['Arty-7 설계', 'QuestaSim', 'Testbench', 'Coverage'],
                topics: [
                  'QuestaSim · 조합/순차 설계',
                  'FSM · UART 설계 검증',
                  'TB 고도화 · 커버리지',
                  '통합 설계 · 보드 검증',
                ],
              },
              {
                month: '3개월차',
                weeks: 'Week 9~12',
                title: '형식 검증 / 통합',
                color: '#8B6FA5',
                keywords: ['Formal', 'Autocheck', 'STA', 'V&V Report'],
                topics: [
                  '형식 검증 · Autocheck',
                  'STA 타이밍 분석',
                  '통합 툴 활용',
                  'V&V Report · 인허가',
                ],
              },
            ].map((m, i) => (
              <div key={m.month} style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* 원형 노드 */}
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: '1.1rem',
                  boxShadow: `0 4px 14px ${m.color}40, 0 2px 6px rgba(0,0,0,0.10)`,
                  border: '3px solid #fff',
                  zIndex: 2,
                  marginBottom: '0.8rem',
                }}>
                  {i + 1}
                </div>

                {/* 카드 */}
                <div style={{
                  width: '100%',
                  background: `linear-gradient(180deg, ${m.color}08, ${FPGA.white})`,
                  border: `1px solid ${m.color}20`,
                  borderRadius: '14px',
                  padding: '1rem 1.1rem',
                  boxShadow: shadow.card,
                  textAlign: 'left',
                }}>
                  {/* 월/주차 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.3rem' }}>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, color: m.color,
                      letterSpacing: '0.06em',
                    }}>{m.month}</span>
                    <span style={{
                      fontSize: '0.68rem', color: FPGA.textLight,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}>{m.weeks}</span>
                  </div>

                  {/* 타이틀 */}
                  <div style={{
                    fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark,
                    marginBottom: '0.6rem',
                  }}>{m.title}</div>

                  {/* 주차별 토픽 */}
                  <div style={{ marginBottom: '0.7rem' }}>
                    {m.topics.map((t, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '3px 0',
                        fontSize: '0.76rem', color: FPGA.text,
                        borderLeft: `2px solid ${m.color}30`,
                        paddingLeft: '8px',
                        marginBottom: '2px',
                      }}>
                        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem', color: m.color, fontWeight: 600, minWidth: '16px' }}>
                          W{i * 4 + j + 1}
                        </span>
                        {t}
                      </div>
                    ))}
                  </div>

                  {/* 키워드 */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {m.keywords.map(kw => (
                      <span key={kw} style={{
                        fontSize: '0.68rem', padding: '1px 7px',
                        borderRadius: '4px',
                        background: `${m.color}10`,
                        border: `1px solid ${m.color}20`,
                        color: m.color,
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 500,
                      }}>{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* ── 슬라이드: 주요 EDA 도구 (이미지 placeholder 포함) ── */}
      <section data-background-color={slideBg}>
        <div className="fpga-content-wrap">
        <SlideHeader title="주요 EDA 도구" subtitle="Verification Tool Suite" />

        <div style={{ ...styles.grid2, flex: 1, minHeight: 0 }}>
          {/* Siemens EDA */}
          <div style={{
            ...styles.cardHighlight,
            borderLeft: `4px solid ${FPGA.primary}`,
          }}>
            <div style={{
              fontSize: '0.78rem', fontWeight: 700, color: FPGA.primary,
              letterSpacing: '0.06em', marginBottom: '0.8rem',
            }}>SIEMENS EDA (PRIMARY)</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {[
                { name: 'QuestaSim', desc: '기능 시뮬레이션, 커버리지', img: '/images/fpga/tool_questasim.png' },
                { name: 'Questa Lint', desc: 'RTL 코딩 규칙 검증', img: '/images/fpga/tool_questa_lint.png' },
                { name: 'Questa CDC', desc: 'Clock Domain Crossing', img: '/images/fpga/tool_questa_cdc.png' },
                { name: 'Code Coverage', desc: 'Code Coverage', img: '/images/fpga/tool_questa_formal.png' },
              ].map((tool) => (
                <div key={tool.name} style={{
                  background: FPGA.white,
                  borderRadius: '8px',
                  padding: '0.5rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  border: `1px solid ${FPGA.border}`,
                }}>
                  {/* 이미지 placeholder */}
                  <div style={{ marginBottom: '0.4rem' }}>
                    <ToolImage src={tool.img} name={tool.name} width="100%" height="120px" />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: FPGA.dark }}>{tool.name}</div>
                  <div style={{ fontSize: '0.7rem', color: FPGA.textLight }}>{tool.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Supplementary */}
          <div style={{
            ...styles.card,
            borderLeft: `4px solid ${FPGA.textLight}`,
          }}>
            <div style={{
              fontSize: '0.78rem', fontWeight: 700, color: FPGA.textLight,
              letterSpacing: '0.06em', marginBottom: '0.8rem',
            }}>SUPPLEMENTARY TOOLS</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                { name: 'Vivado', desc: 'Xilinx FPGA 합성, P&R, STA', img: '/images/fpga/tool_vivado.png' },
                { name: 'Libero SoC', desc: 'Microchip FPGA 개발 환경', img: '/images/fpga/tool_libero.png' },
              ].map((tool) => (
                <div key={tool.name} style={{
                  display: 'flex', gap: '0.8rem', alignItems: 'center',
                  background: FPGA.bgAlt,
                  borderRadius: '8px',
                  padding: '0.6rem',
                  border: `1px solid ${FPGA.border}`,
                }}>
                  {/* 이미지 placeholder */}
                  <div style={{ flexShrink: 0 }}>
                    <ToolImage src={tool.img} name={tool.name} width="100%" height="150px" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: FPGA.dark }}>{tool.name}</div>
                    <div style={{ fontSize: '0.78rem', color: FPGA.textLight }}>{tool.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
