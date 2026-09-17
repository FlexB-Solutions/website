# Auditbericht: flexbsolutions.de

**Prüfdatum:** 17. September 2026  
**Gegenstand:** Live-Website `https://flexbsolutions.de` und Repository  
**Stand:** technische und öffentlich überprüfbare Punkte abgeschlossen. Rechtliche Angaben, die von den tatsächlichen Verhältnissen des Unternehmens abhängen, sind als offene Punkte markiert.

## Ergebnis auf einen Blick

Die Website hat eine gute Ausgangslage: HTTPS ist erzwungen, die Hauptdomain ist eindeutig, die Sitemap und `robots.txt` sind erreichbar, Cal.com wird erst nach einem bewussten Klick geladen, und beim normalen Seitenaufruf wurden keine Analyse-, Marketing- oder Drittanbieter-Ressourcen festgestellt. Der Abhängigkeitscheck meldet keine bekannten hoch- oder kritisch eingestuften Sicherheitslücken.

Vor einer abschließenden Umsetzung sind vier Themen wichtig:

1. Der GitHub-Pages-Deploy veröffentlicht deutlich mehr Dateien als die Website benötigt (rund **72 MB**, darunter große Originalbilder und Arbeitsmaterial).
2. GitHub Pages bietet keine frei konfigurierbaren Sicherheitsheader. Die vorhandene Meta-CSP ist sinnvoll, kann aber wegen Inline-Code noch nicht ohne `'unsafe-inline'` auskommen.
3. Eine sehr kleine Beschriftung im Startseiten-Schaubild hat zu wenig Kontrast.
4. Datenschutzerklärung und Impressum hängen an noch unbestätigten Unternehmens- und Tool-Fakten.

Es wurden in diesem Audit **keine Live-Änderungen** vorgenommen. Das entspricht der Vorgabe, Rechts- und Unternehmensfakten nicht zu raten und Änderungen erst nach der gebündelten Faktenabfrage umzusetzen.

## Prüfung und Befunde

| Priorität | Bereich | Befund | Risiko | Empfohlene Maßnahme |
|---|---|---|---|---|
| Hoch | Veröffentlichtes Material | Der Workflow kopiert den gesamten Ordner `uploads/` in das öffentliche Artefakt. Die Prüfung des erzeugten Artefakts ergab 151 Dateien mit rund 72 MB. Darin liegen auch große KI-Originale und Dateien, die nicht für die Live-Seite gebraucht werden. | Höhere Lade- und Downloadlast; unnötige öffentliche Bereitstellung von Arbeitsdateien und Metadaten. | Deploy auf eine Positivliste benötigter Dateien umstellen; Originale und Arbeitsdateien nur im Repository behalten. Die C2PA-Originale bleiben erhalten, werden aber nicht öffentlich ausgeliefert. |
| Mittel | Sicherheitsheader | HTTPS-Umleitung, Apex-Domain und `www`-Weiterleitung funktionieren. GitHub Pages liefert aber weder HSTS noch `X-Content-Type-Options`, `X-Frame-Options` oder serverseitige CSP-Header. | Gering bis mittel; Plattformgrenze von GitHub Pages. | Erst nach Entscheidung einen vorgeschalteten Dienst wie Cloudflare oder einen anderen Hoster prüfen. Das würde DNS, Datenschutz und Betrieb verändern und wird deshalb nicht automatisch umgesetzt. |
| Mittel | CSP | Eine Meta-CSP existiert auf Start-, Leistungs- und Rechtsseiten. Sie beschränkt Quellen gut (`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`), enthält aber bei Skripten und Styles `'unsafe-inline'`. | Der Schutz vor eingeschleustem Inline-Code ist schwächer als möglich. | Inline-JavaScript und Inline-CSS schrittweise auslagern oder mit Hashes absichern; anschließend CSP verschärfen. |
| Mittel | Abhängigkeiten | `npm audit --omit=dev --audit-level=high` meldet 0 Sicherheitslücken. Die GitHub Actions verwenden Versions-Tags statt unveränderlicher Commit-Hashes. Dependabot ist nicht eingerichtet. | Supply-Chain-Risiko ist niedrig, aber vermeidbar. | Dependabot für npm und GitHub Actions ergänzen; Actions bei nächster Wartung auf geprüfte Commit-SHAs pinnen. |
| Mittel | DNS | Für die Domain wurden keine MX-, SPF-, DMARC-, CAA-, DS- oder DNSSEC-Einträge gefunden. Die öffentliche Kontaktadresse ist `@outlook.com`; daher betrifft SPF/DMARC aktuell nicht den Versand über eine eigene Domain-Adresse. | Kein akuter Fehler für die vorhandene Outlook-Adresse. CAA/DNSSEC sind optionale Härtungen. | Erst festlegen, ob künftig Mail von `@flexbsolutions.de` versendet wird. Dann SPF, DKIM und DMARC passend zum Mailanbieter einrichten. CAA/DNSSEC können gesondert entschieden werden. |
| Niedrig | Barrierefreiheit | Die SVG-Klassse `.benefit-number` nutzt `#718578` auf `#f6f5f0`; der Kontrast beträgt etwa 3,6:1 bei 11 px Text und erreicht damit nicht WCAG AA für normalen Text. | Eingeschränkte Lesbarkeit. | Farbe gezielt abdunkeln; damit wird der Kontrast ohne gestalterischen Umbau erfüllt. |
| Niedrig | 404-Seite | Die 404-Seite hat eine Meta-CSP, Referrer-Policy, `main`, einen sinnvollen Titel und `noindex`, aber keinen Skip-Link und keine Meta-Permissions-Policy. | Kleine Barrierefreiheits- und Konsistenzlücke. | Skip-Link und dieselbe Permissions-Policy wie auf den übrigen Seiten ergänzen. |
| Beobachtung | JavaScript | Die Startseite rendert den Hauptinhalt erst im Browser mit React. Ohne JavaScript enthält sie nur einen kurzen Hinweis und Rechtslinks. | Niedrig für die übliche Nutzung, aber nachteilig für No-JS-Zugänglichkeit und initiale Indexierungsrobustheit. | Bei einem späteren Relaunch statisches Vor-rendering oder ein statisches HTML-Grundgerüst erwägen. |

## Bestätigte technische Punkte

- `http://flexbsolutions.de` leitet per 301 auf HTTPS weiter.
- `https://www.flexbsolutions.de` leitet per 301 auf die Hauptdomain weiter.
- Eine nicht vorhandene URL liefert HTTP 404.
- `robots.txt` ist erreichbar und verweist auf `https://flexbsolutions.de/sitemap.xml`.
- Die Sitemap ist gültig erreichbar und enthält Startseite, neun Leistungsseiten und die Marktseite.
- Alle 61 im Quellcode gefundenen internen Zieladressen waren beim Live-Abruf erreichbar (HTTP 200).
- Startseite, Marktseite und Leistungsseiten besitzen Sprache `de`, einen eindeutigen `h1`, Titel, Description, Canonical-URL, Open-Graph-Daten und parsebares JSON-LD.
- Die alten Adressen unter `/ui_kits/website/` leiten auf die heutigen URLs weiter.
- Vor dem Klick auf die Terminbuchung wurden keine Drittanbieter-Ressourcen festgestellt. Nach Klick lädt ausschließlich die Cal.com-Einbindung; eine Buchung wurde nicht ausgelöst.
- Der Quellcode enthält keine eigene Nutzung von Cookies, `localStorage`, `sessionStorage`, IndexedDB oder Service Workern. Die einzigen technischen Treffer für `innerHTML` stammen aus der mitgelieferten React-Laufzeit, nicht aus eigenem Anwendungscode.
- Externe Links, die in einem neuen Tab öffnen, verwenden `rel="noopener noreferrer"`.
- Ein sicherer Historien-Scan auf übliche Schlüssel-Muster ergab keine Treffer. Die lokale `.env`-Datei ist nicht versioniert und wird nicht in das Deploy-Artefakt kopiert; Werte wurden nicht ausgelesen.
- Es wurden keine direkt eingebundenen Google Fonts, Analytics-, Facebook-, CDN-, Karten- oder Social-Media-Widgets gefunden.

## Rechtliche Prüfung: vorhandener Stand

### Impressum

Das Impressum nennt den bürgerlichen Namen, die Geschäftsbezeichnung, eine ladungsfähige Anschrift, Telefon und E-Mail. Das entspricht den Kernangaben aus [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html). Es gibt keine veralteten Verweise auf TMG, TTDSG, RStV oder die abgeschaltete EU-OS-Plattform.

Die Aussage zur Verbraucherstreitbeilegung ist nur richtig, wenn tatsächlich keine Teilnahmebereitschaft und keine besondere gesetzliche Pflicht besteht. Bei höchstens zehn Beschäftigten entfällt die allgemeine Informationspflicht nach [§ 36 VSBG](https://www.gesetze-im-internet.de/vsbg/__36.html); die freiwillige Aussage sollte dennoch anhand der tatsächlichen Situation bestätigt werden.

Die allgemeinen Abschnitte zu Inhalten und externen Links sind nicht zwingend nötig. Sie sind nicht als vollständiger Haftungsausschluss formuliert, sollten aber redaktionell vereinfacht werden, falls die Rechtsangaben ohnehin überarbeitet werden.

### Datenschutz

Die Erklärung beschreibt GitHub Pages, E-Mail/Telefon, Cal.com, Outlook und Zoom, das Zwei-Klick-Verhalten, Cookies und Betroffenenrechte. Die Adresse der niedersächsischen Datenschutzaufsicht stimmt mit der offiziellen Angabe überein: Prinzenstraße 5, 30159 Hannover. GitHub bestätigt öffentlich, dass für GitHub-Pages-Besuche IP-Adressen zu Sicherheitszwecken protokolliert werden. Quellen: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [LfD Niedersachsen](https://www.lfd.niedersachsen.de/startseite/wir_uber_uns/informationspflichten_nach_der_dsgvo/transparenz-und-informationspflichten-nach-artikel-13-und-artikel-14-datenschutz-grundverordnung-164720.html).

Die Aussage, dass kein Cookie-Banner erforderlich ist, passt zum geprüften eigenen Code. Nach [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html) bleibt sie nur dann richtig, wenn keine zusätzlichen, nicht technisch erforderlichen Speicherungen oder Dienste ergänzt werden.

Für Cal.com ist die jetzige Formulierung bewusst allgemein. Cal.com beschreibt sich für kundenkonto-basierte Buchungen als Auftragsverarbeiter und nennt Drittlandtransfers sowie Garantien in seiner [Datenschutzerklärung](https://cal.com/privacy). Eine präzisere Erklärung setzt voraus, dass die tatsächlich verwendeten Konten, Auftragsverarbeitungsverträge, Kalender- und Videodienste bestätigt sind.

### KI-Bilder und Aussagen

Das Impressum enthält einen Bildnachweis mit Hinweis auf KI-generierte Illustrationen, keine realen Anlagen oder Kundenprojekte und C2PA-Herkunftskennzeichnung der Originale. Das ist eine gute Grundlage. Bei allen neu hinzukommenden fotorealistischen KI-Bildern muss die Zuordnung zum Hinweis erhalten bleiben. Die ausgelieferten optimierten JPEGs sollen bei der geplanten Deploy-Bereinigung noch einmal auf sichtbare Hinweise und Metadaten geprüft werden.

Werbeaussagen, Kundenreferenzen, Zahlen und Logos brauchen weiterhin einen Beleg oder eine Einwilligung. Im Audit wurden keine offensichtlichen Garantie-, Zertifizierungs- oder Erfolgsversprechen gefunden, die ohne Nachweis entfernt werden müssten.

## Noch benötigte Fakten vor einer rechtlichen Finalisierung

Bitte einmal gesammelt bestätigen oder ergänzen:

1. Ist das Gewerbe angemeldet? Besteht eine IHK- oder HWK-Zugehörigkeit?
2. Gilt die Kleinunternehmerregelung nach § 19 UStG? Liegt eine USt-IdNr. oder Wirtschafts-Identifikationsnummer vor?
3. Werden über die Website ausschließlich unverbindliche Anfragen und Termine vereinbart oder können Kundinnen und Kunden online verbindliche Verträge schließen bzw. bezahlen?
4. Werden Preise oder AGB verwendet?
5. Wird für Termine tatsächlich Microsoft Outlook und Zoom eingesetzt? Gibt es für geschäftliche E-Mails ausschließlich die Outlook.com-Adresse oder auch einen Domain-Mailanbieter?
6. Sind Firmenname, Anschrift, Telefon und E-Mail im Impressum aktuell?
7. Sind alle Referenzen, Beispiele, Zahlen, Logos und Kundenstimmen belegbar bzw. freigegeben?
8. Besteht eine Berufshaftpflichtversicherung oder eine weitere berufsrechtliche Zugehörigkeit, die genannt werden muss?

## Geplanter Umsetzungsschritt nach Bestätigung

Nach den Antworten lässt sich ein klar abgegrenztes, risikoarmes Paket umsetzen:

1. Deployment auf benötigte öffentliche Dateien begrenzen.
2. Kontrast der kleinen SVG-Zahlen korrigieren.
3. 404-Seite an Skip-Link und Permissions-Policy angleichen.
4. Dependabot ergänzen und GitHub Actions härten.
5. Impressum und Datenschutzerklärung nur mit bestätigten Tatsachen finalisieren.
6. Danach lokal bauen, den Veröffentlichungsumfang prüfen, live testen und erst dann veröffentlichen.

## Grenzen dieser Prüfung

Dies ist eine technische und organisatorische Prüfung, keine individuelle Rechtsberatung. Die rechtliche Verbindlichkeit von Unternehmensangaben, Verträgen, Steuerstatus, Versicherungen, Nutzungsrechten und Auftragsverarbeitungsverträgen kann nur mit den tatsächlichen Unterlagen beurteilt werden. Ein automatisierter Axe-Test konnte in der lokalen Umgebung nicht gestartet werden, weil der verfügbare ChromeDriver nicht zur installierten Chrome-Version passte; die wichtigsten Zugänglichkeitsprüfungen wurden deshalb per Quellcode und manuell vorgenommen.
