import { AreaI } from "../models/organization.area";
import Area from '../models/organization.area'
import { AreaBody } from "../controller/area/area";
import { CompanyI } from "../models/organizacion.companies";
import { nanoid } from "nanoid";
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";

const AreaService = {
    async newArea (data: AreaBody, company: CompanyI):Promise<AreaI>{
        return new Promise(async (resolve, reject)=> {
            try{
                let area : AreaI
                area = Object.assign(data,{company}, {areaId: nanoid()})
                const resp = await Area.create(area)
                return resolve(resp)
            }catch(error){
                return reject(error)
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
    }
}

export default AreaService