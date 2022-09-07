/* eslint-disable @typescript-eslint/ban-ts-comment */
"use strict";
import "module-alias/register";
import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

import swaggerDocument from "../swagger.json";

import { solutionsRouter, challengeRouter, usersRouter } from "./routes";

import companyRouter from "./routes/company";
import areaRouter from "./routes/area";
import groupValidatorRouter from "./routes/group-validator";
import integrantRouter from "./routes/integrant";
import teamRouter from "./routes/team";
import imageRouter from "./routes/image-service";
import visitRouter from "./routes/visit";
import tagRouter from "./routes/tag";
import emailRouter from "./routes/email";

import { logError } from "./handle-error/middleware.log-error";
import { clientErrorHandler } from "./handle-error/middleware.client-error-handler";
import { errorHandler } from "./handle-error/middleware.error-handler";
import swaggerUi from "swagger-ui-express";
import { parseQueryString } from "./utils/express/query-string";

mongoose
  .connect(
    `mongodb+srv://dev-enviroment:0Q5ryUinCQ0pOeiT@pinc-se.ni0pt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {}
  )
  .then((db) =>
    console.log(
      `DB is conected to, server: ${db.connection.host}, puerto: ${db.connection.port}, db: ${db.connection.name}`
    )
  )
  .catch((err) => console.log(err));

const app = express();

app.set("query parser", parseQueryString);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

app.use(usersRouter);
app.use(solutionsRouter);
app.use(challengeRouter);
app.use("/", companyRouter);
app.use("/", areaRouter);
app.use("/", groupValidatorRouter);
app.use("/", integrantRouter);
app.use("/", teamRouter);
app.use("/", imageRouter);
app.use("/", visitRouter);
app.use("/", tagRouter);
app.use("/", emailRouter);

app.use(logError);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () =>
  console.log(`¡Aplicación de ejemplo escuchando en el puerto ${PORT}`)
);
