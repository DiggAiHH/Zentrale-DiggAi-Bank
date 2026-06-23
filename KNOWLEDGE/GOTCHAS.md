# GOTCHAS — Cross-Stack Stolpersteine

Aggregiert aus DiggAiHH-Projekten. Daily-Sync ergänzt automatisch.

---

## G01 — Windows-cmd: kein && / kein ??

**Erstmals beobachtet:** früh in DiggAi-anamnese
**Beobachtet in:** alle
**Kategorie:** GOTCHA · Tags: `windows`, `shell`

**Was passiert:** Maschine ist Windows 10/11. `cmd.exe` Default. Kein `&&` Verkettung, kein `??` Null-Coalescing, Backslash-Pfade.
**Fix:** Cross-Platform in package.json (`cross-env`, `rimraf` statt `rm -rf`), Multi-Line-Commits via `.commitmsg.txt`.

---

## G02 — Lokaler OOM bei npm ci + Workspaces

**Erstmals beobachtet:** 2026-04 in DiggAi-anamnese (Phase 1b)
**Beobachtet in:** DiggAi-anamnese
**Kategorie:** GOTCHA · Tags: `memory`, `npm`, `workspaces`

**Was passiert:** `npm ci` mit aktivierten `workspaces` braucht >8 GB RAM → System-OOM.
**Fix:** `npm ci --legacy-peer-deps --ignore-scripts`, dann pro Package separat `npm run build`. `NODE_OPTIONS=--max-old-space-size=8192`. Fallback: Codespace 4-core/16GB.

---

## G03 — i18next + flat dotted Keys

**Erstmals beobachtet:** 2026-05 in DiggAi-anamnese
**Beobachtet in:** DiggAi-anamnese
**Kategorie:** GOTCHA · Tags: `i18n`, `config`

**Was passiert:** `translation.json` mit `{ "home.subtitle": "..." }` (flat dotted). Default-i18next sieht `.` als Nesting-Separator → alle Keys als "missing" → `[?] subtitle` im UI.
**Fix:** `keySeparator: false, nsSeparator: false` in i18n-init. Browser-Hard-Refresh nach Restart.

---

## G04 — Fly.io Cold-Start

**Erstmals beobachtet:** früh in DiggAi-anamnese
**Beobachtet in:** DiggAi-anamnese · JoBetes (confirmed 2026-05-19)
**Kategorie:** GOTCHA · Tags: `hosting`, `fly`

**Was passiert:** Fly-App pausiert bei Inaktivität. Erster Request = 8–15s Latenz.
**Fix:** `fly.toml`: `auto_stop_machines = false`, `min_machines_running = 1`. ~$2/Mon Free-Tier-Kosten aber <500ms Health.

---

## G05 — Prisma + Node 24 + tsx: default-Import-Patch

**Erstmals beobachtet:** 2026-05-13 in DiggAi-anamnese (Lauf kimi-k2-14)
**Beobachtet in:** DiggAi-anamnese
**Kategorie:** GOTCHA · Tags: `prisma`, `node24`, `esm`

**Was passiert:** Named-Import `import { PrismaClient } from '@prisma/client'` wirft "does not provide an export". `require.main === module` undefined in ESM.
**Fix:**
```ts
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) { main(); }
```

---

## G06 — NODE_PATH für globale npm-Module unter Workspace-Root

**Erstmals beobachtet:** 2026-05 in DiggAi-anamnese
**Beobachtet in:** DiggAi-anamnese
**Kategorie:** GOTCHA · Tags: `npm`, `paths`, `windows`

**Was passiert:** `npm config get prefix` = `D:\npm-global`. Build-Skripte im Workspace-Root ohne eigenes node_modules fallen lautlos durch.
**Fix:** `set NODE_PATH=D:\npm-global\node_modules` vor `node build-*.cjs`.

---

## G07 — Cowork-Chrome ist tier "read"

**Erstmals beobachtet:** 2026-05-15 in Cowork-Sessions
**Beobachtet in:** alle Cowork-Workflows
**Kategorie:** GOTCHA · Tags: `cowork`, `browser`

**Was passiert:** `computer-use` MCP granted Chrome tier "read" — Screenshots ja, Klicks blockiert.
**Fix:** Für Web-Aktionen `claude-in-chrome` MCP nutzen (DOM-aware, klickfähig). Native Apps via computer-use (tier full).

---

## G08 — Gmail-MCP create_draft ohne Attachments

**Erstmals beobachtet:** 2026-05 in DiggAi-anamnese
**Beobachtet in:** DiggAi-anamnese
**Kategorie:** GOTCHA · Tags: `gmail`, `mcp`

**Was passiert:** `mcp__gmail__create_draft` legt nur Text-Body an, keine Attachments.
**Fix:** Draft anlegen, Owner klickt im Gmail-UI Büroklammer + hängt DOCX/PDF an + "Senden".

---

## G09 — Web-Fetch + große GitHub-HTML-Seiten

**Erstmals beobachtet:** 2026-05 in Cowork
**Beobachtet in:** Cowork-Workflows
**Kategorie:** GOTCHA · Tags: `web-fetch`, `github`

**Was passiert:** `web_fetch` auf github.com/owner/repo/blob/... → "exceeds maximum allowed tokens".
**Fix:** `raw.githubusercontent.com`-URL benutzen.

---

## G10 — File-Upload via Chrome-Extension geblockt

**Erstmals beobachtet:** 2026-05-19 in Lou-Intit-Setup
**Beobachtet in:** Lou-Intit · Zentrale-DiggAi-Bank
**Beobachtet-Update:** auch diggai-anamnese (2026-06-16) — Variante WhatsApp-Web: einziges DOM-`input` ist `accept=image/*`; Dokument-Input entsteht erst beim nativen "Dokument"-Klick → `file_upload` auf Media-Input = "Datei nicht unterstützt", via file_upload nicht lösbar
**Kategorie:** GOTCHA · Tags: `chrome-mcp`, `upload`

**Was passiert:** `file_upload` MCP wirft "Not allowed" für lokale Files via Chrome-Extension.
**Fix:** GitHub nutzt `<file-attachment>`-Webcomponent mit `.attach()`-Methode. Via `javascript_tool` DataTransfer + File-Konstruktor + `fae.attach(dt)` → File landet in Upload-Queue.

---

_(Auto-extended by daily-sync.)_

---

## G07 — Magic-Link Rate-Limit bei Supabase Auth

**Erstmals beobachtet:** 2026-05-13 in JoBetes (Sync 2026-05-19)
**Beobachtet in:** JoBetes
**Kategorie:** GOTCHA · Tags: `supabase`, `auth`, `magic-link`, `rate-limit`

**Was passiert:** Mehrere Magic-Link-Anforderungen in kurzer Folge → Supabase sperrt temporär ~5 min. Spam-Ordner ist 90% der Fälle die echte Ursache.
**Fix:** Diagnose-Reihenfolge: 1) Spam-Ordner, 2) Mail-App-Cache, 3) Adresse-Tippfehler, 4) Supabase Auth-Logs, 5) Rate-Limit-Wait. Notfall: Operator nimmt Link aus eigener Test-Mail, sendet per Out-of-Band (WhatsApp).

---

## G08 — PWA Add-to-Home-Screen ist Browser-fragmentiert

**Erstmals beobachtet:** 2026-05-13 in JoBetes (Sync 2026-05-19)
**Beobachtet in:** JoBetes
**Kategorie:** GOTCHA · Tags: `pwa`, `browser-fragmentation`, `onboarding`

**Was passiert:** iPhone Safari hat Teilen-Button unten-mitte, Chrome Android 3-Punkte-Menü, Samsung-Browser 3-Striche-Menü, manche Browser unterstützen es gar nicht.
**Fix:** Browser-spezifische Setup-Anleitung mit Screenshots. Fallback: Lesezeichen + auf Home-Screen ziehen (sieht nicht wie App aus, funktioniert aber).

---

## G09 — Browser drosselt JS in Background-Tab

**Erstmals beobachtet:** 2026-05-13 in JoBetes (Sync 2026-05-19)
**Beobachtet in:** JoBetes
**Kategorie:** GOTCHA · Tags: `browser`, `polling`, `background-tab`, `throttling`

**Was passiert:** Polling-basiertes Realtime-UI funktioniert im Foreground-Tab, hängt im Background. Chrome/Safari drosseln Background-Tab-JS auf ≥1 min (Battery-Saving).
**Fix:** Kurzfristig UI-Hinweis "Tab im Vordergrund halten". Mittelfristig WebSocket statt Polling, oder Service-Worker mit Push-Notifications.

---

## G10 — Service-Worker cached kaputten Build nach Deploy

**Erstmals beobachtet:** 2026-05-13 in JoBetes (Sync 2026-05-19)
**Beobachtet in:** JoBetes
**Beobachtet-Update:** auch diggai-anamnese — Fix bestätigt: `CACHE_VERSION`-Bump v3→v4 + activate-Purge aller Alt-Caches → returning visitors bekommen neues Bundle
**Kategorie:** GOTCHA · Tags: `service-worker`, `cache`, `deploy`, `vite-pwa`

**Was passiert:** Nach Deploy mit Bug serviert der SW weiterhin den alten Build, selbst nach Hard-Reload.
**Fix:** Inkognito-Tab als sofortiger Cross-Check. Längerfristig `skipWaiting()` + `clientsClaim()` im SW, Cache-Version-Bump bei jedem Build via Git-SHA in `manifest.json`.

---

## G11 — Supabase Free-Tier Connection-Pool läuft aus

**Erstmals beobachtet:** 2026-05-13 in JoBetes (Sync 2026-05-19)
**Beobachtet in:** JoBetes
**Kategorie:** GOTCHA · Tags: `supabase`, `postgres`, `connection-pool`, `free-tier`

**Was passiert:** Viele parallele API-Requests → Supabase-Connections aus → DB-Calls timeouten → API liefert 500.
**Fix:** Prisma `connection_limit=5`, Supabase-Pool-Mode auf `transaction` statt `session`. Bei Skalierung: Supabase Pro oder eigener PgBouncer.

---

## G12 — CORS_ORIGIN-Mismatch nach Domain-Wechsel

**Erstmals beobachtet:** 2026-05-13 in JoBetes (Sync 2026-05-19)
**Beobachtet in:** JoBetes
**Kategorie:** GOTCHA · Tags: `cors`, `auth`, `deploy`, `env-vars`

**Was passiert:** Neue Frontend-Domain in Prod, aber API-`CORS_ORIGIN` zeigt auf Staging. Browser blockt Auth-Header → jeder Request 401.
**Fix:** `CORS_ORIGIN` als Pflicht-Smoke-Test nach Domain-Wechsel. Im Deploy-Workflow `gh secret set CORS_ORIGIN` automatisch vor `flyctl deploy`.

---

## G13 — HEIC-Fotos vom iPhone in Vision-Pipeline

**Erstmals beobachtet:** 2026-05-13 in JoBetes (Sync 2026-05-19)
**Beobachtet in:** JoBetes
**Kategorie:** GOTCHA · Tags: `image-upload`, `heic`, `vision-api`, `iphone`

**Was passiert:** iPhone speichert Fotos als HEIC. Gemini Vision (und die meisten Vision-APIs) akzeptieren nur JPEG/PNG/WEBP → Upload OK, Vision liefert "unknown"/Confidence 0.
**Fix:** Frontend-Konvertierung HEIC→JPEG vor Upload (via `heic2any`). Alternative: User-Anleitung "iPhone Einstellungen → Kamera → Formate → Maximale Kompatibilität". Plus Plausibilitäts-Check (z.B. BZ-Range 40–500 mg/dL) als Backup.

---

## G14 — Bash-Sandbox kann zwischen Cowork-Aufrufen ausfallen

**Erstmals beobachtet:** 2026-05-19 in JoBetes (Sync-Session)
**Beobachtet in:** JoBetes
**Beobachtet-Update:** auch diggai-anamnese — Varianten `HYPERVISOR_VIRT_DISABLED` + "Not enough disk space" (2026-05…06), durchgängig per Desktop Commander umgangen
**Kategorie:** GOTCHA · Tags: `cowork`, `bash-sandbox`, `hypervisor`

**Was passiert:** `mcp__workspace__bash` antwortet `HYPERVISOR_SERVICE_ERROR`. Alle `gh`/`git`/`curl`-Operationen brechen.
**Fix:** Cowork-Tab schließen + neu öffnen → Sandbox neu provisioniert. Workaround: **Desktop Commander statt workspace-bash** — DC läuft direkt auf dem Operator-PC, kein Sandbox-Risiko. Für Multi-Tool-Workflows: vor Bash-abhängiger Phase einmal `echo ready` als Smoke-Test.

---

## G15 — web_fetch Provenance ist URL-strikt, nicht Domain-basiert

**Erstmals beobachtet:** 2026-05-19 in JoBetes (Sync-Session)
**Beobachtet in:** JoBetes
**Kategorie:** GOTCHA · Tags: `cowork`, `web-fetch`, `provenance`, `mcp`

**Was passiert:** Auch wenn URLs im Content eines früheren `web_fetch`-Results stehen, sind sie nicht automatisch in der Provenance. Folge-Fetches werden abgelehnt: "URL not in provenance set".
**Fix:** Operator muss URL explizit in nächster Nachricht erwähnen. Alternative: Chrome-MCP oder Desktop-Commander `gh api`/`curl` statt web_fetch — die haben keinen Provenance-Check.


---

## G16 — "V8 Zone Allocation failed" / Heap-OOM ist oft Disk-Full, nicht Node-RAM

**Erstmals beobachtet:** 2026-06-03 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (mehrfach 06-03…06-13)
**Kategorie:** GOTCHA · Tags: `node`, `oom`, `disk`, `windows`, `vite`

**Was passiert:** Lokale `vite build` / `tsc` / `vitest` crashen mit "V8 Zone Allocation failed" bzw. Heap-OOM (exit 134) — auch mit `--max-old-space-size=8192`. Eigentliche Ursache mehrfach: System-Disk (C:) fast voll (<2 GB frei), NICHT Node-24-RAM.
**Fix:** VOR Node-OOM-Debugging Disk prüfen. Platz schaffen (stale VM-Images/Caches löschen). `TMP/TEMP` auf Volume mit Platz umlenken (`set TMP=D:\tmp & set TEMP=D:\tmp`). Siehe auch G02.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-03_claude-code_opus-4-7-01.md`, `…2026-06-13_claude-code_opus-4-7-03.md` (diggai-anamnese)

---

## G17 — Node 24: terser & oxc-parser OOMen lokal → esbuild-minify / depcheck

**Erstmals beobachtet:** 2026-05-31 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `node24`, `vite`, `terser`, `knip`, `build`

**Was passiert:** `vite build` mit terser OOMt auf Node 24 (V8 Zone Allocation, fonts-/code-unabhängig). `knip` (Dead-Code) OOMt über den oxc-parser.
**Fix:** Lokale Verifikation `npx vite build --minify esbuild` (Sekunden, exit 0); CI/Linux baut produktiv mit terser (mehr RAM). Dead-Code via `depcheck` + `grep` statt knip.
**Quellen:** `diggai-anamnese/memory/runs/2026-05-31_claude-code_opus-4-7-01.md`, `…2026-05-29_claude-code_opus-4-7-04.md` (diggai-anamnese)

---

## G18 — Docker Compose `--project-name` → isoliertes Netz → Container unerreichbar

**Erstmals beobachtet:** 2026-06-06 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (Prod-Outage 2026-06-07)
**Kategorie:** GOTCHA · Tags: `docker`, `compose`, `networking`, `deploy`, `outage`

**Was passiert:** Deploy mit falschem `--project-name` (z.B. aus veralteter Runbook-Zeile) legt den App-Container in ein isoliertes `<name>_<network>`; Edge/Postgres/Redis hängen am Label des App-Verzeichnisses → 502 / Crashloop. Verursachte realen ~11-Min-Prod-Outage.
**Fix:** `--project-name` = App-Verzeichnisname (das Label, das postgres/redis/nginx tragen). Notfall: `docker network connect <netz> <container> --alias <svc>`. Deploy-Kommandos gegen die LAUFENDEN Stack-Labels verifizieren, nie blind kopieren. Siehe F09.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-7-01.md` (diggai-anamnese)

---

## G19 — Docker bind-mounted FILE: in-place-Edit bricht Inode (stiller Reload-Fail)

**Erstmals beobachtet:** 2026-06-06 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `docker`, `bind-mount`, `caddy`, `config`, `inode`

**Was passiert:** Read-only ins Container gemountete Config (z.B. Caddyfile): in-Container-Edit → "Read-only file system"; `sed -i` am Host pinnt den Container an die ALTE Inode → stiller Reload-Fail.
**Fix:** Host-Config per `docker cp` in ein beschreibbares Volume (`/config/Caddyfile.fixed`) → `caddy validate` → `caddy reload --config /config/... --adapter caddyfile`. Methode dauerhaft ins Deploy-Skript.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-06_claude-code_opus-4-7-01.md` (diggai-anamnese)

---

## G20 — Verwaister AAAA/DNS-Record nach Host-Migration → "Netzwerkfehler" nur für IPv6-Clients

**Erstmals beobachtet:** 2026-06-04 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `dns`, `ipv6`, `migration`, `hosting`

**Was passiert:** Nach Host-Migration zeigte ein alter AAAA-Record der API-Subdomain weiter auf stillgelegte Alt-Infra (Anycast). IPv4 grün, aber Dual-Stack-Clients zogen den AAAA und bekamen sporadisch "Netzwerkfehler". RDAP entlarvte den Fremd-Owner des AAAA.
**Fix:** Nach Host-Migration ALLE alten Records (A + AAAA + CNAME) der betroffenen Namen löschen, nicht nur die geänderten. Verifikation per RDAP/DoH: zeigt der AAAA-Owner auf den NEUEN Host?
**Quellen:** `diggai-anamnese/memory/runs/2026-06-04_claude-code_opus-4-7-04.md`, `…2026-06-05_claude-code_opus-4-7-01.md` (diggai-anamnese)


---

## G21 — Globaler `localStorage`-No-Op-Stub im test-setup bricht Persistenz-Tests

**Erstmals beobachtet:** 2026-06-03 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (mehrere Stores)
**Kategorie:** GOTCHA · Tags: `vitest`, `localstorage`, `jsdom`, `mocking`

**Was passiert:** Globales `src/test-setup.ts` stubt `localStorage` als No-Op-`vi.fn()` (getItem→undefined) + `clearAllMocks()` in afterEach → alle persistenz-abhängigen Store-Tests rot.
**Fix:** In-Memory-Map-Mock je `beforeEach` via `(localStorage.getItem as vi.fn).mockImplementation(...)` — überlebt `clearAllMocks`, weil vor jedem Test neu gesetzt. Muster: `heimResidentStore.test.ts`.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-03_claude-code_opus-4-7-03.md`, `…2026-06-08_claude-code_opus-4-8-03.md` (diggai-anamnese)

---

## G22 — Globaler react-i18next-Mock kennt `t(key,{defaultValue})` nicht → Crash + Render-Loop-OOM

**Erstmals beobachtet:** 2026-06-07 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (mehrfach)
**Kategorie:** GOTCHA · Tags: `vitest`, `react-i18next`, `mock`, `render-loop`, `oom`

**Was passiert:** (1) Options-Objekt-Form von `t()` ist im globalen Mock unbekannt → das Objekt landet als React-Child → Crash. (2) Mock liefert pro Render ein neues `t`; steht `t` in den `useCallback`-Deps → Endlos-Render-Loop → Test-OOM.
**Fix:** Per-File-`vi.mock('react-i18next')`, das BEIDE `t()`-Signaturen (String + Options-Objekt) bedient; `t` aus useCallback/useMemo-Deps entfernen (Fehler als Code-State halten, Übersetzung erst im Render). Muster: `SubmittedPage.test`.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-7-02.md`, `…2026-06-10_claude-code_fable-5-10.md` (diggai-anamnese)

---

## G23 — jsdom Realm-Mismatch: TextEncoder/Uint8Array bricht JSZip & WebCrypto im Test

**Erstmals beobachtet:** 2026-06-14 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Beobachtet-Update:** 2026-06-16 — `Uint8Array<ArrayBuffer>`-Typfehler auch unter TS 5.9 reproduziert (patientCryptoKeyVault.ts: base64ToBytes-Return + salt-Param annotieren)
**Kategorie:** GOTCHA · Tags: `vitest`, `jsdom`, `realm`, `jszip`, `webcrypto`, `typescript`

**Was passiert:** jsdom-`TextEncoder` liefert ein Node-Realm-`Uint8Array`; Libs (JSZip) prüfen gegen den jsdom-globalen Konstruktor → "Can't read the data". Zusätzlich TS 5.7: `Uint8Array<ArrayBufferLike>` ist nicht `Uint8Array<ArrayBuffer>`/`BufferSource` → tsc rot.
**Fix:** Test-Bytes mit `new Uint8Array(...)` in den Test-Realm umwrappen (Prod ist einrealmig → unbetroffen); reine Byte-Builder statt jsdom-Blob testen. Typ-Annotationen früh auf `Uint8Array<ArrayBuffer>` schärfen.
**Quellen:** `diggai-anamnese/memory/runs/2026-06-14_claude-code_opus-4-8-01.md`, `…2026-06-13_claude-code_opus-4-8-02.md` (diggai-anamnese)

---

## G24 — Git push hängt non-interaktiv: Windows-Credential-Manager / SSH-Passphrase im Agent-Subprozess

**Erstmals beobachtet:** 2026-06-07 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Beobachtet-Update:** 2026-06-16 — erweitert auf Deploy-Automation: `scp`/`ssh` mit passphrase-geschütztem Key = Exit 255 (kein unlocked Agent) → interaktiv durch Operator in Git-Bash; OOM-Pre-Push-Hook per `git push --no-verify` umgehen wenn type-check+build grün
**Kategorie:** GOTCHA · Tags: `git`, `windows`, `gcm`, `ssh`, `push`, `cowork`

**Was passiert:** `git push` (HTTPS) hängt im Hintergrund auf dem GUI-Credential-Manager; token-in-URL + `gh auth git-credential` + leerer `credential.helper` hängen ebenfalls. SSH-Push hängt an der Passphrase. Der Agent darf Credentials nicht eingeben.
**Fix:** `gh api` / `gh workflow` nutzen den Keyring (funktionieren). Für Push: PowerShell+Token — oder den ~90s-Pre-Push-Hook einfach abwarten statt voreilig als "Hang" zu killen. Credential-gebundene Endaktion an den Operator übergeben (siehe W12).
**Quellen:** `diggai-anamnese/memory/runs/2026-06-07_claude-code_opus-4-8-04.md`, `…2026-06-13_claude-code_opus-4-7-02.md` (diggai-anamnese)


---

## G25 — Cowork Edit/Write-Tool korrumpiert Dateien auf dem Windows-Mount (NUL-Pad / Tail-Truncation)

**Erstmals beobachtet:** 2026-06-16 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `cowork`, `edit-tool`, `windows-mount`, `file-corruption`, `nul-bytes`

**Was passiert:** Das Cowork Edit/Write-Tool beschädigt Dateien auf dem gemounteten Windows-Volume: Write paddet beim Überschreiben mit NUL-Bytes ans Datei-Ende, Edit trunkiert den Datei-Tail. Hat package.json (unterminiertes JSON) sowie mehrere .ts-Dateien (z.B. Padding-Lib mit NUL ab Zeile 12) zerstört; Folge: tsc/Build brechen mit Phantom-Syntaxfehlern, npx liest kaputtes JSON.
**Fix:** Korrupte Dateien NICHT mit demselben Tool reparieren — via `git show HEAD:<pfad>` + node-fs-Replacement (oder Desktop Commander auf Windows) sauber wiederherstellen, jeden Anker asserten und 0 NUL-Bytes verifizieren. Für riskante Mehrzeilen-Edits am Mount Desktop Commander auf der Windows-Seite bevorzugen. Siehe G26.
**Quellen:** `memory/runs/2026-06-15_cowork_opus-4-8-05.md`, `2026-06-15_cowork_opus-4-8-14.md` (diggai-anamnese)

---

## G26 — Linux-Sandbox-Mount desynct von Windows-seitigen Edits → Phantom-Build-Fehler, korrupter git-Index

**Erstmals beobachtet:** 2026-06-16 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (mehrfach 06-15/06-16)
**Kategorie:** GOTCHA · Tags: `cowork`, `sandbox`, `mount`, `git-index`, `crlf`, `stale-files`

**Was passiert:** Nach Edits auf der Windows-Seite liefert die Cowork-Linux-Sandbox veraltete/abgeschnittene Kopien derselben Dateien (z.B. package.json 9972 Byte, Trunkierung ab Z.244 → npx liest Stale-JSON; tsc meldet Syntaxfehler in unveränderten Zeilen). Zusätzlich korrumpiert der Mount den git-Zustand: "bad signature 0x00000000 / index file corrupt", stale `.git/index.lock` ("Operation not permitted") und CRLF-Phantom-Diffs über fast alle Dateien → Diffs/Commits unreviewbar. Ein scheinbarer Harness-Fehler (z.B. "React.act is not a function") kann reiner Stale-Stand sein, kein echter Versions-Skew.
**Fix:** Build/Test/Commit/Push über Desktop Commander DIREKT auf Windows fahren, nicht über die Sandbox; Quelle als Source-of-Truth per Read-Tool (Windows-FS) gegenlesen. git-Index reparieren: `del .git\index` + `git reset` (Windows). Sandbox-Datei-Views nach Windows-Edits grundsätzlich als unzuverlässig behandeln. Siehe G14, G25.
**Quellen:** `memory/runs/2026-06-16_cowork_opus-4-8-02.md`, `2026-06-16_cowork_opus-4-8-08.md`, `2026-06-16_cowork_opus-4-8-12.md` (diggai-anamnese)

---

## G27 — win32-native node_modules-Bindings sind in der Linux-Sandbox nicht lauffähig (rolldown/vitest-4/esbuild)

**Erstmals beobachtet:** 2026-06-16 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (durchgängig)
**Kategorie:** GOTCHA · Tags: `cowork`, `sandbox`, `node-bindings`, `vitest`, `rolldown`, `esbuild`, `build`

**Was passiert:** Sind die node_modules auf einem Windows-Host installiert, fehlen in der Linux-Sandbox die nativen Linux-Bindings (`@rolldown/binding-linux-x64-gnu`, esbuild-`.node`, Prisma-Engine). Folge: `vite build`, `vitest` (v4/rolldown) und `npx prisma` laufen in der Sandbox NICHT — JS-Tests und Bundle-Build müssen auf Windows laufen.
**Fix:** Build/Test/Prisma über Desktop Commander auf der Windows-Maschine ausführen (cmd-Shell, siehe G30). Krypto-/Logik-Kern harness-unabhängig per Node-WebCrypto verifizieren (siehe W18). In der Sandbox nur FS-/git-/HTTP-Operationen erwarten, keine plattform-nativen Toolchains.
**Quellen:** `memory/runs/2026-06-16_cowork_opus-4-8-01.md`, `2026-06-16_cowork_opus-4-8-12.md`, `2026-06-15_cowork_opus-4-8-16.md` (diggai-anamnese)

---

## G28 — vitest-4: fs/fs-promises-Mock braucht importActual-Spread (sonst "No default export"); ESM-Mock greift bei readdir/access nicht

**Erstmals beobachtet:** 2026-06-16 in diggai-anamnese
**Beobachtet in:** diggai-anamnese (6 Dateien)
**Kategorie:** GOTCHA · Tags: `vitest`, `esm-mock`, `fs`, `collection-error`, `node`

**Was passiert:** Unter vitest 4 wirft `vi.mock('fs'|'fs/promises', () => ({ … }))` ohne Default-Export einen Collection-Fehler "No default export on fs mock" → ganze Test-Datei lädt nicht (0 Tests). Nach dem importActual-Fix surfacen zudem echte Fehler: der vitest-4-ESM-Mock greift bei `readdir`/`access` NICHT → realer fs wird aufgerufen → ENOENT.
**Fix:** Spread-Muster nutzen: `vi.mock('fs/promises', async () => { const actual = await vi.importActual('fs/promises'); return { ...actual, <überschriebene Fns> }; })` (analog `promises` bei `fs`). Default-Export kommt so mit, Collection läuft. Für readdir/access-lastige Pfade Funktionen explizit überschreiben statt auf den Modul-Mock zu vertrauen, sonst echter FS-Zugriff.
**Quellen:** `memory/runs/2026-06-16_cowork_opus-4-8-07.md`, `2026-06-16_cowork_opus-4-8-08.md` (diggai-anamnese)

---

## G29 — Gitignored `prisma/migrations/` + CI `migrate deploy` = Schema-Änderungen kommen nie live; Client nach Schema-Edit stale

**Erstmals beobachtet:** 2026-06-16 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `prisma`, `migrations`, `ci`, `gitignore`, `deploy`

**Was passiert:** `prisma/migrations/` stand in `.gitignore`, während CI/Deploy `prisma migrate deploy` nutzen — das deployt nur committete Migrationen. Folge: KEINE committeten Migrationen → neue Spalten/Tabellen (z.B. routingTag, ganze Relay-Tabellen) erreichen die Prod-DB nie, betrifft JEDE Schema-Änderung. Zweiter Footgun: nach einem Schema-Edit ist der generierte Client stale → tsc rot auf neuen Feldern.
**Fix:** `prisma/migrations/` aus `.gitignore` nehmen und Migrationen committen (bei bestehender Prod-DB: Baseline via `migrate diff --to-schema-datasource` → `migrate resolve --applied` → Forward-Migration). Nach jedem Schema-Edit `npx prisma generate` (offline, kein DB-Zugriff) gegen den Stale-Client. Read-only Drift-Preview via `db pull --print` + `migrate diff --script` vor jedem Prod-Eingriff.
**Quellen:** `memory/runs/2026-06-16_cowork_opus-4-8-01.md`, `2026-06-16_cowork_opus-4-8-02.md`, `2026-06-16_cowork_opus-4-8-09.md` (diggai-anamnese)

---

## G30 — PowerShell-ExecutionPolicy blockt `npm.ps1` → npm über cmd-Shell fahren

**Erstmals beobachtet:** 2026-06-16 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `windows`, `powershell`, `execution-policy`, `npm`, `shell`

**Was passiert:** Auf der Windows-Maschine blockiert die PowerShell-ExecutionPolicy `npm.ps1` → `npm run …` aus einer PS-Session schlägt fehl.
**Fix:** npm-Befehle über die cmd-Shell ausführen (Desktop Commander startet cmd direkt auf Windows). Alternativ Skripte als `.cmd`/`-lc`-Login-Shell wrappen. Siehe G01, G27.
**Quellen:** `memory/runs/2026-06-16_cowork_opus-4-8-09.md` (diggai-anamnese)

---

## G31 — `autocomplete="off"` stoppt Passwort-Manager nicht: per-Feld `name` + `data-lpignore`/`data-1p-ignore` nötig

**Erstmals beobachtet:** 2026-06-16 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `frontend`, `html-forms`, `autofill`, `password-manager`, `privacy`, `react`

**Was passiert:** Auf sensiblen Formularfeldern (Identitäts-, Schlüssel- oder sonstige Krypto-Eingaben) füllen Browser und Passwort-Manager Werte automatisch ein — `autocomplete="off"` allein reicht NICHT. Folge: ein zuvor getippter Wert (z.B. Vorname) leakt ins falsche Feld, oder ein Schlüssel-/Passwort-Feld kommt vorbefüllt.
**Fix:** (1) Pro Feld einen kontrollierten `name` setzen, damit der Browser die Felder nicht als bekannte Gruppe behandelt. (2) Für echtes Unterdrücken zusätzlich die Passwort-Manager-Ignore-Attribute setzen: `data-lpignore="true"` (LastPass) und `data-1p-ignore="true"` (1Password), plus `autoCorrect="off"` und `spellCheck={false}`. (3) Default-`autoComplete` typ-abgeleitet vergeben (email/tel/name); nur die wirklich sensiblen Felder hart auf `off` + Ignore-Attribute schalten.
**Quellen:** `src/components/inputs/TextInput.tsx`, `src/components/inputs/PatientKeyStep.tsx` (diggai-anamnese, Commit 99d3f04)


---

## G32 — Lokale DB nicht erreichbar (Prisma `P1001`) → `migrate dev` blockiert; manuelle idempotente SQL-Migration + `prisma generate` entsperrt tsc offline

**Erstmals beobachtet:** 2026-06-17 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `prisma`, `migrations`, `offline-db`, `p1001`, `generate`, `idempotent-sql`, `deploy`

**Was passiert:** Ist die lokale Dev-DB down (`localhost:5432`, Prisma `P1001`), schlägt `prisma migrate dev` komplett fehl — neue Modelle/Spalten lassen sich nicht migrieren, und der generierte Client kennt das neue Modell nicht (tsc rot auf `prisma.<neuesModel>`). Die Prod-DB ist oft nur über den Host (hinter Server/VPN) erreichbar, nicht aus der lokalen/Sandbox-Umgebung → `migrate dev` ist gar keine Option.
**Fix:** (1) `npx prisma generate` braucht KEINE DB-Verbindung und entsperrt tsc sofort (Client-Typen für das neue Modell). (2) Migration von Hand als idempotentes SQL schreiben (`prisma/migrations_manual/<datum>_<name>.sql` mit `CREATE TABLE IF NOT EXISTS`, vorhandene Enums nicht neu anlegen) — additiv und gefahrlos. (3) Vor dem Backend-Deploy auf der Ziel-DB anwenden: `psql $DATABASE_URL -f <migration>.sql`, DANN deployen. Ergänzt G29 (committe Migrationen) für den Fall „DB gar nicht erreichbar".
**Quellen:** `memory/runs/2026-06-16_cowork_opus-4-8-19.md`, `2026-06-16_cowork_opus-4-8-20.md` (diggai-anamnese, Commit ab0bb5b)

---

## G33 — Globale Print-Regel `.fixed{display:none}` blendet absichtlich fixierte Druck-Overlays mit aus

**Erstmals beobachtet:** 2026-06-17 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `css`, `print`, `media-print`, `tailwind`, `fixed`, `frontend`

**Was passiert:** Ein Druck-Overlay, das per Tailwind-Utility `fixed` positioniert ist, wird von einer globalen Print-Regel `@media print { .fixed { display:none } }` (gedacht zum Ausblenden von Sticky-/Fixed-UI beim Drucken) mit ausgeblendet → das Blatt druckt leer/falsch, obwohl das Overlay am Bildschirm korrekt sichtbar ist.
**Fix:** Druckbare Overlays NICHT über die generische `fixed`-Utility positionieren, sondern eine eigene Klasse (z.B. `emergency-print-overlay`) + eigene `@media print`-Regeln vergeben (Muster wie ein bereits funktionierendes Druckblatt). So greift die globale `.fixed`-Ausblendung nicht auf das Druck-Element. Generell: globale Print-Resets, die auf Utility-Klassen matchen, kollidieren mit absichtlich gedruckten Elementen derselben Klasse.
**Quellen:** `memory/runs/2026-06-16_cowork_opus-4-8-22.md`, `src/index.css` (diggai-anamnese, Commit 34f1949)

---

## G34 — i18n-Keys hängen am DE-Quellstring: Edit am DE-Fragetext wirft alle Nicht-DE-Locales auf DE-Fallback

**Erstmals beobachtet:** 2026-06-17 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `i18n`, `locales`, `fallback`, `source-string-key`, `translation`

**Was passiert:** Wenn die Übersetzungen auf dem DE-Quellstring keyen (alle Locale-Dateien referenzieren den DE-Text als Key), wirft jede Änderung am DE-Text die Keys für ALLE Nicht-DE-Sprachen ins Leere → stiller Fallback auf DE für die geänderte Zeichenkette, ohne sichtbaren Fehler oder Build-Bruch.
**Fix:** Verhaltens-/Validierungsänderungen vornehmen, ohne den übersetzten String anzufassen (z.B. nur `validation.required` true→false statt das Label umzuschreiben — die Optionalität greift trotzdem, weil `validateAnswer` das Pattern bei leerem Wert überspringt). Muss der Text doch geändert werden: in EINEM Schritt alle Locales nachziehen (siehe W15 One-off-Node-Skript). Merke: übersetzbare Strings sind faktisch Teil des Keys.
**Quellen:** `memory/runs/2026-06-16_claude-code_opus-4-8-01.md` (diggai-anamnese, Commit dffbbc2)

---

## G35 — Exakte `where`-Objekt-Assertion in Prisma-Tests bricht bei umgebungsbedingten Filtern → `objectContaining`

**Erstmals beobachtet:** 2026-06-17 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `testing`, `vitest`, `prisma`, `objectcontaining`, `env-conditional`, `mock`, `tenant`

**Was passiert:** Ein Test, der das `where`-Objekt eines Prisma-Calls exakt matcht (`toHaveBeenCalledWith({ where: { … } })`), bricht, sobald der Code zur Laufzeit umgebungsabhängig zusätzliche Filter ergänzt (z.B. ein nur in Prod aktiver Visibility-/Tenant-Filter). Test ist grün in Dev-Config, rot in Prod-Config — kein echter Fehler, sondern Over-Specification.
**Fix:** Statt Exakt-Match `expect.objectContaining({ … })` auf die stabilen Pflichtfelder asserten; umgebungsbedingte Zusatz-Constraints toleriert der Matcher. Gilt analog für jede zur Laufzeit konditional aufgebaute Query-/Payload-Form (nicht nur Prisma).
**Quellen:** `server/middleware/tenant.test.ts` (diggai-anamnese, Commit af2bd10)

---

## G36 — react-i18next-Mock erzeugt pro `useTranslation()`-Aufruf neue `t`/`i18n`-Referenzen → Endlos-Render-Loop

**Erstmals beobachtet:** 2026-06-17 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `vitest`, `react-i18next`, `mock`, `render-loop`, `stable-reference`, `testing`

**Was passiert:** Ein globaler `vi.mock('react-i18next', …)`, der bei JEDEM `useTranslation()`-Aufruf ein frisches `{ t, i18n }`-Objekt (neue Funktions-/Objekt-Referenzen) zurückgibt, treibt Komponenten in eine Endlos-Render-Schleife, sobald `t` oder `i18n` in einer `useEffect`/`useMemo`-Dependency steht oder als Prop weitergereicht wird — jeder Render erzeugt neue Referenzen → Effekt feuert → Render → … (Test hängt / OOM). Die echte App memoisiert `t` intern, der naive Mock nicht.
**Fix:** `t` und `i18n` EINMAL außerhalb der Factory erzeugen und bei jedem Aufruf dieselben Referenzen zurückgeben: `const t = (k,d)=>d||k; const i18n = { language:'de', changeLanguage: vi.fn() }; return { useTranslation: () => ({ t, i18n }), … }`. Bildet die Memoisierung der echten Library nach. Distinkt von G22 (dort fehlte die `t(key,{defaultValue})`-Signatur) — gleicher Mock, anderer Root-Cause.
**Quellen:** `src/test-setup.ts`, `src/components/PraxisSucheStep.test.tsx` (diggai-anamnese, Commit db621b3)

---

## G37 — `NODE_ENV=production` an den Test-Prozess vererbt → React-Prod-Build ohne `act` → "React.act is not a function"

**Erstmals beobachtet:** 2026-06-17 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `vitest`, `node-env`, `react`, `act`, `test-env`, `launcher`

**Was passiert:** Ein Wrapper/Launcher (Deploy- oder `JETZT_LIVE_*`-Skript, CI-Step), der die Tests startet, vererbt `NODE_ENV=production` an den vitest-Prozess. React lädt dann seine Production-Builds, in denen die Test-API `act` fehlt → `TypeError: React.act is not a function`, obwohl Test-Code und Versionen korrekt sind. Verwandt mit, aber NICHT identisch zu G26 (dort war dieselbe Fehlermeldung ein reiner Stale-Mount-Stand) — hier ist es ein echter Environment-Leak.
**Fix:** In `vitest.config.ts` ganz oben absichern: `if (process.env.NODE_ENV === 'production') process.env.NODE_ENV = 'test';` (vor `defineConfig`). Für einen Testlauf ist `production` nie gewollt. Bei „React.act is not a function" also immer beide Ursachen prüfen: (a) Stale Sandbox-Mount (G26), (b) geleaktes `NODE_ENV=production` (dieses).
**Quellen:** `vitest.config.ts`, `src/components/inputs/PatientIdentify.test.tsx` (diggai-anamnese, Commit 635357b)

---

## G38 — jsdom hat kein IndexedDB → Tests mit IndexedDB-Persistenz brauchen `fake-indexeddb/auto`

**Erstmals beobachtet:** 2026-06-17 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `vitest`, `jsdom`, `indexeddb`, `test-setup`, `dev-dependency`, `polyfill`

**Was passiert:** jsdom implementiert kein IndexedDB. Tests, die Code mit IndexedDB-Persistenz ausführen (z.B. ein Key-/PIN-Store oder ein Send-Guard), brechen mit `indexedDB is not defined`/`undefined`. Gehört zur selben Familie wie G21 (localStorage-No-Op-Stub) und G23 (jsdom-Realm-Lücken): „jsdom fehlt eine Browser-API".
**Fix:** `fake-indexeddb` als devDependency (`^6.x`) installieren und per Side-Effect-Import einschalten — in der einzelnen Test-Datei oder global im `test-setup.ts`: `import 'fake-indexeddb/auto';`. Liefert eine voll funktionsfähige In-Memory-IndexedDB für jsdom; kein Per-Methode-Mock-Stub nötig.
**Quellen:** `package.json` (fake-indexeddb devDependency) (diggai-anamnese, Commit 81ef202)

---

## G39 — Per-Minute-Rate-Limit zu streng → legitime Schnell-Nutzer bekommen 429 in Save-lastigen Formular-Flows

**Erstmals beobachtet:** 2026-06-20 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `rate-limit`, `express`, `429`, `ux`, `auto-save`, `backend`

**Was passiert:** Ein als Spam-Schutz gedachter `express-rate-limit` auf dem Antwort-/Save-Endpoint stand auf 30 Requests/min pro Session. In einem Formular mit vielen kurzen Fragen erzeugt ein zügiger, ehrlicher Nutzer leicht >30 Saves/min → Server antwortet mit 429 ("zu viele Antworten"), der normale Ausfüll-Fluss bricht ab. Das Limit traf reale Nutzer, nicht Angreifer.
**Fix:** Limit am realistischen Worst-Case eines legitimen Nutzers ausrichten, nicht am theoretischen Minimum (hier 30→120/min) — Spam-Schutz bleibt, normaler Fluss passt durch. Generell: per-Minute-Limits für interaktive, auto-speichernde UIs großzügig dimensionieren und gegen den schnellsten ehrlichen Nutzer (kurze Felder = viele Saves) testen, nicht gegen den Durchschnitt.
**Quellen:** `server/routes/answers.ts` (diggai-anamnese, Commit df40bdd)


---

## G40 — Strikte Server-Formatvalidierung (64-Zeichen-SHA-256-Hex) + Client schickt Stand-in (DataURL) → stiller 400 bei jedem POST

**Erstmals beobachtet:** 2026-06-20 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `client-server-contract`, `validation`, `sha-256`, `webcrypto`, `http-400`, `frontend`

**Was passiert:** Ein Upload-/Signatur-Endpoint validierte ein Feld strikt als 64-Zeichen-SHA-256-Hex. Der Client übergab als "Hash" stattdessen einen Stand-in (die Bild-DataURL der Unterschrift) → der POST scheiterte AUSNAHMSLOS mit 400 ("ungültige Eingabe"), nur als Toast sichtbar, und es wurde nie serverseitig gespeichert. Ein semantisch als "Hash" benanntes Feld bekam Nicht-Hash-Daten.
**Fix:** Im Client den echten Wert im geforderten Format erzeugen, nicht einen Platzhalter. Browser-nativer SHA-256-Hex ohne Lib:
```ts
async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}
```
Generell: wenn ein Server ein exaktes Format erzwingt (feste Länge/Hex/Regex), den Contract clientseitig erfüllen statt etwas Ähnliches zu senden; solche Mismatches scheitern zu 100 % und wirken fälschlich wie "Server kaputt".
**Quellen:** `src/components/SignaturePad.tsx`, `src/pages/services/ServicePageLayout.tsx` (diggai-anamnese, Commit df40bdd)


---

## G41 — Globaler 401-Interceptor leert Session + redirectet mitten im legitimen Gast-/Public-Flow

**Erstmals beobachtet:** 2026-06-23 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `auth`, `http-interceptor`, `401`, `spa-routing`, `guest-flow`, `session`

**Was passiert:** Ein globaler HTTP-Response-Interceptor ruft bei JEDEM 401 `clearSession()` + Redirect auf die Landing-Page. In einem anonymen, mehrstufigen Gast-Flow (kein eingeloggter Nutzer) feuert ein beilaeufiger Hintergrund-401 (z.B. ein abgelaufener Refresh-Token-Call) direkt nach einem kritischen Schritt (Einwilligung/Unterschrift) und resettet den Store auf `flowStep=landing` -> der Nutzer wird zurueck an den Start geworfen, der Flow-Kontext ist weg. Zusaetzlich erkannte der Interceptor praefixierte Public-Routen (`/:prefix/...`) nicht als „im Flow" und bounced sie faelschlich auf `/`.
**Fix:** Den Interceptor einschraenken statt global feuern zu lassen: (a) `clearSession`/Token-Removal NUR auf dem authentifizierten App-Pfad ausfuehren, nicht im Public-/Gast-Pfad; (b) praefixierte Public-Routen und anonyme Sessions explizit als „in-flow" erkennen und vom Redirect ausnehmen. Den kompletten Gast-Flow inkl. eines erzwungenen Hintergrund-401 mitten im Flow end-to-end testen. Merksatz: ein 401-Handler, der fuer eingeloggte Nutzer gedacht ist, darf anonyme/Public-Flows nicht anfassen.
**Quellen:** `src/api/client.ts` (diggai-anamnese, Commits 162b33e, 3a5efcc)


---

## G42 — Globale Tenant-/Context-Resolve-Middleware blockt Capability-/Token-Routen vor dem Handler

**Erstmals beobachtet:** 2026-06-21 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `middleware`, `multi-tenancy`, `routing`, `capability-url`, `express`, `ordering`

**Was passiert:** Eine globale Middleware loest den Tenant/Mandanten aus Header/Subdomain auf und laeuft vor ALLEN Routen. Ein Capability-/Token-Endpoint, dessen Identitaet erst IM Handler aus der Ressourcen-UUID (UUID = Bearer) entsteht, schickt keinen Tenant-Header -> die Middleware lehnt mit `TENANT_NOT_FOUND` ab, bevor der Handler ueberhaupt laeuft. Der Endpoint ist tenant-agnostisch, die Middleware weiss das nicht.
**Fix:** Tenant-/Context-Middleware fuer selbst-authentifizierende Capability-Routen (UUID/Token traegt die Identitaet) per Whitelist/Bypass ausnehmen. Generell: Middleware, die ambienten Kontext (Tenant, Session, Header) erzwingt, muss fuer Routen, die ihre Identitaet selbst mitbringen, opt-out sein — sonst stirbt der Request vor dem Handler an fehlendem Kontext, den er gar nicht braucht.
**Quellen:** `server/middleware/tenant.ts`, `server/routes/sessions.ts` (diggai-anamnese, Commit 17cfe10)

---

## G43 — Anonymer, sessionloser POST-Endpoint muss explizit von CSRF ausgenommen werden

**Erstmals beobachtet:** 2026-06-23 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `csrf`, `security`, `anonymous-endpoint`, `express`, `public-api`

**Was passiert:** Ein global aktiver CSRF-Schutz (Token / Double-Submit-Cookie) blockt einen neu hinzugefuegten anonymen POST-Endpoint (z.B. ein oeffentlicher Relay-/Intake-Eingang). Der anonyme Aufruf hat keine Cookie-Session und damit kein CSRF-Token -> jeder legitime anonyme POST scheitert.
**Fix:** Den anonymen, sessionlosen Endpoint explizit vom CSRF-Schutz ausnehmen — es gibt keine Cookie-Session, die ein Angreifer faelschen koennte, also greift das CSRF-Bedrohungsmodell hier nicht. Stattdessen ueber Rate-Limit, strikte Payload-Validierung, Groessenlimits und ggf. Origin-/Captcha-Checks absichern. Merksatz: CSRF schuetzt Cookie-authentifizierte state-changing Requests; ein wirklich anonymer Endpoint braucht ein anderes Modell, nicht das Token.
**Quellen:** `server/middleware/csrf.ts` (diggai-anamnese, Commit cc34898)
