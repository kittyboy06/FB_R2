import { useEffect } from 'react';
import KpiStrip from './components/KpiStrip.jsx';
import FilterBar from './components/FilterBar.jsx';
import VirtualGrid from './components/VirtualGrid.jsx';
import PauseButton from './components/PauseButton.jsx';
import LayoutToggles from './components/LayoutToggles.jsx';
import pipelineBuffer from './engine/pipelineBuffer.js';
import gridEngine from './engine/gridEngine.js';
import layoutStore from './engine/layoutStore.js';

export default function App() {
  useEffect(() => {
    // Expose core engines for console inspection and E2E verification
    if (typeof window !== 'undefined') {
      window.gridEngine = gridEngine;
      window.filterStore = gridEngine.filterStore;
      window.fuzzySearch = gridEngine.fuzzySearch;
    }

    // Connect pipeline buffer flush callback to gridEngine processing pipeline
    pipelineBuffer.onFlush = (batch) => {
      gridEngine.process(batch);
    };

    // Initialize telemetry stream
    if (typeof window !== 'undefined' && window.initializeRpaStream) {
      const csvPath = `${import.meta.env.BASE_URL}rpa_database_2026.csv`;
      
      // Load 50k baseline rows into masterMap
      gridEngine.loadBaseline(csvPath);

      window.initializeRpaStream((incomingBatch) => {
        pipelineBuffer.ingest(incomingBatch);
      }, csvPath);
    }

    // Sync layout states directly on DOM after mounting has completed
    setTimeout(() => {
      layoutStore.init();
    }, 100);

    return () => {
      pipelineBuffer.onFlush = null;
    };
  }, []);

  return (
    <div className="flex-1 w-full bg-slate-950 p-6 flex flex-col gap-6">
      {/* Top Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white m-0">
            RPA OPERATOR TERMINAL
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Enterprise Control Panel | 50k Live-Streaming Telemetry Channels
          </p>
        </div>
        
        {/* Controls strip: Toggles + Pause Button */}
        <div className="flex flex-wrap items-center gap-3">
          <LayoutToggles />
          <PauseButton />
        </div>
      </header>

      {/* Live KPIs Dashboard */}
      <KpiStrip />

      {/* Dynamic Search & Categorical Filters */}
      <FilterBar />

      {/* Main Grid View Panel */}
      <div id="panel-gridWindow" className="w-full flex flex-col">
        <VirtualGrid />
      </div>

      {/* Side-by-Side Auxiliary Panels (Charts + Infrastructure Toggles) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Chart Panel */}
        <div 
          id="panel-analyticsChart"
          className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-lg flex flex-col gap-4"
        >
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              System Analytics Chart
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono uppercase">
              Operational
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-3 rounded border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Stream Ingestion</span>
              <span className="font-mono text-lg text-slate-200 mt-1">200 ms / tick</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Virtual DOM Heap</span>
              <span className="font-mono text-lg text-slate-200 mt-1">~50,000 entries</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Grid Refresh Cap</span>
              <span className="font-mono text-lg text-slate-200 mt-1">60 FPS locked</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Anomalies Detected</span>
              <span className="font-mono text-lg text-rose-400 mt-1">5% Probability</span>
            </div>
          </div>
          
          {/* Simulated chart bars */}
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-slate-500 text-[10px] uppercase font-bold">CPU Core Load Allocation</span>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500" style={{ width: '42%' }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Main Thread: 42%</span>
              <span>Virtual Memory: 18.5 MB</span>
            </div>
          </div>
        </div>

        {/* Infrastructure Nodes Panel */}
        <div 
          id="panel-infraToggles"
          className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-lg flex flex-col gap-4"
        >
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Telemetry Infrastructure Toggles
            </span>
            <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded font-mono uppercase">
              Online
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Ingest Node */}
            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-300 text-xs font-semibold">Telemetry Ingest Node</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono uppercase">Node Active</span>
            </div>

            {/* Virtualizer Thread */}
            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-300 text-xs font-semibold">Virtualizer Render Thread</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono uppercase">60 FPS Synced</span>
            </div>

            {/* DB Map Router */}
            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-300 text-xs font-semibold">O(1) Memory Router Map</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono uppercase">Active</span>
            </div>
            
            {/* Pages Sync */}
            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-slate-300 text-xs font-semibold">GitHub Pages Sync Daemon</span>
              </div>
              <span className="text-[10px] text-sky-400 font-mono uppercase">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
