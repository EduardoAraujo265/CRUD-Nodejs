const mysql = require('mysql2');
const dotenv = require('dotenv');
const pg = require('pg');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração da conexão com o banco de dados
// As variáveis de ambiente devem ser definidas no arquivo .env
const db = process.env.db;
const host = process.env.host;
const user = process.env.user;
const password = process.env.password;
const database = process.env.database;
const client = new pg.Client({
        user: user,
        host: host,
        password: password
    });
if (db === "postgres") { 
module.exports = client;


}else if (db === "mysql") {


    module.exports = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
});
} else {
    throw new Error("Database type not supported. Please set 'db' to either 'postgres' or 'mysql' in your .env file.");
}