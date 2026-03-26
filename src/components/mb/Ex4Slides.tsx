'use client';

import ImagePlaceholder from '../ImagePlaceholder';
import CodeBlock from '../CodeBlock';

export default function Ex4Slides() {
  return (
    <section>
      {/* 예제 4 Overview */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', borderBottom: '3px solid var(--accent)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>예제 4: BRAM & DMA 데이터 전송</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: '2rem' }}>
          <ul className="info-list" style={{ fontSize: '1.3rem' }}>
            <li><strong>배경</strong> <span>CPU가 데이터를 직접 복사하면 연산 자원 낭비 → DMA로 하드웨어 자동 전송</span></li>
            <li><strong>학습 목표</strong> <span>DMA(Direct Memory Access) 개념 이해 및<br />BRAM 기반 데이터 처리 파이프라인 구축</span></li>
            <li><strong>실습 내용</strong> <span>BRAM 데이터를 DMA가 읽어 Custom logic(+10) 통과 후 재기록</span></li>
            <li><strong>동작 확인</strong> <span>UART로 원본/결과 비교 출력,<br />CPU 개입 없이 DMA 자동 전송 완료</span></li>
          </ul>

          {/* DMA 아키텍처 SVG 다이어그램 */}
          <svg viewBox="0 0 480 310" style={{ width: '100%', margin: '0 auto' }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="ex4arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <path d="M0,0 L0,5 L5,2.5 z" fill="#20b2aa" />
              </marker>
              <marker id="ex4arr2" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <path d="M0,0 L0,5 L5,2.5 z" fill="#f59e0b" />
              </marker>
              <marker id="ex4arr3" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <path d="M0,0 L0,5 L5,2.5 z" fill="#7c3aed" />
              </marker>
              <marker id="ex4arr4" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <path d="M0,0 L0,5 L5,2.5 z" fill="#db2777" />
              </marker>
            </defs>

            {/* MicroBlaze CPU */}
            <rect x="10" y="20" width="110" height="55" rx="8" fill="#1e1b2e" stroke="#7c3aed" strokeWidth="2" />
            <text x="65" y="43" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="bold">MicroBlaze</text>
            <text x="65" y="58" textAnchor="middle" fill="#a78bfa" fontSize="9">CPU</text>

            {/* Arrow ①: MB → BRAM */}
            <line x1="120" y1="36" x2="168" y2="36" stroke="#7c3aed" strokeWidth="1.5" markerEnd="url(#ex4arr3)" />
            <text x="144" y="30" textAnchor="middle" fill="#7c3aed" fontSize="7" fontWeight="bold">① 기록</text>

            {/* BRAM Controller */}
            <rect x="170" y="15" width="120" height="65" rx="8" fill="#e0f7f5" stroke="#20b2aa" strokeWidth="2" />
            <text x="230" y="38" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="bold">AXI BRAM</text>
            <text x="230" y="52" textAnchor="middle" fill="#166534" fontSize="10">Controller</text>
            <text x="230" y="66" textAnchor="middle" fill="#64748b" fontSize="8">Block RAM</text>

            {/* Arrow ②: BRAM → DMA */}
            <line x1="250" y1="80" x2="250" y2="118" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#ex4arr2)" />
            <text x="260" y="107" fill="#92400e" fontSize="8" fontWeight="bold">② DMA Read</text>

            {/* AXI DMA */}
            <rect x="160" y="120" width="140" height="60" rx="8" fill="#fef9e7" stroke="#f59e0b" strokeWidth="2" />
            <text x="230" y="143" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="bold">AXI DMA</text>
            <text x="195" y="163" textAnchor="middle" fill="#b45309" fontSize="8">MM2S</text>
            <text x="265" y="163" textAnchor="middle" fill="#b45309" fontSize="8">S2MM</text>
            <line x1="230" y1="148" x2="230" y2="172" stroke="#d4a574" strokeWidth="0.5" />

            {/* Arrow: DMA MM2S → Adder */}
            <line x1="300" y1="150" x2="348" y2="150" stroke="#db2777" strokeWidth="2" markerEnd="url(#ex4arr4)" />
            <text x="324" y="142" textAnchor="middle" fill="#db2777" fontSize="7">Stream</text>

            {/* +10 Adder (Custom IP) */}
            <rect x="350" y="120" width="110" height="60" rx="8" fill="#fce7f3" stroke="#db2777" strokeWidth="2" />
            <text x="405" y="145" textAnchor="middle" fill="#9d174d" fontSize="13" fontWeight="bold">+10 Adder</text>
            <text x="405" y="163" textAnchor="middle" fill="#be185d" fontSize="9">Custom IP</text>

            {/* Arrow: Adder → DMA S2MM (return path) */}
            <path d="M 405 180 L 405 205 L 232 205 L 232 184" fill="none" stroke="#db2777" strokeWidth="2" markerEnd="url(#ex4arr4)" />
            <text x="335" y="200" textAnchor="middle" fill="#db2777" fontSize="7">Stream</text>

            {/* Arrow ③: DMA → BRAM (write-back) */}
            <line x1="215" y1="120" x2="215" y2="84" stroke="#20b2aa" strokeWidth="1.5" markerEnd="url(#ex4arr)" />
            <text x="160" y="107" fill="#166534" fontSize="8" fontWeight="bold">③ Write-back</text>

            {/* Arrow ④: BRAM → MB (verify, dashed) */}
            <line x1="170" y1="65" x2="122" y2="65" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#ex4arr3)" />
            <text x="146" y="60" textAnchor="middle" fill="#7c3aed" fontSize="7" fontWeight="bold">④ 검증</text>

            {/* UART */}
            <rect x="10" y="90" width="90" height="35" rx="6" fill="#e0f7f5" stroke="#3cb371" strokeWidth="1.5" />
            <text x="55" y="110" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="bold">UART 출력</text>
            <line x1="55" y1="75" x2="55" y2="88" stroke="#3cb371" strokeWidth="1.5" markerEnd="url(#ex4arr)" />

            {/* 설명 박스 */}
            <rect x="10" y="240" width="460" height="55" rx="8" fill="rgba(124,58,237,0.06)" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4,3" />
            <text x="240" y="260" textAnchor="middle" fill="#5b21b6" fontSize="10" fontWeight="bold">DMA 핵심 개념</text>
            <text x="240" y="278" textAnchor="middle" fill="#6d28d9" fontSize="9">CPU는 DMA 시작 명령만 내림 → 전송/연산은 하드웨어가 수행 → CPU 자원 절약</text>
          </svg>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '1.2rem', color: '#64748b' }}>
          ⬇️ 아래 방향키(↓)를 눌러 실습 단계 확인
        </p>
      </section>

      {/* Step 1: Vivado Block Design */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Ex4 | Step 1. Vivado Block Design 구성</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '3rem' }}>
          <div>
            <ul className="step-list">
              <li>
                <div className="step-icon">1</div>
                <div className="step-content">
                  <span className="step-title">예제 3 기반 시작 + BRAM Controller 추가</span>
                  <span className="step-desc">MicroBlaze + UART 유지, IP Catalog에서 <code>AXI BRAM Controller</code> 추가 (BRAM Options → <code>Number of BRAM interfaces: 1</code>)</span>
                </div>
              </li>
              <li>
                <div className="step-icon">2</div>
                <div className="step-content">
                  <span className="step-title">Block Memory Generator 연결</span>
                  <span className="step-desc">Run Block Automation → Block Memory 자동 생성 (크기는 BRAM Controller의 <code>Memory Depth</code> × 4B, Address Editor에서 확인)</span>
                </div>
              </li>
              <li>
                <div className="step-icon">3</div>
                <div className="step-content">
                  <span className="step-title">AXI DMA 추가 및 설정</span>
                  <span className="step-desc">
                    <ul className="step-list-sub">
                      <li>IP Catalog에서 <code>AXI DMA</code> 추가, Scatter Gather <strong>비활성화</strong></li>
                      <li>Buffer Length Register: 26, Data Width: 32</li>
                    </ul>
                  </span>
                </div>
              </li>
              <li>
                <div className="step-icon">4</div>
                <div className="step-content">
                  <span className="step-title">Connection Automation</span>
                  <span className="step-desc">자동 연결을 통해 AXI-Lite 및 Memory-Mapped 포트 버스 연결 실행</span>
                </div>
              </li>
            </ul>

            <div style={{ marginTop: '1.0rem', padding: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', borderRadius: '2px', fontSize: '0.8rem' }}>
              <p style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>💡</span> BRAM vs DDR3(MIG)
              </p>
              <p style={{ color: '#475569', lineHeight: '1.4', margin: 0 }}>
                BRAM은 즉시 동작. DDR3(MIG)는 Calibration, clock 설정 등 복잡한 절차 필요.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex4_step1_initial.png"
                label="IP 추가 상태"
                desc="BRAM Controller + DMA 추가된 블록 디자인"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>BRAM + DMA IP 추가 상태</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex4_step1_automation.png"
                label="자동 연결 완료"
                desc="Connection Automation 후 최종 블록 디자인"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>Connection Automation 완료</span>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Custom IP + Address Editor */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.0rem', marginBottom: '0.8rem' }}>Ex4 | Step 2. +10 Adder IP 생성 및 Address 설정</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '2rem' }}>
          <div>
            <ul className="step-list compact">
              <li>
                <div className="step-icon">1</div>
                <div className="step-content">
                  <span className="step-title">Custom IP 생성</span>
                  <span className="step-desc"><code>Tools</code> → <code>Create and Package New IP</code> → AXI4-Stream 선택</span>
                </div>
              </li>
              <li>
                <div className="step-icon">2</div>
                <div className="step-content">
                  <span className="step-title">Verilog 핵심 로직 (예제 3과 동일)</span>
                  <span className="step-desc">
                    <ul className="step-list-sub" style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>
                      <li>자동으로 instantiated된 <code>AXI Bus</code> 모듈 주석 처리</li>
                      <li>아래 <strong>+10 핵심 로직</strong> 삽입 후 <code>Re-Package IP</code> 클릭</li>
                    </ul>
                  </span>
                  <div style={{ marginTop: '0.2rem', lineHeight: '1.25', backgroundColor: '#282c34', padding: '0.4rem 0.6rem', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', fontFamily: "'JetBrains Mono', 'D2Coding', 'Consolas', monospace" }}>
                    <code style={{ fontSize: '0.75em', color: '#abb2bf', fontFamily: 'inherit' }}><span style={{ color: '#c678dd' }}>assign</span> m_axis_tdata = s_axis_tdata <span style={{ color: '#d19a66' }}>+ 32'd10</span>;</code><br />
                    <code style={{ fontSize: '0.75em', color: '#abb2bf', fontFamily: 'inherit' }}><span style={{ color: '#c678dd' }}>assign</span> m_axis_tvalid = s_axis_tvalid;</code><br />
                    <code style={{ fontSize: '0.75em', color: '#abb2bf', fontFamily: 'inherit' }}><span style={{ color: '#c678dd' }}>assign</span> s_axis_tready = m_axis_tready;</code><br />
                    <code style={{ fontSize: '0.75em', color: '#abb2bf', fontFamily: 'inherit' }}><span style={{ color: '#c678dd' }}>assign</span> m_axis_tlast = s_axis_tlast;</code>
                  </div>
                </div>
              </li>
              <li>
                <div className="step-icon">3</div>
                <div className="step-content">
                  <span className="step-title">Block Design 연결</span>
                  <span className="step-desc">
                    <ul className="step-list-sub" style={{ fontSize: '1.05rem' }}>
                      <li>DMA의 <code>M_AXIS_MM2S</code> → Adder의 <code>S_AXIS</code></li>
                      <li>Adder의 <code>M_AXIS</code> → DMA의 <code>S_AXIS_S2MM</code></li>
                    </ul>
                  </span>
                </div>
              </li>
              <li>
                <div className="step-icon">4</div>
                <div className="step-content">
                  <span className="step-title">Address Editor 확인</span>
                  <span className="step-desc">
                    <ul className="step-list-sub" style={{ fontSize: '1.05rem' }}>
                      <li>BRAM: <code>0xC000_0000</code> 등 주소 및 크기 할당 확인</li>
                      <li>DMA <code>MM2S/S2MM</code> → Interconnect → BRAM 경로 점검</li>
                    </ul>
                  </span>
                </div>
              </li>
              <li>
                <div className="step-icon">5</div>
                <div className="step-content">
                  <span className="step-title">Generate Bitstream → Export</span>
                  <span className="step-desc">설계 완성 후 Bitstream 생성 및 <code>.xsa</code> 추출</span>
                </div>
              </li>
            </ul>

            <div style={{ marginTop: '0.3rem', padding: '0.3rem 0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', borderRadius: '2px', fontSize: '0.75rem' }}>
              <p style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>💡</span> Address Editor 필수 확인
              </p>
              <p style={{ color: '#475569', lineHeight: '1.3', margin: 0 }}>
                DMA의 메모리맵 포트가 BRAM 주소 범위를 포함해야 함. 누락 시 <code>Bus Error</code> 발생.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex4_step2_address.png"
                label="Address Editor"
                desc="BRAM과 DMA 주소 할당 화면"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>Address Editor 설정</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex4_step2_connected.png"
                label="최종 연결 상태"
                desc="DMA → Adder → DMA 스트림 연결 완료"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>DMA ↔ Adder 스트림 연결 완료</span>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Vitis DMA 코드 */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '0.8rem' }}>Ex4 | Step 3. DMA 제어 코드 (C)</h2>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1rem' }}>BTN0 → BRAM 데이터 기록 → DMA 전송 → Custom Logic(+10) → 결과 검증 → LED 표시</p>

        <CodeBlock style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '1.2rem', borderRadius: '8px', fontSize: '1.05rem', overflowX: 'auto', overflowY: 'auto', lineHeight: '1.3', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', maxHeight: '420px' }}>
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;xparameters.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;xaxidma.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;xgpio.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;xil_cache.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;platform.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&lt;stdio.h&gt;</span><br />
          <br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>DMA_DEV_ID</span>&nbsp;&nbsp;&nbsp;XPAR_AXIDMA_0_DEVICE_ID<br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>BRAM_BASE</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>0xC0000000</span> <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// Address Editor의 BRAM 주소 직접 입력 또는 xparameters.h 매크로</span><br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>DATA_CNT</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>64</span><br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>SRC_OFFSET</span>&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>0x0000</span><br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>DST_OFFSET</span>&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>0x1000</span> <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 4KB 오프셋 (BRAM 8KB 범위 내)</span><br />
          <br />
          <span style={{ color: '#e5c07b' }}>XAxiDma</span> dma;&nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>XGpio</span> gpio0;&nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> run_cnt = <span style={{ color: '#d19a66' }}>0</span>;<br />
          <br />
          <span style={{ color: '#e5c07b' }}>int</span> <span style={{ color: '#61afef' }}>main</span>() {'{'}<br />
          &nbsp;&nbsp;init_platform();<br />
          &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>u32</span> *src = (<span style={{ color: '#e5c07b' }}>u32</span> *)(BRAM_BASE + SRC_OFFSET);<br />
          &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>u32</span> *dst = (<span style={{ color: '#e5c07b' }}>u32</span> *)(BRAM_BASE + DST_OFFSET);<br />
          <br />
          &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// GPIO 초기화 (gpio0: ch1=녹색LED, ch2=BTN)</span><br />
          &nbsp;&nbsp;XGpio_Initialize(&amp;gpio0, XPAR_GPIO_0_DEVICE_ID);<br />
          &nbsp;&nbsp;XGpio_SetDataDirection(&amp;gpio0, <span style={{ color: '#d19a66' }}>1</span>, <span style={{ color: '#d19a66' }}>0x0</span>);<br />
          &nbsp;&nbsp;XGpio_SetDataDirection(&amp;gpio0, <span style={{ color: '#d19a66' }}>2</span>, <span style={{ color: '#d19a66' }}>0xF</span>);<br />
          <br />
          &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// DMA 초기화</span><br />
          &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>XAxiDma_Config</span> *cfg = XAxiDma_LookupConfig(DMA_DEV_ID);<br />
          &nbsp;&nbsp;XAxiDma_CfgInitialize(&amp;dma, cfg);<br />
          &nbsp;&nbsp;XAxiDma_IntrDisable(&amp;dma, XAXIDMA_IRQ_ALL_MASK, XAXIDMA_DEVICE_TO_DMA);<br />
          &nbsp;&nbsp;XAxiDma_IntrDisable(&amp;dma, XAXIDMA_IRQ_ALL_MASK, XAXIDMA_DMA_TO_DEVICE);<br />
          <br />
          &nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;=== Ex4: BRAM + DMA Demo ===\r\n&quot;</span>);<br />
          &nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;Press BTN0 to start DMA transfer...\r\n&quot;</span>);<br />
          <br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span> (<span style={{ color: '#d19a66' }}>1</span>) {'{'}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>if</span> (XGpio_DiscreteRead(&amp;gpio0, <span style={{ color: '#d19a66' }}>2</span>) &amp; <span style={{ color: '#d19a66' }}>0x1</span>) {'{'}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XGpio_DiscreteWrite(&amp;gpio0, <span style={{ color: '#d19a66' }}>1</span>, <span style={{ color: '#d19a66' }}>0x1</span>); <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// LD4 ON — 전송 중</span><br />
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// BRAM 원본 데이터 기록 (매회 다른 시작값)</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> base = run_cnt * <span style={{ color: '#d19a66' }}>100</span>;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>for</span> (<span style={{ color: '#e5c07b' }}>int</span> i = <span style={{ color: '#d19a66' }}>0</span>; i &lt; DATA_CNT; i++) {'{'} src[i] = base + i; dst[i] = <span style={{ color: '#d19a66' }}>0</span>; {'}'}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;run_cnt++;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Xil_DCacheFlushRange((<span style={{ color: '#e5c07b' }}>UINTPTR</span>)src, DATA_CNT*<span style={{ color: '#d19a66' }}>4</span>);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Xil_DCacheFlushRange((<span style={{ color: '#e5c07b' }}>UINTPTR</span>)dst, DATA_CNT*<span style={{ color: '#d19a66' }}>4</span>);<br />
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// DMA 전송: S2MM 먼저, 그 다음 MM2S</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XAxiDma_SimpleTransfer(&amp;dma, (<span style={{ color: '#e5c07b' }}>UINTPTR</span>)dst, DATA_CNT*<span style={{ color: '#d19a66' }}>4</span>, XAXIDMA_DEVICE_TO_DMA);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XAxiDma_SimpleTransfer(&amp;dma, (<span style={{ color: '#e5c07b' }}>UINTPTR</span>)src, DATA_CNT*<span style={{ color: '#d19a66' }}>4</span>, XAXIDMA_DMA_TO_DEVICE);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span> (XAxiDma_Busy(&amp;dma, XAXIDMA_DMA_TO_DEVICE));<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span> (XAxiDma_Busy(&amp;dma, XAXIDMA_DEVICE_TO_DMA));<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Xil_DCacheInvalidateRange((<span style={{ color: '#e5c07b' }}>UINTPTR</span>)dst, DATA_CNT*<span style={{ color: '#d19a66' }}>4</span>);<br />
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 결과 검증</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> err = <span style={{ color: '#d19a66' }}>0</span>;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>for</span> (<span style={{ color: '#e5c07b' }}>int</span> i = <span style={{ color: '#d19a66' }}>0</span>; i &lt; DATA_CNT; i++)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>if</span> (dst[i] != src[i] + <span style={{ color: '#d19a66' }}>10</span>) err++;<br />
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>for</span> (<span style={{ color: '#e5c07b' }}>int</span> i = <span style={{ color: '#d19a66' }}>0</span>; i &lt; <span style={{ color: '#d19a66' }}>16</span>; i++)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot; src[%d]=%d -&gt; +10=%d %s\r\n&quot;</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i, src[i], dst[i], (dst[i]==src[i]+<span style={{ color: '#d19a66' }}>10</span>) ? <span style={{ color: '#98c379' }}>&quot;OK&quot;</span> : <span style={{ color: '#98c379' }}>&quot;FAIL&quot;</span>);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;Errors: %d/%d  %s\r\n&quot;</span>, err, DATA_CNT,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;err==<span style={{ color: '#d19a66' }}>0</span> ? <span style={{ color: '#98c379' }}>&quot;PASS!&quot;</span> : <span style={{ color: '#98c379' }}>&quot;FAIL!&quot;</span>);<br />
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// LED 결과 표시: PASS=0xF(전체ON), FAIL=0x0</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XGpio_DiscreteWrite(&amp;gpio0, <span style={{ color: '#d19a66' }}>1</span>, err==<span style={{ color: '#d19a66' }}>0</span> ? <span style={{ color: '#d19a66' }}>0xF</span> : <span style={{ color: '#d19a66' }}>0x0</span>);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span> (XGpio_DiscreteRead(&amp;gpio0, <span style={{ color: '#d19a66' }}>2</span>) &amp; <span style={{ color: '#d19a66' }}>0x1</span>); <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 버튼 해제 대기</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XGpio_DiscreteWrite(&amp;gpio0, <span style={{ color: '#d19a66' }}>1</span>, <span style={{ color: '#d19a66' }}>0x0</span>);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
          &nbsp;&nbsp;{'}'}<br />
          &nbsp;&nbsp;cleanup_platform();<br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>return</span> <span style={{ color: '#d19a66' }}>0</span>;<br />
          {'}'}
        </CodeBlock>
      </section>

      {/* Step 4: 빌드 및 테스트 */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Ex4 | Step 4. 빌드 및 보드 구동 테스트</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '3rem' }}>
          <div>
            <ul className="step-list">
              <li>
                <div className="step-icon">1</div>
                <div className="step-content">
                  <span className="step-title">Platform 및 Application 생성</span>
                  <span className="step-desc">예제 4 <code>.xsa</code>로 Platform 생성, Hello World 템플릿에서 <code>main.c</code> 교체</span>
                </div>
              </li>
              <li>
                <div className="step-icon">2</div>
                <div className="step-content">
                  <span className="step-title">Build → Program Device → Launch</span>
                  <span className="step-desc">Bitstream 다운로드 후 MicroBlaze에 ELF 로딩</span>
                </div>
              </li>
              <li>
                <div className="step-icon">3</div>
                <div className="step-content">
                  <span className="step-title">UART 터미널 확인 및 결과 검증</span>
                  <span className="step-desc">
                    <ul className="step-list-sub">
                      <li><code>115200</code> baud, BTN0 누르면 DMA 전송 → src[i]+10 == dst[i] 검증</li>
                      <li><code>PASS!</code> 메시지로 DMA + Custom Logic 전체 경로 검증 완료</li>
                    </ul>
                  </span>
                </div>
              </li>
              <li>
                <div className="step-icon">4</div>
                <div className="step-content">
                  <span className="step-title">핵심 학습 포인트</span>
                  <span className="step-desc">CPU는 DMA 시작 명령만 내림 → 전송/연산은 하드웨어가 수행 → CPU 자원 절약</span>
                </div>
              </li>
            </ul>

            <div style={{ marginTop: '1.0rem', padding: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', borderRadius: '2px', fontSize: '0.8rem' }}>
              <p style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>💡</span> 대용량 테스트
              </p>
              <p style={{ color: '#475569', lineHeight: '1.4', margin: 0 }}>
                <code>DATA_CNT</code>를 늘려보면 CPU 직접 복사 대비 DMA의 효율성을 체감할 수 있음. 대용량에서 차이 극대화.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex4_step4_uart.png"
                label="UART 출력 결과"
                desc="BTN0 → DMA 전송 → +10 결과 검증 (16개 표시)"
                maxHeight="520px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>UART 터미널 출력 결과</span>
            </div>
          </div>
        </div>
      </section>

      {/* 통합 정리: Ex1~Ex4 전체 아키텍처 */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', borderBottom: '3px solid var(--accent)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>통합 정리: 4단계 MicroBlaze 설계 여정</h2>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1.5rem' }}>예제 1 ~ 4를 통해 학습한 핵심 개념의 전체 연결 관계</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Ex1 Card */}
          <div className="curriculum-anim" style={{ animationDelay: '0.05s', background: 'linear-gradient(135deg, #7c3aed0d 0%, #7c3aed05 100%)', border: '1px solid #7c3aed35', borderRadius: '14px', padding: '1.2rem', borderLeft: '3px solid #7c3aed' }}>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 0.3rem 0' }}>예제 1</p>
            <p style={{ color: 'var(--primary-dark)', fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>GPIO 제어</p>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>AXI-Lite 기초<br />폴링 방식 I/O</p>
          </div>

          {/* Ex2 Card */}
          <div className="curriculum-anim" style={{ animationDelay: '0.15s', background: 'linear-gradient(135deg, #20b2aa0d 0%, #20b2aa05 100%)', border: '1px solid #20b2aa35', borderRadius: '14px', padding: '1.2rem', borderLeft: '3px solid #20b2aa' }}>
            <p style={{ color: '#20b2aa', fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 0.3rem 0' }}>예제 2</p>
            <p style={{ color: 'var(--primary-dark)', fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Interrupt 제어</p>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>ISR 비동기 처리<br />이벤트 기반 반응</p>
          </div>

          {/* Ex3 Card */}
          <div className="curriculum-anim" style={{ animationDelay: '0.25s', background: 'linear-gradient(135deg, #f59e0b0d 0%, #f59e0b05 100%)', border: '1px solid #f59e0b35', borderRadius: '14px', padding: '1.2rem', borderLeft: '3px solid #f59e0b' }}>
            <p style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 0.3rem 0' }}>예제 3</p>
            <p style={{ color: 'var(--primary-dark)', fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>AXI-Stream</p>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>스트림 Custom logic 연동<br />고속 데이터 경로</p>
          </div>

          {/* Ex4 Card */}
          <div className="curriculum-anim" style={{ animationDelay: '0.35s', background: 'linear-gradient(135deg, #db27770d 0%, #db277705 100%)', border: '1px solid #db277735', borderRadius: '14px', padding: '1.2rem', borderLeft: '3px solid #db2777' }}>
            <p style={{ color: '#db2777', fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 0.3rem 0' }}>예제 4</p>
            <p style={{ color: 'var(--primary-dark)', fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>DMA 전송</p>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>메모리 자동 전송<br />CPU 부하 최소화</p>
          </div>
        </div>

        {/* 진행 흐름 화살표 */}
        <div className="curriculum-anim" style={{ animationDelay: '0.5s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <span style={{ backgroundColor: '#7c3aed', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>GPIO</span>
          <span style={{ color: '#94a3b8', fontSize: '1.2rem' }}>→</span>
          <span style={{ backgroundColor: '#20b2aa', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>Interrupt</span>
          <span style={{ color: '#94a3b8', fontSize: '1.2rem' }}>→</span>
          <span style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>AXI-Stream</span>
          <span style={{ color: '#94a3b8', fontSize: '1.2rem' }}>→</span>
          <span style={{ backgroundColor: '#db2777', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>DMA</span>
        </div>

        <div className="curriculum-anim" style={{ animationDelay: '0.65s', padding: '0.8rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', borderRadius: '4px', fontSize: '0.9rem' }}>
          <p style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '0.3rem' }}>
            이 4단계를 완료하면?
          </p>
          <p style={{ color: '#475569', lineHeight: '1.5', margin: 0 }}>
            MicroBlaze 기반 임베디드 시스템의 핵심 설계 패턴을 모두 경험한 것.<br />
            이후 DDR3(MIG), Ethernet, PCIe 등 고급 IP로 확장 가능.
          </p>
        </div>
      </section>
    </section>
  );
}
