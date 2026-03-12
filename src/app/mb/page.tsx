'use client';

import RevealWrapper from '@/components/RevealWrapper';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import WorkflowDiagram from '@/components/mb/WorkflowDiagram';

export default function MicroBlazeSlides() {
  return (
    <RevealWrapper>
      {/* Slide 1: 타이틀 */}
      <section data-background-color="var(--slide-bg)">
        <h1 style={{ color: 'var(--primary)', fontSize: '3.5rem', fontWeight: 'normal' }}>MicroBlaze 실습 교육</h1>
        <h3 style={{ color: 'var(--text-main)', fontSize: '2rem', marginTop: '1rem' }}>하드웨어 설계 & 소프트웨어 제어 연동</h3>
        <p style={{ marginTop: '3rem', fontSize: '1.2rem', color: 'gray' }}>
          Arty A7 보드 기반 Step-by-Step 가이드
        </p>
      </section>

      {/* Slide 2: 교육 목표 및 개요 */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', borderBottom: '3px solid var(--accent)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>교육 개요</h2>
        <ul className="info-list" style={{ fontSize: '1.8rem' }}>
          <li><strong>과정 목표</strong> <span>초보자 맞춤형 하드웨어 설계 & 소프트웨어 제어 체감</span></li>
          <li><strong>교육 방식</strong> <span>이론 최소화, '성공 경험' 초점의 4단계 가이드</span></li>
          <li><strong>타겟 보드</strong> <span>Arty A7</span></li>
          <li><strong>핵심 소자</strong> <span>MicroBlaze 소프트 프로세서, Custom Logic</span></li>
        </ul>
      </section>

      {/* Slide 3: 커리큘럼 요약 */}
      <section data-background-color="var(--slide-bg)">
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', marginBottom: '2rem' }}>교육 커리큘럼 (4단계)</h2>
        <table style={{ width: '100%', fontSize: '1.4rem', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <th style={{ padding: '15px', border: '1px solid #ddd' }}>단계</th>
              <th style={{ padding: '15px', border: '1px solid #ddd' }}>제목</th>
              <th style={{ padding: '15px', border: '1px solid #ddd' }}>핵심 키워드</th>
              <th style={{ padding: '15px', border: '1px solid #ddd' }}>학습 경험</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'center' }}>1</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>MicroBlaze</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>AXI-GPIO</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>CPU 탑재 및 단순 On/Off 제어</td>
            </tr>
            <tr style={{ backgroundColor: 'rgba(32, 178, 170, 0.1)' }}>
              <td style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'center' }}>2</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>Interrupt 제어</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>Interrupt Controller</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>하드웨어 이벤트 실시간 반응</td>
            </tr>
            <tr>
              <td style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'center' }}>3</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>데이터 스트림 처리</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>AXI-Stream / FIFO</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>주소 없는 고속 데이터 제어</td>
            </tr>
            <tr style={{ backgroundColor: 'rgba(32, 178, 170, 0.1)' }}>
              <td style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'center' }}>4</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>메모리 직접 접근(DMA)</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>DDR3 / AXI DMA</td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>대용량 데이터 전송 및 외부 메모리 활용</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Slide 3.5: 워크플로우 다이어그램 */}
      <WorkflowDiagram />

      {/* Slide 4: 예제 1 (Vertical Slides) */}
      <section>
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', borderBottom: '3px solid var(--accent)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>예제 1: MicroBlaze & GPIO 제어</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <ul className="info-list" style={{ fontSize: '1.5rem' }}>
              <li><strong>학습 목표</strong> <span>Vivado Block Design 흐름 및 Vitis C 코딩 기초 습득</span></li>
              <li><strong>실습 내용</strong> <span>MicroBlaze 최소 시스템 구성</span></li>
              <li><strong>동작 확인</strong> <span>보드의 LED와 Switch를 AXI GPIO IP로 제어</span></li>
            </ul>

            <ImagePlaceholder
              src="/images/ex1_block_design.png"
              label="예제 1 완성 화면"
              desc="Vivado Block Design 캡쳐 이미지 (MicroBlaze + AXI GPIO)"
            />
          </div>
          <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '1.2rem', color: '#64748b' }}>⬇️ 아래 방향키(↓)를 눌러 실습 단계 확인</p>
        </section>

        {/* Ex1 - Step 1 */}
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Step 1. Vivado 프로젝트 및 MicroBlaze 생성</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '3rem' }}>
            <div>
              <ul className="step-list">
                <li>
                  <div className="step-icon">1</div>
                  <div className="step-content">
                    <span className="step-title">Create Project</span>
                    <span className="step-desc">Arty A7-35T(또는 100T) 보드 선택</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">2</div>
                  <div className="step-content">
                    <span className="step-title">Create Block Design</span>
                    <span className="step-desc">빈 캔버스 생성</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">3</div>
                  <div className="step-content">
                    <span className="step-title">Board 컴포넌트 연동</span>
                    <span className="step-desc">좌측 Board 탭에서 <code>System Clock</code>과 <code>System Reset</code>을 캔버스로 드래그 앤 드롭</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">4</div>
                  <div className="step-content">
                    <span className="step-title">Add IP</span>
                    <span className="step-desc"><code style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#0f172a' }}>MicroBlaze</code> 검색 및 추가</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">5</div>
                  <div className="step-content">
                    <span className="step-title">Run Block Automation</span>
                    <span className="step-desc">
                      <ul className="step-list-sub">
                        <li>자동 연결로 Clock/Reset 극성 문제 자동 해결!</li>
                        <li><span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Local Memory:</span> 32KB 또는 64KB 설정</li>
                        <li><span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Debug Module:</span> Debug Only 포맷 유지</li>
                      </ul>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                <ImagePlaceholder
                  src="/images/ex1_step1_initial.png"
                  label="기본 컴포넌트 삽입 상태"
                  desc="Clock, Reset, MicroBlaze가 추가된 초기 상태"
                />
                <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>기본 컴포넌트 삽입</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                <ImagePlaceholder
                  src="/images/ex1_step1_automation.png"
                  label="자동 연결 (Automation) 완료"
                  desc="Block Automation 실행으로 자동 연결된 상태"
                />
                <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>자동 연결(Automation) 후</span>
              </div>
            </div>
          </div>
        </section>

        {/* Ex1 - Step 2 */}
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Step 2. AXI GPIO 추가 및 보드 연동</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '3rem' }}>
            <div>
              <ul className="step-list">
                <li>
                  <div className="step-icon">1</div>
                  <div className="step-content">
                    <span className="step-title">Board 탭 활용</span>
                    <span className="step-desc">Vivado 좌측 Board 탭 열기</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">2</div>
                  <div className="step-content">
                    <span className="step-title">LED 추가</span>
                    <span className="step-desc"><code>4 LEDs</code> 를 캔버스로 드래그 앤 드롭 (AXI GPIO 자동 생성)</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">3</div>
                  <div className="step-content">
                    <span className="step-title">Switch 추가</span>
                    <span className="step-desc"><code>4 Switches</code> 를 동일하게 드래그 앤 드롭</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">4</div>
                  <div className="step-content">
                    <span className="step-title">Run Connection Automation</span>
                    <span className="step-desc">MicroBlaze와 GPIO 간의 AXI Interconnect 통신 자동 연결 확인</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">5</div>
                  <div className="step-content">
                    <span className="step-title">Create HDL Wrapper</span>
                    <span className="step-desc">Sources 탭에서 Block Design 우클릭 ➔ <code>Create HDL Wrapper</code> 실행 (Let Vivado manage)</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">6</div>
                  <div className="step-content">
                    <span className="step-title">Generate Bitstream</span>
                    <span className="step-desc">컴파일 완료 후 <code>File &gt; Export Hardware</code> (Include bitstream 체크, XSA 추출)</span>
                  </div>
                </li>
              </ul>
              <div style={{ marginTop: '1.0rem', padding: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', borderRadius: '2px', fontSize: '0.8rem' }}>
                <p style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>💡</span> Constraint(XDC) 자동화 알림
                </p>
                <p style={{ color: '#475569', lineHeight: '1.4', margin: 0 }}>
                  <b>Board 탭</b>을 통해 요소를 추가했기 때문에 핀 번호와 전압(IOSTANDARD) 등 물리적 제약 조건이 <u>자동 할당</u>됨. <br />(별도의 <code>.xdc</code> 파일 작성 <b>필요 없음</b>)
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                <ImagePlaceholder
                  src="/images/ex1_step2_initial.png"
                  label="GPIO 소자 추가 상태"
                  desc="Board 탭에서 LED와 Switch를 드래그 앤 드롭한 직후"
                />
                <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>GPIO 요소를 캔버스에 드롭</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                <ImagePlaceholder
                  src="/images/ex1_step2_automation.png"
                  label="자동 연결 완료"
                  desc="Run Connection Automation 실행 후 자동 배선된 상태"
                />
                <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>자동 연결(Automation) 후</span>
              </div>
            </div>
          </div>
        </section>

        {/* Ex1 - Step 3-1 (Vitis Setup) */}
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Step 3-1. Vitis IDE 프로젝트 환경 세팅</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '3rem' }}>
            <div>
              <ul className="step-list">
                <li>
                  <div className="step-icon">1</div>
                  <div className="step-content">
                    <span className="step-title">Launch Vitis IDE</span>
                    <span className="step-desc">Vivado 상단 메뉴에서 <code>Tools &gt; Launch Vitis IDE</code> 실행 (지정된 Workspace 폴더 사용)</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">2</div>
                  <div className="step-content">
                    <span className="step-title">Create Platform Project</span>
                    <span className="step-desc">
                      <ul className="step-list-sub">
                        <li><code>Create Platform Project</code> 클릭</li>
                        <li>이전 단계에서 추출한 <b><code>.xsa</code> 하드웨어 명세 파일</b>을 찾아(Browse) 로드</li>
                        <li>플랫폼 빌드(Build) 진행하여 하드웨어 종속 라이브러리(BSP) 생성</li>
                      </ul>
                    </span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">3</div>
                  <div className="step-content">
                    <span className="step-title">Create Application Project</span>
                    <span className="step-desc">
                      <ul className="step-list-sub">
                        <li><code>Create Application Project</code> 클릭</li>
                        <li>방금 생성한 Platform을 타겟으로 선택</li>
                        <li>반드시 <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Empty Application(C)</span> 템플릿 선택<br /><span style={{ fontSize: '0.9rem', color: '#64748b' }}>(* UART IP가 없으므로 <code>Hello World</code> 템플릿은 빌드 에러 발생)</span></li>
                      </ul>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                <ImagePlaceholder
                  src="/images/ex1_step3_platform.png"
                  label="Platform Project 생성"
                  desc="Vitis에서 .xsa 명세서를 로드하는 화면"
                  maxHeight="240px"
                />
                <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>Platform 생성 (.xsa 로드)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                <ImagePlaceholder
                  src="/images/ex1_step3_app.png"
                  label="Application Project 생성"
                  desc="C 코드 작성을 위한 프로젝트 생성 완료 화면"
                  maxHeight="240px"
                />
                <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>Application 생성 (C 코드용)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Ex1 - Step 3-2 (C code) */}
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Step 3-2. Vitis 소프트웨어 제어 코드 (C)</h2>
          <p style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '1rem' }}>Application Project 안의 <code>src/main.c</code> 파일을 열거나 새로 생성하고, 아래 코드 작성</p>
          <div className="code-block" style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '1.5rem', borderRadius: '8px', fontSize: '1.2rem', overflowX: 'auto', lineHeight: '1.4', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xparameters.h"</span><br />
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xgpio.h"</span><br />
            <br />
            <span style={{ color: '#e5c07b' }}>int</span> <span style={{ color: '#61afef' }}>main</span>() {'{'}<br />
            &nbsp;&nbsp;XGpio gpio_device;<br />
            <br />
            &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 단일 GPIO IP(axi_gpio_0)에 2개 채널(LED, Switch)이 통합된 경우</span><br />
            &nbsp;&nbsp;XGpio_Initialize(&amp;gpio_device, XPAR_GPIO_0_DEVICE_ID);<br />
            <br />
            &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 방향 설정 (Channel 1: LED=출력:0, Channel 2: Switch=입력:1)</span><br />
            &nbsp;&nbsp;XGpio_SetDataDirection(&amp;gpio_device, <span style={{ color: '#d19a66' }}>1</span>, <span style={{ color: '#d19a66' }}>0x0</span>);<br />
            &nbsp;&nbsp;XGpio_SetDataDirection(&amp;gpio_device, <span style={{ color: '#d19a66' }}>2</span>, <span style={{ color: '#d19a66' }}>0xF</span>);<br />
            <br />
            &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span>(<span style={{ color: '#d19a66' }}>1</span>) {'{'}<br />
            &nbsp;&nbsp;&nbsp;&nbsp;int sw_data = XGpio_DiscreteRead(&amp;gpio_device, <span style={{ color: '#d19a66' }}>2</span>);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;XGpio_DiscreteWrite(&amp;gpio_device, <span style={{ color: '#d19a66' }}>1</span>, sw_data);<br />
            &nbsp;&nbsp;{'}'}<br />
            &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>return</span> <span style={{ color: '#d19a66' }}>0</span>;<br />
            {'}'}
          </div>
        </section>

        {/* Ex1 - Step 4 */}
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Step 4. 빌드 및 보드 구동 테스트</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '3rem' }}>
            <div>
              <ul className="step-list">
                <li>
                  <div className="step-icon">1</div>
                  <div className="step-content">
                    <span className="step-title">Build Project</span>
                    <span className="step-desc">Application Project 컴파일 (C 코드 빌드)</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">2</div>
                  <div className="step-content">
                    <span className="step-title">Program Device</span>
                    <span className="step-desc">하드웨어 <code>Bitstream (.bit)</code> Arty A7에 다운로드</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">3</div>
                  <div className="step-content">
                    <span className="step-title">Launch Hardware</span>
                    <span className="step-desc">소프트웨어 <code>Program (.elf)</code> MicroBlaze에 로딩 및 실행</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">4</div>
                  <div className="step-content">
                    <span className="step-title">동작 확인</span>
                    <span className="step-desc">물리적 Arty A7 보드에서 4개의 스위치 조작 시 LED가 연동되어 실시간 점등되는지 테스트 완료 🎉</span>
                  </div>
                </li>
              </ul>
            </div>
            <ImagePlaceholder
              src="/images/ex1_step4_running.jpg"
              label="보드 테스트 결과"
              desc="Arty A7 보드 구동 사진 또는 Vitis 실행 콘솔창"
            />
          </div>
        </section>

        {/* Ex1 - Additional Code (Application) */}
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.2rem' }}>응용 실습: 패턴 테이블 활용 제어 </h2>
          <p style={{ fontSize: '1.2rem', color: '#445569', marginBottom: '0.8rem' }}>LUT(Look-Up Table) 배열을 활용하여 스위치 입력값(0~15)에 매칭되는 다양한 LED 패턴 출력</p>
          <div className="code-block" style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '1.2rem', borderRadius: '8px', fontSize: '1.05rem', overflowX: 'auto', lineHeight: '1.3', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', maxHeight: '70vh' }}>
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xparameters.h"</span><br />
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xgpio.h"</span><br />
            <br />
            <span style={{ color: '#e5c07b' }}>int</span> <span style={{ color: '#61afef' }}>main</span>() {'{'}<br />
            &nbsp;&nbsp;XGpio gpio_device;<br />
            &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 16가지 스위치 입력에 따른 4bit LED 출력 패턴 정의</span><br />
            &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> led_patterns[<span style={{ color: '#d19a66' }}>16</span>] = {'{'}<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>0x0</span>, <span style={{ color: '#d19a66' }}>0xF</span>, <span style={{ color: '#d19a66' }}>0xA</span>, <span style={{ color: '#d19a66' }}>0x5</span>, <span style={{ color: '#d19a66' }}>0x9</span>, <span style={{ color: '#d19a66' }}>0x6</span>, <span style={{ color: '#d19a66' }}>0xC</span>, <span style={{ color: '#d19a66' }}>0x3</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#d19a66' }}>0x1</span>, <span style={{ color: '#d19a66' }}>0x2</span>, <span style={{ color: '#d19a66' }}>0x4</span>, <span style={{ color: '#d19a66' }}>0x8</span>, <span style={{ color: '#d19a66' }}>0xE</span>, <span style={{ color: '#d19a66' }}>0xD</span>, <span style={{ color: '#d19a66' }}>0xB</span>, <span style={{ color: '#d19a66' }}>0x7</span><br />
            &nbsp;&nbsp;{'}'};<br />
            <br />
            &nbsp;&nbsp;XGpio_Initialize(&amp;gpio_device, XPAR_GPIO_0_DEVICE_ID);<br />
            &nbsp;&nbsp;XGpio_SetDataDirection(&amp;gpio_device, <span style={{ color: '#d19a66' }}>1</span>, <span style={{ color: '#d19a66' }}>0x0</span>);<br />
            &nbsp;&nbsp;XGpio_SetDataDirection(&amp;gpio_device, <span style={{ color: '#d19a66' }}>2</span>, <span style={{ color: '#d19a66' }}>0xF</span>);<br />
            <br />
            &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span>(<span style={{ color: '#d19a66' }}>1</span>) {'{'}<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> sw_data = XGpio_DiscreteRead(&amp;gpio_device, <span style={{ color: '#d19a66' }}>2</span>);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 스위치 값(0~15) 마스킹 후 패턴 테이블 참조</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> led_data = led_patterns[sw_data &amp; <span style={{ color: '#d19a66' }}>0xF</span>];<br />
            &nbsp;&nbsp;&nbsp;&nbsp;XGpio_DiscreteWrite(&amp;gpio_device, <span style={{ color: '#d19a66' }}>1</span>, led_data);<br />
            &nbsp;&nbsp;{'}'}<br />
            &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>return</span> <span style={{ color: '#d19a66' }}>0</span>;<br />
            {'}'}
          </div>
        </section>
      </section>

      {/* Slide 5: 예제 2 */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', borderBottom: '3px solid var(--accent)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>예제 2: 타이머 인터럽트를 활용한 RGB LED 제어</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <ul className="info-list" style={{ fontSize: '1.5rem' }}>
            <li><strong>학습 목표</strong> <span>하드웨어 인터럽트 개념 이해 및 다중 IP 연동</span></li>
            <li><strong>실습 내용</strong> <span>AXI Timer + Interrupt Controller 추가</span></li>
            <li><strong>동작 확인</strong> <span>주기적으로 RGB LED 색상 자동 변경</span></li>
          </ul>

          <ImagePlaceholder
            src="/images/ex2_interrupt_block.png"
            label="예제 2 이미지 대기중"
            desc="Interrupt Controller와 CPU 연결 구조 블록도 혹은 Vitis(SDK) 인터럽트 핸들러 코드 조각"
          />
        </div>
      </section>

      {/* Slide 6: 예제 3 */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', borderBottom: '3px solid var(--accent)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>예제 3: AXI-Stream & FIFO 실습</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <ul className="info-list" style={{ fontSize: '1.3rem' }}>
            <li><strong>배경</strong> <span>대량의 데이터 전송 시 AXI-Lite(레지스터 단위)는 속도 한계 발생</span></li>
            <li><strong>학습 목표</strong> <span>주소 없는 데이터 스트림 개념 및 버퍼링(FIFO) 필요성 인지</span></li>
            <li><strong>실습 내용</strong> <span>루프백(Loopback) 시스템 구축</span></li>
            <li><strong>동작 확인</strong> <span>보드 버튼 클릭 시 대량의 난수 생성 → 버퍼 전송 → UART 결과 출력</span></li>
          </ul>

          <ImagePlaceholder
            src="/images/ex3_axis_loopback.png"
            label="예제 3 이미지 대기중"
            desc="AXI-Stream FIFO 데이터 루프백 연결 개념도 또는 UART 터미널 출력 결과창"
          />
        </div>
      </section>

      {/* Slide 7: 예제 4 */}
      <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', borderBottom: '3px solid var(--accent)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>예제 4: 외부 메모리(DDR3)와 DMA 연동</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <ul className="info-list" style={{ fontSize: '1.3rem' }}>
            <li><strong>배경</strong> <span>고성능 SoC 필수 요소인 DMA(Direct Memory Access) 적용</span></li>
            <li><strong>학습 목표</strong> <span>CPU 점유율 절감 및 외부 메모리 맵 활용 능력 숙지</span></li>
            <li><strong>실습 내용</strong> <span>Arty A7 내장 256MB DDR3L 메모리 + 컨트롤러(MIG IP) 연동</span></li>
            <li><strong>동작 원리</strong> <span>MicroBlaze → 메모리 기록 → AXI DMA 스캔 → 시스템 메모리 재기록</span></li>
          </ul>

          <ImagePlaceholder
            src="/images/ex4_dma_architecture.png"
            label="예제 4 이미지 대기중"
            desc="A7 보드의 MIG IP 연동 화면 또는 전체 DMA 아키텍처 다이어그램"
          />
        </div>
      </section>
    </RevealWrapper>
  );
}
