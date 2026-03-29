import React from 'react';
import StatsRow from './StatsRow';

export default function OverviewView({ nodes, dupInfo, sleepers }) {
  const maxAvg = Math.max(...sleepers.map(n => n.avg));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="panel" style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: 'bold', color: 'var(--clean)' }}>SYSTEM OVERVIEW</div>
        </div>
        <StatsRow nodes={nodes} dupInfo={dupInfo} />
      </div>

      <div className="panel" style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: 'bold', color: 'var(--clean)' }}>◈ SLEEPER HEATMAP</div>
          <div className="pbadge-a" style={{ fontSize: '9px', padding: '3px 8px', border: '1px solid var(--amber)', borderRadius: '3px', color: 'var(--amber)', background: 'rgba(245, 158, 11, 0.1)', fontWeight: 'bold' }}>ANOMALOUS API RESPONSE TIMES DETECTED</div>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1.5px', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>TOP 15 HIDDEN MALWARE SLEEPERS (HTTP ERRORS VS OPERATIONAL JSON)</div>
          <div>
            {sleepers.map(node => {
              const isAnomaly = node.avg > 230;
              const w = Math.max(10, (node.avg / maxAvg) * 100);
              let barColor = 'rgba(56, 189, 248, 0.4)';
              if (node.avg > 240) barColor = 'rgba(244, 63, 94, 0.8)';
              else if (node.avg > 220) barColor = 'rgba(245, 158, 11, 0.8)';

              return (
                <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '90px', fontSize: '10px', color: 'var(--text-dim)', textAlign: 'right' }}>NODE-{node.id.toString().padStart(3, '0')}</div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: `${w}%`, background: barColor, color: '#fff', fontSize: '13px', fontFamily: 'VT323',
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px', height: '24px', borderRadius: '3px',
                      border: isAnomaly ? '1px solid var(--amber)' : '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {Math.round(node.avg)}ms
                    </div>
                    <span style={{ fontSize: '10px', color: isAnomaly ? 'var(--red)' : 'var(--text-dim)', fontWeight: 'bold' }}>
                      {node.errPct > 0 ? `(${node.errPct.toFixed(1)}% HTTP ERR)` : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-dim)', borderTop: '1px solid var(--border)', paddingTop: '12px', lineHeight: '1.6' }}>
        <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>KEY FINDING:</span> Nodes reporting status as 
        <span style={{ color: 'var(--clean)', fontWeight: 'bold' }}> "OPERATIONAL"</span> in JSON payload 
        but experiencing HTTP 429 DDOS & HTTP 206 Hijacks are experiencing <span style={{ color: 'var(--red)', borderBottom: '1px solid var(--amber)' }}>anomalous latency spikes &gt; 230ms</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
