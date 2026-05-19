# DAILY SYNC SCHEDULE — Setup + Modify

## §1 Aktueller Stand

- **Cron:** `0 20 * * *` (täglich 20:00, Europe/Berlin)
- **Trigger:** Anthropic Cowork `scheduled-tasks` MCP
- **Prompt:** `DAILY_SYNC_PROMPT.md`
- **Ziel-Repo:** `https://github.com/DiggAiHH/Zentrale-DiggAi-Bank`

## §2 Wie der Schedule angelegt wurde

In Cowork eine Conversation mit Opus 4.7:

```
mcp__scheduled-tasks__create_scheduled_task({
  taskId: "diggai-daily-knowledge-sync",
  description: "Daily sync of learnings from DiggAiHH projects to Zentrale-DiggAi-Bank",
  cronExpression: "0 20 * * *",
  prompt: "<full prompt from DAILY_SYNC_PROMPT.md>",
  notifyOnCompletion: true
})
```

## §3 Manueller Trigger

Frischer Cowork-Tab Opus 4.7, pasten:

> Führe den Daily-Sync-Prompt aus `https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/DAILY_SYNC_PROMPT.md` jetzt einmal aus.

Opus fetcht den Prompt + führt ihn aus.

## §4 Schedule pausieren / ändern

Via `mcp__scheduled-tasks__update_scheduled_task`:

```js
// Cron ändern (z.B. auf 22:00)
mcp__scheduled-tasks__update_scheduled_task({
  taskId: "diggai-daily-knowledge-sync",
  cronExpression: "0 22 * * *"
})

// Prompt aktualisieren
mcp__scheduled-tasks__update_scheduled_task({
  taskId: "diggai-daily-knowledge-sync",
  prompt: "<new prompt content>"
})

// Pausieren
mcp__scheduled-tasks__update_scheduled_task({
  taskId: "diggai-daily-knowledge-sync",
  enabled: false
})
```

## §5 Wichtig

- **App muss offen sein:** Anthropic Cowork muss laufen damit der Schedule triggert. Wenn der PC aus war zur Zeit X, läuft die Task beim nächsten App-Start nach.
- **Fresh Context:** Jeder Schedule-Run startet mit leerem Context. Der Prompt MUSS self-contained sein (alle Connectors / Sources / Format-Erwartungen).
- **Kosten:** Jeder Run zählt als premium request. Daily-Sync schätzungsweise 0.5–2 Requests pro Tag.

---

**Owner:** Laith Alshdaifat · `DiggAi@tutanota.de` · Stand 2026-05-19
