// Inspiration.jsx - Klickbare Firmenkarte
const companyAreas = [
  {
    number: 1,
    id: 'empfang',
    name: 'Empfang',
    title: 'Automatische Terminbuchung',
    image: '/uploads/optimized/BSP.jpg?v=2',
    hotspot: { left: '29.06%', top: '58.85%' },
    copy: 'Anfragen werden automatisch aufgenommen, freie Termine geprüft und direkt bestätigt.'
  },
  {
    number: 2,
    id: 'buero',
    name: 'Büro',
    title: 'Workflow Automatisierung',
    image: '/uploads/optimized/BSP2.jpg?v=2',
    hotspot: { left: '18.12%', top: '34.94%' },
    copy: 'Büroabläufe werden durch Trigger, Datenverarbeitung und automatische Aktionen verbunden.'
  },
  {
    number: 3,
    id: 'lager',
    name: 'Lager',
    title: 'Automatisches Bestandsmanagement',
    image: '/uploads/optimized/BSP4.jpg?v=2',
    hotspot: { left: '51.88%', top: '18.76%' },
    copy: 'Bestände werden überwacht, Schwellwerte erkannt und Nachbestellungen automatisch ausgelöst.'
  },
  {
    number: 4,
    id: 'band',
    name: 'Band',
    title: 'Automatische Paketklassifizierung',
    image: '/uploads/optimized/BSP5.jpg?v=2',
    hotspot: { left: '52.58%', top: '40.45%' },
    copy: 'Pakete werden am Band erkannt, vermessen und in den passenden Ablauf übergeben.'
  },
  {
    number: 5,
    id: 'heizung',
    name: 'Heizung',
    title: 'Intelligente Gebäudesteuerung',
    image: '/uploads/optimized/BSP3.jpg?v=2',
    hotspot: { left: '81.33%', top: '40.45%' },
    copy: 'Heizung, Licht und Räume reagieren auf Kalenderdaten und tatsächliche Nutzung.'
  },
  {
    number: 6,
    id: 'behaelter',
    name: 'Behälter',
    title: 'Visuelle Grenzwertkontrolle',
    image: '/uploads/optimized/BSP6.jpg?v=2',
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
  const [activeId, setActiveId] = React.useState(companyAreas[0].id);
  const [zoomOpen, setZoomOpen] = React.useState(false);
  const activeIndex = companyAreas.findIndex(area => area.id === activeId);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeArea = companyAreas[safeIndex] || companyAreas[0];
  const dialog = React.useRef(null);
  const closeButton = React.useRef(null);
  const lastFocused = React.useRef(null);

  React.useEffect(() => {
    if (!zoomOpen) return;
    const handler = (event) => {
      if (event.key === 'Escape') setZoomOpen(false);
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
      if (event.key !== 'Tab' || !dialog.current) return;
      // Fokus im Dialog halten, solange er offen ist.
      const stops = dialog.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [zoomOpen, safeIndex]);

  React.useEffect(() => {
    if (!zoomOpen) return undefined;
    // Fokus in den Dialog holen und beim Schliessen zum Ausloeser zuruecklegen.
    lastFocused.current = document.activeElement;
    closeButton.current?.focus();
    return () => lastFocused.current?.focus?.();
  }, [zoomOpen]);

  React.useEffect(() => {
    if (!zoomOpen) return undefined;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [zoomOpen]);

  const openArea = (id) => {
    setActiveId(id);
    setZoomOpen(true);
  };

  const showPrevious = () => {
    const previousIndex = (safeIndex - 1 + companyAreas.length) % companyAreas.length;
    setActiveId(companyAreas[previousIndex].id);
  };

  const showNext = () => {
    const nextIndex = (safeIndex + 1) % companyAreas.length;
    setActiveId(companyAreas[nextIndex].id);
  };

  return (
    <section id="inspiration" className="company-section">
      <div className="company-inner">
        <div className="company-header">
          <div className="company-eyebrow">Virtuelle Firma</div>
          <h2 className="company-title">Klicken Sie sich durch einen automatisierten Unternehmensprozess.</h2>
          <p className="company-sub">
            Die Zahlen markieren konkrete Bereiche. Ein Klick zoomt in das passende Automatisierungsbeispiel.
          </p>
        </div>

        <div className="company-map">
          <div className="company-map__top">
            <div className="company-map__label">FlexB Solutions</div>
            <div className="company-map__hint">Nummer anklicken, Beispiel ansehen</div>
          </div>
          <div className="company-image-stage">
            <img
              className="company-base-image"
              src="/uploads/optimized/Anklicken_Firma.jpg"
              width="1280"
              height="853"
              alt="Virtuelle Firma mit markierten Bereichen"
            />
            {companyAreas.map(area => (
              <button
                key={area.id}
                className={`company-hotspot ${activeArea.id === area.id ? 'is-active' : ''}`}
                style={area.hotspot}
                type="button"
                onClick={() => openArea(area.id)}
                aria-label={`${area.number} ${area.name}: ${area.title}`}
                title={`${area.number} ${area.name}: ${area.title}`}
              >
                <span>{area.number}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {zoomOpen && (
        <div
          className="company-lightbox"
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="company-lightbox-title"
          onClick={event => event.target === event.currentTarget && setZoomOpen(false)}
        >
          <div className="company-lightbox__inner">
            <button className="company-lightbox__close" ref={closeButton} type="button" onClick={() => setZoomOpen(false)} aria-label="Schließen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <button className="company-lightbox__arrow company-lightbox__arrow--left" type="button" onClick={showPrevious} aria-label="Vorheriges Beispiel">
              ‹
            </button>
            <button className="company-lightbox__arrow company-lightbox__arrow--right" type="button" onClick={showNext} aria-label="Nächstes Beispiel">
              ›
            </button>
            <img className="company-lightbox__image" src={activeArea.image} alt={activeArea.title} />
            <div className="company-lightbox__caption">
              <strong id="company-lightbox-title">{activeArea.number} · {activeArea.name}: {activeArea.title}</strong>
              <span>{activeArea.copy}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
Object.assign(window, { Inspiration });
