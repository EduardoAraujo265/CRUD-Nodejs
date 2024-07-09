const express = require('express');

const app = express();

const connection = require('./database/connection');




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