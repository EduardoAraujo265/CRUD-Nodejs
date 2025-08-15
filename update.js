const express = require('express');

const app = express();

const connection = require('./database/connection');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();
const db = process.env.db;

if (db === "postgres") {
module.exports = app.patch("/usuarios/:id", async (req, res) => {
    try{
        
        const { nome, email, senha, telefone, id } = req.body;
        const query = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3, telefone = $4 WHERE id = $5';
        const values = [nome, email, senha, telefone, id];
        await connection.query(query, values);
        res.status(200).json({
            message: "updated",
        });
} catch(err){
   
};
});
    

} else if (db === "mysql") {
module.exports = app.patch("/usuarios/:id", async (req, res) => {
    try {

        const { nome, email, senha, telefone, id} = req.body;
        await connection
            .promise()
            .query(
                "UPDATE usuarios SET nome = ?, email = ?, senha = ?, telefone = ? WHERE id = ?",
                [nome, email, senha, telefone, id]
            );
        res.status(200).json({
            message: "updated",
        });
    } catch (err) {
    }
});

}