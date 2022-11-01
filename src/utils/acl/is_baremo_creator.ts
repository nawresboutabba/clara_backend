import { ERRORS, HTTP_RESPONSE } from "../../constants";
import RoutingError from "../../handle-error/error.routing";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import { BaremaI } from "../../models/baremo";
import BaremoService from "../../services/Baremo.service";

export async function IS_BAREMO_CREATOR(req: RequestMiddleware): Promise<void> {
  try {
    const baremo: BaremaI = await BaremoService.getBaremoById(
      req.params.baremoId
    );
    if (baremo) {
      if (baremo.user.userId == req.user.userId) {
        req.utils = { ...req.utils, baremo };
        return Promise.resolve();
      }
    }
    throw new RoutingError(ERRORS.ROUTING.GET_BAREMO, HTTP_RESPONSE._404);
  } catch (error) {
    return Promise.reject(error);
  }
}
