'use strict';
import 'module-alias/register'
const express = require ('express')
const app = require('express')();
const mongoose = require('mongoose');
const morgan = require("morgan");
require('dotenv').config();
const swaggerDocument =require( '../swagger.json')
//const cookieParser = require('cookie-parser');
//const cors = require('cors');

//app.use(cors());
//app.use(cookieParser());

app.use(express.json());

//app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
import solutionsRouter from './routes/solutions'
import userRouter from './routes/users'
import challengeRouter from './routes/challenge';
const httpMiddlewareRouter = require('./routes/http-middlewares')

const logError = require('./handle-error/log-error')
const clientErrorHandler = require('./handle-error/client-error-handler')
const errorHandler = require('./handle-error/error-handler')

import swaggerUi = require('swagger-ui-express');

const PORT = 3000
const DB_CONNECTION = 'localhost:27017'
const DB_NAME = 'PINC-SE'
// `mongodb://${DB_CONNECTION}/${DB_NAME}`
//`mongodb+srv://HECTOR:ntvgydrhouselomAs@pinc-se.ni0pt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(`mongodb+srv://dev-enviroment:mIdDJ9RBelATRjgm@pinc-se.ni0pt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //retryWrites: true,// just for development
    //retryReads: false //just for development
})
    .then(db => console.log('DB is conected to', db.connection.host))
    .catch(err => console.log(err))


app.listen(PORT, () =>
    console.log(
        `¡Aplicación de ejemplo escuchando en el puerto ${PORT}`
    )
);
// @TODO set as constants files
const URL_ROOT = "http://localhost:3000";

app.use('/', solutionsRouter);
app.use('/',userRouter);
app.use('/', challengeRouter);
// @TODO configurar para que se desabilite en entorno de produccion
app.use('/middleware-testing',httpMiddlewareRouter);

app.use(logError)
app.use(clientErrorHandler)
app.use(errorHandler)
/* if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production') {
    app.use();
}

 */
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));