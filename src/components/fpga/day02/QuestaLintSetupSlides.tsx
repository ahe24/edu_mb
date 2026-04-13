'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Day 02 — Questa Lint 환경 설정 슬라이드 (2 slides)
 * Slide 1: 프로젝트 디렉토리 구조 및 파일 구성
 * Slide 2: 예제 RTL 파일 — 4가지 위반 유형 소개
 */

// ── 코드 블록 공통 스타일 ──
// Consolas 사용: JetBrains Mono는 '<=' 리거처로 인해 ≤ 처럼 보이는 문제 있음
const codeBox: React.CSSProperties = {
  background: '#1A2235',
  borderRadius: '8px',
  padding: '0.45rem 0.8rem',
  fontFamily: '"Consolas", "Courier New", monospace',
  fontSize: '0.67rem',
  lineHeight: 1.55,
  color: '#CBD5E0',
  boxShadow: shadow.card,
  border: '1px solid rgba(255,255,255,0.06)',
  overflow: 'auto',
  maxHeight: '220px',
};

const keyword = (text: string) => (
  <span style={{ color: '#7EB8F7' }}>{text}</span>
);
const flag = (text: string) => (
  <span style={{ color: '#A8D8A8' }}>{text}</span>
);
const comment = (text: string) => (
  <span style={{ color: '#6B8096', fontStyle: 'italic' }}>{text}</span>
);
const warn = (text: string) => (
  <span style={{ color: '#F6AD55' }}>{text}</span>
);

export default function QuestaLintSetupSlides() {
  return (
    <>
      {/* ── 슬라이드 1: 프로젝트 구조 ── */}
      <section data-background-color={slideBg}>
        <div className="fpga-content-wrap">
          <SlideHeader
            badge="Project Setup"
            title="프로젝트 디렉토리 구성"
            subtitle="Questa Lint 실습 환경 파일 구조"
          />

          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '1.2rem' }}>
            {/* 좌: 디렉토리 트리 */}
            <div style={{ flex: '0 0 42%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ ...codeBox, flex: 1, maxHeight: 'none', overflow: 'hidden' }}>
                <div style={{ color: '#6B8096', fontSize: '0.7rem', marginBottom: '0.6rem', letterSpacing: '0.06em' }}>
                  PROJECT STRUCTURE
                </div>
                <div>
                  <span style={{ color: '#7EB8F7' }}>questa_lint_lab/</span>
                </div>
                <div style={{ paddingLeft: '1.2rem' }}>
                  <span style={{ color: '#A8D8A8' }}>├── rtl/</span>
                </div>
                <div style={{ paddingLeft: '2.4rem' }}>
                  <span style={{ color: '#CBD5E0' }}>├── </span>
                  <span style={{ color: '#7EB8F7' }}>lint_demo_top.v</span>
                  <span style={{ color: '#6B8096', fontSize: '0.7rem' }}>  {comment('# Top module')}</span>
                </div>
                <div style={{ paddingLeft: '2.4rem' }}>
                  <span style={{ color: '#CBD5E0' }}>├── </span>
                  <span style={{ color: '#F6AD55' }}>ctrl_logic.v</span>
                  <span style={{ color: '#6B8096', fontSize: '0.7rem' }}>    {comment('# Syntactic + Semantic')}</span>
                </div>
                <div style={{ paddingLeft: '2.4rem' }}>
                  <span style={{ color: '#CBD5E0' }}>├── </span>
                  <span style={{ color: '#F6AD55' }}>state_machine.v</span>
                  <span style={{ color: '#6B8096', fontSize: '0.7rem' }}> {comment('# Structural')}</span>
                </div>
                <div style={{ paddingLeft: '2.4rem' }}>
                  <span style={{ color: '#CBD5E0' }}>└── </span>
                  <span style={{ color: '#F6AD55' }}>reset_flop.v</span>
                  <span style={{ color: '#6B8096', fontSize: '0.7rem' }}>    {comment('# Stylistic')}</span>
                </div>
                <div style={{ paddingLeft: '1.2rem', marginTop: '0.2rem' }}>
                  <span style={{ color: '#A8D8A8' }}>├── scripts/</span>
                </div>
                <div style={{ paddingLeft: '2.4rem' }}>
                  <span style={{ color: '#CBD5E0' }}>└── </span>
                  <span style={{ color: '#7EB8F7' }}>run_lint.tcl</span>
                  <span style={{ color: '#6B8096', fontSize: '0.7rem' }}>   {comment('# Tcl 실행 스크립트')}</span>
                </div>
                <div style={{ paddingLeft: '1.2rem', marginTop: '0.2rem' }}>
                  <span style={{ color: '#A8D8A8' }}>└── output_lint/</span>
                  <span style={{ color: '#6B8096', fontSize: '0.7rem' }}>    {comment('# qverify -od 자동 생성')}</span>
                </div>
              </div>
            </div>

            {/* 우: 설명 카드들 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {/* run_lint.tcl 내용 */}
              <div style={{ ...codeBox, maxHeight: 'none' }}>
                <div style={{ color: '#6B8096', fontSize: '0.7rem', marginBottom: '0.5rem', letterSpacing: '0.06em' }}>
                  scripts/run_lint.tcl
                </div>
                <div>{comment('# 1. Methodology & Goal 설정')}</div>
                <div>{keyword('lint')} <span style={{ color: '#CBD5E0' }}>methodology fpga</span> {flag('-goal')} <span style={{ color: '#A8D8A8' }}>release</span></div>
                <div style={{ marginTop: '0.4rem' }}>{comment('# 2. 라이브러리 생성 및 RTL 컴파일')}</div>
                <div>{keyword('vlib')} <span style={{ color: '#A8D8A8' }}>work</span></div>
                <div>{keyword('vmap')} <span style={{ color: '#A8D8A8' }}>work work</span></div>
                <div>{keyword('vlog')} <span style={{ color: '#A8D8A8' }}>rtl/lint_demo_top.v \</span></div>
                <div style={{ paddingLeft: '2.8rem' }}><span style={{ color: '#A8D8A8' }}>rtl/ctrl_logic.v rtl/state_machine.v rtl/reset_flop.v</span></div>
                <div style={{ marginTop: '0.4rem' }}>{comment('# 3. Lint 분석 — top 모듈 계층 전체')}</div>
                <div>{keyword('lint')} <span style={{ color: '#CBD5E0' }}>run</span> {flag('-d')} <span style={{ color: '#A8D8A8' }}>lint_demo_top</span></div>
                <div style={{ marginTop: '0.4rem' }}>{comment('# 4. 리포트 생성')}</div>
                <div>{keyword('lint')} <span style={{ color: '#CBD5E0' }}>generate report</span></div>
              </div>

              {/* 환경 확인 */}
              <div style={{
                background: `linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.12))`,
                border: `1px solid ${FPGA.primaryLight}30`,
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.primary, marginBottom: '0.4rem' }}>
                  사전 환경 확인
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {[
                    { cmd: 'qverify -version', desc: '버전 확인' },
                    { cmd: 'vlog -version', desc: '컴파일러 확인' },
                    { cmd: 'echo $SALT_LICENSE_SERVER', desc: '라이선스 확인' },
                  ].map((item) => (
                    <div key={item.cmd} style={{
                      background: 'rgba(255,255,255,0.6)',
                      border: `1px solid ${FPGA.border}`,
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                    }}>
                      <span style={{ fontFamily: 'monospace', color: FPGA.primary, fontWeight: 600 }}>{item.cmd}</span>
                      <span style={{ color: FPGA.textLight, marginLeft: '6px' }}>— {item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 슬라이드 2: 예제 RTL 파일 ── */}
      <section data-background-color={slideBg}>
        <div className="fpga-content-wrap">
          <SlideHeader
            badge="Example RTL"
            title="실습 예제 RTL 파일"
            subtitle="vlog 컴파일 에러 없음 — Lint 위반만 의도적으로 포함된 계층 설계"
          />

          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
            {/* ctrl_logic.v — Syntactic + Semantic */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: FPGA.dark }}>
                <span style={{ fontFamily: 'monospace', background: '#4A6FA520', color: FPGA.primary, padding: '2px 8px', borderRadius: '4px' }}>ctrl_logic.v</span>
                <span style={{ fontSize: '0.65rem', background: '#E53E3E15', color: FPGA.danger, border: `1px solid ${FPGA.danger}30`, padding: '1px 7px', borderRadius: '4px' }}>Syntactic</span>
                <span style={{ fontSize: '0.65rem', background: '#E8913A15', color: FPGA.accent, border: `1px solid ${FPGA.accent}30`, padding: '1px 7px', borderRadius: '4px' }}>Semantic</span>
              </div>
              <div style={{ ...codeBox, flex: 1, fontSize: '0.72rem' }}>
                {/* module header */}
                <div>{keyword('module')} <span style={{ color: '#A8D8A8' }}>ctrl_logic</span> (</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('input wire')}{'       '}clk, rst_n,</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('input wire')} [3:0] opcode,</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('output reg')} [7:0] result);</div>
                {/* Semantic violation */}
                <div style={{ marginTop: '0.25rem', paddingLeft: '1.2rem' }}>{comment('// ❷ Semantic: status written every cycle, never read')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('reg')} [7:0] {warn('status')};</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('always')} @({keyword('posedge')} clk {keyword('or negedge')} rst_n)</div>
                <div style={{ paddingLeft: '2.4rem' }}>{keyword('if')} (!rst_n) {warn('status')} &lt;= 8&apos;h00;</div>
                <div style={{ paddingLeft: '2.4rem' }}>{keyword('else')}{'     '}{warn('status')} &lt;= {'{'}&apos;0, opcode{'}'}; {comment('// ← var_set_not_read')}</div>
                {/* Syntactic violation */}
                <div style={{ marginTop: '0.25rem', paddingLeft: '1.2rem' }}>{comment('// ❶ Syntactic: blocking = in sequential always')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('always')} @({keyword('posedge')} clk {keyword('or negedge')} rst_n) {keyword('begin')}</div>
                <div style={{ paddingLeft: '2.4rem' }}>{keyword('if')} (!rst_n) result {warn('=')} 8&apos;h00; {comment('// use <=')}</div>
                <div style={{ paddingLeft: '2.4rem' }}>{keyword('else case')} (opcode)</div>
                <div style={{ paddingLeft: '3.6rem' }}>4&apos;h0: result {warn('=')} 8&apos;h00;</div>
                <div style={{ paddingLeft: '3.6rem' }}>4&apos;h1: result {warn('=')} 8&apos;hAA;</div>
                <div style={{ paddingLeft: '3.6rem' }}>{keyword('default')}: result {warn('=')} 8&apos;h55;</div>
                <div style={{ paddingLeft: '2.4rem' }}>{keyword('endcase')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('end')}</div>
                <div>{keyword('endmodule')}</div>
              </div>
            </div>

            {/* state_machine.v — Structural */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: FPGA.dark }}>
                <span style={{ fontFamily: 'monospace', background: '#8B6FA520', color: '#8B6FA5', padding: '2px 8px', borderRadius: '4px' }}>state_machine.v</span>
                <span style={{ fontSize: '0.65rem', background: '#8B6FA515', color: '#8B6FA5', border: '1px solid rgba(139,111,165,0.3)', padding: '1px 7px', borderRadius: '4px' }}>Structural</span>
              </div>
              <div style={{ ...codeBox, flex: 1, fontSize: '0.72rem' }}>
                <div>{keyword('module')} <span style={{ color: '#A8D8A8' }}>state_machine</span> (</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('input wire')} clk, rst_n, start, abort,</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('output reg')} busy);</div>
                <div style={{ marginTop: '0.2rem', paddingLeft: '1.2rem' }}>{keyword('reg')} [1:0] state;</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('localparam')} S_IDLE=0, S_RUN=1, S_DONE=2;</div>
                {/* sequential state register */}
                <div style={{ marginTop: '0.2rem', paddingLeft: '1.2rem' }}>{keyword('always')} @({keyword('posedge')} clk {keyword('or negedge')} rst_n) {keyword('begin')}</div>
                <div style={{ paddingLeft: '2.4rem' }}>{keyword('if')} (!rst_n) state &lt;= S_IDLE;</div>
                <div style={{ paddingLeft: '2.4rem' }}>{keyword('else case')} (state)</div>
                <div style={{ paddingLeft: '3.6rem' }}>S_IDLE: {keyword('if')} (start) state &lt;= S_RUN;</div>
                <div style={{ paddingLeft: '3.6rem' }}>S_RUN:{'  '}state &lt;= abort ? S_IDLE : S_DONE;</div>
                <div style={{ paddingLeft: '3.6rem' }}>S_DONE: state &lt;= S_IDLE;</div>
                <div style={{ paddingLeft: '3.6rem' }}>{keyword('default')}: state &lt;= S_IDLE;</div>
                <div style={{ paddingLeft: '2.4rem' }}>{keyword('endcase')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('end')}</div>
                {/* Structural violation */}
                <div style={{ marginTop: '0.25rem', paddingLeft: '1.2rem' }}>{comment('// ❸ Structural: no else -- latch inferred for busy')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('always')} @(*) {keyword('begin')}</div>
                <div style={{ paddingLeft: '2.4rem' }}>{keyword('if')} (state == S_RUN)</div>
                <div style={{ paddingLeft: '3.6rem' }}>{warn('busy')} = start;</div>
                <div style={{ paddingLeft: '2.4rem', color: '#F6AD55', fontSize: '0.68rem' }}>{comment('// no else: busy latches  ← WARNING')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('end')}</div>
                <div>{keyword('endmodule')}</div>
              </div>
            </div>

            {/* reset_flop.v — Stylistic */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: FPGA.dark }}>
                <span style={{ fontFamily: 'monospace', background: '#5B8C5A20', color: '#5B8C5A', padding: '2px 8px', borderRadius: '4px' }}>reset_flop.v</span>
                <span style={{ fontSize: '0.65rem', background: '#48BB7815', color: '#48BB78', border: '1px solid rgba(72,187,120,0.3)', padding: '1px 7px', borderRadius: '4px' }}>Stylistic</span>
              </div>
              <div style={{ ...codeBox, flex: 1, fontSize: '0.72rem' }}>
                <div>{keyword('module')} <span style={{ color: '#A8D8A8' }}>reset_flop</span> (</div>
                <div style={{ paddingLeft: '1.2rem', marginTop: '0.1rem' }}>{comment('// ❹ Stylistic: uppercase port names violate convention')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{comment('//   use clk, rst_n, d, q instead')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('input wire')}{'       '}{warn('Clk')}, {warn('Rst')},</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('input wire')} [7:0] {warn('D')},</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('output reg')} [7:0] {warn('Q')});</div>
                {/* Stylistic violation — async active-high reset */}
                <div style={{ marginTop: '0.25rem', paddingLeft: '1.2rem' }}>{comment('// ❹ Stylistic: async active-high reset -- INFO (polarity OK for FPGA)')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('always')} @({keyword('posedge')} {warn('Clk')} {keyword('or posedge')} {warn('Rst')}) {keyword('begin')}</div>
                <div style={{ paddingLeft: '2.4rem' }}>{keyword('if')} ({warn('Rst')}){'  '}{warn('Q')} &lt;= 8&apos;h00; {comment('// INFO: async active-high')}</div>
                <div style={{ paddingLeft: '2.4rem' }}>{keyword('else')}{'     '}{warn('Q')} &lt;= {warn('D')};</div>
                <div style={{ paddingLeft: '1.2rem' }}>{keyword('end')}</div>
                <div>{keyword('endmodule')}</div>
              </div>
            </div>

            {/* 위반 요약 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', justifyContent: 'center' }}>
              <div style={{
                background: 'rgba(255,255,255,0.8)', border: `1px solid ${FPGA.border}`,
                borderRadius: '10px', padding: '0.6rem 0.8rem', boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.35rem' }}>예상되는 4가지 위반 결과 </div>
                {[
                  { type: 'Syntactic', rule: 'blocking_assign_in_seq_block', severity: 'ERROR', color: FPGA.danger, file: 'ctrl_logic.v' },
                  { type: 'Semantic', rule: 'var_set_not_read (status)', severity: 'INFO', color: FPGA.accent, file: 'ctrl_logic.v' },
                  { type: 'Structural', rule: 'latch_inferred (busy)', severity: 'WARNING', color: '#8B6FA5', file: 'state_machine.v' },
                  { type: 'Stylistic', rule: 'async_reset_active_low', severity: 'INFO', color: '#5B8C5A', file: 'reset_flop.v' },
                ].map((item) => (
                  <div key={item.type} style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.26rem 0', borderBottom: `1px solid ${FPGA.border}40`, fontSize: '0.7rem',
                  }}>
                    <span style={{
                      background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30`,
                      padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.66rem',
                      flexShrink: 0, width: '70px', textAlign: 'center',
                    }}>{item.type}</span>
                    <span style={{ color: FPGA.text, fontFamily: 'monospace', flex: 1, fontSize: '0.68rem' }}>{item.rule}</span>
                    <span style={{
                      fontSize: '0.63rem', fontWeight: 700,
                      color: item.severity === 'ERROR' ? FPGA.danger : item.severity === 'INFO' ? '#5B8C5A' : FPGA.accent,
                      background: item.severity === 'ERROR' ? `${FPGA.danger}10` : item.severity === 'INFO' ? 'rgba(91,140,90,0.1)' : `${FPGA.accent}10`,
                      border: `1px solid ${item.severity === 'ERROR' ? FPGA.danger : item.severity === 'INFO' ? '#5B8C5A' : FPGA.accent}25`,
                      padding: '1px 5px', borderRadius: '4px', flexShrink: 0,
                    }}>{item.severity}</span>
                  </div>
                ))}
                <div style={{ marginTop: '0.5rem', fontSize: '0.68rem', color: FPGA.textLight, fontStyle: 'italic' }}>
                  lint run -d <strong style={{ color: FPGA.primary }}>lint_demo_top</strong> 한 번으로 계층 전체 분석
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
