const express = require('express');

const app = express();

const connection = require('./database/connection');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();
const db = process.env.db;
const query = "select * from usuarios;";
// Usando query parametrizada para evitar SQL Injection

//console.log(connection.query(query)); // Testa a conexão com o banco de dados
if (db === "postgres") {
  connection.connect();
    module.exports = app.get("/", async(req, res) => {
        try {
            const data = await connection.query(
              query
            );
            res.status(202).json(data.rows);
          } catch (err) {
            console.log(err);
            res.status(500).json({
              message: err, 
            });
          }
        })
      
      } else if (db === "mysql") {
        module.exports = app.get("/", async(req, res) => {
          try {
          const [data] = await connection.promise().query(
            `SELECT *  from usuarios;`
          );
        res.status(202).json(data);
      } catch (err) {
        res.status(500).json({
          message: err,
        });
      }
});
        }