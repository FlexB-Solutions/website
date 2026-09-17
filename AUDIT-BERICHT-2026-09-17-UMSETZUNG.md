# Audit-Umsetzung: flexbsolutions.de

**Prüf- und Umsetzungsdatum:** 17. September 2026  
**Geltungsbereich:** Repository und lokal erzeugtes GitHub-Pages-Artefakt.  
**Wichtig:** Dieser Bericht wird nicht mit der Website veröffentlicht.

## Ergebnis

Die Website ist für den nächsten Deploy technisch gehärtet, aufgeräumt und vollständig gegen das erzeugte Produktionsartefakt geprüft. Es wurden keine geheimen Werte im Code, keine bekannten hoch- oder kritisch eingestuften Paketlücken und keine eigenen Cookies, Browser-Speicher oder Tracker gefunden. Cal.com wird weiterhin erst nach einer bewussten Aktion geladen.

## Umgesetzte Befunde

| Befund | Änderung | Dateien | Status |
|---|---|---|---|
| Der Deploy veröffentlichte ganze Arbeitsordner samt Originalen. | Ein Skript folgt nur lokalen Referenzen von Seiten, CSS und JavaScript und erzeugt daraus ein sauberes Artefakt. | `scripts/prepare-production.mjs`, `.github/workflows/static.yml` | erledigt |
| Unsichere Action-Tags und keine Aktualisierungskontrolle. | Alle GitHub Actions sind auf überprüfte Commit-SHAs gepinnt; Dependabot prüft npm und Actions wöchentlich. | Workflow, `.github/dependabot.yml` | erledigt |
| Skript-CSP erlaubte beliebigen Inline-Code. | Buchungs- und Markt-Skripte sind ausgelagert; `script-src` erlaubt kein `unsafe-inline` mehr. | `assets/site/booking.js`, `assets/site/market-reveal.js`, HTML-Seiten | erledigt |
| Konsistente Absicherung fehlte bei älteren Weiterleitungen und 404. | CSP und Permissions-Policy auf alle ausgelieferten HTML-Seiten erweitert; 404 bekam einen Skip-Link. | `404.html`, `ui_kits/website/*` | erledigt |
| Kein Security-Kontakt. | RFC-9116-konforme Kontaktdatei ergänzt; Ablauf im README dokumentiert. | `.well-known/security.txt`, `README.md` | erledigt |
| Schwacher Kontrast kleiner Zahlen und Markttexte. | Farben auf WCAG-AA-tauglichen Kontrast angepasst. | `hero-proof-v2.css`, Marktseite | erledigt |
| Rechtstexte enthielten entbehrliche Haftungsbausteine. | „Haftung für Inhalte“ und „Haftung für Links“ entfernt. Pflichtangaben, Bildnachweis, § 18 MStV und Streitbeilegung blieben erhalten. | `impressum.html` | erledigt |
| Datenschutztext war nicht auf aktuellem Stand. | Stand-Datum aktualisiert, fehlenden Datenschutzbeauftragten eindeutig eingeordnet. Drittlandtext bleibt bewusst allgemein. | `datenschutz.html` | erledigt |
| Alte ungenutzte React-Komponenten. | Nicht referenzierte Vorgänger von Hero und Intro entfernt. | `HeroProof.jsx`, `EntrySequence.jsx` | erledigt |
| Ausgelieferte Bilder konnten Metadaten enthalten. | EXIF-, GPS- und Kameradaten entfernt. KI-Derivate erhielten `DigitalSourceType=trainedAlgorithmicMedia`; C2PA-Originale blieben unangetastet. | Optimierte/genutzte Bilder, `CREDITS.md` | erledigt |
| IFR-Grafik sagte regionales Wachstum aus, obwohl die Quelle regionale Installationsanteile nennt. | Grafik und Text zeigen jetzt korrekt: Asien 74 %, Europa 16 %, Amerika 9 % der weltweiten Neuinstallationen 2024. | Marktseite | erledigt |
| TTF-Schriftdateien waren zusätzlich zu WOFF2 im Deploy. | Nur WOFF2 wird referenziert und ausgeliefert; die Cache-Version des Stylesheets wurde erhöht. | `assets/flexb-theme.css`, HTML-Seiten | erledigt |

`style-src 'unsafe-inline'` bleibt absichtlich bestehen: Die Seite besitzt vorhandene Stilattribute und Stilblöcke; Cal.com kann nach Klick zusätzlich Inline-Stile benötigen. Der wichtigere Skriptbereich kommt jetzt ohne diese Ausnahme aus.

## Prüfungsergebnisse

### Produktionsartefakt

| Messung | Vorher | Nachher |
|---|---:|---:|
| Dateien | 151 | 95 |
| Größe | rund 72 MB | rund 7,4 MB |
| Fehlende lokale Referenzen | nicht geprüft | 0 |
| Öffentliche C2PA-Originale/Stock-Altbestände | teilweise enthalten | 0 |

Alle Start-, Leistungs-, Markt-, Rechts-, Weiterleitungs- und 404-Seiten sowie `/.well-known/security.txt` liefern im lokalen Produktionsartefakt HTTP 200.

### Zugänglichkeit und Interaktion

Automatischer axe-Test: 14 Seiten jeweils bei 1440 px und 375 px, insgesamt 28 Prüfläufe. Ergebnis nach Korrekturen: **0 WCAG-2.2-AA-Befunde**, keine Konsolenfehler, keine fehlgeschlagenen Requests, genau eine H1 pro Seite, vorhandener Hauptinhalt und Skip-Link, keine horizontale Überbreite.

Zusätzlich geprüft: Der Skip-Link erhält per Tastatur den Fokus. Der Inspiration-Bilddialog öffnet, Escape schließt ihn und der Fokus kehrt zum Auslöser zurück. Mit `prefers-reduced-motion: reduce` wird die Introsequenz nicht eingeblendet. Vor dem Klick auf „Termin buchen“ entstehen keine Drittanfragen. Nach dem Klick lädt Cal.com, das Modal zeigt Termine und den Ort **Zoom Video**; es wurde keine Buchung ausgelöst.

### Lighthouse, lokal unter mobiler Drosselung

| Seite | Performance vorher | Performance nachher | Accessibility / Best Practices / SEO nachher |
|---|---:|---:|---|
| Startseite | 64 | 67 | 100 / 100 / 100 |
| Leistungsseite Prozess | 81 | 88 | 100 / 100 / 100 |
| Marktseite | 92 | nach Layout- und Kontraständerung in axe geprüft | zuvor 100 / 100 / 100 |
| Impressum | 95 | nach Linkkorrektur in axe geprüft | SEO 66 wegen absichtlichem `noindex` |

Die Verbesserungen stammen aus kleineren Bildern, Wegfall ungenutzter TTF-Dateien, `defer` für nicht kritische Skripte und Bild-Preloads. Die beiden Performance-Werte unter 90 haben unterschiedliche Ursachen: Auf der Startseite ist die absichtlich sichtbare, scrollgesteuerte Introsequenz das LCP-Element; die Messung bewertet ihr spätes Wegscrollen als Render-Verzögerung. Auf den Leistungsseiten bestimmt das große Hero-Bild die gedrosselte Ladezeit. Beide Seiten haben 0 ms Total Blocking Time. Eine weitere Optimierung auf über 90 würde entweder die bewusst gestaltete Introsequenz auf Mobilgeräten entfernen oder ein neues, deutlich kleineres Hero-Bildformat erfordern. Das wurde nicht ohne gestalterische Entscheidung geändert.

### Text- und Quellprüfung

Schreibweise, „Sie“-Ansprache, Unternehmensname und Gedankenstriche in den veröffentlichten Seiten wurden gesucht; es blieben keine Gedankenstriche in veröffentlichtem Text übrig. Es wurden keine Aussagen gefunden, die einen Online-Vertrag, Preise, Garantien, Zertifikate oder nicht belegte eigene Ergebnisse versprechen.

Mindestens fünf Zahlen der Marktseite wurden gegen die jeweils verlinkten Originalquellen geprüft:

- WEF: 86 % für KI und Informationsverarbeitung, 58 % für Robotik und Automatisierung, 41 % für Energie.
- Grand View Research: 12,3 Mrd. USD 2023, 24,0 Mrd. USD 2030 und 9,7 % CAGR.
- IFR: 542.000 Neuinstallationen 2024, mehr als doppelt so viele wie zehn Jahre zuvor, sowie die korrigierten regionalen Anteile 74/16/9 %.

Die BCG-Detailwerte 6/10/18 % sind über die frei zugängliche Artikelseite nicht ausreichend methodisch nachvollziehbar. Sie bleiben als vorsichtige Einordnung mit Quellenlink bestehen, sollten bei einer späteren Inhaltsüberarbeitung aber durch eine direkt zitierbare Datentabelle oder eine nicht-numerische Darstellung ersetzt werden.

## Entscheidungen, die Felix treffen muss

### E1: Server-Sicherheitsheader

GitHub Pages erlaubt keine eigenen HSTS-, `frame-ancestors`-, `X-Content-Type-Options`- oder serverseitigen CSP-Header. Empfehlung: Die Website zunächst so belassen; die Meta-CSP ist jetzt gehärtet. Wenn mehr Härtung nötig wird, ist Cloudflare vor GitHub Pages die günstigste Option. Das erfordert eine DNS-Umstellung, führt Cloudflare als weiteren Dienst in der Datenschutzerklärung ein und kann auch auf einem kostenfreien Tarif genutzt werden. Netlify oder ein EU-Hoster wären vollständige Hosting-Migrationen mit mehr Aufwand und laufenden Kosten.

### E2: Geschäftliche E-Mail

Für das private Outlook.com-Konto ist kein geschäftlicher AV-Vertrag nachgewiesen. Microsofts DPA gilt für vertraglich gebuchte Online-Dienste wie Microsoft 365/Exchange Online, nicht als belegte Grundlage für ein kostenloses Outlook.com-Privatkonto. Empfehlung: vor wachsender geschäftlicher Nutzung auf eine Domain-Adresse umstellen. Möglichkeiten sind Microsoft 365 Business mit Exchange Online, mailbox.org oder IONOS Mail Business. Vor dem Wechsel Preis, AV-Vertrag, Speicherort und Auftragsverarbeiter prüfen.

Danach sind beim Mailanbieter die DNS-Einträge **MX**, **SPF**, **DKIM** und **DMARC** gemäß dessen Anleitung einzurichten. Die Adresse kommt derzeit in Website-Texten, `mailto:`-Links, `assets/site/contact-email.js`, dem `security.txt` und Datenschutzhinweisen vor; erst nach eingerichteter Mailbox soll sie überall ersetzt werden.

### E3: Cal.com und Zoom

Die Website ist technisch korrekt auf eine Zwei-Klick-Einbindung begrenzt. Vor geschäftlicher Nutzung der Termin- und Videodaten müssen die AV-Unterlagen in beiden Konten abgeschlossen bzw. dokumentiert werden: im Cal.com-Konto unter Datenschutz-/Legal-Einstellungen und bei Zoom über dessen Datenschutz- und Vertragsunterlagen beziehungsweise das Admin-Konto. Erst danach die Unterlagen lokal ablegen und die tatsächlichen Unterauftragsverarbeiter mit der Datenschutzerklärung abgleichen.

### E4: Markenrecherche „FlexB“

Eine rechtssichere Kollisionsprüfung kann nicht aus einer allgemeinen Websuche abgeleitet werden. Empfehlung: Vor größerer Investition die Wortmarken in DPMAregister und EUIPO eSearch plus ähnliche Schreibweisen, Klassen und Software-/Automatisierungsleistungen prüfen lassen. Der in Österreich auftretende ähnliche Name ist ein Anlass für die Prüfung, aber kein Beleg für eine Kollision.

### CAA und DNSSEC

GitHub Pages beschafft für eine korrekt eingerichtete Custom Domain Zertifikate über Let's Encrypt. Wenn bei INWX CAA gesetzt werden soll, ist der passende, minimale Eintrag:

```
Typ: CAA
Name: @
Flags: 0
Tag: issue
Wert: letsencrypt.org
```

Nur setzen, wenn kein weiterer Dienst Zertifikate für die Domain ausstellen muss. DNSSEC kann bei INWX für die Zone aktiviert werden; anschließend muss INWX den DS-Eintrag für `.de` veröffentlichen. Vorher prüfen, dass alle autoritativen Nameserver und der Registrar denselben DNSSEC-Ablauf verwenden.

### GitHub Pages prüfen

In GitHub: Repository **Settings → Pages**. Dort muss bei *Custom domain* `flexbsolutions.de` mit grünem Haken stehen und *Enforce HTTPS* aktiviert sein. GitHub bestätigt, dass Pages mit korrekter Custom-Domain-Konfiguration HTTPS erzwingt und dafür Let's Encrypt nutzt.

## Aufgaben für Felix

1. Im ELSTER-Postfach bzw. in Schreiben des BZSt nachsehen, ob eine Wirtschafts-Identifikationsnummer (W-IdNr.) zugeteilt wurde. Falls ja, muss sie nach § 5 Abs. 1 Nr. 6 DDG ins Impressum (ebenso eine USt-IdNr., falls vorhanden). Die Nummer dann an Claude geben.
2. AV-Unterlagen von Cal.com und Zoom im jeweiligen Konto abschließen oder dokumentieren.
3. Über den künftigen geschäftlichen Mailanbieter entscheiden und erst dann eine Domain-Mailbox samt MX, SPF, DKIM und DMARC einrichten.
4. GitHub Pages: Custom-Domain-Haken und „Enforce HTTPS“ kontrollieren.
5. Vor Markenanmeldung oder größeren Werbemitteln DPMAregister/EUIPO eSearch fachlich prüfen lassen.

## Quellen und Rechtsstand

- [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html), abgerufen am 17. September 2026.
- [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html), abgerufen am 17. September 2026.
- [GitHub Pages: HTTPS erzwingen](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https), abgerufen am 17. September 2026.
- [Microsoft Products and Services DPA](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA?lang=1), abgerufen am 17. September 2026.
- [WEF Future of Jobs Report 2025](https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/), veröffentlicht am 7. Januar 2025.
- [Grand View Research: Manufacturing Automation Market](https://www.grandviewresearch.com/industry-analysis/manufacturing-automation-market-report), abgerufen am 17. September 2026.
- [IFR World Robotics 2025](https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years?stream=top), veröffentlicht am 25. September 2025.

Dieser Bericht ist eine technische und organisatorische Prüfung, keine individuelle Rechtsberatung. Die Unternehmens- und Vertragsentscheidungen oben benötigen die tatsächlichen Unterlagen und bei Bedarf fachkundige rechtliche Prüfung.
