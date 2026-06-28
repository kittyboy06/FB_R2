const filterStore = {
  active: {
    automation_type: null,
    department: null,
    industry: null
  },

  set(field, value) {
    this.active[field] = value || null;
  },

  apply(pool) {
    return pool.filter(row => {
      return Object.entries(this.active).every(([field, val]) => {
        if (!val) return true;
        return row[field] === val;
      });
    });
  },

  getUniqueOptions(field, masterMap) {
    const options = new Set();
    masterMap.forEach(row => {
      if (row[field]) {
        options.add(row[field]);
      }
    });
    return Array.from(options).sort();
  }
};

export default filterStore;
