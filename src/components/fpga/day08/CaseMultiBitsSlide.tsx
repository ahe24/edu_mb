'use client';

import { ReactNode } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY08 = '#0E7C7B';

type FixOption = {
  opt: string;
  name: string;
  use: string;
  pros: string;
  cons: string;
  code: ReactNode;
  col: string;
};

const fixes: FixOption[] = [
  {
    opt: 'A',
    name: 'cdc signal -stable',
    use: 'SW가 startup에만 쓰는 configuration register',
    pros: 'RTL 변경 없음 · directive 한 줄',
    cons: 'protocol 가정 검증 필요',
    code: (
      <span style={{ color: '#D4D4D4' }}>
        <span style={{ color: '#569CD6' }}>cdc signal</span> threshold_cfg <span style={{ color: '#9CDCFE' }}>-stable</span>{"\n"}
        <span style={{ color: '#569CD6' }}>cdc signal</span> offset_cfg <span style={{ color: '#9CDCFE' }}>-stable</span>
      </span>
    ),
    col: '#4A6FA5',
  },
  {
    opt: 'B',
    name: 'DMUX scheme',
    use: '주기적 update + bus 안정 구간 활용',
    pros: 'bus 전체 동시 capture',
    cons: 'enable 동기화 + TX hold 필요',
    code: (
      <span style={{ color: '#D4D4D4' }}>
        <span style={{ color: '#6A9955' }}>// bus_clk side</span>{"\n"}
        <span style={{ color: '#569CD6' }}>reg</span> cfg_valid; <span style={{ color: '#6A9955' }}>// 1-cycle pulse</span>{"\n"}
        <span style={{ color: '#6A9955' }}>// proc_clk side</span>{"\n"}
        2DFF(cfg_valid) → enable
      </span>
    ),
    col: DAY08,
  },
  {
    opt: 'C',
    name: 'Handshake',
    use: '비주기 update · 데이터 일관성 strict',
    pros: '데이터 corruption 0',
    cons: 'throughput 낮음 · 로직 추가',
    code: (
      <span style={{ color: '#D4D4D4' }}>
        req/ack 2-way 프로토콜{"\n"}
        → <span style={{ color: '#569CD6' }}>scheme</span>: <span style={{ color: '#4EC9B0' }}>handshake</span> (Eval)
      </span>
    ),
    col: '#8B6FA5',
  },
];

export default function CaseMultiBitsSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="CASE 2 · multi_bits"
          title="Bus 미보호 — 3가지 수정 옵션"
          subtitle="threshold_cfg[15:0] · offset_cfg[7:0] (bus_clk → proc_clk) · 1 multi_bits + 2 cascade no_sync"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* report 발췌 + 위반 원인 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))',
            border: '1px solid rgba(229,62,62,0.30)',
            borderLeft: '4px solid #E53E3E',
            borderRadius: '10px',
            padding: '0.5rem 0.85rem',
            boxShadow: shadow.card,
            display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.7rem',
          }}>
            <div style={{
              background: '#1A2235',
              borderRadius: '6px',
              padding: '0.4rem 0.7rem',
              fontFamily: '"JetBrains Mono", Consolas, monospace',
            }}>
              <div style={{ fontSize: '0.58rem', color: '#F0A0A0', fontWeight: 800, marginBottom: '0.15rem', letterSpacing: '0.05em' }}>
                cdc_detail.rpt — 발췌
              </div>
              <pre style={{ margin: 0, fontSize: '0.58rem', lineHeight: 1.5, color: '#CCCCCC', whiteSpace: 'pre-wrap', fontFamily: '"JetBrains Mono", Consolas, monospace' }}>
                <span style={{ color: '#E8913A' }}>bus_clk</span> : <span style={{ color: '#9CDCFE' }}>start</span> : u_bus.threshold_cfg{"\n"}
                {"  "}<span style={{ color: '#4A6FA5' }}>proc_clk</span> : <span style={{ color: '#9CDCFE' }}>end</span>   : u_proc.alarm_pulse  (<span style={{ color: '#E53E3E' }}>no_sync_40383</span>){"\n"}
                {"  "}<span style={{ color: '#4A6FA5' }}>proc_clk</span> : <span style={{ color: '#9CDCFE' }}>end</span>   : u_proc.trip_active  (<span style={{ color: '#E53E3E' }}>no_sync_35881</span>){"\n"}
                {"\n"}
                <span style={{ color: '#E53E3E', fontWeight: 'bold' }}>Multiple-bit signal across CDC boundary (multi_bits)</span>{"\n"}
                {"  "}threshold<span style={{ color: '#569CD6' }}>[15:0]</span> : <span style={{ color: '#E8913A' }}>bus_clk</span> → <span style={{ color: '#4A6FA5' }}>proc_clk</span>
              </pre>
            </div>
            <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.55 }}>
              <strong style={{ color: '#E53E3E' }}>위반 원인:</strong> bus 각 bit 동기화 시점이 어긋남 →
              0xFFFF → 0x1000 천이 시 0xF000 / 0x1FFF 등 <strong>잘못된 중간값</strong>이 사용 가능.
              cascade로 trip_active / alarm_pulse 까지 오염.
            </div>
          </div>

          {/* 3가지 수정 옵션 */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.55rem' }}>
            {fixes.map((f) => (
              <div key={f.opt} style={{
                background: FPGA.white,
                border: `1px solid ${f.col}25`,
                borderTop: `3px solid ${f.col}`,
                borderRadius: '10px',
                padding: '0.55rem 0.7rem',
                boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: f.col, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.74rem', fontWeight: 800,
                  }}>{f.opt}</span>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: FPGA.dark }}>{f.name}</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: f.col, fontWeight: 600 }}>
                  <strong>용도:</strong> {f.use}
                </div>
                <pre style={{
                  margin: 0, fontSize: '0.58rem', lineHeight: 1.4,
                  background: '#1A2235', color: '#A8D8A8',
                  padding: '0.4rem 0.55rem', borderRadius: '5px',
                  fontFamily: '"JetBrains Mono", Consolas, monospace',
                  whiteSpace: 'pre-wrap',
                  border: `1px solid ${f.col}40`,
                }}>{f.code}</pre>
                <div style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.5 }}>
                  <strong style={{ color: '#48BB78' }}>✓</strong> {f.pros}
                </div>
                <div style={{ fontSize: '0.62rem', color: FPGA.text, lineHeight: 1.5 }}>
                  <strong style={{ color: '#E8913A' }}>!</strong> {f.cons}
                </div>
              </div>
            ))}
          </div>

          {/* 권장 결정 — 양가 케이스 */}
          <div style={{
            background: `linear-gradient(135deg, ${DAY08}06, ${DAY08}14)`,
            border: `1px solid ${DAY08}30`,
            borderRadius: '10px',
            padding: '0.45rem 0.85rem',
            boxShadow: shadow.card,
            display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.7rem', fontWeight: 800,
              color: '#fff', background: DAY08,
              padding: '3px 10px', borderRadius: '5px',
              flexShrink: 0,
            }}>선택 기준</span>
            <div style={{ fontSize: '0.7rem', color: FPGA.text, flex: 1, lineHeight: 1.55 }}>
              <strong>Startup 1회 update</strong> → 옵션 A (stable) · directive 한 줄로 해소. &nbsp;|&nbsp;
              <strong>Runtime 변경 가능</strong> → 옵션 C (handshake) · 안전 critical에서 update 중 보호로직 hold 보장.
              본 lab 회로는 host가 부팅 시 1회 write 가정 → <strong style={{ color: DAY08 }}>A 권장</strong>.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
