'use client';

import { useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * DO-254 based Checks 매핑 슬라이드
 * CP(Coding Practices) / DR(Design Reviews) / SS(Safe Synthesis) 카테고리
 */

type CatKey = 'CP' | 'DR' | 'SS';

interface AliasItem {
  alias: string;
  label: string;
  checks: string[];
  severity: string;
  sevColor: string;
}

const categories: Record<CatKey, { label: string; desc: string; color: string; items: AliasItem[] }> = {
  CP: {
    label: 'Coding Practices',
    desc: '코딩 스타일 및 할당 관행 — 시뮬레이션-합성 불일치, FSM 안전성, 비트폭 정합성 등',
    color: '#4A6FA5',
    items: [
      { alias: 'CP2', label: '중복 할당 금지', checks: ['concurrent_block_with_duplicate_assign', 'seq_block_has_duplicate_assign'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'CP3/4', label: '하드코딩 상수 금지', checks: ['constant_literal'], severity: 'I', sevColor: '#718096' },
      { alias: 'CP5', label: 'FSM 인코딩 일관성', checks: ['fsm_state_value_hardcoded'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'CP6', label: 'FSM 안전 전이', checks: ['fsm_with_deadend_state', 'fsm_with_unreachable_state', 'fsm_without_default_state', 'fsm_without_reset_state'], severity: 'E/W', sevColor: '#E53E3E' },
      { alias: 'CP7', label: '비트폭 정합성', checks: ['assign_width_overflow', 'assign_width_underflow', 'comparison_width_mismatch', 'expr_operands_width_mismatch'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'CP8', label: '완전한 감도 리스트', checks: ['sensitivity_list_var_missing'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'CP15', label: 'Combo 블록 NB 금지', checks: ['nonblocking_assign_in_combo_block', 'nonblocking_assign_and_delay_in_always'], severity: 'E', sevColor: '#E53E3E' },
      { alias: 'CP17', label: 'Sequential = 금지', checks: ['blocking_assign_in_seq_block'], severity: 'E', sevColor: '#E53E3E' },
      { alias: 'CP18', label: 'Blocking/NB 혼용 금지', checks: ['assigns_mixed'], severity: 'W', sevColor: '#E8913A' },
    ],
  },
  DR: {
    label: 'Design Reviews',
    desc: '설계 문서화 및 명명 규칙 — 파일 헤더, 주석 밀도, 네이밍 표준, 고유 네임스페이스 등',
    color: '#5B8C5A',
    items: [
      { alias: 'DR3', label: '고유 네임스페이스', checks: ['design_element_has_std_word', 'design_unit_name_similar', 'identifier_name_not_unique', 'var_name_duplicate'], severity: 'E', sevColor: '#E53E3E' },
      { alias: 'DR4', label: '선언 1행 1항목', checks: ['line_with_multi_decls'], severity: 'I', sevColor: '#718096' },
      { alias: 'DR5', label: '구문 1행 1항목', checks: ['line_with_multi_stmts'], severity: 'I', sevColor: '#718096' },
      { alias: 'DR8', label: '파일 라인 수 제한', checks: ['design_file_line_limit'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'DR9', label: '계층 간 신호명 일관성', checks: ['inst_port_signal_name_mismatch'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'DR10', label: '파일 헤더 요구사항', checks: ['header_field_author_invalid', 'header_field_date_invalid', 'header_missing'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'DR11', label: '주석 밀도 확보', checks: ['comment_density_low'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'DR13', label: '명명 규칙 준수', checks: ['clock_name_not_standard', 'reset_name_not_standard', 'signal_name_not_standard', 'module_name_not_standard'], severity: 'I', sevColor: '#718096' },
    ],
  },
  SS: {
    label: 'Safe Synthesis',
    desc: '합성 안전성 — 래치 추론, 조합 루프, 클록 관리, 리셋 극성, 미구동/미사용 로직 등',
    color: '#8B6FA5',
    items: [
      { alias: 'SS1', label: '묵시적 로직 금지', checks: ['feedthrough_path', 'tristate_inferred'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'SS2', label: 'Case 문 완전 명세', checks: ['case_default_missing', 'case_item_duplicate', 'case_with_x_z'], severity: 'E', sevColor: '#E53E3E' },
      { alias: 'SS3', label: '조합 피드백 루프 금지', checks: ['combo_loop', 'combo_loop_with_latch'], severity: 'E', sevColor: '#E53E3E' },
      { alias: 'SS4', label: '래치 추론 금지', checks: ['latch_inferred'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'SS6', label: '중복 구동 금지', checks: ['multi_driven_signal'], severity: 'E', sevColor: '#E53E3E' },
      { alias: 'SS10', label: '게이팅 클록 금지', checks: ['clock_gated'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'SS11', label: '내부 클록 금지', checks: ['clock_internal'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'SS12', label: '내부 리셋 금지', checks: ['async_control_is_internal'], severity: 'W', sevColor: '#E8913A' },
      { alias: 'SS17', label: '미구동/미사용 로직 금지', checks: ['undriven_signal', 'undriven_reg_data', 'unconnected_inst'], severity: 'E', sevColor: '#E53E3E' },
      { alias: 'SS18', label: '레지스터 제어성 확보', checks: ['const_reg_data', 'flop_without_control'], severity: 'W', sevColor: '#E8913A' },
    ],
  },
};

export default function DO254MappingSlide() {
  const [activeCat, setActiveCat] = useState<CatKey>('CP');
  const cat = categories[activeCat];

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="DO-254 based Checks"
          title="DO-254 카테고리 매핑"
          subtitle="Coding Practices · Design Reviews · Safe Synthesis"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {/* DO-254 개요 배너 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,111,165,0.08), rgba(139,111,165,0.14))',
            border: '1px solid rgba(139,111,165,0.25)',
            borderRadius: '10px',
            padding: '0.6rem 1rem',
            fontSize: '0.72rem',
            color: FPGA.text,
            lineHeight: 1.6,
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
          }}>
            <div style={{
              flexShrink: 0,
              background: '#8B6FA5',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.7rem',
              padding: '4px 12px',
              borderRadius: '6px',
              letterSpacing: '0.06em',
            }}>DO-254</div>
            <div>
              DO-254 goal을 활성화하면 <strong>체크 이름 대신 alias(CP·DR·SS 코드)</strong>로 위반을 관리할 수 있으며, 표준이 규정하는 심각도로 자동 오버라이드됩니다.
              <code style={{ fontFamily: 'monospace', fontSize: '0.68rem', background: '#1A2235', color: '#A8D8A8', padding: '1px 7px', borderRadius: '4px', marginLeft: '6px' }}>
                lint methodology fpga -goal release
              </code>
              설정 후 별도로 DO-254 checks를 추가 적용합니다.
            </div>
          </div>

          {/* 카테고리 탭 */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(Object.keys(categories) as CatKey[]).map((key) => {
              const c = categories[key];
              return (
                <button
                  key={key}
                  onClick={() => setActiveCat(key)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.8rem',
                    borderRadius: '10px',
                    border: activeCat === key ? `2px solid ${c.color}` : `1px solid ${FPGA.border}`,
                    background: activeCat === key
                      ? `linear-gradient(135deg, ${c.color}12, ${c.color}20)`
                      : FPGA.white,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left',
                    boxShadow: activeCat === key ? shadow.card : 'none',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: activeCat === key ? c.color : FPGA.textLight, marginBottom: '2px' }}>
                    {key}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: activeCat === key ? FPGA.dark : FPGA.textLight, fontWeight: 600 }}>
                    {c.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 선택된 카테고리 설명 */}
          <div style={{
            padding: '0.5rem 0.9rem',
            background: `${cat.color}08`,
            border: `1px solid ${cat.color}22`,
            borderLeft: `3px solid ${cat.color}`,
            borderRadius: '8px',
            fontSize: '0.72rem',
            color: FPGA.text,
            lineHeight: 1.5,
          }}>
            <strong style={{ color: cat.color }}>{activeCat} — {cat.label}:</strong> {cat.desc}
          </div>

          {/* Alias 그리드 */}
          <div style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: activeCat === 'CP' ? '1fr 1fr 1fr' : activeCat === 'DR' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr 1fr',
            gap: '0.5rem',
            alignContent: 'start',
          }}>
            {cat.items.map((item) => (
              <div key={item.alias} style={{
                background: FPGA.white,
                border: `1px solid ${cat.color}20`,
                borderTop: `3px solid ${item.sevColor}`,
                borderRadius: '10px',
                padding: '0.6rem 0.7rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.68rem', fontWeight: 800,
                    color: cat.color,
                    background: `${cat.color}12`,
                    border: `1px solid ${cat.color}28`,
                    padding: '1px 7px', borderRadius: '4px',
                  }}>{item.alias}</span>
                  <span style={{
                    width: '18px', height: '18px', borderRadius: '3px',
                    background: `${item.sevColor}18`, border: `1.5px solid ${item.sevColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.55rem', fontWeight: 800, color: item.sevColor, flexShrink: 0,
                  }}>{item.severity}</span>
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: FPGA.dark, marginBottom: '4px', lineHeight: 1.3 }}>
                  {item.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {item.checks.slice(0, 3).map((c) => (
                    <code key={c} style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.55rem', color: FPGA.textLight,
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>{c}</code>
                  ))}
                  {item.checks.length > 3 && (
                    <span style={{ fontSize: '0.55rem', color: FPGA.textLight }}>+{item.checks.length - 3} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
