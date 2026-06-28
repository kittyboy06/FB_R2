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
          btn.classList.add('bg-sky-600', 'text-white', 'border-sky-500');
          btn.classList.remove('bg-slate-900', 'text-slate-400', 'border-slate-800');
        } else {
          btn.classList.remove('bg-sky-600', 'text-white', 'border-sky-500');
          btn.classList.add('bg-slate-900', 'text-slate-400', 'border-slate-800');
        }
      }
    });
  },

  init() {
    this.render();
  }
};

export default layoutStore;
