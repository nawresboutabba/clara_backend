import { Post , Controller, Route, Body, Delete , Path, Get} from 'tsoa'
import { UserI } from '../../models/users'
import { deleteUser, login, signUp } from '../../repository/repository.users'

/**
 * User interface used when a user is added to Request after 
 * authentication successfully
 */
export interface UserRequest{
  email: string;
  userId: string;
  firstName: string;
  lastName:string;
}

/**
 * User interface used just for create a user
 */
export interface UserBody {
  username : string,
  password: string,
  email: string,
  first_name: string,
  last_name: string
}

export interface Login {
  email: string,
  password: string
}
@Route("user")
export default class UserController extends Controller {
  @Post("signup")
  public async signUp(@Body() body: UserBody): Promise<UserI> {
    return signUp(body)
  }
  @Post("login")
  public async login(@Body() body: Login ): Promise<string>{
    return login(body)
  }
  @Delete(":userId")
  public async delete(@Path('userId') userId: string): Promise<boolean>{
    return deleteUser(userId)

  }
/*   @Get('/user/:userId/company/:companyId')
  public async checkUserInCompany(@Path('userId') userId: string, @Path('companyId') companyId: string): Promise <boolean> {
    return checkUserInCompany(userId, companyId)
  } */
  /**
   * Endpoint that use a Committe for adding an user to company workspace
   * @param userId User that will be added to company workspace
   * @param companyId company additionated to user workspace
   * @returns UserI
   */
/*   @Post('/user/:userId/company/:companyId')
  public async addUserInCompany(@Path('userId') userId: string, @Path('companyId') companyId: string ): Promise<UserI>{
    return addUserInCompany(userId, companyId)
  } */
  /**
   * Endpoint that use a Committe for deleting an user to company workspace
   * @param userId User that will be deleted from company workspace
   * @param companyId 
   * @returns 
   */
/*   @Delete('/user/:userId/company/:companyId')
  public async deleteCompanyInUser( @Path('userId') userId: string,@Path('companyId') companyId: string ): Promise<UserI>{
    return deleteCompanyInUser(userId, companyId)
  } */
}