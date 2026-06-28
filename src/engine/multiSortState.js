const NUMERIC_COLUMNS = ['budget_usd', 'annual_savings_usd', 'roi_percent', 'robots_deployed', 'employee_hours_saved'];

const multiSortState = {
  keys: [],

  addOrToggle(col, isShift) {
    if (!isShift) {
      const existing = this.keys.find(k => k.column === col);
      this.keys = [{ column: col, dir: existing?.dir === 'asc' ? 'desc' : 'asc' }];
    } else {
      const idx = this.keys.findIndex(k => k.column === col);
      if (idx !== -1) {
        this.keys[idx].dir = this.keys[idx].dir === 'asc' ? 'desc' : 'asc';
      } else {
        this.keys.push({ column: col, dir: 'asc' });
      }
    }
  },

  apply(pool) {
    if (!this.keys.length) return pool;

    return [...pool].sort((a, b) => {
      for (const { column, dir } of this.keys) {
        const aVal = a[column];
        const bVal = b[column];

        let cmp = 0;
        
        if (NUMERIC_COLUMNS.includes(column)) {
          const numA = Number(aVal) || 0;
          const numB = Number(bVal) || 0;
          cmp = numA - numB;
        } else {
          const strA = aVal ? String(aVal) : '';
          const strB = bVal ? String(bVal) : '';
          cmp = strA.localeCompare(strB);
        }

        if (cmp !== 0) {
          return dir === 'asc' ? cmp : -cmp;
        }
      }
      return 0;
    });
  }
};

export default multiSortState;
