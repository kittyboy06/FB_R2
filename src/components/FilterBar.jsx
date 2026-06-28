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

  // Populate dynamic dropdown options from the dataset
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

  // Update debounced fuzzy search query
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
    <div className="flex flex-wrap items-center gap-3 p-2 border-b border-slate-800 bg-slate-900/60 shrink-0 select-none">
      {/* Fuzzy Search with Material Icon */}
      <div className="flex-1 min-w-[250px] relative">
        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
          search
        </span>
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search name, company, partner..."
          className="w-full bg-slate-950/60 border border-slate-800 rounded py-1 pl-8 pr-3 font-mono text-xs text-white placeholder:text-slate-500 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Select Dropdowns */}
      <div className="flex gap-2">
        <select
          onChange={(e) => handleFilterChange('department', e.target.value)}
          className="bg-slate-950/60 border border-slate-800 rounded py-1 px-3 font-mono text-xs text-slate-200 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] focus:outline-none cursor-pointer"
        >
          <option value="">Department: All</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          onChange={(e) => handleFilterChange('automation_type', e.target.value)}
          className="bg-slate-950/60 border border-slate-800 rounded py-1 px-3 font-mono text-xs text-slate-200 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] focus:outline-none cursor-pointer"
        >
          <option value="">Type: All</option>
          {automationTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          onChange={(e) => handleFilterChange('industry', e.target.value)}
          className="bg-slate-950/60 border border-slate-800 rounded py-1 px-3 font-mono text-xs text-slate-200 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] focus:outline-none cursor-pointer"
        >
          <option value="">Industry: All</option>
          {industries.map(i => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
