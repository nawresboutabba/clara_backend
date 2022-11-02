import { AreaI } from "../routes/area/area.model";
import Area from "../routes/area/area.model";
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";

const AreaService = {
  async newArea(data: AreaI): Promise<AreaI> {
    try {
      const resp = await Area.create(data);
      return resp;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.NEW_AREA,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getAreaById(areaId: string): Promise<AreaI> {
    try {
      const area = await Area.findOne({
        areaId: areaId,
      });
      return area;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_AREA,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getAreasById(areas: Array<string>): Promise<Array<AreaI>> {
    try {
      const areasEntity = await Area.find({
        areaId: {
          $in: areas,
        },
      });
      return areasEntity;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_AREA,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getAllAreas(): Promise<Array<AreaI>> {
    try {
      const areas = await Area.find({});
      return areas;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_ALL_AREAS,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
};

export default AreaService;
