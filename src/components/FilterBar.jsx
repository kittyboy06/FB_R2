import { useEffect, useState } from 'react';
import filterStore from '../engine/filterStore.js';
import fuzzySearch from '../engine/fuzzySearch.js';
import gridEngine from '../engine/gridEngine.js';
import { masterMap } from '../engine/masterMap.js';

export default function FilterBar() {
  const [searchVal, setSearchVal] = useState('');
  const [departments, setDepartments] = useState([]);
  const [automationTypes, setAutomationTypes] = useState([]);
  const [industries, setIndustries] = useState([]);

  // Wait for masterMap to load baseline CSV data, then populate dropdown options dynamically
  useEffect(() => {
    const timer = setInterval(() => {
      if (masterMap.size > 0) {
        setDepartments(filterStore.getUniqueOptions('department', masterMap));
        setAutomationTypes(filterStore.getUniqueOptions('automation_type', masterMap));
        setIndustries(filterStore.getUniqueOptions('industry', masterMap));
        clearInterval(timer);
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Debounce fuzzy search input updates to prevent thread congestion during typing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fuzzySearch.set(searchVal);
      gridEngine.refreshViewPool();
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [searchVal]);

  const handleFilterChange = (field, val) => {
    filterStore.set(field, val);
    gridEngine.refreshViewPool();
  };

  return (
    <div className="flex flex-wrap items-center gap-4 glass-panel p-4 rounded-lg shadow-md mb-6">
      {/* Fuzzy Search with Inset Icon */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Fuzzy Search
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search name, company, partner..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded pl-9 pr-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Department Dropdown */}
      <div className="min-w-[160px]">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Department
        </label>
        <select
          onChange={(e) => handleFilterChange('department', e.target.value)}
          className="w-full bg-slate-950/60 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all duration-200"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Automation Type Dropdown */}
      <div className="min-w-[160px]">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Automation Type
        </label>
        <select
          onChange={(e) => handleFilterChange('automation_type', e.target.value)}
          className="w-full bg-slate-950/60 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all duration-200"
        >
          <option value="">All Types</option>
          {automationTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Industry Dropdown */}
      <div className="min-w-[160px]">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Industry
        </label>
        <select
          onChange={(e) => handleFilterChange('industry', e.target.value)}
          className="w-full bg-slate-950/60 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all duration-200"
        >
          <option value="">All Industries</option>
          {industries.map(i => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
