import { Controller, Body, Post, Route, Path, Delete } from "tsoa";
import { CompanyI } from "../../models/organizacion.companies";
import { newCompany } from "../../repository/repository.company";

export interface CompanyBody {
    name: string,
    CNPJ: string,
    hub?: any
}

@Route('company')
export default class CompanyController extends Controller {
    @Post()
	public async newCompany(@Body() body:CompanyBody):Promise<CompanyI>{
		return newCompany(body)
	}
}