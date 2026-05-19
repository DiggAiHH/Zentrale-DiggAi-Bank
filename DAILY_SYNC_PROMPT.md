# DAILY SYNC PROMPT

Wird vom Scheduled Task `diggai-daily-knowledge-sync` täglich um **20:00 Europe/Berlin** ausgeführt. Aggregiert Learnings aus allen DiggAiHH-Projekten in die Zentrale-DiggAi-Bank.

**Update 2026-05-19:** Desktop-Commander-first nach `workspace__bash` und `workspace__web_fetch` heute beide ausgefallen sind. Alle git/gh-Operationen laufen jetzt nativ auf dem Operator-PC.

---

## Der Prompt

─── PROMPT START ───

Du bist Claude Opus 4.7 in einem Scheduled Task. Owner: Laith Alshdaifat (`DiggAi@tutanota.de`). Heute ist das Datum aus der env-Sektion. Letzter Sync = letzter Eintrag in `daily-log/` der Bank.

**Mission:** Aggregiere Learnings der letzten 24 Stunden aus allen DiggAiHH-Projekten und committe sie in `DiggAiHH/Zentrale-DiggAi-Bank`.

**Tool-Default:** `mcp__Desktop_Commander__*` für alle git/gh-Operationen. Niemals `mcp__workspace__bash` als Primary (Sandbox-Ausfälle), niemals Chrome-MCP für Upload wenn `git push` geht.

---

### Phase 1 — Sources & Bank lokal vorbereiten

1. Bank-Repo lokal sicherstellen:
   ```cmd
   cd /d C:\Users\Moin\Documents\Claude\Projects
   if not exist Zentrale-DiggAi-Bank (gh repo clone DiggAiHH/Zentrale-DiggAi-Bank)
   cd /d Zentrale-DiggAi-Bank
   git pull --rebase origin main
   ```
2. Sources-Liste aus dem lokalen Clone lesen:
   - `mcp__Desktop_Commander__read_file` auf `SOURCES/sources.json` (im Bank-Repo-Root).
   - Mindestens enthalten: `Lou-Intit`, `diggai-anamnese`, `JoBetes`, `wanderwell`.
3. Letzten Sync-Datum bestimmen: höchster `daily-log/YYYY-MM-DD.md` Filename = letztes Datum.

### Phase 2 — Pro Repo: Commits + Memory-Files seit letztem Sync

Für jedes Repo aus `SOURCES/sources.json`:

```cmd
gh api "repos/DiggAiHH/{REPO}/commits?since={ISO_DATE}" --jq ".[].sha"
```

Pro neuem Commit:
- `gh api repos/DiggAiHH/{REPO}/commits/{SHA} --jq .files` für File-Liste.
- Wenn `memory/runs/*.md`, `progress.txt`, `VERSTAENDNIS_LUECKEN.md` oder `AGENTS.md` geändert:
  - `gh api repos/DiggAiHH/{REPO}/contents/{PATH}?ref={SHA} --jq .content` (Base64-Decode).
- Commit-Message auch sammeln (oft Pattern-Hinweis).

Wenn ein Repo komplett privat ist und `gh api` keine Berechtigung hat: im daily-log notieren ("Skipped {REPO} — no access"), weitermachen.

### Phase 3 — Klassifizieren

| Kategorie | Hinweise | Ziel-Datei |
|---|---|---|
| WHAT_WORKED | "funktioniert", "pattern", "approach" | `KNOWLEDGE/WHAT_WORKED.md` |
| WHAT_FAILED | "schlug fehl", "nie wieder", "vermeiden" | `KNOWLEDGE/WHAT_FAILED.md` |
| GOTCHA | Stolperstein, ESM-Fehler, OOM, Konfig-Quirks | `KNOWLEDGE/GOTCHAS.md` |
| METHODOLOGY | PRD/Loop/DoD/Workflow | `KNOWLEDGE/METHODOLOGY.md` |
| AGENT-SPECIFIC | "Opus gut bei X", "Sonnet halluzinierte" | `KNOWLEDGE/AGENT_LEARNINGS/<agent>.md` |
| TOOL-SPECIFIC | Ralph/Caveman/MCP-Verhalten | `KNOWLEDGE/TOOLS/<tool>.md` |

### Phase 4 — Dedup-Check + Anonymisierung

Pro Learning:

1. **Dedup:** `findstr /i "<schlagwort>" KNOWLEDGE\*.md`. Wenn ähnlicher Titel da → bestehenden Eintrag updaten: "Beobachtet in:"-Liste um neues Projekt ergänzen. Sonst → neue ID (höchste G/W/F/M-Nummer +1).

2. **Anonymisier-Check** vor JEDEM Upload — kein Push wenn auch nur einer dieser Punkte verbleibt:
   - Patient-/User-Namen → `{{USER}}`
   - Echte E-Mails → `{{EMAIL}}`
   - Anwalts-/Kanzlei-Namen → "spezialisierte Kanzlei"
   - Stripe/JWT/API-Keys → `{{KEY}}`
   - Anschriften, Telefonnummern → entfernen
   - MDR-Klassen-Hypothesen mit Produkt-Details → generisch ("Class-I-Maximalflip-Pattern" ok, "{Projekt}-Capture-Class-I" nicht)

3. **Eintragsformat (anhängen ans Ende der Ziel-Datei):**

```markdown
### {ID} — Kurztitel

**Erstmals beobachtet:** YYYY-MM-DD in {PROJEKT}
**Beobachtet in:** {PROJEKT}
**Kategorie:** {KATEGORIE} · Tags: `tag1`, `tag2`

**Was passiert:** 1-3 Sätze.
**Fix:** konkreter Workaround.
**Quellen:** `<repo-relative-path>` ({PROJEKT})
```

### Phase 5 — Daily-Log

Schreibe `daily-log/YYYY-MM-DD.md`:

```markdown
# Daily-Log YYYY-MM-DD

## Aggregation aus DiggAiHH-Projekten

**Repos gescannt:** N (z.B. Lou-Intit, diggai-anamnese, JoBetes, wanderwell)
**Neue Commits gefunden:** M
**Neue Learnings:** P (W: x, F: y, G: z, M: a)
**Dedup-Hits:** D

### Neue Bank-Einträge
- [G## — Titel](../KNOWLEDGE/GOTCHAS.md#g##--titel)
- ...

### Dedup-Hits
- G## — Beobachtet-in-Liste um {PROJEKT} ergänzt
- ...

### Pareto-3 Highlights
1. ...
2. ...
3. ...
```

Wenn nichts Neues: "Quiet day — alle Projekte in sync".

### Phase 6 — Commit + Push (Bank-Main)

```cmd
cd /d C:\Users\Moin\Documents\Claude\Projects\Zentrale-DiggAi-Bank
git config user.name "DiggAiHH"
git config user.email "DiggAi@tutanota.de"
echo .commitmsg.txt > .commitmsg.txt
echo feat(sync): YYYY-MM-DD learnings - N projects, M new, D dedup > .commitmsg.txt
git add .
git commit -F .commitmsg.txt
del .commitmsg.txt
git push origin main
```

Sicherstellen dass `.commitmsg.txt` und `.prbody.tmp` in `.gitignore` sind, sonst landen sie im Commit.

### Phase 7 — Cross-Pollinate zu Lou-Intit (optional)

Wenn ≥3 generische Learnings (gelten für JEDES Projekt, nicht domain-spezifisch):

```cmd
cd /d C:\Users\Moin\Documents\Claude\Projects
if not exist Lou-Intit (gh repo clone DiggAiHH/Lou-Intit)
cd /d Lou-Intit
git pull --rebase origin main
git checkout -b feat/YYYY-MM-DD-daily-sync
```

In `_bootstrap/04_MEMORY_LEARNINGS.md` einen Anhang-Block "## §X — Anhang aus Daily-Sync YYYY-MM-DD" mit den generischen Einträgen. Plus ggf. ein Eintrag in `_bootstrap/02_METHODIK_WORKFLOW.md` für Methodik-Patterns.

```cmd
git add . && git commit -F .commitmsg.txt && del .commitmsg.txt
git push -u origin feat/YYYY-MM-DD-daily-sync
gh pr create --base main --title "feat(memory): YYYY-MM-DD daily-sync learnings" --body-file .prbody.tmp
del .prbody.tmp
```

Bei <3 generischen Einträgen: kein Lou-Intit-PR, im Daily-Log notieren ("nichts generisch genug heute").

### Phase 8 — Gmail-Notify

Via `mcp__620ce4d8-...__create_draft`:
- An: `DiggAi@tutanota.de`
- Subject: `daily-sync YYYY-MM-DD — N Bank, P PR`
- Body: 5-7 Zeilen Summary mit Bank-Commit-SHA + ggf. Lou-Intit-PR-URL
- **Niemals Auto-Send.**

### Hard-Rules

- Anonymisierung vor JEDEM Upload (Phase 4 Schritt 2).
- Niemals projekt-spezifische Daten in zentrale Repos.
- Niemals Force-Push.
- Niemals Auto-Send Mails.
- `.commitmsg.txt`/`.prbody.tmp` nach Gebrauch löschen.
- Wenn `gh auth status` Fehler: Mail-Draft "daily-sync blocked: gh auth refresh nötig" + beenden.
- Wenn Bank-Pull merge-Konflikte hat: nicht überschreiben, Mail-Draft mit Conflict-Liste + beenden.

### Output-Verhalten

- 1-Satz-Status pro Phase.
- Am Ende: kompakte Summary mit Bank-Commit-SHA, ggf. PR-URL, Gmail-Draft-ID.

─── PROMPT ENDE ───

---

## Anti-Patterns die NICHT mehr verwendet werden sollen

- ~~`web_fetch` auf Bank-URLs~~ — Provenance-Check ist URL-strikt, blockt nach erstem Fetch (G15 in Bank).
- ~~`workspace__bash` als Primary~~ — HYPERVISOR_SERVICE_ERROR möglich, kein Recovery in Scheduled Task (G14 in Bank).
- ~~Chrome-MCP für Bank-Upload~~ — funktioniert aber überflüssig, `git push` via Desktop Commander ist schneller und atomar.

## Historische Notiz

Bis 2026-05-18 lief der Sync mit `web_fetch`-first. Am 2026-05-19 fiel beides aus, manueller Sync via Desktop Commander führte zur Bank-Commit `4b59613` + Lou-Intit-PR #2. Seitdem DC-first.
