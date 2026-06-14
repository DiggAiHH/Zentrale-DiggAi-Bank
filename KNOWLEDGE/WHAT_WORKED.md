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
**2026-06-Ergänzung (diggai-anamnese):** Für credential-gebundene Aktionen (INWX-DNS-Flip, SSH-Passphrase) "One-Click-Prefill": Agent lokalisiert die exakte Aktion (z.B. DNS-Record-`rid` + Zielwert/TTL) und bereitet sie scharf vor; Operator macht NUR Login + Save. Siehe G24.


---

## W13 — Node-fetch-Smoke-Test statt Browser/Playwright

**Erstmals beobachtet:** 2026-05-27 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (mehrfach)
**Kategorie:** WORKED · Tags: `testing`, `smoke-test`, `node-fetch`, `csrf`

**Was funktioniert:** Reiner Node-`fetch`-Test mit CookieJar (Set-Cookie-Parse + Cookie-Header-Rebuild) + CSRF-Token-Roundtrip deckt alles Backend-Prüfbare ab — kein Browser-Heap-OOM, Sekunden statt Minuten, reproduzierbar. Persistiert als Smoke-Vorlage (`e2e/live-audit/*.mjs`).
**Pattern:** `node smoke.mjs` holt CSRF-Token, baut Cookie-Header neu, POSTet Session/Answers; prüft Statuscodes. Ersetzt Playwright für alle Nicht-UI-Flows. Siehe F11.
**Quellen:** `diggai-anamnese/memory/runs/2026-05-27_claude-code_opus-4-7-06.md` (diggai-anamnese)

---

## W14 — Concurrent-Agent-Git-Hygiene: by-name-Commit, HEAD-Recheck, Never-Stage-Residue

**Erstmals beobachtet:** 2026-06-04 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (mehrfach)
**Kategorie:** WORKED · Tags: `git`, `multi-agent`, `concurrency`, `hygiene`

**Was funktioniert:** Bei mehreren parallel schreibenden Agents: NIE `git add -A`; nur kohärente Dateien by-name (`git commit -- <file>`); HEAD direkt vor dem Commit re-checken (Fremd-Commits wandern den Branch weiter); Fremd-Residue dem Operator zur Einzel-Entscheidung flaggen statt blind mitcommitten.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-04_claude-code_opus-4-7-02.md` (diggai-anamnese)

---

## W15 — One-off-Node-Skript für Multi-Locale-i18n-Edits

**Erstmals beobachtet:** 2026-06-08 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (mehrfach)
**Kategorie:** WORKED · Tags: `i18n`, `node-script`, `locales`, `encoding`

**Was funktioniert:** Statt Edit-Tool (verlangt Read jeder der 10 Locale-JSONs) ein wegwerfbares Node-Skript: key-gematchtes In-Place-Replace pro Locale, EOL/BOM/Encoding-erhaltend, self-verifying (OK/SKIP/FAIL je Datei + `JSON.parse` aller Locales), danach gelöscht.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-08_claude-code_opus-4-8-01.md`, `…2026-06-13_claude-code_opus-4-8-01.md` (diggai-anamnese)

---

## W16 — Ehrliche Verifikation über das Mögliche statt fingierter Beweise

**Erstmals beobachtet:** 2026-06-03 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (durchgängig)
**Kategorie:** WORKED · Tags: `verification`, `honesty`, `http`, `browser`, `culture`

**Was funktioniert:** Wenn Browser/Playwright/Docker fehlen: über HTTP-Statuscodes + `get_page_text`/a11y-Tree + JS-DOM-Reads + read_network/read_console verifizieren — und die NICHT testbaren Teile ehrlich als "blockiert/skipped" dokumentieren statt Ergebnisse zu fingieren. Höheres Signal, kein falsches Grün; Operator-Vertrauen bleibt intakt.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-03_claude-code_opus-4-7-04.md`, `…2026-06-04_claude-code_opus-4-7-03.md` (diggai-anamnese)

---

## W17 — Geschlossene Beweiskette statt unzuverlässigem Live-Scan (DSGVO same-origin)

**Erstmals beobachtet:** 2026-06-04 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** WORKED · Tags: `dsgvo`, `verification`, `same-origin`, `evidence-chain`

**Was funktioniert:** Wo ein Live-Scan nicht zuverlässig möglich ist ("null Fremd-CDN-Hosts während echtem Scan"), die Garantie über eine geschlossene Kette absichern: Unit-Tests beweisen same-origin-Pfade in BEIDEN Code-Pfaden + Quell-Inspektion der Lib + `dist`-Grep nach Fremd-Hosts. Drei unabhängige Belege schlagen einen flakigen Browser-Scan.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-04_claude-code_opus-4-8-01.md` (diggai-anamnese)
