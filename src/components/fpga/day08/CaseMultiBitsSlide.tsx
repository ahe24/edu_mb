'use client';

import { ReactNode, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';

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
    name: 'Stable 선언',
    use: '부팅 시 1회만 설정하고 이후 변경 없는 register (예: threshold, offset)',
    pros: 'RTL 변경 없음 — directive 한 줄로 violation 해소',
    cons: '운영 중 값을 변경하면 보호 불가 — "변경 안 함"을 설계 규약으로 보장해야 함',
    code: (
      <span style={{ color: '#D4D4D4' }}>
        <span style={{ color: '#6A9955' }}>{"// directives.tcl에 추가"}</span>{"\n"}
        <span style={{ color: '#569CD6' }}>cdc signal</span> threshold_cfg <span style={{ color: '#9CDCFE' }}>-stable</span>{"\n"}
        <span style={{ color: '#569CD6' }}>cdc signal</span> offset_cfg <span style={{ color: '#9CDCFE' }}>-stable</span>{"\n"}
        {"\n"}
        <span style={{ color: '#6A9955' }}>{"// → RTL 수정 없이 multi_bits 해소"}</span>
      </span>
    ),
    col: '#4A6FA5',
  },
  {
    opt: 'B',
    name: 'DMUX 동기화',
    use: '운영 중 값이 수시로 바뀌고, RX가 천이 중에도 읽을 수 있는 경우',
    pros: 'enable 신호로 capture 시점을 제어 — bit 간 skew 방지',
    cons: 'TX 측에서 data hold + enable 신호 추가 필요 (RTL 수정)',
    code: (
      <span style={{ color: '#D4D4D4' }}>
        <span style={{ color: '#E53E3E' }}>{"// ✗ 문제: data가 변하는 순간 RX가 읽으면"}</span>{"\n"}
        <span style={{ color: '#E53E3E' }}>{"//   bit별 도착 시점 차이 → 잘못된 중간값"}</span>{"\n"}
        <span style={{ color: '#64748B' }}>{"// cfg[15:0] = 0xFFFF → 0x1000 천이 시"}</span>{"\n"}
        <span style={{ color: '#64748B' }}>{"// RX 캡처: 0xF000? 0x1FFF? (불확정)"}</span>{"\n"}
        {"\n"}
        <span style={{ color: '#48BB78' }}>{"// ✓ 해결: TX가 data hold + sel 신호 전송"}</span>{"\n"}
        <span style={{ color: '#6A9955' }}>{"// TX(bus_clk):"}</span>{"\n"}
        cfg_data &lt;= new_value;  <span style={{ color: '#6A9955' }}>{"// data 먼저 설정"}</span>{"\n"}
        cfg_sel  &lt;= 1'b1;      <span style={{ color: '#6A9955' }}>{"// 그 다음 cycle에 sel"}</span>{"\n"}
        {"\n"}
        <span style={{ color: '#6A9955' }}>{"// RX(proc_clk):"}</span>{"\n"}
        <span style={{ color: '#569CD6' }}>sync_2dff</span> u_sync_sel (  <span style={{ color: '#6A9955' }}>{"// sel만 동기화"}</span>{"\n"}
        {"  "}.din(cfg_sel), .dout(sel_sync));{"\n"}
        <span style={{ color: '#6A9955' }}>{"// sel_sync rising edge 시점에"}</span>{"\n"}
        <span style={{ color: '#6A9955' }}>{"// cfg_data는 이미 안정 → 안전 capture"}</span>
      </span>
    ),
    col: DAY08,
  },
  {
    opt: 'C',
    name: 'Handshake',
    use: '비정기적 update + 데이터 손실/오염이 절대 허용되지 않는 경우',
    pros: 'req/ack 확인 후 전송 — data corruption 원천 차단',
    cons: 'throughput 낮음 (왕복 동기화 대기) · 추가 로직 필요',
    code: (
      <span style={{ color: '#D4D4D4' }}>
        <span style={{ color: '#6A9955' }}>{"// TX: req assert → data hold"}</span>{"\n"}
        <span style={{ color: '#6A9955' }}>{"// RX: data capture → ack 반환"}</span>{"\n"}
        <span style={{ color: '#6A9955' }}>{"// TX: ack 확인 후 req 해제"}</span>{"\n"}
        {"→ scheme: "}<span style={{ color: '#4EC9B0' }}>handshake</span> (Eval)
      </span>
    ),
    col: '#8B6FA5',
  },
];

const S = { code: '#569CD6', fn: '#DCDCAA', sig: '#9CDCFE', cmt: '#6A9955', txt: '#D4D4D4', mod: '#4EC9B0', ok: '#48BB78', err: '#E53E3E', dim: '#64748B' } as const;

export default function CaseMultiBitsSlide() {
  const [detail, setDetail] = useState<'B' | 'C' | null>(null);

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
            {fixes.map((f) => {
              const clickable = f.opt === 'B' || f.opt === 'C';
              return (
              <div key={f.opt}
                onClick={clickable ? () => setDetail(f.opt as 'B' | 'C') : undefined}
                style={{
                  background: FPGA.white,
                  border: `1px solid ${f.col}25`,
                  borderTop: `3px solid ${f.col}`,
                  borderRadius: '10px',
                  padding: '0.55rem 0.7rem',
                  boxShadow: shadow.card,
                  display: 'flex', flexDirection: 'column', gap: '0.3rem',
                  cursor: clickable ? 'pointer' : 'default',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={clickable ? (e) => { e.currentTarget.style.boxShadow = shadow.cardHover; e.currentTarget.style.transform = 'translateY(-2px)'; } : undefined}
                onMouseLeave={clickable ? (e) => { e.currentTarget.style.boxShadow = shadow.card; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
              >
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
                {clickable && (
                  <div style={{ fontSize: '0.56rem', color: f.col, fontWeight: 600 }}>▸ 클릭: 상세 설명</div>
                )}
              </div>
              );
            })}
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
              <strong>설정 후 변경 없음 (또는 안정 구간 보장)</strong> → A (stable directive). &nbsp;|&nbsp;
              <strong>수시 변경 + RX가 임의 시점에 읽음</strong> → B (DMUX). &nbsp;|&nbsp;
              <strong>변경 빈도 불규칙 + 무손실 필수</strong> → C (handshake).
              본 lab 회로는 host가 부팅 시 1회 write → <strong style={{ color: DAY08 }}>A 권장</strong>.
            </div>
          </div>
        </div>
      </div>
      {/* ── DMUX 상세 모달 ── */}
      <SlideModal open={detail === 'B'} onClose={() => setDetail(null)}>
        <div onClick={(e) => e.stopPropagation()} style={{
          maxWidth: '880px', width: '88vw', borderRadius: '10px', overflow: 'hidden', boxShadow: shadow.deep, background: FPGA.white,
        }}>
          <div style={{ background: DAY08, padding: '0.6rem 1rem', color: '#fff', fontSize: '1rem', fontWeight: 800 }}>
            옵션 B — DMUX 동기화 상세
          </div>
          <div style={{ padding: '1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

            {/* 문제 상황 */}
            <div style={{ background: 'rgba(229,62,62,0.06)', border: '1px solid rgba(229,62,62,0.25)', borderLeft: '4px solid #E53E3E', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#E53E3E', marginBottom: '0.3rem' }}>문제: multi-bit bus를 그대로 넘기면?</div>
              <div style={{ fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.7 }}>
                16-bit bus가 <code>0xFFFF → 0x1000</code>으로 변할 때, 각 bit는 서로 다른 시점에 RX clock에 도착한다.
                RX가 캡처하는 순간 일부 bit는 이전 값, 일부는 새 값 → <strong>0xF000, 0x1FFF, 0xFFFF 등 불확정 중간값</strong>.
                이 값이 threshold 비교에 사용되면 잘못된 trip 발생 또는 미발동.
              </div>
            </div>

            {/* 해결 원리 */}
            <div style={{ background: 'rgba(72,187,120,0.06)', border: '1px solid rgba(72,187,120,0.25)', borderLeft: '4px solid #48BB78', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#48BB78', marginBottom: '0.3rem' }}>해결: select 신호로 capture 시점 제어</div>
              <div style={{ fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.7 }}>
                TX가 data를 bus에 올린 후 <strong>최소 1 cycle 대기</strong>하여 모든 bit가 안정된 뒤,
                1-bit <code>sel</code> 신호를 assert한다. RX는 <code>sel</code>만 2DFF로 동기화하고,
                <code>sel_sync</code>의 rising edge에서 data bus 전체를 한 번에 capture한다.
                data가 안정된 상태에서만 읽으므로 bit 간 skew 문제가 원천 해소.
              </div>
            </div>

            {/* 타이밍 다이어그램 */}
            <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.5rem 0.7rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#CBD5E1', marginBottom: '0.3rem' }}>Timing — TX hold protocol</div>
              <svg viewBox="0 0 700 130" style={{ width: '100%' }}>
                {/* TX clk */}
                <text x="4" y="18" fontSize="9" fill="#E8913A" fontFamily='"JetBrains Mono", monospace' fontWeight="700">tx_clk</text>
                <path d="M 70,22 L 85,22 L 85,10 L 110,10 L 110,22 L 135,22 L 135,10 L 160,10 L 160,22 L 185,22 L 185,10 L 210,10 L 210,22 L 235,22 L 235,10 L 260,10 L 260,22 L 285,22 L 285,10 L 310,10 L 310,22 L 335,22 L 335,10 L 360,10 L 360,22 L 385,22 L 385,10 L 410,10 L 410,22 L 435,22 L 435,10 L 460,10 L 460,22 L 485,22 L 485,10 L 510,10 L 510,22 L 535,22 L 535,10 L 560,10 L 560,22 L 585,22 L 585,10 L 610,10 L 610,22 L 690,22"
                      stroke="#E8913A" strokeWidth="1" fill="none" opacity="0.6" />

                {/* data bus — 천이는 tx_clk rising edge (x=235)에 동기 */}
                <text x="4" y="44" fontSize="9" fill="#E8913A" fontFamily='"JetBrains Mono", monospace' fontWeight="700">data[15:0]</text>
                <rect x="70" y="32" width="165" height="16" rx="2" fill="rgba(229,62,62,0.15)" stroke="#E53E3E" strokeWidth="0.8" />
                <text x="152" y="43" fontSize="8" fill="#E53E3E" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>OLD (0xFFFF)</text>
                {/* 새 값: x=235 (rising edge)에서 변경, 안정 */}
                <rect x="235" y="32" width="355" height="16" rx="2" fill="rgba(72,187,120,0.12)" stroke="#48BB78" strokeWidth="0.8" />
                <text x="412" y="43" fontSize="8" fill="#48BB78" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>NEW (0x1000) — 안정</text>

                {/* sel 신호 — rising/falling 모두 tx_clk rising edge에 동기 */}
                {/* assert at x=285 (data 안정 후 1 cycle), deassert at x=335 */}
                <text x="4" y="70" fontSize="9" fill="#E8913A" fontFamily='"JetBrains Mono", monospace' fontWeight="700">sel</text>
                <path d="M 70,73 L 285,73 L 285,58 L 335,58 L 335,73 L 690,73" stroke="#E8913A" strokeWidth="1.5" fill="none" />
                <text x="310" y="55" fontSize="7" fill="#E8913A" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>1-cycle (data 안정 후)</text>

                {/* RX clk (느림) */}
                <text x="4" y="92" fontSize="9" fill={DAY08} fontFamily='"JetBrains Mono", monospace' fontWeight="700">rx_clk</text>
                <path d="M 70,96 L 100,96 L 100,82 L 150,82 L 150,96 L 200,96 L 200,82 L 250,82 L 250,96 L 300,96 L 300,82 L 350,82 L 350,96 L 400,96 L 400,82 L 450,82 L 450,96 L 500,96 L 500,82 L 550,82 L 550,96 L 600,96 L 600,82 L 650,82 L 650,96 L 690,96"
                      stroke={DAY08} strokeWidth="1" fill="none" opacity="0.6" />

                {/* sel_sync (2DFF) — sel@285 → rx@300(FF1) → @400(FF2=sel_sync rise) → @500(sel_sync fall) */}
                <text x="4" y="114" fontSize="9" fill={DAY08} fontFamily='"JetBrains Mono", monospace' fontWeight="700">sel_sync</text>
                <path d="M 70,118 L 500,118 L 500,103 L 600,103 L 600,118 L 690,118" stroke={DAY08} strokeWidth="1.5" fill="none" />
                {/* capture 시점: sel_sync rising edge at x=500 (2 rx_clk after first sample) */}
                <line x1="500" y1="30" x2="500" y2="125" stroke="#48BB78" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
                <text x="505" y="127" fontSize="7.5" fill="#48BB78" fontFamily='"JetBrains Mono", monospace' fontWeight="800">★ capture (2DFF latency)</text>
              </svg>
            </div>

            {/* 코드 예시 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <div style={{ background: '#0f172a', borderRadius: '6px', padding: '0.5rem 0.7rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#E8913A', fontWeight: 800, marginBottom: '0.2rem' }}>TX 측 (bus_clk)</div>
                <pre style={{ margin: 0, fontSize: '0.68rem', lineHeight: 1.6, color: S.txt, whiteSpace: 'pre-wrap', fontFamily: '"JetBrains Mono", monospace' }}>
                  <span style={{ color: S.cmt }}>// host write 시</span>{"\n"}
                  <span style={{ color: S.code }}>always</span> @(<span style={{ color: S.code }}>posedge</span> bus_clk){"\n"}
                  {"  "}<span style={{ color: S.code }}>if</span> (host_we) <span style={{ color: S.code }}>begin</span>{"\n"}
                  {"    "}cfg_data {"<="} host_wdata;{"\n"}
                  {"    "}cfg_sel  {"<="} 1'b0; <span style={{ color: S.cmt }}>// data 먼저</span>{"\n"}
                  {"  "}<span style={{ color: S.code }}>end else begin</span>{"\n"}
                  {"    "}cfg_sel  {"<="} |cfg_data;{"\n"}
                  {"    "}<span style={{ color: S.cmt }}>// data 안정 후 sel assert</span>{"\n"}
                  {"  "}<span style={{ color: S.code }}>end</span>
                </pre>
              </div>
              <div style={{ background: '#0f172a', borderRadius: '6px', padding: '0.5rem 0.7rem' }}>
                <div style={{ fontSize: '0.68rem', color: DAY08, fontWeight: 800, marginBottom: '0.2rem' }}>RX 측 (proc_clk)</div>
                <pre style={{ margin: 0, fontSize: '0.68rem', lineHeight: 1.6, color: S.txt, whiteSpace: 'pre-wrap', fontFamily: '"JetBrains Mono", monospace' }}>
                  <span style={{ color: S.cmt }}>// sel만 2DFF 동기화</span>{"\n"}
                  <span style={{ color: S.mod }}>sync_2dff</span> #(.W(1)) u_sync_sel ({"\n"}
                  {"  "}.clk(proc_clk), .rst(rst),{"\n"}
                  {"  "}.din(cfg_sel), .dout(sel_sync){"\n"}
                  );{"\n"}
                  {"\n"}
                  <span style={{ color: S.cmt }}>// sel_sync rising edge → capture</span>{"\n"}
                  <span style={{ color: S.code }}>reg</span> sel_d;{"\n"}
                  <span style={{ color: S.code }}>wire</span> sel_rise = sel_sync & ~sel_d;{"\n"}
                  <span style={{ color: S.code }}>if</span> (sel_rise){"\n"}
                  {"  "}threshold {"<="} cfg_data; <span style={{ color: S.ok }}>// ✓ 안전</span>
                </pre>
              </div>
            </div>

            {/* 핵심 */}
            <div style={{ fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.6, background: `${DAY08}08`, borderRadius: '6px', padding: '0.5rem 0.8rem', border: `1px solid ${DAY08}25` }}>
              <strong style={{ color: DAY08 }}>핵심:</strong> multi-bit data 자체는 동기화하지 않는다.
              1-bit <code>sel</code> 신호만 2DFF로 동기화하고, <code>sel</code>의 rising edge 시점에 data는 이미 안정되어 있으므로 전체 bus를 한 번에 안전하게 capture할 수 있다.
              Questa CDC는 이 패턴을 <code>dmux</code> scheme으로 자동 인식한다.
            </div>
          </div>
        </div>
      </SlideModal>

      {/* ── Handshake 상세 모달 ── */}
      <SlideModal open={detail === 'C'} onClose={() => setDetail(null)}>
        <div onClick={(e) => e.stopPropagation()} style={{
          maxWidth: '880px', width: '88vw', borderRadius: '10px', overflow: 'hidden', boxShadow: shadow.deep, background: FPGA.white,
        }}>
          <div style={{ background: '#8B6FA5', padding: '0.6rem 1rem', color: '#fff', fontSize: '1rem', fontWeight: 800 }}>
            옵션 C — Handshake 동기화 상세
          </div>
          <div style={{ padding: '1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

            {/* 문제 상황 */}
            <div style={{ background: 'rgba(229,62,62,0.06)', border: '1px solid rgba(229,62,62,0.25)', borderLeft: '4px solid #E53E3E', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#E53E3E', marginBottom: '0.3rem' }}>문제: DMUX로도 부족한 경우는?</div>
              <div style={{ fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.7 }}>
                DMUX는 TX가 data를 hold하는 동안 새로운 write가 오지 않아야 한다.
                data 변경이 불규칙하고, <strong>RX가 확실히 수신했음을 TX가 알아야</strong> 다음 값을 보낼 수 있는 경우에는
                양방향 확인(req/ack)이 필요하다.
              </div>
            </div>

            {/* 4-phase handshake 시퀀스 */}
            <div style={{ background: 'rgba(139,111,165,0.06)', border: '1px solid rgba(139,111,165,0.25)', borderLeft: '4px solid #8B6FA5', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#8B6FA5', marginBottom: '0.4rem' }}>4-Phase Handshake 프로토콜</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {[
                  { n: '1', title: 'TX: data + req', desc: 'TX가 data bus에 값을 올리고 req를 assert. 이후 data를 변경하지 않음 (hold).', col: '#E8913A' },
                  { n: '2', title: 'RX: capture + ack', desc: 'RX가 req를 2DFF로 감지하면, data가 안정된 상태이므로 capture 후 ack를 assert.', col: DAY08 },
                  { n: '3', title: 'TX: req 해제', desc: 'TX가 ack를 2DFF로 감지하면 RX가 data를 수신했음을 확인. req를 deassert.', col: '#4A6FA5' },
                  { n: '4', title: 'RX: ack 해제', desc: 'RX가 req deassert를 감지하면 ack를 deassert. 1회 전송 완료, 다음 전송 대기.', col: '#8B6FA5' },
                ].map((s) => (
                  <div key={s.n} style={{
                    background: `${s.col}08`, border: `1px solid ${s.col}25`,
                    borderTop: `2px solid ${s.col}`, borderRadius: '6px',
                    padding: '0.4rem 0.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.2rem' }}>
                      <span style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: s.col, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 800,
                      }}>{s.n}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: s.col }}>{s.title}</span>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: FPGA.text, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 타이밍 다이어그램 */}
            <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.5rem 0.7rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#CBD5E1', marginBottom: '0.3rem' }}>Timing — 4-Phase Handshake</div>
              <svg viewBox="0 0 700 120" style={{ width: '100%' }}>
                {/* Phase 구분 */}
                <rect x="120" y="0" width="130" height="120" fill="rgba(232,145,58,0.06)" />
                <rect x="250" y="0" width="140" height="120" fill="rgba(14,124,123,0.06)" />
                <rect x="390" y="0" width="130" height="120" fill="rgba(74,111,165,0.06)" />
                <rect x="520" y="0" width="130" height="120" fill="rgba(139,111,165,0.06)" />
                <text x="185" y="10" fontSize="7.5" fill="#E8913A" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' fontWeight="700">Phase 1</text>
                <text x="320" y="10" fontSize="7.5" fill={DAY08} textAnchor="middle" fontFamily='"JetBrains Mono", monospace' fontWeight="700">Phase 2</text>
                <text x="455" y="10" fontSize="7.5" fill="#4A6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' fontWeight="700">Phase 3</text>
                <text x="585" y="10" fontSize="7.5" fill="#8B6FA5" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' fontWeight="700">Phase 4</text>

                {/* data */}
                <text x="4" y="32" fontSize="9" fill="#E8913A" fontFamily='"JetBrains Mono", monospace' fontWeight="700">data</text>
                <rect x="70" y="20" width="50" height="16" rx="2" fill="rgba(100,116,139,0.2)" stroke="#64748B" strokeWidth="0.8" />
                <text x="95" y="31" fontSize="7" fill="#64748B" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>idle</text>
                <rect x="120" y="20" width="530" height="16" rx="2" fill="rgba(72,187,120,0.12)" stroke="#48BB78" strokeWidth="0.8" />
                <text x="385" y="31" fontSize="7.5" fill="#48BB78" textAnchor="middle" fontFamily='"JetBrains Mono", monospace'>DATA HELD STABLE</text>
                <rect x="650" y="20" width="45" height="16" rx="2" fill="rgba(100,116,139,0.2)" stroke="#64748B" strokeWidth="0.8" />

                {/* req (TX→RX) */}
                <text x="4" y="56" fontSize="9" fill="#E8913A" fontFamily='"JetBrains Mono", monospace' fontWeight="700">req</text>
                <path d="M 70,60 L 140,60 L 140,45 L 420,45 L 420,60 L 690,60" stroke="#E8913A" strokeWidth="1.5" fill="none" />

                {/* ack (RX→TX) */}
                <text x="4" y="80" fontSize="9" fill={DAY08} fontFamily='"JetBrains Mono", monospace' fontWeight="700">ack</text>
                <path d="M 70,84 L 290,84 L 290,69 L 560,69 L 560,84 L 690,84" stroke={DAY08} strokeWidth="1.5" fill="none" />

                {/* capture 시점 */}
                <line x1="290" y1="14" x2="290" y2="95" stroke="#48BB78" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
                <text x="295" y="100" fontSize="7.5" fill="#48BB78" fontFamily='"JetBrains Mono", monospace' fontWeight="800">★ RX capture</text>

                {/* 2DFF 지연 표시 */}
                <text x="160" y="55" fontSize="6.5" fill="#64748B" fontFamily='"JetBrains Mono", monospace'>→ 2DFF →</text>
                <text x="440" y="79" fontSize="6.5" fill="#64748B" fontFamily='"JetBrains Mono", monospace'>→ 2DFF →</text>

                {/* 전송 완료 */}
                <text x="600" y="110" fontSize="8" fill="#8B6FA5" fontFamily='"JetBrains Mono", monospace' fontWeight="700">완료, 다음 전송 가능</text>
              </svg>
            </div>

            {/* 코드 예시 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <div style={{ background: '#0f172a', borderRadius: '6px', padding: '0.5rem 0.7rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#E8913A', fontWeight: 800, marginBottom: '0.2rem' }}>TX 측 (bus_clk)</div>
                <pre style={{ margin: 0, fontSize: '0.65rem', lineHeight: 1.55, color: S.txt, whiteSpace: 'pre-wrap', fontFamily: '"JetBrains Mono", monospace' }}>
                  <span style={{ color: S.code }}>reg</span>        tx_req;{"\n"}
                  <span style={{ color: S.code }}>reg</span> [15:0] tx_data;{"\n"}
                  <span style={{ color: S.code }}>wire</span>       ack_sync; <span style={{ color: S.cmt }}>// 2DFF로 동기화된 ack</span>{"\n"}
                  {"\n"}
                  <span style={{ color: S.mod }}>sync_2dff</span> #(.W(1)) u_ack_sync ({"\n"}
                  {"  "}.clk(bus_clk), .rst(rst),{"\n"}
                  {"  "}.din(rx_ack), .dout(ack_sync));{"\n"}
                  {"\n"}
                  <span style={{ color: S.code }}>always</span> @(<span style={{ color: S.code }}>posedge</span> bus_clk){"\n"}
                  {"  "}<span style={{ color: S.code }}>if</span> (send_trigger & ~tx_req) <span style={{ color: S.code }}>begin</span>{"\n"}
                  {"    "}tx_data {"<="} new_value; <span style={{ color: S.cmt }}>// data 설정</span>{"\n"}
                  {"    "}tx_req  {"<="} 1'b1;     <span style={{ color: S.cmt }}>// req assert</span>{"\n"}
                  {"  "}<span style={{ color: S.code }}>end else if</span> (ack_sync){"\n"}
                  {"    "}tx_req  {"<="} 1'b0;     <span style={{ color: S.ok }}>// ack 확인 → 해제</span>
                </pre>
              </div>
              <div style={{ background: '#0f172a', borderRadius: '6px', padding: '0.5rem 0.7rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#8B6FA5', fontWeight: 800, marginBottom: '0.2rem' }}>RX 측 (proc_clk)</div>
                <pre style={{ margin: 0, fontSize: '0.65rem', lineHeight: 1.55, color: S.txt, whiteSpace: 'pre-wrap', fontFamily: '"JetBrains Mono", monospace' }}>
                  <span style={{ color: S.code }}>reg</span>        rx_ack;{"\n"}
                  <span style={{ color: S.code }}>wire</span>       req_sync; <span style={{ color: S.cmt }}>// 2DFF로 동기화된 req</span>{"\n"}
                  {"\n"}
                  <span style={{ color: S.mod }}>sync_2dff</span> #(.W(1)) u_req_sync ({"\n"}
                  {"  "}.clk(proc_clk), .rst(rst),{"\n"}
                  {"  "}.din(tx_req), .dout(req_sync));{"\n"}
                  {"\n"}
                  <span style={{ color: S.code }}>always</span> @(<span style={{ color: S.code }}>posedge</span> proc_clk){"\n"}
                  {"  "}<span style={{ color: S.code }}>if</span> (req_sync & ~rx_ack) <span style={{ color: S.code }}>begin</span>{"\n"}
                  {"    "}captured {"<="} tx_data; <span style={{ color: S.ok }}>// ✓ data 안전 capture</span>{"\n"}
                  {"    "}rx_ack   {"<="} 1'b1;   <span style={{ color: S.cmt }}>// ack 반환</span>{"\n"}
                  {"  "}<span style={{ color: S.code }}>end else if</span> (~req_sync){"\n"}
                  {"    "}rx_ack   {"<="} 1'b0;   <span style={{ color: S.cmt }}>// req 해제 확인 → 완료</span>
                </pre>
              </div>
            </div>

            {/* DMUX vs Handshake 비교 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <div style={{ background: `${DAY08}08`, borderRadius: '6px', padding: '0.5rem 0.7rem', border: `1px solid ${DAY08}25` }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: DAY08, marginBottom: '0.2rem' }}>DMUX와의 차이</div>
                <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.72rem', color: FPGA.text, lineHeight: 1.7 }}>
                  <li>DMUX: TX가 일방적으로 sel 신호 전송. RX가 수신했는지 확인 불가</li>
                  <li>Handshake: ack로 RX 수신 확인 후에만 다음 전송 → <strong>무손실 보장</strong></li>
                </ul>
              </div>
              <div style={{ background: 'rgba(232,145,58,0.06)', borderRadius: '6px', padding: '0.5rem 0.7rem', border: '1px solid rgba(232,145,58,0.20)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#E8913A', marginBottom: '0.2rem' }}>Trade-off</div>
                <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.72rem', color: FPGA.text, lineHeight: 1.7 }}>
                  <li>왕복 동기화 대기 → latency = 2×(TX→RX) + 2×(RX→TX) clock cycles</li>
                  <li>연속 전송 불가 — throughput이 낮아 고대역 데이터에는 Async FIFO 사용</li>
                </ul>
              </div>
            </div>

            {/* 핵심 */}
            <div style={{ fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.6, background: 'rgba(139,111,165,0.08)', borderRadius: '6px', padding: '0.5rem 0.8rem', border: '1px solid rgba(139,111,165,0.25)' }}>
              <strong style={{ color: '#8B6FA5' }}>핵심:</strong> Handshake는 "TX가 보내고 → RX가 받았다고 응답 → TX가 확인"하는 3-way 확인 과정.
              속도는 느리지만 data corruption이 원천 차단된다.
              Questa CDC는 이 패턴을 <code>handshake</code> scheme (Evaluation)으로 자동 인식한다.
            </div>
          </div>
        </div>
      </SlideModal>
    </section>
  );
}
