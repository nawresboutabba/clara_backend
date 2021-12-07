import { AreaI } from "../models/organization.area";
import Area from '../models/organization.area'
import { AreaBody } from "../controller/area/area";
import { CompanyI } from "../models/organizacion.companies";
import { nanoid } from "nanoid";

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
    }
}

export default AreaService