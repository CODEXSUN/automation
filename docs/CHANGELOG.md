# automation Changelog

## Version State

Current version: 1.0.6

Release tag: v-1.0.6

Changelog label: v 1.0.6

Source version. The release-tag field is a naming convention; this source publication does not create a deployable image or Git tag.

## v-1.0.6

### [v 1.0.6] 2026-11-18 - Harden worker recovery and review navigation

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/automation version to 1.0.6.
- Reconcile expired running leases even when no new jobs arrive; interrupted work remains visible without automatic repeat execution.
- Protect unsaved human-review notes during app navigation and disable new-run actions until a note is saved or cleared.

## v-1.0.5

### [v 1.0.5] 2026-11-18 - Managed BullMQ worker and human audit review

#### Database Changes

- Database update: Yes (manual).

#### App Codebase Changes

- Bumped @workspace/automation version to 1.0.5.
- Add a managed BullMQ worker with PostgreSQL reconciliation, current Platform authorization at each step, durable outcomes and scoped Redis delivery.
- Add append-only human review decisions, Review inbox and live worker/delivery status pages.
- Add migration 20261118000200_worker_reviews without changing existing history or migrations.
- Include Execution 0.2.0 and Git in the immutable runtime image; CI runs PostgreSQL/BullMQ integration tests.

## v-1.0.4

### [v 1.0.4] 2026-11-18 - Audited application work and pinned container release contract

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/automation version to 1.0.4.
- Include the current app-owned Platform authentication and business changes described in the work record. Add the common .container build/delegation contract and tagged image workflow, pinned to published UI 0.1.8, SDK 0.1.3 and governance source. Source typecheck/build and app/tool checks passed; CodeShip separately verifies image identity, database recovery and runtime admission. Existing data and public IDs are retained; no reset or seed is an update step.

## v-1.0.3

### [v 1.0.3] 2026-11-18 - Audited application work and pinned container release contract

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/automation version to 1.0.3.
- Include the current app-owned Platform authentication and business changes described in the work record. Add the common .container build/delegation contract and tagged image workflow, pinned to published UI 0.1.8, SDK 0.1.3 and governance source. Source typecheck/build and app/tool checks passed; CodeShip separately verifies image identity, database recovery and runtime admission. Existing data and public IDs are retained; no reset or seed is an update step.

## v-1.0.2

### [v 1.0.2] 2026-11-18 - Add local PostgreSQL audit queue and run history

#### Database Changes

- Database update: Yes (manual).
- New module migration: `src/api/modules/business/audit-run/database/migrations/20261118000100_audit_runs.ts`, creating audit_runs and audit_steps. No migration runs during publication or startup.

#### App Codebase Changes

- Bumped @workspace/automation version to 1.0.2.
- Add local PostgreSQL audit queue, idempotent run acceptance, ordered step history, pending cancellation and interrupted-run recovery.
- Add quick/quality/failure-probe variants and shared UIUX run history/detail and queue pages with timing records.
- Include the reviewed @workspace/execution 0.1.0 package artifact so this change does not require unpublished sibling Execution files. Existing framework/UI sibling setup remains documented.
- Adopt the current scoped GitHub helper; publishing uses the reviewed staged files without implicit stage-all, rebase or version changes.
- Keep database credentials, local job data and runtime logs excluded. No Redis/BullMQ, AI or production deployment is enabled. Existing dependency findings remain documented.

## v-1.0.1

### [v 1.0.1] 2026-11-18 - Publish independent Automation setup desk

#### Database Changes

- Database update: No (manual). No migrations, data changes or service configuration changes.

#### App Codebase Changes

- Deliver shared UIUX Overview and Automations catalog with six CLI tools and local guarded APIs/documentation.
- Add prebuild setup audit, public contracts, GitHub helper and version tools; deterministic operation requires no AI.
- Set the initial published application version to 1.0.1 as explicitly requested; retain the original 0.1.0 scaffold entry below.
- Preserve the existing CODEXSUN/automation main history.
- Persistent workflows, BullMQ dispatch and Zetro integration remain planned.
- Known limitation: four high dependency findings in the inherited build-tool chain; see work record.

## v-0.1.0

### [v 0.1.0] 2026-11-18 - Initialize automation scaffold

#### Database Changes

- Database update: No (manual).
- No database or runtime data is created by this template.

#### App Codebase Changes

- Create the governed app structure, shared UI/framework references, environment examples, and work records.
- Include app-local GitHub review, version checks, patch bump/preview, and optional SSH-key tools.
- Add the independent shared UIUX Overview and read-only Automations catalog, guarded APIs and documentation, setup/dispatch contracts and automatic prebuild audit.
- Install dependencies; verify typecheck/build, eight tests, preflight, CLI previews and browser overview/catalog/search/reload. Persistent workflow execution and publishing remain pending; see work record for dependency-audit limitations.
