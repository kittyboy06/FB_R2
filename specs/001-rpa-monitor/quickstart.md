# Quickstart Validation Guide: High-Density Enterprise RPA Monitor

This guide details the procedures for launching, validating, and testing the RPA Monitor application.

## Prerequisites

Ensure the following tools are installed:
- Node.js (v18+)
- git
- Web browser (Chrome recommended for devtools checking)

## Setup Commands

1. Clone or navigate to the workspace root:
   ```bash
   cd d:\Projects\Hackathon\FB_R2
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```

## Development & Run Commands

1. Start the local development server:
   ```bash
   npm run dev
   ```
2. Open the browser at the local address printed by Vite (typically `http://localhost:5173`).

## End-to-End Validation Scenarios

### Scenario 1: Telemetry Streaming & KPI Counters
- **Action**: Load the application and watch the KPI Strip.
- **Expected Outcome**: 
  - The "Total Streamed Rows Processed" counter increments every 200ms by the batch sizes.
  - "Active Robots Deployed" and "Global Cumulative Savings" increase dynamically.
  - Updates occur with zero lag or layout shift.

### Scenario 2: Virtualized Scrolling
- **Action**: Scroll down the grid rapidly.
- **Expected Outcome**:
  - The scroll feels highly responsive at 60 FPS.
  - Inspecting the DOM in Chrome DevTools shows a fixed count of row nodes in `<div class="vgrid-row">`. No new nodes are created or destroyed during scroll.

### Scenario 3: Anomalous Flash Alerts
- **Action**: Monitor the rows for status changes or negative ROI.
- **Expected Outcome**:
  - Rows with `Failed` status transition with a yellow warning background flash.
  - Rows with negative ROI transition with a red alert background flash.
  - Background flashes fade out smoothly and clear automatically without shifting layout.

### Scenario 4: Pause/Play Buffer Sync
- **Action**: Click the Pause button (`pause-btn`), wait 10 seconds, then click Play.
- **Expected Outcome**:
  - Clicking Pause freezes the grid view, while the background continues capturing streaming telemetry.
  - Clicking Play flushes the accumulated buffer synchronously in FIFO order. Visual updates resume immediately without any skipped records.
