import { Controller, Route, Get, Inject, Query } from "tsoa";
import { UserI } from "../../routes/users/users.model";
import { getLatest } from "../../repository/repository.visit";

export interface VisitResponse {
  visit_date: Date;
  type: string;
  resource: {
    title: string;
    description: string;
    url: string;
  };
}

@Route("visit")
export default class VisitController extends Controller {
  /**
   * Endpoint for get  latest ideas and challenges looking for.
   */
  @Get("latest")
  public async getLatest(
    @Query() query: any,
    @Inject() user: UserI
  ): Promise<any> {
    return getLatest(query, user);
  }
}
