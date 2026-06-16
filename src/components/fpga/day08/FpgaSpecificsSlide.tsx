'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';
import cdcReports from './cdcReports.json';

const DAY08 = '#0E7C7B';

/**
 * 실제 qverify CDC 실행으로 생성된 산출물 파일 (lab/questa_cdc_lab/cdc_result/).
 * 본문(body)은 실제 리포트 파일 전체 내용을 그대로(verbatim) 가져온다 — cdcReports.json.
 */
const REPORT_FILES: { name: keyof typeof cdcReports; desc: string }[] = [
  { name: 'cdc.rpt', desc: '요약 리포트 — clock/reset summary + CDC results + design info (Section 1~10)' },
  { name: 'cdc_detail.rpt', desc: 'Crossing별 상세 — start/end 신호 + source line + 검토 status' },
  { name: 'cdc_setting.rpt', desc: '적용된 directive 전체 — clock/reset 정의 + scheme + methodology' },
];

export default function FpgaSpecificsSlide() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const openModal = (tab: number) => {
    setActiveTab(tab);
    setModalOpen(true);
  };

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="FPGA 환경 고유 처리"
          title="FPGA 특화 이슈 + V&V 산출물"
          subtitle="Vendor library / IP black box / Hierarchical Data Model · safety-critical 산출물"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* 상단 — FPGA 4-phase */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY08}06, ${DAY08}14)`,
            border: `1px solid ${DAY08}30`,
            borderLeft: `4px solid ${DAY08}`,
            borderRadius: '10px',
            padding: '0.55rem 0.9rem',
            boxShadow: shadow.card,
            display: 'flex', alignItems: 'center', gap: '0.8rem',
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.72rem', fontWeight: 800,
              color: '#fff', background: DAY08,
              padding: '3px 10px', borderRadius: '5px',
              letterSpacing: '0.06em',
            }}>4-Phase</span>
            <span style={{ fontSize: '0.74rem', color: FPGA.text, lineHeight: 1.5 }}>
              ① <strong>FPGA libs</strong> compile → ② <strong>Design</strong> compile → ③ <strong>Clock model</strong> create → ④ <strong>GUI debug</strong>
            </span>
          </div>

          {/* 3개 이슈 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
            {/* Vendor library */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${DAY08}25`,
              borderTop: `3px solid ${DAY08}`,
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: FPGA.dark }}>
                Vendor Library
              </div>
              <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.55 }}>
                Sim용 unisim/simprim은 <strong>비합성</strong>. CDC는 netlist 기반 → 합성 가능 버전 필요.
              </div>
              <pre style={{
                margin: 0, fontSize: '0.62rem', lineHeight: 1.5,
                background: '#1A2235', color: '#A8D8A8',
                padding: '0.45rem 0.65rem', borderRadius: '5px',
                fontFamily: 'ui-monospace, monospace',
                whiteSpace: 'pre-wrap',
              }}>
{`# pre-compiled libs 권장
netlist fpga xilinx
netlist fpga directory <path>`}
              </pre>
              <div style={{ fontSize: '0.64rem', color: FPGA.textLight, fontStyle: 'italic' }}>
                Xilinx · Altera · Microchip 제공.
              </div>
            </div>

            {/* IP Black Box */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${DAY08}25`,
              borderTop: `3px solid ${DAY08}`,
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: FPGA.dark }}>
                Vendor IP Black Box
              </div>
              <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.55 }}>
                암호화 IP · 비합성 IP는 자동 black box. Port domain 명시 필수.
              </div>
              <pre style={{
                margin: 0, fontSize: '0.62rem', lineHeight: 1.5,
                background: '#1A2235', color: '#A8D8A8',
                padding: '0.45rem 0.65rem', borderRadius: '5px',
                fontFamily: 'ui-monospace, monospace',
                whiteSpace: 'pre-wrap',
              }}>
{`netlist blackbox altdpram
netlist port domain wraddr \\
  -clock inclock -module altdpram`}
              </pre>
              <div style={{ fontSize: '0.64rem', color: FPGA.textLight, fontStyle: 'italic' }}>
                DPRAM · async FIFO IP에 자주 적용.
              </div>
            </div>

            {/* HDM */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${DAY08}25`,
              borderTop: `3px solid ${DAY08}`,
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: FPGA.dark }}>
                Hierarchical Data Model
              </div>
              <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.55 }}>
                대형 설계는 block별 CDC → top 통합. Block 결과를 abstract model로.
              </div>
              <pre style={{
                margin: 0, fontSize: '0.62rem', lineHeight: 1.5,
                background: '#1A2235', color: '#A8D8A8',
                padding: '0.45rem 0.65rem', borderRadius: '5px',
                fontFamily: 'ui-monospace, monospace',
                whiteSpace: 'pre-wrap',
              }}>
{`hier block -user_specified mod_A
hier port domain p1 \\
  -clock clk_a -module mod_A`}
              </pre>
              <div style={{ fontSize: '0.64rem', color: FPGA.textLight, fontStyle: 'italic' }}>
                Bottom-up / Top-down 지원.
              </div>
            </div>
          </div>

          {/* 하단 — 실제 CDC 분석 결과 (V&V 산출물 증빙) */}
          <div style={{
            flex: 1, minHeight: 0,
            background: 'linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.14))',
            border: '1px solid rgba(72,187,120,0.30)',
            borderLeft: '4px solid #48BB78',
            borderRadius: '10px',
            padding: '0.6rem 0.85rem',
            boxShadow: shadow.card,
            display: 'flex', flexDirection: 'column', gap: '0.4rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#48BB78' }}>
                Safety-Critical V&V 산출물 — 실제 CDC 분석 결과
              </span>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: '0.6rem', fontWeight: 700,
                color: FPGA.textLight, letterSpacing: '0.02em',
              }}>cdc_demo_top · qverify 2025.3 · 3 clock domains · 167 reg bits</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.18fr 1fr', gap: '0.55rem', minHeight: 0 }}>
              {/* 좌 — 실제 CDC Summary (cdc.rpt Section 3) · 클릭 시 전체 리포트 */}
              <div
                onClick={() => openModal(0)}
                style={{
                  position: 'relative',
                  background: '#1A2235', borderRadius: '7px',
                  padding: '0.5rem 0.7rem',
                  fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
                  boxShadow: shadow.inset,
                  display: 'flex', flexDirection: 'column', gap: '0.2rem',
                  cursor: 'zoom-in',
                }}
              >
                <div style={{ fontSize: '0.62rem', color: '#7C90B0', borderBottom: '1px solid #2C3850', paddingBottom: '0.22rem', marginBottom: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ color: '#5EC5C0' }}>cdc.rpt</span> :: Section 3 — CDC Results
                  <span style={{ marginLeft: 'auto', color: '#5EC5C0', fontSize: '0.6rem' }}>🔍 전체 보기</span>
                </div>
                {[
                  { mark: '', c: '#C7D2E8', label: 'Total number of checks', n: '10', extra: '' },
                  { mark: '✗', c: '#FF7B72', label: 'Violations', n: '5', extra: 'no_sync·3  combo·1  multi_bits·1' },
                  { mark: '✓', c: '#7EE787', label: 'Evaluations', n: '4', extra: 'fifo·1  pulse·1  bus_2dff·2' },
                  { mark: '●', c: '#79C0FF', label: 'Proven', n: '1', extra: 'two_dff·1' },
                ].map((r) => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', fontSize: '0.68rem', lineHeight: 1.35 }}>
                    <span style={{ color: r.c, width: '0.7rem', textAlign: 'center', flexShrink: 0 }}>{r.mark}</span>
                    <span style={{ color: '#C7D2E8', flex: 1 }}>{r.label}</span>
                    <span style={{ color: r.c, fontWeight: 800 }}>{r.n}</span>
                    {r.extra && <span style={{ color: '#8395B5', fontSize: '0.6rem', flexBasis: '100%', paddingLeft: '1.1rem' }}>{r.extra}</span>}
                  </div>
                ))}
              </div>

              {/* 우 — 실제 violation crossing 예시 (cdc_detail.rpt) · 클릭 시 전체 리포트 */}
              <div
                onClick={() => openModal(1)}
                style={{
                  background: FPGA.white,
                  border: '1px solid rgba(229,62,62,0.30)',
                  borderLeft: '3px solid #E53E3E',
                  borderRadius: '7px',
                  padding: '0.45rem 0.6rem',
                  display: 'flex', flexDirection: 'column', gap: '0.22rem',
                  cursor: 'zoom-in',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.danger }}>Violation 예시</span>
                  <code style={{
                    fontSize: '0.6rem', color: FPGA.danger, background: 'rgba(229,62,62,0.10)',
                    padding: '1px 6px', borderRadius: '3px', fontFamily: 'monospace',
                    border: '1px solid rgba(229,62,62,0.30)',
                  }}>no_sync</code>
                  <span style={{ fontSize: '0.6rem', color: FPGA.textLight, marginLeft: 'auto', fontStyle: 'italic' }}>uninspected</span>
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: FPGA.dark, fontFamily: '"JetBrains Mono", monospace' }}>
                  proc_clk <span style={{ color: FPGA.danger }}>→</span> bus_clk
                </div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.62rem', lineHeight: 1.5, color: FPGA.text }}>
                  <div><span style={{ color: FPGA.textLight }}>start </span>u_proc.trip_active <span style={{ color: FPGA.primary }}>threshold_logic.v:26</span></div>
                  <div><span style={{ color: FPGA.textLight }}>end&nbsp;&nbsp;&nbsp;</span>u_bus.host_rdata[0] <span style={{ color: FPGA.primary }}>bus_iface.v:39</span></div>
                </div>
                <div style={{ fontSize: '0.6rem', color: FPGA.textLight, fontFamily: 'monospace', marginTop: 'auto' }}>
                  ID: no_sync_12970 · <span style={{ color: '#48BB78', fontWeight: 700 }}>🔍 cdc_detail.rpt 전체 보기</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', fontSize: '0.64rem', color: FPGA.textLight }}>
              <span style={{ fontStyle: 'italic' }}>산출물 (클릭하여 열기):</span>
              {REPORT_FILES.map((f, i) => (
                <code
                  key={f.name}
                  onClick={() => openModal(i)}
                  style={{
                    fontFamily: 'monospace', fontSize: '0.62rem', color: '#2F855A',
                    background: 'rgba(72,187,120,0.12)', border: '1px solid rgba(72,187,120,0.35)',
                    padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700,
                  }}
                >{f.name}</code>
              ))}
              <span style={{ fontStyle: 'italic' }}>· DO-254 §6.2 / IEC 62566 V&V plan에 분석 결과 + 수정 trace + waiver 근거로 첨부.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 산출물 리포트 모달 — 실제 파일 내용 (readable font) */}
      <SlideModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        contentStyle={{
          width: 'min(880px, 92vw)', maxHeight: '88vh',
          background: '#0F1626', borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          border: '1px solid #2C3850',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* 헤더 + 탭 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderBottom: '1px solid #2C3850', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#5EC5C0', fontFamily: '"JetBrains Mono", monospace' }}>
            cdc_result/
          </span>
          <span style={{ fontSize: '0.66rem', color: '#7C90B0' }}>
            qverify -od cdc_result -c -do scripts/run_cdc.tcl
          </span>
          <button
            onClick={() => setModalOpen(false)}
            style={{
              marginLeft: 'auto', background: 'transparent', border: '1px solid #3A4860',
              color: '#9FB0CC', borderRadius: '6px', padding: '2px 10px', cursor: 'pointer',
              fontSize: '0.74rem', fontWeight: 700,
            }}
          >✕ 닫기 (Esc)</button>
        </div>

        <div style={{ display: 'flex', gap: '0.3rem', padding: '0.55rem 1rem 0', flexWrap: 'wrap' }}>
          {REPORT_FILES.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setActiveTab(i)}
              style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', fontWeight: 700,
                padding: '5px 12px', borderRadius: '6px 6px 0 0', cursor: 'pointer',
                border: '1px solid #2C3850', borderBottom: 'none',
                background: activeTab === i ? '#16203A' : 'transparent',
                color: activeTab === i ? '#7EE787' : '#7C90B0',
              }}
            >{f.name}</button>
          ))}
        </div>

        {/* 본문 — 실제 리포트 내용 (전체 verbatim) */}
        <div style={{ padding: '0.4rem 1rem 0.2rem', fontSize: '0.7rem', color: '#9FB0CC', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{REPORT_FILES[activeTab].desc}</span>
          <span style={{ marginLeft: 'auto', flexShrink: 0, fontStyle: 'normal', color: '#5EC5C0', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.64rem' }}>
            {cdcReports[REPORT_FILES[activeTab].name].split('\n').length} lines · 전체 내용
          </span>
        </div>
        <pre style={{
          margin: 0, flex: 1, minHeight: 0, overflow: 'auto',
          padding: '0.6rem 1.1rem 1rem',
          background: '#16203A',
          fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
          fontSize: '0.82rem', lineHeight: 1.55, color: '#C7D2E8',
          whiteSpace: 'pre',
        }}>
          {cdcReports[REPORT_FILES[activeTab].name]}
        </pre>
      </SlideModal>
    </section>
  );
}
