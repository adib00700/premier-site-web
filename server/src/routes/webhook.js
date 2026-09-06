import { Router } from 'express';
import { provisionTrial } from '../lib/provision.js';
import { sendCredentialsText } from '../lib/whatsapp.js';
import { getActiveTrial, saveTrial } from '../lib/trialStore.js';
import { verifyWebhookSignature } from '../lib/verifyWebhookSignature.js';

const router = Router();

function getTriggerKeywords() {
  return (process.env.WHATSAPP_TRIGGER_KEYWORDS || 'test,essai,trial,demo')
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
}

function messageMatchesTrigger(text) {
  const normalized = text.toLowerCase();
  return getTriggerKeywords().some((keyword) => normalized.includes(keyword));
}

// Meta calls this once to verify the webhook URL when you configure it.
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Meta calls this for every message/status event once subscribed.
router.post('/', verifyWebhookSignature, async (req, res) => {
  // Always 200 quickly; Meta retries aggressively on non-2xx.
  res.sendStatus(200);

  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];
    if (!message || message.type !== 'text') return;

    const phone = message.from; // already digits-only with country code
    const text = message.text?.body || '';
    const contactName = value?.contacts?.[0]?.profile?.name || 'Client';

    if (!messageMatchesTrigger(text)) return;

    const existing = getActiveTrial(phone);
    if (existing) {
      await sendCredentialsText({ phone, customerName: existing.name, ...existing });
      return;
    }

    const credentials = await provisionTrial({ name: contactName, phone });
    saveTrial(phone, { name: contactName, ...credentials });
    await sendCredentialsText({ phone, customerName: contactName, ...credentials });
  } catch (err) {
    console.error('[webhook] failed to handle incoming message:', err.message);
  }
});

export default router;
