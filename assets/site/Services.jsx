// Services.jsx, Leistungen, gegliedert in drei Saeulen
const servicePillars = [
  {
    id: 'automatisierung',
    name: 'Automatisierung',
    lead: 'Wiederkehrende Abläufe aufnehmen, strukturieren und so verbinden, dass weniger manuelle Schritte nötig sind.',
    image: '/uploads/stock/service-process-hand-robot.jpg',
    items: [
      { title: 'Prozesse & Workflows', desc: 'Wiederkehrende Aufgaben strukturieren und bestehende Tools zu einem durchgängigen Ablauf verbinden.', slug: 'prozess' },
      { title: 'Sensorik-Integration', desc: 'Maschinen, Lager und Füllstände werden messbar und digital nutzbar.', slug: 'sensorik' },
    ],
  },
  {
    id: 'ki-ml',
    name: 'KI & Machine Learning',
    lead: 'Wo feste Regeln nicht ausreichen: Muster in Daten erkennen, und diese Modelle direkt in die Automatisierung einbinden.',
    image: '/uploads/stock/service-ml.jpg',
    items: [
      { title: 'KI-Automatisierung', desc: 'Die Brücke zwischen beiden Bereichen: KI und ML direkt in bestehende Automatisierungen integriert.', slug: 'ki' },
      { title: 'Machine Learning', desc: 'Muster in Daten, Bildern oder Messwerten erkennen und daraus Aktionen ableiten.', slug: 'ml' },
    ],
  },
  {
    id: 'software',
    name: 'Software',
    lead: 'Anwendungen, die es so nicht von der Stange gibt, zugeschnitten auf den Ablauf, den Sie tatsächlich haben.',
    image: '/uploads/stock/service-workflows.jpg',
    items: [
      { title: 'Individualsoftware', desc: 'Vom Bestellsystem, das die Order vom Tablet direkt in die Küche schickt, bis zur Oberfläche, die Daten erfasst, auswertet und steuert.', slug: 'software' },
      { title: 'Webseiten & Webanwendungen', desc: 'Auftritte und Werkzeuge im Browser, von der Unternehmensseite bis zum internen Tool.', slug: 'webseiten' },
    ],
  },
  {
    id: 'produktfertigung',
    name: 'Produktfertigung',
    lead: 'Vom digitalen Modell zum fertigen Teil, erst das Muster, das passen muss, dann die Stückzahl.',
    image: '/uploads/stock/service-fertigung.jpg',
    items: [
      { title: 'Prototypen & Individualanfertigungen', desc: 'Das Teil, das es nicht zu kaufen gibt, konstruiert gegen die reale Einbausituation.', slug: '3d-druck' },
      { title: 'Kleinserien', desc: 'Wiederholbare Stückzahlen ohne Werkzeugkosten, gleiche Parameter, gleiches Ergebnis.', slug: 'kleinserien' },
    ],
  },
];
function Services() {
  return (
    <section id="leistungen" className="pillars-section">
      <div className="pillars-inner">
        <div className="section-heading pillars-header">
          <h2 className="pillars-h2">Leistungen</h2>
          <p className="pillars-sub">
            Vier Bereiche: Abläufe automatisieren, mit KI arbeiten, Software bauen und Teile fertigen.
          </p>
        </div>

        <div className="pillars-stack">
          {servicePillars.map((pillar, index) => (
            <article
              key={pillar.id}
              id={pillar.id}
              className={`pillar${index % 2 === 1 ? ' pillar--reverse' : ''}`}
            >
              <div className="pillar-media">
                <img src={pillar.image} alt="" loading="lazy" />
              </div>
              <div className="pillar-body">
                <div className="pillar-meta">
                  <span className="pillar-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <span className="pillar-kicker">Bereich</span>
                </div>
                <h3 className="pillar-title">{pillar.name}</h3>
                <p className="pillar-lead">{pillar.lead}</p>

                <ul className="pillar-services">
                  {pillar.items.map((item) => (
                    <li key={item.title} className="pillar-service">
                      {item.slug ? (
                        <a href={`/leistungen/${item.slug}/`}>
                          <span className="pillar-service__title">{item.title}</span>
                          <span className="pillar-service__desc">{item.desc}</span>
                          <span className="pillar-service__arrow" aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <div>
                          <span className="pillar-service__title">{item.title}</span>
                          <span className="pillar-service__desc">{item.desc}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {pillar.cta && (
                  <button
                    type="button"
                    className="pillar-cta"
                    onClick={() => window.openBooking && window.openBooking()}
                  >
                    {pillar.cta.label}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Services });
