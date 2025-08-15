const express = require('express');

const app = express();

const connection = require('./database/connection');

const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();
const db = process.env.db;

module.exports = app.delete("/usuarios/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    
    
    if (db === "postgres") {
      const sql = 'DELETE FROM usuarios WHERE id = $1';
      const result = await connection.query(sql, [userId]);
    } else if (db === "mysql") {
      const sql = 'DELETE FROM usuarios WHERE id = ?';
      const result = await connection.promise().query(sql, userId);
    }
    

  } catch (err) {}
  });