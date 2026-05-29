'use client';

import { useState, type CSSProperties } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';

const DAY07 = '#0891B2';
const ORANGE = '#DD6B20';
const BLUE = '#4A6FA5';
const RED = '#E53E3E';
const GREEN = '#48BB78';

const MONO = '"JetBrains Mono", "Pretendard", sans-serif';
const SANS = '"Pretendard", sans-serif';

/** 시작 low 기준 클록 파형 path 문자열 생성 */
function mkClock(x0: number, xEnd: number, period: number, hi: number, lo: number): string {
  const pts: [number, number][] = [[x0, lo]];
  let x = x0;
  let lvl = lo;
  while (x < xEnd) {
    const nx = Math.min(x + period / 2, xEnd);
    pts.push([nx, lvl]);
    if (nx < xEnd) {
      lvl = lvl === lo ? hi : lo;
      pts.push([nx, lvl]);
    }
    x = nx;
  }
  return 'M ' + pts.map((p) => `${p[0]} ${p[1]}`).join(' L ');
}

const modalStyle: CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '16px',
  padding: '1.6rem 2rem 1.8rem',
  maxWidth: '1140px',
  width: '96%',
  maxHeight: '92vh',
  overflow: 'auto',
  boxShadow: '0 25px 70px rgba(0,0,0,0.40), 0 8px 24px rgba(0,0,0,0.20)',
  border: `1px solid ${FPGA.border}`,
};

/** 모달 내부 — 동작 타이밍 상세 */
function BadBusDetail({ onClose }: { onClose: () => void }) {
  // rx_clk: period 80, x0=100 → rising edge 140,220,300,380,460,540,620
  const E1 = 300;   // q0 갱신
  const E2 = 380;   // q2 갱신
  const E3 = 460;   // q1 갱신
  const TX = 157;   // tx_clk edge — d_tx 동시 변화

  return (
    <div>
      {/* 헤더 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '1rem', marginBottom: '0.7rem',
        paddingBottom: '0.6rem', borderBottom: `1px solid ${FPGA.border}`,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{
              fontFamily: MONO, fontSize: '0.82rem', fontWeight: 800,
              color: '#fff', background: RED, padding: '3px 11px',
              borderRadius: '5px', letterSpacing: '0.04em',
            }}>multi_bits · Violation</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: FPGA.dark, lineHeight: 1.2 }}>
            왜 bus가 깨지나 — bit별 2-DFF의 해소 edge 차이
          </div>
          <div style={{ fontSize: '1rem', color: FPGA.textLight, marginTop: '0.3rem', lineHeight: 1.45 }}>
            tx_clk에 동기된 d[2:0]가 한 번에 바뀌어도, 각 bit가 독립 2-DFF를 거치며 서로 다른 rx_clk edge에서 갱신 → RX 버스가 중간값을 거침
          </div>
        </div>
        <button onClick={onClose} aria-label="닫기" style={{
          background: 'transparent', border: `1px solid ${FPGA.border}`,
          borderRadius: '8px', padding: '7px 12px', cursor: 'pointer',
          fontSize: '0.92rem', fontWeight: 700, color: FPGA.textLight, flexShrink: 0,
        }}>✕ 닫기</button>
      </div>

      {/* === Timing diagram === */}
      <div style={{
        background: FPGA.bgAlt, border: `1px solid ${FPGA.border}`,
        borderRadius: '10px', padding: '0.7rem 0.9rem', marginBottom: '0.8rem',
      }}>
        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
          Timing — TX는 동시 변화 / RX는 bit마다 다른 edge에서 갱신
        </div>
        <svg viewBox="0 0 660 348" style={{ width: '100%' }}>
          {/* 캡처 edge 가이드 */}
          {[
            { x: TX, c: ORANGE, t: 'TX 변화' },
            { x: E1, c: RED, t: 'E1' },
            { x: E2, c: RED, t: 'E2' },
            { x: E3, c: GREEN, t: 'E3' },
          ].map((g) => (
            <g key={g.x}>
              <line x1={g.x} y1="56" x2={g.x} y2="300" stroke={g.c} strokeWidth="0.9" strokeDasharray="3 2" opacity="0.6" />
              <text x={g.x} y="52" fontSize="8.5" fontWeight="800" fill={g.c} textAnchor="middle" fontFamily={MONO}>{g.t}</text>
            </g>
          ))}
          <text x="656" y="14" fontSize="8" fontWeight="700" fill={FPGA.textLight} textAnchor="end" fontFamily={MONO}>time →</text>

          {/* tx_clk */}
          <text x="4" y="42" fontSize="10" fontWeight="800" fill={ORANGE} fontFamily={MONO}>tx_clk</text>
          <path d={mkClock(82, 640, 50, 24, 40)} stroke={ORANGE} strokeWidth="1.3" fill="none" />

          {/* d[2:0] @ tx — 버스, x=TX 에서 011→100 동시 전이 */}
          <text x="4" y="80" fontSize="10" fontWeight="800" fill={ORANGE} fontFamily={MONO}>d[2:0]</text>
          <text x="4" y="91" fontSize="7" fontWeight="700" fill={ORANGE} fontFamily={MONO} opacity="0.8">@tx_clk</text>
          <line x1="82" y1="66" x2={TX - 4} y2="66" stroke={ORANGE} strokeWidth="1.6" />
          <line x1="82" y1="84" x2={TX - 4} y2="84" stroke={ORANGE} strokeWidth="1.6" />
          <line x1={TX - 4} y1="66" x2={TX + 4} y2="84" stroke={ORANGE} strokeWidth="1.6" />
          <line x1={TX - 4} y1="84" x2={TX + 4} y2="66" stroke={ORANGE} strokeWidth="1.6" />
          <line x1={TX + 4} y1="66" x2="640" y2="66" stroke={ORANGE} strokeWidth="1.6" />
          <line x1={TX + 4} y1="84" x2="640" y2="84" stroke={ORANGE} strokeWidth="1.6" />
          <text x="118" y="79" fontSize="10" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>011</text>
          <text x="400" y="79" fontSize="10" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>100 (한 번에 변화)</text>

          {/* rx_clk */}
          <text x="4" y="116" fontSize="10" fontWeight="800" fill={DAY07} fontFamily={MONO}>rx_clk</text>
          <path d={mkClock(100, 640, 80, 100, 116)} stroke={DAY07} strokeWidth="1.3" fill="none" />

          {/* q0 (bit0): 1→0 at E1 */}
          <text x="4" y="155" fontSize="10" fontWeight="800" fill={BLUE} fontFamily={MONO}>q[0]</text>
          <path d={`M82 148 H${E1} V162 H640`} stroke={BLUE} strokeWidth="1.6" fill="none" />
          <circle cx={E1} cy="155" r="3.2" fill={RED} />
          <text x={E1 + 8} y="150" fontSize="8" fontWeight="800" fill={RED} fontFamily={MONO}>b0: 1→0</text>

          {/* q2 (bit2): 0→1 at E2 */}
          <text x="4" y="197" fontSize="10" fontWeight="800" fill={BLUE} fontFamily={MONO}>q[2]</text>
          <path d={`M82 204 H${E2} V190 H640`} stroke={BLUE} strokeWidth="1.6" fill="none" />
          <circle cx={E2} cy="197" r="3.2" fill={RED} />
          <text x={E2 + 8} y="192" fontSize="8" fontWeight="800" fill={RED} fontFamily={MONO}>b2: 0→1</text>

          {/* q1 (bit1): 1→0 at E3 */}
          <text x="4" y="239" fontSize="10" fontWeight="800" fill={BLUE} fontFamily={MONO}>q[1]</text>
          <path d={`M82 232 H${E3} V246 H640`} stroke={BLUE} strokeWidth="1.6" fill="none" />
          <circle cx={E3} cy="239" r="3.2" fill={GREEN} />
          <text x={E3 + 8} y="234" fontSize="8" fontWeight="800" fill={GREEN} fontFamily={MONO}>b1: 1→0</text>

          {/* bus_rx 재합성 값 */}
          <text x="4" y="282" fontSize="10" fontWeight="800" fill={FPGA.dark} fontFamily={MONO}>bus</text>
          <text x="4" y="293" fontSize="7" fontWeight="700" fill={FPGA.dark} fontFamily={MONO} opacity="0.8">@rx_clk</text>
          {[
            { x: 82, w: E1 - 82, v: '011', bad: false },
            { x: E1, w: E2 - E1, v: '010', bad: true },
            { x: E2, w: E3 - E2, v: '110', bad: true },
            { x: E3, w: 640 - E3, v: '100', bad: false },
          ].map((c) => (
            <g key={c.x}>
              <rect x={c.x} y="268" width={c.w} height="24" rx="2"
                fill={c.bad ? 'rgba(229,62,62,0.16)' : 'rgba(72,187,120,0.16)'}
                stroke={c.bad ? RED : GREEN} strokeWidth="1" />
              <text x={c.x + c.w / 2} y="284" fontSize="12" fontWeight="800" textAnchor="middle"
                fill={c.bad ? RED : '#2F855A'} fontFamily={MONO}>{c.v}</text>
            </g>
          ))}
          <text x={(E1 + E3) / 2} y="312" fontSize="9" fontWeight="800" fill={RED} textAnchor="middle" fontFamily={SANS}>
            ✗ 중간값 구간 — 011도 100도 아닌 corrupt
          </text>
        </svg>
        <div style={{ fontSize: '0.9rem', color: FPGA.text, lineHeight: 1.65, marginTop: '0.45rem' }}>
          <strong style={{ color: ORANGE }}>TX</strong>: d[2:0]가 tx_clk 한 edge에서 <code>011→100</code> 동시 전이 (모든 bit 동시).
          <br />
          <strong style={{ color: DAY07 }}>RX</strong>: 각 bit가 <strong>독립 2-DFF</strong>를 거치며 metastability를 서로 다른 edge(E1·E2·E3)에서 해소 → 1~2 클록간 <strong style={{ color: RED }}>010 → 110</strong> 같은 잘못된 값을 다운스트림(FSM/카운터)이 관측.
          <br />
          단일 bit이면 0↔1 한 칸 차이라 문제없지만, <strong>bus는 bit 간 skew가 곧 잘못된 숫자</strong>가 된다.
        </div>
      </div>

      {/* === 구조 + BAD 코드 === */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '0.8rem' }}>
        {/* 구조 블록도 */}
        <div style={{
          background: FPGA.bgAlt, border: `1px solid ${FPGA.border}`,
          borderRadius: '10px', padding: '0.6rem 0.7rem',
        }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>회로 구조</div>
          <svg viewBox="0 0 320 200" style={{ width: '100%' }}>
            {/* 도메인 구분 */}
            <line x1="118" y1="6" x2="118" y2="194" stroke={FPGA.border} strokeWidth="1.2" strokeDasharray="4 3" />
            <text x="60" y="16" fontSize="8.5" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>tx_clk</text>
            <text x="222" y="16" fontSize="8.5" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily={MONO}>rx_clk</text>

            {/* TX reg */}
            <rect x="14" y="78" width="88" height="44" rx="5" stroke={ORANGE} strokeWidth="1.6" fill="rgba(221,107,32,0.10)" />
            <text x="58" y="98" fontSize="11" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>d[2:0]</text>
            <text x="58" y="113" fontSize="8" fontWeight="700" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>011→100</text>

            {/* 3개 독립 2-DFF */}
            {[
              { y: 34, b: 2 },
              { y: 86, b: 1 },
              { y: 138, b: 0 },
            ].map((d) => (
              <g key={d.b}>
                <path d={`M102 100 L150 ${d.y + 15}`} stroke={ORANGE} strokeWidth="1.3" fill="none" opacity="0.75" />
                <rect x={150} y={d.y} width="70" height="30" rx="4" stroke={DAY07} strokeWidth="1.5" fill="rgba(8,145,178,0.10)" />
                <text x={185} y={d.y + 14} fontSize="9" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily={MONO}>2-DFF</text>
                <text x={185} y={d.y + 25} fontSize="7.5" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily={MONO}>bit {d.b}</text>
                <path d={`M220 ${d.y + 15} L262 100`} stroke={DAY07} strokeWidth="1.3" fill="none" opacity="0.75" />
              </g>
            ))}

            {/* RX bus */}
            <rect x="262" y="78" width="52" height="44" rx="5" stroke={RED} strokeWidth="1.6" fill="rgba(229,62,62,0.08)" />
            <text x="288" y="96" fontSize="9" fontWeight="800" fill={RED} textAnchor="middle" fontFamily={MONO}>bus</text>
            <text x="288" y="110" fontSize="8.5" fontWeight="800" fill={RED} textAnchor="middle" fontFamily={MONO}>✗</text>

            <text x="160" y="186" fontSize="8.5" fontWeight="800" fill={FPGA.text} textAnchor="middle" fontFamily={SANS}>
              bit마다 독립 해소 → edge 제각각
            </text>
          </svg>
        </div>

        {/* BAD 코드 */}
        <div style={{ background: '#1A2235', borderRadius: '10px', padding: '0.6rem 0.85rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FCA5A5', marginBottom: '0.4rem', letterSpacing: '0.04em', fontFamily: MONO }}>
            ✗ BAD — bus를 bit마다 따로 2-DFF
          </div>
          <pre style={{
            margin: 0, fontSize: '0.84rem', lineHeight: 1.55, color: '#E2E8F0',
            fontFamily: 'Consolas, "Courier New", monospace',
            fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "calt" 0',
            whiteSpace: 'pre-wrap',
          }}>{`module bus_bad #(parameter W = 3) (
    input              clk_rx, rst_n,
    input      [W-1:0] d_tx,   // tx_clk 동기 버스
    output     [W-1:0] d_rx    // rx_clk 도메인
);
    reg [W-1:0] meta, sync;
    always @(posedge clk_rx or negedge rst_n)
        if (!rst_n) {sync, meta} <= '0;
        else        {sync, meta} <= {meta, d_tx};
        //  ↑ 각 bit가 독립적으로 meta 해소
        //    → 해소 edge가 bit마다 달라짐
    assign d_rx = sync;        // → 중간값(010,110) 노출
endmodule`}</pre>
        </div>
      </div>

      {/* 해결책 요약 */}
      <div style={{
        marginTop: '0.8rem',
        background: `linear-gradient(135deg, rgba(72,187,120,0.06), rgba(72,187,120,0.14))`,
        border: `1px solid ${GREEN}40`, borderLeft: `4px solid ${GREEN}`,
        borderRadius: '8px', padding: '0.7rem 0.95rem',
        fontSize: '0.9rem', color: FPGA.text, lineHeight: 1.65,
      }}>
        <strong style={{ color: GREEN }}>해결</strong> — bit 간 skew를 없애거나 무해화:
        {' '}<strong>Gray code</strong>(한 번에 1 bit만 변화) · <strong>DMUX/Handshake</strong>(안정 구간에만 capture) · <strong>Async FIFO</strong>(gray 포인터 + flow control). 또는 단순 <code>cfg_reg -stable</code>(write 1회 후 충분히 안정 뒤 read).
      </div>
    </div>
  );
}

export default function MultiBitCoherencySlide() {
  const [open, setOpen] = useState(false);

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="bus 전송 시 일관성 위험"
          title="Multi-bit 일관성 · Reconvergence"
          subtitle="단일 bit OK ≠ bus OK · 동기화 후 합쳐지는 신호의 위험"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* 상단 — multi_bits 문제 (BAD vs GOOD) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))',
              border: '1px solid rgba(229,62,62,0.30)',
              borderLeft: '4px solid #E53E3E',
              borderRadius: '10px',
              padding: '0.7rem 0.9rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: RED, marginBottom: '0.35rem' }}>
                ✗ Multi-bit + per-bit 2-DFF
              </div>

              {/* 구조도 — tx_clk 버스 → bit별 독립 2-DFF(rx_clk) → 재합성 시 어긋남 */}
              <div
                onClick={() => setOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); } }}
                style={{ cursor: 'pointer', borderRadius: '8px' }}
                title="동작 타이밍 자세히 보기"
              >
                <svg viewBox="0 0 400 184" style={{ width: '100%' }}>
                  {/* 도메인 구분선 */}
                  <line x1="126" y1="8" x2="126" y2="132" stroke="#CBD5E0" strokeWidth="1.2" strokeDasharray="4 3" />
                  <text x="62" y="14" fontSize="8" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>tx_clk 도메인</text>
                  <text x="270" y="14" fontSize="8" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily={MONO}>rx_clk 도메인</text>

                  {/* TX reg (동시 변화 버스) */}
                  <text x="46" y="46" fontSize="8" fontWeight="700" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>011→100 동시</text>
                  <rect x="8" y="54" width="80" height="42" rx="5" stroke={ORANGE} strokeWidth="1.6" fill="rgba(221,107,32,0.10)" />
                  <text x="48" y="72" fontSize="11" fontWeight="800" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>d[2:0]</text>
                  <text x="48" y="87" fontSize="7.5" fontWeight="700" fill={ORANGE} textAnchor="middle" fontFamily={MONO}>@ tx_clk</text>

                  {/* 3개 독립 2-DFF (rx_clk) */}
                  {[
                    { y: 22, b: 2 },
                    { y: 64, b: 1 },
                    { y: 106, b: 0 },
                  ].map((d) => (
                    <g key={d.b}>
                      <path d={`M88 75 L168 ${d.y + 14}`} stroke={ORANGE} strokeWidth="1.3" fill="none" opacity="0.7" />
                      <rect x={168} y={d.y} width="84" height="28" rx="4" stroke={DAY07} strokeWidth="1.5" fill="rgba(8,145,178,0.10)" />
                      <text x={210} y={d.y + 13} fontSize="8.5" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily={MONO}>2-DFF bit{d.b}</text>
                      <text x={210} y={d.y + 23} fontSize="7" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily={MONO}>@ rx_clk</text>
                      <path d={`M252 ${d.y + 14} L312 75`} stroke={DAY07} strokeWidth="1.3" fill="none" opacity="0.7" />
                    </g>
                  ))}

                  {/* RX bus (어긋남) */}
                  <rect x="312" y="54" width="80" height="42" rx="5" stroke={RED} strokeWidth="1.6" fill="rgba(229,62,62,0.08)" />
                  <text x="352" y="71" fontSize="9.5" fontWeight="800" fill={RED} textAnchor="middle" fontFamily={MONO}>bus @rx</text>
                  <text x="352" y="86" fontSize="9" fontWeight="800" fill={RED} textAnchor="middle" fontFamily={MONO}>✗ 010/110</text>

                  {/* 핵심 주석 */}
                  <text x="200" y="154" fontSize="8.5" fontWeight="800" fill={FPGA.text} textAnchor="middle" fontFamily={SANS}>
                    각 bit 독립 2-DFF → 해소 edge가 bit마다 달라 버스가 깨짐
                  </text>
                  {/* 클릭 유도 */}
                  <text x="200" y="176" fontSize="9" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily={MONO}>
                    ▷ 동작 타이밍 자세히 보기
                  </text>
                </svg>
              </div>

              <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1rem', fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.5 }}>
                <li>TX는 <code>011→100</code> 동시 전이 — 그러나 RX는 bit별 해소 edge가 어긋남</li>
                <li>그 사이 <strong>010 · 110</strong> 중간값을 몇 클록간 관측 → FSM 오동작</li>
                <li>scheme: <code>multi_bits</code> · Violation</li>
              </ul>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(72,187,120,0.05), rgba(72,187,120,0.12))',
              border: '1px solid rgba(72,187,120,0.30)',
              borderLeft: '4px solid #48BB78',
              borderRadius: '10px',
              padding: '0.7rem 0.9rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#48BB78', marginBottom: '0.35rem' }}>
                ✓ Bus 일관성 보장 패턴
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.72rem', color: FPGA.text, lineHeight: 1.55 }}>
                <div>
                  <strong style={{ color: '#48BB78' }}>① Stable (configuration)</strong>: SW가 한번만 write · RX는 충분히 안정된 후 read.
                  <br />→ <code>cdc signal cfg_reg[7:0] -stable</code>
                </div>
                <div>
                  <strong style={{ color: '#48BB78' }}>② Gray code</strong>: 한 번에 1 bit만 변화 → bit별 sync 가능. FIFO 포인터에 적용.
                </div>
                <div>
                  <strong style={{ color: '#48BB78' }}>③ DMUX / Handshake</strong>: 별도 동기 신호로 capture timing 제어. TX는 안정 구간 동안 hold.
                </div>
                <div>
                  <strong style={{ color: '#48BB78' }}>④ Async FIFO</strong>: 가장 깔끔. 데이터 + valid + flow control 자동.
                </div>
              </div>
            </div>
          </div>

          {/* 하단 — Reconvergence 설명 */}
          <div style={{
            flex: 1, minHeight: 0,
            background: FPGA.white,
            border: `1px solid ${DAY07}25`,
            borderTop: `3px solid ${DAY07}`,
            borderRadius: '10px',
            padding: '0.7rem 0.9rem',
            boxShadow: shadow.card,
            display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.7rem',
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.4rem' }}>
                Reconvergence — 동기화 후 합쳐지는 신호
              </div>
              <svg viewBox="0 0 460 110" style={{ width: '100%' }}>
                {/* source */}
                <rect x="10" y="40" width="50" height="22" rx="3" stroke={DAY07} strokeWidth="1.5" fill="rgba(8,145,178,0.10)" />
                <text x="35" y="55" fontSize="10" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily={MONO}>CLK_A</text>
                {/* split */}
                <path d="M60 51 L120 25 L150 25" stroke={DAY07} strokeWidth="1.5" fill="none" />
                <path d="M60 51 L120 77 L150 77" stroke={DAY07} strokeWidth="1.5" fill="none" />

                {/* sync1, sync2 (서로 다른 지연) */}
                <rect x="150" y="15" width="60" height="22" rx="3" stroke="#4A6FA5" strokeWidth="1.5" fill="rgba(74,111,165,0.10)" />
                <text x="180" y="29" fontSize="9" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>SYNC1</text>
                <rect x="150" y="67" width="60" height="22" rx="3" stroke="#4A6FA5" strokeWidth="1.5" fill="rgba(74,111,165,0.10)" />
                <text x="180" y="81" fontSize="9" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily={MONO}>SYNC2</text>

                {/* recombine */}
                <path d="M210 26 L320 26 L340 51" stroke="#4A6FA5" strokeWidth="1.5" fill="none" />
                <path d="M210 78 L320 78 L340 51" stroke="#4A6FA5" strokeWidth="1.5" fill="none" />
                <rect x="340" y="38" width="60" height="28" rx="4" stroke="#E53E3E" strokeWidth="1.8" fill="rgba(229,62,62,0.08)" />
                <text x="370" y="56" fontSize="10" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily={MONO}>RECONV</text>
                <text x="370" y="84" fontSize="9" fontWeight="700" fill="#E53E3E" textAnchor="middle" fontFamily={SANS}>불일치 위험</text>

                <text x="35" y="85" fontSize="8" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily={SANS}>단일 source</text>
              </svg>
              <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.55, marginTop: '0.3rem' }}>
                두 path가 <strong>서로 다른 동기화 지연</strong>을 거친 후 다시 합쳐지면, 한 path만 metastability 해소 → 일시적으로 <strong>불일치</strong> 발생. RX 로직이 이를 견뎌야 함.
              </div>
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${DAY07}06, ${DAY07}14)`,
              border: `1px solid ${DAY07}30`,
              borderRadius: '8px',
              padding: '0.6rem 0.75rem',
              display: 'flex', flexDirection: 'column', gap: '0.35rem',
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: DAY07 }}>
                Questa CDC Reconv. 분류
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.7 }}>
                <li><code>reconvergence</code> — 일반 (Caution)</li>
                <li><code>reconvergence_bus</code> — bus bit (Violation)</li>
                <li><code>reconvergence_gray</code> — gray-coded (Evaluation)</li>
                <li><code>single_source_reconvergence</code> — 단일 source (Violation)</li>
                <li><code>reconvergence_multi_tx_clock</code> — 서로 다른 TX (Violation)</li>
              </ul>
              <div style={{ fontSize: '0.62rem', color: FPGA.textLight, fontStyle: 'italic', marginTop: '0.2rem' }}>
                Start goal에서는 off · Implementation/Release goal에서 활성화 권장.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <SlideModal open={open} onClose={() => setOpen(false)} contentStyle={modalStyle}>
        <BadBusDetail onClose={() => setOpen(false)} />
      </SlideModal>
    </section>
  );
}
