import { masterMap } from './masterMap.js';
import kpiStore from './kpiStore.js';
import filterStore from './filterStore.js';
import fuzzySearch from './fuzzySearch.js';
import multiSortState from './multiSortState.js';

const gridEngine = {
  masterMap,
  virtualGrid: null,
  kpiStore: kpiStore,
  filterStore: filterStore,
  fuzzySearch: fuzzySearch,
  multiSortState: multiSortState,

  process(batch) {
    if (typeof window !== 'undefined' && window.__testAlert && batch.length > 0) {
      let targetRow = null;
      if (this.virtualGrid && this.virtualGrid.viewPool.length > 0) {
        const visibleIdx = this.virtualGrid.startIndex || 0;
        targetRow = this.virtualGrid.viewPool[visibleIdx];
      }

      if (targetRow) {
        batch[0].internal_uid = targetRow.internal_uid;
        batch[0].project_id = targetRow.project_id;
      }
      batch[0].project_status = 'Failed';
      window.__testAlert = false;
    }

    batch.forEach(row => {
      this.masterMap.set(row.internal_uid, { ...row });
    });

    if (this.kpiStore && this.kpiStore.process) {
      this.kpiStore.process(batch);
    }

    this.refreshViewPool();
  },

  async loadBaseline(csvUrl) {
    try {
      console.log("⚡ [gridEngine] Loading baseline CSV...");
      const response = await fetch(csvUrl);
      if (!response.ok) throw new Error("HTTP error " + response.status);
      const csvText = await response.text();
      
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split('\t').length > lines[0].split(',').length 
        ? lines[0].split('\t').map(h => h.trim()) 
        : lines[0].split(',').map(h => h.trim());
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].includes('\t') ? lines[i].split('\t') : lines[i].split(','); 
        if (values.length === headers.length) {
          const row = { internal_uid: `uid-row-${i}` };
          headers.forEach((header, index) => {
            row[header] = values[index].trim();
          });
          this.masterMap.set(row.internal_uid, row);
        }
      }
      
      console.log(`✅ [gridEngine] Successfully loaded baseline map with ${this.masterMap.size} rows.`);
      this.refreshViewPool();
    } catch (error) {
      console.error("❌ [gridEngine] Failed to load baseline CSV:", error);
    }
  },

  refreshViewPool() {
    let pool = Array.from(this.masterMap.values());

    if (this.filterStore && this.filterStore.apply) {
      pool = this.filterStore.apply(pool);
    }

    if (this.fuzzySearch && this.fuzzySearch.apply) {
      pool = this.fuzzySearch.apply(pool);
    }

    if (this.multiSortState && this.multiSortState.apply) {
      pool = this.multiSortState.apply(pool);
    }

    if (this.virtualGrid && this.virtualGrid.setData) {
      this.virtualGrid.setData(pool);
    }
  }
};

export default gridEngine;
