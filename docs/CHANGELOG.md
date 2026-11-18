# automation Changelog

## Version State

Current version: 1.0.2

Release tag: v-1.0.2

Changelog label: v 1.0.2

Source version. The release-tag field is a naming convention; this source publication does not create a deployable image or Git tag.

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
