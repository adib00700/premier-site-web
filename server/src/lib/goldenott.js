// Goldenott reseller API client.
//
// Confirmed from the live Swagger doc (https://goldenott.net/docs):
//   - Auth: header "X-API-Key: <token>" (token generated from the Goldenott
//     dashboard) — see GOLDENOTT_API_KEY in .env.
//   - The "Lines" section (M3U line management) exposes list/search fields
//     "username, password, package, template", which is why the body below
//     uses "package" rather than "package_id".
//
// Still TODO: the exact POST path + request/response schema for *creating*
// a line (we've only confirmed the GET "List M3U line subscriptions" one so
// far). Once you share that part of the Swagger doc, update
// GOLDENOTT_ENDPOINT_PATH, buildRequestBody() and parseResponse() below.
//
// Everything else in this project (WhatsApp sending, routes, order form)
// works independently of this file's exact contents.

const GOLDENOTT_ENDPOINT_PATH = '/reseller/create-line';

function randomPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function buildRequestBody({ username, password, packageId, customerName }) {
  // TODO: adjust field names to match the real Goldenott "create line" endpoint
  // (Lines section of the Swagger doc) once we see its request schema.
  return {
    username,
    password,
    package: packageId || process.env.GOLDENOTT_DEFAULT_PACKAGE_ID,
    note: customerName,
  };
}

function parseResponse(data) {
  // TODO: adjust to match the real Goldenott response fields.
  const login = data.username || data.login;
  const password = data.password;
  const url = data.url || data.m3u_url || data.playback_url;

  if (!login || !password || !url) {
    throw new Error(
      'Goldenott response is missing expected fields (login/password/url). ' +
        'Update parseResponse() in server/src/lib/goldenott.js to match the real API response: ' +
        JSON.stringify(data)
    );
  }

  return { login, password, url };
}

/**
 * Creates a new IPTV line on Goldenott and returns { login, password, url }.
 *
 * @param {Object} params
 * @param {string} params.customerName
 * @param {string} [params.usernameHint] preferred base for the generated username
 * @param {string} [params.packageId] Goldenott package/bouquet id
 */
export async function createGoldenottLine({ customerName, usernameHint, packageId }) {
  const baseUrl = process.env.GOLDENOTT_API_BASE_URL;
  if (!baseUrl || !process.env.GOLDENOTT_API_KEY) {
    throw new Error(
      'Goldenott is not configured: set GOLDENOTT_API_BASE_URL and GOLDENOTT_API_KEY in .env'
    );
  }

  const username =
    (usernameHint || 'kel').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) +
    Math.floor(1000 + Math.random() * 9000);
  const password = randomPassword();

  const response = await fetch(`${baseUrl}${GOLDENOTT_ENDPOINT_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.GOLDENOTT_API_KEY,
    },
    body: JSON.stringify(buildRequestBody({ username, password, packageId, customerName })),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Goldenott API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return parseResponse(data);
}
