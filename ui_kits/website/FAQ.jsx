// FAQ.jsx – Schwebender FlexBot mit sicherem Backend
const starterQuestions = [
  'Welche Leistungen bietet FlexB an?',
  'Für wen sind die Lösungen gedacht?',
  'Wie lange dauert ein Projekt?',
  'Wie läuft ein Erstgespräch ab?',
  'Was ist der Unterschied zwischen ML und KI-Automatisierung?',
  'Kann ich bestehende Systeme einbinden?',
];

function pickRandomItems(items, count = 2) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled.slice(0, count);
}

function getSessionId() {
  const storageKey = 'flexb_chat_session_id';
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;
  const sessionId = `flexb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(storageKey, sessionId);
  return sessionId;
}

const chatActions = {
  overview: {
    label: 'Leistungen öffnen',
    run: () => {
      setTimeout(() => {
        const section = document.getElementById('leistungen');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    },
  },
  prozess: {
    label: 'Prozessautomatisierung öffnen',
    run: () => { window.location.href = '/leistungen/prozess/?v=2'; },
  },
  ki: {
    label: 'KI-Automatisierung öffnen',
    run: () => { window.location.href = '/leistungen/ki/?v=2'; },
  },
  ml: {
    label: 'Machine Learning öffnen',
    run: () => { window.location.href = '/leistungen/ml/?v=2'; },
  },
  sensorik: {
    label: 'Sensorik-Integration öffnen',
    run: () => { window.location.href = '/leistungen/sensorik/?v=2'; },
  },
  'custom-workflows': {
    label: 'Custom Workflows öffnen',
    run: () => { window.location.href = '/leistungen/custom-workflows/?v=2'; },
  },
};

const chatStyles = {
  fab: {
    position: 'fixed',
    right: 22,
    bottom: 22,
    zIndex: 120,
    width: 64,
    height: 64,
    borderRadius: '50%',
    border: 'none',
    background: 'var(--brand)',
    color: '#fff',
    boxShadow: '0 18px 36px rgba(24,115,68,0.28)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: {
    position: 'fixed',
    right: 22,
    bottom: 98,
    width: 'min(400px, calc(100vw - 24px))',
    height: 'min(620px, calc(100vh - 132px))',
    background: '#fff',
    border: '1px solid var(--brand-tint)',
    borderRadius: 22,
    boxShadow: '0 22px 52px rgba(24,62,46,0.16)',
    zIndex: 121,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  header: {
    padding: '18px 18px 16px',
    borderBottom: '1px solid var(--brand-tint)',
    background: 'var(--paper)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  eyebrow: { fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 6 },
  title: { fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 },
  sub: { fontSize: 12, color: '#4b5563', lineHeight: 1.5 },
  closeBtn: { width: 34, height: 34, borderRadius: 10, border: '1px solid var(--brand-tint)', background: '#fff', color: 'var(--brand-ink)', cursor: 'pointer', flexShrink: 0 },
  suggestions: { padding: '14px 16px 0', display: 'flex', gap: 8, flexWrap: 'wrap' },
  suggestionBtn: { border: '1px solid var(--brand-border)', background: 'var(--paper)', color: 'var(--brand-ink)', borderRadius: 999, padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  transcript: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  rowUser: { display: 'flex', justifyContent: 'flex-end' },
  rowBot: { display: 'flex', justifyContent: 'flex-start' },
  bubbleUser: { maxWidth: '82%', background: 'var(--brand)', color: '#fff', borderRadius: '18px 18px 6px 18px', padding: '12px 14px', fontSize: 14, lineHeight: 1.55 },
  bubbleBot: { maxWidth: '88%', background: 'var(--paper)', color: 'var(--muted)', border: '1px solid var(--brand-tint)', borderRadius: '18px 18px 18px 6px', padding: '12px 14px', fontSize: 14, lineHeight: 1.6 },
  meta: { display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 6 },
  messageAction: {
    marginTop: 10,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: '1px solid var(--brand-border)',
    background: 'var(--brand-tint)',
    color: 'var(--brand-ink)',
    borderRadius: 999,
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  composer: { padding: 16, borderTop: '1px solid var(--brand-tint)', display: 'grid', gap: 10, background: '#fff' },
  textarea: { width: '100%', minHeight: 72, resize: 'none', border: '1.5px solid var(--brand-border)', borderRadius: 12, padding: '12px 13px', fontFamily: 'inherit', fontSize: 14, color: 'var(--ink)', outline: 'none', background: '#fff' },
  helper: { fontSize: 11, color: '#6b7280', lineHeight: 1.5 },
  helperError: { fontSize: 11, color: '#b91c1c', lineHeight: 1.5 },
  actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  sendBtn: { background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 10px 24px rgba(24,115,68,0.20)' },
  sendBtnDisabled: { opacity: 0.6, cursor: 'not-allowed', boxShadow: 'none' },
};

function ChatMessage({ role, text, action }) {
  const isUser = role === 'user';
  const actionConfig = !isUser && action ? chatActions[action] : null;
  return (
    <div style={isUser ? chatStyles.rowUser : chatStyles.rowBot}>
      <div style={isUser ? chatStyles.bubbleUser : chatStyles.bubbleBot}>
        {!isUser && <span style={chatStyles.meta}>FlexBot</span>}
        <div>{text}</div>
        {actionConfig && (
          <button type="button" style={chatStyles.messageAction} onClick={actionConfig.run}>
            {actionConfig.label}
          </button>
        )}
      </div>
    </div>
  );
}

async function fetchChatAnswer(question, history) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': getSessionId(),
    },
    body: JSON.stringify({
      message: question,
      history: history.slice(-4).map(({ role, text }) => ({ role, text })),
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Der Chat ist gerade nicht verfügbar.');
  }

  return data;
}

function FAQ() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    {
      role: 'bot',
      text: 'Hallo. Ich bin FlexBot und beantworte Fragen nur zu den Inhalten von FlexB Solutions. Für sehr individuelle Fälle ist ein Erstgespräch weiterhin der beste nächste Schritt.',
      action: 'overview',
    }
  ]);
  const [input, setInput] = React.useState('');
  const [visibleQuestions, setVisibleQuestions] = React.useState(() => pickRandomItems(starterQuestions, 2));
  const [isSending, setIsSending] = React.useState(false);
  const [statusText, setStatusText] = React.useState('Die Antworten beziehen sich nur auf die Inhalte dieser Website und sind bewusst kurz gehalten.');
  const [statusError, setStatusError] = React.useState(false);
  const transcriptRef = React.useRef(null);

  React.useEffect(() => {
    if (!transcriptRef.current) return;
    transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [messages, open, isSending]);

  React.useEffect(() => {
    if (!open) return;
    setVisibleQuestions(pickRandomItems(starterQuestions, 2));
  }, [open]);

  const askQuestion = async (question) => {
    const trimmed = question.trim();
    if (!trimmed || isSending) return;

    const userMessage = { role: 'user', text: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setOpen(true);
    setIsSending(true);
    setStatusError(false);
    setStatusText('...');

    try {
      const result = await fetchChatAnswer(trimmed, messages);
      setMessages((current) => [...current, { role: 'bot', text: result.answer, action: result.action || null }]);
      setVisibleQuestions(pickRandomItems(starterQuestions, 2));
      setStatusText('Die Antworten bleiben auf deine Website-Themen begrenzt und laufen mit reduziertem Tokenverbrauch.');
    } catch (error) {
      const fallbackText = window.location.hostname === 'localhost'
        ? 'Der KI-Chat ist derzeit nicht erreichbar. Bitte nutzen Sie für Ihre Anfrage das Kontaktformular oder die direkte E-Mail-Adresse.'
        : (error.message || 'Der Chat ist gerade nicht erreichbar.');

      setMessages((current) => [...current, { role: 'bot', text: fallbackText }]);
      setStatusError(true);
      setStatusText(fallbackText);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await askQuestion(input);
  };

  return (
    <>
      {open && (
        <div className="flexbot-panel" style={chatStyles.panel}>
          <div style={chatStyles.header}>
            <div>
              <div style={chatStyles.eyebrow}>FlexBot</div>
              <div style={chatStyles.title}>Fragen direkt klären</div>
              <div style={chatStyles.sub}>FlexBot antwortet nur zu FlexB Solutions und ist auf knappe Antworten begrenzt.</div>
            </div>
            <button type="button" style={chatStyles.closeBtn} onClick={() => setOpen(false)} aria-label="Chat schließen">×</button>
          </div>

          <div style={chatStyles.suggestions}>
            {visibleQuestions.map((question) => (
              <button key={question} type="button" style={chatStyles.suggestionBtn} onClick={() => askQuestion(question)}>
                {question}
              </button>
            ))}
          </div>

          <div style={chatStyles.transcript} ref={transcriptRef}>
            {messages.map((message, index) => (
              <ChatMessage key={`${message.role}-${index}`} role={message.role} text={message.text} action={message.action} />
            ))}
            {isSending && <ChatMessage role="bot" text="..." />}
          </div>

          <form style={chatStyles.composer} onSubmit={handleSubmit}>
            <textarea
              style={chatStyles.textarea}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ihre Frage eingeben..."
              maxLength={400}
            />
            <div style={chatStyles.actions}>
              <div style={statusError ? chatStyles.helperError : chatStyles.helper}>{statusText}</div>
              <button
                type="submit"
                style={{ ...chatStyles.sendBtn, ...(isSending ? chatStyles.sendBtnDisabled : {}) }}
                disabled={isSending}
              >
                {isSending ? 'Wird gesendet' : 'Senden'}
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        className="flexbot-fab"
        type="button"
        style={chatStyles.fab}
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Chat schließen' : 'Chat öffnen'}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )}
      </button>
    </>
  );
}

Object.assign(window, { FAQ, ChatMessage });
