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
  calTitle: { fontFamily: 'inherit', fontSize: 24, lineHeight: 1.2, fontWeight: 700, color: 'var(--ink)', margin: '0 0 5px' },
  calDesc: { fontSize: 14, color: 'var(--muted)', lineHeight: 1.55 },
  calBtn: { appearance: 'none', WebkitAppearance: 'none', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 8, boxSizing: 'border-box', padding: '14px 28px', fontSize: 16, lineHeight: 1, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%', boxShadow: '0 4px 16px rgba(24,115,68,0.25)', marginTop: 'auto' },
  form: { display: 'flex', flexDirection: 'column', gap: 16, height: '100%' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--ink)' },
  input: { fontFamily: 'inherit', fontSize: 14, color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--brand-border)', borderRadius: 8, padding: '11px 14px', outline: 'none' },
  textarea: { fontFamily: 'inherit', fontSize: 14, color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--brand-border)', borderRadius: 8, padding: '11px 14px', outline: 'none', resize: 'vertical', minHeight: 100 },
  privacyHint: { fontSize: 12, color: '#6b7280', lineHeight: 1.55, margin: '0 0 2px' },
  submitBtn: { background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%', boxShadow: '0 4px 16px rgba(24,115,68,0.25)', marginTop: 'auto' },
};

const generalMailto = 'mailto:flexbsolutions@outlook.com?subject=Anfrage%20an%20FlexB%20Solutions&body=Hallo%20Felix%2C%0A%0Aich%20interessiere%20mich%20f%C3%BCr%20eine%20Zusammenarbeit%20mit%20FlexB%20Solutions.%0A%0AWorum%20geht%20es%3F%0A%5BBitte%20kurz%20beschreiben%5D%0A%0AWas%20soll%20sich%20verbessern%20oder%20entstehen%3F%0A%5BBitte%20erg%C3%A4nzen%5D%0A%0ABeste%20Gr%C3%BC%C3%9Fe%0A%5BName%5D';

function Contact() {
  return (
    <section id="kontakt" style={contactStyles.section}>
      <div className="contact-layout" style={contactStyles.inner}>
        <div style={contactStyles.infoCol} data-guide-target="contact-info">
          <div style={contactStyles.eyebrow}>Kontakt</div>
          <h2 style={contactStyles.h2}>Lassen Sie uns sprechen.</h2>
          <p style={contactStyles.lead}>Sie haben eine Idee, ein Problem oder möchten einfach wissen, was möglich ist? Schreiben Sie mir direkt per E-Mail oder buchen Sie ein Erstgespräch.</p>
          <div className="contact-card" style={{ ...contactStyles.calBox, flexDirection: 'column', alignItems: 'stretch', minHeight: 320, height: 320, padding: 28 }}>
            <div style={contactStyles.eyebrow}>TERMIN BUCHEN</div>
            <div>
              <div className="contact-card-title" style={contactStyles.calTitle}>Termin buchen</div>
              <div className="contact-card-copy" style={contactStyles.calDesc}>30 Minuten kostenloses Erstgespräch. Unverbindlich und direkt online.</div>
            </div>
            <button className="contact-action-main" style={{ ...contactStyles.calBtn, height: 64, minHeight: 64, marginTop: 'auto' }} type="button" onClick={() => window.openBooking && window.openBooking()}>Termin buchen</button>
          </div>
        </div>
        <div style={{ ...contactStyles.formCol, justifyContent: 'flex-end' }} data-guide-target="contact-form">
          <div className="contact-card" style={{ ...contactStyles.calBox, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', minHeight: 320, height: 320, padding: '28px' }}>
            <div style={contactStyles.eyebrow}>Direkter Kontakt</div>
            <h3 className="contact-card-title" style={contactStyles.calTitle}>Schreiben Sie mir direkt.</h3>
            <p className="contact-card-copy" style={{ ...contactStyles.calDesc, marginBottom: 24 }}>Ihr E-Mail-Programm öffnet sich mit einer Vorlage. Ergänzen Sie kurz die markierten Stellen und senden Sie die Nachricht ab.</p>
            <a className="contact-action-main" style={{ ...contactStyles.calBtn, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', height: 64, minHeight: 64, textDecoration: 'none', marginTop: 'auto' }} href={generalMailto}>E-Mail schreiben</a>
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Contact });
