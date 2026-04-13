'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * Day 02 — 실습 체크리스트 슬라이드
 */

const labTasks = [
  {
    num: 1,
    title: '예제 RTL 파일 준비',
    items: ['lint_demo_top.v (top 모듈 — 위반 없음, 3개 서브모듈 인스턴스)', 'ctrl_logic.v (Syntactic + Semantic)', 'state_machine.v (Structural) / reset_flop.v (Stylistic)'],
    color: '#4A6FA5',
    cmd: 'mkdir -p questa_lint_lab/rtl questa_lint_lab/scripts',
  },
  {
    num: 2,
    title: 'run_lint.tcl 스크립트 작성',
    items: ['lint methodology fpga -goal release 설정', 'vlib work / vmap work work 라이브러리 생성', 'vlog 4개 파일 컴파일 후 lint run -d lint_demo_top 으로 계층 전체 분석'],
    color: '#5B8C5A',
    cmd: 'qverify -od output_lint -c -do scripts/run_lint.tcl',
  },
  {
    num: 3,
    title: 'qverify 배치 실행',
    items: ['qverify -od output_lint -c -do scripts/run_lint.tcl 실행', 'Error / Warning / Info 메시지 콘솔 확인', 'output_lint/lint.rpt 파일 생성 확인'],
    color: '#8B6FA5',
    cmd: 'qverify -od output_lint -c -do scripts/run_lint.tcl',
  },
  {
    num: 4,
    title: 'GUI 리포트 검토',
    items: ['qverify output_lint/lint.db 로 GUI 실행', 'Lint Summary에서 4가지 카테고리 위반 확인', '각 violation 더블클릭 → 소스 위치 확인'],
    color: '#E8913A',
    cmd: 'qverify output_lint/lint.db',
  },
  {
    num: 5,
    title: '위반 수정 실습',
    items: ["ctrl_logic.v의 blocking '=' → '<=' 수정 후 재실행", '수정 전/후 lint.rpt Warning 건수 비교', 'Incremental 분석: lint run -d lint_demo_top -incr'],
    color: FPGA.primary,
    cmd: 'qverify -od output_lint -c -do scripts/run_lint.tcl  # 재실행',
  },
];

export default function LabSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습"
          title="Day 02 실습 체크리스트"
          subtitle="Questa Lint 첫 실행 — 단계별 진행"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {labTasks.map((task, i) => (
            <div key={task.num} style={{
              display: 'flex', alignItems: 'stretch', gap: '0.8rem',
            }}>
              {/* 번호 + 연결선 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '32px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: `${task.color}15`,
                  border: `2px solid ${task.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.82rem', fontWeight: 800, color: task.color, flexShrink: 0,
                }}>{task.num}</div>
                {i < labTasks.length - 1 && (
                  <div style={{ flex: 1, width: '2px', background: `${task.color}20`, marginTop: '3px' }} />
                )}
              </div>

              {/* 내용 */}
              <div style={{
                flex: 1,
                background: `linear-gradient(135deg, ${task.color}04, ${task.color}08)`,
                border: `1px solid ${task.color}18`,
                borderLeft: `3px solid ${task.color}`,
                borderRadius: '0 10px 10px 0',
                padding: '0.55rem 0.9rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
              }}>
                {/* 제목 + 체크리스트 */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: task.color, marginBottom: '0.2rem' }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                    {task.items.map((item) => (
                      <div key={item} style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '0.72rem', color: FPGA.text,
                      }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                          <rect x="0.75" y="0.75" width="11.5" height="11.5" rx="2.5" stroke={task.color} strokeWidth="1.2" fill={`${task.color}08`} />
                        </svg>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 명령어 */}
                <div style={{
                  background: '#1A2235',
                  borderRadius: '7px',
                  padding: '0.4rem 0.7rem',
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  color: '#A8D8A8',
                  flexShrink: 0,
                  maxWidth: '340px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}>
                  <span style={{ color: '#4A5568' }}>$ </span>{task.cmd}
                </div>
              </div>
            </div>
          ))}

          {/* 완료 조건 배너 */}
          <div style={{
            background: `linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.12))`,
            border: '1px solid rgba(72,187,120,0.3)',
            borderRadius: '10px',
            padding: '0.65rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            boxShadow: shadow.card,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8.5" stroke="#48BB78" strokeWidth="1.5" />
              <path d="M6 10l3 3 5-6" stroke="#48BB78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#48BB78' }}>실습 완료 조건: </span>
              <span style={{ fontSize: '0.76rem', color: FPGA.text }}>
                3개 예제 RTL 파일에서 총 4가지 Lint 위반(Syntactic 1 · Semantic 1 · Structural 1 · Stylistic 1)을 모두 검출하고,
                HTML 리포트에서 각 위반의 룰 ID를 확인합니다.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
