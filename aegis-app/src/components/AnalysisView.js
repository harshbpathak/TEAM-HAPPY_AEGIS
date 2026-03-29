import React from 'react';

export default function AnalysisView() {
  const cards = [
    {
      title: "ANOMALY-1: HARDWARE ID CLONING",
      body: <>Multiple nodes are sharing <span style={{color:'var(--red)'}}>identical hardware serial numbers</span>.<br/>This suggests the shadow controller is <span style={{color:'var(--amber)'}}>reusing physical hardware</span> or cloning machine identities to mask malicious vectors.</>,
      eq: "count(nodes | SN_i) > 1 → CLONE ALERT"
    },
    {
      title: "ANOMALY-2: SLEEPER NODE LATENCY SPIKES",
      body: <>Log analysis shows that nodes claiming to be <span style={{color:'var(--clean)'}}>OPERATIONAL</span> in their JSON telemetry are secretly causing <span style={{color:'var(--red)'}}>API response timeouts</span> (&gt;230ms).<br/>This indicates <span style={{color:'var(--amber)'}}>background malware execution</span> stealing cycles.</>,
      eq: 'status="OPERATIONAL" ∧ avg_latency > 230ms'
    },
    {
      title: "ANOMALY-3: PROTOCOL VS PAYLOAD MISMATCH",
      body: <>While nodes report <span style={{color:'var(--clean)'}}>clean JSON status</span>, the underlying HTTP protocol returns <span style={{color:'var(--red)'}}>HTTP 429 DDOS</span> & <span style={{color:'var(--red)'}}>HTTP 206 Hijack</span> codes.<br/>The defense console must <span style={{color:'var(--amber)'}}>ignore payload claims</span> and verify protocol truths.</>,
      eq: 'JSON:OK ≠ HTTP(429|206)'
    },
    {
      title: "ANOMALY-4: SCHEMA ROTATION INJECTION",
      body: <>Schema v1 <span style={{color:'var(--cyan)'}}>(load_val)</span> rotates to Scheme v2 <span style={{color:'var(--amber)'}}>(L_V1)</span>.<br/>This mid-session column switch is triggered by <span style={{color:'var(--red)'}}>Cookie: X-Schema-Ver</span>.<br/>The controller uses this rotation window to inject false data.</>,
      eq: 'rotation_trigger(Cookie) → bypass_waf()'
    },
    {
      title: "ANOMALY-5: BASE64 IDENTITY MASKING",
      body: <>All nodes transmit: <span style={{color:'var(--cyan)'}}>AEGIS-Node/2.0 (Linux) {'{Base64}'}</span><br/>The Base64 string decodes purely to: <span style={{color:'var(--amber)'}}>SN-{'{digits}'}</span><br/>By decoding this string dynamically, we map the <span style={{color:'var(--clean)'}}>true physical machine IDs</span>.</>,
      eq: "SN = b64decode(UA.split(' ')[-1])"
    },
    {
      title: "DEFENSE ENGINE SUMMARY",
      body: <>Project AEGIS successfully aggregates inputs across <span style={{color:'var(--cyan)'}}>3 real-time datasets</span>.<br/>The <span style={{color:'var(--clean)'}}>dynamic integration</span> of nodes, telemetry logic, and schema arrays isolates the <span style={{color:'var(--red)'}}>Shadow Controller's footprint</span>.</>,
      eq: "Defense_Status = ACTIVE & ISOLATING"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ fontFamily: 'Orbitron', fontSize: '18px', color: 'var(--amber)', letterSpacing: '2px', textShadow: '0 0 10px rgba(245, 158, 11, 0.2)', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px', marginRight: '8px' }}>⚡</span> FORENSIC ANOMALY ANALYSIS — VECTORS DISCOVERED
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ color: 'var(--amber)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1.5px', marginBottom: '16px', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', paddingBottom: '8px' }}>
              {c.title}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '13px', lineHeight: '1.8', flex: 1 }}>
              {c.body}
            </div>
            <div style={{ marginTop: '20px', padding: '12px', background: '#070a10', color: 'rgba(255,255,255,0.6)', fontFamily: 'VT323', fontSize: '16px', borderLeft: '3px solid var(--border)', borderRadius: '0 4px 4px 0' }}>
              {c.eq}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
