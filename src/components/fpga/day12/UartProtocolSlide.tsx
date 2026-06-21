'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY12 = '#177E89';
const BLUE = '#4A6FA5';
const MONO = '"JetBrains Mono", monospace';

// 예: 문자 'A' = 0x41 = 0b0100_0001 → LSB first 전송순서 D0..D7 = 1 0 0 0 0 0 1 0
const DATA = [1, 0, 0, 0, 0, 0, 1, 0]; // D0..D7

// 11 칸: idle · start · D0..D7 · stop
const cells = [
  { l: 'idle', v: '1', c: '#E53E3E' },
  { l: 'start', v: '0', c: DAY12 },
  ...DATA.map((b, i) => ({ l: `D${i}`, v: String(b), c: BLUE })),
  { l: 'stop', v: '1', c: '#48BB78' },
];

// frame 파형 레벨 (1=high, 0=low) — idle, start, D0..D7, stop
const levels = [1, 0, ...DATA, 1];
const yH = 5, yL = 19;
const wavePts = levels
  .flatMap((lv, i) => { const y = lv ? yH : yL; return [`${i},${y}`, `${i + 1},${y}`]; })
  .join(' ');

// bit period 타이밍도: start · D0 · D1 (각 16 oversample tick), 중앙(8) tick 샘플
const OS = 16;
const TBITS = [{ l: 'start', lv: 0 }, { l: 'D0', lv: 1 }, { l: 'D1', lv: 0 }];
const TW = OS * TBITS.length;
const tHi = 4, tLo = 14;
const tWave = TBITS
  .flatMap((b, k) => { const y = b.lv ? tHi : tLo; return [`${k * OS},${y}`, `${(k + 1) * OS},${y}`]; })
  .join(' ');

export default function UartProtocolSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 1 · 프로토콜"
          title="UART frame 구조 — start · 8 data · stop"
          subtitle="공유 클럭 없는 비동기 직렬 · 양쪽이 동일 baud rate로 비트 타이밍 합의"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

          {/* ── frame 다이어그램: 셀 + 실제 신호 파형 (예: 'A') ── */}
          <div style={{
            background: FPGA.white, border: `1px solid ${DAY12}25`,
            borderTop: `3px solid ${DAY12}`, borderRadius: '12px',
            padding: '0.6rem 0.9rem', boxShadow: shadow.card, flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: FPGA.dark }}>
                8N1 frame (8 data · No parity · 1 stop)
              </span>
              <span style={{ fontSize: '0.66rem', color: FPGA.textLight, fontFamily: MONO }}>
                예: 문자 <b style={{ color: DAY12 }}>&apos;A&apos;</b> = 0x41 = 0b0100_0001 전송
              </span>
            </div>

            {/* 셀 (11 등분) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: '2px', height: '44px' }}>
              {cells.map((x, i) => (
                <div key={i} style={{
                  background: `${x.c}14`, border: `1px solid ${x.c}`,
                  borderRadius: i === 0 ? '6px 0 0 6px' : i === cells.length - 1 ? '0 6px 6px 0' : '0',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1px',
                }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: x.c, fontFamily: MONO }}>{x.l}</span>
                  <span style={{ fontSize: '0.66rem', fontWeight: 800, color: FPGA.dark, fontFamily: MONO }}>{x.v}</span>
                </div>
              ))}
            </div>

            {/* 실제 신호 파형 (셀과 열 정렬) */}
            <svg viewBox="0 0 11 24" preserveAspectRatio="none" width="100%" height="30" style={{ marginTop: '4px', display: 'block' }}>
              <line x1="0" y1={yH} x2="11" y2={yH} stroke={FPGA.border} strokeWidth="0.4" vectorEffect="non-scaling-stroke" strokeDasharray="2 2" />
              <line x1="0" y1={yL} x2="11" y2={yL} stroke={FPGA.border} strokeWidth="0.4" vectorEffect="non-scaling-stroke" strokeDasharray="2 2" />
              {Array.from({ length: 12 }, (_, i) => (
                <line key={i} x1={i} y1="2" x2={i} y2="22" stroke={FPGA.border} strokeWidth="0.4" vectorEffect="non-scaling-stroke" opacity="0.5" />
              ))}
              <polyline points={wavePts} fill="none" stroke={DAY12} strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
              <span style={{ fontSize: '0.62rem', color: FPGA.textLight, fontFamily: MONO }}>
                ← LSB first · idle/stop = High(1) · start = Low(0) · 각 비트 폭 = 1/baud
              </span>
              <span style={{ fontSize: '0.62rem', color: DAY12, fontFamily: MONO }}>
                wire 전송순서 = 1·<b>0</b>·10000010·<b>1</b>
              </span>
            </div>
          </div>

          {/* ── 2×2 카드 ── */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '0.55rem' }}>

            {/* (1) baud rate */}
            <Card color={DAY12} title="baud rate — 초당 비트 수">
              <Body>두 장치가 <b>동일 baud</b>로 약속 → 1비트 시간(bit period)이 정해짐. 클럭선이 없으니 이 값이 유일한 타이밍 기준.</Body>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.6rem', fontFamily: MONO, marginTop: '0.35rem' }}>
                <thead>
                  <tr style={{ color: DAY12, fontWeight: 800 }}>
                    <td style={thTd}>baud</td><td style={{ ...thTd, textAlign: 'right' }}>bit period</td><td style={{ ...thTd, textAlign: 'right' }}>1 byte(10b)</td>
                  </tr>
                </thead>
                <tbody style={{ color: FPGA.text }}>
                  {[['9600', '104.2 µs', '1.04 ms'], ['115200', '8.68 µs', '86.8 µs'], ['921600', '1.09 µs', '10.9 µs']].map((r) => (
                    <tr key={r[0]}>
                      <td style={thTd}>{r[0]}</td><td style={{ ...thTd, textAlign: 'right' }}>{r[1]}</td><td style={{ ...thTd, textAlign: 'right' }}>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Foot color={DAY12}>baud 오차 누적 &lt; ~3%/bit 허용 (10비트 프레임)</Foot>
            </Card>

            {/* (2) bit period & oversampling — 타이밍도 (가장 핵심) */}
            <Card color={BLUE} title="bit period & oversampling — 예: 9600 baud">
              <Body>1비트를 <b>16 tick으로 분할(oversample)</b>해 그 <b>중앙 tick</b>에서 값을 읽음 → 시작/끝 에지 흔들림을 피해 안정적 수신.</Body>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '0.3rem' }}>
                {['1/9600 = 104.2 µs/bit', 'tick = 104.2/16 = 6.51 µs', '@100MHz: 1bit=10417clk · 1tick=651clk'].map((t) => (
                  <code key={t} style={{ fontSize: '0.55rem', color: BLUE, background: `${BLUE}10`, border: `1px solid ${BLUE}22`, padding: '1px 6px', borderRadius: '4px', fontFamily: MONO }}>{t}</code>
                ))}
              </div>

              {/* 타이밍도: 파형 + tick 자 (3 비트 정렬) */}
              <div style={{ marginTop: '0.35rem' }}>
                <svg viewBox={`0 0 ${TW} 18`} preserveAspectRatio="none" width="100%" height="28" style={{ display: 'block' }}>
                  {[0, 1, 2, 3].map((i) => (
                    <line key={i} x1={i * OS} y1="1" x2={i * OS} y2="17" stroke={FPGA.border} strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                  ))}
                  {[0, 1, 2].map((k) => (
                    <line key={k} x1={k * OS + 8} y1="1" x2={k * OS + 8} y2="17" stroke={DAY12} strokeWidth="1" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" opacity="0.75" />
                  ))}
                  <polyline points={tWave} fill="none" stroke={BLUE} strokeWidth="2.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                </svg>
                {/* tick 자 (각 비트 16 tick, 8번째 강조) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                  {TBITS.map((b, k) => (
                    <div key={b.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1px', width: '100%', height: '15px', padding: '0 1px' }}>
                        {Array.from({ length: OS }, (_, i) => (
                          <div key={i} style={{ flex: 1, height: i === 8 ? '15px' : '7px', background: i === 8 ? DAY12 : '#cbd5e0', borderRadius: '1px' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.56rem', fontFamily: MONO, fontWeight: 700, color: k === 0 ? DAY12 : BLUE, marginTop: '1px' }}>{b.l}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '0.57rem', color: FPGA.textLight, marginTop: '2px', textAlign: 'center' }}>
                  start 검출 → 8 tick 대기 → <b style={{ color: DAY12 }}>중앙(8) tick 샘플</b> → 이후 16 tick 간격 반복
                </div>
              </div>
            </Card>

            {/* (3) 비동기 = CDC */}
            <Card color="#E53E3E" title="비동기 = CDC 문제">
              <Body>RX 입력은 <b>송신측 클럭</b> 기준 → 수신 clk와 위상 무관. 두 클럭 도메인이 만나는 지점 = <b>metastability</b> 위험.</Body>
              {[
                ['2FF 동기화', 'rx 입력을 수신 clk로 2단 플립플롭 통과 후 사용'],
                ['start 에지 검출', '동기화된 신호에서 1→0 하강에지로 frame 시작 포착'],
                ['중앙 샘플', 'start 후 0.5비트 지연 → 이후 1비트 간격 샘플'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '6px', marginTop: '0.28rem', alignItems: 'baseline' }}>
                  <span style={{ color: '#E53E3E', fontWeight: 800, fontSize: '0.62rem', flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.4 }}><b style={{ color: '#C53030' }}>{k}</b> — {v}</span>
                </div>
              ))}
              <Foot color="#E53E3E">rx → [FF → FF] → edge → mid-bit sample</Foot>
            </Card>

            {/* (4) 8N1 표기법 & 에러 검출 */}
            <Card color="#8B6FA5" title="8N1 표기법 & 에러 검출">
              <Body><b>8 N 1</b> = <b>8</b> data · <b>N</b>o parity · <b>1</b> stop. 표기 = [data][parity][stop].</Body>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '0.3rem' }}>
                {['7E1', '8E1', '8O1', '8N2'].map((t) => (
                  <code key={t} style={{ fontSize: '0.58rem', color: '#8B6FA5', background: '#8B6FA510', border: '1px solid #8B6FA533', padding: '1px 7px', borderRadius: '4px', fontFamily: MONO }}>{t}</code>
                ))}
              </div>
              {[
                ['parity', 'even/odd 1비트 추가 → 1비트 오류를 단순 검출'],
                ['framing error', 'stop 위치가 0이면 → baud 불일치·노이즈 감지'],
                ['stop 2비트', '느린 수신측에 처리 여유 → 신뢰성 ↑'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '6px', marginTop: '0.26rem', alignItems: 'baseline' }}>
                  <span style={{ color: '#8B6FA5', fontWeight: 800, fontSize: '0.62rem', flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.4 }}><b style={{ color: '#6B4F85' }}>{k}</b> — {v}</span>
                </div>
              ))}
              <Foot color="#8B6FA5">stop=0 검출 → framing error 플래그</Foot>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

const thTd = { padding: '2px 4px', borderBottom: `1px solid ${FPGA.border}`, textAlign: 'left' as const };

function Card({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}07, ${color}13)`,
      border: `1px solid ${color}28`, borderTop: `3px solid ${color}`,
      borderRadius: '12px', padding: '0.55rem 0.8rem', boxShadow: shadow.card,
      display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden',
    }}>
      <div style={{ fontSize: '0.76rem', fontWeight: 800, color, marginBottom: '0.28rem' }}>{title}</div>
      {children}
    </div>
  );
}

function Body({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.5, ...style }}>{children}</div>;
}

function Foot({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <code style={{
      marginTop: 'auto', fontSize: '0.58rem', color, background: `${color}10`,
      padding: '3px 7px', borderRadius: '4px', fontFamily: MONO,
      alignSelf: 'flex-start', marginRight: 'auto',
    }}>{children}</code>
  );
}
