import { AreaI } from "../models/organization.area";
import Area from '../models/organization.area'
import { AreaBody } from "../controller/area/area";
import { CompanyI } from "../models/organizacion.companies";
import { nanoid } from "nanoid";
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";

const AreaService = {
    async newArea (data: AreaI):Promise<AreaI>{
        return new Promise(async (resolve, reject)=> {
            try{
                const resp = await Area.create(data)
                return resolve(resp)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.NEW_AREA,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }

        })
    },
    async getAreaById(areaId: string): Promise<AreaI>{
        return new Promise(async (resolve, reject)=> {
            try{
                const area = await Area.findOne({
                    areaId:areaId
                })
                return resolve(area)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.GET_AREA,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)
            }
        })
    },
    async getAreasById(areas: Array<string>): Promise<Array<AreaI>>{
        return new Promise(async (resolve, reject)=> {
            try{
                const areasEntity = await Area.find({
                    areaId : {
                        $in: areas
                    }
                })
                return resolve(areasEntity)
            }catch(error){
                const customError = new ServiceError(
                    ERRORS.SERVICE.GET_AREA,
                    HTTP_RESPONSE._500,
                    error
                )
                return reject(customError)                
            }
        })
    },
    async getAllAreas(): Promise<Array<AreaI>>{
      return new Promise(async (resolve, reject)=> {
          try{
            const areas = await Area.find({})
            return resolve(areas)
          }catch(error){
              return reject(new ServiceError(
                  ERRORS.SERVICE.GET_ALL_AREAS,
                  HTTP_RESPONSE._500,
                  error
              ))
          }

      })
    }
}

export default AreaService