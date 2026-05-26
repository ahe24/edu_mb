'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import SlideModal from '../SlideModal';

const DAY07 = '#0891B2';

type Sync = {
  name: string;
  scheme: string;
  use: string;
  pros: string;
  cons: string;
  severity: string;
  col: string;
};

const syncs: Sync[] = [
  {
    name: '2-DFF',
    scheme: 'two_dff / bus_two_dff',
    use: '단일 bit 제어 · (multi-bit는 gray-code 시)',
    pros: '구조 단순 · 면적/지연 최소',
    cons: 'bus는 gray-code 아니면 multi_bits 위반',
    severity: 'Evaluation',
    col: '#48BB78',
  },
  {
    name: '4-Latch',
    scheme: 'four_latch',
    use: '단일 bit · 더 강한 메타 억제',
    pros: 'MTBF 매우 개선',
    cons: '면적 2배 · 지연 2 cycle',
    severity: 'Evaluation',
    col: '#48BB78',
  },
  {
    name: 'Pulse Sync',
    scheme: 'pulse_sync',
    use: '짧은 펄스(1-cycle) 전달',
    pros: '느린 RX clock에서도 펄스 보존',
    cons: '연속 펄스 손실 위험',
    severity: 'Evaluation',
    col: '#48BB78',
  },
  {
    name: 'DMUX',
    scheme: 'dmux',
    use: 'multi-bit · 동기 한 신호로 enable',
    pros: 'bus 전체 동시 capture',
    cons: 'TX 안정성 protocol 필요',
    severity: 'Caution',
    col: '#E8913A',
  },
  {
    name: 'Handshake',
    scheme: 'handshake',
    use: 'multi-bit · req/ack 프로토콜',
    pros: '데이터 일관성 보장 · 가변 지연',
    cons: 'throughput 낮음',
    severity: 'Evaluation',
    col: '#48BB78',
  },
  {
    name: 'Async FIFO',
    scheme: 'fifo',
    use: '연속 데이터 스트림 (고대역)',
    pros: 'gray-code 포인터 · 자동 흐름제어',
    cons: '메모리 자원 · 설계 복잡도',
    severity: 'Evaluation',
    col: '#48BB78',
  },
];

// ── 각 scheme의 구현 코드 / 블록도 ──
type Impl = {
  title: string;
  subtitle: string;
  bullets: string[];
  code?: string;
  diagram?: ReactNode;
};

const impls: Record<string, Impl> = {
  '2-DFF': {
    title: '2-DFF Synchronizer',
    subtitle: '가장 기본적인 동기화 회로 — flip-flop 2단 cascade (rx_clk 도메인)',
    bullets: [
      '1st FF(meta_r)에 setup/hold 위반 가능 — TX 입력이 rx_clk edge 부근에 변하면 출력이 0/1 사이 불확정 (metastable)',
      '해소시간 τ 안에 0 또는 1 로 수렴 — 다음 edge 전까지 1st FF 출력은 외부 노출 금지 (2nd FF 전용)',
      '2nd FF(dout)는 안정된 meta_r 만 sample → 다운스트림에 항상 깨끗한 logic value',
      'TX 입력은 rx_clk 1주기 이상 안정 hold 필수 — 짧은 펄스는 손실 가능 (Pulse Sync로 우회)',
      '파라미터 W 로 multi-bit 확장 가능 — 단, gray-code 아니면 multi_bits violation',
      'Latency 2 rx_clk cycle · 면적 최소 · MTBF ∝ e^(τ × f_rx) — 일반 응용 충분, 고주파/safety-critical 시스템엔 4-Latch 고려',
      'CDC scheme: two_dff (1-bit) / bus_two_dff (multi-bit gray) — Evaluation',
    ],
    diagram: (
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>
          Timing diagram — din 비동기 변화 → 1st FF metastable → 2nd FF 안정 capture
        </div>
        <svg viewBox="0 0 560 230" style={{ width: '100%' }}>
          {/* Vertical guide lines at key rx_clk edges */}
          <line x1="235" y1="18" x2="235" y2="220" stroke="#E53E3E" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.55" />
          <text x="235" y="13" fontSize="7.5" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">edge n (setup 위반)</text>
          <line x1="315" y1="18" x2="315" y2="220" stroke="#48BB78" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.55" />
          <text x="315" y="13" fontSize="7.5" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily="monospace">edge n+1 (안정 capture)</text>

          {/* tx_clk — fast (period 50), orange */}
          <text x="4" y="38" fontSize="10" fontWeight="800" fill="#DD6B20" fontFamily="monospace">tx_clk</text>
          <path d="M 60,44 L 70,44 L 70,28 L 95,28 L 95,44 L 120,44 L 120,28 L 145,28 L 145,44 L 170,44 L 170,28 L 195,28 L 195,44 L 220,44 L 220,28 L 245,28 L 245,44 L 270,44 L 270,28 L 295,28 L 295,44 L 320,44 L 320,28 L 345,28 L 345,44 L 370,44 L 370,28 L 395,28 L 395,44 L 420,44 L 420,28 L 445,28 L 445,44 L 470,44 L 470,28 L 495,28 L 495,44 L 520,44 L 520,28 L 545,28 L 545,44 L 555,44"
                stroke="#DD6B20" strokeWidth="1.4" fill="none" />

          {/* din — TX domain async signal, rises at x=220 (just 15px before rx_clk edge at 235) */}
          <text x="4" y="74" fontSize="10" fontWeight="800" fill="#DD6B20" fontFamily="monospace">din</text>
          <path d="M 60,81 L 220,81 L 220,64 L 555,64" stroke="#DD6B20" strokeWidth="1.6" fill="none" />
          <text x="170" y="76" fontSize="7" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">tx 도메인에서 비동기로 0→1</text>
          {/* arrow from din transition to rx edge */}
          <line x1="222" y1="56" x2="233" y2="56" stroke="#E53E3E" strokeWidth="0.9" />
          <path d="M 231,54 L 233,56 L 231,58" stroke="#E53E3E" strokeWidth="0.9" fill="none" />

          {/* rx_clk — slower (period 80), cyan, edges at 75, 155, 235, 315, 395, 475 */}
          <text x="4" y="112" fontSize="10" fontWeight="800" fill={DAY07} fontFamily="monospace">rx_clk</text>
          <path d="M 60,118 L 75,118 L 75,102 L 115,102 L 115,118 L 155,118 L 155,102 L 195,102 L 195,118 L 235,118 L 235,102 L 275,102 L 275,118 L 315,118 L 315,102 L 355,102 L 355,118 L 395,118 L 395,102 L 435,102 L 435,118 L 475,118 L 475,102 L 515,102 L 515,118 L 555,118"
                stroke={DAY07} strokeWidth="1.4" fill="none" />

          {/* meta_r — 1st FF output: low → metastable region → high */}
          <text x="4" y="146" fontSize="10" fontWeight="800" fill={DAY07} fontFamily="monospace">meta_r</text>
          <text x="4" y="156" fontSize="7" fontWeight="800" fill={DAY07} fontFamily="monospace" opacity="0.75">(1st FF)</text>
          {/* low portion before metastable */}
          <line x1="60" y1="153" x2="235" y2="153" stroke={DAY07} strokeWidth="1.6" />
          {/* metastable band: edge n (235) → resolved by x=275 */}
          <rect x="235" y="137" width="40" height="16" fill="rgba(229,62,62,0.22)" stroke="#E53E3E" strokeWidth="0.9" strokeDasharray="2 2" />
          {/* oscillation hint inside metastable region */}
          <path d="M 240,145 Q 245,138 250,145 T 260,145 T 270,145" stroke="#E53E3E" strokeWidth="0.9" fill="none" opacity="0.85" />
          <text x="255" y="133" fontSize="7.5" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">meta ?</text>
          {/* high portion after resolution */}
          <line x1="275" y1="137" x2="555" y2="137" stroke={DAY07} strokeWidth="1.6" />
          {/* τ arrow */}
          <line x1="237" y1="166" x2="273" y2="166" stroke="#E53E3E" strokeWidth="0.9" />
          <path d="M 239,164 L 237,166 L 239,168" stroke="#E53E3E" strokeWidth="0.9" fill="none" />
          <path d="M 271,164 L 273,166 L 271,168" stroke="#E53E3E" strokeWidth="0.9" fill="none" />
          <text x="255" y="174" fontSize="7" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">τ (resolve)</text>

          {/* dout — 2nd FF output: stays low until edge n+1, then clean rise */}
          <text x="4" y="190" fontSize="10" fontWeight="800" fill={DAY07} fontFamily="monospace">dout</text>
          <text x="4" y="200" fontSize="7" fontWeight="800" fill={DAY07} fontFamily="monospace" opacity="0.75">(2nd FF)</text>
          <path d="M 60,197 L 315,197 L 315,181 L 555,181" stroke={DAY07} strokeWidth="1.6" fill="none" />
          <circle cx="315" cy="181" r="3.5" fill="#48BB78" />
          <text x="335" y="178" fontSize="8" fontWeight="800" fill="#48BB78" fontFamily="monospace">★ 항상 안정 값</text>

          {/* Latency arrow */}
          <line x1="237" y1="217" x2="313" y2="217" stroke="#48BB78" strokeWidth="0.9" />
          <path d="M 239,215 L 237,217 L 239,219" stroke="#48BB78" strokeWidth="0.9" fill="none" />
          <path d="M 311,215 L 313,217 L 311,219" stroke="#48BB78" strokeWidth="0.9" fill="none" />
          <text x="275" y="226" fontSize="7.5" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily="monospace">latency = 2 rx_clk cycle</text>
        </svg>
        <div style={{ fontSize: '0.7rem', color: FPGA.textLight, marginTop: '0.3rem', lineHeight: 1.5 }}>
          <strong style={{ color: '#E53E3E' }}>edge n</strong>: din이 rx_clk rising edge 직전에 변경 → setup 위반 → meta_r가 metastable 진입.
          <br />
          <strong style={{ color: '#48BB78' }}>edge n+1</strong>: τ 동안 meta_r는 0 또는 1로 수렴 (그림은 1로 수렴한 경우) → 2nd FF이 안정된 값을 sample → dout는 항상 valid logic.
        </div>
      </div>
    ),
    code: `module sync_2dff #(parameter integer W = 1) (
    input              clk,          // rx_clk (수신 도메인)
    input              rst,
    input      [W-1:0] din,          // 비동기 source — tx_clk 도메인 신호
    output reg [W-1:0] dout          // 동기화된 출력 (rx_clk 도메인, 안정)
);
    reg [W-1:0] meta_r;              // 1st FF — metastable 가능 (외부 노출 금지)

    always @(posedge clk) begin
        if (rst) begin
            meta_r <= {W{1'b0}};
            dout   <= {W{1'b0}};
        end else begin
            meta_r <= din;           // 1st FF — TX→RX sample (setup 위반 시 meta)
            dout   <= meta_r;        // 2nd FF — τ 해소 후 안정값만 통과
        end
    end
endmodule

// === 사용 예 === (단일 bit control 신호 동기화)
// wire trip_active_bus;
// sync_2dff #(.W(1)) u_sync (
//     .clk (bus_clk),  .rst (rst),
//     .din (trip_active_proc),     // proc_clk 도메인 신호
//     .dout(trip_active_bus));     // bus_clk 도메인에서 사용

// === Timing diagram 시나리오 매핑 ===
// din      : tx_clk으로 만들어진 신호 — rx_clk과 위상 무관
// meta_r   : edge n에서 sample, setup 위반 시 τ 동안 metastable
// dout     : edge n+1에서 안정된 meta_r를 sample — 항상 valid
// → 다운스트림은 반드시 dout만 사용, meta_r는 fan-out 1 (=dout)`,
  },

  '4-Latch': {
    title: '4-Latch Synchronizer',
    subtitle: '4단 cascade — 2-DFF MTBF 부족한 고주파/safety-critical용',
    bullets: [
      '용어 유래: ASIC의 alternating positive/negative latch chain — FPGA에서는 4-stage DFF로 등가 구현',
      '각 단계마다 metastable 해소 확률 e^(-T_clk/τ) 만큼 추가 감쇠 → 누적 효과 큼',
      '고주파(>500MHz) 또는 safety-critical 시스템에서 2-DFF의 MTBF가 부족할 때 채택',
      '대가: latency 4 cycle · 면적 2배 (vs 2-DFF)',
      'CDC scheme: four_latch (Evaluation)',
    ],
    code: `// 4-stage DFF cascade — Questa CDC "four_latch" scheme
// ASIC의 latch chain과 등가, FPGA에서는 DFF 4개로 구현
module sync_4latch (
    input      clk,
    input      rst,
    input      din,         // 비동기 source domain
    output reg dout         // 동기화 (4 cycle latency)
);
    reg s1, s2, s3;         // 중간 단계 — 각 단계마다 meta 해소 확률 증가

    always @(posedge clk) begin
        if (rst) {dout, s3, s2, s1} <= 4'b0;
        else     {dout, s3, s2, s1} <= {s3, s2, s1, din};
        //          \\___ stage 4 ___/      \\__ stage 1 sample
    end
endmodule

// === MTBF 비교 (typical) ===
// 2-DFF  : MTBF ~ years (대부분 응용)
// 4-Latch: MTBF ~ centuries (safety-critical / 고주파)`,
  },

  'Pulse Sync': {
    title: 'Pulse Synchronizer',
    subtitle: '짧은 펄스를 다른 도메인으로 안전하게 전달 — toggle 변환 기법',
    bullets: [
      '문제: 1-cycle TX 펄스는 RX clock이 느릴 경우 sampling miss로 손실',
      '해법: TX 측에서 매 펄스마다 toggle level 변환 → RX는 edge detect로 펄스 복원',
      'TX toggle은 level 신호라 RX 2-DFF로 안전 sync (펄스 폭에 무관)',
      '제약: 연속 펄스 간 spacing ≥ 2 × max(src_clk, dst_clk) period 보장 필수',
      '제약 위반 시 toggle edge가 누락되어 펄스 손실 가능',
      'CDC scheme: pulse_sync (Evaluation)',
    ],
    diagram: (
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>Timing diagram — toggle 변환 + edge detect</div>
        <svg viewBox="0 0 560 220" style={{ width: '100%' }}>
          {/* src_clk (TX) — period 60, rising edges at 80,140,200,260,320,380,440,500 */}
          <text x="4" y="32" fontSize="10" fontWeight="800" fill="#DD6B20" fontFamily="monospace">src_clk</text>
          <path d="M 60,38 L 80,38 L 80,22 L 110,22 L 110,38 L 140,38 L 140,22 L 170,22 L 170,38 L 200,38 L 200,22 L 230,22 L 230,38 L 260,38 L 260,22 L 290,22 L 290,38 L 320,38 L 320,22 L 350,22 L 350,38 L 380,38 L 380,22 L 410,22 L 410,38 L 440,38 L 440,22 L 470,22 L 470,38 L 500,38 L 500,22 L 530,22 L 530,38 L 555,38"
                stroke="#DD6B20" strokeWidth="1.4" fill="none" />

          {/* src_pulse — 1-cycle pulse, transitions at src_clk rising edges */}
          <text x="4" y="68" fontSize="10" fontWeight="800" fill="#DD6B20" fontFamily="monospace">src_pulse</text>
          <path d="M 60,75 L 80,75 L 80,60 L 140,60 L 140,75 L 260,75 L 260,60 L 320,60 L 320,75 L 555,75"
                stroke="#DD6B20" strokeWidth="1.5" fill="none" />
          <text x="110" y="55" fontSize="7" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">P1</text>
          <text x="290" y="55" fontSize="7" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">P2</text>

          {/* src_tog — toggle at next rising edge after pulse sampled */}
          <text x="4" y="105" fontSize="10" fontWeight="800" fill="#DD6B20" fontFamily="monospace">src_tog</text>
          <path d="M 60,112 L 140,112 L 140,97 L 320,97 L 320,112 L 555,112"
                stroke="#DD6B20" strokeWidth="1.5" fill="none" />
          <text x="230" y="92" fontSize="7" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">toggle on each pulse (level signal)</text>

          {/* dst_clk (RX, 느린 clock) — period 90, rising edges at 90,180,270,360,450,540 */}
          <text x="4" y="145" fontSize="10" fontWeight="800" fill={DAY07} fontFamily="monospace">dst_clk</text>
          <path d="M 60,151 L 90,151 L 90,135 L 135,135 L 135,151 L 180,151 L 180,135 L 225,135 L 225,151 L 270,151 L 270,135 L 315,135 L 315,151 L 360,151 L 360,135 L 405,135 L 405,151 L 450,151 L 450,135 L 495,135 L 495,151 L 540,151 L 540,135 L 555,135"
                stroke={DAY07} strokeWidth="1.4" fill="none" />
          <text x="310" y="130" fontSize="7" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily="monospace">RX는 더 느린 clock — pulse 직접 sample 불가</text>

          {/* dst_pulse — recovered pulse, transitions at dst_clk rising edges */}
          {/* src_tog@140 → sync[0]@180 → sync[1]@270 → sync[2]@360 → pulse=[270,360) */}
          {/* src_tog@320 → sync[0]@360 → sync[1]@450 → sync[2]@540 → pulse=[450,540) */}
          <text x="4" y="185" fontSize="10" fontWeight="800" fill={DAY07} fontFamily="monospace">dst_pulse</text>
          <path d="M 60,191 L 270,191 L 270,176 L 360,176 L 360,191 L 450,191 L 450,176 L 540,176 L 540,191 L 555,191"
                stroke={DAY07} strokeWidth="1.5" fill="none" />
          <circle cx="270" cy="176" r="3" fill="#48BB78" />
          <circle cx="450" cy="176" r="3" fill="#48BB78" />
          <text x="315" y="172" fontSize="7" fontWeight="800" fill="#48BB78" fontFamily="monospace">★ P1 복원</text>
          <text x="495" y="172" fontSize="7" fontWeight="800" fill="#48BB78" fontFamily="monospace">★ P2 복원</text>

          {/* Spacing annotation */}
          <line x1="140" y1="207" x2="260" y2="207" stroke="#E8913A" strokeWidth="0.9" />
          <path d="M 142,205 L 140,207 L 142,209" stroke="#E8913A" strokeWidth="0.9" fill="none" />
          <path d="M 258,205 L 260,207 L 258,209" stroke="#E8913A" strokeWidth="0.9" fill="none" />
          <text x="200" y="215" fontSize="7.5" fontWeight="800" fill="#E8913A" textAnchor="middle" fontFamily="monospace">spacing ≥ 2 × max(src, dst) period</text>
        </svg>
      </div>
    ),
    code: `module sync_pulse (
    input  src_clk, src_rst,
    input  src_pulse,           // 1-cycle pulse @ src_clk
    input  dst_clk, dst_rst,
    output dst_pulse            // 1-cycle pulse @ dst_clk
);
    // === (1) TX: pulse → toggle level 변환 ===
    // 매 펄스마다 toggle → src_tog는 안정된 level 신호 (펄스폭 무관)
    reg src_tog;
    always @(posedge src_clk) begin
        if (src_rst)        src_tog <= 1'b0;
        else if (src_pulse) src_tog <= ~src_tog;
    end

    // === (2) RX: 2-DFF sync + edge detect ===
    // src_tog는 level이라 2-DFF로 안전 sync 가능
    reg [2:0] sync;
    always @(posedge dst_clk) begin
        if (dst_rst) sync <= 3'b0;
        else         sync <= {sync[1:0], src_tog};
        //                   stage3, 2, 1
    end

    // edge detect: 2-DFF 이후 단계 (sync[2]) 와 그 이전(sync[1]) XOR
    assign dst_pulse = sync[2] ^ sync[1];   // 1 cycle pulse on each edge
endmodule

// === 주의: 연속 펄스 spacing ===
// 두 src_pulse 사이 ≥ 2 × max(T_src, T_dst) 보장 필수
// 너무 가까우면 toggle edge가 RX clock cycle 안에서 사라져 펄스 손실`,
  },

  'DMUX': {
    title: 'DMUX Synchronizer',
    subtitle: 'Multi-bit data + 1-bit select 동기화 — TX hold protocol 핵심',
    bullets: [
      '핵심: sel_tx가 2-DFF로 sync되는 2 RX clock 동안 data_tx 변경 금지',
      'TX는 (data 설정 → sel assert) 후 sync latency + 1 cycle 만큼 data hold',
      'sel_sync rising edge에서 RX가 data_tx capture — 그 시점 data가 안정 보장',
      'Protocol 위반 시 잘못된 중간값 capture (multi_bits violation과 동일)',
      'CDC scheme: dmux (Caution — protocol 검증 필요)',
    ],
    diagram: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {/* === 블록도 (공간 구조) === */}
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>① 회로 블록도</div>
          <svg viewBox="0 0 540 220" style={{ width: '100%' }}>
            {/* TX domain box */}
            <rect x="10" y="40" width="180" height="140" rx="8" stroke="#DD6B20" strokeWidth="1.8" fill="rgba(221,107,32,0.06)" strokeDasharray="4 3" />
            <text x="100" y="32" fontSize="11" fontWeight="800" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">TX domain (tx_clk)</text>

            <rect x="30" y="70" width="80" height="34" rx="4" stroke="#DD6B20" strokeWidth="1.5" fill="rgba(221,107,32,0.12)" />
            <text x="70" y="92" fontSize="11" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">data_tx[N]</text>

            <rect x="30" y="130" width="80" height="34" rx="4" stroke="#DD6B20" strokeWidth="1.5" fill="rgba(221,107,32,0.12)" />
            <text x="70" y="152" fontSize="11" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">sel_tx</text>

            <path d="M 110,87 L 220,87 L 220,110" stroke="#DD6B20" strokeWidth="1.5" fill="none" />
            <path d="M 110,147 L 220,147" stroke="#DD6B20" strokeWidth="1.5" fill="none" />

            <rect x="220" y="130" width="80" height="34" rx="4" stroke={DAY07} strokeWidth="1.8" fill="rgba(8,145,178,0.10)" />
            <text x="260" y="146" fontSize="10" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily="monospace">2-DFF</text>
            <text x="260" y="158" fontSize="8" fontWeight="600" fill={DAY07} textAnchor="middle" fontFamily="monospace">sync</text>

            <rect x="320" y="40" width="210" height="140" rx="8" stroke={DAY07} strokeWidth="1.8" fill="rgba(8,145,178,0.06)" strokeDasharray="4 3" />
            <text x="425" y="32" fontSize="11" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily="monospace">RX domain (rx_clk)</text>

            <path d="M 340,70 L 400,70 L 420,90 L 420,130 L 400,150 L 340,150 Z" stroke={DAY07} strokeWidth="1.5" fill="rgba(8,145,178,0.10)" />
            <text x="375" y="105" fontSize="11" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily="monospace">MUX</text>
            <text x="375" y="120" fontSize="8" fontWeight="500" fill={DAY07} textAnchor="middle" fontFamily="monospace">+ reg</text>

            <path d="M 220,110 L 340,110" stroke="#DD6B20" strokeWidth="1.5" fill="none" />
            <path d="M 300,147 L 320,147 L 340,140" stroke={DAY07} strokeWidth="1.5" fill="none" />
            <text x="305" y="138" fontSize="8" fontWeight="700" fill={DAY07} fontFamily="monospace">sel_sync</text>

            <path d="M 420,110 L 510,110" stroke={DAY07} strokeWidth="1.5" fill="none" />
            <text x="465" y="103" fontSize="10" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily="monospace">data_rx[N]</text>

            <text x="155" y="200" fontSize="8.5" fontWeight="600" fill={FPGA.textLight} textAnchor="middle" fontStyle="italic">TX가 sel 동안 data hold (protocol)</text>
            <text x="425" y="200" fontSize="8.5" fontWeight="600" fill={FPGA.textLight} textAnchor="middle" fontStyle="italic">sel_sync rising edge에 안정 data capture</text>
          </svg>
        </div>

        {/* === Timing diagram (시간 구조) — TX hold protocol 시각화 === */}
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>② Timing diagram — TX hold protocol</div>
          <svg viewBox="0 0 560 220" style={{ width: '100%' }}>
            {/* Time guide verticals */}
            <line x1="120" y1="14" x2="120" y2="210" stroke="#48BB78" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.5" />
            <text x="120" y="10" fontSize="7" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily="monospace">T1</text>
            <line x1="240" y1="14" x2="240" y2="210" stroke="#E53E3E" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.65" />
            <text x="240" y="10" fontSize="7" fontWeight="800" fill="#E53E3E" textAnchor="middle" fontFamily="monospace">T3 capture</text>
            <line x1="420" y1="14" x2="420" y2="210" stroke="#48BB78" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.5" />
            <text x="420" y="10" fontSize="7" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily="monospace">T5 hold 끝</text>

            {/* data_tx — bus notation (two parallel lines + X transitions) */}
            <text x="4" y="36" fontSize="10" fontWeight="800" fill="#DD6B20" fontFamily="monospace">data_tx</text>
            <line x1="60" y1="28" x2="116" y2="28" stroke="#DD6B20" strokeWidth="1.5" />
            <line x1="60" y1="42" x2="116" y2="42" stroke="#DD6B20" strokeWidth="1.5" />
            <line x1="116" y1="28" x2="124" y2="42" stroke="#DD6B20" strokeWidth="1.5" />
            <line x1="116" y1="42" x2="124" y2="28" stroke="#DD6B20" strokeWidth="1.5" />
            <line x1="124" y1="28" x2="416" y2="28" stroke="#DD6B20" strokeWidth="1.5" />
            <line x1="124" y1="42" x2="416" y2="42" stroke="#DD6B20" strokeWidth="1.5" />
            <line x1="416" y1="28" x2="424" y2="42" stroke="#DD6B20" strokeWidth="1.5" />
            <line x1="416" y1="42" x2="424" y2="28" stroke="#DD6B20" strokeWidth="1.5" />
            <line x1="424" y1="28" x2="555" y2="28" stroke="#DD6B20" strokeWidth="1.5" />
            <line x1="424" y1="42" x2="555" y2="42" stroke="#DD6B20" strokeWidth="1.5" />
            <text x="88" y="38" fontSize="8" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">OLD</text>
            <text x="270" y="38" fontSize="9" fontWeight="800" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">NEW (안정 hold)</text>
            <text x="490" y="38" fontSize="8" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">NEXT</text>

            {/* TX hold band */}
            <rect x="120" y="48" width="300" height="10" fill="rgba(72,187,120,0.18)" stroke="#48BB78" strokeWidth="0.7" strokeDasharray="2 2" />
            <text x="270" y="56" fontSize="7" fontWeight="800" fill="#48BB78" textAnchor="middle" fontFamily="monospace">TX hold ≥ sync latency + 1 cycle</text>

            {/* sel_tx */}
            <text x="4" y="83" fontSize="10" fontWeight="800" fill="#DD6B20" fontFamily="monospace">sel_tx</text>
            <path d="M 60,90 L 120,90 L 120,75 L 420,75 L 420,90 L 555,90" stroke="#DD6B20" strokeWidth="1.6" fill="none" />

            {/* sel_sync */}
            <text x="4" y="133" fontSize="10" fontWeight="800" fill={DAY07} fontFamily="monospace">sel_sync</text>
            <path d="M 60,140 L 240,140 L 240,125 L 480,125 L 480,140 L 555,140" stroke={DAY07} strokeWidth="1.6" fill="none" />
            {/* sync latency 표시 화살표 */}
            <line x1="130" y1="115" x2="230" y2="115" stroke={DAY07} strokeWidth="0.9" />
            <path d="M 132,113 L 130,115 L 132,117" stroke={DAY07} strokeWidth="0.9" fill="none" />
            <path d="M 228,113 L 230,115 L 228,117" stroke={DAY07} strokeWidth="0.9" fill="none" />
            <text x="180" y="111" fontSize="7" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily="monospace">2 rx_clk latency</text>

            {/* Capture star at T3 */}
            <circle cx="240" cy="125" r="4" fill="#E53E3E" />
            <text x="250" y="121" fontSize="8" fontWeight="800" fill="#E53E3E" fontFamily="monospace">★ data_rx ← data_tx</text>

            {/* data_rx */}
            <text x="4" y="183" fontSize="10" fontWeight="800" fill={DAY07} fontFamily="monospace">data_rx</text>
            <line x1="60" y1="175" x2="236" y2="175" stroke={DAY07} strokeWidth="1.5" />
            <line x1="60" y1="189" x2="236" y2="189" stroke={DAY07} strokeWidth="1.5" />
            <line x1="236" y1="175" x2="244" y2="189" stroke={DAY07} strokeWidth="1.5" />
            <line x1="236" y1="189" x2="244" y2="175" stroke={DAY07} strokeWidth="1.5" />
            <line x1="244" y1="175" x2="555" y2="175" stroke={DAY07} strokeWidth="1.5" />
            <line x1="244" y1="189" x2="555" y2="189" stroke={DAY07} strokeWidth="1.5" />
            <text x="148" y="185" fontSize="8" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily="monospace">OLD</text>
            <text x="400" y="185" fontSize="9" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily="monospace">NEW (T3 capture)</text>

            <text x="280" y="208" fontSize="8" fontStyle="italic" fontWeight="700" fill={FPGA.text} textAnchor="middle">★ T3 시점 data_tx가 안정 hold 중이라 안전 — hold 위반 시 잘못된 값 capture</text>
          </svg>
        </div>
      </div>
    ),
    code: `// ============== TX 측 (tx_clk) — data 설정 + sel + hold ==============
reg [N-1:0] data_tx;
reg         sel_tx;
reg [2:0]   hold_cnt;       // sync latency + capture margin

always @(posedge tx_clk) begin
    if (rst) begin
        sel_tx   <= 1'b0;
        hold_cnt <= 3'd0;
    end else if (start && !sel_tx) begin
        data_tx  <= new_data;   // (1) 새 data 설정
        sel_tx   <= 1'b1;       // (2) sel assert
        hold_cnt <= 3'd4;       // 2 sync + 1 capture + 1 margin
    end else if (sel_tx) begin
        if (hold_cnt > 0)
            hold_cnt <= hold_cnt - 1;   // (3) data hold 유지
        else
            sel_tx   <= 1'b0;           // (4) hold 끝 → sel deassert
    end
end

// ============== RX 측 (rx_clk) — sel 2-DFF + edge capture ==============
reg sel_meta, sel_sync, sel_sync_d;
always @(posedge rx_clk) begin
    sel_meta   <= sel_tx;          // 1단 — metastable 가능
    sel_sync   <= sel_meta;        // 2단 — 안정화 (2 rx_clk latency)
    sel_sync_d <= sel_sync;        // edge detect 용
end

reg [N-1:0] data_rx;
always @(posedge rx_clk)
    if (sel_sync && !sel_sync_d)   // sel_sync rising edge
        data_rx <= data_tx;         // ★ TX hold 중 → 안정 data capture`,
  },

  'Handshake': {
    title: 'Handshake (4-phase req/ack)',
    subtitle: '데이터 일관성을 strict하게 보장 — req/ack 양방향 sync로 완전 protocol',
    bullets: [
      'TX는 data 설정 후 req=1 → req가 RX 도메인에 도착 후 capture됨을 ack로 확인',
      'RX는 req_sync 감지 → data capture → ack=1 → ack가 TX 도메인에 sync되어 도착',
      'req(tx→rx) / ack(rx→tx) 각각 2-DFF로 sync — 양방향',
      'data는 (req assert) ~ (ack_sync 도착)까지 안정 — TX가 자연스럽게 hold',
      '한 transfer 당 4-step (req↑ → ack↑ → req↓ → ack↓) — throughput 낮음',
      'DMUX보다 안전 (자동 hold) · 비주기 update에 적합',
      'CDC scheme: handshake (Evaluation)',
    ],
    diagram: (
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>Timing diagram — 4-phase 사이클</div>
        <svg viewBox="0 0 560 220" style={{ width: '100%' }}>
          {/* Phase markers */}
          {[
            { x: 100, label: '①', color: '#DD6B20', text: 'data + req↑' },
            { x: 220, label: '②', color: DAY07, text: 'ack↑' },
            { x: 360, label: '③', color: '#DD6B20', text: 'req↓' },
            { x: 470, label: '④', color: DAY07, text: 'ack↓' },
          ].map((p) => (
            <g key={p.label}>
              <line x1={p.x} y1="14" x2={p.x} y2="210" stroke={p.color} strokeWidth="0.7" strokeDasharray="2 2" opacity="0.45" />
              <text x={p.x} y="9" fontSize="7" fontWeight="800" fill={p.color} textAnchor="middle" fontFamily="monospace">{p.label} {p.text}</text>
            </g>
          ))}

          {/* data_tx — bus */}
          <text x="4" y="36" fontSize="10" fontWeight="800" fill="#DD6B20" fontFamily="monospace">data_tx</text>
          <line x1="60" y1="28" x2="96" y2="28" stroke="#DD6B20" strokeWidth="1.5" />
          <line x1="60" y1="42" x2="96" y2="42" stroke="#DD6B20" strokeWidth="1.5" />
          <line x1="96" y1="28" x2="104" y2="42" stroke="#DD6B20" strokeWidth="1.5" />
          <line x1="96" y1="42" x2="104" y2="28" stroke="#DD6B20" strokeWidth="1.5" />
          <line x1="104" y1="28" x2="555" y2="28" stroke="#DD6B20" strokeWidth="1.5" />
          <line x1="104" y1="42" x2="555" y2="42" stroke="#DD6B20" strokeWidth="1.5" />
          <text x="78" y="38" fontSize="8" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">old</text>
          <text x="330" y="38" fontSize="9" fontWeight="800" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">NEW (full transaction 동안 hold)</text>

          {/* req (TX 측) */}
          <text x="4" y="76" fontSize="10" fontWeight="800" fill="#DD6B20" fontFamily="monospace">req (tx)</text>
          <path d="M 60,82 L 100,82 L 100,68 L 360,68 L 360,82 L 555,82" stroke="#DD6B20" strokeWidth="1.6" fill="none" />

          {/* req_sync (RX 측) */}
          <text x="4" y="116" fontSize="10" fontWeight="800" fill={DAY07} fontFamily="monospace">req_sync (rx)</text>
          <path d="M 60,122 L 175,122 L 175,108 L 410,108 L 410,122 L 555,122" stroke={DAY07} strokeWidth="1.5" fill="none" />
          <text x="138" y="103" fontSize="6.8" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily="monospace">2 rx_clk sync</text>

          {/* ack (RX 측) */}
          <text x="4" y="156" fontSize="10" fontWeight="800" fill={DAY07} fontFamily="monospace">ack (rx)</text>
          <path d="M 60,162 L 195,162 L 195,148 L 425,148 L 425,162 L 555,162" stroke={DAY07} strokeWidth="1.6" fill="none" />

          {/* ack_sync (TX 측) */}
          <text x="4" y="196" fontSize="10" fontWeight="800" fill="#DD6B20" fontFamily="monospace">ack_sync (tx)</text>
          <path d="M 60,202 L 250,202 L 250,188 L 470,188 L 470,202 L 555,202" stroke="#DD6B20" strokeWidth="1.5" fill="none" />
          <text x="223" y="184" fontSize="6.8" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">2 tx_clk sync</text>

          {/* Capture marker */}
          <circle cx="195" cy="148" r="3.5" fill="#48BB78" />
          <text x="220" y="143" fontSize="6.8" fontWeight="800" fill="#48BB78" fontFamily="monospace">★ data capture</text>
        </svg>
      </div>
    ),
    code: `// ============== TX 측 (tx_clk) ==============
reg         req;
reg [N-1:0] data_tx;

// ack를 tx_clk 도메인으로 2-DFF sync (rx → tx)
reg         ack_meta_t, ack_sync_t;
always @(posedge tx_clk) {ack_sync_t, ack_meta_t} <= {ack_meta_t, ack};

always @(posedge tx_clk) begin
    if (rst) begin
        req     <= 1'b0;
    end else if (start && !req) begin
        data_tx <= new_data;       // ① 데이터 설정
        req     <= 1'b1;            //    + req assert
    end else if (req && ack_sync_t) begin
        req     <= 1'b0;            // ③ ack 확인 후 req deassert
    end
end

// ============== RX 측 (rx_clk) ==============
reg         ack;
reg [N-1:0] data_rx;

// req를 rx_clk 도메인으로 2-DFF sync (tx → rx)
reg         req_meta_r, req_sync_r;
always @(posedge rx_clk) {req_sync_r, req_meta_r} <= {req_meta_r, req};

always @(posedge rx_clk) begin
    if (rst) begin
        ack     <= 1'b0;
    end else if (req_sync_r && !ack) begin
        data_rx <= data_tx;        // ② data capture (req 동안 stable 보장)
        ack     <= 1'b1;            //    + ack assert
    end else if (!req_sync_r) begin
        ack     <= 1'b0;            // ④ req 내려간 후 ack deassert
    end
end`,
  },

  'Async FIFO': {
    title: 'Asynchronous FIFO',
    subtitle: '연속 데이터 스트림 — dual-port RAM + gray-coded pointer로 두 도메인 간 흐름제어',
    bullets: [
      '데이터 자체는 sync 안 됨 — dual-port RAM에 wclk write / rclk read 직접 access',
      '동기화 대상은 양쪽 pointer (wptr, rptr) — full/empty 판정용',
      'Binary → Gray 변환 후 cross-clock 2-DFF sync (gray는 한 번에 1 bit만 변경 → multi_bits 안전)',
      'WCLK 측: rgray_sync로 full 판정 → write 차단',
      'RCLK 측: wgray_sync로 empty 판정 → read 차단',
      '자동 흐름제어 + 고대역폭 (sustained throughput) — FPGA 표준 패턴',
      'CDC scheme: fifo (Evaluation) — Questa CDC가 자동 인식',
    ],
    diagram: (
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: FPGA.dark, marginBottom: '0.2rem' }}>회로 블록도</div>
      <svg viewBox="0 0 580 270" style={{ width: '100%' }}>
        {/* WCLK domain */}
        <rect x="10" y="20" width="260" height="220" rx="8" stroke="#DD6B20" strokeWidth="1.8" fill="rgba(221,107,32,0.05)" strokeDasharray="4 3" />
        <text x="140" y="14" fontSize="11" fontWeight="800" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">WCLK domain</text>

        {/* wbin */}
        <rect x="30" y="45" width="80" height="28" rx="4" stroke="#DD6B20" strokeWidth="1.4" fill="rgba(221,107,32,0.12)" />
        <text x="70" y="63" fontSize="10" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">wbin (++)</text>

        {/* bin→gray */}
        <rect x="30" y="90" width="80" height="28" rx="4" stroke="#DD6B20" strokeWidth="1.4" fill="rgba(221,107,32,0.12)" />
        <text x="70" y="108" fontSize="10" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">bin→gray</text>
        <path d="M 70,73 L 70,90" stroke="#DD6B20" strokeWidth="1.3" />

        {/* wgray */}
        <text x="82" y="125" fontSize="8.5" fontWeight="800" fill="#DD6B20" textAnchor="start" fontFamily="monospace">wgray</text>

        {/* full comparator */}
        <rect x="80" y="180" width="100" height="32" rx="4" stroke="#DD6B20" strokeWidth="1.4" fill="rgba(221,107,32,0.10)" />
        <text x="130" y="200" fontSize="10" fontWeight="700" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">wfull cmp</text>

        {/* rgray (RCLK, cyan) → 2DFF (wclk) → 도메인 색 전환 → rgray_sync (WCLK, orange) → wfull cmp */}
        {/* 1단: cyan — rgray가 WCLK 도메인의 2DFF 입력까지 전달 (y=154) */}
        <path d="M 500,154 L 254,154" stroke={DAY07} strokeWidth="1.3" strokeDasharray="3 2" fill="none" />
        {/* 2DFF Block */}
        <rect x="220" y="143" width="34" height="22" rx="4" stroke="#DD6B20" strokeWidth="1.4" fill="rgba(221,107,32,0.12)" />
        <text x="237" y="157" fontSize="8" fontWeight="800" fill="#DD6B20" textAnchor="middle" fontFamily="monospace">2DFF</text>
        {/* 2단: orange — 2DFF 출력은 wclk-domain 신호 rgray_sync */}
        <path d="M 220,154 L 130,154 L 130,180" stroke="#DD6B20" strokeWidth="1.3" strokeDasharray="3 2" fill="none" />
        <text x="175" y="148" fontSize="8" fontWeight="700" fill="#DD6B20" fontFamily="monospace" textAnchor="middle">rgray_sync</text>

        {/* RCLK domain */}
        <rect x="320" y="20" width="250" height="220" rx="8" stroke={DAY07} strokeWidth="1.8" fill="rgba(8,145,178,0.05)" strokeDasharray="4 3" />
        <text x="445" y="14" fontSize="11" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily="monospace">RCLK domain</text>

        {/* rbin */}
        <rect x="460" y="45" width="80" height="28" rx="4" stroke={DAY07} strokeWidth="1.4" fill="rgba(8,145,178,0.12)" />
        <text x="500" y="63" fontSize="10" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily="monospace">rbin (++)</text>

        {/* bin→gray */}
        <rect x="460" y="90" width="80" height="28" rx="4" stroke={DAY07} strokeWidth="1.4" fill="rgba(8,145,178,0.12)" />
        <text x="500" y="108" fontSize="10" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily="monospace">bin→gray</text>
        <path d="M 500,73 L 500,90" stroke={DAY07} strokeWidth="1.3" />

        {/* rgray */}
        <text x="488" y="125" fontSize="8.5" fontWeight="800" fill={DAY07} textAnchor="end" fontFamily="monospace">rgray</text>

        {/* empty comparator */}
        <rect x="390" y="180" width="100" height="32" rx="4" stroke={DAY07} strokeWidth="1.4" fill="rgba(8,145,178,0.10)" />
        <text x="440" y="200" fontSize="10" fontWeight="700" fill={DAY07} textAnchor="middle" fontFamily="monospace">rempty cmp</text>

        {/* wgray (WCLK, orange) → 2DFF (rclk) → 도메인 색 전환 → wgray_sync (RCLK, cyan) → rempty cmp */}
        {/* 1단: orange — wgray가 RCLK 도메인의 2DFF 입력까지 전달 (y=134) */}
        <path d="M 70,134 L 330,134" stroke="#DD6B20" strokeWidth="1.3" strokeDasharray="3 2" fill="none" />
        {/* 2DFF Block */}
        <rect x="330" y="123" width="34" height="22" rx="4" stroke={DAY07} strokeWidth="1.4" fill="rgba(8,145,178,0.12)" />
        <text x="347" y="137" fontSize="8" fontWeight="800" fill={DAY07} textAnchor="middle" fontFamily="monospace">2DFF</text>
        {/* 2단: cyan — 2DFF 출력은 rclk-domain 신호 wgray_sync */}
        <path d="M 364,134 L 440,134 L 440,180" stroke={DAY07} strokeWidth="1.3" strokeDasharray="3 2" fill="none" />
        <text x="402" y="128" fontSize="8" fontWeight="700" fill={DAY07} fontFamily="monospace" textAnchor="middle">wgray_sync</text>

        {/* Dual-port RAM */}
        <rect x="135" y="245" width="310" height="22" rx="4" stroke="#4A5568" strokeWidth="1.5" fill="rgba(74,85,104,0.10)" />
        <text x="290" y="260" fontSize="11" fontWeight="800" fill="#2D3748" textAnchor="middle" fontFamily="monospace">Dual-port RAM (2^AW × DW)</text>

        {/* RAM connections */}
        <path d="M 70,118 L 70,235 L 200,235 L 200,245" stroke="#DD6B20" strokeWidth="1.2" fill="none" opacity="0.6" />
        <text x="80" y="232" fontSize="8" fontWeight="700" fill="#DD6B20" fontFamily="monospace">wdata, wclk</text>
        <path d="M 500,118 L 500,235 L 380,235 L 380,245" stroke={DAY07} strokeWidth="1.2" fill="none" opacity="0.6" />
        <text x="490" y="232" fontSize="8" fontWeight="700" fill={DAY07} fontFamily="monospace" textAnchor="end">rclk, rdata</text>
      </svg>
      </div>
    ),
    code: `// === 핵심: gray-code 변환 + cross-clock 2DFF sync ===
wire [AW:0] wgray_next = (wbin_next >> 1) ^ wbin_next;
wire [AW:0] rgray_next = (rbin_next >> 1) ^ rbin_next;

// rgray → wclk 도메인 (2-DFF)
reg [AW:0] rgray_w1, rgray_w2;
always @(posedge wclk)
    {rgray_w2, rgray_w1} <= {rgray_w1, rgray};

// wgray → rclk 도메인 (2-DFF)
reg [AW:0] wgray_r1, wgray_r2;
always @(posedge rclk)
    {wgray_r2, wgray_r1} <= {wgray_r1, wgray};

assign wfull  = (wgray_next == {~rgray_w2[AW:AW-1], rgray_w2[AW-2:0]});
assign rempty = (rgray == wgray_r2);`,
  },
};

const modalStyle: CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '16px',
  padding: '1.4rem 1.7rem 1.5rem',
  maxWidth: '880px',
  width: '94%',
  maxHeight: '88vh',
  overflow: 'auto',
  boxShadow: '0 25px 70px rgba(0,0,0,0.40), 0 8px 24px rgba(0,0,0,0.20)',
  border: `1px solid ${FPGA.border}`,
};

function ImplPanel({ impl, schemeKey, onClose }: { impl: Impl; schemeKey: string; onClose: () => void }) {
  return (
    <div>
      {/* 헤더 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '1rem', marginBottom: '0.6rem',
        paddingBottom: '0.6rem', borderBottom: `1px solid ${FPGA.border}`,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.7rem', fontWeight: 800,
              color: '#fff', background: DAY07,
              padding: '3px 10px', borderRadius: '5px',
              letterSpacing: '0.06em',
            }}>{schemeKey}</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: FPGA.dark, lineHeight: 1.2 }}>
            {impl.title}
          </div>
          <div style={{ fontSize: '0.82rem', color: FPGA.textLight, marginTop: '0.2rem', lineHeight: 1.4 }}>
            {impl.subtitle}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            background: 'transparent',
            border: `1px solid ${FPGA.border}`,
            borderRadius: '8px',
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: FPGA.textLight,
            flexShrink: 0,
          }}
        >✕ 닫기</button>
      </div>

      {/* Bullets */}
      <ul style={{
        margin: '0 0 0.9rem', paddingLeft: '1.1rem',
        fontSize: '0.82rem', color: FPGA.text, lineHeight: 1.7,
      }}>
        {impl.bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>

      {/* Diagram (있으면) */}
      {impl.diagram && (
        <div style={{
          background: FPGA.bgAlt,
          border: `1px solid ${FPGA.border}`,
          borderRadius: '10px',
          padding: '0.7rem 0.9rem',
          marginBottom: impl.code ? '0.8rem' : 0,
        }}>
          {impl.diagram}
        </div>
      )}

      {/* Code (있으면) */}
      {impl.code && (
        <div style={{
          background: '#1A2235',
          borderRadius: '10px',
          padding: '0.7rem 0.95rem',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.20)',
        }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 800,
            color: '#A8D8A8', marginBottom: '0.35rem',
            letterSpacing: '0.05em', fontFamily: 'monospace',
          }}>
            Verilog 구현 예시
          </div>
          <pre style={{
            margin: 0,
            fontSize: '0.74rem', lineHeight: 1.55,
            color: '#E2E8F0',
            fontFamily: 'Consolas, "Courier New", "Liberation Mono", monospace',
            fontVariantLigatures: 'none',
            WebkitFontVariantLigatures: 'none' as any,
            fontFeatureSettings: '"liga" 0, "calt" 0',
            whiteSpace: 'pre-wrap',
          }}>
            {impl.code}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function SynchronizerFamilySlide() {
  const [active, setActive] = useState<string | null>(null);
  const activeImpl = active ? impls[active] : null;

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="이론"
          title="CDC 동기화 Scheme — 6종 비교"
          subtitle="신호 폭 / 처리량 / 프로토콜에 따라 적절한 scheme 선택 — 카드 클릭 시 구현 코드/블록도"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {/* 6개 카드 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
            {syncs.map((s) => (
              <div
                key={s.name}
                onClick={() => setActive(s.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActive(s.name); }}
                style={{
                  background: FPGA.white,
                  border: `1px solid ${DAY07}25`,
                  borderTop: `3px solid ${DAY07}`,
                  borderRadius: '10px',
                  padding: '0.55rem 0.75rem',
                  boxShadow: shadow.card,
                  display: 'flex', flexDirection: 'column', gap: '0.3rem',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = shadow.cardHover;
                  e.currentTarget.style.borderColor = `${DAY07}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = shadow.card;
                  e.currentTarget.style.borderColor = `${DAY07}25`;
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: FPGA.dark }}>{s.name}</span>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.58rem', fontWeight: 700,
                    color: s.col, background: `${s.col}15`,
                    border: `1px solid ${s.col}35`,
                    padding: '1px 6px', borderRadius: '4px',
                  }}>{s.severity}</span>
                </div>
                <code style={{
                  fontSize: '0.62rem',
                  background: '#1A2235', color: '#A8D8A8',
                  padding: '2px 7px', borderRadius: '4px',
                  fontFamily: 'monospace',
                  alignSelf: 'flex-start',
                }}>{s.scheme}</code>
                <div style={{ fontSize: '0.7rem', color: FPGA.text, lineHeight: 1.4 }}>
                  <strong style={{ color: DAY07 }}>용도:</strong> {s.use}
                </div>
                <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.45 }}>
                  <strong style={{ color: '#48BB78' }}>✓</strong> {s.pros}
                </div>
                <div style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.45 }}>
                  <strong style={{ color: '#E8913A' }}>!</strong> {s.cons}
                </div>
                <div style={{
                  fontSize: '0.6rem', fontWeight: 600,
                  color: DAY07, textAlign: 'right',
                  marginTop: '0.1rem',
                  fontFamily: '"JetBrains Mono", monospace',
                }}>▷ 구현 보기</div>
              </div>
            ))}
          </div>

          {/* 하단 — 선택 가이드 */}
          <div style={{
            flex: 1, minHeight: 0,
            background: `linear-gradient(135deg, ${DAY07}06, ${DAY07}14)`,
            border: `1px solid ${DAY07}30`,
            borderLeft: `4px solid ${DAY07}`,
            borderRadius: '10px',
            padding: '0.65rem 1rem',
            boxShadow: shadow.card,
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: DAY07, marginBottom: '0.4rem' }}>
              선택 가이드 — "어떤 Scheme을 쓸까?"
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {[
                { q: '1-bit · 레벨', a: '2-DFF', col: '#48BB78' },
                { q: '1-bit · 짧은 펄스', a: 'pulse_sync', col: '#48BB78' },
                { q: 'bus · 고대역 연속', a: 'async FIFO', col: '#48BB78' },
                { q: 'bus · 비주기 update', a: 'handshake / DMUX', col: '#E8913A' },
              ].map((g) => (
                <div key={g.q} style={{
                  background: FPGA.white,
                  border: `1px solid ${g.col}30`,
                  borderRadius: '8px',
                  padding: '0.5rem 0.6rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.7rem', color: FPGA.textLight, marginBottom: '0.2rem' }}>{g.q}</div>
                  <div style={{
                    fontSize: '0.78rem', fontWeight: 800, color: g.col,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}>→ {g.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <SlideModal
        open={!!active}
        onClose={() => setActive(null)}
        contentStyle={modalStyle}
      >
        {activeImpl && (
          <ImplPanel impl={activeImpl} schemeKey={active!} onClose={() => setActive(null)} />
        )}
      </SlideModal>
    </section>
  );
}
