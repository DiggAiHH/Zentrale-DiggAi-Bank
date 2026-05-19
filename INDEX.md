# Zentrale DiggAi Bank — Master Index

Zentrale Wissensbank, die täglich Learnings aus allen DiggAiHH-Projekten aggregiert. Daily-Sync-Schedule läuft abends 20:00 (Europe/Berlin) und scannt alle Source-Repos auf neue Commits, run-logs und Patterns.

**Owner:** Laith Alshdaifat · `DiggAi@tutanota.de` · Stand 2026-05-19

---

## §1 Struktur

```
Zentrale-DiggAi-Bank/
├── README.md                          # Repo-Front
├── INDEX.md                           # Diese Datei
├── DAILY_SYNC_PROMPT.md               # Der Prompt, den der Scheduled-Task ausführt
├── DAILY_SYNC_SCHEDULE.md             # Schedule-Konfig + How-To-Modify
├── LICENSE                            # MIT
├── .gitignore
├── SOURCES/
│   ├── README.md
│   └── sources.json                   # Watched repos (DiggAiHH/*)
├── KNOWLEDGE/
│   ├── README.md
│   ├── WHAT_WORKED.md                 # Patterns die funktioniert haben
│   ├── WHAT_FAILED.md                 # Anti-Patterns
│   ├── GOTCHAS.md                     # Cross-Project Gotchas
│   ├── METHODOLOGY.md                 # Workflow-Patterns
│   ├── AGENT_LEARNINGS/               # Pro Agent: was-er-gut-kann / Stolpersteine
│   │   ├── claude-opus.md
│   │   ├── claude-sonnet.md
│   │   ├── copilot.md
│   │   ├── codex.md
│   │   ├── gemini.md
│   │   ├── kimi.md
│   │   └── cursor.md
│   └── TOOLS/
│       ├── ralph-patterns.md
│       ├── caveman-patterns.md
│       └── mcp-recipes.md
└── daily-log/
    ├── README.md
    └── YYYY-MM-DD.md                  # Pro Tag: was wurde aggregiert
```

---

## §2 Reading-Order für neuen Agent

1. **README.md** — 30s Mission
2. **INDEX.md** — diese Datei
3. **DAILY_SYNC_PROMPT.md** — was der Schedule-Agent macht
4. **SOURCES/sources.json** — welche Repos überwacht werden
5. **KNOWLEDGE/** — der aktuelle Wissensstand

---

## §3 Wie der Daily-Sync funktioniert

```
20:00 Berlin (täglich)
       |
       v
+----------------------------------------+
| Schedule triggert frische Claude-Session |
| mit Prompt aus DAILY_SYNC_PROMPT.md     |
+----------------------------------------+
       |
       v
+----------------------------------------+
| Agent liest SOURCES/sources.json        |
| → Liste aller zu überwachenden Repos    |
+----------------------------------------+
       |
       v
+----------------------------------------+
| Pro Repo: fetche neue Commits + Files   |
| seit letztem Sync (24h)                 |
| (raw.githubusercontent.com URLs)        |
+----------------------------------------+
       |
       v
+----------------------------------------+
| Extract Learnings:                      |
|  - memory/runs/*.md → Aktionen+Fixes    |
|  - commit messages → Pattern-Hinweise   |
|  - VERSTAENDNIS_LUECKEN.md → offene Q   |
|  - progress.txt → Inkremental-Learnings |
+----------------------------------------+
       |
       v
+----------------------------------------+
| Klassifizieren:                         |
|  WORKED / FAILED / GOTCHA / METHODOLOGY |
|  / AGENT-SPECIFIC / TOOL-SPECIFIC       |
+----------------------------------------+
       |
       v
+----------------------------------------+
| Update KNOWLEDGE/*.md (append, dedup)  |
| + daily-log/YYYY-MM-DD.md schreiben    |
+----------------------------------------+
       |
       v
+----------------------------------------+
| Commit + Push zu Zentrale-DiggAi-Bank   |
| Message: "feat(sync): <date> learnings  |
| from <N> projects, <M> new patterns"    |
+----------------------------------------+
```

---

## §4 Manueller Trigger

Du kannst den Sync auch manuell starten — siehe `DAILY_SYNC_SCHEDULE.md` § 3 "Manueller Trigger".

---

## §5 Was rein soll / was nicht

**Rein:**
- Generische Patterns die für künftige Projekte relevant sind
- Cross-Stack-Gotchas (Windows-cmd, OOM, i18next, etc.)
- Agent-Verhalten + Bias
- Tool-Recipes (Ralph, Caveman, MCP-Connectors)
- Methodology-Improvements (PRD-Pattern, Run-Log-Format)

**NICHT rein:**
- Projekt-spezifische Daten (Patient-Namen, Stripe-Keys, Anschriften)
- Echte Secrets, Tokens
- Personen-/Kanzlei-Namen (anonymisieren)
- One-off Bug-Fixes ohne Lerneffekt
- Doppelte Einträge (Dedup!)

---

## §6 Anti-Drift-Regel

Wenn der Daily-Sync zweimal denselben Eintrag generiert (z.B. gleicher Gotcha aus 2 Projekten), trag ihn nur EINMAL in `KNOWLEDGE/GOTCHAS.md` ein, aber mit "Beobachtet in:" Liste der Quellen. Dedup-Logik im Prompt.

---

**Stand:** 2026-05-19 · **Schedule:** `0 20 * * *` (Europe/Berlin)
