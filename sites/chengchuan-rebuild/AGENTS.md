# Independent rebuild boundaries

- Before development, read `../../docs/PROJECT.md` and `../../docs/PLAN.md`. The only current story specification is ../../docs/design/STORY.md, with SLICE.md and INTERACTION.md in the same directory. Existing code and fixtures are not narrative references. This task is text-only; do not change code, tests, dependencies, deployment, or saves. Follow `../../docs/WORKFLOW.md` for design, deletion, validation, and release.

- Work only inside this project for rebuild development.
- `../chengchuan-firstday` is the preserved original. Do not edit it, restart its service, reuse its hosting identifiers, or migrate/reset its saves unless the user explicitly requests that later.
- Use `http://127.0.0.1:5174` for this project; port 5173 belongs to the original.
- Use `chengchuan-rebuild-v1` and `chengchuan-rebuild-prologue-v1` for browser storage.
- Do not publish or attach this project to the original hosted site.
- Keep first-time-player guidance procedural. Reading, highlighting, drafts and previews must not send messages, grant NPC knowledge, or count as narrative decisions.
- Sources copied from the original are a migration foundation, not evidence that the full product has been redesigned.

## GitHub source of truth

- Repository: https://github.com/TedShao/chengchuan-mystery-game
- Follow the repository root `CONTRIBUTING.md`; future code and document updates should be tested, committed and pushed here, rather than remaining local-only.
- Keep this local development project on 5174. Pushing Git is not permission to deploy the old hosted website.

## GitHub Pages workflow (authorized 2026-10-20)

- Default workflow: browser editing, GitHub Actions verification, and GitHub Pages preview. No Codespaces or paid services.
- Successful main builds publish to https://tedshao.github.io/chengchuan-mystery-game/ . The old hosted site is untouched.
- The Pages build shares src/domain rules with the optional local server. Preserve event and recipient boundaries; do not fork the story rules.
- Use relative web links. Test at a repository subpath with no API server using `build:pages` and `test:pages`.
- Local work is optional; avoid new duplicate working copies. Old narrative documents have been removed under user authorization. Preserve code, test fixtures, and browser saves until a separate implementation task addresses them.
