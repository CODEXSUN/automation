# Phase one — setup, contracts and independent desk

## Product decision

Automation is independent of AI. A workflow consists of deterministic tool steps and optionally agent steps through Zetro's versioned public capability interface. It must remain useful with no AI provider configured. Zetro owns client communication and reasoning; Automation owns workflow definitions, timing and orchestration. AI, Automation and Execution foundations retain reusable mechanism ownership.

## Operation matrix

| Operation | Browser/API | Permission boundary | Outcome |
| --- | --- | --- | --- |
| Overview | `/`, GET `/api/v1/overview` | Local peer/Host/Origin | Configuration presence and catalog count |
| Catalog list | `/automations`, GET `/api/v1/automations` | Local peer/Host/Origin | Read-only code-owned tool records |
| Create/show/edit workflows | Not in phase one | Requires future trusted actor/tenant and persistent module | No fake controls or mutable workflow API |
| Tool execution | Explicit local CLI only | OS operator and repository tool contracts | Actual stdout/exit status; no persisted execution history |

Catalog keys identify installed tools, not database entities. `contracts/automation.ts` declares the read models, proposed step union, dispatch reference and durable run states. Future job arguments convey references, never permissions or secrets. Tenant context in payloads is untrusted until resolved and verified server-side.

## Infrastructure observation — 2026-11-18

- Docker PostgreSQL container is running and healthy. `pg_isready` and an in-container SQL version query succeeded: PostgreSQL 17.12. Docker publishes 5433; native 5432 is a separate target. This is not proof of a new app account or host-authenticated app connection.
- Redis container is running on loopback 6379. Unauthenticated PING returned NOAUTH, confirming a reachable authentication boundary. Authenticated PING, Redis version/config inspection and BullMQ compatibility remain pending credential injection through the operational owner.
- No shared infrastructure image, ACL, binding, volume, account or data was changed. No app database was created or migrated.

## Next implementation boundary

Choose the app PostgreSQL database/schema and trusted identity before persistent workflow APIs. Permanent state stays in PostgreSQL. Use a single atomic run/outbox transaction and one declared migration history. Redis is the queue delivery layer; outages retain work in PostgreSQL as waiting-for-queue. Reconcile unknown effects before retrying. Durable audits, governed MCP tool registration/approval and runtime enforcement are not implemented by this desk.

Store provider credentials and installation metadata through Codeship's implemented operational contract; do not reuse administrator SQL credentials as the app login. Queue and AI package installation waits for the implemented adapter that needs it.
