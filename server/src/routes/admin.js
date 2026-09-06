import { Router } from 'express';
import { requireAdminKey } from '../lib/auth.js';
import { validateOrderInput, provisionTrialAndNotify } from '../lib/provision.js';
import { sendCredentialsText } from '../lib/whatsapp.js';

const router = Router();
router.use(requireAdminKey);

// Manual (re)generation of a free trial, e.g. when a customer asks by phone/DM.
router.post('/generate', async (req, res) => {
  const { name, phone } = req.body || {};
  const { errors } = validateOrderInput({ name, phone });
  if (errors.length) {
    return res.status(400).json({ error: 'Invalid input', details: errors });
  }

  try {
    const credentials = await provisionTrialAndNotify({ name: name.trim(), phone: phone.trim() });
    res.status(201).json({ ok: true, ...credentials });
  } catch (err) {
    console.error('[admin/generate] provisioning failed:', err.message);
    res.status(502).json({ error: err.message });
  }
});

// Resend already-known credentials as a plain text message, for use inside
// an existing WhatsApp conversation (within the 24h customer service window).
router.post('/resend', async (req, res) => {
  const { name, phone, login, password, url } = req.body || {};
  if (!name || !phone || !login || !password || !url) {
    return res.status(400).json({ error: 'name, phone, login, password and url are all required' });
  }

  try {
    await sendCredentialsText({ phone, customerName: name, login, password, url });
    res.json({ ok: true });
  } catch (err) {
    console.error('[admin/resend] send failed:', err.message);
    res.status(502).json({ error: err.message });
  }
});

export default router;
