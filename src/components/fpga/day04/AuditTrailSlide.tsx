'use client';

import { FPGA, slideBg, shadow } from '../FpgaSlideStyles';
import SlideHeader from '../SlideHeader';

/**
 * RTL ID & 감사 추적 슬라이드
 * RTL ID 구조 · status history · CI baseline diff · DO-254 요구사항
 */

const historyRows = [
  { ts: '2026-04-01 09:15', user: 'alice', from: 'uninspected', to: 'pending', reason: 'under review' },
  { ts: '2026-04-03 14:22', user: 'alice', from: 'pending', to: 'waived', reason: 'Xilinx convention DR-112' },
  { ts: '2026-04-07 11:40', user: 'bob',   from: 'waived', to: 'pending', reason: 'DAL-A re-review requested' },
  { ts: '2026-04-09 16:05', user: 'bob',   from: 'pending', to: 'bug',    reason: 'actual race detected' },
  { ts: '2026-04-12 10:00', user: 'alice', from: 'bug',     to: 'fixed',  reason: 'PR #447 merged' },
  { ts: '2026-04-15 15:30', user: 'carol', from: 'fixed',   to: 'verified', reason: 'sim + formal pass' },
];

const statusColor: Record<string, string> = {
  uninspected: '#718096',
  pending: '#E8913A',
  waived: '#4A6FA5',
  bug: '#E53E3E',
  fixed: '#48BB78',
  verified: '#48BB78',
};

const do254Req = [
  { label: 'REASON', desc: '기술적 근거 → -comment 필드 (ASCII 전용)' },
  { label: 'REVIEWER', desc: '엔지니어·독립 검증자 → -owner · -reviewer 필드' },
  { label: 'DATE', desc: '리뷰 일자 → lint_status_history.rpt에 자동 기록' },
  { label: 'TRACE', desc: '요구사항·설계문서 ID (DR-xxx, SSS-xxx) → -comment에 포함' },
];

export default function AuditTrailSlide() {
  return (
    <section data-background-color={slideBg}>
      <div className="fpga-content-wrap">
        <SlideHeader
          badge="Audit Trail"
          title="RTL ID 추적 및 감사 대응"
          subtitle="위반 생명주기 · 상태 히스토리 · CI 기준선 diff"
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '0.8rem' }}>
          {/* 좌: RTL ID 구조 + 상태 히스토리 */}
          <div style={{ flex: '1.15', display: 'flex', flexDirection: 'column', gap: '0.55rem', minWidth: 0 }}>
            {/* RTL ID 해부 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.6rem 0.8rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.35rem' }}>
                RTL ID 구조
              </div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '1.1rem', fontWeight: 800,
                textAlign: 'center', marginBottom: '0.35rem',
                letterSpacing: '0.02em',
              }}>
                <span style={{ color: '#4A6FA5' }}>2471cf09</span>
                <span style={{ color: FPGA.textLight }}>_</span>
                <span style={{ color: '#E8913A' }}>00300</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <div style={{ textAlign: 'center', fontSize: '0.64rem', color: FPGA.textLight }}>
                  <div style={{ fontWeight: 700, color: '#4A6FA5', fontSize: '0.66rem' }}>HASH</div>
                  모듈·파일·라인·신호 기반
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.64rem', color: FPGA.textLight }}>
                  <div style={{ fontWeight: 700, color: '#E8913A', fontSize: '0.66rem' }}>SEQ</div>
                  같은 체크 내 순번
                </div>
              </div>
              <div style={{
                marginTop: '0.35rem',
                fontSize: '0.62rem', color: FPGA.textLight, lineHeight: 1.5,
                background: '#F7FAFC', padding: '0.35rem 0.55rem', borderRadius: '5px',
              }}>
                <strong>안정성:</strong> 같은 모듈·신호면 재실행해도 동일 ID. 단, 라인 이동·신호 리네임 시 변경됨 → 대형 리팩토링 후 waiver 재매핑 필요.
              </div>
            </div>

            {/* 상태 히스토리 */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.6rem 0.8rem',
              boxShadow: shadow.card,
              flex: 1,
              minHeight: 0,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: FPGA.dark }}>
                  lint_status_history.rpt
                </span>
                <code style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.6rem', color: '#4A6FA5',
                  background: 'rgba(74,111,165,0.10)',
                  padding: '1px 6px', borderRadius: '3px',
                }}>id=2471cf09_00300</code>
              </div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.6rem',
                flex: 1, overflow: 'hidden',
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '95px 50px 1fr auto 1fr',
                  gap: '4px', alignItems: 'center',
                  borderBottom: `1px solid ${FPGA.border}`,
                  padding: '3px 4px',
                  fontWeight: 700, color: FPGA.textLight,
                  fontSize: '0.58rem',
                }}>
                  <span>TIMESTAMP</span><span>USER</span><span>TRANSITION</span><span></span><span>REASON</span>
                </div>
                {historyRows.map((r, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '95px 50px auto auto 1fr',
                    gap: '4px', alignItems: 'center',
                    padding: '3px 4px',
                    borderBottom: i < historyRows.length - 1 ? '1px solid #F0F4F8' : 'none',
                  }}>
                    <span style={{ color: FPGA.textLight, fontSize: '0.58rem' }}>{r.ts}</span>
                    <span style={{ color: FPGA.text, fontWeight: 600 }}>{r.user}</span>
                    <span style={{
                      color: statusColor[r.from], fontWeight: 700,
                      background: `${statusColor[r.from]}14`,
                      padding: '0 5px', borderRadius: '3px',
                      fontSize: '0.58rem',
                    }}>{r.from}</span>
                    <span style={{ color: FPGA.textLight, fontSize: '0.58rem' }}>→</span>
                    <span>
                      <span style={{
                        color: statusColor[r.to], fontWeight: 700,
                        background: `${statusColor[r.to]}14`,
                        padding: '0 5px', borderRadius: '3px',
                        fontSize: '0.58rem', marginRight: '5px',
                      }}>{r.to}</span>
                      <span style={{ fontSize: '0.58rem', color: FPGA.textLight, fontFamily: '"Pretendard", sans-serif' }}>
                        {r.reason}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 우: DO-254 요구사항 + CI diff 워크플로우 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.55rem', minWidth: 0 }}>
            {/* DO-254 waiver 4필드 */}
            <div style={{
              background: `linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.12))`,
              border: '1px solid rgba(229,62,62,0.30)',
              borderRadius: '10px',
              padding: '0.6rem 0.8rem',
              boxShadow: shadow.card,
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#E53E3E', marginBottom: '0.35rem' }}>
                DO-254 Waiver 필수 4요소
              </div>
              <div style={{ display: 'grid', gap: '0.3rem' }}>
                {do254Req.map(r => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                    <span style={{
                      fontSize: '0.62rem', fontWeight: 800,
                      color: '#E53E3E', background: 'rgba(229,62,62,0.12)',
                      border: '1px solid rgba(229,62,62,0.3)',
                      padding: '1px 6px', borderRadius: '3px',
                      flexShrink: 0, minWidth: '62px', textAlign: 'center',
                      fontFamily: '"JetBrains Mono", monospace',
                    }}>{r.label}</span>
                    <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.45 }}>
                      {r.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Waiver 명령 예시 (4필드 포함) */}
            <div style={{
              background: '#1A2235',
              border: '1px solid #2D3748',
              borderRadius: '10px',
              padding: '0.55rem 0.75rem',
              boxShadow: shadow.card,
            }}>
              <div style={{
                fontSize: '0.62rem', fontWeight: 700, color: '#6B8CC7',
                marginBottom: '0.3rem',
                fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em',
              }}>▸ 감사 대응 waiver 템플릿</div>
              <pre style={{
                margin: 0,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.62rem',
                color: '#E8E8E8',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}>
<span style={{ color: '#718096' }}># WAIVER-042 · DATE: 2026-04-03 (lint_status_history에 자동 기록)</span>{'\n'}
<span style={{ color: '#A8D8A8' }}>lint report item</span> -status waived <span style={{ color: '#F6AD55' }}>\</span>{'\n'}
  -check async_reset_active_high <span style={{ color: '#F6AD55' }}>\</span>{'\n'}
  -rtl_id 2471cf09_00300 <span style={{ color: '#F6AD55' }}>\</span>{'\n'}
  -owner alice <span style={{ color: '#F6AD55' }}>\</span>{'\n'}
  -reviewer dan <span style={{ color: '#F6AD55' }}>\</span>{'\n'}
  -comment <span style={{ color: '#FCD5A0' }}>{'{Xilinx FPGA active-high reset; DR-112, SSS-045}'}</span>
              </pre>
            </div>

            {/* CI baseline diff */}
            <div style={{
              background: FPGA.white,
              border: `1px solid ${FPGA.border}`,
              borderRadius: '10px',
              padding: '0.6rem 0.8rem',
              boxShadow: shadow.card,
              flex: 1,
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: FPGA.dark, marginBottom: '0.35rem' }}>
                CI 기준선 diff 워크플로우
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {[
                  { step: '1', text: '기준 commit에서 lint.rpt 생성 → baseline.rpt 보관', color: '#4A6FA5' },
                  { step: '2', text: 'PR commit에서 lint.rpt 생성', color: '#5B8C5A' },
                  { step: '3', text: 'lint diff current.db -refdb baseline.db → lint_incremental.rpt', color: '#E8913A' },
                  { step: '4', text: '신규 위반 0건 + waiver 증감 검토 시 merge 허용', color: '#48BB78' },
                ].map(w => (
                  <div key={w.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: `${w.color}18`, border: `1.5px solid ${w.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', fontWeight: 800, color: w.color, flexShrink: 0,
                    }}>{w.step}</div>
                    <span style={{ fontSize: '0.66rem', color: FPGA.text, lineHeight: 1.5 }}>{w.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
