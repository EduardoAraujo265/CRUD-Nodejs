const mysql = require('mysql2');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração da conexão com o banco de dados
// As variáveis de ambiente devem ser definidas no arquivo .env
const host = process.env.host;
const user = process.env.user;
const password = process.env.password;
const database = process.env.database;
module.exports = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});
