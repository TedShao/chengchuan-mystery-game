Original prompt: 按这个方向，先做一个可玩的网页原型：模拟公司电脑桌面，包含文档、表格、PPT、邮件、聊天和OA，围绕“制作转正汇报”设计第一个工作日。要能自由操作和摸鱼，也能通过跨软件探索发现异常，不同判断产生不同反馈。

## Implementation plan
- Buildless HTML/CSS/JS desktop with movable application windows; DOM used for accessible editable office tools rather than forcing text editors into a canvas.
- Shared persistent file state, six office applications, private notes, file manager, break room with a playable mini game and desktop customization.
- One first-workday scenario: compare stage rows with unique project IDs, consult source definitions, inspect a reassignment discrepancy, submit a PPT report with factual claims and supporting material.
- Distinct company feedback based on report contents, evidence and recipients; first-day outcomes only, not full-story endings.
- Use deterministic game state hooks, run prescribed Playwright client, then additional UI scenarios for cross-app editing, feedback, saves and free exploration.
- Site registered privately; no external messaging or actual AI dependency.

## Completed
- Implemented nine desktop apps with shared persistent state, native DOM editing, movable/minimizable/maximizable windows and responsive narrow-screen layouts.
- Six office apps include editable documents and copies, 118 source rows/23 unique projects, filters/formulas, three editable slides, contextual simulated email/chat and OA personnel records.
- Added manual evidence collection, private notes, source/copy separation, submission snapshots, distinct numeric/investigation/accusation outcomes, revision and end-of-day recap.
- Added coffee, six-pair memory game, a cup-finding side quest, three wallpapers and optional generated background noise.
- Save export/import and restart work. HR consultation does not count as formal delivery to the manager. Training intention is reversible in this first-day prototype.

## Verification
- JavaScript syntax check passed.
- Prescribed web_game_playwright_client.js passed after implementation and after fixes; latest screenshot visually inspected.
- Supplementary DOM browser flows passed: full evidence path, careful report, compliant report, accurate numeric report, accurate stage-based report, unsupported report and accusation; editable source separation, reload persistence, email composition, all office tools, window controls, leisure and mobile viewport.
- Recovery flows passed: reply recipient routing, export/import including custom documents and notes, reset, HR-only consultation, reversible training intention.
- No browser page or console errors in the exercised flows.
- Screenshots inspected for desktop, email, PPT, break room, feedback and mobile OA/PPT. Fixed notification stacking and narrow mobile metrics after visual review.
- Local browser and HTTP server require the approved unsandboxed runtime on this host; standard shell Node resolves incorrectly, so use the bundled absolute Node path.

## Remaining scope / follow-up
- Full story, subsequent workdays, real outbound messages, generated AI dialogue and the three eventual story endings are intentionally outside this prototype.
- Office tools implement a bounded game-specific subset, not real Office format import/export.
- No blind playtest yet: usability scenarios verify behavior, not suspense, difficulty or audience appeal.
- Consider deeper free-form feedback, document formatting and branching character responses after a human playtest of this workday.

## Revision 2 — work-driven investigation
- Latest scope: subtler source clues; cross-app validation; consequences that change assigned work and colleague responses; coherent real business; an in-world browser with company, intranet and partner websites.
- Added bounded service-business facade, source documents and normal counterexamples. Browser routes and all correspondence are simulated locally.
- Implemented task flow: report → publish/review/inventory → client scope verification → personal handover. Permissions and reactions depend on submitted content, never private notes.
- Preserves v1 local drafts and adds v2 workflow state; historical submissions remain, new afternoon workflow begins on resubmission.

### Revision 2 verification
- Prescribed web-game Playwright smoke client passed; inspected fresh mailbox screenshot.
- Real browser flows passed: internal links/history, hidden personnel attachments, three-source business review, normal delayed-upload counterexample, client scope correspondence, domestic-consent correction, overseas recommendation deferral.
- Branches verified: publishing task updates company homepage and creates follow-up; blanket stop request changes assignment and suspends contact; a sourced, scoped appeal restores review without erasing history.
- V1 and V2 imports, preserved custom documents, reset, editable/source separation, leisure controls, form drafts across app switches and reload all passed.
- All secondary browser pages and unknown-address fallback exercised; 390px layouts and desktop screenshots inspected. No page errors in these runs.
- Site audience remains public. No real external correspondence, live AI, full later chapters, or human blind playtest added.


## Revision 3 — onboarding and conventional office UI
- Latest request: explicit entry guidance/highlights, familiar File/Home office menus and realistic OA including organization chart.
- Added a spoiler-free seven-step coach with pulsing highlights, locate/reopen/disable controls, narrow-screen layout and reduced-motion support. No forced story choices.
- Added office-ui.js as a separate UI adapter; original narrative/branching remains in app.js. Menus perform real bounded actions: save/open/save-as, scoped undo/redo, whole-body styles, insert, independent workbooks, formula helpers, extra slides and keyboard slideshow. TXT/CSV exports make the subset explicit.
- Rebuilt OA as a business portal with dashboard, approvals, department tree, searchable people cards, reporting relationships and chat/mail shortcuts. Added submit/detail/withdraw flow for office supplies.
- Browser scenarios passed: seven-step entry through actual report delivery, document formatting/find/undo/redo/save-as, workbook isolation and formulas, additional slide content/presentation keys, department/person/contact navigation, approvals and reload persistence.
- Existing v2 cross-application story scenarios and three work branches passed with no page errors.
- Inspected 1440px desktop and 390px mobile screenshots for coach, Word-like editor, sheet, OA dashboard and organization chart; corrected inherited narrow topbar button sizing.
- Remaining scope: lightweight simulated office suite; no full MS Office file compatibility or arbitrary rich-text range styling, no real external messaging, no blind human usability test.
- Final prescribed smoke client passed and latest screenshot inspected. Existing v1/v2 import/reset/source-isolation/browser recovery suite passed after the UI adapter and history-reset change.
- Added and verified extra-slide contents in submit preview, immutable report snapshot, and sent mail; avoids creating decorative slides that disappear from the actual delivery.

## Revision 4 — cognitive walkthrough and repair
- Played a fresh public save through the entire first day using visible materials, including a naturally underinformed cautious report and the resulting revision loop; logged UI observations in PLAYTEST.md. This was an informed developer walkthrough, not a human blind test.
- Fixed forced intro edits; state-aware revision/review/publish/audit/followup/closed coach; clear material collection vs actual report attachment; source reopening; dynamic desktop task/clock; premature end-day completion; formula Enter and reversible data-tool labels.
- Removed prematurely explanatory contract/public copy. Split customer scope replies and personnel authorization follow-ups; personnel documents now require an explicit request. Personal hold requires own relevant documents, not collecting another person's signature. Added recorded handover explanation.
- Replayed revised first day to clock-out without collecting SN-0824. Verified scoped customer reply, later personnel follow-up, saved material references, and reload persistence. Independent branch scenarios and office interaction scenarios passed without page errors.
- Targeted usability scenarios passed: confirm unchanged accurate intro, formula Enter, incomplete report recovery with missing-document categories, no false clock-out completion, report and guide state across reload.
- Screenshots inspected for actual play, source-only reply, final work state, desktop and 390px guide. Prescribed web-game client passed during revisions.
- Remaining limits and next human playtest questions are recorded in PLAYTEST.md. Do not describe these runs as a human blind test or a completed full-story validation.

## Revision 5 — repeated actions and state boundaries
- Reproduced four concrete failures before editing: identical cup replies, duplicate cup-completion notifications, lost unsent chat draft, and negated allegation incorrectly triggering audit.
- Applied dialogue-systems guidance with a bounded topic/state runner, stable line IDs and persisted conversation counters. Facts and transitions are separate from reply lines; exhausted topics stop responding, state changes unlock updated replies, and quick choices reflect completion.
- Shared recipient-aware intent handling across chat and mail; explicit broad stop requests only, with negatives/questions/hypotheticals/quoted forwards excluded. Added per-colleague chat drafts and mail draft retention; fixed external-reply routing and non-supervisor report attachments.
- Added one-time and current-stage guards for work forms, reports, customer replies, approvals and completed side events. Report supplements cannot restart assigned work. Archived intent is read-only; old contradictory closed states normalize from completion records. Fixed OA pending/status display.
- Save import validates before mutation, rolls back on invalid input and replaces custom documents rather than leaking files across saves. Unique document/workbook IDs avoid rapid-creation collisions.
- Tests: 252-message conversation matrix across seven phases passed without stage/permission changes or repeated HR grants; targeted edge scenarios passed. Existing full story/branch tests and v1/v2 recovery suite passed. Prescribed client and screenshots inspected. See EDGE-CASES.md for exact scope and limits.
- Reusable tests and game-only completed-save fixture are tracked under tests/. Generated QA logs/screenshots remain ignored. No real outbound communication or unrestricted natural-language AI added.


## Revision 6 — cinematic opening
- Replaced the initial modal with five black-and-white pages covering unemployment, the offer and legitimate company business, seven weeks of everyday work, the manager's request and desktop guidance. No mystery spoilers.
- Added 1.1-second fades and 10.5-second automatic page intervals, pause/resume, previous/next, skip-to-final and explicit workspace entry. Reduced-motion users start with manual, immediate transitions. Hidden tabs do not advance automatic reading; the desktop is inert until entry.
- Completion is browser-local and separate from game saves. Existing players see the new introduction once without losing progress; help offers replay, and resetting the game starts the sequence again. Fresh entry opens the assignment email.
- Tested automatic timing, pause, Escape, arrows, keyboard focus, repeated navigation, skip, explicit entry, refresh, old completed saves, replay identity and reset. Inspected desktop and 390px screenshots. Fixed transient blank frames in reduced-motion navigation. Interaction edge regression suite and standard web-game client passed with no page errors.


## Revision 7 — prologue-to-work cognitive walkthrough
- Walked an isolated fresh game through all five prologue pages, report, publishing, three-receipt review, client reply, personal handover and clock-out using visible UI. Observed missing weekly-note output task, premature chat shortcuts, duplicate first HR responses, missing work text in report preview, and dead-end CMS completion copy.
- Added source-purpose document panels and a two-part weekly-note → editable PPT work-experience step. Dictionary guidance explains reading goals and returning to the table; data tools open on guided entry. Detours return to the current step instead of incrementing it; existing drafts and completion remain intact.
- Added read-source flags for contextual quick topics and source-gated personnel authorization follow-up. One HR chat response per first grant; repeat guards remain. Removed colleague-supplied normal-receipt answer and aligned scope/timeline wording. Added full work-body preview and CMS next-task link.
- New tracked tests/guided-day.cjs completes the entire revised day from prologue with contextual guide enabled, including recovery, sources, response timing, handover and reload. Existing branch and interaction regressions passed; 252-message phase matrix passed. Inspected desktop and 390px screenshots plus standard web-game client output.
- This remains a developer walkthrough, not a blind human usability study; subsequent chapters and arbitrary natural-language understanding are outside this revision. See PLAYTEST.md for exact findings and limits.

## Revision 8 — returning-player opening and source comparison
- Fixed prologue entry: every page load opens the five-page prologue. Returning-player controls explicitly preserve and resume the save; replay/reset remain distinct. Asset revision URLs prevent stale script reuse after this update.
- Replaced prescribed three-attachment gating with selected-source reasoning: compare a financial record against a contract, actual service log, or execution testimony. Excerpts have original-source links; source selection preserves scroll, draft, and form identity.
- Added discoverable execution dialogue after reading the weekly log/service desk. Added original P-12 timestamps and P-09 service signoff. Normal receipts can be investigated and released persistently; duplicate/unrelated sources and repeated channel claims do not establish independent corroboration.
- Decisions now affect work: unchecked publication creates W-208, hides the homepage claim, assigns link cleanup to Xiaoyu, and requires a supported correction; conservative publication avoids it. Scoped hold and channel-based submission produce different financial status, colleague duties and client replies. Broad-stop appeals cannot bypass unfinished correction work.
- Work replies appear above long forms; audit recovery accepts the same independent-source alternatives as ordinary review. Client response remains consistent between mail and browser.
- Added tests/investigation.cjs with isolated fresh playthroughs, both final handovers, correction/recovery, scoped/broad judgments, source-scroll/draft checks, and 390px screenshots. Expanded conversation matrix to eight states / 288 sends. Updated existing opening/guided-day/repetition tests for returning prologue.
- Validation: investigation, guided-day, prologue, interaction edges and eight-state conversation matrix passed; no browser page errors in these runs. Desktop/mobile comparison screenshots inspected. Final standard web-game client run and syntax/diff checks recorded in qa/.
- Limits: structured selections drive deterministic reasoning outcomes; free-text rationale is recorded, not understood by a general language model. Publication checking covers authored first-day claim patterns, not arbitrary factual text. This is developer playtesting, not independent novice blind testing; only day one is implemented.

## Revision 9 — unguided cognitive walkthrough and recovery
- Started an isolated new browser save, read the opening, chose Free Exploration, and advanced only via visible mail, PPT links, documents, chat and browser navigation. Did not import a solved fixture for this walkthrough. Used 118 stage records, retained an unsupported launch claim, investigated an ordinary receipt using service/signoff rather than the previous date/mail pair, then completed the client inquiry and personal handover.
- Observed failures: a partially corrected public draft received generic two-part blame and reset its correct unit; a contextual "what was wrong?" got an unrelated fallback; a valid K-12 service comparison was rejected as a date question; P-09 had a hidden-facts collect button without a readable original; the shared billing snapshot described only K-17; receipt chat links opened the generic mailbox; executor dialogue volunteered billing suspicion; follow-up work dialogue said to wait before the inquiry had been sent; HR interpreted deferral questions as attachment requests and forgot the archived outcome; chat rerenders hid latest responses.
- Fixed those failures: per-claim correction reasons and draft defaults; current-work publication/deferral topics without automatic decisions; K-12 supports both independent service/signoff and chronology comparisons; P-09 has a source page; billing/receipt excerpts match visible originals; exact-email referrals; bounded executor knowledge; optional raw export log instead of a narrated mapping; explicit ownership transfer of remaining receipts; correct send-before-wait directions; message viewport preservation and synchronous new-message visibility; deduplicated identical toast notices.
- Added tests/free-exploration.cjs capturing the observed unguided route with wrong-source recovery, source-linked dialogue, no hidden-state fixture, correction details, ownership transfer, bounded HR responses, scroll preservation and clock-out. Added tests/publication-feedback.cjs for separate metric/business errors, negated/unconfirmed claims, and sentence-local checking. Updated the P-09 source path in the existing investigation regression.
- Validation passed: new full unguided regression (twice, after scroll fix), four publication cases, existing investigation paths, guided full day, interaction edges and eight-state / 288-message conversation matrix. Standard web-game client also executed; actual correction, archived chat and clock-out screenshots inspected. No page errors reported by these checks.
- Limits remain: this is a developer cognitive walkthrough, not an independent human blind study. Structured evidence/choices and bounded topic/claim patterns drive the simulation; arbitrary natural-language understanding and later chapters are not implemented. Next useful validation: observe an unfamiliar human with guide off and record where they cannot explain a mismatch or locate an original.

## Revision 10 — contextual coworker conversations
- Reproduced the user-facing failures through actual chat: a pronoun follow-up lost its subject; the second question in a message disappeared; “不是要沈念的资料，我问工资” granted an unrelated personnel file.
- Added an offline conversation planner in `dist/dialogue.js`: per-colleague and per-channel topic memory, bounded referent resolution, multiple topic/facet planning, clarification of ambiguous references, clause-local negation, whole-turn correction/cancellation and separate command intent. The entire turn is planned before document grants or workflow changes execute.
- Questions about personnel files now explain status/access without issuing a request. Contextual “那发我一份” requires one unambiguous subject; “好的” is never an approval. Relevant quick replies explicitly request files when needed. Existing task and file mutations remain idempotent.
- Replies now distinguish location, reason, next step, status and challenge, using current route and document availability. Vague test questions no longer reveal executor testimony. Closed work/archived personnel intent cannot be rewritten by a chat correction. Known sources remain linked from each part of a multi-question answer.
- Replaced topic-only exhaustion with whole-turn semantic repetition limits so a repeated topic inside a new compound question is not silently omitted. Added memory persistence/import validation and conservative recovery of subjects from older chat histories. Chat and email reference contexts are separate.
- Found and fixed additional regressions during play: quoted/hypothetical requests, a generic “请核对资料” inheriting a stop command, historical “已经改成” being mistaken for a new correction, equivalent deferral questions consuming separate repeat budgets, and unrelated small talk borrowing an old topic.
- Added `tests/dialogue-planner.cjs` (36 command/scope/reference cases) and `tests/dialogue-context.cjs` (continuous browser conversations, refresh/legacy history, multi-question links, completed work and invalid imported memory). Updated existing HR test actions from implicit questions to explicit requests; did not weaken their workflow assertions.
- Limits: deterministic authored topics/facets, not a general language model. Unknown or ambiguous language asks for clarification; it cannot understand arbitrary statements or infer proof of a crime. This round is developer playtesting and regression testing, not an independent human study.
- Final validation: 36 planner cases; 48-message continuous browser suite including legacy context and invalid import; eight-state 288-message matrix; interaction edges; guided full day; unguided full day; independent investigation branches all passed after relevant fixes. Standard web-game client ran and actual opening, multi-topic chat and closed-work screenshots were visually inspected. No page errors in the passing browser suites; JavaScript syntax and diff whitespace checks passed.

## Revision 11 — a personal mystery across the office tools
- AI integration remains parked. Reframed the opening around the player's unconfirmed recommendation: an external roster says “本人已确认” while a timestamped OA export has no employee confirmation. Department approval, external registration and employee consent remain distinct.
- Added an authored, evidence-driven investigation in the private notes app. The player explicitly sends selected original-source comparisons; private collection and ordinary questions do not change consent. HR corrects the external record only after the right comparison, then forwards the channel's actual recommendation basis.
- Connected existing CC-017/K-17 evidence to that basis: 120 sandbox cases are represented as 120 real customers to support a staffing recommendation. The player must compare independent sources; equal counts, repeated channel claims and accusations against every customer are insufficient. The basis is withdrawn after a supported inquiry, with HR, supervisor and channel correspondence reflecting it.
- A supported personal inquiry prioritizes scoped review without first forcing the player to solve the unrelated report-count exercise. Other normal receipts can pass to Tang. Brand authorization remains a separate explicit inquiry after reading the reception document; an ordinary business reply does not grant the personnel conclusion.
- Explicitly attaching the authorization reply to a hold handover cancels this round of recommendation and adds original-record handover to tomorrow's work. Acceptance, unexamined records and a hold without sending that reply retain different outcomes. Archived dialogue and the end-of-day recap reflect the actual action rather than a generic performance grade.
- Wrong inferences can be corrected; semantic duplicates are idempotent even with reworded notes/reordered evidence. New fields support older saves and import validation. Original documents are never rewritten when the channel corrects its records.
- Developer walkthrough: fresh opening with guide disabled; initially alleged forgery, corrected to record discrepancy, initially equated both 120 counts, corrected using the order, then followed the supporting business records through brand confirmation and cancellation. Found/fixed an irrelevant metric gate and a stale HR response waiting for a course after cancellation.
- Validation: personal-mystery UI replay (including incorrect and alternative conclusions), guided-day, free-exploration, investigation, interaction-edges, dialogue-context, dialogue-planner and prologue passed in this revision's validation cycle. Standard web-game client rendered the opening with no reported errors. Desktop screenshots inspected; mobile inspection recorded in QA. Not a blind human playtest; claims are evaluated through authored choices/source pairs, not unrestricted natural-language understanding. Only day one is implemented, and these discrepancies do not alone establish the later criminal backstory.

## 2026-10-19 / v12 罗青案例落地

- Replaced the old project-count/HR/overseas-confirmation mystery with the revised Luo Qing case and first-day screenplay. Removed obsolete narrative modules from the deployed bundle.
- Retained office shell, ribbons, editable copies, PPT/presentation, organisation chart, supply requests and leisure apps.
- Added timestamped original materials, service/feedback/current worksheets, recipient-scoped sharing, versioned personal/shared/training documents and explicit handoff/career decisions.
- Added state-aware chat and separated work actions from conversational text. No AI integration.
- Playtesting found and fixed: “是不是” misread as denial; guide pointer-up redraw swallowing clicks; hidden coach CSS; full-window end-day access; state-switch dedup preventing change of mind; repeated Re prefixes and inconsistent reply times; project replies targeting Luo instead of Shen; formula ranges ignoring the chosen column.
- Current suites: tests/luoqing-day.cjs (fresh-context divergent routes and office operations), tests/luoqing-prologue.cjs (fade/timing/reload/mobile). Detailed results in PLAYTEST-LUOQING.md.

## 2026-10-19 / v13 unguided conversation and mistaken-report recovery

- Started isolated saves with guidance disabled, chatting before reading the case. Recorded concrete failures: file-location questions revealing unrelated overseas details; lost counts → last item → recipient context; negation and hearsay ignored; recovery questions falling back to generic lines.
- Added bounded coworker-dialogue.js with per-person topic and conversational memory, explicit focus correction, multi-topic clarification, hearsay versus actual receipt, and role-limited personal report knowledge. Dialogue offers normal source links and explicit confirmation controls without mutating task state.
- Added complete service-record inspection from ordinary row identifiers and contact links so narrow tables do not hide key fields. No conclusion highlights or evidence checklist.
- Walked naive shared-summary adoption through real training changes, withdrawal, version-two resubmission, reload and clock-out. Fixed stale training-source answers and report synonyms discovered in the first regression replay.
- New tests/blind-dialogue.cjs passes 22 natural-language turns with no page errors. Prescribed web-game client executed; actual record and recovery screenshots inspected. Existing luoqing-day routes rerun after final dialogue fixes. See PLAYTEST-BLIND-V13.md for precise findings and limits.
- Retained v12 save key/version and free office/leisure. This is developer cognitive walkthrough and regression coverage, not an independent human blind study or unrestricted language understanding.

## 2026-10-19 / v14 delivery loop and second-day continuation

- Implemented the revised screenplay's usable work loop: choose a real work item, preserve an independent draft, preview the actual file and recipients, receive a durable delivery receipt, get a separate supervisor review and revise without losing history. Blank seeded headings cannot count as completed work; ordinary chart and scheduling cases can complete without solving Luo's case.
- Added workdays.js with explicit afternoon/day transitions, role-scoped project draft and actual reply, three training sources, independent permission snapshots, attendance/decline choices, immutable meeting records, post-meeting notices, own-work confirmation and optional collaboration review/fee/history scopes.
- Corrected reports do not silently accept followup. Refusal plus an actual forwarded letter lets Xiaoyu continue as the named owner. Safety-only inquiries do not create funds drafts. Private Shen threads do not fabricate original CC recipients. No bank response or full criminal conclusion is generated in this chapter.
- Fixed re-authorization after withdrawal, private report updates leaking into an older training version, incomplete generic work feedback, and review rerenders losing the player's scroll position. Kept source/read/copy boundaries, office menus, leisure, v12 save key and v13 completion migration.
- Seven new browser route groups plus current Luo day, 22-turn dialogue and prologue suites exercised. Prescribed web-game client and actual desktop/mobile screenshots inspected. See PLAYTEST-WORKDAYS-V14.md; this is developer testing, not independent novice research. AI and later chapters remain outside this implementation.


## 2026-10-19 / v15 business continuity after correction

- Unguided fresh-save walkthrough found the central business question was treated as a funds-status question, and correction lacked a continuing question. Added service-scope correspondence, contract-scope excerpt and role-limited follow-ups through business-bridge.js.
- Added independent domestic-window proposal and explicit acceptance/refusal/clarification with actual handoff records. Refusing does not prevent ordinary record verification. Individual report correction does not claim shared changes; overseas archive metadata does not prove criminal facts.
- Fixed private draft knowledge leaking to Xiaoyu, stale confirmation modal, irrelevant repeated introduction after refusing, self-contact links, query-day chronology and sender/notification mismatch. Question drafts now persist after input.
- New three-route UI regression plus retained workdays, 22-turn dialogue and Luo case suites passed in the revision cycle. Standard client and screenshots inspected; full exploratory route reached day-two morning without guidance. See PLAYTEST-BUSINESS-V15.md for limits.
- Preserves v12 saves, office/leisure controls and public hosting. No AI integration or forced detective checklist.


## 2026-10-19 / v16 frontend/backend separation and Xu Chuan

- Read official sources and sampled Notpron entry, Murdle tutorial cards/notebook, and the Chinese simulated restaurant site. Roottrees browser entry was security-blocked; its developer retrospective was read, not claimed as played. Exact coverage in docs/RESEARCH-REFACTOR-V16.md.
- Moved editable client assets to web/. Added pure domain, actual HTTP handler, local server and deterministic Worker packaging. Kept public Site identity and existing local saves. New chapter state is replayed from a browser event log; no shared player state, cloud-save or anti-cheat claims.
- Added service desk with correspondence, original records, drafts, previews, durable receipts and contact history. Free office/notes/leisure retained. New appointments require actual messages and recipient consent, not reading or conversational keywords.
- Tested fresh no-guide routes to lunch: omission, wrong funds inference, refusal, pause/resume/re-pause, persistence, failed transport/retry, private knowledge, mobile and office play. Retained workday and dialogue regression suites passed in this revision cycle.
- Fixed duplicated identity sends, stale 14:30 invitation after rescheduling, lunch reviving paused appointments, private messages reaching non-recipients, ambiguous free-text follow-up, and async test assumptions.
- Existing first-day simulation remains a compatibility client module. Afternoon conversation itself is not yet implemented; this scope ends at lunch with real future arrangements.

## 2026-10-19 / v17 second-day afternoon

- Implemented revised afternoon screenplay through clock-out, inheriting morning booking/refusal and legacy actually delivered Luo correspondence. Added meeting speech, ordinary public-site search, scoped forwarding, original documents, institutional inquiry pending state, and company continuation decisions.
- Actual recipients determine who can respond: private retraction does not correct Xu; later old-page delivery contradicts Lu's earlier May-only explanation; Xiaoyu refuses new introductions only after receiving the relevant original and continued-introduction decision. Zhou then owns that work, while existing user questions remain with Xiaoyu.
- Integrated office mail and chat with the same server command log. Retained free office/leisure, v12 saves and public Site identity. No AI, real messaging, or third-day resolution.
- Browser walkthrough found and fixed hidden meeting replies, missing visible failed-send explanation, stale original-mail responder, duplicated correction feedback, premature meeting completion after cancellation, and backward scene time. Negated questions, narrow participation, repeated advance and actual sharing consent covered.
- See PLAYTEST-AFTERNOON-V17.md for routes, evidence and limits. Automated real-browser walkthrough is developer testing, not independent human novice research.
