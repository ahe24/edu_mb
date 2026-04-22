'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * lint preference 심화 슬라이드
 * 카테고리별 preference 명령과 코드 before/after 예시
 */

type CatKey = 'name' | 'reset' | 'clock' | 'case' | 'flop';

type PrefItem = {
  cat: CatKey;
  cmd: string;
  purpose: string;
  codeBefore: string;
  codeAfter: string;
  note: string;
};

const items: PrefItem[] = [
  {
    cat: 'name',
    cmd: 'lint preference name\n  -check inst_name_not_standard\n  -disallow_mix_case\n  -regexp {^[^_].*}',
    purpose: '인스턴스 이름 규칙 — 대소문자 혼용·앞 _ 금지',
    codeBefore: `// 위반 후보
ALU u_Alu_0 (...);
ALU _alu1 (...);
ALU myAlu_unit (...);`,
    codeAfter: `// 준수
ALU u_alu_0 (...);
ALU alu_1 (...);
ALU my_alu_unit (...);`,
    note: '팀 표준 네이밍(u_*, lowercase snake_case) 강제. 프로젝트 시작 시 고정.',
  },
  {
    cat: 'reset',
    cmd: 'lint preference\n  -check flop_without_control\n  -valid_flop_controls async_reset sync_reset initial_value',
    purpose: 'Xilinx: flop 유효 제어 타입 명시 (initial 허용)',
    codeBefore: `// initial 없고 reset 없으면 위반
reg [7:0] cnt;
always @(posedge clk)
  cnt <= cnt + 1'b1;`,
    codeAfter: `// 3가지 중 하나 필수
reg [7:0] cnt = 8'h00;     // initial_value OK
// or sync_reset in body
// or async_reset sensitivity`,
    note: 'Xilinx FPGA는 bitstream에 initial 값 포함 가능 → ASIC과 허용 기준 다름.',
  },
  {
    cat: 'clock',
    cmd: 'lint preference\n  -clock_gating_module clk_gate_cell\n  -clock_gating_module bufgce_wrapper',
    purpose: '지정 모듈 내부 게이팅은 위반 미보고',
    codeBefore: `// 위반: clock_gated 보고됨
always @(*)
  gated_clk = clk & enable;
// 이 gated_clk을 FF에 연결`,
    codeAfter: `// clk_gate_cell 내부로 이동
clk_gate_cell u_cg (
  .clk_i(clk), .en(enable),
  .clk_o(gated_clk)
);
// 모듈 외부엔 위반 없음`,
    note: '게이팅 전용 셀로 캡슐화. 여러 벤더 셀(BUFGCE 래퍼 등) 동시 등록 가능.',
  },
  {
    cat: 'case',
    cmd: 'lint preference\n  -check case_default_missing\n  -missing_others_or_default',
    purpose: 'exhaustive case — unique 키워드로 완전성 선언',
    codeBefore: `// default 없이 모든 2-bit case 나열
case (sel)
  2'b00: y = a;
  2'b01: y = b;
  2'b10: y = c;
  2'b11: y = d;
endcase  // ← 위반 (default 미존재)`,
    codeAfter: `// ✓ SystemVerilog unique case
unique case (sel)
  2'b00: y = a;
  2'b01: y = b;
  2'b10: y = c;
  2'b11: y = d;
endcase
// 매치 실패 시 시뮬 자동 assertion`,
    note: '맹목적 default 추가는 커버리지 hole 유발(도달 불가능 branch). unique case는 합성·커버리지·lint 모두 완전성 인지. enum 결합이 최선.',
  },
  {
    cat: 'case',
    cmd: '// coverage off  ...  // coverage on\n또는\ncoverage exclude -src file.v -lines N',
    purpose: '방어 default 필수 — 커버리지 제외 + 근거',
    codeBefore: `// 방어 default 추가했으나
// 도달 불가능 → coverage hole
case (sel)
  2'b00: y = a; 2'b01: y = b;
  2'b10: y = c; 2'b11: y = d;
  default: y = 1'b0;
endcase`,
    codeAfter: `case (sel)
  2'b00: y = a; 2'b01: y = b;
  2'b10: y = c; 2'b11: y = d;
  // coverage off
  default: y = 1'b0;  // X-prop 방어
  // coverage on
endcase`,
    note: 'X-propagation·글리치 방어 목적으로 default 유지 필요 시 coverage 제외. Day 04 waiver 철학 — REASON 주석 필수.',
  },
  {
    cat: 'case',
    cmd: '// FSM state에 enum + unique case 결합',
    purpose: 'enum + unique — 정적 exhaustiveness 보증',
    codeBefore: `// 숫자 리터럴 — 타입 안정성 약함
reg [1:0] state;
case (state)
  2'b00: ...   2'b01: ...
  // 2'b10/11 누락해도 에러 없음
endcase`,
    codeAfter: `typedef enum logic [1:0] {
  S_IDLE, S_RUN, S_WAIT, S_DONE} state_t;
state_t state;
unique case (state)
  S_IDLE: ...   S_RUN : ...
  S_WAIT: ...   S_DONE: ...
endcase`,
    note: 'enum 누락 시 컴파일 단계에서 warning, unique가 런타임 보증. FSM safety 체크와도 호환 — safety-critical 최적 패턴.',
  },
  {
    cat: 'flop',
    cmd: 'lint preference\n  -check latch_inferred\n  -report_latches_in_always_latch_blocks',
    purpose: 'always_latch 블록도 latch 위반으로 보고',
    codeBefore: `// always_latch: 의도 선언이지만
// FPGA 구현상 비권장
always_latch begin
  if (en) q = d;
end`,
    codeAfter: `// FF 기반 래칭으로 변경
always_ff @(posedge clk)
  if (en) q <= d;`,
    note: 'FPGA엔 전용 래치 프리미티브 없음 → FF + enable 권장.',
  },
  {
    cat: 'flop',
    cmd: 'lint preference\n  -combo_loop_bit_wise\n  -combo_loop_nodes 64',
    purpose: '비트 단위 루프 검출 + 리포트 노드 상한 확장',
    codeBefore: `// 벡터 일부 비트만 루프 — 기본 모드는 놓침
assign y[3:0] = a[3:0];
assign y[7:4] = y[3:0] | b[7:4];
// → y[7:4]만 루프, 기본 분석은 감지 실패 가능`,
    codeAfter: `// -combo_loop_bit_wise → 비트별 분해 분석
// -combo_loop_nodes 64 → 리포트 경로 노드 상한
// 필요 시 FF 삽입으로 분리
always_ff @(posedge clk)
  y_reg[7:4] <= y_reg[3:0] | b[7:4];`,
    note: '계층 전반의 루프는 기본 분석으로도 검출됨. 비트별 정밀도와 리포트 상한 조정이 실질적인 튜닝 포인트.',
  },
];

const categories: { key: CatKey; label: string; color: string; count: number; audit: string; apply: string }[] = [
  {
    key: 'name', label: 'Naming', color: '#4A6FA5',
    count: items.filter(x => x.cat === 'name').length,
    audit: '감사 관점: 네이밍 일관성은 추적성(traceability) 직접 영향 — DR↔RTL 매핑 자동화 전제.',
    apply: '적용 포인트: 프로젝트 kick-off 시 고정. 후반 도입은 대규모 리네임 PR 발생.',
  },
  {
    key: 'reset', label: 'Reset', color: '#E8913A',
    count: items.filter(x => x.cat === 'reset').length,
    audit: '감사 관점: reset 전략 일관성은 power-up 안전성 증빙 핵심 — DAL-A는 모든 FF 검토 필수.',
    apply: '적용 포인트: Xilinx는 initial 허용·ASIC은 금지. SoC라면 모듈별 분리 정책.',
  },
  {
    key: 'clock', label: 'Clock', color: '#E53E3E',
    count: items.filter(x => x.cat === 'clock').length,
    audit: '감사 관점: 게이팅·도메인 교차는 metastability 위험 → CDC 검증과 페어로 증빙.',
    apply: '적용 포인트: 게이팅 전용 셀 캡슐화 후 모듈명 등록. 벤더 셀 다수 시 일괄 등록.',
  },
  {
    key: 'case', label: 'Case/FSM', color: '#8B6FA5',
    count: items.filter(x => x.cat === 'case').length,
    audit: '감사 관점: case 완전성 누락 → latch 추론 → 정의되지 않은 상태 도달 가능. FSM safety 직결.',
    apply: '적용 포인트: enum + unique 우선. 방어 default는 coverage 제외 + REASON 필수.',
  },
  {
    key: 'flop', label: 'Flop/Combo', color: '#5B8C5A',
    count: items.filter(x => x.cat === 'flop').length,
    audit: '감사 관점: 의도하지 않은 latch·조합 루프는 timing 미수렴 + 합성 결과 불일치 위험.',
    apply: '적용 포인트: always_ff/_latch 명시화. 계층 경계 루프 검출은 top-level lint 필수.',
  },
];

export default function PreferenceDeepDiveSlide() {
  const [active, setActive] = useState<CatKey>('name');
  const visible = items.filter(x => x.cat === active);
  const activeCat = categories.find(c => c.key === active)!;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="lint preference"
          title="체크 동작 정밀 조정"
          subtitle="카테고리별 핵심 옵션 · Before / After 코드 대비"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {/* 카테고리 탭 */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {categories.map(c => {
              const on = c.key === active;
              return (
                <button key={c.key} onClick={() => setActive(c.key)} style={{
                  flex: 1, cursor: 'pointer',
                  border: on ? `1.5px solid ${c.color}` : `1px solid ${FPGA.border}`,
                  borderBottom: on ? `3px solid ${c.color}` : `1px solid ${FPGA.border}`,
                  background: on ? `${c.color}10` : FPGA.white,
                  borderRadius: '7px 7px 5px 5px',
                  padding: '0.3rem 0.55rem',
                  boxShadow: on ? `0 2px 8px ${c.color}22` : '0 1px 3px rgba(0,0,0,0.04)',
                  transform: on ? 'translateY(-1px)' : 'none',
                  transition: 'all 0.15s ease',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '0.76rem', fontWeight: 800,
                    color: on ? c.color : FPGA.dark, lineHeight: 1.15,
                  }}>{c.label}</div>
                  <div style={{
                    fontSize: '0.56rem', color: on ? c.color : FPGA.textLight,
                    opacity: 0.75, marginTop: '1px',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}>
                    {c.count} {c.count === 1 ? 'rule' : 'rules'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 예제 카드들 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'stretch' }}>
            {visible.map((p, i) => {
              const color = categories.find(c => c.key === p.cat)!.color;
              return (
                <div key={i} style={{
                  background: FPGA.white,
                  border: `1px solid ${color}22`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: '9px',
                  padding: '0.4rem 0.6rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  display: 'flex', gap: '0.55rem',
                  flex: 1, minHeight: 0,
                }}>
                  {/* 좌: 명령 + 목적 */}
                  <div style={{ flex: '0 0 230px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <pre style={{
                      margin: '0 0 0.25rem',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.56rem',
                      color: '#A8D8A8',
                      background: '#1A2235',
                      borderRadius: '4px',
                      padding: '0.28rem 0.45rem',
                      lineHeight: 1.4,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}>{p.cmd}</pre>
                    <div style={{ fontSize: '0.62rem', fontWeight: 700, color: FPGA.dark, lineHeight: 1.35 }}>
                      {p.purpose}
                    </div>
                    <div style={{ fontSize: '0.56rem', color: FPGA.textLight, marginTop: '0.15rem', lineHeight: 1.4 }}>
                      {p.note}
                    </div>
                  </div>

                  {/* 중: before */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      fontSize: '0.56rem', fontWeight: 700,
                      color: '#E53E3E', marginBottom: '0.15rem',
                      fontFamily: '"JetBrains Mono", monospace',
                      letterSpacing: '0.06em',
                    }}>✗ BEFORE</div>
                    <pre style={{
                      margin: 0,
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.56rem',
                      color: '#2D3748',
                      background: 'rgba(229,62,62,0.06)',
                      border: '1px solid rgba(229,62,62,0.18)',
                      borderRadius: '4px',
                      padding: '0.28rem 0.45rem',
                      lineHeight: 1.4,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      flex: 1,
                    }}>{p.codeBefore}</pre>
                  </div>

                  {/* 우: after */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      fontSize: '0.56rem', fontWeight: 700,
                      color: '#48BB78', marginBottom: '0.15rem',
                      fontFamily: '"JetBrains Mono", monospace',
                      letterSpacing: '0.06em',
                    }}>✓ AFTER</div>
                    <pre style={{
                      margin: 0,
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.56rem',
                      color: '#2D3748',
                      background: 'rgba(72,187,120,0.06)',
                      border: '1px solid rgba(72,187,120,0.20)',
                      borderRadius: '4px',
                      padding: '0.28rem 0.45rem',
                      lineHeight: 1.4,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      flex: 1,
                    }}>{p.codeAfter}</pre>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 카테고리별 감사 관점 / 적용 포인트 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.4rem',
            flexShrink: 0,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${activeCat.color}08, ${activeCat.color}14)`,
              border: `1px solid ${activeCat.color}30`,
              borderLeft: `3px solid ${activeCat.color}`,
              borderRadius: '8px',
              padding: '0.4rem 0.7rem',
            }}>
              <div style={{
                fontSize: '0.6rem', fontWeight: 800,
                color: activeCat.color, letterSpacing: '0.06em',
                fontFamily: '"JetBrains Mono", monospace',
                marginBottom: '0.15rem',
              }}>▸ AUDIT</div>
              <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.45 }}>
                {activeCat.audit}
              </div>
            </div>
            <div style={{
              background: 'rgba(74,111,165,0.05)',
              border: `1px solid ${FPGA.border}`,
              borderLeft: `3px solid ${FPGA.primary}`,
              borderRadius: '8px',
              padding: '0.4rem 0.7rem',
            }}>
              <div style={{
                fontSize: '0.6rem', fontWeight: 800,
                color: FPGA.primary, letterSpacing: '0.06em',
                fontFamily: '"JetBrains Mono", monospace',
                marginBottom: '0.15rem',
              }}>▸ APPLY</div>
              <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.45 }}>
                {activeCat.apply}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
