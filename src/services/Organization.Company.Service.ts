import Company ,{ CompanyI } from "../models/organizacion.companies";

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
	}
}

export default CompanyService