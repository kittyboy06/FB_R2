import { useEffect, useRef } from 'react';
import kpiStore from '../engine/kpiStore.js';

function KpiValue({ kpiKey, className }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    
    // Create text node and append to span ref
    const textNode = document.createTextNode('0');
    ref.current.appendChild(textNode);
    
    // Register the text node into the DOM KPI store
    kpiStore.register(kpiKey, textNode);

    return () => {
      textNode.remove();
    };
  }, [kpiKey]);

  return <span ref={ref} className={className} />;
}

function KpiSparkline({ kpiKey, className }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    
    // Register the SVG path node into the DOM KPI store
    kpiStore.register(kpiKey, ref.current);

    return () => {
      kpiStore.unregister(kpiKey);
    };
  }, [kpiKey]);

  return (
    <div className="absolute bottom-0 left-0 w-full h-8 opacity-25">
      <svg className="w-full h-full fill-none" preserveAspectRatio="none" viewBox="0 0 100 32">
        <path ref={ref} className={className} strokeWidth="1.5" d="" />
      </svg>
    </div>
  );
}

export default function KpiStrip() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 mb-4 select-none">
      {/* KPI 1: Total Records Processed */}
      <div className="bg-slate-900/60 border-t-2 border-[#38bdf8] rounded p-4 flex flex-col gap-1 card-inner-glow relative overflow-hidden group hover:bg-slate-900/85 transition-colors duration-200">
        <div className="flex justify-between items-center text-slate-400">
          <span className="font-mono text-[10px] uppercase tracking-widest">Total Records Processed</span>
          <span className="material-symbols-outlined text-[16px] text-sky-400">database</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <KpiValue kpiKey="totalRows" className="font-sans text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.35)]" />
          <span className="font-mono text-[10px] text-sky-400 font-bold">RECORDS</span>
        </div>
        {/* Real-Time Sparkline */}
        <KpiSparkline kpiKey="totalRowsSparkline" className="stroke-sky-400" />
      </div>

      {/* KPI 2: Active Automation Bots */}
      <div className="bg-slate-900/60 border-t-2 border-[#10b981] rounded p-4 flex flex-col gap-1 card-inner-glow relative overflow-hidden group hover:bg-slate-900/85 transition-colors duration-200">
        <div className="flex justify-between items-center text-slate-400">
          <span className="font-mono text-[10px] uppercase tracking-widest">Active Automation Bots</span>
          <span className="material-symbols-outlined text-[16px] text-[#10b981]">smart_toy</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <KpiValue kpiKey="totalRobots" className="font-sans text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]" />
          <span className="font-mono text-[10px] text-[#10b981] font-bold">BOTS</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full glow-pulse-emerald"></span>
          <span className="font-mono text-[10px] text-[#10b981] font-semibold">Cluster optimal</span>
        </div>
      </div>

      {/* KPI 3: Financial Impact */}
      <div className="bg-slate-900/60 border-t-2 border-[#8b5cf6] rounded p-4 flex flex-col gap-1 card-inner-glow relative overflow-hidden group hover:bg-slate-900/85 transition-colors duration-200">
        <div className="flex justify-between items-center text-slate-400">
          <span className="font-mono text-[10px] uppercase tracking-widest">Financial Impact (YTD)</span>
          <span className="material-symbols-outlined text-[16px] text-[#8b5cf6]">payments</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <KpiValue kpiKey="totalSavings" className="font-sans text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(139,92,246,0.35)]" />
          <span className="font-mono text-[10px] text-[#8b5cf6] font-bold">USD</span>
        </div>
        {/* Real-Time Sparkline */}
        <KpiSparkline kpiKey="totalSavingsSparkline" className="stroke-[#8b5cf6]" />
      </div>
    </section>
  );
}
