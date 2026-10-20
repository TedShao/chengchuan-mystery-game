# v16 前后端与许川流程验证

先运行 `npm run dev`，再运行 `node --test tests/story-domain.test.mjs`、`node tests/refactor-v16.cjs`、`node tests/workdays.cjs`、`node tests/blind-dialogue.cjs`。新界面路线使用真实发送和回复，不注入完成状态。

`npm run build` 后运行 `node scripts/validate-artifact.mjs` 检查部署包中的主页和真实剧情接口。

本版需要 HTTP 剧情接口，下面历史版本的静态服务器说明不再适用于 v16。

# Interaction regression scenarios

## Current version: business bridge / v15

Run `node tests/business-bridge.cjs` for the new no-guide correction-to-business route, false funds inference, refusal/access follow-up, omitted case, real handoff and retraction, persistence and private draft knowledge. Tests use actual UI actions and read state only for assertions. See `PLAYTEST-BUSINESS-V15.md`.

## Retained workdays / v14 regression

Run `node tests/workdays.cjs`, `node tests/luoqing-day.cjs`, `node tests/blind-dialogue.cjs`, and `node tests/luoqing-prologue.cjs`. The first suite covers the new delivery loop, day-one handoff through day-two lunch, divergent ownership/permissions, late inquiries, meeting snapshots, rejected judgments, changes of mind, duplicates and narrow layouts. Only its explicit migration check injects an older save structure; story routes operate the real UI. Existing day/dialogue suites now dismiss persistent receipts and assert that withdrawal affects training permission, not the personal report.

Earlier v1–v11 scripts listed below remain historical references. See `PLAYTEST-WORKDAYS-V14.md` for the current manual walkthrough and practical limits.

Run from the game repository root against a local static preview of `dist/`.

- `free-exploration.cjs`: unguided full-day route captured from actual exploratory play, wrong-claim and wrong-source recovery, contextual dialogue, independent service/signoff comparison, explicit task ownership, archived HR replies and chat viewport preservation.
- `publication-feedback.cjs`: distinct quantity/business corrections, preserved units/scopes, unconfirmed statements and sentence-local claim checking.
- `investigation.cjs`: fresh independent-source inquiry, two normal receipt checks, unrelated and same-origin evidence, publication correction and recovery, held/submitted financial consequences, both final handovers, returning prologue, comparison scroll/drafts and 390px layout.
- `guided-day.cjs`: full prologue-to-clock-out workflow with the guide enabled, work-experience output, detours, revision recovery, contextual topics, one-time HR replies and source-gated follow-up.
- `prologue.cjs`: automatic fades, pause/navigation/skip, keyboard focus, entry, reload, existing save preservation, replay, reset, reduced motion and mobile layout.
- `interaction-edges.cjs`: repeated topics before/after completion, draft isolation, negation/question/quotation handling, one-time HR requests, email routing, report idempotency, archived work invariants, invalid import rejection, duplicate approvals.
- `conversation-matrix.cjs`: eight workflow states × four colleagues × three quick topics × three repetitions = 288 sends. Uses isolated browser contexts and explicit synthetic save fixtures. Verifies that ordinary conversation cannot reset work or repeatedly grant documents.
- `fixtures/completed-day.json`: game-only save captured after a valid playthrough. Contains no real communications or account credentials.

Environment:

- `GAME_URL` defaults to `http://127.0.0.1:5173`.
- `PLAYWRIGHT_MODULE` optionally identifies an installed Playwright module; otherwise resolves `playwright` normally.
- `BROWSER_PATH` optionally identifies a local Chromium/Chrome executable.

Run `node tests/free-exploration.cjs`, `node tests/publication-feedback.cjs`, `node tests/investigation.cjs`, `node tests/guided-day.cjs`, `node tests/prologue.cjs`, `node tests/interaction-edges.cjs` and `node tests/conversation-matrix.cjs`. Results and screenshots go to ignored `qa/`. These are state and interaction regressions, not a human blind playtest or a proof that arbitrary natural language is understood.

Conversation-specific checks added in v10:

- `node tests/dialogue-planner.cjs`: 36 isolated semantic planning cases, including negation scopes, hypotheticals, quotation, corrections, multiple requests, ambiguous references and preserving a historical “changed to” statement. No browser required.
- `node tests/dialogue-context.cjs`: continuous UI chat chains, distinct question facets, scoped explicit grants, ambiguous acknowledgements, persistent/legacy per-person context, role-limited knowledge, old topics after closure and invalid memory import. Uses the same browser environment variables above.
- HR requests in the guided and edge suites now say “请发…” explicitly. Asking whether a file has arrived must not itself grant it.

Personal-stakes checks added in v11:

- `node tests/personal-mystery.cjs`: no-guide opening → channel receipt → timestamped personal OA record → wrong inference and correction → independently verified recommendation basis → prioritized review → separate brand authorization → explicit handover and cancellation. Verifies idempotence, persistence, contextual replies and ordinary work delegation. Forks the actual pre-handover save to verify acceptance and holding without sending the authorization attachment; those branches must not inherit cancellation.

## Current version: Luo Qing / v13

Run `node tests/luoqing-day.cjs` and `node tests/luoqing-prologue.cjs` against a static server serving `dist/`. Set `GAME_URL`, `PLAYWRIGHT_MODULE`, and `BROWSER_PATH` for your environment. The day suite also discovers the bundled desktop Playwright installation when no module override is provided.

These suites use actual UI actions and inspect the resulting messages, document content, recipients, persistence, and next assignments. State is read for assertions, not injected to manufacture route completion. `luoqing-prologue` uses a browser clock to exercise long fade/pause intervals.

All earlier scenario scripts target the retired v1–v11 story. They are retained as historical regression references and are not claimed to pass against the revised case.

### v13 unguided conversation and recovery

`node tests/blind-dialogue.cjs` replays the observed chat-first route with the guide closed, using real UI actions rather than injected completion state. It covers 22 natural-language turns, visible links to service details and colleagues, compound questions, contextual follow-ups, negation, allegation retraction, hearsay versus forwarded originals, role-limited report knowledge, and a mistaken summary adoption followed by withdrawal, revision, reload and clock-out. The script asserts that ordinary chat never sends an inquiry or grants a file. Generated logs and screenshots go to ignored `qa/blind-v13/`.
