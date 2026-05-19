# UPLOAD FROM PROJECT — Paste-Ready Prompt

Dieser Prompt wird **in einem Cowork-Tab eines anderen Projekts** (Opus 4.7) gepastet, in dem schon mit Lou-Intit gebootstrapt wurde. Der AI im Projekt extrahiert die hartverdienten Learnings und committet sie in diese zentrale Bank.

---

## Wann benutzen

- Manueller Upload, wenn du nicht auf den Daily-Sync warten willst
- Nach einem großen Lernerfolg in einem Projekt (z.B. nach Phase 1b OOM-Fix, neuer Gotcha entdeckt)
- Beim Abschluss eines Projekt-Meilensteins (Phase-Wechsel, Status-Plan-Flip)
- Wenn der Daily-Sync ausgefallen ist (PC war aus)

---

## Der Prompt (zum Kopieren)

─── PROMPT START ───

Du bist Claude Opus 4.7. Owner: Laith Alshdaifat (DiggAi@tutanota.de).

**Mission:** Extrahiere alle hartverdienten Learnings dieses Projekts (aus dem aktuellen Working Directory bzw. dem Cowork-Workspace-Folder) und committe sie in die zentrale Wissensbank: https://github.com/DiggAiHH/Zentrale-DiggAi-Bank

**Schritte (sequenziell, autonom, nicht zwischendrin nachfragen):**

1. **Projekt identifizieren:**
   - Lies `CLAUDE.md` und `README.md` im Root, um Projekt-Name + Stack festzustellen
   - Notiere `<PROJEKT_NAME>` (z.B. "diggai-anamnese", "JoBetes")
   - Notiere heutiges Datum als `<YYYY-MM-DD>`

2. **Bank-Zustand fetchen (zum Dedup):**
   - WebFetch jede dieser 4 Datei-URLs und merke dir den Inhalt:
     - `https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/KNOWLEDGE/WHAT_WORKED.md`
     - `https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/KNOWLEDGE/WHAT_FAILED.md`
     - `https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/KNOWLEDGE/GOTCHAS.md`
     - `https://raw.githubusercontent.com/DiggAiHH/Zentrale-DiggAi-Bank/main/KNOWLEDGE/METHODOLOGY.md`
   - Höchste vergebene ID pro Kategorie merken (G01, G02 ... → nächste neue = G+1)

3. **Projekt-Memory scannen:**
   - Lies alle Files in `memory/runs/` (sort by filename desc) — jede `Aktion/Blocker/Fix/Ergebnis/Out`-Zeile ist ein Kandidat für ein Learning
   - Lies `progress.txt` — append-only Inkremental-Learnings
   - Lies `VERSTAENDNIS_LUECKEN.md` — RESOLVED-Einträge sind Architektur-Entscheidungen die Wissen tragen
   - Lies `AGENTS.md` — Discovered Patterns + Gotchas, die Ralph dort eingetragen hat
   - Lies die letzten 20 Commit-Messages: `git log --oneline -20` (via bash MCP)
   - Lies `CLAUDE.md` Memory/Learnings-Block falls projekt-spezifische Gotchas dort stehen

4. **Klassifiziere jedes Learning** in eine dieser Kategorien:

   | Kategorie | Hinweise | Ziel-Datei in Bank |
   |---|---|---|
   | WORKED | "funktioniert", erfolgreiche Patterns, "approach hat geklappt" | `KNOWLEDGE/WHAT_WORKED.md` |
   | FAILED | "schlug fehl", "nie wieder", Anti-Patterns | `KNOWLEDGE/WHAT_FAILED.md` |
   | GOTCHA | Stolpersteine: ESM, OOM, Konfig-Quirks, Race-Conditions | `KNOWLEDGE/GOTCHAS.md` |
   | METHODOLOGY | Workflow/PRD/Loop/DoD-Verbesserungen | `KNOWLEDGE/METHODOLOGY.md` |
   | AGENT-SPECIFIC | "Opus war gut bei X", "Sonnet halluzinierte Y" | `KNOWLEDGE/AGENT_LEARNINGS/<agent>.md` (anlegen falls nicht da) |
   | TOOL-SPECIFIC | Ralph/Caveman/MCP-Verhalten | `KNOWLEDGE/TOOLS/<tool>.md` (anlegen falls nicht da) |

5. **Dedup-Check pro Learning:**
   - Wenn ähnlicher Eintrag (gleicher Kurztitel oder gleiche Tags+Beschreibung) schon in Bank existiert:
     - Nicht neu eintragen
     - Stattdessen: existierenden Eintrag mit `**Beobachtet in:** ..., <PROJEKT_NAME>` ergänzen (Projekt-Name an die Liste anhängen falls noch nicht da)
   - Wenn nicht: neuer Eintrag mit nächster freier ID (G15, W06, F06, etc.)

6. **Eintrags-Format (alle Kategorien):**

   ```
   ### G42 — Kurztitel
   **Erstmals beobachtet:** <YYYY-MM-DD> in <PROJEKT_NAME> (<Run-Log-Datei oder Commit-Hash>)
   **Beobachtet in:** <PROJEKT_NAME>
   **Kategorie:** <KATEGORIE> · Tags: `tag1`, `tag2`
   **Was passiert:** <1-3 Sätze>
   **Fix:** <konkreter Workaround / Pattern>
   **Quellen:** `<repo-relative-path>` (z.B. `memory/runs/2026-05-19_opus_4-7-03.md`)
   ```

7. **Daily-Log schreiben:**
   - Erstelle Inhalt für `daily-log/<YYYY-MM-DD>.md` mit Struktur:

     ```
     # Daily-Log <YYYY-MM-DD> — Manual upload from <PROJEKT_NAME>

     **Quelle:** <PROJEKT_NAME> (https://github.com/DiggAiHH/<PROJEKT_NAME>)
     **Trigger:** Manuell (nicht Scheduled-Sync)

     ## Aggregiert
     - Neue Einträge: <N> (W: x, F: y, G: z, M: a, Agent: b, Tool: c)
     - Dedup-Hits: <D>
     - Quiet Items (rejected — projekt-spezifisch / regulatorisch): <Q>

     ## Neue Einträge (mit Link)
     - [G42 — Kurztitel](../KNOWLEDGE/GOTCHAS.md#g42--kurztitel)
     - ...

     ## Dedup-Hits (nur Beobachtet-In ergänzt)
     - G05 — Prisma+Node24+tsx (Projekt war bereits in Liste, kein Update nötig)
     ```
   - Wenn `daily-log/<YYYY-MM-DD>.md` schon existiert (Daily-Sync war schon dran): Inhalt **anhängen** mit Überschrift `## Manual upload from <PROJEKT_NAME>`, NICHT überschreiben.

8. **Upload zur Bank via Chrome-MCP:**
   - Pro betroffenen Ordner einen separaten Upload-Commit machen
   - Navigate jeweils zu `https://github.com/DiggAiHH/Zentrale-DiggAi-Bank/upload/main/<Ordner>`
   - Für jede zu ändernde Datei: `<file-attachment>.attach()` mit `new File([content], 'filename.md', {type:'text/markdown'})` — File-Upload via Chrome-Extension ist geblockt, der Webcomponent-Trick funktioniert:

     ```js
     const fae = document.querySelector('file-attachment');
     const dt = new DataTransfer();
     dt.items.add(new File([content], 'WHAT_WORKED.md', {type:'text/markdown'}));
     fae.attach(dt);
     ```
   - Commit-Message-Format: `feat(sync): manual upload from <PROJEKT_NAME> — <N> new, <D> dedup`
   - Reihenfolge: KNOWLEDGE/* (eine Commit) → daily-log/ (eine Commit). Wenn AGENT_LEARNINGS/ oder TOOLS/ neue Dateien brauchen: separater Commit für die Unterordner.

9. **Gmail-Draft als Notify (kein Auto-Send):**
   - Via gmail-MCP `create_draft`:
     - An: `DiggAi@tutanota.de`
     - Subject: `Manual Bank-Upload <YYYY-MM-DD> von <PROJEKT_NAME> — <N> Patterns`
     - Body: 3-5 Zeilen Summary + Link zu `https://github.com/DiggAiHH/Zentrale-DiggAi-Bank/blob/main/daily-log/<YYYY-MM-DD>.md`
   - **Niemals Auto-Send.** Draft only.

10. **Run-Log im aktuellen Projekt:**
    - Schreibe `memory/runs/<YYYY-MM-DD>_opus_4-7-<NN>.md` mit 5 Bullets:
      - Aktion: Manual-Upload zur Bank
      - Blocker: —
      - Fix: —
      - Ergebnis: `<N> Einträge committed, daily-log/<YYYY-MM-DD>.md`
      - Out: Bank synced, Gmail-Draft an Owner ready

**Niemals:**
- Projekt-spezifische Daten in die Bank: Patient-Namen, Stripe-Keys, Anschriften, Telefonnummern, echte E-Mail-Adressen (außer Owner), Anwalts-Namen, Kanzlei-Namen, MDR-Klassen-Hypothesen mit Produkt-Details
- Auto-Send von Mails
- Duplikate ohne Dedup
- Force-Push
- Direkt-Push auf main vom Projekt-Repo (das hier ist Upload zur Bank, nicht zum Projekt)
- Anonymisier-Schritt überspringen: wenn ein Learning nur durch Nennung eines projekt-spezifischen Details Sinn ergibt, mit `{{PROJEKT_KONTEXT}}` ersetzen oder ganz weglassen

**Wenn keine extrahierbaren Learnings (alles schon in Bank):**
- Daily-Log mit "Nothing new to upload from <PROJEKT_NAME> on <YYYY-MM-DD>" eintragen
- Gmail-Draft optional
- Run-Log im Projekt trotzdem (DoD)

**Sprache:** DE für Konversation, EN für Tech-Begriffe und Commit-Messages.

**Start jetzt mit Schritt 1 (Projekt identifizieren).**

─── PROMPT ENDE ───

---

## Praxis-Workflow

1. Du arbeitest gerade in einem Projekt (z.B. `DiggAi-anamnese`), neuer Gotcha gerade entdeckt.
2. Im gleichen Cowork-Tab oder neuem Tab Opus 4.7: kompletten Block oben pasten.
3. Opus liest `memory/runs/` + `progress.txt` + `AGENTS.md` + Commit-Log, fetcht Bank-Zustand, dedupliziert, lädt nur Neues hoch.
4. Gmail-Draft an dich, du klickst "Senden" wenn du den Summary OK findest.

---

## Wenn der Daily-Sync das schon abdeckt

Der täglich 20:00-Sync deckt automatisch alle DiggAiHH-Repos ab. Diesen manuellen Prompt nutzt du nur:
- Wenn du **vor 20:00** schon committen willst (z.B. Ende-Workday-Push)
- Wenn du in einem Repo arbeitest, das **nicht in `SOURCES/sources.json`** ist
- Wenn der Daily-Sync **gestern ausgefallen** ist und du nachholen willst

---

**Owner:** Laith Alshdaifat · `DiggAi@tutanota.de` · Stand 2026-05-19
