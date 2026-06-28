# Tasks: High-Density Enterprise RPA Monitor

**Input**: Design documents from `specs/001-rpa-monitor/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/interfaces.md

**Tests**: Unit tests for formatting and sorting logic are included as verification gates.

**Organization**: Tasks are grouped by phases and user stories to support independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable task (independent file changes, no block on incomplete tasks)
- **[Story]**: Associated user story (US1, US2, US3)
- File paths are explicitly defined for all code changes.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base build structure

- [x] T001 Initialize Vite + React project configuration with Tailwind CSS in workspace root
- [x] T002 Create project structure directories (`src/engine`, `src/components`, `src/utils`, `src/styles`)
- [x] T003 [P] Copy `rpa_database_2026.csv` and `dataStream.js` to `/public/` directory
- [x] T004 [P] Configure `vite.config.js` with correct subdirectory base path (`base: '/your-repo-name/'`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state engine infrastructure that MUST be completed before UI development begins

**⚠️ CRITICAL**: No user story work can start until this phase is complete

- [x] T005 Create data model definition and base validation wrappers in `src/utils/formatters.js`
- [x] T006 Implement `masterMap.js` singleton data store in `src/engine/masterMap.js` using ES6 `Map`
- [x] T007 Implement stream callback listener in `src/engine/gridEngine.js` to ingest batches and merge them into `masterMap.js`
- [x] T008 Implement the FIFO buffering queue in `src/engine/pipelineBuffer.js` with Pause/Play logic
- [x] T009 Create base CSS classes and flash alert keyframe animations in `src/styles/grid.css` and `src/utils/alertStyles.js`

**Checkpoint**: Foundation ready - state engines are wired up and ready to ingest stream updates.

---

## Phase 3: User Story 1 - Live Telemetry Monitoring with High-Density Grid and KPIs (Priority: P1) 🎯 MVP

**Goal**: Establish the telemetry display, numeric formatting, CSS flash animations, VirtualGrid virtualization, and live KPIs.

**Independent Test**: Mount grid and run telemetry stream. Verify 60 FPS scrolling, formatted columns, running KPIs, and flashing alert backgrounds.

### Tests for User Story 1
- [x] T010 [P] [US1] Create formatters unit tests in `src/utils/formatters.test.js` to verify currency formats, rounding, and negative clamp fallbacks
- [x] T011 [P] [US1] Create a mock stream test in `src/engine/gridEngine.test.js` to verify telemetry updates merge correctly into the master map

### Implementation for User Story 1
- [x] T012 [US1] Implement currency, number, and percent formatting functions in `src/utils/formatters.js`
- [x] T013 [US1] Implement `kpiStore.js` singleton in `src/engine/kpiStore.js` to accumulate metrics and mutate KPI text nodes directly
- [x] T014 [US1] Implement custom `VirtualGrid` vanilla JS class in `src/components/VirtualGrid.js` for DOM row recycling
- [x] T015 [US1] Create React component wrapper `VirtualGrid.jsx` in `src/components/VirtualGrid.jsx` to mount the VirtualGrid class
- [x] T016 [US1] Create `KpiStrip.jsx` React component in `src/components/KpiStrip.jsx` and register DOM text nodes to `kpiStore.js`
- [x] T017 [US1] Create `PauseButton.jsx` React component in `src/components/PauseButton.jsx` and wire it to `pipelineBuffer.js`
- [x] T018 [US1] Implement row visual alerting (`row-flash-alert` and `row-flash-warn`) in the grid row update function
- [x] T019 [US1] Integrate `gridEngine`, `masterMap`, `kpiStore`, `pipelineBuffer`, and `VirtualGrid` in `src/App.jsx` and mount once

**Checkpoint**: At this point, the core streaming telemetry console (US1) is fully functional and testable as an MVP.

---

## Phase 4: User Story 2 - Telemetry Data Sorting, Filtering, and Fuzzy Search (Priority: P2)

**Goal**: Enable single/multi-column sorting, categorical dropdown filters, and debounced fuzzy search.

**Independent Test**: Apply filters, fuzzy search query, single/multi-column sort, and verify correct viewPool derivation and persistence under live stream ticks.

### Tests for User Story 2
- [x] T020 [P] [US2] Create sorting tests in `src/engine/multiSortState.test.js` to verify multi-column sorting logic with different data types

### Implementation for User Story 2
- [x] T021 [P] [US2] Implement `filterStore.js` singleton in `src/engine/filterStore.js` to filter the viewPool by department, automation type, and industry
- [x] T022 [P] [US2] Implement `fuzzySearch.js` singleton in `src/engine/fuzzySearch.js` to perform debounced out-of-order search
- [x] T023 [US2] Implement `multiSortState.js` singleton in `src/engine/multiSortState.js` to handle single and Shift+click multi-column sorting
- [x] T024 [US2] Integrate `filterStore`, `fuzzySearch`, and `multiSortState` into `gridEngine.refreshViewPool()` in `src/engine/gridEngine.js`
- [x] T025 [US2] Create `FilterBar.jsx` React component in `src/components/FilterBar.jsx` for dropdown selectors and debounced text input

**Checkpoint**: User Story 2 is fully integrated, enabling sorting and filtering pipelines over the live telemetry stream.

---

## Phase 5: User Story 3 - Operator Console Layout Customization and Buffer Control (Priority: P3)

**Goal**: Workspace panel visibility toggling, localStorage persistence, and stream pause buffering.

**Independent Test**: Hide panels, verify visibility state persists on hard reload; pause stream, verify grid freezes, play stream, verify grid updates with all buffered mutations.

### Implementation for User Story 3
- [x] T026 [P] [US3] Implement `layoutStore.js` singleton in `src/engine/layoutStore.js` to load/save visibility states to `localStorage`
- [x] T027 [US3] Create `LayoutToggles.jsx` React component in `src/components/LayoutToggles.jsx` to allow operators to hide/show UI panels
- [x] T028 [US3] Wire panel visibility toggles to `layoutStore.js` and apply display styling to panels in `src/App.jsx`

**Checkpoint**: User Story 3 is complete, enabling workspace layout custom state persistence and telemetry pauses.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Styling polish, performance checks, and production deployment

- [x] T029 [P] Add final styling themes in `src/styles/dashboard.css` for a high-density, dark-theme console layout
- [x] T030 Configure build script in `package.json` to enable `gh-pages` deployment
- [x] T031 Perform a 10-minute stress test, profiling heap allocation and checking Chrome DevTools Performance tab for rendering jank
- [x] T032 Deploy the production build to GitHub Pages and verify assets load successfully without 404s

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phases 3+)**: All depend on Foundational phase completion.
  - US1 (Phase 3) must be implemented first (MVP).
  - US2 (Phase 4) and US3 (Phase 5) can then proceed in parallel or sequentially.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### Parallel Opportunities
- All Setup tasks marked [P] (T003, T004) can run in parallel.
- All Story 1 tests marked [P] (T010, T011) can run in parallel.
- Story 2 filter and search singletons (T021, T022) can be built in parallel.
- Story 3 layout store (T026) can be built in parallel with other Story 3 components.
- Polish styling (T029) can be drafted in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (blocking state stores and streams).
3. Complete Phase 3: User Story 1 (formatters, kpiStore, VirtualGrid, App shell).
4. **Validate**: Test User Story 1 independently with live streaming. Ensure KPI counters and grid render dynamically at 60 FPS.
5. Complete remaining stories sequentially.
