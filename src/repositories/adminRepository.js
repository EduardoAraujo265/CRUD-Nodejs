const { getPool } = require('../config/database');
const env = require('../config/env');

const isPostgres = env.dbClient === 'postgres';

async function findByEmail(email) {
  const pool = getPool();

  if (isPostgres) {
    const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    return rows[0] || null;
  }

  const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
  return rows[0] || null;
}

module.exports = { findByEmail };
