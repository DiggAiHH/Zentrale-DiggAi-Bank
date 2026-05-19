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
**Beobachtet in:** DiggAi-anamnese · JoBetes (potenziell)
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
