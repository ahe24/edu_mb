'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY11 = '#3D8361';
const MONO = '"JetBrains Mono", monospace';

// ── 같은 6-state safety-critical 시퀀스 컨트롤러를 세 스타일로 ──
const CODE_1 = `localparam IDLE =3'd0, ARM =3'd1, RUN =3'd2,
           HOLD =3'd3, DONE=3'd4, FAULT=3'd5;
reg [2:0] state;
reg armed, active, faulted;

// 단일 클럭 블록 — 상태·천이·출력 모두 한 곳 (★ 출력 등록형)
always @(posedge clk) begin
  armed<=0; active<=0; faulted<=0;       // 출력 기본값
  if (rst) state <= IDLE;
  else case (state)
    IDLE : if (go) state <= ARM;
    ARM  : begin armed<=1;
             if (trip)  state<=FAULT;
             else if (ready) state<=RUN; end
    RUN  : begin armed<=1; active<=1;
             if (trip)  state<=FAULT;
             else if (pause) state<=HOLD;
             else if (eob)   state<=DONE; end
    HOLD : begin armed<=1;
             if (resume) state<=RUN;
             else if (abort) state<=IDLE; end
    DONE :            state <= IDLE;
    FAULT: begin faulted<=1; if (clr) state<=IDLE; end
    default:          state <= FAULT;
  endcase
end
// ★ 출력이 state와 함께 등록 → 1clk 지연 + 천이와 뒤섞여 리뷰 난해`;

const CODE_2 = `localparam IDLE =3'd0, ARM =3'd1, RUN =3'd2,
           HOLD =3'd3, DONE=3'd4, FAULT=3'd5;
reg [2:0] state, next;

// ① 상태 레지스터 — 순차 (동기 active-high reset)
always @(posedge clk)
  if (rst) state <= IDLE;
  else     state <= next;

// ② 다음상태 + 출력 — 한 조합 블록 (★ 출력이 천이와 동거)
always @* begin
  next = state;                          // 기본: 현재 유지
  armed = 0; active = 0; faulted = 0;    // 출력 기본값
  case (state)
    IDLE : if (go) next = ARM;
    ARM  : begin armed=1;
             if (trip) next=FAULT; else if (ready) next=RUN; end
    RUN  : begin armed=1; active=1;
             if (trip) next=FAULT; else if (pause) next=HOLD;
             else if (eob) next=DONE; end
    HOLD : begin armed=1;
             if (resume) next=RUN; else if (abort) next=IDLE; end
    DONE :            next = IDLE;
    FAULT: begin faulted=1; if (clr) next=IDLE; end
    default:          next = FAULT;
  endcase
end
// ★ 천이+출력이 한 블록 → 출력 늘면 case 비대해져 가독성↓`;

const CODE_3 = `localparam IDLE =3'd0, ARM =3'd1, RUN =3'd2,
           HOLD =3'd3, DONE=3'd4, FAULT=3'd5;
reg [2:0] state, next;

// ① 상태 레지스터 — 순차 (동기 active-high reset)
always @(posedge clk)
  if (rst) state <= IDLE;
  else     state <= next;

// ② 다음 상태 — 조합 (모든 분기 + default)
always @* begin
  next = state;                          // 기본: 현재 유지 → latch 방지
  case (state)
    IDLE : if (go)     next = ARM;
    ARM  : if (trip)   next = FAULT;  else if (ready) next = RUN;
    RUN  : if (trip)   next = FAULT;  else if (pause) next = HOLD;
                                      else if (eob)   next = DONE;
    HOLD : if (resume) next = RUN;    else if (abort) next = IDLE;
    DONE :             next = IDLE;       // 자동 복귀
    FAULT: if (clr)    next = IDLE;       // 운전원 리셋
    default:           next = FAULT;      // illegal → 안전상태
  endcase
end

// ③ 출력 — 조합 (Moore, 상태만으로 결정)
always @* begin
  armed   = (state==ARM) | (state==RUN) | (state==HOLD);
  active  = (state==RUN);
  faulted = (state==FAULT);
end`;

const STYLES = [
  {
    key: '1', t: '1-process', n: 'always 1', out: '출력 = 등록형(1clk↓)',
    legend: '단일 클럭 블록 (상태·천이·출력)',
    d: '상태·천이·출력을 한 클럭 블록에. 가장 짧지만 셋이 뒤섞이고 출력이 1clk 지연 → 리뷰·Lint 난해.',
    c: '#7C8DA6', code: CODE_1, reco: false,
  },
  {
    key: '2', t: '2-process', n: 'always 2', out: '출력 = 조합(천이와 동거)',
    legend: '① 상태   ② 천이 + 출력',
    d: '상태 reg + (다음상태·출력) 한 조합 블록. 교과서 표준이나 출력이 늘면 case 블록이 비대.',
    c: '#4A6FA5', code: CODE_2, reco: false,
  },
  {
    key: '3', t: '3-process', n: 'always 3', out: '출력 = 별도 분리',
    legend: '① 상태   ② 천이   ③ 출력',
    d: '상태·천이·출력을 각각의 always로. 한 블록 = 한 책임 → Lint·리뷰·디버깅 최적. safety-critical 권장.',
    c: DAY11, code: CODE_3, reco: true,
  },
];

export default function FsmStyleSlide() {
  const [sel, setSel] = useState('3');
  const cur = STYLES.find((s) => s.key === sel)!;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 2 · 코딩 스타일"
          title="FSM 코딩 스타일 — 1 · 2 · 3-process 구조 비교"
          subtitle="상태·천이·출력의 always 블록 분리 방식"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.28fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 선택된 스타일의 템플릿 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.55rem 0.85rem 0.65rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${cur.c}`,
            display: 'flex', flexDirection: 'column', minHeight: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.62rem', color: cur.c, fontWeight: 800, letterSpacing: '0.04em', fontFamily: MONO }}>
                seq_ctrl.v · 6-state · {cur.t}
              </span>
              <span style={{ fontSize: '0.54rem', color: FPGA.textLight, fontFamily: MONO }}>
                {cur.legend}
              </span>
            </div>
            <VerilogCode key={cur.key} code={cur.code} style={{ fontSize: '0.585rem', lineHeight: 1.4 }} />
          </div>

          {/* 우: 규칙 카드들 (권장 = 3-process 기준) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              {
                t: 'next 사전 대입',
                d: 'always @* 첫 줄에 next=state. 빠뜨린 분기(else 없음)에서도 값이 정의 → latch 방지 (Day 06·09 연결).',
                c: DAY11,
              },
              {
                t: 'full-case + default',
                d: '6개 상태 모두 기술 + default=FAULT. 미사용 인코딩(3비트 → 6/8 사용)까지 안전 복구.',
                c: '#4A6FA5',
              },
              {
                t: '상태 reg만 클럭',
                d: '①만 @(posedge clk). ②다음상태·③출력은 조합. 의도치 않은 FF 추론 방지.',
                c: '#0891B2',
              },
              {
                t: 'Lint·CDC 연결',
                d: 'Questa Lint FSM 규칙 — unreachable/deadlock state·미정의 천이 자동 점검 (Month 1).',
                c: '#8B6FA5',
              },
            ].map((c) => (
              <div key={c.t} style={{
                flex: 1,
                background: `linear-gradient(135deg, ${c.c}07, ${c.c}13)`,
                border: `1px solid ${c.c}28`,
                borderLeft: `4px solid ${c.c}`,
                borderRadius: '9px',
                padding: '0.45rem 0.8rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: c.c, marginBottom: '0.12rem' }}>{c.t}</div>
                <div style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.45 }}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단: 1·2·3-process 클릭 비교 탭 */}
        <div style={{ marginTop: '0.55rem', display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '0.55rem', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 800, color: FPGA.dark, paddingLeft: '0.2rem', lineHeight: 1.3 }}>
            코딩 스타일
            <span style={{ fontSize: '0.54rem', fontWeight: 700, color: DAY11, marginTop: '2px' }}>클릭 → 코드 전환 ▶</span>
          </div>
          {STYLES.map((s) => {
            const on = sel === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSel(s.key)}
                style={{
                  textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                  position: 'relative',
                  background: on
                    ? `linear-gradient(135deg, ${s.c}1A, ${s.c}2E)`
                    : `linear-gradient(135deg, ${s.c}07, ${s.c}10)`,
                  borderRight: `1.5px solid ${s.c}${on ? '88' : '2A'}`,
                  borderBottom: `1.5px solid ${s.c}${on ? '88' : '2A'}`,
                  borderLeft: `1.5px solid ${s.c}${on ? '88' : '2A'}`,
                  borderTop: `3px solid ${s.c}`,
                  borderRadius: '9px', padding: '0.5rem 0.75rem 0.55rem',
                  boxShadow: on ? `0 4px 14px ${s.c}3A` : shadow.card,
                  transform: on ? 'translateY(-2px)' : 'none',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: s.c }}>{s.t}</span>
                  <span style={{ fontSize: '0.54rem', fontWeight: 700, color: '#fff', background: s.c, borderRadius: '4px', padding: '0 6px', fontFamily: MONO }}>{s.n}</span>
                  {on ? (
                    <span style={{ marginLeft: 'auto', fontSize: '0.56rem', fontWeight: 800, color: '#fff', background: s.c, borderRadius: '4px', padding: '1px 7px' }}>
                      {s.reco ? '✓ 권장 · 보는 중' : '● 보는 중'}
                    </span>
                  ) : (
                    <span style={{ marginLeft: 'auto', fontSize: '0.54rem', fontWeight: 700, color: s.c, opacity: 0.7 }}>클릭</span>
                  )}
                </div>
                <div style={{ fontSize: '0.55rem', fontFamily: MONO, color: s.c, fontWeight: 700, marginTop: '2px' }}>{s.out}</div>
                <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.4, marginTop: '2px' }}>{s.d}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
