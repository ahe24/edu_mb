'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY08 = '#0E7C7B';

export default function CaseNoSyncSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="CASE 1 · no_sync"
          title="단일 bit 미동기 — 가장 흔한 violation"
          subtitle="trip_active (proc_clk → bus_clk) · sync 없이 host_rdata로 직결"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* 디버그 절차 + scheme 정보 */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY08}06, ${DAY08}14)`,
            border: `1px solid ${DAY08}30`,
            borderLeft: `4px solid ${DAY08}`,
            borderRadius: '10px',
            padding: '0.5rem 0.85rem',
            boxShadow: shadow.card,
            display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.72rem', fontWeight: 800,
              color: '#fff', background: '#E53E3E',
              padding: '3px 10px', borderRadius: '5px',
              letterSpacing: '0.06em',
            }}>Violation</span>
            <div style={{ fontSize: '0.78rem', color: FPGA.text, flex: 1, lineHeight: 1.5 }}>
              CDC report: <code>proc_clk : start : u_proc.trip_active → bus_clk : end : u_bus.host_rdata[0]</code>
            </div>
            <code style={{
              fontSize: '0.62rem', background: '#1A2235', color: '#F0A0A0',
              padding: '3px 8px', borderRadius: '4px', fontFamily: 'monospace',
            }}>no_sync_12970</code>
          </div>

          {/* Before / After */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
            <div style={{
              background: '#1A2235',
              borderLeft: '3px solid #E53E3E',
              borderRadius: '8px',
              padding: '0.55rem 0.8rem',
              fontFamily: '"JetBrains Mono", Consolas, monospace',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.6rem', color: '#E53E3E', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.06em' }}>
                ✗ BEFORE · 직결
              </div>
              <pre style={{ margin: 0, fontSize: '0.62rem', lineHeight: 1.5, color: '#D4D4D4', whiteSpace: 'pre-wrap', fontFamily: '"JetBrains Mono", Consolas, monospace' }}>
                <span style={{ color: '#6A9955' }}>// cdc_demo_top.v</span>{"\n"}
                <span style={{ color: '#4EC9B0' }}>bus_iface</span> <span style={{ color: '#DCDCAA' }}>u_bus</span> ({"\n"}
                {"  "}.<span style={{ color: '#9CDCFE' }}>clk</span>         (bus_clk),{"\n"}
                {"  "}.<span style={{ color: '#9CDCFE' }}>trip_active</span> (<span style={{ color: '#E53E3E', fontWeight: 'bold', textDecoration: 'underline' }}>trip_active_proc</span>),  <span style={{ color: '#6A9955' }}>// ← raw</span>{"\n"}
                {"  "}...{"\n"}
                );
              </pre>
            </div>

            <div style={{
              background: '#1A2235',
              borderLeft: '3px solid #48BB78',
              borderRadius: '8px',
              padding: '0.55rem 0.8rem',
              fontFamily: '"JetBrains Mono", Consolas, monospace',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.6rem', color: '#48BB78', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.06em' }}>
                ✓ AFTER · 2DFF 추가
              </div>
              <pre style={{ margin: 0, fontSize: '0.62rem', lineHeight: 1.5, color: '#D4D4D4', whiteSpace: 'pre-wrap', fontFamily: '"JetBrains Mono", Consolas, monospace' }}>
                <span style={{ color: '#569CD6' }}>wire</span> <span style={{ color: '#9CDCFE' }}>trip_active_bus</span>;{"\n"}
                <span style={{ color: '#4EC9B0' }}>sync_2dff</span> <span style={{ color: '#569CD6' }}>#(.W(1))</span> <span style={{ color: '#DCDCAA' }}>u_sync_trip</span> ({"\n"}
                {"  "}.<span style={{ color: '#9CDCFE' }}>clk</span> (bus_clk), .<span style={{ color: '#9CDCFE' }}>rst</span> (rst),{"\n"}
                {"  "}.<span style={{ color: '#9CDCFE' }}>din</span> (trip_active_proc),{"\n"}
                {"  "}.<span style={{ color: '#9CDCFE' }}>dout</span>(<span style={{ color: '#48BB78', fontWeight: 'bold', textDecoration: 'underline' }}>trip_active_bus</span>){"\n"}
                );{"\n"}
                <span style={{ color: '#6A9955' }}>// bus_iface 에는 trip_active_bus 연결</span>
              </pre>
            </div>
          </div>

          {/* 디버그 절차 + safety-critical 영향 */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.55rem',
          }}>
            <div style={{
              background: FPGA.white,
              border: `1px solid ${DAY08}25`,
              borderTop: `3px solid ${DAY08}`,
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.35rem',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: FPGA.dark }}>
                GUI 디버그 절차
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                {[
                  { n: '1', t: '선택', d: 'CDC Checks → Violations → no_sync 펼치기' },
                  { n: '2', t: '경로', d: 'R-click → Show > Schematic > Path' },
                  { n: '3', t: '소스', d: 'R-click → Show > Source > TX/RX Signal' },
                  { n: '4', t: '상태', d: 'R-click → Set Status > Pending + comment' },
                ].map((s) => (
                  <div key={s.n} style={{
                    background: `${DAY08}08`,
                    border: `1px solid ${DAY08}20`,
                    borderTop: `2px solid ${DAY08}`,
                    borderRadius: '6px',
                    padding: '0.35rem 0.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.2rem' }}>
                      <span style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: DAY08, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.62rem', fontWeight: 800,
                      }}>{s.n}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: DAY08 }}>{s.t}</span>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: FPGA.text, lineHeight: 1.45 }}>{s.d}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.62rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.15rem' }}>
                수정 후 cdc run 재실행 → status가 Fixed로 자동 갱신 (export status 시 propagate).
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))',
              border: '1px solid rgba(229,62,62,0.30)',
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.3rem',
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#E53E3E' }}>
                safety-critical 영향
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.65rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li>Trip 상태가 잘못 read → 보호 동작 미발동</li>
                <li>FSM bit이라면 illegal state 진입</li>
                <li>silent failure — 시뮬 통과 / 실 hardware 결함</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
