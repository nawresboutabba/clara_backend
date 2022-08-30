import Company, { CompanyI } from "../models/organizacion.companies";

const CompanyService = {
  async newCompany(data: CompanyI): Promise<any> {
    const result = await Company.create(data);
    return result;
  },
  async getActiveCompanyById(companyId: string): Promise<CompanyI> {
    const resp = await Company.findOne({
      companyId: companyId,
      active: true,
    });
    return resp.toObject();
  },
};

export default CompanyService;
