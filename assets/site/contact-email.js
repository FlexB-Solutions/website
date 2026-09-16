(() => {
  const recipient = 'flexbsolutions@outlook.com';
  const templates = {
    '3d-druck': {
      subject: 'Anfrage, 3D-Druck & Fertigung',
      body: `Hallo Felix,\n\nich interessiere mich für Unterstützung bei einem 3D-Druck- oder Fertigungsprojekt.\n\nWas soll gefertigt werden?\n[Bitte kurz beschreiben]\n\nBenötigte Menge / Stückzahl:\n[Bitte ergänzen]\n\nWichtige Anforderungen oder gewünschter Termin:\n[Bitte ergänzen]\n\nBeste Grüße\n[Name]`,
    },
    kleinserien: {
      subject: 'Anfrage, Kleinserie',
      body: `Hallo Felix,\n\nich möchte eine Kleinserie anfragen.\n\nWas soll gefertigt werden?\n[Bitte kurz beschreiben]\n\nGewünschte Stückzahl:\n[Bitte ergänzen]\n\nMaterial, Anforderungen oder gewünschter Termin:\n[Bitte ergänzen]\n\nBeste Grüße\n[Name]`,
    },
    ki: {
      subject: 'Anfrage, KI & AI Act',
      body: `Hallo Felix,\n\nich möchte einen KI-Anwendungsfall besprechen.\n\nWobei soll KI unterstützen?\n[Bitte kurz beschreiben]\n\nWelche Systeme oder Daten sind bereits vorhanden?\n[Bitte ergänzen]\n\nGibt es Fragen zum AI Act oder zur Umsetzung?\n[Bitte ergänzen]\n\nBeste Grüße\n[Name]`,
    },
    webseiten: {
      subject: 'Anfrage, Website',
      body: `Hallo Felix,\n\nich interessiere mich für eine Website oder einen digitalen Auftritt.\n\nWas soll die Website erreichen?\n[Bitte kurz beschreiben]\n\nWelche Inhalte oder Funktionen werden benötigt?\n[Bitte ergänzen]\n\nBeste Grüße\n[Name]`,
    },
    sensorik: {
      subject: 'Anfrage, Sensorik & Auswertung',
      body: `Hallo Felix,\n\nich möchte einen Anwendungsfall mit Sensorik und Auswertung besprechen.\n\nWas soll erfasst oder überwacht werden?\n[Bitte kurz beschreiben]\n\nWo kommt die Lösung zum Einsatz?\n[Bitte ergänzen]\n\nBeste Grüße\n[Name]`,
    },
    prozess: {
      subject: 'Anfrage, Prozessautomatisierung',
      body: `Hallo Felix,\n\nich möchte einen wiederkehrenden Ablauf verbessern oder automatisieren.\n\nWelcher Ablauf kostet aktuell Zeit?\n[Bitte kurz beschreiben]\n\nWelche Systeme oder Personen sind beteiligt?\n[Bitte ergänzen]\n\nWas soll sich am Ende verbessern?\n[Bitte ergänzen]\n\nBeste Grüße\n[Name]`,
    },
    ml: {
      subject: 'Anfrage, Machine Learning',
      body: `Hallo Felix,\n\nich möchte einen Machine-Learning-Anwendungsfall besprechen.\n\nWelche Frage oder Aufgabe soll gelöst werden?\n[Bitte kurz beschreiben]\n\nWelche Daten liegen bereits vor?\n[Bitte ergänzen]\n\nBeste Grüße\n[Name]`,
    },
    'custom-workflows': {
      subject: 'Anfrage, Individueller Workflow',
      body: `Hallo Felix,\n\nich möchte einen individuellen digitalen Workflow besprechen.\n\nWas soll der Workflow übernehmen?\n[Bitte kurz beschreiben]\n\nWelche Tools oder Systeme werden heute genutzt?\n[Bitte ergänzen]\n\nBeste Grüße\n[Name]`,
    },
    software: {
      subject: 'Anfrage, Individuelle Software',
      body: `Hallo Felix,\n\nich interessiere mich für eine individuelle Softwarelösung.\n\nWelche Aufgabe soll die Software lösen?\n[Bitte kurz beschreiben]\n\nGibt es bestehende Systeme, die angebunden werden sollen?\n[Bitte ergänzen]\n\nBeste Grüße\n[Name]`,
    },
  };

  document.querySelectorAll('[data-email-template]').forEach(link => {
    const template = templates[link.dataset.emailTemplate];
    if (!template) return;
    link.href = `mailto:${recipient}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
  });
})();
