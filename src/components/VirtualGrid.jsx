import { useEffect, useRef } from 'react';
import VirtualGridClass from './VirtualGrid.js';
import gridEngine from '../engine/gridEngine.js';

export default function VirtualGrid() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous children (e.g. from HMR or StrictMode double-mount)
    containerRef.current.innerHTML = '';

    // Instantiate virtual grid engine
    const vg = new VirtualGridClass(containerRef.current);
    gridEngine.virtualGrid = vg;

    // Trigger grid refresh to render loaded CSV rows
    gridEngine.refreshViewPool();

    return () => {
      gridEngine.virtualGrid = null;
    };
  }, []);

  // Header click handler for sorting (Shift + click supported)
  const handleHeaderClick = (colName, e) => {
    if (gridEngine.multiSortState && gridEngine.multiSortState.addOrToggle) {
      gridEngine.multiSortState.addOrToggle(colName, e.shiftKey);
      gridEngine.refreshViewPool(); // Refresh immediately after sort toggle
    }
  };

  // Helper to render sort arrows in headers with modern typography
  const renderSortIndicator = (colName) => {
    if (!gridEngine.multiSortState || !gridEngine.multiSortState.keys) return null;
    const sortKey = gridEngine.multiSortState.keys.find(k => k.column === colName);
    if (!sortKey) return null;
    return (
      <span className="text-sky-400 text-[10px] font-black ml-1 text-glow-sky">
        {sortKey.dir === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="flex flex-col w-full glass-panel rounded-lg overflow-hidden shadow-2xl">
      {/* Fixed Headers */}
      <div className="flex w-full bg-slate-950/80 border-b border-slate-800 py-3 text-slate-400 font-bold text-[10px] uppercase tracking-wider select-none pr-[17px]">
        <div className="vgrid-cell col-project_id">Project ID</div>
        <div className="vgrid-cell col-project_name">Project Name</div>
        <div className="vgrid-cell col-project_status justify-center">Status</div>
        <div className="vgrid-cell col-automation_type">Automation Type</div>
        
        <div 
          onClick={(e) => handleHeaderClick('budget_usd', e)}
          className="vgrid-cell col-budget_usd justify-end cursor-pointer hover:text-sky-400 transition-colors flex items-center"
        >
          Budget{renderSortIndicator('budget_usd')}
        </div>
        
        <div 
          onClick={(e) => handleHeaderClick('annual_savings_usd', e)}
          className="vgrid-cell col-annual_savings_usd justify-end cursor-pointer hover:text-sky-400 transition-colors flex items-center"
        >
          Savings{renderSortIndicator('annual_savings_usd')}
        </div>
        
        <div 
          onClick={(e) => handleHeaderClick('roi_percent', e)}
          className="vgrid-cell col-roi_percent justify-end cursor-pointer hover:text-sky-400 transition-colors flex items-center"
        >
          ROI{renderSortIndicator('roi_percent')}
        </div>
        
        <div 
          onClick={(e) => handleHeaderClick('robots_deployed', e)}
          className="vgrid-cell col-robots_deployed justify-end cursor-pointer hover:text-sky-400 transition-colors flex items-center"
        >
          Bots{renderSortIndicator('robots_deployed')}
        </div>
        
        <div className="vgrid-cell col-country">Country</div>
        <div className="vgrid-cell col-industry">Industry</div>
      </div>

      {/* Recycled Rows Container */}
      <div 
        ref={containerRef} 
        className="w-full overflow-y-auto"
        style={{ height: 'calc(100vh - 350px)', minHeight: '300px', maxHeight: 'calc(100vh - 350px)' }}
      />
    </div>
  );
}
