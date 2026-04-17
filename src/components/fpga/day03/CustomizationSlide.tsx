'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * 룰 커스터마이징 슬라이드
 * lint methodology / lint preference / lint off / lint report item 사용법
 */

const directives = [
  {
    cmd: 'lint methodology fpga',
    label: 'Goal 선택',
    color: '#4A6FA5',
    desc: 'FPGA Methodology를 활성화하고 분석 단계에 맞는 Goal을 지정합니다.',
    examples: [
      {
        code: 'lint methodology fpga -goal release_xilinx',
        note: 'Xilinx FPGA 전용 — release 기반 + initial/active-high reset 자동 조정',
      },
      {
        code: 'lint methodology fpga -goal simulation -review',
        note: '-review: 활성화된 체크 목록을 ./fpga/simulation.tcl 파일로 출력 (검토/커스터마이징 시작점)',
      },
    ],
  },
  {
    cmd: 'lint preference',
    label: '체크 동작 세부 설정',
    color: '#E8913A',
    desc: '개별 체크의 동작 방식을 프로젝트 요건에 맞게 조정합니다. ⚙ 표시된 룰에서 사용 가능.',
    examples: [
      {
        code: 'lint preference -clock_gating_module clk_gate_cell',
        note: 'clock_gated — 전용 클록 게이팅 모듈 이름 등록 → 해당 모듈 내부는 위반 미보고',
      },
      {
        code: 'lint preference -check case_default_missing\n  -missing_others_or_default',
        note: 'case_default_missing — 모든 케이스를 나열해도 default 절 없으면 반드시 보고',
      },
      {
        code: 'lint preference -check latch_inferred\n  -report_latches_in_always_latch_blocks',
        note: 'latch_inferred — always_latch 블록 내 래치도 위반으로 보고',
      },
      {
        code: 'lint preference -check flop_without_control\n  -valid_flop_controls async_reset sync_reset initial_value',
        note: 'Xilinx goal — flop_without_control의 허용 제어 타입 지정',
      },
    ],
  },
  {
    cmd: 'lint off',
    label: '특정 체크 비활성화',
    color: '#E53E3E',
    desc: '특정 체크를 전체 또는 조건부로 비활성화합니다. DO-254 적용 시 비활성화 사유를 DDP에 반드시 문서화해야 합니다.',
    examples: [
      {
        code: 'lint off unsynth_initial_stmt',
        note: 'Xilinx goal 기본 설정 — initial 블록 구문 관련 체크 비활성화',
      },
      {
        code: 'lint off unsynth_initial_value',
        note: 'Xilinx goal 기본 설정 — 초기값 할당 관련 체크 비활성화',
      },
    ],
  },
  {
    cmd: 'lint report check -severity',
    label: '심각도 변경',
    color: '#8B6FA5',
    desc: '특정 체크의 보고 심각도를 프로젝트 정책에 맞게 변경합니다.',
    examples: [
      {
        code: 'lint report check -severity warning flop_output_in_initial',
        note: 'Xilinx goal — 기본 Error인 flop_output_in_initial을 Warning으로 하향',
      },
    ],
  },
  {
    cmd: 'lint report item -status',
    label: 'Waiver 관리',
    color: '#48BB78',
    desc: '개별 위반 항목의 상태를 변경합니다. Safety-Critical 프로젝트에서 waiver는 반드시 근거를 함께 기록하고 감사(audit) 가능해야 합니다.',
    examples: [
      {
        code: 'lint report item -status waived\n  -check async_reset_active_high -arg reset=rst\n  # REASON: Xilinx FPGA active-high reset convention',
        note: 'async_reset_active_high — 특정 신호(rst)의 위반을 Xilinx 관례 이유로 waive',
      },
      {
        code: 'lint report item -status pending\n  -check case_default_missing -arg Module=alu_core',
        note: '특정 모듈의 위반을 pending(검토 중) 상태로 변경 — 진행 상황 추적',
      },
      {
        code: 'lint report item -status bug\n  -check combo_loop -rtl_id 2471cf09_00300',
        note: 'RTL ID 기반으로 특정 위반을 bug로 마킹 — 수정 추적 시작',
      },
    ],
  },
];

const statusTable = [
  { status: 'uninspected', color: '#718096', desc: '분석 후 아직 검토되지 않은 초기 상태' },
  { status: 'pending', color: '#E8913A', desc: '검토 중 / 수정 진행 중' },
  { status: 'waived', color: '#4A6FA5', desc: '근거와 함께 면제 처리 (DO-254: 문서화 필수)' },
  { status: 'bug', color: '#E53E3E', desc: '실제 버그로 확인됨 — 수정 필요' },
  { status: 'fixed', color: '#48BB78', desc: '수정 완료 — 재분석 대기' },
  { status: 'verified', color: '#48BB78', desc: '수정 및 검증 완료' },
];

export default function CustomizationSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Rule Customization"
          title="룰 커스터마이징 및 Waiver 관리"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '0.9rem' }}>
          {/* 좌측: 디렉티브 목록 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.55rem', minWidth: 0 }}>
            {directives.map((d) => (
              <div key={d.cmd} style={{
                background: FPGA.white,
                border: `1px solid ${d.color}20`,
                borderLeft: `3px solid ${d.color}`,
                borderRadius: '10px',
                padding: '0.6rem 0.8rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.3rem' }}>
                  <code style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.68rem', fontWeight: 700,
                    color: d.color,
                    background: `${d.color}12`,
                    border: `1px solid ${d.color}25`,
                    padding: '2px 8px', borderRadius: '4px',
                  }}>{d.cmd}</code>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: FPGA.dark }}>{d.label}</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: FPGA.textLight, marginBottom: '0.4rem', lineHeight: 1.5 }}>
                  {d.desc}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {d.examples.map((ex, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                      background: '#F8FAFC', borderRadius: '6px', padding: '0.35rem 0.5rem',
                    }}>
                      <pre style={{
                        margin: 0,
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.6rem',
                        color: '#A8D8A8',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        flex: 1,
                        background: '#1A2235',
                        borderRadius: '5px',
                        padding: '0.3rem 0.5rem',
                      }}>{ex.code}</pre>
                      <div style={{ fontSize: '0.6rem', color: FPGA.textLight, lineHeight: 1.5, maxWidth: '200px', flexShrink: 0 }}>
                        {ex.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 우측: 위반 상태 테이블 + 워크플로우 */}
          <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {/* 위반 상태 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '12px',
              padding: '0.7rem 0.8rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.5rem' }}>
                위반 항목 상태 체계
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {statusTable.map((s) => (
                  <div key={s.status} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                    <code style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.6rem', fontWeight: 700,
                      color: s.color,
                      background: `${s.color}12`,
                      border: `1px solid ${s.color}28`,
                      padding: '1px 6px', borderRadius: '3px',
                      flexShrink: 0, minWidth: '74px',
                      textAlign: 'center',
                    }}>{s.status}</code>
                    <span style={{ fontSize: '0.62rem', color: FPGA.textLight, lineHeight: 1.4 }}>{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow */}
            <div style={{
              background: `linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.12))`,
              border: `1px solid ${FPGA.primary}20`,
              borderRadius: '12px',
              padding: '0.7rem 0.8rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: FPGA.primary, marginBottom: '0.5rem' }}>
                커스터마이징 워크플로우
              </div>
              {[
                { step: '1', text: '-review로 활성 체크 목록 출력', color: '#4A6FA5' },
                { step: '2', text: '생성된 .tcl 파일을 복사해 프로젝트 정책 파일 작성', color: '#5B8C5A' },
                { step: '3', text: 'lint preference / lint off로 체크 조정', color: '#E8913A' },
                { step: '4', text: '위반 검토 후 waived / bug / pending 상태 지정', color: '#8B6FA5' },
                { step: '5', text: 'DO-254: 모든 waiver에 근거(REASON) 주석 필수', color: '#E53E3E' },
              ].map((w) => (
                <div key={w.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '0.35rem' }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: `${w.color}18`, border: `1.5px solid ${w.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.58rem', fontWeight: 800, color: w.color, flexShrink: 0,
                  }}>{w.step}</div>
                  <span style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.5 }}>{w.text}</span>
                </div>
              ))}
            </div>

            {/* DO-254 경고 박스 */}
            <div style={{
              background: 'rgba(229,62,62,0.06)',
              border: '1.5px solid rgba(229,62,62,0.30)',
              borderRadius: '10px',
              padding: '0.6rem 0.75rem',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#E53E3E', marginBottom: '0.3rem' }}>
                ⚠ DO-254 Waiver 주의사항
              </div>
              <div style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.5 }}>
                체크 비활성화(lint off) 또는 위반 면제(waived)는 반드시 <strong>Design Development Plan(DDP)</strong> 또는 <strong>Verification Plan</strong>에 해당 근거를 명시해야 합니다. 감사(audit) 시 추적 가능해야 합니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
