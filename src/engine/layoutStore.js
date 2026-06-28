const STORAGE_KEY = 'rpa_layout_v1';

const defaultLayout = {
  gridWindow: true,
  analyticsChart: true,
  infraToggles: true
};

let parsedState = { ...defaultLayout };
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    parsedState = JSON.parse(saved);
  }
} catch (e) {
  console.warn("⚠️ [Layout Store] Failed to parse layout state from localStorage, falling back to defaults.");
}

export const layoutStore = {
  state: parsedState,

  toggle(panel) {
    if (this.state[panel] !== undefined) {
      this.state[panel] = !this.state[panel];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.error("❌ [Layout Store] Failed to save layout state to localStorage:", e);
      }
      this.render();
    }
  },

  // Mutate panel DOM visibility directly to avoid React re-renders
  render() {
    Object.entries(this.state).forEach(([panel, visible]) => {
      const el = document.getElementById(`panel-${panel}`);
      if (el) {
        el.style.display = visible ? '' : 'none';
      }
      
      // Update checkmark state of buttons if they exist
      const btn = document.getElementById(`toggle-btn-${panel}`);
      if (btn) {
        if (visible) {
          btn.className = "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all duration-150 cursor-pointer bg-sky-500/15 text-sky-400 border-sky-500/30 shadow-[0_0_8px_rgba(56,189,248,0.1)]";
        } else {
          btn.className = "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all duration-150 cursor-pointer bg-slate-950/40 text-slate-500 border-slate-800/80";
        }
      }
    });
  },

  init() {
    this.render();
  }
};

export default layoutStore;
