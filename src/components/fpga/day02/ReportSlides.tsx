'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Day 02 — Lint 결과 리포트 해석 슬라이드 (2 slides)
 * Slide 1: 인터랙티브 4-카테고리 뷰어 (Syntactic / Semantic / Structural / Stylistic)
 * Slide 2: [Placeholder] Questa Lint GUI 리포트 화면 캡처
 */

type Category = 'syntactic' | 'semantic' | 'structural' | 'stylistic';

interface CategoryData {
  key: Category;
  label: string;
  labelKo: string;
  color: string;
  severity: string;
  severityColor: string;
  description: string;
  ruleId: string;
  ruleName: string;
  file: string;
  codeLines: { text: string; highlight?: boolean; annotate?: string }[];
  detail: string;
  howToFix: string;
}

const categories: CategoryData[] = [
  {
    key: 'syntactic',
    label: 'Syntactic',
    labelKo: '구문 검사',
    color: FPGA.danger,
    severity: 'ERROR',
    severityColor: FPGA.danger,
    description: '문법적으로 유효하지만 시뮬레이션·합성 불일치를 유발하는 코드 패턴을 검출합니다. Sequential always 블록에 blocking 할당을 사용하면 시뮬레이터와 합성 결과가 달라질 수 있습니다.',
    ruleId: 'blocking_assign_in_seq_block',
    ruleName: 'blocking_assign_in_seq_block',
    file: 'ctrl_logic.v',
    codeLines: [
      { text: "always @(posedge clk or negedge rst_n) begin" },
      { text: "    if (!rst_n)" },
      { text: "        result = 8'h00;", highlight: true, annotate: "ERROR: blocking = in sequential always block" },
      { text: "    else begin" },
      { text: "        case (opcode)" },
      { text: "            4'h1: result = 8'hAA;", highlight: true },
      { text: "            4'h2: result = 8'hFF;", highlight: true },
      { text: "        endcase" },
      { text: "    end" },
      { text: "end" },
    ],
    detail: "Sequential always 블록(clk 엣지 민감도 리스트)에서 blocking 할당(=)을 사용하면 동일 delta 사이클 내 신호 전파 순서에 따라 시뮬레이션 결과가 달라집니다. Safety-Critical 설계에서는 항상 non-blocking 할당(<=)을 사용해야 합니다.",
    howToFix: "result = ... → result <= ...  (모든 sequential always 내 할당을 <=로 변경)",
  },
  {
    key: 'semantic',
    label: 'Semantic',
    labelKo: '의미 검사',
    color: FPGA.accent,
    severity: 'INFO',
    severityColor: FPGA.accent,
    description: '문법·구조적으로 올바르지만 논리적으로 의미 없는 신호를 검출합니다. 쓰기만 하고 읽지 않는 레지스터는 죽은 로직(dead logic)으로, 코드 의도 오류 또는 불필요한 하드웨어를 나타냅니다.',
    ruleId: 'var_set_not_read',
    ruleName: 'var_set_not_read',
    file: 'ctrl_logic.v',
    codeLines: [
      { text: "// status records opcode each cycle -- but never read" },
      { text: "reg [7:0] status;" },
      { text: "always @(posedge clk or negedge rst_n) begin" },
      { text: "    if (!rst_n)" },
      { text: "        status <= 8'h00;" },
      { text: "    else" },
      { text: "        status <= {4'h0, opcode};", highlight: true, annotate: "INFO: 'status' is set but never read" },
      { text: "end" },
    ],
    detail: "'status' 레지스터는 매 클록마다 opcode 값을 저장하지만, 이 값을 읽는 다운스트림 로직이 전혀 없습니다. Questa Lint는 이런 dead register를 검출합니다. 설계 오류이거나 디버그용으로 남겨진 코드일 수 있습니다.",
    howToFix: "status를 실제 로직에서 활용하거나, 필요 없으면 해당 always 블록 전체 제거",
  },
  {
    key: 'structural',
    label: 'Structural',
    labelKo: '구조 검사',
    color: '#8B6FA5',
    severity: 'WARNING',
    severityColor: '#8B6FA5',
    description: '설계 구조상의 문제(래치 추론, undriven/unloaded 신호, 다중 드라이버 등)를 검출합니다. FPGA에서 의도치 않은 래치 추론은 타이밍 분석 실패와 기능 오류의 주원인입니다.',
    ruleId: 'latch_inferred',
    ruleName: 'latch_inferred',
    file: 'state_machine.v',
    codeLines: [
      { text: "always @(*) begin" },
      { text: "    if (state == S_RUN)" },
      { text: "        busy = start;", highlight: true, annotate: "WARNING: 'busy' latch inferred — no else branch" },
      { text: "    // no else: busy retains last value" },
      { text: "end" },
    ],
    detail: "combinational always @(*) 블록에서 state != S_RUN인 경우에 'busy'에 대한 할당이 없습니다. 이 경우 합성기는 이전 값을 유지하는 래치를 추론합니다. FPGA에서 래치는 거의 항상 의도치 않은 설계 오류입니다.",
    howToFix: "always @(*) 블록에 else 분기 추가: else busy = 1'b0;",
  },
  {
    key: 'stylistic',
    label: 'Stylistic',
    labelKo: '스타일 검사',
    color: '#5B8C5A',
    severity: 'INFO',
    severityColor: '#5B8C5A',
    description: '프로젝트 코딩 규칙 및 안전 지침(Safety Guideline) 위반을 검출합니다. 정책 파일(Methodology/Goal)로 커스터마이징 가능합니다.',
    ruleId: 'async_reset_active_high',
    ruleName: 'async_reset_active_high',
    file: 'reset_flop.v',
    codeLines: [
      { text: "always @(posedge Clk or posedge Rst) begin", highlight: true, annotate: "INFO: active-high async reset (policy: active-low)" },
      { text: "    if (Rst)" },
      { text: "        Q <= 8'h00;" },
      { text: "    else" },
      { text: "        Q <= D;" },
      { text: "end" },
    ],
    detail: "Safety-Critical 프로젝트의 FPGA 코딩 가이드라인은 일반적으로 active-low 비동기 리셋(negedge rst_n)을 요구합니다. posedge Rst는 active-high이므로 프로젝트 정책 위반으로 분류됩니다. Questa Lint FPGA methodology에서 기본 Info 체크입니다.",
    howToFix: "posedge Rst → negedge rst_n, if (Rst) → if (!rst_n)",
  },
];

function InteractiveCategoryViewer() {
  const [selected, setSelected] = useState<Category>('syntactic');
  const current = categories.find((c) => c.key === selected)!;

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {/* 탭 버튼 */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelected(cat.key)}
            style={{
              flex: 1,
              padding: '0.55rem 0.5rem',
              borderRadius: '10px',
              border: selected === cat.key ? `2px solid ${cat.color}` : `1px solid ${cat.color}30`,
              background: selected === cat.key
                ? `linear-gradient(135deg, ${cat.color}15, ${cat.color}25)`
                : `${cat.color}06`,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: selected === cat.key ? `0 2px 12px ${cat.color}30` : 'none',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: cat.color }}>{cat.label}</div>
            <div style={{ fontSize: '0.68rem', color: FPGA.textLight, marginTop: '1px' }}>{cat.labelKo}</div>
            <div style={{
              display: 'inline-flex',
              marginTop: '4px',
              fontSize: '0.62rem',
              fontWeight: 700,
              color: cat.severityColor,
              background: `${cat.severityColor}15`,
              border: `1px solid ${cat.severityColor}30`,
              padding: '1px 6px',
              borderRadius: '3px',
              fontFamily: 'monospace',
            }}>
              {cat.severity}
            </div>
          </button>
        ))}
      </div>

      {/* 상세 패널 */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '1rem' }}>
        {/* 코드 패널 */}
        <div style={{ flex: '0 0 48%', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.75rem', fontWeight: 600, color: FPGA.textLight,
          }}>
            <span style={{ fontFamily: 'monospace', color: FPGA.primary }}>{current.file}</span>
            <span style={{
              fontFamily: 'monospace', fontSize: '0.68rem',
              background: `${current.color}12`, color: current.color,
              border: `1px solid ${current.color}25`,
              padding: '1px 7px', borderRadius: '4px',
            }}>{current.ruleName}</span>
          </div>
          <div style={{
            background: '#1A2235',
            borderRadius: '10px',
            padding: '0.9rem 1rem',
            fontFamily: '"Consolas", "Courier New", monospace',
            fontSize: '0.74rem',
            lineHeight: 1.9,
            color: '#CBD5E0',
            boxShadow: shadow.card,
            border: `1px solid ${current.color}20`,
            flex: 1,
          }}>
            {current.codeLines.map((line, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {line.highlight ? (
                  <div style={{
                    background: `${current.color}20`,
                    borderLeft: `3px solid ${current.color}`,
                    paddingLeft: '8px',
                    marginLeft: '-4px',
                    borderRadius: '0 4px 4px 0',
                  }}>
                    <span style={{ color: current.color === FPGA.danger ? '#FC8181' : current.color === FPGA.accent ? '#F6AD55' : current.color === '#8B6FA5' ? '#C4A8E0' : '#86EFAC' }}>
                      {line.text}
                    </span>
                    {line.annotate && (
                      <div style={{
                        fontSize: '0.65rem',
                        color: current.color,
                        fontStyle: 'italic',
                        marginTop: '-2px',
                        paddingLeft: '2px',
                        lineHeight: 1.5,
                      }}>
                        {/* annotate arrow */}
                        ↑ {line.annotate}
                      </div>
                    )}
                  </div>
                ) : (
                  <span style={{ color: '#8094B0' }}>{line.text}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 설명 패널 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* 설명 */}
          <div style={{
            background: `linear-gradient(135deg, ${current.color}06, ${current.color}10)`,
            border: `1px solid ${current.color}20`,
            borderRadius: '10px',
            padding: '0.8rem',
            boxShadow: shadow.card,
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: current.color, marginBottom: '0.3rem' }}>
              검사 목적
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.6 }}>
              {current.description}
            </p>
          </div>

          {/* 원인 분석 */}
          <div style={{
            background: 'rgba(255,255,255,0.8)',
            border: `1px solid ${FPGA.border}`,
            borderRadius: '10px',
            padding: '0.8rem',
            boxShadow: shadow.card,
            flex: 1,
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.3rem' }}>
              원인 분석
            </div>
            <p style={{ margin: 0, fontSize: '0.76rem', color: FPGA.text, lineHeight: 1.6 }}>
              {current.detail}
            </p>
          </div>

          {/* 수정 방법 */}
          <div style={{
            background: 'rgba(72,187,120,0.06)',
            border: '1px solid rgba(72,187,120,0.25)',
            borderRadius: '10px',
            padding: '0.7rem 0.8rem',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            boxShadow: shadow.card,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="9" cy="9" r="7.5" stroke="#48BB78" strokeWidth="1.5" />
              <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#48BB78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#48BB78', marginBottom: '2px' }}>수정 방법</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.73rem', color: FPGA.text }}>{current.howToFix}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportSlides() {
  return (
    <>
      {/* ── 슬라이드 1: 인터랙티브 4-카테고리 뷰어 ── */}
      <section data-background-color={slideBg}>
        <div className="fpga-content-wrap">
          <SlideHeader
            badge="Lint Report"
            title="Lint 검사 카테고리 분석"
            subtitle="탭을 클릭하여 각 위반 유형의 원인과 수정 방법을 확인하세요"
          />
          <InteractiveCategoryViewer />
        </div>
      </section>

      {/* ── 슬라이드 2: Questa Lint GUI 리포트 [Placeholder] ── */}
      <section data-background-color={slideBg}>
        <div className="fpga-content-wrap">
          <SlideHeader
            badge="GUI Report"
            title="Questa Lint HTML 리포트 화면"
            subtitle="실행 결과를 브라우저에서 확인하는 방법"
          />

          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '1.2rem' }}>
            {/* HTML 리포트 목업 */}
            <div style={{
              flex: '0 0 62%', borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)', border: '1px solid #D0D5DD',
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Browser chrome */}
              <div style={{ background: '#E8ECF0', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px', borderBottom: '1px solid #C8CDD5', flexShrink: 0 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#FC8181' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#F6AD55' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#68D391' }} />
                <div style={{ fontSize: '0.62rem', color: '#6B8096', marginLeft: '8px', fontFamily: 'monospace', background: '#fff', padding: '1px 10px', borderRadius: '4px', border: '1px solid #D0D5DD' }}>
                  lint_result/html/lint.htm
                </div>
              </div>
              {/* Report body */}
              <div style={{ flex: 1, background: '#fff', overflow: 'auto', padding: '0.6rem 0.9rem', fontSize: '0.67rem', color: '#222', lineHeight: 1.55 }}>
                {/* Title */}
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Lint Check Report</div>
                {/* Meta table */}
                <table style={{ borderCollapse: 'collapse', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
                  <tbody>
                  {[
                    { k: 'Questa Lint', v: 'Version 2025.3  win64' },
                    { k: 'Design', v: 'lint_demo_top' },
                    { k: 'Design Quality Score', v: '99.4%', vColor: '#2E7D32' },
                  ].map((r, i) => (
                    <tr key={r.k} style={{ background: i % 2 === 0 ? '#EEEEEE' : '#FAFAFA' }}>
                      <td style={{ padding: '2px 8px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>{r.k}</td>
                      <td style={{ padding: '2px 8px', border: '1px solid #ccc', fontWeight: 600, color: r.vColor }}>{r.v}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
                {/* Section 1 */}
                <div style={{ fontWeight: 700, fontSize: '0.72rem', marginBottom: '0.2rem' }}>Section 1 : Lint Checks</div>
                <hr style={{ margin: '0 0 0.35rem', borderColor: '#ccc' }} />
                {/* Error */}
                <div style={{ marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#555', cursor: 'default' }}>[+]</span>
                  <span style={{ color: 'red', fontWeight: 700, marginLeft: '5px', border: '1px solid red', padding: '0 4px', borderRadius: '2px' }}>Error (4)</span>
                </div>
                <div style={{ paddingLeft: '1.2rem', marginBottom: '0.15rem' }}>
                  <span style={{ color: '#555' }}>[+]</span>
                  <span style={{ marginLeft: '4px' }}>Check: </span>
                  <span style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}>blocking_assign_in_seq_block</span>
                  <span style={{ color: '#555' }}> [Category: Simulation] (<b>4</b>)</span>
                </div>
                <div style={{ paddingLeft: '2.8rem', color: '#555', marginBottom: '0.25rem', fontSize: '0.63rem' }}>
                  [Message: Sequential always block has a blocking assignment. Module '&lt;module&gt;', File '&lt;file&gt;', Line '&lt;line&gt;'.]
                </div>
                {/* Warning */}
                <div style={{ marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#555' }}>[+]</span>
                  <span style={{ color: 'orange', fontWeight: 700, marginLeft: '5px', border: '1px solid orange', padding: '0 4px', borderRadius: '2px' }}>Warning (1)</span>
                </div>
                <div style={{ paddingLeft: '1.2rem', marginBottom: '0.15rem' }}>
                  <span style={{ color: '#555' }}>[+]</span>
                  <span style={{ marginLeft: '4px' }}>Check: </span>
                  <span style={{ color: 'orange', textDecoration: 'underline', cursor: 'pointer' }}>latch_inferred</span>
                  <span style={{ color: '#555' }}> [Category: Rtl Design Style] (<b>1</b>)</span>
                </div>
                <div style={{ paddingLeft: '2.8rem', color: '#555', marginBottom: '0.25rem', fontSize: '0.63rem' }}>
                  [Message: Latch inferred. Signal '&lt;signal&gt;', Module '&lt;module&gt;', File '&lt;file&gt;', Line '&lt;line&gt;'.]
                </div>
                {/* Info */}
                <div style={{ marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#555' }}>[+]</span>
                  <span style={{ color: 'blue', fontWeight: 700, marginLeft: '5px', border: '1px solid blue', padding: '0 4px', borderRadius: '2px' }}>Info (2)</span>
                </div>
                {[
                  { rule: 'async_reset_active_high', cat: 'Clock', n: 1 },
                  { rule: 'var_set_not_read', cat: 'Rtl Design Style', n: 1 },
                ].map((r) => (
                  <div key={r.rule} style={{ paddingLeft: '1.2rem', marginBottom: '0.12rem' }}>
                    <span style={{ color: '#555' }}>[+]</span>
                    <span style={{ marginLeft: '4px' }}>Check: </span>
                    <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>{r.rule}</span>
                    <span style={{ color: '#555' }}> [Category: {r.cat}] (<b>{r.n}</b>)</span>
                  </div>
                ))}
                {/* Resolved */}
                <div style={{ marginTop: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#555' }}>[+]</span>
                  <span style={{ color: 'green', fontWeight: 700, marginLeft: '5px', border: '1px solid green', padding: '0 4px', borderRadius: '2px' }}>Resolved (0)</span>
                </div>
                {/* Section 2 */}
                <hr style={{ margin: '0.4rem 0 0.3rem', borderColor: '#ccc' }} />
                <div style={{ fontWeight: 700, fontSize: '0.72rem', marginBottom: '0.2rem' }}>Section 2 : Design Information</div>
                <table style={{ borderCollapse: 'collapse', fontSize: '0.63rem' }}>
                  <tbody>
                  {[['Register Bits', '26'], ['Latch Bits', '1'], ['Unresolved Modules', '0']].map(([k, v], i) => (
                    <tr key={k} style={{ background: i % 2 === 0 ? '#EEEEEE' : '#FAFAFA' }}>
                      <td style={{ padding: '2px 8px', border: '1px solid #ccc' }}>{k}</td>
                      <td style={{ padding: '2px 8px', border: '1px solid #ccc', fontWeight: 600 }}>{v}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 우: 리포트 구성 설명 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: FPGA.dark }}>HTML 리포트 구성</div>
              {[
                { section: 'Header Table', desc: 'Design name, version, timestamp, Design Quality Score', color: FPGA.primary },
                { section: 'Section 1: Lint Checks', desc: '[+] 버튼으로 접기/펼치기 — Severity별 그룹 → 규칙별 → 개별 위반', color: FPGA.danger },
                { section: 'Rule hyperlink', desc: '규칙명 클릭 → Questa Lint User Guide 해당 규칙 문서로 이동', color: FPGA.accent },
                { section: 'Section 2: Design Info', desc: 'Register/Latch Bits, Blackbox 수 등 설계 통계', color: '#5B8C5A' },
              ].map((item) => (
                <div key={item.section} style={{
                  background: `linear-gradient(135deg, ${item.color}06, ${item.color}10)`,
                  border: `1px solid ${item.color}20`,
                  borderLeft: `3px solid ${item.color}`,
                  borderRadius: '0 10px 10px 0',
                  padding: '0.55rem 0.8rem',
                  boxShadow: shadow.card,
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: item.color, fontFamily: 'monospace', marginBottom: '2px' }}>{item.section}</div>
                  <div style={{ fontSize: '0.72rem', color: FPGA.text, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
              {/* 생성 명령 */}
              <div style={{ background: '#1A2235', borderRadius: '8px', padding: '0.55rem 0.9rem', fontFamily: 'monospace', fontSize: '0.72rem', color: '#CBD5E0', boxShadow: shadow.card }}>
                <div><span style={{ color: '#6B8096' }}># generate HTML report in run_lint.tcl</span></div>
                <div><span style={{ color: '#7EB8F7' }}>lint generate report</span> <span style={{ color: '#A8D8A8' }}>-html</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
