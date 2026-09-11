// CookieBanner.jsx – transparenter Hinweis zu technisch notwendigen Speicherungen
function CookieBanner() {
  const hasConsent = () => {
    return localStorage.getItem('flexb_cookies_accepted');
  };
  const rememberConsent = (value) => {
    localStorage.setItem('flexb_cookies_accepted', value);
  };

  const [visible, setVisible] = React.useState(() => !hasConsent());
  const [showDetails, setShowDetails] = React.useState(false);

  if (!visible) return null;

  const accept = () => {
    rememberConsent('necessary');
    setVisible(false);
  };

  return (
    <div style={cookieStyles.overlay}>
      <div style={cookieStyles.banner}>
        <div style={cookieStyles.top}>
          <div style={cookieStyles.iconRow}>
            <div style={cookieStyles.iconBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
                <path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/>
              </svg>
            </div>
            <div>
            <div style={cookieStyles.title}>Datenschutzhinweis</div>
              <div style={cookieStyles.subtitle}>Diese Website verwendet nur technisch notwendige Speicherungen.</div>
            </div>
          </div>
          <p style={cookieStyles.body}>
            Diese Website verwendet keine Analyse-, Tracking- oder Marketing-Cookies. Gespeichert werden nur technisch notwendige Einstellungen und eine lokale FlexBot-Session-ID zur Begrenzung von Missbrauch. Cal.com wird erst geladen, wenn Sie die Terminbuchung öffnen.
            Für diese technisch notwendigen Speicherungen ist keine Einwilligung erforderlich. Weitere Informationen finden Sie in unserer
            Weitere Informationen finden Sie in unserer{' '}
            <a href="datenschutz.html" style={cookieStyles.link}>Datenschutzerklärung</a>.
          </p>

          {showDetails && (
            <div style={cookieStyles.details}>
              <div style={cookieStyles.detailRow}>
                <div style={cookieStyles.detailInfo}>
                  <div style={cookieStyles.detailName}>Notwendige Cookies</div>
                  <div style={cookieStyles.detailDesc}>Speicherung Ihrer Hinweis-Auswahl und einer lokalen FlexBot-Session-ID. Die Terminbuchung wird erst nach Ihrer ausdrücklichen Aktion an Cal.com übertragen.</div>
                </div>
                <div style={cookieStyles.alwaysBadge}>Immer aktiv</div>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowDetails(d => !d)}
            style={cookieStyles.detailToggle}
          >
            {showDetails ? 'Details ausblenden ▴' : 'Details anzeigen ▾'}
          </button>
        </div>

        <div style={cookieStyles.actions}>
          <button style={cookieStyles.btnAll} onClick={accept}>
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
}

const cookieStyles = {
  overlay: {
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
    padding: '16px',
    display: 'flex', justifyContent: 'center',
    pointerEvents: 'none',
  },
  banner: {
    background: '#fff',
    borderRadius: 4,
    border: '1px solid var(--brand-tint)',
    boxShadow: '0 8px 32px rgba(16,40,31,0.12)',
    padding: '24px 28px',
    maxWidth: 560,
    width: '100%',
    pointerEvents: 'all',
  },
  top: { marginBottom: 20 },
  iconRow: { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  iconBox: {
    width: 44, height: 44, background: 'var(--brand-tint)', borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  title: { fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 },
  subtitle: { fontSize: 13, color: 'var(--muted)' },
  body: { fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 10 },
  link: { color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 },
  detailToggle: {
    background: 'none', border: 'none', padding: 0,
    fontSize: 12, color: '#6b7280', cursor: 'pointer',
    fontFamily: 'inherit', fontWeight: 500,
  },
  details: {
    background: 'var(--paper)', borderRadius: 10, padding: '12px 16px',
    marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 12,
  },
  detailRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  detailInfo: {},
  detailName: { fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 },
  detailDesc: { fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 },
  alwaysBadge: {
    background: 'var(--brand-tint)', color: 'var(--brand-ink)', borderRadius: 9999,
    fontSize: 11, fontWeight: 700, padding: '3px 10px', flexShrink: 0,
  },
  actions: { display: 'flex', gap: 10 },
  btnAll: {
    width: '100%', background: 'var(--brand)', color: '#fff',
    border: 'none', borderRadius: 8,
    padding: '11px', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 12px rgba(24,115,68,0.28)',
    transition: 'background 0.2s',
  },
};

Object.assign(window, { CookieBanner });
