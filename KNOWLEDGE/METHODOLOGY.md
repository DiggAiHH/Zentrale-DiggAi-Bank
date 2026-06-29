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

---

## M80 — Fork-Workflow als Notfall-Push (ohne Collaborator-Access)

> _Hinweis: früher als M05 geführt; am 2026-06-29 zur Auflösung einer ID-Kollision auf M80 umnummeriert (Inhalt unverändert)._

**Quelle:** JoBetes (Sync 2026-05-19)
**Tags:** `git`, `fork`, `collaboration`, `push`

Operator hat keinen direkten Push-Access. Fork erstellen, Branches auf Fork pushen, dann PRs öffnen.

```bash
git remote add fork <fork-url>
for b in feat/a feat/b feat/c; do git push fork $b; done
gh pr create --repo upstream/repo --head fork:<branch>
```

Vorteil: keine Wartezeit, kein Verlust von Commits. Nachteil: PRs gehen aus Fork-Branch, Reviewer-UI etwas anders.

---

## M81 — Multi-Agent-Sprint mit klaren Tool-Slots

> _Hinweis: früher als M06 geführt; am 2026-06-29 zur Auflösung einer ID-Kollision auf M81 umnummeriert (Inhalt unverändert)._

**Quelle:** JoBetes (Sync 2026-05-19)
**Tags:** `multi-agent`, `parallel-work`, `tool-slots`

Mehrere Agents parallel (z.B. Opus für Patient-Materialien, Codex für Backend-Push, Copilot für Code-Review, Kimi für UI-Polish). Cowork-Claude koordiniert + extrahiert Outputs nach Abschluss.

Jeder Agent kriegt klar definierten Tool-Slot (Chrome-Tab, IDE-Extension, CLI). Status-Tabelle: ✅ FERTIG, ❌ BLOCKED (Reason), ⚠ KANN NICHT REMOTE. Cowork-Claude sammelt Outputs am Ende ein.

---

## M82 — Domain-Pivot mit Pflicht-Compliance-Recheck

> _Hinweis: früher als M07 geführt; am 2026-06-29 zur Auflösung einer ID-Kollision auf M82 umnummeriert (Inhalt unverändert)._

**Quelle:** JoBetes (IST-Audit 2026-05-11)
**Tags:** `compliance`, `mdr`, `ai-act`, `pivot`

Projekt war "non-diagnostic" (limited-risk), Domain-Pivot macht es "diagnostic" (high-risk). Compliance-Docs müssen revidiert werden **bevor** Pilot startet — nicht parallel.

Pre-Pivot-Checklist:
1. `AI_ACT_RISK_ASSESSMENT.md` neu schreiben.
2. DPIA-Revision.
3. MDR-Klassifikation revisit.
4. §203 StGB-Risiko-Matrix anpassen.

Pivot-Merge erst nach Sign-Off vom Compliance-Reviewer.


---

## M08 — Adversarial Multi-Agent-Review mit Selbst-Verifikation am Limit

**Quelle:** diggai-anamnese (Review-Sessions 2026-06-11/12)
**Tags:** `review`, `multi-agent`, `verification`

Mehrere Review-Agents fan-out (z.B. 4 Dimensionen × 2 Verifier). Brechen Review-Agents am Session-Limit mit unverifizierten Findings ab, verifiziert der Haupt-Agent die Top-/mehrfach-gemeldeten Findings selbst im Code. Grundregel: "unwiderlegt" ≠ "wahr" — nur verifizierte Findings werden gefixt.

**Quellen:** `diggai-anamnese/memory/runs/2026-06-11_claude-code_fable-5-19.md`

---

## M09 — Fail-closed Guard für Risiko-Pfade (Medizin-Kern / Secrets / Deploy)

**Quelle:** diggai-anamnese (Agenten-Infra MWP/ICM)
**Tags:** `guardrails`, `safety`, `fail-closed`, `agents`

Guard-Skript DENY-gatet Medizin-Kern / Secrets / Deploy / push / ssh / docker (exit 2), ALLOW für normale Builds. Tool-frei parsen (KEIN jq-Dependency — fehlt jq, blockiert ein jq-basierter Guard fail-closed ALLES). Globs mit UND ohne führenden Slash testen (`deploy/*` matcht `deploy/...` nicht automatisch). Mit ≥12 Fällen verifizieren.

**Quellen:** `diggai-anamnese/memory/runs/2026-06-11_claude-code_fable-5-23.md`

---

## M10 — Session-Limit-Handoff: Folge-Agent übernimmt Working-Tree + Gates + Commit

**Quelle:** diggai-anamnese (mehrfach in fable-5-Sessions)
**Tags:** `handoff`, `session-limit`, `multi-agent`

Vorgänger-Agent bricht häufig vor Gates/Commit am Session-Limit ab. Etabliertes Muster: der Folge-Agent übernimmt den Working-Tree, fährt die Gates selbst und committet. Voraussetzung: by-name-Staging + HEAD-Recheck (W14), damit keine Fremd-Änderungen mitlecken.

**Quellen:** `diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-01.md`



---

## M11 — Subagent-Absenz-Claims („X existiert nicht im Code") sind oft False-Negatives → selbst gegenprüfen

**Quelle:** diggai-anamnese (v2-Rückkanal / Claim-Gap-Analyse 2026-06-16)
**Tags:** `multi-agent`, `subagent`, `false-negative`, `verification`

Ein Subagent meldete einen vorhandenen Praxis-Private-Key fälschlich als ABSENT; die Eigen-Gegenprüfung im Code (`praxisResidentKeyStore.ts` + `clientCrypto.v2.ts`) belegte das Gegenteil. Lehre: Die NEGATIVE Aussage eines Subagents („Feature/Datei/Pfad fehlt") ist genauso fehleranfällig wie ein falsches Finding — und teurer, weil sie zu Doppel-Implementierung oder falschen Außen-Aussagen (z.B. einem Kunden gemeldete „Lücke", die keine ist) führt. Vor dem Handeln auf eine gemeldete Absenz immer selbst im Code verifizieren (grep/Read der genannten Pfade). Komplement zu M08 („unwiderlegt ≠ wahr").

**Quellen:** `diggai-anamnese/memory/runs/2026-06-16_cowork_opus-4-8-17.md`

---

## M12 — Kuratiertes Critical-Flow-Gate (`test:critical`) + schriftliche Pre-Deploy-Checkliste statt Voll-Suite vor jedem Deploy

**Erstmals beobachtet:** 2026-06-17 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** METHODOLOGY · Tags: `ci`, `regression-gate`, `pre-deploy`, `smoke-test`, `deploy-hygiene`

**Was funktioniert:** Statt vor jedem Deploy die langsame, OOM-anfällige Voll-Suite (vgl. F12) zu fahren, ein kuratiertes Subset der wirklich kritischen Flows als eigenes Script `npm run test:critical` definieren und als Pflicht-Gate vor den Deploy hängen — flankiert von einer schriftlichen `docs/PRE_DEPLOY_CHECKLIST.md` (manuelle Punkte, die kein Test abdeckt). Schnell genug, um wirklich bei JEDEM Deploy zu laufen → fängt Regressionen, die ein übersprungener Voll-Lauf durchgelassen hätte.
**Konkret:** Smoke-Timeouts großzügig wählen (hier 30 s → 60 s), damit Cold-Start/DNS-Flip nach dem Deploy keine False-Negatives erzeugen (vgl. G04 Cold-Start, G20 DNS). Ergänzt M04 (DoD) um ein deploy-spezifisches, ausführbares Gate.
**Quellen:** `docs/PRE_DEPLOY_CHECKLIST.md`, `package.json` (`test:critical`), `src/components/dashboards/__smoke__/smoke.test.ts` (diggai-anamnese, Commit 8608eb6)

---

## M13 — Inhaltliche/regulatorische Entscheidungen NICHT autonom verfassen — neutraler Platzhalter + Verweis an Fachverantwortliche

**Erstmals beobachtet:** 2026-06-29 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** METHODOLOGY · Tags: `regulatory`, `scope-discipline`, `placeholder`, `404-fix`, `content-ownership`, `guardrail`

**Was passiert:** Ein patientensichtbarer Footer-Link zeigte auf eine fehlende Route (404). Der eigentliche Inhalt (Bedienungsanleitung) ist eine fachliche/regulatorische Entscheidung.
**Fix:** Den technischen Defekt (404) sofort beheben, aber NUR mit neutralem Platzhalter ('Seite in Vorbereitung' + Verweis an die zustaendige Stelle) ohne fachliche/diagnostische Aussagen. Den fachlichen Inhalt explizit der verantwortlichen Person ueberlassen. Trennt 'Tech-Fix' (autonom ok) sauber von 'Domain-Content' (gated).
**Quellen:** `commit ce07844 (IfuPage Platzhalter)` (diggai-anamnese)

---

## M14 — Unit-Tests grün ≠ läuft — Live-Smoke gegen echtes Postgres + echten Token; Mapper-/Spalten-/Enum-Drift ist bis zur ersten echten Query unsichtbar

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** METHODOLOGY · Tags: `verification`, `live-smoke`, `postgres`, `orm-drift`, `mock-db`, `sqlalchemy`, `fastapi`

**Was passiert:** Routen mit grüner Mock-DB-Test-Suite warfen live 500er: Spalten-Drift (`column ... does not exist`), Enum-Bind-Fehler, `NoForeignKeysError` (nur zur Query-Zeit, nicht beim Import), `from_attributes`-Fehlaufrufe. Allein eine Usability-Route hatte drei Bugs, alle erst im Live-Smoke sichtbar. Ursache: Mock-DB-/same-origin-ASGI-Tests führen den echten SQL-Pfad nie aus. SQLAlchemy bindet Spaltennamen LAZY → `import app.main` (Route-Count) fängt Drift NICHT; Mapper-Config-Fehler (fehlende FK) surfacen erst beim ersten echten SELECT.
**Fix:** Verlässlicher Sweep: `\d <table>` live gegen jedes ORM-Model diffen + einen echten `SELECT * LIMIT 1` durch jedes Model laufen lassen + voller `pytest --no-cov`. Plus echter `curl`/httpx-Call mit echtem Token gegen die laufende API (echtes Postgres). Regel: Für jeden DB-gebundenen Endpoint mindestens einen Live-Smoke gegen echte DB + echten Token fahren. DB-Schema (information_schema/`\d`) ist Source-of-Truth gegen das ORM. `import`-Erfolg und grüne Mocks beweisen weder Schema-Konsistenz noch Mapper-Korrektheit.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## M15 — Bei rotem Test zuerst fragen: Produkt-Bug oder Test-Harness/Mock-Bug? — unvollständige App-Fixtures und naive Settings-Mocks erzeugen Phantom-Fails

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** METHODOLOGY · Tags: `testing`, `pytest`, `fixtures`, `mock`, `false-positive`, `verification`, `fastapi`

**Was passiert:** 41 Tests rot mit 404, obwohl der Router live erreichbar ist; ein 'wrong-token'-Test → 500 statt 401. In einem Sweep waren 42 von 48 Failures Test-Infrastruktur, nicht Produkt. Ursache: (a) Die conftest-`app`-Fixture baute ein MINIMALES App (nur einige Router) → Router-under-Test fehlten → 404. (b) `MagicMock(INTERNODE_SECRET=...)` vivifiziert `INTERNODE_SECRET_PREV` automatisch als truthy Mock → `secret_prev.encode()` gibt MagicMock → `hmac.compare_digest` TypeError → 500 (Prod safe, weil Default None).
**Fix:** Router-under-Test in die Fixture aufnehmen; Settings-Mock ALLE vom Code gelesenen Felder explizit modellieren (`INTERNODE_SECRET_PREV=None`). Erst `\d`/curl gegen die echte App prüfen, bevor man einen Produkt-Bug annimmt. Regel: Roten Test immer erst als möglichen Harness-/Mock-Bug einordnen (minimale Fixture, MagicMock-Auto-Vivification truthy). Gegen die echte laufende App gegenprüfen, bevor man am Produkt 'fixt' — sonst baut man echte Bugs ein.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## M16 — Mock-only-Test ist kein SDK-Vertrags-Beweis — externe SDKs mit Residency/Auth-Wirkung brauchen einen non-mocked URL-/Konstruktions-Assert

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** METHODOLOGY · Tags: `verification`, `sdk-contract`, `mock`, `data-residency`, `url-assertion`, `adversarial-review`, `llm`

**Was passiert:** Ein 'Fix' eines Residency-Guards baute einen production-breaking HTTP 404 bei JEDEM Prod-LLM-Call ein (inkompatible Host↔Pfad↔Auth-Kombi des SDK). Alle Tests blieben grün — der einzige Beweis war ein Mock. Erst eine adversariale Review mit Live-URL-Probe fand es. Ursache: Das SDK spricht zwei Backends mit inkompatiblen URL-Shapes (Developer-API mit api_key/Host A/Pfad X vs Vertex mit project+location/Host B/Pfad Y). Ein base_url-Override mischte sie zu einer strukturell ungültigen Request-URL. Mock-Tests verifizieren den SDK-Vertrag (Host/Pfad/Auth) nie.
**Fix:** Eine einzige Factory, die den Modus explizit macht (die kaputte Kombi ist nicht mehr ausdrückbar). PLUS ein NON-mocked Konstruktions-/URL-Assert-Test, der die echte gebaute Request-URL introspektiert (ohne Netz-Call) und bricht, wenn Host↔Pfad↔Auth inkompatibel werden. Regel: Für jede externe-SDK-Integration mit Residency-/Auth-Wirkung mindestens einen non-mocked Vertrags-Test (echte gebaute URL/Request introspektieren). 'Grün weil gemockt' ist kein Beweis. Und: ein Fix kann der nächste, schlimmere Bug sein — frisch committete Arbeit adversarial gegenprüfen.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## M17 — Pin-/Versions-Werte an mehreren Stellen halten (Drei-Quellen-Regel) — jede Änderung in EINEM Commit mit Vollständigkeits-Check

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** METHODOLOGY · Tags: `dependencies`, `version-pinning`, `drift`, `ci`, `single-commit`, `consistency`

**Was passiert:** Python-Versionen lebten an DREI Stellen (`pyproject.toml`, lokales `setup-venv`-Skript mit kuratierter Windows-Liste, CI-Workflow) → Drift-Gefahr bei jeder Pin-Änderung. Ursache: Dieselbe Versionsangabe ist über mehrere Build-/CI-/Dev-Dateien dupliziert ohne Single-Source.
**Fix:** Drei-Quellen-Regel: jede Pin-Änderung aktualisiert ALLE Stellen in einem Commit, scriptgesteuert via Replace-Map mit Vollständigkeits-Check ('missing keys: none'). Regel: Duplizierte Versions-/Pin-Werte explizit als Set führen und bei jeder Änderung atomar (ein Commit) mit Vollständigkeits-Assertion aktualisieren — sonst driften Build, CI und Dev-Setup auseinander.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## M18 — Dependency-Pins ohne Audit-Routine sammeln stille CRITICAL-CVEs — je Pin OSV.dev + Registry-Latest, minimal-korrekte Bumps, Suite als Gate

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** METHODOLOGY · Tags: `security`, `dependencies`, `cve`, `osv`, `audit`, `supply-chain`

**Was passiert:** Stack trug 2 Jahre alte Pins mit 2× CRITICAL (Middleware-Auth-Bypass-CVE; JWT-Algorithm-Confusion-CVE im Validator) + dutzenden HIGH — unbemerkt, weil nie systematisch geprüft. Ursache: Pins wurden ohne wiederkehrende Audit-Routine gesetzt; npm audit/pip-audit/OSV liefen nie.
**Fix:** Methode: je Pin OSV.dev-Query (`api.osv.dev/v1/query`) + Registry-Latest + Fixed-in-Versionen je CVE → minimal-korrekte Bumps. Reihenfolge: erst Security-Pins innerhalb des Majors, volle Test-Suite + E2E als Gate, Major-Upgrades als geplante Follow-ups. Regel: Dependency-Pins regelmäßig gegen OSV.dev/Registry auditieren. Security-Bumps minimal und innerhalb der Major halten, mit der Suite als Gate; Major-Upgrades separat planen. Alte Pins sind eine stille Akkumulation von CVEs.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## M19 — Alten Audit-/Bug-Backlog vor dem Abarbeiten gegen den AKTUELLEN Code + LIVE DB verifizieren — die Hälfte war längst gefixt

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** METHODOLOGY · Tags: `backlog`, `verification`, `stale-list`, `audit`, `live-db`, `methodology`

**Was passiert:** Ein Mai-Audit-Backlog war zu ~50% durch zwischenzeitliche Juni-Refaktorierung längst gefixt; blindes Abarbeiten hätte Doppelarbeit/Regressions erzeugt. Ursache: Die Bug-Liste war stale — sie spiegelte nicht den zwischenzeitlich refaktorierten Code/DB-Stand.
**Fix:** Vor dem Abarbeiten jedes Backlog-Items gegen den aktuellen Code und die LIVE-DB prüfen, ob es noch offen ist. Nicht-launch-blockierende Items bewusst mit Begründung aufschieben. Regel: Jeden geerbten Backlog/Findings-Report als LEAD behandeln, nicht als Wahrheit — jedes Item gegen den aktuellen Stand re-verifizieren, bevor man handelt (verwandt: Subagent-Funde gegenprüfen).
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## M20 — Parallel-Survey-/Sub-Agent-Funde sind LEAD, nicht Wahrheit — Zeilennummern driften, Vollständigkeit nicht garantiert; jeden Fund selbst gegenprüfen

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** METHODOLOGY · Tags: `multi-agent`, `subagent`, `survey`, `false-negative`, `dead-code`, `verification`

**Was passiert:** 4 Parallel-Survey-Agents lieferten teils falsche Zeilennummern UND übersahen Funde: der Dead-Code-Agent flaggte 6 tote Dateien, übersah aber eine 7. (473 Zeilen, 0 Imports) — die erst die eigene Verifikation fand. Ursache: Sub-Agent-Output ist näherungsweise: Zeilennummern driften, Vollständigkeit ist nicht garantiert, sowohl falsch-positive als auch falsch-negative Funde kommen vor.
**Fix:** Jeden Survey-Fund vor der Umsetzung selbst verifizieren (`grep -rn "from .*<Component>"` → 0 Imports = wirklich tot; Header-Presence, Query-Pattern selbst checken). Regel: Multi-Agent-Survey-Ergebnisse als Hinweise behandeln, nie als verifizierte Wahrheit — sowohl positive Funde als auch gemeldete Absenzen ('X existiert nicht') eigenständig im Code gegenprüfen, bevor man handelt.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## M21 — Enforcing CSP nie ohne prod-gleiche Verifikation shippen — lokales `next start` liefert falsche MIME-Typen und korrumpiert das CSP-Signal; Report-Only zuerst

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** METHODOLOGY · Tags: `csp`, `security`, `next`, `mime`, `report-only`, `staging`, `frontend`

**Was passiert:** Strikte CSP lokal nicht verifizierbar: `next start` + `output:standalone` serviert `_next/static/*` als `text/plain` (Windows) → mit `nosniff` refused der Browser alle Scripts/Styles + ein `unsafe-eval`-EvalError. Sieht aus wie kaputte CSP, ist aber ein MIME-Artefakt der lokalen Serve-Methode. Ursache: Lokales `next start` ≠ Prod-Serving (Prod = nginx/standalone mit korrektem MIME). Das MIME-Artefakt korrumpiert das CSP-Enforcement-Signal.
**Fix:** CSP zuerst als `Content-Security-Policy-Report-Only` ausrollen (Nonce trotzdem auf Request-Header), Enforcing erst nach Staging-Verifikation mit korrektem MIME + Report-Collector-Review. Regel: Enforcing-Security-Header (CSP) niemals auf Basis lokaler Serve-Signale aktivieren — lokale Serve-Methoden liefern oft falsche MIME-Typen. Report-Only zuerst, Enforcing erst nach Verifikation in prod-gleicher Umgebung.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## M22 — Vor E2E auf Windows ALLE node-Prozesse killen — Server-Müll aus vielen Dev/Start-Läufen auf demselben Port erzeugt scheinbare 'Regressions'

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** METHODOLOGY · Tags: `e2e`, `playwright`, `windows`, `stale-server`, `port`, `false-positive`, `node`

**Was passiert:** E2E meldete '2 failed' als scheinbare Regression — tatsächlich connectete Playwright (kein `webServer` in der Config) zu einem stalen/kaputten Dev-Server auf :3000 ('Internal Server Error'), Rest aus vielen `npm run dev`/`next start` derselben Session. Ursache: Viele Server über eine Session auf demselben Port hinterlassen Windows-Prozess-Müll; ohne `webServer`-Config trifft der Test einen toten Altserver.
**Fix:** Vor E2E ALLE node-Prozesse killen (`taskkill /F /IM node.exe`), EINEN sauberen Dev-Server starten, `/de`=200 verifizieren, DANN testen. Backend (python:8000) bleibt unberührt. Regel: Rote E2E zuerst als Umgebungs-Artefakt verdächtigen (staler Server, falscher Port), nicht als Code-Regression. Vor jedem Lauf einen sauberen, warm-kompilierten Server erzwingen und mit einem 200-Probe bestätigen.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)
