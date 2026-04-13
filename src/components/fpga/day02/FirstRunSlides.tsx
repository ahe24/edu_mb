'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Day 02 — Questa Lint 첫 실행 슬라이드 (2 slides)
 * Slide 1: 실행 워크플로우 (단계별)
 * Slide 2: 콘솔 출력 해석
 */

const codeBox: React.CSSProperties = {
  background: '#1A2235',
  borderRadius: '10px',
  padding: '0.9rem 1.1rem',
  fontFamily: '"Consolas", "Courier New", monospace',
  fontSize: '0.78rem',
  lineHeight: 1.85,
  color: '#CBD5E0',
  boxShadow: shadow.card,
  border: '1px solid rgba(255,255,255,0.06)',
};

const kw = (t: string) => <span style={{ color: '#7EB8F7' }}>{t}</span>;

const ok = (t: string) => <span style={{ color: '#68D391' }}>{t}</span>;
const err = (t: string) => <span style={{ color: '#FC8181' }}>{t}</span>;
const wrn = (t: string) => <span style={{ color: '#F6AD55' }}>{t}</span>;
const info = (t: string) => <span style={{ color: '#76E4F7' }}>{t}</span>;
const dim = (t: string) => <span style={{ color: '#4A5568' }}>{t}</span>;

const steps = [
  {
    num: 1,
    title: '환경 확인',
    color: '#4A6FA5',
    cmds: ['qverify -version', 'echo $SALT_LICENSE_SERVER'],
    note: 'qverify 버전 및 라이선스 서버 변수 확인',
  },
  {
    num: 2,
    title: '라이브러리 생성 & RTL 컴파일',
    color: '#5B8C5A',
    cmds: ['vlib work', 'vmap work work', 'vlog rtl/lint_demo_top.v rtl/ctrl_logic.v rtl/state_machine.v rtl/reset_flop.v'],
    note: 'work 라이브러리 생성 후 4개 파일 한 번에 컴파일',
  },
  {
    num: 3,
    title: 'Lint 분석 실행',
    color: '#8B6FA5',
    cmds: ['lint run -d lint_demo_top'],
    note: 'top 모듈 지정으로 하위 계층 전체 분석 — 1 qverify = 1 lint run -d',
  },
  {
    num: 4,
    title: '리포트 생성 & GUI 확인',
    color: '#E8913A',
    cmds: ['lint generate report', 'qverify output_lint/lint.db'],
    note: '텍스트 리포트 생성 후 GUI로 결과 탐색',
  },
];

export default function FirstRunSlides() {
  return (
    <>
      {/* ── 슬라이드 1: 실행 워크플로우 ── */}
      <section data-background-color={slideBg}>
        <div className="fpga-content-wrap">
          <SlideHeader
            badge="First Run"
            title="Questa Lint 첫 실행 워크플로우"
            subtitle="4단계 순서로 Lint 분석 실행"
          />

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {/* 단계별 카드 */}
            {steps.map((step, i) => (
              <div key={step.num} style={{ display: 'flex', alignItems: 'stretch', gap: '1rem' }}>
                {/* 스텝 번호 */}
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '36px',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: `${step.color}15`,
                    border: `2px solid ${step.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', fontWeight: 800, color: step.color,
                    flexShrink: 0,
                  }}>{step.num}</div>
                  {i < steps.length - 1 && (
                    <div style={{ flex: 1, width: '2px', background: `${step.color}25`, marginTop: '4px' }} />
                  )}
                </div>

                {/* 내용 */}
                <div style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${step.color}05, ${step.color}10)`,
                  border: `1px solid ${step.color}20`,
                  borderLeft: `3px solid ${step.color}`,
                  borderRadius: '0 10px 10px 0',
                  padding: '0.65rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  marginBottom: i < steps.length - 1 ? '0' : '0',
                }}>
                  <div style={{ flexShrink: 0, width: '90px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: step.color }}>{step.title}</div>
                    <div style={{ fontSize: '0.68rem', color: FPGA.textLight, lineHeight: 1.4, marginTop: '2px' }}>{step.note}</div>
                  </div>
                  <div style={{ flex: 1, ...codeBox, padding: '0.5rem 0.8rem', lineHeight: 1.7 }}>
                    {step.cmds.map((cmd, ci) => (
                      <div key={ci}>
                        <span style={{ color: '#6B8096', marginRight: '6px' }}>$</span>
                        {kw(cmd.split(' ')[0])}{' '}
                        <span style={{ color: '#CBD5E0' }}>{cmd.split(' ').slice(1).join(' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* 팁 배너 */}
            <div style={{
              background: `linear-gradient(135deg, rgba(232,145,58,0.06), rgba(232,145,58,0.10))`,
              border: `1px solid ${FPGA.accent}25`,
              borderRadius: '10px',
              padding: '0.6rem 1rem',
              display: 'flex', alignItems: 'center', gap: '0.7rem',
              boxShadow: shadow.card,
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="#E8913A" strokeWidth="1.5" />
                <line x1="9" y1="6" x2="9" y2="9.5" stroke="#E8913A" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="9" cy="12" r="1" fill="#E8913A" />
              </svg>
              <span style={{ fontSize: '0.78rem', color: FPGA.text }}>
                <strong style={{ color: FPGA.accent }}>Tip:</strong> 전체를 한 번에 실행하려면 터미널에서{' '}
                <code style={{ fontFamily: 'monospace', background: '#E8913A15', padding: '1px 5px', borderRadius: '3px' }}>
                  qverify -od output_lint -c -do scripts/run_lint.tcl
                </code>{' '}
                를 실행합니다. <code style={{ fontFamily: 'monospace', background: '#E8913A15', padding: '1px 5px', borderRadius: '3px' }}>-od</code> 는 출력 디렉토리,{' '}
                <code style={{ fontFamily: 'monospace', background: '#E8913A15', padding: '1px 5px', borderRadius: '3px' }}>-c</code> 는 Batch(GUI 없음) 모드입니다.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 슬라이드 2: 콘솔 출력 해석 ── */}
      <section data-background-color={slideBg}>
        <div className="fpga-content-wrap">
          <SlideHeader
            badge="Console Output"
            title="Lint 실행 콘솔 출력 해석"
            subtitle="메시지 형식과 Severity 레벨 이해"
          />

          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '1.2rem' }}>
            {/* 좌: 콘솔 출력 예시 */}
            <div style={{ flex: '0 0 58%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark }}>lint_run.log — 실제 실행 로그</div>
              <div style={{ ...codeBox, flex: 1, fontSize: '0.70rem', lineHeight: 1.55 }}>
                <div>{dim('# Questa OneSpin Static & Formal Verification System  Version 2025.3  win64')}</div>
                <div style={{ marginTop: '0.15rem' }}>Executing Command : {kw('lint run')} -d lint_demo_top</div>
                <div style={{ marginTop: '0.1rem' }}>Top level modules: {ok('lint_demo_top')}</div>
                <div style={{ marginTop: '0.1rem' }}>Performing 360 Lint Checks  {dim('(Stage 1/5 → 2/5 → 3/5 → 4/5 → 5/5)')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{dim('-- Loading ctrl_logic / state_machine / reset_flop / lint_demo_top')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{dim('Lint Stage-2 100% complete (4 out of 4 modules checked)')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>{dim('Lint Stage-5 100% complete [Total Progress - 100%]')}</div>
                <div style={{ marginTop: '0.1rem' }}>{ok('Lint Checking Completed')}</div>
                <div style={{ marginTop: '0.1rem' }}>{dim('Final Process Statistics: Max memory 164MB, CPU time 5s, Total time 8s')}</div>
                <div style={{ marginTop: '0.2rem' }}>Result Summary</div>
                <div>{dim('-----------------------------------------------------------')}</div>
                <div>{err('Error (4)')}</div>
                <div>{dim('-----------------------------------------------------------')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>blocking_assign_in_seq_block{'            '}:4</div>
                <div>{dim('-----------------------------------------------------------')}</div>
                <div>{wrn('Warning (1)')}</div>
                <div>{dim('-----------------------------------------------------------')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>latch_inferred{'                          '}:1</div>
                <div>{dim('-----------------------------------------------------------')}</div>
                <div>{info('Info (2)')}</div>
                <div>{dim('-----------------------------------------------------------')}</div>
                <div style={{ paddingLeft: '1.2rem' }}>async_reset_active_high{'                 '}:1</div>
                <div style={{ paddingLeft: '1.2rem' }}>var_set_not_read{'                        '}:1</div>
                <div style={{ marginTop: '0.2rem' }}>{dim('To view results in GUI:  qverify lint_result/lint.db')}</div>
              </div>
            </div>

            {/* 우: Severity 설명 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark }}>Severity 레벨</div>
              {[
                {
                  level: 'ERROR',
                  color: FPGA.danger,
                  icon: '✕',
                  desc: '컴파일 또는 구조적으로 허용 불가한 문제. 반드시 수정 필요.',
                  example: 'Syntax error, 미지원 키워드',
                  action: '즉시 수정',
                },
                {
                  level: 'WARNING',
                  color: FPGA.accent,
                  icon: '⚠',
                  desc: '잠재적 오류 또는 설계 의도와 다를 수 있는 패턴.',
                  example: 'Redundant expr, FSM dead-end',
                  action: '원인 분석 후 수정 권장',
                },
                {
                  level: 'INFO',
                  color: '#5B8C5A',
                  icon: 'ℹ',
                  desc: '코딩 스타일 또는 가이드라인 위반. 정책에 따라 처리.',
                  example: 'Active-high reset, naming rule',
                  action: '프로젝트 정책 검토',
                },
              ].map((item) => (
                <div key={item.level} style={{
                  background: `linear-gradient(135deg, ${item.color}06, ${item.color}10)`,
                  border: `1px solid ${item.color}25`,
                  borderLeft: `4px solid ${item.color}`,
                  borderRadius: '0 10px 10px 0',
                  padding: '0.7rem 0.9rem',
                  boxShadow: shadow.card,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: item.color, fontFamily: 'monospace' }}>
                      {item.level}
                    </span>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 600, color: item.color,
                      background: `${item.color}15`, border: `1px solid ${item.color}25`,
                      padding: '1px 7px', borderRadius: '4px', marginLeft: 'auto',
                    }}>{item.action}</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: FPGA.text, lineHeight: 1.5, marginBottom: '0.2rem' }}>
                    {item.desc}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: FPGA.textLight, fontFamily: 'monospace' }}>
                    예: {item.example}
                  </div>
                </div>
              ))}

              {/* 메시지 형식 */}
              <div style={{
                background: 'rgba(255,255,255,0.7)',
                border: `1px solid ${FPGA.border}`,
                borderRadius: '8px',
                padding: '0.65rem 0.9rem',
                fontSize: '0.72rem',
              }}>
                <div style={{ fontWeight: 700, color: FPGA.dark, marginBottom: '0.4rem' }}>lint.rpt 위반 메시지 형식</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', lineHeight: 1.7 }}>
                  <span style={{ color: FPGA.primary }}>rule_name</span>
                  <span style={{ color: FPGA.textLight }}>: [uninspected] </span>
                  <span style={{ color: FPGA.text }}>message text.</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', lineHeight: 1.7, paddingLeft: '0.6rem' }}>
                  <span style={{ color: FPGA.textLight }}>Module </span>
                  <span style={{ color: '#A8D8A8' }}>'ctrl_logic'</span>
                  <span style={{ color: FPGA.textLight }}>, File </span>
                  <span style={{ color: '#A8D8A8' }}>'ctrl_logic.v'</span>
                  <span style={{ color: FPGA.textLight }}>, Line </span>
                  <span style={{ color: '#F6AD55' }}>'21'</span>
                  <span style={{ color: FPGA.textLight }}>.</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', lineHeight: 1.7, paddingLeft: '0.6rem' }}>
                  <span style={{ color: FPGA.textLight }}>[Example Hierarchy:</span>
                  <span style={{ color: FPGA.primary }}>lint_demo_top.u_ctrl</span>
                  <span style={{ color: FPGA.textLight }}>]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
