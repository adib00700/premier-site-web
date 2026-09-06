import { createHmac, timingSafeEqual } from 'crypto';

// Meta signs every webhook POST with X-Hub-Signature-256, computed from the
// app secret and the raw request body. Without this check, anyone who
// discovers the webhook URL could POST fake "messages" and make the server
// create Goldenott trial lines and send WhatsApp messages on your behalf.
export function verifyWebhookSignature(req, res, next) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'WHATSAPP_APP_SECRET is not configured on the server' });
  }

  const signatureHeader = req.header('x-hub-signature-256') || '';
  const expected =
    'sha256=' + createHmac('sha256', secret).update(req.rawBody || Buffer.alloc(0)).digest('hex');

  const provided = Buffer.from(signatureHeader);
  const expectedBuf = Buffer.from(expected);

  if (provided.length !== expectedBuf.length || !timingSafeEqual(provided, expectedBuf)) {
    return res.sendStatus(401);
  }
  next();
}
