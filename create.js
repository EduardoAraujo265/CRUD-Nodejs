const express = require('express');

const app = express();

const connection = require('./database/connection');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();
const db = process.env.db;

if (db === "postgres") {
    module.exports = app.post("/", async (req, res) => {
        try {
            const { nome, email, telefone, senha } = req.body;
            const query = 'INSERT INTO usuarios (nome, email, telefone, senha) VALUES ($1, $2, $3, $4)';
            // Usando query parametrizada para evitar SQL Injection
            const values = [nome, email, telefone, senha];
            // Executando a query com os valores

            const resultado = await connection.query(query, values);
            res.status(202).json({
                message: "User Created",
            });
                }  catch (err) {
            res.status(500).json({
                message: err,
            });
        }
    });
    
   } else if (db === "mysql") {
        
        module.exports = app.post("/", async (req, res) => {
    try {
        const { nome, email, telefone, senha } = req.body;

        await new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO usuarios (`nome`, `email`, `telefone`, `senha`) VALUES (?, ?, ?, ?)",
                [nome, email, telefone, senha],
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                }
            );
        });
        res.status(202).json({
            message: "User Created",
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
});
}