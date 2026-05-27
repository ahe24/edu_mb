'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY08 = '#0E7C7B';

export default function CaseComboLogicSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="CASE 3 · combo_logic"
          title="Combinational logic before synchronizer"
          subtitle="trip_count + offset (proc_clk → bus_clk) · 합산이 2DFF 앞 — glitch가 메타 유발"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
            {/* BAD */}
            <div style={{
              background: FPGA.white,
              border: '1px solid rgba(229,62,62,0.30)',
              borderTop: '3px solid #E53E3E',
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#E53E3E', marginBottom: '0.4rem' }}>
                ✗ BEFORE — combo + 2DFF
              </div>
              <svg viewBox="0 0 420 95" style={{ width: '100%' }}>
                {/* trip_count flop */}
                <rect x="6" y="20" width="60" height="22" rx="3" stroke="#4A6FA5" strokeWidth="1.2" fill="rgba(74,111,165,0.10)" />
                <text x="36" y="14" fontSize="8" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">proc_clk</text>
                <text x="36" y="34" fontSize="9" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">trip_cnt</text>
                {/* offset (from bus_clk) */}
                <rect x="6" y="55" width="60" height="22" rx="3" stroke="#DD6B20" strokeWidth="1.2" fill="rgba(221,107,32,0.10)" />
                <text x="36" y="49" fontSize="8" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">bus_clk</text>
                <text x="36" y="69" fontSize="9" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">offset</text>
                {/* ADD combinational */}
                <path d="M66 31 L130 31 L140 45" stroke="#E53E3E" strokeWidth="1.4" fill="none" />
                <path d="M66 66 L130 66 L140 53" stroke="#E53E3E" strokeWidth="1.4" fill="none" />
                <circle cx="145" cy="49" r="13" stroke="#E53E3E" strokeWidth="1.8" fill="rgba(229,62,62,0.10)" />
                <text x="145" y="53" fontSize="10" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">+</text>
                {/* combo path (dashed = unstable) */}
                <path d="M158 49 L240 49" stroke="#E53E3E" strokeWidth="1.8" strokeDasharray="4 3" fill="none" />
                <text x="200" y="40" fontSize="8" fontWeight="700" fill="#E53E3E" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">combo (glitch)</text>
                {/* 2DFF */}
                <rect x="240" y="35" width="65" height="28" rx="4" stroke="#E53E3E" strokeWidth="1.5" fill="rgba(229,62,62,0.06)" />
                <text x="272" y="53" fontSize="10" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">2DFF</text>
                <text x="272" y="80" fontSize="8" fontWeight="700" fill="#E53E3E" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">bus_clk</text>
                {/* output */}
                <path d="M305 49 L400 49" stroke="#E53E3E" strokeWidth="1.2" fill="none" />
                <text x="350" y="40" fontSize="8" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">trip_count_bus</text>
              </svg>
              <pre style={{
                margin: '0.3rem 0 0', fontSize: '0.6rem', lineHeight: 1.5,
                background: '#1A2235', color: '#D4D4D4',
                padding: '0.4rem 0.65rem', borderRadius: '5px',
                borderLeft: '2px solid #E53E3E',
                fontFamily: '"JetBrains Mono", Consolas, monospace',
                whiteSpace: 'pre-wrap',
              }}>
                <span style={{ color: '#569CD6' }}>wire</span> <span style={{ color: '#569CD6' }}>[7:0]</span> <span style={{ color: '#F0A0A0', fontWeight: 'bold' }}>sum</span> = trip_count_proc{"\n"}
                {"                "}+ offset_cfg_bus<span style={{ color: '#569CD6' }}>[7:0]</span>;{"\n"}
                <span style={{ color: '#4EC9B0' }}>sync_2dff</span> <span style={{ color: '#569CD6' }}>#(.W(8))</span> <span style={{ color: '#DCDCAA' }}>u_sync_count</span> ({"\n"}
                {"  "}.<span style={{ color: '#9CDCFE' }}>din</span> (<span style={{ color: '#E53E3E', fontWeight: 'bold', textDecoration: 'underline' }}>sum</span>),  <span style={{ color: '#6A9955' }}>// ← combo before sync</span>{"\n"}
                {"  "}.<span style={{ color: '#9CDCFE' }}>dout</span>(trip_count_bus));
              </pre>
            </div>

            {/* GOOD */}
            <div style={{
              background: FPGA.white,
              border: '1px solid rgba(72,187,120,0.30)',
              borderTop: '3px solid #48BB78',
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#48BB78', marginBottom: '0.4rem' }}>
                ✓ AFTER — register 후 sync
              </div>
              <svg viewBox="0 0 420 95" style={{ width: '100%' }}>
                <rect x="6" y="20" width="60" height="22" rx="3" stroke="#4A6FA5" strokeWidth="1.2" fill="rgba(74,111,165,0.10)" />
                <text x="36" y="14" fontSize="8" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">proc_clk</text>
                <text x="36" y="34" fontSize="9" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">trip_cnt</text>
                <rect x="6" y="55" width="60" height="22" rx="3" stroke="#DD6B20" strokeWidth="1.2" fill="rgba(221,107,32,0.10)" />
                <text x="36" y="49" fontSize="8" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">offset(sync)</text>
                <text x="36" y="69" fontSize="9" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">_sync</text>
                <path d="M66 31 L120 31 L130 45" stroke="#48BB78" strokeWidth="1.4" fill="none" />
                <path d="M66 66 L120 66 L130 53" stroke="#48BB78" strokeWidth="1.4" fill="none" />
                <circle cx="135" cy="49" r="13" stroke="#48BB78" strokeWidth="1.5" fill="rgba(72,187,120,0.10)" />
                <text x="135" y="53" fontSize="10" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">+</text>
                {/* register (sum_r) */}
                <rect x="155" y="37" width="55" height="24" rx="3" stroke="#48BB78" strokeWidth="1.5" fill="rgba(72,187,120,0.10)" />
                <text x="182" y="53" fontSize="9" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">sum_r</text>
                <text x="182" y="78" fontSize="8" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">proc_clk</text>
                <path d="M210 49 L245 49" stroke="#48BB78" strokeWidth="1.5" fill="none" />
                {/* 2DFF */}
                <rect x="245" y="35" width="65" height="28" rx="4" stroke="#4A6FA5" strokeWidth="1.5" fill="rgba(74,111,165,0.06)" />
                <text x="277" y="53" fontSize="10" fontWeight="800" fill="#4A6FA5" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">2DFF</text>
                <text x="277" y="80" fontSize="8" fontWeight="700" fill="#4A6FA5" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">bus_clk</text>
                <path d="M310 49 L400 49" stroke="#4A6FA5" strokeWidth="1.2" fill="none" />
                <text x="355" y="40" fontSize="8" fontWeight="700" fill={FPGA.textLight} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">trip_count_bus</text>
              </svg>
              <pre style={{
                margin: '0.3rem 0 0', fontSize: '0.6rem', lineHeight: 1.5,
                background: '#1A2235', color: '#D4D4D4',
                padding: '0.4rem 0.65rem', borderRadius: '5px',
                borderLeft: '2px solid #48BB78',
                fontFamily: '"JetBrains Mono", Consolas, monospace',
                whiteSpace: 'pre-wrap',
              }}>
                <span style={{ color: '#6A9955' }}>// proc_clk 단에서 register</span>{"\n"}
                <span style={{ color: '#569CD6' }}>reg</span> <span style={{ color: '#569CD6' }}>[7:0]</span> <span style={{ color: '#A8D8A8', fontWeight: 'bold' }}>sum_r</span>;{"\n"}
                <span style={{ color: '#C586C0' }}>always</span> @(<span style={{ color: '#569CD6' }}>posedge</span> proc_clk){"\n"}
                {"  "}<span style={{ color: '#A8D8A8', fontWeight: 'bold' }}>sum_r</span> &lt;= trip_count_proc{"\n"}
                {"        "}+ offset_cfg_sync;  <span style={{ color: '#6A9955' }}>// sync된 값</span>{"\n"}
                <span style={{ color: '#4EC9B0' }}>sync_2dff</span> <span style={{ color: '#569CD6' }}>#(.W(8))</span> <span style={{ color: '#DCDCAA' }}>u_sync_count</span> ({"\n"}
                {"  "}.<span style={{ color: '#9CDCFE' }}>din</span> (<span style={{ color: '#48BB78', fontWeight: 'bold', textDecoration: 'underline' }}>sum_r</span>), .<span style={{ color: '#9CDCFE' }}>dout</span>(trip_count_bus));
              </pre>
            </div>
          </div>

          {/* 하단 — 디버그 절차 + 일반 원리 */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem',
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
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: DAY08 }}>
                왜 위험한가
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.6 }}>
                <li>Combinational gate는 input 천이 시 <strong>glitch</strong> 생성</li>
                <li>glitch가 RX clock과 정렬되면 → 메타 발생</li>
                <li>2DFF는 stable 입력 가정 — glitch는 못 잡음</li>
                <li>심지어 TX 두 source가 다른 도메인이면 <code>fanin_different_clks</code> 추가 violation</li>
              </ul>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${DAY08}06, ${DAY08}14)`,
              border: `1px solid ${DAY08}30`,
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column', gap: '0.35rem',
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: DAY08 }}>
                일반 원리
              </div>
              <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.6 }}>
                <strong>TX flop → Synchronizer</strong> 직결이 원칙. 합산/논리/조합은 모두 TX 단에서 register 후 sync로 보내야 함.
                Multi-source 합산이면 모든 source를 TX 도메인에 먼저 sync한 뒤 register.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
