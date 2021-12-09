import { CompanyI } from "../models/organizacion.companies"
import { CompanyBody } from '../controller/company'
import CompanyService from "../services/Organization.Company.Service"
import { HubI } from "../models/organization.hub"
import { nanoid } from 'nanoid'
import HubService from "../services/Hub.Service"

export const newCompany = async (body: CompanyBody): Promise<CompanyI>=> {
    return new Promise(async (resolve, reject)=> {
        try{
            const hub: HubI[] = []
            let company : CompanyI
            company = Object.assign(body, {hub, active: true}, {companyId: nanoid()})
            const result = await CompanyService.newCompany(company)
            return resolve(result)
        }catch (error){
            return reject(error)
        }
    })
}

export const addToHub = async (companyId: string, hubId:string):Promise<CompanyI> => {
    return new Promise(async (resolve, reject)=> {
        try{
            /**
             * @TODO check resources have to be sanitized before. in routing 
             */
            const company = CompanyService.getActiveCompanyById(companyId)
            if (!company){
                return reject("COMPANY_DOES_NOT_EXIST")
            }
            /**
             * @TODO check resources have to be sanitized before. in routing 
             */
            const hub = await HubService.getHubActiveById(hubId)
            if(!hub){
                return reject("HUB_NOT_FOUND")
            }
            const resp = await CompanyService.addToHub(companyId, hub)
            return resolve(resp)
        }catch(error){
            return reject(error)
        }

    })
}

export const pullToHub = async (companyId: string, hubId: string): Promise<CompanyI> => {
    return new Promise(async (resolve, reject)=> {
        try{
            /**
             * @TODO check resources have to be sanitized before. in routing 
             */
            const company = CompanyService.getActiveCompanyById(companyId)
            if (!company){
                return reject("COMPANY_DOES_NOT_EXIST")
            }
            /**
             * @TODO check resources have to be sanitized before. in routing 
             */
            const hub = await HubService.getHubActiveById(hubId)
            if(!hub){
                return reject("HUB_NOT_FOUND")
            }
            const resp = await CompanyService.pullToHub(companyId, hub)
            return resolve(resp)
        }catch(error){
            return reject(error)
        }
    })
}