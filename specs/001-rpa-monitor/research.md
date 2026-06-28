# Research & Decision Log: High-Density Enterprise RPA Monitor

This document registers the key architectural decisions, rationale, and alternatives considered for the RPA Monitor terminal.

## Decisions

### 1. High-Frequency Telemetry State Management
- **Decision**: All live stream processing and data updates are handled by vanilla JS singleton objects outside the React component tree.
- **Rationale**: Telemetry batches arrive every 200ms, mutating up to 50 rows in a 50,000-row dataset. Placing this streaming data inside React state (e.g., `useState`, `useReducer`, or `Context`) triggers global re-renders of the component tree, dropping frames and causing massive memory leaks.
- **Alternatives Considered**:
  - *React Context / State*: Rejected due to excessive rendering overhead and CPU lockups.
  - *Zustand / Redux*: Rejected. While cleaner, they still trigger React re-renders when state selectors update.
- **Result**: **Vanilla JS singletons (e.g., `gridEngine`, `masterMap`)**.

---

### 2. Virtual Grid Rendering
- **Decision**: Recycle a fixed pool of DOM row elements calculated once on mount: `Math.ceil(containerHeight / rowHeight) + 2`. Swapping `.textContent` of existing DOM nodes and updating `style.top` inside a relative scroll container.
- **Rationale**: External libraries (AG-Grid, TanStack Table, react-window, react-virtualized) are strictly banned. Creating 50,000 DOM nodes crashes the browser, while creating/destroying nodes during scroll causes layout thrashing and garbage collection spikes. Recycling a fixed set of DOM nodes keeps the DOM light and maintains 60 FPS.
- **Alternatives Considered**:
  - *Pagination*: Rejected because operators require seamless infinite-scroll telemetry review.
  - *Dynamic Element Creation/Destruction*: Rejected due to layout thrashing.
- **Result**: **Custom Vanilla JS VirtualGrid class**.

---

### 3. Row Mutation Alerts
- **Decision**: Toggling CSS classes (`row-flash-alert` and `row-flash-warn`) on row DOM elements. The alert styles use CSS `@keyframes` with `animation-fill-mode: forwards` to auto-clear without JS cleanup. Restarting animations is handled by forcing a reflow via reading `rowEl.offsetWidth`.
- **Rationale**: JS animation loops require continuous style changes, forcing layout calculations on every frame. Banned CSS-in-JS and Framer Motion require native animations. CSS animations run hardware-accelerated and auto-clear safely.
- **Alternatives Considered**:
  - *JS timeouts for class removal*: Rejected because timeouts hold closures that cause memory leaks.
- **Result**: **CSS Keyframe Animations**.
