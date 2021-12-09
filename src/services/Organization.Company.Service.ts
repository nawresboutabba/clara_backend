import Company ,{ CompanyI } from "../models/organizacion.companies";
import { HubI } from "../models/organization.hub";

const CompanyService = {
    async newCompany (data: CompanyI): Promise<any> {
        return new Promise ( async (resolve, reject)=> {
            try{
                const result = await Company.create(data)
                return resolve(result)
            } catch(error){
                return reject(error)
            }
        })
    },
    async getActiveCompanyById(companyId:string):Promise<CompanyI> {
        return new Promise (async (resolve, reject)=> {
            try{
            const resp = await Company.findOne({
                    companyId: companyId,
                    active: true
                })
                return resolve(resp)
            }catch(error){
                return reject(error)
            }

        })
    },
    async addToHub(companyId: string, hub: HubI): Promise<CompanyI>{
        return new Promise(async (resolve , reject)=> {
            try{
                const company = await Company.findOneAndUpdate({companyId:companyId},{$addToSet:{hub:hub}}, {new:true})
                return resolve(company)
            }catch(error){
                return reject(error)
            }

        })
    },
    async pullToHub(companyId: string, hub: HubI): Promise<CompanyI>{
        return new Promise (async (resolve, reject)=> {
            try{
                const company = await Company.findOneAndUpdate(
                    {companyId:companyId},
                    {$pull:{hub:hub._id}}, 
                    {new:true})
                return resolve(company)
            }catch(error){
                return reject(error)
            }
        })
    }
}

export default CompanyService