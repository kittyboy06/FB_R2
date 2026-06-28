# Implementation Plan: High-Density Enterprise RPA Monitor

**Branch**: `001-rpa-monitor` | **Date**: 2026-06-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-rpa-monitor/spec.md`

## Summary

Build a high-density operator terminal for 50,000 streaming rows of RPA project telemetry updating every 200ms. The UI will feature direct DOM text node mutations, custom VirtualGrid virtualization (recycling a fixed pool of DOM row nodes), out-of-order debounced fuzzy search, single and multi-column sorting, and persistent panel layout configurations.

## Technical Context

**Language/Version**: Javascript (ES6+)

**Primary Dependencies**: React 19 (dumb component shells only), Vite, Tailwind CSS, `localStorage`

**Storage**: `localStorage` (Feature 6 panel visibility state)

**Testing**: Vitest / Jest (for utility and state logic)

**Target Platform**: Modern Web Browsers (Chrome recommended for telemetry testing), hosted on GitHub Pages

**Project Type**: Web Application

**Performance Goals**: Locked 60 FPS under 50,000-row load, zero heap bloat over time

**Constraints**: Banned external table and virtualization libraries (ag-grid, tanstack table, react-window, react-virtualized), Framer Motion banned (CSS `@keyframes` only). Vanilla JS singletons for stream data (no React state in stream hot path).

**Scale/Scope**: 50,000 rows, 10 primary UI/UX monitor features

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: Vanilla JS Singleton State Engine** $\rightarrow$ **PASS**. All state logic resides in `/engine/` singletons.
- **Principle II: DOM-Direct Telemetry Updates** $\rightarrow$ **PASS**. Components register text nodes and values are directly updated via `.textContent`.
- **Principle III: Fixed-Pool Row Virtualization** $\rightarrow$ **PASS**. Custom VirtualGrid swaps textContent on a fixed pool of DOM rows.
- **Principle IV: Decoupled Pipeline Derivation** $\rightarrow$ **PASS**. Pipelines process in order: `masterMap -> filter -> search -> sort -> grid`.
- **Principle V: No-Lag Buffering (FIFO)** $\rightarrow$ **PASS**. Ingestion queue buffers batches while paused and flushes synchronously.

## Proposed Changes

### Telemetry State Engine

#### [NEW] [gridEngine.js](file:///d:/Projects/Hackathon/FB_R2/src/engine/gridEngine.js)
The core state orchestrator. Receives stream data, merges into master map, triggers KPI updates, and refreshes the view pool.

#### [NEW] [masterMap.js](file:///d:/Projects/Hackathon/FB_R2/src/engine/masterMap.js)
Stores the 50,000 rows in an ES6 Map keyed by `internal_uid` for O(1) lookup.

#### [NEW] [kpiStore.js](file:///d:/Projects/Hackathon/FB_R2/src/engine/kpiStore.js)
Maintains running counts (Total Streamed, Robots Count, Cumulative Savings) and updates registered DOM text nodes.

#### [NEW] [pipelineBuffer.js](file:///d:/Projects/Hackathon/FB_R2/src/engine/pipelineBuffer.js)
Handles Pause/Play buffering via a FIFO queue array.

#### [NEW] [filterStore.js](file:///d:/Projects/Hackathon/FB_R2/src/engine/filterStore.js)
Applies categorical dropdown filters to the view pool.

#### [NEW] [fuzzySearch.js](file:///d:/Projects/Hackathon/FB_R2/src/engine/fuzzySearch.js)
Applies debounced fuzzy search tokens across 4 fields in the view pool.

#### [NEW] [multiSortState.js](file:///d:/Projects/Hackathon/FB_R2/src/engine/multiSortState.js)
Applies single and multi-column sorting (Shift+click) to the view pool.

#### [NEW] [layoutStore.js](file:///d:/Projects/Hackathon/FB_R2/src/engine/layoutStore.js)
Persists panel display visibility configuration in `localStorage`.

---

### UI Components

#### [NEW] [VirtualGrid.jsx](file:///d:/Projects/Hackathon/FB_R2/src/components/VirtualGrid.jsx)
React shell wrapper for the custom `VirtualGrid` vanilla JS class.

#### [NEW] [KpiStrip.jsx](file:///d:/Projects/Hackathon/FB_R2/src/components/KpiStrip.jsx)
Renders dumb DOM node wrappers for KPI values.

#### [NEW] [FilterBar.jsx](file:///d:/Projects/Hackathon/FB_R2/src/components/FilterBar.jsx)
Renders dropdown filters and search input with 150ms debounce.

#### [NEW] [PauseButton.jsx](file:///d:/Projects/Hackathon/FB_R2/src/components/PauseButton.jsx)
Controls state pause/play directly in DOM.

#### [NEW] [LayoutToggles.jsx](file:///d:/Projects/Hackathon/FB_R2/src/components/LayoutToggles.jsx)
Toggles Grid, Chart, and infrastructure panel displays.

---

### Styles & Utilities

#### [NEW] [formatters.js](file:///d:/Projects/Hackathon/FB_R2/src/utils/formatters.js)
Formatting helper functions for currency, percentages, and numbers.

#### [NEW] [alertStyles.js](file:///d:/Projects/Hackathon/FB_R2/src/utils/alertStyles.js)
Class names and trigger reflow utilities for CSS flash alerts.

#### [NEW] [grid.css](file:///d:/Projects/Hackathon/FB_R2/src/styles/grid.css)
CSS for table layouts, virtual scroller, cell alignments, and alert keyframes.

---

## Proposed File Hierarchy

```text
src/
├── engine/
│   ├── filterStore.js
│   ├── fuzzySearch.js
│   ├── gridEngine.js
│   ├── kpiStore.js
│   ├── layoutStore.js
│   ├── masterMap.js
│   ├── multiSortState.js
│   └── pipelineBuffer.js
├── components/
│   ├── FilterBar.jsx
│   ├── KpiStrip.jsx
│   ├── LayoutToggles.jsx
│   ├── PauseButton.jsx
│   └── VirtualGrid.jsx
├── utils/
│   ├── alertStyles.js
│   └── formatters.js
├── styles/
│   └── grid.css
├── App.jsx
├── main.jsx
└── index.css
```

## Verification Plan

### Automated Tests
- Run Vitest for formatting, search match, and multi-sort logic checks:
  `npm run test`

### Manual Verification
- Deploy to GitHub Pages:
  `npm run deploy`
- Monitor heap memory in Chrome DevTools to ensure zero leaks.
- Verify 60 FPS scrolling and keyframe row flashes.
