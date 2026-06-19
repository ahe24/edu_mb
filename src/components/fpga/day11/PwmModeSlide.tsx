'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import VerilogCode from '../VerilogCode';

const DAY11 = '#3D8361';

const code = `module pwm_rgb #(parameter CW = 8) (
  input  wire         clk,
  input  wire         rst,
  input  wire         btn_p,    // 1-clk 펄스 (디바운서+엣지검출, Day10)
  output wire         rgb       // RGB LED 한 채널 PWM
);
  localparam OFF=2'd0, DIM=2'd1, MID=2'd2, BRT=2'd3;
  reg [1:0]    mode;
  reg [CW-1:0] duty, cnt;

  always @(posedge clk)              // 모드 순환 FSM
    if (rst)        mode <= OFF;
    else if (btn_p) mode <= mode + 1'b1;   // OFF→DIM→MID→BRT→OFF

  always @* case (mode)              // 모드 → duty
    OFF: duty = 8'd0;
    DIM: duty = 8'd64;
    MID: duty = 8'd128;
    BRT: duty = 8'd255;
  endcase

  always @(posedge clk)              // PWM 카운터
    if (rst) cnt <= 0; else cnt <= cnt + 1'b1;

  assign rgb = (cnt < duty);         // duty 비율만큼 ON
endmodule`;

export default function PwmModeSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="실습 2 · 오전 ② · RGB PWM"
          title="버튼으로 밝기 순환 — mode FSM + PWM"
          subtitle="4단계 밝기를 FSM으로 순환 · PWM duty로 RGB LED 밝기를 아날로그처럼 제어"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
          {/* 좌: 코드 */}
          <div style={{
            background: '#1A2235', borderRadius: '10px',
            padding: '0.55rem 0.85rem', boxShadow: shadow.card,
            borderLeft: `3px solid ${DAY11}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '0.6rem', color: DAY11, fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
              pwm_rgb.v
            </div>
            <VerilogCode code={code} style={{ fontSize: '0.6rem', lineHeight: 1.4 }} />
          </div>

          {/* 우: 모드 순환 + PWM 파형 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{
              background: FPGA.white, border: `1px solid ${DAY11}25`,
              borderTop: `3px solid ${DAY11}`, borderRadius: '10px',
              padding: '0.55rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.4rem' }}>밝기 모드 순환 (버튼 1펄스)</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {[
                  { m: 'OFF', d: '0', op: 0.12 },
                  { m: 'DIM', d: '64', op: 0.32 },
                  { m: 'MID', d: '128', op: 0.6 },
                  { m: 'BRT', d: '255', op: 1 },
                ].map((x, i, arr) => (
                  <div key={x.m} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: `rgba(61,131,97,${x.op})`, border: `1.5px solid ${DAY11}`, margin: '0 auto 2px' }} />
                      <div style={{ fontSize: '0.6rem', fontWeight: 800, color: DAY11, fontFamily: '"JetBrains Mono", monospace' }}>{x.m}</div>
                      <div style={{ fontSize: '0.54rem', color: FPGA.textLight, fontFamily: '"JetBrains Mono", monospace' }}>{x.d}</div>
                    </div>
                    {i < arr.length - 1 && <span style={{ color: FPGA.textLight, fontSize: '0.8rem' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: FPGA.white, border: `1px solid ${FPGA.border}`,
              borderRadius: '10px', padding: '0.55rem 0.75rem', boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>PWM duty 파형</div>
              <svg width="100%" height="56" viewBox="0 0 320 56">
                <path d="M0 44 H30 V14 H44 V44 H110 V14 H124 V44 H190 V14 H204 V44 H300" stroke={DAY11} strokeWidth="2" fill="none" />
                <text x="6" y="11" fontSize="7.5" fill={FPGA.textLight} fontFamily='"JetBrains Mono", monospace'>cnt &lt; duty → ON</text>
              </svg>
              <div style={{ fontSize: '0.6rem', color: FPGA.textLight, fontStyle: 'italic' }}>
                duty/2^CW = 평균 밝기. 카운터 주기가 빨라 눈에는 연속으로 보임.
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, rgba(8,145,178,0.06), rgba(8,145,178,0.12))`,
              border: '1px solid rgba(8,145,178,0.28)', borderLeft: '4px solid #0891B2',
              borderRadius: '8px', padding: '0.45rem 0.8rem',
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0891B2' }}>연결 · </span>
              <span style={{ fontSize: '0.64rem', color: FPGA.text, lineHeight: 1.45 }}>
                <code>btn_p</code>는 Day 10 디바운서 출력의 <strong>상승엣지 1펄스</strong>. 레벨로 받으면 누르는 동안 폭주.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
