/**
 * Script de setup: pergunta os dados de conexão, gera o .env
 * automaticamente (incluindo um JWT_SECRET aleatório), cria o banco de
 * dados (se não existir), cria as tabelas `usuarios`/`admins` e, opcionalmente,
 * já cadastra o primeiro admin com a senha em hash.
 *
 * Uso:
 *   node scripts/setup.js
 *   # ou
 *   npm run setup
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const ROOT_DIR = path.join(__dirname, '..');
const ENV_PATH = path.join(ROOT_DIR, '.env');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, { defaultValue, required = false } = {}) {
  const suffix = defaultValue !== undefined ? ` (${defaultValue})` : '';
  return new Promise((resolve) => {
    const loop = () => {
      rl.question(`${question}${suffix}: `, (answer) => {
        const value = answer.trim() || defaultValue;
        if (required && !value) {
          console.log('  -> Esse valor é obrigatório.');
          return loop();
        }
        resolve(value);
      });
    };
    loop();
  });
}

async function askYesNo(question, defaultYes = true) {
  const hint = defaultYes ? 'S/n' : 's/N';
  const answer = await ask(`${question} [${hint}]`);
  if (!answer) return defaultYes;
  return ['s', 'sim', 'y', 'yes'].includes(answer.toLowerCase());
}

async function main() {
  console.log('=== Setup do CRUD Node.js ===\n');

  const dbClient = (await ask('Banco de dados (mysql/postgres)', {
    defaultValue: 'mysql',
    required: true,
  })).toLowerCase();

  if (!['mysql', 'postgres'].includes(dbClient)) {
    console.error('DB_CLIENT precisa ser "mysql" ou "postgres".');
    process.exit(1);
  }

  const dbHost = await ask('Host do banco', { defaultValue: 'localhost', required: true });
  const dbPort = await ask('Porta do banco', {
    defaultValue: dbClient === 'mysql' ? '3306' : '5432',
    required: true,
  });
  const dbUser = await ask('Usuário do banco', { defaultValue: 'root', required: true });
  const dbPassword = await ask('Senha do banco', { defaultValue: '', required: false });
  const dbName = await ask('Nome do banco de dados', {
    defaultValue: 'crud_nodejs',
    required: true,
  });
  const appPort = await ask('Porta do servidor Node', { defaultValue: '5000', required: true });

  const jwtSecret = crypto.randomBytes(48).toString('hex');

  const envContent = [
    `DB_CLIENT=${dbClient}`,
    `DB_HOST=${dbHost}`,
    `DB_USER=${dbUser}`,
    `DB_PASSWORD=${dbPassword}`,
    `DB_NAME=${dbName}`,
    `DB_PORT=${dbPort}`,
    `JWT_SECRET=${jwtSecret}`,
    `PORT=${appPort}`,
    'NODE_ENV=development',
    '',
  ].join('\n');

  if (fs.existsSync(ENV_PATH)) {
    const sobrescrever = await askYesNo('Já existe um .env. Sobrescrever?', false);
    if (!sobrescrever) {
      console.log('Setup cancelado, .env mantido como estava.');
      rl.close();
      return;
    }
  }

  fs.writeFileSync(ENV_PATH, envContent);
  console.log(`\n.env criado em ${ENV_PATH}`);

  const criarBanco = await askYesNo('Criar o banco de dados e as tabelas agora?', true);
  if (criarBanco) {
    await criarBancoETabelas({ dbClient, dbHost, dbPort, dbUser, dbPassword, dbName });
  }

  const criarAdmin = await askYesNo('Cadastrar o primeiro admin agora?', true);
  if (criarAdmin) {
    const nome = await ask('Nome do admin', { defaultValue: 'Admin', required: true });
    const email = await ask('E-mail do admin', { required: true });
    const senha = await ask('Senha do admin (mínimo 8 caracteres)', { required: true });

    await cadastrarAdmin({ dbClient, dbHost, dbPort, dbUser, dbPassword, dbName, nome, email, senha });
  }

  console.log('\nTudo pronto! Para subir o servidor:');
  console.log('  npm start   (ou npm run dev)\n');

  rl.close();
}

async function criarBancoETabelas({ dbClient, dbHost, dbPort, dbUser, dbPassword, dbName }) {
  if (dbClient === 'mysql') {
    const mysql = require('mysql2/promise');

    // Conecta sem selecionar banco para poder criá-lo
    const admin = await mysql.createConnection({
      host: dbHost,
      port: Number(dbPort),
      user: dbUser,
      password: dbPassword,
    });
    await admin.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await admin.end();
    console.log(`Banco "${dbName}" verificado/criado.`);

    const conn = await mysql.createConnection({
      host: dbHost,
      port: Number(dbPort),
      user: dbUser,
      password: dbPassword,
      database: dbName,
      multipleStatements: true,
    });
    const sql = fs.readFileSync(path.join(ROOT_DIR, 'database', 'mysql.sql'), 'utf8');
    await conn.query(sql);
    await conn.end();
    console.log('Tabelas criadas (usuarios, admins).');
  } else {
    const { Client } = require('pg');

    // Conecta no banco padrão "postgres" para poder criar o banco novo
    const admin = new Client({
      host: dbHost,
      port: Number(dbPort),
      user: dbUser,
      password: dbPassword,
      database: 'postgres',
    });
    await admin.connect();
    const { rowCount } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [
      dbName,
    ]);
    if (rowCount === 0) {
      await admin.query(`CREATE DATABASE "${dbName}"`);
    }
    await admin.end();
    console.log(`Banco "${dbName}" verificado/criado.`);

    const conn = new Client({
      host: dbHost,
      port: Number(dbPort),
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });
    await conn.connect();
    const sql = fs.readFileSync(path.join(ROOT_DIR, 'database', 'postgres.sql'), 'utf8');
    await conn.query(sql);
    await conn.end();
    console.log('Tabelas criadas (usuarios, admins).');
  }
}

async function cadastrarAdmin({ dbClient, dbHost, dbPort, dbUser, dbPassword, dbName, nome, email, senha }) {
  const senhaHash = await bcrypt.hash(senha, 10);

  if (dbClient === 'mysql') {
    const mysql = require('mysql2/promise');
    const conn = await mysql.createConnection({
      host: dbHost,
      port: Number(dbPort),
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });
    await conn.query('INSERT INTO admins (nome, email, senha) VALUES (?, ?, ?)', [
      nome,
      email,
      senhaHash,
    ]);
    await conn.end();
  } else {
    const { Client } = require('pg');
    const conn = new Client({
      host: dbHost,
      port: Number(dbPort),
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });
    await conn.connect();
    await conn.query('INSERT INTO admins (nome, email, senha) VALUES ($1, $2, $3)', [
      nome,
      email,
      senhaHash,
    ]);
    await conn.end();
  }

  console.log(`Admin "${email}" cadastrado com sucesso.`);
}

main().catch((err) => {
  console.error('\nErro durante o setup:', err.message);
  rl.close();
  process.exit(1);
});
