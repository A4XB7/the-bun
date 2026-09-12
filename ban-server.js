require('dotenv').config();
const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-render';
const db = new Database(process.env.DB_PATH || path.join(__dirname, 'ban-tool.db'));

db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS bans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('user','ip','email','username')),
  target TEXT NOT NULL,
  reason TEXT DEFAULT '',
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS whitelist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('user','ip','email','username')),
  target TEXT NOT NULL,
  reason TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try { req.admin = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
}

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'ban-index.html')));

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password || password.length < 8)
    return res.status(400).json({ error: 'Username, email and an 8+ character password are required' });
  try {
    const hash = await bcrypt.hash(password, 12);
    const result = db.prepare('INSERT INTO admins (username,email,password_hash) VALUES (?,?,?)').run(username.trim(), email.trim().toLowerCase(), hash);
    const token = jwt.sign({ id: result.lastInsertRowid, username: username.trim() }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: result.lastInsertRowid, username: username.trim(), email: email.trim().toLowerCase() } });
  } catch (e) { res.status(409).json({ error: 'Username or email already exists' }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username || '');
  if (!admin || !(await bcrypt.compare(password || '', admin.password_hash))) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: admin.id, username: admin.username, email: admin.email } });
});

app.get('/api/stats', auth, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) n FROM bans').get().n;
  const active = db.prepare("SELECT COUNT(*) n FROM bans WHERE active=1 AND (expires_at IS NULL OR expires_at > datetime('now'))").get().n;
  const users = db.prepare("SELECT COUNT(*) n FROM bans WHERE type='user'").get().n;
  const ips = db.prepare("SELECT COUNT(*) n FROM bans WHERE type='ip'").get().n;
  res.json({ total, active, users, ips });
});

app.get('/api/bans', auth, (req, res) => {
  const { type, q } = req.query;
  let sql = 'SELECT * FROM bans WHERE 1=1'; const args = [];
  if (type && ['user','ip','email','username'].includes(type)) { sql += ' AND type=?'; args.push(type); }
  if (q) { sql += ' AND (target LIKE ? OR reason LIKE ?)'; args.push(`%${q}%`, `%${q}%`); }
  sql += ' ORDER BY id DESC LIMIT 200';
  res.json(db.prepare(sql).all(...args));
});

app.post('/api/bans', auth, (req, res) => {
  const { type, target, reason = '', expiresAt = null } = req.body || {};
  if (!['user','ip','email','username'].includes(type) || !target?.trim()) return res.status(400).json({ error: 'Valid type and target are required' });
  const result = db.prepare('INSERT INTO bans (type,target,reason,expires_at) VALUES (?,?,?,?)').run(type, target.trim(), reason.trim(), expiresAt || null);
  res.json(db.prepare('SELECT * FROM bans WHERE id=?').get(result.lastInsertRowid));
});

app.delete('/api/bans/:id', auth, (req, res) => {
  db.prepare('UPDATE bans SET active=0 WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

app.post('/api/bans/check', (req, res) => {
  const { type, target } = req.body || {};
  const ban = db.prepare("SELECT * FROM bans WHERE type=? AND target=? AND active=1 AND (expires_at IS NULL OR expires_at > datetime('now')) ORDER BY id DESC LIMIT 1").get(type, target);
  res.json({ banned: !!ban, ban: ban || null });
});

app.get('/api/whitelist', auth, (req, res) => res.json(db.prepare('SELECT * FROM whitelist ORDER BY id DESC').all()));
app.post('/api/whitelist', auth, (req, res) => {
  const { type, target, reason = '' } = req.body || {};
  if (!['user','ip','email','username'].includes(type) || !target?.trim()) return res.status(400).json({ error: 'Valid type and target are required' });
  const result = db.prepare('INSERT INTO whitelist (type,target,reason) VALUES (?,?,?)').run(type, target.trim(), reason.trim());
  res.json(db.prepare('SELECT * FROM whitelist WHERE id=?').get(result.lastInsertRowid));
});
app.delete('/api/whitelist/:id', auth, (req, res) => { db.prepare('DELETE FROM whitelist WHERE id=?').run(req.params.id); res.json({ ok: true }); });

app.listen(PORT, '0.0.0.0', () => console.log(`The Bun Ban Tool listening on ${PORT}`));
