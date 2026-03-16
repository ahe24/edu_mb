'use client';

import ImagePlaceholder from '../ImagePlaceholder';
import CodeBlock from '../CodeBlock';

export default function Ex3Slides() {
  return (
    <section>
      {/* 예제 3 Overview */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', borderBottom: '3px solid var(--accent)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>예제 3: AXI-Stream FIFO & 커스텀 가속기</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: '2rem' }}>
          <ul className="info-list" style={{ fontSize: '1.3rem' }}>
            <li><strong>배경</strong> <span>대량 데이터 전송 시 AXI-Lite(레지스터 단위)는 오버헤드가 큼</span></li>
            <li><strong>학습 목표</strong> <span>AXI-Stream 프로토콜 이해 및<br />Custom IP 연동 기초 습득</span></li>
            <li><strong>실습 내용</strong> <span>FIFO 루프백 경로에 x2 곱셈 가속기(Custom IP) 삽입</span></li>
            <li><strong>동작 확인</strong> <span>버튼 → 난수 전송 → x2 결과 UART 출력 + AXI-Lite 대비 속도 비교</span></li>
          </ul>

          {/* AXI-Stream 아키텍처 SVG 다이어그램 */}
          <svg viewBox="0 0 460 280" style={{ width: '100%', margin: '0 auto' }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="ex3arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#20b2aa" />
              </marker>
              <marker id="ex3arr2" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#f59e0b" />
              </marker>
              <marker id="ex3arr3" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#3cb371" />
              </marker>
            </defs>

            {/* ── 데이터 흐름 (U자형, 수평 화살표 정렬) ── */}
            {/* 핵심 y좌표: TX 라인 y=55, RX 라인 y=145 */}

            {/* MicroBlaze CPU (통합 박스) */}
            <rect x="8" y="8" width="110" height="180" rx="10" fill="#1e1b2e" stroke="#7c3aed" strokeWidth="2" />
            <text x="63" y="30" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="bold">MicroBlaze</text>
            <text x="63" y="43" textAnchor="middle" fill="#a78bfa" fontSize="8">CPU</text>
            <line x1="18" y1="50" x2="108" y2="50" stroke="#7c3aed" strokeWidth="0.5" strokeOpacity="0.35" />
            <text x="63" y="68" textAnchor="middle" fill="#c4b5fd" fontSize="8">TX: FIFO Write →</text>
            <line x1="18" y1="95" x2="108" y2="95" stroke="#7c3aed" strokeWidth="0.5" strokeOpacity="0.35" />
            <text x="63" y="112" textAnchor="middle" fill="#a78bfa" fontSize="8">검증 + 비교</text>
            <line x1="18" y1="125" x2="108" y2="125" stroke="#7c3aed" strokeWidth="0.5" strokeOpacity="0.35" />
            <text x="63" y="148" textAnchor="middle" fill="#c4b5fd" fontSize="8">← RX: FIFO Read</text>
            <line x1="18" y1="165" x2="108" y2="165" stroke="#7c3aed" strokeWidth="0.5" strokeOpacity="0.35" />
            <text x="63" y="181" textAnchor="middle" fill="#a78bfa" fontSize="8">UART 출력</text>

            {/* Arrow: MB TX → FIFO TX (수평, y=60) */}
            <line x1="118" y1="68" x2="155" y2="68" stroke="#20b2aa" strokeWidth="2" markerEnd="url(#ex3arr)" />
            <text x="136" y="53" textAnchor="middle" fill="#64748b" fontSize="7">AXI-Lite</text>

            {/* FIFO TX (중심 y=60) */}
            <rect x="158" y="48" width="85" height="40" rx="7" fill="#0f172a" stroke="#20b2aa" strokeWidth="1.5" />
            <text x="200" y="66" textAnchor="middle" fill="#5eead4" fontSize="10" fontWeight="bold">FIFO TX</text>
            <text x="200" y="79" textAnchor="middle" fill="#94a3b8" fontSize="7">AXI-Stream</text>

            {/* Arrow: FIFO TX → x2 (수평, y=60) */}
            <line x1="243" y1="68" x2="280" y2="68" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#ex3arr2)" />
            <text x="261" y="53" textAnchor="middle" fill="#92400e" fontSize="7">Stream</text>

            {/* x2 Multiplier (세로로 TX~RX 구간 커버) */}
            <rect x="283" y="38" width="90" height="60" rx="8" fill="#fef9e7" stroke="#f59e0b" strokeWidth="2" />
            <text x="328" y="58" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">x2</text>
            <text x="328" y="68" textAnchor="middle" fill="#92400e" fontSize="9">Multiplier</text>
            <text x="328" y="88" textAnchor="middle" fill="#b45309" fontSize="7">Custom IP</text>

            {/* Arrow: x2 → FIFO RX (아래로) */}
            <line x1="328" y1="98" x2="328" y2="125" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#ex3arr2)" />
            <text x="345" y="123" fill="#92400e" fontSize="7">Stream</text>

            {/* FIFO RX (중심 y=145) */}
            <rect x="283" y="128" width="85" height="40" rx="7" fill="#0f172a" stroke="#20b2aa" strokeWidth="1.5" />
            <text x="325" y="146" textAnchor="middle" fill="#5eead4" fontSize="10" fontWeight="bold">FIFO RX</text>
            <text x="325" y="159" textAnchor="middle" fill="#94a3b8" fontSize="7">AXI-Stream</text>

            {/* Arrow: FIFO RX → MB (수평, y=145) */}
            <line x1="283" y1="145" x2="122" y2="145" stroke="#20b2aa" strokeWidth="2" markerEnd="url(#ex3arr)" />
            <text x="190" y="139" textAnchor="middle" fill="#64748b" fontSize="7">AXI-Lite</text>

            {/* ── 하단: UART + 속도 비교 ── */}

            {/* Arrow: MB → UART */}
            <line x1="63" y1="188" x2="63" y2="205" stroke="#3cb371" strokeWidth="2" markerEnd="url(#ex3arr3)" />

            {/* UART */}
            <rect x="21" y="208" width="84" height="28" rx="6" fill="#e0f7f5" stroke="#3cb371" strokeWidth="1.5" />
            <text x="63" y="226" textAnchor="middle" fill="#166534" fontSize="9" fontWeight="bold">UART 출력</text>

            {/* 속도 비교 박스 */}
            <rect x="150" y="200" width="280" height="55" rx="8" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />
            <text x="290" y="216" textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="bold">속도 비교</text>
            <text x="290" y="230" textAnchor="middle" fill="#b45309" fontSize="8">AXI-Lite: 레지스터 1개씩 읽기/쓰기 (느림)</text>
            <text x="290" y="244" textAnchor="middle" fill="#166534" fontSize="8" fontWeight="bold">AXI-Stream: 연속 버스트 전송 (빠름)</text>
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
                  <span className="step-title">예제 2 기반 시작 + UART 추가</span>
                  <span className="step-desc">기존 Block Design 유지, Board 탭에서 <code>USB UART</code> 드래그 앤 드롭</span>
                </div>
              </li>
              <li>
                <div className="step-icon">2</div>
                <div className="step-content">
                  <span className="step-title">AXI-Stream FIFO 추가 및 설정</span>
                  <span className="step-desc">
                    <ul className="step-list-sub">
                      <li>IP Catalog에서 <code>AXI4-Stream FIFO</code> 검색 및 추가</li>
                      <li>FIFO Depth: 512, TX/RX 모두 활성화, AXI-Lite 제어 활성</li>
                    </ul>
                  </span>
                </div>
              </li>
              <li>
                <div className="step-icon">3</div>
                <div className="step-content">
                  <span className="step-title">Connection Automation</span>
                  <span className="step-desc">AXI-Lite 포트를 MicroBlaze 인터커넥트에 자동 연결</span>
                </div>
              </li>
              <li>
                <div className="step-icon">4</div>
                <div className="step-content">
                  <span className="step-title">HDL Wrapper → Generate Bitstream → Export .xsa</span>
                </div>
              </li>
            </ul>

            <div style={{ marginTop: '1.0rem', padding: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', borderRadius: '2px', fontSize: '0.8rem' }}>
              <p style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>💡</span> AXI-Stream 포트 연결 주의
              </p>
              <p style={{ color: '#475569', lineHeight: '1.4', margin: 0 }}>
                FIFO의 TX/RX 스트림 포트는 서로 직접 연결하지 않음. Step 2에서 Custom IP를 중간에 삽입.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex3_step1_initial.png"
                label="IP 추가 상태"
                desc="FIFO + UART 추가된 블록 디자인"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>FIFO + UART IP 추가 상태</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex3_step1_automation.png"
                label="자동 연결 완료"
                desc="Connection Automation 후 완성된 블록 디자인"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>Connection Automation 완료</span>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Custom IP (x2 Multiplier) */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Step 2. Custom IP — x2 곱셈기 생성 및 연결</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '3rem' }}>
          <div>
            <ul className="step-list">
              <li>
                <div className="step-icon">1</div>
                <div className="step-content">
                  <span className="step-title">Create & Package New IP</span>
                  <span className="step-desc"><code>Tools</code> → <code>Create and Package New IP</code> → AXI4 peripheral 선택</span>
                </div>
              </li>
              <li>
                <div className="step-icon">2</div>
                <div className="step-content">
                  <span className="step-title">인터페이스 설정</span>
                  <span className="step-desc">Name: <code>axis_x2_multiplier</code>, AXI4-Stream (Slave + Master), AXI-Lite 체크 해제</span>
                </div>
              </li>
              <li>
                <div className="step-icon">3</div>
                <div className="step-content">
                  <span className="step-title">Verilog 핵심 로직 추가 → Package IP</span>
                  <span className="step-desc">템플릿에 로직 1줄 추가 후 <code>Re-Package IP</code> 클릭</span>
                </div>
              </li>
              <li>
                <div className="step-icon">4</div>
                <div className="step-content">
                  <span className="step-title">Block Design에 추가 및 연결</span>
                  <span className="step-desc">
                    <ul className="step-list-sub">
                      <li>FIFO의 AXI-Stream TX → x2 Multiplier의 <code>S_AXIS</code></li>
                      <li>x2 Multiplier의 <code>M_AXIS</code> → FIFO의 AXI-Stream RX</li>
                    </ul>
                  </span>
                </div>
              </li>
            </ul>

            <div style={{ marginTop: '0.8rem', padding: '0.8rem', backgroundColor: '#282c34', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              <p style={{ color: '#5c6370', fontSize: '0.75rem', marginBottom: '0.4rem', fontStyle: 'italic', fontFamily: "'JetBrains Mono', 'D2Coding', 'Consolas', monospace" }}>// Verilog — x2 곱셈기 핵심 로직 (<code style={{ color: '#d19a66' }}>&lt;&lt; 1</code> = 배선만으로 x2, FPGA 리소스 소모 없음)</p>
              <p style={{ color: '#abb2bf', fontSize: '0.85rem', lineHeight: '1.5', margin: 0, fontFamily: "'JetBrains Mono', 'D2Coding', 'Consolas', monospace" }}>
                <span style={{ color: '#c678dd' }}>assign</span> m_axis_tdata &nbsp;= s_axis_tdata <span style={{ color: '#d19a66' }}>&lt;&lt; 1</span>; <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// x2</span><br />
                <span style={{ color: '#c678dd' }}>assign</span> m_axis_tvalid = s_axis_tvalid;<br />
                <span style={{ color: '#c678dd' }}>assign</span> s_axis_tready = m_axis_tready;<br />
                <span style={{ color: '#c678dd' }}>assign</span> m_axis_tlast &nbsp;= s_axis_tlast;
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex3_step2_create_ip.png"
                label="Custom IP 생성"
                desc="Create and Package New IP 마법사 화면"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>Custom IP 생성 마법사</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex3_step2_connected.png"
                label="최종 블록 디자인"
                desc="FIFO TX → x2 Multiplier → FIFO RX 연결 완료"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>FIFO TX → x2 → FIFO RX 연결 완료</span>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Vitis C 코드 */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '0.8rem' }}>Step 3. AXI-Stream FIFO 제어 코드 (C)</h2>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1rem' }}>FIFO를 통해 난수를 전송하고, x2 곱셈 결과를 수신하여 UART로 출력. AXI-Lite 방식과 속도 비교</p>

        <CodeBlock style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '16px', borderRadius: '8px', fontSize: '16px', lineHeight: '1.35', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', maxHeight: '460px' }}>
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;xparameters.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;xllfifo.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;xgpio.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&quot;xtmrctr.h&quot;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&lt;stdio.h&gt;</span><br />
          <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>&lt;stdlib.h&gt;</span><br />
          <br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>FIFO_DEV_ID</span>&nbsp;&nbsp;&nbsp;XPAR_AXI_FIFO_0_DEVICE_ID<br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>BTN_DEV_ID</span>&nbsp;&nbsp;&nbsp;&nbsp;XPAR_GPIO_2_DEVICE_ID<br />
          <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#d19a66' }}>WORD_CNT</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>256</span> &nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 전송 데이터 수</span><br />
          <br />
          <span style={{ color: '#e5c07b' }}>XLlFifo</span> fifo;&nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>XGpio</span> btn_gpio;&nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>XTmrCtr</span> timer;<br />
          <br />
          <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// AXI-Lite 방식 (CPU가 직접 연산, 느림)</span><br />
          <span style={{ color: '#e5c07b' }}>u32</span> <span style={{ color: '#61afef' }}>test_axilite</span>(<span style={{ color: '#e5c07b' }}>u32</span> *src, <span style={{ color: '#e5c07b' }}>u32</span> *dst, <span style={{ color: '#e5c07b' }}>int</span> cnt) {'{'}<br />
          &nbsp;&nbsp;XTmrCtr_Reset(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>);<br />
          &nbsp;&nbsp;XTmrCtr_Start(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>);<br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>for</span> (<span style={{ color: '#e5c07b' }}>int</span> i = <span style={{ color: '#d19a66' }}>0</span>; i &lt; cnt; i++)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;dst[i] = src[i] * <span style={{ color: '#d19a66' }}>2</span>;&nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// CPU 직접 연산</span><br />
          &nbsp;&nbsp;XTmrCtr_Stop(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>);<br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>return</span> XTmrCtr_GetValue(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>);<br />
          {'}'}<br />
          <br />
          <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// AXI-Stream 방식 (FIFO 버스트 전송, 빠름)</span><br />
          <span style={{ color: '#e5c07b' }}>u32</span> <span style={{ color: '#61afef' }}>test_axistream</span>(<span style={{ color: '#e5c07b' }}>u32</span> *src, <span style={{ color: '#e5c07b' }}>u32</span> *dst, <span style={{ color: '#e5c07b' }}>int</span> cnt) {'{'}<br />
          &nbsp;&nbsp;XTmrCtr_Reset(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>);<br />
          &nbsp;&nbsp;XTmrCtr_Start(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>);<br />
          &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// TX: FIFO에 데이터 연속 삽입</span><br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>for</span> (<span style={{ color: '#e5c07b' }}>int</span> i = <span style={{ color: '#d19a66' }}>0</span>; i &lt; cnt; i++)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;XLlFifo_TxPutWord(&amp;fifo, src[i]);<br />
          &nbsp;&nbsp;XLlFifo_iTxSetLen(&amp;fifo, cnt * <span style={{ color: '#d19a66' }}>4</span>);<br />
          &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// RX: x2 결과 수신 대기</span><br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span> (!XLlFifo_iRxOccupancy(&amp;fifo));<br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>for</span> (<span style={{ color: '#e5c07b' }}>int</span> i = <span style={{ color: '#d19a66' }}>0</span>; i &lt; cnt; i++)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;dst[i] = XLlFifo_RxGetWord(&amp;fifo);<br />
          &nbsp;&nbsp;XTmrCtr_Stop(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>);<br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>return</span> XTmrCtr_GetValue(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>);<br />
          {'}'}<br />
          <br />
          <span style={{ color: '#e5c07b' }}>int</span> <span style={{ color: '#61afef' }}>main</span>() {'{'}<br />
          &nbsp;&nbsp;XLlFifo_Initialize(&amp;fifo, FIFO_DEV_ID);<br />
          &nbsp;&nbsp;XGpio_Initialize(&amp;btn_gpio, BTN_DEV_ID);<br />
          &nbsp;&nbsp;XGpio_SetDataDirection(&amp;btn_gpio, <span style={{ color: '#d19a66' }}>1</span>, <span style={{ color: '#d19a66' }}>0xF</span>);<br />
          &nbsp;&nbsp;XTmrCtr_Initialize(&amp;timer, XPAR_AXI_TIMER_0_DEVICE_ID);<br />
          <br />
          &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>u32</span> src[WORD_CNT], dst_lite[WORD_CNT], dst_stream[WORD_CNT];<br />
          &nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;=== Ex3: AXI-Stream x2 Demo ===\r\n&quot;</span>);<br />
          &nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;Press BTN0 to start...\r\n&quot;</span>);<br />
          <br />
          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span> (<span style={{ color: '#d19a66' }}>1</span>) {'{'}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>if</span> (XGpio_DiscreteRead(&amp;btn_gpio, <span style={{ color: '#d19a66' }}>1</span>) &amp; <span style={{ color: '#d19a66' }}>0x1</span>) {'{'}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;srand(XTmrCtr_GetValue(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>));<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>for</span> (<span style={{ color: '#e5c07b' }}>int</span> i = <span style={{ color: '#d19a66' }}>0</span>; i &lt; WORD_CNT; i++)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;src[i] = rand() % <span style={{ color: '#d19a66' }}>1000</span>;<br />
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>u32</span> t_lite &nbsp;&nbsp;= test_axilite(src, dst_lite, WORD_CNT);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>u32</span> t_stream = test_axistream(src, dst_stream, WORD_CNT);<br />
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 결과 출력</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;\r\n[%d words]\r\n&quot;</span>, WORD_CNT);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>for</span> (<span style={{ color: '#e5c07b' }}>int</span> i = <span style={{ color: '#d19a66' }}>0</span>; i &lt; <span style={{ color: '#d19a66' }}>8</span>; i++)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;&nbsp;&nbsp;src[%d]=%d -&gt; x2=%d\r\n&quot;</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i, src[i], dst_stream[i]);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;AXI-Lite &nbsp;: %d cycles\r\n&quot;</span>, t_lite);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xil_printf(<span style={{ color: '#98c379' }}>&quot;AXI-Stream: %d cycles\r\n&quot;</span>, t_stream);<br />
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span> (XGpio_DiscreteRead(&amp;btn_gpio, <span style={{ color: '#d19a66' }}>1</span>) &amp; <span style={{ color: '#d19a66' }}>0x1</span>); <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 디바운스</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
          &nbsp;&nbsp;{'}'}<br />
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
                  <span className="step-title">Platform 업데이트</span>
                  <span className="step-desc">예제 3 <code>.xsa</code> 파일로 Platform 새로 생성 또는 업데이트 후 빌드</span>
                </div>
              </li>
              <li>
                <div className="step-icon">2</div>
                <div className="step-content">
                  <span className="step-title">Application 생성</span>
                  <span className="step-desc">
                    <ul className="step-list-sub">
                      <li>Empty Application(C) 또는 Hello World 템플릿 선택</li>
                      <li><code>src/main.c</code>에 위 코드 작성</li>
                    </ul>
                  </span>
                </div>
              </li>
              <li>
                <div className="step-icon">3</div>
                <div className="step-content">
                  <span className="step-title">Build → Program Device → Launch</span>
                  <span className="step-desc">Bitstream 다운로드 후 MicroBlaze에 ELF 로딩</span>
                </div>
              </li>
              <li>
                <div className="step-icon">4</div>
                <div className="step-content">
                  <span className="step-title">UART 터미널 확인 및 결과 검증</span>
                  <span className="step-desc">
                    <ul className="step-list-sub">
                      <li><code>115200</code> baud 설정, BTN0 누르면 난수 x2 결과 출력</li>
                      <li><code>dst_stream[i] == src[i]*2</code> 확인 + AXI-Stream 속도 우위 확인</li>
                    </ul>
                  </span>
                </div>
              </li>
            </ul>

            <div style={{ marginTop: '1.0rem', padding: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', borderRadius: '2px', fontSize: '0.8rem' }}>
              <p style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>💡</span> 속도 차이 실험
              </p>
              <p style={{ color: '#475569', lineHeight: '1.4', margin: 0 }}>
                <code>WORD_CNT</code>를 64, 256, 1024로 변경해보면 AXI-Stream의 속도 이점이 더 극적으로 나타남
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex3_step4_uart.png"
                label="UART 출력 결과"
                desc="난수 x2 결과 + AXI-Lite vs AXI-Stream 속도 비교"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>UART 터미널 출력 결과</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
              <ImagePlaceholder
                src="/images/ex3_step4_running.jpg"
                label="보드 구동 사진"
                desc="Arty A7 보드에서 예제 3 실행 상태"
                maxHeight="240px"
              />
              <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>Arty A7 보드 실행 상태</span>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
