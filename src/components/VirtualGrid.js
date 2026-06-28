import { fmtCurrency, fmtPercent, fmtNumber } from '../utils/formatters.js';
import { applyRowAlert } from '../utils/alertStyles.js';
import pipelineBuffer from '../engine/pipelineBuffer.js';

class VirtualGrid {
  constructor(containerEl, rowHeight = 36) {
    this.container = containerEl;
    this.rowHeight = rowHeight;
    this.viewPool = [];      // Full filtered and sorted dataset
    this.visibleCount = 0;   // Count of visible rows based on container height
    this.scrollTop = 0;
    this.startIndex = 0;

    // Create scroller height phantom
    this.scroller = document.createElement('div');
    this.scroller.style.width = '1px';
    this.scroller.style.height = '0px';

    // Create absolute container for active rows
    this.rowContainer = document.createElement('div');
    this.rowContainer.style.position = 'absolute';
    this.rowContainer.style.top = '0';
    this.rowContainer.style.left = '0';
    this.rowContainer.style.width = '100%';

    this.container.style.position = 'relative';
    this.container.style.overflow = 'auto';
    this.container.appendChild(this.scroller);
    this.container.appendChild(this.rowContainer);

    // Create empty state overlay
    this.emptyOverlay = document.createElement('div');
    this.emptyOverlay.textContent = 'No matching RPA projects found.';
    this.emptyOverlay.style.position = 'absolute';
    this.emptyOverlay.style.top = '40px';
    this.emptyOverlay.style.left = '50%';
    this.emptyOverlay.style.transform = 'translateX(-50%)';
    this.emptyOverlay.style.color = '#94a3b8'; // Slate 400
    this.emptyOverlay.style.fontSize = '13px';
    this.emptyOverlay.style.fontWeight = '600';
    this.emptyOverlay.style.display = 'none';
    this.emptyOverlay.style.pointerEvents = 'none';
    this.container.appendChild(this.emptyOverlay);

    this.container.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.domRows = []; // Fixed pool of recycled row DOM nodes
    this.init();
  }

  init() {
    // Minimum 25 rows to ensure container is fully populated even if clientHeight is 0 on mount
    this.visibleCount = Math.max(25, Math.ceil(this.container.clientHeight / this.rowHeight) + 2);
    // Create the fixed DOM pool
    for (let i = 0; i < this.visibleCount; i++) {
      const rowEl = this.createRowEl();
      this.rowContainer.appendChild(rowEl);
      this.domRows.push(rowEl);
    }
  }

  createRowEl() {
    const tr = document.createElement('div');
    tr.className = 'vgrid-row';
    tr.style.height = `${this.rowHeight}px`;
    tr.style.position = 'absolute';
    tr.style.width = '100%';
    tr.style.display = 'none'; // Hidden until filled

    // Row Click Inspector trigger when paused
    tr.addEventListener('click', () => {
      if (pipelineBuffer.isPaused && tr._rowData) {
        this.container.dispatchEvent(new CustomEvent('inspect-row', {
          bubbles: true,
          detail: tr._rowData
        }));
      }
    });

    const cols = [
      'project_id',
      'project_name',
      'project_status',
      'automation_type',
      'budget_usd',
      'annual_savings_usd',
      'roi_percent',
      'robots_deployed',
      'country',
      'industry'
    ];

    cols.forEach(col => {
      const cell = document.createElement('span');
      cell.className = `vgrid-cell col-${col}`;
      
      if (col === 'project_status') {
        const badge = document.createElement('span');
        badge.className = 'status-badge';
        cell.appendChild(badge);
      }
      
      tr.appendChild(cell);
    });

    return tr;
  }

  setData(pool) {
    this.viewPool = pool;
    this.scroller.style.height = `${pool.length * this.rowHeight}px`;
    this.emptyOverlay.style.display = pool.length === 0 ? 'block' : 'none';
    this.render();
  }

  onScroll() {
    this.scrollTop = this.container.scrollTop;
    this.render();
  }

  render() {
    this.startIndex = Math.floor(this.scrollTop / this.rowHeight);

    // Dynamically grow the DOM rows pool if the container height expands (e.g. window resize or delayed load)
    const needed = Math.ceil(this.container.clientHeight / this.rowHeight) + 2;
    if (needed > this.domRows.length) {
      for (let i = this.domRows.length; i < needed; i++) {
        const rowEl = this.createRowEl();
        this.rowContainer.appendChild(rowEl);
        this.domRows.push(rowEl);
      }
    }

    for (let i = 0; i < this.domRows.length; i++) {
      const rowEl = this.domRows[i];
      const dataIndex = this.startIndex + i;

      if (dataIndex >= this.viewPool.length) {
        rowEl.style.display = 'none';
        continue;
      }

      rowEl.style.display = 'flex';
      rowEl.style.top = `${dataIndex * this.rowHeight}px`;

      const row = this.viewPool[dataIndex];
      this.updateRowCells(rowEl, row);
    }
  }

  updateRowCells(rowEl, row) {
    rowEl._rowData = row;
    const cells = rowEl.children;
    if (cells.length < 10) return;

    cells[0].textContent = row.project_id || '—';
    cells[1].textContent = row.project_name || '—';

    // Status Badge (no innerHTML)
    const badge = cells[2].firstElementChild;
    if (badge) {
      const status = row.project_status || 'Planned';
      badge.textContent = status;
      badge.className = `status-badge status-${status.toLowerCase()}`;
    }

    cells[3].textContent = row.automation_type || '—';
    cells[4].textContent = fmtCurrency(row.budget_usd);
    cells[5].textContent = fmtCurrency(row.annual_savings_usd);
    cells[6].textContent = fmtPercent(row.roi_percent);
    cells[7].textContent = fmtNumber(row.robots_deployed);
    cells[8].textContent = row.country || '—';
    cells[9].textContent = row.industry || '—';

    // Apply flash animations
    applyRowAlert(rowEl, row);
  }
}

export default VirtualGrid;
