import * as express from "express";
import * as controller from "./barema.controller";
import authentication from "../../middlewares/authentication";

export const baremaRouter = express.Router();

baremaRouter.use(authentication)

baremaRouter.post("barema", controller.createBarema)
