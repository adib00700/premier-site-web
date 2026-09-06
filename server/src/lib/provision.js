import { createGoldenottTrialLine } from './goldenott.js';

const PHONE_RE = /^\+?[1-9]\d{7,14}$/;

export function validateOrderInput({ name, phone }) {
  const errors = [];
  if (!name || String(name).trim().length < 2) errors.push('name is required');
  if (!phone || !PHONE_RE.test(String(phone).trim())) {
    errors.push('phone must be a valid international number, e.g. +33612345678');
  }
  return { errors };
}

/** Creates a free 24h trial line on Goldenott. Does not send anything itself. */
export async function provisionTrial({ name, phone }) {
  return createGoldenottTrialLine({ customerName: name, usernameHint: name || phone });
}
