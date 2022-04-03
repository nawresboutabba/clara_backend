import { NextFunction } from "express";
import ImageController from "../../controller/image";
import authentication from "../../middlewares/authentication";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";

const router = require("express").Router();

router.get('/image/image-post-signed-url/:imageName', [
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const imageController = new ImageController()
    const urlSigned = await imageController.getImageSignedUrlForPost(req.params.imageName)

    res
      .json(urlSigned)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

router.get('/image/image-signed-url/:imageName', [
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try {
    const imageController = new ImageController()
    const urlSigned = await imageController.getImageSignedUrl(req.params.imageName)
    res
      .json(urlSigned)
      .status(200)
      .send()
  } catch (error) {
    next(error)
  }
})

const imageRouter = router

export default imageRouter