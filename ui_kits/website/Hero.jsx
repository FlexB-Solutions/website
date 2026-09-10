// Hero.jsx – FlexB Solutions hero section
const heroStyles = {
  eyebrow: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--brand-tint)', borderRadius: 9999, padding: '5px 14px', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-ink)', marginBottom: 20 },
  dot: { width: 7, height: 7, background: 'var(--brand)', borderRadius: '50%' },
  accent: { color: 'var(--brand)' },
  ctas: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 },
  btnPrimary: { background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(24,115,68,0.28)', transition: 'background 0.2s' },
  btnOutline: { background: 'var(--brand-tint)', color: 'var(--brand-ink)', border: '1.5px solid var(--brand)', borderRadius: 8, padding: '13px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s', boxShadow: '0 4px 16px rgba(24,115,68,0.16)' },
  trust: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  trustItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)' },
  checkIcon: { width: 18, height: 18, background: 'var(--brand-tint)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  imageBox: { borderRadius: 20, overflow: 'hidden', background: 'var(--brand-tint)', border: '1px solid var(--brand-light)', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  placeholder: { textAlign: 'center', color: '#b6e8c7', fontSize: 14, fontWeight: 500 },
};

function Hero() {
  return (
    <section id="hero" tabIndex={-1} className="hero-section">
      <div className="hero-inner">
        <div className="hero-content-panel">
          <div className="hero-logo-lockup" aria-label="FlexB Solutions">
            <div className="hero-logo">Flex<span>B</span></div>
            <div className="hero-logo-divider"></div>
            <div className="hero-logo-sub">
              <strong>SOLUTIONS</strong>
              <span>Automatisierung & Prozessoptimierung</span>
            </div>
          </div>
          <h1 className="hero-title">
            Automatisieren Sie,<br /> was Sie <span style={heroStyles.accent}>aufhält.</span>
          </h1>
          <p className="hero-lead">
            Maßgeschneiderte Automatisierungslösungen für Unternehmen und Privatpersonen. Individuell zugeschnitten.{' '}
            <span className="hero-emph hero-emph--1">Mehr Zeit.</span>{' '}
            <span className="hero-emph hero-emph--2">Weniger Fehler.</span>{' '}
            <span className="hero-emph hero-emph--3">Mehr Wachstum.</span>
          </p>
          <div className="hero-ctas" style={heroStyles.ctas}>
            <button style={heroStyles.btnPrimary}
              onClick={() => document.getElementById('kontakt').scrollIntoView({behavior:'smooth'})}>
              Nachricht schreiben
            </button>
            <button style={heroStyles.btnOutline}
              onClick={() => window.openBooking && window.openBooking()}>
              Termin buchen
            </button>
          </div>
          <div className="hero-trust" style={heroStyles.trust}>
            {['Kostenlose Erstberatung', 'Schnelle Umsetzung', 'Individuell & skalierbar'].map(t => (
              <div key={t} style={heroStyles.trustItem}>
                <div style={heroStyles.checkIcon}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="var(--brand)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>
        <HeroProof />
      </div>
    </section>
  );
}
Object.assign(window, { Hero });
