# SETUP_SCHEDULE — One-Time Setup-Prompt

Dieser Prompt muss **einmal** in einem normalen Cowork-Tab (Opus 4.7) gepastet werden, um den Daily-Sync-Schedule anzulegen. Danach läuft er täglich 20:00 Europe/Berlin automatisch.

---

## Variante 1 — Direkt-Anweisung an Opus

Frischer Cowork-Tab mit Opus 4.7, folgendes pasten:

─── PROMPT START ───

Lege bitte einen Scheduled Task an mit folgenden Parametern:

- **taskId:** `diggai-daily-knowledge-sync`
- **description:** `Daily 20:00 Berlin — aggregiert Learnings aus DiggAiHH-Projekten in Zentrale-DiggAi-Bank`
- **cronExpression:** `0 20 * * *` (täglich 20:00 Europe/Berlin)
- **notifyOnCompletion:** true
- **prompt:** Fetch `https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/DAILY_SYNC_PROMPT.md` und verwende den Block zwischen `─── PROMPT START ───` und `─── PROMPT ENDE ───` als Task-Prompt.

Verwende dafür den `mcp__scheduled-tasks__create_scheduled_task` MCP-Tool. Bestätige die Anlage mit Task-ID und nächstem Run-Zeitpunkt.

─── PROMPT ENDE ───

---

## Variante 2 — Direkt-Call (falls du das MCP-Tool selbst aufrufen willst)

```js
mcp__scheduled-tasks__create_scheduled_task({
  taskId: "diggai-daily-knowledge-sync",
  description: "Daily 20:00 Berlin — aggregiert Learnings aus DiggAiHH-Projekten in Zentrale-DiggAi-Bank",
  cronExpression: "0 20 * * *",
  notifyOnCompletion: true,
  prompt: "<full content from DAILY_SYNC_PROMPT.md>"
})
```

Falls Opus sagt "tool requires user interaction" → Approval-Dialog erscheint, du klickst **Approve**.

---

## Variante 3 — Skill-basiert

Falls du den `schedule` Skill installiert hast:

```
/schedule jeden Tag um 20:00 — führe https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/DAILY_SYNC_PROMPT.md aus
```

---

## Was passiert nach dem Setup

- **Erster Run:** Heute oder morgen 20:00 Europe/Berlin (je nach Setup-Zeitpunkt)
- **Notification:** Du bekommst eine Cowork-Notification wenn der Sync fertig ist
- **Output:** Neue Commits in `https://github.com/DiggAiHH/Zentrale-DiggAi-Bank` + neuer Eintrag in `daily-log/YYYY-MM-DD.md` + Gmail-Draft an `DiggAi@tutanota.de`

---

## Schedule prüfen / ändern / pausieren

```js
// Liste alle Scheduled Tasks
mcp__scheduled-tasks__list_scheduled_tasks()

// Cron ändern (z.B. 22:00)
mcp__scheduled-tasks__update_scheduled_task({
  taskId: "diggai-daily-knowledge-sync",
  cronExpression: "0 22 * * *"
})

// Pausieren
mcp__scheduled-tasks__update_scheduled_task({
  taskId: "diggai-daily-knowledge-sync",
  enabled: false
})
```

---

## Wichtige Voraussetzungen

- ✅ Anthropic Cowork muss laufen damit der Schedule triggert (PC an + App offen)
- ✅ Wenn PC aus war zur Zeit X: läuft beim nächsten App-Start nach
- ✅ Jeder Run = 1× Premium-Request (geschätzt 0.5–2 Requests/Tag)
- ✅ Chrome muss verbunden sein (für File-Upload-Trick zum Repo)
- ✅ Gmail-MCP muss verbunden sein (für Notify-Drafts)

---

**Owner:** Laith Alshdaifat · `DiggAi@tutanota.de` · Stand 2026-05-19
