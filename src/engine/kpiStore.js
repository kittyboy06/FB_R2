function generateSparklinePath(history, width = 100, height = 32) {
  if (history.length < 2) return '';
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  return history.map((val, index) => {
    const x = (index / (history.length - 1)) * width;
    // Scale y coordinates between 2 (top) and height-2 (bottom)
    const y = height - 2 - ((val - min) / range) * (height - 4);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

const kpiStore = {
  totalRows: 0,
  totalRobots: 0,
  totalSavings: 0,
  
  // Historical data arrays for real-time charting
  totalRowsHistory: [],
  totalSavingsHistory: [],

  process(batch) {
    this.totalRows += batch.length;
    batch.forEach(row => {
      this.totalRobots += Number(row.robots_deployed) || 0;
      this.totalSavings += Number(row.annual_savings_usd) || 0;
    });

    // Capture history points (limit to 30 ticks for rolling view)
    this.totalRowsHistory.push(this.totalRows);
    if (this.totalRowsHistory.length > 30) this.totalRowsHistory.shift();

    this.totalSavingsHistory.push(this.totalSavings);
    if (this.totalSavingsHistory.length > 30) this.totalSavingsHistory.shift();

    this.flush();
  },

  nodes: {},
  register(key, node) {
    this.nodes[key] = node;
    // Initial flush to populate current values
    this.flushNode(key);
  },

  unregister(key) {
    delete this.nodes[key];
  },

  flush() {
    this.flushNode('totalRows');
    this.flushNode('totalRobots');
    this.flushNode('totalSavings');
  },

  flushNode(key) {
    const node = this.nodes[key];
    if (!node) return;

    if (key === 'totalRows') {
      node.textContent = this.totalRows.toLocaleString('en-US');
      const spark = this.nodes['totalRowsSparkline'];
      if (spark && this.totalRowsHistory.length >= 2) {
        spark.setAttribute('d', generateSparklinePath(this.totalRowsHistory));
      }
    } else if (key === 'totalRobots') {
      node.textContent = this.totalRobots.toLocaleString('en-US');
    } else if (key === 'totalSavings') {
      node.textContent = `$${this.totalSavings.toLocaleString('en-US')}`;
      const spark = this.nodes['totalSavingsSparkline'];
      if (spark && this.totalSavingsHistory.length >= 2) {
        spark.setAttribute('d', generateSparklinePath(this.totalSavingsHistory));
      }
    }
  }
};

export default kpiStore;
