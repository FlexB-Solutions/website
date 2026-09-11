const ipBuckets = new Map();
const sessionBuckets = new Map();

const WEBSITE_KNOWLEDGE = [
  'FlexB Solutions gliedert sein Angebot in vier Bereiche: Automatisierung, KI & Machine Learning, Software und Produktfertigung.',
  'Automatisierung umfasst zwei Punkte: Prozesse & Workflows (wiederkehrende Aufgaben strukturieren und bestehende Tools zu einem durchgaengigen Ablauf verbinden) sowie Sensorik-Integration (Maschinen, Lager und Fuellstaende messbar und digital nutzbar machen).',
  'KI & Machine Learning umfasst KI-Automatisierung und Machine Learning. KI-Automatisierung ist die Bruecke zwischen den Bereichen: KI und ML werden direkt in bestehende Automatisierungen integriert.',
  'Machine Learning umfasst Mustererkennung, Vorhersagen, Anomalieerkennung und Objekterkennung. Technisch Python, passende Bibliotheken und KNIME. Entwicklung strukturiert nach CRISP-ML(Q), der AI Act wird geprüft.',
  'Sensorik verbindet reale Messwerte mit digitaler Auswertung. Fokus auf Hardware, Microcontroller und Python-basierter Verarbeitung. Beispiele: Lidar, Ultraschall, kapazitive Sensorik.',
  'Software umfasst zwei Punkte: Individualsoftware (eigene Python-Skripte, Datenerfassung, Auswertung und Visualisierung, Prozesserleichterungen, zum Beispiel ein Bestellsystem, das die Order vom Tablet direkt in die Kueche schickt) sowie Webseiten & Webanwendungen (lokale Leitsysteme, die Sensoren ueberwachen und steuern, Online-Terminbuchung, Formularstrecken, interne Werkzeuge im Browser).',
  'Lokale Leitsysteme laufen im eigenen Netz. Faellt die Internetverbindung aus, arbeitet die Anlage weiter. Werkzeuge unter anderem Node-RED.',
  'Produktfertigung umfasst Prototypen, Individualanfertigungen und Kleinserien im 3D-Druck — von der Idee bis zum passenden fertigen Teil.',
  'Materialwahl richtet sich nach dem Einsatzzweck: PLA fuer Form und Optik, PETG fuer zaehe Teile mit Feuchtekontakt, ASA oder ABS fuer Waerme und Ausseneinsatz, TPU fuer flexible Elemente. Welches Material sinnvoll ist, wird am konkreten Teil geklaert.',
  'Kleinserien bedeuten wiederholbare Stueckzahlen ohne Werkzeugkosten. Ausrichtung, Material und Druckparameter werden einmal festgelegt und bleiben, damit eine Nachbestellung identisch ausfaellt. Zwischen zwei Chargen sind Aenderungen moeglich.',
  'Gravur wird derzeit NICHT angeboten. Falls danach gefragt wird: darauf hinweisen und auf die Produktfertigung verweisen.',
  'Zielgruppen sind Unternehmen (KMU) und Privatkunden. Im Privatbereich liegt der Fokus auf Gebaeudeautomation, Haus, Raeume, Verbrauch und digitalen Hilfen rund um Gebaeude.',
  'Projektlaufzeit meist ungefaehr ein bis sechs Monate. Nach dem Erstgespraech gibt es eine realistische Einschaetzung und einen konkreten Zeitplan.',
  'Kosten werden nicht pauschal genannt. Nach dem Erstgespraech gibt es eine erste Einschaetzung anhand von Umfang, technischer Tiefe und Zielbild. Keine Preise, Lieferzeiten oder Toleranzen zusagen.',
  'Bestehende Systeme lassen sich oft einbinden. Welche Integrationen sinnvoll sind, wird individuell geprueft.',
  'Unterseiten: /leistungen/prozess/, /leistungen/sensorik/, /leistungen/ki/, /leistungen/ml/, /leistungen/software/, /leistungen/webseiten/, /leistungen/3d-druck/ (Prototypen & Individualanfertigungen), /leistungen/kleinserien/.',
  'Kontakt erfolgt ueber Nachricht oder kostenloses Erstgespraech.',
].join('\n');

const BLOCKLIST_PATTERNS = [
  /ignore (all|previous|earlier) instructions/i,
  /system prompt/i,
  /reveal .*prompt/i,
  /write (me )?code/i,
  /python script/i,
  /javascript/i,
  /sql query/i,
  /hack/i,
  /exploit/i,
  /crypto/i,
  /bitcoin/i,
  /adult|sex|porn/i,
];

const SERVICE_MATCHERS = [
  { action: 'prozess', keywords: ['prozessautomatisierung', 'ablauf automatisieren', 'wiederkehrende aufgaben', 'statuswechsel', 'dokumentenfluss', 'freigaben'] },
  { action: 'ki', keywords: ['ki automatisierung', 'ki', 'llm', 'dokumente', 'anfragen', 'sprache'] },
  { action: 'ml', keywords: ['machine learning', 'ml', 'vorhersage', 'anomalie', 'objekterkennung', 'knime', 'crisp ml', 'ai act'] },
  { action: 'sensorik', keywords: ['sensorik', 'sensor', 'lidar', 'ultraschall', 'kapazitiv', 'microcontroller'] },
  { action: 'custom-workflows', keywords: ['custom workflows', 'workflow', 'n8n', 'node-red', 'node red', 'verknupfung', 'verknuepfung'] },
];

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for') || '';
  return forwarded.split(',')[0].trim() || 'unknown';
}

function getOriginHost(req) {
  const origin = req.headers.get('origin');
  if (!origin) return null;
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}

function getRequestHost(req) {
  try {
    return new URL(req.url).host;
  } catch {
    return null;
  }
}

function trimHistory(history) {
  return history
    .filter((entry) => entry && (entry.role === 'user' || entry.role === 'bot') && typeof entry.text === 'string')
    .slice(-4)
    .map((entry) => ({
      role: entry.role === 'bot' ? 'assistant' : 'user',
      text: entry.text.replace(/\s+/g, ' ').trim().slice(0, 280),
    }))
    .filter((entry) => entry.text.length > 0);
}

function applyBucketLimit(bucketMap, key, limit, windowMs, cooldownMs) {
  const now = Date.now();
  const bucket = bucketMap.get(key);

  if (bucket?.blockedUntil && bucket.blockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((bucket.blockedUntil - now) / 1000) };
  }

  if (!bucket || bucket.resetAt <= now) {
    bucketMap.set(key, { count: 1, resetAt: now + windowMs, lastAt: now });
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.lastAt && now - bucket.lastAt < cooldownMs) {
    return { allowed: false, retryAfter: Math.ceil((cooldownMs - (now - bucket.lastAt)) / 1000) };
  }

  if (bucket.count >= limit) {
    bucket.blockedUntil = bucket.resetAt;
    bucketMap.set(key, bucket);
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  bucket.lastAt = now;
  bucketMap.set(key, bucket);
  return { allowed: true, retryAfter: 0 };
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9äöüß\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function classifyMessage(message) {
  const normalized = normalizeText(message);

  if (!normalized) {
    return {
      blocked: true,
      answer: 'Bitte stellen Sie eine kurze inhaltliche Frage zu FlexB Solutions oder den angebotenen Leistungen.',
    };
  }

  if (normalized.length < 6) {
    return {
      blocked: true,
      answer: 'Bitte formulieren Sie die Frage noch etwas konkreter, damit ich sinnvoll zu den Website-Inhalten antworten kann.',
    };
  }

  if (BLOCKLIST_PATTERNS.some((pattern) => pattern.test(message))) {
    return {
      blocked: true,
      answer: 'FlexBot beantwortet nur Fragen zu FlexB Solutions und ist nicht für allgemeine oder technische Fremdaufgaben gedacht.',
    };
  }

  const repeatedChars = /(.)\1{5,}/.test(message);
  const repeatedWords = /(\b\w+\b)(?:\s+\1){3,}/i.test(message);
  if (repeatedChars || repeatedWords) {
    return {
      blocked: true,
      answer: 'Die Nachricht wirkt nicht wie eine normale Fachfrage. Bitte stellen Sie eine kurze konkrete Frage zu Leistungen, Projekten oder Einsatzfeldern.',
    };
  }

  return { blocked: false };
}

function detectAction(message, answer) {
  const normalizedMessage = message.toLowerCase();
  const normalizedAnswer = answer.toLowerCase();

  for (const matcher of SERVICE_MATCHERS) {
    if (matcher.keywords.some((keyword) => normalizedMessage.includes(keyword))) {
      return matcher.action;
    }
  }

  if (/leistung|angebot|service|services|was bietet|was macht flexb|was gibt es/.test(normalizedMessage)) {
    return 'overview';
  }

  for (const matcher of SERVICE_MATCHERS) {
    if (matcher.keywords.some((keyword) => normalizedAnswer.includes(keyword))) {
      return matcher.action;
    }
  }

  return null;
}

function extractAnswer(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();

  const outputs = Array.isArray(data?.output) ? data.output : [];
  const parts = outputs.flatMap((item) => Array.isArray(item?.content) ? item.content : []);
  const text = parts
    .filter((part) => part?.type === 'output_text' && typeof part?.text === 'string')
    .map((part) => part.text)
    .join(' ')
    .trim();

  return text;
}

export default async (req) => {
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);

  const requestHost = getRequestHost(req);
  const originHost = getOriginHost(req);
  if (originHost && requestHost && originHost !== requestHost) {
    return jsonResponse({ error: 'Origin not allowed.' }, 403);
  }

  const apiKey = Netlify.env.get('OPENAI_API_KEY');
  const model = Netlify.env.get('OPENAI_MODEL') || 'gpt-4.1-mini';

  if (!apiKey) {
    return jsonResponse({ error: 'OPENAI_API_KEY fehlt in den Umgebungsvariablen.' }, 500);
  }

  const ip = getClientIp(req);
  const sessionId = (req.headers.get('x-session-id') || '').slice(0, 80);
  if (!sessionId) return jsonResponse({ error: 'Session missing.' }, 400);

  const ipLimit = applyBucketLimit(ipBuckets, ip, 20, 60 * 60 * 1000, 3000);
  if (!ipLimit.allowed) {
    return jsonResponse({ error: `Zu viele Anfragen. Bitte in ${ipLimit.retryAfter} Sekunden erneut versuchen.` }, 429);
  }

  const sessionLimit = applyBucketLimit(sessionBuckets, sessionId, 8, 60 * 60 * 1000, 3000);
  if (!sessionLimit.allowed) {
    return jsonResponse({ error: `Diese Chat-Session ist vorerst ausgeschöpft. Bitte in ${sessionLimit.retryAfter} Sekunden erneut versuchen.` }, 429);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Ungültige Anfrage.' }, 400);
  }

  const message = typeof payload?.message === 'string' ? payload.message.replace(/\s+/g, ' ').trim() : '';
  if (!message || message.length > 400) {
    return jsonResponse({ error: 'Bitte eine Frage mit maximal 400 Zeichen senden.' }, 400);
  }

  const preflight = classifyMessage(message);
  if (preflight.blocked) {
    return jsonResponse({ answer: preflight.answer, filtered: true, action: 'overview' });
  }

  const history = trimHistory(Array.isArray(payload?.history) ? payload.history : []);
  const compactHistory = history
    .map((entry) => `${entry.role === 'assistant' ? 'Assistant' : 'User'}: ${entry.text}`)
    .join('\n');

  const instructions = [
    'Du bist FlexBot, der Website-Chat von FlexB Solutions.',
    'Antworte nur auf Basis des bereitgestellten Website-Wissens.',
    'Wenn eine Frage außerhalb der Website oder des Angebots liegt, lehne kurz ab und verweise auf Nachricht oder Erstgespräch.',
    'Antworte auf Deutsch, knapp, konkret und professionell.',
    'Maximal 90 Wörter.',
    'Kein Smalltalk, keine allgemeinen Exkurse, keine Programmierhilfe, keine Antworten für fremde Themen.',
    'Wenn die Information nicht im Wissen steht, sage das offen.',
  ].join(' ');

  const input = [
    'Website-Wissen:',
    WEBSITE_KNOWLEDGE,
    '',
    compactHistory ? `Bisheriger Verlauf:\n${compactHistory}\n` : '',
    `Neue Nutzerfrage:\n${message}`,
  ].join('\n');

  const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions,
      input,
      max_output_tokens: 220,
      temperature: 0.2,
      store: false,
    }),
  });

  const responseData = await openAiResponse.json().catch(() => ({}));
  if (!openAiResponse.ok) {
    return jsonResponse({ error: responseData?.error?.message || 'OpenAI-Antwort fehlgeschlagen.' }, 502);
  }

  const answer = extractAnswer(responseData);
  if (!answer) {
    return jsonResponse({ error: 'Es konnte keine Antwort erzeugt werden.' }, 502);
  }

  return jsonResponse({ answer, action: detectAction(message, answer) });
};

export const config = {
  path: '/api/chat',
};
