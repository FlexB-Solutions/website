// Results.jsx – Was Sie gewinnen (qualitativ)
const resultsStyles = {
  section: { padding: '86px 24px', background: 'var(--brand-ink)' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: 0 },
  eyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-light)', marginBottom: 12 },
  h2: { fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff', marginBottom: 14 },
  sub: { fontSize: 17, color: 'var(--brand-light)' },
};

function Results() {

  return (
    <section id="ergebnisse" style={resultsStyles.section}>
      <div style={resultsStyles.inner}>
        <div style={resultsStyles.header}>
          <div style={resultsStyles.eyebrow}>Was Automatisierung ausmacht</div>
          <h2 style={resultsStyles.h2}>Der Unterschied, den Automatisierung macht</h2>
          <p style={resultsStyles.sub}>Konkrete Vorteile für Ihren Alltag von Tag eins an.</p>
          <a href="/automatisierung-markt/" className="market-cta">
            Warum Automatisierung wichtig wird
          </a>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Results });
