const jwt = require('jsonwebtoken');
const env = require('../config/env');

function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  try {
    req.admin = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Sessão inválida ou expirada' });
  }
}

module.exports = { requireAuth };
