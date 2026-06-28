import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import gridEngine from '../engine/gridEngine.js';

export default function AnalyticsOverlay({ onClose }) {
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const lineChartRef = useRef(null);

  const [pool, setPool] = useState([]);

  useEffect(() => {
    if (gridEngine.virtualGrid?.viewPool) {
      setPool([...gridEngine.virtualGrid.viewPool]);
    }
  }, []);

  useEffect(() => {
    if (pool.length === 0) return;

    const deptSavings = {};
    const typeCount = {};
    const industryRoi = {};

    pool.forEach(row => {
      const dept = row.department || 'Unknown';
      const savings = Number(row.annual_savings_usd) || 0;
      deptSavings[dept] = (deptSavings[dept] || 0) + savings;

      const type = row.automation_type || 'Unknown';
      typeCount[type] = (typeCount[type] || 0) + 1;

      const ind = row.industry || 'Unknown';
      const roi = Number(row.roi_percent) || 0;
      if (!industryRoi[ind]) {
        industryRoi[ind] = { sum: 0, count: 0 };
      }
      industryRoi[ind].sum += roi;
      industryRoi[ind].count += 1;
    });

    const sortedDepts = Object.entries(deptSavings)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const sortedTypes = Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const indRois = Object.entries(industryRoi)
      .map(([name, data]) => [name, data.sum / data.count])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Hanken Grotesk', sans-serif";

    let barChartInstance = null;
    if (barChartRef.current) {
      barChartInstance = new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: sortedDepts.map(d => d[0]),
          datasets: [{
            label: 'Total Savings (USD)',
            data: sortedDepts.map(d => d[1]),
            backgroundColor: 'rgba(56, 189, 248, 0.45)',
            borderColor: '#38bdf8',
            borderWidth: 1.5,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { color: 'rgba(51, 65, 85, 0.2)' } },
            y: {
              grid: { color: 'rgba(51, 65, 85, 0.2)' },
              ticks: {
                callback: (value) => '$' + (value / 1e6).toFixed(0) + 'M'
              }
            }
          }
        }
      });
    }

    let doughnutChartInstance = null;
    if (doughnutChartRef.current) {
      doughnutChartInstance = new Chart(doughnutChartRef.current, {
        type: 'doughnut',
        data: {
          labels: sortedTypes.map(t => t[0]),
          datasets: [{
            data: sortedTypes.map(t => t[1]),
            backgroundColor: [
              'rgba(56, 189, 248, 0.5)',
              'rgba(16, 185, 129, 0.5)',
              'rgba(139, 92, 246, 0.5)',
              'rgba(244, 63, 94, 0.5)',
              'rgba(234, 179, 8, 0.5)'
            ],
            borderColor: [
              '#38bdf8',
              '#10b981',
              '#8b5cf6',
              '#f43f5e',
              '#eab308'
            ],
            borderWidth: 1.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { boxWidth: 12, padding: 10 }
            }
          }
        }
      });
    }

    let lineChartInstance = null;
    if (lineChartRef.current) {
      lineChartInstance = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: indRois.map(i => i[0]),
          datasets: [{
            label: 'Avg ROI %',
            data: indRois.map(i => i[1]),
            fill: true,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderColor: '#10b981',
            borderWidth: 2,
            tension: 0.3,
            pointBackgroundColor: '#10b981'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { color: 'rgba(51, 65, 85, 0.2)' } },
            y: {
              grid: { color: 'rgba(51, 65, 85, 0.2)' },
              ticks: {
                callback: (value) => value.toFixed(0) + '%'
              }
            }
          }
        }
      });
    }

    return () => {
      barChartInstance?.destroy();
      doughnutChartInstance?.destroy();
      lineChartInstance?.destroy();
    };
  }, [pool]);

  return (
    <>
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/80 z-[90] backdrop-blur-[3px] transition-opacity duration-200"
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[95vw] max-w-[900px] h-[85vh] bg-[#0c1427] border border-slate-800/80 rounded-lg shadow-[0_0_60px_rgba(56,189,248,0.12)] flex flex-col overflow-hidden select-none">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-[#0f1930] shrink-0">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold block mb-0.5">
              Paused Pipeline Analytics Viewport
            </span>
            <div className="flex items-center gap-2">
              <span className="font-sans text-lg font-black text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.25)] uppercase">
                Aggregated Telemetry Dashboard
              </span>
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded font-extrabold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {pool.length.toLocaleString('en-US')} projects
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

        <div className="flex-1 overflow-y-auto p-5">
          {pool.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-sm">
              <span className="material-symbols-outlined text-4xl mb-2">warning</span>
              No active projects to analyze. Adjust filters or search query.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full min-h-[500px]">
              
              <div className="bg-slate-950/45 p-4 rounded border border-slate-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Top Departments by Savings
                  </span>
                  <span className="material-symbols-outlined text-[13px] text-sky-400">payments</span>
                </div>
                <div className="flex-1 relative min-h-[220px]">
                  <canvas ref={barChartRef} />
                </div>
              </div>

              <div className="bg-slate-950/45 p-4 rounded border border-slate-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Automation Mechanism Mix
                  </span>
                  <span className="material-symbols-outlined text-[13px] text-[#10b981]">smart_toy</span>
                </div>
                <div className="flex-1 relative min-h-[220px]">
                  <canvas ref={doughnutChartRef} />
                </div>
              </div>

              <div className="bg-slate-950/45 p-4 rounded border border-slate-800/80 flex flex-col gap-2 md:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Top Industries by Average Return (ROI)
                  </span>
                  <span className="material-symbols-outlined text-[13px] text-indigo-400">query_stats</span>
                </div>
                <div className="flex-1 relative min-h-[200px]">
                  <canvas ref={lineChartRef} />
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}
