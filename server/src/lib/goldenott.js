// Goldenott reseller API client.
//
// Confirmed from the live Swagger doc (https://goldenott.net/docs):
//   - Auth: header "X-API-Key: <token>" (token generated from the Goldenott
//     dashboard) — see GOLDENOTT_API_KEY in .env.
//   - Create a line: POST {base}/v1/lines
//       Request body: { package_id, template_id, dns_domain_id, tv_domain_id,
//                        username, password, is_adult, max_connections, notes }
//       Response 201: { success, message, data: [{ username, password,
//                        exp_date, dns_link_for_samsung_lg, ... }] }
//     "dns_link_for_samsung_lg" is the URL delivered to the customer.
//
// package_id / template_id / dns_domain_id / tv_domain_id are account-specific
// numeric IDs from your Goldenott dashboard (Packages / Templates / Domains).
// They differ per plan, so they're configured per site package below via
// GOLDENOTT_PACKAGE_MAP rather than hardcoded.

const ENDPOINT_PATH = '/v1/lines';

function randomPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function getPackageMap() {
  const raw = process.env.GOLDENOTT_PACKAGE_MAP;
  if (!raw) {
    throw new Error(
      'GOLDENOTT_PACKAGE_MAP is not configured in .env — see .env.example for the expected format.'
    );
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('GOLDENOTT_PACKAGE_MAP in .env is not valid JSON.');
  }
}

function resolvePackageConfig(packageId) {
  const map = getPackageMap();
  const config = map[packageId];
  if (!config) {
    throw new Error(
      `Unknown package "${packageId}" — add it to GOLDENOTT_PACKAGE_MAP in .env. ` +
        `Known packages: ${Object.keys(map).join(', ') || '(none configured)'}`
    );
  }
  return config;
}

function buildRequestBody({ username, password, customerName, packageConfig }) {
  return {
    package_id: packageConfig.package_id,
    template_id: packageConfig.template_id,
    dns_domain_id: packageConfig.dns_domain_id,
    tv_domain_id: packageConfig.tv_domain_id,
    username,
    password,
    is_adult: false,
    max_connections: packageConfig.max_connections || 1,
    notes: customerName,
  };
}

function parseResponse(body) {
  const line = Array.isArray(body?.data) ? body.data[0] : body?.data;
  const login = line?.username;
  const password = line?.password;
  const url = line?.dns_link_for_samsung_lg;

  if (!login || !password || !url) {
    throw new Error(
      'Goldenott response is missing expected fields (username/password/dns_link_for_samsung_lg): ' +
        JSON.stringify(body)
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
 * @param {string} params.packageId site-side plan key (e.g. "essentiel", "premium", "famille") —
 *   must have a matching entry in GOLDENOTT_PACKAGE_MAP.
 */
export async function createGoldenottLine({ customerName, usernameHint, packageId }) {
  const baseUrl = process.env.GOLDENOTT_API_BASE_URL;
  if (!baseUrl || !process.env.GOLDENOTT_API_KEY) {
    throw new Error(
      'Goldenott is not configured: set GOLDENOTT_API_BASE_URL and GOLDENOTT_API_KEY in .env'
    );
  }

  const packageConfig = resolvePackageConfig(packageId);

  const username =
    (usernameHint || 'kel').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) +
    Math.floor(1000 + Math.random() * 9000);
  const password = randomPassword();

  const response = await fetch(`${baseUrl}${ENDPOINT_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.GOLDENOTT_API_KEY,
    },
    body: JSON.stringify(buildRequestBody({ username, password, customerName, packageConfig })),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new Error(`Goldenott API error ${response.status}: ${JSON.stringify(body)}`);
  }

  return parseResponse(body);
}
