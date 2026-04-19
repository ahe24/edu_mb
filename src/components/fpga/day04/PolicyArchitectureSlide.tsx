'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * 정책 파일 구조 슬라이드
 * 3계층 정책 구조 + 권장 파일 레이아웃 + 로딩 순서
 */

const layers = [
  {
    level: 'L1',
    title: 'Methodology Goal',
    sub: 'Siemens 기본 제공',
    color: '#4A6FA5',
    cmd: 'lint methodology fpga -goal release',
    scope: '전사 표준',
    owner: 'Siemens EDA',
    desc: '벤더가 검증·튜닝한 체크 세트. 프로젝트 설정의 기준선(baseline).',
  },
  {
    level: 'L2',
    title: 'Project Preference',
    sub: '프로젝트 공통 정책',
    color: '#8B6FA5',
    cmd: 'do project_policy.tcl',
    scope: '프로젝트 전체',
    owner: 'Verif Lead',
    desc: '전사 기준선 위에 프로젝트 요건(벤더·안전등급) 반영. lint preference · lint off · severity 변경.',
  },
  {
    level: 'L3',
    title: 'Module Waiver',
    sub: '설계 모듈별 예외',
    color: '#E8913A',
    cmd: 'do waivers/alu_core.tcl  \n// lint_checking X off',
    scope: '모듈/파일/신호',
    owner: '모듈 Owner',
    desc: 'Tcl waiver 또는 inline pragma. RTL ID 기반 추적 가능. DO-254 근거 주석 필수.',
  },
];

const fileTree = [
  { indent: 0, name: 'project_root/', type: 'folder', note: '' },
  { indent: 1, name: 'scripts/', type: 'folder', note: '' },
  { indent: 2, name: 'run_lint.tcl', type: 'file', note: '← 메인 진입 — 아래 파일들을 순서대로 do' },
  { indent: 2, name: 'setup_env.tcl', type: 'file', note: '라이브러리·filelist 등 환경' },
  { indent: 1, name: 'policy/', type: 'folder', note: '' },
  { indent: 2, name: 'base_goal.tcl', type: 'file', note: 'lint methodology fpga -goal release' },
  { indent: 2, name: 'project_prefs.tcl', type: 'file', note: '프로젝트 공통 preference/off/severity' },
  { indent: 2, name: 'vendor_xilinx.tcl', type: 'file', note: '벤더별 오버라이드 (조건부 include)' },
  { indent: 1, name: 'waivers/', type: 'folder', note: '' },
  { indent: 2, name: 'global_waivers.tcl', type: 'file', note: '전역 waiver — 감사 근거 포함' },
  { indent: 2, name: 'alu_core.tcl', type: 'file', note: '모듈별 waiver 파일' },
  { indent: 2, name: 'fifo_ctrl.tcl', type: 'file', note: '' },
  { indent: 1, name: 'rtl/', type: 'folder', note: '← pragma waiver는 소스에 inline' },
];

export default function PolicyArchitectureSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Policy Architecture"
          title="정책 파일 3계층 구조"
          subtitle="기준선 → 프로젝트 → 모듈 — 하향식 오버라이드"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '0.9rem' }}>
          {/* 좌: 3계층 스택 */}
          <div style={{ flex: '1.15', display: 'flex', flexDirection: 'column', gap: '0.55rem', minWidth: 0 }}>
            {layers.map((L, i) => (
              <div key={L.level} style={{
                background: FPGA.white,
                border: `1px solid ${L.color}25`,
                borderLeft: `4px solid ${L.color}`,
                borderRadius: '10px',
                padding: '0.6rem 0.85rem',
                boxShadow: shadow.card,
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.7rem', fontWeight: 800,
                    color: '#fff', background: L.color,
                    padding: '2px 8px', borderRadius: '4px',
                    letterSpacing: '0.08em',
                  }}>{L.level}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: FPGA.dark }}>{L.title}</span>
                  <span style={{ fontSize: '0.68rem', color: FPGA.textLight, fontStyle: 'italic' }}>{L.sub}</span>
                </div>
                <pre style={{
                  margin: '0 0 0.4rem',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.66rem',
                  color: '#A8D8A8',
                  background: '#1A2235',
                  borderRadius: '5px',
                  padding: '0.3rem 0.55rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}>{L.cmd}</pre>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700,
                    color: L.color, background: `${L.color}10`,
                    padding: '1px 7px', borderRadius: '3px',
                    border: `1px solid ${L.color}20`,
                  }}>범위: {L.scope}</span>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700,
                    color: FPGA.textLight, background: '#F7FAFC',
                    padding: '1px 7px', borderRadius: '3px',
                    border: `1px solid ${FPGA.border}`,
                  }}>담당: {L.owner}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: FPGA.textLight, lineHeight: 1.5 }}>
                  {L.desc}
                </div>
                {i < layers.length - 1 && (
                  <div style={{
                    position: 'absolute', bottom: '-15px', left: '18px',
                    width: '2px', height: '12px',
                    background: `linear-gradient(to bottom, ${L.color}, ${layers[i + 1].color})`,
                    zIndex: 1,
                  }} />
                )}
              </div>
            ))}

            {/* 오버라이드 규칙 */}
            <div style={{
              background: `linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.12))`,
              border: `1px solid ${FPGA.primary}20`,
              borderRadius: '10px',
              padding: '0.55rem 0.8rem',
              marginTop: '0.15rem',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: FPGA.primary, marginBottom: '0.2rem' }}>
                오버라이드 원칙
              </div>
              <div style={{ fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.55 }}>
                뒤에 로드되는 명령이 앞의 설정을 덮어씀. L1→L2→L3 순서 준수, 로딩 순서가 바뀌면 정책 무효화 가능.
              </div>
            </div>
          </div>

          {/* 우: 파일 트리 + 로딩 순서 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: 0 }}>
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '12px',
              padding: '0.7rem 0.85rem',
              boxShadow: shadow.card,
              flex: 1,
              minHeight: 0,
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.5rem' }}>
                권장 파일 레이아웃
              </div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.68rem', lineHeight: 1.65 }}>
                {fileTree.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', paddingLeft: `${f.indent * 14}px` }}>
                    <span style={{
                      color: f.type === 'folder' ? FPGA.primary : FPGA.text,
                      fontWeight: f.type === 'folder' ? 700 : 500,
                      minWidth: '155px',
                    }}>
                      {f.type === 'folder' ? '📁 ' : '  '}{f.name}
                    </span>
                    {f.note && (
                      <span style={{
                        fontSize: '0.62rem',
                        color: FPGA.textLight,
                        fontFamily: '"Pretendard", sans-serif',
                        marginLeft: '6px',
                      }}>{f.note}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* run_lint.tcl 예시 */}
            <div style={{
              background: '#1A2235',
              border: `1px solid #2D3748`,
              borderRadius: '10px',
              padding: '0.6rem 0.8rem',
              boxShadow: shadow.card,
            }}>
              <div style={{
                fontSize: '0.66rem', fontWeight: 700, color: '#6B8CC7',
                marginBottom: '0.35rem',
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: '0.06em',
              }}>
                ▸ scripts/run_lint.tcl
              </div>
              <pre style={{
                margin: 0,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.65rem',
                color: '#E8E8E8',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}>
<span style={{ color: '#718096' }}># L1 — 기준선 Goal</span>{'\n'}
<span style={{ color: '#A8D8A8' }}>do</span> policy/base_goal.tcl{'\n'}{'\n'}
<span style={{ color: '#718096' }}># L2 — 프로젝트 정책 (벤더 조건부)</span>{'\n'}
<span style={{ color: '#A8D8A8' }}>do</span> policy/project_prefs.tcl{'\n'}
<span style={{ color: '#A8D8A8' }}>do</span> policy/vendor_xilinx.tcl{'\n'}{'\n'}
<span style={{ color: '#718096' }}># 컴파일</span>{'\n'}
vlib work; vmap work work{'\n'}
vlog -f scripts/filelist.f{'\n'}{'\n'}
<span style={{ color: '#718096' }}># L3 — 모듈별 waiver</span>{'\n'}
<span style={{ color: '#A8D8A8' }}>do</span> waivers/global_waivers.tcl{'\n'}
<span style={{ color: '#A8D8A8' }}>do</span> waivers/alu_core.tcl{'\n'}{'\n'}
<span style={{ color: '#A8D8A8' }}>lint run</span> -d top_module{'\n'}
<span style={{ color: '#A8D8A8' }}>lint generate report</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
