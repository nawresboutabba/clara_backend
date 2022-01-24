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
//global.repositoryError = require('./handle-error/error.repository')
//app.use(cors());
//app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
import solutionsRouter from './routes/solutions'
import userRouter from './routes/users'
import challengeRouter from './routes/challenge';
import companyRouter from './routes/company';
import areaRouter from './routes/area';
import hubRouter from './routes/hub';
import groupValidatorRouter from './routes/group-validator';
import integrantRouter from './routes/integrant';
import teamRouter from './routes/team'
import invitationRouter from './routes/invitation'

//import session from './middlewares/session'

import { logError } from './handle-error/middleware.log-error';
import { clientErrorHandler } from './handle-error/middleware.client-error-handler';
import { errorHandler } from './handle-error/middleware.error-handler';

import swaggerUi = require('swagger-ui-express');

const PORT = 3000
const DB_CONNECTION = 'localhost:27017'
const DB_NAME = 'PINC-SE'

mongoose.connect(`mongodb+srv://dev-enviroment:0Q5ryUinCQ0pOeiT@pinc-se.ni0pt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
})
    .then(db => console.log(`DB is conected to, server: ${db.connection.host}, puerto: ${db.connection.port}, db: ${db.connection.name}`))
    .catch(err => console.log(err))


app.listen(PORT, () =>
    console.log(
        `¡Aplicación de ejemplo escuchando en el puerto ${PORT}`
    )
);
//app.use(session)
app.use('/', solutionsRouter);
app.use('/',userRouter);
app.use('/', challengeRouter);
app.use('/', companyRouter);
app.use('/', areaRouter);
app.use('/', hubRouter);
app.use('/', groupValidatorRouter);
app.use('/', integrantRouter);
app.use('/', teamRouter);
app.use('/', invitationRouter);
app.use(logError)
app.use(clientErrorHandler)
app.use(errorHandler)
/* if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production') {
    app.use();
}

 */
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));