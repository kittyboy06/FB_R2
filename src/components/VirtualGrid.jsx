import { useEffect, useRef } from 'react';
import VirtualGridClass from './VirtualGrid.js';
import gridEngine from '../engine/gridEngine.js';

export default function VirtualGrid() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container (handle StrictMode double-render / HMR)
    containerRef.current.innerHTML = '';

    // Instantiate high-performance virtualized grid viewport
    const vg = new VirtualGridClass(containerRef.current);
    gridEngine.virtualGrid = vg;

    // Initial render
    gridEngine.refreshViewPool();

    return () => {
      gridEngine.virtualGrid = null;
    };
  }, []);

  // Header sorting click trigger (supports Shift+click)
  const handleHeaderClick = (colName, e) => {
    if (gridEngine.multiSortState && gridEngine.multiSortState.addOrToggle) {
      gridEngine.multiSortState.addOrToggle(colName, e.shiftKey);
      gridEngine.refreshViewPool();
    }
  };

  // Helper to render sorting indicators as Material Symbols
  const renderSortIndicator = (colName) => {
    if (!gridEngine.multiSortState || !gridEngine.multiSortState.keys) return null;
    const sortKey = gridEngine.multiSortState.keys.find(k => k.column === colName);
    if (!sortKey) return null;
    return (
      <span className="material-symbols-outlined text-[13px] text-sky-400 font-bold ml-1">
        {sortKey.dir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
      </span>
    );
  };

  return (
    <div className="flex flex-col flex-1 bg-[#060e20] border border-slate-800 rounded overflow-hidden">
      {/* Fixed Headers */}
      <div className="flex w-full bg-slate-900 border-b border-slate-800 py-2.5 text-slate-400 font-mono text-[10px] uppercase tracking-wider select-none pr-[17px]">
        <div className="vgrid-cell col-project_id">Project ID</div>
        <div className="vgrid-cell col-project_name">Project Name</div>
        <div className="vgrid-cell col-project_status justify-center">Status</div>
        <div className="vgrid-cell col-automation_type">Automation Type</div>
        
        <div 
          onClick={(e) => handleHeaderClick('budget_usd', e)}
          className="vgrid-cell col-budget_usd justify-end cursor-pointer hover:text-sky-400 transition-colors flex items-center group"
        >
          Budget{renderSortIndicator('budget_usd')}
          {!gridEngine.multiSortState?.keys?.some(k => k.column === 'budget_usd') && (
            <span className="material-symbols-outlined text-[13px] opacity-0 group-hover:opacity-60 ml-1 transition-opacity">arrow_upward</span>
          )}
        </div>
        
        <div 
          onClick={(e) => handleHeaderClick('annual_savings_usd', e)}
          className="vgrid-cell col-annual_savings_usd justify-end cursor-pointer hover:text-sky-400 transition-colors flex items-center group"
        >
          Savings{renderSortIndicator('annual_savings_usd')}
          {!gridEngine.multiSortState?.keys?.some(k => k.column === 'annual_savings_usd') && (
            <span className="material-symbols-outlined text-[13px] opacity-0 group-hover:opacity-60 ml-1 transition-opacity">arrow_upward</span>
          )}
        </div>
        
        <div 
          onClick={(e) => handleHeaderClick('roi_percent', e)}
          className="vgrid-cell col-roi_percent justify-end cursor-pointer hover:text-sky-400 transition-colors flex items-center group"
        >
          ROI{renderSortIndicator('roi_percent')}
          {!gridEngine.multiSortState?.keys?.some(k => k.column === 'roi_percent') && (
            <span className="material-symbols-outlined text-[13px] opacity-0 group-hover:opacity-60 ml-1 transition-opacity">arrow_upward</span>
          )}
        </div>
        
        <div 
          onClick={(e) => handleHeaderClick('robots_deployed', e)}
          className="vgrid-cell col-robots_deployed justify-end cursor-pointer hover:text-sky-400 transition-colors flex items-center group"
        >
          Bots{renderSortIndicator('robots_deployed')}
          {!gridEngine.multiSortState?.keys?.some(k => k.column === 'robots_deployed') && (
            <span className="material-symbols-outlined text-[13px] opacity-0 group-hover:opacity-60 ml-1 transition-opacity">arrow_upward</span>
          )}
        </div>
        
        <div className="vgrid-cell col-country">Country</div>
        <div className="vgrid-cell col-industry">Industry</div>
      </div>

      {/* Recycled Rows Container */}
      <div 
        ref={containerRef} 
        className="w-full overflow-y-auto"
        style={{ height: 'calc(100vh - 240px)', minHeight: '300px', maxHeight: 'calc(100vh - 240px)' }}
      />
    </div>
  );
}
