// Inspiration.jsx - Klickbare Firmenkarte
const companyAreas = [
  {
    number: 1,
    id: 'empfang',
    name: 'Empfang',
    title: 'Automatische Terminbuchung',
    image: '../../uploads/optimized/BSP.jpg?v=2',
    hotspot: { left: '29.06%', top: '58.85%' },
    copy: 'Anfragen werden automatisch aufgenommen, freie Termine geprüft und direkt bestätigt.'
  },
  {
    number: 2,
    id: 'buero',
    name: 'Büro',
    title: 'Workflow Automatisierung',
    image: '../../uploads/optimized/BSP2.jpg?v=2',
    hotspot: { left: '18.12%', top: '34.94%' },
    copy: 'Büroabläufe werden durch Trigger, Datenverarbeitung und automatische Aktionen verbunden.'
  },
  {
    number: 3,
    id: 'lager',
    name: 'Lager',
    title: 'Automatisches Bestandsmanagement',
    image: '../../uploads/optimized/BSP4.jpg?v=2',
    hotspot: { left: '51.88%', top: '18.76%' },
    copy: 'Bestände werden überwacht, Schwellwerte erkannt und Nachbestellungen automatisch ausgelöst.'
  },
  {
    number: 4,
    id: 'band',
    name: 'Band',
    title: 'Automatische Paketklassifizierung',
    image: '../../uploads/optimized/BSP5.jpg?v=2',
    hotspot: { left: '52.58%', top: '40.45%' },
    copy: 'Pakete werden am Band erkannt, vermessen und in den passenden Ablauf übergeben.'
  },
  {
    number: 5,
    id: 'heizung',
    name: 'Heizung',
    title: 'Intelligente Gebäudesteuerung',
    image: '../../uploads/optimized/BSP3.jpg?v=2',
    hotspot: { left: '81.33%', top: '40.45%' },
    copy: 'Heizung, Licht und Räume reagieren auf Kalenderdaten und tatsächliche Nutzung.'
  },
  {
    number: 6,
    id: 'behaelter',
    name: 'Behälter',
    title: 'Visuelle Grenzwertkontrolle',
    image: '../../uploads/optimized/BSP6.jpg?v=2',
    hotspot: { left: '85.39%', top: '59.67%' },
    copy: 'Füllstand oder Grenzwerte werden automatisch geprüft und bei Abweichungen gemeldet.'
  }
];

function lockPageScroll() {
  const body = document.body;
  const html = document.documentElement;
  const currentLocks = Number(body.dataset.overlayLocks || '0');
  if (currentLocks === 0) {
    body.dataset.prevOverflow = body.style.overflow || '';
    html.dataset.prevOverflow = html.style.overflow || '';
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
  }
  body.dataset.overlayLocks = String(currentLocks + 1);
}

function unlockPageScroll() {
  const body = document.body;
  const html = document.documentElement;
  const currentLocks = Number(body.dataset.overlayLocks || '0');
  const nextLocks = Math.max(0, currentLocks - 1);
  if (nextLocks === 0) {
    body.style.overflow = body.dataset.prevOverflow || '';
    html.style.overflow = html.dataset.prevOverflow || '';
    delete body.dataset.overlayLocks;
    delete body.dataset.prevOverflow;
    delete html.dataset.prevOverflow;
  } else {
    body.dataset.overlayLocks = String(nextLocks);
  }
}

function Inspiration() {
  const items = [
    ['Erfassen', 'Informationen und wiederkehrende Aufgaben werden klar strukturiert.'],
    ['Verbinden', 'Systeme und Daten greifen sinnvoll ineinander.'],
    ['Reagieren', 'Definierte Abläufe laufen zuverlässig und nachvollziehbar.'],
  ];
  return (
    <section id="inspiration" className="company-section">
      <div className="company-inner">
        <div className="company-header">
          <div className="company-eyebrow">Automatisierte Abläufe</div>
          <h2 className="company-title">Von der Anfrage bis zur passenden Reaktion.</h2>
          <p className="company-sub">Automatisierung verbindet Informationen, Systeme und Aufgaben zu einem klaren Ablauf.</p>
        </div>
        <div className="company-map inspiration-cards">
          {items.map(([title, copy], index) => (
            <article key={title} className="service-feature-row" style={{padding: '28px 24px', background: '#fff', border: '1px solid var(--brand-tint)', borderRadius: 6}}>
              <div className="company-eyebrow">0{index + 1}</div>
              <h3 style={{margin: '12px 0 8px', color: 'var(--ink)'}}>{title}</h3>
              <p style={{margin: 0, color: 'var(--muted)', lineHeight: 1.6}}>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Inspiration });
