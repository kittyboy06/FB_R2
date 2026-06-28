import { useEffect } from 'react';
import layoutStore from '../engine/layoutStore.js';

export default function LayoutToggles() {
  useEffect(() => {
    // Sync button status with layoutStore state on mount
    layoutStore.init();
  }, []);

  const handleToggle = (panel) => {
    layoutStore.toggle(panel);
  };

  const initialVisibleClass = "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all duration-150 cursor-pointer bg-sky-500/15 text-sky-400 border-sky-500/30 shadow-[0_0_8px_rgba(56,189,248,0.1)]";

  return (
    <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/80 p-1.5 rounded select-none">
      <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest px-1.5">
        Panels
      </span>
      
      {/* Grid Window Toggle */}
      <button
        id="toggle-btn-gridWindow"
        onClick={() => handleToggle('gridWindow')}
        className={initialVisibleClass}
      >
        Grid View
      </button>

      {/* Analytics Chart Toggle */}
      <button
        id="toggle-btn-analyticsChart"
        onClick={() => handleToggle('analyticsChart')}
        className={initialVisibleClass}
      >
        Charts
      </button>

      {/* Infrastructure Toggles */}
      <button
        id="toggle-btn-infraToggles"
        onClick={() => handleToggle('infraToggles')}
        className={initialVisibleClass}
      >
        Infrastructure
      </button>
    </div>
  );
}
