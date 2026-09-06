// WhatsApp Business Cloud API (Meta) client.
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages

function graphUrl() {
  const version = process.env.WHATSAPP_API_VERSION || 'v20.0';
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  return `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;
}

function normalizePhone(phone) {
  // WhatsApp Cloud API expects digits only, with country code, no leading +.
  return String(phone).replace(/[^\d]/g, '');
}

async function callGraphApi(body) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    throw new Error(
      'WhatsApp is not configured: set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in .env'
    );
  }

  const response = await fetch(graphUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`WhatsApp API error ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

/**
 * Sends the generated credentials to the customer using an approved
 * WhatsApp message template. Required for the first business-initiated
 * message, or any message sent outside the 24h customer-service window.
 *
 * The template must be created and approved beforehand in Meta Business
 * Manager > WhatsApp Manager > Message Templates, with 4 body variables in
 * this order: {{1}} customer name, {{2}} login, {{3}} password, {{4}} url.
 * Example approved body: "Bonjour {{1}}, voici votre essai gratuit 24h
 * Keloar.com : identifiant {{2}}, mot de passe {{3}}, lien {{4}}."
 */
export async function sendCredentialsTemplate({ phone, customerName, login, password, url }) {
  return callGraphApi({
    messaging_product: 'whatsapp',
    to: normalizePhone(phone),
    type: 'template',
    template: {
      name: process.env.WHATSAPP_TEMPLATE_NAME || 'iptv_trial_delivery',
      language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'fr' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: customerName },
            { type: 'text', text: login },
            { type: 'text', text: password },
            { type: 'text', text: url },
          ],
        },
      ],
    },
  });
}

/**
 * Sends a plain text message. Only works if the customer has messaged you
 * within the last 24h (WhatsApp's customer-service window). Useful for
 * manual resends inside an ongoing conversation.
 */
export async function sendCredentialsText({ phone, customerName, login, password, url }) {
  const text =
    `Bonjour ${customerName}, voici votre essai gratuit 24h Keloar.com :\n\n` +
    `Identifiant : ${login}\n` +
    `Mot de passe : ${password}\n` +
    `URL de connexion : ${url}\n\n` +
    `Besoin d'aide pour l'installation ? Répondez directement ici.`;

  return callGraphApi({
    messaging_product: 'whatsapp',
    to: normalizePhone(phone),
    type: 'text',
    text: { body: text },
  });
}
