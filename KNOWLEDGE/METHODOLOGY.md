# METHODOLOGY — Workflow-Patterns

Bewährte Workflow-Komponenten. Daily-Sync extrahiert + dedupliziert.

---

## M01 — PRD → prd.json → Ralph-Loop

**Quelle:** Lou-Intit · Ralph-Pattern
**Tags:** `prd`, `ralph`, `loop`

PRD in Markdown (`tasks/prd-<slug>.md`) mit User-Stories + Acceptance-Criteria. Konvertierung nach `prd.json` via `/ralph`-Skill. Ralph-Loop zieht höchste Priorität mit `passes:false`, implementiert, testet, committet, updatet `passes:true`. Jede Iteration fresh Context.

---

## M02 — Run-Log-Format (5 Bullets)

**Quelle:** DiggAi-anamnese frühe Phase
**Tags:** `run-log`, `memory`

```
YYYY-MM-DDTHH:MM+02:00 | Lauf <agent>-<NN> | <topic>
---
- Aktion: ...
- Blocker: ...
- Fix: ...
- Ergebnis: <commit hash / file path>
- Out: <verified state>
```

DoD-Regel: kein observable outcome ohne Run-Log.

---

## M03 — Pareto-3 für Status-Reviews

**Quelle:** Master-Cockpit-Pattern
**Tags:** `pareto`, `status`

3 wichtigste offene Items für Owner. Kein 7-Punkte-Plan. Rest wartet im Tracker.

---

## M04 — Definition of Done (11 Punkte)

**Quelle:** DiggAi-anamnese
**Tags:** `dod`, `quality`

1. Code geschrieben · 2. Typecheck grün · 3. Tests grün · 4. Lint grün · 5. Build grün · 6. Smoke-Test · 7. Commit · 8. Push richtiger Remote · 9. prd.json updated · 10. Run-Log · 11. Master-Cockpit.

---

## M05 — Audit vor Risiko-Aktionen

**Quelle:** DiggAi-anamnese (mehrere Lehrgeld-Vorfälle)
**Tags:** `audit`, `safety`

Vor: Force-Push / DB-Migration / DNS-Cutover / Mail-mit-Anhang / Vertrags-Bindung / Lösch-≥10-Files: STOP + Owner-Bestätigung mit Format "Was passiert / Reversible? / Risk-Score / Pre-Conditions checked". Owner sagt "go" → ausführen.

---

## M06 — VERSTAENDNIS_LUECKEN.md mit Q<N>

**Quelle:** DiggAi-anamnese
**Tags:** `questions`, `unblocking`

Wenn Agent Frage hat die er selbst nicht beantworten kann: `Q<N>:` mit Optionen + Empfehlung. Status OPEN → RESOLVED. Resolved-Einträge bleiben (Architektur-Historie).

---

## M07 — Status-Plan-Flip-Pattern

**Quelle:** DiggAi-anamnese (Class-I-Strategie-Wechsel)
**Tags:** `strategy`, `flip`

Bei Strategie-/Regulatorik-Wechsel: `docs/STATUS_PLAN_FLIP_<DATUM>.md` mit Vorher / Nachher / Trigger / 3 Hebel / Pareto-3 / Risiken / Quantifizierte Vorteile. Behält Architektur-Historie.

---

_(Auto-extended by daily-sync.)_
