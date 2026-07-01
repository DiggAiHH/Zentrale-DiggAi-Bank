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

## G80 — Magic-Link Rate-Limit bei Supabase Auth

> _Hinweis: früher als G07 geführt; am 2026-06-29 zur Auflösung einer ID-Kollision auf G80 umnummeriert (Inhalt unverändert)._

**Erstmals beobachtet:** 2026-05-13 in JoBetes (Sync 2026-05-19)
**Beobachtet in:** JoBetes
**Kategorie:** GOTCHA · Tags: `supabase`, `auth`, `magic-link`, `rate-limit`

**Was passiert:** Mehrere Magic-Link-Anforderungen in kurzer Folge → Supabase sperrt temporär ~5 min. Spam-Ordner ist 90% der Fälle die echte Ursache.
**Fix:** Diagnose-Reihenfolge: 1) Spam-Ordner, 2) Mail-App-Cache, 3) Adresse-Tippfehler, 4) Supabase Auth-Logs, 5) Rate-Limit-Wait. Notfall: Operator nimmt Link aus eigener Test-Mail, sendet per Out-of-Band (WhatsApp).

---

## G81 — PWA Add-to-Home-Screen ist Browser-fragmentiert

> _Hinweis: früher als G08 geführt; am 2026-06-29 zur Auflösung einer ID-Kollision auf G81 umnummeriert (Inhalt unverändert)._

**Erstmals beobachtet:** 2026-05-13 in JoBetes (Sync 2026-05-19)
**Beobachtet in:** JoBetes
**Kategorie:** GOTCHA · Tags: `pwa`, `browser-fragmentation`, `onboarding`

**Was passiert:** iPhone Safari hat Teilen-Button unten-mitte, Chrome Android 3-Punkte-Menü, Samsung-Browser 3-Striche-Menü, manche Browser unterstützen es gar nicht.
**Fix:** Browser-spezifische Setup-Anleitung mit Screenshots. Fallback: Lesezeichen + auf Home-Screen ziehen (sieht nicht wie App aus, funktioniert aber).

---

## G82 — Browser drosselt JS in Background-Tab

> _Hinweis: früher als G09 geführt; am 2026-06-29 zur Auflösung einer ID-Kollision auf G82 umnummeriert (Inhalt unverändert)._

**Erstmals beobachtet:** 2026-05-13 in JoBetes (Sync 2026-05-19)
**Beobachtet in:** JoBetes
**Kategorie:** GOTCHA · Tags: `browser`, `polling`, `background-tab`, `throttling`

**Was passiert:** Polling-basiertes Realtime-UI funktioniert im Foreground-Tab, hängt im Background. Chrome/Safari drosseln Background-Tab-JS auf ≥1 min (Battery-Saving).
**Fix:** Kurzfristig UI-Hinweis "Tab im Vordergrund halten". Mittelfristig WebSocket statt Polling, oder Service-Worker mit Push-Notifications.

---

## G83 — Service-Worker cached kaputten Build nach Deploy

> _Hinweis: früher als G10 geführt; am 2026-06-29 zur Auflösung einer ID-Kollision auf G83 umnummeriert (Inhalt unverändert)._

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

---

## G44 — Eine einzige Streu-HTML in public/ mit Google-Fonts blockt den GANZEN DSGVO-gegateten Deploy

**Erstmals beobachtet:** 2026-06-29 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `dsgvo`, `deploy-gate`, `google-fonts`, `self-hosted-fonts`, `static-assets`, `footgun`

**Was passiert:** Das Deploy-Skript bricht am DSGVO-Check ab, sobald IRGENDEINE Datei in dist/ (=aus public/) fonts.googleapis.com/fonts.gstatic.com referenziert. Eine ungetrackte Dev-Visitenkarte (public/entwickler.html) mit Google-Fonts hat so den kompletten Frontend-Deploy gestoppt. Das Gate ist korrekt (Fonts muessen self-hosted sein).
**Fix:** Vor dem Deploy pruefen: grep -rliE 'fonts\.googleapis|fonts\.gstatic' public --include='*.html' MUSS leer sein. Treffer -> Fonts self-hosten ODER die Datei aus public/ rausnehmen (z.B. nach dev-pages/, wird nicht gebaut). Dev-/Streu-HTML gehoert nicht nach public/.
**Quellen:** `docs/COWORK_ENV_FOOTGUNS.md, docs/PRE_DEPLOY_CHECKLIST.md (commit 35c976b)` (diggai-anamnese)

---

## G45 — `SET LOCAL x = :param` ist gegen echtes Postgres ein Syntaxfehler — `SET LOCAL` akzeptiert keine Bind-Parameter

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `postgres`, `rls`, `set-local`, `bind-params`, `set-config`, `asyncpg`, `python`

**Was passiert:** Jeder Endpoint, der per-Request-Kontext setzt, wirft `syntax error at or near "$1" [SQL: SET LOCAL app.current_user_id = $1]` → 500. Trat in 4 Dateien auf (notes/sessions Router + patient/session Services). Ursache: `SET LOCAL <var> = <wert>` ist reines SQL und akzeptiert KEINE gebundenen Parameter ($1). Mock-DB-Tests führen das Statement nie gegen echtes Postgres aus und maskieren den Fehler komplett.
**Fix:** Die parametrisierbare, transaktions-lokale Variante nutzen: `SELECT set_config('app.current_user_id', :uid, true)`. Funktioniert mit Bind-Params und ist ebenfalls transaktions-lokal (3. Arg = is_local=true). Regel: Session-/GUC-Variablen, die zur Laufzeit aus User-Input gesetzt werden, IMMER via `set_config(name, value, is_local)` setzen — nie via `SET LOCAL` mit Platzhalter.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G46 — asyncpg liefert uuid-Spalten als UUID-Objekte → vor String-Vergleich UND in Pydantic-Response-Models `str()` erzwingen

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `asyncpg`, `uuid`, `postgres`, `pydantic`, `fastapi`, `type-coercion`, `python`

**Was passiert:** (1) Berechtigungs-Check `patient_id != user_id` ist IMMER True → WS lehnt jeden gültigen Teilnehmer ab (1008 Not authorized), obwohl die IDs gleich sind. (2) `GET /sessions/{id}` → 500 `Input should be a valid string [input_value=UUID(...)]` aus Response-Models mit `id: str`. Ursache: asyncpg deserialisiert uuid-Spalten als Python-`UUID`-Objekte, nicht als Strings. `UUID(...) != 'gleicher-string'` ist immer True; und Pydantic `str`-Felder lehnen ein UUID-Objekt ab. Reine Funktions-/Mock-Tests fangen das nie (dort sind die Werte Strings).
**Fix:** Beim Vergleich: `str(uuid_col) != str(jwt_sub)`. In Pydantic-v2-Response-Models, die aus `row._mapping` gebaut werden: `@field_validator('id', mode='before')` UUID→str-Koersion an JEDEM betroffenen Feld. Regel: Bei asyncpg jede uuid/timestamptz-Spalte als nativen Python-Typ behandeln: vor String-Vergleich `str()`, in Response-Schemas eine Before-Validator-Koersion. Gilt für jedes Model, das aus rohen SQL-Rows konstruiert wird.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G47 — Dev-DB-Rolle als SUPERUSER+BYPASSRLS maskiert JEDEN RLS-Bug systematisch — unter NOBYPASSRLS-Rolle verifizieren

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `postgres`, `rls`, `bypassrls`, `superuser`, `security`, `prod-only-bug`, `verification`

**Was passiert:** KRITISCH (prod-only): Die gesamte Patient-Journey (patients/phq9/gad7/consent-INSERT) lief lokal grün, hätte aber in PROD an RLS scheitern müssen — der Code setzte NIE den RLS-Kontext. Ursache: Die lokale Dev-Rolle war SUPERUSER + BYPASSRLS → alle RLS-Policies werden umgangen. Jeder fehlende `set_config`-Kontext, jede fehlende Policy bleibt unsichtbar, solange unter dieser Rolle getestet wird.
**Fix:** Eine eigene NOBYPASSRLS-App-Rolle anlegen, die API mit deren `DATABASE_URL` starten und die volle E2E-Journey laufen lassen (reproduzierbar als Skript). Zusätzlich: `SET ROLE <nobypass>` + INSERT mit/ohne `set_config` → ohne ctx BLOCKED, mit ctx SUCCEEDED beweist scharfe Policies. Regel: RLS niemals nur unter der Dev-Superuser-Rolle verifizieren. Definitive Prod-Probe = API unter einer dedizierten NOBYPASSRLS-Rolle + echte E2E. Superuser/BYPASSRLS in Dev ist eine systematische Maske über ALLE RLS-Bugs.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G48 — Per-Request-RLS via einmaligem `set_config` reicht nicht — Endpoints mit Mehrfach-Commit verlieren den Kontext → `after_begin`-Listener

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `postgres`, `rls`, `sqlalchemy`, `set-config`, `transaction`, `event-listener`, `python`

**Was passiert:** Onboarding → 500 `new row violates RLS policy for "consent_records"`, obwohl ein anderer (single-commit) Onboarding-Pfad grün war. Ursache: `set_config(..., is_local=true)` ist transaktions-lokal. Endpoints, die mehrfach pro Request committen (z.B. erst patient UPDATE, dann consent INSERT), verlieren nach dem ersten Commit den GUC → der zweite Write läuft ohne RLS-Kontext.
**Fix:** RLS-Kontext über `@event.listens_for(session, 'after_begin')` setzen statt einmalig — er wird bei JEDER neuen Transaktion re-applied, überlebt Mehrfach-Commits und bleibt transaktions-lokal (kein Cross-Request-Leak über den Connection-Pool). Regel: Transaktions-lokale Session-Variablen (RLS-Kontext, Tenant) per `after_begin`-Event re-applien, nicht einmalig pro Request — sonst kippt jeder Endpoint mit mehr als einem Commit.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G49 — RLS-Tabelle ohne INSERT-Policy = stiller Totalausfall des Schreibpfads unter Non-Superuser (besonders fatal beim Audit-Trail)

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `postgres`, `rls`, `policy`, `audit-trail`, `insert-policy`, `compliance`, `silent-failure`

**Was passiert:** KRITISCH + still: Unter NOBYPASSRLS schlägt JEDER `audit_log`- und `notification_log`-INSERT fehl; der AuditLogger schluckt den Fehler → in PROD entsteht KEIN Audit-Trail (Compliance-Verletzung), ohne dass irgendwas sichtbar bricht. Ursache: Beide Tabellen hatten nur `*_select`-Policies. Bei aktivem RLS und fehlender INSERT-Policy ist INSERT für Non-Superuser DENIED. Dev-Superuser maskierte es; der defensive try/except des Loggers verschluckte den Fehler.
**Fix:** INSERT-Policy ergänzen (`WITH CHECK (true)`, Integrität über separate no_update/no_delete-Rules). Pro Tabelle `pg_policy.polcmd` prüfen: gibt es für JEDEN genutzten Befehl (a=all/r=select/w=update/d=delete + insert) eine Policy? Regel: Bei aktiviertem RLS für jede tatsächlich genutzte Operation eine Policy verifizieren — eine fehlende INSERT-Policy ist ein stiller Schreib-Totalausfall, der unter Superuser unsichtbar ist. Audit-Writer dürfen Fehler nicht schlucken, sonst ist der Ausfall doppelt unsichtbar.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G50 — SQLAlchemy `Enum(StrEnum)` bindet die Member-NAMEN, nicht die Werte → DB-Enum-Mismatch → 500

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `sqlalchemy`, `enum`, `postgres`, `strenum`, `values-callable`, `python`

**Was passiert:** `invalid input value for enum consent_status: "GRANTED"` (analog phq9_severity, gad7_severity, session status) → 500 bei jedem Insert. Ursache: SQLAlchemy `Enum(MyEnum)` bindet standardmäßig die Member-NAMEN (`GRANTED`), die DB-Enums tragen aber die lowercase Werte (`granted`).
**Fix:** `Enum(MyEnum, values_callable=lambda obj: [e.value for e in obj])` an JEDER Enum-Spalte. Regel: Bei SQLAlchemy-Enum-Spalten gegen DB-native Enums immer `values_callable` setzen, damit die Enum-WERTE (nicht die Python-Member-Namen) gebunden werden.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G51 — ORM↔Migration Spalten-Drift: DB-Spaltennamen via `mapped_column("<db_name>", ...)` overriden, DB als Source-of-Truth

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `sqlalchemy`, `orm-drift`, `mapped-column`, `postgres`, `schema`, `raw-sql-migrations`

**Was passiert:** `column phq9_assessments.q2_depressed_mood does not exist` → 500; weitere Tabellen mit Phantom-Spalten (`video_room_id`, `updated_at`) und fehlenden echten (`started_at`, `day_of_week`, `timezone`). Ursache: Das ORM-Model driftete vom Migrations-/DB-Schema ab (Model `q2_depressed_mood`, DB `q2_depressed`). Raw-SQL-Migrationen sind Source-of-Truth, das Model wurde aber unabhängig editiert.
**Fix:** `mapped_column("<db_spaltenname>", Integer, ...)` — der DB-Name wird überschrieben, das Python-Attribut bleibt stabil. DB-Spalten via `information_schema.columns` / `\d` als Wahrheit gegenchecken und Model exakt ausrichten. Regel: Bei raw-SQL-Migrationen ist die DB das Schema-Orakel, nicht das ORM. Spaltennamen-Drift mit explizitem `mapped_column(name=...)`-Override fixen und periodisch `\d` vs Model diffen.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G52 — FastAPI 204-Endpoints dürfen keine `-> None` Response-Annotation haben (sonst NoneType-response_model → AssertionError beim Import)

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `fastapi`, `204`, `response-model`, `import-error`, `python`

**Was passiert:** `import app.main` → `AssertionError: Status code 204 must not have a response body`. Ursache: FastAPI 0.110 leitet aus der `-> None` Return-Annotation eines 204-Endpoints einen NoneType-response_model ab und assertet dann gegen die 204-Regel (kein Body).
**Fix:** Die `-> None` Annotation von 204-Endpoints entfernen. Regel: 204-No-Content-Endpoints in FastAPI ohne Return-Type-Annotation deklarieren — eine `-> None` erzeugt einen ungültigen response_model und bricht schon den App-Import.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G53 — KeycloakAuthMiddleware (BaseHTTPMiddleware) muss OPTIONS durchlassen — sonst stirbt der CORS-Preflight an 401 (nur im echten Cross-Origin-Browser sichtbar)

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `fastapi`, `starlette`, `middleware`, `cors`, `preflight`, `options`, `auth`

**Was passiert:** Browser-Submit → "Failed to fetch"/"Netzwerkfehler", Daten landen nie. Same-origin Unit-Tests sind grün. Ursache: Die Auth-Middleware überspringt OPTIONS nicht → der CORS-Preflight (der nie ein Token trägt) wird 401't, bevor die CORS-Schicht antworten kann. Unit-Tests laufen same-origin (ASGI) → kein Preflight → Bug unsichtbar.
**Fix:** Im `dispatch`: `if request.method == 'OPTIONS': return await call_next(request)` (vor der Token-Prüfung). Regel: Jede Auth-Middleware muss OPTIONS-Preflights ungeprüft durchlassen. Cross-Origin-Verhalten ist in same-origin ASGI-Tests strukturell unsichtbar — mind. einen echten Cross-Origin-Browser-Smoke fahren.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G54 — Unauthentifizierte, identitäts-etablierende Endpoints (register/login) müssen ihren RLS-Kontext selbst setzen; `db.refresh` nach Commit scheitert

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `postgres`, `rls`, `auth`, `register`, `login`, `set-config`, `sqlalchemy`, `expire-on-commit`

**Was passiert:** `/auth/register` → 500 `new row violates RLS policy for "patients"`; danach `/auth/login` → "Patient nicht gefunden". `db.refresh(patient)` → "Could not refresh". Ursache: Register/Login etablieren die Identität, BEVOR ein Token existiert → das zentrale `get_db` kann `app.current_user_id` nicht aus `request.state` ableiten → patients-INSERT/SELECT scheitert RLS. Zusätzlich läuft `db.refresh` nach `db.commit()` in einer neuen Transaktion mit bereits resettetem GUC.
**Fix:** In register/login `set_config('app.current_user_id', <neue/gefundene id>, true)` VOR dem patients-Zugriff. `db.refresh` entfernen — PK kommt aus `INSERT ... RETURNING` + `expire_on_commit=False`. Regel: Endpoints, die ihre eigene Identität erst erzeugen, können sich nicht auf request-getriebenes RLS verlassen und müssen den Kontext selbst setzen. Post-Commit-`refresh`/`SELECT` sieht die eigene Zeile nicht mehr (GUC weg) → auf `RETURNING` + `expire_on_commit=False` verlassen.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G55 — Jeder direkte `AsyncSessionLocal()`-Nutzer außerhalb von `get_db` (Background-Worker, Audit, Signaling) braucht eigenes RLS-`set_config`

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `postgres`, `rls`, `sqlalchemy`, `background-worker`, `audit`, `websocket`, `session-factory`

**Was passiert:** Signaling-WS lehnt unter Prod-RLS jede Verbindung ab (Teilnehmer-SELECT liefert 0 Zeilen); AuditLogger-Writes scheitern still. Ursache: `get_db`-zentrales RLS deckt nur Request-Sessions ab. Helper/Worker/WS, die direkt `AsyncSessionLocal()` öffnen, haben keinen RLS-Kontext → Queries sehen 0 Zeilen / INSERTs werden abgewiesen.
**Fix:** Vor dem Query `set_config('app.current_user_id', user_id, true)` in der eigenen Session setzen (eigene Session = eigener Kontext). Regel: Zentrales Dependency-RLS gilt nur für Request-Sessions. Jeder eigenständige Session-Opener (Worker, Logger, WS-Handler) muss den RLS-/Tenant-Kontext explizit selbst setzen.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G56 — Identitäts-Ebenen-Verwechslung: JWT-sub (`therapists.user_id`) vs Row-PK (`therapists.id`) in Code UND RLS-Policies

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `postgres`, `rls`, `identity`, `jwt`, `foreign-key`, `auth`, `policy`

**Was passiert:** Unter Prod-RLS sieht KEIN echter Arzt seine Sessions/Notizen/Slots/Bookings (alle Features tot); `POST /notes` → 500 RLS-Violation. Ursache: Code und DB-Policies verglichen `therapist_id` (= Row-PK `therapists.id`, FK-Ziel) direkt gegen `app.current_user_id` (= Keycloak-sub). Der sub ist aber `therapists.user_id`, nicht der PK → jeder Vergleich scheitert.
**Fix:** Überall sub→id auflösen (`therapists.user_id = sub → id`), in Code-Writern UND in jeder RLS-Policy (`USING/WITH CHECK` löst die Indirektion auf). Nach einem Policy-Identity-Fix ALLE Writer der Tabelle gegenprüfen. Regel: Externe Identität (IdP-sub) und interne Row-PK sauber trennen — sie sind selten dasselbe. FK-Ziele und Auth-Vergleiche müssen die Indirektion explizit auflösen, sowohl im Anwendungscode als auch in RLS-Policies.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G57 — asyncpg braucht für JSONB-Casts einen JSON-STRING, kein dict — `json.dumps()` vor dem Insert

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `asyncpg`, `jsonb`, `postgres`, `json-dumps`, `python`, `serialization`

**Was passiert:** `POST /usability/sus` → 500 `invalid input for $7 ... 'dict' object has no attribute 'encode'`. Ursache: Ein Python-dict wurde direkt an `CAST(:item_scores AS JSONB)` gebunden. asyncpg erwartet für einen JSONB-Cast einen JSON-String, kein dict.
**Fix:** `json.dumps(payload)` vor dem Bind/Insert. Regel: Bei asyncpg + JSONB immer den Python-Wert via `json.dumps()` serialisieren, bevor er an einen `::jsonb`/`CAST(... AS JSONB)`-Parameter gebunden wird.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G58 — FastAPI: Endpoint-Parameter `status` shadowed das importierte `fastapi.status`-Modul → AttributeError (500 statt 403/404)

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `fastapi`, `shadowing`, `status`, `naming`, `python`

**Was passiert:** `status.HTTP_403_FORBIDDEN` wirft AttributeError → 500 statt des gewollten 403/404. Ursache: Ein Endpoint-Parameter hieß `status` und überschattete das modul-weite `from fastapi import status`.
**Fix:** Parameter umbenennen (z.B. `new_status`). Regel: Endpoint-/Funktions-Parameter nie wie ein importiertes Modul benennen (`status`, `request`, `json` …) — das Shadowing schlägt erst zur Laufzeit beim Modul-Zugriff zu.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G59 — PowerShell 5.1: BOM-loses UTF-8 mit Nicht-ASCII wird als ANSI gelesen → Smart-Quote-Bytes kippen den Parser; `2>&1` bei nativen exes weglassen

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `powershell`, `windows`, `utf-8`, `bom`, `encoding`, `shell`, `native-exe`

**Was passiert:** `.ps1` nach einem Edit voller Parse-Fehler ("Unerwartetes Token", Kaskade fehlender `}`), obwohl die Datei korrekt aussieht. Ursache: PowerShell 5.1 liest BOM-loses UTF-8 als ANSI (CP-1252). Die Bytes eines `—` (E2 80 94) werden zu `â€"`, wobei 0x94 in CP-1252 ein Smart-Quote ist → PS interpretiert es als String-Delimiter und Strings kippen durch die ganze Datei. Zweite Falle: `native.exe 2>&1 | Tee` macht aus stderr-NOTICEs (z.B. psql) unter `$ErrorActionPreference=Stop` terminierende `NativeCommandError`.
**Fix:** Nach JEDEM Edit an einer `.ps1` mit Nicht-ASCII die UTF-8-BOM sicherstellen (`[Text.UTF8Encoding]::new($true)`). `2>&1` bei nativen Programmen weglassen. Regel: Auf Windows PowerShell 5.1: Skripte mit Nicht-ASCII brauchen UTF-8-BOM, sonst zerlegt ANSI-Fehlinterpretation den Parser. stderr nativer exes nicht in den PS-Stream mergen (`2>&1`), sonst werden NOTICEs zu terminierenden Fehlern.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G60 — Windows/IPv6: `localhost` löst teils auf `::1` auf, uvicorn lauscht nur auf 127.0.0.1 → intermittierende Fetch-Fehler; Fix an der GENERATOR-Quelle

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `windows`, `ipv6`, `localhost`, `uvicorn`, `env-vars`, `generated-files`, `networking`

**Was passiert:** Cross-Origin-Fetches intermittierend tot, obwohl der Stack läuft; nach manuellem Fix kommt der Bug wieder. Ursache: Windows löst `localhost` teils auf IPv6 `::1` auf, während uvicorn nur auf IPv4 `127.0.0.1` lauscht. Zusätzlich: ein `start-all.ps1` REGENERIERT `.env.local` mit `localhost` bei jedem Lauf und überschreibt den manuellen Fix.
**Fix:** `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` (explizit IPv4). Den Fix an der QUELLE machen (Generator-here-string), nicht nur am erzeugten Artefakt. Regel: Auf Windows Dev-Hosts explizit `127.0.0.1` statt `localhost` verwenden (IPv4/IPv6-Mismatch). Wird ein Bug in einer generierten Datei gefixt, IMMER den Generator mitfixen — sonst kehrt er beim nächsten Lauf zurück.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G61 — asyncpg.connect() erwartet str — Pydantic `PostgresDsn`/`MultiHostUrl` mit `+asyncpg`-Suffix bricht (`'MultiHostUrl' object has no attribute 'decode'`)

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `asyncpg`, `pydantic`, `database-url`, `postgres-dsn`, `python`, `settings`

**Was passiert:** Background-Worker spammt `'MultiHostUrl' object has no attribute 'decode'` (non-fatal, aber Worker tot). Ursache: Das Pydantic-Settings-`DATABASE_URL` ist ein `PostgresDsn`/`MultiHostUrl`-Objekt (oft mit `postgresql+asyncpg://`-Driver-Suffix). `asyncpg.connect()` will einen reinen String mit `postgresql://`-Schema.
**Fix:** `dsn = str(url).replace('postgresql+asyncpg://', 'postgresql://', 1)` und den String übergeben. Regel: Pydantic-DSN-Objekte vor der Übergabe an Low-Level-Treiber (asyncpg) zu `str()` casten und SQLAlchemy-spezifische Driver-Suffixe (`+asyncpg`) entfernen — die Treiber kennen nur das nackte Schema.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G62 — SQLAlchemy `AsyncSession` als leeres `Depends()` mit Klassen-Typ → FastAPI schematisiert es als Body → PydanticUndefinedAnnotation; sync/async-API-Mix

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `fastapi`, `sqlalchemy`, `depends`, `async-session`, `pydantic`, `python`

**Was passiert:** Router importiert nicht: `PydanticUndefinedAnnotation: 'Optional' not defined`. Ursache: `db: SessionLocal = Depends()` (leeres Depends mit einem Klassen-Typ, der in Wahrheit `AsyncSession` ist) → FastAPI versucht `AsyncSession` als Request-Body-Feld zu schematisieren und stolpert über SQLAlchemy-interne `Optional`-Refs. Zusätzlich nutzte derselbe Router die sync-DB-API (`db.query/.commit` ohne await), obwohl die Session async war.
**Fix:** Explizite Dependency-Funktion angeben (`db: Session = Depends(get_sync_db)`), passend zur tatsächlich genutzten sync/async-API. Nie ein leeres `Depends()` mit einem Klassen-Typ. Regel: FastAPI-Dependencies immer mit expliziter Provider-Funktion (`Depends(get_x)`) deklarieren, nie als bare `Depends()` mit Klassen-Annotation — sonst wird die Klasse als Request-Body fehlinterpretiert. sync- und async-Session-APIs nicht mischen.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G63 — Pydantic v2: `Schema.from_attributes(obj)` existiert nicht — `from_attributes` ist eine ConfigDict-OPTION, Konstruktor ist `model_validate`

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `pydantic`, `pydantic-v2`, `from-attributes`, `model-validate`, `fastapi`, `python`

**Was passiert:** Endpoints → 500 `type object has no attribute 'from_attributes'`. Ursache: `from_attributes` wurde als Konstruktor-Methode aufgerufen. In Pydantic v2 ist es eine `ConfigDict`-Option am Modell, kein Klassen-Methoden-Konstruktor.
**Fix:** `Schema.model_validate(obj)` aufrufen und `model_config = ConfigDict(from_attributes=True)` am Schema setzen. Regel: Pydantic v2: ORM-Objekte via `model_validate()` in Schemas überführen; `from_attributes=True` gehört in `ConfigDict`, nicht in einen Methodenaufruf.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G64 — Starlette/FastAPI Version-Drift bei Status-Konstanten: `HTTP_422_UNPROCESSABLE_CONTENT` vs `_ENTITY`

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `fastapi`, `starlette`, `version-drift`, `http-status`, `python`

**Was passiert:** 500 `module 'starlette.status' has no attribute 'HTTP_422_UNPROCESSABLE_CONTENT'`. Ursache: Der Code nutzte den neueren Starlette-Konstantennamen (`..._CONTENT`), die installierte Version kennt nur den älteren (`..._ENTITY`).
**Fix:** Den breit-kompatiblen Namen `status.HTTP_422_UNPROCESSABLE_ENTITY` nutzen (in alt+neu vorhanden). Regel: Bei version-empfindlichen Framework-Konstanten den Namen wählen, der über die unterstützte Versionsspanne stabil ist — neu umbenannte Aliase brechen gegen ältere Installationen.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G65 — Endpoint-Guards müssen den TATSÄCHLICH genutzten Endpoint prüfen, nicht nur den Config-Wert (Residency-Loch durch SDK-Default)

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `data-residency`, `guard`, `config`, `sdk-default`, `verification`, `llm`

**Was passiert:** Ein neuer LLM-Client-Pfad nutzte den US-Default-Endpoint trotz vorhandenem `assert_endpoint_matches_region`-Guard. Ursache: Der Guard prüfte nur den CONFIG-Wert, nicht den real verwendeten Endpoint. Der SDK-Konstruktor ohne expliziten `base_url`/Region fällt auf seinen globalen/US-Default zurück — am Config-Guard vorbei.
**Fix:** Den Endpoint explizit in den Client injizieren (z.B. `http_options(base_url=...)` bzw. regionaler Vertex-Modus) und im Guard den GENUTZTEN Endpoint prüfen, nicht nur die Config. Regel: Compliance-/Residency-Guards an der tatsächlich abgesetzten Anfrage festmachen (gebaute URL/effektiver Endpoint), nicht am Config-String. SDK-Defaults unterlaufen sonst still die Garantie.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G66 — uv relinkt bei jedem `python install` ALLE Minor-Link-Dirs → laufende python.exe lockt Remove → halb zerstörte venv (`No module named '_socket'`)

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `uv`, `python`, `windows`, `venv`, `file-lock`, `toolchain`

**Was passiert:** `uv python install` → "failed to remove directory … os error 32"; danach venv tot (`No module named '_socket'`, leere `DLLs/`). Ursache: uv relinkt bei jedem install alle Minor-Link-Verzeichnisse. Läuft irgendeine python.exe daraus (uvicorn, MCP-Server), schlägt das Remove fehl und hinterlässt halb zerstörte Installationen — auch die gerade extrahierte.
**Fix:** `uv python install` nur ausführen, wenn `uv python find <ver>` leer ist. Reparatur: alle Pythons stoppen → Junction via `cmd /c rmdir` (löscht nur den Link) → kaputtes versioniertes Dir per `Remove-Item` → `uv python install <volle Version>`. Verify IMMER `python -c "import socket"` (nicht nur `sys.version` — das läuft auch bei kaputter stdlib). Regel: Auf Windows vor jedem `uv pip install`/`uv python install` alle laufenden Pythons stoppen (gelockte `.pyd`/`.dll`). Toolchain-Health mit einem stdlib-Import (`import socket`) verifizieren, nicht mit `sys.version`.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G67 — Paket-Upgrade/-Install auf Windows schlägt halb fehl, wenn der Server läuft (kompilierte .pyd/.dll gelockt)

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `windows`, `uv`, `pip`, `file-lock`, `pyd`, `cryptography`, `upgrade`

**Was passiert:** Paket-Upgrade auf Windows scheitert oder bleibt halb-installiert. Ursache: Kompilierte Extensions (`.pyd`, z.B. cryptography) sind von einem laufenden uvicorn-Prozess gelockt.
**Fix:** Vor `uv pip install`/Upgrade IMMER API + alle Pythons stoppen, danach Import-Smoke + Test-Suite fahren. Regel: Auf Windows native Extensions nicht ersetzen, solange ein Prozess sie geladen hat — vor jedem Dependency-Install den Server stoppen, danach mit einem Import-Smoke verifizieren.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G68 — Mock `db.execute(side_effect=[...])` ist aufruf-reihenfolge-gebunden — beim Entfernen eines DB-Calls den korrespondierenden Eintrag mitentfernen

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `testing`, `mock`, `side-effect`, `pytest`, `refactor`, `python`

**Was passiert:** Test bricht, nachdem 2 Service-DB-Calls entfernt wurden, obwohl die Logik korrekt ist. Ursache: Eine `side_effect`-Liste mappt Rückgaben auf die Aufruf-REIHENFOLGE. Weniger Consumer → die Sequenz verschiebt sich → falsche Rückgabe am falschen Call.
**Fix:** Beim Entfernen eines DB-Aufrufs immer den korrespondierenden `side_effect`-Listeneintrag mitentfernen (und beim Hinzufügen mitergänzen). Regel: Reihenfolge-gebundene Mock-`side_effect`-Listen sind an die exakte Call-Sequenz gekoppelt — bei jeder Änderung der DB-Aufruf-Anzahl die Liste synchron halten, sonst brechen unverwandte Asserts.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G69 — Pinning-Test kodiert den Bug: ein Test, der die unsichere `== raw sha256`-Gleichheit festschreibt, verhindert den Sicherheits-Fix

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `testing`, `pinning-test`, `pseudonymisation`, `sha256`, `security`, `regression`

**Was passiert:** Eine Pseudonymisierungs-Migration brach 4 Tests; einer pinnte explizit die unsichere `value == raw_sha256(...)`-Gleichheit. Ursache: Der Test kodierte das fehlerhafte Verhalten (rohes, ungesalzenes SHA-256 als Pseudonym) als Soll — der Fix machte ihn rot.
**Fix:** Den Test auf das korrekte Invariant umstellen (`!= raw_sha && == pseudonymise()`), nicht den Fix zurückrollen. Regel: Wenn ein Sicherheits-Fix einen Test rot macht, prüfen ob der Test das alte (unsichere) Verhalten festschreibt — solche 'Pinning-Tests' müssen aufs neue Invariant migriert werden, nicht der Fix verworfen.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G70 — Auto-Import-Insert-Skript ohne `from app.`-Anker → NameError; nach jedem Skript-Edit Import-Smoke

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `codemod`, `auto-edit`, `import`, `name-error`, `verification`, `python`

**Was passiert:** Eine Migration warf NameError, weil ein Auto-Insert keinen passenden Import-Anker fand (notifications.py). Ursache: Ein Skript, das Imports automatisch einfügt, suchte einen `from app.`-Anker, der in der Datei fehlte → der benötigte Import wurde nie gesetzt.
**Fix:** Den Import explizit setzen und nach jedem skriptgesteuerten Datei-Edit einen Import-Smoke (`python -c "import <modul>"`) laufen lassen. Regel: Anker-basierte Auto-Edits (Import-Insert, Codemods) schlagen still fehl, wenn der Anker fehlt — nach jedem skriptgesteuerten Edit einen Import-/Parse-Smoke fahren, nicht auf den Edit allein vertrauen.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G71 — Codemod ersetzt Token textuell auch außerhalb des Zielkontexts (Tailwind-4: `outline`→`outline-solid` in TS-Types und Prosa)

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `codemod`, `tailwind`, `migration`, `text-replace`, `grep-verify`, `frontend`

**Was passiert:** Der Tailwind-4-Codemod ersetzte `outline`→`outline-solid` auch in einem TS-Union-Type und mitten in einem englischen Prompt-Satz ('Help me outline-solid a feasibility RCT'). Ursache: Der Codemod matcht den Token `outline` rein textuell, nicht nur in Tailwind-className-Kontexten.
**Fix:** Nach jedem Codemod per `grep` nach dem neuen Token in Nicht-CSS-Kontexten (Types, Strings, Kommentare) suchen + tsc; Übergriffe manuell zurücksetzen. Regel: Automatische Token-Codemods greifen über Kontextgrenzen hinweg — nach jedem Lauf den eingeführten Token in Code-/String-/Kommentar-Kontexten greppen und Fehl-Ersetzungen zurücknehmen.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)

---

## G72 — WebRTC: ICE-Error 701 'STUN server address is incompatible' = Browser verweigert Loopback (127.0.0.1) als TURN/STUN-Adresse → LAN-IP nutzen

**Erstmals beobachtet:** 2026-06-29 in wanderwell-backfill
**Beobachtet in:** wanderwell-backfill
**Kategorie:** GOTCHA · Tags: `webrtc`, `ice`, `stun`, `turn`, `loopback`, `coturn`, `browser-policy`

**Was passiert:** `iceTransportPolicy:'relay'` verband nicht — ICE-Error 701 bei `turn:127.0.0.1:3478`. Zuerst fälschlich als Docker-Windows-Limit vermutet. Ursache: Chromium verweigert Loopback (127.0.0.1) als STUN/TURN-Server-Adresse (Browser-Policy), nicht ein Infra-Limit.
**Fix:** TURN-URI + Coturn-`--external-ip` auf die LAN-IP des Hosts (z.B. 192.168.x.x) setzen, nicht 127.0.0.1. Den echten ICE-Error via `onicecandidateerror` auslesen statt zu raten. Regel: 'Infra-Limit' bei WebRTC nicht zu früh annehmen — den echten `onicecandidateerror` lesen. Browser verweigern Loopback als ICE-Server-Adresse; TURN/STUN immer über eine echte (LAN-)IP adressieren.
**Quellen:** `memory/runs/` Backfill 2026-06-23..29 (wanderwell-backfill)


---

## G73 — Debounce-Such-UI: Leerzustand ("keine Treffer") blitzt im Debounce-Loch auf, weil das can-search-Prädikat vor der ersten aufgelösten Suche true wird

**Erstmals beobachtet:** 2026-06-30 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `frontend`, `react`, `debounce`, `empty-state`, `search`, `race`, `ux`

**Was passiert:** Eine Suche mit Mindestlänge (z.B. ≥3 Zeichen) setzt `canSearch` sofort true, die eigentliche Query ist aber debounced (z.B. 350ms). In diesem Loch ist `showNoResults` kurz true → die "keine Treffer"-/Leerzustand-Karte erscheint ~1s, BEVOR überhaupt gesucht wurde.
**Fix:** Einen `hasResolved`/`hasSearchedOnce`-State führen: beim Tippen false (im Debounce-Effekt zurücksetzen), nach Abschluss der Suche (im `finally` von runSearch) true. Leerzustand nur zeigen wenn `showNoResults && hasResolved`. Regel: Leerzustände an "mindestens einmal aufgelöst", nicht an die Eingabe-Länge koppeln. Regressionstest: "Karte erscheint erst nach abgeschlossener leerer Suche".
**Quellen:** `memory/runs/2026-06-30_claude-code_opus-4-8-03.md` (diggai-anamnese)

---

## G74 — React-Router-Hooks (`useNavigate`/`useParams`) lassen Komponenten-Tests ohne Router-Wrapper crashen

**Erstmals beobachtet:** 2026-06-30 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `frontend`, `react-router`, `testing`, `vitest`, `memory-router`, `hooks`

**Was passiert:** Sobald einer bestehenden Komponente `useNavigate`/`useParams` hinzugefügt wird, crasht jeder Unit-Test, der sie ohne Router-Provider rendert ("useNavigate() may be used only in the context of a Router"). Der Test war vorher grün und bricht ohne erkennbaren Logik-Bezug.
**Fix:** Test-Render in `<MemoryRouter>` wrappen (Render-Helper, ggf. mit `initialEntries` für `useParams`). Regel: Beim Einbau von Router-Hooks in eine Komponente sofort die zugehörigen Tests in einen Router-Wrapper heben — die roten Tests sind Harness-Drift, kein Produkt-Bug.
**Quellen:** `memory/runs/2026-06-30_claude-code_opus-4-8-04.md` (diggai-anamnese)

---

## G75 — Commit-Message mit `(`/`)` oder `1)`/`2)` bricht die Shell → `git commit -F -` Heredoc statt `-m`

**Erstmals beobachtet:** 2026-06-30 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `git`, `shell`, `commit`, `quoting`, `heredoc`

**Was passiert:** Eine `git commit -m "..."`-Message mit Klammern, Aufzählungs-`1)`/`2)` oder anderen Shell-Metazeichen wird vom Shell-Parser zerrissen (Subshell/Glob/Argument-Split) → der Commit schlägt fehl oder bekommt eine zerhackte Message.
**Fix:** Message über `git commit -F -` per Heredoc (oder `git commit -F <datei>`) übergeben — der Text durchläuft kein Shell-Parsing. Regel: Mehrzeilige oder sonderzeichen-haltige Commit-Messages nie inline via `-m`, immer via `-F`.
**Quellen:** `memory/runs/2026-06-30_claude-code_opus-4-8-05.md` (diggai-anamnese)

---

## G76 — `window.confirm()` ist in mobilen Webviews unzuverlässig ("Knopf reagiert nicht") → Inline-Bestätigung statt nativem Dialog

**Erstmals beobachtet:** 2026-06-30 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `frontend`, `webview`, `mobile`, `window-confirm`, `ux`, `dialog`

**Was passiert:** Ein Bestätigungs-Flow über `window.confirm()` wirkt auf Mobile / in eingebetteten Webviews tot — der Button reagiert scheinbar nicht, weil der native Dialog vom Webview unterdrückt/verschluckt wird.
**Fix:** Bestätigung als Inline-UI bauen (eigener Bestätigungs-State + Ja/Nein-Buttons) statt `window.confirm()`/`window.alert()`. Regel: Keine nativen Browser-Dialoge in Flows, die auch im Webview/auf Mobile laufen.
**Quellen:** `memory/runs/2026-06-30_claude-code_opus-4-8-06.md` (diggai-anamnese)

---

## G77 — i18n-Keys mit nur Inline-`defaultValue` nie in `translation.json` registriert → Quellsprache in ALLEN Locales; Paritäts-Gate ist blind

**Erstmals beobachtet:** 2026-07-01 in diggai-anamnese
**Beobachtet in:** diggai-anamnese
**Kategorie:** GOTCHA · Tags: `i18n`, `locales`, `parity-gate`, `defaultvalue`, `blind-spot`, `coverage`

**Was passiert:** Komponenten rufen `t('foo.bar', { defaultValue: '...' })` auf, ohne den Key je in `translation.json` (Quell-Locale) zu registrieren. Das i18n-Paritäts-Gate prüft nur, ob JEDE Locale die Keys der Quell-Locale hat — es macht KEINEN Source-Scan über `t()`-Aufrufe im Code. Nicht-registrierte Keys existieren also in KEINER Locale, fallen dem Gate nie auf, und rendern über den Inline-Default in JEDER Sprache in der Quellsprache (hier: Deutsch). Ganze Komponenten sind so unbemerkt einsprachig.
**Fix:** Das i18n-Gate um einen Source-Scan erweitern (alle `t('…')`-Keys aus dem Code extrahieren und gegen die Quell-Locale abgleichen — fehlende Registrierung = Fehler), nicht nur Locale↔Locale-Parität. Kurzfristig: `defaultValue` als Code-Smell behandeln — jeder neue Key gehört in `translation.json`, Inline-Default nur als Notnagel. Regel: „Paritäts-Gate ≠ Coverage-Gate".
**Quellen:** `memory/runs/2026-07-01_claude-code_sonnet-5-04.md` (diggai-anamnese)
