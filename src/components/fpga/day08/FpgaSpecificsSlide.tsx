'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY08 = '#0E7C7B';

export default function FpgaSpecificsSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="FPGA"
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

          {/* 하단 — V&V 산출물 */}
          <div style={{
            flex: 1, minHeight: 0,
            background: 'linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.14))',
            border: '1px solid rgba(72,187,120,0.30)',
            borderLeft: '4px solid #48BB78',
            borderRadius: '10px',
            padding: '0.7rem 1rem',
            boxShadow: shadow.card,
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#48BB78', marginBottom: '0.45rem' }}>
              Safety-Critical V&V 산출물
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.55rem' }}>
              {[
                { f: 'cdc.rpt', d: '요약 + clock summary · 검증 증빙' },
                { f: 'cdc_detail.rpt', d: 'Crossing별 path + status' },
                { f: 'cdc_setting.rpt', d: '적용 directive 전체' },
                { f: 'status.tcl', d: 'Waiver 근거 + Owner/Reviewer' },
              ].map((o) => (
                <div key={o.f} style={{
                  background: FPGA.white,
                  border: '1px solid rgba(72,187,120,0.25)',
                  borderRadius: '6px',
                  padding: '0.45rem 0.65rem',
                }}>
                  <code style={{
                    fontSize: '0.66rem',
                    color: '#48BB78',
                    background: 'rgba(72,187,120,0.10)',
                    padding: '2px 7px', borderRadius: '3px',
                    fontFamily: 'monospace',
                    border: '1px solid rgba(72,187,120,0.30)',
                  }}>{o.f}</code>
                  <div style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.45, marginTop: '0.25rem' }}>{o.d}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.66rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.4rem' }}>
              DO-254 §6.2 / IEC 62566 — 분석 산출물 + 수정 trace + 잔여 waiver 근거를 V&V plan에 명시.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
