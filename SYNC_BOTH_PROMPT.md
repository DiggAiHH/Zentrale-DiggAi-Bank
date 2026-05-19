# SYNC BOTH — Lou-Intit + Zentrale-DiggAi-Bank in einem Aufwasch

Eine Aktion synchronisiert dein aktuelles Projekt mit **beiden** zentralen Repos:
1. **Pull** neueste Bootstrap-Kit-Updates aus `Lou-Intit` → lokales `_bootstrap/`
2. **Push** hartverdiente Learnings aus diesem Projekt → `Zentrale-DiggAi-Bank`
3. **Cross-Pollinate** — wenn ein Learning generisch genug ist, PR-Vorschlag für Lou-Intit-Kit anhängen

---

## Wann benutzen

- **End-of-Day-Sync** (vor 20:00 Daily-Sync, oder als Replacement wenn PC dann aus)
- **Nach großem Meilenstein** (Phase-Wechsel, Status-Plan-Flip, Big-Refactor abgeschlossen)
- **Recovery nach Stillstand** (Tab crashed, App war zu, Lou-Intit hat in der Zwischenzeit Updates)
- **Pre-Release-Sync** (vor Demo, vor Investor-Call, vor IHK-Termin)

---

## Der Prompt (zum Kopieren)

Frischer Cowork-Tab mit **Opus 4.7** im jeweiligen Projekt-Workspace, kompletten Block pasten:

─── PROMPT START ───

Du bist Claude Opus 4.7. Owner: Laith Alshdaifat (DiggAi@tutanota.de). Heute ist <YYYY-MM-DD>.

**Mission:** Synchronisiere dieses Projekt mit beiden zentralen Repos in einem Pass:
- **Lou-Intit** (https://github.com/DiggAiHH/Lou-Intit) — Bootstrap-Kit-Updates ziehen
- **Zentrale-DiggAi-Bank** (https://github.com/DiggAiHH/Zentrale-DiggAi-Bank) — Learnings pushen
- **Cross-Pollinate** — generische Findings beider Richtungen weitergeben

Arbeite autonom, ohne zwischendrin nachzufragen. 1-Satz-Status zwischen Phasen.

---

### Phase A — Identify + Fetch State

1. Lies `CLAUDE.md` + `README.md` im Working Directory → notiere `<PROJEKT_NAME>` (z.B. `diggai-anamnese`).
2. Notiere heutiges Datum als `<YYYY-MM-DD>`.
3. Parallel WebFetch (zum späteren Vergleich + Dedup):
   - `https://raw.githubusercontent.com/DiggAiHH/Lou-Intit/main/_bootstrap/04_MEMORY_LEARNINGS.md`
   - `https://raw.githubusercontent.com/DiggAiHH/Lou-Intit/main/_bootstrap/02_METHODIK_WORKFLOW.md`
   - `https://raw.githubusercontent.com/DiggAiHH/Lou-Intit/main/INDEX.md`
   - `https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/KNOWLEDGE/WHAT_WORKED.md`
   - `https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/KNOWLEDGE/WHAT_FAILED.md`
   - `https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/KNOWLEDGE/GOTCHAS.md`
   - `https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/KNOWLEDGE/METHODOLOGY.md`
   - `https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/SOURCES/sources.json`

---

### Phase B — Pull aus Lou-Intit

4. Prüfe ob lokal ein `_bootstrap/` existiert (Glob `_bootstrap/**/*.md`).
5. Wenn ja → vergleiche lokales `_bootstrap/04_MEMORY_LEARNINGS.md` mit gefetchtem Upstream:
   - Falls Upstream neue Gotchas/Patterns hat (mehr Einträge, neue G15+, W11+, F12+) → lokale Datei überschreiben
   - Falls Submodule (`git submodule status` via bash MCP zeigt es) → `git submodule update --remote` ausführen
   - Falls plain folder → file-by-file overwrite mit den 8 _bootstrap-Files
6. Wenn nein → `_bootstrap/` neu anlegen mit allen 8 Files vom Upstream (Variante A aus Lou-Intit/CROSS_PROJECT_PROMPT.md)
7. CLAUDE.md im Projekt-Root aktualisieren: Memory/Learnings-Block aus `_bootstrap/04_MEMORY_LEARNINGS.md` § 6 neu einkopieren (falls dort Updates).

**Status-Satz an Owner:** "Phase B fertig — `_bootstrap/` aktualisiert (X Files geändert)" oder "Phase B fertig — _bootstrap/ already up-to-date".

---

### Phase C — Push zur Bank

8. Scan lokale Memory-Quellen:
   - Alle `memory/runs/*.md` (sort by filename desc, letzte 14 Tage genügen)
   - `progress.txt`
   - `VERSTAENDNIS_LUECKEN.md` (RESOLVED-Einträge)
   - `AGENTS.md` (Discovered Patterns + Gotchas)
   - `git log --oneline -20` (Commit-Messages als Pattern-Hinweise)
9. Extract Learnings = jede Stelle die "funktioniert hat" / "schlug fehl" / "Stolperstein" / "Workflow-Verbesserung" beschreibt.
10. Klassifiziere jedes Learning:

    | Kategorie | Hinweise | Ziel |
    |---|---|---|
    | WORKED | erfolgreiche Patterns | Bank/KNOWLEDGE/WHAT_WORKED.md |
    | FAILED | Anti-Patterns | Bank/KNOWLEDGE/WHAT_FAILED.md |
    | GOTCHA | Stolpersteine | Bank/KNOWLEDGE/GOTCHAS.md |
    | METHODOLOGY | Workflow-Patterns | Bank/KNOWLEDGE/METHODOLOGY.md |
    | AGENT-SPECIFIC | Agent-Bias / Stärken | Bank/KNOWLEDGE/AGENT_LEARNINGS/<agent>.md |
    | TOOL-SPECIFIC | Ralph/Caveman/MCP-Verhalten | Bank/KNOWLEDGE/TOOLS/<tool>.md |

11. **Dedup-Check** gegen Bank-State aus Phase A:
    - Wenn Titel/Tags ähnlich zu bestehendem Eintrag → existierenden Eintrag mit `**Beobachtet in:** ..., <PROJEKT_NAME>` ergänzen
    - Wenn neu → nächste freie ID (G+1, W+1, F+1, M+1)
12. **Anonymisier-Check** vor Upload:
    - Patient-/User-Namen → entfernen oder `{{USER}}`
    - Anwalts-/Kanzlei-Namen → `spezialisierte Kanzlei`
    - Stripe/JWT/API-Keys → `{{KEY}}`
    - Anschriften/Telefonnummern → entfernen
    - MDR-Klassen-Hypothesen mit Produkt-Details → generisch halten ("Class-I-Maximalflip-Pattern" ok, aber kein "DiggAi-Capture-Class-I")
13. Eintrags-Format:

    ```
    ### G42 — Kurztitel
    **Erstmals beobachtet:** <YYYY-MM-DD> in <PROJEKT_NAME> (<run-log-ref>)
    **Beobachtet in:** <PROJEKT_NAME>
    **Kategorie:** <KATEGORIE> · Tags: `tag1`, `tag2`
    **Was passiert:** <1-3 Sätze>
    **Fix:** <konkreter Workaround>
    **Quellen:** `<repo-relative-path>`
    ```

14. Upload zur Bank via Chrome-MCP — pro Ordner ein Commit. URL-Pattern:
    - Root: `https://github.com/DiggAiHH/Zentrale-DiggAi-Bank/upload/main`
    - KNOWLEDGE/: `.../upload/main/KNOWLEDGE`
    - daily-log/: `.../upload/main/daily-log`
    - AGENT_LEARNINGS/: `.../upload/main/KNOWLEDGE/AGENT_LEARNINGS`

15. File-Upload-Trick (Chrome-Extension blockt file_upload, aber file-attachment.attach() funktioniert):

    ```js
    const fae = document.querySelector('file-attachment');
    const dt = new DataTransfer();
    dt.items.add(new File([content], 'GOTCHAS.md', {type:'text/markdown'}));
    fae.attach(dt);
    ```

16. Commit-Message: `feat(sync): manual sync from <PROJEKT_NAME> <YYYY-MM-DD> — <N> new, <D> dedup`

**Status-Satz an Owner:** "Phase C fertig — `<N>` neue Patterns committed, `<D>` Dedup-Hits".

---

### Phase D — Cross-Pollinate (Bank → Lou-Intit)

17. Pro neuem Bank-Eintrag prüfen: ist der **generisch genug** für die Lou-Intit-Bootstrap-Kit-Memory?
    - **Ja-Indikator:** Pattern gilt für JEDES künftige Projekt (z.B. neuer Build-Gotcha, neuer i18n-Quirk)
    - **Nein-Indikator:** Domain-spezifisch (Regulatorik, einzelner Stack-Bug, Praxis-Workflow)
18. Für jedes generische Learning → erstelle einen lokalen PR-Vorschlag im aktuellen Projekt unter:
    `docs/lou-intit-pr-suggestions-<YYYY-MM-DD>.md`
    mit Format:

    ```
    # PR-Vorschläge für Lou-Intit (Stand <YYYY-MM-DD>)

    ## Vorschlag 1: G15 — <Titel> in _bootstrap/04_MEMORY_LEARNINGS.md ergänzen

    **Begründung:** <warum generisch>
    **Position:** § 1 nach G14 einfügen
    **Inhalt:**
    <der Eintrag wie er in der Bank steht>

    **PR-Branch-Name:** `feat/memory-g15-<slug>`
    **PR-Title:** `feat(memory): G15 — <Titel> from <PROJEKT_NAME> learnings`
    ```

19. **Niemals automatisch in Lou-Intit pushen** — der Owner reviewt die PR-Vorschläge und entscheidet.

**Status-Satz an Owner:** "Phase D fertig — `<M>` PR-Vorschläge für Lou-Intit unter `docs/lou-intit-pr-suggestions-<YYYY-MM-DD>.md`".

---

### Phase E — Daily-Log + Gmail-Notify + Run-Log

20. **Daily-Log:** Erstelle/aktualisiere `daily-log/<YYYY-MM-DD>.md` in der Bank:

    ```
    # Daily-Log <YYYY-MM-DD>

    ## Sync von <PROJEKT_NAME> (manuell via SYNC_BOTH)

    **Bank-Pull (Phase B):** <X Files aus _bootstrap/ aktualisiert> | <"_bootstrap/ already up-to-date">
    **Bank-Push (Phase C):**
      - Neue Einträge: <N> (W: x, F: y, G: z, M: a, Agent: b, Tool: c)
      - Dedup-Hits: <D>
      - Quiet/Rejected: <Q> (projekt-spezifisch / regulatorisch)
    **Cross-Pollinate (Phase D):** <M> PR-Vorschläge für Lou-Intit (siehe Projekt: docs/lou-intit-pr-suggestions-<YYYY-MM-DD>.md)

    ### Neue Bank-Einträge (mit Link)
    - [G15 — Kurztitel](../KNOWLEDGE/GOTCHAS.md#g15--kurztitel)
    - ...

    ### Dedup-Hits
    - G05 — Prisma+Node24+tsx (Beobachtet-in-Liste um <PROJEKT_NAME> ergänzt)
    - ...
    ```

    Wenn die Datei schon existiert (Daily-Sync war heute schon dran): anhängen unter `## Sync von <PROJEKT_NAME> (manuell via SYNC_BOTH)`.

21. **Gmail-Draft** via gmail-MCP `create_draft`:
    - An: `DiggAi@tutanota.de`
    - Subject: `SYNC_BOTH <YYYY-MM-DD> von <PROJEKT_NAME> — <N> Bank, <M> PR-Vorschläge`
    - Body: 5-7 Zeilen Summary aus Phase B + C + D + Link zu Bank/daily-log/<YYYY-MM-DD>.md
    - **Niemals Auto-Send.**

22. **Projekt-Run-Log:** `memory/runs/<YYYY-MM-DD>_opus_4-7-<NN>.md` mit 5 Bullets:
    - Aktion: SYNC_BOTH ausgeführt (Lou-Intit pull + Bank push + Cross-Pollinate)
    - Blocker: — oder spezifisch
    - Fix: —
    - Ergebnis: <N> Bank-Einträge committed, <X> _bootstrap-Files updated, <M> PR-Vorschläge geschrieben
    - Out: All synced, Gmail-Draft ready, PR-Vorschläge warten auf Owner-Review

---

## Methodik die durchgängig gilt

- **Sprache:** DE Konversation, EN Tech (npm, build, commit, push)
- **Output-Form:** 1-3 Sätze Status pro Phase, keine Mega-Updates
- **DoD:** Run-Log am Ende ist Pflicht
- **Sicherheit:** Anonymisierung vor JEDEM Upload zur Bank, niemals Auto-Send Mails
- **Pareto:** Wenn mehr als 5 neue Bank-Einträge generiert werden → die Top-3 in der Gmail-Draft hervorheben
- **Dedup zuerst:** Bevor du irgendwas hochlädst, vergleiche mit dem gefetchten Bank-State aus Phase A
- **Kein Force-Push** auf irgendein Repo
- **Browser-Tier-Regel:** Cowork-Chrome ist read-only via computer-use, aber claude-in-chrome MCP kann klicken+tippen
- **Niemals:**
  - Projekt-spezifische Daten in zentrale Repos (Patient-/Anwalts-/Stripe-Daten, MDR-Hypothesen mit Produkt-Detail)
  - Auto-Send von Mails
  - Direkt-Push auf Lou-Intit main (immer als PR-Vorschlag)
  - Duplikate ohne Dedup

---

## Was passiert wenn nichts zu tun ist

- **Lou-Intit unverändert + keine neuen Learnings im Projekt:**
  - Daily-Log: "Quiet day — <PROJEKT_NAME> in sync, bank in sync"
  - Gmail-Draft: optional ("Quiet sync, no changes")
  - Run-Log: trotzdem schreiben (DoD)

---

## Praxis-Workflow (5 Minuten)

1. Cowork-Tab mit Opus 4.7 im Projekt-Workspace
2. Diesen Prompt pasten
3. Opus läuft die 5 Phasen durch → fertig in ~3-5 min
4. Gmail öffnen → Draft reviewen → "Senden" falls OK
5. PR-Vorschläge in `docs/lou-intit-pr-suggestions-<YYYY-MM-DD>.md` lesen → manuell PR an Lou-Intit pushen wenn relevant

─── PROMPT ENDE ───

---

## Was dieser Prompt NICHT macht

- **Schedule erstellen** — dafür `SETUP_SCHEDULE.md`
- **Neues Projekt bootstrappen** — dafür `CROSS_PROJECT_PROMPT.md` in Lou-Intit
- **Lou-Intit selbst editieren** — der Prompt erstellt nur PR-Vorschläge in deinem Projekt unter `docs/lou-intit-pr-suggestions-*.md`. Du reviewst und pushst manuell.
- **Daily-Sync ersetzen** — der Schedule läuft weiter parallel (sicherheitsnetz)

---

## Beziehung zu anderen Prompts

| Prompt | Aktion | Wann |
|---|---|---|
| Lou-Intit `CROSS_PROJECT_PROMPT.md` Variante A | Neues Projekt bootstrappen | Erste Aktion in neuem Projekt |
| Bank `UPLOAD_FROM_PROJECT_PROMPT.md` | Nur Push zur Bank (kein Lou-Intit-Pull) | Schneller End-of-Workday-Push |
| Bank `SYNC_BOTH_PROMPT.md` (dieser) | Vollständiger Sync beider Repos + Cross-Pollinate | End-of-Day, Meilenstein, Recovery |
| Bank `SETUP_SCHEDULE.md` | Daily-Sync-Schedule einmal anlegen | One-time Setup |
| Bank `DAILY_SYNC_PROMPT.md` | Was der Schedule täglich automatisch macht | Auto (nicht manuell) |

---

**Owner:** Laith Alshdaifat · `DiggAi@tutanota.de` · Stand 2026-05-19
