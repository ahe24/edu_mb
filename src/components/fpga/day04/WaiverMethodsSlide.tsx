'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Waiver 4가지 방법 비교 슬라이드
 * Pragma · lint off · lint suppress · lint report item
 */

type MethodKey = 'pragma' | 'off' | 'suppress' | 'item';

const methods: {
  key: MethodKey; name: string; color: string;
  scope: string; persistence: string; audit: 'A' | 'B' | 'C' | 'D';
  pros: string[]; cons: string[];
  example: string; when: string;
}[] = [
  {
    key: 'pragma',
    name: 'Inline Pragma',
    color: '#4A6FA5',
    scope: '코드 블록 (라인 범위)',
    persistence: 'RTL 소스와 동행',
    audit: 'B',
    pros: [
      'waive 근거가 코드 바로 옆에 위치',
      '코드 리뷰 시 자연스럽게 노출',
      'RTL 이동/리네임과 함께 따라감',
    ],
    cons: [
      '코드에 lint 종속 주석 삽입',
      '삭제 타이밍 놓치면 stale',
      '벌크 정책 변경이 어려움',
    ],
    example: `// lint_checking latch_inferred off
always @(*)
  if (en) q = d;   // 의도적 래치 — 외부 spec 강제
// lint_checking latch_inferred on`,
    when: '설계자가 의도적으로 선택한 구조(거의 없음). 특정 블록에만 국한되는 예외.',
  },
  {
    key: 'off',
    name: 'lint off (check 전역)',
    color: '#E53E3E',
    scope: '디자인 전체',
    persistence: '정책 파일에 상주',
    audit: 'D',
    pros: [
      '한 줄로 벌크 비활성화',
      '메서드 자체가 과도하면 간단 차단',
    ],
    cons: [
      '모든 모듈·신호에 일괄 적용',
      '진짜 버그도 숨김 — 위험',
      'DO-254: 정당화 문서 부담 큼',
    ],
    example: `# project_prefs.tcl
lint off unsynth_initial_stmt
# ↑ Xilinx goal이 원래 기본 off
#    처리하는 케이스 외에는 자제`,
    when: 'Methodology가 기본 제공하는 정당한 케이스(Xilinx initial 등). 그 외엔 쓰지 말 것.',
  },
  {
    key: 'suppress',
    name: 'lint suppress (pre-run)',
    color: '#E8913A',
    scope: '`-arg argname=value` (module·signal·file 등)',
    persistence: '정책·waiver Tcl 파일',
    audit: 'C',
    pros: [
      '`-comment`/`-owner`/`-reviewer` 근거 필드 내장',
      '범위 유연: check·alias·category·arg 조합',
      '3rd-party IP·레거시 블록에 깔끔',
    ],
    cons: [
      '상태 이력 자동 기록 X (pre-run 억제)',
      '와일드카드 과사용 시 진짜 버그 숨김',
      'RTL ID 기반 개별 추적은 불가',
    ],
    example: `# SUPPRESS-001  external_dsp_ip (DR-207)
lint suppress -check combo_loop latch_inferred \\
  -arg module=external_dsp_ip \\
  -owner alice -reviewer lead \\
  -comment {3rd-party BB, out of V&V scope (DR-207)}`,
    when: '외부 IP·레거시·블랙박스, 체크+argument 패턴 벌크 억제. -comment는 ASCII 전용 (리포트 CP949 mojibake 회피).',
  },
  {
    key: 'item',
    name: 'lint report item -status',
    color: '#48BB78',
    scope: '개별 위반 (RTL ID)',
    persistence: 'lint.db + waiver 파일',
    audit: 'A',
    pros: [
      '위반 하나하나 개별 처리',
      'RTL ID 기반 — 감사 최적',
      '상태 히스토리 자동 기록',
      'DO-254/ISO26262 인증 증빙',
    ],
    cons: [
      '명령이 상대적으로 장황',
      'RTL 리팩토링 시 ID 변경 가능',
      '설계 초기엔 비효율',
    ],
    example: `# WAIVER-042 (DR-112)  Xilinx active-high async reset
lint report item -status waived \\
  -check async_reset_active_high \\
  -rtl_id c8c123e5_00300 \\
  -owner alice -reviewer lead \\
  -comment {Xilinx convention, DR-112 (2026-04-15)}`,
    when: '기본 waiver 방식. 감사 대응이 필요한 모든 safety-critical 프로젝트.',
  },
];

const auditLabel = {
  A: { label: 'A 최상', color: '#48BB78' },
  B: { label: 'B 양호', color: '#4A6FA5' },
  C: { label: 'C 보통', color: '#E8913A' },
  D: { label: 'D 주의', color: '#E53E3E' },
};

export default function WaiverMethodsSlide() {
  const [active, setActive] = useState<MethodKey>('item');
  const m = methods.find(x => x.key === active)!;
  const aL = auditLabel[m.audit];

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Waiver Strategy"
          title="예외 처리 4가지 방법 비교"
          subtitle="적용 범위·감사 적합성 기준 선택"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* 상단: 비교 매트릭스 (4개 카드) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem' }}>
            {methods.map(x => {
              const on = x.key === active;
              const aRank = auditLabel[x.audit];
              return (
                <button key={x.key} onClick={() => setActive(x.key)} style={{
                  cursor: 'pointer',
                  background: on ? `linear-gradient(135deg, ${x.color}0d, ${x.color}1a)` : FPGA.white,
                  border: on ? `2px solid ${x.color}` : `1px solid ${FPGA.border}`,
                  borderRadius: '10px',
                  padding: '0.5rem 0.65rem',
                  boxShadow: on ? `0 4px 14px ${x.color}30` : '0 1px 3px rgba(0,0,0,0.04)',
                  transform: on ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}>
                  <div style={{
                    fontSize: '0.78rem', fontWeight: 800,
                    color: on ? x.color : FPGA.dark,
                    marginBottom: '0.25rem', lineHeight: 1.2,
                  }}>{x.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '0.6rem', color: FPGA.textLight }}>
                      범위: <strong style={{ color: FPGA.text }}>{x.scope}</strong>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: FPGA.textLight }}>
                      감사 적합:{' '}
                      <span style={{
                        fontWeight: 700, color: aRank.color,
                        background: `${aRank.color}15`,
                        padding: '0 5px', borderRadius: '3px',
                      }}>{aRank.label}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 중단: 선택 방법 상세 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '0.7rem' }}>
            {/* 좌: 장단점 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
              <div style={{
                background: FPGA.white,
                border: `1px solid ${m.color}25`,
                borderLeft: `3px solid ${m.color}`,
                borderRadius: '10px',
                padding: '0.6rem 0.8rem',
                boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: m.color, marginBottom: '0.3rem' }}>
                  상세 특성
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '4px 10px', fontSize: '0.68rem' }}>
                  <span style={{ color: FPGA.textLight }}>적용 범위</span>
                  <span style={{ color: FPGA.text, fontWeight: 600 }}>{m.scope}</span>
                  <span style={{ color: FPGA.textLight }}>지속 위치</span>
                  <span style={{ color: FPGA.text, fontWeight: 600 }}>{m.persistence}</span>
                  <span style={{ color: FPGA.textLight }}>감사 적합</span>
                  <span>
                    <span style={{
                      fontWeight: 700, color: aL.color,
                      background: `${aL.color}15`,
                      padding: '1px 7px', borderRadius: '3px',
                      fontSize: '0.66rem',
                    }}>{aL.label}</span>
                  </span>
                </div>
              </div>

              <div style={{
                background: 'rgba(72,187,120,0.06)',
                border: '1px solid rgba(72,187,120,0.25)',
                borderRadius: '10px',
                padding: '0.5rem 0.75rem',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#48BB78', marginBottom: '0.25rem' }}>
                  ✓ 장점
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.66rem', lineHeight: 1.6, color: FPGA.text }}>
                  {m.pros.map(p => <li key={p}>{p}</li>)}
                </ul>
              </div>

              <div style={{
                background: 'rgba(229,62,62,0.06)',
                border: '1px solid rgba(229,62,62,0.25)',
                borderRadius: '10px',
                padding: '0.5rem 0.75rem',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#E53E3E', marginBottom: '0.25rem' }}>
                  ✗ 단점
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.66rem', lineHeight: 1.6, color: FPGA.text }}>
                  {m.cons.map(c => <li key={c}>{c}</li>)}
                </ul>
              </div>
            </div>

            {/* 우: 예시 + 언제 쓰나 */}
            <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
              <div style={{
                background: '#1A2235',
                border: '1px solid #2D3748',
                borderRadius: '10px',
                padding: '0.6rem 0.8rem',
                boxShadow: shadow.card,
                flex: 1,
                minHeight: 0,
              }}>
                <div style={{
                  fontSize: '0.66rem', fontWeight: 700, color: '#6B8CC7',
                  marginBottom: '0.4rem',
                  fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em',
                }}>
                  ▸ 예제 — {m.name}
                </div>
                <pre style={{
                  margin: 0,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.68rem',
                  color: '#E8E8E8',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}>{m.example}</pre>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${m.color}0a, ${m.color}14)`,
                border: `1px solid ${m.color}30`,
                borderRadius: '10px',
                padding: '0.55rem 0.75rem',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: m.color, marginBottom: '0.25rem' }}>
                  ▪ 언제 사용?
                </div>
                <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.55 }}>
                  {m.when}
                </div>
              </div>

              {/* 요약 권장 */}
              <div style={{
                background: 'rgba(74,111,165,0.06)',
                border: '1px solid rgba(74,111,165,0.3)',
                borderRadius: '10px',
                padding: '0.5rem 0.75rem',
              }}>
                <div style={{ fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.55 }}>
                  <strong style={{ color: FPGA.primary }}>▸ 실무 우선순위:</strong>{' '}
                  <code style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.65rem',
                    color: '#48BB78',
                  }}>lint report item</code>
                  {' '}→{' '}
                  <code style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.65rem',
                    color: '#E8913A',
                  }}>lint suppress</code>
                  {' '}→{' '}
                  <code style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.65rem',
                    color: '#4A6FA5',
                  }}>pragma</code>
                  {' '}→{' '}
                  <code style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.65rem',
                    color: '#E53E3E',
                  }}>lint off</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
