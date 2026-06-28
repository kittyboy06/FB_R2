const kpiStore = {
  totalRows: 0,
  totalRobots: 0,
  totalSavings: 0,

  process(batch) {
    this.totalRows += batch.length;
    batch.forEach(row => {
      this.totalRobots += Number(row.robots_deployed) || 0;
      this.totalSavings += Number(row.annual_savings_usd) || 0;
    });
    this.flush();
  },

  nodes: {},
  register(key, textNode) {
    this.nodes[key] = textNode;
    // Initial flush of this node to reflect current count
    this.flushNode(key);
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
    } else if (key === 'totalRobots') {
      node.textContent = this.totalRobots.toLocaleString('en-US');
    } else if (key === 'totalSavings') {
      node.textContent = `$${this.totalSavings.toLocaleString('en-US')}`;
    }
  }
};

export default kpiStore;
