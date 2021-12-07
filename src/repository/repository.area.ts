import { AreaBody } from "../controller/area/area";
import { AreaI } from "../models/organization.area";
import AreaService from "../services/Area.service";
import CompanyService from "../services/Organization.Company.Service";

export const newArea = async (body:AreaBody): Promise<AreaI>=> {
    return new Promise(async (resolve, reject)=> {
        try{
            const company = await CompanyService.getActiveCompanyById(body.companyId)
            const resp = await AreaService.newArea(body, company)
            return resolve(resp)
        }catch(error){
            return reject(error)
        }
    })
}