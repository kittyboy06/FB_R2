# Interface Contracts: High-Density Enterprise RPA Monitor

This document details the external interfaces and data exchange contracts for the RPA Monitor.

## 1. Telemetry Stream Interface (window.initializeRpaStream)

The application consumes mutations from a global stream provider injected by the host environment.

### Registration Contract
The stream is initialized by calling a globally registered function:
```javascript
window.initializeRpaStream(callback, csvPath);
```
- **`callback`**: `Function(incomingBatch: Array<RpaProject>)`
  - Ingests an array of mutated row records. Fired every 200ms.
- **`csvPath`**: `string`
  - Path to the source CSV file. Must be resolved relative to the base URL:
    `${import.meta.env.BASE_URL}rpa_database_2026.csv`

### Mutation Batch Schema
Each batch contains between 5 and 50 records matching the `RpaProject` entity schema, with randomly mutated values (e.g., status changes, revenue fluctuations, bot count modifications).

---

## 2. Layout Persistence Contract (localStorage)

Operator dashboard panel configurations are persisted locally.

- **Storage Key**: `rpa_layout_v1`
- **Serialization Format**: JSON string representing a flat object:
  ```json
  {
    "gridWindow": boolean,
    "analyticsChart": boolean,
    "infraToggles": boolean
  }
  ```
- **Default State**:
  ```json
  {
    "gridWindow": true,
    "analyticsChart": true,
    "infraToggles": true
  }
  ```

---

## 3. DOM Binding Contracts (Direct Mutations)

The vanilla JS state singletons interact with specific DOM elements via unique IDs.

### KPI Elements
KPI text nodes register directly into `kpiStore` on mount:
- `totalRows` $\rightarrow$ Target: Inside element with ID `kpi-total-rows`
- `totalRobots` $\rightarrow$ Target: Inside element with ID `kpi-total-robots`
- `totalSavings` $\rightarrow$ Target: Inside element with ID `kpi-total-savings`

### Layout Control Panels
Layout panels toggle visibility by setting `style.display`:
- Grid panel: ID `panel-gridWindow`
- Analytics Chart panel: ID `panel-analyticsChart`
- Infrastructure Toggles panel: ID `panel-infraToggles`
- Toggling is bound to buttons: `btn-toggle-grid`, `btn-toggle-chart`, `btn-toggle-infra`.
