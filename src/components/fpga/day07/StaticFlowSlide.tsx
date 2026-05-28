'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';

const DAY07 = '#0891B2';

type TermLine = { t: string; c?: string };
const G = '#A8D8A8'; const B = '#6BB8D6'; const Y = '#E8C55A'; const R = '#F87171';
const OK = '#4ADE80'; const H = '#C4B5FD'; const D = '#64748B'; const W = '#CBD5E1';

const steps: { n: string; name: string; cmd: string; col: string; lines: TermLine[] }[] = [
  {
    n: '1', name: 'Compile', cmd: 'vlog -f filelist', col: '#4A6FA5',
    lines: [
      { t: '$ vlog rtl/*.v', c: G },
      { t: '-- Compiling module cdc_demo_top', c: W },
      { t: '-- Compiling module adc_capture', c: W },
      { t: '-- Compiling module async_fifo', c: W },
      { t: '-- Compiling module threshold_logic', c: W },
      { t: '-- Compiling module bus_iface', c: W },
      { t: '-- Compiling module sync_2dff', c: W },
      { t: '-- Compiling module sync_pulse', c: W },
      { t: '', c: D },
      { t: 'Top level modules:', c: H },
      { t: '    cdc_demo_top', c: W },
      { t: 'Errors: 0, Warnings: 0', c: OK },
    ],
  },
  {
    n: '2', name: 'Setup', cmd: 'do directives.tcl', col: DAY07,
    lines: [
      { t: '> do scripts/directives.tcl', c: G },
      { t: '', c: D },
      { t: 'netlist clock adc_clk  -period 20', c: B },
      { t: 'netlist clock proc_clk -period 10', c: B },
      { t: 'netlist clock bus_clk  -period 25', c: B },
      { t: '', c: D },
      { t: 'cdc scheme on fifo handshake', c: B },
      { t: '', c: D },
      { t: 'cdc methodology fpga -goal start', c: B },
      { t: 'Info: Loaded goal \'start\'  [cdc-75]', c: OK },
      { t: '', c: D },
      { t: '✓ 3 clocks / FIFO+handshake / FPGA', c: OK },
    ],
  },
  {
    n: '3', name: 'Run', cmd: 'cdc run -d top', col: '#0E7C7B',
    lines: [
      { t: '> cdc run -d cdc_demo_top', c: G },
      { t: 'Processing 10 CDC signals...', c: W },
      { t: '', c: D },
      { t: 'Violations (5)', c: R },
      { t: '  no_sync                      (3)', c: R },
      { t: '  combo_logic                  (1)', c: R },
      { t: '  multi_bits                   (1)', c: R },
      { t: '', c: D },
      { t: 'Evaluations (4)', c: B },
      { t: '  bus_two_dff / pulse / fifo', c: W },
      { t: '', c: D },
      { t: 'Proven (1)  — auto-proven', c: OK },
      { t: '  two_dff                      (1)', c: OK },
    ],
  },
];

// ── 전체 플로우 애니메이션 로그 (compile → setup → run → results) ──
type AnimLine = { t: string; c?: string; delay?: number };  // delay: ms before showing this line

const fullFlowLog: AnimLine[] = [
  // ── Phase 1: Compile ──
  { t: '═══════════════════════════════════════════════════════════', c: H },
  { t: '  Phase 1 / 3 — Compile', c: H },
  { t: '═══════════════════════════════════════════════════════════', c: H },
  { t: '', delay: 200 },
  { t: '$ vlib work && vmap work work', c: G, delay: 400 },
  { t: '** Note: \'modelsim.ini\' is used as the ini file.', c: D, delay: 150 },
  { t: '', delay: 100 },
  { t: '$ vlog rtl/cdc_demo_top.v rtl/adc_capture.v rtl/async_fifo.v \\', c: G, delay: 300 },
  { t: '       rtl/threshold_logic.v rtl/bus_iface.v rtl/sync_2dff.v rtl/sync_pulse.v', c: G },
  { t: '', delay: 100 },
  { t: '-- Compiling module cdc_demo_top', c: W, delay: 80 },
  { t: '-- Compiling module adc_capture', c: W, delay: 80 },
  { t: '-- Compiling module async_fifo', c: W, delay: 80 },
  { t: '-- Compiling module threshold_logic', c: W, delay: 80 },
  { t: '-- Compiling module bus_iface', c: W, delay: 80 },
  { t: '-- Compiling module sync_2dff', c: W, delay: 80 },
  { t: '-- Compiling module sync_pulse', c: W, delay: 80 },
  { t: '', delay: 100 },
  { t: 'Top level modules:  cdc_demo_top', c: H, delay: 150 },
  { t: 'Errors: 0, Warnings: 0', c: OK, delay: 200 },
  { t: '', delay: 300 },

  // ── Phase 2: Setup (directives) ──
  { t: '═══════════════════════════════════════════════════════════', c: H },
  { t: '  Phase 2 / 3 — Setup (directives.tcl)', c: H },
  { t: '═══════════════════════════════════════════════════════════', c: H },
  { t: '', delay: 200 },
  { t: '> do scripts/directives.tcl', c: G, delay: 400 },
  { t: '', delay: 150 },
  { t: 'netlist clock adc_clk  -period 20     # 50 MHz', c: B, delay: 200 },
  { t: 'netlist clock proc_clk -period 10     # 100 MHz', c: B, delay: 200 },
  { t: 'netlist clock bus_clk  -period 25     # 40 MHz', c: B, delay: 200 },
  { t: '', delay: 100 },
  { t: 'cdc scheme on fifo handshake', c: B, delay: 200 },
  { t: 'cdc methodology fpga -goal start', c: B, delay: 200 },
  { t: 'Info  : Loaded goal. Goal \'start\'.                        [cdc-75]', c: OK, delay: 200 },
  { t: '', delay: 300 },

  // ── Phase 3: CDC Run ──
  { t: '═══════════════════════════════════════════════════════════', c: H },
  { t: '  Phase 3 / 3 — CDC Run', c: H },
  { t: '═══════════════════════════════════════════════════════════', c: H },
  { t: '', delay: 200 },
  { t: '> cdc run -d cdc_demo_top', c: G, delay: 400 },
  { t: '', delay: 200 },
  { t: '### Starting Step: netlist elaborate ###', c: D, delay: 300 },
  { t: '## Elaborating Design...', c: W, delay: 150 },
  { t: '-- Loading module z0in_work.cdc_demo_top', c: D, delay: 60 },
  { t: '-- Loading module z0in_work.adc_capture', c: D, delay: 60 },
  { t: '-- Loading module z0in_work.async_fifo', c: D, delay: 60 },
  { t: '-- Loading module z0in_work.sync_2dff', c: D, delay: 60 },
  { t: '-- Loading module z0in_work.threshold_logic', c: D, delay: 60 },
  { t: 'Optimized design name is zi_opt_cdc_321454262_1', c: D, delay: 100 },
  { t: '', delay: 200 },
  { t: '### Starting Step: cdc setup ###', c: D, delay: 300 },
  { t: 'CDC netlist complexity: 408', c: W, delay: 150 },
  { t: 'Info  : Reset detection done. 1 reset identified.         [reset-4]', c: B, delay: 150 },
  { t: 'Info  : Clock processing done. 3 clocks (3 user-spec).    [cdc-44]', c: B, delay: 150 },
  { t: '', delay: 100 },
  { t: 'Error : Primary port → multiple clock domains. Pin \'rst\'. [hdl-41]', c: R, delay: 200 },
  { t: 'Warn  : Missing clock domain for reset port \'rst\'.        [hdl-289]', c: Y, delay: 100 },
  { t: 'Warn  : Missing port domain — sensor_data_in              [hdl-51]', c: Y, delay: 80 },
  { t: 'Warn  : Missing port domain — sensor_valid_in             [hdl-51]', c: Y, delay: 80 },
  { t: 'Warn  : Missing port domain — host_addr, host_wdata       [hdl-51]', c: Y, delay: 80 },
  { t: 'Warn  : Missing port domain — host_we, host_re            [hdl-51]', c: Y, delay: 80 },
  { t: 'Warn  : Inferred reset present.                           [hdl-238]', c: Y, delay: 100 },
  { t: '', delay: 200 },
  { t: 'Summary: 1 Error, 9 Warnings in cdc setup', c: R, delay: 300 },
  { t: '', delay: 300 },
  { t: '### Starting Step: cdc run ###', c: D, delay: 300 },
  { t: '## Analyzing CDC Design...', c: W, delay: 200 },
  { t: 'Processing 10 CDC signals after duplicate removal.', c: W, delay: 200 },
  { t: 'Processing control signals.', c: D, delay: 100 },
  { t: 'Processing data signals.', c: D, delay: 100 },
  { t: 'Processing FIFO.', c: D, delay: 100 },
  { t: 'Warn  : Reconvergence is not enabled.                     [hdl-271]', c: Y, delay: 150 },
  { t: '', delay: 400 },

  // ── Results ──
  { t: '╔═════════════════════════════════════════════════════════╗', c: H },
  { t: '║  CDC Results                                            ║', c: H },
  { t: '╚═════════════════════════════════════════════════════════╝', c: H, delay: 300 },
  { t: '', delay: 100 },
  { t: 'Total number of checks                                (10)', c: B, delay: 200 },
  { t: '', delay: 150 },
  { t: 'Violations (5)', c: R, delay: 250 },
  { t: '  no_sync — Single-bit without synchronizer           (3)', c: R, delay: 120 },
  { t: '  combo_logic — Combinational before synchronizer      (1)', c: R, delay: 120 },
  { t: '  multi_bits — Multi-bit across clock boundary         (1)', c: R, delay: 120 },
  { t: '', delay: 150 },
  { t: 'Evaluations (4)', c: B, delay: 250 },
  { t: '  bus_two_dff — Multi-bit DFF synchronized             (2)', c: W, delay: 120 },
  { t: '  pulse_sync — Pulse synchronization                   (1)', c: W, delay: 120 },
  { t: '  fifo — FIFO synchronization                          (1)', c: W, delay: 120 },
  { t: '', delay: 150 },
  { t: 'Proven (1)  — auto-proven', c: OK, delay: 250 },
  { t: '  two_dff — Single-bit DFF synchronized                (1)', c: OK, delay: 120 },
  { t: '', delay: 300 },
  { t: '───────────────────────────────────────────────────────────' },
  { t: 'Summary: 1 Error, 11 Warnings — 5 violations detected', c: R, delay: 200 },
  { t: 'Total time: 4s, Max memory: 308 MB', c: D, delay: 150 },
  { t: '', delay: 200 },
  { t: '→ qverify cdc_result/cdc.db   # GUI debug 시작', c: G, delay: 300 },
];

const severities = [
  { name: 'Violation', desc: '구조적 오류 · 반드시 수정', col: '#E53E3E' },
  { name: 'Caution', desc: 'Protocol 검증 필요 · SVA promote', col: '#E8913A' },
  { name: 'Evaluation', desc: '정상 sync · 추가 검증 권장', col: '#4A6FA5' },
  { name: 'Proven', desc: 'Formal 증명 완료', col: '#48BB78' },
];

export default function StaticFlowSlide() {
  const [showGui, setShowGui] = useState(false);
  const [showFlow, setShowFlow] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  // 라인을 하나씩 추가하는 재귀 타이머
  useEffect(() => {
    if (!showFlow) return;
    setVisibleLines(0);

    let idx = 0;
    const addNext = () => {
      if (idx >= fullFlowLog.length) return;
      idx++;
      setVisibleLines(idx);
      const nextDelay = fullFlowLog[idx]?.delay ?? 60;
      timerRef.current = setTimeout(addNext, nextDelay);
    };
    timerRef.current = setTimeout(addNext, 300);

    return clearTimers;
  }, [showFlow, clearTimers]);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const closeFlow = () => {
    clearTimers();
    setShowFlow(false);
    setVisibleLines(0);
  };

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="분석 단계별 산출물"
          title="정적 CDC 분석 흐름 + 산출물"
          subtitle="Compile → Setup → Run → Debug · 4단계 · 결과 등급 4종"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Step 1~3: 인라인 터미널 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', flex: 1, minHeight: 0 }}>
            {steps.map((s, si) => (
              <div key={s.n}
                onClick={s.n === '3' ? () => setShowFlow(true) : undefined}
                style={{
                  background: FPGA.white,
                  border: `1px solid ${s.col}25`,
                  borderTop: `3px solid ${s.col}`,
                  borderRadius: '10px',
                  boxShadow: shadow.card,
                  display: 'flex', flexDirection: 'column',
                  overflow: 'hidden',
                  cursor: s.n === '3' ? 'pointer' : 'default',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={s.n === '3' ? (e) => { e.currentTarget.style.boxShadow = shadow.cardHover; e.currentTarget.style.transform = 'translateY(-2px)'; } : undefined}
                onMouseLeave={s.n === '3' ? (e) => { e.currentTarget.style.boxShadow = shadow.card; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
              >
                {/* 카드 헤더 */}
                <div style={{ padding: '0.45rem 0.65rem 0.3rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: `${s.col}20`, border: `2px solid ${s.col}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, color: s.col,
                  }}>{s.n}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: FPGA.dark }}>{s.name}</span>
                  {si < steps.length - 1 && (
                    <svg width="14" height="14" viewBox="0 0 14 14" style={{ marginLeft: 'auto', opacity: 0.3 }}>
                      <path d="M2 7h8M7 4l3 3-3 3" stroke={FPGA.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                {/* 인라인 터미널 */}
                <div style={{
                  flex: 1, minHeight: 0,
                  background: '#0f172a',
                  margin: '0 0.4rem 0.4rem',
                  borderRadius: '6px',
                  padding: '0.35rem 0.5rem',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.54rem',
                  lineHeight: 1.55,
                  overflowY: 'auto',
                }}>
                  {s.lines.map((line, i) => (
                    <div key={i} style={{ color: line.c, whiteSpace: 'pre-wrap' }}>
                      {line.t || '\u00A0'}
                    </div>
                  ))}
                  {s.n === '3' && (
                    <div style={{ color: '#0E7C7B', fontWeight: 600, marginTop: '0.2rem' }}>
                      ▸ 클릭: 전체 실행 데모
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 하단: Step4 Debug + 결과 등급 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.5rem' }}>
            {/* Step 4 — Debug 카드 (클릭 → GUI 이미지) */}
            <div
              onClick={() => setShowGui(true)}
              style={{
                background: `linear-gradient(135deg, #8B6FA506, #8B6FA514)`,
                border: '1px solid #8B6FA525',
                borderTop: '3px solid #8B6FA5',
                borderRadius: '10px',
                padding: '0.55rem 0.75rem',
                boxShadow: shadow.card,
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = shadow.cardHover; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadow.card; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: '#8B6FA520', border: '2px solid #8B6FA5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 800, color: '#8B6FA5',
                }}>4</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: FPGA.dark }}>Debug</span>
                <code style={{
                  fontSize: '0.6rem', background: '#1A2235', color: '#A8D8A8',
                  padding: '2px 6px', borderRadius: '3px',
                  fontFamily: '"JetBrains Mono", monospace',
                  marginLeft: 'auto',
                }}>qverify cdc.db</code>
              </div>
              <div style={{ fontSize: '0.68rem', color: FPGA.text, lineHeight: 1.5 }}>
                GUI에서 CDC Checks → Schematic → Source 연동 디버그 · Set Status → status.tcl export
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.25rem', fontSize: '0.58rem' }}>
                {['cdc.db', 'cdc.rpt', 'cdc_detail.rpt', 'cdc_design.rpt', 'cdc_setting.rpt', 'cdc_run.log'].map((f) => (
                  <code key={f} style={{
                    background: `${DAY07}10`, color: DAY07,
                    padding: '1px 5px', borderRadius: '3px',
                    fontFamily: '"JetBrains Mono", monospace',
                    border: `1px solid ${DAY07}20`,
                    textAlign: 'center',
                  }}>{f}</code>
                ))}
              </div>
              <div style={{ fontSize: '0.58rem', color: '#8B6FA5', fontWeight: 600 }}>
                ▸ 클릭하여 GUI 화면 확인
              </div>
            </div>

            {/* 결과 등급 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.55rem 0.75rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.3rem',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: FPGA.dark }}>
                결과 등급 — 심각도
              </div>
              {severities.map((s) => (
                <div key={s.name} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: `${s.col}08`,
                  border: `1px solid ${s.col}25`,
                  borderLeft: `3px solid ${s.col}`,
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                }}>
                  <span style={{
                    fontSize: '0.66rem', fontWeight: 800,
                    color: s.col, minWidth: '72px',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}>{s.name}</span>
                  <span style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.4 }}>{s.desc}</span>
                </div>
              ))}
              <div style={{ fontSize: '0.58rem', color: FPGA.textLight, fontStyle: 'italic' }}>
                Status: Uninspected → Waived / Fixed / Verified / Pending / Bug
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GUI 스크린샷 모달 */}
      {/* 전체 플로우 실행 데모 모달 */}
      <SlideModal open={showFlow} onClose={closeFlow}>
        <div onClick={(e) => e.stopPropagation()} style={{
          maxWidth: '800px', width: '85vw',
          borderRadius: '10px', overflow: 'hidden',
          boxShadow: shadow.deep,
        }}>
          {/* 터미널 타이틀 바 */}
          <div style={{
            background: '#1e293b', padding: '0.45rem 0.8rem',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E' }} />
            <span style={{
              flex: 1, textAlign: 'center',
              fontSize: '0.72rem', color: '#94A3B8',
              fontFamily: '"JetBrains Mono", monospace',
            }}>
              Questa CDC 2025.3 — Full Analysis Flow Demo
            </span>
          </div>
          {/* 로그 영역 */}
          <div ref={scrollRef} style={{
            background: '#0f172a',
            padding: '0.7rem 1rem',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.72rem',
            lineHeight: 1.65,
            height: '55vh',
            overflowY: 'auto',
          }}>
            {fullFlowLog.slice(0, visibleLines).map((line, i) => (
              <div key={i} style={{ color: line.c ?? W, whiteSpace: 'pre-wrap' }}>
                {line.t || '\u00A0'}
              </div>
            ))}
            {visibleLines < fullFlowLog.length && (
              <span style={{ color: '#4ADE80' }}>▌</span>
            )}
          </div>
        </div>
      </SlideModal>

      <SlideModal open={showGui} onClose={() => setShowGui(false)}>
        <div onClick={(e) => e.stopPropagation()} style={{
          maxWidth: '900px', width: '90vw', lineHeight: 0,
          borderRadius: '10px', overflow: 'hidden',
          boxShadow: shadow.deep,
        }}>
          <div style={{
            background: '#1e293b', padding: '0.5rem 0.8rem',
            fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1',
            fontFamily: '"JetBrains Mono", monospace',
          }}>
            Step 4 — qverify GUI Debug
          </div>
          <img
            src="/images/fpga/tool_questa_cdc.png"
            alt="Questa CDC GUI — CDC Checks, Schematic, Source Browser"
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      </SlideModal>
    </section>
  );
}
