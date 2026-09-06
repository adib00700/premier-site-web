import { Router } from 'express';
import { validateOrderInput, provisionAndNotify } from '../lib/provision.js';

const router = Router();

// Public endpoint called by the site's order form when a customer orders a plan.
router.post('/', async (req, res) => {
  const { name, phone, packageId } = req.body || {};
  const { errors } = validateOrderInput({ name, phone, packageId });
  if (errors.length) {
    return res.status(400).json({ error: 'Invalid input', details: errors });
  }

  try {
    const credentials = await provisionAndNotify({ name: name.trim(), phone: phone.trim(), packageId });
    res.status(201).json({ ok: true, login: credentials.login, url: credentials.url });
  } catch (err) {
    console.error('[orders] provisioning failed:', err.message);
    res.status(502).json({ error: 'Could not generate or deliver credentials, please retry shortly.' });
  }
});

export default router;
