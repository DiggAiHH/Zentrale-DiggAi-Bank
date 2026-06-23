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


---

## W18 — Harness-unabhängige Verifikation via standalone Node `--experimental-strip-types`-Skript (importiert TS-Quelle direkt)

**Erstmals beobachtet:** 2026-06-16 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (mehrfach)
**Kategorie:** WORKED · Tags: `verification`, `node`, `webcrypto`, `strip-types`, `vitest-down`, `smoke-test`

**Was funktioniert:** Wenn vitest unbrauchbar ist (z.B. win32-Bindings in Linux-Sandbox, G27), den Logik-/Krypto-Kern über ein wiederverwendbares Node-Skript (`node --experimental-strip-types`) verifizieren, das die ECHTEN TS-Module direkt importiert und gegen Node-WebCrypto prüft — ECDH/HKDF/AES-GCM seal/open, GCM-Tamper-wirft, Key-Rotation, Padding-Roundtrip. Lief 26/26 grün, völlig unabhängig vom toten React/rolldown-Test-Netz; als `npm run`-Script + doppelklickbares `.cmd` verankert.
**Pattern:** `node --experimental-strip-types scripts/verify-<x>.ts` importiert `src/lib/...` direkt, assertet das Verhalten über native WebCrypto; ersetzt vitest für reine Logik-Kerne. Ergänzt W13 (HTTP-Smoke) und W16 (ehrliche Verifikation).
**Quellen:** `memory/runs/2026-06-15_cowork_opus-4-8-16.md`, `2026-06-16_cowork_opus-4-8-01.md` (diggai-anamnese)


---

## W19 — „Grün-by-mirror": neue Brücke/Wrapper 1:1 an CI-getestete Primitive delegieren + deren Test spiegeln

**Erstmals beobachtet:** 2026-06-17 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (mehrfach, v2-Rückkanal)
**Kategorie:** WORKED · Tags: `confidence`, `toolchain-down`, `mirror-test`, `additive`, `crypto`, `prisma`

**Was funktioniert:** Wenn die lokale Toolchain nicht läuft (z.B. win32-Bindings in der Linux-Sandbox, G27), neue Funktionalität bewusst additiv bauen und 1:1 an bereits CI-getestete Primitive delegieren (hier: Krypto rein über die `patientKeypair`-Primitive, die neue Relay-Route 1:1 an die bestehende `v2-relay.ts` gespiegelt). Den neuen Test als Spiegel des bestehenden Tests der Primitive schreiben („grün-by-mirror"). So bleibt die Konfidenz hoch, obwohl `vitest`/`tsc` lokal nicht ausführbar sind — der spätere Lauf auf dem Host bestätigt nur noch, statt erstmals zu prüfen. Ergänzt W18 (harness-unabhängige Verifikation) und W14 (additive, by-name-Git-Hygiene).
**Quellen:** `memory/runs/2026-06-16_cowork_opus-4-8-18.md`, `2026-06-16_cowork_opus-4-8-19.md` (diggai-anamnese, Commit ab0bb5b)

---

## W20 — Unter Fake-Timers `await vi.advanceTimersByTimeAsync(ms)` statt `advanceTimersByTime` + `waitFor`

**Erstmals beobachtet:** 2026-06-17 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** WORKED · Tags: `vitest`, `fake-timers`, `async`, `waitFor`, `debounce`, `testing`

**Was funktioniert:** Bei debounce-/timeout-getriebenem Code (z.B. eine Suche mit 400 ms Debounce) unter aktivierten Fake-Timers `await vi.advanceTimersByTimeAsync(400)` verwenden statt `vi.advanceTimersByTime(400)` + nachgelagertem `await waitFor(...)`. `advanceTimersByTimeAsync` flusht die Microtask-Queue ZWISCHEN Timer-Callback und Promise-Resolve — nach dem `await` ist das durch den Timer ausgelöste async-Ergebnis bereits gerendert. `waitFor` ist dann überflüssig und kann unter Fake-Timers sogar hängen (es pollt über echte Zeit, die nicht läuft).
**Pattern:** Fake-Timers an → `fireEvent`/State-Änderung → `await vi.advanceTimersByTimeAsync(debounceMs)` → direkt asserten. Kein `waitFor` im Fake-Timer-Pfad. Ergänzt die Harness-Patterns W13/W18.
**Quellen:** `src/components/PraxisSucheStep.test.tsx` (diggai-anamnese, Commit db621b3)

---

## W21 — Split-/Multi-Field-Input: pro Feld sofort + präzise validieren, Cross-Field-Checks hinter Feld-Plausibilität gaten

**Erstmals beobachtet:** 2026-06-20 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** WORKED · Tags: `forms`, `validation`, `ux`, `date-input`, `react`, `a11y`

**Was funktioniert:** Bei einem in Teilfelder zerlegten Input (z.B. Tag/Monat/Jahr) jedes Feld SOFORT validieren, sobald es vollständig getippt ist, mit einer feldspezifischen Meldung ("diesen Tag/Monat gibt es nicht …") statt einer pauschalen "ungültig"-Meldung erst am Ende. Cross-Field-Checks (unmöglicher Kalendertag wie 30.02., Zukunftsdatum) ERST prüfen, wenn die Einzelfelder je für sich plausibel sind — sonst doppelte/widersprüchliche Meldungen. Das fehlerhafte Feld zusätzlich via `aria-invalid` + Rahmenfarbe markieren.
**Pattern:** Unmöglichen Kalendertag erkennen, indem man das Datum baut und den Roundtrip prüft: `const d=new Date(yy,mm-1,dd); const impossible = d.getFullYear()!==yy || d.getMonth()!==mm-1 || d.getDate()!==dd;`. Pro Teilfeld erst ab Soll-Länge prüfen (Tag/Monat 2, Jahr 4), damit nicht bei jedem Tastendruck eine Meldung blinkt.
**Quellen:** `src/components/inputs/DateInput.tsx`, `src/components/inputs/DateInput.test.tsx` (diggai-anamnese, Commit df40bdd)


---

## W22 — Restzeit-/ETA-Anzeige aus feingranularem Fortschritt ableiten, nicht aus groben Meilensteinen

**Erstmals beobachtet:** 2026-06-20 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** WORKED · Tags: `ux`, `progress`, `eta`, `long-form`, `wizard`

**Was funktioniert:** In einem langen mehrstufigen Flow (viele Fragen/Schritte) soll "Noch ~X Min." sich mit JEDER Aktion bewegen. Leitet man die Restzeit nur aus verbleibenden Kapiteln/Meilensteinen ab, wirkt die Anzeige minutenlang "eingefroren" (kein sichtbarer Fortschritt innerhalb eines Kapitels) — das untergräbt das Vertrauen in die Anzeige. Stattdessen die Restzeit aus dem feingranularen Gesamtfortschritt (beantwortete/insg. Items) ableiten: `restMin = max(1, round(gesamtMin * (100 - prozent) / 100))`, bei 100 % → 0.
**Pattern:** Fortschritts-Prozent über alle Items statt nur Schritt-Index; ETA als Funktion dieses Prozentwerts. Gilt für jeden Wizard/Onboarding-/Umfrage-Flow mit Zeitschätzung.
**Quellen:** `src/components/ui/ChapterProgress.tsx` (diggai-anamnese, Commit df40bdd)


---

## W23 — Capability-URL (nicht-erratbare UUID = Bearer) fuer konto-losen, geraeteuebergreifenden Wiedereinstieg

**Erstmals beobachtet:** 2026-06-21 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** WHAT_WORKED · Tags: `capability-url`, `auth`, `cross-device`, `account-less`, `ux`, `rate-limit`, `audit`

**Was funktioniert:** Damit ein Nutzer OHNE Konto einen Vorgang geraeteuebergreifend wieder aufnehmen kann, dient die vollstaendige Ressourcen-UUID als Bearer-Capability: `GET /resource/:uuid/reopen`, wobei der Besitz der nicht-erratbaren UUID die Autorisierung IST. Der Nutzer startet auf dem Desktop, oeffnet den Status-/Wiedereinstiegs-Link auf dem Handy und macht weiter — kein Login, keine Registrierung. Gegen Missbrauch mit Rate-Limit + Audit-Logging absichern.
**Fix/Umsetzung:** UUID v4 (genug Entropie, nicht erratbar), Endpoint nur GET-idempotent, jeder Zugriff rate-limited + auditiert; Link-Wortlaut geraeteneutral halten („auf diesem Geraet" vs. „auf einem anderen Geraet"). Distinkt von klassischem Session-Auth: die Capability ersetzt das Konto, nicht ergaenzt es. Siehe verwandte Middleware-Falle [[G42]].
**Quellen:** `server/routes/sessions.ts`, `src/pages/MeineAnfragePage.tsx`, `src/api/client.ts` (diggai-anamnese, Commit 39ef479)

---

## W24 — Querschnitts-Concern (E2E-Verschluesselung) an der Transport-/API-Client-Grenze isolieren — UI bleibt unberuehrt

**Erstmals beobachtet:** 2026-06-23 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** WHAT_WORKED · Tags: `architecture`, `separation-of-concerns`, `encryption`, `transport-layer`, `refactor`, `regression-avoidance`

**Was funktioniert:** Beim Nachruesten von E2E-/Transport-Verschluesselung die gesamte Krypto im API-Client/Transport-Layer kapseln: Komponenten produzieren/konsumieren weiter KLARTEXT, der Client puffert lokal und verschluesselt erst beim Absenden. Bereits getestete Screens/Flows bleiben unveraendert -> keine UX-Regression, minimale Review-Flaeche, ein zuvor abgenommener Flow muss nicht neu abgenommen werden. „Nur-Transport"-Schnitt: der Server sieht nur Chiffrat, die UI sieht nur Klartext, die Grenze dazwischen ist die einzige Stelle mit Krypto.
**Fix/Umsetzung:** Ver-/Entschluesseln ausschliesslich im zentralen `client.ts`/Transport-Modul; Komponenten-Props/State bleiben Klartext-Typen. Vermeidet, Krypto durch jede Komponente zu faedeln (fehleranfaellig, schwer testbar). Siehe auch [[W25]] (gleiche Runde: bestehende Komponente generalisieren statt neu bauen).
**Quellen:** `src/api/client.ts`, `src/components/v2/ZkServiceRoute.tsx`, `src/services/signatureService.ts` (diggai-anamnese, Commit daefc27)


---

## W25 — Bewaehrte mehrstufige Komponente generalisieren/parametrisieren statt durch ein schlichteres Bespoke-Formular ersetzen

**Erstmals beobachtet:** 2026-06-23 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** WHAT_WORKED · Tags: `refactor`, `component-reuse`, `ux-consistency`, `regression-avoidance`, `dry`

**Was funktioniert:** Mehrere Dienste waren auf ein „schlichtes Formular" abgeflacht worden und mussten zurueck auf den bewaehrten mehrstufigen Flow. Die saubere Loesung: die EINE getestete Flow-Komponente parametrisieren (hier per `serviceReason`/Titel/Typ) und fuer alle Dienste wiederverwenden — statt eine parallele, simplere Variante zu pflegen. Ergebnis: identische UX ueber alle Dienste, ein einziger Test-/Wartungspfad, keine Regression durch divergierende Zweit-Implementierung.
**Fix/Umsetzung:** Wenn der Reflex „das ist doch nur ein einfaches Formular" aufkommt: pruefen, ob eine bereits erprobte Komponente per Props den Fall abdeckt. Generalisieren (1 Komponente, N Konfigurationen) schlaegt Forken (N Komponenten) bei UX-Paritaet und Wartung. Siehe auch [[W24]].
**Quellen:** `src/components/v2/ZkAnamneseFlow.tsx` (diggai-anamnese, Commit 74c4d60)

---

## W26 — E2E/Zero-Knowledge: portablen Offline-Selbst-Entschluesseler ausliefern (Daten nicht an die eigene App/Server koppeln)

**Erstmals beobachtet:** 2026-06-20 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** WHAT_WORKED · Tags: `e2e`, `zero-knowledge`, `data-portability`, `offline`, `lock-in`, `ux`

**Was funktioniert:** In einem Zero-Knowledge-/E2E-Produkt einen eigenstaendigen Offline-Entschluesseler plus eine selbst-entschluesselbare versiegelte Kopie ausliefern: der Nutzer (oder ein Dritter, dem er den Schluessel gibt) kann die Daten OHNE die eigene App und OHNE Server lesen, offline, portabel. Das verhindert Vendor-Lock-in, ueberlebt einen Infra-Ausfall und untermauert das Versprechen „wir koennen es nicht lesen — du immer".
**Fix/Umsetzung:** Eine schlanke Decrypt-Viewer-Seite, die nur den Schluessel + das Chiffrat braucht und clientseitig entschluesselt (kein Backend-Call). Versiegelte Kopie als herunterladbares, in sich geschlossenes Artefakt. Wichtig: der Viewer darf keine App-/Server-Abhaengigkeit haben, sonst ist die Portabilitaet nur scheinbar.
**Quellen:** `src/lib/patientSelfRecord.ts`, `src/pages/PatientDecryptPage.tsx` (diggai-anamnese, Commit f809a1e)
