// Contact.jsx – Kontakt & CTA section
const contactStyles = {
  section: { padding: '96px 24px', background: '#fff' },
  inner: { maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'stretch' },
  infoCol: { display: 'flex', flexDirection: 'column', height: '100%' },
  formCol: { display: 'flex', flexDirection: 'column', height: '100%' },
  eyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 12 },
  h2: { fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 14 },
  lead: { fontSize: 16, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 32 },
  calBox: { background: 'var(--paper)', borderRadius: 4, padding: '24px 26px', border: '1px solid var(--brand-tint)', display: 'flex', alignItems: 'center', gap: 16 },
  calIcon: { width: 48, height: 48, background: 'var(--brand-tint)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' },
  calTitle: { fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 5 },
  calDesc: { fontSize: 14, color: 'var(--muted)', lineHeight: 1.55 },
  calBtn: { background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%', boxShadow: '0 4px 16px rgba(24,115,68,0.25)', marginTop: 'auto' },
  form: { display: 'flex', flexDirection: 'column', gap: 16, height: '100%' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--ink)' },
  input: { fontFamily: 'inherit', fontSize: 14, color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--brand-border)', borderRadius: 8, padding: '11px 14px', outline: 'none' },
  textarea: { fontFamily: 'inherit', fontSize: 14, color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--brand-border)', borderRadius: 8, padding: '11px 14px', outline: 'none', resize: 'vertical', minHeight: 100 },
  privacyHint: { fontSize: 12, color: '#6b7280', lineHeight: 1.55, margin: '0 0 2px' },
  submitBtn: { background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%', boxShadow: '0 4px 16px rgba(24,115,68,0.25)', marginTop: 'auto' },
};

function Contact() {
  return (
    <section id="kontakt" style={contactStyles.section}>
      <div className="contact-layout" style={contactStyles.inner}>
        <div style={contactStyles.infoCol} data-guide-target="contact-info">
          <div style={contactStyles.eyebrow}>Kontakt</div>
          <h2 style={contactStyles.h2}>Lassen Sie uns sprechen.</h2>
          <p style={contactStyles.lead}>Sie haben eine Idee, ein Problem oder möchten einfach wissen, was möglich ist? Schreiben Sie uns direkt per E-Mail oder buchen Sie ein Erstgespräch.</p>
          <div style={contactStyles.calBox}>
            <div style={contactStyles.calIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            </div>
            <div>
              <div style={contactStyles.calTitle}>Termin buchen</div>
              <div style={contactStyles.calDesc}>30 Minuten kostenloses Erstgespräch. Unverbindlich und direkt online.</div>
            </div>
          </div>
          <button style={contactStyles.calBtn} type="button" onClick={() => window.openBooking && window.openBooking()}>Termin buchen</button>
        </div>
        <div style={contactStyles.formCol} data-guide-target="contact-form">
          <div style={{ ...contactStyles.calBox, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', flex: 1, padding: '32px' }}>
            <div style={contactStyles.eyebrow}>Direkter Kontakt</div>
            <h3 style={{ ...contactStyles.calTitle, fontSize: 24 }}>Schreiben Sie uns direkt.</h3>
            <p style={{ ...contactStyles.lead, marginBottom: 24 }}>Ihr E-Mail-Programm öffnet sich mit FlexB Solutions als Empfänger. Beschreiben Sie kurz Ihr Anliegen und senden Sie die Nachricht direkt ab.</p>
            <p style={{ ...contactStyles.privacyHint, marginTop: 16 }}>E-Mail: flexbsolutions@outlook.com</p>
            <a style={{ ...contactStyles.calBtn, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', marginTop: 'auto' }} href="mailto:flexbsolutions@outlook.com?subject=Anfrage%20an%20FlexB%20Solutions">E-Mail schreiben</a>
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Contact });
