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
          <p style={contactStyles.lead}>Sie haben eine Idee, ein Problem oder möchten einfach wissen, was möglich ist? Schreiben Sie uns. Wir melden uns innerhalb von 24 Stunden.</p>
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
          <a style={{ ...contactStyles.calBtn, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', background: 'transparent', color: 'var(--brand-ink)', border: '1px solid var(--brand)' }} href="mailto:flexbsolutions@outlook.com?subject=Anfrage%20an%20FlexB%20Solutions">E-Mail schreiben</a>
        </div>
        <div style={contactStyles.formCol} data-guide-target="contact-form">
          <form
            id="contact-form"
            style={contactStyles.form}
            action="https://formsubmit.co/flexbsolutions@outlook.com"
            method="POST"
          >
            <input type="hidden" name="_subject" value="Neue Nachricht über FlexB Solutions" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
            <div className="contact-row" style={contactStyles.row}>
              <div style={contactStyles.field}>
                <label style={contactStyles.label} htmlFor="contact-first-name">Vorname</label>
                <input id="contact-first-name" name="Vorname" style={contactStyles.input} type="text" placeholder="Max" required />
              </div>
              <div style={contactStyles.field}>
                <label style={contactStyles.label} htmlFor="contact-last-name">Nachname</label>
                <input id="contact-last-name" name="Nachname" style={contactStyles.input} type="text" placeholder="Mustermann" required />
              </div>
            </div>
            <div style={contactStyles.field}>
              <label style={contactStyles.label} htmlFor="contact-email">E-Mail</label>
              <input id="contact-email" name="E-Mail" style={contactStyles.input} type="email" placeholder="max@beispiel.de" required />
            </div>
            <div style={contactStyles.field}>
              <label style={contactStyles.label} htmlFor="contact-type">Ich bin…</label>
              <select id="contact-type" name="Ich bin" style={contactStyles.input}>
                <option>Unternehmen (B2B)</option>
                <option>Privatkunde</option>
                <option>Selbstständig</option>
              </select>
            </div>
            <div style={contactStyles.field}>
              <label style={contactStyles.label} htmlFor="contact-message">Nachricht</label>
              <textarea id="contact-message" name="Nachricht" style={contactStyles.textarea} placeholder="Wie können wir Ihnen helfen?" required></textarea>
            </div>
            <p style={contactStyles.privacyHint}>Mit dem Absenden werden Ihre Angaben zur Bearbeitung Ihrer Anfrage an FormSubmit übermittelt. Details finden Sie in der <a href="datenschutz.html" style={{ color: 'var(--brand)' }}>Datenschutzerklärung</a>.</p>
            <button style={contactStyles.submitBtn} type="submit">Nachricht senden</button>
          </form>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Contact });
