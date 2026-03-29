import React, { useEffect, useRef, useState } from 'react';

export default function ConsoleView({ schemaConfig, sleepers }) {
  const [logs, setLogs] = useState([]);
  const logsRef = useRef(null);

  useEffect(() => {
    let baseLogs = [
      ['INFO', 'SYSTEM INITIALIZED — AEGIS Engine Online'],
      ['INFO', 'Parsing Datasets: node_registry.csv, schema_config.csv, system_logs.csv'],
      ['OK', '500 Nodes successfully indexed from registry'],
      ['WARN', 'Protocol Mismatch Analyzer actively monitoring HTTP requests'],
      ['CRIT', 'Detected Compromised Nodes overriding internal status flags'],
      ['WARN', 'Analyzing 10,000 live telemetry logs for Sleeper behavior...'],
      ['CRIT', 'SLEEPER IDENTIFIED: High API Response Time variance detected.'],
      ['INFO', 'Schema rotation confirmed at defined temporal thresholds.'],
      ['WARN', 'JSON "OPERATIONAL" payload often masks underlying DDOS 429 errors.']
    ];
    
    let buf = [];
    baseLogs.forEach((e, i) => {
      setTimeout(() => {
        const t = new Date().toISOString().split('T')[1].split('.')[0];
        buf = [...buf, { t, l: e[0], m: e[1] }];
        if (buf.length > 50) buf.shift();
        setLogs(buf);
      }, i * 600);
    });

    let q = 0;
    const intv = setInterval(() => {
      if (sleepers && sleepers.length > 0) {
        const slp = sleepers[q % sleepers.length];
        const t = new Date().toISOString().split('T')[1].split('.')[0];
        if (slp.avg > 230) {
          buf = [...buf, { t, l: 'CRIT', m: `Sleeper Node-${slp.id} active. Avg latency: ${Math.round(slp.avg)}ms. HTTP Err: ${slp.errPct.toFixed(1)}%` }];
        } else {
          buf = [...buf, { t, l: 'INFO', m: `Node-${slp.id} pinged. Normal operation.` }];
        }
        if (buf.length > 50) buf.shift();
        setLogs(buf);
      }
      q++;
    }, 2000);

    return () => clearInterval(intv);
  }, [sleepers]);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const activeSchema = schemaConfig[schemaConfig.length - 1];

  return (
    <div className="panel" style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: 'bold', color: 'var(--clean)' }}>⟨/⟩ DYNAMIC SCHEMA CONSOLE</div>
        <div className="pbadge-a" style={{ fontSize: '9px', padding: '3px 8px', border: '1px solid var(--amber)', borderRadius: '3px', color: 'var(--amber)', background: 'rgba(245, 158, 11, 0.1)', fontWeight: 'bold' }}>SCHEMA CONFIG ACTIVE</div>
      </div>
      
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '4px', padding: '12px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1.5px', marginBottom: '6px' }}>ACTIVE VERSION</div>
            <div style={{ fontFamily: 'VT323', fontSize: '24px', color: 'var(--amber)' }}>{activeSchema ? 'v' + activeSchema.ver : '--'}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '4px', padding: '12px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1.5px', marginBottom: '6px' }}>ACTIVE COLUMN</div>
            <div style={{ fontFamily: 'VT323', fontSize: '24px', color: 'var(--cyan)' }}>{activeSchema ? activeSchema.col : '--'}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '4px', padding: '12px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1.5px', marginBottom: '6px' }}>ROTATION TYPE</div>
            <div style={{ fontFamily: 'VT323', fontSize: '24px', color: 'var(--red)' }}>DYNAMIC</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '4px', padding: '12px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1.5px', marginBottom: '6px' }}>SOURCE</div>
            <div style={{ fontFamily: 'VT323', fontSize: '24px', color: 'var(--clean)' }}>schema_config</div>
          </div>
        </div>

        <div ref={logsRef} style={{ height: '300px', overflowY: 'auto', background: '#080b12', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px', lineHeight: 1.8, fontFamily: 'Share Tech Mono, monospace' }}>
          {logs.map((e, idx) => {
            let color = 'var(--clean)';
            if (e.l === 'WARN') color = 'var(--amber)';
            if (e.l === 'CRIT') color = 'var(--red)';
            if (e.l === 'OK') color = 'var(--cyan)';
            return (
              <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '2px' }}>
                <span style={{ color: 'var(--text-dim)' }}>[{e.t}]</span>
                <span style={{ color, fontWeight: 'bold', minWidth: '45px' }}>[{e.l}]</span>
                <span style={{ color: 'var(--text)' }}>{e.m}</span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(45, 212, 191, 0.05)', border: '1px solid rgba(45, 212, 191, 0.2)', borderRadius: '4px', fontSize: '11px', lineHeight: 1.6 }}>
          <div style={{ color: 'var(--text-dim)', fontWeight: 'bold', marginBottom: '8px' }}>SCHEMA VERSION MAP (schema_config.csv)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
            <div><span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>version 1</span> <span style={{ color: 'var(--text-dim)' }}>→</span> <span style={{ color: 'var(--text)' }}>[t=0] col: <span style={{ color: 'var(--clean)' }}>load_val</span></span></div>
            <div><span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>version 2</span> <span style={{ color: 'var(--text-dim)' }}>→</span> <span style={{ color: 'var(--text)' }}>[t=5000] col: <span style={{ color: 'var(--amber)' }}>L_V1</span></span></div>
            <div><span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>trigger</span> <span style={{ color: 'var(--text-dim)' }}>→</span> <span style={{ color: 'var(--text)' }}>Cookie: X-Schema-Ver</span></div>
            <div><span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>anomaly</span> <span style={{ color: 'var(--text-dim)' }}>→</span> <span style={{ color: 'var(--red)' }}>Mid-session payload rotation</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
