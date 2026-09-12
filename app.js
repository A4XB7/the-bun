require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-landing.html'));
});

app.get('/messaging', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/weather', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/ban-tool', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ban-index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║        🍞 The Bun - Running! 🍞       ║
╠════════════════════════════════════════╣
║                                        ║
║  🌐 Landing Page:                      ║
║  http://localhost:${PORT}                   ║
║                                        ║
║  📍 Available Routes:                  ║
║  /              - Landing Page         ║
║  /messaging     - Messaging App        ║
║  /weather       - Weather Dashboard    ║
║  /ban-tool      - Ban Tool             ║
║                                        ║
╚════════════════════════════════════════╝
  `);
});
