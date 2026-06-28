const fuzzySearch = {
  query: '',

  set(q) {
    this.query = q.toLowerCase().trim();
  },

  match(row) {
    if (!this.query) return true;
    
    // Concatenate all row values to search across all fields (name, partner, status, cloud, etc.)
    const haystack = Object.values(row)
      .map(v => v ? String(v) : '')
      .join(' ')
      .toLowerCase();

    // All whitespace-separated tokens must be present in the row string (out-of-order support)
    const tokens = this.query.split(/\s+/);
    return tokens.every(token => haystack.includes(token));
  },

  apply(pool) {
    return pool.filter(row => this.match(row));
  }
};

export default fuzzySearch;
