'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY12 = '#177E89';
const MONO = '"JetBrains Mono", monospace';

// OneDark 콘솔 팔레트
const C = {
  green: '#98C379', cyan: '#56B6C2', amber: '#E5C07B',
  gray: '#ABB2BF', prompt: '#E6E6E6', dim: '#6B7280',
};

/** 클릭 시 한 줄씩 재생되는 BIT(Built-In Test) 시퀀스 */
type Line = { t: string; c: string; d: number };
const script: Line[] = [
  { t: 'safety-ctrl> bit', c: C.prompt, d: 120 },
  { t: '[BIT ] power-on self-test ...', c: C.cyan, d: 520 },
  { t: '[ OK ] clock      100 MHz PLL locked', c: C.green, d: 300 },
  { t: '[ OK ] uart       115200 8N1  framing ok', c: C.green, d: 300 },
  { t: '[ OK ] temp       sensor ch0   resp 0.4ms', c: C.green, d: 280 },
  { t: '[ OK ] volt       sensor ch1   resp 0.3ms', c: C.green, d: 280 },
  { t: '[ OK ] press      sensor ch2   resp 0.5ms', c: C.green, d: 280 },
  { t: '[ OK ] current    sensor ch3   resp 0.4ms', c: C.green, d: 280 },
  { t: '[ OK ] vibration  sensor ch4   resp 0.6ms', c: C.green, d: 280 },
  { t: '[BIT ] PASS   5/5 sensors healthy', c: C.cyan, d: 560 },
  { t: 'safety-ctrl> mon 1s', c: C.prompt, d: 480 },
  { t: '  t+00s  temp 41.2C  volt 24.03V  press 1.013bar', c: C.gray, d: 360 },
  { t: '  t+01s  temp 41.3C  volt 24.01V  press 1.013bar', c: C.gray, d: 360 },
  { t: '  t+02s  temp 41.5C  volt 24.04V  press 1.012bar', c: C.gray, d: 360 },
  { t: '[WARN] temp ch0  41.9C  > warn 41.5C', c: C.amber, d: 460 },
  { t: '  t+03s  temp 41.9C  volt 24.02V  press 1.013bar', c: C.gray, d: 360 },
  { t: '  t+04s  temp 41.6C  volt 24.03V  press 1.013bar', c: C.gray, d: 360 },
  { t: 'safety-ctrl> log faults', c: C.prompt, d: 460 },
  { t: '  faults = 0    resets = 0    uptime = 0042s', c: C.gray, d: 320 },
  { t: 'safety-ctrl> ', c: C.prompt, d: 200 },
];

export default function UartIntroSlide() {
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [visible, setVisible] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => { if (timer.current) clearTimeout(timer.current); };
  useEffect(() => clear, []);

  const run = useCallback(() => {
    if (phase === 'running') return;
    clear();
    setPhase('running');
    setVisible(0);
    let i = 0;
    const tick = () => {
      i += 1;
      setVisible(i);
      if (i < script.length) {
        timer.current = setTimeout(tick, script[i].d);
      } else {
        setPhase('done');
      }
    };
    timer.current = setTimeout(tick, 200);
  }, [phase]);

  const showCursor = phase === 'idle' || phase === 'done';

  return (
    <section data-background-color={slideBg}>
      <style>{`@keyframes uartBlink{0%,49%{opacity:1}50%,100%{opacity:0}}`}</style>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="STEP 1 · UART 개요"
          title="UART — 가장 단순한 직렬 통신"
          subtitle="단 2가닥(TX·RX)으로 · 별도 클럭선 없이 · 거의 모든 칩에 내장"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '0.8rem' }}>

          {/* ── 좌측: PuTTY 시리얼 터미널 목업 (클릭하여 BIT 실행) ── */}
          <div style={{ flex: '0 0 42%', display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
            <div style={{
              flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
              borderRadius: '8px', overflow: 'hidden', boxShadow: shadow.deep,
              border: '1px solid #0a0a0a',
            }}>
              {/* 타이틀 바 (Windows 창 + PuTTY) */}
              <div style={{
                background: 'linear-gradient(#3a3f4b, #2c313a)',
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '5px 9px', flexShrink: 0,
              }}>
                <span style={{
                  width: '13px', height: '13px', borderRadius: '3px', background: C.cyan,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.5rem', fontWeight: 800, color: '#0c2b30',
                }}>P</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: C.prompt, fontFamily: MONO }}>
                  COM3 - PuTTY
                </span>
                <span style={{ marginLeft: 'auto', display: 'flex', gap: '10px', color: '#9aa0ab', fontSize: '0.62rem', fontWeight: 700 }}>
                  <span>—</span><span>▢</span><span>✕</span>
                </span>
              </div>
              {/* 터미널 본문 (검정 콘솔) — 클릭 시 재생 */}
              <div
                onClick={run}
                style={{
                  position: 'relative', flex: 1, minHeight: 0, background: '#1b1f27',
                  padding: '0.6rem 0.75rem', fontFamily: MONO, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                  gap: '3px', overflow: 'hidden',
                }}
              >
                {/* 접속 배너 */}
                <div style={{ fontSize: '0.62rem', color: C.dim, lineHeight: 1.6, whiteSpace: 'pre' }}>
                  *** connected: COM3 · 115200 8N1 · no flow ctrl ***
                </div>

                {/* 재생 전 대기 프롬프트 */}
                {phase === 'idle' && (
                  <div style={{ fontSize: '0.64rem', color: C.prompt, lineHeight: 1.6, whiteSpace: 'pre' }}>
                    safety-ctrl&gt;{' '}
                    <span style={{ display: 'inline-block', width: '7px', height: '0.82rem', background: C.green, verticalAlign: 'text-bottom', animation: 'uartBlink 1s steps(1) infinite' }} />
                  </div>
                )}

                {/* 재생 라인 */}
                {script.slice(0, visible).map((l, i) => (
                  <div key={i} style={{ fontSize: '0.64rem', color: l.c, lineHeight: 1.6, whiteSpace: 'pre' }}>
                    {l.t}
                    {showCursor && i === visible - 1 && (
                      <span style={{ display: 'inline-block', width: '7px', height: '0.82rem', background: C.green, marginLeft: '1px', verticalAlign: 'text-bottom', animation: 'uartBlink 1s steps(1) infinite' }} />
                    )}
                  </div>
                ))}

                {/* 클릭 안내 / 재실행 배지 */}
                <div style={{
                  position: 'absolute', right: '9px', bottom: '8px',
                  fontSize: '0.55rem', fontWeight: 700, fontFamily: MONO,
                  color: C.cyan, background: 'rgba(86,182,194,0.12)',
                  border: `1px solid ${C.cyan}55`, borderRadius: '5px',
                  padding: '2px 8px', pointerEvents: 'none',
                  opacity: phase === 'running' ? 0 : 0.95, transition: 'opacity 0.3s',
                }}>
                  {phase === 'done' ? '↻ 다시 실행' : '▶ 클릭하여 BIT 실행'}
                </div>
              </div>
            </div>
            {/* 캡션 */}
            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderLeft: `3px solid ${DAY12}`, borderRadius: '8px',
              padding: '0.45rem 0.7rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.62rem', color: FPGA.textLight, lineHeight: 1.5 }}>
                PuTTY·Tera Term으로 COM 포트를 <b style={{ color: DAY12 }}>115200 8N1</b>로 열고
                BIT·센서 점검 → 보드가 살아있는지 처음 확인하는 화면. <b style={{ color: FPGA.dark }}>가장 먼저
                살리고 가장 오래 쓰는 디버그·로그 채널.</b>
              </span>
            </div>
          </div>

          {/* ── 우측: 카드 (균형 분배) ── */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>

            {/* 탄생 배경 & 정의 */}
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY12}25`,
              borderTop: `3px solid ${DAY12}`, borderRadius: '12px',
              padding: '0.6rem 0.9rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: DAY12, marginBottom: '0.3rem' }}>
                탄생 배경 &amp; 정의
              </div>
              <div style={{ fontSize: '0.67rem', color: FPGA.text, lineHeight: 1.55 }}>
                <b>U</b>niversal <b>A</b>synchronous <b>R</b>eceiver / <b>T</b>ransmitter — 1960년대
                텔레타이프·모뎀부터 쓰인 가장 오래된 직렬 통신. 병렬 전송은 선이 많고 길수록 skew에
                약함 → <b>적은 핀</b>으로 <b>한 비트씩 순서대로</b> 보내는 직렬 방식이 등장.
              </div>
              <div style={{ marginTop: '0.38rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['parallel → serial', 'clock-less', 'point-to-point'].map((t) => (
                  <code key={t} style={{
                    fontSize: '0.58rem', color: DAY12, background: `${DAY12}10`,
                    border: `1px solid ${DAY12}22`, padding: '2px 7px', borderRadius: '4px', fontFamily: MONO,
                  }}>{t}</code>
                ))}
              </div>
            </div>

            {/* 왜 쓰는가 — 효용 */}
            <div style={{
              background: `linear-gradient(135deg, ${DAY12}07, ${DAY12}13)`,
              border: `1px solid ${DAY12}28`, borderTop: `3px solid ${DAY12}`,
              borderRadius: '12px', padding: '0.6rem 0.9rem', boxShadow: shadow.card, flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: DAY12, marginBottom: '0.32rem' }}>
                왜 지금도 쓰는가 — 효용
              </div>
              {[
                ['선이 2가닥', 'TX·RX 한 쌍이면 양방향. 핀·배선 최소.'],
                ['클럭선 불필요', '양쪽이 baud rate만 약속 → 클럭 라우팅 부담 0.'],
                ['어디에나 내장', 'MCU·FPGA·SoC 거의 전부 → 추가 비용 0.'],
                ['브링업 1번 통로', '보드 점검 = 디버그 콘솔·상태 로그.'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '7px', marginBottom: '0.24rem', alignItems: 'baseline' }}>
                  <span style={{ color: DAY12, fontWeight: 800, fontSize: '0.64rem', flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.4 }}>
                    <b style={{ color: DAY12 }}>{k}</b> — {v}
                  </span>
                </div>
              ))}
            </div>

            {/* 장점 / 단점 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem', flexShrink: 0 }}>
              <div style={{
                background: FPGA.successBg, border: `1px solid ${FPGA.success}30`,
                borderLeft: `3px solid ${FPGA.success}`, borderRadius: '10px',
                padding: '0.55rem 0.75rem', boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2F855A', marginBottom: '0.28rem' }}>장점</div>
                {[
                  '배선·구현 단순, 부품 거의 없음',
                  '핸드셰이크 없이 직결 가능',
                  '오랜 표준 → 도구·드라이버 풍부',
                ].map((s) => (
                  <div key={s} style={{ display: 'flex', gap: '5px', marginBottom: '0.22rem', alignItems: 'baseline' }}>
                    <span style={{ color: FPGA.success, fontWeight: 800, fontSize: '0.62rem', flexShrink: 0 }}>+</span>
                    <span style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.4 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{
                background: FPGA.dangerBg, border: `1px solid ${FPGA.danger}30`,
                borderLeft: `3px solid ${FPGA.danger}`, borderRadius: '10px',
                padding: '0.55rem 0.75rem', boxShadow: shadow.card,
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C53030', marginBottom: '0.28rem' }}>단점 → 검증 필요</div>
                {[
                  'baud 불일치 시 통째로 깨짐',
                  '1:1 위주 · 다중/원거리 부적합',
                  '저속 · 무결성 보장 약함(parity뿐)',
                ].map((s) => (
                  <div key={s} style={{ display: 'flex', gap: '5px', marginBottom: '0.22rem', alignItems: 'baseline' }}>
                    <span style={{ color: FPGA.danger, fontWeight: 800, fontSize: '0.62rem', flexShrink: 0 }}>−</span>
                    <span style={{ fontSize: '0.63rem', color: FPGA.text, lineHeight: 1.4 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 한눈에 비교 — UART vs SPI vs I²C (남는 높이 흡수) */}
            <div style={{
              flex: 1, minHeight: 0,
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderTop: `3px solid ${FPGA.primary}`, borderRadius: '12px',
              padding: '0.55rem 0.9rem', boxShadow: shadow.card,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.3rem' }}>
                한눈에 비교 — 언제 UART, 언제 다른 버스
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'repeat(5, 1fr)', fontSize: '0.62rem' }}>
                {([
                  ['', 'UART', 'SPI', 'I²C', true],
                  ['선 수', '2', '4 +', '2', false],
                  ['클럭선', '없음 (async)', '있음', 'SCL', false],
                  ['연결', '1 : 1', '1 : 多', '1 : 多', false],
                  ['속도', '저 ~ 중', '고속', '중속', false],
                ] as [string, string, string, string, boolean][]).map(([label, u, s, i2c, head], ri) => (
                  <div key={ri} style={{
                    display: 'grid', gridTemplateColumns: '1.1fr 1.3fr 1fr 1fr',
                    alignItems: 'center', gap: '4px',
                    borderBottom: ri < 4 ? `1px solid ${FPGA.border}` : 'none',
                  }}>
                    <span style={{ fontWeight: head ? 800 : 700, color: head ? FPGA.dark : FPGA.textLight }}>{label}</span>
                    <span style={{
                      fontFamily: MONO, fontWeight: head ? 800 : 700,
                      color: DAY12,
                      background: head ? `${DAY12}14` : `${DAY12}0a`,
                      borderRadius: '4px', padding: '1px 6px', textAlign: 'center',
                    }}>{u}</span>
                    <span style={{ fontFamily: MONO, color: head ? FPGA.dark : FPGA.text, fontWeight: head ? 800 : 500, textAlign: 'center' }}>{s}</span>
                    <span style={{ fontFamily: MONO, color: head ? FPGA.dark : FPGA.text, fontWeight: head ? 800 : 500, textAlign: 'center' }}>{i2c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
