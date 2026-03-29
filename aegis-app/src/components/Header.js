import React, { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState('--:--:-- UTC');

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(d.toISOString().split('T')[1].split('.')[0] + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(90deg, var(--bg2), var(--bg3), var(--bg2))', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <svg width="36" height="42" viewBox="0 0 50 58" fill="none">
          <polygon points="25,2 48,14 48,44 25,56 2,44 2,14" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.9"/>
          <polygon points="25,10 40,19 40,39 25,48 10,39 10,19" fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.5"/>
          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="Orbitron" fontSize="14" fontWeight="900" fill="#38bdf8">Æ</text>
        </svg>
        <div>
          <h1 style={{ fontFamily: 'Orbitron', fontSize: '20px', fontWeight: '900', color: 'var(--clean)', textShadow: '0 0 10px rgba(56, 189, 248, 0.3)', letterSpacing: '4px' }}>AEGIS</h1>
          <p style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1.5px', marginTop: '2px' }}>NEXUS CITY CYBER-INFRASTRUCTURE DEFENSE CONSOLE</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div className="pill red" style={{ display: 'flex', gap: '6px', padding: '4px 12px', border: '1px solid var(--red)', borderRadius: '4px', fontSize: '10px', letterSpacing: '1.5px', color: 'var(--red)', background: 'rgba(244, 63, 94, 0.1)', fontWeight: 'bold', alignItems: 'center' }}>
          <div className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 6px var(--red)' }}></div>
          SHADOW CONTROLLER ACTIVE
        </div>
        <div className="pill grn" style={{ display: 'flex', gap: '6px', padding: '4px 12px', border: '1px solid var(--clean)', borderRadius: '4px', fontSize: '10px', letterSpacing: '1.5px', color: 'var(--clean)', background: 'var(--clean-glow)', fontWeight: 'bold', alignItems: 'center' }}>
          <div className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--clean)', boxShadow: '0 0 6px var(--clean)' }}></div>
          FORENSIC ENGINE LIVE
        </div>
        <div style={{ fontFamily: 'Orbitron', fontSize: '14px', color: 'var(--text)', letterSpacing: '2px' }}>{time}</div>
      </div>
    </header>
  );
}
