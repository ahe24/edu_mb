'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Clock · Assignment 핵심 룰 탐색기
 * 탭 기반 인터랙티브 뷰어 — Clock 4개 + Assignment 3개
 */

type RuleKey = 'clock_gated' | 'clock_internal' | 'async_reset_active_high' | 'async_internal_reset' | 'blocking_assign' | 'assigns_mixed' | 'nonblocking_combo';

interface RuleData {
  key: RuleKey;
  ruleId: string;
  category: 'clock' | 'assign';
  categoryLabel: string;
  severity: string;
  sevColor: string;
  title: string;
  do254: string;
  starc?: string;
  customizable: boolean;
  problem: string;
  solution: string;
  fpgaNote?: string;
  code: { text: string; highlight?: boolean; annotate?: string }[];
  directive?: string;
}

const rules: RuleData[] = [
  {
    key: 'clock_gated',
    ruleId: 'clock_gated',
    category: 'clock',
    categoryLabel: 'Clock',
    severity: 'W',
    sevColor: '#E8913A',
    title: '클록 게이팅은 전용 모듈로만',
    do254: 'SS10_avoid_gated_clocks',
    starc: '3.4.1.1, 1.7.1.1',
    customizable: true,
    problem: '클록 게이팅 로직(AND gate, MUX 등)이 전용 게이팅 모듈 외부에 존재하면 클록 트리 합성·타이밍 분석이 복잡해지고 글리치(glitch)가 발생할 수 있습니다.',
    solution: '모든 클록 게이팅 로직을 별도의 clock gating module 내부로 이동. lint preference -clock_gating_module 로 전용 모듈 이름을 등록하면 해당 모듈 내 게이팅은 위반으로 보고하지 않습니다.',
    code: [
      { text: '// BAD: 조합 로직으로 클록 직접 게이팅' },
      { text: 'assign gated_clk = clk & enable;', highlight: true, annotate: 'W: clock_gated — 클록 게이팅이 전용 모듈 외부' },
      { text: 'always @(posedge gated_clk) begin' },
      { text: '  data_reg <= data_in;' },
      { text: 'end' },
      { text: '' },
      { text: '// GOOD: 전용 clock gating cell 또는 모듈 사용' },
      { text: 'clk_gate_cell u_cg (.clk(clk), .en(enable), .gclk(gated_clk));' },
    ],
    directive: 'lint preference -clock_gating_module clk_gate_cell',
  },
  {
    key: 'clock_internal',
    ruleId: 'clock_internal',
    category: 'clock',
    categoryLabel: 'Clock',
    severity: 'W',
    sevColor: '#E8913A',
    title: '내부 생성 클록 사용 주의',
    do254: 'SS11_avoid_internally_generated_clocks',
    starc: '1.4.1.1, 3.3.1.1',
    customizable: false,
    problem: 'FF 출력이나 조합 로직으로 파생된 클록은 셋업·홀드 타이밍 분석이 어렵고 STA(Static Timing Analysis) 도구가 제대로 분석하지 못하는 경우가 발생합니다.',
    solution: '가능한 한 모든 클록은 외부 포트 또는 FPGA 전용 클록 자원(BUFG, MMCM, PLL)에서만 공급. 내부 클록이 불가피한 경우 합성 제약(false path, clock group)을 명시적으로 지정.',
    code: [
      { text: 'reg clk_div2;' },
      { text: 'always @(posedge clk) clk_div2 <= ~clk_div2;', highlight: true, annotate: 'W: clock_internal — FF 출력을 클록으로 사용' },
      { text: '' },
      { text: 'always @(posedge clk_div2) begin  // 내부 클록 사용', highlight: true },
      { text: '  out_reg <= data_in;' },
      { text: 'end' },
      { text: '' },
      { text: '// GOOD: MMCM/PLL primitive 또는 BUFG 사용 권장' },
    ],
  },
  {
    key: 'async_reset_active_high',
    ruleId: 'async_reset_active_high',
    category: 'clock',
    categoryLabel: 'Clock',
    severity: 'I',
    sevColor: '#718096',
    title: '비동기 리셋 극성 — 표준 vs FPGA',
    do254: '(STARC 2.3.6.2)',
    starc: '2.3.6.2',
    customizable: true,
    problem: 'STARC 표준(ASIC 중심)은 비동기 리셋을 active-low로 권장합니다. 파워업 시 전압이 완전히 상승하기 전에 active-high 리셋이 글리치를 일으킬 수 있다는 우려에서입니다.',
    solution: '',
    fpgaNote: '⚠ FPGA(Xilinx) 특이사항: Xilinx 7-Series / UltraScale FPGA는 내부적으로 active-high 리셋 신호를 선호합니다. Xilinx goal(release_xilinx)을 사용하면 이 체크는 자동으로 비활성화되므로 별도 waive 불필요. DO-254 적용 시 active-low 리셋 설계를 유지하거나, Xilinx goal의 자동 조정을 프로젝트 DDP(Design Development Plan)에 명시해야 합니다.',
    code: [
      { text: '// STARC 표준 (ASIC / DO-254): active-low async reset' },
      { text: 'always @(posedge clk or negedge rst_n) begin  // OK' },
      { text: '  if (!rst_n) q <= 0;' },
      { text: '  else        q <= d;' },
      { text: 'end' },
      { text: '' },
      { text: '// Xilinx FPGA 관례: active-high async reset (경고 발생)' },
      { text: 'always @(posedge clk or posedge rst) begin', highlight: true, annotate: 'I: async_reset_active_high — active-high 리셋' },
      { text: '  if (rst) q <= 0;' },
      { text: '  else     q <= d;' },
      { text: 'end' },
    ],
    directive: '# Xilinx goal 사용 시 자동 비활성화\nlint methodology fpga -goal release_xilinx\n# 또는 수동 waive\nlint report item -status waived -check async_reset_active_high -arg reset=rst',
  },
  {
    key: 'async_internal_reset',
    ruleId: 'async_control_is_internal',
    category: 'clock',
    categoryLabel: 'Clock',
    severity: 'W',
    sevColor: '#E8913A',
    title: '내부 생성 비동기 리셋 사용 주의',
    do254: 'SS12_avoid_internally_generated_resets',
    starc: '3.3.1.4, 1.3.2.1, 1.3.2.2',
    customizable: false,
    problem: 'FF 출력이나 조합 논리로 파생된 내부 비동기 리셋/셋 신호는 타이밍 분석이 어렵고, 글리치(glitch)가 리셋 전파 경로에 섞이면 일부 FF만 선택적으로 리셋되는 현상(partial reset)이 발생합니다. Safety-Critical 시스템에서 시스템 전체가 불일치 상태로 진입하는 심각한 결함을 유발합니다.',
    solution: '비동기 리셋은 반드시 외부 포트에서 공급하거나, 전용 리셋 컨트롤러(Power-on-Reset 회로, 감시 타이머 등)를 통해서만 생성합니다. 내부 리셋이 불가피한 경우 동기 리셋으로 대체하고 합성 제약으로 타이밍을 보장합니다.',
    code: [
      { text: 'reg [7:0] cnt;' },
      { text: 'wire internal_rst = (cnt == 8\'hFF);  // 조합 논리로 리셋 생성!', highlight: true, annotate: 'W: async_control_is_internal — 내부 생성 비동기 리셋' },
      { text: '' },
      { text: 'always @(posedge clk or posedge internal_rst) begin', highlight: true },
      { text: '  if (internal_rst) data_reg <= 0;  // 글리치 위험' },
      { text: '  else              data_reg <= data_in;' },
      { text: 'end' },
      { text: '' },
      { text: '// Fix: 외부 포트 리셋 사용 또는 동기 리셋으로 변경' },
      { text: 'always @(posedge clk) begin' },
      { text: '  if (rst_n == 0) data_reg <= 0;  // 동기 리셋 — 글리치 없음' },
      { text: '  else            data_reg <= data_in;' },
      { text: 'end' },
    ],
  },
  {
    key: 'blocking_assign',
    ruleId: 'blocking_assign_in_seq_block',
    category: 'assign',
    categoryLabel: 'Assignment',
    severity: 'E',
    sevColor: '#E53E3E',
    title: 'Sequential 블록에서 blocking(=) 금지',
    do254: 'CP17_assignment_style_verilog_sequential_blocks',
    starc: '2.3.1.1',
    customizable: false,
    problem: 'clk 엣지 민감도 리스트를 가진 always 블록(sequential)에서 blocking 할당(=)을 사용하면 동일 delta 사이클 내 신호 전파 순서에 따라 시뮬레이션 결과가 달라집니다. 합성 후 회로는 non-blocking 동작을 수행하므로 Pre/Post 시뮬레이션 불일치가 발생합니다.',
    solution: 'Sequential always 블록 내 모든 할당을 non-blocking(<=)으로 변경. Combinational always 블록에서는 반드시 blocking(=)을 사용.',
    code: [
      { text: 'always @(posedge clk or negedge rst_n) begin' },
      { text: '  if (!rst_n) begin' },
      { text: '    result = 8\'h00;', highlight: true, annotate: 'E: blocking = in sequential always' },
      { text: '  end else begin' },
      { text: '    case (opcode)' },
      { text: '      4\'h1: result = 8\'hAA;', highlight: true },
      { text: '      4\'h2: result = 8\'hFF;', highlight: true },
      { text: '    endcase' },
      { text: '  end' },
      { text: 'end' },
      { text: '// Fix: result = ... → result <= ...' },
    ],
  },
  {
    key: 'assigns_mixed',
    ruleId: 'assigns_mixed / assigns_mixed_in_always_block',
    category: 'assign',
    categoryLabel: 'Assignment',
    severity: 'W',
    sevColor: '#E8913A',
    title: '동일 신호에 blocking/non-blocking 혼용 금지',
    do254: 'CP18_mixed_blocking_nonblocking',
    starc: '2.2.3.1, 2.3.2.2',
    customizable: false,
    problem: '동일한 신호(변수)에 blocking(=)과 non-blocking(<=)이 혼용되면, 어느 할당이 더 나중에 적용될지 시뮬레이터마다 다르게 해석될 수 있습니다. 합성 결과와 시뮬레이션 결과가 반드시 일치하지 않습니다.',
    solution: '한 신호에 대한 모든 할당을 동일한 스타일(blocking 또는 non-blocking)로 통일. Sequential 신호 → 항상 <=, Combinational 로컬 변수 → 항상 =.',
    code: [
      { text: 'always @(*) begin' },
      { text: '  out[1] =  in[0];   // blocking', highlight: true },
      { text: '  out[1] <= in[1];   // non-blocking 혼용!', highlight: true, annotate: 'W: assigns_mixed — 동일 신호 혼용' },
      { text: 'end' },
      { text: '' },
      { text: '// Fix: combinational → 모두 blocking(=) 사용' },
      { text: 'always @(*) begin' },
      { text: '  out[1] = in[0];' },
      { text: '  // or use separate always for each' },
      { text: 'end' },
    ],
  },
  {
    key: 'nonblocking_combo',
    ruleId: 'nonblocking_assign_in_combo_block',
    category: 'assign',
    categoryLabel: 'Assignment',
    severity: 'E',
    sevColor: '#E53E3E',
    title: 'Combinational 블록에서 non-blocking(<=) 금지',
    do254: 'CP15_nonblocking_assign_combo_block',
    customizable: false,
    problem: '조합 논리(always @(*) 또는 always_comb)에서 non-blocking 할당(<=)을 사용하면, 해당 사이클의 입력 변화가 같은 delta 사이클 내 출력에 반영되지 않아 무한 루프나 의도치 않은 레지스터가 생성될 수 있습니다.',
    solution: 'Combinational always 블록에서는 반드시 blocking(=)을 사용. 경계가 모호하다면 always_comb / always_ff 키워드(SystemVerilog)로 명시적으로 구분.',
    code: [
      { text: 'always @(*) begin  // Combinational' },
      { text: '  if (sel)' },
      { text: '    y <= a;', highlight: true, annotate: 'E: nonblocking_assign_in_combo_block' },
      { text: '  else' },
      { text: '    y <= b;', highlight: true },
      { text: 'end' },
      { text: '' },
      { text: '// Fix: <= → =' },
      { text: 'always @(*) begin' },
      { text: '  y = sel ? a : b;  // blocking OK' },
      { text: 'end' },
    ],
  },
];

const categories = [
  { key: 'clock' as const, label: 'Clock', color: '#4A6FA5', icon: '⏱' },
  { key: 'assign' as const, label: 'Assignment', color: '#E53E3E', icon: '✍' },
];

export default function ClockAssignRulesSlide() {
  const [activeCat, setActiveCat] = useState<'clock' | 'assign'>('clock');
  const [activeRule, setActiveRule] = useState<RuleKey>('clock_gated');

  const catRules = rules.filter((r) => r.category === activeCat);
  const currentRule = rules.find((r) => r.key === activeRule) ?? rules[0];
  const catColor = categories.find((c) => c.key === activeCat)?.color ?? FPGA.primary;

  const handleCatSwitch = (cat: 'clock' | 'assign') => {
    setActiveCat(cat);
    const firstRule = rules.find((r) => r.category === cat);
    if (firstRule) setActiveRule(firstRule.key);
  };

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Rule Explorer · 1/2"
          title="Clock · Assignment 핵심 룰"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {/* 카테고리 탭 */}
          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCatSwitch(cat.key)}
                style={{
                  padding: '0.32rem 1.1rem',
                  borderRadius: '7px',
                  border: activeCat === cat.key ? `2px solid ${cat.color}` : `1px solid ${FPGA.border}`,
                  background: activeCat === cat.key
                    ? `linear-gradient(135deg, ${cat.color}14, ${cat.color}22)`
                    : FPGA.white,
                  color: activeCat === cat.key ? cat.color : FPGA.textLight,
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: activeCat === cat.key ? shadow.card : 'none',
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ background: '#E53E3E18', color: '#E53E3E', border: '1px solid #E53E3E40', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.6rem' }}>E Error</span>
              <span style={{ background: '#E8913A18', color: '#E8913A', border: '1px solid #E8913A40', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.6rem' }}>W Warning</span>
              <span style={{ background: '#71809618', color: '#718096', border: '1px solid #71809640', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.6rem' }}>I Info</span>
              <span style={{ background: '#E8913A12', color: '#E8913A', border: '1px solid #E8913A30', padding: '1px 5px', borderRadius: '4px', fontWeight: 700, fontSize: '0.58rem' }}>⚙ 설정가능</span>
            </div>
          </div>

          {/* 룰 선택 탭 + 상세 패널 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '0.6rem', alignItems: 'stretch' }}>
            {/* 룰 목록 */}
            <div style={{ width: '218px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
              {catRules.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setActiveRule(r.key)}
                  style={{
                    textAlign: 'left',
                    padding: '0.38rem 0.65rem',
                    borderRadius: '9px',
                    border: activeRule === r.key ? `2px solid ${catColor}` : `1px solid ${FPGA.border}`,
                    background: activeRule === r.key
                      ? `linear-gradient(135deg, ${catColor}10, ${catColor}18)`
                      : FPGA.white,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: activeRule === r.key ? shadow.card : '0 1px 3px rgba(0,0,0,0.05)',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                    <span style={{
                      width: '18px', height: '18px', borderRadius: '4px',
                      background: `${r.sevColor}18`, border: `1.5px solid ${r.sevColor}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.58rem', fontWeight: 800, color: r.sevColor, flexShrink: 0,
                    }}>{r.severity}</span>
                    {r.customizable && (
                      <span style={{
                        fontSize: '0.52rem', fontWeight: 700, color: '#E8913A',
                        background: '#E8913A12', border: '1px solid #E8913A30',
                        padding: '1px 3px', borderRadius: '3px',
                      }}>⚙</span>
                    )}
                  </div>
                  <code style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.58rem',
                    color: activeRule === r.key ? catColor : FPGA.text,
                    fontWeight: activeRule === r.key ? 700 : 400,
                    display: 'block',
                    marginBottom: '1px',
                    wordBreak: 'break-all',
                  }}>{r.ruleId}</code>
                  <div style={{ fontSize: '0.6rem', color: FPGA.textLight, lineHeight: 1.25 }}>
                    {r.title}
                  </div>
                </button>
              ))}
            </div>

            {/* 룰 상세 패널 */}
            <div style={{
              flex: 1,
              background: FPGA.white,
              border: `1.5px solid ${catColor}25`,
              borderRadius: '13px',
              padding: '0.75rem 0.9rem',
              boxShadow: shadow.card,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.38rem',
              overflowY: 'auto',
            }}>
              {/* 룰 헤더 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', flexShrink: 0 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px', flexWrap: 'wrap' }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '5px',
                      background: `${currentRule.sevColor}18`, border: `2px solid ${currentRule.sevColor}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 800, color: currentRule.sevColor, flexShrink: 0,
                    }}>{currentRule.severity}</span>
                    <code style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.7rem', fontWeight: 700,
                      color: catColor,
                    }}>{currentRule.ruleId}</code>
                    {currentRule.customizable && (
                      <span style={{
                        fontSize: '0.58rem', fontWeight: 700, color: '#E8913A',
                        background: '#E8913A12', border: '1px solid #E8913A30',
                        padding: '1px 6px', borderRadius: '4px',
                      }}>⚙ 설정 가능</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: FPGA.dark }}>
                    {currentRule.title}
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  {currentRule.do254 && (
                    <div style={{
                      fontSize: '0.55rem', fontWeight: 700, color: '#8B6FA5',
                      background: '#8B6FA512', border: '1px solid #8B6FA530',
                      padding: '2px 6px', borderRadius: '4px', marginBottom: '3px',
                    }}>DO-254: {currentRule.do254}</div>
                  )}
                  {currentRule.starc && (
                    <div style={{
                      fontSize: '0.55rem', fontWeight: 600, color: FPGA.textLight,
                      background: '#F0F4F8', border: '1px solid #E2E8F0',
                      padding: '2px 6px', borderRadius: '4px',
                    }}>STARC: {currentRule.starc}</div>
                  )}
                </div>
              </div>

              {/* Problem */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '0.63rem', fontWeight: 700, color: '#E53E3E', marginBottom: '2px', letterSpacing: '0.05em' }}>PROBLEM</div>
                <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5, background: '#FFF5F5', border: '1px solid #E53E3E18', borderRadius: '6px', padding: '0.32rem 0.55rem' }}>
                  {currentRule.problem}
                </div>
              </div>

              {/* FPGA Note (async_reset_active_high 전용) */}
              {currentRule.fpgaNote && (
                <div style={{
                  fontSize: '0.64rem', color: '#2B4570', lineHeight: 1.5, flexShrink: 0,
                  background: 'rgba(232,145,58,0.08)', border: '1px solid rgba(232,145,58,0.35)',
                  borderRadius: '6px', padding: '0.32rem 0.55rem',
                }}>
                  {currentRule.fpgaNote}
                </div>
              )}

              {/* Solution */}
              {currentRule.solution && (
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '0.63rem', fontWeight: 700, color: '#48BB78', marginBottom: '2px', letterSpacing: '0.05em' }}>SOLUTION</div>
                  <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5, background: '#F0FFF4', border: '1px solid #48BB7820', borderRadius: '6px', padding: '0.32rem 0.55rem' }}>
                    {currentRule.solution}
                  </div>
                </div>
              )}

              {/* 코드 예제 + Directive */}
              <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minHeight: 0, alignItems: 'stretch' }}>
                {/* 코드 */}
                <div style={{
                  flex: 1,
                  background: '#1A2235',
                  borderRadius: '7px',
                  padding: '0.45rem 0.65rem',
                  fontFamily: '"Roboto Mono", "Courier New", monospace',
                  fontSize: '0.58rem',
                  lineHeight: 1.52,
                  overflow: 'auto',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                }}>
                  {currentRule.code.map((line, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <span style={{
                        color: line.highlight ? '#FFD080' : '#A8C0D8',
                        background: line.highlight ? 'rgba(255,208,128,0.08)' : 'transparent',
                        display: 'block',
                        whiteSpace: 'pre',
                        paddingRight: line.annotate ? '4px' : '0',
                      }}>
                        {line.text || '\u00A0'}
                      </span>
                      {line.annotate && (
                        <span style={{
                          display: 'block',
                          color: currentRule.sevColor,
                          fontSize: '0.52rem',
                          paddingLeft: '1rem',
                          opacity: 0.9,
                          whiteSpace: 'pre',
                        }}>
                          // {line.annotate}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Directive (설정 가능한 경우) */}
                {currentRule.directive && (
                  <div style={{
                    width: '300px',
                    flexShrink: 0,
                    background: 'rgba(232,145,58,0.06)',
                    border: '1px solid rgba(232,145,58,0.30)',
                    borderRadius: '7px',
                    padding: '0.5rem 0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#E8913A', letterSpacing: '0.05em' }}>
                      ⚙ CUSTOMIZATION
                    </div>
                    <pre style={{
                      margin: 0,
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.56rem',
                      color: FPGA.text,
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}>{currentRule.directive}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
