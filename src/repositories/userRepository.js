const { getPool } = require('../config/database');
const env = require('../config/env');

const isPostgres = env.dbClient === 'postgres';

// Observação: a senha (hash) nunca é selecionada aqui de volta para o
// front-end. O painel antigo devolvia e exibia o hash/senha na tabela,
// o que é um vazamento de dado sensível desnecessário.
const SELECT_COLUMNS = 'id, nome, email, telefone';

async function findAll() {
  const pool = getPool();
  const sql = `SELECT ${SELECT_COLUMNS} FROM usuarios ORDER BY id`;

  if (isPostgres) {
    const { rows } = await pool.query(sql);
    return rows;
  }
  const [rows] = await pool.query(sql);
  return rows;
}

async function create({ nome, email, telefone, senhaHash }) {
  const pool = getPool();

  if (isPostgres) {
    const sql = `INSERT INTO usuarios (nome, email, telefone, senha)
                 VALUES ($1, $2, $3, $4)
                 RETURNING ${SELECT_COLUMNS}`;
    const { rows } = await pool.query(sql, [nome, email, telefone, senhaHash]);
    return rows[0];
  }

  const sql = 'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)';
  const [result] = await pool.query(sql, [nome, email, telefone, senhaHash]);
  return { id: result.insertId, nome, email, telefone };
}

async function update(id, { nome, email, telefone, senhaHash }) {
  const pool = getPool();

  if (isPostgres) {
    const sql = `UPDATE usuarios SET nome = $1, email = $2, telefone = $3, senha = $4
                 WHERE id = $5`;
    const result = await pool.query(sql, [nome, email, telefone, senhaHash, id]);
    return result.rowCount > 0;
  }

  const sql = 'UPDATE usuarios SET nome = ?, email = ?, telefone = ?, senha = ? WHERE id = ?';
  const [result] = await pool.query(sql, [nome, email, telefone, senhaHash, id]);
  return result.affectedRows > 0;
}

async function remove(id) {
  const pool = getPool();

  if (isPostgres) {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, create, update, remove };
