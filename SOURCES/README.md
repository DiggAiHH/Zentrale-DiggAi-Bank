# SOURCES — Watched Repos

Liste der Repos, die der Daily-Sync (täglich 20:00 Berlin) auf neue Learnings überwacht.

---

## §1 Aktuelle Sources

Siehe `sources.json` für die maschinen-lesbare Version.

| Repo | Type | Priority | Watch-Paths |
|---|---|---|---|
| `Lou-Intit` | bootstrap-kit | high | `_bootstrap/04_MEMORY_LEARNINGS.md`, `_bootstrap/02_METHODIK_WORKFLOW.md`, `INDEX.md` |
| `diggai-anamnese` | production-app | high | `memory/runs/`, `progress.txt`, `VERSTAENDNIS_LUECKEN.md`, `CLAUDE.md`, `AGENTS.md` |
| `JoBetes` | production-app | medium | wie oben |
| `wanderwell` | production-app | medium | wie oben |

---

## §2 Neue Source hinzufügen

1. `sources.json` editieren — neuen Eintrag in `watched_repos` Array
2. Felder:
   - `name`: Repo-Name (ohne Owner-Prefix)
   - `url`: Voll-URL
   - `branch`: meist `main`
   - `type`: `bootstrap-kit` / `production-app` / `research` / `docs`
   - `watch_paths`: Pfade die der Sync scannt (innerhalb des Repos)
   - `priority`: `high` / `medium` / `low` — beeinflusst Reihenfolge bei Rate-Limit
3. Commit
4. Beim nächsten Sync wird das neue Repo mit-überwacht

---

## §3 Source entfernen

Eintrag aus `watched_repos` löschen. Historische Learnings aus dem entfernten Repo bleiben in der Bank — Source-Verweise zeigen weiterhin auf das Repo (auch wenn nicht mehr aktiv überwacht).

---

## §4 Watch-Paths-Konvention

Bevorzugt sind Pfade, die **Memory-Files** des Bootstrap-Pattern enthalten:
- `memory/runs/<YYYY-MM-DD>_<agent>_<model>-<NN>.md` — strukturierte Run-Logs
- `progress.txt` — append-only Learnings
- `VERSTAENDNIS_LUECKEN.md` — offene Fragen + RESOLVED-Status
- `CLAUDE.md` / `AGENTS.md` — Discovered Patterns

Repos ohne diese Struktur können trotzdem überwacht werden — der Sync extrahiert dann nur aus Commit-Messages + Diffs.

---

**Owner:** Laith Alshdaifat · `DiggAi@tutanota.de` · Stand 2026-05-19
