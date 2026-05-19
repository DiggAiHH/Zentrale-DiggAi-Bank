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
