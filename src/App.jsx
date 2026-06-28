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
    <div className="h-screen w-full flex flex-col bg-[#0b1326] text-[#dae2fd] overflow-hidden font-sans selection:bg-[#38bdf8]/20 select-none">
      {/* Top Header Section (Mission Control Bar) */}
      <header className="bg-[#0b1326] border-b border-slate-800 flex justify-between items-center px-4 w-full h-16 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 glow-pulse-emerald"></div>
          <h1 className="font-sans text-lg font-black text-sky-400 tracking-tighter uppercase m-0">
            FrontEndBattle 2026
          </h1>
          <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded font-mono font-bold tracking-widest">
            RPA OPERATOR TERMINAL
          </span>
        </div>
        
        {/* Controls strip: Toggles + Pause Button */}
        <div className="flex items-center gap-3">
          <LayoutToggles />
          <div className="w-px h-6 bg-slate-800 mx-1"></div>
          <PauseButton />
        </div>
      </header>

      {/* Main Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Live KPIs Dashboard */}
        <KpiStrip />

        {/* Dynamic Search & Categorical Filters */}
        <FilterBar />

        {/* Main Grid View Panel */}
        <div id="panel-gridWindow" className="w-full flex flex-col shrink-0">
          <VirtualGrid />
        </div>

        {/* Side-by-Side Auxiliary Panels (Charts + Infrastructure Toggles) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0 pb-4">
          {/* Analytics Chart Panel */}
          <div 
            id="panel-analyticsChart"
            className="bg-slate-900/60 border border-slate-800 rounded p-4 flex flex-col gap-3 card-inner-glow hover:bg-slate-900/85 transition-colors duration-200"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                System Analytics Chart
              </span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                Operational
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 flex flex-col justify-between">
                <span className="text-slate-500 text-[9px] uppercase font-bold">Stream Ingestion</span>
                <span className="font-mono text-sm text-slate-200 mt-1">200 ms / tick</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 flex flex-col justify-between">
                <span className="text-slate-500 text-[9px] uppercase font-bold">Virtual DOM Heap</span>
                <span className="font-mono text-sm text-slate-200 mt-1">~50,000 entries</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 flex flex-col justify-between">
                <span className="text-slate-500 text-[9px] uppercase font-bold">Grid Refresh Cap</span>
                <span className="font-mono text-sm text-slate-200 mt-1">60 FPS locked</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 flex flex-col justify-between">
                <span className="text-slate-500 text-[9px] uppercase font-bold">Anomalies Detected</span>
                <span className="font-mono text-sm text-rose-400 mt-1">5% Probability</span>
              </div>
            </div>
            
            {/* Simulated chart bars */}
            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-slate-500 text-[9px] uppercase font-bold">CPU Core Load Allocation</span>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-sky-400 to-violet-500" style={{ width: '42%' }} />
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
            className="bg-slate-900/60 border border-slate-800 rounded p-4 flex flex-col gap-3 card-inner-glow hover:bg-slate-900/85 transition-colors duration-200"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                Telemetry Infrastructure Toggles
              </span>
              <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                Online
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Ingest Node */}
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-300 text-xs font-semibold">Telemetry Ingest Node</span>
                </div>
                <span className="text-[9px] text-emerald-400 font-mono uppercase font-bold">Node Active</span>
              </div>

              {/* Virtualizer Thread */}
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-300 text-xs font-semibold">Virtualizer Render Thread</span>
                </div>
                <span className="text-[9px] text-emerald-400 font-mono uppercase font-bold">60 FPS Synced</span>
              </div>

              {/* DB Map Router */}
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-300 text-xs font-semibold">O(1) Memory Router Map</span>
                </div>
                <span className="text-[9px] text-emerald-400 font-mono uppercase font-bold">Active</span>
              </div>
              
              {/* Pages Sync */}
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-slate-300 text-xs font-semibold">GitHub Pages Sync Daemon</span>
                </div>
                <span className="text-[9px] text-sky-400 font-mono uppercase font-bold">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info Status Bar */}
      <footer className="bg-slate-950 border-t border-slate-800 flex justify-between items-center px-4 w-full shrink-0 h-8 cursor-default select-none">
        <div className="flex items-center gap-2 font-mono text-[9px] text-sky-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 glow-pulse-emerald"></span>
          <span>SYSTEM_STABLE // 50K_CHANNELS_ACTIVE</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[9px] text-slate-400">
          <span>V_4.2.1_LTS</span>
          <span className="text-slate-800">|</span>
          <span>Latency: 12ms</span>
          <span className="text-slate-800">|</span>
          <span>Uptime: 99.99%</span>
          <span className="text-slate-800">|</span>
          <div className="flex items-center gap-1 text-emerald-500 font-bold">
            <span className="material-symbols-outlined text-[13px]">wifi</span>
            <span>WebSocket: Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
