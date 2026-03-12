'use client';

export default function WorkflowDiagram() {
  return (
    <section data-background-color="var(--slide-bg)" style={{ textAlign: 'center' }}>
      <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', marginBottom: '3rem' }}>MicroBlaze 핵심 워크플로우</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '0 1rem', position: 'relative', gap: '2%' }}>
        {/* 연결 선 애니메이션: 박스 나타난 직후 연결되도록 1.5s 딜레이 */}
        <div className="auto-fade-in" style={{ animationDelay: '1.5s', position: 'absolute', top: '50px', left: '15%', right: '15%', height: '4px', backgroundColor: 'var(--accent)', zIndex: 0 }} />
        
        {/* Step 1 */}
        <div className="auto-fade-up" style={{ animationDelay: '0s', width: '32%', position: 'relative', zIndex: 1, backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.15)', borderTop: '6px solid var(--primary)' }}>
          <div style={{ fontSize: '3rem', margin: '0 auto 1rem', background: '#f8fafc', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '3px solid var(--primary)' }}>🛠️</div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 'bold' }}>1. 하드웨어 설계</h3>
          <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>Vivado IDE</p>
          <ul style={{ fontSize: '1.1rem', color: '#475569', textAlign: 'left', listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.6rem' }}>✓ Block Design 구성</li>
            <li style={{ marginBottom: '0.6rem' }}>✓ Custom IP 연동</li>
            <li style={{ marginTop: '1.2rem', color: '#0f172a', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '6px' }}>➡️ .XSA (플랫폼 추출)</li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="auto-fade-up" style={{ animationDelay: '1s', width: '32%', position: 'relative', zIndex: 1, backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.15)', borderTop: '6px solid var(--accent)' }}>
            <div style={{ fontSize: '3rem', margin: '0 auto 1rem', background: '#f8fafc', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '3px solid var(--accent)' }}>💻</div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 'bold' }}>2. 소프트웨어 개발</h3>
          <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>Vitis IDE</p>
          <ul style={{ fontSize: '1.1rem', color: '#475569', textAlign: 'left', listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.6rem' }}>✓ XSA 기반 플랫폼 생성</li>
            <li style={{ marginBottom: '0.6rem' }}>✓ BSP 및 C/C++ 코딩</li>
            <li style={{ marginTop: '1.2rem', color: '#0f172a', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '6px' }}>➡️ .ELF (실행 파일)</li>
          </ul>
        </div>

        {/* Step 3 */}
        <div className="auto-fade-up" style={{ animationDelay: '2s', width: '32%', position: 'relative', zIndex: 1, backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.15)', borderTop: '6px solid var(--primary-dark)' }}>
            <div style={{ fontSize: '3rem', margin: '0 auto 1rem', background: '#f8fafc', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '3px solid var(--primary-dark)' }}>🚀</div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 'bold' }}>3. 통합 및 구동</h3>
          <p style={{ color: 'var(--primary-dark)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>Arty A7 Board</p>
          <ul style={{ fontSize: '1.1rem', color: '#475569', textAlign: 'left', listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.6rem' }}>✓ HW Bitstream 다운로드</li>
            <li style={{ marginBottom: '0.6rem' }}>✓ SW ELF 다운로드</li>
            <li style={{ marginTop: '1.2rem', color: '#0f172a', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '6px' }}>➡️ 보드 실기 테스트</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
