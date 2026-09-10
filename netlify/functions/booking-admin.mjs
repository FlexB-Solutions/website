import { getStore } from '@netlify/blobs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function isAuthorized(req) {
  const expected = Netlify.env.get('BOOKING_ADMIN_TOKEN');
  if (!expected) return false;
  const authHeader = req.headers.get('authorization') || '';
  const directHeader = req.headers.get('x-booking-admin-token') || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  return bearer === expected || directHeader === expected;
}

async function getStorageAdapter() {
  try {
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
      async update(reference, patch) {
        const key = `booking/${reference}.json`;
        const current = await store.get(key, { type: 'json' });
        if (!current) return null;
        const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
        await store.setJSON(key, next);
        return next;
      },
    };
  } catch {
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
      async update(reference, patch) {
        const records = await pruneExpired();
        let updated = null;
        const next = records.map((entry) => {
          if (entry.reference !== reference) return entry;
          updated = { ...entry, ...patch, updatedAt: new Date().toISOString() };
          return updated;
        });
        await writeAll(next);
        return updated;
      },
    };
  }
}

export default async (req) => {
  if (!isAuthorized(req)) return jsonResponse({ error: 'Unauthorized.' }, 401);
  const storage = await getStorageAdapter();

  if (req.method === 'GET') {
    const url = new URL(req.url);
    const reference = url.searchParams.get('reference');
    const status = url.searchParams.get('status') || undefined;
    const limit = Math.min(Number(url.searchParams.get('limit') || 25), 100);
    if (reference) {
      const booking = await storage.findByReference(reference);
      return booking ? jsonResponse({ booking }) : jsonResponse({ error: 'Not found.' }, 404);
    }
    const bookings = await storage.list({ status, limit });
    return jsonResponse({ bookings });
  }

  if (req.method === 'PATCH') {
    let payload;
    try {
      payload = await req.json();
    } catch {
      return jsonResponse({ error: 'Ungültige Anfrage.' }, 400);
    }
    const reference = String(payload?.reference || '').trim();
    const status = String(payload?.status || '').trim();
    if (!reference || !status) {
      return jsonResponse({ error: 'reference und status sind erforderlich.' }, 400);
    }
    const updated = await storage.update(reference, {
      status,
      adminNotes: typeof payload?.adminNotes === 'string' ? payload.adminNotes.slice(0, 1000) : undefined,
      calendarEventId: typeof payload?.calendarEventId === 'string' ? payload.calendarEventId.slice(0, 200) : undefined,
      meetingProvider: typeof payload?.meetingProvider === 'string' ? payload.meetingProvider.slice(0, 80) : undefined,
      meetingUrl: typeof payload?.meetingUrl === 'string' ? payload.meetingUrl.slice(0, 500) : undefined,
      processedAt: new Date().toISOString(),
    });
    return updated ? jsonResponse({ booking: updated }) : jsonResponse({ error: 'Not found.' }, 404);
  }

  return jsonResponse({ error: 'Method not allowed.' }, 405);
};

export const config = {
  path: '/api/booking-admin',
};
