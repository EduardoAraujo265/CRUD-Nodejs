const express = require('express');

const app = express();

const connection = require('./database/connection');


module.exports = app.delete("/usuarios/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const sql = 'DELETE FROM usuarios WHERE id = ?';
    const result = await connection.promise().query(sql, userId);

  } catch (err) {}
  });