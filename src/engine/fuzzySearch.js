const fuzzySearch = {
  query: '',

  set(q) {
    this.query = q.toLowerCase().trim();
  },

  match(row) {
    if (!this.query) return true;
    
    const haystack = Object.values(row)
      .map(v => v ? String(v) : '')
      .join(' ')
      .toLowerCase();

    const tokens = this.query.split(/\s+/);
    return tokens.every(token => haystack.includes(token));
  },

  apply(pool) {
    return pool.filter(row => this.match(row));
  }
};

export default fuzzySearch;
