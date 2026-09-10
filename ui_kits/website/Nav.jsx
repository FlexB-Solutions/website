// Nav.jsx – FlexB Solutions navigation
const navStyles = {
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(246,245,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--brand-tint)' },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' },
  logoFlex: { fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' },
  logoB: { color: 'var(--brand)' },
  divider: { width: 1, height: 28, background: 'var(--brand-light)', margin: '0 2px' },
  logoSub: { fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--ink)' },
  logoTagline: { fontSize: 10, color: 'var(--muted)', marginTop: 1 },
  links: {},
  link: { fontSize: 14, fontWeight: 500, color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' },
  ctaBtn: { background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
};

function Nav() {
  const links = [
    ['Leistungen', '#leistungen'],
    ['Für wen?', '#furwen'],
    ['Ergebnisse', '#ergebnisse'],
    ['Über mich', '#ubermich'],
  ];
  return (
    <nav className="site-nav" style={navStyles.nav}>
      <div style={navStyles.inner}>
        <a href="#hero" style={navStyles.logo}>
          <span className="site-nav__wordmark" style={navStyles.logoFlex}>Flex<span style={navStyles.logoB}>B</span></span>
          <div className="site-nav__divider" style={navStyles.divider}></div>
          <div className="site-nav__tagline">
            <div style={navStyles.logoSub}>SOLUTIONS</div>
            <div style={navStyles.logoTagline}>Automatisierung & Prozessoptimierung</div>
          </div>
        </a>
        <div className="site-nav__links" style={navStyles.links}>
          {links.map(([label, href]) => (
            <a key={label} href={href} style={navStyles.link}>{label}</a>
          ))}
          <button style={navStyles.ctaBtn} onClick={() => window.openBooking && window.openBooking()}>Termin buchen</button>
        </div>
      </div>
    </nav>
  );
}
Object.assign(window, { Nav });
