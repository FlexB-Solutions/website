# Lizenz- und Herkunftsnachweise

Nachweis für alle Schriften, Bilder und Fremdcode auf flexbsolutions.de.

Stand: 16. September 2026

## Schriften

| Datei | Schrift | Lizenz | Nachweis |
|---|---|---|---|
| `assets/fonts/ibm-plex-sans-400.*`<br>`assets/fonts/ibm-plex-sans-500.*`<br>`assets/fonts/ibm-plex-sans-600.*` | IBM Plex Sans | SIL Open Font License 1.1 | `assets/fonts/ibmplexsans-OFL.txt` |
| `assets/fonts/outfit-600.*` | Outfit | SIL Open Font License 1.1 | `assets/fonts/outfit-OFL.txt` |

Beide Schriften werden selbst ausgeliefert, es wird kein externer Font-Dienst eingebunden.

## Fremdcode

| Datei | Paket | Version | Lizenz |
|---|---|---|---|
| `assets/vendor/react.production.min.js` | React | 18.3.1 | MIT (Lizenzhinweis im Dateikopf) |
| `assets/vendor/react-dom.production.min.js` | ReactDOM | 18.3.1 | MIT (Lizenzhinweis im Dateikopf) |

## KI-generierte Bilder

Diese Dateien tragen **C2PA Content Credentials** — eine kryptografisch
signierte Herkunftsangabe im Bild selbst. Ausgelesen am 16.09.2026, Aussteller
laut Signatur: OpenAI OpCo, LLC („OpenAI Media Service API"), Zertifikatskette
über die Trufo C2PA CA. Modell: `gpt-image`. Der hinterlegte IPTC-Code lautet
`digitalsourcetype/trainedAlgorithmicMedia`, also vollständig KI-generiert.

| Datei | Erzeugt laut Signatur | Verwendung |
|---|---|---|
| `uploads/stock/landing-page-hero.png` | 2026-05-05 | Intro-Hintergrund Startseite |
| `uploads/Anklicken_Firma.png` | 2026-04-30 | Grundbild „Virtuelle Firma" |
| `uploads/BSP.png`, `BSP2`–`BSP6` | 2026-05-04 | sechs Beispiele in „Virtuelle Firma" |
| `uploads/Sensoren_auf_Tisch.png` | 2026-05-07 | Sensorik, Webseiten |
| `uploads/Microcontroller.png` | 2026-05-07 | Sensorik |
| `uploads/Lidar_Bild.png` | 2026-05-07 | Sensorik |
| `uploads/Ultraschall_Auswertung.png` | 2026-05-07 | Sensorik |
| `uploads/Kapazitiver Sensor.png` | 2026-05-07 | Sensorik |
| `uploads/Objekterkennung_Python.png` | 2026-05-07 | Machine Learning, Software |
| `uploads/Anomalieerkennung.png` | 2026-05-07 | Machine Learning |
| `uploads/Beispiel_Regression.png` | 2026-05-07 | Machine Learning, Software |
| `uploads/Landing_Page.png` | 2026-05-05 | Webseiten |
| `uploads/Crisp_ML_Q.png` | 2026-05-06 | derzeit ungenutzt |
| `uploads/cad-parametrisch.png` | 2026-09-11 | derzeit ungenutzt |
| `uploads/ai-originals/service-process-hand-robot.png` | 2026-09-17 | Automatisierung, Prozesse, Software und Webseiten |
| `uploads/ai-originals/service-ml.png` | 2026-09-17 | Machine Learning und KI-Workflow |
| `uploads/ai-originals/service-workflows.png` | 2026-09-17 | Custom Workflows und Software |
| `uploads/ai-originals/service-software-hero.png` | 2026-09-17 | Hero-Bild Individualsoftware |
| `uploads/ai-originals/service-software-overview.png` | 2026-09-17 | Leistungsübersicht Software |
| `uploads/ai-originals/service-fertigung.png` | 2026-09-17 | Produktfertigung |
| `uploads/ai-originals/service-ai.png` | 2026-09-17 | KI-Automatisierung |
| `uploads/ai-originals/service-data-alt.png` | 2026-09-17 | Daten und Struktur |
| `uploads/ai-originals/service-ml-data.png` | 2026-09-17 | Machine Learning |
| `uploads/ai-originals/service-sensorik.png` | 2026-09-17 | Sensorik-Integration |
| `uploads/ai-originals/prototyp-einzelteil.png` | 2026-09-17 | Prototypen und Individualanfertigungen |
| `uploads/ai-originals/kleinserie-winkel.png` | 2026-09-17 | Kleinserien |

**Wichtig:** Die ausgelieferten JPEG-Fassungen unter `assets/optimized/` haben
diese Credentials **nicht** mehr. Eine Neukodierung bricht die Signatur
zwangsläufig, weil sie an den Pixel-Hash gebunden ist, und ohne eigenes
Signaturzertifikat lässt sie sich nicht erneuern. Die Originale in `uploads/`
bleiben deshalb als Herkunftsnachweis liegen und dürfen nicht gelöscht werden.

Die Herkunft ist stattdessen im Bildnachweis des Impressums offengelegt, und
die betroffenen Beispielgalerien tragen einen Hinweis direkt am Abschnitt.

## Echte Aufnahmen und Screenshots

| Datei | Inhalt | Herkunft |
|---|---|---|
| `uploads/Bild_Felix_Breitner.png` | Porträt Felix Breitner | Kein Fotograf beteiligt, das Bild wurde mit KI nachbearbeitet. Keine Rechte Dritter betroffen. |
| `uploads/Beispiel_Anwendung_Python.png` | Füllstand-Monitor, eigene Anwendung | eigener Screenshot (macOS) |
| `uploads/Beispiel_Dashboard_Node_red.png` | Node-RED-Dashboard | eigener Screenshot (macOS) |
| `uploads/Flow_Beispiel_node_red.png` | Node-RED-Flow | eigener Screenshot (macOS) |
| `uploads/Beispiel_Flow_n8n.png` | n8n-Flow | eigener Screenshot |
| `uploads/KNIME.png`, `Knime_Flow.png` | KNIME-Oberfläche | eigener Screenshot, zeigt fremde Software |

## Nicht veröffentlichte Altbestände

Die früheren Dateien unter `uploads/stock/` mit nicht dokumentierter Herkunft
werden nicht mehr referenziert und sind durch den Veröffentlichungsprozess von
der Live-Seite ausgeschlossen. Sie bleiben ausschließlich als lokale
Altbestände im Repository und sind keine veröffentlichten Website-Inhalte.

## Abgeleitete Bilddateien

`assets/optimized/` und `uploads/optimized/` enthalten komprimierte Fassungen
von Originalen aus `uploads/`. Ausgeliefert wird nur die komprimierte Fassung.
Rechtlich gilt für sie jeweils dasselbe wie für das Original.

## Fremde Wort- und Bildmarken

Im Repository liegen Logos fremder Anbieter (`uploads/Gmail_Logo.png`,
`uploads/Google_Kalender_Logo.png`, `uploads/Logo_Outlook.png`,
`uploads/Logo_Whatsapp.png`, `uploads/Python_logo.png`,
`uploads/Node_Red_Logo.png`, `uploads/n8n_Logo.png`, `uploads/KNIME.png`).

Die Verwendung zur Bezeichnung einer tatsächlich unterstützten Integration ist
nach § 23 Abs. 1 Nr. 2 MarkenG in der Regel zulässig, solange kein Eindruck
einer Partnerschaft oder Zertifizierung entsteht. Für Google-, Microsoft- und
Meta-Marken gelten zusätzlich die jeweiligen Brand Guidelines der Anbieter.
**Vor einem Einsatz auf der Website sind diese Richtlinien zu prüfen.**
