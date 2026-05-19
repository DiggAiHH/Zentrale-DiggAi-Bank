# WHAT FAILED — Anti-Patterns

Aggregiert aus DiggAiHH-Projekten. Daily-Sync ergänzt automatisch.

---

## F01 — Multiple Entry-Points (3 separate .bat-Skripte)

**Erstmals beobachtet:** 2026-04 in DiggAi-anamnese
**Beobachtet in:** DiggAi-anamnese
**Kategorie:** FAILED · Tags: `devx`, `scripts`

**Was scheitert:** 3 Bats für `dev:client`/`dev:server`/`dev:agent` = 3 Terminals = 3 Stellen für Fehler.
**Fix:** `npm run dev:all` mit `concurrently`, alles in einem Fenster mit Color-Prefixing.

---

## F02 — Mega-Stories ("Build the dashboard")

**Erstmals beobachtet:** 2026-04 in DiggAi-anamnese
**Beobachtet in:** mehrere
**Kategorie:** FAILED · Tags: `prd`, `ralph`

**Was scheitert:** Stories die nicht in ein Context-Window passen → Context-Overflow in Ralph-Iteration → schlechter Code.
**Fix:** Stories so dimensionieren dass sie ≤30 Min Coding sind. Splitten wenn größer.

---

## F03 — Direkter master/main-Push

**Erstmals beobachtet:** 2026-03 in DiggAi-anamnese
**Beobachtet in:** alle
**Kategorie:** FAILED · Tags: `git`, `workflow`

**Was scheitert:** Push direkt auf main ohne PR → keine Quality-Check-Gate → Bug in Prod.
**Fix:** Feature-Branch + Self-PR + CI-Checks. Direkt-Push nur für `docs/*` und `chore: bump version`.

---

## F04 — Force-Push auf shared Branches

**Erstmals beobachtet:** 2026-04 in DiggAi-anamnese
**Beobachtet in:** DiggAi-anamnese
**Kategorie:** FAILED · Tags: `git`, `destructive`

**Was scheitert:** `git push --force` auf main wenn parallel andere Session läuft = Datenverlust.
**Fix:** Nur `--force-with-lease` auf eigene Feature-Branches mit explizitem Owner-Go.

---

## F05 — Backlog mit 200+ offenen Items

**Erstmals beobachtet:** 2026-04 in DiggAi-anamnese
**Beobachtet in:** DiggAi-anamnese
**Kategorie:** FAILED · Tags: `tracker`, `focus`

**Was scheitert:** Tracker-Disziplin tot wenn Open-Items >50. Niemand schaut rein.
**Fix:** Pareto-3-View oben, Detail-Items darunter, "Done"-Items quartalsweise nach `docs/done.md` archivieren.

---

_(Auto-extended by daily-sync.)_
