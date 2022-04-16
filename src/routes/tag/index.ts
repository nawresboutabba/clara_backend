import * as express from "express";
import { ERRORS, RULES, URLS } from "../../constants";
import { NextFunction } from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import authentication from "../../middlewares/authentication";
import { acl } from "../../middlewares/acl";
import TagController from "../../controller/tag";
import { body, validationResult } from "express-validator";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import TagService from "../../services/Tag.service";
const router = express.Router();

router.get(URLS.TAG, [
  authentication,
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try{
    const tagController = new TagController ()
    const tags = await tagController.getTags(req.query)
    res
      .json(tags)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
})

router.post(URLS.TAG, [
  authentication,
  acl(RULES.IS_COMMITTE_MEMBER),
  body('name', 'name can not be empty').notEmpty(),
  body('name', 'name already exist').custom(async (value)=> {
    try{
      const query = {
        name: value
      }
      const tag = await TagService.getTagsByQuery(query)
      if (tag.length > 0){
        return Promise.reject()
      }
      return Promise.resolve()
    }catch(error){
      return Promise.reject(error)
    }
  }),
  body('description', 'description can not be empty').notEmpty()
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try{
    await throwSanitizatorErrors(validationResult, req, ERRORS.ROUTING.ADD_TAG)

    const tagController = new TagController ()
    const tag = await tagController.newTag(req.body)
    res
      .json(tag)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
})

const tagRouter = router
export default tagRouter;