# Recruitment desktop rebuild

- Read `../../docs/PROJECT.md`, `../../docs/PLAN.md` and the three current design files before development. STORY owns facts; SLICE owns scene intent; INTERACTION owns behavior. Old Git history is not narrative canon.
- User authorized full frontend/backend replacement on 2026-10-21 and explicitly directed removal of the old 5174 implementation. Do not restore the legacy report, Luoqing, Xuchuan or thanks-game code and fixtures.
- Work in this project. Use 127.0.0.1:5174; the original 5173 and `../../archive/` are not part of this rebuild. Do not publish to the original hosted site.
- `src/domain/` is the single pure narrative engine. The Node API and static Pages adapter use it unchanged. Rendering, previews, private edits and reading must not inform NPCs or send messages.
- Current storage keys are `chengchuan-return-call-v1` and `chengchuan-return-call-ui-v1`. Do not read old-game saves as new-game state. Do not clear unrelated storage.
- Keep page assets and module imports relative for GitHub Pages subpaths. No paid services, cloud database, real emails/phones or AI APIs.
- Test domain behavior, then actual UI and the static Pages build. Screenshots and generated build output stay ignored under qa/ and dist/. Progress belongs in PLAN, not a duplicate progress file.
- Push reviewable changes to GitHub on a feature branch. Main/Pages publication needs its own explicit merge decision. See root CONTRIBUTING.md and docs/WORKFLOW.md.
