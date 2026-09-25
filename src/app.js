const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { requireAuth } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const app = express();

// Por padrão o helmet aplica uma CSP com "script-src 'self'", o que bloqueia
// o jQuery e o Bootstrap carregados via CDN em login.html. Em vez de
// desligar a CSP, listamos explicitamente os domínios que o projeto usa.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://ajax.googleapis.com', 'https://cdn.jsdelivr.net'],
        scriptSrcElem: ["'self'", 'https://ajax.googleapis.com', 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/usuarios', userRoutes);
app.use('/auth', authRoutes);

// O dashboard só é entregue para quem já tem um token válido; antes,
// qualquer pessoa conseguia acessar /head.html diretamente pela URL,
// sem passar pelo login.
app.get(['/dashboard', '/dashboard.html'], requireAuth, (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'dashboard.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'login.html'));
});

// CSS, JS e demais arquivos estáticos (não inclui dashboard.html, tratado acima)
app.use(express.static(PUBLIC_DIR, { index: false }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
