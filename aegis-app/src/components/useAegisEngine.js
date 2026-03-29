import { useState, useEffect } from 'react';

const b64DecodeUnicode = (str) => {
  try {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (e) {
    return str;
  }
};

export function useAegisEngine() {
  const [nodes, setNodes] = useState([]);
  const [dupInfo, setDupInfo] = useState({ dupNodes: new Set(), dupSns: {} });
  const [schemaConfig, setSchemaConfig] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sleepers, setSleepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const [nodeRes, schemaRes, logsRes] = await Promise.all([
          fetch('/node_registry.csv'),
          fetch('/schema_config.csv'),
          fetch('/system_logs.csv')
        ]);

        if (!nodeRes.ok || !schemaRes.ok || !logsRes.ok) {
          throw new Error(`Failed to fetch datasets from proxy. Ensure the python server (python -m http.server 8000) is running in the root folder c:\\AEGIS. Status Codes: Node(${nodeRes.status}), Schema(${schemaRes.status}), Logs(${logsRes.status})`);
        }

        const nodeCsv = await nodeRes.text();
        const schemaCsv = await schemaRes.text();
        const logsCsv = await logsRes.text();

        parseData(nodeCsv, schemaCsv, logsCsv);
      } catch (err) {
        console.error('AEGIS Engine Error:', err);
        setError(err.message || 'Failed to connect to backend telemetry server on port 8000.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  function parseData(nodeCsv, schemaCsv, logsCsv) {
    // 1. Nodes
    const loadedNodes = [];
    const snMap = {};
    const dupNodeSet = new Set();
    const dupSnsMap = {};
    
    nodeCsv.split('\n').filter(l => l.trim().length > 0).slice(1).forEach(line => {
      const parts = line.split(',');
      if (parts.length < 3) return;
      const uuid = parseInt(parts[0], 10);
      const ua = parts[1];
      const infectedStr = parts[2].trim().toLowerCase();
      const infected = infectedStr === 'true' ? 1 : 0;
      
      const b64Parts = ua.split(' ');
      const b64Token = b64Parts[b64Parts.length - 1];
      const decodedSN = b64DecodeUnicode(b64Token);
      
      let snNum = 0;
      if (decodedSN.startsWith('SN-')) snNum = parseInt(decodedSN.replace('SN-', ''), 10);
      
      loadedNodes.push({ uuid, b64Token, decodedSN, snNum, infected });
      
      if (!snMap[snNum]) snMap[snNum] = [];
      snMap[snNum].push(uuid);
    });

    for (const sn in snMap) {
      if (snMap[sn].length > 1) {
        dupSnsMap[sn] = snMap[sn];
        snMap[sn].forEach(id => dupNodeSet.add(id));
      }
    }
    
    // 2. Schema
    const loadedSchema = schemaCsv.split('\n').filter(l => l.trim().length > 0).slice(1).map(line => {
      const parts = line.split(',');
      return { ver: parseInt(parts[0], 10), t_start: parseInt(parts[1], 10), col: parts[2].trim() };
    });

    // 3. Logs
    const loadedLogs = [];
    const nodeStats = {};
    logsCsv.split('\n').filter(l => l.trim().length > 0).slice(1).forEach(line => {
      const p = line.split(',');
      const logObj = {
        log_id: parseInt(p[0], 10),
        node_id: parseInt(p[1], 10),
        status: p[2].trim(),
        http_code: parseInt(p[3], 10),
        resp_time: parseInt(p[4], 10)
      };
      loadedLogs.push(logObj);

      if (!nodeStats[logObj.node_id]) {
        nodeStats[logObj.node_id] = { sum: 0, count: 0, errors: 0 };
      }
      nodeStats[logObj.node_id].sum += logObj.resp_time;
      nodeStats[logObj.node_id].count++;
      if (logObj.http_code !== 200) nodeStats[logObj.node_id].errors++;
    });

    const nodeArr = Object.keys(nodeStats).map(id => ({
      id: parseInt(id, 10),
      avg: nodeStats[id].sum / nodeStats[id].count,
      errPct: (nodeStats[id].errors / nodeStats[id].count) * 100
    })).sort((a,b) => b.avg - a.avg);

    setNodes(loadedNodes);
    setDupInfo({ dupNodes: dupNodeSet, dupSns: dupSnsMap });
    setSchemaConfig(loadedSchema);
    setLogs(loadedLogs);
    setSleepers(nodeArr.slice(0, 15));
  }

  return { nodes, dupInfo, schemaConfig, logs, sleepers, loading, error };
}
