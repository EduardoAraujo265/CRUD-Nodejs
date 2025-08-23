// importando as bibliotecas
const express = require ('express');

const app = express()

const path = require('path');

//importando a operação CRUD
const create = require('./create')

const read = require('./read');

const update = require('./update')

const deleteapi = require ('./delete')

app.use(express.json());

app.use('/usuarios',create);

app.use('/usuarios',read);

app.use('/', deleteapi);

app.use('/', update);

// servindo arquivos estáticos (CSS, JS, imagens, etc.)
app.use(express.static(__dirname ));

// rota para servir o arquivo head.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'head.html'));
});



app.listen(5000,()=>{
console.log("Server listening in http://localhost:5000")
});

