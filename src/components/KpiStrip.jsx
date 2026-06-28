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

export default function KpiStrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Streamed Rows card */}
      <div className="glass-panel rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-[3px] h-full bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.6)]" />
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Total Streamed Rows
          </span>
          <span className="text-sky-500/20 group-hover:text-sky-500/40 transition-colors duration-300">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zm0 4h16m-8 4h8" />
            </svg>
          </span>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <KpiValue kpiKey="totalRows" className="font-mono-data text-3xl font-extrabold text-sky-400 text-glow-sky" />
          <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold select-none">records</span>
        </div>
      </div>

      {/* Active Robots card */}
      <div className="glass-panel rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-[3px] h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Active Robots Deployed
          </span>
          <span className="text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors duration-300">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </span>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <KpiValue kpiKey="totalRobots" className="font-mono-data text-3xl font-extrabold text-emerald-400 text-glow-emerald" />
          <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold select-none">bots</span>
        </div>
      </div>

      {/* Cumulative Savings card */}
      <div className="glass-panel rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-[3px] h-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]" />
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Global Cumulative Savings
          </span>
          <span className="text-violet-500/20 group-hover:text-violet-500/40 transition-colors duration-300">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <KpiValue kpiKey="totalSavings" className="font-mono-data text-3xl font-extrabold text-violet-400 text-glow-purple" />
          <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold select-none">USD</span>
        </div>
      </div>
    </div>
  );
}
