// Footer.jsx, Site footer
const footerStyles = {
  footer: { background: 'var(--ink)', padding: '48px 24px 32px' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  top: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 40 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 },
  logoText: { fontSize: 20, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' },
  logoB: { color: 'var(--brand)' },
  tagline: { fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 20 },
  colTitle: { fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 14 },
  linkList: { display: 'flex', flexDirection: 'column', gap: 8 },
  link: { fontSize: 14, color: '#9ca3af', textDecoration: 'none' },
  divider: { borderTop: '1px solid #1f2937', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  copy: { fontSize: 13, color: '#6b7280' },
  legal: { display: 'flex', gap: 20 },
  legalLink: { fontSize: 13, color: '#6b7280', textDecoration: 'none' },
};

function Footer() {
  const navLinks = [
    ['Leistungen', '#leistungen'],
    ['Für wen?', '#furwen'],
    ['Ergebnisse', '#ergebnisse'],
    ['Über mich', '#ubermich'],
    ['Kontakt', '#kontakt'],
  ];

  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.inner}>
        <div className="footer-top" style={footerStyles.top}>
          <div>
            <div style={footerStyles.logoRow}>
              <span className="footer-wordmark" style={footerStyles.logoText}>Flex<span style={footerStyles.logoB}>B</span></span>
              <span style={{ width:1, height:20, background:'var(--muted)', margin:'0 4px' }}></span>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', color:'#9ca3af' }}>SOLUTIONS</span>
            </div>
            <div style={footerStyles.tagline}>Automatisierung & Prozessoptimierung<br />für Unternehmen und Privatpersonen.</div>
          </div>
          <div>
            <div style={footerStyles.colTitle}>Navigation</div>
            <div style={footerStyles.linkList}>
              {navLinks.map(([label, href]) => (
                <a key={label} href={href} style={footerStyles.link}>{label}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={footerStyles.colTitle}>Kontakt</div>
            <div style={footerStyles.linkList}>
              <a href="mailto:flexbsolutions@outlook.com" style={footerStyles.link}>flexbsolutions@outlook.com</a>
              <a href="tel:+4915159916160" style={footerStyles.link}>+49 151 59916160</a>
              <span style={footerStyles.link}>Vorsteher-Niemann-Weg 2, 38368 Rennau</span>
              <a href="https://www.linkedin.com/in/felix-breitner-369627284/" target="_blank" rel="noopener noreferrer" style={footerStyles.link}>LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-divider" style={footerStyles.divider}>
          <span style={footerStyles.copy}>© 2026 Felix Breitner, tätig unter FlexB Solutions.</span>
          <div className="footer-legal" style={footerStyles.legal}>
            <a href="impressum.html" style={footerStyles.legalLink}>Impressum</a>
            <a href="datenschutz.html" style={footerStyles.legalLink}>Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
Object.assign(window, { Footer });
