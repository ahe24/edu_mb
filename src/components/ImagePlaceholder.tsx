'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ImagePlaceholder({ src, label, desc, maxHeight = '400px' }: { src: string, label: string, desc: string, maxHeight?: string }) {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setStatus('success');
    img.onerror = () => setStatus('error');
    img.src = src;
  }, [src]);

  const [isEnlarged, setIsEnlarged] = useState(false);

  if (status === 'success') {
    return (
      <>
        <img 
          src={src} 
          alt={desc} 
          onClick={() => setIsEnlarged(true)}
          style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'contain', maxHeight: maxHeight, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', cursor: 'zoom-in', transition: 'transform 0.2s' }} 
        />
        {isEnlarged && typeof document !== 'undefined' && createPortal(
          <div 
            onClick={() => setIsEnlarged(false)}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out' }}
          >
            <img 
              src={src} 
              alt={desc} 
              style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'scale-down', borderRadius: '4px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }} 
            />
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <div style={{ backgroundColor: '#e2e8f0', border: '3px dashed #94a3b8', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '150px', maxHeight: maxHeight, width: '100%', padding: '1.5rem', overflow: 'hidden' }}>
      <span style={{ fontSize: '3rem' }}>📸</span>
      <p style={{ fontSize: '1.2rem', color: '#475569', fontWeight: 'bold', marginTop: '1rem' }}>{label}</p>
      <div style={{ background: '#cbd5e1', padding: '0.5rem 1rem', borderRadius: '6px', marginTop: '0.8rem', fontSize: '1rem', color: '#1e293b', fontWeight: '500' }}>
        저장 위치: <code style={{ color: '#0f172a' }}>public{src}</code>
      </div>
      <p style={{ fontSize: '1rem', color: '#64748b', textAlign: 'center', marginTop: '1rem' }}>{desc}</p>
    </div>
  );
}
