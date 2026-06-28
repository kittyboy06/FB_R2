# Data Model: High-Density Enterprise RPA Monitor

This document details the structures, data formats, and validation rules for the telemetry records processed by the RPA Monitor.

## Entities

### RpaProject

The core data entity processed by the stream and displayed in the virtual grid.

| Field | Type | Validation Rules | Description |
|---|---|---|---|
| `internal_uid` | string | Required, unique primary key | Identifies the unique state mutation instance |
| `project_id` | string | Format: `PRJ[0-9]{6}` | Unique identifier for the project |
| `company_id` | string | Format: `CMP[0-9]{5}` | Identifier of the company owning the project |
| `project_name` | string | Required, non-empty | Name of the automation project (Fuzzy search target) |
| `project_status` | string | 'Active' \| 'Completed' \| 'Planned' \| 'Failed' | Operational status |
| `automation_type` | string | Required | Type of automation (Dropdown filter target) |
| `robots_deployed` | integer | `>= 0`, default 0 | Number of bots deployed (KPI counter sum) |
| `budget_usd` | integer | `>= 0` | Cost of the project in USD |
| `annual_savings_usd` | integer | `>= 0` | Annual savings generated in USD (KPI counter sum) |
| `roi_percent` | float | Float value | Return on Investment percentage |
| `department` | string | Required | Department responsible (Dropdown filter target) |
| `implementation_partner` | string | Required | Partner implementing the project (Fuzzy search target) |
| `country` | string | Required | Target country (Fuzzy search target) |
| `industry` | string | Required | Vertical industry (Dropdown filter target) |
| `employee_hours_saved` | integer | `>= 0` | Employee hours saved |
| `ai_enabled` | string | 'Yes' \| 'No' | Flag for AI capabilities |
| `cloud_deployment` | string | 'Yes' \| 'No' | Flag for cloud hosting |

## Validation & Sanitation Pipelines

### 1. Ingestion Pipeline
When a telemetry batch is received:
1. Validate that each row contains a valid, non-empty `internal_uid`. If missing, discard the row.
2. Shallow-clone every row from the incoming batch before storing: `{ ...row }`.
3. Discard the original batch array reference to avoid memory leaks.

### 2. Display Formatting
When updating grid cell contents:
1. Clamp numeric displays to `Math.max(0, value)` to prevent rendering negative counts or currency.
2. Format `budget_usd` and `annual_savings_usd` to comma-separated strings prefixed with `$` (e.g., `$1,234,567`).
3. Format `roi_percent` to exactly 2 decimal places with a `%` suffix (e.g., `54.20%`). Clamp display to 0 minimum.
4. Replace `null`, `undefined`, or `NaN` values with `0` or `'—'` depending on the field type.
