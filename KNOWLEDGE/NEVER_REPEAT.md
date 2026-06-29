# NEVER REPEAT — Die Pareto-Quintessenz der DiggAi-Bank

> **Zweck:** Die wenigen Regeln mit der höchsten Hebelwirkung — projektübergreifend wiederkehrend, oder fähig, fertige Arbeit/Daten *still* zu zerstören. Wer diese Liste verinnerlicht, vermeidet ~80 % der teuersten Fehler. **Datum:** 2026-06-29.
>
> Gilt für **alle** DiggAiHH-Projekte (diggai-anamnese · wanderwell · JoBetes · Lou-Intit). Detail-IDs verweisen auf GOTCHAS.md (G), WHAT_FAILED.md (F), METHODOLOGY.md (M), WHAT_WORKED.md (W).

---

## 1. DB & RLS — der stille Daten-/Compliance-Killer

> **Goldene Regel:** RLS niemals nur unter der Dev-Superuser-Rolle verifizieren. Diese eine Maske verbirgt ALLE folgenden Bugs bis Prod.

- **RLS immer unter einer NOBYPASSRLS-Rolle + echter E2E verifizieren** — SUPERUSER/BYPASSRLS in Dev maskiert *jeden* fehlenden Kontext und jede fehlende Policy systematisch; alles ist grün, bis Prod stirbt. → **G47**
- **Für JEDE genutzte Operation eine RLS-Policy anlegen (besonders INSERT)** — eine fehlende INSERT-Policy ist ein stiller Schreib-Totalausfall; beim Audit-Trail entsteht so KEIN Audit-Log, ohne dass etwas sichtbar bricht. → **G49**
- **Audit-Writer dürfen Fehler nie schlucken** — ein defensives try/except macht den Audit-Ausfall doppelt unsichtbar (Compliance-Verletzung in Prod). → **G49**, **W10**
- **RLS-Kontext per `after_begin`-Event re-applien, nicht einmalig pro Request** — `set_config(...,is_local=true)` ist transaktions-lokal; jeder Endpoint mit mehr als einem Commit verliert ihn nach dem ersten Commit. → **G48**
- **Jeder eigenständige Session-Opener setzt seinen RLS-Kontext selbst** — Worker, AuditLogger, WS-Handler, register/login: zentrales `get_db`-RLS deckt nur Request-Sessions ab; alle anderen sehen sonst 0 Zeilen / werden abgewiesen. → **G55**, **G54**
- **Externe Identität (IdP-sub) ≠ interne Row-PK** — Indirektion in Code UND RLS-Policies explizit auflösen (`user_id → id`), sonst sehen echte Nutzer ihre eigenen Daten nicht. → **G56**
- **`SET LOCAL var = $1` ist ein Syntaxfehler** — laufzeit-/user-gesetzte GUCs immer via `set_config(name, value, true)` (akzeptiert Bind-Params). → **G45**
- **Admin-Aggregate über sensible RLS-Daten via schmaler `SECURITY DEFINER`-Funktion**, nicht via breiter Read-Policy — wahrt die Zugriffsgrenze. → **W33**

## 2. Auth & Flows — globale Handler zerstören Gast-/Public-Pfade

- **401-Interceptor darf anonyme/Public-Flows nicht anfassen** — ein globaler `clearSession()`+Redirect auf JEDEM 401 wirft Gäste mitten im Flow (nach Consent/Unterschrift) auf die Landing-Page zurück; Flow-Kontext weg. → **G41**
- **Anonyme, sessionlose POST-Endpoints explizit von CSRF ausnehmen** — kein Cookie = kein Token = jeder legitime anonyme POST scheitert; stattdessen Rate-Limit + Payload-/Größen-Validierung. → **G43**
- **Tenant-/Context-Middleware für selbst-authentifizierende Capability-Routen bypassen** — sonst stirbt der Request an fehlendem Kontext, den er gar nicht braucht. → **G42**
- **Auth-Middleware muss OPTIONS-Preflights ungeprüft durchlassen** — sonst 401't der token-lose CORS-Preflight; in same-origin-Tests strukturell unsichtbar. → **G53**
- **Zusammengehörige State-Writes in EINER atomaren Aktion bündeln** — getrennte Buttons für Unterschrift + Consent erzeugen eine Race-Condition, Daten landen teils nicht. → **F15**
- **Client erfüllt den Server-Contract exakt** (feste Länge/Hex/Regex) — ein Stand-in (z.B. DataURL statt SHA-256) scheitert zu 100 % mit stillem 400 und wirkt wie „Server kaputt". → **G40**
- **Rate-Limits am schnellsten *ehrlichen* Nutzer ausrichten** — zu strenge per-Minute-Limits geben legitimen Schnell-Nutzern in auto-speichernden Formularen 429. → **G39**

## 3. Test-Verifikation — grün ≠ läuft

> **Goldene Regel:** Mock-DB-/same-origin-Tests fahren den echten SQL-/Cross-Origin-Pfad nie ab. Für jeden DB-gebundenen Endpoint mindestens ein Live-Smoke gegen echtes Postgres + echten Token.

- **Live-Smoke gegen echte DB + echten Token Pflicht** — Spalten-/Enum-/Mapper-Drift ist bis zur ersten echten Query unsichtbar (`import app.main` fängt sie nicht). DB-Schema (`\d`) ist Source-of-Truth gegen das ORM. → **M14**, **G51**
- **Roten Test zuerst als Harness-/Mock-Bug verdächtigen, nicht als Produkt-Bug** — minimale conftest-Fixtures (Router fehlt → 404) und MagicMock-Auto-Vivification (truthy statt None) erzeugen Phantom-Fails; sonst baut man echte Bugs ein, um falsche zu „fixen". → **M15**, **M22**
- **Externe SDKs mit Residency-/Auth-Wirkung brauchen einen non-mocked URL-/Konstruktions-Assert** — „grün weil gemockt" beweist den SDK-Vertrag (Host/Pfad/Auth) nie; ein Residency-„Fix" baute so 404 bei JEDEM Prod-Call ein. → **M16**, **G65**
- **Geerbten Backlog / Subagent-Funde als LEAD behandeln, nicht als Wahrheit** — Zeilennummern driften, ~50 % alter Findings sind längst gefixt, Absenz-Claims („X fehlt") sind oft falsch; jeden Fund selbst im Code/Live-DB gegenprüfen. → **M19**, **M20**, **M11**, **M08**
- **„Braucht Infra" heißt selten „untestbar"** — den eigenen Code-Anteil isolieren: WS-Signaling mit zwei echten Clients + DB-Rows, TURN-Creds gegen echtes Coturn, Krypto-Kern via standalone Node-Skript. → **W32**, **W34**, **W18**
- **Pinning-Tests, die unsicheres Verhalten festschreiben, aufs neue Invariant migrieren** — nicht den Sicherheits-Fix zurückrollen, nur weil ein Test das alte (unsichere) Soll kodiert. → **G69**
- **Pre-Pilot-Gate: Web-Coverage ≥ 75 %** — kein Live-Schalten unter Threshold. → **F08**

## 4. Windows / Tooling — die Maschine ist ein Footgun

- **Windows-cmd: kein `&&`, kein `??`, Backslash-Pfade** — cross-platform schreiben (`cross-env`/`rimraf`), Multi-Line-Commits via Datei. → **G01** *(alle)*
- **Cowork Edit/Write korrumpiert Dateien auf dem Windows-Mount** (NUL-Pad / Tail-Truncation) — riskante Mehrzeilen-Edits via Desktop Commander auf der Windows-Seite; Korruptes per `git show HEAD:<pfad>` wiederherstellen, nie mit demselben Tool reparieren. → **G25**, **G26**
- **Linux-Sandbox desynct von Windows-Edits & kann win32-Bindings nicht ausführen** — Build/Test/Commit/Push über Desktop Commander DIREKT auf Windows; Sandbox-Datei-Views nach Windows-Edits als unzuverlässig behandeln. → **G26**, **G27**
- **Bash-Sandbox fällt zwischen Cowork-Aufrufen aus** (`HYPERVISOR_*`/Disk-Full) — Desktop Commander statt workspace-bash; vor Bash-Phase ein `echo ready`-Smoke. → **G14**
- **`git push` hängt non-interaktiv** (GUI-Credential-Manager / SSH-Passphrase) — `gh api`/`gh workflow` nutzen den Keyring; credential-gebundene Endaktion an den Operator übergeben. → **G24**, **W12**
- **PowerShell 5.1: BOM-loses UTF-8 mit Nicht-ASCII wird als ANSI gelesen** → Smart-Quote-Bytes kippen den Parser; nach jedem `.ps1`-Edit UTF-8-BOM sichern, `2>&1` bei nativen exes weglassen. → **G59**, **G30**
- **Windows-Dev: explizit `127.0.0.1` statt `localhost`** (IPv4/IPv6-Mismatch) — und einen Bug in generierten Dateien IMMER an der Generator-Quelle fixen, sonst kehrt er beim nächsten Lauf zurück. → **G60**
- **Vor jedem Dependency-/python-Install ALLE laufenden Pythons/Server stoppen** — gelockte `.pyd`/`.dll` hinterlassen halb-zerstörte venvs; Health mit stdlib-Import (`import socket`) verifizieren, nicht mit `sys.version`. → **G66**, **G67**
- **Heap-OOM ist oft Disk-Full, nicht Node-RAM** — vor Node-OOM-Debugging die System-Disk prüfen. → **G16**, **G17**
- **Codemods/Auto-Edits greifen über Kontextgrenzen** — nach jedem Lauf das neue Token in Nicht-Ziel-Kontexten greppen + Import-/Parse-Smoke (`python -c "import <modul>"`). → **G70**, **G71**

## 5. Git & Agenten-Hygiene — kein Überschreiben fremder Arbeit

- **Preflight vor jedem Schreiben im geteilten Tree** (Run-Logs lesen + once-guard) — untracked = nicht wiederherstellbar; eine Parallel-Session hat ohne Preflight fremde, nie committete Arbeit unwiederbringlich überschrieben. → **F14**, **M10**
- **Nie `git add -A`; nur kohärente Dateien by-name committen, HEAD direkt vor dem Commit re-checken** — Fremd-Residue dem Operator zur Einzel-Entscheidung flaggen statt blind mitcommitten. → **W14**
- **Kein direkter master/main-Push** — Feature-Branch + Self-PR + CI-Gate; Direkt-Push triggert ggf. ungewollten Deploy. → **F03** *(alle)*, **F10**
- **`--force` meiden** — auf shared Branches = Datenverlust; nur `--force-with-lease` auf eigene Branches mit Owner-Go. Ebenso `npm audit fix --force` (SemVer-Major-Bumps). → **F04**, **F13**
- **STOP + Owner-Bestätigung vor Risiko-Aktionen** (Force-Push / DB-Migration / DNS-Cutover / Mail-mit-Anhang / Lösch-≥10-Files) — Format „Was passiert / Reversibel? / Risk-Score". → **M05**
- **Inhaltliche/regulatorische Entscheidungen nicht autonom verfassen** — Tech-Defekt (z.B. 404) sofort mit neutralem Platzhalter beheben, Domain-Content an die Fachverantwortlichen gaten. → **M13**
- **Run-Log am Session-Ende ist Pflicht** — kein observable outcome ohne Run-Log (`YYYY-MM-DD_<agent>_<model>-<NN>.md`). → **M02**, **W04** *(mehrere Projekte)*

## 6. Deploy & Config — verifizieren statt blind kopieren

- **Deploy-Kommandos gegen den laufenden Stack verifizieren, nie aus veralteter Runbook-Zeile kopieren** — ein falscher `--project-name` legt Container in ein isoliertes Netz → realer ~11-Min-Prod-Outage. Runbook nach JEDEM Infra-Change aktualisieren. → **F09**, **G18**
- **Eine einzige Streu-HTML in `public/` kann den ganzen DSGVO-Gate-Deploy blocken** — vor Deploy `grep` auf Google-Fonts in `public/`; Dev-/Streu-HTML gehört nicht nach `public/`. → **G44**
- **Single-Host-Assert-Guard gegen Calls an abgehängte Alt-DBs/Hosts** — Streu-URLs (neon.tech/fly.dev) in `.env`/dist fail-closed abbrechen; diesen Wächter nicht entfernen. → **W27**
- **Enforcing-Security-Header (CSP) nie auf Basis lokaler Serve-Signale aktivieren** — lokales `next start` liefert falsche MIME-Typen; Report-Only zuerst, Enforcing erst nach prod-gleicher Verifikation. → **M21**
- **Committe Prisma-Migrationen** (nicht gitignoren) — `migrate deploy` deployt nur committete Migrationen, sonst erreichen Schema-Änderungen die Prod-DB nie. → **G29**, **G32**
- **Nach Host-Migration ALLE alten DNS-Records löschen** (A + AAAA + CNAME) — ein verwaister AAAA bringt nur IPv6-Clients sporadische „Netzwerkfehler". → **G20**
- **Dependency-Pins regelmäßig gegen OSV.dev auditieren** — alte Pins akkumulieren still CRITICAL-CVEs; duplizierte Versions-Pins atomar (Drei-Quellen-Regel) aktualisieren. → **M18**, **M17**

---

_Kurz-Mantra: **RLS unter NOBYPASSRLS · Live-Smoke statt grüner Mocks · Preflight + by-name-Commit · Desktop Commander auf Windows · globale Handler dürfen Gast-Flows nicht anfassen.**_
