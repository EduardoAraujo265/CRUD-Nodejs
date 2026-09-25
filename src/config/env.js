require('dotenv').config();

const REQUIRED_VARS = ['DB_CLIENT', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Variáveis de ambiente obrigatórias ausentes: ${missing.join(
      ', '
    )}. Copie o arquivo .env.example para .env e preencha os valores.`
  );
}

if (!['mysql', 'postgres'].includes(process.env.DB_CLIENT)) {
  throw new Error('DB_CLIENT deve ser "mysql" ou "postgres".');
}

module.exports = {
  dbClient: process.env.DB_CLIENT,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
};
