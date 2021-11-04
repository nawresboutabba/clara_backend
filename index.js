'use strict';

require('module-alias/register');
const express = require ('express')
const app = require('express')();
const mongoose = require('mongoose');
const authentication = require('@middlewares/authentication');
//const cookieParser = require('cookie-parser');
//const cors = require('cors');

//app.use(cors());
//app.use(cookieParser());

app.use(express.json());

//app.use(express.urlencoded({ extended: true }));


const solutionsRouter = require('./src/routes/solutions')

const PORT = 3000
const DB_CONNECTION = 'localhost:27017'
const DB_NAME = 'PINC-SE'

mongoose.connect(`mongodb://${DB_CONNECTION}/${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('DB is conected to', db.connection.host))
    .catch(err => console(err))


app.listen(PORT, () =>
    console.log(
        `¡Aplicación de ejemplo escuchando en el puerto ${PORT}`
    )
);
app.use(authentication);
app.use('/', solutionsRouter);


