import { createGoldenottLine } from './goldenott.js';
import { sendCredentialsTemplate } from './whatsapp.js';

const PHONE_RE = /^\+?[1-9]\d{7,14}$/;

export function validateOrderInput({ name, phone, packageId }) {
  const errors = [];
  if (!name || String(name).trim().length < 2) errors.push('name is required');
  if (!phone || !PHONE_RE.test(String(phone).trim())) {
    errors.push('phone must be a valid international number, e.g. +33612345678');
  }
  return { errors, packageId };
}

/**
 * Creates a Goldenott line for the customer and delivers the credentials
 * over WhatsApp. Shared by the automatic order endpoint and the manual
 * admin endpoint.
 */
export async function provisionAndNotify({ name, phone, packageId }) {
  const credentials = await createGoldenottLine({ customerName: name, usernameHint: name, packageId });
  await sendCredentialsTemplate({ phone, customerName: name, ...credentials });
  return credentials;
}
