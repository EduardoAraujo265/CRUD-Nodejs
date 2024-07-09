const express = require('express');

const app = express();

const connection = require('./database/connection');

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

