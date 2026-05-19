# WHAT WORKED — Patterns die sich bewährt haben

Aggregiert aus DiggAiHH-Projekten. Daily-Sync ergänzt automatisch.

---

## W01 — 7-Sub-Phasen-Bootstrap

**Erstmals beobachtet:** 2026-05-15 in Lou-Intit
**Beobachtet in:** Lou-Intit · DiggAi-anamnese
**Kategorie:** WORKED · Tags: `bootstrap`, `onboarding`

**Was funktioniert:** Phase 0 in 7 sequenzielle Sub-Phasen (Skelett → Memory → Ralph+Caveman → PRD → Run-Log → Master → Commit) — zwischen jeder ein 1-Satz-Status. Verhindert Mega-Sub-Updates.

**Quellen:** `Lou-Intit/_bootstrap/02_METHODIK_WORKFLOW.md`

---

## W02 — AGENT_HANDOUT.txt für Cross-Tab-Handover

**Erstmals beobachtet:** 2026-05-12 in JoBetes
**Beobachtet in:** JoBetes · DiggAi-anamnese
**Kategorie:** WORKED · Tags: `memory`, `session-handover`

**Was funktioniert:** 1-Page-Datei mit aktuellen Tasks + Tools + Gotchas + Prod-Zustand + Next-Action. Neuer Tab pastet → 30s up-to-speed.

---

## W03 — Master-Cockpit ≤95 Zeilen

**Erstmals beobachtet:** 2026-04 in DiggAi-anamnese
**Beobachtet in:** DiggAi-anamnese · JoBetes
**Kategorie:** WORKED · Tags: `status`, `daily-driver`

**Was funktioniert:** Top-Tabelle "Wer | Was | Bis | Status" mit 3 Pareto-Items. Längere Detail-Listen darunter, aber Pareto-3-View oben. Owner liest morgens drauf, weiß sofort was zu tun ist.

---

## W04 — Run-Log nach Lauf-Nummer-pro-Tag

**Erstmals beobachtet:** 2026-04 in DiggAi-anamnese
**Beobachtet in:** mehrere Projekte
**Kategorie:** WORKED · Tags: `run-log`, `memory`

**Was funktioniert:** Format `YYYY-MM-DD_<agent>_<model>-<NN>.md` mit `<NN>` monoton wachsend pro Tag/Agent/Model. Suchbarkeit hoch, Konflikte vermieden.

---

## W05 — DoD-Liste direkt in CLAUDE.md

**Erstmals beobachtet:** 2026-05 in DiggAi-anamnese
**Beobachtet in:** Lou-Intit · DiggAi-anamnese
**Kategorie:** WORKED · Tags: `dod`, `quality`

**Was funktioniert:** 11-Punkte-DoD wörtlich in CLAUDE.md kopiert. Ralph + Claude Code lesen CLAUDE.md auto → DoD-Check bei jedem Run statt "wenn ich daran denke".

---

_(Auto-extended by daily-sync. Last sync: pending first run.)_

---

## W06 — Mock-Fallback für AI-Provider in Offline-Dev

**Erstmals beobachtet:** 2026-05-11 in JoBetes (IST-Audit)
**Beobachtet in:** JoBetes
**Kategorie:** WORKED · Tags: `ai-provider`, `mock`, `offline-dev`, `testing`

**Was funktioniert:** Vision/LLM-Provider liefert deterministisch dieselbe Antwort, wenn API-Key fehlt. Dev-Build ohne Cloud-API, Test-Suite ohne Mocking-Library-Overhead.
**Pattern:** `if (!process.env.PROVIDER_API_KEY) return mockResponse(); else return realCall();` mit klarer LOG-Warnung "MOCK-MODUS aktiv".

---

## W07 — shared-schemas-Package als FE/BE Single-Source-of-Truth

**Erstmals beobachtet:** 2026-05-11 in JoBetes
**Beobachtet in:** JoBetes
**Kategorie:** WORKED · Tags: `monorepo`, `zod`, `schemas`, `dry`

**Was funktioniert:** `packages/shared-schemas/` exportiert alle Zod-Schemas. Frontend nutzt für Form-Validation, Backend für Request-Body-Validation, beide nutzen denselben TS-Type via `z.infer`. Kein Schema-Drift möglich.
**Pattern:** `export const PatientSchema = z.object({...}); export type Patient = z.infer<typeof PatientSchema>;`. Beide Apps importieren aus `@<projekt>/shared-schemas`.

---

## W08 — i18n-Parity-Tests fangen fehlende Translations

**Erstmals beobachtet:** 2026-05-11 in JoBetes
**Beobachtet in:** JoBetes
**Kategorie:** WORKED · Tags: `i18n`, `tests`, `parity`, `rtl`

**Was funktioniert:** Test läuft über alle Locale-Files, prüft Keys gegen Master-Locale. Fängt Missing-Keys (z.B. neue EN-Strings ohne AR-Übersetzung) **vor** Production-Deploy ab.
**Pattern:** `expect(Object.keys(de)).toEqual(Object.keys(en).sort())` für jedes Namespace.

---

## W09 — Bundle-Budget enforcement in CI

**Erstmals beobachtet:** 2026-05-11 in JoBetes
**Beobachtet in:** JoBetes
**Kategorie:** WORKED · Tags: `bundle-size`, `ci`, `performance-budget`

**Was funktioniert:** CI fail-t, wenn Initial-Bundle das Budget (z.B. 130 KB gzipped) überschreitet. JoBetes-Stand: 104 KB → 26 KB Puffer. Zwingt zu Lazy-Loading vor jedem Feature-Merge.
**Pattern:** `size-limit` oder selbstgebauter Check: `stat dist/assets/index-*.js`.

---

## W10 — GDPR Art. 17 via Prisma `onDelete: Cascade`

**Erstmals beobachtet:** 2026-05-11 in JoBetes
**Beobachtet in:** JoBetes
**Kategorie:** WORKED · Tags: `gdpr`, `prisma`, `cascade-delete`, `right-to-erasure`

**Was funktioniert:** Alle FK-Tabellen auf `User` haben `onDelete: Cascade`. DELETE auf User entfernt abhängige Rows in einer Transaktion. GDPR Art. 17 in 1 DB-Statement.
**Caveat:** Audit-Log muss VOR Cascade-Delete ein "Anonymisierung statt Delete" pattern haben (Trigger oder App-Logic), sonst geht Audit-Spur verloren.

---

## W11 — Triple-Output für Konzepte (.md + .html + ASCII .txt)

**Erstmals beobachtet:** 2026-04 in mehreren Sessions
**Beobachtet in:** JoBetes · DiggAi-anamnese
**Kategorie:** WORKED · Tags: `output-format`, `concept-docs`, `human-handoff`

**Was funktioniert:** Drei Versionen jedes wichtigen Konzept-Dokuments: `.md` für GitHub/IDE, `.html` für Browser-Screenshot, ASCII `.txt` für maschinen-getrennten Ground-Truth (Diff-friendly).
**Pattern:** Bei jedem strategischen Doc drei Dateien gleichen Inhalts, drei Sichten. ASCII ist die canonical für Tool-zu-Tool-Übergaben.

---

## W12 — Operator-passiv-Pattern (Agent macht Git/Push/Deploy)

**Erstmals beobachtet:** 2026-04 in mehreren Sessions
**Beobachtet in:** JoBetes · DiggAi-anamnese
**Kategorie:** WORKED · Tags: `workflow`, `operator-mode`, `automation`, `desktop-commander`

**Was funktioniert:** Operator klickt nur wenn nötig (max 1 Klick, alles vorbereitet). Agent macht git/push/deploy via Desktop Commander auf dem Operator-PC. Spart Stunden pro Woche, plus Fehler durch manuelles Tippen.
**Pattern:** Wenn Operator-Aktion nötig, Agent öffnet Tab/Dialog vor, sagt EXAKT was zu klicken. Niemals `.bat`-Files für manuelles Ausführen vorbereiten.
