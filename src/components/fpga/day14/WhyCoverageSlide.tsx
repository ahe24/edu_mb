'use client';

import type { CSSProperties } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY14 = '#0B7285';
const ORANGE = '#E8913A';
const CYAN = '#0891B2';
const RED = '#E53E3E';
const MONO = '"JetBrains Mono", monospace';

// 코드 기호(<=, ==, >=, & 등)가 <div> monospace 에서 ligature 로 합쳐지지 않도록 (전역 CSS 는 pre/code 만 커버)
const noLig: CSSProperties = {
  fontVariantLigatures: 'none',
  fontFeatureSettings: '"liga" 0, "calt" 0',
};

// 코드 라인 색상 역할: c=주석 · n=일반 · m=미검출 강조
const LC: Record<string, string> = { c: '#7C90B0', n: '#C9D4E5', m: '#FF7B72' };

// 하나의 안전 트립 컨트롤러(3중 센서 2oo3 다수결 → 차단·래치)에서
// "정상 운전 시나리오 테스트가 못 밟는" 서로 다른 사각지대 3종.
// 신호명·유형은 Day14 전 슬라이드 공통(trip_top: sensor/vote/state/trip/clear) 과 일치.
const SCENARIOS: { type: string; color: string; grow: number; title: string; code: { t: string; k: string }[]; why: string }[] = [
  {
    type: 'Branch', color: ORANGE, grow: 1,
    title: '위험 감지(WARN 진입) 분기 미실행',
    code: [
      { t: "MONITOR: begin", k: 'n' },
      { t: "  trip  <= 1'b0;  // 평상시 미작동", k: 'n' },
      { t: "  if (vote) state <= WARN;  // 위험→상승", k: 'n' },
      { t: "end", k: 'n' },
      { t: "// 정상 입력 → vote 거짓 → 참 갈래 0%", k: 'm' },
    ],
    why: '정상 입력에선 vote 가 성립하지 않아 MONITOR 의 상승(참) 갈래가 미실행 — 트립으로 향하는 경로 전체가 시험 밖',
  },
  {
    type: 'FSM', color: DAY14, grow: 1.25,
    title: 'WARN·TRIP_S·LATCH 상태 미도달',
    code: [
      { t: "case (state)", k: 'n' },
      { t: "  MONITOR: if (vote) state <= WARN;", k: 'n' },
      { t: "  WARN: if (cnt >= WARN_LIMIT)", k: 'm' },
      { t: "          state <= TRIP_S;   // 미도달", k: 'm' },
      { t: "  TRIP_S: state <= LATCH;    // 미도달", k: 'm' },
      { t: "  LATCH: if (clear) state <= MONITOR;", k: 'm' },
      { t: "endcase", k: 'n' },
    ],
    why: 'vote 가 안 뜨니 WARN·TRIP_S·LATCH 와 그 천이가 통째로 미도달 — 사고 후 래치·복구(clear) 시퀀스 미검증',
  },
  {
    type: 'Condition', color: CYAN, grow: 1.05,
    title: '2oo3 다수결 곱항 미구분',
    code: [
      { t: "// 2oo3 다수결 (3중 센서 sensor[2:0])", k: 'c' },
      { t: "wire vote = (sensor[0] & sensor[1])", k: 'n' },
      { t: "          | (sensor[1] & sensor[2])", k: 'n' },
      { t: "          | (sensor[0] & sensor[2]);", k: 'n' },
      { t: "// sensor=111/000 로만 자극 → 곱항 반전 X", k: 'm' },
    ],
    why: 'sensor 세 비트를 111·000 동일 패턴으로만 자극 → 각 곱항이 독립 반전되지 않아 단일 채널 오검출·다수결 배선 오류 미검증',
  },
];

export default function WhyCoverageSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="개념 · 검증 충분성"
          title="테스트 PASS 는 검증 충분성의 증거가 아님"
          subtitle="정상 시나리오만 시험한 PASS — 정작 중요한 코드는 한 번도 안 돌았을 수 있음"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.3fr 0.85fr', gap: '0.75rem' }}>
          {/* ── 좌: 하나의 트립 컨트롤러에서 정상 시나리오가 못 밟는 사각지대 3종 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '10px', padding: '0 0.15rem',
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark }}>
                안전 트립 컨트롤러 — 정상 운전 테스트가 못 밟는 <span style={{ color: RED }}>사각지대</span>
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: RED, whiteSpace: 'nowrap' }}>
                안 돌린 코드 = 미검증 코드
              </span>
            </div>

            {SCENARIOS.map((s) => (
              <div key={s.type} style={{
                flex: s.grow, minHeight: 0,
                background: FPGA.white, border: `1px solid ${FPGA.border}`,
                borderLeft: `3px solid ${s.color}`,
                borderRadius: '10px', padding: '0.5rem 0.7rem 0.55rem',
                boxShadow: shadow.card, display: 'flex', flexDirection: 'column',
              }}>
                {/* 헤더 — 유형 + 결함 요지 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.56rem', fontWeight: 800, fontFamily: MONO, color: '#fff',
                    background: s.color, borderRadius: '4px', padding: '1px 7px',
                  }}>{s.type}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: FPGA.dark }}>{s.title}</span>
                </div>

                {/* 코드 발췌 (미도달·미실행 라인 강조) */}
                <div style={{
                  flex: 1, minHeight: 0, margin: '0.4rem 0',
                  background: '#0F1626', borderRadius: '7px', padding: '0.4rem 0.6rem',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  overflowX: 'auto', ...noLig,
                }}>
                  {s.code.map((ln, i) => (
                    <div key={i} style={{
                      fontFamily: MONO, fontSize: '0.6rem', lineHeight: 1.55,
                      whiteSpace: 'pre', color: LC[ln.k],
                    }}>{ln.t}</div>
                  ))}
                </div>

                {/* 왜 못 밟나 */}
                <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.4, flexShrink: 0 }}>
                  <span style={{ fontWeight: 800, color: s.color }}>왜 미검출 · </span>{s.why}
                </div>
              </div>
            ))}
          </div>

          {/* ── 우: 커버리지 정의 + V&V 관리 질문 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={{
              flexShrink: 0,
              background: `linear-gradient(135deg, ${DAY14}08, ${DAY14}14)`,
              border: `1px solid ${DAY14}30`, borderLeft: `4px solid ${DAY14}`,
              borderRadius: '10px', padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: DAY14, marginBottom: '0.15rem' }}>
                코드 커버리지 — 정의
              </div>
              <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>
                시뮬레이션이 <strong>설계 코드 각 요소를 실제로 실행한 비율</strong>.
                위 사각지대(미실행·미도달·미구분)를 자동 집계 → <strong>홀 목록</strong>으로 노출.
              </div>
            </div>

            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.6rem 0.8rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.35rem', flexShrink: 0 }}>
                V&amp;V 관리자가 커버리지로 답하는 질문
              </div>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {[
                  ['검증 종료 가능 여부', '목표 커버리지 달성 여부 = 종료 판단 기준'],
                  ['추가 시험 대상', '홀 목록 = 남은 테스트 작업 지시서'],
                  ['테스트 유효성', '추가해도 커버리지 정체 시 중복 테스트'],
                  ['심사 제출물', '커버리지 리포트 · 제외 사유 = 감사 증적'],
                ].map(([q, a], i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    padding: '0.4rem 0',
                    borderBottom: i < 3 ? `1px solid ${FPGA.border}` : 'none',
                  }}>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 800, color: '#fff', background: DAY14,
                      borderRadius: '4px', padding: '1px 6px', flexShrink: 0, fontFamily: MONO,
                    }}>Q{i + 1}</span>
                    <div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: FPGA.dark }}>{q}</span>
                      <span style={{ fontSize: '0.63rem', color: FPGA.textLight }}> — {a}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 — 오늘의 관점 */}
        <div style={{
          marginTop: '0.55rem', flexShrink: 0,
          background: `linear-gradient(135deg, ${ORANGE}08, ${ORANGE}14)`,
          border: `1px solid ${ORANGE}30`, borderRadius: '8px', padding: '0.45rem 0.85rem',
        }}>
          <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#B45309' }}>오늘의 관점 · </span>
          <span style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.45 }}>
            커버리지 = &ldquo;코드 작성 도구&rdquo;가 아닌 <strong>&ldquo;검증 관리·종료 도구&rdquo;</strong> —
            측정 → 홀 보강 → 병합 → 클로저 순환을 실습으로 체득.
          </span>
        </div>
      </div>
    </section>
  );
}
