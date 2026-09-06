import 'dotenv/config';
import express from 'express';
import adminRouter from './routes/admin.js';
import webhookRouter from './routes/webhook.js';

const app = express();

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/webhook/whatsapp', webhookRouter);
app.use('/api/admin', adminRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Keloar automation server listening on port ${port}`);
});
