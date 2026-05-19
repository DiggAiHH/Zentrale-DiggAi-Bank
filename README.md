# Zentrale DiggAi Bank — Central Knowledge Bank

Zentrale Wissensbank, die **täglich abends (20:00 Berlin)** Learnings aus allen DiggAiHH-Projekten aggregiert. Pulls new commits, run-logs, and patterns from source repos, distills them into curated knowledge files, and uploads agent-specific learnings.

**Owner:** Laith Alshdaifat · `DiggAi@tutanota.de` · Stand 2026-05-19

## How to use

1. **Read the bank:** Browse [`KNOWLEDGE/`](KNOWLEDGE/) for current learnings (what worked, what failed, gotchas, methodology, per-agent, per-tool).
2. **Watch the daily log:** [`daily-log/`](daily-log/) has one file per day with diff of what was added.
3. **Modify what gets synced:** Edit [`SOURCES/sources.json`](SOURCES/sources.json) to add/remove watched repos.
4. **Modify the sync prompt:** See [`DAILY_SYNC_PROMPT.md`](DAILY_SYNC_PROMPT.md) for the agent prompt.
5. **Modify the schedule:** See [`DAILY_SYNC_SCHEDULE.md`](DAILY_SYNC_SCHEDULE.md) for cron-config + how-to-edit.

## Structure

- [INDEX.md](INDEX.md) — master navigation + ASCII workflow
- [DAILY_SYNC_PROMPT.md](DAILY_SYNC_PROMPT.md) — the prompt the scheduled agent runs
- [DAILY_SYNC_SCHEDULE.md](DAILY_SYNC_SCHEDULE.md) — schedule config + manual trigger
- [SOURCES/](SOURCES/) — watched repos
- [KNOWLEDGE/](KNOWLEDGE/) — curated knowledge files
- [daily-log/](daily-log/) — daily sync reports

## Schedule

- **Cron:** `0 20 * * *` (Europe/Berlin)
- **Runs:** Every evening at 8 PM
- **Output:** New entries in `KNOWLEDGE/*.md` + `daily-log/YYYY-MM-DD.md` + commit + email notification.

---

Licensed under MIT (see [LICENSE](LICENSE)).
