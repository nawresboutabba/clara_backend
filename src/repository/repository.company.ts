import { CompanyI } from "../models/organizacion.companies"
import { CompanyBody } from '../controller/company'
import CompanyService from "../services/Organization.Company.Service"
import { HubI } from "../models/organization.hub"
import { nanoid } from 'nanoid'

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