const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;
const SECRET = 'vuyNVBBU345345Nxsddf'; // Use a strong secret in production

app.use(express.json());

// Serve static files (index.html, test.html, etc.)
app.use(express.static(path.join(__dirname)));

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin' && password === 'admin') {
    const token = jwt.sign({ user: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// JWT verification endpoint
app.post('/verify', (req, res) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).send();
  const token = auth.split(' ')[1];
  jwt.verify(token, SECRET, (err) => {
    if (err) return res.status(401).send();
    res.sendStatus(200);
  });
});

// Protect test.html route
app.get('/test.html', (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.redirect('/index.html');
  const token = auth.split(' ')[1];
  jwt.verify(token, SECRET, (err) => {
    if (err) return res.redirect('/index.html');
    res.sendFile(path.join(__dirname, 'test.html'));
  });
});

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
