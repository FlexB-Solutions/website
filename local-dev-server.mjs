import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import chatHandler from './netlify/functions/chat.mjs';
import bookingHandler from './netlify/functions/booking.mjs';

const ROOT = resolve('/Users/felixbreitner/Desktop/FlexB');
const PORT = Number(process.env.PORT) || 8888;

loadEnv(resolve(ROOT, '.env'));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function loadEnv(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex < 0) return;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (key && !process.env[key]) process.env[key] = value;
  });
}

function isSafePath(candidatePath) {
  return candidatePath.startsWith(ROOT);
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  if (pathname === '/') pathname = '/index.html';

  const filePath = resolve(ROOT, `.${pathname}`);
  if (!isSafePath(filePath)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) {
      const directoryIndex = join(filePath, 'index.html');
      return serveFile(directoryIndex, res);
    }
    return serveFile(filePath, res);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

function serveFile(filePath, res) {
  const extension = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || 'application/octet-stream';
  res.writeHead(200, { 'content-type': contentType, 'cache-control': 'no-store' });
  createReadStream(filePath).pipe(res);
}

async function handleFunction(handler, req, res) {
  const body = await readRequestBody(req);
  const requestUrl = `http://${req.headers.host}${req.url}`;
  const request = new Request(requestUrl, {
    method: req.method,
    headers: req.headers,
    body: body.length ? body : undefined,
  });

  globalThis.Netlify = {
    env: {
      get(key) {
        return process.env[key];
      },
    },
  };

  const response = await handler(request);
  const responseText = await response.text();
  const headers = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  res.writeHead(response.status, headers);
  res.end(responseText);
}

function readRequestBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolveBody(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

createServer(async (req, res) => {
  try {
    if (req.url?.startsWith('/api/chat')) {
      await handleFunction(chatHandler, req, res);
      return;
    }

    if (req.url?.startsWith('/api/booking')) {
      await handleFunction(bookingHandler, req, res);
      return;
    }

    await serveStatic(req, res);
  } catch (error) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(`Server error: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
}).listen(PORT, () => {
  console.log(`FlexB local dev server running on http://localhost:${PORT}`);
});
