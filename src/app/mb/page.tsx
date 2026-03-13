'use client';

import { useState } from 'react';

import RevealWrapper from '@/components/RevealWrapper';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import WorkflowDiagram from '@/components/mb/WorkflowDiagram';
import CodeBlock from '@/components/CodeBlock';

export default function MicroBlazeSlides() {
  const [swState, setSwState] = useState([true, false, true, false]);

  const toggleSwitch = (i: number) => {
    const next = [...swState];
    next[i] = !next[i];
    setSwState(next);
  };

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
      <section data-background-color="var(--slide-bg)">
        {/* Header */}
        <div className="curriculum-anim" style={{ animationDelay: '0.05s', marginBottom: '0.4rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(32,178,170,0.12)', border: '1px solid rgba(32,178,170,0.35)',
            borderRadius: '999px', padding: '3px 14px',
            fontSize: '0.85rem', color: 'var(--primary)', letterSpacing: '0.08em', fontWeight: 700,
          }}>● COURSE OVERVIEW</span>
        </div>
        <h2 className="curriculum-anim" style={{
          animationDelay: '0.15s',
          color: 'var(--primary-dark)', fontSize: '2.4rem', fontWeight: 800,
          letterSpacing: '-0.03em', marginBottom: '1.4rem',
        }}>교육 개요</h2>

        {/* 2x2 Info Card Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            {
              delay: '0.3s', color: '#20b2aa',
              label: '과정 목표',
              value: '초보자 맞춤형 하드웨어 설계 & 소프트웨어 제어 체감',
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="12" stroke="#20b2aa" strokeWidth="1.5" fill="rgba(32,178,170,0.1)" />
                  <circle cx="16" cy="16" r="5" fill="#20b2aa" fillOpacity="0.4" />
                  <circle cx="16" cy="16" r="2" fill="#20b2aa" />
                  <path d="M16 4v4M16 24v4M4 16h4M24 16h4" stroke="#20b2aa" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              delay: '0.45s', color: '#3cb371',
              label: '교육 방식',
              value: "이론 최소화, '성공 경험' 초점의 4단계 가이드",
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="6" width="24" height="20" rx="3" stroke="#3cb371" strokeWidth="1.5" fill="rgba(60,179,113,0.1)" />
                  <path d="M10 13h12M10 17h8M10 21h5" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="10" y="4" width="4" height="4" rx="1" fill="#3cb371" />
                  <rect x="18" y="4" width="4" height="4" rx="1" fill="#3cb371" />
                </svg>
              ),
            },
            {
              delay: '0.6s', color: '#20b2aa',
              label: '타겟 보드',
              value: 'Arty A7 (Artix-7 FPGA)',
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="8" width="24" height="16" rx="2" stroke="#20b2aa" strokeWidth="1.5" fill="rgba(32,178,170,0.1)" />
                  <rect x="9" y="12" width="6" height="8" rx="1" fill="#20b2aa" fillOpacity="0.5" />
                  <rect x="17" y="12" width="2" height="2" rx="0.5" fill="#20b2aa" />
                  <rect x="21" y="12" width="2" height="2" rx="0.5" fill="#20b2aa" />
                  <rect x="17" y="16" width="6" height="2" rx="0.5" fill="#20b2aa" fillOpacity="0.5" />
                  <line x1="8" y1="8" x2="8" y2="5" stroke="#20b2aa" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="13" y1="8" x2="13" y2="5" stroke="#20b2aa" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="18" y1="8" x2="18" y2="5" stroke="#20b2aa" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="23" y1="8" x2="23" y2="5" stroke="#20b2aa" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              delay: '0.75s', color: '#3cb371',
              label: '핵심 소자',
              value: 'MicroBlaze 소프트 프로세서 + Custom Logic',
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="8" y="8" width="16" height="16" rx="2" stroke="#3cb371" strokeWidth="1.5" fill="rgba(60,179,113,0.1)" />
                  <rect x="12" y="12" width="8" height="8" rx="1" fill="#3cb371" fillOpacity="0.4" />
                  <line x1="4" y1="12" x2="8" y2="12" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="4" y1="16" x2="8" y2="16" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="4" y1="20" x2="8" y2="20" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="24" y1="12" x2="28" y2="12" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="24" y1="16" x2="28" y2="16" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="24" y1="20" x2="28" y2="20" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="12" y1="4" x2="12" y2="8" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="16" y1="4" x2="16" y2="8" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="20" y1="4" x2="20" y2="8" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="12" y1="24" x2="12" y2="28" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="16" y1="24" x2="16" y2="28" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="20" y1="24" x2="20" y2="28" stroke="#3cb371" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
            },
          ].map((item, idx) => (
            <div key={idx} className="curriculum-anim" style={{
              animationDelay: item.delay,
              display: 'flex', alignItems: 'flex-start', gap: '1rem',
              background: `linear-gradient(135deg, ${item.color}0d 0%, ${item.color}05 100%)`,
              border: `1px solid ${item.color}35`,
              borderRadius: '14px', padding: '1.2rem 1.4rem',
              position: 'relative', overflow: 'hidden',
              boxShadow: `0 2px 16px ${item.color}12`,
            }}>
              {/* Left accent bar */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                background: `linear-gradient(180deg, ${item.color}, ${item.color}44)`,
                borderRadius: '14px 0 0 14px',
              }} />
              {/* Icon */}
              <div style={{ flexShrink: 0, marginLeft: '4px' }}>{item.icon}</div>
              {/* Text */}
              <div>
                <div style={{
                  fontSize: '0.72rem', fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700, color: item.color, letterSpacing: '0.1em',
                  marginBottom: '0.35rem',
                }}>{item.label.toUpperCase()}</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.45 }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stat strip */}
        <div className="curriculum-anim" style={{
          animationDelay: '0.95s',
          display: 'flex', gap: '1.5rem', marginTop: '1.1rem',
          padding: '0.7rem 1.2rem',
          background: 'rgba(32,178,170,0.05)', borderRadius: '10px',
          border: '1px solid rgba(32,178,170,0.15)',
          justifyContent: 'space-around',
        }}>
          {[
            { val: '단계적', unit: '실무 중심', desc: '실습 구성' },
            { val: 'Artix-7', unit: 'FPGA', desc: 'Arty A7 35T' },
            { val: '100%', unit: '실습', desc: '이론 최소화' },
            { val: 'MicroBlaze', unit: 'CPU', desc: 'Soft-Core Processor' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)', lineHeight: 1 }}>
                {s.val} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Slide 3: 커리큘럼 요약 — .present CSS 자동 애니메이션 */}
      <section data-background-color="var(--slide-bg)">
        {/* Header */}
        <div className="curriculum-anim" style={{ animationDelay: '0.05s', marginBottom: '0.5rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(32,178,170,0.12)', border: '1px solid rgba(32,178,170,0.35)',
            borderRadius: '999px', padding: '3px 14px',
            fontSize: '0.85rem', color: 'var(--primary)', letterSpacing: '0.08em', fontWeight: 700,
          }}>● LEARNING PATH</span>
        </div>
        <h2 className="curriculum-anim" style={{
          animationDelay: '0.15s',
          color: 'var(--primary-dark)', fontSize: '2.2rem', fontWeight: 800,
          letterSpacing: '-0.03em', marginBottom: '0.3rem',
        }}>
          교육 커리큘럼
        </h2>
        <p className="curriculum-anim" style={{
          animationDelay: '0.25s',
          fontSize: '1.1rem', color: '#64748b', marginBottom: '1.4rem',
        }}>
          4단계로 배우는 MicroBlaze 임베디드 설계
        </p>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            {
              step: '01', color: '#20b2aa', delay: '0.35s',
              title: 'MicroBlaze GPIO 제어', keyword: 'AXI-GPIO',
              desc: 'CPU 탑재 및 스위치/LED 직접 제어',
              bullets: ['Block Design 구성', 'Vitis SDK 연동', 'Polling 루프 제어'],
              icon: (
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <rect x="2" y="2" width="24" height="24" rx="4" stroke="#20b2aa" strokeWidth="1.5" fill="rgba(32,178,170,0.1)" />
                  <rect x="7" y="7" width="14" height="14" rx="2" fill="#20b2aa" fillOpacity="0.3" />
                  <rect x="10" y="10" width="8" height="8" rx="1" fill="#20b2aa" />
                </svg>
              ),
            },
            {
              step: '02', color: '#3cb371', delay: '0.5s',
              title: 'Interrupt 제어', keyword: 'AXI-Interrupt',
              desc: '타이머 인터럽트로 LED 색상 순환',
              bullets: ['AXI Timer 연동', 'ISR 핸들러 작성', 'RGB LED 제어'],
              icon: (
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" stroke="#3cb371" strokeWidth="1.5" fill="rgba(60,179,113,0.1)" />
                  <path d="M14 7v7l4 4" stroke="#3cb371" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="14" cy="14" r="2" fill="#3cb371" />
                </svg>
              ),
            },
            {
              step: '03', color: '#20b2aa', delay: '0.65s',
              title: '데이터 스트림 처리', keyword: 'AXI-Stream',
              desc: '주소 없는 고속 데이터 전송',
              bullets: ['AXI-Stream / FIFO', '루프백 테스트', 'Throughput 확인'],
              icon: (
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <rect x="2" y="11" width="8" height="6" rx="2" stroke="#20b2aa" strokeWidth="1.5" fill="rgba(32,178,170,0.1)" />
                  <rect x="18" y="11" width="8" height="6" rx="2" stroke="#20b2aa" strokeWidth="1.5" fill="rgba(32,178,170,0.1)" />
                  <path d="M10 14h3l2-3 2 3 2-3 2 3" stroke="#20b2aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              step: '04', color: '#3cb371', delay: '0.8s',
              title: '메모리 직접 접근 (DMA)', keyword: 'DDR3 / AXI-DMA',
              desc: '대용량 데이터 고속 전송',
              bullets: ['AXI DMA 설정', 'DDR3 메모리 활용', 'Scatter-Gather'],
              icon: (
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <ellipse cx="14" cy="9" rx="9" ry="4" stroke="#3cb371" strokeWidth="1.5" fill="rgba(60,179,113,0.1)" />
                  <path d="M5 9v10c0 2.2 4 4 9 4s9-1.8 9-4V9" stroke="#3cb371" strokeWidth="1.5" />
                  <path d="M5 14c0 2.2 4 4 9 4s9-1.8 9-4" stroke="#3cb371" strokeWidth="1.5" />
                </svg>
              ),
            },
          ].map((item, idx) => (
            <div key={idx} className="curriculum-anim" style={{
              animationDelay: item.delay,
              background: `linear-gradient(160deg, ${item.color}10 0%, ${item.color}05 100%)`,
              border: `1px solid ${item.color}40`,
              borderRadius: '14px', padding: '1.2rem 1rem',
              position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', gap: '0.55rem',
              boxShadow: `0 4px 20px ${item.color}15`,
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${item.color}, ${item.color}44)` }} />
              {/* Header row: badge + keyword chip + spacer + icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '30px', height: '30px', borderRadius: '8px',
                  background: item.color, color: 'white', fontSize: '0.85rem', fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: `0 3px 10px ${item.color}50`,
                }}>{item.step}</div>
                <div style={{
                  fontSize: '0.68rem', fontFamily: '"JetBrains Mono", monospace', fontWeight: 600,
                  color: item.color, background: `${item.color}18`, border: `1px solid ${item.color}40`,
                  borderRadius: '5px', padding: '2px 7px', whiteSpace: 'nowrap',
                }}>{item.keyword}</div>
                <div style={{ flex: 1 }} />
                <div style={{ opacity: 0.6 }}>{item.icon}</div>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3, whiteSpace: 'pre-line' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.desc}</div>
              <ul style={{ margin: '2px 0 0', padding: 0, listStyle: 'none', borderTop: `1px solid ${item.color}20`, paddingTop: '0.4rem' }}>
                {item.bullets.map((b, bi) => (
                  <li key={bi} style={{ fontSize: '0.78rem', color: '#8898aa', lineHeight: 1.6, display: 'flex', gap: '5px' }}>
                    <span style={{ color: item.color, flexShrink: 0 }}>›</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Progress strip */}
        <div className="curriculum-anim" style={{
          animationDelay: '1.0s',
          display: 'flex', alignItems: 'center', marginTop: '0.9rem',
          background: 'rgba(32,178,170,0.06)', borderRadius: '8px',
          padding: '7px 14px', gap: '6px',
        }}>
          {['STEP 01 · AXI-GPIO', 'STEP 02 · Interrupt', 'STEP 03 · AXI-Stream', 'STEP 04 · DMA'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '4px' }}>
              <span style={{
                fontSize: '0.7rem', fontFamily: '"JetBrains Mono", monospace',
                color: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)', fontWeight: 700, whiteSpace: 'nowrap',
              }}>{s}</span>
              {i < 3 && <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: '1px', opacity: 0.4 }} />}
            </div>
          ))}
        </div>
      </section>


      {/* Slide 3.5: 워크플로우 다이어그램 */}
      <WorkflowDiagram />

      {/* Slide 4: 예제 1 (Vertical Slides) */}
      <section>
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', borderBottom: '3px solid var(--accent)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>예제 1: MicroBlaze & GPIO 제어</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: '2rem' }}>
            <ul className="info-list" style={{ fontSize: '1.5rem' }}>
              <li><strong>학습 목표</strong> <span>Vivado Block Design 흐름 및 <br />Vitis C 코딩 기초 습득</span></li>
              <li><strong>실습 내용</strong> <span>MicroBlaze 최소 시스템 구성</span></li>
              <li><strong>동작 확인</strong> <span>보드의 스위치 ON/OFF → 대응 LED 점멸</span></li>
            </ul>

            {/* 동작 설명 SVG 다이어그램 */}
            <svg viewBox="0 0 420 250" style={{ width: '100%', margin: '0 auto' }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arr1" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" fill="#20b2aa" />
                </marker>
                <marker id="arr2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" fill="#a78bfa" />
                </marker>
              </defs>

              {/* ── Switch 4개 ── */}
              <rect x="21" y="15" width="82" height="110" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <text x="62" y="32" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Switch</text>
              {swState.map((on, i) => (
                <g key={i} onClick={() => toggleSwitch(i)} style={{ cursor: 'pointer' }}>
                  <rect x="28" y={40 + i * 20} width="30" height="12" rx="4" fill={on ? "#166534" : "#374151"} stroke="#475569" strokeWidth="1" />
                  <rect x={on ? 46 : 27} y={40 + i * 20} width="12" height="12" rx="3" fill={on ? "#4ade80" : "#6b7280"} style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                  <text x="62" y={50 + i * 20} fill={on ? "#86efac" : "#64748b"} fontSize="7" fontWeight={on ? "bold" : "normal"} style={{ userSelect: 'none' }}>
                    SW{i} {on ? "ON" : "OFF"}
                  </text>
                </g>
              ))}

              {/* Switch → GPIO 화살표 */}
              <line x1="104" y1="70" x2="148" y2="70" stroke="#20b2aa" strokeWidth="2" markerEnd="url(#arr1)" />
              <text x="124" y="64" textAnchor="middle" fill="#64748b" fontSize="8">4bit</text>

              {/* ── AXI GPIO ── */}
              <rect x="150" y="15" width="90" height="110" rx="8" fill="#0f172a" stroke="#20b2aa" strokeWidth="2" />
              <text x="195" y="33" textAnchor="middle" fill="#5eead4" fontSize="11" fontWeight="bold">AXI GPIO</text>
              <rect x="158" y="40" width="74" height="24" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <text x="195" y="52" textAnchor="middle" fill="#94a3b8" fontSize="10">ch2  IN</text>
              <text x="195" y="63" textAnchor="middle" fill="#64748b" fontSize="9">Switch 읽기</text>
              <rect x="158" y="71" width="74" height="24" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <text x="195" y="83" textAnchor="middle" fill="#94a3b8" fontSize="10">ch1  OUT</text>
              <text x="195" y="94" textAnchor="middle" fill="#64748b" fontSize="9">LED 쓰기</text>
              <text x="195" y="114" textAnchor="middle" fill="#74777aff" fontSize="9">AXI-Lite Bus</text>

              {/* GPIO ↔ MicroBlaze */}
              <line x1="195" y1="125" x2="195" y2="152" stroke="#20b2aa" strokeWidth="2" markerEnd="url(#arr1)" />
              <line x1="205" y1="152" x2="205" y2="125" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#arr2)" />

              {/* GPIO → LED 화살표 */}
              <line x1="240" y1="70" x2="278" y2="70" stroke="#20b2aa" strokeWidth="2" markerEnd="url(#arr1)" />
              <text x="255" y="64" textAnchor="middle" fill="#64748b" fontSize="8">4bit</text>

              {/* ── LED 4개 (녹색 단색) ── */}
              <rect x="280" y="15" width="82" height="110" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <text x="321" y="32" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">LED</text>
              {swState.map((on, i) => (
                <g key={i}>
                  <circle cx="297" cy={47 + i * 20} r="9" fill={on ? "#166534" : "#1f2937"} stroke={on ? "#4ade80" : "#374151"} strokeWidth="1.5" style={{ transition: 'all 0.3s' }}>
                    {on && <animate attributeName="opacity" values="1;0.6;1" dur="1.2s" repeatCount="indefinite" />}
                  </circle>
                  {on && <circle cx="297" cy={47 + i * 20} r="5" fill="#4ade80" opacity="0.8" style={{ transition: 'all 0.3s' }} />}
                  <text x="315" y={51 + i * 20} fill={on ? "#4ade80" : "#6b7280"} fontSize="10" fontWeight={on ? "bold" : "normal"} style={{ userSelect: 'none' }}>
                    LD{i} {on ? "ON" : "OFF"}
                  </text>
                </g>
              ))}

              {/* ── MicroBlaze CPU ── */}
              <rect x="85" y="155" width="250" height="60" rx="10" fill="#1e1b2e" stroke="#7c3aed" strokeWidth="2.5" />
              <text x="210" y="174" textAnchor="middle" fill="#c4b5fd" fontSize="12" fontWeight="bold">MicroBlaze CPU</text>
              <text x="100" y="190" textAnchor="start" fill="#94a3b8" fontSize="10">① XGpio_DiscreteRead( ch2 )  →  SW 값 읽기</text>
              <text x="100" y="205" textAnchor="start" fill="#94a3b8" fontSize="10">② XGpio_DiscreteWrite( ch1, sw_val )  →  LED 출력</text>

              {/* while(1) 박스 */}
              <rect x="115" y="230" width="190" height="20" rx="5" fill="rgba(124,58,237,0.1)" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 2" />
              <text x="210" y="243" textAnchor="middle" fill="#a78bfa" fontSize="10" fontWeight="bold">while(1) — 폴링 루프 반복</text>

              {/* MicroBlaze → while 화살표 */}
              <line x1="210" y1="215" x2="210" y2="230" stroke="#7c3aed" strokeWidth="1.5" markerEnd="url(#arr2)" />

              {/* 루프 백 화살표 */}
              <path d="M115,239 Q60,238 40,195 Q20,160 30,124" fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
              <path d="M305,239 Q400,235 400,180 Q410,80 360,60" fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
            </svg>
          </div>
          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem', color: '#64748b' }}>⬇️ 아래 방향키(↓)를 눌러 실습 단계 확인</p>
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
          <CodeBlock style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '20px', borderRadius: '8px', fontSize: '18px', lineHeight: '1.4', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', maxHeight: '420px' }}>
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
          </CodeBlock>
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
          <CodeBlock style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '1.2rem', borderRadius: '8px', fontSize: '1.05rem', overflowX: 'auto', lineHeight: '1.3', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', maxHeight: '70vh' }}>
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
          </CodeBlock>
        </section>
      </section>

      {/* Slide 5: 예제 2 (Vertical Slides) */}
      <section>
        {/* Ex2 Overview */}
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', borderBottom: '3px solid var(--accent)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>예제 2: 타이머 인터럽트 기반 LED 제어</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <ul className="info-list" style={{ fontSize: '1.5rem' }}>
              <li><strong>학습 목표</strong> <span>하드웨어 인터럽트 개념 이해 및 다중 IP 연동</span></li>
              <li><strong>핵심 IP</strong> <span>AXI Timer, AXI Interrupt Controller, AXI GPIO</span></li>
              <li><strong>동작 확인</strong> <span>타이머 인터럽트마다 RGB LED 색상 자동 순환</span></li>
              <li><strong>핵심 개념</strong> <span>ISR(Interrupt Service Routine) 작성 및 등록</span></li>
            </ul>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', justifyContent: 'center' }}>
              {/* 하드웨어 블록 다이어그램 */}
              <svg viewBox="0 0 320 430" style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }} xmlns="http://www.w3.org/2000/svg">
                {/* AXI Timer 블록 */}
                <rect x="70" y="8" width="180" height="44" rx="8" fill="#e0f7f5" stroke="#20b2aa" strokeWidth="2" />
                <text x="160" y="27" textAnchor="middle" fill="#006400" fontSize="13" fontWeight="bold">AXI Timer</text>
                <text x="160" y="43" textAnchor="middle" fill="#475569" fontSize="11">주기 카운트 만료</text>

                {/* 화살표 1 */}
                <line x1="160" y1="52" x2="160" y2="76" stroke="#20b2aa" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="174" y="68" fill="#dc2626" fontSize="10" fontWeight="bold">interrupt!</text>

                {/* AXI INTC 블록 */}
                <rect x="70" y="78" width="180" height="44" rx="8" fill="#fef9e7" stroke="#f59e0b" strokeWidth="2" />
                <text x="160" y="97" textAnchor="middle" fill="#92400e" fontSize="13" fontWeight="bold">AXI Interrupt Controller</text>
                <text x="160" y="113" textAnchor="middle" fill="#475569" fontSize="11">인터럽트 중재 및 전달</text>

                {/* 화살표 2 */}
                <line x1="160" y1="122" x2="160" y2="146" stroke="#20b2aa" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="174" y="138" fill="#dc2626" fontSize="10" fontWeight="bold">irq</text>

                {/* MicroBlaze 블록 */}
                <rect x="50" y="148" width="220" height="44" rx="8" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2.5" />
                <text x="160" y="167" textAnchor="middle" fill="#4c1d95" fontSize="13" fontWeight="bold">MicroBlaze CPU</text>
                <text x="160" y="183" textAnchor="middle" fill="#475569" fontSize="11">현재 컨텍스트 저장 → ISR 진입</text>

                {/* 화살표 3 */}
                <line x1="160" y1="192" x2="160" y2="216" stroke="#20b2aa" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="170" y="208" fill="#475569" fontSize="10">ISR 호출</text>

                {/* ISR 함수 블록 */}
                <rect x="60" y="218" width="200" height="44" rx="8" fill="#fce7f3" stroke="#db2777" strokeWidth="2" />
                <text x="160" y="237" textAnchor="middle" fill="#831843" fontSize="13" fontWeight="bold">timer_isr( )</text>
                <text x="160" y="253" textAnchor="middle" fill="#475569" fontSize="11">색상 인덱스 증가</text>

                {/* 화살표 4 */}
                <line x1="160" y1="262" x2="160" y2="290" stroke="#20b2aa" strokeWidth="2" markerEnd="url(#arrow)" />

                {/* RGB LED 블록 - 보드 동작과 동일한 Chase Light */}
                <rect x="10" y="294" width="300" height="120" rx="10" fill="#1e1b2e" stroke="#16a34a" strokeWidth="2" />
                <text x="160" y="313" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold">RGB LEDs × 4 (LD4–LD7) — Chase Light</text>
                <text x="160" y="327" textAnchor="middle" fill="#64748b" fontSize="9">같은 색이 4칸 쉬프트 → 다음 색으로 전환</text>

                {/* LD4 — 0~0.5s 구간 ON / fill은 8s 주기로 색상 전환 */}
                <circle cx="52" cy="360" r="20" fill="#ef4444">
                  <animate attributeName="fill" values="#ef4444;#22c55e;#3b82f6;#facc15;#ef4444" keyTimes="0;0.25;0.5;0.75;1" dur="8s" repeatCount="indefinite" calcMode="discrete" />
                  <animate attributeName="opacity" values="0.9;0.12;0.12;0.12;0.9" keyTimes="0;0.25;0.5;0.75;1" dur="2s" repeatCount="indefinite" calcMode="discrete" />
                  <animate attributeName="r" values="22;16;16;16;22" keyTimes="0;0.25;0.5;0.75;1" dur="2s" repeatCount="indefinite" calcMode="discrete" />
                </circle>
                <text x="52" y="392" textAnchor="middle" fill="#94a3b8" fontSize="10">LD4</text>

                {/* LD5 — 0.5~1.0s 구간 ON */}
                <circle cx="118" cy="360" r="16" fill="#ef4444">
                  <animate attributeName="fill" values="#ef4444;#22c55e;#3b82f6;#facc15;#ef4444" keyTimes="0;0.25;0.5;0.75;1" dur="8s" repeatCount="indefinite" calcMode="discrete" />
                  <animate attributeName="opacity" values="0.12;0.9;0.12;0.12;0.12" keyTimes="0;0.25;0.5;0.75;1" dur="2s" repeatCount="indefinite" calcMode="discrete" />
                  <animate attributeName="r" values="16;22;16;16;16" keyTimes="0;0.25;0.5;0.75;1" dur="2s" repeatCount="indefinite" calcMode="discrete" />
                </circle>
                <text x="118" y="392" textAnchor="middle" fill="#94a3b8" fontSize="10">LD5</text>

                {/* LD6 — 1.0~1.5s 구간 ON */}
                <circle cx="202" cy="360" r="16" fill="#ef4444">
                  <animate attributeName="fill" values="#ef4444;#22c55e;#3b82f6;#facc15;#ef4444" keyTimes="0;0.25;0.5;0.75;1" dur="8s" repeatCount="indefinite" calcMode="discrete" />
                  <animate attributeName="opacity" values="0.12;0.12;0.9;0.12;0.12" keyTimes="0;0.25;0.5;0.75;1" dur="2s" repeatCount="indefinite" calcMode="discrete" />
                  <animate attributeName="r" values="16;16;22;16;16" keyTimes="0;0.25;0.5;0.75;1" dur="2s" repeatCount="indefinite" calcMode="discrete" />
                </circle>
                <text x="202" y="392" textAnchor="middle" fill="#94a3b8" fontSize="10">LD6</text>

                {/* LD7 — 1.5~2.0s 구간 ON */}
                <circle cx="268" cy="360" r="16" fill="#ef4444">
                  <animate attributeName="fill" values="#ef4444;#22c55e;#3b82f6;#facc15;#ef4444" keyTimes="0;0.25;0.5;0.75;1" dur="8s" repeatCount="indefinite" calcMode="discrete" />
                  <animate attributeName="opacity" values="0.12;0.12;0.12;0.9;0.12" keyTimes="0;0.25;0.5;0.75;1" dur="2s" repeatCount="indefinite" calcMode="discrete" />
                  <animate attributeName="r" values="16;16;16;22;16" keyTimes="0;0.25;0.5;0.75;1" dur="2s" repeatCount="indefinite" calcMode="discrete" />
                </circle>
                <text x="268" y="392" textAnchor="middle" fill="#94a3b8" fontSize="10">LD7</text>

                {/* 화살표 마커 정의 */}
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#20b2aa" />
                  </marker>
                </defs>
              </svg>


            </div>

          </div>
          <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '1.2rem', color: '#64748b' }}>⬇️ 아래 방향키(↓)를 눌러 실습 단계 확인</p>
        </section>

        {/* Ex2 - Step 1: Vivado Block Design */}
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Step 1. Vivado Block Design 구성</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '2rem' }}>
            <div>
              <ul className="step-list">
                <li>
                  <div className="step-icon">1</div>
                  <div className="step-content">
                    <span className="step-title">예제 1 기반 시작</span>
                    <span className="step-desc">예제 1 Block Design에서 이어서 진행 (MicroBlaze + AXI GPIO 기존 상태 유지)</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">2</div>
                  <div className="step-content">
                    <span className="step-title">AXI Timer 추가</span>
                    <span className="step-desc">Board 탭 또는 IP Catalog에서 <code>AXI Timer</code> 검색 및 캔버스에 추가</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">3</div>
                  <div className="step-content">
                    <span className="step-title">AXI Interrupt Controller 추가</span>
                    <span className="step-desc"><code>AXI Interrupt Controller</code>(INTC) 추가 후 Timer의 <code>interrupt</code> 핀과 연결</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">4</div>
                  <div className="step-content">
                    <span className="step-title">MicroBlaze 인터럽트 연결</span>
                    <span className="step-desc">INTC의 <code>irq</code> 출력 → MicroBlaze의 <code>INTERRUPT</code> 포트 연결</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">5</div>
                  <div className="step-content">
                    <span className="step-title">RGB LED GPIO 추가</span>
                    <span className="step-desc">Board 탭에서 <code>RGB LEDs</code> 드래그 앤 드롭 (AXI GPIO 자동 생성)</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">6</div>
                  <div className="step-content">
                    <span className="step-title">Connection Automation → HDL Wrapper → Bitstream</span>
                    <span className="step-desc">자동 연결 실행 후 HDL Wrapper 생성, Generate Bitstream → Export Hardware (.xsa)</span>
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                <ImagePlaceholder
                  src="/images/ex2_step1_initial.png"
                  label="IP 추가 상태"
                  desc="AXI Timer + INTC + RGB GPIO 추가된 초기 블록 디자인"
                  maxHeight="230px"
                />
                <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>IP 추가 직후</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                <ImagePlaceholder
                  src="/images/ex2_step1_automation.png"
                  label="자동 연결 완료"
                  desc="Connection Automation 후 완성된 블록 디자인"
                  maxHeight="230px"
                />
                <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>자동 연결(Automation) 후</span>
              </div>
            </div>
          </div>
        </section>

        {/* Ex2 - Step 2: Vitis Setup */}
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Step 2. Vitis 프로젝트 설정</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '2rem' }}>
            <div>
              <ul className="step-list">
                <li>
                  <div className="step-icon">1</div>
                  <div className="step-content">
                    <span className="step-title">Platform 업데이트</span>
                    <span className="step-desc">예제 2용 새 .xsa로 Platform Project를 새로 생성하거나 기존 Platform 업데이트 후 빌드</span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">2</div>
                  <div className="step-content">
                    <span className="step-title">Application Project 생성</span>
                    <span className="step-desc">
                      <ul className="step-list-sub">
                        <li>반드시 <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Empty Application(C)</span> 템플릿 선택</li>
                        <li><code>src/main.c</code> 파일 새로 생성하여 인터럽트 코드 작성</li>
                      </ul>
                    </span>
                  </div>
                </li>
                <li>
                  <div className="step-icon">3</div>
                  <div className="step-content">
                    <span className="step-title">BSP 라이브러리 확인</span>
                    <span className="step-desc"><code>xparameters.h</code>에서 <code>XPAR_AXI_TIMER_*</code>, <code>XPAR_INTC_*</code> 정의 확인</span>
                  </div>
                </li>
              </ul>
              <div style={{ marginTop: '1.0rem', padding: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', borderRadius: '2px', fontSize: '0.85rem' }}>
                <p style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '0.3rem' }}>💡 주의사항</p>
                <p style={{ color: '#475569', lineHeight: '1.4', margin: 0 }}>
                  인터럽트 컨트롤러 사용 시 MicroBlaze의 <b>Interrupt</b> 포트가 Block Design에서 실제로 연결되어 있어야 BSP에서 <code>XPAR_INTC_*</code>가 생성됨
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                <ImagePlaceholder
                  src="/images/ex2_step2_platform.png"
                  label="Vitis Platform 설정"
                  desc="예제 2 .xsa를 로드한 Platform 설정 화면"
                  maxHeight="240px"
                />
                <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>Platform 업데이트</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
                <ImagePlaceholder
                  src="/images/ex2_step2_bsp.png"
                  label="BSP xparameters.h 확인"
                  desc="INTC, Timer Device ID 확인 화면"
                  maxHeight="240px"
                />
                <span style={{ fontSize: '1.0rem', color: '#475569', fontWeight: '600' }}>BSP 파라미터 확인</span>
              </div>
            </div>
          </div>
        </section>

        {/* Ex2 - Step 3: C Code */}
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.2rem', marginBottom: '1.2rem' }}>Step 3. 인터럽트 제어 코드 (C)</h2>
          <p style={{ fontSize: '1.15rem', color: '#475569', marginBottom: '0.8rem' }}>AXI Timer 인터럽트마다 ISR이 호출되어 RGB LED 색상을 순환 변경</p>
          <CodeBlock style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '18px', borderRadius: '8px', fontSize: '16px', lineHeight: '1.35', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', maxHeight: '440px' }}>
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xparameters.h"</span><br />
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xtmrctr.h"</span><br />
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xintc.h"</span><br />
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xgpio.h"</span><br />
            <br />
            <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#e5c07b' }}>TIMER_PERIOD</span> <span style={{ color: '#d19a66' }}>50000000</span>  <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 0.5초 = 50M cycles (100MHz 기준)</span><br />
            <br />
            <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 하나의 LED만 켜고 오른쪽으로 쉬프트 (Chase Light)</span><br />
            <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// LD4=bit[2:0], LD5=bit[5:3], LD6=bit[8:6], LD7=bit[11:9]</span><br />
            <span style={{ color: '#e5c07b' }}>int</span> colors[<span style={{ color: '#d19a66' }}>8</span>] = {'{'} <span style={{ color: '#d19a66' }}>0x1</span>,<span style={{ color: '#d19a66' }}>0x2</span>,<span style={{ color: '#d19a66' }}>0x4</span>,<span style={{ color: '#d19a66' }}>0x3</span>,<span style={{ color: '#d19a66' }}>0x5</span>,<span style={{ color: '#d19a66' }}>0x6</span>,<span style={{ color: '#d19a66' }}>0x7</span>,<span style={{ color: '#d19a66' }}>0x0</span> {'}'};<br />
            <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// R    G    B    Y    M    C    W   OFF</span><br />
            <br />
            <span style={{ color: '#e5c07b' }}>XTmrCtr</span> timer_device;<br />
            <span style={{ color: '#e5c07b' }}>XIntc</span>   intc_device;<br />
            <span style={{ color: '#e5c07b' }}>XGpio</span>   rgb_device;<br />
            <span style={{ color: '#e5c07b' }}>int</span>     led_pos   = <span style={{ color: '#d19a66' }}>0</span>;  <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 현재 켜진 LED (0=LD4, 1=LD5, 2=LD6, 3=LD7)</span><br />
            <span style={{ color: '#e5c07b' }}>int</span>     color_idx = <span style={{ color: '#d19a66' }}>0</span>;  <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 현재 색상 인덱스</span><br />
            <br />
            <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// ISR: 하나의 LED만 켜고 오른쪽으로 쉬프트</span><br />
            <span style={{ color: '#e5c07b' }}>void</span> <span style={{ color: '#61afef' }}>timer_isr</span>(<span style={{ color: '#e5c07b' }}>void</span> *data, <span style={{ color: '#e5c07b' }}>u8</span> n) {'{'}<br />
            &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 현재 위치의 LED에만 색상 출력 (나머지는 0)</span><br />
            &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> gpio_val = colors[color_idx] &lt;&lt; (<span style={{ color: '#d19a66' }}>3</span> * led_pos);<br />
            &nbsp;&nbsp;XGpio_DiscreteWrite(&amp;rgb_device, <span style={{ color: '#d19a66' }}>1</span>, gpio_val);<br />
            &nbsp;&nbsp;led_pos = (led_pos + <span style={{ color: '#d19a66' }}>1</span>) % <span style={{ color: '#d19a66' }}>4</span>;<br />
            &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>if</span> (led_pos == <span style={{ color: '#d19a66' }}>0</span>)  <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 4개 다 돌면 다음 색상으로</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;color_idx = (color_idx + <span style={{ color: '#d19a66' }}>1</span>) % <span style={{ color: '#d19a66' }}>8</span>;<br />
            {'}'}<br />
            <br />
            <span style={{ color: '#e5c07b' }}>int</span> <span style={{ color: '#61afef' }}>main</span>() {'{'}<br />
            &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// GPIO 초기화 (12비트 전체 출력, 0x000 = all output)</span><br />
            &nbsp;&nbsp;XGpio_Initialize(&amp;rgb_device, XPAR_GPIO_0_DEVICE_ID);<br />
            &nbsp;&nbsp;XGpio_SetDataDirection(&amp;rgb_device, <span style={{ color: '#d19a66' }}>1</span>, <span style={{ color: '#d19a66' }}>0x000</span>);<br />
            <br />
            &nbsp;&nbsp;XTmrCtr_Initialize(&amp;timer_device, XPAR_AXI_TIMER_0_DEVICE_ID);<br />
            &nbsp;&nbsp;XTmrCtr_SetHandler(&amp;timer_device, timer_isr, &amp;timer_device);<br />
            &nbsp;&nbsp;XTmrCtr_SetOptions(&amp;timer_device, <span style={{ color: '#d19a66' }}>0</span>, XTC_INT_MODE_OPTION | XTC_AUTO_RELOAD_OPTION);<br />
            &nbsp;&nbsp;XTmrCtr_SetResetValue(&amp;timer_device, <span style={{ color: '#d19a66' }}>0</span>, <span style={{ color: '#d19a66' }}>0xFFFFFFFF</span> - TIMER_PERIOD);<br />
            &nbsp;&nbsp;XIntc_Initialize(&amp;intc_device, XPAR_INTC_0_DEVICE_ID);<br />
            &nbsp;&nbsp;XIntc_Connect(&amp;intc_device, XPAR_INTC_0_TMRCTR_0_VEC_ID,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XTmrCtr_InterruptHandler, &amp;timer_device);<br />
            &nbsp;&nbsp;XIntc_Enable(&amp;intc_device, XPAR_INTC_0_TMRCTR_0_VEC_ID);<br />
            &nbsp;&nbsp;XIntc_Start(&amp;intc_device, XIN_REAL_MODE);<br />
            &nbsp;&nbsp;XTmrCtr_Start(&amp;timer_device, <span style={{ color: '#d19a66' }}>0</span>);<br />
            &nbsp;&nbsp;microblaze_enable_interrupts();<br />
            <br />
            &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span>(<span style={{ color: '#d19a66' }}>1</span>) {'{'} {'}'}<br />
            &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>return</span> <span style={{ color: '#d19a66' }}>0</span>;<br />
            {'}'}
          </CodeBlock>

        </section>

        {/* Ex2 - 응용: 예제1 + 예제2 병합 코드 */}
        <section data-background-color="var(--slide-bg)" style={{ textAlign: 'left' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.0rem', marginBottom: '0.8rem' }}>응용 실습: 예제 1 + 예제 2 통합 제어</h2>
          <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '0.7rem' }}>
            Switch→LED 제어(예제1)와 타이머 인터럽트→RGB LED 순환(예제2)을 하나의 소스로 병합&nbsp;
            <span style={{ backgroundColor: 'rgba(32,178,170,0.15)', border: '1px solid var(--accent)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.9rem', color: 'var(--primary-dark)', fontWeight: 'bold' }}>메인 while문 + ISR 동시 구동</span>
          </p>
          <CodeBlock style={{ backgroundColor: '#282c34', color: '#abb2bf', padding: '16px', borderRadius: '8px', fontSize: '15px', lineHeight: '1.3', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', maxHeight: '460px' }}>
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xparameters.h"</span><br />
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xgpio.h"</span><br />
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xtmrctr.h"</span><br />
            <span style={{ color: '#c678dd' }}>#include</span> <span style={{ color: '#98c379' }}>"xintc.h"</span><br />
            <br />
            <span style={{ color: '#c678dd' }}>#define</span> <span style={{ color: '#e5c07b' }}>TIMER_PERIOD</span> <span style={{ color: '#d19a66' }}>50000000</span>  <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 0.5초 = 50M cycles (100MHz 기준)</span><br />
            <br />
            <span style={{ color: '#e5c07b' }}>XGpio</span>   sw_led_gpio;  <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 예제1: axi_gpio_0 (2ch: SW + LED)</span><br />
            <span style={{ color: '#e5c07b' }}>XGpio</span>   rgb_gpio;     <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 예제2: axi_gpio_1 (1ch: RGB LED)</span><br />
            <span style={{ color: '#e5c07b' }}>XTmrCtr</span> timer;<br />
            <span style={{ color: '#e5c07b' }}>XIntc</span>   intc;<br />
            <span style={{ color: '#e5c07b' }}>int</span> color_idx = <span style={{ color: '#d19a66' }}>0</span>;<br />
            <span style={{ color: '#e5c07b' }}>int</span> colors[] = {'{'} <span style={{ color: '#d19a66' }}>0x1</span>,<span style={{ color: '#d19a66' }}>0x2</span>,<span style={{ color: '#d19a66' }}>0x4</span>,<span style={{ color: '#d19a66' }}>0x3</span>,<span style={{ color: '#d19a66' }}>0x5</span>,<span style={{ color: '#d19a66' }}>0x6</span>,<span style={{ color: '#d19a66' }}>0x7</span>,<span style={{ color: '#d19a66' }}>0x0</span> {'}'};<br />
            <span style={{ color: '#e5c07b' }}>int</span> sw_lut[] = {'{'} <span style={{ color: '#d19a66' }}>0x0</span>,<span style={{ color: '#d19a66' }}>0xF</span>,<span style={{ color: '#d19a66' }}>0xA</span>,<span style={{ color: '#d19a66' }}>0x5</span>,<span style={{ color: '#d19a66' }}>0x9</span>,<span style={{ color: '#d19a66' }}>0x6</span>,<span style={{ color: '#d19a66' }}>0xC</span>,<span style={{ color: '#d19a66' }}>0x3</span>,<span style={{ color: '#d19a66' }}>0x1</span>,<span style={{ color: '#d19a66' }}>0x2</span>,<span style={{ color: '#d19a66' }}>0x4</span>,<span style={{ color: '#d19a66' }}>0x8</span>,<span style={{ color: '#d19a66' }}>0xE</span>,<span style={{ color: '#d19a66' }}>0xD</span>,<span style={{ color: '#d19a66' }}>0xB</span>,<span style={{ color: '#d19a66' }}>0x7</span> {'}'};<br />
            <br />
            <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// ISR: 4개 LED 각자 다른 위상으로 12비트 패킹 출력</span><br />
            <span style={{ color: '#e5c07b' }}>void</span> <span style={{ color: '#61afef' }}>timer_isr</span>(<span style={{ color: '#e5c07b' }}>void</span> *p, <span style={{ color: '#e5c07b' }}>u8</span> n) {'{'}<br />
            &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> ld4 = colors[ color_idx        % <span style={{ color: '#d19a66' }}>8</span>];<br />
            &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> ld5 = colors[(color_idx + <span style={{ color: '#d19a66' }}>2</span>) % <span style={{ color: '#d19a66' }}>8</span>];<br />
            &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> ld6 = colors[(color_idx + <span style={{ color: '#d19a66' }}>4</span>) % <span style={{ color: '#d19a66' }}>8</span>];<br />
            &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> ld7 = colors[(color_idx + <span style={{ color: '#d19a66' }}>6</span>) % <span style={{ color: '#d19a66' }}>8</span>];<br />
            &nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> val = ld4 | (ld5 &lt;&lt; <span style={{ color: '#d19a66' }}>3</span>) | (ld6 &lt;&lt; <span style={{ color: '#d19a66' }}>6</span>) | (ld7 &lt;&lt; <span style={{ color: '#d19a66' }}>9</span>);<br />
            &nbsp;&nbsp;XGpio_DiscreteWrite(&amp;rgb_gpio, <span style={{ color: '#d19a66' }}>1</span>, val);<br />
            &nbsp;&nbsp;color_idx = (color_idx + <span style={{ color: '#d19a66' }}>1</span>) % <span style={{ color: '#d19a66' }}>8</span>;<br />
            {'}'}<br />
            <br />
            <span style={{ color: '#e5c07b' }}>int</span> <span style={{ color: '#61afef' }}>main</span>() {'{'}<br />
            &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 1. GPIO 초기화</span><br />
            &nbsp;&nbsp;XGpio_Initialize(&amp;sw_led_gpio, XPAR_GPIO_0_DEVICE_ID);<br />
            &nbsp;&nbsp;XGpio_SetDataDirection(&amp;sw_led_gpio, <span style={{ color: '#d19a66' }}>1</span>, <span style={{ color: '#d19a66' }}>0x0</span>);  <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// ch1: LED</span><br />
            &nbsp;&nbsp;XGpio_SetDataDirection(&amp;sw_led_gpio, <span style={{ color: '#d19a66' }}>2</span>, <span style={{ color: '#d19a66' }}>0xF</span>);  <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// ch2: SW</span><br />
            &nbsp;&nbsp;XGpio_Initialize(&amp;rgb_gpio, XPAR_GPIO_1_DEVICE_ID);<br />
            &nbsp;&nbsp;XGpio_SetDataDirection(&amp;rgb_gpio, <span style={{ color: '#d19a66' }}>1</span>, <span style={{ color: '#d19a66' }}>0x000</span>);  <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 12비트 전체 출력</span><br />
            <br />
            &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 2. 타이머 + INTC 초기화</span><br />
            &nbsp;&nbsp;XTmrCtr_Initialize(&amp;timer, XPAR_AXI_TIMER_0_DEVICE_ID);<br />
            &nbsp;&nbsp;XTmrCtr_SetHandler(&amp;timer, timer_isr, &amp;timer);<br />
            &nbsp;&nbsp;XTmrCtr_SetOptions(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>, XTC_INT_MODE_OPTION | XTC_AUTO_RELOAD_OPTION);<br />
            &nbsp;&nbsp;XTmrCtr_SetResetValue(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>, <span style={{ color: '#d19a66' }}>0xFFFFFFFF</span> - TIMER_PERIOD);<br />
            &nbsp;&nbsp;XIntc_Initialize(&amp;intc, XPAR_INTC_0_DEVICE_ID);<br />
            &nbsp;&nbsp;XIntc_Connect(&amp;intc, XPAR_INTC_0_TMRCTR_0_VEC_ID, XTmrCtr_InterruptHandler, &amp;timer);<br />
            &nbsp;&nbsp;XIntc_Enable(&amp;intc, XPAR_INTC_0_TMRCTR_0_VEC_ID);<br />
            &nbsp;&nbsp;XIntc_Start(&amp;intc, XIN_REAL_MODE);<br />
            &nbsp;&nbsp;XTmrCtr_Start(&amp;timer, <span style={{ color: '#d19a66' }}>0</span>);<br />
            &nbsp;&nbsp;microblaze_enable_interrupts();<br />
            <br />
            &nbsp;&nbsp;<span style={{ color: '#5c6370', fontStyle: 'italic' }}>// 3. 메인 루프: 스위치→LED (ISR과 독립적으로 계속 실행)</span><br />
            &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span>(<span style={{ color: '#d19a66' }}>1</span>) {'{'}<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#e5c07b' }}>int</span> sw = XGpio_DiscreteRead(&amp;sw_led_gpio, <span style={{ color: '#d19a66' }}>2</span>);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;XGpio_DiscreteWrite(&amp;sw_led_gpio, <span style={{ color: '#d19a66' }}>1</span>, sw_lut[sw &amp; <span style={{ color: '#d19a66' }}>0xF</span>]);<br />
            &nbsp;&nbsp;{'}'}<br />
            &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>return</span> <span style={{ color: '#d19a66' }}>0</span>;<br />
            {'}'}
          </CodeBlock>
        </section>
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
