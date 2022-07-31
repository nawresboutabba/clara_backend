import { NextFunction } from "express";
import {
  RequestMiddleware,
  ResponseMiddleware,
} from "../../middlewares/middlewares.interface";
import AreaController from "../../controller/area/area";
import { body, check, validationResult } from "express-validator";
import { ERRORS, RULES, VALIDATIONS_MESSAGE_ERROR } from "../../constants";
import AreaService from "../../services/Area.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";
import authentication from "../../middlewares/authentication";
import { acl } from "../../middlewares/acl";

import { Router } from "express";

const router = Router();

/**
 * Workspace or area are used as synonyms
 * in this system. It is the logical space shared
 * by users and situations for a common theme. The area can follow the same
 * criteria that the company follows to divide
 * its space or it can be another.
 */
router.post(
  "/area",
  [
    authentication,
    acl(RULES.IS_LEADER),
    body("name", VALIDATIONS_MESSAGE_ERROR.AREA.NAME_EMPTY).notEmpty(),
    check("name", "area's name exist").custom(
      (value, { req }): Promise<void> => {
        return new Promise((resolve, reject) => {
          /// ////////////////////////////
          AreaService.getAllAreas()
            .then((areas) => {
              areas.forEach((area) => {
                if (area.name == value) {
                  return reject();
                }
              });
              return resolve();
            })
            .catch((error) => {
              return reject(error);
            });
          /// ////////////////////////////

          /*             const areas = await AreaService.getAllAreas()
            console.log(areas)
            areas.forEach((area)=>{
                if (area.name == value){
                    return reject()
                }
            })
            return resolve() */
        });
      }
    ),
  ],
  async (
    req: RequestMiddleware,
    res: ResponseMiddleware,
    next: NextFunction
  ) => {
    try {
      await throwSanitizatorErrors(
        validationResult,
        req,
        ERRORS.ROUTING.NEW_AREA
      );

      const areaController = new AreaController();

      const resp = await areaController.newArea(req.body);
      res.json(resp).status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/area/:areaId",
  [
    authentication,
    check("areaId", "area does not exist").custom(
      (value, { req }): Promise<void> => {
        return new Promise(async (resolve, reject) => {
          const area = await AreaService.getAreaById(value);
          if (!area) {
            return reject();
          }
          return resolve();
        });
      }
    ),
  ],
  async (
    req: RequestMiddleware,
    res: ResponseMiddleware,
    next: NextFunction
  ) => {
    try {
      await throwSanitizatorErrors(
        validationResult,
        req,
        ERRORS.ROUTING.GET_AREA
      );
      const areaController = new AreaController();
      const areas = await areaController.getArea(req.params.areaId);
      res.json(areas).status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/area",
  [authentication],
  async (
    req: RequestMiddleware,
    res: ResponseMiddleware,
    next: NextFunction
  ) => {
    try {
      const areaController = new AreaController();
      const areas = await areaController.getAllAreas();
      res.json(areas).status(200).send();
    } catch (error) {
      next(error);
    }
  }
);
const areaRouter = router;

export default areaRouter;
