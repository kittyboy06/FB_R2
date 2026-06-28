import { useEffect } from 'react';
import layoutStore from '../engine/layoutStore.js';

export default function LayoutToggles() {
  useEffect(() => {
    // Sync buttons status with stored state on mount
    layoutStore.init();
  }, []);

  const handleToggle = (panel) => {
    layoutStore.toggle(panel);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-lg shadow shadow-slate-950 select-none">
      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-2">
        Panels
      </span>
      
      {/* Grid Window Toggle */}
      <button
        id="toggle-btn-gridWindow"
        onClick={() => handleToggle('gridWindow')}
        className="px-3 py-1 text-[11px] font-semibold rounded border transition-colors cursor-pointer"
      >
        Grid View
      </button>

      {/* Analytics Chart Toggle */}
      <button
        id="toggle-btn-analyticsChart"
        onClick={() => handleToggle('analyticsChart')}
        className="px-3 py-1 text-[11px] font-semibold rounded border transition-colors cursor-pointer"
      >
        Charts
      </button>

      {/* Infrastructure Toggles */}
      <button
        id="toggle-btn-infraToggles"
        onClick={() => handleToggle('infraToggles')}
        className="px-3 py-1 text-[11px] font-semibold rounded border transition-colors cursor-pointer"
      >
        Infrastructure
      </button>
    </div>
  );
}
