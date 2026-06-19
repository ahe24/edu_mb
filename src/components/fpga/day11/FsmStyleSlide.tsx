'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY11 = '#3D8361';

const tmplCode = `localparam IDLE=2'd0, RUN=2'd1, DONE=2'd2;
reg [1:0] state, next;

// ① 상태 레지스터 — 순차 (동기 active-high)
always @(posedge clk)
  if (rst) state <= IDLE;
  else     state <= next;

// ② 다음 상태 — 조합 (모든 분기 + default)
always @* begin
  next = state;                  // 기본: 현재 유지
  case (state)
    IDLE: if (go)   next = RUN;
    RUN:  if (fin)  next = DONE;
    DONE:           next = IDLE;
    default:        next = IDLE; // illegal → 안전 복구
  endcase
end

// ③ 출력 — 조합 (Moore)
always @* begin
  busy = (state == RUN);
end`;

export default function FsmStyleSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 2 · 코딩 스타일"
          title="2-process 템플릿 — 외워서 쓰는 안전한 골격"
          subtitle="상태 reg / 다음상태 / 출력을 분리 · next 사전대입 + default로 latch·illegal 모두 차단"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 템플릿 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.6rem 0.85rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY11}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY11, fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
              FSM 표준 템플릿
            </div>
            <VerilogCode code={tmplCode} style={{ fontSize: '0.63rem', lineHeight: 1.45 }} />
          </div>

          {/* 우: 규칙 카드들 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              {
                t: 'next 사전 대입',
                d: 'always @* 첫 줄에 next=state. 빠뜨린 분기에서도 값이 정의 → latch 방지 (Day 06·09 연결).',
                c: DAY11,
              },
              {
                t: 'full-case + default',
                d: '모든 상태 case 기술 + default=안전 상태. 미사용 인코딩까지 커버.',
                c: '#4A6FA5',
              },
              {
                t: '상태 reg만 클럭',
                d: '①만 @(posedge clk). 다음상태·출력은 조합. 의도치 않은 FF 추론 방지.',
                c: '#0891B2',
              },
              {
                t: 'Lint 연결',
                d: 'Questa Lint FSM 규칙 — unreachable/deadlock state, 미정의 천이 자동 점검 (Month 1).',
                c: '#8B6FA5',
              },
            ].map((c) => (
              <div key={c.t} style={{
                background: `linear-gradient(135deg, ${c.c}07, ${c.c}13)`,
                border: `1px solid ${c.c}28`,
                borderLeft: `4px solid ${c.c}`,
                borderRadius: '9px',
                padding: '0.5rem 0.8rem',
                boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: c.c, marginBottom: '0.1rem' }}>{c.t}</div>
                <div style={{ fontSize: '0.65rem', color: FPGA.text, lineHeight: 1.5 }}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
