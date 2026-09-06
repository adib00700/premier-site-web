// Tiny file-backed store to avoid generating a new Goldenott trial line
// every time the same customer re-sends the trigger keyword. Good enough
// for this volume; swap for a real database if usage grows.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORE_PATH = process.env.TRIAL_STORE_PATH || `${__dirname}/../../data/trials.json`;
const TRIAL_VALIDITY_MS = 24 * 60 * 60 * 1000;

function load() {
  if (!existsSync(STORE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(STORE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function save(data) {
  mkdirSync(dirname(STORE_PATH), { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

/** Returns the still-valid trial for this phone, or null if none/expired. */
export function getActiveTrial(phone) {
  const data = load();
  const entry = data[phone];
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TRIAL_VALIDITY_MS) return null;
  return entry;
}

export function saveTrial(phone, { name, login, password, url }) {
  const data = load();
  data[phone] = { name, login, password, url, createdAt: Date.now() };
  save(data);
}
