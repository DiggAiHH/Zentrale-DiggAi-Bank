# RUN HARNESS

Normalisierte Wissens-Records für **jeden** Run-Log aus allen DiggAiHH-Quell-Repos
(diggai-anamnese, JoBetes, wanderwell) — unabhängig vom jeweiligen Run-Log-Format.

Eingeführt auf CK-Direktive 2026-06-14 ("für jeden Run ein ganzes Knowledge-Harness").

## Dateien

| Datei | Inhalt |
|---|---|
| `HARNESS_INDEX.md` | Menschenlesbar: pro Run ein Block (Topic, Aktion, Blocker, Fix, Ergebnis, Next, Signale). Gruppiert nach Repo + Datum. |
| `runs_all.json` | Maschinen-lesbar: jeder Run als normalisierter Record (alle Felder). |
| `runs_all.csv` | Flache Tabelle der Kernfelder (für Pivot/Filter). |
| `candidates_since_<DATE>.md` | Runs im Sync-Fenster mit Blocker/Fix/Surprise oder Signal-Treffer — Vorlage für die Bank-Klassifikation. |
| `STATS.md` | Zähler: total / im Fenster / quiet / substantive / candidates / Signal-Hits. |

## Schema pro Run

`repo, date, agent, model, run, format (DA/JB/WW), topic, action, blocker, fix,
result, surprise, next, decisions, quiet, substantive, in_window, signal_cats, source`

## Regenerieren

```cmd
node tools\build_run_harness.cjs ^
  --src <ordner-mit-geklonten-repos> ^
  --out KNOWLEDGE\RUN_HARNESS ^
  --since <YYYY-MM-DD>
```

Der Parser erkennt drei Formate automatisch:
- **DA** — 5-Bullet `Lauf` (Aktion/Blocker/Fix/Ergebnis/Out)
- **JB** — Goal/Did/Result/Surprise/Next
- **WW** — `# Run NN` mit `##`-Sektionen (viele Stiller-Tag-Skelette)

## Anonymisierung

Vor dem Schreiben läuft ein Scrub-Pass (Hard-Rule: keine projekt-spezifischen Daten
in zentrale Repos): Personen-Namen → `{{USER}}`, E-Mails → `{{EMAIL}}`,
IPv4/IPv6 → `{{IP}}`/`{{IP6}}`, Test-Credentials → `{{CRED}}`, Heim-Pfade → `{{USER}}`.
`--raw` deaktiviert den Scrub (nur lokal, nie committen). `_digest.txt` ist gitignored.
