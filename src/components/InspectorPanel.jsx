import { fmtCurrency, fmtPercent, fmtNumber } from '../utils/formatters.js';

export default function InspectorPanel({ rowData, onClose }) {
  if (!rowData) return null;

  const isFailed = rowData.project_status === 'Failed';
  const isCompleted = rowData.project_status === 'Completed';
  const isActive = rowData.project_status === 'Active';
  
  let statusBadgeClass = "bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_8px_rgba(56,189,248,0.15)]";
  if (isFailed) statusBadgeClass = "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse";
  else if (isCompleted) statusBadgeClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  else if (rowData.project_status === 'Planned') statusBadgeClass = "bg-slate-800/60 text-slate-400 border border-slate-800";

  const numRoi = Number(rowData.roi_percent) || 0;
  const isRoiPositive = numRoi >= 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/70 z-[90] backdrop-blur-[2px] transition-opacity duration-200"
      />

      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-[460px] bg-[#0b1326] border-l border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col h-full select-none">
        
        {/* Panel Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-[#0f1930] shrink-0">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold block mb-0.5">
              Telemetry Inspector Viewport
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-black text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.25)]">
                {rowData.project_id || 'PRJ_UNKNOWN'}
              </span>
              <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded font-extrabold ${statusBadgeClass}`}>
                {rowData.project_status || 'Planned'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
          
          {/* Section 1: Identification */}
          <div className="flex flex-col gap-3">
            <div className="border-b border-slate-800 pb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                System Identification
              </span>
              <span className="material-symbols-outlined text-[14px] text-slate-500">fingerprint</span>
            </div>
            
            <div className="flex flex-col gap-2 bg-slate-950/45 p-3 rounded border border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase text-slate-500 font-bold">Project Name</span>
                <span className="text-xs font-semibold text-slate-200">{rowData.project_name || '—'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-500 font-bold">Company ID</span>
                  <span className="font-mono text-xs text-slate-300 font-medium">{rowData.company_id || '—'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-500 font-bold">Partner Vendor</span>
                  <span className="text-xs text-slate-300 font-medium">{rowData.implementation_partner || '—'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1.5 border-t border-slate-900 pt-1.5">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-500 font-bold">Country / Node</span>
                  <span className="text-xs text-slate-300 font-medium">{rowData.country || '—'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-500 font-bold">Target Industry</span>
                  <span className="text-xs text-slate-300 font-medium">{rowData.industry || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Impact */}
          <div className="flex flex-col gap-3">
            <div className="border-b border-slate-800 pb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Financial Metrics & ROI
              </span>
              <span className="material-symbols-outlined text-[14px] text-slate-500">query_stats</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/45 p-3 rounded border border-slate-800/80 flex flex-col justify-between">
                <span className="text-[9px] uppercase text-slate-500 font-bold">Allocated Budget</span>
                <span className="font-mono text-sm text-slate-200 mt-1 font-bold">
                  {fmtCurrency(rowData.budget_usd)}
                </span>
              </div>
              <div className="bg-slate-950/45 p-3 rounded border border-slate-800/80 flex flex-col justify-between">
                <span className="text-[9px] uppercase text-slate-500 font-bold">Annual Savings</span>
                <span className="font-mono text-sm text-emerald-400 mt-1 font-bold">
                  {fmtCurrency(rowData.annual_savings_usd)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/45 p-3 rounded border border-slate-800/80 flex flex-col justify-between">
                <span className="text-[9px] uppercase text-slate-500 font-bold">Net Return (ROI)</span>
                <span className={`font-mono text-sm mt-1 font-extrabold ${isRoiPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {fmtPercent(rowData.roi_percent)}
                </span>
              </div>
              <div className="bg-slate-950/45 p-3 rounded border border-slate-800/80 flex flex-col justify-between">
                <span className="text-[9px] uppercase text-slate-500 font-bold">Hours Liberated</span>
                <span className="font-mono text-sm text-sky-400 mt-1 font-bold">
                  {fmtNumber(rowData.employee_hours_saved)} hrs
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Telemetry Configuration */}
          <div className="flex flex-col gap-3">
            <div className="border-b border-slate-800 pb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Operational Telemetry
              </span>
              <span className="material-symbols-outlined text-[14px] text-slate-500">settings_system_daydream</span>
            </div>

            <div className="flex flex-col gap-2.5 bg-slate-950/45 p-3 rounded border border-slate-800/80">
              <div className="flex justify-between items-center py-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Automation Mechanism</span>
                <span className="text-xs text-slate-300 font-semibold">{rowData.automation_type || '—'}</span>
              </div>
              <div className="h-px bg-slate-900"></div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Active Bot Cluster</span>
                <span className="font-mono text-xs text-rose-400 font-bold">{rowData.robots_deployed || '0'} BOTS</span>
              </div>
              <div className="h-px bg-slate-900"></div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Cognitive AI Layer</span>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-extrabold ${rowData.ai_enabled === 'Yes' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-slate-850 text-slate-500 border border-slate-800'}`}>
                  {rowData.ai_enabled === 'Yes' ? 'AI_ENABLED' : 'NATIVE_FLOW'}
                </span>
              </div>
              <div className="h-px bg-slate-900"></div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Cloud Infrastructure</span>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-extrabold ${rowData.cloud_deployment === 'Yes' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-850 text-slate-500 border border-slate-800'}`}>
                  {rowData.cloud_deployment === 'Yes' ? 'CLOUD_NATIVE' : 'ON_PREM'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Timeline */}
          <div className="flex flex-col gap-3">
            <div className="border-b border-slate-800 pb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Project Lifespan
              </span>
              <span className="material-symbols-outlined text-[14px] text-slate-500">calendar_month</span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950/45 p-3 rounded border border-slate-800/80 font-mono">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase text-slate-500 font-bold">Ingress Date</span>
                <span className="text-xs text-slate-300 mt-0.5">{rowData.start_date || '—'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase text-slate-500 font-bold">Egress Date</span>
                <span className="text-xs text-slate-300 mt-0.5">
                  {rowData.completion_date || (isActive ? 'RUNNING (ACTIVE)' : '—')}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
