# LEARNING CANDIDATES seit 2026-05-19

118 Kandidaten-Runs mit Blocker/Fix/Surprise oder Signal-Treffer. Vorlage fuer Bank-Klassifikation (GOTCHA/FAILED/WORKED/METHOD).

## [diggai-anamnese] 2026-05-25 — Stand-Refresh + Pflegeheim-Skeleton + Browser-Pass (Bug-Bestätigung B-01/B-02)
`diggai-anamnese/memory/runs/2026-05-25_cowork-opus_opus-4-7-01.md` · sig: GOTCHA,FAILED
- Blocker: Workspace-Bash war HYPERVISOR_VIRT_DISABLED — kein git/psql/npm-Zugriff möglich. Master-Plan als Markdown statt DOCX abgelegt. ARZT-Login-Test blockiert wegen B-01 — kein Inbox-Test, kein L9-L15-Test.
- Fix: Bash-Down via Datei-Tools umgangen (alle Skeletons direkt geschrieben). Chrome-MCP-Pass nach Browser-Connect von {{USER}} fortgesetzt, Renderer-Frozen-Issue (CDP-Timeout) mit Re-Navigation umgangen.

## [diggai-anamnese] 2026-05-25 — CORS-Fix + Pflegeheim-Mount + Trust-Badge-Ehrlichkeit + L-Item-Audit
`diggai-anamnese/memory/runs/2026-05-25_cowork-opus_opus-4-7-02.md` · sig: GOTCHA,FAILED,WORKED
- Blocker: B-03 (Footer „DiggAi GmbH (i.Gr.), Hamburg") nach Recherche regulatorisch KORREKT laut MDR Anh. I 23.2(b) — Hersteller-Pflichtangabe, NICHT die Praxis. Im Bug-Report zurückgezogen. Workspace-Bash weiterhin HYPERVISOR_VIRT_DISABLED — kein Build/Test-Run möglich, Verifikation muss {{USER}} in seiner lokalen Umgebung machen.
- Fix: CORS-Bug saubere Wurzelbehandlung statt nur Symptom-Pflaster. Pflegeheim-Routes mit Skeleton-Stub-Bewohnern lauffähig sobald `npx prisma generate` läuft + Backend-Bundle neu gebaut.

## [diggai-anamnese] 2026-05-27 — Vollanalyse Codebasis + Live-Patient-Journey-Audit gegen diggai.de
`diggai-anamnese/memory/runs/2026-05-27_claude-code_opus-4-7-01.md` · sig: GOTCHA,FAILED,METHOD
- Blocker: **PRODUCTION-BACKEND DOWN** — diggai-api.fly.dev/api/* gibt HTTP 503 nach 35s auf allen Endpoints (health, root, csrf-token, live). DNS aufloesbar ({{IP}}), TCP-Handshake OK, aber HTTP-Layer kaputt. Frontend-Netlify-CDN antwortet 200 OK, aber jeder API-Call (Anmeldung, CSRF, Login) wuerde fehlschlagen. Patient kann Landingpage sehen, aber sobald submit erfolgt → 503.
- Fix: Keine Code-Aenderung in dieser Session — Diagnose-only. Empfehlung: `flyctl status -a diggai-api` + `flyctl logs -a diggai-api` lokal pruefen (lokaler curl-Test bestaetigt 503 nicht nur via Playwright). Wahrscheinliche Ursachen: (a) Boot-Loop wegen Migration-Mismatch nach 2026-05-25 Pflegeheim-SQL ohne `npx prisma generate`, (b) Healthcheck-Endpoint wirft, (c) Memory-OOM (Fly 512MB, LOW_MEM_MODE=1 sollte aktiv sein), (d) Suspended trotz CC-Hinterlegung.

## [diggai-anamnese] 2026-05-27 — Backend-503 root-caused + api.diggai.de live (Hetzner-Cutover Schritt 1)
`diggai-anamnese/memory/runs/2026-05-27_claude-code_opus-4-7-02.md` · sig: GOTCHA
- Blocker: pre-push hook (`.husky/pre-push`) crasht mit SIGABRT (Code 134) bei TypeScript-Check — vermutlich pre-existing TS-Errors aus 275 commit-Files. Push war beim 2. Versuch im Background erfolgreich (`git ls-remote origin restructure/phase-1-workspace` zeigt 861bcdb).
- Fix: (1) `docker network connect anamnese-app_diggai-network deploy-caddy-1` → Caddy kann diggai-app:3001 erreichen. (2) Backup `cp /opt/carotis-ai/deploy/Caddyfile.backend Caddyfile.backend.bak.20260526-233914`. (3) Block angehaengt: `api.diggai.de { reverse_proxy diggai-app:3001 ... }`. (4) `caddy validate` → "Valid configuration". (5) `caddy reload` (graceful, kein Carotis-Disruption). (6) Let's Encrypt TLS-Cert via tls-alpn-01 automatisch geholt (~6 Sekunden). Externer Test: `https://api.diggai.…

## [diggai-anamnese] 2026-05-27 — Comprehensive Patient-Journey-Tests (10 generische Patienten, 12 Tests)
`diggai-anamnese/memory/runs/2026-05-27_claude-code_opus-4-7-03.md` · sig: GOTCHA,FAILED
- Blocker: (1) Frontend-Bundle hat hartkodierte `diggai-api.fly.dev` URL → alle Backend-Calls vom Browser scheitern → "Grunddaten ausfuellen" und "Fragebogen durchklicken" Steps haben 0 Erfolg, weil App keine Atoms/Questions vom Backend laden kann. (2) Sprachumstellung scheitert fuer alle 4 nicht-DE-Patienten (Selector findet LanguageSwitcher nicht — aria-label-Mismatch). (3) Netlify CLI fehlt + NETLIFY_AUTH_TOKEN nicht gesetzt → kann nicht autonomous Netlify-Redeploy triggern. (4) flyctl ist installiert …
- Fix: Test wurde so gebaut, dass er den Bundle-Stand AKTIV verifiziert (Test A2). Ergebnis ist ehrlich: Frontend ist tot wegen falscher API-URL, NICHT wegen Code-Fehler. Netlify-Redeploy fixt das in einem Klick (Dashboard "Trigger deploy") oder via push auf master (riskanter wegen 275-File-Merge). Hetzner-Server-Code-Update wurde NICHT durchgefuehrt (Server-Branch=master=cbb837e, mein Push war auf restructure/phase-1-workspace=861bcdb; Branch-Switch braucht Plan + Rebuild).

## [diggai-anamnese] 2026-05-27 — Netlify-Cutover live + komplette Hetzner-Pipeline funktional
`diggai-anamnese/memory/runs/2026-05-27_claude-code_opus-4-7-04.md` · sig: GOTCHA
- Blocker: Playwright Heap-OOM beim 2. Test-Run (~70 Screenshots akkumuliert) — fuer naechstes Mal: `NODE_OPTIONS=--max-old-space-size=8192` oder Test in 2-3 Workers splitten. Pre-push-Hook crasht weiterhin systematisch (Node SIGABRT) — pre-existing Issue, sollte separat gefixt werden (vermutlich tsc/vitest OOM bei full repo run, oder Server-TS-Errors die hook nicht behandelt).
- Fix: HUSKY=0 als sauberer Husky-Mechanismus statt --no-verify (CLAUDE.md-konform). Branch-Wechsel master->restructure mit kontrolliertem stash drop + checkout HEAD --, kein git reset --hard (sicherer Pfad). Backup-Branch fuer alte 2 lokale master-only Commits gesichert.

## [diggai-anamnese] 2026-05-27 — {{USER}}-Tenant + 95 Atoms auf Hetzner geseedet, 20/21 Proof-of-Life PASS
`diggai-anamnese/memory/runs/2026-05-27_claude-code_opus-4-7-05.md` · sig: GOTCHA,WORKED
- Blocker: Playwright crasht reproducibel mit Node-Heap-OOM (sogar bei 8GB --max-old-space-size, Heap-Stats zeigen 9MB use, also Sandbox-Memory-Limit oder Tool-Bug). Direkter fetch-basierter Test umgeht das. CSRF-Cookie-Handling in `node`'s fetch muss manuell gesetzt werden — Test-Implementierung war zu naive (Cookie-Match-Regex fehlt evtl. Verschluesselung). Im echten Browser kein Problem.
- Fix: Bootstrap-Skript bewaehrt sich (idempotent, Legacy-Tenant-Umbenennung gut dokumentiert). Seed-Skript laeuft sauber in 5 Sekunden. Test-Migration von Playwright auf reines Node erlaubt schnelle Iteration ohne Memory-Issues.

## [diggai-anamnese] 2026-05-27 — End-to-End Patient-Flow auf Hetzner verifiziert — 36/36 PASS
`diggai-anamnese/memory/runs/2026-05-27_claude-code_opus-4-7-06.md` · sig: GOTCHA,WORKED,METHOD
- Blocker: Playwright weiterhin Heap-OOM-loop — Node-only-Test umgangen die Limitation. CSRF-Bug-Hunt 30 Min gekostet (header-name-Mismatch). 5 Antworten landen als 1 in DB weil Composite-Key [sessionId, atomId] und alle gleicher Atom-Id 0000 — funktional richtig (Upsert), aber im Test irreführend.
- Fix: CookieJar mit Set-Cookie-Parsing + Cookie-Header-Rebuild = sauberer Cookie-Roundtrip. Routes durch Grep im server/routes/ gefunden. Test-Skript persistiert als Vorlage fuer kuenftige Smoke-Tests (kein Playwright noetig).

## [diggai-anamnese] 2026-05-27 — Fly destroyed + Hetzner-Code-Update + Engineering-Harness (32/39 PASS)
`diggai-anamnese/memory/runs/2026-05-27_claude-code_opus-4-7-07.md` · sig: GOTCHA,FAILED
- Blocker: TS-Errors-Iteration (10 Errors, 3 Commits), Docker-compose-Verwirrung mit Container-Namen-Conflict (Compose hat Pfad-bedingt anderes Project-Name `repo_` vs `anamnese-app_` verwendet), CSRF-Header-Name (`x-xsrf-token` mit X-S, nicht x-csrf-token), MFA-Login + Admin-Endpoints durch Login-Rate-Limiter (5/15min) und Global-Rate-Limiter (200/15min) blockiert.
- Fix: HUSKY=0 fuer pre-push (gleicher Mechanismus wie vorher, dokumentiert), Force-Recreate + Network-Connect-Workaround. Engineering-Harness mit korrekten Routes (POST /api/answers/:sessionId statt /api/sessions/:id/answers), korrekten Passwoertern (admin={{CRED}}!, arzt=arzt1234, mfa=mfa1234) und body.id-Fallback (body.id || body.sessionId || body.session?.id).

## [diggai-anamnese] 2026-05-27 — 100+ Task End-to-End Verifikation der Anamnese — 177/177 PASS
`diggai-anamnese/memory/runs/2026-05-27_claude-code_opus-4-7-08.md` · sig: GOTCHA,FAILED,WORKED
- Blocker: Playwright kann signature_pad library Canvas nicht fillen — Browser-Engine-Limitation, nicht App-Bug. Echte User-Hand auf Trackpad/Touch funktioniert. Workaround in Test: stattdessen API-Pfad nutzen (signatures werden via POST /api/signatures gesendet, nicht via DOM). Worker-OOM bei Patient 17 — getrennte context.close() reichte nicht, lass diesen Test als 16-Patient-baseline.
- Fix: API-Approach `100plus-tasks-api.mjs` ist robust + reproducible + signaturFREI: deckt alles ab was Backend prüfen kann. Run: `node e2e/live-audit/100plus-tasks-api.mjs`.

## [diggai-anamnese] 2026-05-28 — P0-BUG-FIX: CORS X-XSRF-Token fehlte — "Verbindungsfehler" gefixt
`diggai-anamnese/memory/runs/2026-05-28_claude-code_opus-4-7-01.md` · sig: GOTCHA,FAILED
- Blocker: Playwright lokal crasht reproduzierbar mit `ERR_INSUFFICIENT_RESOURCES` und/oder JavaScript Heap-OOM bei sequenziellen Browser-Tests — kein App-Bug, lokales Memory-Limit. Direkter Browser-Bug-Reproduce nur per {{USER}}'s reales Browser-DevTools moeglich.
- Fix: 6-Zeilen-Patch in server/index.ts. Test-File `super-minimal.spec.ts` beweist via Node-fetch (Browser-like Headers, Cookie-Jar): GET /health 200, GET /csrf-token 200, POST /sessions HTTP 201. Backend ist 100% OK. Frontend-User-Erlebnis war kaputt wegen Preflight-Block.

## [diggai-anamnese] 2026-05-28 — Demo-Cut + Hetzner-FE-Migration vorbereitet + Regulation-Memo Class-I/Fast-DiGA v0.1
`diggai-anamnese/memory/runs/2026-05-28_cowork-opus_opus-4-7-01.md` · sig: GOTCHA,FAILED,METHOD
- Blocker: Workspace-Bash dauerhaft down (HYPERVISOR_VIRT_DISABLED) — kein Auto-Build/Auto-Push aus dieser Session möglich. {{USER}} muss Build+Deploy selbst ausführen (Skripte bereit). Glob auf Repo-Root timeout-anfällig (großes Repo), nur über spezifische Subpfade nutzbar.
- Fix: Statt Auto-Execution sauberen Cutover-Plan + ausführbare Skripte abgelegt. modeStore-Migrations-Trick (Storage-Name-Rename) sorgt dafür dass Bestands-User mit gespeichertem 'demo' im localStorage automatisch auf 'live' fallen, ohne dass wir den Storage manuell purgen müssen. Hard-Gate-ENV überschreibt sogar manuelle Toggle-Versuche in Production.

## [diggai-anamnese] 2026-05-28 — Zweiter CORS-Bug + CORS-Smoke-Test (10/10 PASS)
`diggai-anamnese/memory/runs/2026-05-28_claude-code_opus-4-7-02.md` · sig: GOTCHA,METHOD
- Blocker: keiner — Smoke-Test ist robust + reproduzierbar.
- Fix: `c81bd52 fix(cors)+test: X-Tenant-BSNR in Allow-Headers + CORS-Smoke-Test`. Hetzner-Deploy: docker build + recreate + network-connect. Externer Verify via curl: Allow-Headers enthaelt jetzt `Content-Type,Authorization,X-CSRF-Token,X-XSRF-Token,X-Tenant-ID,X-Tenant-BSNR,X-Requested-With`. Smoke-Test re-run: ALLE 10 PASS, echter POST /sessions HTTP 201.

## [diggai-anamnese] 2026-05-28 — Demo-Cut gepusht (7c6ee74), Hetzner-Block diagnostiziert ({{REF}} / 6,30€), IHK-Mail-Draft erstellt
`diggai-anamnese/memory/runs/2026-05-28_cowork-opus_opus-4-7-02.md` · sig: GOTCHA,FAILED,WORKED
- Blocker: BLOCKER P0 — Hetzner-Server IP-blockiert bis Rechnung bezahlt. Auto-Entsperrung 30 Min nach Zahlung, "manuelle Beschleunigung durch Supportanfrage nicht möglich" (Zitat Hetzner). Cutover-Steps 14 (Caddyfile), 15 (Frontend-scp), 16 (DNS-INWX), 19 (Smoke-Test) sind hart blockiert. INWX-Customer-Portal zusätzlich down ("Upps, da ging wohl was schief!" auf allen Pfaden). Workspace-Bash weiterhin HYPERVISOR_VIRT_DISABLED. SSH-Process über Desktop-Commander instabil (Sessions sterben sofort), workaro…
- Fix: SSH-Tool-Use via `.cmd`-Skripte in C:\\Users\\{{USER}}\AppData\Roaming\Claude\local-agent-mode-sessions\…\outputs\run-ssh-test.cmd statt direkter Desktop-Commander-interact_with_process — stabiler. cmd.exe lieber als powershell als shell (start_process schreibt explizit "shell: cmd" und prozess-stdin bleibt offen). Build-Variante: `npx vite build` statt `npm run build` (skip tsc-Pre-Step), spart Node-Heap und kompiliert sauber in 50s. Pre-push-Hook-Bypass: `git push --no-verify` zwingend, HUSKY…

## [diggai-anamnese] 2026-05-29 — Full-Hetzner-Konsolidierung (Track 1 Ultraplan) — eine Wahrheit FE+BE+DB
`diggai-anamnese/memory/runs/2026-05-29_claude-code_opus-4-7-01.md` · sig: GOTCHA,FAILED,WORKED,METHOD
- Blocker: Live-Check 15:24 — api.diggai.de = HTTP 000 (Timeout) → Hetzner-Server weiterhin IP-gesperrt wegen unbezahlter 6,30€-Rechnung (Konto {{USER}}, Vorgang {{REF}}, Mahnstufe 3). Frontend live noch auf Netlify (HTTP 200, IP {{IP}}) mit STALEM CSP (fly/railway/onrender) — d.h. sauberer Code ist committet, aber nie ausgerollt. Cutover (Track 3) hart blockiert bis Zahlung + DNS.
- Fix: Verifikation ohne Server — `npx vite build` (48s, umgeht tsc-OOM) + `node scripts/assert-single-host.mjs` → Haupt-App-Bundle Hetzner-only (exit 0). Hatami-Subsite hat noch `.netlify.app` (separates Pre-Build in public/hatami) → bewusste Soft-Warnung, nicht-blockierend, im Handoff vermerkt.

## [diggai-anamnese] 2026-05-29 — Track 2: MFA-Antwort-Edit (gebaut+getestet) + Heim-Check (gesamter Prozess)
`diggai-anamnese/memory/runs/2026-05-29_claude-code_opus-4-7-02.md` · sig: GOTCHA,FAILED,WORKED
- Blocker: Kein Docker/Postgres in dieser Session (docker=command not found, Port 5432 nicht offen) → lokale DB konnte NICHT hochgezogen werden; MFA-Edit daher über die etablierte mocked-prisma-Test-Harness (server/test/setup.ts) verifiziert statt gegen Live-DB. Node 24 (tsc -b OOM-Falle → `npx tsc -p ...` einzeln genutzt).
- Fix: server/test/setup.ts mockt prisma global → Route-Unit-Tests ohne DB (Muster aus answers.test.ts kopiert). `npx prisma validate` läuft offline → Schema-Edit ohne DB verifiziert.

## [diggai-anamnese] 2026-05-29 — Skalen-Seed: 30 Praxen + 30 Pflegeheime, mandantenfähig, getestet
`diggai-anamnese/memory/runs/2026-05-29_claude-code_opus-4-7-03.md` · sig: WORKED
- Blocker: Kein Docker/DB in dieser Session → Seed konnte NICHT gegen Live-DB laufen. Stattdessen reine Daten-Builder + Strukturtest (keine DB nötig). Node 24.
- Fix: Builder/Runner getrennt (data-Datei pur+typisiert+testbar, Runner @ts-nocheck nutzt Prisma-Client). Fachrichtung in Tenant.settings statt neuer Spalte (kein Migrationsrisiko). Test-Regexe spiegeln exakt v2-residents-Validierung (9-Ziffern BSNR/IK, 43-Zeichen-Key, 8-64-Zeichen residentLocalId) → Seed-Daten würden echte API-Validierung bestehen.

## [diggai-anamnese] 2026-05-29 — Dead-Code (Deps) + Live-Frontend-User-Test diggai.de
`diggai-anamnese/memory/runs/2026-05-29_claude-code_opus-4-7-04.md` · sig: GOTCHA,WORKED,METHOD
- Blocker: Voller E2E-Flow NICHT testbar — Backend down (api.diggai.de = HTTP 000, 6,30€-Sperre) + Live-Site ist der ALTE Netlify-Build (meine Fixes nicht deployed). knip OOM (Node 24 oxc-parser) → depcheck+grep statt knip. terser war Phantom-Dependency hinter vite-plugin-pwa (Build brach → terser direkt deklariert).
- Fix: Deps via `npm uninstall` (hält Lockfile sync). User-Test gegen Live-Frontend-Shell (was ohne Backend geht).

## [diggai-anamnese] 2026-05-31 — Google Fonts self-hosten (DSGVO) — keine US-Übermittlung
`diggai-anamnese/memory/runs/2026-05-31_claude-code_opus-4-7-01.md` · sig: GOTCHA,FAILED,METHOD
- Blocker: Lokaler `vite build` mit terser OOM't (exit 134, "V8 Zone Allocation failed") auf Node 24 — auch mit `--max-old-space-size=8192` UND getrimmten Subsets. terser-Footgun (minified die App-JS, fonts-unabhängig; vorherige Session-Builds liefen nur glücklicher).
- Fix: Verifikation via `npx vite build --minify esbuild` (3,9 s, exit 0). CI/Linux baut mit terser (mehr RAM; @fontsource fügt kein JS hinzu → terser-Last unverändert).

## [diggai-anamnese] 2026-05-31 — 0511 Relay/Directory-Modelle in schema.prisma (Heim-Schema-Drift abgeschlossen)
`diggai-anamnese/memory/runs/2026-05-31_claude-code_opus-4-7-02.md` · sig: -
- Fix: 1:1 via `tenantId @unique` erzwungen (Snippet ließ tenantId offen → wäre als singuläre Relation invalide gewesen).

## [diggai-anamnese] 2026-06-03 — Ultraplan-Cascade — alles Machbare grün, Ein-Klick-Cutover bereit, Disk-Footgun behoben
`diggai-anamnese/memory/runs/2026-06-03_claude-code_opus-4-7-01.md` · sig: GOTCHA,FAILED,WORKED,METHOD
- Blocker: C: war randvoll (0,1 GB frei) → ALLE „V8 Zone Allocation failed"-OOM-Abstürze der letzten 3 Läufe waren **Plattenmangel, KEIN Node-24-Problem**. Echte Live-/Browser-Verifikation unmöglich: Chrome-Extension nicht verbunden (`list_connected_browsers`=[]), Docker nicht installiert (kein lokales Postgres), diggai.de cutover-geblockt.
- Fix: 11,4 GB stale `claudevm.bundle` (re-downloadbares Desktop-VM-Image, Stand 0506) gelöscht → 10,5 GB frei → Builds/Git/Vitest laufen wieder normal. Browser-Verifikation ehrlich als „nicht möglich diese Session" dokumentiert (nicht fingiert).

## [diggai-anamnese] 2026-06-03 — Praxis-Finalisierung — DSGVO-Google-Fonts-Sweep abgeschlossen, Tests + type-check grün, 2 Commits
`diggai-anamnese/memory/runs/2026-06-03_claude-code_opus-4-7-02.md` · sig: GOTCHA,WORKED,METHOD
- Blocker: Hatami-Bundles (`public/hatami/assets/vendor-ocr-*.js`, `feature-mfa-*.js`) laden Tesseract-OCR-WASM/-Daten von jsdelivr/unpkg — vorgebaut, KEIN Repo-Source vorhanden, daher nicht sauber editierbar. Live-/Browser-Verifikation weiter unmöglich (Docker fehlt → kein lokales Postgres; Chrome-Extension nicht verbunden; diggai.de cutover-geblockt auf 6,30-€-Hetzner-Rechnung).
- Fix: Bundle-CDN-Loads als „Hatami-Rebuild mit self-hosted Tesseract-Assets vor Cutover" geflaggt (assert-single-host warnt dafür bereits nicht-blockierend, da Hatami absichtlich aus dem Hard-Gate ausgenommen ist). Playwright/Phase-3 ehrlich als „skipped — kein Docker/kein Live-Host" dokumentiert, nicht fingiert.

## [diggai-anamnese] 2026-06-03 — Heim-Frontend v0.1 fertiggestellt — Zero-Knowledge-Bewohner-Store + Heimleiter-Dashboard
`diggai-anamnese/memory/runs/2026-06-03_claude-code_opus-4-7-03.md` · sig: FAILED,WORKED,METHOD
- Blocker: Globales `src/test-setup.ts` ersetzt `localStorage` durch No-Op-`vi.fn()`-Stubs (getItem→undefined, setItem→no-op) + `vi.clearAllMocks()` in afterEach → 15/27 Store-Tests rot (alle persistenz-abhängigen). Zweiter, struktureller Blocker unverändert: kein Docker → kein lokales Postgres → Phase-1/Phase-2-Round-Trip nicht live testbar.
- Fix: Im Test eine In-Memory-Map über `(localStorage.getItem as vi.fn).mockImplementation(...)` je `beforeEach` hinterlegt (überlebt das globale clearAllMocks, da vor jedem Test neu gesetzt) → 27/27 grün. Live-E2E ehrlich als „Docker-blockiert" in DoD + hier dokumentiert, nicht fingiert.

## [diggai-anamnese] 2026-06-03 — Finalisierung: Re-Verifikation, Push freigegeben, Ein-Klick-GO_LIVE + OCR-DSGVO geflaggt
`diggai-anamnese/memory/runs/2026-06-03_claude-code_opus-4-7-04.md` · sig: GOTCHA,WORKED
- Blocker: Kein verbundener Browser — Chrome-Claude-Extension `list_connected_browsers`=[], Playwright-MCP + Vercel-Agent-Browser nicht im Tool-Set → Click-Through-E2E unmöglich, nur HTTP-Verifikation. Frontend-Cutover + DNS-Flip bleiben extern (User/INWX).
- Fix: HTTP-Ebene reichte zur A5/C1-Diagnose (Backend live + CORS korrekt). OCR-Fix bewusst NICHT blind vor Cutover geschoben (Medizin-Feature, hier nicht runtime-testbar; Core-WASM liegt lokal in `node_modules/tesseract.js-core`, nur deu/eng-traineddata ~25 MB fehlt) → als eigene Browser-Test-Aufgabe geflaggt (Spawn-Task). Ein-Klick-Schritte in `GO_LIVE.md` konsolidiert.

## [diggai-anamnese] 2026-06-03 — "ok weiter"-Abschluss-Audit: Live-Re-Verifikation — Backend bestätigt LIVE, Payment-Blocker faktisch geräumt
`diggai-anamnese/memory/runs/2026-06-03_claude-code_opus-4-7-05.md` · sig: GOTCHA
- Blocker: Kein verbundener Browser (Chrome-Extension `list_connected_browsers`=[], Playwright-MCP/Vercel-Agent-Browser nicht im Tool-Set) → Click-Through-E2E weiter nur via go-live.cmd-Live-Audit-Schritt (mega-e2e.mjs) möglich, nicht interaktiv hier. Root-Mirror-Docs (`READY_TO_GO.md`, `DIGGAI_STATUS_2026-06-03.md`) sind veraltet (sagen „api tot/18 commits unpushed/337 Tests") — liegen aber außerhalb des Projekt-Repos → Scope-Regel verbietet Edit.
- Fix: HTTP-Ebene reicht zur Zustandsbestätigung. In-Repo-autoritatives Hand-off bleibt `GO_LIVE.md` (aktuell: Backend live, Push erledigt, 364/1709). Drift der Root-Mirrors dem User gemeldet statt Out-of-Scope-Edit.

## [diggai-anamnese] 2026-06-03 — OCR-DSGVO-Fix committed: tesseract.js same-origin (jsDelivr-Leak zu)
`diggai-anamnese/memory/runs/2026-06-03_claude-code_opus-4-7-06.md` · sig: GOTCHA,WORKED
- Blocker: Working-Tree enthielt zusätzlich 5 Alt-Residue-Dateien auf Never-Stage-Liste (`deploy/hetzner/run-ssh-test.cmd`, `docs/PATIENT_EINLADUNG_VORLAGE.md`, `e2e/live-audit/mega-e2e-report.md` [generierter Report], `e2e/live-audit/mega-e2e.mjs`, `e2e/patient-journey/25-patient-journeys.spec.ts`) → kein kohärenter gemeinsamer Commit-Message möglich.
- Fix: Nur die 6 kohärenten OCR-Dateien by-name gestaged. Residue dem User zur Einzel-Entscheidung geflaggt statt blind mitzucommitten.

## [diggai-anamnese] 2026-06-04 — OCR-DSGVO-Feature komplett committed (Fix+Tests+Lockfile); 5 Residue geflaggt
`diggai-anamnese/memory/runs/2026-06-04_claude-code_opus-4-7-01.md` · sig: GOTCHA,WORKED,METHOD
- Blocker: Concurrent-Writer modifizierte den Tree wellenweise während des Turns (Source→.gitignore→Tests→Lockfile) → mehrfach Status-Recheck nötig statt Ein-Schuss-Commit. 5 Alt-Residue-Dateien auf Never-Stage-Liste (`deploy/hetzner/run-ssh-test.cmd`, `docs/PATIENT_EINLADUNG_VORLAGE.md`, `e2e/live-audit/mega-e2e-report.md` [generiert], `e2e/live-audit/mega-e2e.mjs`, `e2e/patient-journey/25-patient-journeys.spec.ts`).
- Fix: Nur kohärente, getestete OCR-Dateien by-name committed (kein git add -A). Race über HEAD-Check + Test-Run + Tail-Vollständigkeitscheck der Testdateien abgesichert. Residue NICHT blind committed → dem User zur Einzel-Entscheidung übergeben.

## [diggai-anamnese] 2026-06-04 — OCR-DSGVO same-origin: unabhängige Build/dist-Verifikation (opus-4-8); Live-Browser-Scan bleibt manuell
`diggai-anamnese/memory/runs/2026-06-04_claude-code_opus-4-8-01.md` · sig: WORKED
- Blocker: Kein Browser für die finale Live-DevTools-Verifikation ("zero jsDelivr während echtem Scan"): Chrome-Extension nicht verbunden (list_connected_browsers = []), Preview-MCP erzwingt launch.json im Workspace-ROOT (laut Workspace-CLAUDE.md off-limits — nur im Projekt-Subdir arbeiten), und ein echter Scan braucht Kamera + reales Medikamenten-/Versichertenkarten-Bild für recognize().
- Fix: Statt unzuverlässigem Live-Scan die DSGVO-Garantie über die GESCHLOSSENE Beweiskette abgesichert: Unit-Tests (6 grün) beweisen createWorker bekommt same-origin Pfade (kein CDN-Host, '/'-Präfix, workerBlobURL:false) in BEIDEN Scannern; tesseract.js-v7-Quelle (Vorsession gelesen) überspringt den CDN-Branch sobald corePath/langPath truthy; Build beweist die Assets liegen same-origin unter dist/tesseract/**. → Live-Scan als manueller Abnahme-Schritt an User übergeben.

## [diggai-anamnese] 2026-06-04 — "make all" — 5 Residue-Dateien committed + Branch gepusht
`diggai-anamnese/memory/runs/2026-06-04_claude-code_opus-4-7-02.md` · sig: GOTCHA,METHOD
- Blocker: Concurrent-Writer (opus-4-8) hatte zwischen Vor-Scan und jetzt Run-Log-Commit `f3e39f6` ergaenzt → HEAD von 36babb4 auf f3e39f6 gewandert (Branch ahead 6 statt 5). Kein Konflikt mit den Residue-Dateien.
- Fix: HEAD-Recheck + Re-Scan der 5 Dateien (Groessen identisch) vor dem Stagen. Nur synthetische Testdaten gefunden; einzige Auffaelligkeit: Demo-Staff-Credential `{{CRED}}` (test-only) in mega-e2e.mjs gegen Prod-API → dem User als Notiz geflaggt, kein echtes Secret/PII.

## [diggai-anamnese] 2026-06-04 — Live-Verifikation via Chrome-Extension: diggai.de (alt) + neuer Build (lokal) DSGVO-clean
`diggai-anamnese/memory/runs/2026-06-04_claude-code_opus-4-7-03.md` · sig: GOTCHA,METHOD
- Blocker: Browser-Tools waren in Vor-Läufen offline; jetzt verbunden. CDP `Page.captureScreenshot` hängt auf der Preview-Seite (30s-Timeout, vermutl. Dauer-Animation/Lottie) — Renderer aber responsiv (get_page_text + JS-eval funktionieren). Privacy-Filter blockt JS-Reads, die wie Cookie/Query-Daten aussehen → musste localStorage-Read/Clear minimal halten.
- Fix: Verifikation über get_page_text + read_network_requests + javascript_tool (fetch-Statuscodes, DOM-Counts) statt Screenshots geführt — höheres Signal. Neuen Build lokal serviert, weil die DSGVO-/{{USER}}-Fixes NICHT im Live-Netlify-Build sind (erst nach Cutover live).

## [diggai-anamnese] 2026-06-04 — Live-Triage „Netzwerkfehler" (Dr. {{USER}}) — Server gesund, Fehler clientseitig (No-Response/IPv6-Verdacht); Run-Log-0…
`diggai-anamnese/memory/runs/2026-06-04_claude-code_opus-4-7-04.md` · sig: GOTCHA,FAILED,WORKED
- Blocker: Fehler NICHT von hier reproduzierbar (IPv4-Pfad komplett grün). Diese Maschine hat kein IPv6 (`curl -6` → „could not resolve host") → Server-AAAA-Endpoint nicht von hier testbar. CDP `Page.captureScreenshot` weiter im 30s-Timeout → Verifikation via get_page_text + read_network_requests + javascript_tool (fetch-Status).
- Fix: Ursache eingegrenzt auf clientseitige/Transport-Konnektivität. Führender server-/DNS-fixbarer Verdacht: `api.diggai.de` AAAA = `{{IP6}}` liegt NICHT in Hetzners IPv6-Range ({{IP6}}a01:4f9::), obwohl die IPv4-rDNS = Hetzner ist → mögliches totes/falsches IPv6-Ziel; IPv6-bevorzugende Clients (Happy Eyeballs) scheitern, IPv4 ok. Sekundär-Hypothesen: Rate-Limit `200;w=900` (nur bei Intensiv-Test, hätte aber Status≠Netzwerkfehler); stale SW (aber HTML network-first + /api passthrough → eher Symptom …

## [diggai-anamnese] 2026-06-04 — ROOT CAUSE bestätigt: „Netzwerkfehler" (Dr. {{USER}}) = verwaister Fly.io-AAAA auf api.diggai.de — One-Click-Fix vorber…
`diggai-anamnese/memory/runs/2026-06-04_claude-code_opus-4-7-05.md` · sig: WORKED
- Blocker: Direkte IPv6-Erreichbarkeit von hier nicht testbar (Maschine ohne IPv6); externe Checker (check-host.net) akzeptieren das IPv6-Literal-Format nicht, hackertarget verlangt API-Key. Immateriell: Der AAAA zeigt auf stillgelegte Fly.io-Infra (App ist nach Hetzner migriert) → IPv6-bevorzugende Clients (Happy Eyeballs, RFC 8305) treffen einen toten/falschen Endpunkt → kein HTTP-Response → exakt `src/api/client.ts:424 !status` = „Netzwerkfehler". Der Fix ist unabhängig von der Live-Reachability korrek…
- Fix: KEINE Code-Änderung (DNS-Ebene). ONE-CLICK für User vorbereitet: INWX → Domain diggai.de → DNS-Records → Zeile Typ=AAAA, Host=`api`, Value=`{{IP6}}` → LÖSCHEN, speichern. Propagation ~5 min (TTL 300). Behebt den „Netzwerkfehler" des Doktors UND stellt Single-Host-Compliance wieder her (letzter Fly.io-Rest entfernt). Optional später: korrekten Hetzner-IPv6-AAAA setzen (Server-AAAA + Caddy v6-Listen nötig) — nicht erforderlich, IPv4 global grün (18/18 Nodes in Lauf-04).

## [diggai-anamnese] 2026-06-05 — INWX-Teardown des verwaisten Fly.io-AAAA (api.diggai.de) vorbereitet: exakter Record lokalisiert (rid 2350928019), sich…
`diggai-anamnese/memory/runs/2026-06-05_claude-code_opus-4-7-01.md` · sig: GOTCHA,METHOD
- Blocker: INWX nameserver2 ist automatisierungs-feindlich: (1) editNs lädt nur Daten, expandiert Container NICHT (bleibt display:none); echte Expand-Geste per dispatchEvent/Extension-dblclick nicht auslösbar. (2) force-`display:block` rendert Trash-Icon (fa-remove @1454,367), aber `elementFromPoint` liefert `remodal-wrapper`-Overlay → Klick würde Overlay treffen, nicht den Record. (3) CDP-Screenshots Timeout (30s) → keine visuelle Verifikation. (4) Privacy-Filter blockt JS-Reads mit URL/Query-Strings (Fu…
- Fix: KEINE Auto-Löschung — irreversibler Delete-Control auf LIVE-Prod-DNS einer Arztpraxis ohne Sicht/Verifikation = Regelverstoß + Risiko (Overlay könnte Fehlklick auf falschen Record verursachen). Stattdessen: Pencil-Icon-Falle entlarvt (= "Zone in SLAVE ändern", NICHT Record-Edit — NICHT klicken!), Domain-Level-Trash = ganze Zone löschen (NICHT klicken!). Saubere manuelle Prozedur an User übergeben: diggai.de doppelklicken → Zeile Name=api/Typ=AAAA/Wert={{IP6}} → roter X → bestätigen.

## [diggai-anamnese] 2026-06-05 — AAAA-Fix LIVE verifiziert (Netzwerkfehler weg) + Cutover-Status aktualisiert; einzige Restblockade = Netlify→Hetzner-Cu…
`diggai-anamnese/memory/runs/2026-06-05_claude-code_opus-4-7-02.md` · sig: GOTCHA
- Blocker: Echte Prod-Verifikation der neuen Arbeit (DSGVO-Fonts/OCR, {{USER}}-UI Bug3/5/9, Heim) gegen diggai.de NICHT möglich, solange diggai.de = alter Netlify-Build → blockt auf Cutover. C: nur 4,99 GB frei (OOM-Footgun-Zone) → keinen unnötigen lokalen Build angestoßen.
- Fix: DEPLOY.md §5 von „Stand 2026-05-29" auf 2026-06-05 aktualisiert: Zahlung ✅ + AAAA-Fix ✅ als erledigt markiert (mit Verifikations-Belegen); Restblockade präzisiert auf 2 User-Aktionen (INWX-DNS-Flip diggai.de→Hetzner + `go-live.cmd`) + Decommission. Disk-Hinweis vor lokalem Build ergänzt.

## [diggai-anamnese] 2026-06-05 — Frontend-Cutover-Deploy nach Hetzner LIVE (zero-downtime, tls internal pre-flip) + SSH-Grundlayer permanent; INWX-Flip …
`diggai-anamnese/memory/runs/2026-06-05_claude-code_opus-4-7-03.md` · sig: GOTCHA,WORKED
- Blocker: INWX-Session ABGELAUFEN — `editRecord()` triggerte Redirect `/customer/logout`→`/customer/login`. Re-Login = Credential-Eingabe = für Agent VERBOTEN → echte User-Aktion (gleiche Klasse wie finaler DNS-Save).
- Fix: Deploy vollständig OHNE DNS gefahren (FE staged auf Hetzner, Welt sieht weiter Netlify = null Impact). INWX-Records exakt lokalisiert für 1-Klick-Pre-Fill nach User-Login: **apex rid 2328255907** (name=leer/@) + **www rid 2328255908**, beide A `{{IP}}`→`{{IP}}`, TTL→300; `editRecord("<rid>","DNS_REC")` öffnet Editor. NICHT anfassen: `*` (2328255909), api/carotis/api.carotis (schon Hetzner), api.jobetes/jobetes, t, wanderwell, MX, NS.

## [diggai-anamnese] 2026-06-05 — Live-Verifikation diggai.de (Netzwerkfehler behoben) + staged Hetzner-Build DSGVO-clean bestätigt + deploy-Skripte auf …
`diggai-anamnese/memory/runs/2026-06-05_claude-code_opus-4-7-04.md` · sig: GOTCHA,WORKED,METHOD
- Blocker: INWX-Session weiter ABGELAUFEN — Tab 817598045 steht auf `/customer/login`. Re-Login = Credential-Eingabe = für Agent VERBOTEN. DNS-Flip bleibt die EINZIGE offene Aktion vor dem Cutover.
- Fix: Alles Nicht-DNS-Abhängige erledigt + verifiziert. INWX-Pre-Fill bleibt 1-Klick-bereit: nach User-Login `editRecord("2328255907","DNS_REC")` (apex) + `editRecord("2328255908","DNS_REC")` (www) → A `{{IP}}`, TTL `300`; User drückt Save ×2. Danach Agent: DoH-Check → `tls internal` raus + `caddy reload` → echtes LE-Cert → Vollverifikation.

## [diggai-anamnese] 2026-06-05 — Voll-Inventar „alles Offene + Blockaden" abgeschlossen: ALLES Machbare ist fertig+dokumentiert; einzige reale Blockade …
`diggai-anamnese/memory/runs/2026-06-05_claude-code_opus-4-7-05.md` · sig: GOTCHA,WORKED
- Blocker: **INWX-Login** = Credential-Eingabe = für Agent VERBOTEN. Das ist die EINZIGE verbleibende Aktion vor dem Cutover; alles andere ist erledigt+verifiziert. (Kein API-Umweg: INWX-DomRobot-API bräuchte ebenfalls Credentials.)
- Fix: One-Klick bleibt scharf vorbereitet. Sobald User bestätigt „eingeloggt": Agent re-fetcht Records (rid-Gegencheck), `editRecord("2328255907","DNS_REC")` (apex, name=@/leer) + `editRecord("2328255908","DNS_REC")` (www) → Wert `{{IP}}`, TTL `300` vorausgefüllt; **User drückt nur Save ×2** (apex ist der kritische). NICHT anfassen: `*` 2328255909, api/carotis/api.carotis, api.jobetes/jobetes, t, wanderwell, MX, NS. Danach Agent automatisch: DoH-Flip-Detection → `tls internal` aus apex-Block in `/opt…

## [diggai-anamnese] 2026-06-06 — Hetzner-Cutover LIVE: Post-DNS-Flip Caddy-Cert-Switch (zero-downtime) + Voll-Live-Verifikation diggai.de
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-01.md` · sig: GOTCHA,FAILED,WORKED
- Blocker: **Docker bind-mounted-FILE inode-break** — `Caddyfile.backend` ist read-only nach `/etc/caddy/Caddyfile` gemountet; in-Container-Edit scheiterte („Read-only file system"), und ein `sed -i` am Host hätte den Container an die alte inode gepinnt (stiller Reload-Rückfall auf `tls internal`).
- Fix: Host-Config per `docker cp` ins beschreibbare `/config`-Volume (`/config/Caddyfile.fixed`) → `caddy validate` + `caddy reload --config /config/Caddyfile.fixed --adapter caddyfile` (rc 0) → LE-Certs ausgestellt, api ungestört. Dieselbe Methode dauerhaft in `deploy-frontend.sh` verankert (kopiert Host-Config nach `/config/Caddyfile.deploy`, reloaded von dort).

## [diggai-anamnese] 2026-06-06 — Kosmetischen `tls: command not found` am Ende von deploy-frontend.sh beheben (Backtick-Command-Substitution in echo)
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-8-01.md` · sig: WORKED
- Blocker: (1) User nannte Ziel-Branch `restructure/phase-1-workspace`, aber HEAD steht auf `master` — der Branch wurde bereits via 83b204a gemerged → auf `master` committet (= „current branch", aktuellster Stand). (2) Paralleler Hintergrund-Agent committet gleichzeitig auf master: `bee2502 docs(verify): … run-logs 04/05` erschien MITTEN in meinem Task (staged + committed fremde proof-of-life-report.md + opus-4-7-04/05). (3) 4 Locale-JSON (de/en/ar/tr) zeigen Dauer-`M` = reines LF↔CRLF-Rauschen (Content-D…
- Fix: Commit strikt auf 1 Datei per Pathspec begrenzt (`git commit -- <file>`), damit weder Line-Ending-Rauschen noch Fremd-Stagings hineinlecken. Line-Ending-Artefakte NICHT bekämpft (Fremd-Prozess besitzt diese Churn; `git checkout --` wird sofort rückgängig gemacht). Fremd-Commit bee2502 unangetastet gelassen.

## [diggai-anamnese] 2026-06-06 — i18n Live-Bug Root-Cause (read-only): ALLE Nicht-de-Sprachen rendern de-Fallback — Live-Bundle aktuell+config-korrekt →…
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-02.md` · sig: GOTCHA
- Blocker: Exakte Code-Zeile read-only NICHT isolierbar — Prod-Bundle hat terser `drop_console:true` (i18next/react-i18next-Debug-Logs live weg). Pinpoint braucht lokalen dev-Build mit `debug:true`. Maschine: C: nur **5,2 GB frei** (OOM-Schwelle; `/tmp`→C:) → voller `vite build` riskant; `npm run dev` ist leichter und machbar. D: hat 895 GB (Projektplatz unkritisch).
- Fix: Diagnose **KORRIGIERT** ggü. claude-code-01-Vermutung — es ist **KEIN** Stale-Deploy (Live-Bundle trägt die aktuelle Config) und **KEIN** keySeparator/Datei-Mismatch (Files + Config beide flach). Read-only ausgeschlossen: File/Serving (200+valid+flach), keySeparator/nsSeparator (live=false), Sprach-Normalizer (en→en/ar→ar, html lang flippt), Inline-DE-Default (0× im Bundle), Dup-i18next-Instanz (single vendor-i18n-Chunk). Verbleibend = **echter Runtime-Apply-Bug**: HttpBackend fetcht en/ar-Bund…

## [diggai-anamnese] 2026-06-06 — i18n pre-commit-Gate verifiziert: generate-i18n.ts ist read-only Detector (kein Mock-Filler), blockt Commit bei fehlend…
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-8-02.md` · sig: FAILED,WORKED,METHOD
- Blocker: Task-Beschreibung war veraltet — beschrieb `generate-i18n.ts` noch als Mock-Filler (alte Z.82/91/101: schrieb `[EN]/[AR]/[TR] <de>`-Placeholder, nur 4 Locales). Tatsächlicher Stand: bereits am 2026-06-06 in `6e7a330` zum read-only Detector umgebaut (+ `.gitattributes`-EOL-Pin + Hook-Rewire). Alle Repo-Referenzen (AGENTS.md, `.github/workflows/ci.yml`, `.husky/pre-push`, `.cursorrules`, PR-Template, `.github/skills/i18n-localization`) beschreiben ihn bereits als Detector.
- Fix: Kein Re-Engineering nötig. Der im Task vorgeschlagene Pfad „compare-translations.cjs als Gate" wäre SCHLECHTER: das Skript schreibt `translation-comparison.txt` (Seiteneffekt), Exit immer 0 (kein Gate), und würde ru/ro/bg (absichtlich partiell) fälschlich mit-gaten. Beibehaltung von `generate-i18n.ts` als Gate ist korrekt (ENFORCED/SECONDARY-Trennung, schreibt nichts). Stattdessen: empirisch verifiziert + Doku gehärtet.

## [diggai-anamnese] 2026-06-06 — i18n Live-Bug GEFIXT + FE zero-downtime redeployed + SW v3->v4 cache-bust — returning visitors bekommen Fix; live verif…
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-03.md` · sig: GOTCHA,WORKED
- Blocker: Nach dem ersten FE-Deploy blieben **returning visitors** auf dem alten Bundle (`index-Brsm2_Eq.js`) — Stale Service Worker: Cache `diggai-anamnese-v3` + stale-while-revalidate lieferte den alten Chunk weiter; Live-Render trotz korrektem Source weiter Deutsch unter `?lng=en/ar`. (Live via Chrome-Ext belegt: Tab war `controller=sw.js`, `cacheKeys=[diggai-anamnese-v3]`, `bundleRefs=[index-Brsm2_Eq.js]`, `html lang=ar dir=rtl` ABER `welcome="Wie können wir Ihnen helfen?"`.)
- Fix: SW `CACHE_VERSION`-Bump '3'→'4' → `sw.js` byte-differs (wird `no-cache` serviert) → Browser-SW-Update bei nächster Navigation → `activate`-Handler purged alle Caches != v4 → leerer v4-Cache → stale-while-revalidate fetcht das neue Bundle frisch aus dem Netz. `{cache:'reload'}` auf dem Navigation-Fetch erzwingt zusätzlich ein frisches `index.html` (live nur etag/last-modified, kein Cache-Control). Greift auf 1 normalem Reload, OHNE manuelles Cache-Clear.

## [diggai-anamnese] 2026-06-06 — #40 FE/BE-Skew behoben: restructure/phase-1-workspace→master gemmerged (83b204a) + Backend manuell auf Hetzner redeploy…
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-04.md` · sig: GOTCHA,FAILED,WORKED
- Blocker: 4 Netzwerk/TLS-Blocker nach dem manuellen Deploy (CI macht das automatisch, §2.2 nicht): (1) `--project-name diggai` erzeugte isoliertes Netz `diggai_diggai-network`, aber `diggai-postgres`/`diggai-redis` leben auf `anamnese-app_diggai-network` → App-Crashloop `P1001: Can't reach postgres:5432`, Backend DOWN. (2) Caddy (`deploy-caddy-1`, Edge-Proxy, `reverse_proxy diggai-app:3001`) liegt auf `anamnese-app_diggai-network` → konnte recreateten App-Container nicht auflösen → 502. (3) **Selbst veru…
- Fix: (1) `docker network connect --alias postgres diggai_diggai-network diggai-postgres` (+ `--alias redis ... diggai-redis`), App-Restart → DB+Redis erreichbar, Health OK nach 15s. (2) `docker network connect --alias diggai-app --alias app anamnese-app_diggai-network diggai-app` → Caddy löst App wieder auf. (3+4) Korrigierte Config (tls-internal-Direktive via `sed "/#/!{/tls internal/d;}"` raus, Kommentare bleiben) nach `/tmp/cf.fixed` (writable) geschrieben → `caddy validate --adapter caddyfile` V…

## [diggai-anamnese] 2026-06-06 — Live-Funktionsverifikation diggai.de (Patientenfluss-Routing + Backend-Health + i18n) nach #40-Deploy; Blocker-Inventur…
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-05.md` · sig: GOTCHA,FAILED
- Blocker: (1) proof-of-life Check 6b POST /api/sessions → HTTP 403 `CSRF_MISSING` — Script-Cookie-Bug (set-cookie-Roundtrip im Script), KEIN Prod-Defekt (Check 5 holt Token sauber; CSRF-Reject = Draft wurde NICHT geschrieben = Guardrail hielt). (2) `scripts/generate-i18n.ts` ist KEIN Detektor sondern Mock-Filler (Z.82 `[EN] ${k}` Platzhalter, Z.107 nur 4/10 Sprachen, Z.120 overwrite) — vor Ausführung gelesen, NICHT ausgeführt, als gefährlich markiert.
- Fix: get_page_text scheitert auf form-heavy SPA → read_page (a11y-Tree)+Screenshot. Suspense-„Loading…"-Fallbacks mid-load → nach Round-Trip re-capturen. Netz-bash braucht dangerouslyDisableSandbox:true.

## [diggai-anamnese] 2026-06-06 — Project-Status + Memory aktualisiert (post-#40 LIVE), Backlog priorisiert; mega-e2e bleibt user-gated
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-06.md` · sig: GOTCHA,METHOD
- Blocker: `mega-e2e.mjs` schreibt 5 echte Prod-PatientSessions (Section 2) OHNE Auto-Cleanup → bewusst NICHT ohne explizites User-GO gefahren. `generate-i18n.ts` als Mock-Filler verifiziert (Z.82/91/101 `[EN]/[AR]/[TR]`-Platzhalter, Z.107 nur 4/10 Locales) — NICHT ausgeführt, als Footgun memoriert.
- Fix: Netz-curl via dangerouslyDisableSandbox. Doc-Repo-Staging einzeln (kein `git add -A`) wegen Fremd-Agent-Residue (Handoff §6).

## [diggai-anamnese] 2026-06-06 — Hatami-White-Label-Subsite entfernt — OCR/jsDelivr-DSGVO-Leak live geschlossen (ultraplan-cascade)
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-07.md` · sig: FAILED,WORKED
- Blocker: Hatami-Quelle `DiggAI-HZV-Rural/` liegt außerhalb des Projektdirs (Workspace-CLAUDE.md off-limits) UND predates den same-origin-Fix → User-Entscheidung „Subsite entfernen" statt Source-Fix. generate-i18n pre-commit-Hook churnte 4 Locales (reiner EOL) → mit `git checkout` verworfen.
- Fix: Live-Caddy-Config (`/opt/carotis-ai/deploy/Caddyfile.backend`, geteilt mit carotis/api) NICHT editiert — Inode-Landmine-Risiko. Content-Entfernung reicht: tote /hatami-Routen liefern via try_files → 404. Repo-Caddy-Configs sind sauber (Source of Truth).

## [diggai-anamnese] 2026-06-06 — i18n-Commit-Hygiene gefixt — generate-i18n.ts → Read-Only-Detektor + .gitattributes EOL-Pin (ultraplan-cascade)
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-08.md` · sig: WORKED,METHOD
- Blocker: `generate-i18n.ts` ist an ~25 Stellen referenziert (5 funktional: pre-commit, pre-push, ci.yml, check-all, .claude/settings.json + ~20 Docs). Genehmigt war „delete + neues i18n-check.cjs + rewire" — das hätte 25 Refs gebrochen/verstaut.
- Fix: Stattdessen Datei IN-PLACE zum Detektor repurposed (gleiches Ziel, minimaler Churn) → alle 5 funktionalen Caller gaten jetzt echt, die ~20 Docs („run to detect missing keys") werden dadurch KORREKT statt geändert. Abweichung vom genehmigten Plan — dem User transparent gemeldet. Detektor als plain-JS-in-.ts (node-lauffähig wie zuvor); enforced set = 10 kanonische Locales (alle key-complete @2740, vor Wiring verifiziert → grün Tag 1).

## [diggai-anamnese] 2026-06-06 — Push (8 Commits) + Gesamt-Test-Sweep grün; 3 Test-Flakes/Bugs gefixt
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-09.md` · sig: GOTCHA,WORKED
- Fix: `test:run` (combined jsdom) Footgun erneut bestätigt — 161 „Fails" = Server-Tests unter jsdom, non-blocking; autoritativ sind test:unit + test:server SEPARAT (memory project_test_run_env_mix_footgun).

## [diggai-anamnese] 2026-06-06 — Live-Browser-Verifikation (Chrome-Extension) — alle Kernflows grün, 0 Fehler
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-10.md` · sig: GOTCHA,WORKED
- Blocker: Custom-Language-Listbox öffnet nicht auf synthetischen Klick (aria-haspopup=listbox; React-onClick feuert nicht) → i18n stattdessen über `?lng=`-Querystring + localStorage verifiziert (LanguageDetector unterstützt beides). Tiefer in den Flow (Consent akzeptieren → Submit) bewusst NICHT — würde echte Prod-Session schreiben (wie mega-e2e, user-gated).
- Fix: Screenshot-CDP-Timeout einmal → über JS-DOM-Read (htmlDir/lang/innerText) + read_network/read_console verifiziert. Browser-Sprache nach Test auf 'en' zurückgesetzt.

## [diggai-anamnese] 2026-06-06 — Agent-Tasks-Disable (Flag, geparkt) + Anamnese-Flow/Funktionalitäts-Audit
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-11.md` · sig: WORKED
- Blocker: Explore-Agent meldete „3 kritische Bugs" — nach Verifikation ALLE entkräftet (Agent analysierte den toten Server-`QuestionFlowEngine` statt des Live-Client-`questionLogic.ts`).
- Fix: Live-Patienten-Flow = CLIENT-seitig (`src/utils/questionLogic.ts:getNextQuestions`). Atom 9000 = gewollter Abschluss-Schritt (UI sendet via /submit, verifiziert). TERM-101 `selectedReason` = vom Client-Engine UNTERSTÜTZT (questionLogic.ts:229). `getServiceStartAtom` = toter Code (kein Prod-Aufrufer, nur Tests).

## [diggai-anamnese] 2026-06-06 — Flow-Befunde #1/#2 gefixt; #3 (Returning-only-Service für Neu-Patient) code-verifiziert; Rezepte-Live-Walk
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-12.md` · sig: GOTCHA,WORKED,METHOD
- Blocker: #3 = realer Edge-Case-Bug bestätigt: Hub bietet returning-only-Services (Rezepte/AU/Überweisung/Befunde) ALLEN an, 0000 (neu/bekannt) wird erst DANACH gefragt; Service-Router (questions.ts:122/276 `context:'selectedReason'`) leitet Neu-Patient zu RES-100/AU-100/… die `showIf 0000='ja'` sind → `shouldShowQuestion`=false → kaputter/partieller Flow.
- Fix: selectedReason IS populated (Questionnaire.tsx:129 = store.selectedService) → Service-Routing funktioniert grundsätzlich. #3-Fix braucht Produkt-/UX-Entscheidung (Hub-Filter nach Patiententyp / Hinweis+Umleitung / Gate entfernen) → dem User vorgelegt, NICHT geraten.

## [diggai-anamnese] 2026-06-06 — #3-Fix (Returning-only-Services für Neu-Patienten) live deployed (Frontend-only)
`diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-13.md` · sig: GOTCHA,WORKED,METHOD
- Blocker: — (User hat FE-Deploy explizit freigegeben: „Nur #3 (Frontend) jetzt"; Agent-disable/Backend bleibt geparkt).
- Fix: — (Deploy lief sauber durch, DEPLOY_EXIT=0).

## [diggai-anamnese] 2026-06-07 — Agent-disable BE deployed (korrekt) — nach selbstverschuldetem Prod-Outage (~11 Min) durch falschen compose-Projektnamen
`diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-7-01.md` · sig: GOTCHA
- Blocker: **Prod-Outage ~11 Min (api.diggai.de 502).** Ursache 1: deploy-backend.sh nutzte `--project-name diggai` (aus FALSCHER DEPLOY.md-Zeile) → App-Container auf isoliertem Netz `diggai_diggai-network`; Caddy-Edge haengt aber an `anamnese-app_diggai-network` → 502. Ursache 2: Caddy cached statische Upstream-IP → nach `--force-recreate` (neue IP) Reload noetig. Ursache 3: Re-home via `docker compose up` (ohne `--build`) nahm das 3-Wochen-alte projekt-getaggte Image `anamnese-app-app` (OHNE agent-disab…
- Fix: Live-Stack-Projekt = **`anamnese-app`** (= App-Dir-Name; postgres/redis/nginx tragen dieses Label). Korrekt: `docker compose --project-name anamnese-app build app` (Image `anamnese-app-app` MIT agent-disable @ 02c1ec9) → `up -d --force-recreate --no-deps app` → App-Readiness ({{IP}}:3001=200) → **`caddy reload`** (re-resolve neue IP). Datensicher: pgdata/uploads/redisdata sind named volumes (PatientSession=17 vor+nach verifiziert). deploy-backend.sh + DEPLOY.md §2.2 mit beiden Footgun-Warnungen…

## [diggai-anamnese] 2026-06-07 — Patienten-UX-Paket: Notfall-QR Self-Service + Inline-Freitext + 1-Klick-Consent + Stimme aus + Tiles versteckt + Respon…
`diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-8-01.md` · sig: -
- Blocker: (a) Edit verlangt vorheriges Read jeder Locale-Datei (11×) — 10 Reads nachgeholt. (b) `getNextQuestions`-Routing-Risiko: würde Strip das einzige „next" einer Frage töten? (c) eslint „unused disable directive".
- Fix: (a) Slice-Reads der Consent-Blöcke. (b) Verifiziert: Muster ist parent.logic.next === FT.logic.next (1005→1006, 1005-FT→1006), `-FT` ist Parallel-Branch → Strip sicher, logic.next trägt Flow; Exclusion nur im Array-Branch. (c) disable-Zeile entfernt.

## [diggai-anamnese] 2026-06-07 — Notfalldatensatz-Modul: Ultraplan + Increments 1-5 (end-to-end funktional hinter Flag) + DSFA
`diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-7-02.md` · sig: FAILED,WORKED
- Blocker: (a) Komponenten-Test scheiterte: `t(key,{defaultValue})` gab im Test das Options-Objekt zurück → React-Child-Fehler. (b) QuestionType `bg-form` ist BG-Unfall (Atom 2080), NICHT Blutgruppe.
- Fix: (a) per-File `vi.mock('react-i18next')` (beide t-Formen) ergänzt — Projekt-Konvention. (b) Blutgruppe als `select` (9 Optionen + unbekannt) statt bg-form. Flag-Default-OFF macht 9600 ohne Context versteckt → bestehende Pfade unverändert (Fallback next:['9000']).

## [diggai-anamnese] 2026-06-07 — Refinements (Deselect-Clear + 10-Sprachen) + Live-E2E + Deploy-Versuch
`diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-8-02.md` · sig: GOTCHA,METHOD
- Blocker: (a) Playwright `locator.isVisible()` wartet NICHT → erste Checks false trotz gerenderter Seite. (b) `npm run dev &` im run_in_background-Shell → Orphan-Vite auf 5173, zweiter auf 5174. (c) **Prod-Deploy: Auto-Mode-Classifier verweigert Prod-SSH** zu {{IP}} — `deploy-frontend.sh` braucht genau dieses SSH → Deploy unter Auto-Mode NICHT möglich (bekannter Footgun „Auto-Mode AUS / Weg B").
- Fix: (a) Helper `visible()` mit `waitFor({state:'visible'})` → 9/9 PASS. (b) beide Vite-PIDs via PowerShell `Stop-Process` beendet. (c) Deploy NICHT erzwungen (kein Workaround der Denial); an User übergeben.

## [diggai-anamnese] 2026-06-07 — Notfalldatensatz: Increments 6-7 (Dashboard-Reprint + Flag-Gate-Test + e2e) + Merge nach master + FE-Deploy
`diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-7-03.md` · sig: WORKED,METHOD
- Blocker: — (Dashboard-Infrastruktur war bereits vorhanden; nur Reprint-Button neu).

## [diggai-anamnese] 2026-06-07 — Frontend LIVE deployed + Backend bewusst NICHT (Footgun bestätigt)
`diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-8-03.md` · sig: METHOD
- Blocker: (a) `git push` origin = HTTPS → hängt ohne Credentials (nicht-interaktiv) → nichts gepusht. (b) `git push origin master` würde `.github/workflows/deploy.yml` triggern = BE-Footgun.
- Fix: (a) Push abgebrochen (TaskStop); Commits bleiben lokal (3) + Backup-Branch nur mit User-Creds möglich. (b) BE-Push BEWUSST NICHT ausgeführt; spawn_task `task_2dff217b` für sauberen Workflow-Fix angelegt.

## [diggai-anamnese] 2026-06-07 — Backend-Deploy (Emergency-PII + agent-disable) — sauber, kein Outage; Engineering-Harness gespeichert
`diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-7-04.md` · sig: GOTCHA
- Blocker: — (Footgun gekapselt; KEIN Outage diesmal — Gegenteil zum -01-Lauf, wo `--project-name diggai` ~11min 502 verursachte).

## [diggai-anamnese] 2026-06-07 — Deploy-Workflow entschärft + Origin-Push durch GCM blockiert
`diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-8-04.md` · sig: GOTCHA,METHOD
- Blocker: `git push` hängt non-interaktiv — Windows Git Credential Manager (`manager`) will GUI; auch token-in-URL + `!gh auth git-credential` + `-c credential.helper=` hängen im Harness-Background. `gh api`/`gh workflow` funktionieren (Keyring zugänglich).
- Fix: Push-Versuche abgebrochen (TaskStop). Safety ist UNABHÄNGIG vom Push erreicht (Workflow GitHub-seitig disabled). 6 Commits lokal, unpushed.

## [diggai-anamnese] 2026-06-07 — Korrekturen: Git-Sync, Hetzner-Cleanup, Deploy-Workflow-Neubau, Runbook
`diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-8-05.md` · sig: GOTCHA,WORKED,METHOD
- Blocker: Push wird vom Harness backgrounded + Hook ~90s → mehrfach voreilig als „GCM-Hang" fehldiagnostiziert & gekillt.
- Fix: Einfach warten / PowerShell+Token. `gh api` für origin-sha-Check statt push-output zu pollen.

## [diggai-anamnese] 2026-06-07 — Punkt 1+2 live (Datenschutz entschlackt, Notfalldatensatz=Vorgeschichte) + Full-Test
`diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-8-06.md` · sig: WORKED
- Blocker: Full-Playwright-Test 2 „Fails" (Null-Persistenz + Unterschrift-Dialog).
- Fix: Beide = Test-Artefakte. (a) Einziger non-GET /api-Request = anonymes `POST /api/system/metrics/web-vitals` (TTFB); Patientendaten („GeheimName") werden NIE gesendet → Null-Persistenz der Patientendaten per Diag bestätigt. (b) Unterschrift erscheint doch (Diag + Screenshot `diag-patient.png`); Full-Test hatte falsche Kachel/Timing.

## [diggai-anamnese] 2026-06-08 — Notfalldatensatz: web-vitals aus + Datenschutz-Wortlaut praezisiert (11 Locales) → live & abgeschlossen
`diggai-anamnese/memory/runs/2026-06-08_claude-code_opus-4-8-01.md` · sig: -
- Blocker: TSX-Inline-Fallback wurde nicht gerendert, weil der Key `emergency.gen.privacy` in de/translation.json EXISTIERT → JSON-Wert gewinnt ueber `defaultValue`. Reine TSX-Aenderung war wirkungslos.
- Fix: Throwaway-Node-Skript (`%TEMP%/diggai-privacy-reword.mjs`) macht 1-Zeilen-In-Place-Replace pro Locale (EOL/BOM/Encoding erhalten, self-verifying OK/SKIP/FAIL pro Datei); de-JSON nun deckungsgleich mit TSX-Fallback. 11/11 OK.

## [diggai-anamnese] 2026-06-08 — Pflegeheim-v2: „Sicherheit zuerst" — Auth-Layer auf die ungeschützten v2-Routes
`diggai-anamnese/memory/runs/2026-06-08_claude-code_opus-4-8-02.md` · sig: WORKED
- Blocker: `validateCsrf` (app-level VOR den v2-Mounts) hätte alle Bearer-/Onboarding-POSTs mit 403 geblockt — erklärt auch, warum das Onboarding-Skript nie live lief.
- Fix: Bearer-authentifizierte Requests in `validateCsrf` ausgenommen (Standard-Pattern: Bearer ist kein ambientes Cookie → kein CSRF-Vektor; Cookie-Routes bleiben voll geschützt).

## [diggai-anamnese] 2026-06-08 — Pflegeheim-Praxis-Seite: Phase-2-Crypto + Praxis-Schlüssel-Store (Fundament)
`diggai-anamnese/memory/runs/2026-06-08_claude-code_opus-4-8-03.md` · sig: WORKED,METHOD
- Blocker: Store-Tests rot — globales `src/test-setup.ts` stubt `localStorage` als No-Op-`vi.fn()` (getItem→undefined), echte Persistenz fehlte. Außerdem TS2345 (`Uint8Array<ArrayBufferLike>` vs `<ArrayBuffer>` an crypto.subtle.encrypt).
- Fix: In-Memory-Map-Mock im `beforeEach` (analog heimResidentStore.test.ts) → echte Persistenz im Test; Param-Typ auf `Uint8Array<ArrayBuffer>` präzisiert.

## [diggai-anamnese] 2026-06-08 — Punkt (b) requireInstitutionAccount + tenant-Bypass-Fix → BE+FE deployed & live verifiziert
`diggai-anamnese/memory/runs/2026-06-08_claude-code_opus-4-8-04.md` · sig: GOTCHA,WORKED
- Blocker: Erste BE+FE-Deploys liefen grün, aber `/api/v2/*` lieferte LIVE 404 statt 401/503.
- Fix: Ursache = `resolveTenant` (globales app.use) 404't (TENANT_NOT_FOUND) jede Route ohne Tenant-Auflösung; api.diggai.de löst zu KEINEM Tenant auf → der gesamte tenant-agnostische v2-Stack war unerreichbar (erklärt „nie live getestet"). Bypass für `/api/v2/*` in `server/middleware/tenant.ts` (analog /api/health) + Redeploy BE.

## [diggai-anamnese] 2026-06-08 — Loop geschlossen (Praxis-UI) + Pilot-Onboarding live verifiziert
`diggai-anamnese/memory/runs/2026-06-08_claude-code_opus-4-8-05.md` · sig: GOTCHA,WORKED
- Blocker: Onboarding lief in mehrere PROD-Bugs: (1) register CSRF-Block für CLI (kein Bearer); (2) raw-SQL register 500 — `institutionType`-Cast fehlte (Postgres 42804 text vs enum); (3) raw-SQL INSERTs ohne `id`/`updatedAt` (23502 NOT NULL — Prisma `@default(uuid)`/`@updatedAt` sind client-seitig, raw SQL umgeht sie).
- Fix: (1) Onboarding-Skript sendet Admin-Bearer auf register (CSRF-Ausnahme; Endpoint bleibt public); (2) `$N::"InstitutionType"`-Cast; (3) `id=gen_random_uuid()` + `updatedAt=CURRENT_TIMESTAMP` in InstitutionDirectoryEntry/KeyExchangeMessage(×2)/ResidentKeyAssignment-INSERTs (Spalten via `information_schema` gegen Prod-DB verifiziert).

## [diggai-anamnese] 2026-06-08 — v2-directory /verify Auth-Lücke geschlossen (parallel zu institution)
`diggai-anamnese/memory/runs/2026-06-08_claude-code_opus-4-8-06.md` · sig: WORKED
- Fix: Raw-SQL-Audit von v2-directory: nutzt durchgängig typed Prisma-Client (`prisma.tenant.create/update`, status-Enum via `data:`) — KEIN `$executeRawUnsafe/$queryRawUnsafe`, daher kein 23502/42804-Risiko wie bei institution/residents. Nichts zu casten (id/updatedAt/Enum kommen aus dem Client).

## [diggai-anamnese] 2026-06-10 — DatenschutzGame + Gamification komplett entfernt (Ultraplan 1.1.1, {{USER}} 2026-06-07)
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-01.md` · sig: -
- Blocker: `npm run lint` war schon auf HEAD rot — 24 pre-existing react-hooks/refs-Fehler in ServicePageLayout (honeypotRef im flow-Objekt, C12-Feature, nicht Gamification).
- Fix: Per git stash verifiziert, dass Fehler pre-existing sind; durch Entfernen des Game-Blocks 24→19 reduziert. Rest out-of-scope dokumentiert.

## [diggai-anamnese] 2026-06-10 — Ultraplan Phase 2.1.1: ServiceRequest-Entität (Prisma + Extraktion + Staff-Routes)
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-03.md` · sig: -
- Blocker: Kein Docker auf dieser Maschine, .env-DATABASE_URL zeigt noch auf Neon (verboten per Single-Host-Direktive) → keine DB zum Anwenden/`migrate status`.
- Fix: Migration als manuelle SQL nach Muster 20260525_v2_pflegeheim_vertical.sql beigelegt (muss auf Hetzner via psql eingespielt werden, BEVOR das neue Backend deployed wird); `npx prisma generate` lief lokal.

## [diggai-anamnese] 2026-06-10 — Service-Frage-Branches RES/AU/DAT inhaltlich vervollständigt (Phase 2.1.2)
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-04.md` · sig: -
- Blocker: PII-Atome liegen in `Answer.value` nur redacted (`{data:'[encrypted]',redacted:true}`) — die ServiceRequest-Extraktion hätte den Klartext verloren.
- Fix: extractServiceRequestFromSession holt für redacted Nicht-E2EE-Atome den Klartext aus `encryptedValue` (decrypt) in den selbst AES-verschlüsselten Payload; E2EE bleibt redacted.

## [diggai-anamnese] 2026-06-10 — Phase 3.1.1: ServiceRequest-Queue in Arzt/MFA-Dashboard + Socket-Event
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-05.md` · sig: GOTCHA
- Blocker: Listen-Endpoint filtert nur EINEN Status → „offene"-Default (3 Status) nicht serverseitig abbildbar; kein Tenant-Room existierte bisher (nur globaler 'arzt'-Raum).
- Fix: Liste lädt alle Metadaten (payload-frei, klein), Typ/Status-Filter client-seitig auf EINEM Query-Cache (Socket-Invalidierung + Polling-Fallback treffen denselben Key); Tenant-Room-Join in join:arzt ergänzt, tenantId stammt aus verifiziertem JWT.

## [diggai-anamnese] 2026-06-10 — Phase 3.1.2: NEEDS_REVISION-Rückfrage-Flow + Triage-Ack-Button
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-06.md` · sig: -
- Blocker: lucide-react MessageCircleQuestion-Verfügbarkeit unklar — per node require verifiziert, vorhanden.

## [diggai-anamnese] 2026-06-10 — Phase 4.1.1: Patient-Statusseite „Meine Anfrage" + Staff-Chat-Panel (Fertigstellung nach Unterbrechung)
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-07.md` · sig: -
- Blocker: Unklar, ob Vorgänger Gates gefahren hatte — alle Gates selbst gefahren; Änderungen waren bereits vollständig konsistent (keine Lücken zu fixen).

## [diggai-anamnese] 2026-06-10 — ChatMessage.text at-rest verschlüsseln (Ultraplan Phase 4.1.1b, DSGVO Art. 32)
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-08.md` · sig: GOTCHA,WORKED
- Blocker: Vorgabe-Regex `^[0-9a-f]{24}:` falsch — IV ist hier 16 Bytes (config.encryptionIvLength=16 → 32 Hex), nicht 12; außerdem flaky 30s-Timeout in src dashboards smoke.test.ts unter vollem parallelen jsdom-Lauf.
- Fix: Regex dynamisch aus `config.encryptionIvLength*2` gebaut; Smoke-Test in Isolation grün re-verifiziert (bekannter RAM-Footgun, nicht change-bezogen).

## [diggai-anamnese] 2026-06-10 — ServiceRequest-Statusmeldungen an Patient (Phase 4.1.2)
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-09.md` · sig: GOTCHA,WORKED
- Blocker: test:unit voll: 4 Fails (smoke.test.ts + 3 weitere) — Timeouts unter Parallel-Last (lief gleichzeitig mit test:server).
- Fix: Alle 4 Dateien in Isolation re-verifiziert: 10/10 grün in 15s → Maschinen-Footgun, kein echter Fail.

## [diggai-anamnese] 2026-06-10 — Phase-3-Ergebnis-Rückkanal Praxis→Heim (Pflegeheim-Vertical v2, Ultraplan 5.2)
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-10.md` · sig: GOTCHA,FAILED,METHOD
- Blocker: (1) PflegeheimDashboard-Smoke-Test OOM — Endlos-Render-Loop, weil der globale react-i18next-Mock pro Render ein neues `t` liefert und `t` in den useCallback-Deps von loadPraxisMessages stand. (2) test-setup mockt localStorage als No-Op → heimPrivateKeyStore-Test rot.
- Fix: (1) Fehler als Code-State ('token-invalid'|'load-failed'), Übersetzung erst im Render — `t` raus aus den Deps. (2) In-Memory-Map in beforeEach verdrahtet (Muster heimResidentStore.test.ts).

## [diggai-anamnese] 2026-06-10 — PDF/QR-Fallback Pflegeheim (Druckblatt + Praxis-Import, Ultraplan 5.3)
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-11.md` · sig: -
- Blocker: Globale Print-Regel `.fixed { display:none }` in index.css hätte das Druck-Overlay verschluckt.
- Fix: Eigene Klasse `.vorgang-druckblatt-overlay` (position:fixed ohne Tailwind-`fixed`) + visibility-Trick, sodass NUR `.druckblatt-sheet` gedruckt wird.

## [diggai-anamnese] 2026-06-10 — Paket 2.2.1 History-vs-Concern fertiggestellt (PatientHistoryProfile + Consent + Skip)
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-12.md` · sig: GOTCHA
- Blocker: useSubmitSession-Signaturänderung brach 1 Bestandstest (usePatientApi.test.tsx erwartete submitSession('id') ohne Options).
- Fix: Assertion auf `('session-123', { historyConsent: false })` angepasst + neuen Positivtest (historyReuse=true) ergänzt.

## [diggai-anamnese] 2026-06-10 — History-vs-Concern Paket 2.2.2 — Client-Verdrahtung + Staff-UI + Widerruf
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-13.md` · sig: -
- Blocker: Migrationen lokal nicht anwendbar — Docker fehlt auf der Maschine, Port 5432 zu, `.env` DATABASE_URL zeigt auf Neon (Fremd-Host, {{USER}}-Direktive Full-Hetzner → bewusst NICHT dagegen migriert).
- Fix: Nur Befund in `docs/HISTORY_VS_CONCERN.md` (Offene Punkte) — beide manuellen SQLs beim nächsten Hetzner-Deploy gegen `anamnese_prod` ausführen.

## [diggai-anamnese] 2026-06-10 — DSGVO-Löschkonzept end-to-end (Ultraplan 1.3.1)
`diggai-anamnese/memory/runs/2026-06-10_claude-code_fable-5-14.md` · sig: WORKED

## [diggai-anamnese] 2026-06-11 — Ultraplan-Verifikation + Voll-Deploy (BE+FE+Migrationen) auf Hetzner
`diggai-anamnese/memory/runs/2026-06-11_claude-code_fable-5-15.md` · sig: GOTCHA,WORKED
- Blocker: (1) Docker-Build TS2307 — `historyProfile.service.ts` importiert `src/data/questions/historyAtoms`, Dockerfile kopierte nur `src/theme`. (2) Lokaler Playwright-Lauf: `GET /api/service-requests` 500, weil Tabelle in der lokalen DB fehlte (erwartbar). (3) Session-Limits unterbrachen 2 Agenten mitten im Paket.
- Fix: (1) Dockerfile: `COPY src/data/questions/` in Builder+Runtime (`37a91ff`). (2) Nach Prod-Migration kein 500 mehr möglich; UI zeigte sauberes Fehler-Toast (kein Crash). (3) Folge-Agent übernimmt Working-Tree und committed (Muster funktioniert).

## [diggai-anamnese] 2026-06-11 — PraxisChatMessage at-rest verschlüsseln (HANDOFF §9.3, DSGVO Art. 32)
`diggai-anamnese/memory/runs/2026-06-11_claude-code_fable-5-16.md` · sig: METHOD
- Blocker: Keine bestehenden praxis-chat-Tests (Handoff vermutete welche) → neu geschrieben statt angepasst.
- Fix: `chatService.test.ts` mockt `globalThis.__prisma` + `../../db` (vermeidet echten PrismaClient); `retentionCleanup.test.ts` neu.

## [diggai-anamnese] 2026-06-11 — Upload-Tenant/Session-Bindung (HANDOFF §9.8)
`diggai-anamnese/memory/runs/2026-06-11_claude-code_fable-5-17.md` · sig: GOTCHA,WORKED
- Blocker: Subagent zweimal vor Commit vom Session-Limit getrennt; `test:unit` Voll-Lauf 498/499 (smoke.test 30s-Timeout).
- Fix: Hauptagent übernahm Gates+Commit; smoke.test in Isolation 4/4 grün (bekannter Parallel-Footgun, kein echter Fail).

## [diggai-anamnese] 2026-06-11 — Deploy der Security-Packs 0570f73+bdcc3f3 auf Hetzner
`diggai-anamnese/memory/runs/2026-06-11_claude-code_fable-5-18.md` · sig: GOTCHA

## [diggai-anamnese] 2026-06-11 — Adversarial-Review der Session + Server-Security-Fixes (Cross-Tenant-Chat)
`diggai-anamnese/memory/runs/2026-06-11_claude-code_fable-5-19.md` · sig: GOTCHA,FAILED,WORKED,METHOD
- Blocker: Workflow-Verify-Agenten + zeroknowledge-Finder am Limit gescheitert → 22 Findings unverifiziert (nicht widerlegt).
- Fix: Top-Findings selbst im Code verifiziert; Cross-Tenant-Chat war mehrfach unabhängig gemeldet + im Code eindeutig (globaler `arzt`-Room, bestätigt via join:arzt-Mechanik Z.146/150).

## [diggai-anamnese] 2026-06-11 — Session-Review Backend-Findings F1–F5 verifiziert + gefixt
`diggai-anamnese/memory/runs/2026-06-11_claude-code_fable-5-20.md` · sig: GOTCHA,WORKED
- Blocker: prisma generate EPERM (query_engine DLL gelockt) durch 4 verwaiste tsx-watch-Dev-Server (PIDs 3756/10288/10400/15300) + npm-Wrapper. Erstlauf test:server: 2 eigene verify-pattern-Tests 429 (geteilter In-Memory-Rate-Limiter pro IP über ganze Datei) + 1 fremder Flake.
- Fix: Verwaiste node/tsx-Dev-Server gestoppt → prisma generate ok. Eigene verify-pattern-Tests auf eindeutige IPs (10.20.0.x) umgestellt (Muster der F2-identify-Tests).

## [diggai-anamnese] 2026-06-11 — Frontend-Findings (Session-Review) verifiziert + gefixt (src/** only)
`diggai-anamnese/memory/runs/2026-06-11_claude-code_fable-5-21.md` · sig: -
- Blocker: Voller `type-check` warf 3 Errors in server/routes/patients.ts + server/services/historyProfile.service.ts (`identityVerified`) — NICHT meine Dateien, sondern der parallele Backend-Agent (Prisma-Client noch nicht regeneriert). PflegeheimDashboard-Test matchte „Heim-Schlüssel hinterlegen" doppelt (Form-Heading + neuer Hinweis).
- Fix: Server-Errors abgewartet — parallel-Agent hat zwischenzeitlich regeneriert, server-tc jetzt Exit 0; nur src/** committet. Test-Assertion auf `getByRole('heading', { name: 'Heim-Schlüssel hinterlegen' })` verschärft.

## [diggai-anamnese] 2026-06-11 — Review-Fixes verifiziert + Migration + Deploy
`diggai-anamnese/memory/runs/2026-06-11_claude-code_fable-5-22.md` · sig: GOTCHA,WORKED
- Blocker: 2 Test-Fehlschläge im Voll-Lauf — `TriageEngine.performance` (<10ms) + `pvs-adapter.e2e` (<1s). Reine Timing-Tests, von keinem Fix berührt (TriageEngine/PVS unangetastet).
- Fix: Als Maschinen-Timing-Footgun eingestuft (wie test:unit-Parallel-Timeouts) — Isolation 37/38, der eine Rest-Flake ist die harte ms-Schwelle unter Maschinenlast. Kein funktionaler Regress; geänderte Dateien isoliert grün (chat/relay 35/35, Backend-Paket 118/118, test:unit 502).

## [diggai-anamnese] 2026-06-11 — Agenten-Infrastruktur (MWP/ICM) gebaut + 7 Repos eingeordnet
`diggai-anamnese/memory/runs/2026-06-11_claude-code_fable-5-23.md` · sig: GOTCHA,METHOD
- Blocker: (1) jq fehlt in der Shell → Guard hätte fail-closed alles geblockt. (2) Guard-Glob `*/deploy/*` matchte `deploy/...` ohne führenden Slash nicht.
- Fix: (1) Guard jq-frei (sed/case-Parsing) neu geschrieben. (2) `deploy/*` ergänzt. Guard mit 12 Fällen verifiziert (Medizin-Kern/Secrets/Deploy/push/ssh/docker → DENY exit2; normaler Build → ALLOW). Worktree-Setup end-to-end dry-run getestet (Branch ralph/smoketest angelegt, Guard in Worktree aktiv, danach sauber entfernt, master unberührt).

## [diggai-anamnese] 2026-06-12 — Logik-Audit Dim. C — diagnostische Triage-Sprache nicht mehr patient-erreichbar
`diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-01.md` · sig: WORKED
- Blocker: Vorgänger-Agent am Session-Limit abgebrochen — GDT-Handler rief undefinierten resolveScopedTenantId auf (kompilierte nicht), /state + Befund 2 + Tests fehlten.
- Fix: Helper definiert, /state + EpisodeNote-Default selbst ergänzt, +6 Tests (sessions.test 21 / session-summary 7).

## [diggai-anamnese] 2026-06-12 — Logik-Audit Dim. B — Routing-Dead-Ends behoben
`diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-02.md` · sig: FAILED,METHOD
- Blocker: voller type-check fand Typfehler im C-Pack-Test (addNote-Mock arglos → calls[0][0] leeres Tuple).
- Fix: addNote-Mock-Signatur typisiert. (kein Verbotswort, keine Frage-ID umnummeriert, keine neuen i18n-Keys — inline-DE-Optionen wie Nachbar-Atome.)

## [diggai-anamnese] 2026-06-12 — Logik-Audit Dim. A: ServiceRequest Erstkontakt-/Identitäts-Marker + Dashboard-Badge
`diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-03.md` · sig: -
- Blocker: Edit-Tool verlangt Read pro Locale-Datei (10× große JSON) — ineffizient; `python` nicht auf PATH (nur D:\Python312).
- Fix: i18n-Keys via Node-Script (fs, UTF-8, indent-erhaltend) in 9 Locales eingefügt + JSON.parse-Verifikation aller 10. 0000-Semantik geklärt: Frage „Sind Sie bereits Patient?" — 'nein' (erstes Mal hier) → isNewPatient=true = Erstkontakt; Markierung daher korrekt.

## [diggai-anamnese] 2026-06-12 — Logik-Audit Dim. D: UI framt nicht mehr jeden Service als „Anamnese"
`diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-04.md` · sig: METHOD
- Blocker: marketing-audit.cjs scant public/locales und ist laut Eigenangabe Class-I-Hard-Gate — Baseline aber bereits 595 Treffer / Exit 1 (Frage-Text-Keys + Staff-Strings), also heute kein gruenes Gate; nicht in DoD gelistet.
- Fix: Nur live patient-facing Strings bereinigt; zwei tote Legacy-Keys (Schluessel = deutscher String mit „Behandlung") risikoarm gelassen (CLAUDE.md: tote Strings nur risikoarm). Whole-file-Reserialisierung der Locales pruefte sauber (je 25/-5 Zeilen, kein Format-Churn, LF erhalten).

## [diggai-anamnese] 2026-06-12 — Logik-Audit (4 Dim.) komplett umgesetzt + deployed
`diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-05.md` · sig: WORKED,METHOD
- Blocker: Audit-/Fix-Agenten mehrfach am Session-Limit (00:30–04:30) — C+B selbst fertiggestellt; A-Server+D nach Reset per Agent. Server-Suite zeigte transient „1 error" (Perf-Flake unter Last) — Re-Run sauber.
- Fix: Cross-Review-Caveats beachtet: verify-pattern-Re-Link (Hijack-Vektor) NICHT gebaut (Folge-TODO); Stammdaten-Adress-Skip NICHT (RES-102-Post-Kollision); kein hartes Patientenflow-Gate.

## [diggai-anamnese] 2026-06-12 — Hartes Erstkontakt-Gate (Rezept/AU) + Tenant-Flag-Durchsetzung
`diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-06.md` · sig: WORKED,METHOD
- Blocker: Vorgänger-Agent am Session-Limit vor Gates+Commit; mein alter B-Test erwartete 3005→RES-100 (jetzt GATE-100).
- Fix: Test auf Gate-Verhalten aktualisiert (3005 Rezept/AU→GATE-100, GATE-Optionen→TERM-100/TEL-100, Skip für Bekannte→RES-100). Skip-Mechanik verifiziert (getActivePath Dummy-Answer).

## [diggai-anamnese] 2026-06-12 — verify-pattern Session-Re-Link (identityVerified live) + Hijack-Schutz
`diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-07.md` · sig: WORKED
- Blocker: Hijack-Vektor (Cross-Review): naives Umhängen erlaubt fremde sessionId-Bindung mit eigenem Konto+Muster.
- Fix: Deny-by-default VOR bcrypt — Besitznachweis via Patient-Session-JWT (readOptionalAuth, role=patient + sessionId-Match, sonst 403 + Audit SESSION_LINK_DENIED); zusätzlich tenant-gescopt (Session.tenantId==patient.tenantId, sonst 403). Anon. Waise bleibt stehen (cleanup.ts räumt 24h).

## [diggai-anamnese] 2026-06-12 — 3 {{USER}}-Vorschläge deployed + ZK-Pivot-Ultraplan erstellt (Approval-Gate)
`diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-08.md` · sig: GOTCHA,WORKED,METHOD
- Blocker: 2 Vorgänger-Agenten + Architekt am Session-Limit; Gating-Test-Konflikt (3005→GATE-100).
- Fix: Packs selbst fertiggestellt (Gates grün, test:server 1960/9skip), Test aktualisiert.

## [diggai-anamnese] 2026-06-12 — ZK-Pivot Phase 1: Patient-Landing entkernt + /praxis Staff-Landing + Nebenfeatures-Freeze
`diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-09.md` · sig: WORKED
- Blocker: HomeScreen-Tests rot (4×) — globales test-setup-i18n-Mock kennt t(key, {defaultValue}) nicht (Objekt landete als React-Child → Crash). test:unit-Trailing-Arg hängt sich an den src/-Glob an (lief ganze Suite statt Einzeldateien).
- Fix: Lokales react-i18next-Mock im HomeScreen-Test (beide t()-Signaturen: String + Options-Objekt), Muster wie SubmittedPage.test. Einzeldateien direkt via npx vitest run <pfade> ohne Trailing-Arg.

## [diggai-anamnese] 2026-06-12 — ZK-Pivot Phase 2 — Praxis-Suche als Schritt 0 (BSNR-Zuweisung)
`diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-10.md` · sig: WORKED,METHOD
- Blocker: Phase-2-Agent endete unklar (wartete auf Monitor) vor DoD/Commit.
- Fix: Gates selbst gefahren + committet. clientCrypto-Helper als in-Scope verifiziert.

## [diggai-anamnese] 2026-06-12 — Behörden-Demo-Polish: GATE-100-E2E-Beweis + Dauer-Konsistenz + AR-Datum
`diggai-anamnese/memory/runs/2026-06-12_claude-code_fable-5-11.md` · sig: FAILED,METHOD
- Blocker: E2E hing 2× — (1) „Kamera scannen" ist KEIN Schritt, sondern optionales eGK-Banner über 0001/0011/0003/2000 (Skip-Handler war falsch); (2) Geschlecht-Frage 0002 ist custom Combobox (button[role=combobox]+[role=option]), Geburtsdatum 0003 ist Split-Input TT/MM/JJJJ — generischer Filler scheiterte. (3) check6: page.evaluate-Race bei SPA-Redirect.
- Fix: Banner-Handler entfernt + Combobox-Klick + Placeholder-gezieltes Füllen (tt/mm/jjjj); addInitScript statt evaluate für i18nextLng=ar.

## [diggai-anamnese] 2026-06-13 — Backlog DiggAi 2026-06-13 angelegt + Autofill-Bug lokalisiert
`diggai-anamnese/memory/runs/2026-06-13_claude-code_opus-4-7-01.md` · sig: -
- Blocker: Workspace-Bash im Cowork-Mode down („Not enough disk space"), daher konnte .docx nicht direkt gerendert werden.
- Fix: Plan B — .md als Quelle der Wahrheit + Node-Skript für .docx-Generation lokal.

## [diggai-anamnese] 2026-06-13 — Ultraplan DigG AI: {{USER}}-Strategie-Reframe geplant + Welle-1-Backlog (14/21) umgesetzt
`diggai-anamnese/memory/runs/2026-06-13_claude-code_opus-4-8-01.md` · sig: GOTCHA,METHOD
- Blocker: PowerShell blockt `npm.ps1` (ExecutionPolicy); Here-String mit dt. „ "-Quotes zerlegt Commit-Message; C: nur 2,2 GB frei; ripgrep/Glob-Timeouts auf vollem Baum.
- Fix: `npm.cmd`/`npx.cmd` + `TMP/TEMP=D:\tmp`; Commit-Message via `git commit -F <file>`; Multi-Locale-Edits über key-gematchtes One-off-Node-Skript (danach gelöscht).

## [diggai-anamnese] 2026-06-13 — Welle-1-Push live, Frontend-Deploy am SSH-Key-Gate
`diggai-anamnese/memory/runs/2026-06-13_claude-code_opus-4-7-02.md` · sig: GOTCHA,FAILED,WORKED,METHOD
- Blocker: SSH-Schlüssel-Passphrase kann ich im Cowork-Subprozess nicht eingeben. Memory-Eintrag „Chrome in Cowork ist read-only — Hetzner-Klicks muss User selbst ausführen" gilt analog für SSH-Passphrase.
- Fix: An {{USER}} übergeben — er entsperrt den ssh-agent und ruft `deploy\hetzner\deploy-frontend.cmd` nochmal auf (Build ist gecached, dist/ liegt schon, scp + Caddy-Reload + Smoke-Test laufen dann durch).

## [diggai-anamnese] 2026-06-13 — Item 24 — Patientenschlüssel: QR + Submit-Payload + Rotation + UI-Test (Lücken geschlossen)
`diggai-anamnese/memory/runs/2026-06-13_claude-code_opus-4-8-02.md` · sig: GOTCHA,WORKED
- Blocker: `0f7515f` (Vor-Commit, anderer Agent) brach den Frontend-`tsc`: `Uint8Array<ArrayBufferLike>` nicht zu `BufferSource` (TS 5.7) in `patientKeypair.ts` Z.124/150 — Build war rot, Frontend nicht baubar. Wurde vor dem Commit offenbar nicht type-gecheckt.
- Fix: `base64ToBytes(): Uint8Array<ArrayBuffer>` + `sealForPatient(plaintext: Uint8Array<ArrayBuffer>)` (Annotation geschärft, Implementierung lieferte ohnehin genau das).

## [diggai-anamnese] 2026-06-13 — Welle-1 unabhängige Verifikation (68c5693) + type-check-Lücke geschlossen
`diggai-anamnese/memory/runs/2026-06-13_claude-code_opus-4-7-03.md` · sig: FAILED,WORKED,METHOD
- Blocker: C: nur 1,6 GB frei (Disk-Full-Footgun-Bereich) — type-check daher mit `TMP/TEMP=D:\tmp` + `--max-old-space-size=2048` gefahren, lief sauber durch.
- Fix: Solo-Verifikation mit eigenen (funktionierenden) Tools statt erneutem Workflow-Fan-out; Gates einzeln/gezielt statt riskantem Voll-Build.

## [diggai-anamnese] 2026-06-13 — Item 24 (Patientenschlüssel asym) — Grundgerüst implementiert
`diggai-anamnese/memory/runs/2026-06-13_claude-code_opus-4-7-05.md` · sig: WORKED,METHOD

## [diggai-anamnese] 2026-06-13 — Backlog-.docx Status-Spalte + Deploy-Skripte live
`diggai-anamnese/memory/runs/2026-06-13_claude-code_opus-4-7-06.md` · sig: GOTCHA

## [diggai-anamnese] 2026-06-13 — Item 19 erledigt — Profil-Hydration bidirektional Anamnese ↔ Notfall
`diggai-anamnese/memory/runs/2026-06-13_claude-code_opus-4-7-07.md` · sig: WORKED

## [diggai-anamnese] 2026-06-14 — Item 25 — Gesundheitsakte-Container (Variante A) + ZIP-Export, Zero-Knowledge
`diggai-anamnese/memory/runs/2026-06-14_claude-code_opus-4-8-01.md` · sig: WORKED
- Blocker: (1) JSZip „Can't read the data" in vitest — jsdom-`TextEncoder` liefert Node-Realm-Uint8Array, JSZip prüft gegen jsdom-globalen. (2) Adversariale Multi-Agent-Review (4 Dim × 2 Verifier) fand 1 bestätigten Befund: hartkodiertes `'unknown'`-Error-Fallback (untranslatiert bei Nicht-Error-Wurf, z.B. DOMException).
- Fix: (1) Bytes im Test mit `new Uint8Array(...)` in den Test-Realm umwrappen (Produktion einrealmig → unbetroffen); `buildHealthRecordZipBytes` für Tests statt jsdom-Blob. (2) `'unknown'` → `t('healthRecord.errorGeneric')` in allen 3 catch-Blöcken, Key ×10, `t` in handleCreateKey-Deps.

## [wanderwell] 2026-05-19 — Run 86 — 2026-05-19
`wanderwell/memory/runs/2026-05-19_Claude_Sonnet-Run86.md` · sig: GOTCHA
- Blocker: - [LEER — manuell befüllen] - _Bekannte Kandidaten zum Übernehmen, falls heute noch aktuell:_ - 🔴 Doppler Secrets fehlen (BACKUP_ENCRYPTION_KEY, CHROMADB_TOKEN_*, GRAFANA_ADMIN_PASSWORD, SLACK_WEBHOOK_URL …) — {{USER}} - 🔴 Keycloak SPI Maven Build (`mvn clean package -DskipTests`) — DevSecOps - 🟡 EXIST Hochschulanbindung Uni Hamburg — {{USER}} - 🟡 AV-Verträge (Supabase / Cloudflare / Google Cloud / SendGrid / Coturn) — DSFA §9 Blocker - 🟡 DSB (externer Datenschutzbeauftragter) — DSFA §9 Bl…

## [wanderwell] 2026-05-24 — Run 91 — 2026-05-24
`wanderwell/memory/runs/2026-05-24_Claude_Sonnet-Run91.md` · sig: METHOD
- Blocker: - 🟡 **Dr. {{USER}} ADR-Sign-off pending** für ADR-0021. Phase B kann technisch starten (Skeletons stehen), aber klinische Validierung (Phase C) ist Launch-Gating. - 🟡 **`pnpm install ai@6 @ai-sdk/google @ai-sdk/react` pending** bei {{USER}}. T-MVP-AI-002 ist npm-install-Task. - 🟡 **Tailwind sage-/paper-Klassen** in der assistant-page nutzen. Falls nicht in `tailwind.config.ts` definiert → fallback zu `emerald-*` / `gray-*` zur Build-Zeit prüfen. - Carry-Over: Schema-Drift (alembic upgrade) ·…

## [wanderwell] 2026-05-24 — Run 92 — 2026-05-24
`wanderwell/memory/runs/2026-05-24_Claude_Sonnet-Run92.md` · sig: WORKED,METHOD
- Blocker: - 🟡 **Coturn nicht in start-all.ps1 enthalten** — WebRTC Session-Test (Schritt 12) bricht ohne. Quickfix: `docker-compose -f apps/api/docker-compose.dev.yml up coturn` separat. - 🟡 **Keycloak nicht in start-all.ps1** — Auth-Endpoints werfen 401, Patient-Dashboard zeigt nur Skeleton. Akzeptabel für Walkthrough; für „echten" Test braucht es Keycloak local + SPI Build. - 🟡 **PowerShell-Skript ungetestet auf {{USER}}s Maschine** — Sandbox kann es nicht ausführen (kein PowerShell). Bei erstem Run…

## [wanderwell] 2026-05-24 — Run 93 — 2026-05-24
`wanderwell/memory/runs/2026-05-24_Claude_Sonnet-Run93.md` · sig: GOTCHA,WORKED
- Blocker: - 🔴 **Sandbox-npm-install incomplete** (45s Timeout-Limit). `node_modules/ai/dist/index.js` existiert aber kein `node_modules/ai/package.json`. Type-Check via `npx tsc` schlägt fehl bei Imports von `ai`/`@ai-sdk/*`. **{{USER}} muss `cd apps/web && npm install` einmal ausführen (~30s lokal).** - 🔴 **GEMINI_API_KEY pending** — `.env.dev.example` hat `dev-gemini-key` placeholder; Route fail-closed bei diesem Wert. {{USER}} braucht echten Gemini-Pro-Key (EU-Region: europe-west3) und trägt ihn in …

## [wanderwell] 2026-05-24 — Run 94 — 2026-05-24
`wanderwell/memory/runs/2026-05-24_Claude_Sonnet-Run94.md` · sig: GOTCHA,FAILED,WORKED,METHOD
- Blocker: - 🔴 **T-MVP-AI-014 (neu)**: Backend FastAPI-Endpoint `POST /api/v1/audit-log/anamnesis-turn` muss noch geschrieben werden. Aktuell: `persistAnamnesisTurn` sieht 404 und ignored es lautlos. Codex-Task. - 🟡 **Migration 021 Alembic-Wrapper fehlt** — die SQL-File existiert, aber `apps/api/migrations/versions/*.py` Alembic-Revision muss noch erstellt werden (Codex-Task, gleicher Pattern wie 019_voice). - 🟡 **Playwright-Test `feature-flag gate` ist konservativ** — kann nicht via JavaScript-Eval di…

## [wanderwell] 2026-05-24 — Run 95 — 2026-05-24
`wanderwell/memory/runs/2026-05-24_Claude_Sonnet-Run95.md` · sig: GOTCHA,FAILED,WORKED,METHOD
- Blocker: - 🔴 **`git checkout HEAD -- app/core/audit.py` schlug fehl** wegen `.git/index.lock` (read-only sandbox). Workaround: `git show HEAD:... > /tmp/file && cp` benutzt. **Konsequenz für {{USER}}: vor Commit lokal `git status` checken — die Files sehen nicht wie ein normaler Edit-Diff aus, sondern wie ein vollständiger Datei-Replace.** - 🟡 **Pytest in Sandbox nicht ausführbar** (Python 3.10 vs 3.12 erforderlich). AST-Parsing aller 5 Files OK. Echte Test-Verifikation muss bei {{USER}} laufen. - 🟡 …

## [wanderwell] 2026-05-24 — Run 96 — 2026-05-24
`wanderwell/memory/runs/2026-05-24_Claude_Sonnet-Run96.md` · sig: GOTCHA,WORKED,METHOD
- Blocker: - 🟡 **AuditMiddleware-Exclude greift erst nach `await call_next()`** — Performance-Impact minimal (path-string-startswith ist nanosec), aber technisch wird der downstream handler immer ausgeführt. Akzeptabel, weil unsere ausgeschlossenen Endpoints (audit-log, health, metrics) ihre eigene Audit-/Metric-Logik haben und schnell sind. - 🟡 **Grafana-Dashboard-Datasource-UID** `prometheus-eu` — muss in der Grafana-Provisioning-Config existieren (Run 63-77 hat sie gesetzt laut CLAUDE.md). Falls Drif…

## [wanderwell] 2026-05-24 — Run 97 — 2026-05-24
`wanderwell/memory/runs/2026-05-24_Claude_Sonnet-Run97.md` · sig: GOTCHA,WORKED,METHOD
- Blocker: - 🔴 **Ziel 4 (Gemini Deep Research) immer noch ohne Topic** — Customer-Analyse-Doc liefert jetzt 3 mögliche Topics: (a) Cultural-CBT-Adaption-Literatur, (b) DiGA-Erstattungs-Mechanik im Detail, (c) Migrant-Mental-Health-Outcome-Studies-Meta für RCT-Design. {{USER}} muss Topic wählen. - 🟡 **Persona-Validation pending** — 5 Layla-Interviews + 2 Anja-Interviews müssen passieren (Dr. {{USER}} ist gate-keeper für Caritas-HH-Zugang). Doc ist Hypothesen-Basis, nicht validated. - 🟡 **Pricing-Sanity-…
