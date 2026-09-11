// ForWhom.jsx – Für wen? section
const fwStyles = {
  section: { padding: '96px 24px', background: 'var(--paper)' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: 56 },
  eyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 12 },
  h2: { fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 14 },
  sub: { fontSize: 17, color: 'var(--muted)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 24 },
  card: { background: '#fff', borderRadius: 20, padding: 36, border: '1px solid var(--brand-tint)', boxShadow: '0 2px 12px rgba(24,115,68,0.07)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 },
  iconBox: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 22, fontWeight: 700, color: 'var(--ink)' },
  cardSub: { fontSize: 13, color: 'var(--muted)', marginTop: 2 },
  list: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 },
  listItem: { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--muted)', lineHeight: 1.55 },
  check: { width: 20, height: 20, background: 'var(--brand-tint)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
};

const b2bItems = [
  'Abläufe und wiederkehrende Aufgaben',
  'Daten, Systeme und Schnittstellen',
  'Individuelle Software und digitale Werkzeuge',
  'KI-Unterstützung für passende Anwendungsfälle',
  'Konstruktion und Fertigung von Einzelteilen, Kleinserien und 3D-Druck',
];

const privatItems = [
  'Abläufe im Zuhause und im Alltag',
  'Gebäude, Räume und technische Ausstattung',
  'Sensorik und Auswertung',
  'Individuelle digitale Lösungen',
  'Konstruktion und Fertigung passender Einzelteile im 3D-Druck',
];


function ForWhom() {

  const CheckIcon = () => (
    <div style={fwStyles.check}>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="var(--brand)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );
  return (
    <section id="furwen" style={fwStyles.section}>
      <div style={fwStyles.inner}>
        <div className="section-heading" style={fwStyles.header}>
          <div style={fwStyles.eyebrow}>Zielgruppe</div>
          <h2 style={fwStyles.h2}>Für wen ist FlexB?</h2>
          <p style={fwStyles.sub}>Lösungen für Unternehmen und Privatpersonen. Individuell zugeschnitten.</p>
        </div>
        <div className="forwhom-grid" style={fwStyles.grid}>
          <div className={`reveal-base is-visible`} data-reveal-side="bottom" style={fwStyles.card}>
            <div style={fwStyles.cardHeader}>
              <div style={{...fwStyles.iconBox, background: 'var(--brand-tint)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <div>
                <div style={fwStyles.cardTitle}>Unternehmen (B2B)</div>
                <div style={fwStyles.cardSub}>KMU bis Großunternehmen</div>
              </div>
            </div>
            <ul style={fwStyles.list}>
              {b2bItems.map(i => <li key={i} style={fwStyles.listItem}><CheckIcon />{i}</li>)}
            </ul>
          </div>
          <div className={`reveal-base is-visible`} data-reveal-side="bottom" style={fwStyles.card}>
            <div style={fwStyles.cardHeader}>
              <div style={{...fwStyles.iconBox, background: 'var(--brand-tint)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div style={fwStyles.cardTitle}>Privatkunden</div>
                <div style={fwStyles.cardSub}>Gebäude, Zuhause & private Objekte</div>
              </div>
            </div>
            <ul style={fwStyles.list}>
              {privatItems.map(i => <li key={i} style={fwStyles.listItem}><CheckIcon />{i}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { ForWhom });
