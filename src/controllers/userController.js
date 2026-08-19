const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const SALT_ROUNDS = 10;

async function listar(req, res, next) {
  try {
    const usuarios = await userRepository.findAll();
    res.status(200).json(usuarios);
  } catch (err) {
    next(err);
  }
}

async function criar(req, res, next) {
  try {
    const { nome, email, telefone, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const usuario = await userRepository.create({ nome, email, telefone, senhaHash });

    res.status(201).json({ message: 'Usuário criado com sucesso', usuario });
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, email, telefone, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const atualizado = await userRepository.update(id, { nome, email, telefone, senhaHash });

    if (!atualizado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: `Usuário ${id} atualizado com sucesso` });
  } catch (err) {
    next(err);
  }
}

async function remover(req, res, next) {
  try {
    const { id } = req.params;
    const removido = await userRepository.remove(id);

    if (!removido) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário removido com sucesso' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, criar, atualizar, remover };
