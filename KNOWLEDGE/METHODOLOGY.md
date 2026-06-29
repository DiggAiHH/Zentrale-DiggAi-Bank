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