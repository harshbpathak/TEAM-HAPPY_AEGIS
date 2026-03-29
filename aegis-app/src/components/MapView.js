import React, { useEffect, useRef, useState } from 'react';

export default function MapView({ nodes, dupInfo }) {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COLS = 25, ROWS = 20;

    let mapW = canvas.offsetWidth;
    let mapH = canvas.offsetHeight;
    canvas.width = mapW * window.devicePixelRatio;
    canvas.height = mapH * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    let cellW = mapW / COLS;
    let cellH = mapH / ROWS;

    function drawMap() {
      ctx.clearRect(0, 0, mapW, mapH);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * cellW, 0); ctx.lineTo(c * cellW, mapH); ctx.stroke(); }
      for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * cellH); ctx.lineTo(mapW, r * cellH); ctx.stroke(); }

      nodes.forEach(n => {
        const col = n.uuid % COLS;
        const row = Math.floor(n.uuid / COLS);
        const cx = col * cellW + cellW / 2;
        const cy = row * cellH + cellH / 2;
        const r = Math.min(cellW, cellH) * 0.3;
        
        const isDup = dupInfo.dupNodes.has(n.uuid);
        const colorStr = isDup ? '#a855f7' : (n.infected ? '#f43f5e' : '#38bdf8');
        const glowStr = isDup ? 'rgba(168, 85, 247, 0.4)' : (n.infected ? 'rgba(244, 63, 94, 0.4)' : 'rgba(56, 189, 248, 0.2)');

        if (n.infected || isDup) {
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
          grad.addColorStop(0, glowStr);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(cx, cy, r * 3, 0, Math.PI * 2); ctx.fill();
        }

        ctx.fillStyle = colorStr;
        ctx.globalAlpha = n.infected ? 1 : 0.8;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;

        if (hoveredNode && hoveredNode.uuid === n.uuid) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(cx, cy, r + 4, 0, Math.PI * 2); ctx.stroke();
        }
      });
    }

    drawMap();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const col = Math.floor(mx / cellW);
      const row = Math.floor(my / cellH);
      const idx = row * COLS + col;
      
      if (idx >= 0 && idx < nodes.length) {
        setHoveredNode(nodes[idx]);
      } else {
        setHoveredNode(null);
      }
    };

    const handleMouseLeave = () => setHoveredNode(null);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const resizeObserver = new ResizeObserver(() => {
      mapW = canvas.offsetWidth;
      mapH = canvas.offsetHeight;
      canvas.width = mapW * window.devicePixelRatio;
      canvas.height = mapH * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      cellW = mapW / COLS;
      cellH = mapH / ROWS;
      drawMap();
    });
    resizeObserver.observe(canvas.parentElement);

    // animation loop
    let interval = setInterval(drawMap, 100);

    return () => {
      clearInterval(interval);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, [nodes, dupInfo, hoveredNode]);

  const isDupHover = hoveredNode ? dupInfo.dupNodes.has(hoveredNode.uuid) : false;
  const dupSN = isDupHover ? Object.keys(dupInfo.dupSns).find(k => dupInfo.dupSns[k].includes(hoveredNode.uuid)) : '';

  return (
    <div className="panel" style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: 'bold', color: 'var(--clean)' }}>⬡ FORENSIC CITY MAP</div>
        <div className="pbadge" style={{ fontSize: '9px', padding: '3px 8px', border: '1px solid var(--red)', borderRadius: '3px', color: 'var(--red)', background: 'rgba(244, 63, 94, 0.1)', fontWeight: 'bold' }}>COMPROMISED NODES INFILTRATED</div>
      </div>
      
      <div style={{ flex: 1, padding: '20px', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
        <canvas ref={canvasRef} style={{ flex: 1, width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', cursor: 'crosshair', minHeight: '400px' }}></canvas>
        
        <div style={{ fontSize: '11px', color: 'var(--text)', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '4px', marginTop: '12px', border: '1px solid var(--border)', minHeight: '36px', display: 'flex', alignItems: 'center' }}>
          {hoveredNode ? (
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>UUID: <span style={{ color: 'var(--cyan)' }}>{hoveredNode.uuid.toString().padStart(3, '0')}</span></span>
              <span>SERIAL: <span style={{ color: 'var(--amber)' }}>{hoveredNode.decodedSN}</span></span>
              <span>STATUS: <span style={{ color: hoveredNode.infected ? 'var(--red)' : 'var(--clean)', fontWeight: 'bold' }}>{hoveredNode.infected ? '⚠ INFECTED' : '✓ CLEAN'}</span></span>
              {isDupHover && <span style={{ color: 'var(--purple)', fontWeight: 'bold' }}>⚠ DUP SN [{dupSN}]</span>}
            </div>
          ) : 'HOVER OVER A NODE FOR FORENSIC DETAILS'}
        </div>
        
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--clean)' }}></div>CLEAN</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--red)' }}></div>INFECTED</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--purple)' }}></div>DUPLICATE SERIAL (CLONED)</div>
        </div>
      </div>
    </div>
  );
}
