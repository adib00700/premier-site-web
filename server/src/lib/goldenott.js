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
// This service only creates free 24h trial lines (paid subscriptions are
// still handled manually). package_id / template_id / dns_domain_id /
// tv_domain_id are account-specific numeric IDs for your trial package —
// find them in your Goldenott dashboard (Packages / Templates / Domains)
// and set them via the GOLDENOTT_TRIAL_* env vars below.

const ENDPOINT_PATH = '/v1/lines';

function randomPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function getTrialConfig() {
  const required = [
    'GOLDENOTT_TRIAL_PACKAGE_ID',
    'GOLDENOTT_TRIAL_TEMPLATE_ID',
    'GOLDENOTT_TRIAL_DNS_DOMAIN_ID',
    'GOLDENOTT_TRIAL_TV_DOMAIN_ID',
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing Goldenott trial config in .env: ${missing.join(', ')}`);
  }

  return {
    package_id: Number(process.env.GOLDENOTT_TRIAL_PACKAGE_ID),
    template_id: Number(process.env.GOLDENOTT_TRIAL_TEMPLATE_ID),
    dns_domain_id: Number(process.env.GOLDENOTT_TRIAL_DNS_DOMAIN_ID),
    tv_domain_id: Number(process.env.GOLDENOTT_TRIAL_TV_DOMAIN_ID),
    max_connections: Number(process.env.GOLDENOTT_TRIAL_MAX_CONNECTIONS || 1),
  };
}

function buildRequestBody({ username, password, customerName, trialConfig }) {
  return {
    package_id: trialConfig.package_id,
    template_id: trialConfig.template_id,
    dns_domain_id: trialConfig.dns_domain_id,
    tv_domain_id: trialConfig.tv_domain_id,
    username,
    password,
    is_adult: false,
    max_connections: trialConfig.max_connections,
    notes: `Essai 24h - ${customerName}`,
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
 * Creates a free 24h trial line on Goldenott and returns { login, password, url }.
 *
 * @param {Object} params
 * @param {string} params.customerName
 * @param {string} [params.usernameHint] preferred base for the generated username
 */
export async function createGoldenottTrialLine({ customerName, usernameHint }) {
  const baseUrl = process.env.GOLDENOTT_API_BASE_URL;
  if (!baseUrl || !process.env.GOLDENOTT_API_KEY) {
    throw new Error(
      'Goldenott is not configured: set GOLDENOTT_API_BASE_URL and GOLDENOTT_API_KEY in .env'
    );
  }

  const trialConfig = getTrialConfig();

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
    body: JSON.stringify(buildRequestBody({ username, password, customerName, trialConfig })),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new Error(`Goldenott API error ${response.status}: ${JSON.stringify(body)}`);
  }

  return parseResponse(body);
}
