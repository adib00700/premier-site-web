import { Router } from 'express';
import { validateOrderInput, provisionTrialAndNotify } from '../lib/provision.js';

const router = Router();

// Public endpoint called by the site's form when a customer requests a free 24h trial.
router.post('/', async (req, res) => {
  const { name, phone } = req.body || {};
  const { errors } = validateOrderInput({ name, phone });
  if (errors.length) {
    return res.status(400).json({ error: 'Invalid input', details: errors });
  }

  try {
    const credentials = await provisionTrialAndNotify({ name: name.trim(), phone: phone.trim() });
    res.status(201).json({ ok: true, login: credentials.login, url: credentials.url });
  } catch (err) {
    console.error('[orders] provisioning failed:', err.message);
    res.status(502).json({ error: 'Could not generate or deliver credentials, please retry shortly.' });
  }
});

export default router;
