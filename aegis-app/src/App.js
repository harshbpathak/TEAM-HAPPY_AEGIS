import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import OverviewView from './components/OverviewView';
import MapView from './components/MapView';
import ConsoleView from './components/ConsoleView';
import RegistryView from './components/RegistryView';
import AnalysisView from './components/AnalysisView';
import { useAegisEngine } from './components/useAegisEngine';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const engine = useAegisEngine();

  if (engine.loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clean)', fontFamily: 'Orbitron', fontSize: '24px', letterSpacing: '4px' }}>
        <style dangerouslySetInnerHTML={{__html: `@keyframes pulse { 0%, 100% { opacity: 1; text-shadow: 0 0 20px var(--clean); } 50% { opacity: 0.5; text-shadow: none; } }`}}></style>
        <div style={{ animation: 'pulse 1.5s infinite' }}>INITIALIZING AEGIS ENGINE...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OverviewView nodes={engine.nodes} dupInfo={engine.dupInfo} sleepers={engine.sleepers} />;
      case 'map':
        return <MapView nodes={engine.nodes} dupInfo={engine.dupInfo} />;
      case 'registry':
        return <RegistryView nodes={engine.nodes} dupInfo={engine.dupInfo} />;
      case 'console':
        return <ConsoleView schemaConfig={engine.schemaConfig} sleepers={engine.sleepers} />;
      case 'analysis':
        return <AnalysisView />;
      default:
        return <OverviewView nodes={engine.nodes} dupInfo={engine.dupInfo} sleepers={engine.sleepers} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />
      
      {/* Ticker Bar (persistent) */}
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ background: 'var(--amber)', color: '#000', padding: '6px 16px', fontWeight: 'bold', fontFamily: 'Share Tech Mono', letterSpacing: '1px', zIndex: 10 }}>⚠ LIVE INTEL</div>
        <div style={{ flex: 1, paddingLeft: '16px', color: 'var(--text-dim)', fontSize: '11px', letterSpacing: '1px' }}>
          <style dangerouslySetInnerHTML={{__html: `@keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}}></style>
          <div style={{ display: 'inline-block', paddingLeft: '100%', animation: 'ticker 40s linear infinite' }}>
            [CRITICAL] COMPROMISED NODES OVERRIDE INTERNAL STATUS FLAGS ◆ 
            [ANOMALY] HARDWARE ID CLONING CONFIRMED VIA BASE64 DECODE ◆ 
            [SCHEMA] DYNAMIC ROTATION DETECTED — COOKIE-CONTROLLED PAYLOAD INJECTION ◆ 
            [PATTERN] MULTIPLE "OPERATIONAL" NODES TIMING OUT — DDOS 429 ERRORS MASKED ◆ 
            [FORENSIC] SLEEPER NODES CAUSING 200ms+ LATENCY SPIKES WHILE INVISIBLE TO LOGS ◆
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
