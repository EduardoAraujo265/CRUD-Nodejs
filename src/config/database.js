const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const env = require('./env');

let pool;

/**
 * Retorna um pool de conexões único (singleton) com o banco configurado
 * em DB_CLIENT. Usar pool em vez de uma única conexão evita que o
 * servidor pare de funcionar após a primeira queda de conexão.
 */
function getPool() {
  if (pool) return pool;

  if (env.dbClient === 'mysql') {
    pool = mysql.createPool({
      host: env.dbHost,
      user: env.dbUser,
      password: env.dbPassword,
      database: env.dbName,
      port: env.dbPort || 3306,
      waitForConnections: true,
      connectionLimit: 10,
    });
  } else {
    pool = new Pool({
      host: env.dbHost,
      user: env.dbUser,
      password: env.dbPassword,
      database: env.dbName,
      port: env.dbPort || 5432,
    });
  }

  return pool;
}

module.exports = { getPool };
