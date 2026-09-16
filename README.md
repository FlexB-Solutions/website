# website

Offizielle Website von FlexB Solutions, erreichbar unter https://flexbsolutions.de

Statische Seite, deployt über GitHub Pages (`.github/workflows/static.yml`,
läuft bei jedem Push auf `main`).

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | Weiterleitung auf die Startseite |
| `404.html` | Fehlerseite, von GitHub Pages automatisch ausgeliefert |
| `ui_kits/website/` | Startseite (React) sowie Impressum und Datenschutzerklärung |
| `leistungen/*/` | Neun Leistungsseiten, statisches HTML |
| `automatisierung-markt/` | Marktseite mit Quellenangaben |
| `assets/` | Schriften, Theme-CSS, Bilder, React-Bibliotheken |
| `uploads/` | Bildmaterial |

## Entwicklung

Die Startseite ist in React geschrieben. Die Komponenten liegen als `.jsx`
in `ui_kits/website/` und werden mit Babel nach `.js` übersetzt. Die
erzeugten `.js`-Dateien sind **nicht** eingecheckt, der Deploy baut sie selbst.

Einmalig:

```bash
npm install
```

Nach jeder Änderung an einer `.jsx`-Datei:

```bash
npm run build
```

Danach lokal ansehen, zum Beispiel mit einem beliebigen statischen Server im
Projektverzeichnis. Ohne `npm run build` fehlen die `.js`-Dateien und die
Startseite bleibt leer.

## Worauf beim Ändern zu achten ist

- **Impressum und Datenschutz** müssen nach § 5 DDG von **jeder** Seite aus
  verlinkt bleiben. Neue Seiten brauchen den `subpage-footer`-Block.
- **Keine externen Skripte, Schriften oder Bilder einbinden.** Die Seite lädt
  beim Aufruf nichts von Dritten; die Datenschutzerklärung sagt das ausdrücklich
  zu. Ein CDN-Einbindung würde diese Aussage falsch machen und eine
  Einwilligungslösung nötig machen.
- Die `Content-Security-Policy` in den `<head>`-Bereichen erlaubt nur `self`
  und `cal.com`. Neue externe Einbindungen müssten dort ergänzt werden.
- Nach Änderungen an `assets/flexb-theme.css` die Versionsnummer im
  `?v=`-Parameter aller Seiten erhöhen, sonst bekommen Besucher die alte Datei.
- Cal.com wird erst nach Klick auf „Termin buchen" geladen. Das ist bewusst so
  und hält die Seite ohne Cookie-Banner zulässig.

## Lizenzen

Nachweise für Schriften, Bilder und Fremdcode stehen in [CREDITS.md](CREDITS.md).
