import { Controller, Body, Post } from "tsoa";
import { CompanyI } from "../../models/organizacion.companies";
import { HubI } from "../../models/organization.hub";
import { newCompany } from "../../repository/repository.company";

export interface CompanyBody {
    name: string,
    CNPJ: string,
    hub?: HubI[]
}

export default class CompanyController extends Controller {
    @Post()
    public async newCompany(@Body() body:CompanyBody):Promise<CompanyI>{
        return newCompany(body)
    }
}