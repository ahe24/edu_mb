'use client';

import { FPGA, slideBg, styles, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import InfoCard from '../InfoCard';

/**
 * Day 01 — 정적 분석 vs 동적 검증 섹션 (3 슬라이드)
 */
export default function VerificationMethodsSlides() {
  return (
    <>
      {/* ── 슬라이드: 정적 분석 vs 동적 검증 비교 ── */}
      <section data-background-color={slideBg}>
        <SlideHeader
          title="정적 분석 vs 동적 검증"
          subtitle="Static Analysis vs Dynamic Verification"
        />

        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={styles.grid2}>
            {/* 정적 분석 */}
            <div style={{
              ...styles.card,
              borderTop: `4px solid ${FPGA.primary}`,
              background: `linear-gradient(180deg, rgba(74,111,165,0.04) 0%, ${FPGA.white} 30%)`,
              display: 'flex', flexDirection: 'column',
            }}>
              <h3 style={{ fontSize: '1.1rem', color: FPGA.primary, marginBottom: '0.8rem', textAlign: 'left' }}>
                정적 분석 (Static Analysis)
              </h3>
              <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: shadow.inset, background: '#FAFBFD', flex: 1 }}>
                <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', height: '100%' }}>
                  <tbody>
                    {[
                      ['방식', 'RTL 코드를 실행하지 않고 분석'],
                      ['속도', '빠름 (수 분 ~ 수십 분)'],
                      ['대상', '코드 구조, 문법, 클록 도메인'],
                      ['도구', 'Questa Lint, Questa CDC 등'],
                      ['발견 가능', '코딩 규칙 위반, CDC 문제, Dead Logic'],
                      ['한계', '기능적 정확성은 확인 불가'],
                      ['적용 시점', 'RTL 코딩 직후, 합성 전 상시 반복 수행'],
                      ['인허가 산출물', 'Lint 리포트, CDC 위반 목록, Waiver 문서'],
                    ].map(([key, val], i, arr) => (
                      <tr key={i}>
                        <td style={{ padding: '9px 10px', fontWeight: 600, color: FPGA.primary, width: '100px', verticalAlign: 'top', borderBottom: i < arr.length - 1 ? `1px solid ${FPGA.border}` : 'none', background: 'rgba(74,111,165,0.04)' }}>{key}</td>
                        <td style={{ padding: '9px 10px', color: FPGA.text, borderBottom: i < arr.length - 1 ? `1px solid ${FPGA.border}` : 'none' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 동적 검증 */}
            <div style={{
              ...styles.card,
              borderTop: '4px solid #5B8C5A',
              background: `linear-gradient(180deg, rgba(91,140,90,0.04) 0%, ${FPGA.white} 30%)`,
              display: 'flex', flexDirection: 'column',
            }}>
              <h3 style={{ fontSize: '1.1rem', color: '#5B8C5A', marginBottom: '0.8rem', textAlign: 'left' }}>
                동적 검증 (Dynamic Verification)
              </h3>
              <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: shadow.inset, background: '#FAFBFD', flex: 1 }}>
                <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', height: '100%' }}>
                  <tbody>
                    {[
                      ['방식', 'Testbench로 입력을 인가하여 시뮬레이션'],
                      ['속도', '느림 (수 시간 ~ 수일)'],
                      ['대상', '기능 동작, 타이밍, 프로토콜'],
                      ['도구', 'QuestaSim'],
                      ['발견 가능', '기능 오류, 타이밍 위반, Edge Case'],
                      ['한계', '입력 시나리오에 의존 (완전성 보장 불가)'],
                      ['적용 시점', '설계 완료 후 — 시뮬레이션 환경 구축 필요'],
                      ['인허가 산출물', '커버리지 리포트, 시뮬레이션 파형 기록, V&V 결과서'],
                    ].map(([key, val], i, arr) => (
                      <tr key={i}>
                        <td style={{ padding: '9px 10px', fontWeight: 600, color: '#5B8C5A', width: '100px', verticalAlign: 'top', borderBottom: i < arr.length - 1 ? `1px solid ${FPGA.border}` : 'none', background: 'rgba(91,140,90,0.04)' }}>{key}</td>
                        <td style={{ padding: '9px 10px', color: FPGA.text, borderBottom: i < arr.length - 1 ? `1px solid ${FPGA.border}` : 'none' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 하단 요약 배너 */}
          <div style={{
            width: '100%', padding: '0.6rem 1.4rem',
            background: `linear-gradient(135deg, rgba(74,111,165,0.06), rgba(91,140,90,0.06))`,
            border: `1px solid ${FPGA.border}`, borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem',
            fontSize: '0.82rem', color: FPGA.text,
          }}>
            <span><strong style={{ color: FPGA.primary }}>정적 분석</strong> — 코드 품질 · 구조 결함을 빠르게 제거하는 <strong>첫 번째 방어선</strong></span>
            <span style={{ color: FPGA.border, fontSize: '1.1rem' }}>|</span>
            <span><strong style={{ color: '#5B8C5A' }}>동적 검증</strong> — 실제 동작 시나리오로 <strong>기능 정합성</strong>을 최종 확인</span>
          </div>
        </div>
      </section>

      {/* ── 슬라이드: 검증 기법 전체 맵 ── */}
      <section data-background-color={slideBg}>
        <SlideHeader
          title="FPGA 검증 기법 전체 맵"
          subtitle="Verification Methodology Landscape"
        />

        <div style={styles.grid3}>
          {[
            {
              phase: '1단계',
              title: '정적 분석',
              color: '#4A6FA5',
              items: [
                { name: 'Lint Check', desc: '코딩 규칙 · 합성 가능성' },
                { name: 'CDC Analysis', desc: 'Clock Domain Crossing' },
                { name: 'Design Rule Check', desc: '설계 제약 조건' },
              ],
            },
            {
              phase: '2단계',
              title: '동적 검증',
              color: '#5B8C5A',
              items: [
                { name: 'RTL Simulation', desc: '기능 시뮬레이션' },
                { name: 'Gate-level Sim', desc: '합성 후 시뮬레이션' },
                { name: 'Coverage Analysis', desc: '커버리지 측정' },
              ],
            },
            {
              phase: '3단계',
              title: '형식 검증 / 통합',
              color: '#8B6FA5',
              items: [
                { name: 'Formal Verification', desc: '속성 기반 증명' },
                { name: 'Equivalence Check', desc: 'RTL ↔ Netlist 비교' },
                { name: 'STA', desc: '정적 타이밍 분석' },
              ],
            },
          ].map((phase) => (
            <div key={phase.phase} style={{
              background: `linear-gradient(180deg, ${phase.color}08 0%, ${FPGA.white} 35%)`,
              border: `1px solid ${FPGA.border}`,
              borderTop: `4px solid ${phase.color}`,
              borderRadius: '14px',
              padding: '1.2rem 1.3rem',
              boxShadow: shadow.card,
            }}>
              <div style={{
                fontSize: '0.72rem', fontWeight: 700, color: phase.color,
                letterSpacing: '0.08em', marginBottom: '0.3rem',
              }}>{phase.phase}</div>
              <div style={{
                fontSize: '1.05rem', fontWeight: 700, color: FPGA.dark,
                marginBottom: '0.8rem',
              }}>{phase.title}</div>

              {phase.items.map((item) => (
                <div key={item.name} style={{
                  padding: '0.45rem 0',
                  borderBottom: `1px solid ${FPGA.border}`,
                }}>
                  <div style={{ fontWeight: 600, color: FPGA.text, fontSize: '0.88rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.78rem', color: FPGA.textLight }}>{item.desc}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <p style={{ ...styles.caption, textAlign: 'center', marginTop: '1rem', width: '100%' }}>
          각 단계는 독립적이 아닌 <strong style={{ color: FPGA.primary }}>상호 보완적</strong>으로 적용되어야 합니다.
        </p>
      </section>

      {/* ── 슬라이드: Shift-Left — 실제 데이터 기반 ── */}
      <section data-background-color={slideBg}>
        <SlideHeader
          title="왜 정적 분석을 먼저 하는가?"
          subtitle="Shift-Left Verification Strategy"
        />

        <div style={{ ...styles.grid2, alignItems: 'stretch' }}>
          {/* 왼쪽: 상대 비용 SVG 차트 (NIST 기반) */}
          <div style={{ ...styles.card, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.3rem' }}>
              결함 수정 상대 비용
            </div>
            <div style={{ fontSize: '0.72rem', color: FPGA.textLight, marginBottom: '0.8rem' }}>
              설계 단계 대비 배수 (Relative Cost)
            </div>

            {/* SVG 라인 / 에어리어 차트 */}
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <svg viewBox="0 0 440 370" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#9B2C2C" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#48BB78" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38A169" />
                    <stop offset="50%" stopColor="#ED8936" />
                    <stop offset="100%" stopColor="#9B2C2C" />
                  </linearGradient>
                </defs>

                {/* Y-axis grid lines + labels */}
                {([
                  { v: 0, y: 320 },
                  { v: 10, y: 223 },
                  { v: 20, y: 127 },
                  { v: 30, y: 30 },
                ] as { v: number; y: number }[]).map(({ v, y }) => (
                  <g key={v}>
                    <line x1="50" y1={y} x2="420" y2={y}
                      stroke={v === 0 ? '#CBD5E0' : '#EDF2F7'}
                      strokeWidth={v === 0 ? 1.5 : 1}
                      strokeDasharray={v === 0 ? undefined : '4,3'}
                    />
                    <text x="44" y={y + 4} textAnchor="end" fill="#A0AEC0" fontSize="9" fontFamily="JetBrains Mono, monospace">{v}×</text>
                  </g>
                ))}

                {/* Area fill */}
                <polygon
                  points="50,320 50,310 143,291 235,262 328,233 420,30 420,320"
                  fill="url(#areaGrad)"
                />

                {/* Line */}
                <polyline
                  points="50,310 143,291 235,262 328,233 420,30"
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {/* Data points + value labels */}
                {([
                  { x: 50, y: 310, v: '1×', color: '#38A169' },
                  { x: 143, y: 291, v: '3×', color: '#D69E2E' },
                  { x: 235, y: 262, v: '6×', color: '#DD6B20' },
                  { x: 328, y: 233, v: '9×', color: '#C53030' },
                  { x: 420, y: 30, v: '30×+', color: '#9B2C2C' },
                ] as { x: number; y: number; v: string; color: string }[]).map(pt => (
                  <g key={pt.x}>
                    <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill={pt.color} fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace">{pt.v}</text>
                    <circle cx={pt.x} cy={pt.y} r="6" fill="white" stroke={pt.color} strokeWidth="2" />
                    <circle cx={pt.x} cy={pt.y} r="3" fill={pt.color} />
                  </g>
                ))}

                {/* X-axis labels */}
                {([
                  { x: 50, lines: ['RTL', '설계'] },
                  { x: 143, lines: ['시뮬', '레이션'] },
                  { x: 235, lines: ['합성 후', ''] },
                  { x: 328, lines: ['P&R /', '보드'] },
                  { x: 420, lines: ['현장', '배포 후'] },
                ] as { x: number; lines: string[] }[]).map(item => (
                  <text key={item.x} textAnchor="middle" fill="#4A5568" fontSize="10" fontWeight="600" fontFamily="Pretendard, sans-serif">
                    <tspan x={item.x} y="333">{item.lines[0]}</tspan>
                    {item.lines[1] && <tspan x={item.x} y="345">{item.lines[1]}</tspan>}
                  </text>
                ))}

                {/* 출처 */}
                <text x="50" y="363" fill="#A0AEC0" fontSize="8" fontFamily="JetBrains Mono, monospace">
                  출처: NIST Planning Report 02-3 (2002), IBM Systems Sciences Institute
                </text>
              </svg>
            </div>
          </div>

          {/* 오른쪽: 설명 카드 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InfoCard icon="💡" label="Shift-Left 원칙" variant="highlight">
              <p style={{ margin: 0 }}>
                NIST 연구에 따르면, 설계 단계에서 1의 비용으로 수정 가능한 결함이
                시스템 테스트 단계에서는 <strong style={styles.keyPoint}>최소 9배</strong>,
                현장 배포 후에는 <strong style={styles.keyPoint}>30배 이상</strong>의 비용이 소요됩니다.
              </p>
              <p style={{ margin: '0.6rem 0 0' }}>
                정적 분석은 코드 작성 직후 즉시 실행 가능하므로,
                시뮬레이션 전에 구조적 문제를 제거하는 <strong>첫 번째 방어선</strong> 역할을 합니다.
              </p>
            </InfoCard>

            <InfoCard icon="⚠️" label="Safety-Critical 관점" variant="warning">
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                현장 배포 후 결함 발견 시 안전 사고 또는 임무 실패 등 돌이킬 수 없는 결과로 이어질 수 있습니다.
                검증 단계의 <strong>완전성과 추적성</strong>이 인허가의 핵심입니다.
              </p>
            </InfoCard>

            <div style={{
              fontSize: '0.72rem', color: FPGA.textLight, lineHeight: 1.5,
              padding: '0.5rem 0.8rem',
              background: FPGA.bgAlt,
              borderRadius: '8px',
              border: `1px solid ${FPGA.border}`,
            }}>
              <strong>참고 문헌:</strong><br />
              • NIST Planning Report 02-3, "The Economic Impacts of Inadequate Infrastructure for Software Testing" (2002)<br />
              • B. Boehm, "Software Engineering Economics", Prentice-Hall (1981)
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
