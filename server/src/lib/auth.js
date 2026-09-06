export function requireAdminKey(req, res, next) {
  const provided = req.header('x-admin-key');
  const expected = process.env.ADMIN_API_KEY;

  if (!expected) {
    return res.status(500).json({ error: 'ADMIN_API_KEY is not configured on the server' });
  }
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
