'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY12 = '#177E89';

export default function UartProtocolSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 1 · 프로토콜"
          title="UART frame — start · 8 data · stop"
          subtitle="공유 클럭 없는 비동기 직렬 · 양쪽이 동일 baud rate로 비트 타이밍 합의"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* frame 다이어그램 */}
          <div style={{
            background: FPGA.white, border: `1px solid ${DAY12}25`,
            borderTop: `3px solid ${DAY12}`, borderRadius: '12px',
            padding: '0.7rem 0.9rem', boxShadow: shadow.card,
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.4rem' }}>
              8N1 frame (8 data · No parity · 1 stop)
            </div>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: '2px', height: '52px' }}>
              <div style={{ flex: 1.2, background: 'rgba(229,62,62,0.10)', border: '1px solid #E53E3E', borderRadius: '6px 0 0 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#E53E3E' }}>idle</span>
                <span style={{ fontSize: '0.54rem', color: FPGA.textLight, fontFamily: '"JetBrains Mono", monospace' }}>=1</span>
              </div>
              <div style={{ flex: 1, background: `${DAY12}18`, border: `1px solid ${DAY12}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: DAY12 }}>start</span>
                <span style={{ fontSize: '0.54rem', color: FPGA.textLight, fontFamily: '"JetBrains Mono", monospace' }}>=0</span>
              </div>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((b) => (
                <div key={b} style={{ flex: 1, background: 'rgba(74,111,165,0.10)', border: '1px solid #4A6FA5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#4A6FA5', fontFamily: '"JetBrains Mono", monospace' }}>D{b}</span>
                </div>
              ))}
              <div style={{ flex: 1, background: 'rgba(72,187,120,0.12)', border: '1px solid #48BB78', borderRadius: '0 6px 6px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#48BB78' }}>stop</span>
                <span style={{ fontSize: '0.54rem', color: FPGA.textLight, fontFamily: '"JetBrains Mono", monospace' }}>=1</span>
              </div>
            </div>
            <div style={{ fontSize: '0.62rem', color: FPGA.textLight, marginTop: '0.35rem', fontFamily: '"JetBrains Mono", monospace' }}>
              ← LSB first (D0 먼저 전송) · 각 비트 폭 = 1 / baud
            </div>
          </div>

          {/* 하단: 핵심 파라미터 3카드 */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
            {[
              {
                t: 'baud rate', c: DAY12,
                d: '초당 비트 수. 예 115200 bps → bit period ≈ 8.68µs.',
                f: '115200 / 9600 …',
              },
              {
                t: 'bit period', c: '#4A6FA5',
                d: '한 비트 유지 시간 = clk / baud 분주. 100MHz·115200 → 868 clk.',
                f: 'DIV = CLK_HZ / BAUD',
              },
              {
                t: '비동기 = CDC', c: '#E53E3E',
                d: 'RX 입력은 송신측 클럭 기준 → 수신 clk와 무관. 2FF 동기화 필수.',
                f: 'rx → 2FF → sample',
              },
            ].map((x) => (
              <div key={x.t} style={{
                background: `linear-gradient(135deg, ${x.c}07, ${x.c}13)`,
                border: `1px solid ${x.c}28`, borderTop: `3px solid ${x.c}`,
                borderRadius: '10px', padding: '0.6rem 0.8rem', boxShadow: shadow.card,
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: x.c, marginBottom: '0.25rem' }}>{x.t}</div>
                <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.55, flex: 1 }}>{x.d}</div>
                <code style={{ fontSize: '0.6rem', color: x.c, background: `${x.c}10`, padding: '2px 6px', borderRadius: '4px', marginTop: '0.35rem', fontFamily: '"JetBrains Mono", monospace' }}>{x.f}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
