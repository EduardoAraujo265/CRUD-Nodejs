const express = require('express');

const app = express();

const connection = require('./database/connection');


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
