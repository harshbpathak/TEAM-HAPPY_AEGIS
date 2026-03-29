import React, { useState, useMemo } from 'react';

export default function RegistryView({ nodes, dupInfo }) {
  const [filter, setFilter] = useState('');
  const [activePreset, setActivePreset] = useState('ALL');

  const displayNodes = useMemo(() => {
    let filtered = nodes;
    
    if (activePreset === 'INFECTED') filtered = filtered.filter(n => n.infected);
    else if (activePreset === 'DUP') filtered = filtered.filter(n => dupInfo.dupNodes.has(n.uuid));
    
    if (filter) {
      const q = filter.toLowerCase();
      filtered = filtered.filter(n => 
        n.uuid.toString().includes(q) || 
        n.decodedSN.toLowerCase().includes(q) ||
        n.b64Token.toLowerCase().includes(q) ||
        (n.infected && 'infected'.includes(q)) ||
        (!n.infected && 'clean'.includes(q))
      );
    }
    
    return filtered;
  }, [nodes, dupInfo, filter, activePreset]);

  return (
    <div className="panel" style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: 'bold', color: 'var(--clean)' }}>▦ ASSET REGISTRY</div>
        <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '1px', fontWeight: 'bold' }}>{nodes.length} NODES</div>
      </div>
      
      <div style={{ padding: '16px 20px', display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)' }}>
        <input 
          type="text" 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="FILTER BY UUID / SERIAL / STATUS..." 
          style={{ flex: 1, padding: '8px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px', fontFamily: 'Share Tech Mono' }}
        />
        <button onClick={() => { setActivePreset('INFECTED'); setFilter(''); }} style={{ padding: '8px 16px', background: activePreset === 'INFECTED' ? 'var(--red)' : 'rgba(244, 63, 94, 0.1)', color: activePreset === 'INFECTED' ? '#fff' : 'var(--red)', border: '1px solid var(--red)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Share Tech Mono', fontWeight: 'bold' }}>INFECTED</button>
        <button onClick={() => { setActivePreset('DUP'); setFilter(''); }} style={{ padding: '8px 16px', background: activePreset === 'DUP' ? 'var(--purple)' : 'rgba(168, 85, 247, 0.1)', color: activePreset === 'DUP' ? '#fff' : 'var(--purple)', border: '1px solid var(--purple)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Share Tech Mono', fontWeight: 'bold' }}>DUP SNs</button>
        <button onClick={() => { setActivePreset('ALL'); setFilter(''); }} style={{ padding: '8px 16px', background: activePreset === 'ALL' ? 'var(--border)' : 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Share Tech Mono', fontWeight: 'bold' }}>ALL</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '16px' }}>
          <thead>
            <tr style={{ color: 'var(--clean)', fontSize: '11px', letterSpacing: '1px', borderBottom: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <th style={{ padding: '12px' }}>UUID</th>
              <th style={{ padding: '12px' }}>B64 TOKEN</th>
              <th style={{ padding: '12px' }}>DECODED SN</th>
              <th style={{ padding: '12px' }}>SN VALUE</th>
              <th style={{ padding: '12px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {displayNodes.slice(0, 300).map(n => {
              const isDup = dupInfo.dupNodes.has(n.uuid);
              const dupSN = isDup ? Object.keys(dupInfo.dupSns).find(k => dupInfo.dupSns[k].includes(n.uuid)) : '';
              
              let rowStyle = { borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '12px' };
              if (n.infected) rowStyle.background = 'rgba(244, 63, 94, 0.05)';
              else if (isDup) rowStyle.background = 'rgba(168, 85, 247, 0.05)';

              return (
                <tr key={n.uuid} style={rowStyle}>
                  <td style={{ padding: '10px 12px', color: 'var(--text-dim)' }}>{n.uuid.toString().padStart(3, '0')}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-dim)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={n.b64Token}>{n.b64Token}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--amber)' }}>
                    {n.decodedSN}
                    {isDup && <span style={{ marginLeft: '8px', padding: '2px 6px', fontSize: '9px', background: 'rgba(168, 85, 247, 0.2)', color: 'var(--purple)', borderRadius: '2px', border: '1px solid var(--purple)' }}>DUP-{dupSN}</span>}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--cyan)' }}>{n.snNum}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 'bold' }}>
                    {n.infected ? <span style={{ color: 'var(--red)' }}>INFECTED</span> : <span style={{ color: 'var(--clean)' }}>CLEAN</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {displayNodes.length > 300 && <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-dim)', fontSize: '11px' }}>SHOWING TOP 300 OF {displayNodes.length} RESULTS</div>}
      </div>
    </div>
  );
}
