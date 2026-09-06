import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';

const app = express();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : false,
  })
);
app.use(express.json());

// Limits abuse of the public order endpoint (credential generation has a real cost).
const orderLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/orders', orderLimiter, ordersRouter);
app.use('/api/admin', adminRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Keloar automation server listening on port ${port}`);
});
