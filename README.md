# website

Offizielle Website von FlexB Solutions, erreichbar unter https://flexbsolutions.de

Statische Seite, deployt über GitHub Pages (`.github/workflows/static.yml`,
läuft bei jedem Push auf `main`).

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | Startseite (React) |
| `impressum.html`, `datenschutz.html` | Rechtsseiten |
| `404.html` | Fehlerseite, von GitHub Pages automatisch ausgeliefert |
| `leistungen/*/` | Neun Leistungsseiten, statisches HTML |
| `automatisierung-markt/` | Marktseite mit Quellenangaben |
| `assets/site/` | React-Komponenten und CSS der Startseite |
| `assets/` | Schriften, Theme-CSS, Bilder, React-Bibliotheken |
| `uploads/` | Bildmaterial, darunter die Originale mit C2PA-Kennzeichnung |
| `ui_kits/website/` | nur noch eine Weiterleitung, siehe unten |

Die Seite lag früher unter `/ui_kits/website/`. Unter diesem Pfad steht jetzt
eine Weiterleitung auf `/`, damit bereits geteilte Links und Suchmaschinen-
einträge weiter funktionieren. **Diese Weiterleitung nicht löschen.**

## Entwicklung

Die Startseite ist in React geschrieben. Die Komponenten liegen als `.jsx`
in `assets/site/` und werden mit Babel nach `.js` übersetzt. Die
erzeugten `.js`-Dateien sind **nicht** eingecheckt, der Deploy baut sie selbst.

Einmalig:

```bash
npm install
```

Nach jeder Änderung an einer `.jsx`-Datei:

```bash
npm run build
```

Für einen produktionsgleichen Ordner anschließend:

```bash
npm run prepare-production
```

Der Schritt folgt allen lokal referenzierten Dateien der ausgelieferten Seiten
und kopiert ausschließlich diese in `public/`. Originale in `uploads/`,
einschließlich der C2PA-Nachweise, bleiben im Repository und werden nicht
automatisch veröffentlicht.

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
- **KI-generierte Bilder** sind im Impressum unter „Bildnachweis" offengelegt
  und tragen auf den Leistungsseiten einen Hinweis am Abschnitt. Kommen neue
  dazu, gehört der Hinweis mit. Die Originale in `uploads/` tragen die
  C2PA-Signatur und dürfen nicht gelöscht werden. Die ausgelieferten
  JPEG-Fassungen verlieren die C2PA-Signatur beim Komprimieren, tragen aber
  das IPTC/XMP-Feld `DigitalSourceType=trainedAlgorithmicMedia`.
- Die fotorealistischen Website-Motive werden ohne Personen und ohne Roboter
  eingesetzt. Die Fertigungsseite beschreibt ausschließlich additive
  Fertigung mittels FLM/FDM; neue Bilder müssen fachlich dazu passen.
- Auf einer Leistungsseite wird ein Motiv nur einmal sichtbar eingesetzt.
  Bildserien und Beispielabschnitte müssen die jeweilige Leistung konkret
  zeigen und dürfen nicht mit denselben Bildern wie der technische Abschnitt
  doppeln.
- Bilder aus `uploads/stock/` sind historische Altbestände und werden bewusst
  nicht veröffentlicht. Neue Leistungsbilder kommen als C2PA-Original nach
  `uploads/ai-originals/` und als komprimierte Fassung nach `assets/optimized/`.
- Cal.com wird erst nach Klick auf „Termin buchen" geladen. Das ist bewusst so
  und hält die Seite ohne Cookie-Banner zulässig.
- `/.well-known/security.txt` läuft am 17. September 2027 ab. Das Datum bei
  einer jährlichen Website-Wartung um zwölf Monate verlängern.

## Lizenzen

Nachweise für Schriften, Bilder und Fremdcode stehen in [CREDITS.md](CREDITS.md).
