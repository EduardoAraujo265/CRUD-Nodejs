const express = require('express');

const app = express();

const connection = require('./database/connection');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();
const db = process.env.db;

module.exports = app.post("/auth", async (req, res) => {
    try {
        console.log(req.body);
        const { email, senha } = req.body;
        console.log(email, senha);

        if (db === "postgres") { 
            const sql = 'SELECT * FROM admins WHERE email = $1';
            const result = await connection.query(sql, [email]);
            user = result.rows[0];
                    if (user === undefined) {
            return res.status(401).json({ message: 'Login ou senha incorretos' });
        }
        
        if (user !== senha) {
            return res.status(401).json({ message: 'Login ou senha incorretos' });
        }
            
        } else if (db === "mysql") {
            const [rows] = await connection.promise().query('SELECT * FROM admins WHERE email = ?', [email]);
            let user = rows[0].senha; 
            console.log(user);
        if (user === undefined) {
            return res.status(401).json({ message: 'Login ou senha incorretos' });
        }
        
        if (user !== senha) {
            return res.status(401).json({ message: 'Login ou senha incorretos' });
        }


        }
       
       


        // Aqui você pode gerar um token JWT ou iniciar uma sessão, dependendo da sua implementação de autenticação
        res.status(200).json({ message: 'Login bem-sucedido' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});