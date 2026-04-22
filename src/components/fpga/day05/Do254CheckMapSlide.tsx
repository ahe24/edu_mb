'use client';

import { useMemo, useState } from 'react';
import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

const DAY05 = '#C05621';

type Cat = 'All' | 'CP' | 'SS';
type Row = {
  alias: string;
  label: string;
  checks: string[];
  sev: 'E' | 'W';
  day05: string;
  waiver: string;
  cat: 'CP' | 'SS';
};

const rows: Row[] = [
  { alias: 'CP15', label: 'Combo 블록 NB 금지',     checks: ['nonblocking_assign_in_combo_block', 'nonblocking_assign_and_delay_in_always'], sev: 'E', day05: 'Slide 5-P2', waiver: '금지',              cat: 'CP' },
  { alias: 'CP17', label: 'Sequential = 금지',      checks: ['blocking_assign_in_seq_block'],      sev: 'E', day05: 'Slide 5-P1', waiver: '금지',              cat: 'CP' },
  { alias: 'CP18', label: 'Blocking/NB 혼용 금지',  checks: ['assigns_mixed'],                     sev: 'W', day05: 'Slide 5-P4', waiver: '정당화 후 허용',    cat: 'CP' },
  { alias: 'CP8',  label: '완전한 감도 리스트',     checks: ['sensitivity_list_var_missing'],      sev: 'W', day05: 'Slide 6-R1', waiver: '수정 권장',         cat: 'CP' },
  { alias: 'SS3',  label: '조합 피드백 루프 금지',  checks: ['combo_loop', 'combo_loop_with_latch'], sev: 'E', day05: 'Slide 6-R4', waiver: '금지',              cat: 'SS' },
  { alias: 'SS6',  label: '중복 구동 금지',         checks: ['multi_driven_signal'],               sev: 'E', day05: 'Slide 5-P3 · 6-R3', waiver: '금지',       cat: 'SS' },
  { alias: 'SS1',  label: '묵시적 로직 금지',       checks: ['feedthrough_path', 'tristate_inferred'], sev: 'W', day05: 'Slide 4-D', waiver: '검토 후 허용',     cat: 'SS' },
  { alias: '(unsynth)', label: '합성 불가 구문',    checks: ['DO-254 goal 일괄'],                  sev: 'E', day05: 'Slide 4-A·B·C', waiver: 'tb-only 제외 금지', cat: 'SS' },
  { alias: 'SS17', label: '미구동 신호 금지',       checks: ['undriven_signal'],                   sev: 'E', day05: 'Slide 4 부차', waiver: '금지',             cat: 'SS' },
  { alias: 'SS18', label: '레지스터 제어성 확보',   checks: ['flop_without_control'],              sev: 'W', day05: 'Slide 4 부차', waiver: '설계 리뷰',        cat: 'SS' },
];

const chipMeta: Record<Cat, { label: string; count: (r: Row) => boolean; color: string }> = {
  All: { label: 'All',             count: () => true,             color: DAY05 },
  CP:  { label: 'CP · Coding',     count: (r) => r.cat === 'CP',  color: '#4A6FA5' },
  SS:  { label: 'SS · Synthesis',  count: (r) => r.cat === 'SS',  color: '#8B6FA5' },
};

export default function Do254CheckMapSlide() {
  const [cat, setCat] = useState<Cat>('All');
  const filtered = useMemo(() => rows.filter(chipMeta[cat].count), [cat]);

  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="DO-254 매핑"
          title="CP · SS 체크 매핑표"
          subtitle="Day 05 전 패턴 → DO-254 alias + Questa check id"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* 필터 칩 */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: FPGA.textLight, fontWeight: 700 }}>필터:</span>
            {(Object.keys(chipMeta) as Cat[]).map((k) => {
              const m = chipMeta[k];
              const count = rows.filter(m.count).length;
              const active = cat === k;
              return (
                <button
                  key={k}
                  onClick={() => setCat(k)}
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.7rem', fontWeight: 700,
                    color: active ? '#fff' : m.color,
                    background: active ? m.color : `${m.color}10`,
                    border: `1.5px solid ${m.color}`,
                    borderRadius: '999px',
                    padding: '3px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                    boxShadow: active ? shadow.card : 'none',
                  }}
                >{m.label} <span style={{ opacity: 0.7 }}>({count})</span></button>
              );
            })}
            <div style={{
              marginLeft: 'auto',
              fontSize: '0.66rem', color: FPGA.textLight, fontFamily: 'monospace',
            }}>
              <code style={{ fontSize: '0.66rem', background: '#1A2235', color: '#A8D8A8', padding: '2px 6px', borderRadius: '4px' }}>
                lint methodology standard -goal DO-254
              </code>
            </div>
          </div>

          {/* 표 */}
          <div style={{
            flex: 1, minHeight: 0, overflow: 'auto',
            background: FPGA.white,
            borderRadius: '10px',
            boxShadow: shadow.table,
            border: '1px solid #E2E8F0',
          }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.72rem' }}>
              <thead>
                <tr>
                  {['alias', '한글 라벨', 'Questa check', 'Sev', 'Day 05 분류', 'Waiver'].map((h, i) => (
                    <th key={h} style={{
                      background: DAY05,
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '7px 10px',
                      textAlign: 'left',
                      letterSpacing: '0.03em',
                      position: 'sticky', top: 0,
                      borderRight: i < 5 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const sevColor = r.sev === 'E' ? '#E53E3E' : '#E8913A';
                  return (
                    <tr key={r.alias} style={{
                      background: i % 2 === 0 ? FPGA.white : '#F7FAFC',
                      position: 'relative',
                    }}>
                      <td style={{ padding: '6px 10px', borderLeft: `3px solid ${sevColor}`, borderBottom: '1px solid #E2E8F0' }}>
                        <span style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.7rem', fontWeight: 800,
                          color: r.cat === 'CP' ? '#4A6FA5' : '#8B6FA5',
                          background: r.cat === 'CP' ? 'rgba(74,111,165,0.12)' : 'rgba(139,111,165,0.12)',
                          border: `1px solid ${r.cat === 'CP' ? 'rgba(74,111,165,0.30)' : 'rgba(139,111,165,0.30)'}`,
                          padding: '2px 7px', borderRadius: '4px',
                        }}>{r.alias}</span>
                      </td>
                      <td style={{ padding: '6px 10px', borderBottom: '1px solid #E2E8F0', fontWeight: 600, color: FPGA.dark }}>
                        {r.label}
                      </td>
                      <td style={{ padding: '6px 10px', borderBottom: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {r.checks.map((c) => (
                            <code key={c} style={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: '0.64rem',
                              color: FPGA.primary,
                              background: 'transparent',
                              padding: 0,
                            }}>{c}</code>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '6px 10px', borderBottom: '1px solid #E2E8F0' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center', justifyContent: 'center',
                          width: '22px', height: '22px',
                          borderRadius: '4px',
                          background: `${sevColor}18`,
                          border: `1.5px solid ${sevColor}`,
                          color: sevColor,
                          fontSize: '0.7rem', fontWeight: 800,
                          fontFamily: '"JetBrains Mono", monospace',
                        }}>{r.sev}</span>
                      </td>
                      <td style={{ padding: '6px 10px', borderBottom: '1px solid #E2E8F0', fontSize: '0.7rem', color: FPGA.text, fontFamily: 'monospace' }}>
                        {r.day05}
                      </td>
                      <td style={{ padding: '6px 10px', borderBottom: '1px solid #E2E8F0', fontSize: '0.7rem', color: FPGA.textLight }}>
                        {r.waiver === '금지' ? (
                          <span style={{ color: '#E53E3E', fontWeight: 700 }}>✗ {r.waiver}</span>
                        ) : r.waiver}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
