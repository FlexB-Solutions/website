// BookingModal.jsx – Terminbuchung Modal
function BookingModal({ onClose }) {
  const [step, setStep] = React.useState(1); // 1=Datum, 2=Uhrzeit, 3=Formular, 4=Bestätigung
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTime, setSelectedTime] = React.useState(null);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', type: 'Unternehmen (B2B)', message: '', website: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [busy, setBusy] = React.useState([]);

  // Sobald Outlook verbunden ist, stammen freie Zeiten direkt aus dem Kalender.
  // Die lokale Datei bleibt nur als Entwicklungs-Fallback ohne Termindetails.
  React.useEffect(() => {
    const toIsoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const from = new Date();
    from.setDate(from.getDate() + 1);
    const to = new Date();
    to.setDate(to.getDate() + 21);
    Promise.all([
      fetch(`/api/booking/availability?from=${toIsoDate(from)}&to=${toIsoDate(to)}`, { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)),
      fetch('/data/availability.json', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)),
    ])
      .then(([live, fallback]) => {
        if (live && live.active && Array.isArray(live.busy)) setBusy(live.busy);
        else if (fallback && Array.isArray(fallback.busy)) setBusy(fallback.busy);
      })
      .catch(() => {});
  }, []);

  // Generate next 14 days excluding Sundays
  const today = new Date();
  const days = [];
  for (let i = 1; i <= 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) days.push(d); // skip Sundays
    if (days.length === 14) break;
  }

  const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  const toMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const pad2 = (n) => String(n).padStart(2, '0');
  const selectedKey = selectedDate ? `${selectedDate.getFullYear()}-${pad2(selectedDate.getMonth() + 1)}-${pad2(selectedDate.getDate())}` : null;
  const booked = slots.filter(t => busy.some(b =>
    b.date === selectedKey && toMinutes(b.start) < toMinutes(t) + 30 && toMinutes(b.end) > toMinutes(t)
  ));

  const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  const formatDate = (d) => d ? `${weekdays[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]}` : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    setSubmitError('');

    const pad = (n) => String(n).padStart(2, '0');
    const dateIso = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`;

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: dateIso, time: selectedTime }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Die Buchung ist gerade nicht verfügbar. Bitte nutzen Sie das Kontaktformular.');
      }
      setResult(data);
      setStep(4);
    } catch (error) {
      setSubmitError(error.message || 'Die Buchung ist gerade nicht verfügbar. Bitte nutzen Sie das Kontaktformular.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={bm.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="booking-modal-react" style={bm.modal}>
        {/* Header */}
        <div className="booking-header-react" style={bm.header}>
          <div>
            <div style={bm.eyebrow}>Kostenlose Erstberatung</div>
            <div style={bm.title}>Termin buchen</div>
          </div>
          <button style={bm.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Progress */}
        {step < 4 && (
          <div className="booking-progress-react" style={bm.progress}>
            {['Datum', 'Uhrzeit', 'Ihre Daten'].map((label, i) => (
              <div key={i} style={bm.progressItem}>
                <div style={{ ...bm.progressDot, background: step > i + 1 ? 'var(--brand)' : step === i + 1 ? 'var(--brand)' : 'var(--brand-tint)', color: step >= i + 1 ? '#fff' : 'var(--brand-light)' }}>
                  {step > i + 1
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    : i + 1}
                </div>
                <span style={{ ...bm.progressLabel, color: step === i + 1 ? 'var(--ink)' : '#9ca3af', fontWeight: step === i + 1 ? 600 : 400 }}>{label}</span>
                {i < 2 && <div style={{ ...bm.progressLine, background: step > i + 1 ? 'var(--brand)' : 'var(--brand-tint)' }}></div>}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Datum */}
        {step === 1 && (
          <div className="booking-body-react" style={bm.body}>
            <div style={bm.stepTitle}>Wählen Sie einen Tag</div>
            <div className="booking-cal-grid-react" style={bm.calGrid}>
              {days.map((d, i) => (
                <button key={i}
                  onClick={() => { setSelectedDate(d); setStep(2); }}
                  style={{ ...bm.dayBtn, ...(selectedDate && d.toDateString() === selectedDate.toDateString() ? bm.dayBtnActive : {}) }}>
                  <span style={bm.dayName}>{weekdays[d.getDay()]}</span>
                  <span style={bm.dayNum}>{d.getDate()}</span>
                  <span style={bm.dayMonth}>{months[d.getMonth()]}</span>
                </button>
              ))}
            </div>
            <div style={bm.hint}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              30 Minuten · Kostenlos & unverbindlich · Online per Videolink
            </div>
          </div>
        )}

        {/* Step 2: Uhrzeit */}
        {step === 2 && (
          <div className="booking-body-react" style={bm.body}>
            <button style={bm.backBtn} onClick={() => setStep(1)}>← {formatDate(selectedDate)}</button>
            <div style={bm.stepTitle}>Uhrzeit wählen</div>
            <div className="booking-slot-grid-react" style={bm.slotGrid}>
              {slots.map(t => {
                const isBooked = booked.includes(t);
                return (
                  <button key={t}
                    disabled={isBooked}
                    onClick={() => { setSelectedTime(t); setStep(3); }}
                    style={{ ...bm.slotBtn, ...(isBooked ? bm.slotBooked : {}), ...(selectedTime === t ? bm.slotActive : {}) }}>
                    {t}
                    {isBooked && <span style={bm.bookedLabel}>Belegt</span>}
                  </button>
                );
              })}
            </div>
            <div style={bm.hint}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              Alle Zeiten in Berliner Zeit. Grau = bereits belegt.
            </div>
          </div>
        )}

        {/* Step 3: Formular */}
        {step === 3 && (
          <div className="booking-body-react" style={bm.body}>
            <button style={bm.backBtn} onClick={() => setStep(2)}>← {formatDate(selectedDate)}, {selectedTime} Uhr</button>
            <div style={bm.stepTitle}>Ihre Kontaktdaten</div>
            <form onSubmit={handleSubmit} style={bm.form}>
              <input type="text" name="website" value={form.website} onChange={e => setForm({...form, website: e.target.value})} style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
              <div className="booking-form-row-react" style={bm.formRow}>
                <div style={bm.field}>
                  <label style={bm.label}>Name *</label>
                  <input required style={bm.input} placeholder="Max Mustermann" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div style={bm.field}>
                  <label style={bm.label}>E-Mail *</label>
                  <input required type="email" style={bm.input} placeholder="max@beispiel.de" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
              </div>
              <div className="booking-form-row-react" style={bm.formRow}>
                <div style={bm.field}>
                  <label style={bm.label}>Telefon (optional)</label>
                  <input style={bm.input} placeholder="+49 000 0000000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div style={bm.field}>
                  <label style={bm.label}>Ich bin…</label>
                  <select style={bm.input} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option>Unternehmen</option>
                    <option>Privatkunde</option>
                    <option>Selbstständig</option>
                  </select>
                </div>
              </div>
              <div style={bm.field}>
                <label style={bm.label}>Worum geht es? (optional)</label>
                <textarea style={{...bm.input, minHeight: 72, resize: 'vertical'}} placeholder="Kurze Beschreibung Ihres Anliegens…" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </div>
              <div className="booking-summary-react" style={bm.summaryBox}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                <span><strong>{formatDate(selectedDate)}</strong> um <strong>{selectedTime} Uhr</strong> · 30 Min. · Online</span>
              </div>
              <p style={bm.privacyHint}>Ihre Angaben verwenden wir ausschließlich zur Bearbeitung dieser Terminanfrage. Details finden Sie in der <a href="/ui_kits/website/datenschutz.html" style={bm.privacyLink}>Datenschutzerklärung</a>.</p>
              {submitError && <div style={bm.errorText}>{submitError}</div>}
              <button type="submit" style={{ ...bm.submitBtn, ...(submitting ? bm.submitBtnDisabled : {}) }} disabled={submitting}>
                {submitting ? 'Wird gesendet…' : 'Terminanfrage senden'}
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Bestätigung */}
        {step === 4 && (
          <div style={{...bm.body, textAlign: 'center', padding: '40px 32px'}}>
            <div style={bm.successIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <div style={bm.successTitle}>{result?.mode === 'request' ? 'Anfrage eingegangen!' : 'Termin bestätigt!'}</div>
            <div style={bm.successSub}>
              <strong>{formatDate(selectedDate)}</strong> um <strong>{selectedTime} Uhr</strong>
            </div>
            <p style={bm.successText}>
              {result?.mode === 'request'
                ? <>Ihre Terminanfrage ist eingegangen. Wir prüfen den Termin und melden uns per E-Mail bei <strong>{form.email}</strong>.</>
                : <>Die Kalendereinladung mit dem Meeting-Link wurde an <strong>{form.email}</strong> gesendet. Bitte prüfen Sie gegebenenfalls auch den Spam-Ordner.</>}
            </p>
            {result?.bookingReference && (
              <p style={{ ...bm.successText, marginTop: 10 }}>
                Ihre Referenz: <strong>{result.bookingReference}</strong>
              </p>
            )}
            <button style={bm.submitBtn} onClick={onClose}>Schließen</button>
          </div>
        )}
      </div>
    </div>
  );
}

const bm = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal: { background: '#fff', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' },
  header: { padding: '24px 28px 16px', borderBottom: '1px solid var(--brand-tint)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: 600, color: 'var(--ink)' },
  closeBtn: { background: 'var(--paper)', border: 'none', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)' },
  progress: { padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid var(--paper)' },
  progressItem: { display: 'flex', alignItems: 'center', gap: 8, flex: 1 },
  progressDot: { width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  progressLabel: { fontSize: 13 },
  progressLine: { flex: 1, height: 2, borderRadius: 1, marginLeft: 8 },
  body: { padding: '24px 28px 28px' },
  stepTitle: { fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 16 },
  calGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 16 },
  dayBtn: { background: 'var(--paper)', border: '1.5px solid var(--brand-tint)', borderRadius: 10, padding: '10px 4px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, transition: 'all 0.15s' },
  dayBtnActive: { background: 'var(--brand)', borderColor: 'var(--brand)' },
  dayName: { fontSize: 10, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' },
  dayNum: { fontSize: 18, fontWeight: 700, color: 'var(--ink)' },
  dayMonth: { fontSize: 10, color: '#9ca3af' },
  slotGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 },
  slotBtn: { background: 'var(--paper)', border: '1.5px solid var(--brand-tint)', borderRadius: 8, padding: '10px 4px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: 'var(--ink)', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  slotActive: { background: 'var(--brand)', borderColor: 'var(--brand)', color: '#fff' },
  slotBooked: { background: '#f9fafb', borderColor: '#f0f0f0', color: '#d1d5db', cursor: 'not-allowed' },
  bookedLabel: { fontSize: 9, fontWeight: 600, color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' },
  backBtn: { background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', fontSize: 13, color: 'var(--brand)', cursor: 'pointer', fontWeight: 600, marginBottom: 12, display: 'block' },
  hint: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--ink)' },
  input: { fontFamily: 'inherit', fontSize: 14, color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--brand-border)', borderRadius: 8, padding: '10px 12px', outline: 'none' },
  summaryBox: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--paper)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--muted)' },
  privacyHint: { fontSize: 12, color: '#6b7280', lineHeight: 1.55, margin: '0 0 2px' },
  privacyLink: { color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 },
  submitBtn: { background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(24,115,68,0.28)' },
  submitBtnDisabled: { opacity: 0.6, cursor: 'wait', boxShadow: 'none' },
  errorText: { fontSize: 13, color: '#b91c1c', lineHeight: 1.5, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 12px' },
  successIcon: { width: 72, height: 72, background: 'var(--brand-tint)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  successTitle: { fontSize: 26, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 },
  successSub: { fontSize: 16, color: 'var(--muted)', marginBottom: 14 },
  successText: { fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 24 },
};

Object.assign(window, { BookingModal });
