const test = require('node:test');
const assert = require('node:assert/strict');
const { after, before } = require('node:test');
const { once } = require('node:events');
const fs = require('node:fs');
const path = require('node:path');
const app = require('../app');
const { errorHandler } = require('../middleware/errorMiddleware');

const server = app.listen(0);
let baseUrl;

before(async () => {
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test('health endpoint responds without requiring a database connection', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', service: 'NeevCraft API' });
});

test('protected routes reject requests without an access token', async () => {
  const response = await fetch(`${baseUrl}/api/orders/report`);
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { message: 'Not authorized, token missing' });
});

test('unknown API routes return a consistent not-found response', async () => {
  const response = await fetch(`${baseUrl}/api/not-a-route`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { message: 'Route not found: GET /api/not-a-route' });
});

test('serves the React application for browser routes after a production build', async (t) => {
  if (!fs.existsSync(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'))) {
    t.skip('Build the frontend to test the production SPA fallback');
    return;
  }

  const response = await fetch(`${baseUrl}/register`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.match(await response.text(), /NeevCraft/);
});

test('central error handler preserves controller-set HTTP statuses', () => {
  const response = {
    statusCode: 401,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };

  errorHandler(new Error('Invalid email or password'), {}, response, () => {});

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { message: 'Invalid email or password' });
});
