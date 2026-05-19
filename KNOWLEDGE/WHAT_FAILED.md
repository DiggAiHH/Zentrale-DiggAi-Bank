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

---

## F05 — Anonyme ChatGPT/Codex-Sessions

**Erstmals beobachtet:** 2026-05-13 in JoBetes (Multi-Agent-Sprint)
**Beobachtet in:** JoBetes
**Kategorie:** FAILED · Tags: `multi-agent`, `chatgpt`, `codex`, `auth`

**Was scheitert:** ChatGPT/Codex anonym von Chrome-MCP aus → ChatGPT Plus erfordert Login. Agent darf fremden Login nicht durchführen (Privacy-Regel).
**Fix:** Operator muss vorher in den Tab einloggen, dann übernimmt Agent. Alternative: Codex API direkt mit Operator-API-Key, kein UI-Round-trip.

---

## F06 — Copilot M365 CAPTCHA-Bypass

**Erstmals beobachtet:** 2026-05-13 in JoBetes
**Beobachtet in:** JoBetes
**Kategorie:** FAILED · Tags: `multi-agent`, `copilot`, `captcha`, `bot-detection`

**Was scheitert:** Microsoft Copilot zeigt CAPTCHA bei Bot-Verdacht. Agent darf Bot-Verifikation nicht umgehen. Tab hängt mit fertig-eingegebenem Prompt im Submit-Stadium.
**Fix:** Operator klickt CAPTCHA, ab dann läuft Prompt. Alternative: Copilot M365 nicht für Agent-Workflows nutzen, API-Key-Provider bevorzugen.

---

## F07 — IDE-Extensions (z.B. Kimi K2 in VS Code) sind nicht ferngesteuert

**Erstmals beobachtet:** 2026-05-13 in JoBetes
**Beobachtet in:** JoBetes
**Kategorie:** FAILED · Tags: `multi-agent`, `vscode`, `ide-extension`, `tier-restrictions`

**Was scheitert:** Cowork-Computer-Use hat IDEs auf "click"-Tier — kein Typing, kein Trigger der Sidebar-Extension. Agent kann den Prompt nicht reinkopieren.
**Fix:** Operator copy-pastet selbst. Alternative: IDE-Extension durch CLI ersetzen (z.B. statt VS-Code-Extension den CLI-Modus des Agents nutzen).

---

## F08 — Web-Coverage <50% vor Pilot-Start

**Erstmals beobachtet:** 2026-05-11 in JoBetes
**Beobachtet in:** JoBetes
**Kategorie:** FAILED · Tags: `tests`, `coverage`, `risk`

**Was scheitert:** Web-App-Modul mit 49% Coverage. Patient-Bugs (z.B. BZ-Eingabe wird nicht persistiert) nicht testabgedeckt. Bug live = keine Reproduktions-Tests.
**Fix:** Pre-Pilot-Gate: Web-Coverage ≥75% zwingend. Kein Live-Schalten unter Threshold. Disziplin-Pattern: jeder neue UI-Code-PR muss mindestens 1 Test erweitern.
