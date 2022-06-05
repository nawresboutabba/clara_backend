import * as express from "express";
import { ERRORS, RULES, TAG_ORIGIN, URLS } from "../../constants";
import { NextFunction } from "express"
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import authentication from "../../middlewares/authentication";
import { acl } from "../../middlewares/acl";
import TagController from "../../controller/tag";
import { body, validationResult } from "express-validator";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import TagService from "../../services/Tag.service";
const router = express.Router();

router.get([
  URLS.TAG.COMMENT,
  URLS.TAG.CHALLENGE,
  URLS.TAG.IDEA
], [
  authentication,
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
  try{
    const tagController = new TagController ()
    const tags = await tagController.getTags(req.query, req.url)
    res
      .json(tags)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
})

router.post([
  URLS.TAG.COMMENT,
  URLS.TAG.CHALLENGE,
  URLS.TAG.IDEA
],[
  authentication,
  acl(RULES.CAN_INSERT_TAG),
  body('name', 'name can not be empty').notEmpty(),
  body('name', 'name already exist').custom(async (value, {req})=> {
    try{
      /**
       * According to definition, could exist tags with same name but different type.
       * See: https://www.notion.so/TAGS-Fix-Tag-comments-according-to-10-th-meeting-dc0ee99aa6f9478daedcc35c0664a34d
       */
      const query = {
        name: value,
        type: req.body.type
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
    const tag = await tagController.newTag(req.body, req.user)
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