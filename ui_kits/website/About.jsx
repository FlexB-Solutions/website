// About.jsx, Über Felix section
const aboutStyles = {
  section: { padding: '96px 24px', background: '#fff' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  header: { maxWidth: 760, margin: '0 auto 32px', textAlign: 'center' },
  content: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' },
  photoWrap: { borderRadius: 20, overflow: 'hidden', aspectRatio: '4/5', position: 'relative', background: 'var(--brand-tint)', border: '1px solid var(--brand-light)' },
  photo: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  eyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 12 },
  h2: { fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 600, color: 'var(--brand)', marginBottom: 20 },
  body: { fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 },
  ctaRow: { display: 'flex', gap: 12, marginTop: 28 },
  btnPrimary: { background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnOutline: { background: 'transparent', color: 'var(--brand-ink)', border: '1.5px solid var(--brand)', borderRadius: 8, padding: '11px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
};

function About() {

  return (
    <section id="ubermich" style={aboutStyles.section}>
      <div style={aboutStyles.inner}>
        <div className="section-heading" style={aboutStyles.header}>
          <div style={aboutStyles.eyebrow}>Über mich</div>
          <h2 style={aboutStyles.h2}>Über mich</h2>
        </div>
        <div className="about-content" style={aboutStyles.content}>
          <div
            className={`about-photo reveal-base is-visible`}
            data-reveal-side="left"
            style={aboutStyles.photoWrap}
          >
            <img src="/assets/optimized/felix-breitner.jpg" alt="Felix Breitner von FlexB Solutions" width="1200" height="1143" loading="lazy" decoding="async" style={aboutStyles.photo} />
          </div>
          <div className={`about-copy reveal-base is-visible`} data-reveal-side="right">
            <div style={aboutStyles.name}>Hallo, ich bin Felix. Gründer von FlexB Solutions</div>
          <p style={aboutStyles.body}>
            Im Großkonzern habe ich gesehen, wie viel Zeit verloren geht, sobald immer mehr Mitarbeitende, Systeme und Abstimmungen an einem Prozess beteiligt sind. Vieles wird dadurch langsamer, unübersichtlicher und unnötig aufwendig, obwohl die eigentliche Aufgabe oft klar ist.
          </p>
          <p style={aboutStyles.body}>
            Genau dort setze ich mit FlexB Solutions an. Ich entwickle Automatisierungen, die Abläufe vereinfachen, Übergaben reduzieren und technische Möglichkeiten so einsetzen, dass sie im Alltag wirklich entlasten. Hinter der Marke steht also kein anonymes Team, sondern ich persönlich mit einem klaren Fokus auf praktikable Lösungen für Unternehmen und private Gebäudeprojekte.
          </p>
          <div className="about-cta" style={aboutStyles.ctaRow}>
            <button style={aboutStyles.btnPrimary} onClick={() => document.getElementById('kontakt').scrollIntoView({behavior:'smooth'})}>Nachricht schreiben</button>
            <button style={aboutStyles.btnOutline} onClick={() => window.open('https://www.linkedin.com/in/felix-breitner-369627284/', '_blank', 'noopener,noreferrer')}>LinkedIn</button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { About });
