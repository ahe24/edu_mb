'use client';

import { useState } from 'react';
import { FPGA, slideBg, styles, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';
import InfoCard from '../InfoCard';

/* ── 검증 데이터 ── */
type VerRow = { 독립성: string; 추적성: string; 커버리지: string; 형식검증: string; 정량목표: string; 핵심활동: string };

const nuclearVer: Record<string, VerRow> = {
  'Class 1E': {
    독립성: '설계 조직과 분리된 별도 기관의 IV&V (조직 분리)',
    추적성: '요구사항 → HDL → 시뮬결과 양방향 완전 추적',
    커버리지: '기능 시뮬 전항목 + STA + 합성 후 등가성 검증',
    형식검증: '합성 후 등가성 검증 필수 (독립 EDA 툴)',
    정량목표: '수치 목표 없음 — 단일고장기준(SFC) 충족을 중복성 구조(2oo4 등)로 증명',
    핵심활동: 'IV&V (조직 독립) + 공통원인고장(CCF) 다양성 분석 + 정주기 시험 설계 반영 + 규제기관 인허가 패키지',
  },
  'Non-1E': {
    독립성: '내부 검토 수준, 독립 인력 분리 불필요',
    추적성: '요구사항 추적 권장 (강제 아님)',
    커버리지: '기능 시뮬 선택적 수행, 커버리지 목표 없음',
    형식검증: '불필요 (품질 보증 위주)',
    정량목표: '없음',
    핵심활동: '일반 품질 보증(QA) 수준 적용',
  },
};

const aerospaceVer: Record<string, VerRow> = {
  'DAL A': {
    독립성: '설계자 외 독립 검증 엔지니어 (필수)',
    추적성: '요구사항 → HDL → 시뮬 → 실물 HW 시험 양방향',
    커버리지: 'RTL 구조 커버리지: Node / Branch / Toggle (MC/DC 상당)',
    형식검증: '보조 수단으로 인정; 사실상 권고',
    정량목표: '고장률 < 10⁻⁹/비행시간 (시스템 수준)',
    핵심활동: '시뮬 + 실물 HW 시험 병행 (FAA SOI 4단계 감사)',
  },
  'DAL B': {
    독립성: '독립 검증 인력 필수 (DAL A와 동일)',
    추적성: '요구사항 → HDL → 시뮬 → 실물 HW 시험 양방향',
    커버리지: 'RTL 구조 커버리지 필수 (DAL A와 동일)',
    형식검증: '보조 수단으로 인정',
    정량목표: '고장률 < 10⁻⁷/비행시간',
    핵심활동: '시뮬 + 실물 HW 시험 병행 (FAA SOI 4단계)',
  },
  'DAL C': {
    독립성: '독립성 권장 (강제 아님)',
    추적성: '요구사항 추적 필요, HW 시험 생략 가능',
    커버리지: '블랙박스 기능 검증만 (RTL 구조 커버리지 불필요)',
    형식검증: '선택 사항',
    정량목표: '고장률 < 10⁻⁵/비행시간',
    핵심활동: '시뮬레이션 위주 (HW 시험 생략 가능)',
  },
  'DAL D': {
    독립성: '불필요',
    추적성: '시스템 수준 간접 확인으로 대체 가능',
    커버리지: '시스템 설치 시험으로 대체 가능',
    형식검증: '불필요',
    정량목표: '고장률 < 10⁻³/비행시간',
    핵심활동: '시스템 설치 시험으로 간접 검증',
  },
};

const autoVer: Record<string, VerRow> = {
  'ASIL D': {
    독립성: 'I3: 외부 독립 기관 평가 (필수)',
    추적성: '요구사항 → 안전 메커니즘 → FMEDA 결과 양방향',
    커버리지: 'SPFM ≥ 99%, LFM ≥ 90% (FMEDA 정량 산출)',
    형식검증: '모델 체킹 사실상 필수',
    정량목표: 'PMHF < 10 FIT (10⁻⁸/hr)',
    핵심활동: 'FMEDA + 고장 주입 + Lockstep 등 안전 메커니즘',
  },
  'ASIL C': {
    독립성: 'I2: 독립 팀 (동일 조직 내)',
    추적성: '요구사항 → 안전 메커니즘 → FMEDA 양방향',
    커버리지: 'SPFM ≥ 97%, LFM ≥ 80% (FMEDA 정량 산출)',
    형식검증: '권고 수준',
    정량목표: 'PMHF < 100 FIT',
    핵심활동: 'FMEDA + 고장 주입 + 안전 메커니즘 분석',
  },
  'ASIL B': {
    독립성: 'I1: 동일 팀 내 다른 담당자',
    추적성: '요구사항 추적 + FMEA 정성 분석',
    커버리지: 'SPFM ≥ 90%, LFM ≥ 60%',
    형식검증: '선택 사항',
    정량목표: '정량 목표 없음 (정성 분석 위주)',
    핵심활동: 'FMEA + 안전 메커니즘 설계',
  },
  'ASIL A / QM': {
    독립성: 'I1 또는 불필요 (QM)',
    추적성: '요구사항 추적 권장 (QM은 불필요)',
    커버리지: '커버리지 목표 없음',
    형식검증: '불필요',
    정량목표: '없음 (QM은 일반 품질관리만)',
    핵심활동: '일반 FMEA 또는 품질 보증(QM)',
  },
};

const DOMAIN_META = [
  {
    key: 'nuclear' as const,
    domain: '원전', en: 'Nuclear', standard: 'IEC 62566 / IEEE 603',
    color: '#4A6FA5', thColor: '#3A5080',
    levels: [
      { name: 'Class 1E', desc: '안전 계통 (Safety-Related)' },
      { name: 'Non-1E', desc: '비안전 계통' },
    ],
  },
  {
    key: 'aerospace' as const,
    domain: '항공', en: 'Aerospace', standard: 'DO-254 / FAA AC 20-152A',
    color: '#5B8C5A', thColor: '#4A7249',
    levels: [
      { name: 'DAL A', desc: '치명적 — 항공기 손실' },
      { name: 'DAL B', desc: '위험/중대 — 심각한 부상' },
      { name: 'DAL C', desc: '주요 — 안전 마진 감소' },
      { name: 'DAL D', desc: '경미 — 불편 수준' },
    ],
  },
  {
    key: 'auto' as const,
    domain: '차량', en: 'Automotive', standard: 'ISO 26262 Part 5',
    color: '#8B6FA5', thColor: '#6B5285',
    levels: [
      { name: 'ASIL D', desc: 'S3 + E4 + C3 (최고 위험도)' },
      { name: 'ASIL C', desc: 'S3 + E4 + C2 등' },
      { name: 'ASIL B', desc: 'S2 + E4 + C3 등' },
      { name: 'ASIL A / QM', desc: '저위험 / 일반 품질관리' },
    ],
  },
] as const;

const VER_LOOKUP = { nuclear: nuclearVer, aerospace: aerospaceVer, auto: autoVer };

const ROW_KEYS: { key: keyof VerRow; label: string }[] = [
  { key: '독립성', label: '독립성' },
  { key: '추적성', label: '추적성' },
  { key: '커버리지', label: '커버리지' },
  { key: '형식검증', label: '형식 검증' },
  { key: '정량목표', label: '정량 목표' },
  { key: '핵심활동', label: '핵심 활동' },
];

/* ── 인터랙티브 슬라이드 컴포넌트 ── */
function SafetyClassificationSlide() {
  const [sel, setSel] = useState<{ nuclear: string; aerospace: string; auto: string }>({
    nuclear: 'Class 1E',
    aerospace: 'DAL A',
    auto: 'ASIL D',
  });

  return (
    <section data-background-color={slideBg}>
      <SlideHeader
        title="도메인별 안전 등급 분류 체계"
        subtitle="Safety Classification by Domain — Nuclear / Aerospace / Automotive"
      />

      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.2rem' }}>

        {/* 3 도메인 카드 — 클릭으로 등급 선택 */}
        <div style={styles.grid3}>
          {DOMAIN_META.map(d => (
            <div key={d.key} style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderTop: `3px solid ${d.color}`,
              borderRadius: '10px',
              padding: '1rem 1.1rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: d.color }}>{d.domain}</span>
                <span style={{ fontSize: '0.7rem', color: FPGA.textLight, fontFamily: '"JetBrains Mono", monospace' }}>{d.en}</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: FPGA.textLight, fontFamily: '"JetBrains Mono", monospace', marginBottom: '0.6rem' }}>{d.standard}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {d.levels.map(lv => {
                  const isSelected = sel[d.key] === lv.name;
                  return (
                    <div
                      key={lv.name}
                      onClick={() => setSel(prev => ({ ...prev, [d.key]: lv.name }))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 8px', borderRadius: '5px',
                        cursor: 'pointer',
                        background: isSelected ? `${d.color}18` : 'transparent',
                        border: isSelected ? `1.5px solid ${d.color}50` : '1.5px solid transparent',
                        boxShadow: isSelected ? `0 1px 4px ${d.color}20` : 'none',
                        transition: 'background 0.15s, border 0.15s',
                      }}
                    >
                      <span style={{
                        fontWeight: 700, fontSize: '0.73rem',
                        color: isSelected ? d.color : FPGA.textLight,
                        minWidth: '62px',
                        fontFamily: '"JetBrains Mono", monospace',
                      }}>{lv.name}</span>
                      <span style={{ fontSize: '0.7rem', color: isSelected ? FPGA.text : FPGA.textLight }}>{lv.desc}</span>
                      {isSelected && (
                        <span style={{
                          marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 700,
                          color: d.color, fontFamily: '"JetBrains Mono", monospace',
                          background: `${d.color}12`, padding: '1px 5px', borderRadius: '3px',
                        }}>선택됨</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 선택 등급 기반 검증 요구사항 비교표 */}
        <div style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', boxShadow: shadow.table }}>
          <table style={{ width: '100%', fontSize: '0.76rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 10px', background: FPGA.dark, color: '#fff', textAlign: 'left', fontWeight: 600, width: '12%' }}>검증 항목</th>
                {DOMAIN_META.map(d => (
                  <th key={d.key} style={{ padding: '12px 10px', background: d.thColor, color: '#fff', textAlign: 'left', fontWeight: 600, width: '29%' }}>
                    {d.domain} <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 400, opacity: 0.85 }}>{sel[d.key]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROW_KEYS.map(({ key, label }, i) => (
                <tr key={key}>
                  <td style={{ padding: '11px 10px', fontWeight: 700, color: FPGA.dark, background: FPGA.bgAlt, borderBottom: `1px solid ${FPGA.border}`, fontSize: '0.73rem' }}>{label}</td>
                  {DOMAIN_META.map((d, di) => (
                    <td key={d.key} style={{
                      padding: '11px 10px', color: FPGA.text, borderBottom: `1px solid ${FPGA.border}`,
                      background: i % 2 === 0 ? FPGA.white : ['#F8FAFF', '#F8FFF8', '#FAF8FF'][di],
                    }}>
                      {VER_LOOKUP[d.key][sel[d.key]][key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}

/* ── V-Model 툴 데이터 ── */
type VTool = { name: string; vendor: string; vendorType: 'siemens' | 'synopsys' | 'cadence' | 'vendor' | 'other'; desc: string };
type VStageKey = 'requirements' | 'architecture' | 'rtl' | 'static' | 'simulation' | 'system_vv';

const V_MODEL_TOOLS: Record<VStageKey, { label: string; color: string; tools: VTool[] }> = {
  requirements: {
    label: '요구사항 정의', color: '#4A6FA5',
    tools: [
      { name: 'ReqTracer', vendor: 'Siemens', vendorType: 'siemens', desc: '요구사항 추적·감사 — HDL까지 양방향 트레이서빌리티, DO-254/ISO 26262 증적' },
      { name: 'IBM DOORS / Jama', vendor: '기타', vendorType: 'other', desc: '업계 표준 요구사항 관리 플랫폼 (인허가 패키지 연동)' },
    ],
  },
  architecture: {
    label: 'Architecture 설계', color: '#4A6FA5',
    tools: [
      { name: 'Catapult HLS', vendor: 'Siemens', vendorType: 'siemens', desc: 'C++/SystemC → RTL 고수준 합성 및 사전 커버리지 검증' },
      { name: 'HDL Designer', vendor: 'Siemens', vendorType: 'siemens', desc: '블록 다이어그램 기반 설계 캡처 → HDL 자동 생성' },
      { name: 'Vitis HLS', vendor: 'AMD', vendorType: 'vendor', desc: 'C/C++ → AMD FPGA RTL 합성' },
      { name: 'HDL Coder', vendor: 'MathWorks', vendorType: 'other', desc: 'MATLAB/Simulink 모델 → 합성 가능 VHDL/Verilog 생성' },
    ],
  },
  rtl: {
    label: 'RTL 상세 설계 & 구현', color: '#8B6FA5',
    tools: [
      { name: 'Questa Developer', vendor: 'Siemens', vendorType: 'siemens', desc: 'HDL 통합 개발 환경 (고급 코드 분석 · 프로젝트 관리)' },
      { name: 'Precision RTL / Hi-Rel', vendor: 'Siemens', vendorType: 'siemens', desc: '벤더 독립 FPGA 합성 — Hi-Rel은 안전 계통 (DO-254/방산) 전용' },
      { name: 'Synplify Pro/Premier', vendor: 'Synopsys', vendorType: 'synopsys', desc: '업계 표준 FPGA 합성 — AMD/Intel/Microchip/Lattice 지원' },
      { name: 'Vivado / Quartus / Libero', vendor: 'AMD · Intel · Microchip', vendorType: 'vendor', desc: '벤더 공식 합성·P&R·STA 통합 환경' },
    ],
  },
  static: {
    label: '정적 분석 (Lint · CDC · RDC)', color: '#4A6FA5',
    tools: [
      { name: 'Questa Lint', vendor: 'Siemens', vendorType: 'siemens', desc: 'RTL 코딩 규칙 검증 — DO-254/ISO 26262/STARC 체크셋 내장' },
      { name: 'Questa CDC', vendor: 'Siemens', vendorType: 'siemens', desc: 'Clock Domain Crossing 구조·형식 분석 + 동기화 어서션 자동 생성' },
      { name: 'Questa RDC', vendor: 'Siemens', vendorType: 'siemens', desc: '리셋 도메인 크로싱 형식 검증 (ML 기반 제약 자동 생성)' },
      { name: 'Questa Check X', vendor: 'Siemens', vendorType: 'siemens', desc: 'X 전파 오류 형식 검증 — 테스트벤치 없이 자동 분석' },
      { name: 'VC SpyGlass Lint/CDC', vendor: 'Synopsys', vendorType: 'synopsys', desc: '형식 기반 RTL 정적 분석 플랫폼 — 노이즈 최소화 설계' },
      { name: 'ALINT-PRO', vendor: 'Aldec', vendorType: 'other', desc: 'RTL Lint + CDC/RDC — Vivado/Quartus/Libero 네이티브 연동' },
    ],
  },
  simulation: {
    label: '기능 시뮬레이션 & 커버리지', color: '#5B8C5A',
    tools: [
      { name: 'QuestaSim', vendor: 'Siemens', vendorType: 'siemens', desc: '멀티언어(VHDL/SV/SystemC) 지원, UVM 완전 통합, 고급 파형·커버리지 디버깅 환경' },
      { name: 'Questa Increase Coverage', vendor: 'Siemens', vendorType: 'siemens', desc: 'Formal 기반 자동 커버리지 클로저 — 테스트벤치 없이 미도달 커버리지 자동 보완' },
      { name: 'Questa Verify Property', vendor: 'Siemens', vendorType: 'siemens', desc: 'SVA/PSL 속성 기반 Formal 검증 — 테스트벤치 없이 설계 의도 위반 탐지' },
      { name: 'Xcelium Simulator', vendor: 'Cadence', vendorType: 'cadence', desc: '병렬 컴파일 엔진 기반 고속 시뮬레이션, 대용량 SoC·FPGA 회귀검증에 최적화' },
      { name: 'VCS', vendor: 'Synopsys', vendorType: 'synopsys', desc: '컴파일 언어 기반 고속 시뮬레이션, 대규모 회귀 배치 처리 및 메모리 효율 우수' },
      { name: 'Riviera-PRO', vendor: 'Aldec', vendorType: 'other', desc: '멀티언어(VHDL/SV/SystemC) 시뮬레이션, OSVVM·UVVM 등 VHDL 검증 라이브러리 강점' },
    ],
  },
  system_vv: {
    label: '시스템 검증 & 인허가', color: '#5B8C5A',
    tools: [
      { name: 'Questa OneSpin Equivalent FPGA', vendor: 'Siemens', vendorType: 'siemens', desc: '합성·P&R 후 RTL↔Netlist 등가성 검증 (인허가 필수 증적)' },
      { name: 'Questa Analyze Fault', vendor: 'Siemens', vendorType: 'siemens', desc: '고장 주입 + 형식 검증 — ISO 26262 / IEC 61508 안전 목표 분석' },
      { name: 'JasperGold', vendor: 'Cadence', vendorType: 'cadence', desc: '앱 기반 형식 검증 플랫폼 (연결성·보안·CSR·프로토콜·커버리지)' },
      { name: 'VC Formal', vendor: 'Synopsys', vendorType: 'synopsys', desc: '형식 검증 플랫폼 (속성·등가성·고장 분석·커버리지)' },
    ],
  },
};

const VENDOR_COLOR: Record<VTool['vendorType'], string> = {
  siemens: '#38aa4b',
  synopsys: '#511a58',
  cadence: '#4d4c2f',
  vendor: '#62597a',
  other: '#718096',
};

const VENDOR_LABEL: Record<VTool['vendorType'], string> = {
  siemens: 'SiemensEDA',
  synopsys: 'Synopsys',
  cadence: 'Cadence',
  vendor: 'Vendor',
  other: 'Other',
};

/* ── V-Model 인터랙티브 슬라이드 ── */
function VModelSlide() {
  const [selected, setSelected] = useState<VStageKey | null>(null);
  const sel = selected ? V_MODEL_TOOLS[selected] : null;
  const cardClick = (key: VStageKey) => setSelected(prev => prev === key ? null : key);

  // 단계 카드: 굵은 선 없이 그림자만으로 입체감, 선택시 테두리만 강조
  const stageCard = (key: VStageKey, x: number, y: number, w: number, h: number, color: string) => {
    const isSel = selected === key;
    return (
      <g key={key} onClick={() => cardClick(key)} style={{ cursor: 'pointer' }} filter="url(#vShadow)">
        <rect x={x} y={y} width={w} height={h} rx="10"
          fill="white"
          stroke={color}
          strokeWidth={isSel ? 2.8 : 1.2}
        />
      </g>
    );
  };

  // 단계 텍스트 (pointerEvents none — 클릭은 상위 rect가 처리)
  const stageText = (key: VStageKey, x: number, y: number, label: string, sub: string, color: string) => (
    <g key={`txt-${key}`} style={{ pointerEvents: 'none' }}>
      <text x={x + 14} y={y + 27} fill="#2B4570" fontSize="13" fontWeight="700" fontFamily="Pretendard, sans-serif">{label}</text>
      <text x={x + 14} y={y + 45} fill="#718096" fontSize="10" fontFamily="JetBrains Mono, monospace">{sub}</text>
      {selected === key && (
        <text x={x + w_map[key] - 8} y={y + 14} textAnchor="end" fill={color} fontSize="9" fontFamily="JetBrains Mono, monospace">▼ 툴 보기</text>
      )}
    </g>
  );

  const w_map: Record<VStageKey, number> = {
    requirements: 240, architecture: 240, rtl: 240,
    static: 300, simulation: 260, system_vv: 260,
  };

  // 좌측 개발 단계 x좌표
  const LX = [30, 170, 430];   // requirements, architecture, rtl(centered: 430+120=550)
  const LY = [12, 120, 228];
  // 우측 검증 단계
  const RX = [830, 680];        // system_vv, simulation
  const RY = [12, 120];

  return (
    <section data-background-color={slideBg}>
      <SlideHeader
        title="FPGA 개발 V-Model"
        subtitle="Development & Verification Lifecycle — 카드를 클릭하면 관련 툴을 확인할 수 있습니다"
      />

      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

        {/* ── SVG V-Model (viewBox 세로 압축) ── */}
        <div style={{ width: '100%' }}>
          {/* viewBox 높이를 RTL 카드 하단(y=286)까지만으로 제한 — 정적분석 배지는 HTML로 분리 */}
          <svg viewBox="0 0 1120 295" style={{ width: '100%', height: 'auto' }}>
            <defs>
              <filter id="vShadow" x="-12%" y="-12%" width="124%" height="148%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#2B4570" floodOpacity="0.14" />
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#2B4570" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* V자 경로선 */}
            <polyline points="150,32 310,132 560,232 810,132 970,32"
              fill="none" stroke="#CBD5E0" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.6" />

            {/* 대응 점선 */}
            {([
              { x1: 270, y1: 32, x2: 830, y2: 32 },
              { x1: 410, y1: 132, x2: 680, y2: 132 },
            ] as { x1: number; y1: number; x2: number; y2: number }[]).map((l, i) => (
              <g key={i}>
                <line {...l} stroke="#CBD5E0" strokeWidth="1.2" strokeDasharray="5,3" />
                <polygon points={`${l.x2 - 5},${l.y2 - 3} ${l.x2},${l.y2} ${l.x2 - 5},${l.y2 + 3}`} fill="#CBD5E0" />
              </g>
            ))}

            {/* 좌측 개발 단계 카드 */}
            {stageCard('requirements', LX[0], LY[0], 240, 58, '#4A6FA5')}
            {stageCard('architecture', LX[1], LY[1], 240, 58, '#4A6FA5')}
            {stageCard('rtl', LX[2], LY[2], 240, 58, '#8B6FA5')}

            {/* 좌측 텍스트 */}
            {stageText('requirements', LX[0], LY[0], '요구사항 정의', 'Requirements Specification', '#4A6FA5')}
            {stageText('architecture', LX[1], LY[1], 'Architecture 설계', 'High-Level Design', '#4A6FA5')}
            {stageText('rtl', LX[2], LY[2], 'RTL 상세 설계 & 구현', 'Detailed Design & Coding', '#8B6FA5')}

            {/* 우측 검증 단계 카드 */}
            {stageCard('system_vv', RX[0], RY[0], 260, 58, '#5B8C5A')}
            {stageCard('simulation', RX[1], RY[1], 260, 58, '#5B8C5A')}

            {/* 우측 텍스트 */}
            {stageText('system_vv', RX[0], RY[0], '시스템 검증 & 인허가', 'System V&V & Qualification', '#5B8C5A')}
            {stageText('simulation', RX[1], RY[1], '기능 시뮬레이션 & 커버리지', 'Functional Verification', '#5B8C5A')}

            {/* RTL → 정적분석 화살표 (SVG 하단 끝까지만) */}
            <line x1="550" y1="286" x2="550" y2="293" stroke="#4A6FA5" strokeWidth="1.8" />

            {/* 방향 라벨 */}
            <text x="155" y="110" textAnchor="middle" fill="#4A6FA5" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace" opacity="0.45">DEVELOPMENT ↓</text>
            <text x="975" y="110" textAnchor="middle" fill="#5B8C5A" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace" opacity="0.45">↑ VERIFICATION</text>
            <text x="550" y="24" textAnchor="middle" fill="#A0AEC0" fontSize="9" fontFamily="JetBrains Mono, monospace">요구사항 ↔ 시스템 검증</text>
            <text x="550" y="124" textAnchor="middle" fill="#A0AEC0" fontSize="9" fontFamily="JetBrains Mono, monospace">설계 ↔ 기능 검증</text>
          </svg>
        </div>

        {/* 정적 분석 배지 — SVG 밖 HTML 요소로 분리하여 겹침 방지 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            onClick={() => cardClick('static')}
            style={{
              cursor: 'pointer',
              padding: '7px 28px',
              borderRadius: '999px',
              background: 'rgba(74,111,165,0.07)',
              border: `${selected === 'static' ? '2px' : '1.5px'} ${selected === 'static' ? 'solid' : 'dashed'} #4A6FA5`,
              boxShadow: selected === 'static' ? shadow.card : '0 2px 6px rgba(74,111,165,0.12)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4A6FA5' }}>
              정적 분석 · Lint · CDC · RDC
            </div>
            <div style={{ fontSize: '0.68rem', color: FPGA.textLight, fontFamily: '"JetBrains Mono", monospace' }}>
              Cross-cutting — RTL 설계 후 합성 전 단계에 상시 적용
            </div>
          </div>
        </div>

        {/* ── 툴 패널 ── */}
        {sel ? (
          <div style={{
            width: '100%', borderRadius: '10px', overflow: 'hidden',
            border: `1px solid ${sel.color}30`, boxShadow: shadow.card,
          }}>
            <div style={{
              padding: '8px 14px', background: sel.color,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>{sel.label} — 관련 툴</span>
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.68rem', fontFamily: '"JetBrains Mono", monospace' }}>다시 클릭하여 닫기</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: FPGA.white }}>
              {sel.tools.map((t, i) => (
                <div key={t.name} style={{
                  padding: '9px 11px',
                  borderBottom: i < sel.tools.length - 3 ? `1px solid ${FPGA.border}` : 'none',
                  borderRight: (i + 1) % 3 !== 0 ? `1px solid ${FPGA.border}` : 'none',
                  background: Math.floor(i / 3) % 2 === 0 ? FPGA.white : '#FAFBFD',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '1px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: FPGA.dark }}>{t.name}</span>
                    <span style={{
                      fontSize: '0.58rem', fontWeight: 700, padding: '1px 4px', borderRadius: '3px',
                      background: `${VENDOR_COLOR[t.vendorType]}15`, color: VENDOR_COLOR[t.vendorType],
                      border: `1px solid ${VENDOR_COLOR[t.vendorType]}30`,
                      fontFamily: '"JetBrains Mono", monospace', whiteSpace: 'nowrap',
                    }}>{VENDOR_LABEL[t.vendorType]}</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: FPGA.textLight, lineHeight: 1.35 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            width: '100%', padding: '10px 16px', borderRadius: '8px',
            background: FPGA.bgAlt, border: `1px dashed ${FPGA.border}`,
            textAlign: 'center', fontSize: '0.76rem', color: FPGA.textLight,
          }}>
            V-Model 카드 또는 정적 분석 배지를 클릭하면 해당 단계의 EDA 툴을 확인할 수 있습니다
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Day 01 — Safety-Critical FPGA 개발 프로세스 및 인허가 요건 섹션 (4 슬라이드)
 */
export default function FpgaProcessSlides() {
  return (
    <>
      {/* ── 슬라이드: 원전 FPGA의 특수성 ── */}
      <section data-background-color={slideBg}>
        <SlideHeader
          title="Safety-Critical FPGA의 특수성"
          subtitle="Why Safety-Critical FPGA is Different"
        />

        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={styles.grid2}>
            <InfoCard icon="⚛️" label="Safety-Critical System" variant="warning">
              <p style={{ margin: 0, lineHeight: 1.9 }}>
                Safety-Critical FPGA는 <strong style={styles.keyPoint}>안전 등급(Safety Class)</strong>에 따라
                설계·검증·인허가 요구사항이 결정됩니다.
                일반 산업용 FPGA와 근본적으로 다른 엄격한 기준이 적용됩니다.
              </p>
            </InfoCard>

            <InfoCard icon="📐" label="도메인별 규제 프레임워크">
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 2.1 }}>
                <span style={{ fontWeight: 700, color: FPGA.primary }}>원전</span>{' '}
                <strong>IEC 62566</strong> — FPGA 개발 수명주기 &nbsp;
                <strong>IEEE 603</strong> — 안전 계통 설계 기준<br />
                <span style={{ fontWeight: 700, color: '#5B8C5A' }}>항공</span>{' '}
                <strong>DO-254</strong> — 항공 전자 하드웨어 설계 보증<br />
                <span style={{ fontWeight: 700, color: '#8B6FA5' }}>차량</span>{' '}
                <strong>ISO 26262</strong> — 자동차 기능 안전 (Part 5: 하드웨어)<br />
                <span style={{ fontWeight: 700, color: FPGA.textLight }}>공통</span>{' '}
                <strong>IEEE 1012</strong> — V&V 프로세스 &nbsp;
                <strong>IEC 61508</strong> — 기능 안전 모체 표준
              </p>
            </InfoCard>
          </div>

          <div style={{
            width: '100%',
            background: `linear-gradient(135deg, ${FPGA.dangerBg}, rgba(229, 62, 62, 0.04))`,
            border: `1px solid ${FPGA.danger}20`,
            borderRadius: '14px',
            padding: '1.4rem 1.8rem',
            boxShadow: shadow.card,
          }}>
            <p style={{ margin: 0, fontSize: '0.98rem', color: FPGA.text, lineHeight: 1.8 }}>
              <strong style={{ color: FPGA.danger }}>핵심:</strong>{' '}
              "동작하면 된다"가 아니라, <strong>"검증 가능하고 추적 가능해야 한다"</strong>가 Safety-Critical FPGA의 기본 원칙입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 슬라이드: 도메인별 안전 등급 분류 ── */}
      <SafetyClassificationSlide />

      {/* ── 슬라이드: FPGA 개발 V-Model ── */}
      <VModelSlide />

      {/* ── 슬라이드: V&V 절차 개요 ── */}
      <section data-background-color={slideBg}>
        <SlideHeader
          title="V&V(Verification & Validation) 절차"
          subtitle="IEEE 1012 / DO-254 / ISO 26262 공통 개념"
        />

        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.2rem' }}>
          <div style={styles.grid2}>
            <div style={{ ...styles.card, borderLeft: `4px solid ${FPGA.primary}` }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: FPGA.primary, marginBottom: '0.6rem' }}>
                Verification (검증)
              </div>
              <p style={{ fontSize: '0.92rem', color: FPGA.text, lineHeight: 1.7, margin: 0 }}>
                "Are we building the product <strong>right</strong>?"<br />
                각 단계의 산출물이 해당 단계의 입력 요구사항을 올바르게 충족하는지 확인하는 과정
              </p>
              <div style={{
                marginTop: '0.8rem', padding: '0.75rem 0.9rem',
                background: FPGA.primaryBg, borderRadius: '7px',
                fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.7,
              }}>
                <strong style={{ color: FPGA.primary, fontSize: '0.72rem' }}>실무 예시</strong><br />
                • UART 보드레이트 분주 로직이 설계 명세서의 수식과 일치하는지 시뮬레이션으로 확인<br />
                • Lint: 비동기 리셋 신호가 클록 도메인 경계에서 메타스테이블 경로를 만드는지 검사<br />
                • Formal: 워치독 타이머가 모든 입력 조건에서 N 클록 이내에 반드시 리셋되는지 증명
              </div>
              <div style={{ marginTop: '0.7rem' }}>
                <span style={styles.tag}>Lint</span>
                <span style={styles.tag}>CDC</span>
                <span style={styles.tag}>Simulation</span>
                <span style={styles.tag}>Formal</span>
              </div>
            </div>

            <div style={{ ...styles.card, borderLeft: `4px solid ${FPGA.accent}` }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: FPGA.accent, marginBottom: '0.6rem' }}>
                Validation (확인)
              </div>
              <p style={{ fontSize: '0.92rem', color: FPGA.text, lineHeight: 1.7, margin: 0 }}>
                "Are we building the <strong>right</strong> product?"<br />
                최종 산출물이 사용자의 원래 요구사항과 의도된 용도에 부합하는지 확인하는 과정
              </p>
              <div style={{
                marginTop: '0.8rem', padding: '0.75rem 0.9rem',
                background: `rgba(232, 145, 58, 0.07)`, borderRadius: '7px',
                fontSize: '0.78rem', color: FPGA.text, lineHeight: 1.7,
              }}>
                <strong style={{ color: FPGA.accent, fontSize: '0.72rem' }}>실무 예시</strong><br />
                • 실제 보드에 비트스트림을 올리고 비상 정지 신호 입력 시 50 ms 이내 출력 발생 여부 확인<br />
                • 항공: 완성된 FPGA를 탑재한 항법 장비를 기준 좌표와 대조해 위치 오차 ±10 m 이내 검증<br />
                • 차량: ABS 제어 FPGA 탑재 후 실제 노면에서 제동 거리가 안전 요구사항 충족 여부 확인
              </div>
              <div style={{ marginTop: '0.7rem' }}>
                <span style={styles.tag}>System Test</span>
                <span style={styles.tag}>V&V Report</span>
                <span style={styles.tag}>Qualification / 인허가</span>
              </div>
            </div>
          </div>

          <div style={{
            width: '100%',
            background: `linear-gradient(135deg, rgba(74,111,165,0.05), rgba(232,145,58,0.05))`,
            border: `1px solid ${FPGA.border}`,
            borderRadius: '10px',
            padding: '1.1rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            boxShadow: shadow.card,
          }}>
            <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>💡</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.88rem', color: FPGA.text, lineHeight: 1.7 }}>
              <div>
                <strong style={{ color: FPGA.primary }}>Verification</strong>은 <em>"설계가 명세대로 구현되었는가?"</em> — 코드·로직 레벨의 정합성을 확인하는 내부 활동
              </div>
              <div>
                <strong style={{ color: FPGA.accent }}>Validation</strong>은 <em>"실제 환경에서 요구사항을 만족하는가?"</em> — 완성된 시스템이 사용자 의도에 부합하는지 확인하는 최종 활동
              </div>
            </div>
          </div>

        </div>{/* flex:1 래퍼 끝 */}
      </section>
    </>
  );
}
