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

## F80 — Anonyme ChatGPT/Codex-Sessions

> _Hinweis: früher als F05 geführt; am 2026-06-29 zur Auflösung einer ID-Kollision auf F80 umnummeriert (Inhalt unverändert)._

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


---

## F09 — Veraltete Runbook-Zeile blind befolgt → Prod-Outage

**Erstmals beobachtet:** 2026-06-07 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** FAILED · Tags: `deploy`, `runbook`, `outage`, `docker`

**Was scheitert:** Deploy-Kommando 1:1 aus veralteter DEPLOY.md (`--project-name diggai`) ausgeführt → falsches Docker-Netz → ~11 Min 502-Prod-Outage.
**Fix:** Deploy-Kommandos vor Ausführung gegen den laufenden Stack (Container-Labels/Netze) verifizieren. Runbook nach JEDEM Infra-Change aktualisieren; veraltete Zeile sofort korrigieren. Siehe G18.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-7-01.md` (diggai-anamnese)

---

## F10 — Push auf `master` triggert deploy.yml = ungewollter Backend-Deploy

**Erstmals beobachtet:** 2026-06-07 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** FAILED · Tags: `ci`, `github-actions`, `deploy`, `footgun`

**Was scheitert:** `git push origin master` löst den GitHub-Actions-Deploy aus; bei nicht deploy-reifem Backend = Footgun (Outage-Risiko). Mehrfach bewusst NICHT gepusht, um das zu vermeiden.
**Fix:** Workflow GitHub-seitig disablen, solange BE nicht deploy-reif; FE-/BE-Deploys entkoppeln; bewusst getrennt pushen. Lokale Commits halten bis BE-GO.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-8-03.md` (diggai-anamnese)

---

## F11 — Playwright in Sandbox/CI für form-heavy Medizin-SPA

**Erstmals beobachtet:** 2026-05-27 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (durchgängig)
**Kategorie:** FAILED · Tags: `playwright`, `e2e`, `sandbox`, `flaky`, `medical-spa`

**Was scheitert:** Playwright häuft Heap-OOM an (akkumulierte Screenshots), `locator.isVisible()` wartet nicht, signature_pad-Canvas nicht füllbar, Custom-Comboboxen/Listboxen öffnen nicht auf synthetischen Klick → unzuverlässig rote Tests, die KEINE App-Bugs sind.
**Fix:** API-Pfad-Tests (W13) + a11y-Tree für UI; wo Browser nötig: `waitFor({state:'visible'})`-Helper, `addInitScript` für Locale, Canvas/Signatur via API. Siehe W13.
**Quellen:** `diggai-anamnese/memory/runs/2026-05-27_claude-code_opus-4-7-08.md`, `…2026-06-07_claude-code_opus-4-8-02.md` (diggai-anamnese)

---

## F12 — `test:run` (combined jsdom) lässt Server-Tests unter jsdom laufen → Phantom-Fails

**Erstmals beobachtet:** 2026-06-06 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (mehrfach)
**Beobachtet-Update:** 2026-06-16 — zusätzlich Voll-Lauf-OOM (JS-Heap 2GB, "Worker exited unexpectedly", 182 Files/18 Min) als False-Positive-Quelle; Mitigation `NODE_OPTIONS=--max-old-space-size` + `--no-file-parallelism` in vitest.config + gezielte `verify-*.cmd` statt Voll-Lauf
**Kategorie:** FAILED · Tags: `vitest`, `jsdom`, `test-env`, `flaky`

**Was scheitert:** Kombinierter jsdom-Lauf führt Server-Tests im jsdom-Env aus → ~161 "Fails", die keine echten Fehler sind. Auch Parallel-Last (`test:unit` + `test:server` gleichzeitig) erzeugt Timeout-Flakes.
**Fix:** `test:unit` und `test:server` SEPARAT als autoritativ behandeln; verdächtige Fails in Isolation re-verifizieren (meist grün — Maschinen-Footgun).
**Quellen:** `diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-09.md` (diggai-anamnese)


---

## F13 — `npm audit fix --force` (mehrfach) → SemVer-Major-Bumps außerhalb der package.json-Range

**Erstmals beobachtet:** 2026-06-16 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** FAILED · Tags: `npm`, `audit-fix`, `semver`, `dependencies`, `breaking-change`

**Was scheitert:** Mehrfaches `npm audit fix --force` hat SemVer-Major-Bumps eingespielt (socket.io 4.2↔4.8, node-cron 3→4, concurrently 9→10), teils AUSSERHALB der in package.json deklarierten Range → Realtime-/Cron-Bruchrisiko, schwer reviewbarer Lock-Drift.
**Fix:** `--force` meiden; Audit-Fixes einzeln + im Range prüfen. Schaden zurücksetzen via `git checkout -- package.json package-lock.json` + sauberes `npm install` (danach gezielt fehlende devDeps nachziehen).
**Quellen:** `memory/runs/2026-06-16_cowork_opus-4-8-08.md` (diggai-anamnese)

---

## F14 — Preflight (Run-Log + Once-Guard) im Multi-Agent-Tree übersprungen → fremde untracked Arbeit überschrieben

**Erstmals beobachtet:** 2026-06-16 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** FAILED · Tags: `multi-agent`, `no-redundancy`, `untracked`, `overwrite`, `preflight`

**Was scheitert:** Eine Parallel-Session hat ohne Preflight (memory/runs lesen + once-guard) losgecodet und Dateien einer anderen Session via Write ÜBERSCHRIEBEN. Da diese nie committet (untracked) waren, waren die Vorversionen unwiederbringlich verloren; zusätzlich entstanden Duplikate (zwei Padding-Libs, zwei SRI-Mechanismen), die nachträglich reconciled werden mussten.
**Fix:** Vor jedem Schreiben im geteilten Tree zwingend Preflight: letzte Run-Logs lesen + once-guard-precheck. Bei heißem Tree nur NEUE Dateien unter eindeutigen Pfaden anlegen, bestehende minimal-invasiv erweitern, heiße Dateien gar nicht anfassen. Untracked = nicht wiederherstellbar → niemals blind überschreiben. Siehe W14, M05.
**Quellen:** `memory/runs/2026-06-15_cowork_opus-4-8-05.md`, `2026-06-15_cowork_opus-4-8-07.md` (diggai-anamnese)

---

## F15 — Zwei Komponenten committen denselben Wert getrennt -> Race; in EINEN atomaren Commit zusammenfassen

**Erstmals beobachtet:** 2026-06-29 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** FAILED · Tags: `race-condition`, `ui-state`, `atomicity`, `consent`, `signature-pad`, `imperative-ref`

**Was passiert:** Unterschrift (SignaturePad-Canvas) und Einwilligung wurden ueber getrennte Buttons/Schritte erfasst -> Race zwischen 'Canvas committen' und 'Consent setzen', Daten teils nicht persistiert.
**Fix:** Zusammengehoerende Schreibvorgaenge in EINER Aktion buendeln: ein Button committet erst den Canvas (ref.commit) und setzt dann den Consent -> kein Race. Generisch: voneinander abhaengige State-Writes nicht auf mehrere User-Aktionen/Effekte verteilen.
**Quellen:** `commit f4458f9 (consent B3 SignaturePad ref.commit)` (diggai-anamnese)
