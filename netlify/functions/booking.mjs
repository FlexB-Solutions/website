// booking.mjs – Terminbuchung der FlexB-Website (Priorität 1, MASTERPLAN §12)
//
// Architektur: Echtzeit-Schicht ohne Kalender-API. Termin, Meeting-Link und
// Bestätigung entstehen über E-Mail + ICS-Kalendereinladung (Versand: Resend).
// Die nachgelagerte Verarbeitung (Postfach-Triage, Follow-up-Entwürfe,
// Lead-Briefings) übernimmt eine Claude-Routine über den Gmail-Connector.
// Betreff-Konvention für die Routine: "[FlexB Terminanfrage] ..."

// Belegte Zeitfenster aus dem Google Kalender (Export über Claude-Connector).
// Wird beim Build gebündelt – Aktualisierung der Datei erfordert einen Deploy.
import availability from '../../data/availability.json' with { type: 'json' };
import { createHash, randomUUID } from 'node:crypto';

const ipBuckets = new Map();

const SLOT_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
const MEETING_MINUTES = 30;
const MAX_DAYS_AHEAD = 30;
const DEFAULT_RETENTION_DAYS = 180;

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

function cleanText(value, maxLength) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function getRetentionDays() {
  const raw = Number(Netlify.env.get('BOOKING_RETENTION_DAYS') || DEFAULT_RETENTION_DAYS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_RETENTION_DAYS;
}

function buildBookingReference() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `FB-${datePart}-${randomPart}`;
}

function hashValue(value) {
  if (!value) return null;
  const salt = Netlify.env.get('BOOKING_HASH_SALT') || 'flexb-booking';
  return createHash('sha256').update(`${salt}:${value}`).digest('hex');
}

function createBookingRecord({ reference, name, email, phone, type, message, date, time, mode, meetingUrl, ip, originHost }) {
  const createdAt = new Date().toISOString();
  const retentionDays = getRetentionDays();
  const retentionUntil = new Date(Date.now() + retentionDays * 86400000).toISOString();
  return {
    reference,
    createdAt,
    retentionUntil,
    status: mode === 'confirm' ? 'confirmed' : 'requested',
    service: 'erstgespraech',
    slot: {
      date,
      time,
      durationMinutes: MEETING_MINUTES,
      timezone: 'Europe/Berlin',
    },
    contact: {
      name,
      email,
      phone: phone || null,
      type,
    },
    message: message || null,
    meetingUrl,
    meta: {
      source: 'website-booking',
      originHost: originHost || null,
      ipHash: hashValue(ip),
    },
  };
}

async function getStorageAdapter() {
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore({ name: 'booking-requests', consistency: 'strong' });
    async function listAll() {
      const { blobs } = await store.list({ prefix: 'booking/' });
      const records = await Promise.all(
        blobs.map(async ({ key }) => {
          const entry = await store.get(key, { type: 'json' });
          return entry || null;
        })
      );
      return records.filter(Boolean);
    }
    async function pruneExpired() {
      const now = Date.now();
      const items = await listAll();
      await Promise.all(
        items
          .filter((item) => item?.retentionUntil && new Date(item.retentionUntil).getTime() < now)
          .map((item) => store.delete(`booking/${item.reference}.json`))
      );
    }
    return {
      async save(record) {
        await pruneExpired();
        await store.setJSON(`booking/${record.reference}.json`, record);
      },
      async update(reference, patch) {
        await pruneExpired();
        const key = `booking/${reference}.json`;
        const current = await store.get(key, { type: 'json' });
        if (!current) return;
        await store.setJSON(key, { ...current, ...patch, updatedAt: new Date().toISOString() });
      },
      async list({ status, limit = 25 } = {}) {
        await pruneExpired();
        const items = await listAll();
        return items
          .filter((item) => !status || item.status === status)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      },
      async findByReference(reference) {
        await pruneExpired();
        return store.get(`booking/${reference}.json`, { type: 'json' });
      },
      async findDuplicate({ email, date, time }) {
        await pruneExpired();
        const items = await listAll();
        return items.find((item) =>
          String(item?.contact?.email || '').toLowerCase() === String(email).toLowerCase() &&
          item?.slot?.date === date &&
          item?.slot?.time === time &&
          item?.status !== 'customer_mail_failed'
        ) || null;
      },
      pruneExpired,
    };
  } catch {
    const [{ readFile, writeFile, mkdir }, path] = await Promise.all([
      import('node:fs/promises'),
      import('node:path'),
    ]);
    const dir = path.resolve(process.cwd(), 'data');
    const file = path.join(dir, 'booking-requests.local.json');
    async function readAll() {
      try {
        return JSON.parse(await readFile(file, 'utf8'));
      } catch {
        return [];
      }
    }
    async function writeAll(records) {
      await mkdir(dir, { recursive: true });
      await writeFile(file, JSON.stringify(records, null, 2), 'utf8');
    }
    async function pruneExpired() {
      const now = Date.now();
      const records = await readAll();
      const filtered = records.filter((entry) => !entry?.retentionUntil || new Date(entry.retentionUntil).getTime() >= now);
      if (filtered.length !== records.length) await writeAll(filtered);
      return filtered;
    }
    return {
      async save(record) {
        const records = await pruneExpired();
        records.push(record);
        await writeAll(records);
      },
      async update(reference, patch) {
        const records = await pruneExpired();
        const next = records.map((entry) =>
          entry.reference === reference ? { ...entry, ...patch, updatedAt: new Date().toISOString() } : entry
        );
        await writeAll(next);
      },
      async list({ status, limit = 25 } = {}) {
        const records = await pruneExpired();
        return records
          .filter((entry) => !status || entry.status === status)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      },
      async findByReference(reference) {
        const records = await pruneExpired();
        return records.find((entry) => entry.reference === reference) || null;
      },
      async findDuplicate({ email, date, time }) {
        const records = await pruneExpired();
        return records.find((entry) =>
          String(entry?.contact?.email || '').toLowerCase() === String(email).toLowerCase() &&
          entry?.slot?.date === date &&
          entry?.slot?.time === time &&
          entry?.status !== 'customer_mail_failed'
        ) || null;
      },
      pruneExpired,
    };
  }
}

function isValidEmail(value) {
  return typeof value === 'string' && value.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function parseBookingDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  if (date.getDay() === 0) return null; // Sonntags keine Termine
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diffDays < 1 || diffDays > MAX_DAYS_AHEAD) return null;
  return value;
}

function escapeIcs(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function addMinutes(time, minutes) {
  const [hours, mins] = time.split(':').map(Number);
  const total = hours * 60 + mins + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function extractAddress(mailbox) {
  const match = String(mailbox || '').match(/<([^>]+)>/);
  return match ? match[1] : String(mailbox || '').trim();
}

function buildIcs({ uid, date, time, customerName, customerEmail, organizerAddress, meetingUrl }) {
  const compact = (d, t) => `${d.replace(/-/g, '')}T${t.replace(':', '')}00`;
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FlexB Solutions//Erstgespraech//DE',
    'METHOD:REQUEST',
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Berlin',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=Europe/Berlin:${compact(date, time)}`,
    `DTEND;TZID=Europe/Berlin:${compact(date, addMinutes(time, MEETING_MINUTES))}`,
    `SUMMARY:${escapeIcs('FlexB Solutions – Kostenloses Erstgespräch')}`,
    `DESCRIPTION:${escapeIcs(`30 Minuten Erstgespräch mit FlexB Solutions.\nMeeting-Link: ${meetingUrl}`)}`,
    `LOCATION:${escapeIcs(meetingUrl)}`,
    `URL:${meetingUrl}`,
    `ORGANIZER;CN=FlexB Solutions:mailto:${organizerAddress}`,
    `ATTENDEE;CN=${escapeIcs(customerName)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${customerEmail}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Erstgespräch FlexB Solutions',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

async function sendMail(apiKey, payload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || `Mailversand fehlgeschlagen (${response.status}).`);
  }
}

export default async (req) => {
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);

  const requestHost = getRequestHost(req);
  const originHost = getOriginHost(req);
  if (originHost && requestHost && originHost !== requestHost) {
    return jsonResponse({ error: 'Origin not allowed.' }, 403);
  }

  const ip = getClientIp(req);
  const limit = applyBucketLimit(ipBuckets, ip, 5, 60 * 60 * 1000, 5000);
  if (!limit.allowed) {
    return jsonResponse({ error: `Zu viele Anfragen. Bitte in ${limit.retryAfter} Sekunden erneut versuchen.` }, 429);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Ungültige Anfrage.' }, 400);
  }

  // Honeypot: Bots bekommen ein unauffälliges "ok", es passiert nichts.
  if (cleanText(payload?.website, 10)) {
    return jsonResponse({ ok: true, mode: 'request' });
  }

  const name = cleanText(payload?.name, 80);
  const email = cleanText(payload?.email, 120);
  const phone = cleanText(payload?.phone, 40);
  const type = cleanText(payload?.type, 40) || 'Unbekannt';
  const message = cleanText(payload?.message, 1000);
  const date = parseBookingDate(payload?.date);
  const time = SLOT_TIMES.includes(payload?.time) ? payload.time : null;

  if (name.length < 2 || !isValidEmail(email) || !date || !time) {
    return jsonResponse({ error: 'Bitte Name, gültige E-Mail, Datum und Uhrzeit angeben.' }, 400);
  }

  const toMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const busyList = Array.isArray(availability?.busy) ? availability.busy : [];
  const slotBlocked = busyList.some((b) =>
    b.date === date && toMinutes(b.start) < toMinutes(time) + MEETING_MINUTES && toMinutes(b.end) > toMinutes(time)
  );
  if (slotBlocked) {
    return jsonResponse({ error: 'Dieser Zeitpunkt ist bereits belegt. Bitte wählen Sie eine andere Uhrzeit.' }, 409);
  }

  // A static availability snapshot cannot reserve a real calendar slot. Only an
  // explicitly configured confirm mode may send a binding confirmation.
  const mode = (Netlify.env.get('BOOKING_MODE') || 'request') === 'confirm' ? 'confirm' : 'request';
  const apiKey = Netlify.env.get('RESEND_API_KEY');
  const fromEmail = Netlify.env.get('BOOKING_FROM_EMAIL');
  const notifyEmail = Netlify.env.get('BOOKING_NOTIFY_EMAIL');
  const dryRun = Netlify.env.get('BOOKING_DRY_RUN') === '1';

  const uid = `flexb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const reference = buildBookingReference();
  const meetingUrl = Netlify.env.get('BOOKING_MEETING_URL') || `https://meet.jit.si/FlexB-Erstgespraech-${uid.slice(-8)}`;
  const storage = await getStorageAdapter();
  const duplicate = await storage.findDuplicate({ email, date, time });
  if (duplicate) {
    return jsonResponse({
      ok: true,
      duplicate: true,
      mode,
      bookingReference: duplicate.reference,
      meetingUrl: mode === 'confirm' ? duplicate.meetingUrl : undefined,
    });
  }
  const bookingRecord = createBookingRecord({ reference, name, email, phone, type, message, date, time, mode, meetingUrl, ip, originHost });
  const prettyDate = new Date(`${date}T12:00:00`).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (dryRun) {
    await storage.save({ ...bookingRecord, status: 'dry_run' });
    console.log(JSON.stringify({ booking: 'dry-run', mode, reference, name, email, type, date, time, meetingUrl }));
    return jsonResponse({ ok: true, mode, dryRun: true, bookingReference: reference, meetingUrl: mode === 'confirm' ? meetingUrl : undefined });
  }

  if (!apiKey || !fromEmail || !notifyEmail) {
    console.error('booking: RESEND_API_KEY / BOOKING_FROM_EMAIL / BOOKING_NOTIFY_EMAIL unvollständig konfiguriert.');
    return jsonResponse({ error: 'Die Online-Buchung ist derzeit nicht verfügbar. Bitte nutzen Sie das Kontaktformular.' }, 503);
  }

  const organizerAddress = extractAddress(fromEmail);
  const ics = buildIcs({ uid, date, time, customerName: name, customerEmail: email, organizerAddress, meetingUrl });
  const icsAttachment = {
    filename: 'erstgespraech-flexb.ics',
    content: Buffer.from(ics, 'utf8').toString('base64'),
    content_type: 'text/calendar; method=REQUEST; charset=utf-8',
  };

  const detailsHtml = [
    `<p><strong>${prettyDate}, ${time} Uhr</strong> · 30 Minuten · Online</p>`,
    mode === 'confirm' ? `<p>Meeting-Link: <a href="${meetingUrl}">${meetingUrl}</a></p>` : '',
  ].join('');

  const customerMail = mode === 'confirm'
    ? {
        from: fromEmail,
        to: [email],
        reply_to: notifyEmail,
        subject: `Ihr Erstgespräch am ${prettyDate} um ${time} Uhr – FlexB Solutions`,
        html: [
          `<p>Guten Tag ${name},</p>`,
          '<p>Ihr kostenloses Erstgespräch mit FlexB Solutions ist gebucht:</p>',
          detailsHtml,
          '<p>Die Kalendereinladung finden Sie im Anhang – mit einem Klick landet der Termin in Ihrem Kalender.</p>',
          '<p>Sollte der Termin ausnahmsweise mit einem bestehenden Termin kollidieren, melden wir uns umgehend mit Alternativvorschlägen.</p>',
          '<p>Beste Grüße<br>Felix Breitner · FlexB Solutions</p>',
        ].join('\n'),
        attachments: [icsAttachment],
      }
    : {
        from: fromEmail,
        to: [email],
        reply_to: notifyEmail,
        subject: 'Ihre Terminanfrage bei FlexB Solutions – Eingangsbestätigung',
        html: [
          `<p>Guten Tag ${name},</p>`,
          '<p>vielen Dank für Ihre Terminanfrage:</p>',
          detailsHtml,
          '<p>Sie erhalten in Kürze die verbindliche Bestätigung mit Kalendereinladung und Meeting-Link per E-Mail.</p>',
          '<p>Beste Grüße<br>Felix Breitner · FlexB Solutions</p>',
        ].join('\n'),
      };

  const notifyMail = {
    from: fromEmail,
    to: [notifyEmail],
    reply_to: email,
    subject: `[FlexB Terminanfrage] ${reference} · ${date} ${time} – ${name}`,
    html: [
      `<p><strong>${mode === 'confirm' ? 'Automatisch bestätigter Termin' : 'Neue Terminanfrage (Bestätigung ausstehend)'}</strong></p>`,
      `<p>Referenz: <strong>${reference}</strong></p>`,
      `<p>${prettyDate}, ${time} Uhr · 30 Minuten</p>`,
      `<p>Name: ${name}<br>E-Mail: ${email}<br>Telefon: ${phone || '–'}<br>Kundentyp: ${type}</p>`,
      message ? `<p>Anliegen: ${message}</p>` : '',
      `<p>Meeting-Link: <a href="${meetingUrl}">${meetingUrl}</a></p>`,
      '<p>Kalendereinladung im Anhang. Dieser Betreff wird von der Claude-Routine (Gmail-Connector) erkannt und weiterverarbeitet.</p>',
    ].join('\n'),
    attachments: [icsAttachment],
  };

  try {
    await storage.save(bookingRecord);
  } catch (error) {
    console.error('booking: Speicherung fehlgeschlagen:', error.message);
    return jsonResponse({ error: 'Die Terminbuchung konnte nicht sicher gespeichert werden. Bitte nutzen Sie das Kontaktformular.' }, 503);
  }

  try {
    await sendMail(apiKey, customerMail);
  } catch (error) {
    console.error('booking: Kundenmail fehlgeschlagen:', error.message);
    await storage.update(reference, { status: 'customer_mail_failed', lastError: error.message });
    return jsonResponse({ error: 'Die Bestätigungs-E-Mail konnte nicht gesendet werden. Bitte nutzen Sie das Kontaktformular.' }, 502);
  }

  try {
    await sendMail(apiKey, notifyMail);
    await storage.update(reference, { status: mode === 'confirm' ? 'confirmed_notified' : 'requested_notified' });
  } catch (error) {
    // Kunde ist bereits informiert – interne Benachrichtigung nur loggen.
    console.error('booking: interne Benachrichtigung fehlgeschlagen:', error.message);
    await storage.update(reference, { status: mode === 'confirm' ? 'confirmed_internal_mail_failed' : 'requested_internal_mail_failed', lastError: error.message });
  }

  console.log(JSON.stringify({ booking: 'sent', mode, reference, date, time }));
  return jsonResponse({ ok: true, mode, bookingReference: reference, meetingUrl: mode === 'confirm' ? meetingUrl : undefined });
};

export const config = {
  path: '/api/booking',
};
