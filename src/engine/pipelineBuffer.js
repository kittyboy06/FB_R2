const pipelineBuffer = {
  isPaused: false,
  queue: [],
  onFlush: null,

  pause() {
    this.isPaused = true;
    document.body.classList.add('ingest-paused');
    const btn = document.getElementById('pause-btn');
    if (btn) {
      btn.innerHTML = `
        <svg class="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
        Resume Ingest
      `;
      btn.className = "px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider select-none flex items-center gap-2 border transition-all duration-200 cursor-pointer shadow-lg bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/35 shadow-emerald-950/20";
    }
    const analyticsBtn = document.getElementById('analytics-view-btn');
    if (analyticsBtn) {
      analyticsBtn.classList.remove('hidden');
      analyticsBtn.classList.add('flex');
    }
    window.dispatchEvent(new CustomEvent('ingest-pause-state', { detail: { isPaused: true } }));
  },

  play() {
    this.isPaused = false;
    document.body.classList.remove('ingest-paused');
    const btn = document.getElementById('pause-btn');
    if (btn) {
      btn.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        Pause Ingest
      `;
      btn.className = "px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider select-none flex items-center gap-2 border transition-all duration-200 cursor-pointer shadow-lg bg-amber-600/20 text-amber-400 border-amber-500/30 hover:bg-amber-600/35 shadow-amber-950/20";
    }
    const analyticsBtn = document.getElementById('analytics-view-btn');
    if (analyticsBtn) {
      analyticsBtn.classList.remove('flex');
      analyticsBtn.classList.add('hidden');
    }
    if (this.queue.length && this.onFlush) {
      const flattened = this.queue.flat();
      this.queue = [];
      this.onFlush(flattened);
    }
    window.dispatchEvent(new CustomEvent('ingest-pause-state', { detail: { isPaused: false } }));
  },

  ingest(batch) {
    if (this.isPaused) {
      const clonedBatch = batch.map(row => ({ ...row }));
      this.queue.push(clonedBatch);
    } else {
      this.onFlush?.(batch);
    }
  }
};

export default pipelineBuffer;
