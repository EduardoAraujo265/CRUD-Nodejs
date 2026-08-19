const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminRepository = require('../repositories/adminRepository');
const env = require('../config/env');

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    const admin = await adminRepository.findByEmail(email);

    // Mesma mensagem tanto para "email não existe" quanto para "senha errada",
    // para não revelar quais e-mails estão cadastrados.
    if (!admin) {
      return res.status(401).json({ message: 'Login ou senha incorretos' });
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Login ou senha incorretos' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, env.jwtSecret, {
      expiresIn: '2h',
    });

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: 'Login bem-sucedido' });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  res.clearCookie('token').status(200).json({ message: 'Logout realizado com sucesso' });
}

module.exports = { login, logout };
