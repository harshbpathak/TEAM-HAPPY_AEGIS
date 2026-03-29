import React from 'react';

export default function StatsRow({ nodes, dupInfo }) {
  const infectedCount = nodes.filter(n => n.infected).length;
  const dupCount = dupInfo.dupNodes.size;

  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', zIndex: 10, position: 'relative' }}>
      <div style={{ flex: 1, padding: '16px 24px', borderRight: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>TOTAL NODES</div>
        <div style={{ fontFamily: 'Orbitron', fontSize: '20px', marginTop: '4px', fontWeight: 'bold', color: 'var(--clean)' }}>{nodes.length || '--'}</div>
        <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px' }}>NODE_REGISTRY.CSV</div>
      </div>
      
      <div style={{ flex: 1, padding: '16px 24px', borderRight: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>INFECTED</div>
        <div style={{ fontFamily: 'Orbitron', fontSize: '20px', marginTop: '4px', fontWeight: 'bold', color: 'var(--red)' }}>{nodes.length ? infectedCount : '--'}</div>
        <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px' }}>JSON MASK: INTERNAL OVERRIDE</div>
      </div>

      <div style={{ flex: 1, padding: '16px 24px', borderRight: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>DDOS ERRORS (429)</div>
        <div style={{ fontFamily: 'Orbitron', fontSize: '20px', marginTop: '4px', fontWeight: 'bold', color: 'var(--amber)' }}>DETECTED</div>
        <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px' }}>PROTOCOL MISMATCH</div>
      </div>

      <div style={{ flex: 1, padding: '16px 24px', borderRight: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>DUP SERIAL IDs</div>
        <div style={{ fontFamily: 'Orbitron', fontSize: '20px', marginTop: '4px', fontWeight: 'bold', color: 'var(--purple)' }}>{nodes.length ? dupCount : '--'}</div>
        <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px' }}>HW ID CLONING ACTIVE</div>
      </div>
      
      <div style={{ flex: 1, padding: '16px 24px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>ACTIVE SCAN</div>
        <div style={{ fontFamily: 'Orbitron', fontSize: '20px', marginTop: '4px', fontWeight: 'bold', color: 'var(--cyan)' }}>LATENCY</div>
        <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px' }}>SLEEPER DETECTION</div>
      </div>
    </div>
  );
}
