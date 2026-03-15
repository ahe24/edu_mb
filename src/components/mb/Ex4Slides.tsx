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
            <li><strong>실습 내용</strong> <span>BRAM 데이터를 DMA가 읽어 가속기(+10) 통과 후 재기록</span></li>
            <li><strong>동작 확인</strong> <span>UART로 원본/결과 비교 출력,<br />CPU 개입 없이 DMA 자동 전송 완료</span></li>
          </ul>

          {/* DMA 아키텍처 SVG 다이어그램 */}
          <svg viewBox="0 0 480 310" style={{ width: '100%', margin: '0 auto' }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="ex4arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#20b2aa" />
              </marker>
              <marker id="ex4arr2" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#f59e0b" />
              </marker>
              <marker id="ex4arr3" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#7c3aed" />
              </marker>
              <marker id="ex4arr4" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#db2777" />
              </marker>
            </defs>

            {/* MicroBlaze CPU */}
            <rect x="10" y="20" width="110" height="55" rx="8" fill="#1e1b2e" stroke="#7c3aed" strokeWidth="2" />
            <text x="65" y="43" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="bold">MicroBlaze</text>
            <text x="65" y="58" textAnchor="middle" fill="#a78bfa" fontSize="9">CPU</text>

            {/* Arrow ①: MB → BRAM */}
            <line x1="120" y1="47" x2="168" y2="47" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#ex4arr3)" />
            <text x="144" y="40" textAnchor="middle" fill="#7c3aed" fontSize="8" fontWeight="bold">① 기록</text>

            {/* BRAM Controller */}
            <rect x="170" y="15" width="120" height="65" rx="8" fill="#e0f7f5" stroke="#20b2aa" strokeWidth="2" />
            <text x="230" y="38" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="bold">AXI BRAM</text>
            <text x="230" y="52" textAnchor="middle" fill="#166534" fontSize="10">Controller</text>
            <text x="230" y="66" textAnchor="middle" fill="#64748b" fontSize="8">Block RAM (64KB)</text>

            {/* Arrow ②: BRAM → DMA */}
            <line x1="230" y1="80" x2="230" y2="118" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#ex4arr2)" />
            <text x="255" y="102" fill="#92400e" fontSize="8" fontWeight="bold">② DMA Read</text>

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
            <path d="M 405 180 L 405 205 L 265 205 L 265 180" fill="none" stroke="#db2777" strokeWidth="2" markerEnd="url(#ex4arr4)" />
            <text x="335" y="200" textAnchor="middle" fill="#db2777" fontSize="7">Stream</text>

            {/* Arrow ③: DMA → BRAM (write-back) */}
            <line x1="195" y1="120" x2="195" y2="87" stroke="#20b2aa" strokeWidth="2" markerEnd="url(#ex4arr)" />
            <text x="165" y="107" fill="#166534" fontSize="8" fontWeight="bold">③ Write-back</text>

            {/* Arrow ④: BRAM → MB (verify, dashed) */}
            <line x1="170" y1="35" x2="122" y2="35" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#ex4arr3)" />
            <text x="146" y="28" textAnchor="middle" fill="#7c3aed" fontSize="7">④ 검증</text>

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
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Step 1. Vivado Block Design 구성</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '3rem' }}>
          <div>
            <ul className="step-list">
              <li>
                <div className="step-icon">1</div>
                <div className="step-content">
                  <span className="step-title">예제 3 기반 시작 + BRAM Controller 추가</span>
                  <span className="step-desc">MicroBlaze + UART 유지, IP Catalog에서 <code>AXI BRAM Controller</code> 추가 (싱글 포트)</span>
                </div>
              </li>
              <li>
                <div className="step-icon">2</div>
                <div className="step-content">
                  <span className="step-title">Block Memory Generator 연결</span>
                  <span className="step-desc">Run Block Automation → BRAM Controller에 Block Memory 자동 생성 (64KB)</span>
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
                  <span className="step-title">Connection Automation → HDL Wrapper → Export .xsa</span>
                  <span className="step-desc">AXI-Lite + Memory-Mapped 포트 자동 연결 후 Bitstream 생성</span>
                </div>
              </li>
            </ul>

            <div style={{ marginTop: '1.0rem', padding: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', borderRadius: '2px', fontSize: '0.8rem' }}>
              <p style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>💡</span> BRAM vs DDR3(MIG)
              </p>
              <p style={{ color: '#475569', lineHeight: '1.4', margin: 0 }}>
                BRAM은 즉시 동작. DDR3(MIG)는 캘리브레이션, 클록 설정 등 복잡한 절차 필요.
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
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Step 2. +10 Adder IP 생성 및 Address 설정</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '3rem' }}>
          <div>
            <ul className="step-list">
              <li>
                <div className="step-icon">1</div>
                <div className="step-content">
                  <span className="step-title">Custom IP 생성</span>
                  <span className="step-desc">예제 3과 동일: <code>Tools</code> → <code>Create and Package New IP</code><br />→ AXI4-Stream (Slave + Master)</span>
                </div>
              </li>
              <li>
                <div className="step-icon">2</div>
                <div className="step-content">
                  <span className="step-title">Verilog 핵심 로직</span>
                  <span className="step-desc"><code>assign m_axis_tdata = s_axis_tdata + 32&apos;d10;</code><br />+ tvalid, tready, tlast 패스스루</span>
                </div>
              </li>
              <li>
                <div className="step-icon">3</div>
                <div className="step-content">
                  <span className="step-title">Block Design 연결</span>
                  <span className="step-desc">
                    <ul className="step-list-sub">
                      <li>DMA의 <code>M_AXIS_MM2S</code> → Adder의 <code>S_AXIS</code></li>
                      <li>Adder의 <code>M_AXIS</code> → DMA의 <code>S_AXIS_S2MM</code></li>
                    </ul>
                  </span>
                </div>
              </li>
              <li>
                <div className="step-icon">4</div>
                <div className="step-content">
                  <span className="step-title">Address Editor 및 메모리맵 확인</span>
                  <span className="step-desc">
                    <ul className="step-list-sub">
                      <li>BRAM: <code>0xC000_0000</code> 범위 64K, DMA 제어 주소 자동 할당 확인</li>
                      <li>DMA의 <code>M_AXI_MM2S/S2MM</code> → Interconnect → BRAM 연결 확인</li>
                    </ul>
                  </span>
                </div>
              </li>
            </ul>

            <div style={{ marginTop: '0.8rem', padding: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', borderRadius: '2px', fontSize: '0.8rem' }}>
              <p style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>💡</span> Address Editor 필수 확인
              </p>
              <p style={{ color: '#475569', lineHeight: '1.4', margin: 0 }}>
                DMA의 메모리맵 포트가 BRAM 주소 범위를 포함해야 함. 누락 시 DMA 전송 시 <code>Bus Error</code> 발생.
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
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '0.8rem' }}>Step 3. DMA 제어 코드 (C)</h2>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1rem' }}>CPU가 BRAM에 데이터 기록 → DMA 전송 명령 → 가속기(+10) 처리 후 BRAM 재기록 → 결과 검증</p>

        <CodeBlock style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '16px', borderRadius: '8px', fontSize: '16px', lineHeight: '1.35', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', maxHeight: '460px' }}>
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;xparameters.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;xaxidma.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;xil_cache.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&lt;stdio.h&gt;</span><br />
          <br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>DMA_DEV_ID</span>&nbsp;&nbsp;&nbsp;XPAR_AXIDMA_0_DEVICE_ID<br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>BRAM_BASE</span>&nbsp;&nbsp;&nbsp;&nbsp;XPAR_BRAM_0_BASEADDR<br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>DATA_CNT</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>64</span> &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 전송 워드 수</span><br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>SRC_OFFSET</span>&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>0x0000</span><br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>DST_OFFSET</span>&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>0x4000</span> <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 결과 영역 (16KB 오프셋)</span><br />
          <br />
          <span style={{ color: '#e5c07b' }}>XAxiDma</span> dma;<br />
          <br />
          <span style={{ color: '#e5c07b' }}>int</span> <span style={{ color: '#61afef' }}>main</span>() {'{'}<br />
          &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>XAxiDma_Config</span> *cfg;<br />
          &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>u32</span> *src = (<span style={{ color: '#e5c07b' }}>u32</span> *)(BRAM_BASE + SRC_OFFSET);<br />
          &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>u32</span> *dst = (<span style={{ color: '#e5c07b' }}>u32</span> *)(BRAM_BASE + DST_OFFSET);<br />
          <br />
          &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 1. DMA 초기화</span><br />
          &nbsp;&nbsp;cfg = XAxiDma_LookupConfig(DMA_DEV_ID);<br />
          &nbsp;&nbsp;XAxiDma_CfgInitialize(&amp;dma, cfg);<br />
          &nbsp;&nbsp;XAxiDma_IntrDisable(&amp;dma, XAXIDMA_IRQ_ALL_MASK, XAXIDMA_DEVICE_TO_DMA);<br />
          &nbsp;&nbsp;XAxiDma_IntrDisable(&amp;dma, XAXIDMA_IRQ_ALL_MASK, XAXIDMA_DMA_TO_DEVICE);<br />
          <br />
          &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 2. BRAM에 원본 데이터 기록</span><br />
          &nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;=== Ex4: BRAM + DMA Demo ===\r\n&quot;</span>);<br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>for</span> (<span style={{ color: '#e5c07b' }}>int</span> i = <span style={{ color: '#d19a66' }}>0</span>; i &lt; DATA_CNT; i++) {'{'}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;src[i] = i * <span style={{ color: '#d19a66' }}>10</span>;&nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 0, 10, 20, 30, ...</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;dst[i] = <span style={{ color: '#d19a66' }}>0</span>;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 결과 영역 초기화</span><br />
          &nbsp;&nbsp;{'}'}<br />
          &nbsp;&nbsp;Xil_DCacheFlushRange((<span style={{ color: '#e5c07b' }}>UINTPTR</span>)src, DATA_CNT * <span style={{ color: '#d19a66' }}>4</span>);<br />
          &nbsp;&nbsp;Xil_DCacheFlushRange((<span style={{ color: '#e5c07b' }}>UINTPTR</span>)dst, DATA_CNT * <span style={{ color: '#d19a66' }}>4</span>);<br />
          <br />
          &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 3. DMA 전송 시작</span><br />
          &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// &nbsp;&nbsp;S2MM: 가속기 출력 → BRAM dst</span><br />
          &nbsp;&nbsp;XAxiDma_SimpleTransfer(&amp;dma, (<span style={{ color: '#e5c07b' }}>UINTPTR</span>)dst,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;DATA_CNT * <span style={{ color: '#d19a66' }}>4</span>, XAXIDMA_DEVICE_TO_DMA);<br />
          &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// &nbsp;&nbsp;MM2S: BRAM src → 가속기 입력</span><br />
          &nbsp;&nbsp;XAxiDma_SimpleTransfer(&amp;dma, (<span style={{ color: '#e5c07b' }}>UINTPTR</span>)src,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;DATA_CNT * <span style={{ color: '#d19a66' }}>4</span>, XAXIDMA_DMA_TO_DEVICE);<br />
          <br />
          &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 4. 전송 완료 대기 (폴링)</span><br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span> (XAxiDma_Busy(&amp;dma, XAXIDMA_DMA_TO_DEVICE));<br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span> (XAxiDma_Busy(&amp;dma, XAXIDMA_DEVICE_TO_DMA));<br />
          &nbsp;&nbsp;Xil_DCacheInvalidateRange((<span style={{ color: '#e5c07b' }}>UINTPTR</span>)dst, DATA_CNT * <span style={{ color: '#d19a66' }}>4</span>);<br />
          <br />
          &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 5. 결과 검증 및 UART 출력</span><br />
          &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> err = <span style={{ color: '#d19a66' }}>0</span>;<br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>for</span> (<span style={{ color: '#e5c07b' }}>int</span> i = <span style={{ color: '#d19a66' }}>0</span>; i &lt; DATA_CNT; i++)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>if</span> (dst[i] != src[i] + <span style={{ color: '#d19a66' }}>10</span>) err++;<br />
          <br />
          &nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;\r\n[Result: %d words]\r\n&quot;</span>, DATA_CNT);<br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>for</span> (<span style={{ color: '#e5c07b' }}>int</span> i = <span style={{ color: '#d19a66' }}>0</span>; i &lt; <span style={{ color: '#d19a66' }}>8</span>; i++)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;&nbsp;&nbsp;src[%d]=%d -&gt; +10=%d %s\r\n&quot;</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i, src[i], dst[i],<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(dst[i] == src[i]+<span style={{ color: '#d19a66' }}>10</span>) ? <span style={{ color: '#98c379' }}>&quot;OK&quot;</span> : <span style={{ color: '#98c379' }}>&quot;FAIL&quot;</span>);<br />
          &nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;Errors: %d / %d\r\n&quot;</span>, err, DATA_CNT);<br />
          &nbsp;&nbsp;xil_printf(err == <span style={{ color: '#d19a66' }}>0</span> ? <span style={{ color: '#98c379' }}>&quot;PASS!\r\n&quot;</span> : <span style={{ color: '#98c379' }}>&quot;FAIL!\r\n&quot;</span>);<br />
          <br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>return</span> <span style={{ color: '#d19a66' }}>0</span>;<br />
          {'}'}
        </CodeBlock>
      </section>

      {/* Step 4: 빌드 및 테스트 */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Step 4. 빌드 및 보드 구동 테스트</h2>

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
                      <li><code>115200</code> baud, 자동 실행 → src[i]+10 == dst[i] 확인</li>
                      <li><code>PASS!</code> 메시지로 DMA + 가속기 전체 경로 검증 완료</li>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex4_step4_uart.png"
                label="UART 출력 결과"
                desc="DMA 전송 + 가속기 +10 결과 검증 화면"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>UART 터미널 출력 결과</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex4_step4_running.jpg"
                label="보드 구동 사진"
                desc="Arty A7 보드에서 예제 4 실행 상태"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>Arty A7 보드 실행 상태</span>
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
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>스트림 가속기 연동<br />고속 데이터 경로</p>
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
